// Versi VO: suara ElevenLabs (RAW/) + kapsyen gaya Iman perkataan demi perkataan, selang-seli dengan mockup game.
// Semua masa diikat pada perkataan VO (T("perkataan", ke-n, dari)), jadi timeline ikut suara jika VO dijana semula.
window.VERSION = ({ T, WORDS }) => {
  const vo = window.WORDS.dur;
  const DUR = +(vo + 1.3).toFixed(2);
  const H = T("sekarang") - 0.05;
  const MISI = T("misi") - 0.05;
  const ENAM = T("enam") - 0.08;
  const ANAK = T("anak", 1, 12) - 0.05;
  const MENGEJA = T("mengeja") - 0.05;
  const MENGIRA = T("mengira") - 0.05;
  const JAWAB = T("jawab") - 0.05;
  const SIAP = T("siap") - 0.05;
  const BEST = T("best") - 0.05;
  const CTA = T("comment") - 0.05;
  const TUKAR = T("tukar");
  const BETUL = T("betul");
  const GIFT = T("siap") + 0.15;
  const CAP_Y = 1390;
  const phone = (o) => ({ type: "device", kind: "phone", x: 540, y: 700, s: 0.85, ...o });

  return {
    dur: DUR,
    music: { start: 12, gain: 0.10, fadeOut: 1.2 },
    leaks: [{ t: H, which: "a", d: 0.45, o: 0.7 }, { t: BEST, which: "b", d: 0.45, o: 0.7 }],
    scenes: [
      // 1 · HOOK — BTS di belakang, tajuk power + solusi; tiada kapsyen VO (elak double caption)
      { type: "bts", a: 0, b: H, at: 0, zoom: [1.06, 1.16] },
      { type: "hook", a: 0, b: H, y: 250, solY: 1170, kicker: "Ibu bapa anak 5–9 tahun",
        h1: ["Anak cepat", "bosan buka", "<em>buku?</em>"], badge: "SOLUSI PROVEN", sol: "Belajar 3M<br><i>macam main game</i>",
        times: [0, 0.1, 0.32, 0.55, 1.6] },

      // 2 · Tukar cara belajar — buku SVG bertukar jadi telefon dengan game
      { type: "art", name: "book", a: H, b: TUKAR + 0.3, y: 700, swapAt: TUKAR },
      phone({ clip: "welcome", a: TUKAR + 0.12, b: ENAM, at: 0, speed: 0.75, enter: "flip", ry: -6 }),
      { type: "caps", a: H, b: MISI, y: CAP_Y, size: 100, groups: ["Sekarang, cuba *tukar*", "cara anak _belajar._"] },

      // 3 · 6 dunia — tablet, peta dashboard sebenar diskrol
      { type: "device", kind: "tablet", clip: "map_tab", a: ENAM, b: ANAK, at: 0.85, speed: 1.25, x: 540, y: 690, s: 0.86, ry: 9, enter: "pop" },
      { type: "caps", a: MISI, b: ANAK, y: CAP_Y, size: 92, groups: ["Misi Pemulihan *3M*", "ada enam=^6^ *dunia* pembelajaran", "penuh dengan *game* _interaktif._"] },

      // 4 · membaca / mengeja / mengira — tiga skrin soalan sebenar
      phone({ clip: "q_membaca", a: ANAK, b: MENGEJA, at: 0, enter: "up", ry: 8 }),
      phone({ clip: "q_mengeja", a: MENGEJA, b: MENGIRA, at: 0.2, enter: "right", ry: -8 }),
      phone({ clip: "q_mengira", a: MENGIRA, b: JAWAB, at: 0.2, enter: "right", ry: 8 }),
      { type: "caps", a: ANAK, b: JAWAB, y: CAP_Y, size: 96, groups: ["Anak boleh belajar", "*membaca,* *mengeja*", "dan *mengira.*"] },

      // 5 · jawab betul → konfetti → sticker
      phone({ clip: "jawab", a: JAWAB, b: SIAP, at: 0.8 - (BETUL + 0.02 - JAWAB) * 0.85, speed: 0.85, enter: "pop", ry: -6, zoomTo: { a: T("fireworks") - 0.1, s: 1.08 } }),
      phone({ clip: "sticker", a: SIAP, b: BEST, at: 2.2 - (GIFT - SIAP), enter: "right", ry: 6 }),
      { type: "caps", a: JAWAB, b: BEST, y: CAP_Y, size: 96, groups: ["Jawab *betul,*", "keluar *fireworks,* *konfetti,*", "siap dapat ^stiker.^"] },

      // 6 · Best kan? — kapsyen penuh atas grid + bintang 3D
      { type: "art", name: "stars", a: BEST, b: CTA, y: 930 },
      { type: "caps", a: BEST, b: CTA, y: 950, size: 118, groups: ["^Best^ _kan?_", "belajar pun rasa", "macam *main* ^game.^"] },

      // 7 · CTA — taip GAME dalam komen
      phone({ clip: "welcome", a: CTA, b: DUR, at: 0.3, speed: 0.8, x: 540, y: 560, s: 0.62, enter: "up", ry: -7 }),
      { type: "art", name: "comment", a: CTA, b: DUR, y: 1110, typeAt: T("game", 1, CTA), sendAt: T("demo") + 0.25 },
      { type: "caps", a: CTA, b: DUR, y: CAP_Y + 40, size: 96, groups: ["*Comment* ^game^", "nak tengok _demo._"] },
    ],
    sfx: [
      { t: 0.02, f: "boom", g: 0.35 },
      { t: 1.6, f: "pick", g: 0.5 },
      { t: H - 0.12, f: "whoosh", g: 0.55 },
      { t: TUKAR, f: "world", g: 0.35 },
      { t: ENAM, f: "pick", g: 0.45 },
      { t: ANAK, f: "whoosh", g: 0.35 },
      { t: MENGEJA, f: "tap", g: 0.45 },
      { t: MENGIRA, f: "tap", g: 0.45 },
      { t: BETUL + 0.03, f: "correct", g: 0.45 },
      { t: T("fireworks"), f: "fireworks", g: 0.22 },
      { t: GIFT, f: "sticker", g: 0.45 },
      { t: GIFT + 0.6, f: "star", g: 0.35 },
      { t: BEST - 0.12, f: "whoosh", g: 0.55 },
      { t: BEST + 0.05, f: "star", g: 0.4 },
      { t: CTA, f: "pick", g: 0.4 },
      { t: T("demo") + 0.25, f: "tap", g: 0.55 },
    ],
  };
};
