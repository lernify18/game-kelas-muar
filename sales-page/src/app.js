(function () {
  'use strict';
  var root = document.getElementById('misi3m-sales-root');
  if (!root || root.getAttribute('data-m3-ready')) return;
  root.setAttribute('data-m3-ready', '1');
  root.classList.add('m3-js');

  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var $ = function (s, el) { return (el || root).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || root).querySelectorAll(s)); };

  $$('[data-m3-year]').forEach(function (n) { n.textContent = String(new Date().getFullYear()); });
  if (reduce) $$('video[autoplay]').forEach(function (v) { v.removeAttribute('autoplay'); v.pause(); v.controls = true; });

  // Inside the shop's iframe the host scrolls to its own checkout. Opened directly there is no host: the closing
  // cards keep their #m3-pakej jump, and the plan buttons stay put instead of following href="#" to the top.
  var framed = window.parent !== window;
  var handleClick = function (ev) {
    window.parent.postMessage({ type: 'scroll-to-payment' }, '*');
    if (framed || ev.currentTarget.getAttribute('href') === '#') ev.preventDefault();
  };
  $$('a.m3-cta, a.m3-mini-b').forEach(function (a) { a.addEventListener('click', handleClick); });

  var demoEl = $('#m3-demo');
  var demo = demoEl ? initDemo() : null;

  var scopes = $$('[data-io]');
  var reveals = $$('.m3-rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        e.target.classList.toggle('m3-on', e.isIntersecting);
        if (demo && e.target === demoEl) demo.visible(e.isIntersecting);
      });
    }, { rootMargin: '120px 0px' });
    scopes.forEach(function (n) { io.observe(n); });
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('m3-in'); ro.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    reveals.forEach(function (n) { ro.observe(n); });
  } else {
    scopes.forEach(function (n) { n.classList.add('m3-on'); });
    reveals.forEach(function (n) { n.classList.add('m3-in'); });
    if (demo) demo.visible(true);
  }

  function initDemo() {
    var scr = $('#m3-dscr'), q1 = $('#m3-q1'), q2 = $('#m3-q2'), res = $('#m3-dres');
    var cat = $('#m3-dcat'), qlab = $('#m3-dq'), fill = $('#m3-dfill'), word = $('#m3-word');
    var toastEl = $('#m3-dtoast'), kiko = $('#m3-dkiko'), hand = $('#m3-dhand'), canvas = $('#m3-dfx');
    var tray = $('.m3-tray', q1), cards = $$('.m3-syl', q1), slots = $$('.m3-slot', q1), choices = $$('.m3-ch', q2);
    var apples = $$('#m3-apples use');
    var st, drag = null, timers = [], handAnim = null, touched = false, inView = false, lastKb = false, toastT = 0;

    function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }
    function clearTimers() { timers.forEach(clearTimeout); timers = []; }
    function setProg(f, label) { fill.style.width = (f * 100) + '%'; qlab.textContent = label; }
    function focusIf(el) { if (lastKb && el) { try { el.focus({ preventScroll: true }); } catch (_) { el.focus(); } } }

    function toast(msg, kind) {
      toastEl.textContent = msg;
      toastEl.className = 'm3-dtoast is-show is-' + kind;
      clearTimeout(toastT);
      toastT = setTimeout(function () { toastEl.classList.remove('is-show'); }, 1500);
    }
    function mood(m) {
      kiko.classList.remove('is-cheer', 'is-oops');
      void kiko.offsetWidth;
      kiko.classList.add('is-' + m);
    }
    function shake(el) {
      el.classList.remove('is-shake');
      void el.offsetWidth;
      el.classList.add('is-shake');
      later(function () { el.classList.remove('is-shake'); }, 600);
    }

    function reset() {
      clearTimers();
      stopFx();
      st = { step: 1, miss: [0, 0], busy: false };
      cards.forEach(function (c) {
        c.classList.remove('is-placed', 'is-drag', 'is-shake');
        c.style.transition = '';
        c.style.transform = '';
        c.removeAttribute('aria-disabled');
        c.removeAttribute('tabindex');
        tray.appendChild(c);
      });
      slots.forEach(function (s) { s.classList.remove('is-filled', 'is-hot', 'is-shake'); });
      word.textContent = '?';
      word.classList.remove('is-on');
      choices.forEach(function (b) { b.classList.remove('is-right', 'is-wrong'); b.removeAttribute('aria-disabled'); });
      q1.hidden = false; q2.hidden = true; res.hidden = true;
      res.classList.remove('is-show');
      cat.textContent = 'Pulau Suku Kata';
      setProg(0, 'Soalan 1/2');
      scheduleHand();
    }

    /* ---- question 1: drag, tap or keyboard ---- */
    function slotAt(x, y) {
      for (var i = 0; i < slots.length; i++) {
        var r = slots[i].getBoundingClientRect();
        if (x >= r.left - 16 && x <= r.right + 16 && y >= r.top - 16 && y <= r.bottom + 16) return slots[i];
      }
      return null;
    }
    function hot(s) { slots.forEach(function (n) { n.classList.toggle('is-hot', n === s && !n.classList.contains('is-filled')); }); }
    function free(c) { return st.step === 1 && !st.busy && !c.classList.contains('is-placed'); }

    function place(c, s) {
      if (c.getAttribute('data-syl') !== s.getAttribute('data-want')) {
        st.miss[0]++;
        shake(s);
        if (!c.style.transform) shake(c);
        c.style.transform = '';
        toast('Cuba lagi!', 'bad');
        mood('oops');
        return;
      }
      var a = c.getBoundingClientRect();
      c.style.transition = 'none';
      c.style.transform = '';
      s.appendChild(c);
      s.classList.add('is-filled');
      c.classList.add('is-placed');
      c.setAttribute('aria-disabled', 'true');
      c.setAttribute('tabindex', '-1');
      var b = c.getBoundingClientRect();
      c.style.transform = 'translate(' + (a.left - b.left) + 'px,' + (a.top - b.top) + 'px)';
      void c.offsetWidth;
      c.style.transition = '';
      c.style.transform = '';
      if (slots.every(function (n) { return n.classList.contains('is-filled'); })) return solved1();
      toast('Bagus! Teruskan', 'good');
      var next = cards.filter(function (n) { return !n.classList.contains('is-placed'); })[0];
      focusIf(next);
    }

    function solved1() {
      st.busy = true;
      word.textContent = 'baju';
      word.classList.add('is-on');
      setProg(0.5, 'Soalan 1/2');
      toast('Hebat! ba + ju = baju', 'good');
      mood('cheer');
      fx('small');
      later(function () {
        st.step = 2; st.busy = false;
        q1.hidden = true; q2.hidden = false;
        cat.textContent = 'Planet Nombor & Kuantiti';
        setProg(0.5, 'Soalan 2/2');
        focusIf($('#m3-q2t'));
        scheduleHand();
      }, 1800);
    }

    cards.forEach(function (c) {
      c.addEventListener('pointerdown', function (e) {
        if (!free(c) || (e.pointerType === 'mouse' && e.button !== 0)) return;
        if (e.pointerType === 'mouse') e.preventDefault();
        drag = { c: c, id: e.pointerId, x: e.clientX, y: e.clientY, moved: false };
        try { c.setPointerCapture(e.pointerId); } catch (_) {}
      });
      c.addEventListener('pointermove', function (e) {
        if (!drag || drag.c !== c || e.pointerId !== drag.id) return;
        var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        if (!drag.moved) {
          if (dx * dx + dy * dy < 36) return;
          drag.moved = true;
          c.classList.add('is-drag');
        }
        c.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(1.06)';
        hot(slotAt(e.clientX, e.clientY));
      });
      c.addEventListener('pointerup', function (e) {
        if (!drag || drag.c !== c || e.pointerId !== drag.id) return;
        var d = drag;
        drag = null;
        hot(null);
        if (!d.moved) return;
        c._m3skip = true;
        setTimeout(function () { c._m3skip = false; }, 350);
        c.classList.remove('is-drag');
        var s = slotAt(e.clientX, e.clientY);
        if (s && !s.classList.contains('is-filled')) place(c, s);
        else c.style.transform = '';
      });
      c.addEventListener('pointercancel', function () {
        if (!drag || drag.c !== c) return;
        drag = null;
        hot(null);
        c.classList.remove('is-drag');
        c.style.transform = '';
      });
      c.addEventListener('click', function () {
        if (c._m3skip) { c._m3skip = false; return; }
        if (!free(c)) return;
        var s = slots.filter(function (n) { return !n.classList.contains('is-filled'); })[0];
        if (s) place(c, s);
      });
    });

    /* ---- question 2: multiple choice ---- */
    choices.forEach(function (b) {
      b.addEventListener('click', function () {
        if (st.step !== 2 || st.busy) return;
        if (b.getAttribute('data-v') === '6') {
          st.busy = true;
          b.classList.add('is-right');
          choices.forEach(function (x) { x.setAttribute('aria-disabled', 'true'); });
          setProg(1, 'Soalan 2/2');
          toast('Betul! 4 + 2 = 6', 'good');
          mood('cheer');
          fx('small');
          later(results, 1500);
        } else {
          st.miss[1]++;
          b.classList.remove('is-wrong');
          void b.offsetWidth;
          b.classList.add('is-wrong');
          toast('CUBA LAGI', 'bad');
          mood('oops');
          later(function () { b.classList.remove('is-wrong'); }, 900);
        }
      });
    });

    function results() {
      st.step = 3;
      var score = (st.miss[0] === 0 ? 1 : 0) + (st.miss[1] === 0 ? 1 : 0);
      $('#m3-dscore').textContent = score + '/2';
      $$('.m3-dstar use', res).forEach(function (u, i) { u.setAttribute('href', i < score + 1 ? '#m3-star' : '#m3-starOff'); });
      q2.hidden = true;
      res.hidden = false;
      cat.textContent = 'Keputusan Demo';
      setProg(1, 'Selesai');
      void res.offsetWidth;
      res.classList.add('is-show');
      mood('cheer');
      hideHand();
      fx('big');
      focusIf($('#m3-drest'));
    }
    $('#m3-replay').addEventListener('click', function () { reset(); focusIf(cards[0]); });

    /* ---- pointing hand ---- */
    function hideHand() {
      hand.classList.remove('is-on');
      if (handAnim) { handAnim.cancel(); handAnim = null; }
    }
    function scheduleHand() {
      hideHand();
      touched = false;
      later(showHand, 1500);
    }
    function center(el) {
      var r = el.getBoundingClientRect(), s = scr.getBoundingClientRect();
      return { x: r.left - s.left + r.width / 2, y: r.top - s.top + r.height / 2 };
    }
    function tr(p, k) { return 'translate(' + (p.x - 21) + 'px,' + (p.y - 4) + 'px) scale(' + k + ')'; }
    function showHand() {
      if (touched || !inView || st.step > 2 || hand.classList.contains('is-on')) return;
      var pts = (st.step === 1 ? [cards[0], slots[0]] : apples).map(center);
      if (!pts.length) return;
      hand.classList.add('is-on');
      if (reduce || !hand.animate) { hand.style.transform = tr(pts[0], 1); return; }
      var frames = [], n = pts.length;
      if (st.step === 1) {
        frames = [
          { transform: tr(pts[0], 1), offset: 0 },
          { transform: tr(pts[0], 0.88), offset: 0.16 },
          { transform: tr(pts[1], 0.88), offset: 0.6 },
          { transform: tr(pts[1], 1), offset: 0.74 },
          { transform: tr(pts[1], 1), offset: 1 },
        ];
      } else {
        pts.forEach(function (p, i) {
          var o = (i / n) * 0.86;
          frames.push({ transform: tr(p, 1), offset: o });
          frames.push({ transform: tr(p, 0.86), offset: o + 0.05 });
        });
        frames.push({ transform: tr(pts[n - 1], 1), offset: 1 });
      }
      handAnim = hand.animate(frames, { duration: st.step === 1 ? 2600 : 3800, iterations: Infinity, easing: 'ease-in-out' });
    }
    function interact() { touched = true; hideHand(); }
    scr.addEventListener('pointerdown', function () { lastKb = false; interact(); });
    scr.addEventListener('keydown', function () { lastKb = true; interact(); });
    var rz = 0;
    window.addEventListener('resize', function () {
      clearTimeout(rz);
      rz = setTimeout(function () { if (hand.classList.contains('is-on')) { hideHand(); showHand(); } }, 200);
    });

    /* ---- celebration particles (bounded, never infinite) ---- */
    var ctx = canvas.getContext ? canvas.getContext('2d') : null;
    var COLORS = ['#7856E8', '#FF8FA3', '#FFD66D', '#76DDB5', '#82CCFF', '#FFB385'];
    var parts = [], raf = 0, last = 0, endAt = 0, W = 0, H = 0;
    var pick = function (a) { return a[(Math.random() * a.length) | 0]; };
    function stopFx() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0; last = 0; parts = [];
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    function burst(x, y, delay) {
      for (var i = 0; i < 26; i++) {
        var a = (i / 26) * Math.PI * 2, sp = 2.2 + Math.random() * 2.6;
        parts.push({ t: 's', x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, c: pick(COLORS), delay: delay });
      }
    }
    function fx(kind) {
      if (reduce || !ctx) return;
      stopFx();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = scr.clientWidth; H = scr.clientHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var big = kind === 'big', narrow = W < 560;
      var n = big ? (narrow ? 70 : 140) : (narrow ? 26 : 44);
      for (var i = 0; i < n; i++) {
        parts.push(big
          ? { t: 'c', x: Math.random() * W, y: -Math.random() * H * 0.6, vx: (Math.random() - 0.5) * 2, vy: 1 + Math.random() * 2.5, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, s: 6 + Math.random() * 6, c: pick(COLORS), round: Math.random() < 0.3, delay: 0 }
          : { t: 'c', x: W / 2 + (Math.random() - 0.5) * 80, y: H * 0.45, vx: (Math.random() - 0.5) * 8, vy: -(4 + Math.random() * 6), r: 0, vr: (Math.random() - 0.5) * 0.4, s: 6 + Math.random() * 5, c: pick(COLORS), round: Math.random() < 0.3, delay: 0 });
      }
      if (big) {
        for (var k = 0; k < (narrow ? 4 : 7); k++) {
          parts.push({ t: 'r', x: (k + 0.5) * (W / (narrow ? 4 : 7)), y: -30 - Math.random() * 160, vy: 1.6 + Math.random() * 1.2, ph: Math.random() * 6, amp: 8 + Math.random() * 10, len: 70 + Math.random() * 40, c: pick(COLORS), delay: 0 });
        }
        burst(W * 0.25, H * 0.3, 0);
        burst(W * 0.75, H * 0.26, 450);
        if (!narrow) burst(W * 0.5, H * 0.18, 900);
      }
      endAt = performance.now() + (big ? 4200 : 1800);
      raf = requestAnimationFrame(tick);
    }
    function tick(ts) {
      var dt = last ? Math.min((ts - last) / 16.67, 3) : 1;
      last = ts;
      ctx.clearRect(0, 0, W, H);
      var alive = 0;
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        if (p.delay > 0) { p.delay -= dt * 16.67; alive++; continue; }
        if (p.t === 'c') {
          p.vy += 0.16 * dt; p.vx *= 0.995; p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.vr * dt;
          if (p.y > H + 20) continue;
          alive++;
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c;
          if (p.round) { ctx.beginPath(); ctx.arc(0, 0, p.s / 2.4, 0, 6.283); ctx.fill(); } else ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
          ctx.restore();
        } else if (p.t === 's') {
          p.vy += 0.05 * dt; p.vx *= 0.98; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= 0.016 * dt;
          if (p.life <= 0) continue;
          alive++;
          ctx.globalAlpha = p.life; ctx.fillStyle = p.c;
          ctx.beginPath(); ctx.arc(p.x, p.y, 2.6, 0, 6.283); ctx.fill();
          ctx.globalAlpha = 1;
        } else {
          p.y += p.vy * dt; p.ph += 0.08 * dt;
          if (p.y - p.len > H) continue;
          alive++;
          ctx.strokeStyle = p.c; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath();
          for (var j = 0; j <= 6; j++) {
            var yy = p.y - (j * p.len) / 6, xx = p.x + Math.sin(p.ph + j * 0.9) * p.amp;
            if (j) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy);
          }
          ctx.stroke();
        }
      }
      if (alive && ts < endAt + 2500) raf = requestAnimationFrame(tick);
      else stopFx();
    }

    reset();
    return {
      visible: function (v) {
        inView = v;
        if (!v) { hideHand(); stopFx(); return; }
        if (!touched) later(showHand, 900);
      },
    };
  }
})();
