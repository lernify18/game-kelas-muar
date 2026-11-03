// E2E for the sections below pricing (brief 2B). Hermetic: served from this folder on an OS port, Google Fonts
// answered with empty CSS. Risky logic asserted: plan + commission money, value stacks that must equal pricing,
// news facts rendered from assets/fakta/*.json inside their fixed frame, closing CTA returning to pricing.
import { test, expect, type Page } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { serve } from '../tools/serve.mjs';

const dir = fileURLToPath(new URL('..', import.meta.url));
const PAGE = '/misi-pemulihan-3m-sales-page.html';
const FAKTA = readdirSync(dir + 'assets/fakta').filter((f) => f.endsWith('.json')).sort().reverse()
  .map((f) => JSON.parse(readFileSync(dir + 'assets/fakta/' + f, 'utf8')));

let srv: { url: string; close: () => void };
test.beforeAll(async () => { srv = await serve(dir); });
test.afterAll(() => srv.close());

async function open(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  await page.goto(srv.url + PAGE);
  return errors;
}
const money = (s: string) => Number(s.replace(/[^\d.]/g, ''));

test('USAHAWAN plan: value stack, price and 100% of each sale follow BASIC/PRO prices', async ({ page }) => {
  const errors = await open(page);
  const plan = page.locator('.m3-plan-usahawan');
  const sum = await plan.locator('li[data-v]').evaluateAll((l) => l.reduce((a, x) => a + Number(x.getAttribute('data-v')), 0));
  expect(sum).toBe(1876);
  await expect(plan.locator('.m3-ref s')).toHaveText('RM1,876');
  await expect(plan.locator('.m3-now')).toHaveText('RM299');
  await expect(plan.locator('li', { hasText: 'Semua yang ada dalam PRO' })).toHaveAttribute('data-v', '289');
  await expect(plan.locator('li', { hasText: 'Modul Run Ads Reseller' })).toHaveAttribute('data-v', '297');
  // Sellhiz Starter is RM299 for 12 months on the public plan list (sellhiz.win/api/plans, 2026-11-03).
  await expect(plan.locator('li', { hasText: 'Website E-Dagang Sellhiz 1 Tahun' })).toHaveAttribute('data-v', '299');
  await expect(plan.locator('.m3-earn-h')).toHaveText('100% hasil jualan masuk akaun anda');
  const basic = money(await page.locator('.m3-plan-basic .m3-now').innerText());
  const pro = money(await page.locator('.m3-plan-pro .m3-now').innerText());
  const rows = await plan.locator('.m3-earn-row b').allInnerTexts();
  expect(rows.map(money)).toEqual([basic, pro]);
  const n = Math.floor(299 / pro) + 1;
  await expect(plan.locator('.m3-earn-n')).toContainText(`${n} jualan PRO = RM${(n * pro).toFixed(2)}`);
  expect(n * pro).toBeGreaterThan(299);
  expect((n - 1) * pro).toBeLessThanOrEqual(299);
  await expect(plan.locator('.m3-micro')).toHaveText('Akses modul + kedai e-dagang 1 tahun');
  await expect(plan.locator('a.m3-cta')).toHaveAttribute('href', '#');
  expect(await page.locator('#misi3m-sales-root').innerText()).not.toMatch(/\b80%|komisyen 80/i);
  expect(errors).toEqual([]);
});

test('objection and dream result: RM numbers agree with the pricing table', async ({ page }) => {
  const errors = await open(page);
  await expect(page.locator('.m3-cost-row')).toHaveCount(4);
  await expect(page.locator('.m3-value s')).toHaveText('RM289');
  await expect(page.locator('.m3-value b')).toHaveText('RM89');
  await expect(page.locator('.m3-plan-pro .m3-ref s')).toHaveText('RM289');
  await expect(page.locator('.m3-but')).toHaveCount(5);
  const us = page.locator('.m3-but-us');
  await expect(us).toHaveCount(1);
  await expect(us.locator('.m3-but-k')).toHaveText('PAKEJ USAHAWAN');
  await expect(us).toContainText('Modul Run Ads Reseller');
  await expect(page.locator('.m3-but').last()).toHaveClass(/m3-but-us/);

  const dream = page.locator('.m3-vstack [data-v]');
  await expect(dream).toHaveCount(3);
  for (const row of await dream.all()) {
    const title = (await row.locator('span').innerText()).trim();
    const v = await row.getAttribute('data-v');
    await expect(page.locator('.m3-plan-pro li', { hasText: title })).toHaveAttribute('data-v', v!);
  }
  const total = await dream.evaluateAll((r) => r.reduce((a, x) => a + Number(x.getAttribute('data-v')), 0));
  await expect(page.locator('.m3-vstack-sum b')).toHaveText(`RM${total}`);
  await expect(page.locator('[data-sec="impian"] svg.m3-dev')).toHaveAttribute('aria-label', /Laporan Ibu Bapa/);
  expect(errors).toEqual([]);
});

test('news facts: own section after the problems, built from the JSON, inside the 600×800 frame, photo uncropped, no links', async ({ page }) => {
  const errors = await open(page);
  const sec = page.locator('[data-sec="fakta"]');
  await expect(sec).toHaveCount(1);
  expect(await sec.evaluate((s) => s.previousElementSibling?.getAttribute('data-sec'))).toBe('masalah');
  await expect(sec.locator('h2')).toContainText('Belum Kuasai 3M');
  await expect(page.locator('[data-sec="pembangun"] .kr-ocard')).toHaveCount(0);
  await expect(page.locator('[data-sec="pembangun"] .m3-quote')).toHaveCount(1);
  await sec.scrollIntoViewIfNeeded();
  const cards = sec.locator('.kr-ocard');
  await expect(cards).toHaveCount(FAKTA.length);
  for (let i = 0; i < FAKTA.length; i++) {
    const a = FAKTA[i];
    await cards.nth(i).scrollIntoViewIfNeeded();
    await expect(cards.nth(i).locator('.kr-o-h')).toHaveText(a.tajuk);
    await expect(cards.nth(i).locator('.kr-o-d')).toHaveText(a.ori.masa);
    await expect(cards.nth(i).locator('mark')).toHaveText(a.ori.petikan.match(/<mark>(.*?)<\/mark>/)[1]);
    await expect(sec.locator('.kr-src').nth(i)).toHaveText(`Sumber: ${a.sumber}, ${a.tarikh.split(', ').pop()}`);
    const geo = await cards.nth(i).evaluate((c) => {
      const kr = c.closest('.kr')!.getBoundingClientRect(), r = c.getBoundingClientRect();
      const img = c.querySelector('img')!;
      return { inside: r.top >= kr.top - 1 && r.bottom <= kr.bottom + 1 && r.left >= kr.left - 1 && r.right <= kr.right + 1,
        crop: Math.abs(img.clientWidth / img.clientHeight - img.naturalWidth / img.naturalHeight), ratio: kr.height / kr.width };
    });
    expect(geo.inside).toBe(true);
    expect(geo.crop).toBeLessThan(0.01);
    expect(geo.ratio).toBeCloseTo(800 / 600, 2);
  }
  await expect(sec.locator('a')).toHaveCount(0);
  await expect(sec).toContainText('bukan produk rasmi atau diperakui oleh KPM');
  expect(errors).toEqual([]);
});

test('class proof: 8 photos and the video load; reduced motion stops autoplay', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const errors = await open(page);
  const imgs = page.locator('[data-sec="bukti"] img');
  await expect(imgs).toHaveCount(8);
  for (const im of await imgs.all()) {
    await im.scrollIntoViewIfNeeded();
    await im.evaluate((x: HTMLImageElement) => (x.complete ? null : new Promise((r) => { x.onload = x.onerror = r; })));
    expect(await im.evaluate((x: HTMLImageElement) => x.naturalWidth)).toBeGreaterThan(0);
  }
  expect(await imgs.evaluateAll((xs) => xs.every((x) => /\/kelas31-[a-z]+\.webp$/.test((x as HTMLImageElement).src)))).toBe(true);
  const v = page.locator('[data-sec="bukti"] video');
  await expect(v).toHaveAttribute('poster', 'assets/img/kelas-31okt-poster.webp');
  await expect(v).toHaveAttribute('src', 'assets/img/kelas-31okt.mp4');
  await expect(page.locator('[data-sec="bukti"] .m3-sub')).toContainText('31 Oktober 2026');
  expect(await v.evaluate((x: HTMLVideoElement) => ({ paused: x.paused, controls: x.controls, auto: x.hasAttribute('autoplay') }))).toEqual({ paused: true, controls: true, auto: false });
  expect(errors).toEqual([]);
});

test('closing CTA: every package card returns to the pricing table', async ({ page }) => {
  const errors = await open(page);
  const minis = page.locator('[data-sec="cta"] a.m3-mini-b');
  await expect(minis).toHaveCount(3);
  await expect(minis.nth(2).locator('.m3-mini-d')).toHaveText('Semua PRO + kedai sendiri, 100% hasil');
  for (const [i, price] of ['49', '89', '299'].entries()) {
    await expect(minis.nth(i).locator('.m3-mini-p')).toHaveText(`RM${price}`);
    await minis.nth(i).scrollIntoViewIfNeeded();
    await minis.nth(i).click();
    await expect(page.locator('#m3-pakej')).toBeInViewport();
  }
  expect(errors).toEqual([]);
});

test('FAQ: 13 questions, first open, any can be opened, USAHAWAN answers match the 100% offer', async ({ page }) => {
  const errors = await open(page);
  const items = page.locator('[data-sec="faq"] details');
  await expect(items).toHaveCount(13);
  const hasil = items.filter({ hasText: 'Macam mana saya dapat 100% hasil jualan?' });
  await expect(hasil).toHaveCount(1);
  await expect(hasil.locator('p')).toContainText('tolak caj gateway anda sendiri', { useInnerText: false });
  await expect(items.filter({ hasText: 'selepas 1 tahun' })).toHaveCount(1);
  await expect(items.first()).toHaveAttribute('open', '');
  await items.nth(9).locator('summary').scrollIntoViewIfNeeded();
  await items.nth(9).locator('summary').click();
  await expect(items.nth(9)).toHaveAttribute('open', '');
  await expect(items.nth(9).locator('p')).toBeVisible();
  expect(errors).toEqual([]);
});

for (const width of [375, 1440]) {
  test(`new sections at ${width}px: no sideways scroll, facts frames scale down`, async ({ page, isMobile }) => {
    test.skip(isMobile, 'width sweep runs in the desktop browsers');
    await page.setViewportSize({ width, height: 900 });
    await open(page);
    await page.locator('[data-sec="fakta"]').scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
    const grid = (await page.locator('.m3-buts').boundingBox())!.width;
    expect(Math.abs((await page.locator('.m3-but-us').boundingBox())!.width - grid)).toBeLessThan(2);
    const w = (await page.locator('.kr-fit').first().boundingBox())!.width;
    expect(w).toBeLessThanOrEqual(Math.min(600, width) + 1);
  });
}
