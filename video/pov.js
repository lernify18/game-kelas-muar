// Versi POV: BTS Ubai dibisukan + lagu, tanpa VO. Kapsyen gaya Iman (perkataan demi perkataan, putih + emas,
// serif italic) — sama dengan versi VO, tetapi masa tetap kerana tiada suara untuk diikat.
window.VERSION = () => {
  const DUR = 22.0;
  const CAP_Y = 1390;
  const phone = (o) => ({ type: "device", kind: "phone", x: 540, y: 700, s: 0.85, ...o });
  const caps = (a, b, groups, o = {}) => ({ type: "caps", a, b, y: CAP_Y, size: 100, groups, ...o });
  const g = (at, text, step) => ({ at, text, step });

  const HOOK = 3.8;
  const JAWAB = 12.4, TAP = JAWAB + (0.8 - 0.3) / 0.9;
  const STK = 14.8, GIFT = STK + (2.2 - 1.6);
  const FACE = 17.4, CTA = 19.6;

  return {
    dur: DUR,
    music: { start: 20, gain: 0.9, fadeOut: 1.5 },
    leaks: [{ t: HOOK, which: "a", d: 0.45, o: 0.7 }, { t: FACE, which: "b", d: 0.45, o: 0.7 }],
    scenes: [
      // HOOK — muka Ubai (BTS, dibisukan) + tajuk POV power + SOLUSI PROVEN
      { type: "bts", a: 0, b: HOOK, at: 4, zoom: [1.02, 1.1] },
      { type: "hook", a: 0, b: HOOK, y: 250, solY: 1170, kicker: "POV: anak 5–9 tahun",
        h1: ["Fokus lama", "main game,", "<em>bosan</em> buku?"], badge: "SOLUSI PROVEN", sol: "Belajar 3M<br><i>macam main game</i>",
        times: [0, 0.12, 0.4, 0.75, 1.7] },

      { type: "device", kind: "tablet", clip: "map_tab", a: HOOK, b: 6.4, at: 0.9, speed: 1.3, x: 540, y: 690, s: 0.86, ry: 9, enter: "pop" },
      caps(HOOK, 6.4, [g(HOOK + 0.1, "Misi Pemulihan *3M*"), g(5.0, "enam=^6^ *dunia* pembelajaran")], { size: 96 }),

      phone({ clip: "q_membaca", a: 6.4, b: 8.4, enter: "up", ry: 8 }),
      caps(6.4, 8.4, [g(6.5, "Belajar *membaca,*")]),
      phone({ clip: "q_mengeja", a: 8.4, b: 10.4, at: 0.1, enter: "right", ry: -8 }),
      caps(8.4, 10.4, [g(8.5, "*mengeja* suku kata")]),
      phone({ clip: "q_mengira", a: 10.4, b: JAWAB, at: 0.1, enter: "right", ry: 8 }),
      caps(10.4, JAWAB, [g(10.5, "dan *mengira* _sambil_ main.")]),

      phone({ clip: "jawab", a: JAWAB, b: STK, at: 0.3, speed: 0.9, enter: "pop", ry: -6, zoomTo: { a: TAP + 0.3, s: 1.08 } }),
      caps(JAWAB, STK, [g(JAWAB + 0.1, "Jawab *betul,*"), g(TAP + 0.35, "keluar ^konfetti!^")]),
      phone({ clip: "sticker", a: STK, b: FACE, at: 1.6, enter: "right", ry: 6 }),
      caps(STK, FACE, [g(STK + 0.1, "siap dapat"), g(GIFT + 0.55, "^stiker^ _baru!_")]),

      // Kembali ke muka (POV) — kapsyen di bawah muka
      { type: "bts", a: FACE, b: CTA, at: 40, zoom: [1.05, 1.12] },
      caps(FACE, CTA, [g(FACE + 0.1, "Belajar pun rasa"), g(18.5, "macam *main* ^game.^")], { y: 1250, size: 112 }),

      phone({ clip: "welcome", a: CTA, b: DUR, at: 0.3, speed: 0.8, y: 560, s: 0.62, enter: "up", ry: -7 }),
      { type: "art", name: "comment", a: CTA, b: DUR, y: 1110, typeAt: CTA + 0.35, sendAt: CTA + 1.2 },
      caps(CTA, DUR, [g(CTA + 0.1, "*Comment* ^game^"), g(CTA + 1.2, "nak tengok _demo._")], { y: CAP_Y + 40, size: 96 }),
    ],
    sfx: [
      { t: 0.02, f: "boom", g: 0.3 },
      { t: 1.7, f: "pick", g: 0.5 },
      { t: HOOK - 0.12, f: "whoosh", g: 0.5 },
      { t: 6.4, f: "whoosh", g: 0.3 },
      { t: 8.4, f: "tap", g: 0.35 },
      { t: 10.4, f: "tap", g: 0.35 },
      { t: TAP, f: "correct", g: 0.45 },
      { t: TAP + 0.2, f: "fireworks", g: 0.2 },
      { t: GIFT, f: "sticker", g: 0.45 },
      { t: GIFT + 0.6, f: "star", g: 0.35 },
      { t: FACE - 0.12, f: "whoosh", g: 0.5 },
      { t: CTA, f: "pick", g: 0.4 },
      { t: CTA + 1.2, f: "tap", g: 0.55 },
    ],
  };
};
