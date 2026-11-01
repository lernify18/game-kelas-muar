// Smoke against the real local site served by Herd (http://misi3m.test). Override with SMOKE_URL.
import { test, expect } from '@playwright/test';

const URL = process.env.SMOKE_URL || 'http://misi3m.test/misi-pemulihan-3m-sales-page.html';

test('real page loads, every section renders, demo plays to the result card', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const res = await page.goto(URL, { waitUntil: 'networkidle' });
  expect(res?.status()).toBe(200);
  await expect(page).toHaveTitle(/Misi Pemulihan 3M/);
  for (const sec of ['top-bar', 'hero', 'masalah', 'beza', 'demo', 'dapat', 'pakej', 'footer']) {
    const s = page.locator(`[data-sec="${sec}"]`);
    await s.scrollIntoViewIfNeeded();
    await expect(s).toBeVisible();
  }
  await expect(page.locator('a.m3-cta')).toHaveCount(2);

  await page.locator('#m3-demo').scrollIntoViewIfNeeded();
  await page.locator('.m3-syl[data-syl="ba"]').click();
  await page.locator('.m3-syl[data-syl="ju"]').click();
  await expect(page.locator('#m3-word')).toHaveText('baju');
  await page.locator('.m3-ch[data-v="6"]').click({ timeout: 5000 });
  await expect(page.locator('#m3-dres')).toBeVisible({ timeout: 5000 });
  await expect(page.locator('#m3-dscore')).toHaveText('2/2');
  expect(errors).toEqual([]);
});
