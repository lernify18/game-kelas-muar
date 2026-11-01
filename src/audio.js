/*
 * Kesan bunyi: rakaman ElevenLabs (dari projek kelas Ubai) dimainkan melalui Web Audio; sintesis ringkas
 * sebagai sandaran. Tiada suara/TTS: speechSynthesis dilarang dalam app kanak-kanak Ubai.
 * Audio hanya bermula selepas sentuhan pertama (polisi autoplay).
 */
(function (root) {
  const NAMES = ['tap', 'pick', 'drop', 'correct', 'wrong', 'star', 'sticker', 'confetti', 'fireworks', 'boom', 'rocket', 'timeout', 'whoosh', 'world'];
  const VOL = { tap: 0.5, pick: 0.6, drop: 0.7, correct: 0.8, wrong: 0.45, star: 0.7, sticker: 0.85, confetti: 0.6, fireworks: 0.45, boom: 0.4, rocket: 0.35, timeout: 0.6, whoosh: 0.5, world: 0.6 };
  let ctx = null, master = null;
  const buf = {};
  const Sfx = {
    enabled: true,
    played: [],
    unlock() {
      if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
      const AC = root.AudioContext || root.webkitAudioContext;
      if (!AC) return;
      ctx = new AC(); master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
      for (const n of NAMES) {
        const src = (root.SFX_DATA && root.SFX_DATA[n]) || `sfx/${n}.mp3`;
        fetch(src).then((r) => r.arrayBuffer()).then((a) => ctx.decodeAudioData(a)).then((b) => { buf[n] = b; }).catch(() => {});
      }
    },
    play(name) {
      Sfx.played.push(name);
      if (Sfx.played.length > 50) Sfx.played.shift();
      if (!Sfx.enabled || !ctx) return;
      if (ctx.state === 'suspended') ctx.resume();
      const g = ctx.createGain(); g.gain.value = VOL[name] ?? 0.6; g.connect(master);
      if (buf[name]) { const s = ctx.createBufferSource(); s.buffer = buf[name]; s.connect(g); s.start(); return; }
      synth(name, g);
    },
  };
  function tone(g, f, t0, dur, type = 'sine', vol = 0.3) {
    const o = ctx.createOscillator(), e = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f, ctx.currentTime + t0);
    e.gain.setValueAtTime(0.0001, ctx.currentTime + t0);
    e.gain.exponentialRampToValueAtTime(vol, ctx.currentTime + t0 + 0.02);
    e.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t0 + dur);
    o.connect(e); e.connect(g); o.start(ctx.currentTime + t0); o.stop(ctx.currentTime + t0 + dur + 0.05);
  }
  function synth(name, g) {
    const seq = {
      correct: [[523, 0], [659, 0.08], [784, 0.16], [1047, 0.26]], star: [[880, 0], [1320, 0.07]], sticker: [[784, 0], [988, 0.08], [1175, 0.16], [1568, 0.26]],
      wrong: [[330, 0], [262, 0.14]], tap: [[660, 0]], pick: [[520, 0]], drop: [[700, 0], [940, 0.05]], timeout: [[440, 0], [330, 0.18]],
    }[name] || [[600, 0]];
    for (const [f, t] of seq) tone(g, f, t, name === 'wrong' ? 0.22 : 0.18, name === 'wrong' ? 'sine' : 'triangle');
  }
  root.Sfx = Sfx;
})(typeof window !== 'undefined' ? window : globalThis);
