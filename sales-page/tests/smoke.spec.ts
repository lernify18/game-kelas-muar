// Smoke against the real local site served by Herd (http://misi3m.test). Override with SMOKE_URL.
import { test, expect } from '@playwright/test';

const URL = process.env.SMOKE_URL || 'http://misi3m.test/misi-pemulihan-3m-sales-page.html';
const SECTIONS = ['top-bar', 'hero', 'masalah', 'beza', 'demo', 'dapat', 'pakej', 'objection', 'impian', 'pembangun', 'bukti', 'cta', 'faq', 'footer'];

test('real page loads, every section renders, demo plays to the result card', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const res = await page.goto(URL, { waitUntil: 'networkidle' });
  expect(res?.status()).toBe(200);
  await expect(page).toHaveTitle(/Misi Pemulihan 3M/);
  for (const sec of SECTIONS) {
    const s = page.locator(`[data-sec="${sec}"]`);
    await s.scrollIntoViewIfNeeded();
    await expect(s).toBeVisible();
  }
  await expect(page.locator('a.m3-cta')).toHaveCount(3);

  await page.locator('#m3-demo').scrollIntoViewIfNeeded();
  await page.locator('.m3-syl[data-syl="ba"]').click();
  await page.locator('.m3-syl[data-syl="ju"]').click();
  await expect(page.locator('#m3-word')).toHaveText('baju');
  await page.locator('.m3-ch[data-v="6"]').click({ timeout: 5000 });
  await expect(page.locator('#m3-dres')).toBeVisible({ timeout: 5000 });
  await expect(page.locator('#m3-dscore')).toHaveText('2/2');
  expect(errors).toEqual([]);
});

test('real page: class photos and video load, news facts render, closing CTA returns to pricing', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(URL, { waitUntil: 'networkidle' });
  // Images are loading="lazy": bring each into view (a phone screen shows only one or two) and let it decode.
  const imgs = page.locator('[data-sec="pembangun"] img, [data-sec="bukti"] img');
  for (let i = 0; i < (await imgs.count()); i++) {
    await imgs.nth(i).scrollIntoViewIfNeeded();
    await imgs.nth(i).evaluate((im: HTMLImageElement) => (im.complete ? null : new Promise((r) => { im.onload = im.onerror = r; })));
  }
  const broken = await page.$$eval('[data-sec="pembangun"] img, [data-sec="bukti"] img', (imgs) =>
    imgs.filter((i) => !(i as HTMLImageElement).complete || (i as HTMLImageElement).naturalWidth === 0).map((i) => (i as HTMLImageElement).src),
  );
  expect(broken).toEqual([]);
  expect(await page.locator('[data-sec="bukti"] video').evaluate((v: HTMLVideoElement) => v.readyState)).toBeGreaterThan(0);
  await expect(page.locator('[data-sec="pembangun"] .kr-ocard')).toHaveCount(2);
  await expect(page.locator('[data-sec="pembangun"] .kr-src').first()).toContainText('Sinar Harian');

  await page.locator('a.m3-mini-pro').click();
  await expect(page.locator('#m3-pakej')).toBeInViewport();
  expect(errors).toEqual([]);
});
