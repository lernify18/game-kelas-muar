// Versi POV: BTS Ubai dibisukan + kotak kapsyen putih/merah gaya POV + lagu, tanpa VO.
// Setiap beat ~2–2.5 s; B-roll = skrin game sebenar dalam mockup telefon / tablet.
window.VERSION = () => {
  const DUR = 21.5;
  const BOX_TOP = 190;
  const dev = (o) => ({ type: "device", kind: "phone", x: 540, y: 1040, s: 0.82, ...o });
  const box = (a, b, text, y = BOX_TOP) => ({ type: "pov", a, b, y, lines: [{ text }] });

  return {
    dur: DUR,
    music: { start: 20, gain: 0.9, fadeOut: 1.5 },
    leaks: [{ t: 3.4, which: "a", d: 0.45, o: 0.7 }, { t: 17.0, which: "b", d: 0.45, o: 0.7 }],
    scenes: [
      // HOOK — muka Ubai (BTS, dibisukan) + POV power line + solusi PROVEN
      { type: "bts", a: 0, b: 3.4, at: 4, zoom: [1.02, 1.1] },
      { type: "pov", a: 0, b: 3.4, y: 1090, lines: [
        { text: "POV: anak boleh fokus lama [main game]…", at: 0 },
        { text: "tapi buka buku latihan, [kejap je dah bosan]", at: 0.9 },
        { text: "Sampai saya jumpa cara [PROVEN] ni ↓", sol: true, at: 2.0 },
      ] },

      { type: "device", kind: "tablet", clip: "map_tab", a: 3.4, b: 6.0, at: 1.0, speed: 1.3, x: 540, y: 1040, s: 0.84, ry: 9, enter: "pop" },
      box(3.4, 6.0, "[Misi Pemulihan 3M]: 6 dunia belajar"),

      dev({ clip: "q_membaca", a: 6.0, b: 8.0, enter: "right", ry: 8 }),
      box(6.0, 8.0, "Belajar [MEMBACA]"),
      dev({ clip: "q_mengeja", a: 8.0, b: 10.0, at: 0.1, enter: "left", ry: -8 }),
      box(8.0, 10.0, "[MENGEJA] suku kata"),
      dev({ clip: "q_mengira", a: 10.0, b: 12.0, at: 0.1, enter: "right", ry: 8 }),
      box(10.0, 12.0, "[MENGIRA] sambil main"),

      dev({ clip: "jawab", a: 12.0, b: 14.4, at: 0.3, speed: 0.9, enter: "pop", ry: -6 }),
      box(12.0, 14.4, "Jawab betul → [konfetti!]"),
      dev({ clip: "sticker", a: 14.4, b: 17.0, at: 1.6, enter: "right", ry: 6 }),
      box(14.4, 17.0, "Siap dapat [STIKER]"),

      { type: "bts", a: 17.0, b: 19.2, at: 40, zoom: [1.05, 1.12] },
      box(17.0, 19.2, "Belajar pun rasa macam [main game]", 1130),

      dev({ clip: "welcome", a: 19.2, b: DUR, at: 0.3, speed: 0.8, y: 600, s: 0.62, enter: "up", ry: -7 }),
      { type: "art", name: "comment", a: 19.2, b: DUR, y: 1150, typeAt: 19.6, sendAt: 20.4 },
      box(19.2, DUR, "Comment [GAME] nak tengok demo", 1340),
    ],
    sfx: [
      { t: 0.02, f: "boom", g: 0.3 },
      { t: 2.0, f: "pick", g: 0.5 },
      { t: 3.3, f: "whoosh", g: 0.5 },
      { t: 6.0, f: "whoosh", g: 0.3 },
      { t: 8.0, f: "whoosh", g: 0.3 },
      { t: 10.0, f: "whoosh", g: 0.3 },
      { t: 12.0 + (0.8 - 0.3) / 0.9, f: "correct", g: 0.45 },
      { t: 12.0 + (0.8 - 0.3) / 0.9 + 0.2, f: "fireworks", g: 0.2 },
      { t: 14.4 + (2.2 - 1.6), f: "sticker", g: 0.45 },
      { t: 14.4 + (2.2 - 1.6) + 0.6, f: "star", g: 0.35 },
      { t: 16.9, f: "whoosh", g: 0.5 },
      { t: 19.2, f: "pick", g: 0.4 },
      { t: 20.4, f: "tap", g: 0.55 },
    ],
  };
};
