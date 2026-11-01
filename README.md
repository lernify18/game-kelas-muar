# Misi Pemulihan 3M — Main, Belajar & Jadi Hebat!

Game pendidikan 3M (membaca, menulis, mengira) untuk kanak-kanak Malaysia 5–9 tahun. Bahasa Melayu (lalai) + English.
Dibina dari master prompt "Canva Code — Misi Pemulihan 3M" sebagai satu aplikasi web statik tanpa backend.

## Main

- Lokal (Herd): http://misi-3m.test — tiada login; profil (nama panggilan, umur, avatar) disimpan dalam peranti.
- Satu fail: `pnpm build` → `dist/misi-pemulihan-3m.html` (~730 KB, semua seni, bunyi dan kod di dalamnya; boleh dibuka luar talian).
- Mod ujian: tambah `?test=1&benih=7` pada URL untuk sesi boleh diulang (benih) dan cangkuk `window.__MISI__`.

## Isi

- 6 dunia × 3 tahap (Asas, Sedang Maju, Hebat) × 2 bahasa; setiap sesi tepat 8 soalan, 5 mekanik:
  objektif, seret & lepas (tetikus/sentuh + ketik-letak), susunan, padanan bergaris, isi tempat kosong.
- Bank berjana berbenih (`src/bank.js`): ribuan variasi sah; semua jawapan disahkan di `Bank.check()`.
- Pemasa per soalan 30 s / 1 min / tanpa had; cubaan salah → petunjuk berpandu → jawapan ditunjuk.
- Bintang (7–8 betul sendiri = 3, 5–6 = 2, 0–4 = 1), 24 sticker SVG, album, laporan ibu bapa di belakang pintu dewasa,
  latihan adaptif ikut kemahiran lemah.
- Suara bacaan sengaja tidak dipakai (larangan speechSynthesis/Google TTS dalam app kids Ubai); kesan bunyi ialah rakaman
  ElevenLabs dari projek kelas sebelum ini.

## Struktur

| Fail | Isi |
|---|---|
| `src/bank.js` | kemahiran, perkataan bergambar, penjana soalan, `check()`/`validate()` |
| `src/engine.js` | bina sesi adaptif, markah, sticker, cadangan |
| `src/mechanics.js` | lima mekanik (Pointer Events) |
| `src/ui.js` | skrin, pengawal sesi, laporan, tetapan |
| `src/art.js`, `src/art-kb.js` | Kiko, objek 3D, avatar, sticker (`art-kb.js` dijana dari Kids Baca oleh `tools/import-kidsbaca-art.mjs`) |
| `src/fx.js`, `src/scenes.js` | zarah canvas & dunia hidup (diport dari School Ready Kids) |

## Ujian

```bash
pnpm typecheck   # semak sintaks semua fail JS
pnpm test        # unit: integriti bank + enjin
pnpm test:smoke  # Playwright smoke (port 4417)
pnpm test:e2e    # Playwright e2e penuh
```
