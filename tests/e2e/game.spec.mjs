// E2E: main game sebenar melalui UI — 6 kategori, 5 mekanik, salah/bantuan, pemasa, sentuhan, bahasa, laporan, simpanan.
import { test, expect } from '@playwright/test';
import { startFresh, openCategory, answerRight, answerWrong, waitNextQuestion, q, solution, touchDrag } from './helpers.mjs';

const CATS = ['huruf', 'sukukata', 'perkataan', 'ayat', 'nombor', 'matematik'];
const results = (page) => page.evaluate(() => window.__MISI__.Game.results.map((r) => r.outcome));

function watchErrors(page) {
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push(e.message));
  return errs;
}
async function reduceMotion(page) {
  await page.locator('.tabbar [data-act="settings"]').click();
  await page.locator('[data-act="setMotion"][data-v="reduced"]').click();
  await page.locator('.tabbar [data-act="map"]').click();
}
async function playAllRight(page, modes = ['mouse', 'tap', 'touch'], seen) {
  for (let i = 0; i < 8; i++) {
    await expect(page.getByTestId('qcount')).toHaveText(new RegExp(`(Soalan|Question) ${i + 1}/8`));
    const cur = await answerRight(page, modes[i % modes.length]);
    if (seen) seen.push({ type: cur.type, mode: modes[i % modes.length] });
    if (i < 7) await waitNextQuestion(page, cur.id);
  }
  await page.locator('.scr.result').waitFor({ timeout: 8000 });
}

test('6 kategori boleh dimain sesi penuh 8 soalan; kelima-lima mekanik dan seret sentuh diuji', async ({ page }) => {
  test.setTimeout(240_000);
  const errs = watchErrors(page);
  await startFresh(page);
  await reduceMotion(page);
  const seen = [];
  for (const [k, cat] of CATS.entries()) {
    await openCategory(page, cat, (k % 3) + 1, 'none');
    await expect(page.locator('.ring')).toBeHidden();
    await playAllRight(page, ['mouse', 'tap', 'touch'], seen);
    await expect(page.getByTestId('done')).toHaveText('8');
    await expect(page.getByTestId('indep')).toHaveText('8');
    await expect(page.locator('.res-stars')).toHaveAttribute('data-stars', '3');
    await page.locator('[data-act="other"]').click();
  }
  const types = new Set(seen.map((s) => s.type));
  expect([...types].sort()).toEqual(['arrange', 'drag', 'fill', 'match', 'mc']);
  expect(seen.some((s) => s.type === 'drag' && s.mode === 'touch')).toBe(true);
  expect(seen.some((s) => s.type === 'drag' && s.mode === 'mouse')).toBe(true);
  // 6 sesi → 6 sticker berbeza, 18 bintang
  const st = await page.evaluate(() => ({ stars: window.__MISI__.store.stars, stickers: Object.keys(window.__MISI__.store.stickers).length }));
  expect(st).toEqual({ stars: 18, stickers: 6 });
  expect(errs).toEqual([]);
});

test('salah → CUBA LAGI; salah kedua → bantuan berpandu; salah ketiga → jawapan ditunjuk; markah tepat', async ({ page }) => {
  test.setTimeout(120_000);
  const errs = watchErrors(page);
  await startFresh(page, { benih: 11 });
  await reduceMotion(page);
  await openCategory(page, 'nombor', 1, 'none');
  let didGuided = false, didShown = false, didHint = false;
  const expected = [];
  for (let i = 0; i < 8; i++) {
    const cur = await q(page);
    const canThree = cur.type === 'match' || cur.type === 'arrange' || (cur.type === 'fill' && cur.keypad) || (cur.type === 'drag' && cur.items.length - cur.targets.length >= 1);
    if (!didGuided) {
      await answerWrong(page);
      await expect(page.locator('.praise.oops')).toBeVisible();
      expect(await page.evaluate(() => window.__MISI__.Sfx.played.includes('wrong'))).toBe(true);
      await answerWrong(page);
      await expect(page.locator('#bubble')).toContainText('Kiko bantu sikit');
      expect(await page.locator('.qmech .glow, .qmech .glow-soft, .qmech .gone, .qmech [data-choice]').count()).toBeGreaterThan(0);
      didGuided = true;
      if (canThree && !didShown) {
        await answerWrong(page);
        await expect(page.locator('#sheet')).toBeVisible();
        await expect(page.locator('#sheet')).toContainText('Jawapannya');
        await page.locator('#sheet [data-act="next"]').click();
        didShown = true; expected.push('unsolved');
      } else { await answerRight(page, 'tap'); expected.push('assisted'); }
    } else if (!didShown && canThree) {
      for (let k = 0; k < 3; k++) await answerWrong(page);
      await expect(page.locator('#sheet')).toBeVisible();
      await page.locator('#sheet [data-act="next"]').click();
      didShown = true; expected.push('unsolved');
    } else if (!didHint) {
      await page.locator('[data-act="hint"]').click();
      await expect(page.locator('#bubble')).toContainText('Petunjuk Kiko');
      await answerRight(page, 'tap');
      didHint = true; expected.push('assisted');
    } else { await answerRight(page, 'tap'); expected.push('indep'); }
    if (i < 7) await waitNextQuestion(page, cur.id);
  }
  await page.locator('.scr.result').waitFor();
  expect(didShown).toBe(true);
  const cnt = (k) => expected.filter((x) => x === k).length;
  const indep = cnt('indep'), assisted = cnt('assisted'), unsolved = cnt('unsolved');
  expect(expected.length).toBe(8);
  expect(unsolved).toBe(1);
  expect(assisted).toBeGreaterThanOrEqual(1);
  const r = await page.evaluate(() => window.__MISI__.store.sessions.at(-1));
  expect([r.indep, r.assisted, r.unsolved]).toEqual([indep, assisted, unsolved]);
  await expect(page.getByTestId('indep')).toHaveText(String(indep));
  await expect(page.getByTestId('assisted')).toHaveText(String(assisted));
  await expect(page.getByTestId('unsolved')).toHaveText(String(unsolved));
  const expectStars = indep >= 7 ? 3 : indep >= 5 ? 2 : 1;
  await expect(page.locator('.res-stars')).toHaveAttribute('data-stars', String(expectStars));
  expect(errs).toEqual([]);
});

test('jawapan betul: pujian, confetti + reben + bunga api, Kiko melompat, bunyi', async ({ page }) => {
  await startFresh(page);
  await openCategory(page, 'huruf', 1, 'none');
  const before = await page.evaluate(() => ({ ...window.__MISI__.fx.stats }));
  await answerRight(page, 'tap');
  await expect(page.locator('.praise.yay')).toBeVisible();
  await expect(page.locator('.praise.yay')).toHaveAttribute('data-text', /HEBATNYA!|TAHNIAH!|WOW! PANDAINYA!|BAGUS SEKALI!|ANDA JUARA!|TERBAIK!/);
  await expect(page.locator('.kiko-game')).toHaveClass(/kiko--cheer/);
  await page.waitForTimeout(900);
  const after = await page.evaluate(() => ({ ...window.__MISI__.fx.stats }));
  expect(after.papers - before.papers).toBeGreaterThanOrEqual(80);
  expect(after.rockets - before.rockets).toBeGreaterThanOrEqual(2);
  expect(await page.evaluate(() => window.__MISI__.Sfx.played.includes('correct'))).toBe(true);
});

test('pemasa 30 saat: tamat → "Masa Tamat", jawapan ditunjuk, soalan seterusnya bermula semula 30; jeda menghentikan masa', async ({ page }) => {
  await page.clock.install();
  await startFresh(page);
  await reduceMotion(page);
  await openCategory(page, 'matematik', 1, 't30');
  await expect(page.locator('.ring')).toBeVisible();
  await expect(page.locator('.ring b')).toHaveText('30');
  await page.clock.runFor(10_000);
  await expect(page.locator('.ring b')).toHaveText('20');
  await page.locator('[data-act="pause"]').click();
  await page.clock.runFor(60_000);
  await expect(page.locator('#sheet')).toBeHidden();
  await page.locator('[data-act="resume"]').click();
  await page.clock.runFor(21_000);
  await expect(page.locator('#sheet')).toBeVisible();
  await expect(page.locator('#sheet')).toContainText('Masa Tamat! Jom Cuba Soalan Seterusnya!');
  expect(await results(page)).toEqual(['timeout']);
  const id = (await q(page)).id;
  await page.locator('#sheet [data-act="next"]').click();
  await waitNextQuestion(page, id);
  await expect(page.locator('.ring b')).toHaveText('30');
  expect(await page.evaluate(() => window.__MISI__.Timer.iv !== 0)).toBe(true);
});

test('pemasa 1 minit bermula 60 dan tanpa had tiada kiraan', async ({ page }) => {
  await page.clock.install();
  await startFresh(page);
  await openCategory(page, 'nombor', 2, 't60');
  await expect(page.locator('.ring b')).toHaveText('60');
  await page.clock.runFor(61_000);
  await expect(page.locator('#sheet')).toContainText('Masa Tamat');
  await page.locator('[data-act="pause"]').click();
  await page.locator('[data-act="quit"]').click();
  await page.locator('[data-act="timer"][data-v="none"]').click();
  await page.locator('[data-act="play"]').click();
  await page.locator('.qcard .qmech > *').first().waitFor();
  await expect(page.locator('.ring')).toBeHidden();
  await page.clock.runFor(8_000);
  await expect(page.locator('#sheet')).toBeHidden();
});

test('seret sebenar: kad salah kembali ke dulang, kad betul melekat ke slot (tetikus & sentuh)', async ({ page }) => {
  await startFresh(page, { benih: 3 });
  await openCategory(page, 'sukukata', 2, 'none');
  for (let i = 0; i < 8; i++) {
    const cur = await q(page);
    if (cur.type === 'drag') {
      const t0 = cur.targets[0];
      const bad = cur.items.find((it) => !t0.accepts.includes(it.id));
      await touchDrag(page, page.locator(`.tray [data-item="${bad.id}"]`), page.locator(`[data-drop="${t0.id}"]`));
      await expect(page.locator(`.tray [data-item="${bad.id}"]`)).toBeVisible();
      await expect(page.locator(`[data-drop="${t0.id}"] .chip`)).toHaveCount(0);
      const sol = await solution(page);
      const s0 = sol[0];
      await touchDrag(page, page.locator(`.tray [data-item="${s0.item}"]`), page.locator(`[data-drop="${s0.target}"]`));
      await expect(page.locator(`[data-drop="${s0.target}"] [data-item="${s0.item}"]`)).toBeVisible();
      return;
    }
    await answerRight(page, 'tap');
    if (i < 7) await waitNextQuestion(page, cur.id);
  }
  throw new Error('tiada soalan seret dalam sesi ini');
});

test('simpanan selepas refresh, dua sesi berturut-turut beri 2 sticker berbeza, buka hadiah → album', async ({ page }) => {
  test.setTimeout(120_000);
  await startFresh(page);
  await reduceMotion(page);
  for (let s = 0; s < 2; s++) {
    await openCategory(page, 'perkataan', 1, 'none');
    await playAllRight(page, ['tap']);
    await page.locator('[data-act="gift"]').click();
    await expect(page.locator('.sticker-pop .sticker-art')).toBeVisible();
    await expect(page.locator('.new-st')).toHaveText('STICKER BARU DAPAT!');
    await page.locator('[data-act="saveSticker"]').click();
    await expect(page.getByTestId('albumCount')).toHaveText(`${s + 1} / 24 dikumpul`);
    await page.locator('.tabbar [data-act="map"]').click();
  }
  await page.reload();
  await page.getByRole('button', { name: 'JOM MAIN!' }).click();
  await expect(page.getByRole('heading', { name: 'Hai Aina! Jom Jadi Hebat!' })).toBeVisible();
  await expect(page.locator('#starCount')).toHaveText('6');
  await page.locator('.tabbar [data-act="album"]').click();
  await expect(page.locator('.st-slot.got')).toHaveCount(2);
});

test('tukar bahasa: UI + bank English, kekal selepas refresh, tukar semasa sesi mula semula', async ({ page }) => {
  await startFresh(page, { lang: 'en' });
  await expect(page.getByRole('heading', { name: "Hi Aina! Let's be amazing!" })).toBeVisible();
  await openCategory(page, 'sukukata', 1, 'none');
  let cur = await q(page);
  expect(cur.language).toBe('en');
  await expect(page.getByTestId('qcount')).toHaveText('Question 1/8');
  await page.reload();
  await expect(page.getByRole('heading', { name: "Let's Start the Adventure!" })).toBeVisible();
  await page.getByRole('button', { name: "LET'S PLAY!" }).click();
  await openCategory(page, 'ayat', 2, 'none');
  await page.locator('[data-act="pause"]').click();
  await page.locator('[data-act="setLang"][data-v="ms"]').click();
  await expect(page.locator('#toast')).toContainText('Bahasa ditukar');
  await page.locator('.qcard .qmech > *').first().waitFor();
  cur = await q(page);
  expect(cur.language).toBe('ms');
  await expect(page.getByTestId('qcount')).toHaveText('Soalan 1/8');
});

test('laporan ibu bapa: pintu dewasa, data sebenar, kemahiran lemah → latihan cadangan', async ({ page }) => {
  await page.goto('/index.html?test=1');
  await page.evaluate(() => {
    const s = window.__MISI__.Engine.blankStore();
    s.profile = { name: 'Aina', age: 7, avatar: 'arnab' };
    s.started = 3; s.stars = 4;
    s.sessions = [{ at: 1, cat: 'huruf', level: 2, lang: 'ms', done: 8, indep: 2, assisted: 2, unsolved: 4, timeouts: 1, stars: 1, sticker: 'roket', hints: 3, wrong: 9 }, { at: 2, cat: 'nombor', level: 1, lang: 'ms', done: 8, indep: 8, assisted: 0, unsolved: 0, timeouts: 0, stars: 3, sticker: 'panda', hints: 0, wrong: 0 }];
    s.stickers = { roket: { n: 1, at: 1 }, panda: { n: 1, at: 2 } };
    s.cat = { huruf: { 2: { best: 1, plays: 1, last: 1 } }, nombor: { 1: { best: 3, plays: 1, last: 3 } } };
    s.skills = { bunyi_awal: { seen: 6, indep: 1, assisted: 1, unsolved: 4, hints: 3, wrong: 9, recent: [0, 0, 1, 0, 0.5, 0] }, bilang: { seen: 8, indep: 8, assisted: 0, unsolved: 0, hints: 0, wrong: 0, recent: [1, 1, 1, 1, 1, 1, 1, 1] } };
    localStorage.setItem('misi3m:v1', JSON.stringify(s));
  });
  await page.reload();
  await page.getByRole('button', { name: 'JOM MAIN!' }).click();
  await page.locator('.tabbar [data-act="report"]').click();
  for (const d of '1') await page.locator(`[data-k="${d}"]`).click();
  await page.locator('[data-k="ok"]').click();
  await expect(page.locator('#gateErr')).toBeVisible();
  const [a, b] = (await page.locator('.gate p').first().textContent()).match(/(\d+) × (\d+)/).slice(1).map(Number);
  for (const d of String(a * b)) await page.locator(`[data-k="${d}"]`).click();
  await page.locator('[data-k="ok"]').click();
  await expect(page.getByTestId('kSessions')).toHaveText('3');
  await expect(page.getByTestId('kMissions')).toHaveText('2');
  await expect(page.getByTestId('kStars')).toHaveText('4');
  await expect(page.getByTestId('kStickers')).toHaveText('2');
  await expect(page.getByTestId('kIndep')).toHaveText('63%');
  await expect(page.locator('.rec.warn')).toContainText('AINA MEMERLUKAN LATIHAN TAMBAHAN');
  await expect(page.locator('.rec.warn')).toContainText('Bunyi awal');
  await expect(page.locator('.rec.warn')).toContainText('Dunia Huruf & Bunyi');
  await page.locator('[data-act="practice"]').click();
  await page.locator('.qcard .qmech > *').first().waitFor();
  const ses = await page.evaluate(() => ({ cat: window.__MISI__.Game.session.cat, level: window.__MISI__.Game.session.level, focus: window.__MISI__.Game.session.focusSkill, n: window.__MISI__.Game.session.questions.filter((x) => x.skillId === 'bunyi_awal').length }));
  expect(ses).toMatchObject({ cat: 'huruf', level: 2, focus: 'bunyi_awal' });
  expect(ses.n).toBeGreaterThanOrEqual(4);
});

test('laporan tanpa data menunjukkan mesej jelas, bukan angka rekaan', async ({ page }) => {
  await startFresh(page);
  await page.locator('.tabbar [data-act="report"]').click();
  const [a, b] = (await page.locator('.gate p').first().textContent()).match(/(\d+) × (\d+)/).slice(1).map(Number);
  for (const d of String(a * b)) await page.locator(`[data-k="${d}"]`).click();
  await page.locator('[data-k="ok"]').click();
  await expect(page.getByTestId('kMissions')).toHaveText('0');
  await expect(page.locator('.report-wrap')).toContainText('Belum ada data');
});
