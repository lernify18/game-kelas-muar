# Misi Pemulihan 3M — sales page

Sales page satu halaman (BM) untuk pakej BASIC RM49 dan PRO RM89. Semua mockup, ilustrasi dan demo dilukis dengan
SVG, CSS dan JavaScript ringan, tanpa gambar luar dan tanpa library animasi.

| Fail | Guna |
|---|---|
| `misi-pemulihan-3m-sales-page.html` | Halaman penuh, terus boleh dibuka atau dimuat naik |
| `misi3m-elementor-embed.html` | Kandungan yang sama tanpa `<html>/<head>/<body>`, untuk widget HTML Elementor |
| `src/` | Sumber: `art.mjs` (sprite SVG, ikon, ilustrasi), `devices.mjs`, `screens.mjs`, `sections.mjs` (copy), `styles.css`, `app.js` |
| `tools/build.mjs` | Jana kedua-dua fail HTML; tolak build jika id berulang, `url(#…)` yatim, emoji, frasa terlarang, value stack tak menjumlah, nilai 6 dunia ≠ item "6 Kategori" atau anchor ≠ 2 |

Kedua-dua fail HTML adalah **output**. Ubah dalam `src/`, kemudian `node tools/build.mjs`.

## Preview lokal

- Herd: http://misi3m.test/misi-pemulihan-3m-sales-page.html (tiada login; halaman statik)
- Skrin semakan: `node tools/shots.mjs -` → `.tmp/shots/<lebar>-<seksyen>.png` pada 375/430/768/1024/1440

## Ujian

```bash
npx playwright test tests/sales-page.spec.ts
```
```bash
npx playwright test tests/smoke.spec.ts
```

E2E bersifat hermetik (server sendiri pada port rawak, Google Fonts dijawab kosong). Smoke memandu halaman sebenar di Herd.

## Pasang di WordPress / Elementor

1. Cipta halaman baharu → **Edit with Elementor**.
2. Page Settings → Page Layout: **Elementor Canvas**. Ini membuang header, menu dan footer tema, kerana sales page tidak
   boleh ada menu.
3. Tambah Container/Section: **Content Width = Full Width**, padding 0, gap 0.
4. Seret widget **HTML** ke dalamnya. Tampal **seluruh** isi `misi3m-elementor-embed.html`.
5. Update → buka halaman dan uji demo dengan jari di telefon.
6. Bila pautan bayaran sedia, tukar dua `href="#"` pada butang `SAYA NAK PAKEJ BASIC — RM49` dan
   `SAYA NAK PAKEJ PRO — RM89` (cari `data-pkg="basic"` / `data-pkg="pro"`).

Kaveat yang perlu tahu:
- Widget HTML hanya menyimpan `<script>` jika akaun anda ada keupayaan `unfiltered_html` (Administrator pada laman
  tunggal; pada Multisite hanya Super Admin). Tanpa skrip, halaman tetap kelihatan tetapi demo tidak boleh dimain dan
  tahun hak cipta kekal statik.
- Plugin keselamatan atau pengoptimuman (WP Rocket, Autoptimize, LiteSpeed, Perfmatters) mungkin menangguh, menggabung
  atau membuang skrip inline. Kecualikan skrip yang mengandungi `misi3m-sales-root` jika demo tidak berfungsi.
- Semua CSS diskop di bawah `#misi3m-sales-root`, semua id bermula `m3-`, dan JavaScript dalam IIFE tanpa global.
  Ujian e2e membenamkan fail embed dalam tema "bermusuhan" (warna h2, gaya butang, `box-sizing` berbeza) dan
  mengesahkan halaman tidak berubah, teks tema di luar tidak tersentuh, dan tiada global baharu pada `window`.
- Tampal hanya **satu** salinan per halaman: id unik dan skrip berhenti jika akar sudah dimulakan.
- Font dimuat dari Google Fonts. Jika laman anda menyekat Google Fonts (GDPR), muat Fredoka, Nunito dan
  Plus Jakarta Sans secara tempatan; halaman jatuh kepada font sistem jika tiada.

## Menggantikan skrin demo dengan aset game sebenar

Game sebenar sedang dibina dalam folder yang sama (sesi lain) dan belum ada semasa halaman ini dibina. Jadi skrin dalam
mockup dilukis daripada spesifikasi game (Kiko Si Kancil, 6 dunia, 8 soalan, pemasa, bintang, sticker). Ia
**bukan salinan piksel demi piksel** game sebenar. Bila game siap:

- Setiap skrin ialah satu fungsi dalam `src/screens.mjs`: `dashboard()` (PC hero), `resultCard()` (tablet hero),
  `gameplay()` (telefon hero), dan `FEAT.huruf|pulau|bandar|taman|planet|misi` (6 ciri). Saiz kanvas: PC 948×540,
  tablet potret 512×692, tablet landskap 692×482, telefon 348×736.
- Gantikan isi fungsi dengan SVG skrin sebenar (atau eksport SVG dari game), kekalkan saiz kanvas, kemudian
  `node tools/build.mjs`. Bingkai peranti, condong dan animasi kekal.
- Kiko Si Kancil ialah simbol `#m3-kiko` dalam `src/art.mjs`. Jika game ada versi Kiko sendiri, ganti simbol itu
  sekali dan semua skrin ikut.
- Nama kategori ada di `screens.mjs` (label peta) dan `sections.mjs` (`FEATURES`). Semak supaya sama tepat dengan game.

## Perlu disahkan sebelum terbit

Tuntutan komersial ini datang terus dari brief. Saya tidak boleh mengesahkannya:

1. **Pembahagian ciri BASIC/PRO.** Cadangan latihan, laporan ibu bapa, analisis kemahiran, album sticker eksklusif
   dan pilihan BM/English disenaraikan sebagai PRO sahaja. Game mesti benar-benar mengunci ciri ini mengikut pakej,
   atau halaman ini akan mendakwa sesuatu yang tidak berlaku.
2. **Nilai rujukan RM149 / RM289** (harga dipotong). Ia dilabel "Nilai rujukan", bukan harga lama, kerana tiada
   bukti harga jualan terdahulu. Nota kecil di bawah pricing menyatakannya.
3. ~~Nilai seksyen "6 Dunia" lawan pricing~~ **Selesai 2026-10-31:** nilai 6 dunia kini RM9 + 10 + 10 + 10 + 9 + 11
   = **RM59**, sama dengan item pricing "6 Kategori Pembelajaran 3M — Nilai RM59". Build dan e2e menolak jika
   jumlah ini tidak lagi sama.
4. **"Bayar sekali… Tiada langganan bulanan"**: sahkan bahawa ini memang syarat tawaran.
5. **"Belajar melalui telefon, tablet atau komputer"**: sahkan game berjalan pada ketiga-tiganya.
6. **Pilihan masa 30s / 1m / Tanpa Had** dan **3 tahap kesukaran**: sahkan ada dalam BASIC.
7. Kad keputusan tablet menulis **"8 MISI SELESAI"** ikut brief, walaupun satu sesi ialah 8 *soalan*. Tukar kepada
   "8 SOALAN SELESAI" jika game memaparkannya begitu.

Tiada testimoni, statistik, kiraan pelanggan, kiraan masa (countdown) atau jaminan wang kembali dalam halaman ini.
