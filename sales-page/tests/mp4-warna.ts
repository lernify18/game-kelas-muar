// Reads an MP4's H.264 colour signalling without ffprobe, in ffprobe's own terms: pix_fmt and colour range from the
// SPS VUI (what decoders use) and the colr/nclx box (what players such as AVFoundation use), so a smoke test can
// assert the class video stays yuv420p / tv / bt709 and never slides back to iPhone-style yuvj420p full range.

export type Colour = { colorRange: 'tv' | 'pc'; colorSpace: string; colorPrimaries: string; colorTransfer: string };
export type VideoColour = { codec: string; width: number; height: number; pixFmt: string; sps: Colour; colr: Colour | null };

const PRIMARIES: Record<number, string> = { 1: 'bt709', 2: 'unknown', 5: 'bt470bg', 6: 'smpte170m', 9: 'bt2020', 11: 'smpte431', 12: 'smpte432' };
const TRANSFER: Record<number, string> = { 1: 'bt709', 2: 'unknown', 6: 'smpte170m', 13: 'iec61966-2-1', 16: 'smpte2084', 18: 'arib-std-b67' };
const MATRIX: Record<number, string> = { 0: 'gbr', 1: 'bt709', 2: 'unknown', 5: 'bt470bg', 6: 'smpte170m', 9: 'bt2020nc' };
const name = (table: Record<number, string>, code: number) => table[code] ?? `code ${code}`;
const colour = (full: boolean, primaries: number, transfer: number, matrix: number): Colour => ({
  colorRange: full ? 'pc' : 'tv',
  colorSpace: name(MATRIX, matrix),
  colorPrimaries: name(PRIMARIES, primaries),
  colorTransfer: name(TRANSFER, transfer),
});

type Box = { type: string; start: number; end: number };

function boxes(b: Uint8Array, start: number, end: number): Box[] {
  const v = new DataView(b.buffer, b.byteOffset, b.byteLength);
  const out: Box[] = [];
  for (let p = start; p + 8 <= end; ) {
    let size = v.getUint32(p);
    let hdr = 8;
    if (size === 1) { size = Number(v.getBigUint64(p + 8)); hdr = 16; } else if (size === 0) size = end - p;
    const type = String.fromCharCode(b[p + 4], b[p + 5], b[p + 6], b[p + 7]);
    if (size < hdr || p + size > end) throw new Error(`MP4: box ${type} at ${p} overruns its parent`);
    out.push({ type, start: p + hdr, end: p + size });
    p += size;
  }
  return out;
}

function child(b: Uint8Array, parent: Box, type: string): Box {
  const found = boxes(b, parent.start, parent.end).find((x) => x.type === type);
  if (!found) throw new Error(`MP4: no ${type} inside ${parent.type}`);
  return found;
}

class Bits {
  private pos = 0;
  private readonly b: Uint8Array;
  constructor(b: Uint8Array) { this.b = b; }
  u(n: number): number {
    let v = 0;
    for (let i = 0; i < n; i++, this.pos++) {
      if (this.pos >> 3 >= this.b.length) throw new Error('SPS: ran out of bits');
      v = v * 2 + ((this.b[this.pos >> 3] >> (7 - (this.pos & 7))) & 1);
    }
    return v;
  }
  ue(): number {
    let zeros = 0;
    while (this.u(1) === 0) if (++zeros > 31) throw new Error('SPS: bad exp-Golomb code');
    return 2 ** zeros - 1 + this.u(zeros);
  }
  se(): number {
    const k = this.ue();
    return k % 2 ? (k + 1) / 2 : -(k / 2);
  }
}

// NAL payload → RBSP: drop the 0x03 emulation-prevention byte after every 0x00 0x00.
function rbsp(nal: Uint8Array): Uint8Array {
  const out: number[] = [];
  for (let i = 1, zeros = 0; i < nal.length; i++) {
    if (zeros >= 2 && nal[i] === 3) { zeros = 0; continue; }
    zeros = nal[i] === 0 ? zeros + 1 : 0;
    out.push(nal[i]);
  }
  return Uint8Array.from(out);
}

const HIGH_PROFILES = new Set([100, 110, 122, 244, 44, 83, 86, 118, 128, 138, 139, 134, 135]);

function parseSps(nal: Uint8Array) {
  const r = new Bits(rbsp(nal));
  const profile = r.u(8);
  r.u(16); // constraint flags + level_idc
  r.ue(); // seq_parameter_set_id
  let chroma = 1, depthLuma = 8, depthChroma = 8;
  if (HIGH_PROFILES.has(profile)) {
    chroma = r.ue();
    if (chroma === 3) r.u(1);
    depthLuma = r.ue() + 8;
    depthChroma = r.ue() + 8;
    r.u(1); // qpprime_y_zero_transform_bypass_flag
    if (r.u(1)) {
      for (let i = 0; i < (chroma === 3 ? 12 : 8); i++) {
        if (!r.u(1)) continue;
        for (let j = 0, last = 8, next = 8; j < (i < 6 ? 16 : 64); j++) {
          if (next !== 0) next = (last + r.se() + 256) % 256;
          if (next !== 0) last = next;
        }
      }
    }
  }
  r.ue(); // log2_max_frame_num_minus4
  const pocType = r.ue();
  if (pocType === 0) r.ue();
  else if (pocType === 1) {
    r.u(1); r.se(); r.se();
    for (let i = r.ue(); i > 0; i--) r.se();
  }
  r.ue(); r.u(1); // max_num_ref_frames, gaps_in_frame_num_value_allowed_flag
  r.ue(); r.ue(); // pic_width_in_mbs_minus1, pic_height_in_map_units_minus1
  if (!r.u(1)) r.u(1); // frame_mbs_only_flag, mb_adaptive_frame_field_flag
  r.u(1); // direct_8x8_inference_flag
  if (r.u(1)) { r.ue(); r.ue(); r.ue(); r.ue(); } // frame cropping
  let full = false, primaries = 2, transfer = 2, matrix = 2;
  if (r.u(1)) {
    if (r.u(1) && r.u(8) === 255) r.u(32); // aspect_ratio_info, Extended_SAR
    if (r.u(1)) r.u(1); // overscan
    if (r.u(1)) {
      r.u(3); // video_format
      full = r.u(1) === 1;
      if (r.u(1)) { primaries = r.u(8); transfer = r.u(8); matrix = r.u(8); }
    }
  }
  return { chroma, depthLuma, depthChroma, colour: colour(full, primaries, transfer, matrix) };
}

export function mp4VideoColour(file: Uint8Array): VideoColour {
  const top: Box = { type: 'file', start: 0, end: file.length };
  const moov = child(file, top, 'moov');
  const handler = (trak: Box) => {
    const hdlr = child(file, child(file, trak, 'mdia'), 'hdlr');
    return String.fromCharCode(...file.subarray(hdlr.start + 8, hdlr.start + 12));
  };
  const trak = boxes(file, moov.start, moov.end).find((x) => x.type === 'trak' && handler(x) === 'vide');
  if (!trak) throw new Error('MP4: no video track');
  const stsd = child(file, child(file, child(file, child(file, trak, 'mdia'), 'minf'), 'stbl'), 'stsd');
  const [entry] = boxes(file, stsd.start + 8, stsd.end);
  if (!entry || !/^avc[13]$/.test(entry.type)) throw new Error(`MP4: video codec ${entry?.type} is not H.264`);
  const v = new DataView(file.buffer, file.byteOffset, file.byteLength);
  const inner: Box = { type: entry.type, start: entry.start + 78, end: entry.end };

  const avcC = child(file, inner, 'avcC');
  if ((file[avcC.start + 5] & 0x1f) < 1) throw new Error('avcC: no SPS');
  const spsLen = v.getUint16(avcC.start + 6);
  const sps = parseSps(file.subarray(avcC.start + 8, avcC.start + 8 + spsLen));

  const colrBox = boxes(file, inner.start, inner.end).find((x) => x.type === 'colr');
  let colr: Colour | null = null;
  if (colrBox && String.fromCharCode(...file.subarray(colrBox.start, colrBox.start + 4)) === 'nclx') {
    const p = colrBox.start + 4;
    colr = colour((file[p + 6] & 0x80) !== 0, v.getUint16(p), v.getUint16(p + 2), v.getUint16(p + 4));
  }

  const plain = sps.chroma === 1 && sps.depthLuma === 8 && sps.depthChroma === 8;
  return {
    codec: entry.type,
    width: v.getUint16(entry.start + 24),
    height: v.getUint16(entry.start + 26),
    pixFmt: plain ? (sps.colour.colorRange === 'pc' ? 'yuvj420p' : 'yuv420p') : `chroma_format_idc ${sps.chroma}, ${sps.depthLuma}-bit`,
    sps: sps.colour,
    colr,
  };
}
