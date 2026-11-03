// Tema kids (pilihan A Ubai, 2026-11-03, artifact THaycyHTgbfkmUtMoJJewU): sales page guna font dan palet game.
import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { serve } from '../tools/serve.mjs';

const dir = fileURLToPath(new URL('..', import.meta.url));
const PAGE = '/misi-pemulihan-3m-sales-page.html';

let srv: { url: string; close: () => void };
test.beforeAll(async () => {
  srv = await serve(dir, '127.0.0.1');
});
test.afterAll(() => srv.close());

async function open(page: Page) {
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  await page.goto(srv.url + PAGE);
}

const firstFamily = (page: Page, sel: string) =>
  page.$$eval(sel, (els) => els.map((e) => getComputedStyle(e).fontFamily.split(',')[0].replace(/["']/g, '').trim()));

test('tajuk, butang, harga dan bar atas guna Fredoka; tiada Plus Jakarta Sans', async ({ page }) => {
  await open(page);
  for (const sel of ['.m3-h1', '.m3-h2', '.m3-h3', '.m3-top p', '.m3-cta', '.m3-now', '.m3-mini-p', '.m3-mini-go', '.m3-faq summary', '.m3-eyebrow']) {
    const fams = await firstFamily(page, sel);
    expect(fams.length, sel).toBeGreaterThan(0);
    expect(new Set(fams), sel).toEqual(new Set(['Fredoka']));
  }
  expect(await firstFamily(page, '.m3-lead, .m3-sub')).not.toContain('Fredoka');
  const jakarta = await page.$$eval('#misi3m-sales-root *', (els) =>
    els.filter((e) => /Plus Jakarta/i.test(getComputedStyle(e).fontFamily)).map((e) => e.className));
  expect(jakarta).toEqual([]);
  for (const f of ['misi-pemulihan-3m-sales-page.html', 'misi3m-elementor-embed.html']) {
    expect(readFileSync(dir + f, 'utf8')).not.toContain('Plus+Jakarta+Sans');
  }
});

test('palet game: bar atas dan CTA penutup lavender, bukan indigo gelap', async ({ page }) => {
  await open(page);
  const bg = (sel: string) => page.$eval(sel, (e) => { const s = getComputedStyle(e); return s.backgroundImage + ' ' + s.backgroundColor; });
  for (const sel of ['.m3-top', '.m3-end']) {
    const v = await bg(sel);
    expect(v, sel).toContain('rgb(106, 72, 208)');
    expect(v, sel).not.toMatch(/rgb\(65, 37, 142\)|rgb\(42, 24, 104\)/);
  }
  expect(await page.$eval('.m3-h1', (e) => getComputedStyle(e).color)).toBe('rgb(42, 27, 69)');
});

test('butang CTA pil candy dan kad bulat 24 px macam game', async ({ page }) => {
  await open(page);
  const radius = (sel: string) => page.$$eval(sel, (els) => els.map((e) => parseFloat(getComputedStyle(e).borderTopLeftRadius)));
  for (const r of await radius('.m3-cta, .m3-mini-go')) expect(r).toBeGreaterThanOrEqual(999);
  for (const r of await radius('.m3-strip li, .m3-step, .m3-pcard')) expect(r).toBe(24);
  const shadow = await page.$eval('.m3-plan:not(.m3-plan-pro):not(.m3-plan-usahawan) .m3-cta', (e) => getComputedStyle(e).boxShadow);
  expect(shadow).toContain('rgb(78, 47, 176) 0px 7px 0px');
});

test('teks putih atas latar ungu kekal boleh dibaca @sedia-ada', async ({ page }) => {
  await open(page);
  const worst = await page.evaluate(() => {
    const lum = (c: number[]) => {
      const [r, g, b] = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const rgbs = (s: string) => [...s.matchAll(/rgba?\((\d+), (\d+), (\d+)/g)].map((m) => [+m[1], +m[2], +m[3]]);
    const out: Record<string, number> = {};
    for (const [text, box] of [['.m3-top p', '.m3-top'], ['.m3-end .m3-h2', '.m3-end'], ['.m3-end .m3-sub', '.m3-end'], ['.m3-end .m3-fine', '.m3-end']]) {
      const t = document.querySelector(text);
      if (!t) continue;
      const fg = lum(rgbs(getComputedStyle(t).color)[0]);
      const s = getComputedStyle(document.querySelector(box)!);
      const stops = rgbs(s.backgroundImage).concat(s.backgroundImage === 'none' ? rgbs(s.backgroundColor) : []);
      out[text] = Math.min(...stops.map((c) => { const l = lum(c); return (Math.max(l, fg) + 0.05) / (Math.min(l, fg) + 0.05); }));
    }
    return out;
  });
  expect(Object.keys(worst).length).toBe(4);
  for (const [k, v] of Object.entries(worst)) expect(v, k).toBeGreaterThanOrEqual(k.includes('h2') ? 3 : 4.5);
});
