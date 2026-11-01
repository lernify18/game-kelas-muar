#!/usr/bin/env node
// Disalin dari skill ~/.claude/skills/ubai-keratan-akhbar (scripts/keratan.mjs); build.mjs menjalankannya untuk seksyen fakta.
// Keratan akhbar 600×800 untuk sales page: satu artikel JSON → satu bingkai HTML (CSS berskop .kr, imej data URI).
//   node keratan.mjs <artikel.json>... [--layout ori|ori-gambar|no2|l1|l3|l4] [--out keratan.html] [--preview]
//   --layout  ori (lalai, pilihan Ubai 2026-11-01): rupa screenshot berita yang bersih tetapi dibina dalam HTML,
//             jadi tajuk, masa, kapsyen, petikan dan highlight boleh diubah terus; tanpa latar kertas.
//             ori-gambar: screenshot sebenar (gambar) dalam kad yang sama.
//             no2 ayat kunci merentang, l1 D klasik, l3 tajuk atas foto, l4 fakta sebelah tajuk (atas kertas renyuk).
//   --scope   "#root" awalan untuk setiap peraturan CSS bila page hos ada reset berskop id (cth #misi3m-sales-root h3)
//   --preview tulis dokumen HTML penuh dengan SEMUA layout untuk setiap artikel (untuk pilih / semak)
// Tanpa --preview, output ialah serpihan HTML untuk ditampal dalam page (satu <style> + satu <script> fit).
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SKILL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const LAYOUTS = ['ori', 'ori-gambar', 'no2', 'l1', 'l3', 'l4'];
const NAMA = { no2: 'No.2 Ayat kunci merentang', l1: 'D klasik', l3: 'Tajuk di atas foto', l4: 'Fakta nombor sebelah tajuk', ori: 'Ori (HTML, boleh diubah)', 'ori-gambar': 'Ori gambar: screenshot sebenar' };

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const files = args.filter((a, i) => !a.startsWith('--') && !['--layout', '--out', '--scope'].includes(args[i - 1]));
const layout = opt('--layout', 'ori');
const preview = args.includes('--preview');
const out = opt('--out', preview ? 'keratan-preview.html' : 'keratan.html');
if (!files.length || !LAYOUTS.includes(layout)) {
  console.error(`guna: node keratan.mjs <artikel.json>... [--layout ${LAYOUTS.join('|')}] [--out f.html] [--preview]`);
  process.exit(1);
}

const mime = (f) => (f.endsWith('.png') ? 'image/png' : f.endsWith('.jpg') || f.endsWith('.jpeg') ? 'image/jpeg' : 'image/webp');
const uri = (f) => `data:${mime(f)};base64,${readFileSync(f).toString('base64')}`;
const PAPER = uri(SKILL + '/assets/kertas-renyuk.webp');

// Pemenggal suku kata BM (&shy;) supaya lajur rata tak ternganga: V-KV, VK-KV, digraf ng/ny/sy/kh/gh tak dipisah.
const DIG = ['ng', 'ny', 'sy', 'kh', 'gh'];
const isV = (c) => 'aeiou'.includes(c);
const hyph = (w) => {
  if (w.length < 7 || /[^a-z]/.test(w)) return w;
  const cuts = [];
  for (let i = 1; i < w.length - 1; i++) {
    if (!isV(w[i - 1]) || isV(w[i])) continue;
    let j = i;
    while (j < w.length && !isV(w[j])) j++;
    if (j >= w.length) break;
    const cl = w.slice(i, j);
    const cut = cl.length === 1 || DIG.includes(cl) ? i : DIG.includes(cl.slice(-2)) ? j - 2 : i + 1;
    if (cut >= 3 && w.length - cut >= 3) cuts.push(cut);
    i = j - 1;
  }
  return cuts.reduceRight((s, c) => s.slice(0, c) + '­' + s.slice(c), w);
};
const soft = (t) => t.replace(/[A-Za-z]+/g, hyph);

const load = (f) => {
  const a = JSON.parse(readFileSync(f, 'utf8'));
  const base = dirname(resolve(f));
  for (const k of ['tajuk', 'tarikh', 'sumber', 'ayatKunci', 'foto', 'kredit', 'kapsyen', 'fakta', 'teks']) if (!a[k]) throw new Error(`${f}: medan "${k}" tiada`);
  const plain = a.ayatKunci.replace(/<[^>]+>/g, '').trim().split(/\s+/).length;
  if (plain > 15) throw new Error(`${f}: ayatKunci ${plain} patah perkataan (had 15, petikan asli mesti pendek)`);
  if (a.ori) {
    for (const k of ['masa', 'kapsyen', 'petikan']) if (!a.ori[k]) throw new Error(`${f}: medan "ori.${k}" tiada`);
    const n = a.ori.petikan.replace(/<[^>]+>/g, '').trim().split(/\s+/).length;
    if (n > 45) throw new Error(`${f}: ori.petikan ${n} patah perkataan (had 45: perenggan pembuka sahaja, bukan artikel)`);
  }
  a.fotoUri = uri(resolve(base, a.foto));
  if (a.screenshot) {
    a.shotUri = uri(resolve(base, a.screenshot));
    a.shotMeta = a.screenshotMeta ? JSON.parse(readFileSync(resolve(base, a.screenshotMeta), 'utf8')) : null;
  }
  return a;
};

const parts = (a) => ({
  folio: `<div class="kr-folio"><b>${a.sumber}</b><span>${a.tarikh}</span><span class="kr-folio-r">${(a.seksyen || '').toUpperCase()}</span></div>`,
  photo: `<figure class="kr-ph"><span class="kr-cr">[${a.kredit}]</span><img src="${a.fotoUri}" alt="${a.fotoAlt || ''}"><figcaption>${a.kapsyen}</figcaption></figure>`,
  hl: `<h3 class="kr-hl${a.tajuk.length > 50 ? ' kr-long' : ''}">${a.tajuk}</h3>`,
  deck: (wide) => `<p class="kr-deck${wide ? ' kr-wide' : ''}"><span class="kr-arr"></span>${a.ayatKunci}</p>`,
  byl: `<p class="kr-byl"><b>${a.sumber}</b><span><span class="kr-tri"></span>${a.lokasi || ''}</span><em>Diolah semula daripada laporan ${a.sumber}</em></p>`,
  fact: `<div class="kr-fact"><span class="kr-tab">Fakta nombor</span><b class="kr-n">${a.fakta.n}</b><span class="kr-u">${a.fakta.u}</span><p>${a.fakta.t}</p></div>`,
  text: `<div class="kr-body">${a.teks.map((x, i) => (Array.isArray(x) ? `<h4 class="kr-sub"><mark>${x[0]}</mark></h4>` : i === 0 ? `<p><span class="kr-dc">P</span>${soft(x)}</p>` : `<p>${soft(x)}</p>`)).join('')}</div>`,
});

// Ori dalam HTML: kad dibina pada lebar mudah alih sebenar laman (412 px), saiz dan fon ikut laman sumber, lalu
// diskala supaya muat dalam bingkai 600×800 (lihat FIT).
const oriHtml = (a) => {
  if (!a.ori) throw new Error(`${a.id}: layout ori perlukan medan "ori" {masa, kapsyen, petikan}`);
  return `<div class="kr-oriw"><div class="kr-osz"><div class="kr-ocard"><h3 class="kr-o-h">${a.tajuk}</h3><p class="kr-o-d">${a.ori.masa}</p><figure class="kr-ph kr-o-ph"><img src="${a.fotoUri}" alt="${a.fotoAlt || ''}"><figcaption>${a.ori.kapsyen}</figcaption></figure><p class="kr-o-p">${a.ori.petikan}</p></div></div></div><p class="kr-src">Sumber: <b>${a.sumber}</b>, ${a.tarikh.split(', ').pop()}</p>`;
};
const ori = (a) => {
  if (!a.shotUri) throw new Error(`${a.id}: layout ori-gambar perlukan "screenshot" (ambil dengan shot-berita.mjs)`);
  const m = a.shotMeta || { w: 412, h: 700, rects: [] };
  const pct = (v, of) => +((v / of) * 100).toFixed(3);
  const marks = (m.rects || []).map((r) => `<span class="kr-mk" style="left:${pct(r.x - 2, m.w)}%;top:${pct(r.y, m.h)}%;width:${pct(r.w + 4, m.w)}%;height:${pct(r.h, m.h)}%"></span>`).join('');
  return `<div class="kr-oriw"><div class="kr-shot" style="aspect-ratio:${m.w}/${m.h}"><img src="${a.shotUri}" alt="Screenshot berita ${a.sumber}: ${a.tajuk}">${marks}</div></div><p class="kr-src">Sumber: <b>${a.sumber}</b>, ${a.tarikh.split(', ').pop()}</p>`;
};

const LAY = {
  no2: (p) => `${p.folio}${p.photo}${p.hl}${p.deck(true)}<div class="kr-row kr-g2">${p.text}<div class="kr-col">${p.fact}</div></div>`,
  l1: (p) => `${p.folio}${p.photo}${p.hl}<div class="kr-row kr-g1"><div class="kr-col">${p.deck()}${p.byl}</div>${p.text.replace('kr-body', 'kr-body kr-c1')}<div class="kr-col">${p.fact}</div></div>`,
  l3: (p) => `${p.folio}${p.hl.replace('kr-hl', 'kr-hl kr-top')}${p.photo}<div class="kr-row kr-g1"><div class="kr-col">${p.deck()}${p.byl}</div>${p.text.replace('kr-body', 'kr-body kr-c1')}<div class="kr-col">${p.fact}</div></div>`,
  l4: (p) => `${p.folio}${p.photo}<div class="kr-hf">${p.hl}${p.fact}</div><div class="kr-row kr-g4"><div class="kr-col">${p.deck()}${p.byl}</div>${p.text}</div>`,
};
const frame = (a, k) => `<div class="kr-fit"><article class="kr kr-${k === 'ori-gambar' ? 'ori kr-orig' : k}">${k === 'ori' ? oriHtml(a) : k === 'ori-gambar' ? ori(a) : LAY[k](parts(a))}</article></div>`;

const FONTS = 'https://fonts.googleapis.com/css2?family=Poppins:wght@700&family=Work+Sans:wght@400&family=Inter:wght@400&family=Oswald:wght@500;600&family=Barlow:wght@300;400&family=Barlow+Condensed:wght@500;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,700;1,8..60,400&display=swap';
// Hanya fon yang layout pakai: ori perlukan Poppins, Work Sans dan Inter sahaja.
const FONTS_ORI = 'https://fonts.googleapis.com/css2?family=Poppins:wght@700&family=Work+Sans:wght@400&family=Inter:wght@400&display=swap';
const CSS = `
.kr-fit{position:relative;width:100%;max-width:600px;margin:0 auto}
.kr{position:absolute;left:0;top:0;transform-origin:0 0;box-sizing:border-box;width:600px;height:800px;overflow:hidden;display:flex;flex-direction:column;padding:14px 18px 16px;background:#F4F4F2 url(${PAPER}) center/cover no-repeat;color:#1F1D1A;font-family:'Source Serif 4',Georgia,serif;text-align:left;box-shadow:0 1px 2px rgba(30,30,30,.18),0 22px 38px -18px rgba(30,30,30,.4)}
.kr *,.kr *::before,.kr *::after{box-sizing:border-box}
.kr>*{flex:none}
.kr p,.kr h3,.kr h4,.kr figure{margin:0;padding:0}
.kr mark{background:linear-gradient(transparent 8%,rgba(255,226,64,.85) 8%,rgba(255,226,64,.85) 94%,transparent 94%);color:inherit;padding:0 2px;-webkit-box-decoration-break:clone;box-decoration-break:clone;mix-blend-mode:multiply}
.kr-folio{display:flex;align-items:baseline;gap:12px;padding-bottom:6px;border-bottom:1.5px solid #1F1D1A;font:600 13px/1 'Barlow Condensed','Arial Narrow',sans-serif}
.kr-folio b{font:700 15px/1 'Barlow Condensed','Arial Narrow',sans-serif;color:#D2232A}
.kr-folio-r{margin-left:auto;letter-spacing:.12em}
.kr-ph{position:relative;margin-top:14px!important}
.kr-ph img{display:block;width:100%;height:auto;filter:saturate(.92) contrast(1.03)}
.kr-cr{position:absolute;right:0;top:-13px;font:600 9px/1 'Barlow Condensed',sans-serif;letter-spacing:.06em;color:#4B463E}
.kr-ph figcaption{margin-top:4px;font:italic 400 11px/1.35 'Source Serif 4',Georgia,serif;color:#3A3630}
.kr-ph figcaption b{font-weight:600}
.kr-hl{margin-top:10px!important;font:600 40px/1.02 'Oswald','Arial Narrow',sans-serif;color:#1F1D1A;text-wrap:balance}
.kr-hl.kr-long{font-size:32px}
.kr-hl.kr-top{margin-top:12px!important}
.kr-arr{display:inline-block;width:20px;height:2px;background:#D2232A;position:relative;vertical-align:middle;margin-right:7px}
.kr-arr::after{content:"";position:absolute;right:-1px;top:-4px;border:5px solid transparent;border-left:7px solid #D2232A;border-right:0}
.kr-deck{font:300 15px/1.28 'Barlow',system-ui,sans-serif;color:#2B2925}
.kr-deck.kr-wide{margin-top:10px!important;font-size:17px}
.kr-byl{margin-top:8px!important;padding-top:6px!important;border-top:1px solid #1F1D1A;display:grid;gap:2px;font:600 11.5px/1.35 'Barlow Condensed',sans-serif}
.kr-byl span{display:flex;align-items:center;gap:6px;font-weight:500;color:#4B463E}
.kr-byl em{font:italic 400 10px/1.35 'Source Serif 4',Georgia,serif;color:#5A554C}
.kr-tri{width:0;height:0;border:5px solid transparent;border-left:7px solid #D2232A;border-right:0}
.kr-row{flex:1!important;min-height:0;display:grid;gap:14px;margin-top:10px}
.kr-col{min-height:0;overflow:hidden}
.kr-body{contain:size;overflow:hidden;column-count:2;column-fill:auto;column-gap:14px;column-rule:1px solid rgba(31,29,26,.18);font:400 11.5px/1.4 'Source Serif 4',Georgia,serif;text-align:justify;hyphens:manual}
.kr-body p{margin:0 0 .55em!important;orphans:1;widows:1}
.kr-body.kr-c1{column-count:1}
.kr-dc{float:left;font:600 38px/.8 'Oswald',sans-serif;margin:4px 7px 0 0}
.kr-sub{margin:.7em 0 .35em!important;font:700 11.5px/1.3 'Source Serif 4',Georgia,serif}
.kr-tab{display:inline-block;position:relative;padding:4px 10px 4px 8px;background:#D2232A;color:#fff;font:600 13px/1 'Barlow Condensed',sans-serif}
.kr-tab::after{content:"";position:absolute;left:10px;bottom:-8px;border:8px solid transparent;border-top:8px solid #D2232A;border-bottom:0}
.kr-n{display:block;margin-top:11px;font:500 34px/1 'Oswald',sans-serif;color:#D2232A}
.kr-u{display:block;font:600 17px/1.05 'Oswald',sans-serif}
.kr-fact p{margin-top:6px!important;font:400 11.5px/1.3 'Barlow',sans-serif}
.kr-g1{grid-template-columns:170px 1fr 116px}
.kr-g2{grid-template-columns:1fr 120px}
.kr-g4{grid-template-columns:180px 1fr}
.kr-hf{display:grid;grid-template-columns:1fr 128px;gap:14px;align-items:start;margin-top:10px}
.kr-hf .kr-hl{margin-top:0!important}
.kr-hf .kr-n{font-size:38px}
.kr.kr-ori{background:none;box-shadow:none;padding:0}
.kr-oriw{flex:1!important;min-height:0;display:flex;align-items:center;justify-content:center}
.kr-shot{position:relative;height:100%;max-width:100%;border:1px solid rgba(31,29,26,.12);border-radius:10px;overflow:hidden;box-shadow:0 2px 4px rgba(30,30,30,.08),0 18px 34px -16px rgba(30,30,30,.35);background:#fff}
.kr-shot img{display:block;width:100%;height:100%}
.kr-mk{position:absolute;background:rgba(255,214,109,.55);mix-blend-mode:multiply;border-radius:3px}
.kr-osz{position:relative;flex:none}
.kr-ocard{position:absolute;left:0;top:0;width:412px;transform-origin:0 0;padding:20px 22px 18px;background:#fff;border:1px solid rgba(31,29,26,.12);border-radius:10px;box-shadow:0 2px 4px rgba(30,30,30,.08),0 18px 34px -16px rgba(30,30,30,.35);color:#3F3F42}
.kr-ocard .kr-o-h{margin:0 0 10px!important;font:700 20px/24px 'Poppins',system-ui,sans-serif;color:#3F3F42;text-wrap:pretty}
.kr-ocard .kr-o-d{margin:10px 0 20px!important;font:400 14px/21px 'Work Sans',system-ui,sans-serif;color:#3F3F42}
.kr-ocard .kr-o-ph{margin:0!important}
.kr-ocard .kr-o-ph img{display:block;width:100%;height:auto;filter:none}
.kr-ocard .kr-o-ph figcaption{margin:10px 8px 0!important;font:400 14px/19px 'Work Sans',system-ui,sans-serif;font-style:normal;text-align:center;color:#3F3F42}
.kr-ocard .kr-o-p{margin:22px 0 0 10px!important;font:400 20px/27px 'Inter',system-ui,sans-serif;letter-spacing:-1px;color:#3F3F42}
.kr-ocard mark{background:rgba(255,214,109,.55);border-radius:3px;padding:0 2px;mix-blend-mode:normal}
.kr-src{margin-top:10px!important;text-align:center;font:600 13px/1.3 'Barlow Condensed',sans-serif;color:#4B463E}
.kr-src b{color:#1F1D1A}
`;
// --scope "#root": prefix every rule so the clipping wins over a host page's id-scoped resets (e.g. #root h3{…}).
const scope = opt('--scope', '');
const scoped = (css) => (scope ? css.split('\n').map((l) => { const i = l.indexOf('{'); return i > 0 && l.trim().startsWith('.kr') ? l.slice(0, i).split(',').map((sel) => `${scope} ${sel.trim()}`).join(',') + l.slice(i) : l; }).join('\n') : css);
const FIT = `(function(){function f(){document.querySelectorAll('.kr-osz').forEach(function(z){var c=z.firstElementChild,kr=z.closest('.kr'),src=kr.querySelector('.kr-src'),H=800-(src?src.offsetHeight+18:0)-8,s=Math.min(560/412,H/c.offsetHeight);c.style.transform='scale('+s+')';z.style.width=412*s+'px';z.style.height=c.offsetHeight*s+'px'});document.querySelectorAll('.kr-fit').forEach(function(b){var n=b.firstElementChild,k=Math.min(1,b.clientWidth/600);n.style.transform='scale('+k+')';b.style.height=800*k+'px'})}f();addEventListener('resize',f);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(f)})();`;

const arts = files.map(load);
if (preview) {
  const doc = `<!doctype html><html lang="ms"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Keratan akhbar — pratonton</title>
<link rel="stylesheet" href="${FONTS}"><style>body{margin:0;background:#FFF9EF;font-family:system-ui,sans-serif;color:#202039}.w{max-width:1000px;margin:0 auto;padding:24px 16px 60px}h1{font-size:24px}h2{font-size:17px;margin:34px 0 12px}.duo{display:grid;gap:24px}@media(min-width:720px){.duo{grid-template-columns:1fr 1fr}}${CSS}</style></head><body><div class="w"><h1>Keratan akhbar 600×800 — semua layout</h1>
${LAYOUTS.map((k) => `<h2>${k === 'ori' ? '★ ' : ''}${NAMA[k]} <code>--layout ${k}</code></h2><div class="duo">${arts.map((a) => ((k === 'ori' && !a.ori) || (k === 'ori-gambar' && !a.shotUri) ? '' : frame(a, k))).join('')}</div>`).join('\n')}
</div><script>${FIT}</script></body></html>`;
  writeFileSync(out, doc);
} else {
  writeFileSync(out, `<!-- keratan akhbar, layout ${layout} (${NAMA[layout]})${scope ? ', scope ' + scope : ''} -->\n<link rel="stylesheet" href="${layout === 'ori' ? FONTS_ORI : FONTS}">\n<style>${scoped(CSS)}</style>\n<div class="kr-set">${arts.map((a) => frame(a, layout)).join('\n')}</div>\n<script>${FIT}</script>\n`);
}
console.log(`ok ${out} (${(readFileSync(out).length / 1024).toFixed(0)} KB) ${preview ? 'semua layout' : 'layout ' + layout}, ${arts.length} artikel`);
