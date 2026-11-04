// Smoke against the real local site served by Herd (http://misi3m.test). Override with SMOKE_URL.
import { test, expect } from '@playwright/test';

const URL = process.env.SMOKE_URL || 'http://misi3m.test/misi-pemulihan-3m-sales-page.html';
const SECTIONS = ['top-bar', 'hero', 'masalah', 'fakta', 'beza', 'demo', 'siapa', 'dapat', 'pakej', 'objection', 'impian', 'pembangun', 'bukti', 'cta', 'faq', 'footer'];

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
  const imgs = page.locator('[data-sec="fakta"] img, [data-sec="pembangun"] img, [data-sec="bukti"] img');
  for (let i = 0; i < (await imgs.count()); i++) {
    await imgs.nth(i).scrollIntoViewIfNeeded();
    await imgs.nth(i).evaluate((im: HTMLImageElement) => (im.complete ? null : new Promise((r) => { im.onload = im.onerror = r; })));
  }
  const broken = await page.$$eval('[data-sec="fakta"] img, [data-sec="pembangun"] img, [data-sec="bukti"] img', (imgs) =>
    imgs.filter((i) => !(i as HTMLImageElement).complete || (i as HTMLImageElement).naturalWidth === 0).map((i) => (i as HTMLImageElement).src),
  );
  expect(broken).toEqual([]);
  expect(await page.locator('[data-sec="bukti"] video').evaluate((v: HTMLVideoElement) => v.readyState)).toBeGreaterThan(0);
  await expect(page.locator('[data-sec="fakta"] .kr-ocard')).toHaveCount(2);
  await expect(page.locator('[data-sec="fakta"] .kr-src').first()).toContainText('Sinar Harian');

  await page.locator('a.m3-mini-pro').click();
  await expect(page.locator('#m3-pakej')).toBeInViewport();
  expect(errors).toEqual([]);
});

// Safari (every iPhone browser) will not play a video whose server ignores Range. Cloudflare Static Assets
// answers 200 with the whole file, so the Worker in worker/ must turn these into 206 Partial Content.
test('real page: class video is served with byte ranges (206) so iPhone Safari can play it', async ({ page, request }) => {
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  const src = await page.locator('[data-sec="bukti"] video').evaluate((v: HTMLVideoElement) => v.currentSrc || v.src);
  const full = await request.get(src);
  expect(full.status()).toBe(200);
  expect(full.headers()['accept-ranges']).toBe('bytes');
  const whole = await full.body();

  const head = await request.get(src, { headers: { Range: 'bytes=0-99' } });
  expect(head.status()).toBe(206);
  expect(head.headers()['content-range']).toBe(`bytes 0-99/${whole.length}`);
  expect(Buffer.compare(await head.body(), whole.subarray(0, 100))).toBe(0);

  const tail = await request.get(src, { headers: { Range: `bytes=${whole.length - 50}-` } });
  expect(tail.status()).toBe(206);
  expect(Buffer.compare(await tail.body(), whole.subarray(whole.length - 50))).toBe(0);

  const past = await request.get(src, { headers: { Range: `bytes=${whole.length + 10}-` } });
  expect(past.status()).toBe(416);
});
