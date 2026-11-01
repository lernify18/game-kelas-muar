// Pembantu e2e: memandu UI sebenar (klik, seret tetikus, seret sentuhan CDP) berdasarkan soalan semasa.
// Soalan dibaca melalui window.__MISI__ (hanya wujud dengan ?test=1); jawapan dihantar melalui UI, bukan API.
export const q = (page) => page.evaluate(() => { const x = window.__MISI__.q; return x && JSON.parse(JSON.stringify(x)); });
export const solution = (page) => page.evaluate(() => window.__MISI__.Bank.solution(window.__MISI__.q));

export async function startFresh(page, { lang = 'ms', name = 'Aina', benih = 7, w } = {}) {
  await page.goto(`/index.html?test=1&benih=${benih}`);
  await page.evaluate(() => localStorage.clear());
  await page.goto(`/index.html?test=1&benih=${benih}`);
  await page.getByRole('button', { name: /JOM MAIN|LET'S PLAY/ }).click();
  await page.locator('#nick').fill(name);
  await page.locator('[data-act="age"][data-v="7"]').click();
  await page.locator('[data-act="avatar"][data-v="panda"]').click();
  await page.locator('[data-act="saveProfile"]').click();
  await page.locator('.scr.map').waitFor();
  if (lang === 'en') { await page.locator('.tabbar [data-act="settings"]').click(); await page.locator('[data-act="setLang"][data-v="en"]').click(); await page.locator('.tabbar [data-act="map"]').click(); }
}

export async function openCategory(page, cat, level = 1, timer = 'none') {
  await page.locator(`.isle[data-cat="${cat}"]`).click();
  await page.locator(`[data-act="level"][data-v="${level}"]`).click();
  await page.locator(`[data-act="timer"][data-v="${timer}"]`).click();
  await page.locator('[data-act="play"]').click();
  await page.locator('.qcard .qmech > *').first().waitFor();
}

async function centerOf(loc) { const b = await loc.boundingBox(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }

export async function mouseDrag(page, from, to) {
  const a = await centerOf(from), b = await centerOf(to);
  await page.mouse.move(a.x, a.y); await page.mouse.down();
  for (let i = 1; i <= 8; i++) await page.mouse.move(a.x + ((b.x - a.x) * i) / 8, a.y + ((b.y - a.y) * i) / 8);
  await page.mouse.up();
  await page.waitForTimeout(380);
}

/** Seret dengan jari sebenar (Input.dispatchTouchEvent) → menghasilkan pointer events jenis "touch". */
export async function touchDrag(page, from, to) {
  const a = await centerOf(from), b = await centerOf(to);
  const cdp = await page.context().newCDPSession(page);
  const pt = (x, y) => [{ x, y, id: 1, radiusX: 4, radiusY: 4, force: 1 }];
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: pt(a.x, a.y) });
  for (let i = 1; i <= 10; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: pt(a.x + ((b.x - a.x) * i) / 10, a.y + ((b.y - a.y) * i) / 10) });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await cdp.detach();
  await page.waitForTimeout(380);
}

/** Jawab soalan semasa dengan betul melalui UI. mode: 'mouse' | 'tap' | 'touch' untuk seret. */
export async function answerRight(page, mode = 'mouse') {
  const cur = await q(page), sol = await solution(page);
  const mech = page.locator('.qmech');
  switch (cur.type) {
    case 'mc': await mech.locator(`.opt[data-opt="${sol}"]`).click(); break;
    case 'fill':
      if (cur.choices) await mech.locator(`[data-choice="${cur.answer}"]`).click();
      else { for (const d of cur.answer) await mech.locator(`[data-k="${d}"]`).click(); await mech.locator('[data-k="ok"]').click(); }
      break;
    case 'match': for (const p of sol) { await mech.locator(`.mcard[data-side="L"][data-pair="${p.left}"]`).click(); await mech.locator(`.mcard[data-side="R"][data-pair="${p.right}"]`).click(); } break;
    case 'drag':
      for (const s of sol) {
        const item = mech.locator(`.tray [data-item="${s.item}"]`), tgt = mech.locator(`[data-drop="${s.target}"]`);
        if (mode === 'tap') { await item.click(); await tgt.click(); }
        else if (mode === 'touch') await touchDrag(page, item, tgt);
        else await mouseDrag(page, item, tgt);
      }
      break;
    case 'arrange':
      for (let i = 0; i < sol.length; i++) {
        const chip = mech.locator(`.chip[data-item="${sol[i]}"]`);
        if (mode === 'mouse' && i === 0) await mouseDrag(page, chip, mech.locator('.ar-slot[data-slot="0"]'));
        else await chip.click();
      }
      await mech.locator('[data-act="check"]').click();
      break;
  }
  return cur;
}

/** Jawab SALAH sekali melalui UI (pilihan/kad yang tidak diterima). */
export async function answerWrong(page) {
  const cur = await q(page), mech = page.locator('.qmech');
  switch (cur.type) {
    case 'mc': { const w = cur.options.find((o) => o.id !== cur.answer && true); const enabled = mech.locator(`.opt:not([disabled]):not([data-opt="${cur.answer}"])`).first(); await (await enabled.count() ? enabled : mech.locator(`.opt[data-opt="${w.id}"]`)).click(); break; }
    case 'fill':
      if (cur.choices) await mech.locator(`[data-choice]:not([disabled]):not([data-choice="${cur.answer}"])`).first().click();
      else { const bad = String((+cur.answer + 1) % 1000); for (const d of bad) await mech.locator(`[data-k="${d}"]`).click(); await mech.locator('[data-k="ok"]').click(); }
      break;
    case 'match': { const L = cur.pairs[0].id, R = cur.pairs[1].id; await mech.locator(`.mcard[data-side="L"][data-pair="${L}"]:not(.matched)`).click(); await mech.locator(`.mcard[data-side="R"][data-pair="${R}"]:not(.matched)`).click(); break; }
    case 'drag': {
      const t0 = cur.targets.find((t) => true);
      const bad = cur.items.find((it) => !t0.accepts.includes(it.id));
      await mech.locator(`.tray [data-item="${bad.id}"]`).click(); await mech.locator(`[data-drop="${t0.id}"]`).click();
      break;
    }
    case 'arrange': {
      const sol = await solution(page);
      const order = sol.slice().reverse();
      const all = cur.items.map((it) => it.id);
      const firstWrong = all.find((id) => cur.items.find((x) => x.id === id).t !== cur.items.find((x) => x.id === sol[0]).t) || order[0];
      await mech.locator('[data-act="reset"]').click();
      const seq = [firstWrong].concat(sol.filter((id) => id !== firstWrong)).slice(0, cur.slots);
      for (const id of seq) await mech.locator(`.chip[data-item="${id}"]`).click();
      await mech.locator('[data-act="check"]').click();
      break;
    }
  }
  await page.waitForTimeout(300);
}

export async function waitNextQuestion(page, prevId) {
  await page.waitForFunction((id) => window.__MISI__.q && window.__MISI__.q.id !== id, prevId, { timeout: 8000 });
  await page.waitForTimeout(150);
}
