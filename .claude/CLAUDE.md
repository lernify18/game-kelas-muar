# Misi Pemulihan 3M — aturan projek

Aturan khusus repo ini. Peraturan kerja umum datang dari `~/.claude/CLAUDE.md` setiap pemaju. `CLAUDE.md` di akar repo
ialah salinan automatik fail itu, diabaikan git, jadi aturan projek ditulis di sini.

Spesifikasi asal: `docs/master-prompt-misi-3m.md`. Bila bahagian "Keputusan semasa membina" bercanggah dengan master
prompt, keputusan itu menang.

## Wajib dari master prompt

- Game sebenar yang boleh dimain, bukan mockup atau landing page. Tiada butang mati, skrin kosong atau placeholder
  ("Question 1", "Option A", "Coming Soon").
- Tepat 6 kategori × 3 tahap (Asas, Sedang Maju, Hebat). Semua tahap boleh dicuba; cadang ikut prestasi, jangan kunci.
- Setiap sesi TEPAT 8 soalan. Lima mekanik: objektif, seret & lepas, susunan, padanan, isi tempat kosong.
- Satu jawapan sah sahaja bagi setiap soalan, tiada soalan mustahil. Jawapan disahkan hanya di `Bank.check()`.
  Tiada soalan berulang dalam satu sesi; pilihan jawapan dirawak.
- Pemasa 30 s / 1 min / tanpa had. Salah → cuba lagi → petunjuk berpandu → jawapan ditunjuk.
- Bintang ikut prestasi sebenar (7–8 betul sendiri = 3, 5–6 = 2, 0–4 = 1). Sticker disimpan dalam album. Laporan ibu
  bapa dan cadangan latihan dari data sesi sebenar.
- Bahasa Melayu lalai, toggle English dengan bank English yang sesuai.
- Kurikulum: MOBIM BM/Matematik Tahun 1 dan DSKP KSSR sebagai panduan susunan kemahiran sahaja. Jangan dakwa kelulusan
  KPM, jangan reka kod SP/DSKP, jangan salin kandungan berhak cipta. Game ini sokongan belajar, bukan alat diagnosis.
- Bunyi huruf BM tidak dikelirukan dengan nama huruf. Perkataan BM mesti sah dan biasa untuk murid sekolah rendah.
- Profil: nama panggilan, umur 5–9, avatar. Jangan minta emel, telefon atau data sensitif.
- Reka bentuk original: jangan salin aset atau watak Khan Academy Kids, Duolingo ABC atau PBS Kids. Maskot Kiko si
  Kancil (SVG). Palet: lavender `#A78BFA`, mint `#76DDB5`, kuning `#FFD66D`, coral `#FF8FA3`, biru langit `#82CCFF`,
  krim `#FFF9EF`. Font Fredoka / Nunito.
- Mobile-first: sasaran sentuh ≥ 44 px, tiada limpahan mendatar, seret & lepas berfungsi dengan sentuhan, padanan tidak
  bergantung pada hover, safe area telefon, sokong `prefers-reduced-motion`.
- Tiada backend, tiada API berbayar, tiada imej dari laman luar. localStorage dengan fallback dalam memori; jangan dakwa
  progress disegerakkan antara peranti.

## Keputusan semasa membina (tanya Ubai sebelum mengubah)

- Suara bacaan (speechSynthesis / Google TTS) tidak dipakai walaupun master prompt memintanya: app kids Ubai
  melarangnya. Bunyi ialah 14 SFX ElevenLabs pra-rakam dalam `sfx/`. Game mesti boleh dimain tanpa audio.
- Tiada login atau kod akses: sesiapa yang ada pautan boleh main semua dunia. Profil lokal sahaja (localStorage
  `misi3m:v1`).
- Sticker dan avatar haiwan dilukis sendiri dalam SVG, bukan Fluent. Tiada emoji sistem dalam UI.
- `src/art-kb.js` dijana dari Kids Baca oleh `tools/import-kidsbaca-art.mjs`: jangan edit dengan tangan. `src/fx.js` dan
  `src/scenes.js` diport dari projek kelas sebelum ini.
- Vanilla JS + CSS tanpa framework; `index.html` memuat `src/*.js` terus.
- Satu fail: `pnpm build` → `dist/misi-pemulihan-3m.html` dengan SFX tertanam sebagai data URI. Ia mesti jalan dari
  `file://`.

## Ujian

- `pnpm typecheck`, `pnpm test` (unit node:test: integriti bank + enjin), `pnpm test:smoke`, `pnpm test:e2e`.
  Ubahan pada bank soalan mesti lulus `pnpm test` sebelum commit.
- Playwright memulakan pelayan statik python pada port 4417. Jika port itu dipakai sesi lain: `PW_PORT=<port bebas>`.
- `?test=1&benih=N` memberi sesi boleh diulang dan cangkuk `window.__MISI__` untuk spec.
- Jangan jalankan Playwright terhadap `misi-3m.test`: Herd menyuntik widget "Edit with Herd".
- Smoke laman hidup: `PW_BASE_URL=https://misi3m-game.lernify18.workers.dev npx playwright test tests/e2e/smoke.spec.mjs --project=chromium`.

## Terbit

- `pnpm run deploy` = build + `wrangler deploy` ke Worker `misi3m-game`. Bukan `pnpm deploy`: itu perintah pnpm sendiri.

## Folder lain dalam repo

- `sales-page/`: sales page, Worker `misi3m-sales`, lihat `sales-page/README.md`. Edit `src/`, kemudian
  `node tools/build.mjs`; HTML output dijana, jangan edit dengan tangan. Bukti berita guna layout `ori` dalam HTML
  (`tools/keratan.mjs`): tanpa latar kertas, tanpa hyperlink. Dakwaan dalam «Perlu disahkan sebelum terbit» di README
  itu mesti disemak dengan Ubai sebelum diubah atau diterbitkan.
- `video/`: iklan 9:16 gaya Iman Gadzhi, lihat `video/README.md`. Kapsyen gaya Iman dalam semua versi, termasuk POV
  (kotak kapsyen putih/merah ditolak). `pnpm test:video` mesti lulus selepas setiap ubahan.
- `RAW/`, `footage/`, `sfx/`: bahan kelas dan bunyi. `RAW/IMG_4944.mov` asal (629 MB) diabaikan; versi mampat dikomit.
