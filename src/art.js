/*
 * Seni SVG 3D Misi Pemulihan 3M: objek soalan baharu, Kiko si Kancil, avatar, 24 sticker, pulau kategori,
 * kotak hadiah, wang kertas dan ikon UI. Objek Kids Baca (art-kb.js) diguna semula; id di sini berawalan `m3`.
 * Teknik 3D: kecerunan 3-henti, sorotan putih kiri-atas, bayang sentuh kabur, satu arah cahaya (kiri-atas).
 * Semua <defs> dipasang SEKALI melalui ART.sprite(); badan hanya merujuk url(#id).
 */
(function (root) {
  // art-kb.js mengisytiharkan const di skop skrip global (bukan sifat window), jadi semak dengan typeof.
  const KB = typeof KB_OBJ !== 'undefined' ? { KB_DEFS, KB_OBJ, KB_ICON } : require('./art-kb.js');

  const TONES = {
    yel: ['#FFF4B8', '#FFD24A', '#E09A12'], org: ['#FFD9A8', '#FF9F43', '#D0600E'], red: ['#FFB0A8', '#F25C54', '#B0262A'],
    pnk: ['#FFD6E0', '#FF8FA3', '#D4506C'], pur: ['#E6DCFF', '#A78BFA', '#6A48D0'], blu: ['#D6EEFF', '#82CCFF', '#3A86D0'],
    mnt: ['#D2F7E8', '#76DDB5', '#2E9E73'], grn: ['#C6F2A8', '#62C46C', '#2C7D3C'], brn: ['#E8BE92', '#B57B48', '#77461F'],
    tan: ['#FBD9B0', '#E0A266', '#A8642E'], crm: ['#FFFDF6', '#FBEBD0', '#E3C597'], wht: ['#FFFFFF', '#F2EEF8', '#C8C0D8'],
    gry: ['#F0F2F7', '#B9BFCE', '#767E94'], drk: ['#6A6280', '#3E3754', '#1E1A2C'], sky: ['#EAF7FF', '#BFE6FF', '#7DBDF0'],
    gld: ['#FFF6C2', '#FFCF3F', '#C98A06'], sil: ['#FFFFFF', '#D9DEE8', '#8E97AB'], teal: ['#C8F5EF', '#2EC4B6', '#138A7E'],
  };
  const grads = Object.entries(TONES).map(([k, t]) => {
    const st = `<stop offset="0" stop-color="${t[0]}"/><stop offset=".55" stop-color="${t[1]}"/><stop offset="1" stop-color="${t[2]}"/>`;
    return `<linearGradient id="m3L${k}" x1="0" y1="0" x2=".65" y2="1">${st}</linearGradient><radialGradient id="m3R${k}" cx="34%" cy="27%" r="76%">${st}</radialGradient>`;
  }).join('');
  const DEFS = KB.KB_DEFS + grads +
    '<filter id="m3Stk" x="-20%" y="-20%" width="140%" height="140%"><feMorphology in="SourceAlpha" operator="dilate" radius="3.2" result="d"/><feFlood flood-color="#fff"/><feComposite in2="d" operator="in" result="w"/><feGaussianBlur in="d" stdDeviation="2.2" result="b"/><feOffset in="b" dy="2.4" result="o"/><feFlood flood-color="#2a1b45" flood-opacity=".28"/><feComposite in2="o" operator="in" result="s"/><feMerge><feMergeNode in="s"/><feMergeNode in="w"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
    '<filter id="m3Blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>';

  const L = (k) => `url(#m3L${k})`, R = (k) => `url(#m3R${k})`;
  const shadow = (cx, rx, o = 0.24, cy = 58) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="3.4" fill="#1a1226" opacity="${o}" filter="url(#oSd)"/>`;
  const hl = (cx, cy, rx, ry, rot = -30, o = 0.45) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" opacity="${o}" transform="rotate(${rot} ${cx} ${cy})"/>`;
  const eyes = (x1, x2, y, r = 2.4) => `<circle cx="${x1}" cy="${y}" r="${r}" fill="#2A1B3D"/><circle cx="${x2}" cy="${y}" r="${r}" fill="#2A1B3D"/><circle cx="${x1 - r * 0.35}" cy="${y - r * 0.4}" r="${r * 0.38}" fill="#fff"/><circle cx="${x2 - r * 0.35}" cy="${y - r * 0.4}" r="${r * 0.38}" fill="#fff"/>`;
  const smile = (x, y, w = 6, sw = 1.8) => `<path d="M${x - w / 2} ${y} q${w / 2} ${w * 0.6} ${w} 0" fill="none" stroke="#2A1B3D" stroke-width="${sw}" stroke-linecap="round"/>`;

  /* ---------------- objek soalan baharu (viewBox 64) ---------------- */
  const OBJ = {
    buku: shadow(32, 19) +
      `<rect x="15" y="9" width="36" height="46" rx="4" fill="#FFF6E2"/><rect x="18" y="12" width="33" height="43" rx="3" fill="#EADCC0"/>` +
      `<rect x="12" y="7" width="35" height="46" rx="5" fill="${L('blu')}"/><rect x="12" y="7" width="7" height="46" rx="3" fill="#2F6FB0"/>` +
      `<rect x="23" y="15" width="19" height="11" rx="3" fill="#FFF8EC"/><rect x="25.5" y="18.5" width="14" height="1.8" rx=".9" fill="#9AB6D6"/><rect x="25.5" y="22" width="9" height="1.8" rx=".9" fill="#9AB6D6"/>` +
      `<path d="M37 7 h5 v14 l-2.5 -2.4 -2.5 2.4Z" fill="#F25C54"/>` + hl(25, 13, 6, 2.6, -20, 0.4),
    bulan: shadow(32, 15, 0.2) +
      `<path d="M38 6 A26 26 0 1 0 56 44 A21 21 0 1 1 38 6Z" fill="${L('yel')}"/>` +
      `<circle cx="20" cy="38" r="3.4" fill="#E9B020" opacity=".55"/><circle cx="27" cy="48" r="2.2" fill="#E9B020" opacity=".5"/><circle cx="16" cy="26" r="2" fill="#E9B020" opacity=".45"/>` +
      hl(22, 17, 6, 3, -40, 0.5),
    matahari: shadow(32, 15, 0.18) +
      Array.from({ length: 12 }, (_, i) => `<path d="M32 3 l3.4 9 h-6.8Z" fill="${L('org')}" transform="rotate(${i * 30} 32 31)"/>`).join('') +
      `<circle cx="32" cy="31" r="16" fill="${R('yel')}"/>` + hl(26, 24, 6, 3.6, -35, 0.55),
    telur: shadow(32, 15) +
      `<path d="M32 7 C43 7 51 25 51 37 a19 19 0 0 1 -38 0 C13 25 21 7 32 7Z" fill="${R('crm')}"/>` + hl(25, 20, 5, 8, 20, 0.6),
    belon: shadow(32, 9, 0.16) +
      `<path d="M32 40 c-2 6 4 10 0 18" fill="none" stroke="#8A6A9A" stroke-width="1.6" stroke-linecap="round"/>` +
      `<path d="M29.4 40.5 h5.2 l-1.4 3 h-2.4Z" fill="#C2303C"/>` +
      `<ellipse cx="32" cy="22" rx="15" ry="18" fill="${R('red')}"/>` + hl(25, 13, 4.4, 6.6, 25, 0.55),
    bunga: shadow(32, 14) +
      `<path d="M32 34 C31 42 33 50 32 56" fill="none" stroke="#3E9038" stroke-width="3.2" stroke-linecap="round"/>` +
      `<path d="M32 50 c-8 -1 -13 -6 -13 -11 7 0 12 4 13 11Z" fill="${L('grn')}"/><path d="M32 46 c8 -1 13 -6 13 -11 -7 0 -12 4 -13 11Z" fill="${L('grn')}"/>` +
      Array.from({ length: 5 }, (_, i) => `<ellipse cx="32" cy="12" rx="7" ry="9.4" fill="${R('pnk')}" transform="rotate(${i * 72} 32 22)"/>`).join('') +
      `<circle cx="32" cy="22" r="6.4" fill="${R('yel')}"/>` + hl(29, 19, 2.4, 1.6, -30, 0.6),
    payung: shadow(32, 18) +
      `<path d="M32 30 v20 a5 5 0 0 1 -10 0" fill="none" stroke="#6A48D0" stroke-width="3.4" stroke-linecap="round"/>` +
      `<path d="M6 32 A26 24 0 0 1 58 32 q-4.3 -4 -8.6 0 q-4.4 -4 -8.7 0 q-4.3 -4 -8.7 0 q-4.3 -4 -8.6 0 q-4.4 -4 -8.7 0 q-4.3 -4 -8.7 0Z" fill="${L('pur')}"/>` +
      `<path d="M32 8 C24 14 22 24 23.4 32 q4.3 -4 8.6 0 q4.3 -4 8.7 0 C42 24 40 14 32 8Z" fill="${L('yel')}"/>` +
      `<circle cx="32" cy="7.4" r="2.2" fill="#6A48D0"/>` + hl(17, 20, 5, 2.6, -40, 0.4),
    baju: shadow(32, 20) +
      `<path d="M23 8 L10 15 4 28 13 32 16 26 V56 H48 V26 l3 6 9 -4 -6 -13 -13 -7 c-2 5 -5 7 -9 7 s-7 -2 -9 -7Z" fill="${L('mnt')}"/>` +
      `<path d="M16 36 H48 v6 H16Z" fill="#FFF8EC" opacity=".85"/><path d="M23 8 c2 5 5 7 9 7 s7 -2 9 -7" fill="none" stroke="#2E9E73" stroke-width="2.2"/>` +
      hl(20, 18, 4.6, 2.4, -50, 0.42),
    kasut: shadow(32, 23) +
      `<path d="M6 44 C6 36 10 30 16 28 L24 18 C28 16 32 18 33 22 L36 30 C44 32 54 36 57 42 V48 H6Z" fill="${L('red')}"/>` +
      `<path d="M5 46 h53 v5 a4 4 0 0 1 -4 4 H9 a4 4 0 0 1 -4 -4Z" fill="${L('wht')}"/>` +
      `<path d="M24 24 l6 3 M22 28 l6 3 M20 32 l6 3" stroke="#fff" stroke-width="2" stroke-linecap="round"/>` + hl(14, 34, 4, 2, -40, 0.4),
    pisang: shadow(32, 20) +
      `<path d="M10 14 C8 34 22 50 46 50 c6 0 10 -2 11 -5 C38 46 20 34 16 13Z" fill="${L('yel')}"/>` +
      `<path d="M12 16 C14 34 26 44 44 46" fill="none" stroke="#E0A010" stroke-width="1.6" opacity=".7"/>` +
      `<path d="M9 10 l4 -3 4 5 -3 3Z" fill="#6E4A22"/><path d="M55 44 l3 2 -2 2Z" fill="#6E4A22"/>` + hl(14, 26, 2, 7, -10, 0.5),
    kek: shadow(32, 22) +
      `<path d="M10 30 h44 v20 a5 5 0 0 1 -5 5 H15 a5 5 0 0 1 -5 -5Z" fill="${L('brn')}"/>` +
      `<rect x="10" y="40" width="44" height="4" fill="#FFF3DC"/>` +
      `<path d="M10 26 a22 7 0 0 1 44 0 v6 c0 3 -3 3 -4 1 -1 4 -5 4 -6 0 -2 5 -6 5 -7 0 -2 5 -6 5 -7 0 -1 5 -6 5 -7 0 -1 4 -5 4 -6 0 -1 3 -4 3 -4 -1Z" fill="${L('pnk')}"/>` +
      `<circle cx="32" cy="16" r="5" fill="${R('red')}"/><path d="M32 11 q2 -5 6 -6" fill="none" stroke="#3E9038" stroke-width="1.6" stroke-linecap="round"/>` + hl(20, 23, 6, 2, -10, 0.45),
    beg: shadow(32, 19) +
      `<path d="M22 14 a10 9 0 0 1 20 0" fill="none" stroke="#3A86D0" stroke-width="4" stroke-linecap="round"/>` +
      `<rect x="12" y="14" width="40" height="42" rx="11" fill="${L('blu')}"/>` +
      `<rect x="18" y="34" width="28" height="17" rx="6" fill="${L('yel')}"/><rect x="18" y="38" width="28" height="2.6" fill="#E09A12" opacity=".6"/>` +
      `<rect x="29" y="22" width="6" height="3" rx="1.5" fill="#2F6FB0"/>` + hl(20, 20, 4.6, 2.4, -30, 0.42),
    kereta: shadow(32, 25) +
      `<path d="M6 42 v-8 c0 -3 2 -5 5 -5 h6 l7 -9 c1.4 -1.6 3 -2 5 -2 h10 c2 0 3.6 .8 5 2.4 l6 8.6 h4 c3 0 5 2 5 5 v8Z" fill="${L('red')}"/>` +
      `<path d="M23 29 l5.6 -7 c.6 -.7 1.4 -1 2.4 -1 h3 v8Z M37 29 v-8 h3 c1 0 1.8 .3 2.4 1 l5 7Z" fill="${L('sky')}"/>` +
      `<rect x="4" y="40" width="56" height="5" rx="2.5" fill="#B0262A"/>` +
      `<circle cx="18" cy="45" r="7" fill="${R('drk')}"/><circle cx="18" cy="45" r="2.8" fill="#C8C0D8"/><circle cx="46" cy="45" r="7" fill="${R('drk')}"/><circle cx="46" cy="45" r="2.8" fill="#C8C0D8"/>` +
      `<rect x="54" y="34" width="5" height="3" rx="1.5" fill="#FFE58A"/>` + hl(16, 32, 5, 2, -10, 0.45),
    kucing: shadow(32, 18) +
      `<path d="M12 26 L14 6 28 16Z" fill="${L('org')}"/><path d="M52 26 L50 6 36 16Z" fill="${L('org')}"/>` +
      `<path d="M15 20 L16 10 24 16Z M49 20 L48 10 40 16Z" fill="#FF8FA3"/>` +
      `<ellipse cx="32" cy="34" rx="22" ry="20" fill="${R('org')}"/>` +
      `<path d="M28 15 l1 6 M32 14 v7 M36 15 l-1 6" stroke="#D0600E" stroke-width="2.2" stroke-linecap="round"/>` +
      `<ellipse cx="32" cy="42" rx="10" ry="7" fill="#FFF3E2"/>` + eyes(24, 40, 32, 3) +
      `<path d="M30 39 h4 l-2 2.4Z" fill="#FF6F8E"/><path d="M32 41.4 v2 m0 0 q-3 3 -5 0 m5 0 q3 3 5 0" fill="none" stroke="#2A1B3D" stroke-width="1.4" stroke-linecap="round"/>` +
      `<path d="M8 38 l10 1 M8 43 l10 -1 M56 38 l-10 1 M56 43 l-10 -1" stroke="#7A4A22" stroke-width="1" stroke-linecap="round" opacity=".6"/>` + hl(22, 22, 5, 2.6, -30, 0.38),
    kapal: shadow(32, 24) +
      `<rect x="26" y="10" width="7" height="12" rx="1.6" fill="${L('red')}"/><rect x="26" y="13" width="7" height="2.6" fill="#fff"/>` +
      `<rect x="16" y="20" width="28" height="13" rx="3" fill="${L('wht')}"/>` +
      `<circle cx="23" cy="26.5" r="2.6" fill="${L('sky')}"/><circle cx="31" cy="26.5" r="2.6" fill="${L('sky')}"/><circle cx="39" cy="26.5" r="2.6" fill="${L('sky')}"/>` +
      `<path d="M5 33 h54 l-7 16 H12Z" fill="${L('blu')}"/><path d="M8 38 h48" stroke="#fff" stroke-width="2" opacity=".8"/>` +
      `<path d="M2 52 q5 -4 10 0 t10 0 t10 0 t10 0 t10 0 t10 0" fill="none" stroke="#3A86D0" stroke-width="2.4" stroke-linecap="round"/>` + hl(20, 22, 4, 1.6, -10, 0.5),
    batu: shadow(32, 23, 0.26) +
      `<path d="M8 50 C6 40 12 28 22 24 C28 14 42 14 48 22 C56 26 60 38 56 50Z" fill="${R('gry')}"/>` +
      `<path d="M30 30 l4 6 -3 5 M44 34 l-4 4" fill="none" stroke="#767E94" stroke-width="1.4" stroke-linecap="round" opacity=".7"/>` +
      `<path d="M8 50 h48 v2 c-14 3 -34 3 -48 0Z" fill="#767E94" opacity=".6"/>` + hl(24, 27, 6, 3, -25, 0.5),
    sudu: shadow(32, 17, 0.2) +
      `<g transform="rotate(-35 32 32)"><rect x="29.5" y="28" width="5" height="30" rx="2.5" fill="${L('sil')}"/>` +
      `<ellipse cx="32" cy="17" rx="10" ry="13" fill="${R('sil')}"/><ellipse cx="32" cy="17" rx="6.4" ry="9" fill="#C3CAD8"/>` + hl(28, 11, 2.4, 4, 10, 0.7) + `</g>`,
  };

  /* ---------------- daftar gambar: id → badan ---------------- */
  const PIC = Object.assign({}, KB.KB_OBJ, {
    bintang: KB.KB_ICON.bintang, rumah: KB.KB_ICON.rumah, pensel: KB.KB_ICON.pensel, loceng: KB.KB_ICON.loceng,
    mahkota: KB.KB_ICON.mahkota, cendawan: KB.KB_ICON.cendawan, peta: KB.KB_ICON.peta, piala: KB.KB_ICON.piala,
  }, OBJ);
  const pic = (id, cls = '') => {
    if (!PIC[id]) throw new Error('gambar tiada: ' + id);
    return `<svg class="pic ${cls}" viewBox="0 0 64 64" data-objek="${id}" aria-hidden="true" focusable="false">${PIC[id]}</svg>`;
  };
  const icon = (id, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 64 64" aria-hidden="true" focusable="false">${KB.KB_ICON[id] || PIC[id]}</svg>`;

  /* ---------------- Kiko si Kancil (viewBox 200×240) ---------------- */
  const KIKO_BODY =
    `<g class="k-all">` +
    `<path class="k-tail" d="M134 184 q22 -8 20 -28 q-12 8 -22 14Z" fill="${L('tan')}"/><path d="M150 160 q4 -4 4 -6 q-6 2 -8 4Z" fill="#FFF8EC"/>` +
    `<g class="k-legL"><path d="M80 192 h15 v30 a7.5 7.5 0 0 1 -15 0Z" fill="${L('tan')}"/><path d="M80 214 h15 v8 a7.5 7.5 0 0 1 -15 0Z" fill="#5A3A22"/></g>` +
    `<g class="k-legR"><path d="M105 192 h15 v30 a7.5 7.5 0 0 1 -15 0Z" fill="${L('tan')}"/><path d="M105 214 h15 v8 a7.5 7.5 0 0 1 -15 0Z" fill="#5A3A22"/></g>` +
    `<ellipse cx="100" cy="170" rx="41" ry="44" fill="${R('tan')}"/>` +
    `<ellipse cx="100" cy="180" rx="25" ry="31" fill="${L('crm')}"/>` +
    `<path d="M82 134 q18 12 36 0 q-2 10 -18 12 q-16 -2 -18 -12Z" fill="#FFF8EC"/>` +
    `<g class="k-armL"><path d="M72 142 q-16 14 -18 36 a7.5 7.5 0 0 0 14 3 q4 -16 14 -28Z" fill="${L('tan')}"/><path d="M54 176 a7.5 7.5 0 0 0 14 4 l1 -5 -14 -3Z" fill="#5A3A22"/></g>` +
    `<g class="k-armR"><path d="M128 142 q16 14 18 36 a7.5 7.5 0 0 1 -14 3 q-4 -16 -14 -28Z" fill="${L('tan')}"/><path d="M146 176 a7.5 7.5 0 0 1 -14 4 l-1 -5 14 -3Z" fill="#5A3A22"/></g>` +
    `<path d="M68 128 q32 18 64 0 l2.4 11 q-34 20 -68.8 0Z" fill="${L('mnt')}"/><path d="M118 138 l16 22 -13 3 -8 -20Z" fill="${L('mnt')}"/>` +
    `<g class="k-head">` +
    `<path d="M60 66 C36 56 28 32 38 18 C54 22 68 42 72 60Z" fill="${L('tan')}"/><path d="M60 58 C46 50 40 36 44 26 C54 30 62 42 64 54Z" fill="#FFB3C4"/>` +
    `<path d="M140 66 C164 56 172 32 162 18 C146 22 132 42 128 60Z" fill="${L('tan')}"/><path d="M140 58 C154 50 160 36 156 26 C146 30 138 42 136 54Z" fill="#FFB3C4"/>` +
    `<path d="M100 30 C142 30 160 58 156 88 C152 114 130 128 100 128 C70 128 48 114 44 88 C40 58 58 30 100 30Z" fill="${R('tan')}"/>` +
    `<path d="M100 33 c-9 0 -13 11 -11 23 l11 7 11 -7 c2 -12 -2 -23 -11 -23Z" fill="#B4733A" opacity=".45"/>` +
    `<path d="M90 36 q8 -18 20 -5 q-9 -2 -11 7Z" fill="#9C5A26"/>` +
    `<ellipse cx="100" cy="106" rx="27" ry="18" fill="${L('crm')}"/>` +
    `<ellipse cx="66" cy="100" rx="9" ry="5.4" fill="#FF8FA3" opacity=".55"/><ellipse cx="134" cy="100" rx="9" ry="5.4" fill="#FF8FA3" opacity=".55"/>` +
    `<g class="k-eyes"><ellipse cx="78" cy="80" rx="10.5" ry="13" fill="#2A1B3D"/><ellipse cx="122" cy="80" rx="10.5" ry="13" fill="#2A1B3D"/>` +
    `<circle cx="74" cy="74" r="4.4" fill="#fff"/><circle cx="118" cy="74" r="4.4" fill="#fff"/><circle cx="82" cy="86" r="2.2" fill="#fff"/><circle cx="126" cy="86" r="2.2" fill="#fff"/></g>` +
    `<g class="k-eyes-happy"><path d="M67 82 q11 -14 22 0 M111 82 q11 -14 22 0" fill="none" stroke="#2A1B3D" stroke-width="5" stroke-linecap="round"/></g>` +
    `<ellipse cx="100" cy="97" rx="9.5" ry="6.4" fill="#3A2418"/><ellipse cx="97" cy="95" rx="3" ry="1.6" fill="#fff" opacity=".6"/>` +
    `<path class="k-mouth" d="M89 109 q11 10 22 0" fill="none" stroke="#3A2418" stroke-width="3.2" stroke-linecap="round"/>` +
    `<g class="k-mouth-open"><path d="M87 106 q13 22 26 0Z" fill="#7A2E3A"/><path d="M93 114 q7 6 14 0 q-7 -4 -14 0Z" fill="#FF8FA3"/></g>` +
    hl(74, 48, 19, 9, -25, 0.32) + `</g></g>`;
  const kiko = (cls = '') =>
    `<svg class="kiko ${cls}" viewBox="0 0 200 240" aria-hidden="true" focusable="false"><ellipse cx="100" cy="232" rx="50" ry="7" fill="#1a1226" opacity=".22" filter="url(#m3Blur)"/>${KIKO_BODY}</svg>`;
  const kikoNested = (x, y, w) => `<svg x="${x}" y="${y}" width="${w}" height="${w * 1.2}" viewBox="0 0 200 240" class="kiko">${KIKO_BODY}</svg>`;

  /* ---------------- avatar (viewBox 100) ---------------- */
  const face = (tone, extra = '', inner = '') =>
    `<ellipse cx="50" cy="92" rx="26" ry="4" fill="#1a1226" opacity=".2" filter="url(#oSd)"/>${extra}<circle cx="50" cy="56" r="33" fill="${R(tone)}"/>${inner}` +
    hl(36, 36, 10, 5, -30, 0.35);
  const cheeks = `<ellipse cx="30" cy="66" rx="6" ry="3.6" fill="#FF8FA3" opacity=".55"/><ellipse cx="70" cy="66" rx="6" ry="3.6" fill="#FF8FA3" opacity=".55"/>`;
  const AVATAR = {
    arnab: face('wht', `<path d="M30 30 C24 4 30 -2 38 4 C42 12 42 22 40 30Z" fill="${L('wht')}"/><path d="M70 30 C76 4 70 -2 62 4 C58 12 58 22 60 30Z" fill="${L('wht')}"/><path d="M33 26 C30 10 33 6 37 9 C39 14 39 20 38 26Z M67 26 C70 10 67 6 63 9 C61 14 61 20 62 26Z" fill="#FFB3C4"/>`,
      eyes(38, 62, 54, 5) + cheeks + `<path d="M46 63 h8 l-4 4Z" fill="#FF6F8E"/><path d="M50 67 v4" stroke="#2A1B3D" stroke-width="1.6"/><rect x="45.6" y="71" width="4" height="5" rx="1" fill="#fff" stroke="#D8D0E6"/><rect x="50.4" y="71" width="4" height="5" rx="1" fill="#fff" stroke="#D8D0E6"/>`),
    panda: face('wht', `<circle cx="24" cy="28" r="11" fill="${R('drk')}"/><circle cx="76" cy="28" r="11" fill="${R('drk')}"/>`,
      `<ellipse cx="37" cy="54" rx="9" ry="11" fill="#2E2838" transform="rotate(-25 37 54)"/><ellipse cx="63" cy="54" rx="9" ry="11" fill="#2E2838" transform="rotate(25 63 54)"/>` +
      `<circle cx="38" cy="53" r="4" fill="#fff"/><circle cx="62" cy="53" r="4" fill="#fff"/><circle cx="38.6" cy="53.6" r="2.4" fill="#2A1B3D"/><circle cx="61.4" cy="53.6" r="2.4" fill="#2A1B3D"/>` +
      cheeks + `<ellipse cx="50" cy="66" rx="5" ry="3.4" fill="#2E2838"/>` + smile(50, 71, 8)),
    kucing: face('org', `<path d="M22 40 L22 10 44 26Z" fill="${L('org')}"/><path d="M78 40 L78 10 56 26Z" fill="${L('org')}"/><path d="M26 32 L26 18 38 27Z M74 32 L74 18 62 27Z" fill="#FFB3C4"/>`,
      `<path d="M44 26 l2 8 M50 25 v9 M56 26 l-2 8" stroke="#D0600E" stroke-width="3" stroke-linecap="round"/><ellipse cx="50" cy="69" rx="14" ry="10" fill="#FFF3E2"/>` +
      eyes(38, 62, 54, 5) + cheeks + `<path d="M46 63 h8 l-4 4Z" fill="#FF6F8E"/><path d="M50 67 q-4 5 -7 1 M50 67 q4 5 7 1" fill="none" stroke="#2A1B3D" stroke-width="1.6" stroke-linecap="round"/>` +
      `<path d="M14 62 l16 2 M14 70 l16 -2 M86 62 l-16 2 M86 70 l-16 -2" stroke="#7A4A22" stroke-width="1.4" stroke-linecap="round" opacity=".55"/>`),
    beruang: face('brn', `<circle cx="22" cy="30" r="12" fill="${R('brn')}"/><circle cx="78" cy="30" r="12" fill="${R('brn')}"/><circle cx="22" cy="30" r="6" fill="#E8BE92"/><circle cx="78" cy="30" r="6" fill="#E8BE92"/>`,
      `<ellipse cx="50" cy="68" rx="15" ry="11" fill="${L('crm')}"/>` + eyes(37, 63, 52, 5) + cheeks + `<ellipse cx="50" cy="63" rx="6" ry="4.2" fill="#3A2418"/>` + smile(50, 70, 9)),
    katak: `<ellipse cx="50" cy="92" rx="28" ry="4" fill="#1a1226" opacity=".2" filter="url(#oSd)"/><circle cx="32" cy="28" r="13" fill="${R('grn')}"/><circle cx="68" cy="28" r="13" fill="${R('grn')}"/>` +
      `<ellipse cx="50" cy="60" rx="38" ry="30" fill="${R('grn')}"/><circle cx="32" cy="27" r="8" fill="#fff"/><circle cx="68" cy="27" r="8" fill="#fff"/><circle cx="33" cy="28" r="4.4" fill="#2A1B3D"/><circle cx="67" cy="28" r="4.4" fill="#2A1B3D"/><circle cx="31.6" cy="26.4" r="1.6" fill="#fff"/><circle cx="65.6" cy="26.4" r="1.6" fill="#fff"/>` +
      `<path d="M28 64 q22 18 44 0" fill="none" stroke="#2C7D3C" stroke-width="3.4" stroke-linecap="round"/>` + `<ellipse cx="24" cy="62" rx="6" ry="3.6" fill="#FF8FA3" opacity=".55"/><ellipse cx="76" cy="62" rx="6" ry="3.6" fill="#FF8FA3" opacity=".55"/>` + hl(34, 46, 10, 5, -20, 0.3),
    ayam: face('yel', `<path d="M44 26 q2 -14 8 -4 q4 -12 8 2" fill="${L('org')}"/>`,
      eyes(38, 62, 52, 5) + cheeks + `<path d="M42 62 L50 56 58 62 50 70Z" fill="${L('org')}"/><path d="M42 62 h16" stroke="#D0600E" stroke-width="1.2"/>` +
      `<ellipse cx="18" cy="66" rx="7" ry="12" fill="${L('yel')}" transform="rotate(20 18 66)"/><ellipse cx="82" cy="66" rx="7" ry="12" fill="${L('yel')}" transform="rotate(-20 82 66)"/>`),
    harimau: face('org', `<circle cx="24" cy="30" r="11" fill="${R('org')}"/><circle cx="76" cy="30" r="11" fill="${R('org')}"/><circle cx="24" cy="30" r="5.4" fill="#FFF3E2"/><circle cx="76" cy="30" r="5.4" fill="#FFF3E2"/>`,
      `<path d="M50 24 v10 M42 25 l2 7 M58 25 l-2 7 M18 52 h9 M19 60 h8 M82 52 h-9 M81 60 h-8" stroke="#2E2838" stroke-width="3.4" stroke-linecap="round"/>` +
      `<ellipse cx="50" cy="69" rx="15" ry="10" fill="#FFF8EC"/>` + eyes(38, 62, 53, 5) + `<path d="M45 63 h10 l-5 4.4Z" fill="#FF6F8E"/>` + smile(50, 70, 9)),
    hantu: `<ellipse cx="50" cy="92" rx="26" ry="4" fill="#1a1226" opacity=".2" filter="url(#oSd)"/><path d="M22 30 L24 12 38 24Z M78 30 L76 12 62 24Z" fill="${L('pur')}"/>` +
      `<ellipse cx="50" cy="56" rx="32" ry="34" fill="${R('pur')}"/><ellipse cx="50" cy="70" rx="18" ry="16" fill="#EDE6FF"/>` +
      `<circle cx="37" cy="48" r="12" fill="#fff"/><circle cx="63" cy="48" r="12" fill="#fff"/><circle cx="38" cy="49" r="6" fill="#2A1B3D"/><circle cx="62" cy="49" r="6" fill="#2A1B3D"/><circle cx="36" cy="46.6" r="2.2" fill="#fff"/><circle cx="60" cy="46.6" r="2.2" fill="#fff"/>` +
      `<path d="M45 58 L50 66 55 58Z" fill="${L('org')}"/>` + hl(36, 30, 9, 4, -30, 0.35),
  };
  const AVATAR_IDS = Object.keys(AVATAR);
  const avatar = (id, cls = '') => `<svg class="avatar ${cls}" viewBox="0 0 100 100" aria-hidden="true">${AVATAR[id] || AVATAR.arnab}</svg>`;

  /* ---------------- 24 sticker (viewBox 100, potong-die putih) ---------------- */
  const nest64 = (id, x, y, s) => `<svg x="${x}" y="${y}" width="${s}" height="${s}" viewBox="0 0 64 64" overflow="visible">${PIC[id] || KB.KB_ICON[id]}</svg>`;
  const nestAv = (id, x, y, s) => `<svg x="${x}" y="${y}" width="${s}" height="${s}" viewBox="0 0 100 100" overflow="visible">${AVATAR[id]}</svg>`;
  const sparkle = (x, y, s = 6, c = '#FFD24A') => `<path d="M${x} ${y - s} L${x + s * 0.28} ${y - s * 0.28} ${x + s} ${y} ${x + s * 0.28} ${y + s * 0.28} ${x} ${y + s} ${x - s * 0.28} ${y + s * 0.28} ${x - s} ${y} ${x - s * 0.28} ${y - s * 0.28}Z" fill="${c}"/>`;
  const STK = {
    kiko_hebat: kikoNested(14, 4, 72) + `<circle cx="72" cy="74" r="12" fill="${R('gld')}"/>` + sparkle(72, 74, 6, '#FFF6C2'),
    bintang_emas: nest64('bintang', 8, 6, 84) + eyes(43, 57, 50, 3.2) + smile(50, 58, 8, 2.2),
    pelangi: ['#FF7A8A', '#FFB45A', '#FFE066', '#7BE08A', '#6EC3FF', '#9C8CFF'].map((c, i) => `<path d="M${12 + i * 5} 70 A${38 - i * 5} ${38 - i * 5} 0 0 1 ${88 - i * 5} 70" fill="none" stroke="${c}" stroke-width="5.4"/>`).join('') +
      `<g><circle cx="16" cy="72" r="10" fill="${R('wht')}"/><circle cx="26" cy="74" r="8" fill="${R('wht')}"/><circle cx="84" cy="72" r="10" fill="${R('wht')}"/><circle cx="74" cy="74" r="8" fill="${R('wht')}"/></g>` + eyes(14, 22, 71, 1.6) + eyes(78, 86, 71, 1.6),
    roket: `<g transform="rotate(30 50 50)"><path d="M50 8 C64 20 66 44 62 66 H38 C34 44 36 20 50 8Z" fill="${L('wht')}"/><path d="M50 8 C58 15 61 24 62 32 H38 C39 24 42 15 50 8Z" fill="${L('red')}"/>` +
      `<circle cx="50" cy="44" r="8" fill="${L('blu')}" stroke="#fff" stroke-width="3"/><path d="M38 50 L26 70 38 66Z M62 50 L74 70 62 66Z" fill="${L('red')}"/><path d="M42 66 h16 l-8 22Z" fill="${L('org')}"/><path d="M46 66 h8 l-4 12Z" fill="#FFF4B8"/></g>`,
    dino: `<path d="M18 72 C16 50 30 36 48 38 C54 22 76 18 84 32 C90 42 84 52 74 52 L70 72Z" fill="${R('grn')}"/>` +
      `<path d="M30 40 l4 -8 4 7 4 -9 4 8 4 -8" fill="${L('yel')}"/><path d="M24 70 l-12 6 12 2Z" fill="${L('grn')}"/>` +
      `<rect x="32" y="66" width="10" height="16" rx="5" fill="${L('grn')}"/><rect x="56" y="66" width="10" height="16" rx="5" fill="${L('grn')}"/>` + eyes(70, 79, 34, 3) + smile(77, 44, 8, 2) + hl(60, 26, 8, 4, -20, 0.35),
    panda: nestAv('panda', 6, 6, 88),
    robot: `<rect x="48" y="8" width="4" height="12" fill="#767E94"/><circle cx="50" cy="8" r="5" fill="${R('red')}"/>` +
      `<rect x="20" y="20" width="60" height="50" rx="14" fill="${L('sil')}"/><rect x="28" y="30" width="44" height="24" rx="10" fill="${L('drk')}"/>` +
      `<circle cx="40" cy="42" r="5" fill="#76DDB5"/><circle cx="60" cy="42" r="5" fill="#76DDB5"/><path d="M40 62 h20" stroke="#767E94" stroke-width="3" stroke-linecap="round"/>` +
      `<rect x="12" y="38" width="8" height="16" rx="4" fill="${L('blu')}"/><rect x="80" y="38" width="8" height="16" rx="4" fill="${L('blu')}"/><rect x="34" y="72" width="32" height="16" rx="6" fill="${L('blu')}"/>` + hl(32, 26, 8, 3, -15, 0.5),
    awan_pelangi: ['#FF7A8A', '#FFE066', '#7BE08A', '#6EC3FF'].map((c, i) => `<rect x="${30 + i * 10}" y="54" width="9" height="${30 - i * 4}" rx="4.5" fill="${c}"/>`).join('') +
      `<circle cx="34" cy="46" r="18" fill="${R('wht')}"/><circle cx="56" cy="38" r="22" fill="${R('wht')}"/><circle cx="74" cy="50" r="14" fill="${R('wht')}"/><rect x="24" y="46" width="58" height="16" rx="8" fill="${R('wht')}"/>` + eyes(48, 62, 46, 2.6) + smile(55, 52, 7),
    bintang_ajaib: `<path d="M18 86 L50 50" stroke="${L('yel')}" stroke-width="6" stroke-linecap="round"/>` + nest64('bintang', 30, 10, 60).replace(/url\(#kgold\)/g, R('pur')) + sparkle(20, 24, 7) + sparkle(84, 70, 6, '#FF8FA3') + sparkle(82, 20, 5, '#82CCFF'),
    unicorn: `<path d="M50 4 L56 30 H44Z" fill="${L('gld')}"/><path d="M47 12 l7 3 M46 20 l9 3" stroke="#C98A06" stroke-width="1.4"/>` +
      `<path d="M26 36 C18 20 34 14 40 24 C30 22 26 30 26 36Z" fill="${L('pnk')}"/><path d="M24 50 C10 40 16 24 28 26 C20 32 22 42 24 50Z" fill="${L('pur')}"/>` +
      `<ellipse cx="54" cy="56" rx="28" ry="30" fill="${R('wht')}"/><path d="M30 30 L36 14 46 28Z" fill="${L('wht')}"/><ellipse cx="62" cy="74" rx="16" ry="11" fill="#FFE6EE"/>` + eyes(46, 66, 52, 3.6) + `<ellipse cx="57" cy="74" rx="2" ry="1.4" fill="#C08A9A"/><ellipse cx="67" cy="74" rx="2" ry="1.4" fill="#C08A9A"/>`,
    planet: `<circle cx="50" cy="50" r="28" fill="${R('org')}"/><path d="M26 44 q24 8 48 0 M24 56 q26 8 52 0" stroke="#FFD9A8" stroke-width="3.4" fill="none" opacity=".7"/>` +
      `<ellipse cx="50" cy="52" rx="46" ry="11" fill="none" stroke="${L('pur')}" stroke-width="6" transform="rotate(-14 50 52)"/>` + eyes(41, 59, 48, 3.4) + smile(50, 56, 9, 2.2) + hl(38, 32, 7, 3.6, -30, 0.45),
    kapal_angkasa: `<ellipse cx="50" cy="44" rx="20" ry="18" fill="${L('sky')}" opacity=".95"/>` + nestAv('katak', 34, 24, 32) +
      `<ellipse cx="50" cy="58" rx="42" ry="14" fill="${L('sil')}"/><ellipse cx="50" cy="54" rx="30" ry="6" fill="#fff" opacity=".5"/>` +
      `<circle cx="22" cy="60" r="3.4" fill="#FFD24A"/><circle cx="38" cy="64" r="3.4" fill="#FF8FA3"/><circle cx="62" cy="64" r="3.4" fill="#76DDB5"/><circle cx="78" cy="60" r="3.4" fill="#82CCFF"/><path d="M40 72 l-6 14 h32 l-6 -14Z" fill="#FFF4B8" opacity=".55"/>`,
    kucing_super: `<path d="M24 50 C10 66 14 86 22 92 C34 80 50 78 54 70Z" fill="${L('red')}"/>` + nestAv('kucing', 10, 4, 80) +
      `<path d="M26 50 q24 -10 48 0 l-2 8 q-22 -8 -44 0Z" fill="#F25C54"/>` + sparkle(84, 20, 6),
    naga: `<path d="M30 30 L22 10 38 24Z M70 30 L78 10 62 24Z" fill="${L('yel')}"/><path d="M14 52 L4 44 10 60Z M86 52 L96 44 90 60Z" fill="${L('pur')}"/>` +
      `<ellipse cx="50" cy="52" rx="34" ry="32" fill="${R('teal')}"/><ellipse cx="50" cy="68" rx="20" ry="13" fill="#D2F7E8"/><circle cx="43" cy="68" r="2" fill="#138A7E"/><circle cx="57" cy="68" r="2" fill="#138A7E"/>` +
      eyes(37, 63, 48, 5) + `<path d="M44 24 l6 -8 6 8Z" fill="${L('pnk')}"/>` + hl(36, 32, 9, 4, -30, 0.35),
    beruang_bijak: nestAv('beruang', 6, 10, 86) + `<circle cx="38" cy="54" r="9" fill="none" stroke="#2A1B3D" stroke-width="2.6"/><circle cx="64" cy="54" r="9" fill="none" stroke="#2A1B3D" stroke-width="2.6"/><path d="M47 54 h8" stroke="#2A1B3D" stroke-width="2.6"/>` +
      `<path d="M22 22 L50 10 78 22 50 32Z" fill="${L('drk')}"/><path d="M74 24 v14" stroke="#FFD24A" stroke-width="2"/><circle cx="74" cy="39" r="3" fill="#FFD24A"/>`,
    arnab_laju: nestAv('arnab', 18, 8, 80) + `<path d="M6 50 h14 M2 62 h16 M8 74 h12" stroke="${L('blu')}" stroke-width="5" stroke-linecap="round"/>`,
    mahkota: nest64('mahkota', 6, 10, 88) + sparkle(16, 18, 6) + sparkle(86, 16, 5, '#FF8FA3'),
    pensel_ajaib: nest64('pensel', 10, 10, 80) + sparkle(78, 22, 8) + sparkle(22, 78, 6, '#82CCFF') + sparkle(86, 70, 5, '#FF8FA3'),
    buku_bersinar: Array.from({ length: 8 }, (_, i) => `<path d="M50 50 L${50 + Math.cos(i * 0.785) * 48} ${50 + Math.sin(i * 0.785) * 48}" stroke="#FFE58A" stroke-width="6" stroke-linecap="round" opacity=".8"/>`).join('') + nest64('buku', 14, 12, 72),
    trofi: nest64('piala', 10, 8, 82) + sparkle(18, 22, 6) + sparkle(84, 30, 5),
    bunga_ceria: nest64('bunga', 8, 6, 86).replace(/<circle cx="32" cy="22" r="6.4"[^>]*>/, (m) => m) + eyes(46.6, 53.4, 30.6, 1.6) + smile(50, 34, 4, 1.2),
    bulan_senyum: nest64('bulan', 8, 8, 84) + eyes(30, 42, 52, 2.6) + smile(36, 60, 7, 2) + sparkle(76, 22, 6) + sparkle(84, 44, 4),
    burung: `<ellipse cx="50" cy="56" rx="30" ry="28" fill="${R('blu')}"/><path d="M22 58 C14 46 18 34 30 40 C34 48 32 56 22 58Z" fill="${L('pnk')}"/>` +
      ['#FF7A8A', '#FFE066', '#7BE08A'].map((c, i) => `<path d="M${52 + i * 3} ${50 + i * 6} q18 -6 26 ${6 + i * 3}" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round"/>`).join('') +
      `<path d="M44 26 q4 -14 10 -2" fill="${L('org')}"/>` + eyes(40, 58, 48, 3.6) + `<path d="M45 56 L50 52 55 56 50 62Z" fill="${L('org')}"/>` + hl(38, 38, 8, 4, -30, 0.4),
    kancil_super: `<path d="M60 46 C88 54 94 80 84 96 C72 82 62 74 50 72Z" fill="${L('red')}"/>` + kikoNested(16, 2, 72) + sparkle(84, 18, 7) + `<circle cx="50" cy="62" r="7" fill="${R('gld')}"/><text x="50" y="65.6" text-anchor="middle" font-size="9" font-weight="800" fill="#B0262A" font-family="Fredoka,sans-serif">K</text>`,
  };
  const STICKER_IDS = Object.keys(STK);
  const sticker = (id, cls = '') => `<svg class="sticker-art ${cls}" viewBox="0 0 100 100" data-sticker="${id}" aria-hidden="true"><g filter="url(#m3Stk)">${STK[id]}</g>${hl(30, 22, 10, 5, -30, 0.35)}</svg>`;
  const stickerLocked = (cls = '') => `<svg class="sticker-art locked ${cls}" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="52" r="34" fill="#E9E2F5" stroke="#fff" stroke-width="5"/>${nest64('kunci', 32, 32, 36)}</svg>`;

  /* ---------------- pulau kategori ---------------- */
  const block = (x, y, s, tone, txt) => `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${s * 0.22}" fill="${L(tone)}"/><rect x="${x + 2}" y="${y + 2}" width="${s - 4}" height="${s * 0.36}" rx="${s * 0.18}" fill="#fff" opacity=".28"/><text x="${x + s / 2}" y="${y + s * 0.7}" text-anchor="middle" font-size="${s * 0.52}" font-weight="700" fill="#fff" font-family="Fredoka,sans-serif">${txt}</text>`;
  const CAT_ICON = {
    huruf: KB.KB_ICON.huruf,
    sukukata: shadow(32, 24, 0.2) + ['#FF7A8A', '#FFE066', '#7BE08A', '#6EC3FF'].map((c, i) => `<path d="M${6 + i * 4} 40 A${26 - i * 4} ${26 - i * 4} 0 0 1 ${58 - i * 4} 40" fill="none" stroke="${c}" stroke-width="4"/>`).join('') + block(10, 34, 20, 'blu', 'ba') + block(34, 34, 20, 'pnk', 'ju'),
    perkataan: KB.KB_ICON.rumah,
    ayat: KB.KB_ICON.cerita,
    nombor: KB.KB_ICON.nombor,
    matematik: shadow(32, 24, 0.22) + block(6, 10, 26, 'org', '+') + block(32, 26, 26, 'blu', '−') + block(10, 34, 20, 'mnt', '=').replace(/font-size="[^"]+"/, 'font-size="12"'),
  };
  const ISLAND_TONE = { huruf: 'mnt', sukukata: 'blu', perkataan: 'pnk', ayat: 'pur', nombor: 'yel', matematik: 'org' };
  const island = (cat) => {
    const t = ISLAND_TONE[cat];
    return `<svg class="island-art" viewBox="0 0 200 170" aria-hidden="true">` +
      `<ellipse cx="100" cy="164" rx="60" ry="5" fill="#1a1226" opacity=".15" filter="url(#m3Blur)"/>` +
      `<path d="M28 96 C40 150 80 158 100 156 C120 158 160 150 172 96Z" fill="${L('brn')}"/><path d="M60 120 l10 18 M120 126 l-8 16 M96 132 v14" stroke="#77461F" stroke-width="3" stroke-linecap="round" opacity=".5"/>` +
      `<ellipse cx="100" cy="96" rx="76" ry="24" fill="${L(t)}"/><ellipse cx="100" cy="92" rx="70" ry="18" fill="#fff" opacity=".18"/>` +
      `<circle cx="40" cy="92" r="5" fill="#FFF8EC"/><circle cx="160" cy="98" r="4" fill="#FFF8EC"/><circle cx="58" cy="104" r="3" fill="#FFD24A"/><circle cx="146" cy="88" r="3" fill="#FF8FA3"/>` +
      `<svg x="54" y="4" width="92" height="92" viewBox="0 0 64 64" overflow="visible">${CAT_ICON[cat]}</svg></svg>`;
  };
  const catIcon = (cat, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 64 64" aria-hidden="true">${CAT_ICON[cat]}</svg>`;

  /* ---------------- kotak hadiah (viewBox 120) ---------------- */
  const giftBox = () => `<svg class="gift" viewBox="0 0 120 130" aria-hidden="true">` +
    `<ellipse cx="60" cy="124" rx="40" ry="5" fill="#1a1226" opacity=".2" filter="url(#m3Blur)"/>` +
    `<g class="gift-base"><rect x="18" y="56" width="84" height="64" rx="10" fill="${L('pnk')}"/><rect x="52" y="56" width="16" height="64" fill="${L('yel')}"/><rect x="22" y="60" width="26" height="20" rx="6" fill="#fff" opacity=".22"/></g>` +
    `<g class="gift-lid"><rect x="12" y="40" width="96" height="22" rx="8" fill="${L('pnk')}"/><rect x="52" y="40" width="16" height="22" fill="${L('yel')}"/>` +
    `<path d="M60 40 C46 18 26 24 34 36 C38 42 52 42 60 40Z M60 40 C74 18 94 24 86 36 C82 42 68 42 60 40Z" fill="${L('yel')}"/><circle cx="60" cy="38" r="6" fill="${R('org')}"/>` + hl(30, 46, 10, 3, -6, 0.35) + `</g></svg>`;

  /* ---------------- wang kertas RM (viewBox 120×60) ---------------- */
  const NOTE_TONE = { 1: 'blu', 5: 'grn', 10: 'red', 20: 'org', 50: 'teal', 100: 'pur' };
  const note = (v) => `<svg class="note" viewBox="0 0 120 60" data-rm="${v}" aria-hidden="true"><rect x="2" y="4" width="116" height="54" rx="8" fill="#1a1226" opacity=".15"/>` +
    `<rect x="2" y="2" width="116" height="52" rx="8" fill="${L(NOTE_TONE[v] || 'grn')}"/><rect x="8" y="8" width="104" height="40" rx="6" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2" stroke-dasharray="2 3"/>` +
    `<circle cx="30" cy="28" r="13" fill="#fff" opacity=".85"/><path d="M30 18 l3 6 6 1 -4.6 4.2 1.2 6 -5.6 -3 -5.6 3 1.2 -6 -4.6 -4.2 6 -1Z" fill="${L(NOTE_TONE[v] || 'grn')}"/>` +
    `<text x="80" y="38" text-anchor="middle" font-size="22" font-weight="700" fill="#fff" font-family="Fredoka,sans-serif">RM${v}</text>` + hl(24, 10, 18, 3, -4, 0.3) + `</svg>`;

  /* ---------------- ikon UI (chrome, tangan) ---------------- */
  const UI = {
    home: '<path d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z" fill="currentColor"/>',
    back: '<path d="M15 4 7 12l8 8" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>',
    gear: '<path d="M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6zm8.4 5.2.1-1.4-.1-1.4 2-1.6-2-3.4-2.4.9a8 8 0 0 0-2.4-1.4L15.2 2h-4l-.4 2.6a8 8 0 0 0-2.4 1.4L6 5.2 4 8.6 6 10.2 5.9 12l.1 1.4-2 1.6 2 3.4 2.4-.9c.7.6 1.5 1 2.4 1.4l.4 2.6h4l.4-2.6c.9-.3 1.7-.8 2.4-1.4l2.4.9 2-3.4z" fill="currentColor"/>',
    bulb: '<path d="M12 2a7 7 0 0 0-4 12.7V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3A7 7 0 0 0 12 2z" fill="#FFD24A" stroke="#C98A06" stroke-width="1.4"/><rect x="9" y="19" width="6" height="2.6" rx="1.3" fill="#8E97AB"/><path d="M9.6 6.4a4 4 0 0 1 2.4-1" stroke="#fff" stroke-width="1.6" stroke-linecap="round" fill="none"/>',
    globe: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    check: '<path d="M5 12.5 10 17 19 7" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>',
    reset: '<path d="M5 12a7 7 0 1 0 2.1-5" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><path d="M4 3v5h5" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>',
    clock: '<circle cx="12" cy="13" r="8" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M12 9v4.4l3 2" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M9 2.6h6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
    infinity: '<path d="M7 8.5a3.5 3.5 0 1 0 0 7c3 0 7-7 10-7a3.5 3.5 0 1 1 0 7c-3 0-7-7-10-7z" fill="none" stroke="currentColor" stroke-width="2.6"/>',
    pause: '<rect x="6" y="5" width="4.4" height="14" rx="1.6" fill="currentColor"/><rect x="13.6" y="5" width="4.4" height="14" rx="1.6" fill="currentColor"/>',
    play: '<path d="M7 4.6v14.8a1 1 0 0 0 1.5.9l12-7.4a1 1 0 0 0 0-1.8l-12-7.4A1 1 0 0 0 7 4.6z" fill="currentColor"/>',
    close: '<path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>',
    arrowUp: '<path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>',
    arrowDown: '<path d="M12 5v14M5 12l7 7 7-7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>',
    backspace: '<path d="M9 5h11a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H9l-6-7z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M12 9.5l5 5M17 9.5l-5 5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
  };
  const ui = (id, cls = '') => `<svg class="uic ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${UI[id]}</svg>`;

  const sprite = () => `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false" data-sprite="m3"><defs>${DEFS}</defs></svg>`;

  const ART = { sprite, pic, icon, kiko, avatar, sticker, stickerLocked, island, catIcon, giftBox, note, ui, PIC_IDS: Object.keys(PIC), AVATAR_IDS, STICKER_IDS, DEFS, _bodies: { PIC, AVATAR, STK, CAT_ICON, KIKO_BODY } };
  if (typeof module !== 'undefined' && module.exports) module.exports = ART; else root.ART = ART;
})(typeof window !== 'undefined' ? window : globalThis);
