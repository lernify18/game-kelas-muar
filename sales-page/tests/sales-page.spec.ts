// E2E for the Misi Pemulihan 3M sales page. Hermetic: served from this folder on an OS port,
// Google Fonts answered with empty CSS, nothing else leaves the machine.
import { test, expect, type Page, type Locator } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { serve } from '../tools/serve.mjs';

const dir = fileURLToPath(new URL('..', import.meta.url));
const PAGE = '/misi-pemulihan-3m-sales-page.html';
const FLOW = ['top-bar', 'hero', 'masalah', 'fakta', 'beza', 'demo', 'siapa', 'dapat', 'pakej', 'objection', 'impian', 'pembangun', 'bukti', 'cta', 'faq', 'footer'];

const hostPage = () => `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>*{box-sizing:content-box}body{font-family:Georgia,serif;margin:0}h1,h2,h3{color:rgb(200,0,0);font-size:60px;text-transform:uppercase;margin:2em 0}
a{color:rgb(0,128,0);text-decoration:underline}button{background:#000;color:#fff;padding:20px;border-radius:0}ul{list-style:disc;margin:2em}p{color:rgb(1,2,3);margin:3em 0}
svg{width:100px}.elementor-widget-container{padding:0 15px}</style>
<script>window.__k0 = Object.keys(window);</script></head><body>
<p class="theme-p">Teks tema WordPress</p><div class="elementor-widget-container">${readFileSync(dir + 'misi3m-elementor-embed.html', 'utf8')}</div></body></html>`;

let srv: { url: string; close: () => void };
test.beforeAll(async () => {
  srv = await serve(dir, '127.0.0.1', { '/wp-host.html': hostPage });
});
test.afterAll(() => srv.close());

async function open(page: Page, path = PAGE) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  await page.goto(srv.url + path);
  return errors;
}

async function toDemo(page: Page) {
  await page.locator('#m3-demo').scrollIntoViewIfNeeded();
  await expect(page.locator('#m3-demo')).toHaveClass(/m3-on/);
}

async function drag(page: Page, from: Locator, to: Locator) {
  // Press at a person's pace, after the reflow has been painted. WebKit (iPhone profile) hit-tests the press
  // against the last committed frame: pressing ~40 ms after "ba" left the tray landed on "mi", not "ju".
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  await page.waitForTimeout(100);
  const a = (await from.boundingBox())!;
  const b = (await to.boundingBox())!;
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
  await page.mouse.down();
  await page.mouse.move(a.x + a.width / 2 + 12, a.y + a.height / 2 + 8, { steps: 3 });
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 12 });
  await page.mouse.up();
}

const syl = (page: Page, s: string) => page.locator(`.m3-syl[data-syl="${s}"]`);
const slot = (page: Page, i: number) => page.locator('.m3-slot').nth(i);

test('flow, guardrails and honest pricing', async ({ page }) => {
  const errors = await open(page);
  expect(await page.$$eval('[data-sec]', (n) => n.map((x) => x.getAttribute('data-sec')))).toEqual(FLOW);

  const pinned = await page.$$eval('#misi3m-sales-root *', (els) =>
    els.filter((e) => ['fixed', 'sticky'].includes(getComputedStyle(e).position)).map((e) => e.className),
  );
  expect(pinned).toEqual([]);
  await expect(page.locator('#misi3m-sales-root nav')).toHaveCount(0);

  const anchors = page.locator('#misi3m-sales-root a');
  await expect(anchors).toHaveCount(6);
  await expect(page.locator('[data-sec="pakej"] a.m3-cta')).toHaveCount(3);
  await expect(page.locator('[data-sec="pakej"] a.m3-cta').nth(0)).toHaveText('SAYA NAK PAKEJ BASIC — RM49');
  await expect(page.locator('[data-sec="pakej"] a.m3-cta').nth(1)).toHaveText('SAYA NAK PAKEJ PRO — RM89');
  await expect(page.locator('[data-sec="pakej"] a.m3-cta').nth(2)).toHaveText('SAYA NAK PAKEJ USAHAWAN — RM299');
  expect(await anchors.evaluateAll((a) => a.map((x) => x.getAttribute('href')))).toEqual(['#', '#', '#', '#m3-pakej', '#m3-pakej', '#m3-pakej']);
  expect(await page.$$eval('#misi3m-sales-root button', (b) => b.every((x) => x.closest('[data-sec="demo"]')))).toBe(true);

  const text = (await page.locator('#misi3m-sales-root').textContent()) ?? '';
  expect(text).not.toMatch(/refund|wang dikembalikan|jaminan wang|money.?back|guarantee|testimoni|terbukti|pasti lancar|countdown/i);
  expect((text.match(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu) ?? []).filter((c) => !'©®™'.includes(c))).toEqual([]);
  expect(text).toContain('Produk ini bukan produk rasmi atau diperakui oleh KPM.');
  await expect(page.locator('[data-m3-year]')).toHaveText(String(new Date().getFullYear()));

  for (const [key, ref, price] of [['basic', 149, 49], ['pro', 289, 89]] as const) {
    const plan = page.locator(`.m3-plan-${key}`);
    const sum = await plan.locator('li[data-v]').evaluateAll((l) => l.reduce((a, x) => a + Number(x.getAttribute('data-v')), 0));
    expect(sum).toBe(ref);
    await expect(plan.locator('.m3-ref s')).toHaveText(`RM${ref}`);
    await expect(plan.locator('.m3-now')).toHaveText(`RM${price}`);
    await expect(plan.locator('.m3-micro')).toHaveText('Akses digital • Belajar melalui telefon, tablet atau komputer');
  }
  const worlds = await page.locator('[data-sec="dapat"] .m3-val b').allTextContents();
  expect(worlds).toEqual(['RM9', 'RM10', 'RM10', 'RM10', 'RM9', 'RM11']);
  const catValue = await page.locator('.m3-plan-basic li', { hasText: '6 Kategori Pembelajaran 3M' }).getAttribute('data-v');
  expect(worlds.reduce((a, t) => a + Number(t.slice(2)), 0)).toBe(Number(catValue));

  const refs = await page.evaluate(() => {
    const html = document.getElementById('misi3m-sales-root')!.outerHTML;
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
    const used = [...html.matchAll(/url\(#([^)]+)\)|href="#([^"]+)"/g)].map((m) => m[1] || m[2]);
    return { dup: ids.filter((v, i) => ids.indexOf(v) !== i), orphan: used.filter((u) => !ids.includes(u)) };
  });
  expect(refs).toEqual({ dup: [], orphan: [] });
  expect(errors).toEqual([]);
});

test('siapa: six personas right before what the customer gets, each with a benefit and a dream, USAHAWAN last', async ({ page }) => {
  const errors = await open(page);
  const sec = page.locator('[data-sec="siapa"]');
  expect(await sec.evaluate((s) => s.nextElementSibling?.getAttribute('data-sec'))).toBe('dapat');
  await expect(sec.locator('h2')).toContainText('Sesuai Untuk Siapa');
  const cards = sec.locator('.m3-who');
  await expect(cards).toHaveCount(6);
  for (const c of await cards.all()) {
    await expect(c.locator('h3')).not.toBeEmpty();
    await expect(c.locator('svg.m3-ic')).toHaveCount(1);
    await expect(c.locator('.m3-who-m b')).toHaveText('Manfaat:');
    await expect(c.locator('.m3-who-i b')).toHaveText('Impian:');
  }
  const us = cards.last();
  await expect(us).toHaveClass(/m3-who-us/);
  await expect(us.locator('.m3-but-k')).toHaveText('PAKEJ USAHAWAN');
  await expect(us).toContainText('100% hasil jualan');
  await expect(sec.locator('a, button')).toHaveCount(0);
  await expect(sec).toContainText('bukan pengganti guru');
  expect(errors).toEqual([]);
});

test('demo by drag: wrong card returns, right cards snap, retry costs a point', async ({ page }) => {
  const errors = await open(page);
  await toDemo(page);
  const hand = page.locator('#m3-dhand');
  await expect(hand).toHaveClass(/is-on/, { timeout: 4000 });
  expect(await hand.evaluate((h) => getComputedStyle(h).pointerEvents)).toBe('none');

  await drag(page, syl(page, 'mi'), slot(page, 0));
  await expect(page.locator('#m3-dtoast')).toHaveText('Cuba lagi!');
  await expect(page.locator('.m3-tray [data-syl="mi"]')).toHaveCount(1);
  await expect(slot(page, 0)).not.toHaveClass(/is-filled/);
  await expect(hand).not.toHaveClass(/is-on/);

  await drag(page, syl(page, 'ba'), slot(page, 0));
  await expect(slot(page, 0).locator('[data-syl="ba"]')).toHaveCount(1);
  await drag(page, syl(page, 'ju'), slot(page, 1));
  await expect(slot(page, 1).locator('[data-syl="ju"]')).toHaveCount(1);
  await expect(page.locator('#m3-word')).toHaveText('baju');
  await expect(page.locator('#m3-q2')).toBeVisible({ timeout: 4000 });
  await expect(page.locator('#m3-dcat')).toHaveText('Planet Nombor & Kuantiti');

  await page.locator('.m3-ch[data-v="6"]').click();
  await page.locator('.m3-ch[data-v="6"]').click({ force: true });
  await page.locator('.m3-ch[data-v="5"]').click({ force: true });
  await expect(page.locator('#m3-dres')).toBeVisible({ timeout: 4000 });
  await expect(page.locator('#m3-dscore')).toHaveText('1/2');
  expect(await page.$$eval('.m3-dstar use', (u) => u.map((x) => x.getAttribute('href')))).toEqual(['#m3-star', '#m3-star', '#m3-starOff']);
  await expect(page.locator('.m3-dres-rib')).toHaveText('DEMO RINGKAS — VERSI PENUH ADA 8 SOALAN SETIAP MISI');
  await expect(page.locator('.m3-dres-t')).toHaveText('TAHNIAH! ANDA BERJAYA!');

  await page.locator('#m3-replay').click();
  await expect(page.locator('#m3-q1')).toBeVisible();
  await expect(page.locator('.m3-tray .m3-syl')).toHaveCount(3);
  await expect(page.locator('#m3-word')).toHaveText('?');
  await expect(page.locator('#m3-dq')).toHaveText('Soalan 1/2');
  expect(errors).toEqual([]);
});

test('demo by tap: CUBA LAGI allows retry, perfect play scores 2/2 with three stars', async ({ page }) => {
  await open(page);
  await toDemo(page);
  await syl(page, 'ba').click();
  await syl(page, 'ju').click();
  await expect(page.locator('#m3-word')).toHaveText('baju');
  await expect(page.locator('#m3-q2')).toBeVisible({ timeout: 4000 });
  await page.locator('.m3-ch[data-v="7"]').click();
  await expect(page.locator('#m3-dtoast')).toHaveText('CUBA LAGI');
  await expect(page.locator('#m3-q2')).toBeVisible();
  await page.locator('.m3-ch[data-v="6"]').click();
  await expect(page.locator('#m3-dscore')).toHaveText('1/2', { timeout: 4000 });

  await page.locator('#m3-replay').click();
  await syl(page, 'ba').click();
  await syl(page, 'ju').click();
  await expect(page.locator('#m3-q2')).toBeVisible({ timeout: 4000 });
  await page.locator('.m3-ch[data-v="6"]').click();
  await expect(page.locator('#m3-dscore')).toHaveText('2/2', { timeout: 4000 });
  expect(await page.$$eval('.m3-dstar use', (u) => u.map((x) => x.getAttribute('href')))).toEqual(['#m3-star', '#m3-star', '#m3-star']);
});

test('demo by keyboard: Enter places cards and answers, focus follows', async ({ page, browserName, isMobile }) => {
  test.skip(isMobile, 'keyboard path is a desktop concern');
  await open(page);
  await toDemo(page);
  await syl(page, 'ba').focus();
  await page.keyboard.press('Enter');
  await expect(slot(page, 0).locator('[data-syl="ba"]')).toHaveCount(1);
  await expect(syl(page, 'ju')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#m3-q2t')).toBeFocused({ timeout: 4000 });
  await page.locator('.m3-ch[data-v="6"]').focus();
  await page.keyboard.press(browserName === 'webkit' ? 'Space' : 'Enter');
  await expect(page.locator('#m3-drest')).toBeFocused({ timeout: 4000 });
  await expect(page.locator('#m3-dscore')).toHaveText('2/2');
});

test('demo by finger: touch drag places the card (Chromium touch events)', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'synthetic touch drag needs CDP');
  await open(page);
  await toDemo(page);
  const a = (await syl(page, 'ba').boundingBox())!;
  const b = (await slot(page, 0).boundingBox())!;
  const cdp = await page.context().newCDPSession(page);
  const at = (x: number, y: number) => [{ x, y, id: 1, radiusX: 4, radiusY: 4, force: 1 }];
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: at(a.x + a.width / 2, a.y + a.height / 2) });
  for (let i = 1; i <= 14; i++) {
    const t = i / 14;
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: at(a.x + a.width / 2 + (b.x - a.x + (b.width - a.width) / 2) * t, a.y + a.height / 2 + (b.y - a.y + (b.height - a.height) / 2) * t),
    });
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(slot(page, 0).locator('[data-syl="ba"]')).toHaveCount(1);
  await expect(page.locator('#m3-dtoast')).toHaveText('Bagus! Teruskan');
});

test('reduced motion: nothing animates and no particles run', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page);
  await toDemo(page);
  await expect(page.locator('#m3-dhand')).toHaveClass(/is-on/, { timeout: 4000 });
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  await syl(page, 'ba').click();
  await syl(page, 'ju').click();
  await page.locator('.m3-ch[data-v="6"]').click({ timeout: 4000 });
  await expect(page.locator('#m3-dres')).toBeVisible({ timeout: 4000 });
  expect(await page.locator('#m3-dfx').evaluate((c: HTMLCanvasElement) => c.width)).toBe(300);
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
});

test('offscreen animation scopes pause', async ({ page }) => {
  await open(page);
  const pcFloat = page.locator('.m3-d-pc .m3-fl');
  await expect(page.locator('.m3-viz')).toHaveClass(/m3-on/);
  expect(await pcFloat.evaluate((n) => getComputedStyle(n).animationPlayState)).toBe('running');
  await page.locator('[data-sec="pakej"]').scrollIntoViewIfNeeded();
  await expect(page.locator('.m3-viz')).not.toHaveClass(/m3-on/);
  expect(await pcFloat.evaluate((n) => getComputedStyle(n).animationPlayState)).toBe('paused');
});

for (const width of [375, 430, 768, 1024, 1440]) {
  test(`layout at ${width}px: no sideways scroll, devices on stage, readable copy`, async ({ page, isMobile }) => {
    test.skip(isMobile, 'width sweep runs in the desktop browsers');
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
    expect(parseFloat(await page.locator('.m3-h1').evaluate((h) => getComputedStyle(h).fontSize))).toBeGreaterThanOrEqual(26);
    for (const d of ['.m3-d-pc', '.m3-d-tab', '.m3-d-ph']) {
      const r = (await page.locator(d).boundingBox())!;
      expect(r.x).toBeGreaterThanOrEqual(-1);
      expect(r.x + r.width).toBeLessThanOrEqual(width + 1);
    }
    const pc = (await page.locator('.m3-d-pc svg.m3-dev').boundingBox())!;
    const screenBottom = pc.y + (pc.height * 566) / 720;
    for (const d of ['.m3-d-tab svg.m3-dev', '.m3-d-ph svg.m3-dev']) {
      const r = (await page.locator(d).boundingBox())!;
      if (width < 641) expect(r.y).toBeGreaterThanOrEqual(screenBottom - 12);
    }
    if (width >= 1240) {
      const [c1, c2, c3] = await Promise.all([1, 2, 3].map((i) => page.locator(`.m3-fc${i}`).boundingBox()));
      expect(c1!.x + c1!.width).toBeLessThanOrEqual(pc.x + 2);
      expect(c2!.x).toBeGreaterThanOrEqual(pc.x + pc.width - 2);
      expect(c3!.y).toBeGreaterThanOrEqual(screenBottom);
    } else {
      const stage = (await page.locator('.m3-stage').boundingBox())!;
      for (const i of [1, 2, 3]) expect((await page.locator(`.m3-fc${i}`).boundingBox())!.y).toBeGreaterThanOrEqual(stage.y + stage.height);
    }
    const cta = page.locator('a.m3-cta');
    for (const i of [0, 1]) expect((await cta.nth(i).boundingBox())!.height).toBeGreaterThanOrEqual(56);
  });
}

test('Elementor embed survives a hostile WordPress theme and leaks nothing', async ({ page }) => {
  const errors = await open(page, '/wp-host.html');
  const root = page.locator('#misi3m-sales-root');
  expect(await root.locator('.m3-h2').first().evaluate((h) => getComputedStyle(h).color)).toBe('rgb(42, 27, 69)');
  expect(await root.locator('.m3-h2').first().evaluate((h) => getComputedStyle(h).textTransform)).toBe('none');
  expect(await root.locator('a.m3-cta').first().evaluate((a) => getComputedStyle(a).color)).toBe('rgb(255, 255, 255)');
  expect(await root.locator('a.m3-cta').first().evaluate((a) => getComputedStyle(a).textDecorationLine)).toBe('none');
  expect(await page.locator('p.theme-p').evaluate((p) => getComputedStyle(p).color)).toBe('rgb(1, 2, 3)');
  expect(await page.evaluate(() => Object.keys(window).filter((k) => k !== '__k0' && !(window as any).__k0.includes(k)))).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
  await toDemo(page);
  await syl(page, 'ba').click();
  await syl(page, 'ju').click();
  await expect(page.locator('#m3-word')).toHaveText('baju');
  expect(errors).toEqual([]);
});
