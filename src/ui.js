/*
 * Aplikasi: keadaan, navigasi skrin, pengawal sesi permainan, kad markah, album, laporan dan tetapan.
 * Satu store (Engine.blankStore) disimpan melalui Storage; semua skrin membaca store yang sama.
 */
(function (root) {
  const t = (k, v) => I18N.t(k, v);
  const esc = Mech.esc;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const qs = new URLSearchParams(location.search);
  const BENIH = qs.has('benih') ? +qs.get('benih') : null;
  const CATS = Bank.CATS;
  const TONE = { huruf: '#2E9E73', sukukata: '#3A86D0', perkataan: '#D4506C', ayat: '#6A48D0', nombor: '#C98A06', matematik: '#D0600E' };
  const LIGHT = { huruf: '#D2F7E8', sukukata: '#D6EEFF', perkataan: '#FFD6E0', ayat: '#E6DCFF', nombor: '#FFF4B8', matematik: '#FFD9A8' };
  const TIMES = { t30: 30, t60: 60, none: 0 };
  const lvName = (n) => t('level' + n);
  const catName = (c) => t('cat_' + c);
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const bag = {};
  const fromBag = (key, list) => { if (!bag[key] || !bag[key].length) bag[key] = list.slice().sort(() => Math.random() - 0.5); return bag[key].pop(); };

  function starRow(n, max = 3, cls = '') { let h = `<span class="stars ${cls}" aria-label="${n}/${max}">`; for (let i = 0; i < max; i++) h += `<svg viewBox="0 0 24 24" class="${i < n ? 'on' : ''}"><path d="M12 2.6l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17l-5.7 3.1 1.2-6.4L2.8 9.3l6.4-.8z"/></svg>`; return h + '</span>'; }

  /* ---------------- pemasa per soalan ---------------- */
  const Timer = {
    total: 0, left: 0, iv: 0, last: 0, running: false, onTick: null, onEnd: null,
    start(sec, onTick, onEnd) { this.stop(); this.total = this.left = sec; this.onTick = onTick; this.onEnd = onEnd; if (!sec) { onTick && onTick(0, 0); return; } this.running = true; this.last = performance.now(); onTick(this.left, this.total); this.iv = setInterval(() => this.tick(), 200); },
    tick() { if (!this.running) return; const now = performance.now(); this.left = Math.max(0, this.left - (now - this.last) / 1000); this.last = now; this.onTick && this.onTick(this.left, this.total); if (this.left <= 0) { const cb = this.onEnd; this.stop(); cb && cb(); } },
    pause() { if (this.running) { this.tick(); this.running = false; } },
    resume() { if (this.iv && !this.running && this.left > 0) { this.running = true; this.last = performance.now(); } },
    stop() { clearInterval(this.iv); this.iv = 0; this.running = false; },
  };

  /* ---------------- aplikasi ---------------- */
  const App = {
    store: null, screen: 'welcome', params: {}, gateOk: false, sessionCount: 0,
    init() {
      this.store = Storage.load(Engine.blankStore);
      if (!this.store.profile && root.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) this.store.settings.motion = 'reduced';
      I18N.set(this.store.settings.lang);
      Sfx.enabled = this.store.settings.sound;
      document.getElementById('sprite').innerHTML = ART.sprite();
      fx.attach(document.getElementById('fx'));
      fx.quality = this.quality();
      fx.hooks = { burst: () => Sfx.play('boom'), cannon: () => Sfx.play('confetti') };
      addEventListener('resize', () => fx.fit());
      document.addEventListener('pointerdown', () => Sfx.unlock(), { capture: true });
      document.addEventListener('keydown', () => Sfx.unlock(), { capture: true, once: true });
      document.addEventListener('visibilitychange', () => { if (document.hidden && this.screen === 'game') Game.pause(true); });
      document.getElementById('app').addEventListener('click', (e) => this.onClick(e));
      if (qs.has('test')) root.__MISI__ = { App, Game, Bank, Engine, Timer, Storage, Sfx, fx, get q() { return Game.q; }, get store() { return App.store; } };
      this.go('welcome');
    },
    quality() { if (this.store.settings.motion === 'reduced') return 0.25; const low = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 2; return low ? 0.55 : 1; },
    save() { Storage.save(this.store); },
    toast(msg) { const el = document.getElementById('toast'); el.textContent = msg; el.classList.remove('show'); void el.offsetWidth; el.classList.add('show'); clearTimeout(this._tt); this._tt = setTimeout(() => el.classList.remove('show'), 2600); },
    go(screen, params = {}) {
      if (this.screen === 'game') Game.teardown();
      fx.clear();
      this.screen = screen; this.params = params;
      const app = document.getElementById('app');
      app.className = 'scr-' + screen;
      document.body.dataset.screen = screen;
      document.body.classList.toggle('reduced', this.store.settings.motion === 'reduced');
      const R = { welcome: renderWelcome, profile: renderProfile, map: renderMap, cat: renderCat, game: renderGameShell, result: renderResult, album: renderAlbum, report: renderReport, settings: renderSettings }[screen];
      app.innerHTML = R(params);
      app.scrollTop = 0; root.scrollTo(0, 0);
      const world = { welcome: 'welcome', profile: 'welcome', map: 'map', cat: params.cat, game: params.cat, result: params.session && params.session.cat, album: 'map', settings: 'map' }[screen];
      const cv = document.getElementById('world');
      if (world) { cv.hidden = false; Scenes.Backdrop.mount(cv, world, this.store.settings.motion === 'reduced'); } else { Scenes.Backdrop.stop(); cv.hidden = true; }
      document.body.dataset.world = world || 'none';
      document.body.classList.toggle('dark-world', !!world && Scenes.DARK.has(world));
      const after = { map: afterMap, game: () => Game.begin(params), result: afterResult, profile: afterProfile, report: afterReport, album: afterAlbum }[screen];
      if (after) after(params);
      const h = app.querySelector('h1, h2'); if (h) h.setAttribute('tabindex', '-1');
    },
    onClick(e) {
      const b = e.target.closest('[data-act]');
      if (!b || b.disabled) return;
      const act = b.dataset.act, A = ACTIONS[act];
      if (A) { if (!b.classList.contains('silent')) Sfx.play('tap'); A(b, e); }
    },
  };

  /* ---------------- tindakan butang ---------------- */
  const ACTIONS = {
    start: () => App.go(App.store.profile ? 'map' : 'profile'),
    settings: () => App.go('settings', { from: App.screen }),
    map: () => App.go('map'), album: () => App.go('album'), report: () => App.go('report'), home: () => App.go(App.store.profile ? 'map' : 'welcome'),
    back: () => { const f = App.params.from; App.go(f && f !== 'settings' && f !== 'game' ? f : App.store.profile ? 'map' : 'welcome', App.params.fromParams || {}); },
    age: (b) => { $$('[data-act="age"]').forEach((x) => x.classList.toggle('on', x === b)); App.params.age = +b.dataset.v; },
    avatar: (b) => { $$('[data-act="avatar"]').forEach((x) => x.classList.toggle('on', x === b)); App.params.avatar = b.dataset.v; Sfx.play('pick'); },
    saveProfile: () => {
      const name = ($('#nick').value || '').trim().replace(/\s+/g, ' ').slice(0, 12);
      if (!name) { $('#nickErr').hidden = false; $('#nick').focus(); return; }
      App.store.profile = { name, age: App.params.age || 6, avatar: App.params.avatar || 'arnab' };
      App.save(); Sfx.play('world'); App.go('map');
    },
    cat: (b) => App.go('cat', { cat: b.dataset.cat }),
    continue: () => { const r = Engine.recommend(App.store); App.go('game', { cat: r.cat, level: r.level, timer: App.store.settings.timer, focusSkill: r.skill || null }); },
    level: (b) => { App.params.level = +b.dataset.v; $$('[data-act="level"]').forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); }); },
    timer: (b) => { App.params.timer = b.dataset.v; $$('[data-act="timer"]').forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); }); App.store.settings.timer = b.dataset.v; App.save(); },
    play: () => App.go('game', { cat: App.params.cat, level: App.params.level || Engine.recommendLevel(App.store, App.params.cat), timer: App.params.timer || App.store.settings.timer }),
    pause: () => Game.pause(false), resume: () => Game.resume(), restart: () => Game.restart(), quit: () => { Game.teardown(); App.go('cat', { cat: Game.opts.cat }); },
    sound: () => { App.store.settings.sound = !App.store.settings.sound; Sfx.enabled = App.store.settings.sound; App.save(); $$('[data-act="sound"]').forEach((b) => b.classList.toggle('muted', !App.store.settings.sound)); },
    hint: () => Game.hint(), next: () => Game.next(),
    again: () => App.go('game', Object.assign({}, App.params.opts, { focusSkill: null })),
    nextLevel: () => App.go('game', Object.assign({}, App.params.opts, { level: Math.min(3, App.params.opts.level + 1), focusSkill: null })),
    other: () => App.go('map'), seeStickers: () => App.go('album', { highlight: App.store.newSticker }),
    parentReport: () => App.go('report'), celebrate: () => bigCelebration(true),
    gift: (b) => openGift(b), saveSticker: () => { const id = App.store.newSticker; App.store.newSticker = null; App.save(); App.toast(t('st_' + id)); App.go('album', { highlight: id }); },
    gateKey: (b) => gateKey(b.dataset.k),
    practice: (b) => App.go('game', { cat: b.dataset.cat, level: +b.dataset.level, timer: 'none', focusSkill: b.dataset.skill || null }),
    setLang: (b) => { App.store.settings.lang = b.dataset.v; I18N.set(b.dataset.v); App.save(); if (App.screen === 'game') { Game.switchLang(); return; } App.go(App.screen, App.params); },
    setMotion: (b) => { App.store.settings.motion = b.dataset.v; fx.quality = App.quality(); App.save(); App.go('settings', App.params); },
    setSound: (b) => { App.store.settings.sound = b.dataset.v === 'on'; Sfx.enabled = App.store.settings.sound; App.save(); App.go('settings', App.params); },
    setTimer: (b) => { App.store.settings.timer = b.dataset.v; App.save(); App.go('settings', App.params); },
    editProfile: () => App.go('profile', { edit: true }),
    resetAll: () => { if (!App.gateOk) { App.go('report', { thenReset: true }); return; } const lang = App.store.settings.lang; Storage.clear(); App.store = Engine.blankStore(); App.store.settings.lang = lang; App.save(); App.toast(t('resetDone')); App.go('welcome'); },
  };

  /* ---------------- skrin: selamat datang ---------------- */
  function renderWelcome() {
    return `<section class="scr welcome">
      <div class="top-right"><button class="icon-btn" data-act="settings" aria-label="${esc(t('settings'))}">${ART.ui('gear')}</button></div>
      <div class="logo" aria-label="${esc(t('appName'))}"><span class="logo-a">MISI PEMULIHAN</span><span class="logo-b" data-text="3M">3M</span><span class="logo-c">${esc(t('tagline'))}</span></div>
      <div class="kiko-stage">${ART.kiko('kiko--wave kiko-hero')}</div>
      <div class="welcome-card"><h1>${esc(t('welcomeTitle'))}</h1><p>${esc(t('welcomeSub'))}</p>
      <button class="btn-play big" data-act="start">${ART.ui('play')}<span>${esc(t('play'))}</span></button></div>
    </section>`;
  }

  /* ---------------- skrin: profil ---------------- */
  function renderProfile(p) {
    const pr = App.store.profile || {};
    p.age = p.age || pr.age || 6; p.avatar = p.avatar || pr.avatar || 'arnab';
    return `<section class="scr profile">
      <div class="top-bar"><button class="icon-btn" data-act="${App.store.profile ? 'map' : 'home'}" aria-label="${esc(t('back'))}">${ART.ui('back')}</button></div>
      <div class="panel profile-card">
        <div class="profile-kiko">${ART.kiko('kiko--wave')}</div>
        <h1>${esc(t('profileTitle'))}</h1>
        <label class="fld"><span>${esc(t('nick'))}</span><input id="nick" maxlength="12" autocomplete="off" placeholder="${esc(t('nickPh'))}" value="${esc(pr.name || '')}"></label>
        <p class="err" id="nickErr" hidden>${esc(t('nickErr'))}</p>
        <div class="fld"><span>${esc(t('age'))}</span><div class="chips">${[5, 6, 7, 8, 9].map((a) => `<button class="chip-btn${a === p.age ? ' on' : ''}" data-act="age" data-v="${a}">${a}</button>`).join('')}</div></div>
        <div class="fld"><span>${esc(t('avatar'))}</span><div class="avatars">${ART.AVATAR_IDS.map((a) => `<button class="av-btn${a === p.avatar ? ' on' : ''}" data-act="avatar" data-v="${a}" aria-label="${a}">${ART.avatar(a)}</button>`).join('')}</div></div>
        <button class="btn-play" data-act="saveProfile">${esc(t('start'))}</button>
      </div></section>`;
  }
  function afterProfile() { const n = $('#nick'); if (n) { n.addEventListener('keydown', (e) => { if (e.key === 'Enter') ACTIONS.saveProfile(); }); n.addEventListener('input', () => { $('#nickErr').hidden = true; }); } }

  /* ---------------- HUD & tab bawah ---------------- */
  function hud() {
    const s = App.store, pr = s.profile || { name: '', avatar: 'arnab' };
    const owned = Object.keys(s.stickers).length;
    return `<header class="hud"><div class="hud-me">${ART.avatar(pr.avatar, 'hud-av')}<b>${esc(pr.name)}</b></div>
      <div class="hud-chips"><span class="pill" data-testid="stars">${ART.icon('bintang', 'pill-ico')}<b id="starCount">${s.stars}</b></span><span class="pill" data-testid="stickers">${ART.icon('palet', 'pill-ico')}<b>${owned}</b><small>/24</small></span></div>
      <button class="icon-btn" data-act="settings" aria-label="${esc(t('settings'))}">${ART.ui('gear')}</button></header>`;
  }
  function tabbar(on) {
    const tab = (id, ico, label) => `<button class="tab${on === id ? ' on' : ''}" data-act="${id}">${ART.icon(ico, 'tab-ico')}<span>${esc(label)}</span></button>`;
    return `<nav class="tabbar">${tab('map', 'peta', t('map'))}${tab('album', 'cerita', t('album'))}${tab('report', 'laporan', t('report'))}${tab('settings', 'pingat', t('settings'))}</nav>`;
  }

  /* ---------------- skrin: peta pengembaraan ---------------- */
  function renderMap() {
    const s = App.store, rec = Engine.recommend(s), pct = Math.round(Engine.overallProgress(s) * 100);
    const islands = CATS.map((c, i) => {
      const lv = [1, 2, 3].map((L) => Engine.bestOf(s, c, L).best);
      return `<button class="isle ${i % 2 ? 'r' : 'l'}${rec.cat === c ? ' here' : ''}" data-act="cat" data-cat="${c}" style="--cc:${TONE[c]};--cl:${LIGHT[c]}">
        ${rec.cat === c ? `<span class="isle-kiko">${ART.kiko('kiko--idle')}</span>` : ''}
        <span class="isle-art">${ART.island(c)}</span>
        <span class="isle-name"><b>${esc(t('theme_' + c))}</b><small>${esc(catName(c))}</small><span class="isle-lv">${lv.map((b, k) => `<span class="lvm${b ? ' got' : ''}" title="${esc(lvName(k + 1))}">${starRow(b, 3, 'xs')}</span>`).join('')}</span></span>
      </button>`;
    }).join('');
    return `<section class="scr map">${hud()}
      <div class="map-hero panel">
        <div class="mh-kiko">${ART.kiko('kiko--wave')}</div>
        <div class="mh-body"><h1>${esc(t('hello', { name: s.profile.name }))}</h1>
          <div class="prog"><div class="prog-bar"><i style="width:${pct}%"></i></div><span>${esc(t('progress'))} ${pct}%</span></div>
          <button class="btn-play" data-act="continue">${ART.ui('play')}<span>${esc(t('continue'))}</span></button>
          <p class="mh-next">${esc(catName(rec.cat))} · ${esc(lvName(rec.level))}</p>
        </div></div>
      <h2 class="map-title">${esc(t('mapTitle'))}</h2>
      <div class="map-path"><svg class="map-svg" aria-hidden="true"></svg>${islands}</div>
      ${tabbar('map')}</section>`;
  }
  function afterMap() {
    const box = $('.map-path'), svg = $('.map-svg');
    const draw = () => {
      const R = box.getBoundingClientRect();
      const pts = $$('.isle-art', box).map((el) => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2 - R.left, y: r.top + r.height * 0.55 - R.top }; });
      if (pts.length < 2) return;
      let d = `M${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i], my = (a.y + b.y) / 2; d += ` C${a.x} ${my} ${b.x} ${my} ${b.x} ${b.y}`; }
      svg.setAttribute('viewBox', `0 0 ${R.width} ${R.height}`);
      const stars = pts.slice(0, -1).map((a, i) => { const b = pts[i + 1]; const x = (a.x + b.x) / 2, y = (a.y + b.y) / 2; const got = Engine.catProgress(App.store, CATS[i]) >= 1 / 3; return `<g transform="translate(${x} ${y})" class="ms${got ? ' got' : ''}"><circle r="15"/><path d="M0 -8 2.4 -2.4 8.4 -2.2 3.6 1.6 5.2 7.6 0 4.2 -5.2 7.6 -3.6 1.6 -8.4 -2.2 -2.4 -2.4Z"/></g>`; }).join('');
      svg.innerHTML = `<path d="${d}" class="trail-bg"/><path d="${d}" class="trail"/>${stars}`;
    };
    draw();
    const ro = new ResizeObserver(draw); ro.observe(box);
  }

  /* ---------------- skrin: kategori ---------------- */
  function renderCat(p) {
    const s = App.store, c = p.cat, rec = Engine.recommendLevel(s, c);
    p.level = p.level || rec; p.timer = p.timer || s.settings.timer;
    const skills = Object.entries(Bank.SKILLS).filter(([, k]) => k.cat === c);
    const node = (L) => { const b = Engine.bestOf(s, c, L); return `<div class="cpm-node${b.best ? ' got' : ''}"><span>${L}</span>${starRow(b.best, 3, 'xs')}</div>`; };
    return `<section class="scr cat" style="--cc:${TONE[c]};--cl:${LIGHT[c]}">
      <div class="top-bar"><button class="icon-btn" data-act="map" aria-label="${esc(t('back'))}">${ART.ui('back')}</button><h1 class="top-title">${esc(catName(c))}</h1><button class="icon-btn" data-act="map" aria-label="${esc(t('home'))}">${ART.ui('home')}</button></div>
      <div class="panel cat-hero"><div class="ch-ico">${ART.catIcon(c)}</div><div><h2>${esc(t('theme_' + c))}</h2><p>${esc(t('goal_' + c))}</p>
        <div class="cpm">${node(1)}<i></i>${node(2)}<i></i>${node(3)}</div></div></div>
      <div class="panel">
        <h3>${esc(t('chooseLevel'))}</h3>
        <div class="levels">${[1, 2, 3].map((L) => { const b = Engine.bestOf(s, c, L); return `<button class="lvl card3d${L === p.level ? ' on' : ''}" data-act="level" data-v="${L}" aria-pressed="${L === p.level}">${L === rec ? `<span class="badge">${esc(t('recommended'))}</span>` : ''}<span class="lvl-n">${L}</span><b>${esc(lvName(L))}</b>${starRow(b.best)}<small>${b.plays ? esc(t('plays', { n: b.plays })) : esc(t('notPlayed'))}</small></button>`; }).join('')}</div>
        <h3>${ART.ui('clock', 'h3-ico')} ${esc(t('timer'))}</h3>
        <div class="timers">${[['t30', 't30'], ['t60', 't60'], ['none', 'tnone']].map(([v, k]) => `<button class="tmr card3d${p.timer === v ? ' on' : ''}" data-act="timer" data-v="${v}" aria-pressed="${p.timer === v}">${ART.ui(v === 'none' ? 'infinity' : 'clock')}<b>${esc(t(k))}</b>${v !== 'none' ? `<small>${esc(t('perQ'))}</small>` : ''}</button>`).join('')}</div>
        <button class="btn-play" data-act="play">${ART.ui('play')}<span>${esc(t('playBtn'))}</span></button>
      </div>
      <div class="panel skills-panel"><h3>${esc(t('skillsHere'))}</h3><ul class="skill-list">${skills.map(([id, k]) => { const st = Engine.skillStatus(Engine.skillStat(s, id)); return `<li><span>${esc(k[I18N.lang])}</span><em class="sst ${st}">${esc(t('st_' + st))}</em></li>`; }).join('')}</ul></div>
    </section>`;
  }

  /* ---------------- skrin: permainan ---------------- */
  function renderGameShell(p) {
    const c = p.cat;
    return `<section class="scr game" style="--cc:${TONE[c]};--cl:${LIGHT[c]}">
      <header class="ghud">
        <button class="icon-btn" data-act="pause" aria-label="${esc(t('home'))}">${ART.ui('home')}</button>
        <div class="gmid"><div class="gtitle">${esc(catName(c))} · ${esc(lvName(p.level))}</div>
          <div class="gprog"><div class="gbar"><i></i></div><span class="gcount" data-testid="qcount"></span></div></div>
        <div class="gright"><div class="ring" hidden><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="19" class="ring-bg"/><circle cx="22" cy="22" r="19" class="ring-fg"/></svg><b></b></div>
        <button class="icon-btn snd${App.store.settings.sound ? '' : ' muted'}" data-act="sound" aria-label="${esc(t('sound'))}">${ART.icon('speaker', 'on-ico')}${ART.icon('senyap', 'off-ico')}</button></div>
      </header>
      <main class="qwrap"><div class="qcard panel"><div class="qprompt"></div><div class="qvisual"></div><div class="qmech"></div></div></main>
      <div class="kiko-dock"><div class="bubble" id="bubble"></div>${ART.kiko('kiko--idle kiko-game')}</div>
      <button class="hint-btn card3d" data-act="hint">${ART.ui('bulb')}<span>${esc(t('hint'))}</span></button>
      <div class="praise-layer" aria-live="polite"></div>
      <div class="sheet" id="sheet" hidden></div>
      <div class="modal" id="pause" hidden></div>
    </section>`;
  }

  const Game = {
    opts: null, session: null, i: 0, results: [], q: null, mech: null, attempts: 0, hinted: false, solved: false, busy: false, paused: false,
    begin(opts) {
      this.opts = opts;
      const seed = BENIH != null ? BENIH + App.sessionCount : null;
      App.sessionCount++;
      this.session = Engine.buildSession({ cat: opts.cat, level: opts.level, lang: I18N.lang, store: App.store, seed, focusSkill: opts.focusSkill });
      App.store.started += 1; App.save();
      this.i = 0; this.results = [];
      this.show();
    },
    show() {
      const q = (this.q = this.session.questions[this.i]);
      this.attempts = 0; this.hinted = false; this.solved = false; this.busy = false; this.wrongCount = 0;
      const n = this.session.questions.length;
      $('.gcount').textContent = t('question', { i: this.i + 1, n });
      $('.gbar i').style.width = `${(this.i / n) * 100}%`;
      $('.qprompt').innerHTML = `<p translate="no">${esc(q.prompt)}</p>`;
      $('.qvisual').innerHTML = Mech.visual(q.visual, t);
      $('.qcard').dataset.type = q.type; $('.qcard').dataset.qid = q.id;
      $('#sheet').hidden = true;
      $('.hint-btn').disabled = false; $('.hint-btn').classList.remove('used');
      this.say(t('kikoHi'), 'idle');
      if (this.mech) this.mech.destroy();
      const card = $('.qcard'); card.classList.remove('enter'); void card.offsetWidth; card.classList.add('enter');
      this.mech = Mech.mount(q.type, $('.qmech'), q, {
        onWrong: () => this.wrong(), onPartial: (x, y) => fx.placeAt(x, y), onSolved: (r) => this.correct(r), sfx: (s) => Sfx.play(s), t,
      });
      const sec = TIMES[this.opts.timer] || 0;
      const ring = $('.ring');
      ring.hidden = !sec;
      Timer.start(sec, (left, total) => this.drawRing(left, total), () => this.timeout());
    },
    drawRing(left, total) {
      const ring = $('.ring'); if (!ring || !total) return;
      const C = 2 * Math.PI * 19;
      $('.ring-fg', ring).style.strokeDashoffset = String(C * (1 - left / total));
      $('b', ring).textContent = Math.ceil(left);
      ring.classList.toggle('low', left <= 5);
    },
    say(text, mood) {
      const b = $('#bubble'); if (!b) return;
      b.innerHTML = esc(text); b.classList.remove('show'); void b.offsetWidth; b.classList.add('show');
      const k = $('.kiko-game'); if (!k) return;
      k.classList.remove('kiko--idle', 'kiko--cheer', 'kiko--point', 'kiko--think', 'kiko--clap');
      void k.getBoundingClientRect();
      k.classList.add('kiko--' + (mood || 'idle'));
    },
    floatText(text, cls) {
      const layer = $('.praise-layer'); if (!layer) return;
      const el = document.createElement('div');
      el.className = 'praise ' + (cls || ''); el.dataset.text = text; el.textContent = text;
      layer.appendChild(el); setTimeout(() => el.remove(), cls === 'oops' ? 1300 : 1900);
    },
    wrong() {
      if (this.solved) return;
      this.attempts++; this.wrongCount++;
      Sfx.play('wrong');
      this.floatText(t('tryAgain'), 'oops');
      if (this.attempts === 1) this.say(fromBag('wrong' + I18N.lang, t('wrongMsg')), 'think');
      else if (this.attempts === 2) { this.hinted = true; this.say(`${t('guided')} ${this.q.hint}`, 'point'); this.mech.guide(); $('.hint-btn').classList.add('used'); }
      else this.finish('shown');
    },
    hint() {
      if (this.solved || !this.q) return;
      this.hinted = true; $('.hint-btn').classList.add('used');
      this.say(`${t('kikoHint')}: ${this.q.hint}`, 'point');
    },
    correct(rect) {
      if (this.solved) return;
      this.solved = true; Timer.stop();
      const outcome = this.attempts === 0 && !this.hinted ? 'indep' : 'assisted';
      this.record(outcome);
      const x = rect ? rect.left + rect.width / 2 : innerWidth / 2, y = rect ? rect.top + rect.height / 2 : innerHeight / 2;
      celebrate(x, y);
      this.floatText(fromBag('praise' + I18N.lang, t('praise')), 'yay');
      this.say(fromBag('praise2' + I18N.lang, t('praise')), 'cheer');
      $('.hint-btn').disabled = true;
      this.advanceTimer = setTimeout(() => this.next(), App.store.settings.motion === 'reduced' ? 1100 : 1800);
    },
    finish(kind) {
      if (this.solved) return;
      this.solved = true; Timer.stop();
      this.mech.lock(); this.mech.reveal();
      this.record(kind);
      Sfx.play(kind === 'timeout' ? 'timeout' : 'whoosh');
      $('.hint-btn').disabled = true;
      const sh = $('#sheet');
      sh.innerHTML = `<div class="sheet-card${kind === 'timeout' ? ' time' : ''}"><div class="sheet-ico">${kind === 'timeout' ? ART.ui('clock') : ART.icon('bintang')}</div><div><b>${esc(kind === 'timeout' ? t('timeUp') : t('shown'))}</b><p><span>${esc(t('answerIs'))}:</span> ${esc(this.q.explanation)}</p></div><button class="btn-play sm" data-act="next">${esc(t('next'))}</button></div>`;
      sh.hidden = false;
      this.say(kind === 'timeout' ? t('timeUp') : t('shown'), 'think');
      setTimeout(() => { const b = $('#sheet [data-act="next"]'); b && b.focus(); }, 50);
    },
    timeout() { if (!this.solved) { this.mech.lock(); this.finish('timeout'); } },
    record(outcome) { this.results.push({ qid: this.q.id, skillId: this.q.skillId, type: this.q.type, outcome, wrong: this.wrongCount, hint: this.hinted }); },
    next() {
      clearTimeout(this.advanceTimer);
      if (!this.solved || this.results.length !== this.i + 1) return;
      this.i++;
      if (this.i >= this.session.questions.length) return this.end();
      this.show();
    },
    end() {
      Timer.stop();
      if (this.mech) { this.mech.destroy(); this.mech = null; }
      $('.gbar i').style.width = '100%';
      const res = Engine.applySession(App.store, this.session, this.results, BENIH != null ? BENIH + App.sessionCount : null);
      App.save();
      App.go('result', { res, opts: Object.assign({}, this.opts), session: { cat: this.session.cat, level: this.session.level } });
    },
    pause(auto) {
      if (this.paused) return;
      this.paused = true; Timer.pause();
      const m = $('#pause'); if (!m) return;
      m.innerHTML = `<div class="modal-card panel"><div class="mc-kiko">${ART.kiko('kiko--idle')}</div><h2>${esc(t('pauseTitle'))}</h2><p>${esc(t('quitNote'))}</p>
        <div class="seg">${['ms', 'en'].map((l) => `<button class="seg-b${I18N.lang === l ? ' on' : ''}" data-act="setLang" data-v="${l}">${ART.ui('globe')}${l === 'ms' ? 'BM' : 'EN'}</button>`).join('')}</div>
        <button class="btn-play" data-act="resume">${ART.ui('play')}<span>${esc(t('resume'))}</span></button>
        <div class="row2"><button class="btn-soft" data-act="restart">${ART.ui('reset')}<span>${esc(t('restart'))}</span></button><button class="btn-soft warn" data-act="quit">${ART.ui('home')}<span>${esc(t('quit'))}</span></button></div></div>`;
      m.hidden = false;
      if (!auto) setTimeout(() => $('[data-act="resume"]', m).focus(), 30);
    },
    resume() { this.paused = false; $('#pause').hidden = true; if (!this.solved) Timer.resume(); },
    restart() { this.paused = false; App.go('game', Object.assign({}, this.opts)); },
    switchLang() { this.paused = false; App.toast(t('langRestart')); App.go('game', Object.assign({}, this.opts)); },
    teardown() { Timer.stop(); clearTimeout(this.advanceTimer); if (this.mech) { this.mech.destroy(); this.mech = null; } this.paused = false; fx.clear(); },
  };

  /* ---------------- sambutan ---------------- */
  function celebrate(x, y) {
    Sfx.play('correct');
    const dark = document.body.classList.contains('dark-world');
    fx.correctAt(x, y);
    if (App.store.settings.motion === 'reduced') return;
    fx.cannons(55);
    const n = fx.quality >= 0.9 ? 3 : 2;
    for (let k = 0; k < n; k++) fx.after(k * 0.18, () => fx.launch(undefined, undefined, dark));
    fx.after(0.25, () => Sfx.play('fireworks'));
  }
  function bigCelebration(again) {
    const dark = document.body.classList.contains('dark-world');
    if (again) Sfx.play('correct');
    if (App.store.settings.motion === 'reduced') { fx.rain(1.5, 20); return; }
    fx.cannons(120); fx.rain(3.2, 70); fx.fireworks(3.6, dark);
    fx.after(0.3, () => Sfx.play('fireworks'));
    const k = $('.res-kiko .kiko'); if (k) { k.classList.remove('kiko--cheer'); void k.getBoundingClientRect(); k.classList.add('kiko--cheer'); }
  }

  /* ---------------- skrin: kad markah ---------------- */
  function renderResult(p) {
    const s = App.store, r = p.res, pr = s.profile;
    const msg = r.stars === 3 ? t('resultProud') : t('resultGood');
    const canNext = r.stars === 3 && p.session.level < 3;
    return `<section class="scr result" style="--cc:${TONE[p.session.cat]}">
      <div class="res-kiko">${ART.kiko('kiko--cheer')}</div>
      <div class="res-card panel">
        <div class="res-head">${ART.avatar(pr.avatar, 'res-av')}<div><h1>${esc(t('resultTitle', { name: pr.name.toUpperCase() }))}</h1><p>${esc(t('resultSub'))}</p></div></div>
        <div class="res-cat">${ART.catIcon(p.session.cat, 'res-cat-ico')}<span>${esc(catName(p.session.cat))}</span><b>${esc(t('levelN', { n: p.session.level }))} · ${esc(lvName(p.session.level))}</b></div>
        <div class="res-stars" data-stars="${r.stars}">${[0, 1, 2].map((i) => `<span class="rs${i < r.stars ? ' earn' : ''}" style="--d:${0.5 + i * 0.45}s">${ART.icon('bintang')}</span>`).join('')}</div>
        <ul class="res-stats">
          <li><span>${esc(t('done'))}</span><b data-testid="done">${r.done}</b></li>
          <li class="g"><span>${esc(t('indep'))}</span><b data-testid="indep">${r.indep}</b></li>
          <li class="y"><span>${esc(t('assisted'))}</span><b data-testid="assisted">${r.assisted}</b></li>
          <li class="o"><span>${esc(t('unsolved'))}</span><b data-testid="unsolved">${r.unsolved}</b></li>
        </ul>
        <p class="res-msg">${esc(msg)}</p>
        <button class="link-btn" data-act="celebrate">${ART.icon('bintang', 'tiny-ico')}${esc(t('celebrate'))}</button>
      </div>
      <div class="gift-panel panel" id="giftPanel">
        ${s.newSticker ? `<p class="gift-tip">${esc(t('tapGift'))}</p><button class="gift-btn silent" data-act="gift" aria-label="${esc(t('tapGift'))}">${ART.giftBox()}</button>` : `<p class="gift-tip">${esc(t('yourSticker'))}</p><div class="sticker-show">${ART.sticker(r.sticker.id)}</div><b class="st-name">${esc(t('st_' + r.sticker.id))}</b>`}
      </div>
      <div class="res-actions">
        ${canNext ? `<button class="btn-play" data-act="nextLevel">${ART.ui('play')}<span>${esc(t('nextLevel'))}</span></button>` : ''}
        <button class="${canNext ? 'btn-soft' : 'btn-play'}" data-act="again">${ART.ui('reset')}<span>${esc(t('again'))}</span></button>
        <button class="btn-soft" data-act="other">${ART.ui('home')}<span>${esc(t('other'))}</span></button>
        <button class="btn-soft" data-act="seeStickers">${ART.icon('cerita', 'btn-ico')}<span>${esc(t('seeStickers'))}</span></button>
        <button class="btn-soft" data-act="parentReport">${ART.icon('laporan', 'btn-ico')}<span>${esc(t('parentReport'))}</span></button>
      </div></section>`;
  }
  function afterResult(p) {
    const r = p.res;
    Sfx.play('world');
    bigCelebration(false);
    $$('.rs.earn').forEach((el, i) => setTimeout(() => { if (App.screen !== 'result') return; el.classList.add('in'); const c = el.getBoundingClientRect(); fx.starLand(c.left + c.width / 2, c.top + c.height / 2, 46); Sfx.play('star'); }, 600 + i * 450));
    if (r.sticker.duplicate) App.toast(t('dupSticker'));
  }
  function openGift(btn) {
    const id = App.store.newSticker; if (!id || btn.classList.contains('open')) return;
    btn.classList.add('open'); Sfx.play('sticker');
    const r = btn.getBoundingClientRect();
    setTimeout(() => {
      fx.starLand(r.left + r.width / 2, r.top + r.height / 3, 70);
      if (App.store.settings.motion !== 'reduced') fx.cannons(40);
      $('#giftPanel').innerHTML = `<div class="reveal"><div class="glow-burst"></div><div class="sticker-pop">${ART.sticker(id)}</div><h2 class="new-st" data-text="${esc(t('newSticker'))}">${esc(t('newSticker'))}</h2><b class="st-name">${esc(t('st_' + id))}</b>
        <button class="btn-play" data-act="saveSticker">${ART.icon('cerita', 'btn-ico')}<span>${esc(t('saveAlbum'))}</span></button></div>`;
    }, App.store.settings.motion === 'reduced' ? 100 : 650);
  }

  /* ---------------- skrin: album ---------------- */
  function renderAlbum(p) {
    const own = App.store.stickers, n = Object.keys(own).length;
    const slot = (id) => own[id]
      ? `<div class="st-slot got${p.highlight === id ? ' new' : ''}" data-sticker-slot="${id}">${ART.sticker(id)}<b>${esc(t('st_' + id))}</b>${own[id].n > 1 ? `<span class="st-x">×${own[id].n}</span>` : ''}</div>`
      : `<div class="st-slot" data-sticker-slot="${id}">${ART.stickerLocked()}<b>${esc(t('locked'))}</b></div>`;
    const ids = Engine.ART_STICKERS;
    return `<section class="scr album">${hud()}
      <div class="album-head"><h1>${esc(t('albumTitle'))}</h1><span class="pill big" data-testid="albumCount">${esc(t('collected', { n }))}</span></div>
      ${n ? '' : `<p class="album-empty panel">${esc(t('albumEmpty'))}</p>`}
      <div class="book"><div class="page">${ids.slice(0, 12).map(slot).join('')}</div><div class="page">${ids.slice(12).map(slot).join('')}</div></div>
      ${tabbar('album')}</section>`;
  }
  function afterAlbum(p) { if (p.highlight) { const el = $(`[data-sticker-slot="${p.highlight}"]`); if (el) { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); setTimeout(() => { const r = el.getBoundingClientRect(); fx.starLand(r.left + r.width / 2, r.top + r.height / 2, 50); }, 400); } } }

  /* ---------------- pintu dewasa ---------------- */
  let gate = null;
  function renderGate() {
    gate = { a: 6 + Math.floor(Math.random() * 4), b: 3 + Math.floor(Math.random() * 7), v: '' };
    return `<div class="panel gate"><div class="gate-ico">${ART.icon('kunci')}</div><h2>${esc(t('gateTitle'))}</h2><p>${esc(t('gateQ', { a: gate.a, b: gate.b }))}</p>
      <div class="gate-val" id="gateVal">&nbsp;</div><p class="err" id="gateErr" hidden>${esc(t('gateWrong'))}</p>
      <div class="pad">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button class="key3d" data-act="gateKey" data-k="${n}">${n}</button>`).join('')}<button class="key3d k-del" data-act="gateKey" data-k="del" aria-label="${esc(t('erase'))}">${ART.ui('backspace')}</button><button class="key3d" data-act="gateKey" data-k="0">0</button><button class="key3d k-ok" data-act="gateKey" data-k="ok" aria-label="${esc(t('gateEnter'))}">${ART.ui('check')}</button></div></div>`;
  }
  function gateKey(k) {
    if (!gate) return;
    if (k === 'del') gate.v = gate.v.slice(0, -1);
    else if (k === 'ok') {
      if (+gate.v === gate.a * gate.b) { App.gateOk = true; const then = App.params.thenReset; App.go('report', {}); if (then) ACTIONS.resetAll(); return; }
      gate.v = ''; $('#gateErr').hidden = false; Sfx.play('wrong');
    } else if (gate.v.length < 3) gate.v += k;
    $('#gateVal').textContent = gate.v || ' ';
  }

  /* ---------------- skrin: laporan ibu bapa ---------------- */
  function renderReport(p) {
    const s = App.store, pr = s.profile || { name: '-', age: '-' };
    if (!App.gateOk) return `<section class="scr report">${hud()}<div class="report-wrap">${renderGate()}</div>${tabbar('report')}</section>`;
    const ses = s.sessions, nQ = ses.reduce((n, x) => n + x.done, 0);
    const indep = ses.reduce((n, x) => n + x.indep, 0), hints = ses.reduce((n, x) => n + x.hints, 0);
    const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
    const skills = Object.entries(s.skills).map(([id, st]) => ({ id, st, status: Engine.skillStatus(st), meta: Bank.SKILLS[id] })).filter((x) => x.meta);
    const mastered = skills.filter((x) => x.status === 'kuasai' || x.status === 'mahir');
    const weak = Engine.weakSkills(s).filter((w) => Bank.SKILLS[w.id]);
    const rec = Engine.recommend(s);
    let recBox;
    if (!ses.length) recBox = `<p class="muted">${esc(t('noData'))}</p>`;
    else if (weak.length) {
      const w = weak[0], m = Bank.SKILLS[w.id];
      recBox = `<div class="rec warn"><b class="rec-h">${esc(t('needsMore', { name: pr.name }).toUpperCase())}</b><p><span>${esc(t('skillLabel'))}:</span> <b>${esc(m[I18N.lang])}</b></p><p>${esc(t('suggest', { cat: catName(m.cat), level: `${t('levelN', { n: m.level })} (${lvName(m.level)})` }))}</p><p class="muted">${esc(t('why', { a: w.st.indep, b: w.st.seen, h: w.st.hints }))}</p>
        <button class="btn-play" data-act="practice" data-cat="${m.cat}" data-level="${m.level}" data-skill="${w.id}">${ART.ui('play')}<span>${esc(t('startPractice'))}</span></button></div>`;
    } else recBox = `<div class="rec ok"><b class="rec-h">${esc(t('goodWork', { name: pr.name }))}</b><p>${esc(t('nextUp', { cat: catName(rec.cat), level: lvName(rec.level) }))}</p><button class="btn-play" data-act="practice" data-cat="${rec.cat}" data-level="${rec.level}">${ART.ui('play')}<span>${esc(t('startPractice'))}</span></button></div>`;
    const stat = (label, val, id) => `<div class="kpi"><b data-testid="${id}">${val}</b><span>${esc(label)}</span></div>`;
    return `<section class="scr report">${hud()}<div class="report-wrap">
      <div class="panel rp-head">${ART.avatar(pr.avatar, 'rp-av')}<div><h1>${esc(t('reportTitle'))}</h1><p><b>${esc(pr.name)}</b> · ${esc(t('ageL'))} ${esc(pr.age)} ${esc(t('years'))}</p></div></div>
      <div class="kpis">${stat(t('sessions'), s.started, 'kSessions')}${stat(t('missions'), ses.length, 'kMissions')}${stat(t('totalStars'), s.stars, 'kStars')}${stat(t('totalStickers'), Object.keys(s.stickers).length, 'kStickers')}${stat(t('indepRate'), pct(indep, nQ) + '%', 'kIndep')}${stat(t('hintRate'), pct(hints, nQ) + '%', 'kHint')}</div>
      <div class="panel"><h2>${esc(t('recTitle'))}</h2>${recBox}</div>
      <div class="panel"><h2>${esc(t('catProgress'))}</h2>${CATS.map((c) => { const v = Math.round(Engine.catProgress(s, c) * 100); return `<div class="cp-row" style="--cc:${TONE[c]}">${ART.catIcon(c, 'cp-ico')}<span>${esc(catName(c))}</span><div class="cp-bar"><i style="width:${v}%"></i></div><b>${v}%</b></div>`; }).join('')}</div>
      <div class="panel two"><div><h2>${esc(t('mastered'))}</h2>${mastered.length ? `<ul class="skill-list">${mastered.map((x) => `<li><span>${esc(x.meta[I18N.lang])}</span><em class="sst ${x.status}">${esc(t('st_' + x.status))}</em></li>`).join('')}</ul>` : `<p class="muted">${esc(t('none'))}</p>`}</div>
        <div><h2>${esc(t('needPractice'))}</h2>${weak.length ? `<ul class="skill-list">${weak.map((w) => `<li><span>${esc(Bank.SKILLS[w.id][I18N.lang])}</span><em class="sst berlatih">${esc(t('why', { a: w.st.indep, b: w.st.seen, h: w.st.hints }).replace(/^[^:]+:\s*/, ''))}</em></li>`).join('')}</ul>` : `<p class="muted">${esc(t('none'))}</p>`}</div></div>
      <div class="panel"><h2>${esc(t('skillsAll'))}</h2>${skills.length ? `<ul class="skill-list">${skills.map((x) => `<li><span>${esc(x.meta[I18N.lang])}</span><em class="sst ${x.status}">${esc(t('st_' + x.status))}</em></li>`).join('')}</ul>` : `<p class="muted">${esc(t('noData'))}</p>`}</div>
      <div class="panel"><h2>${esc(t('recent'))}</h2>${ses.length ? `<ul class="recent">${ses.slice(-6).reverse().map((x) => `<li>${ART.catIcon(x.cat, 'cp-ico')}<span>${esc(catName(x.cat))} · ${esc(lvName(x.level))}</span>${starRow(x.stars, 3, 'xs')}<small>${x.indep}/8</small></li>`).join('')}</ul>` : `<p class="muted">${esc(t('none'))}</p>`}</div>
      <p class="disclaimer">${esc(t('disclaimer'))}</p>
    </div>${tabbar('report')}</section>`;
  }
  function afterReport() { if (gate && !App.gateOk) { const onKey = (e) => { if (App.screen !== 'report' || App.gateOk) { document.removeEventListener('keydown', onKey); return; } if (/^\d$/.test(e.key)) gateKey(e.key); else if (e.key === 'Backspace') gateKey('del'); else if (e.key === 'Enter') gateKey('ok'); }; document.addEventListener('keydown', onKey); } }

  /* ---------------- skrin: tetapan ---------------- */
  function renderSettings() {
    const s = App.store.settings;
    const seg = (act, items, cur) => `<div class="seg">${items.map(([v, label, ico]) => `<button class="seg-b${cur === v ? ' on' : ''}" data-act="${act}" data-v="${v}" aria-pressed="${cur === v}">${ico ? ART.ui(ico) : ''}${esc(label)}</button>`).join('')}</div>`;
    return `<section class="scr settings">${App.store.profile ? hud() : `<div class="top-bar"><button class="icon-btn" data-act="home" aria-label="${esc(t('back'))}">${ART.ui('back')}</button></div>`}
      <div class="report-wrap"><div class="panel"><h1>${esc(t('settings'))}</h1>
        <div class="set-row"><span>${ART.ui('globe', 'set-ico')}${esc(t('lang'))}</span>${seg('setLang', [['ms', 'Bahasa Melayu'], ['en', 'English']], s.lang)}</div>
        <div class="set-row"><span>${ART.icon('speaker', 'set-ico3')}${esc(t('sound'))}</span>${seg('setSound', [['on', t('on')], ['off', t('off')]], s.sound ? 'on' : 'off')}</div>
        <div class="set-row"><span>${ART.icon('bintang', 'set-ico3')}${esc(t('motion'))}</span>${seg('setMotion', [['full', t('full')], ['reduced', t('reduced')]], s.motion)}</div>
        <div class="set-row"><span>${ART.ui('clock', 'set-ico')}${esc(t('defTimer'))}</span>${seg('setTimer', [['t30', t('t30')], ['t60', t('t60')], ['none', t('tnone')]], s.timer)}</div>
        <p class="set-note">${esc(t('voiceNote'))}</p>
        <p class="set-note ${Storage.available ? 'ok' : 'warn'}" data-testid="storage">${esc(Storage.available ? t('storageOk') : t('storageNo'))}</p>
        <div class="row2">${App.store.profile ? `<button class="btn-soft" data-act="editProfile">${ART.ui('gear')}<span>${esc(t('editProfile'))}</span></button>` : ''}<button class="btn-soft warn" data-act="resetAll">${ART.ui('reset')}<span>${esc(t('resetAll'))}</span></button></div>
        ${App.gateOk ? '' : `<p class="set-note">${esc(t('adultOnly'))}: ${esc(t('resetAll'))}</p>`}
      </div></div>${App.store.profile ? tabbar('settings') : ''}</section>`;
  }

  root.App = App;
  root.Game = Game;
  addEventListener('DOMContentLoaded', () => App.init());
})(window);
