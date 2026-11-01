// Screenshot a news article straight from its HTML: headline, date, photo (+credit) and the lead paragraph only.
// Page chrome (Follow, share, font-size, promo box, ads, fixed bars) is hidden in the DOM before one capture,
// so the result is a real render of the page with nothing pasted on.
//   sh ~/.claude/tools/chrome-cdp.sh            (Chrome on CDP 9337)
//   node shot-berita.mjs <id> <url> <leadRegex> "<phrase>|<phrase>" [--out <dir>]
// Run from a project folder that has @playwright/test. Writes <out>/<id>.webp + <id>.json (crop size + highlight
// rects in CSS px; highlights are drawn later as an overlay, pixels stay untouched) and raw PNGs in <out>/raw/.
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { mkdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const pw = await import(createRequire(resolve(process.cwd(), 'x.js')).resolve('@playwright/test'));
const chromium = pw.chromium || pw.default.chromium;
const argv = process.argv.slice(2);
const oi = argv.indexOf('--out');
const OUTDIR = resolve(oi >= 0 ? argv.splice(oi, 2)[1] : 'assets/shots');
const [id, url, lead, phrases] = argv;
if (!phrases) { console.error('guna: node shot-berita.mjs <id> <url> <leadRegex> "<frasa>" [--out dir]'); process.exit(1); }
const OUT = OUTDIR + '/', RAW = OUTDIR + '/raw/';
mkdirSync(RAW, { recursive: true }); mkdirSync(OUT, { recursive: true });

const b = await chromium.connectOverCDP('http://127.0.0.1:9337');
const ctx = b.contexts()[0];
const p = await ctx.newPage();
try {
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 412, height: 915, deviceScaleFactor: 2, mobile: true });
  await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await p.waitForTimeout(4000);
  const geo = await p.evaluate(({ lead, phrases }) => {
    for (const el of document.querySelectorAll('body *')) {
      const cs = getComputedStyle(el);
      if (cs.position === 'fixed' || cs.position === 'sticky') el.style.setProperty('visibility', 'hidden', 'important');
    }
    const AD = /(^|[\s_-])(ats-|google_ads|adsbygoogle|div-gpt|inimage|teads|advert|ad-slot)/i;
    for (const el of document.querySelectorAll('iframe, ins, [id], [class]')) {
      const tag = el.tagName === 'IFRAME' || el.tagName === 'INS' || AD.test(el.id) || AD.test(String(el.className));
      if (tag && !el.querySelector('h1, p')) el.style.setProperty('visibility', 'hidden', 'important');
    }
    const h1 = document.querySelector('h1');
    const para = [...document.querySelectorAll('p')].find((e) => new RegExp(lead).test(e.innerText));
    const leaf = (re) => [...document.querySelectorAll('body *')].filter((e) => re.test((e.innerText || '').trim()) && ![...e.children].some((c) => re.test((c.innerText || '').trim())));
    const date = leaf(/\b\d{4}\b.*\d{1,2}:\d{2}\s*(am|pm)?/i)[0];
    const photo = [...document.querySelectorAll('img')].find((i) => { const r = i.getBoundingClientRect(); return r.width > 300 && r.top > h1.getBoundingClientRect().bottom && r.top < para.getBoundingClientRect().top; });
    const keys = [h1, date, photo, para].filter(Boolean);
    const block = (el) => { while (el.parentElement && !keys.some((k) => el.parentElement.contains(k))) el = el.parentElement; return el; };
    const chrome = [...leaf(/^Follow$/), ...leaf(/^Tambahkan pada Sumber/), ...leaf(/^A[-+]?$/), ...leaf(/^Untuk berita terkini/)];
    for (const m of leaf(/^Masa membaca/)) m.style.setProperty('display', 'none', 'important');
    const hidden = new Set();
    for (const c of chrome) { const b = block(c); if (!keys.some((k) => b.contains(k))) { b.style.setProperty('display', 'none', 'important'); hidden.add(b.tagName + '.' + String(b.className).slice(0, 30)); } }
    for (const a of document.querySelectorAll('a[href*="facebook.com/sharer"], a[href*="twitter.com/intent"], a[href*="x.com/intent"], a[href*="whatsapp"]')) { const b = block(a); if (!keys.some((k) => b.contains(k))) b.style.setProperty('display', 'none', 'important'); }
    const h1Top = h1.getBoundingClientRect().top;
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.height > 0 && r.bottom <= h1Top + 1 && r.bottom > h1Top - 140 && !keys.some((k) => el.contains(k))) el.style.setProperty('visibility', 'hidden', 'important');
    }
    window.__hidden = [...hidden];
    const top = Math.max(0, Math.round(h1.getBoundingClientRect().top + scrollY - 18));
    const bottom = Math.round(para.getBoundingClientRect().bottom + scrollY + 18);
    const walker = document.createTreeWalker(para, NodeFilter.SHOW_TEXT);
    const nodes = []; let all = '';
    for (let n; (n = walker.nextNode());) { nodes.push([n, all.length]); all += n.data; }
    const at = (i) => { let k = nodes.length - 1; while (k > 0 && nodes[k][1] > i) k--; return [nodes[k][0], i - nodes[k][1]]; };
    const rects = []; const missing = [];
    for (const ph of phrases) {
      const i = all.toLowerCase().indexOf(ph.toLowerCase());
      if (i < 0) { missing.push(ph); continue; }
      const r = document.createRange();
      r.setStart(...at(i)); r.setEnd(...at(i + ph.length));
      for (const c of r.getClientRects()) rects.push({ x: +(c.left).toFixed(1), y: +(c.top + scrollY - top).toFixed(1), w: +c.width.toFixed(1), h: +c.height.toFixed(1) });
    }
    return { hidden: window.__hidden, top, bottom, rects, missing, lead: para.innerText.slice(0, 240), h1: h1.innerText, docH: document.documentElement.scrollHeight };
  }, { lead, phrases: phrases.split('|') });
  const h = geo.bottom - geo.top;
  const rawTop = Math.max(0, geo.top - 160);
  await p.screenshot({ path: RAW + id + '.png', fullPage: true, clip: { x: 0, y: rawTop, width: 412, height: h + (geo.top - rawTop) + 200 } });
  await p.screenshot({ path: RAW + id + '-crop.png', fullPage: true, clip: { x: 0, y: geo.top, width: 412, height: h } });
  execFileSync('cwebp', ['-quiet', '-q', '86', RAW + id + '-crop.png', '-o', OUT + id + '.webp']);
  writeFileSync(OUT + id + '.json', JSON.stringify({ id, url, captured: new Date().toISOString(), w: 412, h, dpr: 2, rects: geo.rects }, null, 1));
  console.log(JSON.stringify({ id, hidden: geo.hidden, h1: geo.h1, h, rects: geo.rects.length, missing: geo.missing, lead: geo.lead }));
} finally {
  await p.close();
  process.exit(0);
}
