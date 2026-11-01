// Smoke: game dibuka, semua skrin & butang navigasi hidup, tiada ralat konsol, tiada limpahan mendatar di telefon.
import { test, expect } from '@playwright/test';
import { startFresh } from './helpers.mjs';

const CATS = ['huruf', 'sukukata', 'perkataan', 'ayat', 'nombor', 'matematik'];

test('smoke: welcome → profil → peta → 6 kategori → album → laporan → tetapan', async ({ page }) => {
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto('/index.html?test=1');
  await expect(page.getByRole('heading', { name: 'Jom Mulakan Pengembaraan!' })).toBeVisible();
  await expect(page.locator('[data-act="settings"]')).toBeVisible();
  await startFresh(page);
  await expect(page.getByRole('heading', { name: 'Hai Aina! Jom Jadi Hebat!' })).toBeVisible();
  await expect(page.locator('.isle')).toHaveCount(6);
  for (const c of CATS) {
    await page.locator(`.isle[data-cat="${c}"]`).click();
    await expect(page.locator('.lvl')).toHaveCount(3);
    await expect(page.locator('.tmr')).toHaveCount(3);
    await page.locator('.top-bar [data-act="map"]').first().click();
  }
  await page.locator('.tabbar [data-act="album"]').click();
  await expect(page.locator('.st-slot')).toHaveCount(24);
  await page.locator('.tabbar [data-act="report"]').click();
  await expect(page.locator('.gate')).toBeVisible();
  await page.locator('.tabbar [data-act="settings"]').click();
  await expect(page.locator('[data-act="setLang"]')).toHaveCount(2);
  await page.locator('.tabbar [data-act="map"]').click();
  await expect(page.locator('.scr.map')).toBeVisible();
  expect(errs).toEqual([]);
});

test('smoke telefon 375px: tiada limpahan mendatar pada peta, kategori dan soalan', async ({ browser }) => {
  const ctx = await browser.newContext({ baseURL: test.info().project.use.baseURL, viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  await startFresh(page);
  const overflow = () => page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  expect(await overflow()).toBeLessThanOrEqual(0);
  await page.locator('.isle[data-cat="ayat"]').click();
  expect(await overflow()).toBeLessThanOrEqual(0);
  await page.locator('[data-act="level"][data-v="3"]').click();
  await page.locator('[data-act="play"]').click();
  await page.locator('.qcard .qmech > *').first().waitFor();
  expect(await overflow()).toBeLessThanOrEqual(0);
  const box = await page.locator('.qcard').boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(375);
  await ctx.close();
});
