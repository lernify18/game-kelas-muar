// Enjin stage: seek(t) melukis satu frame secara deterministik. Versi (vo / pov) dimuat dari ?v=<nama>.
// render.mjs menyuntik window.WORDS (VO) dan window.CLIPS (bilangan frame + ketukan setiap klip) sebelum muat.
(function () {
  const FPS = 30;
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lin = (t, a, b) => clamp((t - a) / (b - a));
  const eo = (x) => 1 - Math.pow(1 - x, 3);
  const eb = (x) => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[^\p{L}\p{N}]/gu, "");
  const $ = (h) => { const d = document.createElement("div"); d.innerHTML = h.trim(); return d.firstElementChild; };
  const CLIPS = window.CLIPS || {};
  const WORDS = (window.WORDS && window.WORDS.words) || [];
  const WARN = (window.STAGE_WARN = []);
  let pending = [];

  function setSrc(img, src) {
    if (img.dataset.src === src) return;
    img.dataset.src = src;
    img.src = src;
    pending.push(img.decode().catch(() => WARN.push(`gagal muat ${src}`)));
  }
  const frameOf = (clip, ct) => {
    const n = (CLIPS[clip] && CLIPS[clip].n) || 1;
    return `../.tmp/clips/${clip}/${String(clamp(Math.floor(ct * FPS), 0, n - 1)).padStart(4, "0")}.jpg`;
  };

  /** Masa mula perkataan ke-n yang dituturkan (selepas `from`), untuk menyusun timeline ikut VO. */
  function T(word, n = 1, from = 0) {
    const k = norm(word);
    let seen = 0;
    for (const w of WORDS) if (w.start >= from && norm(w.w) === k && ++seen === n) return w.start;
    WARN.push(`perkataan tiada dalam VO: ${word}#${n}`);
    return from;
  }
  const endOf = (word, n = 1, from = 0) => {
    const s = T(word, n, from);
    const w = WORDS.find((x) => x.start === s);
    return w ? w.end : s;
  };

  // ---------------- elemen ----------------
  const DEV = {
    phone: { w: 600, h: 1300, bz: 20, r: 86 },
    tablet: { w: 880, h: 1236, bz: 34, r: 60 },
  };

  const build = {
    bts(s) {
      s.el = $(`<div class="bts"><img alt=""><div class="shade"></div></div>`);
      s.img = s.el.querySelector("img");
    },
    device(s) {
      const d = DEV[s.kind];
      s.el = $(`<div class="dev ${s.kind}" style="width:${d.w}px;height:${d.h}px;--bz:${d.bz}px;--r:${d.r}px">
        <div class="shadow"></div><div class="body" style="width:${d.w}px;height:${d.h}px"><div class="island"></div><div class="side"></div>
        <div class="scr"><div class="sbar"><span>9:41</span><i></i></div><img alt=""><div class="tap"></div><div class="glare"></div></div></div></div>`);
      s.img = s.el.querySelector(".scr img");
      s.tap = s.el.querySelector(".tap");
    },
    caps(s) {
      s.el = $(`<div class="caps" style="font-size:${s.size || 96}px"></div>`);
      let ptr = Math.max(0, WORDS.findIndex((w) => w.start >= s.a - 0.25));
      s.G = s.groups.map((spec) => {
        const g = $(`<div class="cap-group"></div>`);
        const words = spec.split(/\s+/).filter(Boolean).map((tok) => {
          let [spoken, shown] = tok.includes("=") ? tok.split("=") : [tok, tok];
          const cls = [];
          const strip = (x, m, c) => { if (x.startsWith(m) && x.replace(/[.,?!]+$/, "").endsWith(m)) { cls.push(...c); return x.slice(m.length).replace(m, ""); } return x; };
          shown = strip(shown, "^", ["gold", "big"]); shown = strip(shown, "*", ["gold"]); shown = strip(shown, "_", ["gold", "serif"]);
          spoken = spoken.replace(/[\^*_]/g, "");
          let at = null;
          for (let k = ptr; k < Math.min(WORDS.length, ptr + 5); k++) if (norm(WORDS[k].w) === norm(spoken)) { at = WORDS[k].start; ptr = k + 1; break; }
          if (at == null) WARN.push(`kapsyen tak padan VO: "${spoken}"`);
          const el = $(`<span class="cap-w ${cls.join(" ")}">${shown}</span>`);
          g.appendChild(el);
          return { el, at };
        });
        words.forEach((w, i) => { if (w.at == null) w.at = i ? words[i - 1].at + 0.15 : s.a; });
        s.el.appendChild(g);
        return { g, words, a: words[0].at };
      });
      s.G.forEach((g, i) => { g.b = i + 1 < s.G.length ? s.G[i + 1].a : s.b; });
    },
    pov(s) {
      s.el = $(`<div class="pov"></div>`);
      s.L = s.lines.map((l) => {
        const html = l.text.replace(/\[([^\]]+)\]/g, '<span class="hl">$1</span>');
        const el = $(`<div class="pov-line${l.sol ? " sol" : ""}">${html}</div>`);
        s.el.appendChild(el);
        return { el, at: s.a + (l.at || 0) };
      });
    },
    hook(s) {
      s.el = $(`<div class="hook"><div class="title" style="top:${s.y}px">${s.kicker ? `<div class="kicker">${s.kicker}</div>` : ""}<div class="h1">${s.h1.map((l) => `<div class="hl1">${l}</div>`).join("")}</div></div>
        <div class="solwrap" style="top:${s.solY}px"><div class="sol">${s.badge ? `<span class="badge">${s.badge}</span>` : ""}<b>${s.sol}</b></div></div></div>`);
      s.parts = [...s.el.querySelectorAll(".kicker, .hl1, .sol")];
    },
    art(s) {
      s.el = $(`<svg class="art" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg"></svg>`);
    },
  };

  const draw = {
    bts(s, t) {
      const ct = (s.at || 0) + (t - s.a);
      setSrc(s.img, frameOf(s.clip || "bts", ct));
      const z = (s.zoom || [1.04, 1.12]);
      s.img.style.transform = `scale(${z[0] + (z[1] - z[0]) * lin(t, s.a, s.b)})`;
      s.el.style.opacity = lin(t, s.a, s.a + 0.1);
    },
    device(s, t) {
      const ct = s.still != null ? s.still : (s.at || 0) + (t - s.a) * (s.speed || 1);
      setSrc(s.img, frameOf(s.clip, ct));
      const d = DEV[s.kind];
      const p = eo(lin(t, s.a, s.a + 0.42));
      let dx = 0, dy = 0, sc = s.s, ry = s.ry || 0, op = 1;
      const e = s.enter || "up";
      if (e === "up") { dy = (1 - p) * 900; ry *= p; }
      if (e === "left") dx = -(1 - p) * 1100;
      if (e === "right") dx = (1 - p) * 1100;
      if (e === "pop") { sc = s.s * (0.55 + 0.45 * eb(lin(t, s.a, s.a + 0.38))); op = lin(t, s.a, s.a + 0.12); }
      if (e === "flip") { ry = -90 + (90 + (s.ry || 0)) * eb(lin(t, s.a, s.a + 0.5)); op = lin(t, s.a, s.a + 0.08); }
      if (s.zoomTo) { const z = eo(lin(t, s.zoomTo.a, s.zoomTo.a + 0.5)); sc *= 1 + (s.zoomTo.s - 1) * z; dy += (s.zoomTo.dy || 0) * z; }
      const bob = Math.sin((t - s.a) * 1.6) * 8;
      s.el.style.transform = `translate(${s.x - d.w / 2 + dx}px, ${s.y - d.h / 2 + dy + bob}px) perspective(2600px) rotateY(${ry}deg) rotateX(${s.rx || 3}deg) rotateZ(${s.rz || 0}deg) scale(${sc})`;
      s.el.style.opacity = op;
      const taps = (CLIPS[s.clip] && CLIPS[s.clip].taps) || [];
      const tp = taps.find((k) => ct >= k.t - 0.05 && ct <= k.t + 0.5);
      if (tp) {
        const q = lin(ct, tp.t - 0.05, tp.t + 0.5);
        s.tap.style.left = `${tp.x * 100}%`; s.tap.style.top = `${tp.y * 100}%`;
        s.tap.style.opacity = q < 0.25 ? q * 4 : 1 - (q - 0.25) / 0.75;
        s.tap.style.transform = `scale(${0.6 + 0.7 * eo(q)})`;
      } else s.tap.style.opacity = 0;
    },
    caps(s, t) {
      s.el.style.top = `${s.y}px`;
      s.el.style.transform = `translateY(-50%)`;
      for (const g of s.G) {
        const on = t >= g.a - 0.06 && t < g.b - 0.06;
        g.g.style.display = on ? "flex" : "none";
        if (!on) continue;
        for (const w of g.words) {
          const q = lin(t, w.at - 0.04, w.at + 0.14);
          w.el.style.opacity = clamp(q * 2.2);
          w.el.style.transform = `translateY(${(1 - eo(q)) * 26}px) scale(${0.72 + 0.28 * eb(q)})`;
        }
      }
    },
    pov(s, t) {
      s.el.style.top = `${s.y}px`;
      for (const l of s.L) {
        const q = lin(t, l.at, l.at + 0.22);
        l.el.style.opacity = q > 0 ? 1 : 0;
        l.el.style.transform = `scale(${0.8 + 0.2 * eb(q)})`;
      }
    },
    hook(s, t) {
      const at = s.times || [];
      s.parts.forEach((el, i) => {
        const a = s.a + (at[i] != null ? at[i] : i * 0.18);
        const q = lin(t, a, a + 0.3);
        el.style.opacity = clamp(q * 2.5);
        el.style.transform = `translateY(${(1 - eo(q)) * 40}px) scale(${0.85 + 0.15 * eb(q)})`;
      });
    },
    art(s, t) { ART_SCENES[s.name](s, t); },
  };

  // ---------------- adegan SVG ----------------
  const ART_SCENES = {
    /** Buku latihan yang membosankan: zzz terapung, kemudian buku terbalik hilang pada `swapAt`. */
    book(s, t) {
      const flip = s.swapAt ? lin(t, s.swapAt, s.swapAt + 0.25) : 0;
      const p = eb(lin(t, s.a, s.a + 0.4));
      const sx = (1 - flip) * p, y = s.y + Math.sin((t - s.a) * 2) * 10;
      const zz = [0, 1, 2].map((i) => {
        const k = ((t - s.a) * 0.9 + i / 3) % 1;
        return `<text x="${540 + 170 + k * 120 + i * 20}" y="${y - 200 - k * 260}" font-family="Instrument Serif" font-style="italic" font-size="${70 + i * 26}" fill="#fff" opacity="${(1 - k) * (1 - flip) * p}">z</text>`;
      }).join("");
      s.el.innerHTML = `<g transform="translate(540 ${y}) scale(${sx} ${p}) translate(-540 ${-y})">${ART.book(540, y, 560)}</g>${zz}`;
    },
    /** Bintang 3D meletup keluar dari pusat, satu demi satu. */
    stars(s, t) {
      const P = [[-330, -260, 150], [330, -300, 120], [-380, 120, 110], [360, 160, 140], [0, -420, 170], [-150, 320, 90], [190, 360, 100]];
      s.el.innerHTML = P.map(([x, y, r], i) => {
        const a = s.a + i * 0.09, q = lin(t, a, a + 0.45);
        if (q <= 0) return "";
        const k = eb(q), drift = Math.sin((t - a) * 2 + i) * 12;
        return `<g transform="translate(${540 + x * eo(q)} ${s.y + y * eo(q) + drift}) rotate(${(1 - q) * 120 + Math.sin(t + i) * 8}) scale(${k})">${ART.star(r)}</g>`;
      }).join("");
    },
    /** Bar komen: taip "GAME" huruf demi huruf, ketuk hantar, hati muncul. */
    comment(s, t) {
      const text = s.text || "GAME";
      const n = Math.floor(clamp((t - s.typeAt) / 0.11, 0, text.length));
      const typed = t >= s.typeAt ? text.slice(0, n) : "";
      const sent = t >= s.sendAt;
      const caret = !sent && Math.floor(t * 3) % 2 === 0;
      const p = eo(lin(t, s.a, s.a + 0.35));
      const press = sent ? 1 - 0.12 * Math.sin(Math.PI * lin(t, s.sendAt, s.sendAt + 0.2)) : 1;
      const hq = lin(t, s.sendAt + 0.1, s.sendAt + 0.5);
      const heart = hq > 0 ? `<g transform="translate(${540 + 372} ${s.y - 150 - 160 * eo(hq)}) scale(${eb(hq)})" opacity="${1 - lin(t, s.sendAt + 0.9, s.sendAt + 1.3)}">${ART.heart(130)}</g>` : "";
      const ring = sent && hq < 1 ? `<circle cx="${540 + 372}" cy="${s.y}" r="${60 + 70 * hq}" fill="none" stroke="#fff" stroke-width="6" opacity="${1 - hq}"/>` : "";
      s.el.innerHTML = `<g transform="translate(540 ${s.y + (1 - p) * 300}) scale(${press === 1 ? 1 : 1})" opacity="${p}">${ART.comment(typed, caret && t >= s.typeAt)}</g>${ring}${heart}`;
    },
  };

  // ---------------- grain & leak ----------------
  function grain() {
    const c = document.createElement("canvas"); c.width = c.height = 256;
    const g = c.getContext("2d"), im = g.createImageData(256, 256);
    let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < im.data.length; i += 4) { const v = rnd() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
    g.putImageData(im, 0, 0);
    const el = document.getElementById("grain");
    el.style.backgroundImage = `url(${c.toDataURL()})`;
    return (f) => { el.style.backgroundPosition = `${(f * 97) % 256}px ${(f * 61) % 256}px`; };
  }

  // ---------------- init & seek ----------------
  let V, scenes, moveGrain;
  const layers = document.getElementById("layers");
  const leak = document.getElementById("leak");
  const gridImg = document.getElementById("grid");

  function init() {
    V = window.VERSION({ T, endOf, WORDS });
    document.body.insertAdjacentHTML("afterbegin", ART.SPRITE);
    gridImg.src = "../.tmp/clips/grid.png";
    scenes = V.scenes.map((s, i) => { build[s.type](s); s.el.dataset.scene = `${i}:${s.type}${s.name ? ":" + s.name : ""}`; s.el.style.zIndex = s.z || ({ bts: 1, device: 3, art: 4, caps: 6, pov: 6, hook: 7 }[s.type]); layers.appendChild(s.el); return s; });
    moveGrain = grain();
    window.DUR = V.dur;
    window.SFX = V.sfx || [];
    window.MUSIC = V.music;
    window.SCENES = scenes.map((s) => ({ type: s.type, a: s.a, b: s.b, clip: s.clip, kind: s.kind, name: s.name, groups: s.G && s.G.map((g) => ({ a: g.a, b: g.b, text: g.g.textContent })) }));
    window.LEAKS = V.leaks || [];
  }

  window.seek = async function (t) {
    pending = [];
    const f = Math.round(t * FPS);
    for (const s of scenes) {
      const on = t >= s.a && t < s.b;
      s.el.style.display = on ? "" : "none";
      if (on) draw[s.type](s, t);
    }
    const lk = (V.leaks || []).find((l) => t >= l.t - 0.1 && t < l.t + (l.d || 0.7));
    if (lk) {
      setSrc(leak, frameOf(`leak_${lk.which || "a"}`, t - lk.t + 0.1));
      const up = lin(t, lk.t - 0.1, lk.t + 0.05), down = 1 - lin(t, lk.t + 0.1, lk.t + (lk.d || 0.7));
      leak.style.opacity = (lk.o || 0.9) * Math.min(up, down);
    } else leak.style.opacity = 0;
    gridImg.style.transform = `scale(${1.04 + 0.03 * Math.sin(t * 0.35)}) translateY(${Math.sin(t * 0.5) * 10}px)`;
    moveGrain(f);
    await Promise.all(pending);
    return f;
  };

  const v = new URLSearchParams(location.search).get("v") || "vo";
  const sc = document.createElement("script");
  sc.src = `${v}.js`;
  sc.onload = async () => {
    init();
    await document.fonts.ready;
    await Promise.all(["900 96px 'Inter Tight'", "800 60px 'Inter Tight'", "600 50px 'Inter Tight'", "italic 96px 'Instrument Serif'"].map((f) => document.fonts.load(f)));
    await window.seek(0);
    window.STAGE_READY = true;
  };
  document.body.appendChild(sc);
})();
