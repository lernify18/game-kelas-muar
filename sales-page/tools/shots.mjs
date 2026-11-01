// Section screenshots at the five QA widths, for visual review.
//   node tools/shots.mjs [url|-] [widths=375,430,768,1024,1440]   (- = built-in local server)
// Writes .tmp/shots/<width>-<section>.png and prints horizontal overflow + console errors.
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { serve } from './serve.mjs';

const dir = fileURLToPath(new URL('..', import.meta.url));
const srv = process.argv[2] && process.argv[2] !== '-' ? null : await serve(dir);
const url = srv ? srv.url + '/misi-pemulihan-3m-sales-page.html' : process.argv[2];
const widths = (process.argv[3] || '375,430,768,1024,1440').split(',').map(Number);
const out = dir + '.tmp/shots/';
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
for (const w of widths) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: w < 800 ? 2 : 1 });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.querySelectorAll('.m3-rv').forEach((n) => n.classList.add('m3-in')));
  const secs = await page.$$eval('[data-sec]', (n) => n.map((x) => x.getAttribute('data-sec')));
  for (const s of secs) {
    await page.locator(`[data-sec="${s}"]`).screenshot({ path: `${out}${w}-${s}.png`, animations: 'disabled' });
  }
  const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log(`${w}px: overflow ${over}px · errors ${errs.length}${errs.length ? ' → ' + errs.join(' | ') : ''}`);
  await page.close();
}
await browser.close();
srv?.close();
