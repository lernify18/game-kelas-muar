// Tukar Objek3D.tsx + Ikon3D.tsx (Kids Baca) kepada rentetan SVG biasa untuk game satu fail.
// Objek kekal awalan `o`; id Ikon3D diberi awalan `k` supaya tidak bertembung.
import { readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const SRC = join(homedir(), 'Kids Baca AUG26/src/ui');
const OUT = new URL('../src/art-kb.js', import.meta.url);

const attrs = (s) =>
  s
    .replace(/\{\.\.\.L\}/g, 'x1="0" y1="0" x2=".65" y2="1"')
    .replace(/\{\.\.\.R\}/g, 'cx="34%" cy="27%" r="76%"')
    .replace(/\s(stopColor|strokeWidth|strokeLinecap|strokeLinejoin|strokeOpacity|strokeDasharray|fillOpacity|fillRule|clipRule|stopOpacity)=/g,
      (_, a) => ' ' + a.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase()) + '=')
    .replace(/=\{([-\d.]+)\}/g, '="$1"')
    .replace(/<>|<\/>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const bayang = (cx, rx, o = 0.24, cy = 57.5) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="3.4" fill="#1a1226" opacity="${o}" filter="url(#oSd)"/>`;

function parse(file, renameIds) {
  const src = readFileSync(join(SRC, file), 'utf8');
  let defs = src.slice(src.indexOf('<defs>') + 6, src.indexOf('</defs>'));
  const start = src.indexOf('Record<Nama');
  const body = src.slice(src.indexOf('{', src.indexOf('=', start)) + 1);
  const items = {};
  const re = /^\s{2}([a-z]+):\s*<>([\s\S]*?)<\/>,?\s*$/gm;
  let m;
  while ((m = re.exec(body))) {
    let svg = m[2].replace(/\{bayang\(([^)]*)\)\}/g, (_, a) => bayang(...a.split(',').map(Number)));
    items[m[1]] = attrs(svg);
  }
  defs = attrs(defs);
  if (renameIds) {
    const ren = (t) => t.replace(/id="([^"]+)"/g, 'id="k$1"').replace(/url\(#([^)]+)\)/g, 'url(#k$1)');
    defs = ren(defs);
    for (const k in items) items[k] = ren(items[k]);
  }
  const left = [defs, ...Object.values(items)].join('').match(/[{}]/);
  if (left) throw new Error(`${file}: ungkapan JSX tertinggal`);
  return { defs, items };
}

const ob = parse('Objek3D.tsx', false);
const ik = parse('Ikon3D.tsx', true);
const out = `// DIJANA oleh tools/import-kidsbaca-art.mjs dari Kids Baca (Objek3D + Ikon3D). Jangan sunting tangan.
const KB_DEFS = ${JSON.stringify(ob.defs + ik.defs)};
const KB_OBJ = ${JSON.stringify(ob.items, null, 0)};
const KB_ICON = ${JSON.stringify(ik.items, null, 0)};
if (typeof module !== 'undefined') module.exports = { KB_DEFS, KB_OBJ, KB_ICON };
`;
writeFileSync(OUT, out);
console.log(`objek ${Object.keys(ob.items).length}: ${Object.keys(ob.items).join(' ')}`);
console.log(`ikon ${Object.keys(ik.items).length}: ${Object.keys(ik.items).join(' ')}`);
console.log(`saiz ${out.length} bait`);
