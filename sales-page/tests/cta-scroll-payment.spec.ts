// E2E for the scroll-to-payment CTA mode. Hermetic: the page and a stand-in shop are served on two OS ports, so the
// iframe is cross-origin like the real shop embed. Risky logic asserted: every one of the 6 buttons posts exactly
// { type: 'scroll-to-payment' } to the host, the iframe itself does not navigate, and opened directly the plan
// buttons no longer jump to the top while the closing cards still reach pricing.
import { test, expect, type Page } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { serve } from '../tools/serve.mjs';

const dir = fileURLToPath(new URL('..', import.meta.url));
const PAGE = '/misi-pemulihan-3m-sales-page.html';
const BUTTONS = 'a.m3-cta, a.m3-mini-b';

let srv: { url: string; close: () => void };
let shop: { url: string; close: () => void };
test.beforeAll(async () => {
  srv = await serve(dir);
  const kedai = () => `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0"><iframe id="sp" src="${srv.url + PAGE}" style="width:100%;height:900px;border:0"></iframe><div id="checkout">Checkout</div>
<script>window.__msgs = []; var sp = document.getElementById('sp');
addEventListener('message', function (e) { if (e.source === sp.contentWindow) window.__msgs.push({ data: e.data, origin: e.origin }); });</script></body></html>`;
  shop = await serve(dir, '127.0.0.1', { '/kedai.html': kedai });
});
test.afterAll(() => { srv.close(); shop.close(); });

async function fonts(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  return errors;
}

test('in the shop iframe: all 6 buttons post scroll-to-payment to the host and the iframe stays put', async ({ page }) => {
  const errors = await fonts(page);
  await page.goto(shop.url + '/kedai.html');
  const frame = page.frameLocator('#sp');
  await expect(frame.locator('#misi3m-sales-root[data-m3-ready]')).toBeAttached();
  const sales = page.frames().find((f) => f.url().endsWith(PAGE))!;
  const buttons = frame.locator(BUTTONS);
  await expect(buttons).toHaveCount(6);
  const pkgs = await buttons.evaluateAll((a) => a.map((x) => x.getAttribute('data-pkg')));
  expect(pkgs).toEqual(['basic', 'pro', 'usahawan', 'basic', 'pro', 'usahawan']);

  // scrollY is no proof here: lazy photos above the button load mid-test and scroll anchoring moves it.
  // Whether the browser was told to follow the href is.
  await sales.evaluate(() => { (window as any).__prevented = []; document.addEventListener('click', (e) => (window as any).__prevented.push(e.defaultPrevented)); });
  for (let i = 0; i < 6; i++) {
    await buttons.nth(i).scrollIntoViewIfNeeded();
    await buttons.nth(i).click();
    await expect.poll(() => page.evaluate(() => (window as any).__msgs.length)).toBe(i + 1);
    expect(await sales.evaluate(() => location.href)).toBe(srv.url + PAGE);
  }
  const msgs = await page.evaluate(() => (window as any).__msgs);
  expect(msgs).toEqual(Array(6).fill({ data: { type: 'scroll-to-payment' }, origin: srv.url }));
  expect(await sales.evaluate(() => (window as any).__prevented)).toEqual(Array(6).fill(true));
  expect(errors).toEqual([]);
});

test('opened directly: plan buttons stay on the card, closing cards still reach pricing', async ({ page }) => {
  const errors = await fonts(page);
  await page.goto(srv.url + PAGE);
  await page.evaluate(() => {
    (window as any).__msgs = []; (window as any).__prevented = [];
    addEventListener('message', (e) => (window as any).__msgs.push(e.data));
    document.addEventListener('click', (e) => (window as any).__prevented.push(e.defaultPrevented));
  });

  const usahawan = page.locator('[data-sec="pakej"] a.m3-cta[data-pkg="usahawan"]');
  await usahawan.scrollIntoViewIfNeeded();
  await usahawan.click();
  await expect.poll(() => page.evaluate(() => (window as any).__msgs.length)).toBe(1);
  expect(page.url()).toBe(srv.url + PAGE);
  await expect(usahawan).toBeInViewport();
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(1000);

  await page.locator('a.m3-mini-pro').scrollIntoViewIfNeeded();
  await page.locator('a.m3-mini-pro').click();
  await expect(page.locator('#m3-pakej')).toBeInViewport();
  expect(await page.evaluate(() => (window as any).__msgs)).toEqual([{ type: 'scroll-to-payment' }, { type: 'scroll-to-payment' }]);
  expect(await page.evaluate(() => (window as any).__prevented)).toEqual([true, false]);
  expect(errors).toEqual([]);
});
