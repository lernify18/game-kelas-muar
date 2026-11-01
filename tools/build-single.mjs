// Gabungkan index.html + src/*.css/js + sfx/*.mp3 menjadi SATU fail HTML (dist/misi-pemulihan-3m.html)
// supaya game boleh dibuka luar talian, dikongsi, atau ditampal ke platform satu-fail (Canva Code, Sellhiz).
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (p) => readFileSync(root + p, 'utf8');
let html = read('index.html');

html = html.replace(/<link rel="stylesheet" href="(src\/[^"]+)">/g, (_, p) => `<style>\n${read(p)}\n</style>`);
const sfx = Object.fromEntries(readdirSync(root + 'sfx').filter((f) => f.endsWith('.mp3')).map((f) => [f.replace('.mp3', ''), 'data:audio/mpeg;base64,' + readFileSync(root + 'sfx/' + f).toString('base64')]));
html = html.replace('<script src="src/art-kb.js"></script>', `<script>window.SFX_DATA=${JSON.stringify(sfx)};</script>\n  <script src="src/art-kb.js"></script>`);
html = html.replace(/<script src="(src\/[^"]+)"><\/script>/g, (_, p) => `<script>\n${read(p).replace(/<\/script/gi, '<\\/script')}\n</script>`);

mkdirSync(root + 'dist', { recursive: true });
writeFileSync(root + 'dist/misi-pemulihan-3m.html', html);
writeFileSync(root + 'dist/index.html', html);
console.log(`dist/misi-pemulihan-3m.html ${(html.length / 1024).toFixed(0)} KB (${Object.keys(sfx).length} bunyi)`);
