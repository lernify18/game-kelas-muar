// Integriti bank soalan: setiap soalan sah, satu jawapan betul, gambar padan perkataan, petunjuk tidak dedah jawapan.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const Bank = require('../../src/bank.js');
const ART = require('../../src/art.js');
const LANGS = ['ms', 'en'], LEVELS = [1, 2, 3], SEEDS = Array.from({ length: 30 }, (_, i) => i + 1);
const all = [];
for (const lang of LANGS) for (const cat of Bank.CATS) for (const level of LEVELS) for (const s of SEEDS) for (const q of Bank.pool(cat, level, lang, s)) all.push(q);
const uniq = [...new Map(all.map((q) => [q.id, q])).values()];
const word = (p, lang) => (lang === 'ms' ? p : Bank.W[p].en);
const lab = (o) => o.t ?? o.pic;

test('setiap kategori × tahap × bahasa ada ≥ 8 soalan unik dan ≥ 4 jenis mekanik', () => {
  for (const lang of LANGS) for (const cat of Bank.CATS) for (const level of LEVELS) {
    const qs = uniq.filter((q) => q.language === lang && q.categoryId === cat && q.level === level);
    assert.ok(qs.length >= 8, `${lang} ${cat} ${level}: ${qs.length}`);
    assert.ok(new Set(qs.map((q) => q.type)).size >= 4, `${lang} ${cat} ${level} jenis`);
  }
});

test('setiap kategori menggunakan kelima-lima mekanik dalam kedua-dua bahasa', () => {
  for (const lang of LANGS) for (const cat of Bank.CATS) {
    const types = new Set(uniq.filter((q) => q.language === lang && q.categoryId === cat).map((q) => q.type));
    assert.deepEqual([...types].sort(), ['arrange', 'drag', 'fill', 'match', 'mc'], `${lang} ${cat}`);
  }
});

test('jumlah variasi sah ≥ 144 dan tiada soalan gagal validate()', () => {
  assert.ok(uniq.length >= 144, String(uniq.length));
  for (const q of uniq) assert.deepEqual(Bank.validate(q), [], q.id);
});

test('objektif: tepat satu jawapan betul; pilihan salah ditolak oleh check()', () => {
  for (const q of uniq.filter((x) => x.type === 'mc')) {
    assert.equal(q.options.filter((o) => Bank.check(q, o.id)).length, 1, q.id);
  }
});

test('check() menolak respons salah untuk setiap jenis', () => {
  for (const q of uniq) {
    if (q.type === 'fill') for (const c of q.choices || []) if (c !== q.answer) assert.equal(Bank.check(q, c), false, q.id);
    if (q.type === 'fill' && q.keypad) assert.equal(Bank.check(q, String(+q.answer + 1)), false, q.id);
    if (q.type === 'match') assert.equal(Bank.check(q, { left: q.pairs[0].id, right: q.pairs[1].id }), false, q.id);
    if (q.type === 'drag') for (const t of q.targets) for (const it of q.items) if (!t.accepts.includes(it.id)) assert.equal(Bank.check(q, { target: t.id, item: it.id }), false, q.id);
    if (q.type === 'arrange' && q.validation !== 'equation') {
      const sol = Bank.solution(q), rev = sol.slice().reverse();
      const labels = (ids) => ids.map((id) => q.items.find((i) => i.id === id).t).join('|');
      if (labels(rev) !== labels(sol)) assert.equal(Bank.check(q, rev), false, q.id);
    }
  }
});

test('setiap gambar yang dirujuk wujud dalam set seni', () => {
  const ids = new Set(ART.PIC_IDS);
  const walk = (x) => { if (!x || typeof x !== 'object') return; if (typeof x.pic === 'string') assert.ok(ids.has(x.pic), x.pic); for (const v of Object.values(x)) walk(v); };
  for (const q of uniq) walk(q);
});

test('gambar padan perkataan (kelas pepijat obor/lilin)', () => {
  let n = 0;
  for (const q of uniq) {
    const p = q.visual && q.visual.pic, g = q.id.split('-')[3];
    if (q.type === 'mc' && g === 'pw') { assert.equal(lab(q.options.find((o) => o.id === q.answer)), word(p, q.language), q.id); n++; }
    if (q.type === 'mc' && (g === 'init' || g === 'first')) { assert.equal(lab(q.options.find((o) => o.id === q.answer)), word(p, q.language)[0].toUpperCase(), q.id); n++; }
    if (q.type === 'mc' && g === 'end') { assert.equal(lab(q.options.find((o) => o.id === q.answer)), word(p, q.language).slice(-1).toUpperCase(), q.id); n++; }
    if (q.type === 'arrange' && (g === 'spell' || g === 'sp' || g === 'sp5' || g === 'spl')) { assert.equal(q.answer.join('').toLowerCase(), word(p, q.language), q.id); n++; }
    if (q.type === 'match' && q.pairs.every((pr) => pr.left.pic) && (g === 'mpw' || g === 'mpw5' || g === 'mkvk')) { for (const pr of q.pairs) assert.equal(pr.right.t, word(pr.left.pic, q.language), q.id); n++; }
    if (q.type === 'mc' && g === 'wp' && q.categoryId === 'perkataan') { assert.equal(word(q.options.find((o) => o.id === q.answer).pic, q.language), q.visual.t.toLowerCase(), q.id); n++; }
  }
  assert.ok(n > 300, String(n));
});

test('petunjuk tidak membacakan jawapan', () => {
  // Soalan kefahaman memakai petunjuk umum ("baca cerita sekali lagi"); jawapannya kata biasa seperti "Read".
  for (const q of uniq.filter((x) => (x.type === 'mc' || x.type === 'fill') && x.skillId !== 'faham_bacaan')) {
    const ans = q.type === 'mc' ? lab(q.options.find((o) => o.id === q.answer)) : q.answer;
    if (typeof ans !== 'string' || ans.length < 3 || /^\d+$/.test(ans)) continue;
    const re = new RegExp(`(^|[^\\p{L}])${ans.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^\\p{L}]|$)`, 'iu');
    assert.ok(!re.test(q.hint), `${q.id}: "${q.hint}" mengandungi "${ans}"`);
  }
});

test('bank English berasingan: tiada arahan BM dalam soalan English', () => {
  const BM = /\b(Seret|Padankan|Susun|Pilih|Tekan|Lengkapkan|Gabungkan|Apakah|Berapa|Mana|Bina)\b/;
  for (const q of uniq.filter((x) => x.language === 'en')) assert.ok(!BM.test(q.prompt) && !BM.test(q.hint), q.id + ' ' + q.prompt);
  const enSyl = uniq.filter((x) => x.language === 'en' && x.categoryId === 'sukukata');
  assert.ok(enSyl.every((q) => !/suku kata/i.test(q.prompt)));
});

test('validator persamaan menerima susunan setara dan menolak yang palsu', () => {
  assert.equal(Bank.equationTrue(['2', '+', '3', '=', '5']), true);
  assert.equal(Bank.equationTrue(['3', '+', '2', '=', '5']), true);
  assert.equal(Bank.equationTrue(['5', '=', '2', '+', '3']), true);
  assert.equal(Bank.equationTrue(['13', '−', '5', '=', '8']), true);
  assert.equal(Bank.equationTrue(['2', '+', '5', '=', '3']), false);
  assert.equal(Bank.equationTrue(['=', '2', '+', '3', '5']), false);
});
