// Rakam skrin game Misi Pemulihan 3M yang sebenar (salinan baca-sahaja dalam .tmp/game) sebagai klip B-roll.
// Setiap klip = folder JPG 30 fps dalam .tmp/clips/<nama>/, ditambah klik.json (kedudukan ketukan untuk riak jari).
import { chromium } from "@playwright/test";
import { mkdirSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const GAME = join(ROOT, ".tmp/game/index.html");
const CLIPS = join(ROOT, ".tmp/clips");
const FPS = 30;
const only = process.argv.slice(2);

if (!existsSync(GAME)) throw new Error(`Tiada ${GAME} — salin game dahulu (lihat video/README.md)`);

async function rig({ width, height, dpr }) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dpr, isMobile: width < 600, hasTouch: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`${"file://" + encodeURI(GAME)}?benih=11`);
  await page.waitForFunction(() => window.App && document.querySelector(".scr"));
  await page.evaluate(() => document.fonts.ready);
  return { browser, page, errors };
}

/** Screenshot secepat mungkin semasa `play` berjalan, kemudian disampel semula ke 30 fps ikut cap masa. */
async function recordLive(page, seconds, play) {
  const shots = [];
  const t0 = Date.now();
  let done = false;
  const loop = (async () => {
    while (!done) {
      try { shots.push({ t: (Date.now() - t0) / 1000, buf: await page.screenshot({ type: "jpeg", quality: 88 }) }); }
      catch { await page.waitForTimeout(20); }
    }
  })();
  const at = (s) => new Promise((r) => setTimeout(r, Math.max(0, t0 + s * 1000 - Date.now())));
  await play(at);
  await at(seconds);
  done = true;
  await loop;
  const frames = [];
  for (let k = 0; k < Math.round(seconds * FPS); k++) {
    const t = k / FPS;
    let pick = shots[0];
    for (const s of shots) if (s.t <= t) pick = s; else break;
    frames.push(pick.buf);
  }
  return { frames, rate: shots.length / seconds };
}

function save(name, { frames, rate }, taps = []) {
  const dir = join(CLIPS, name);
  if (existsSync(dir)) rmSync(dir, { recursive: true });
  mkdirSync(dir, { recursive: true });
  frames.forEach((b, i) => writeFileSync(join(dir, `${String(i).padStart(4, "0")}.jpg`), b));
  writeFileSync(join(dir, "klik.json"), JSON.stringify(taps));
  console.log(`${name}: ${frames.length} frame, tangkapan ${rate.toFixed(1)}/s`);
}

const setup = (page) => page.evaluate(() => {
  App.store.profile = { name: "Aisyah", age: 6, avatar: "arnab" };
  App.store.settings.timer = "none";
  App.save();
});

/** Main beberapa sesi tanpa dirakam supaya peta ada bintang dan album ada sticker. */
async function warmUp(page) {
  for (const cat of ["huruf", "sukukata", "nombor"]) {
    await page.evaluate((cat) => App.go("game", { cat, level: 1, timer: "none" }), cat);
    await page.waitForFunction(() => window.Game.q);
    await page.evaluate(() => {
      const n = Game.session.questions.length;
      for (let i = 0; i < n; i++) { Game.correct(null); Game.next(); }
    });
    await page.waitForFunction(() => App.screen === "result");
    await page.evaluate(() => { App.store.newSticker = null; App.save(); });
  }
}

async function openGame(page, cat, needMC) {
  for (let tries = 0; tries < 12; tries++) {
    await page.evaluate((cat) => App.go("game", { cat, level: 1, timer: "none" }), cat);
    await page.waitForFunction(() => window.Game.q && document.querySelector(".qmech").children.length);
    const mc = await page.evaluate(() => !!document.querySelector(`.qmech [data-opt="${Game.q.answer}"]`));
    if (!needMC || mc) return;
  }
  throw new Error(`Tiada soalan pilihan untuk ${cat}`);
}

async function tapRight(page) {
  const box = await page.locator(`.qmech [data-opt="${await page.evaluate(() => Game.q.answer)}"]`).boundingBox();
  const vp = page.viewportSize();
  const x = box.x + box.width / 2, y = box.y + box.height / 2;
  await page.mouse.click(x, y);
  return { x: x / vp.width, y: y / vp.height };
}

const want = (n) => !only.length || only.includes(n);

// ---------------- telefon ----------------
{
  const { browser, page, errors } = await rig({ width: 390, height: 844, dpr: 2 });
  if (want("welcome")) save("welcome", await recordLive(page, 2.5, async () => {}));
  await setup(page);
  await warmUp(page);

  if (want("map")) {
    await page.evaluate(() => { fx.clear(); App.go("map"); });
    await page.waitForTimeout(900);
    save("map", await recordLive(page, 5, async (at) => {
      const H = await page.evaluate(() => document.scrollingElement.scrollHeight - innerHeight);
      for (let k = 0; k <= 60; k++) { await at(1 + k * 0.06); await page.evaluate((y) => scrollTo(0, y), Math.round((H * k) / 60)); }
    }));
  }
  for (const [name, cat] of [["q_membaca", "perkataan"], ["q_mengeja", "sukukata"], ["q_mengira", "matematik"]]) {
    if (!want(name)) continue;
    await openGame(page, cat, false);
    await page.waitForTimeout(600);
    save(name, await recordLive(page, 2.2, async () => {}));
  }
  if (want("jawab")) {
    await openGame(page, "huruf", true);
    await page.waitForTimeout(700);
    let tap;
    save("jawab", await recordLive(page, 3.6, async (at) => { await at(0.8); tap = await tapRight(page); }), [{ t: 0.8, ...tap }]);
  }
  if (want("sticker")) {
    await openGame(page, "ayat", false);
    await page.evaluate(() => { const n = Game.session.questions.length; for (let i = 0; i < n; i++) { Game.correct(null); Game.next(); } });
    await page.waitForFunction(() => App.screen === "result");
    let tap;
    save("sticker", await recordLive(page, 5.5, async (at) => {
      await at(2.2);
      const gift = page.locator('[data-act="gift"]').first();
      await gift.scrollIntoViewIfNeeded();
      const b = await gift.boundingBox();
      const vp = page.viewportSize();
      tap = { t: 2.2, x: (b.x + b.width / 2) / vp.width, y: (b.y + b.height / 2) / vp.height };
      await gift.click();
      await at(2.95);
      await page.evaluate(() => document.querySelector("#giftPanel").scrollIntoView({ behavior: "smooth", block: "center" }));
    }), tap ? [tap] : []);
  }
  if (errors.length) console.log("RALAT GAME (telefon):", errors);
  await browser.close();
}

// ---------------- tablet ----------------
if (want("map_tab")) {
  const { browser, page, errors } = await rig({ width: 820, height: 1180, dpr: 1.5 });
  await setup(page);
  await warmUp(page);
  await page.evaluate(() => { fx.clear(); App.go("map"); });
  await page.waitForTimeout(1500);
  save("map_tab", await recordLive(page, 5.5, async (at) => {
    const H = await page.evaluate(() => document.scrollingElement.scrollHeight - innerHeight);
    for (let k = 0; k <= 60; k++) { await at(1.2 + k * 0.06); await page.evaluate((y) => scrollTo(0, y), Math.round((H * k) / 60)); }
  }));
  if (errors.length) console.log("RALAT GAME (tablet):", errors);
  await browser.close();
}
