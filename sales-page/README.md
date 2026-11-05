# Misi Pemulihan 3M — sales page

Sales page satu halaman (BM) untuk pakej BASIC RM49, PRO RM89 dan USAHAWAN RM299. Semua mockup, ilustrasi dan demo dilukis dengan
SVG, CSS dan JavaScript ringan, tanpa gambar luar dan tanpa library animasi.

| Fail | Guna |
|---|---|
| `misi-pemulihan-3m-sales-page.html` | Halaman penuh, terus boleh dibuka atau dimuat naik |
| `misi3m-elementor-embed.html` | Kandungan yang sama tanpa `<html>/<head>/<body>`, untuk widget HTML Elementor |
| `src/` | Sumber: `art.mjs` (sprite SVG, ikon, ilustrasi), `devices.mjs`, `screens.mjs`, `sections.mjs` (copy hingga pricing), `bawah.mjs` (seksyen bawah pricing), `styles.css`, `app.js` |
| `assets/img/` | Foto trainer, 8 gambar kelas Muar 31 Okt 2026 dan video 15 saat (seksyen Kata Pembangun dan Bukti); build menyalinnya ke `dist/assets/img/` |
| `assets/fakta/` | Satu JSON + foto setiap berita untuk «Fakta yang boleh anda semak sendiri» |
| `tools/keratan.mjs` | Salinan penjana skill `/ubai-keratan-akhbar`; build menjalankannya (layout `ori`, HTML) |
| `tools/build.mjs` | Jana kedua-dua fail HTML; tolak build jika id berulang, `url(#…)` yatim, emoji, frasa terlarang, value stack tak menjumlah, nilai 6 dunia ≠ item "6 Kategori" atau anchor ≠ 2 |
| `tools/video-kelas.sh` | Bina semula `kelas-31okt.mp4` dari `RAW/kelas-terkini/` sebagai yuv420p julat terhad BT.709 (bukan yuvj420p iPhone); smoke menolak format lain |

Kedua-dua fail HTML adalah **output**. Ubah dalam `src/`, kemudian `node tools/build.mjs`.

## Susunan seksyen

Atas pricing: hero → masalah → fakta berita (KPM, MOBIM) → beza → demo → sesuai untuk siapa (6 golongan, Manfaat +
Impian, kad terakhir USAHAWAN) → 6 dunia (apa yang anda dapat).

## Seksyen bawah pricing

Susunan: pricing (3 pakej) → objection (4 kad ibu bapa + 1 kad USAHAWAN) → impian (laporan ibu bapa) → Kata Pembangun → bukti kelas →
CTA penutup (3 kad, skrol ke pricing) → FAQ (13 soalan) → footer.

**Ubah atau tambah fakta berita:** sunting `assets/fakta/artikel-*.json` (`tajuk`, `ori.masa`, `ori.kapsyen`,
`ori.petikan` dengan `<mark>` pada frasa bukti, `foto`), kemudian `node tools/build.mjs`. Fail JSON baru dalam folder
itu terus jadi kad baru. Kad dibina dalam HTML (rupa screenshot berita yang bersih), bukan gambar, dalam kotak tetap
600×800. Screenshot asal untuk rujukan ada di `assets/shots/` (`INDEX.md`). Build menolak jika nilai «impian» tidak
sama dengan item PRO, jika bilangan kad ≠ bilangan JSON, atau jika ada butang selain 3 butang pakej dan 3 kad CTA
penutup.

## Preview lokal

- Herd: http://misi3m.test/misi-pemulihan-3m-sales-page.html (tiada login; halaman statik)
- Skrin semakan: `node tools/shots.mjs -` → `.tmp/shots/<lebar>-<seksyen>.png` pada 375/430/768/1024/1440

## Ujian

```bash
npx playwright test tests/sales-page.spec.ts tests/seksyen-bawah.spec.ts
```
```bash
npx playwright test tests/smoke.spec.ts
```

E2E bersifat hermetik (server sendiri pada port rawak, Google Fonts dijawab kosong). Smoke memandu halaman sebenar di Herd.

## Terbit di Cloudflare

Hidup: **https://misi3m-sales.lernify18.workers.dev** (Worker `misi3m-sales`, akaun `lernify18`).

Halaman dan gambar dihidang terus oleh Static Assets. Hanya `/assets/img/*.mp4` melalui skrip kecil `worker/index.js`
(`assets.run_worker_first`): Static Assets mengabaikan `Range` dan membalas 200 dengan fail penuh, sedangkan Safari di
iPhone enggan memainkan video tanpa 206 Partial Content. `worker/range.js` diport dari helper Sellhiz
(`server/lib/rangeResponse.ts`). Ujian unit: `pnpm test`.

```bash
pnpm run deploy
```

`pnpm run deploy` = `node tools/build.mjs && wrangler deploy`. Build menulis `dist/index.html` (salinan
`misi-pemulihan-3m-sales-page.html`, gitignored) dan Worker menghidang folder itu. HTML dihantar dengan
`cache-control: public, max-age=0, must-revalidate`, jadi deploy baru terus kelihatan. Sahkan selepas deploy:

```bash
SMOKE_URL=https://misi3m-sales.lernify18.workers.dev/ npx playwright test tests/smoke.spec.ts --project=chromium --project=webkit-iphone
```

Tiga butang pakej masih `href="#"`: halaman hidup belum boleh menerima bayaran sehingga pautan sebenar dipasang.

Semua 6 butang (3 pakej + 3 kad CTA penutup) menghantar mesej kepada kedai yang membenam page ini dalam iframe:

- **Checkout gaya Woo (pilihan Ubai, 2026-11-05).** Bila Embed URL Page Sellhiz menamakan produk setiap pakej, butang
  pakej itu menghantar `{ type: 'embed:add-to-cart', productId }` dan Sellhiz membuka checkout dengan pakej itu sahaja
  dalam troli. Setiap kedai (termasuk reseller) letak ID produknya sendiri:
  `https://misi3m-sales.lernify18.workers.dev/?basic=<id>&pro=<id>&usahawan=<id>`. ID = UUID produk atau nombor
  add-to-cart; nilai lain diabaikan (`src/pakej-id.js`). Page Sellhiz: «Checkout style» = Sticky button (WooCommerce),
  «CTA bar» = No bar.
- Tanpa ID untuk pakej itu, butang menghantar `{ type: 'scroll-to-payment' }` dan kedai membuka checkout biasa.

Dalam iframe, butang tidak melayari sendiri. Bila dibuka terus (tiada induk), kad CTA penutup skrol ke pricing dan
butang pakej kekal di tempat.

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
- Gambar dan video seksyen bawah dirujuk sebagai `assets/img/...` (relatif). Dalam WordPress, muat naik folder
  `assets/img/` dan tukar laluan itu ke URL Media Library, atau gambar tidak muncul.
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

8. **Pakej USAHAWAN RM299**: modul bina game, modul bina sales page dan **Modul Run Ads Reseller** sudah siap (atau
   tarikh buka), dan nilai rujukan RM497 / RM297 / RM297 / RM197. RM297 untuk Run Ads ialah andaian.
9. ~~Komisyen reseller 80%~~ **Diputuskan 2026-11-03: 100% hasil jualan, cara A (kedai sendiri).** Reseller jual BASIC
   dan PRO dari kedai Sellhiz sendiri dengan gateway atas nama sendiri, jadi pembeli bayar terus kepadanya. Affiliate di
   kedai Ubai tidak dipakai: Sellhiz menghadkan komisyen peratus pada 90% (`shared/schemas.ts`, ruang untuk caj
   gateway). Masih perlu disahkan:
   - reseller wajib jual pada RM49 / RM89? Sistem tak boleh paksa harga dalam kedai orang lain, jadi ia syarat bertulis;
   - reseller jual BASIC dan PRO sahaja, bukan USAHAWAN (tiada komisyen atas rekrut, Akta 500);
   - reseller daftar ToyyibPay / CHIP sendiri: perlu diajar dalam modul?
   - pembeli reseller dapat link game yang sama; ciri PRO belum dikunci ikut pakej (perkara 1).
10. **Akses selepas bayar** «link akses dihantar ke emel» (FAQ): ikut aliran kedai yang akan dipasang.
11. **Anggaran kos di luar** (tuisyen RM80–150 sebulan, buku RM30–60, app RM20–40 sebulan) dalam seksyen objection.
12. ~~Gambar kelas dari page Kelas AI Muar (kelas lepas)~~ **Selesai 2026-11-02:** galeri Bukti kini 8 gambar dan video
    15 saat dari kelas Muar 31 Okt 2026, dieksport dari Photos (`RAW/kelas-terkini/`, diabaikan git). Satu gambar dan
    separuh video ialah Misi Pemulihan 3M dimain di laptop kelas (IMG_5038).
13. **Website E-Dagang Sellhiz 1 Tahun = pelan Starter** (RM299 / 12 bulan, harga awam `sellhiz.win/api/plans` pada
    2026-11-03: semua gateway, tiada split, 10 page, 20 produk, LMS, tiada custom domain). Sahkan: Starter dan bukan Pro;
    cara serah (kod akses pelan 12 bulan selepas bayar?); dan selepas setahun. FAQ hanya menulis «boleh sambung
    langganan kedai pada harga semasa». Ikut nota Julai, pelan berbayar yang tamat jatuh ke tahap Trial (split 10%,
    ToyyibPay sahaja, 3 produk); semak semula sebelum menulis lebih.
14. **Nama "Sellhiz" pada kad** (tiada nama domain). Tukar kepada «Website E-Dagang Siap Guna» jika Ubai tak mahu jenama.
15. **6 golongan dalam «Sesuai Untuk Siapa»** (draf 2026-11-03): prasekolah 5–6, Tahun 1–3 belum lancar, cepat bosan,
    ibu ayah bekerja, cikgu / guru tadika / guru pemulihan, dan pembina game (USAHAWAN). Sahkan golongan cikgu: tiada
    lesen kelas ditawarkan, jadi kad itu bercakap tentang murid berlatih di rumah.

Tiada testimoni, statistik, kiraan pelanggan, kiraan masa (countdown) atau jaminan wang kembali dalam halaman ini.
