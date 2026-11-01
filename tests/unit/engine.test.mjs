// Enjin sesi: tepat 8 soalan unik, bintang ikut prestasi sebenar, sticker tidak berulang, cadangan adaptif.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const Bank = require('../../src/bank.js');
const Engine = require('../../src/engine.js');

test('setiap sesi tepat 8 soalan unik dengan ≥ 4 jenis mekanik', () => {
  for (const lang of ['ms', 'en']) for (const cat of Bank.CATS) for (const level of [1, 2, 3]) for (let s = 1; s <= 12; s++) {
    const ses = Engine.buildSession({ cat, level, lang, store: Engine.blankStore(), seed: s });
    assert.equal(ses.questions.length, 8, `${lang} ${cat} ${level} ${s}`);
    assert.equal(new Set(ses.questions.map((q) => q.id)).size, 8);
    assert.ok(new Set(ses.questions.map((q) => q.type)).size >= 4, `${lang} ${cat} ${level} ${s}`);
    assert.ok(ses.questions.every((q) => q.language === lang && q.categoryId === cat && q.level === level));
  }
});

test('bintang: 7–8 betul sendiri = 3, 5–6 = 2, 0–4 = 1', () => {
  assert.deepEqual([8, 7, 6, 5, 4, 0].map(Engine.starsFor), [3, 3, 2, 2, 1, 1]);
  const r = (o) => ({ outcome: o });
  const sc = Engine.scoreResults([r('indep'), r('indep'), r('indep'), r('indep'), r('indep'), r('assisted'), r('shown'), r('timeout')]);
  assert.deepEqual([sc.done, sc.indep, sc.assisted, sc.unsolved, sc.timeouts, sc.stars], [8, 5, 1, 2, 1, 2]);
});

test('jawapan yang ditunjuk sistem tidak dikira betul tanpa bantuan', () => {
  const store = Engine.blankStore();
  const ses = Engine.buildSession({ cat: 'huruf', level: 1, lang: 'ms', store, seed: 3 });
  const res = ses.questions.map((q, i) => ({ qid: q.id, skillId: q.skillId, outcome: i < 6 ? 'indep' : 'shown', wrong: i < 6 ? 0 : 3, hint: i >= 6 }));
  const out = Engine.applySession(store, ses, res, 9);
  assert.equal(out.indep, 6); assert.equal(out.stars, 2); assert.equal(store.stars, 2);
  assert.equal(store.cat.huruf[1].best, 2); assert.equal(store.sessions.length, 1);
});

test('sticker tidak berulang sehingga 24 dikumpul, kemudian berganda', () => {
  const store = Engine.blankStore(), r = Bank.rng(5);
  const got = Array.from({ length: 24 }, () => Engine.awardSticker(store, r));
  assert.equal(new Set(got.map((g) => g.id)).size, 24);
  assert.ok(got.every((g) => !g.duplicate));
  const extra = Engine.awardSticker(store, r);
  assert.equal(extra.duplicate, true); assert.equal(store.stickers[extra.id].n, 2);
});

test('adaptif: kemahiran lemah ditanda, dicadangkan, dan diberi lebih soalan', () => {
  const store = Engine.blankStore();
  store.skills.bunyi_awal = { seen: 6, indep: 1, assisted: 1, unsolved: 4, hints: 3, wrong: 9, recent: [0, 0, 1, 0, 0.5, 0] };
  assert.equal(Engine.needsPractice(store.skills.bunyi_awal), true);
  assert.equal(Engine.skillStatus(store.skills.bunyi_awal), 'berlatih');
  const rec = Engine.recommend(store);
  assert.deepEqual([rec.cat, rec.level, rec.skill], ['huruf', 2, 'bunyi_awal']);
  const ses = Engine.buildSession({ cat: 'huruf', level: 2, lang: 'ms', store, seed: 4, focusSkill: 'bunyi_awal' });
  assert.ok(ses.questions.filter((q) => q.skillId === 'bunyi_awal').length >= 4);
  store.skills.abjad = { seen: 8, indep: 8, assisted: 0, unsolved: 0, hints: 0, wrong: 0, recent: [1, 1, 1, 1, 1, 1, 1, 1] };
  assert.equal(Engine.skillStatus(store.skills.abjad), 'kuasai');
});

test('cadangan tahap naik selepas 3 bintang, tidak mengunci tahap lain', () => {
  const store = Engine.blankStore();
  assert.equal(Engine.recommendLevel(store, 'nombor'), 1);
  store.cat.nombor = { 1: { best: 3, plays: 1, last: 3 } };
  assert.equal(Engine.recommendLevel(store, 'nombor'), 2);
  assert.ok(Engine.buildSession({ cat: 'nombor', level: 3, lang: 'ms', store, seed: 1 }).questions.length === 8);
});
