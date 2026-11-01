/*
 * Enjin permainan: bina sesi 8 soalan (adaptif), kira markah & bintang, kemas kini kemahiran, beri sticker,
 * cadangkan latihan. Semua peraturan berasaskan data jawapan sebenar, tiada AI.
 */
(function (root) {
  const Bank = root.Bank || require('./bank.js');
  const ART_STICKERS = ['kiko_hebat', 'bintang_emas', 'pelangi', 'roket', 'dino', 'panda', 'robot', 'awan_pelangi', 'bintang_ajaib', 'unicorn', 'planet', 'kapal_angkasa', 'kucing_super', 'naga', 'beruang_bijak', 'arnab_laju', 'mahkota', 'pensel_ajaib', 'buku_bersinar', 'trofi', 'bunga_ceria', 'bulan_senyum', 'burung', 'kancil_super'];
  const SESSION_LEN = 8;
  const SCHEMA = 1;

  function blankStore() {
    return {
      v: SCHEMA, profile: null,
      settings: { lang: 'ms', sound: true, motion: 'full', timer: 'none' },
      stars: 0, stickers: {}, newSticker: null, started: 0,
      sessions: [], cat: {}, skills: {}, recent: {},
    };
  }

  const genTag = (q) => q.id.split('-').slice(3).join('-').split('-')[0];
  const recentKey = (cat, level, lang) => `${cat}-${level}-${lang}`;

  /* ---------------- kemahiran ---------------- */
  function skillStat(store, id) {
    return store.skills[id] || { seen: 0, indep: 0, assisted: 0, unsolved: 0, hints: 0, wrong: 0, recent: [] };
  }
  const avg = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
  /** baru | berlatih | mahir | kuasai */
  function skillStatus(st) {
    if (!st || st.seen < 3) return 'baru';
    const sc = avg(st.recent);
    if (sc >= 0.85 && st.seen >= 6) return 'kuasai';
    if (sc >= 0.6) return 'mahir';
    return 'berlatih';
  }
  function needsPractice(st) {
    if (!st || st.seen < 3) return false;
    return avg(st.recent) < 0.6 || st.hints / st.seen >= 0.4;
  }

  /* ---------------- bina sesi ---------------- */
  function buildSession({ cat, level, lang, store, seed, focusSkill }) {
    const s = seed == null ? (Date.now() ^ (Math.random() * 1e9)) >>> 0 : seed;
    const r = Bank.rng(s ^ 0x9e3779b9);
    const pool = Bank.pool(cat, level, lang, s);
    const recent = new Set((store && store.recent[recentKey(cat, level, lang)]) || []);
    const weak = new Set(pool.map((q) => q.skillId).filter((id) => store && needsPractice(skillStat(store, id))));
    const weight = (q) => (recent.has(q.id) ? 0.12 : 1) * (weak.has(q.skillId) ? 3 : 1) * (focusSkill === q.skillId ? 8 : 1);
    const picked = [], tags = {}, pics = {};
    const can = (q) => {
      if (picked.includes(q)) return false;
      const lim = focusSkill === q.skillId ? 4 : 2;
      if ((tags[genTag(q)] || 0) >= lim) return false;
      const pv = q.visual && q.visual.pic;
      if (pv && (pics[pv] || 0) >= 1) return false;
      return true;
    };
    const take = (q) => { picked.push(q); tags[genTag(q)] = (tags[genTag(q)] || 0) + 1; const pv = q.visual && q.visual.pic; if (pv) pics[pv] = (pics[pv] || 0) + 1; };
    const weighted = (cands) => { const tot = cands.reduce((n, q) => n + weight(q), 0); let x = r.next() * tot; for (const q of cands) { x -= weight(q); if (x <= 0) return q; } return cands[cands.length - 1]; };

    if (focusSkill) { for (let k = 0; k < 4; k++) { const c = pool.filter((q) => q.skillId === focusSkill && can(q)); if (!c.length) break; take(weighted(c)); } }
    for (const t of r.shuffle(['mc', 'drag', 'arrange', 'match', 'fill'])) {
      if (picked.length >= SESSION_LEN || picked.some((q) => q.type === t)) continue;
      const c = pool.filter((q) => q.type === t && can(q));
      if (c.length) take(weighted(c));
    }
    while (picked.length < SESSION_LEN) {
      let c = pool.filter(can);
      if (!c.length) c = pool.filter((q) => !picked.includes(q));
      if (!c.length) break;
      take(weighted(c));
    }
    // susun supaya jenis yang sama tidak bersebelahan bila boleh
    let order = r.shuffle(picked);
    for (let k = 0; k < 30; k++) {
      const i = order.findIndex((q, j) => j > 0 && q.type === order[j - 1].type);
      if (i < 0) break;
      const j = order.findIndex((q, jj) => jj !== i && q.type !== order[i - 1].type && (jj === 0 || order[jj - 1].type !== order[i].type) && (jj + 1 >= order.length || order[jj + 1].type !== order[i].type));
      if (j < 0) break;
      [order[i], order[j]] = [order[j], order[i]];
    }
    return { cat, level, lang, seed: s, focusSkill: focusSkill || null, questions: order };
  }

  /* ---------------- markah ---------------- */
  const starsFor = (indep) => (indep >= 7 ? 3 : indep >= 5 ? 2 : 1);
  function scoreResults(results) {
    const indep = results.filter((x) => x.outcome === 'indep').length;
    const assisted = results.filter((x) => x.outcome === 'assisted').length;
    const unsolved = results.filter((x) => x.outcome === 'shown' || x.outcome === 'timeout').length;
    const timeouts = results.filter((x) => x.outcome === 'timeout').length;
    return { done: results.length, indep, assisted, unsolved, timeouts, stars: starsFor(indep) };
  }

  /* ---------------- sticker ---------------- */
  function awardSticker(store, r) {
    const owned = store.stickers || {};
    const fresh = ART_STICKERS.filter((id) => !owned[id]);
    const id = fresh.length ? r.pick(fresh) : r.pick(ART_STICKERS);
    owned[id] = { n: (owned[id] ? owned[id].n : 0) + 1, at: Date.now() };
    store.stickers = owned;
    store.newSticker = id;
    return { id, duplicate: !fresh.length };
  }

  /** Simpan hasil sesi ke dalam store (dipanggil SEKALI bila soalan ke-8 selesai). */
  function applySession(store, session, results, seed) {
    const sc = scoreResults(results);
    store.stars += sc.stars;
    const c = (store.cat[session.cat] = store.cat[session.cat] || {});
    const lv = (c[session.level] = c[session.level] || { best: 0, plays: 0, last: 0 });
    lv.best = Math.max(lv.best, sc.stars); lv.plays += 1; lv.last = sc.stars;
    for (const res of results) {
      const st = (store.skills[res.skillId] = skillStat(store, res.skillId));
      st.seen += 1; st.wrong += res.wrong || 0; if (res.hint) st.hints += 1;
      if (res.outcome === 'indep') st.indep += 1; else if (res.outcome === 'assisted') st.assisted += 1; else st.unsolved += 1;
      st.recent = st.recent.concat([res.outcome === 'indep' ? 1 : res.outcome === 'assisted' ? 0.5 : 0]).slice(-10);
    }
    const rk = recentKey(session.cat, session.level, session.lang);
    store.recent[rk] = (store.recent[rk] || []).concat(results.map((x) => x.qid)).slice(-40);
    const r = Bank.rng((seed ?? Date.now()) >>> 0);
    const sticker = awardSticker(store, r);
    store.sessions.push({ at: Date.now(), cat: session.cat, level: session.level, lang: session.lang, focus: session.focusSkill, ...sc, sticker: sticker.id, hints: results.filter((x) => x.hint).length, wrong: results.reduce((n, x) => n + (x.wrong || 0), 0) });
    if (store.sessions.length > 200) store.sessions = store.sessions.slice(-200);
    return { ...sc, sticker };
  }

  /* ---------------- cadangan ---------------- */
  function bestOf(store, cat, level) { return ((store.cat[cat] || {})[level] || { best: 0, plays: 0, last: 0 }); }
  function recommendLevel(store, cat) {
    for (const L of [1, 2, 3]) {
      const b = bestOf(store, cat, L);
      if (b.best < 3) return L;
    }
    return 3;
  }
  function weakSkills(store) {
    return Object.entries(store.skills).filter(([, st]) => needsPractice(st)).map(([id, st]) => ({ id, st, score: avg(st.recent) })).sort((a, b) => a.score - b.score || b.st.seen - a.st.seen);
  }
  function recommend(store) {
    const weak = weakSkills(store);
    if (weak.length) { const w = weak[0], sk = Bank.SKILLS[w.id]; return { cat: sk.cat, level: sk.level, skill: w.id, why: 'weak' }; }
    for (const cat of Bank.CATS) { const L = recommendLevel(store, cat); if (bestOf(store, cat, L).best < 3) return { cat, level: L, why: 'next' }; }
    return { cat: Bank.CATS[Math.floor(Math.random() * 6)], level: 3, why: 'all' };
  }
  function overallProgress(store) {
    let n = 0;
    for (const cat of Bank.CATS) for (const L of [1, 2, 3]) n += Math.min(3, bestOf(store, cat, L).best);
    return n / 54;
  }
  function catProgress(store, cat) { return [1, 2, 3].reduce((n, L) => n + Math.min(3, bestOf(store, cat, L).best), 0) / 9; }

  const Engine = { SESSION_LEN, SCHEMA, ART_STICKERS, blankStore, buildSession, scoreResults, starsFor, applySession, awardSticker, skillStat, skillStatus, needsPractice, weakSkills, recommend, recommendLevel, bestOf, overallProgress, catProgress, avg };
  if (typeof module !== 'undefined' && module.exports) module.exports = Engine; else root.Engine = Engine;
})(typeof window !== 'undefined' ? window : globalThis);
