// Builds the two deliverables from src/ and refuses to write them if an invariant breaks.
//   node tools/build.mjs          → misi-pemulihan-3m-sales-page.html + misi3m-elementor-embed.html
//                                   + dist/index.html (the Cloudflare assets folder, gitignored)
//   node tools/build.mjs --check  → exit 1 if the committed files differ from a fresh build
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { body, PLANS, FEATURES } from '../src/sections.mjs';

const dir = fileURLToPath(new URL('..', import.meta.url));
const R = '#misi3m-sales-root';
const FONTS = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@700;800&display=swap';

const css = readFileSync(dir + 'src/styles.css', 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\$R/g, R)
  .replace(/\n+/g, '\n')
  .trim();
const js = readFileSync(dir + 'src/app.js', 'utf8').trim();
const html = body().replace(/>\s+</g, '><');

const errors = [];
const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
const dup = ids.filter((v, i) => ids.indexOf(v) !== i);
if (dup.length) errors.push('duplicate ids: ' + [...new Set(dup)].join(', '));
const refs = new Set([...html.matchAll(/url\(#([^)]+)\)/g), ...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]));
const orphans = [...refs].filter((r) => !ids.includes(r) && r !== 'm3-starOff' && r !== 'm3-star');
for (const r of ['m3-star', 'm3-starOff']) if (!ids.includes(r)) orphans.push(r);
if (orphans.length) errors.push('orphan refs: ' + orphans.join(', '));
if (!ids.every((i) => i.startsWith('m3-') || i === 'misi3m-sales-root')) errors.push('ids must start with m3-');
const text = html.replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ');
const emoji = text.match(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu)?.filter((c) => !'©®™'.includes(c));
if (emoji?.length) errors.push('emoji in copy: ' + emoji.join(' '));
const banned = /refund|wang dikembalikan|jaminan wang|money.?back|guarantee|testimoni|no\.\s?1|terbukti|pasti lancar|\bIQ\b|confirm pandai|countdown/i;
if (banned.test(text)) errors.push('banned phrase: ' + text.match(banned)[0]);
for (const p of PLANS) {
  const sum = p.items.reduce((a, [, v]) => a + v, 0);
  if (sum !== p.ref) errors.push(`${p.key}: items sum RM${sum} ≠ reference RM${p.ref}`);
}
const worlds = FEATURES.reduce((a, f) => a + f.value, 0);
const catItem = PLANS[0].items.find(([t]) => t.startsWith('6 Kategori'));
if (!catItem || worlds !== catItem[1]) errors.push(`6 worlds sum RM${worlds} ≠ pricing "6 Kategori" RM${catItem?.[1]}`);
const ctas = [...html.matchAll(/<a\s[^>]*>/g)];
if (ctas.length !== 2 || !ctas.every((m) => /href="#"/.test(m[0]))) errors.push('expected exactly 2 anchors, both href="#"');
if (errors.length) {
  console.error('BUILD REFUSED\n- ' + errors.join('\n- '));
  process.exit(1);
}

const standalone = `<!doctype html>
<html lang="ms">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Misi Pemulihan 3M — Main, Belajar &amp; Jadi Hebat!</title>
<meta name="description" content="Game pendidikan interaktif untuk latihan membaca, menulis dan mengira (3M) anak 5–9 tahun. Main demo, lihat 6 dunia pembelajaran dan pilih pakej BASIC RM49 atau PRO RM89.">
<meta name="theme-color" content="#41258E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<style>html,body{margin:0;padding:0;background:#FFF9EF}html{-webkit-text-size-adjust:100%;text-size-adjust:100%}</style>
<style>
${css}
</style>
</head>
<body>
${html}
<script>
${js}
</script>
</body>
</html>
`;

const embed = `<!-- Misi Pemulihan 3M — sales page untuk widget HTML Elementor. Tampal keseluruhan fail ini. -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<style>
${css}
</style>
${html}
<script>
${js}
</script>
`;

const out = {
  'misi-pemulihan-3m-sales-page.html': standalone,
  'misi3m-elementor-embed.html': embed,
};
if (process.argv.includes('--check')) {
  const stale = Object.entries(out).filter(([f, s]) => !existsSync(dir + f) || readFileSync(dir + f, 'utf8') !== s);
  if (stale.length) {
    console.error('stale: ' + stale.map(([f]) => f).join(', ') + ' — run node tools/build.mjs');
    process.exit(1);
  }
  console.log('up to date');
} else {
  for (const [f, s] of Object.entries(out)) {
    writeFileSync(dir + f, s);
    console.log(`${f}: ${(Buffer.byteLength(s) / 1024).toFixed(1)} KB raw, ${(gzipSync(s).length / 1024).toFixed(1)} KB gzip`);
  }
  mkdirSync(dir + 'dist', { recursive: true });
  writeFileSync(dir + 'dist/index.html', standalone);
  console.log(`ids ${ids.length} unique · refs ${refs.size} resolved · anchors ${ctas.length}`);
}
