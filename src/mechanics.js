/*
 * Lima mekanik soalan. Setiap satu: mount(el, q, api) → { guide(), reveal(), lock(), destroy() }.
 * api: onWrong(), onPartial(x, y), onSolved(rect), sfx(name), t(key).
 * Jawapan disahkan HANYA melalui Bank.check(); tiada jawapan dikod keras di sini.
 * Seret guna Pointer Events (tetikus + sentuh + pen) dengan "hantu" fixed supaya tidak terpotong oleh bekas skrol,
 * dan setiap kad juga boleh diketik-pilih kemudian diketik-letak.
 */
(function (root) {
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (el, s) => el.querySelector(s);
  const $$ = (el, s) => [...el.querySelectorAll(s)];
  const center = (el) => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };
  const shake = (el) => { if (!el) return; el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); setTimeout(() => el.classList.remove('shake'), 520); };
  const pop = (el) => { if (!el) return; el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); };

  /* ---------------- kandungan kad & visual ---------------- */
  function countGrid(pic, n, cls = '', cross = 0) {
    let h = `<div class="cnt ${cls} n${Math.min(n, 20)}" data-count="${n}">`;
    for (let i = 0; i < n; i++) h += `<span class="cnt-i${i >= n - cross ? ' crossed' : ''}">${ART.pic(pic)}</span>`;
    return h + '</div>';
  }
  function blocks(t, u) {
    let h = '<div class="b10">';
    for (let i = 0; i < t; i++) h += '<span class="b10-rod">' + '<i></i>'.repeat(10) + '</span>';
    h += '<span class="b10-units">' + '<i></i>'.repeat(u) + '</span>';
    return h + '</div>';
  }
  const money = (ns) => `<div class="money">${ns.map((n) => ART.note(n)).join('')}</div>`;
  function frames(n, cross = 0) {
    let h = '<div class="tf-wrap">';
    const k = Math.ceil(Math.max(n, 1) / 10);
    for (let f = 0; f < k; f++) {
      h += '<div class="tf">';
      for (let i = 0; i < 10; i++) { const idx = f * 10 + i; h += `<i class="${idx < n ? 'on' : ''}${idx < n && idx >= n - cross ? ' x' : ''}"></i>`; }
      h += '</div>';
    }
    return h + '</div>';
  }
  function content(c) {
    if (c.pic) return `<span class="c-pic">${ART.pic(c.pic)}</span>`;
    if (c.count) return countGrid(c.count.pic, c.count.n, 'mini');
    if (c.blocks) return blocks(c.blocks.t, c.blocks.u);
    if (c.money) return money(c.money);
    return `<span class="lbl${c.small || String(c.t).length > 9 ? ' sm' : ''}${String(c.t).length > 26 ? ' xs' : ''}" translate="no">${esc(c.t)}</span>`;
  }
  function visual(v, t) {
    if (!v) return '';
    switch (v.k) {
      case 'pic': return `<div class="v-pic">${ART.pic(v.pic, 'big')}</div>`;
      case 'big': return `<div class="v-big${v.small ? ' sm' : ''}" translate="no">${esc(v.t)}</div>`;
      case 'story': return `<div class="v-story">${ART.icon('cerita', 'story-ico')}<p>${esc(v.t)}</p></div>`;
      case 'count': return `<div class="v-count">${countGrid(v.pic, v.n)}</div>`;
      case 'groups': return `<div class="v-groups"><div class="grp"><b>A</b>${countGrid(v.pic, v.a, 'mini')}</div><div class="grp"><b>B</b>${countGrid(v.pic, v.b, 'mini')}</div></div>`;
      case 'add': return `<div class="v-op">${countGrid(v.pic, v.a, 'mini')}<span class="opx">+</span>${countGrid(v.pic, v.b, 'mini')}</div>`;
      case 'sub': return `<div class="v-op">${countGrid(v.pic, v.n, 'mini', v.k2)}</div>`;
      case 'dots': return `<div class="v-op"><div class="dots a">${'<i></i>'.repeat(v.a)}</div><span class="opx">+</span><div class="dots b">${'<i></i>'.repeat(v.b)}</div></div>`;
      case 'tenframe': return `<div class="v-op">${frames(v.n, v.cross || 0)}</div>`;
      case 'tenadd': return `<div class="v-op">${frames(v.a)}<span class="opx">+</span>${frames(v.b)}</div>`;
      case 'blocks': return `<div class="v-op">${blocks(v.t, v.u)}</div>`;
      case 'money': return `<div class="v-op">${money(v.notes)}</div>`;
      case 'shop': return `<div class="v-shop"><div class="shop-item">${ART.pic(v.pic)}<span class="tag">RM${v.price}</span></div><div class="shop-pay"><small>${esc(t('pay'))}</small>${ART.note(v.pay)}</div></div>`;
      case 'col': return `<div class="v-col" translate="no"><span>${v.a}</span><span>${v.op} ${v.b}</span><hr></div>`;
      case 'dir': return `<div class="v-dir ${v.up ? 'up' : 'down'}">${ART.ui(v.up ? 'arrowUp' : 'arrowDown')}<span>${esc(t(v.up ? 'ascending' : 'descending'))}</span></div>`;
      default: return '';
    }
  }

  /* ---------------- seret: penunjuk + hantu ---------------- */
  let activeGhost = null;
  function dragger(el, o) {
    let st = null;
    const down = (e) => {
      if (e.button > 0 || o.disabled()) return;
      st = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: false, ghost: null, over: null };
      el.setPointerCapture && el.setPointerCapture(e.pointerId);
    };
    const move = (e) => {
      if (!st || e.pointerId !== st.id) return;
      const dx = e.clientX - st.x, dy = e.clientY - st.y;
      if (!st.moved && Math.hypot(dx, dy) < 8) return;
      e.preventDefault();
      if (!st.moved) {
        st.moved = true;
        const r = el.getBoundingClientRect();
        const g = el.cloneNode(true);
        g.classList.add('ghost'); g.classList.remove('selected', 'glow');
        Object.assign(g.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
        document.body.appendChild(g);
        st.ghost = g; st.r = r; activeGhost = g;
        el.classList.add('placeholder');
        o.onStart && o.onStart();
      }
      st.ghost.style.transform = `translate(${dx}px, ${dy}px) scale(1.08) rotate(${Math.max(-6, Math.min(6, dx / 30))}deg)`;
      const hit = document.elementFromPoint(e.clientX, e.clientY);
      const over = hit && hit.closest(o.drop);
      if (over !== st.over) { if (st.over) st.over.classList.remove('over'); if (over) over.classList.add('over'); st.over = over; }
    };
    const up = (e) => {
      if (!st || e.pointerId !== st.id) return;
      const s = st; st = null;
      if (s.over) s.over.classList.remove('over');
      if (!s.moved) { if (e.type === 'pointerup') o.onTap(); return; }
      const back = (cb) => { const g = s.ghost; g.style.transition = 'transform .32s cubic-bezier(.2,1.4,.4,1)'; g.style.transform = 'translate(0,0) scale(1)'; setTimeout(() => { g.remove(); el.classList.remove('placeholder'); if (activeGhost === g) activeGhost = null; cb && cb(); }, 320); };
      const land = (toEl, cb) => { const g = s.ghost, r = toEl.getBoundingClientRect(); g.style.transition = 'transform .2s ease-out'; g.style.transform = `translate(${r.left + r.width / 2 - (s.r.left + s.r.width / 2)}px, ${r.top + r.height / 2 - (s.r.top + s.r.height / 2)}px) scale(1)`; setTimeout(() => { g.remove(); el.classList.remove('placeholder'); if (activeGhost === g) activeGhost = null; cb && cb(); }, 200); };
      if (e.type !== 'pointerup' || !s.over) { back(); return; }
      o.onDrop(s.over, { back, land });
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('lostpointercapture', (e) => { if (st && st.moved) up(Object.assign({}, e, { type: 'pointercancel', pointerId: st.id })); });
    el.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && !o.disabled()) { e.preventDefault(); o.onTap(); } });
  }

  /* =====================================================================
   * 1. OBJEKTIF
   * ===================================================================== */
  function mountMC(el, q, api) {
    let locked = false;
    const pics = q.options.some((o) => o.pic);
    el.innerHTML = `<div class="mc-grid n${q.options.length}${pics ? ' pics' : ''}${q.options.some((o) => String(o.t || '').length > 14) ? ' long' : ''}">${q.options.map((o, i) => `<button class="opt card3d" data-opt="${o.id}" ${o.pic ? `data-objek="${o.pic}"` : ''}><span class="key">${i + 1}</span>${content(o)}</button>`).join('')}</div>`;
    const choose = (b) => {
      if (locked || b.disabled) return;
      const id = b.dataset.opt;
      if (Bank.check(q, id)) { locked = true; b.classList.add('right'); pop(b); api.onSolved(b.getBoundingClientRect()); }
      else { b.classList.add('wrong'); b.disabled = true; shake(b); api.onWrong(); }
    };
    $$(el, '.opt').forEach((b) => b.addEventListener('click', () => choose(b)));
    const key = (e) => { const n = +e.key; if (n >= 1 && n <= q.options.length && !e.metaKey && !e.ctrlKey) choose($$(el, '.opt')[n - 1]); };
    document.addEventListener('keydown', key);
    return {
      guide() { const wrong = $$(el, '.opt:not(.wrong)').filter((b) => b.dataset.opt !== q.answer); wrong.slice(1).forEach((b) => { b.disabled = true; b.classList.add('gone'); }); $(el, `[data-opt="${q.answer}"]`).classList.add('glow-soft'); },
      reveal() { locked = true; $$(el, '.opt').forEach((b) => { b.disabled = true; }); $(el, `[data-opt="${q.answer}"]`).classList.add('right', 'reveal'); },
      lock() { locked = true; },
      destroy() { document.removeEventListener('keydown', key); },
    };
  }

  /* =====================================================================
   * 2. SERET & LEPAS
   * ===================================================================== */
  function mountDrag(el, q, api) {
    let locked = false, selected = null;
    const filled = {};
    const targetHTML = (tg) => {
      const zone = `<span class="drop-zone"></span>`;
      if (tg.slot) return `<button class="drop slot${tg.wide ? ' wide' : ''}" data-drop="${tg.id}" aria-label="${esc(api.t('dropHere'))}">${zone}</button>`;
      const head = tg.pic ? `<span class="drop-head" data-objek="${tg.pic}">${ART.pic(tg.pic)}</span>` : tg.count ? `<span class="drop-head">${countGrid(tg.count.pic, tg.count.n, 'mini')}</span>` : `<span class="drop-head lbl-head${tg.tag ? ' tag' : ''}${tg.wide ? ' q' : ''}" translate="no">${esc(tg.t)}</span>`;
      return `<button class="drop${tg.bin ? ' bin' : ''}${tg.wide ? ' wide' : ''}" data-drop="${tg.id}">${head}${zone}</button>`;
    };
    let top = '';
    if (q.sentence) {
      const parts = q.sentence.split('___');
      top = `<div class="dd-sentence" translate="no">${parts.map((p, i) => esc(p) + (i < parts.length - 1 ? targetHTML(q.targets[i]) : '')).join('')}</div>`;
    } else if (q.line) {
      let k = 0;
      top = `<div class="dd-line" translate="no">${q.line.map((n) => (n == null ? targetHTML(q.targets[k++]) : `<span class="nl-n">${n}</span>`)).join('<span class="nl-tick"></span>')}</div>`;
    } else {
      top = `<div class="dd-targets n${q.targets.length}${q.targets.some((t) => t.wide) ? ' wide' : ''}">${q.targets.map(targetHTML).join('')}</div>`;
    }
    el.innerHTML = `<div class="dd">${top}<div class="tray">${q.items.map((it) => `<button class="chip card3d" data-item="${it.id}" ${it.pic ? `data-objek="${it.pic}"` : ''}>${content(it)}</button>`).join('')}</div><p class="dd-tip">${esc(api.t('dragTip'))}</p></div>`;

    const capOf = (tid) => q.targets.find((t) => t.id === tid).cap;
    const isFull = (tid) => (filled[tid] || []).length >= capOf(tid);
    const allDone = () => q.targets.every((t) => isFull(t.id));
    const clearSel = () => { if (selected) selected.classList.remove('selected'); selected = null; $$(el, '.drop').forEach((d) => d.classList.remove('armed')); };
    const snap = (chip, drop) => {
      const tid = drop.dataset.drop;
      (filled[tid] = filled[tid] || []).push(chip.dataset.item);
      chip.classList.add('placed'); chip.disabled = true; chip.classList.remove('selected', 'glow');
      $(drop, '.drop-zone').appendChild(chip);
      if (isFull(tid)) drop.classList.add('filled');
      drop.classList.remove('glow');
      pop(chip);
    };
    const attempt = (chip, drop, anim) => {
      if (locked) return anim && anim.back();
      const tid = drop.dataset.drop;
      if (isFull(tid)) { anim ? anim.back() : shake(drop); return; }
      if (Bank.check(q, { target: tid, item: chip.dataset.item })) {
        const fin = () => { snap(chip, drop); api.sfx('drop'); const c = center(drop); api.onPartial(c.x, c.y); if (allDone()) { locked = true; api.onSolved($(el, '.dd').getBoundingClientRect()); } };
        anim ? anim.land(drop, fin) : fin();
      } else {
        shake(drop);
        anim ? anim.back(() => shake(chip)) : shake(chip);
        api.onWrong();
      }
      clearSel();
    };
    $$(el, '.chip').forEach((chip) => {
      dragger(chip, {
        drop: '.drop', disabled: () => locked || chip.classList.contains('placed'),
        onStart: () => { clearSel(); api.sfx('pick'); },
        onTap: () => { if (selected === chip) { clearSel(); return; } clearSel(); selected = chip; chip.classList.add('selected'); api.sfx('pick'); $$(el, '.drop:not(.filled)').forEach((d) => d.classList.add('armed')); },
        onDrop: (drop, anim) => attempt(chip, drop, anim),
      });
    });
    $$(el, '.drop').forEach((d) => d.addEventListener('click', () => { if (selected && !locked) attempt(selected, d, null); }));
    return {
      guide() {
        for (const t of q.targets) {
          if (isFull(t.id)) continue;
          const chip = $$(el, '.tray .chip:not(.placed)').find((c) => t.accepts.includes(c.dataset.item));
          if (chip) { chip.classList.add('glow'); $(el, `[data-drop="${t.id}"]`).classList.add('glow'); return; }
        }
      },
      reveal() {
        locked = true;
        for (const s of Bank.solution(q)) {
          if ((filled[s.target] || []).includes(s.item)) continue;
          const drop = $(el, `[data-drop="${s.target}"]`);
          if (isFull(s.target)) continue;
          const chip = $(el, `.tray [data-item="${s.item}"]`);
          if (chip) { snap(chip, drop); chip.classList.add('revealed'); }
        }
      },
      lock() { locked = true; },
      destroy() { if (activeGhost) { activeGhost.remove(); activeGhost = null; } },
    };
  }

  /* =====================================================================
   * 3. SUSUNAN
   * ===================================================================== */
  function mountArrange(el, q, api) {
    let locked = false;
    const slots = Array(q.slots).fill(null), fixed = Array(q.slots).fill(false);
    const byId = Object.fromEntries(q.items.map((it) => [it.id, it]));
    el.innerHTML = `<div class="ar${q.long ? ' long' : ''}"><div class="ar-slots n${q.slots}">${slots.map((_, i) => `<div class="ar-slot" data-slot="${i}"><span class="ar-num">${i + 1}</span></div>`).join('')}</div>` +
      `<div class="tray">${q.items.map((it) => `<button class="chip card3d" data-item="${it.id}">${content(it)}</button>`).join('')}</div>` +
      `<div class="ar-actions"><button class="btn ghost-btn" data-act="reset">${ART.ui('reset')}<span>${esc(api.t('reset'))}</span></button><button class="btn go" data-act="check" disabled>${ART.ui('check')}<span>${esc(api.t('check'))}</span></button></div></div>`;
    const tray = $(el, '.tray'), checkBtn = $(el, '[data-act="check"]');
    const chipOf = (id) => $(el, `.chip[data-item="${id}"]`);
    const slotEl = (i) => $(el, `.ar-slot[data-slot="${i}"]`);
    const sync = () => { checkBtn.disabled = locked || slots.some((x) => !x); $$(el, '.ar-slot').forEach((s, i) => s.classList.toggle('has', !!slots[i])); };
    const toTray = (id) => { const i = slots.indexOf(id); if (i >= 0 && fixed[i]) return; if (i >= 0) slots[i] = null; tray.appendChild(chipOf(id)); chipOf(id).classList.remove('in-slot'); sync(); };
    const toSlot = (id, i) => {
      const from = slots.indexOf(id);
      if (fixed[i]) return false;
      const occ = slots[i];
      if (from >= 0) { if (fixed[from]) return false; slots[from] = occ; if (occ) { slotEl(from).appendChild(chipOf(occ)); } }
      else if (occ) { tray.appendChild(chipOf(occ)); chipOf(occ).classList.remove('in-slot'); }
      slots[i] = id; slotEl(i).appendChild(chipOf(id)); chipOf(id).classList.add('in-slot'); pop(chipOf(id));
      $$(el, '.glow').forEach((g) => g.classList.remove('glow'));
      api.sfx('drop'); sync(); return true;
    };
    $$(el, '.chip').forEach((chip) => {
      const id = chip.dataset.item;
      dragger(chip, {
        drop: '.ar-slot, .tray', disabled: () => locked || fixed[slots.indexOf(id)] === true,
        onStart: () => api.sfx('pick'),
        onTap: () => { if (slots.includes(id)) toTray(id); else { const i = slots.findIndex((x, k) => !x && !fixed[k]); if (i >= 0) toSlot(id, i); } },
        onDrop: (target, anim) => {
          if (target.classList.contains('tray')) { anim.back(() => { if (slots.includes(id)) toTray(id); }); return; }
          const i = +target.dataset.slot;
          anim.land(target, () => { if (!toSlot(id, i)) shake(target); });
        },
      });
    });
    $(el, '[data-act="reset"]').addEventListener('click', () => { if (locked) return; slots.forEach((id, i) => { if (id && !fixed[i]) toTray(id); }); api.sfx('whoosh'); });
    checkBtn.addEventListener('click', () => {
      if (locked || slots.some((x) => !x)) return;
      if (Bank.check(q, slots.slice())) { locked = true; $$(el, '.ar-slot').forEach((s) => s.classList.add('right')); sync(); api.onSolved($(el, '.ar-slots').getBoundingClientRect()); }
      else { $$(el, '.ar-slot').forEach((s, i) => { if (!fixed[i]) shake(s); }); api.onWrong(); }
    });
    const solved = () => Bank.solution(q);
    return {
      guide() {
        const sol = solved();
        sol.forEach((id, i) => {
          const cur = slots[i];
          if (cur && byId[cur].t === byId[id].t) { fixed[i] = true; slotEl(i).classList.add('fixed'); chipOf(cur).classList.add('locked'); }
          else if (cur) toTray(cur);
        });
        const k = slots.findIndex((x, i) => !x && !fixed[i]);
        if (k >= 0) { const want = byId[sol[k]].t; const c = $$(tray, '.chip').find((ch) => byId[ch.dataset.item].t === want); if (c) { c.classList.add('glow'); slotEl(k).classList.add('glow'); } }
        sync();
      },
      reveal() {
        locked = true;
        slots.forEach((id, i) => { if (id && !fixed[i]) { tray.appendChild(chipOf(id)); slots[i] = null; } });
        const sol = solved();
        const used = new Set(slots.filter(Boolean));
        sol.forEach((id, i) => {
          if (slots[i]) return;
          const want = byId[id].t;
          const c = q.items.find((it) => it.t === want && !used.has(it.id));
          used.add(c.id); slots[i] = c.id; slotEl(i).appendChild(chipOf(c.id)); chipOf(c.id).classList.add('in-slot', 'revealed');
        });
        sync();
      },
      lock() { locked = true; sync(); },
      destroy() { if (activeGhost) { activeGhost.remove(); activeGhost = null; } },
    };
  }

  /* =====================================================================
   * 4. PADANAN
   * ===================================================================== */
  const LINE_COLORS = ['#A78BFA', '#FF8FA3', '#76DDB5', '#FFB23F', '#82CCFF'];
  function mountMatch(el, q, api) {
    let locked = false, sel = null, done = 0, temp = null;
    const right = q.rightOrder.map((id) => q.pairs.find((p) => p.id === id));
    el.innerHTML = `<div class="mt"><svg class="mt-lines" aria-hidden="true"></svg><div class="mt-col left">${q.pairs.map((p) => `<button class="mcard card3d" data-side="L" data-pair="${p.id}" ${p.left.pic ? `data-objek="${p.left.pic}"` : ''}>${content(p.left)}<span class="dot"></span></button>`).join('')}</div>` +
      `<div class="mt-col right">${right.map((p) => `<button class="mcard card3d" data-side="R" data-pair="${p.id}" ${p.right.pic ? `data-objek="${p.right.pic}"` : ''}><span class="dot"></span>${content(p.right)}</button>`).join('')}</div></div>`;
    const svg = $(el, '.mt-lines'), box = $(el, '.mt');
    const matched = [];
    const anchor = (b) => { const r = b.getBoundingClientRect(), R = box.getBoundingClientRect(); const L = b.dataset.side === 'L'; return { x: (L ? r.right : r.left) - R.left, y: r.top + r.height / 2 - R.top }; };
    const path = (a, b) => { const mx = (a.x + b.x) / 2; return `M${a.x} ${a.y} C${mx} ${a.y} ${mx} ${b.y} ${b.x} ${b.y}`; };
    const draw = () => {
      svg.innerHTML = matched.map((m) => `<path class="mt-path${m.fresh ? ' fresh' : ''}" d="${path(anchor(m.l), anchor(m.r))}" stroke="${m.c}"/>`).join('') + (temp ? `<path class="mt-path temp" d="${path(temp.a, temp.b)}"/>` : '');
      matched.forEach((m) => { m.fresh = false; });
    };
    const ro = new ResizeObserver(draw); ro.observe(box);
    const clear = () => { if (sel) sel.classList.remove('selected'); sel = null; };
    const tryPair = (a, b) => {
      if (locked || !a || !b || a.dataset.side === b.dataset.side) return;
      const L = a.dataset.side === 'L' ? a : b, R = a.dataset.side === 'L' ? b : a;
      if (L.classList.contains('matched') || R.classList.contains('matched')) return;
      if (Bank.check(q, { left: L.dataset.pair, right: R.dataset.pair })) {
        const c = LINE_COLORS[done % LINE_COLORS.length];
        [L, R].forEach((x) => { x.classList.add('matched'); x.disabled = true; x.style.setProperty('--mc', c); x.classList.remove('glow'); pop(x); });
        matched.push({ l: L, r: R, c, fresh: true }); done++; draw();
        api.sfx('drop'); const p = center(R); api.onPartial(p.x, p.y);
        if (done === q.pairs.length) { locked = true; api.onSolved(box.getBoundingClientRect()); }
      } else { shake(L); shake(R); api.onWrong(); }
      clear();
    };
    $$(el, '.mcard').forEach((b) => {
      let st = null;
      b.addEventListener('pointerdown', (e) => { if (locked || b.classList.contains('matched') || e.button > 0) return; st = { x: e.clientX, y: e.clientY, moved: false, id: e.pointerId }; b.setPointerCapture && b.setPointerCapture(e.pointerId); });
      b.addEventListener('pointermove', (e) => {
        if (!st || e.pointerId !== st.id) return;
        if (!st.moved && Math.hypot(e.clientX - st.x, e.clientY - st.y) < 10) return;
        e.preventDefault(); st.moved = true; clear(); b.classList.add('selected');
        const R = box.getBoundingClientRect(); temp = { a: anchor(b), b: { x: e.clientX - R.left, y: e.clientY - R.top } }; draw();
      });
      const end = (e) => {
        if (!st || e.pointerId !== st.id) return;
        const s = st; st = null;
        if (!s.moved) { if (e.type !== 'pointerup') return; if (sel && sel !== b && sel.dataset.side !== b.dataset.side) tryPair(sel, b); else if (sel === b) clear(); else { clear(); sel = b; b.classList.add('selected'); api.sfx('pick'); } return; }
        temp = null; b.classList.remove('selected'); draw();
        const hit = e.type === 'pointerup' ? document.elementFromPoint(e.clientX, e.clientY) : null;
        const other = hit && hit.closest('.mcard');
        if (other && other !== b) tryPair(b, other);
      };
      b.addEventListener('pointerup', end); b.addEventListener('pointercancel', end);
      b.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (sel && sel.dataset.side !== b.dataset.side) tryPair(sel, b); else { clear(); sel = b; b.classList.add('selected'); } } });
    });
    return {
      guide() { const L = $$(el, '.mcard[data-side="L"]:not(.matched)')[0]; if (!L) return; L.classList.add('glow'); $(el, `.mcard[data-side="R"][data-pair="${L.dataset.pair}"]`).classList.add('glow'); },
      reveal() {
        locked = true;
        $$(el, '.mcard[data-side="L"]:not(.matched)').forEach((L) => { const R = $(el, `.mcard[data-side="R"][data-pair="${L.dataset.pair}"]`); const c = '#C8C0D8'; [L, R].forEach((x) => { x.classList.add('matched', 'revealed'); x.disabled = true; x.style.setProperty('--mc', c); }); matched.push({ l: L, r: R, c, fresh: true }); });
        draw();
      },
      lock() { locked = true; },
      destroy() { ro.disconnect(); },
    };
  }

  /* =====================================================================
   * 5. ISI TEMPAT KOSONG
   * ===================================================================== */
  function mountFill(el, q, api) {
    let locked = false, val = '', mode = q.keypad ? 'pad' : 'choice';
    const render = (choices) => {
      const b = esc(q.template.before || ''), a = esc(q.template.after || '');
      const opts = choices || q.choices;
      el.innerHTML = `<div class="fb"><div class="fb-line" translate="no"><span>${b}</span><span class="fb-blank${q.wide ? ' wide' : ''}"><span class="fb-val"></span></span><span>${a}</span></div>` +
        (mode === 'pad'
          ? `<div class="pad">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button class="key3d" data-k="${n}">${n}</button>`).join('')}<button class="key3d k-del" data-k="del" aria-label="${esc(api.t('erase'))}">${ART.ui('backspace')}</button><button class="key3d" data-k="0">0</button><button class="key3d k-ok" data-k="ok" aria-label="${esc(api.t('check'))}">${ART.ui('check')}</button></div>`
          : `<div class="fb-choices${q.wide ? ' wide' : ''}">${opts.map((c) => `<button class="chip card3d" data-choice="${esc(c)}"><span class="lbl${String(c).length > 6 ? ' sm' : ''}" translate="no">${esc(c)}</span></button>`).join('')}</div>`) + '</div>';
      wire();
    };
    const blank = () => $(el, '.fb-blank');
    const show = () => { $(el, '.fb-val').textContent = val; blank().classList.toggle('has', !!val); };
    const submit = (v) => {
      if (locked) return;
      if (Bank.check(q, v)) { locked = true; val = v; show(); blank().classList.add('right'); pop(blank()); api.onSolved(blank().getBoundingClientRect()); return true; }
      val = v; show(); blank().classList.add('bad'); shake(blank());
      setTimeout(() => { if (!locked) { val = ''; show(); blank().classList.remove('bad'); } }, 650);
      api.onWrong(); return false;
    };
    function wire() {
      $$(el, '[data-choice]').forEach((b) => b.addEventListener('click', () => { if (locked || b.disabled) return; api.sfx('tap'); if (!submit(b.dataset.choice)) { b.disabled = true; b.classList.add('wrong'); } }));
      $$(el, '[data-k]').forEach((b) => b.addEventListener('click', () => press(b.dataset.k)));
    }
    const press = (k) => {
      if (locked || mode !== 'pad') return;
      api.sfx('tap');
      if (k === 'del') val = val.slice(0, -1);
      else if (k === 'ok') { if (val) submit(val); return; }
      else if (val.length < 3) val += k;
      show();
    };
    const key = (e) => {
      if (locked || e.metaKey || e.ctrlKey) return;
      if (mode === 'pad') { if (/^\d$/.test(e.key)) press(e.key); else if (e.key === 'Backspace') press('del'); else if (e.key === 'Enter') press('ok'); return; }
      const m = $$(el, '[data-choice]:not([disabled])').filter((b) => b.dataset.choice.toLowerCase() === e.key.toLowerCase());
      if (m.length === 1) m[0].click();
    };
    document.addEventListener('keydown', key);
    render();
    return {
      guide() {
        if (mode === 'pad') { const n = +q.answer; const alt = String(n + (n > 0 && Math.random() < 0.5 ? -1 : 1)); mode = 'choice'; render(Math.random() < 0.5 ? [q.answer, alt] : [alt, q.answer]); }
        else { const w = $$(el, '[data-choice]:not([disabled])').filter((b) => b.dataset.choice !== q.answer); w.slice(1).forEach((b) => { b.disabled = true; b.classList.add('gone'); }); }
      },
      reveal() { locked = true; val = q.answer; show(); blank().classList.add('right', 'reveal'); $$(el, 'button').forEach((b) => { b.disabled = true; }); },
      lock() { locked = true; },
      destroy() { document.removeEventListener('keydown', key); },
    };
  }

  const MOUNT = { mc: mountMC, drag: mountDrag, arrange: mountArrange, match: mountMatch, fill: mountFill };
  root.Mech = { mount: (type, el, q, api) => MOUNT[type](el, q, api), visual, content, esc };
})(window);
