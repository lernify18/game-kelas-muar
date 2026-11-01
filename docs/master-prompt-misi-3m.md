> Master prompt asal yang Ubai berikan untuk membina game ini (2026-10-31), disalin tanpa ubahan. Keputusan yang menyimpang daripadanya ada dalam `.claude/CLAUDE.md`.

# MASTER PROMPT CANVA CODE — MISI PEMULIHAN 3M

## 1. PERANAN DAN OBJEKTIF

Anda ialah Senior Educational Game Developer, Children's Game UI/UX Designer, Frontend Engineer, Curriculum Designer dan Gamification Specialist.

BINA SEBUAH WEB GAME PENDIDIKAN KANAK-KANAK YANG BERFUNGSI SEPENUHNYA, BUKAN MOCKUP, PROTOTYPE STATIK, PRESENTATION ATAU GAMBAR.

NAMA GAME: MISI PEMULIHAN 3M
TAGLINE: Main, Belajar & Jadi Hebat!
SASARAN: Kanak-kanak Malaysia berumur 5–9 tahun.
FOKUS: Membaca, Menulis dan Mengira (3M).
BAHASA DEFAULT: Bahasa Melayu Malaysia.
BAHASA KEDUA: English, boleh ditukar melalui Settings.

Gunakan Canva Code untuk menghasilkan satu aplikasi interaktif responsive yang boleh terus dimainkan melalui browser, tablet, desktop dan telefon.

Inspirasi pengalaman: Khan Academy Kids, Duolingo ABC, PBS Kids dan game pendidikan premium kanak-kanak.

Ambil inspirasi daripada:
- Learning path dan pembelajaran adaptif.
- Watak maskot yang menggalakkan anak belajar.
- Game pendek dengan interaksi yang menyeronokkan.
- Visual mesra kanak-kanak.
- Ganjaran visual dan koleksi sticker.
- Progress yang jelas untuk ibu bapa.

Wajib menghasilkan reka bentuk original. Jangan menyalin ilustrasi, logo, karakter, aset atau identiti visual aplikasi rujukan.

KEUTAMAAN PALING TINGGI:
1. Game benar-benar playable.
2. Semua 6 kategori berfungsi.
3. Semua 5 mekanik soalan berfungsi.
4. Pemarkahan dan pengesahan jawapan tepat.
5. Animasi ganjaran sangat menyeronokkan.
6. Setiap sesi mengandungi tepat 8 soalan.
7. Progress dan sticker disimpan jika storage tersedia.
8. Responsive dan touch-friendly.

Jangan menghasilkan landing page jualan. Ini ialah GAME SEBENAR.

---

## 2. RUJUKAN KURIKULUM MALAYSIA

Susun kandungan berdasarkan asas kemahiran literasi dan numerasi yang relevan dengan:

- KPM Modul Bimbingan (MOBIM) Bahasa Melayu Tahun 1.
- KPM Modul Bimbingan (MOBIM) Matematik Tahun 1.
- Dokumen Standard Kurikulum dan Pentaksiran (DSKP) KSSR serta dokumen penjajaran kurikulum Tahap 1 yang berkenaan.
- Prinsip penguasaan kemahiran dalam Pemulihan Khas.
- Keutamaan kemahiran asas dan perkembangan mengikut tahap murid dalam Kurikulum Persekolahan 2027, setakat rujukan rasmi yang tersedia.

Rujukan rasmi:
https://www.moe.gov.my/modul-bimbingan-mobim-bagi-mata-pelajaran-bahasa-m

https://www.moe.gov.my/kurikulum-persekolahan-2027

PENTING:
- Gunakan sumber tersebut sebagai panduan pembinaan kemahiran dan susunan pembelajaran, bukan salinan kandungan berhak cipta.
- Jangan mendakwa mendapat kelulusan atau pengiktirafan rasmi KPM.
- Jangan mereka-reka kod Standard Pembelajaran atau kod DSKP.
- Tulis kandungan soalan asli yang betul, sesuai umur dan menggunakan Bahasa Melayu Malaysia.
- Game ini bertujuan sokongan pembelajaran, bukan alat diagnosis masalah pembelajaran.

---

## 3. DESIGN SYSTEM DAN VISUAL GAME

Wajib gunakan visual premium seolah-olah permainan pendidikan kanak-kanak bertaraf antarabangsa.

GAYA VISUAL:
- Colorful, playful, cheerful dan friendly.
- Soft 3D cartoon / Fluent-inspired illustrations.
- Rounded, soft, magical adventure world.
- Bright pastel color palette dengan accent cerah.
- Besar, jelas, mudah ditekan.
- Friendly animated mascot.
- Floating clouds, stars, planets, trees, balloons dan magical elements.
- Lively micro-interactions.
- Elakkan dashboard korporat, UI terlalu formal atau gaya e-learning biasa.

PALETTE:
- Lavender purple: #A78BFA
- Mint green: #76DDB5
- Sunny yellow: #FFD66D
- Coral pink: #FF8FA3
- Sky blue: #82CCFF
- Cream background: #FFF9EF

Gunakan rounded cards, gradient lembut, soft shadows, layered illustrations dan large touch targets.

FONT:
Gunakan font rounded yang mesra kanak-kanak seperti Fredoka, Nunito atau alternatif yang setara.

MASKOT:
Cipta maskot original bernama KIKO SI KANCIL.

Kiko ialah anak kancil kartun comel dengan:
- Kepala besar.
- Mata bersinar.
- Ekspresi ceria.
- Animasi melompat.
- Animasi ketawa dan bertepuk tangan.
- Animasi menunjukkan petunjuk.
- Animasi menyambut kemenangan.

Bina dengan SVG atau vector ringan. Elakkan pergantungan pada gambar luar.

Tambahkan beberapa elemen sidekick yang original seperti bintang comel, awan tersenyum dan haiwan kecil.

ANIMASI:
Gunakan CSS transforms, SVG animations atau animasi Canvas yang ringan.

Wajib optimakan untuk mobile. Elakkan animasi berterusan yang menyebabkan lag.

---

## 4. STRUKTUR SKRIN APLIKASI

Bina semua skrin berikut dengan navigasi berfungsi:

### SCREEN A — WELCOME

Paparkan:
- Logo Misi Pemulihan 3M.
- Kiko animasi melambai.
- Tajuk: "Jom Mulakan Pengembaraan!"
- Subtitle: "Main sambil belajar membaca, menulis dan mengira!"
- Butang besar: "JOM MAIN!"
- Settings icon.

Jika pengguna pertama kali masuk, bawa ke skrin profil.

### SCREEN B — PROFIL PEMAIN

Input:
- Nama panggilan anak.
- Umur 5–9 tahun.
- Pilih avatar yang comel.
- Butang "MULA PENGEMBARAAN".

Simpan profil secara local jika dibenarkan oleh persekitaran.

Jangan wajibkan email, nombor telefon atau maklumat sensitif.

### SCREEN C — MAIN DASHBOARD

Dashboard mesti kelihatan seperti peta dunia pengembaraan kanak-kanak.

Paparkan:
- Kiko sebagai pemandu.
- Ucapan "Hai [Nama]! Jom Jadi Hebat!"
- Progress keseluruhan.
- Jumlah bintang dikumpul.
- Jumlah sticker dibuka.
- Butang "SAMBUNG BELAJAR".
- Enam kategori game dalam bentuk pulau atau dunia kecil.
- Butang Koleksi Sticker.
- Butang Laporan Ibu Bapa.
- Butang Settings.

Setiap kategori ada ilustrasi dan identiti warna berlainan.

Bina progress map dengan laluan bertitik, milestone dan animasi bintang, bukan sekadar grid kad statik.

### SCREEN D — CATEGORY / LEVEL

Apabila kategori dipilih:
- Paparkan nama kategori.
- Ilustrasi tema kategori.
- Tiga tahap kesukaran.
- Kemajuan setiap tahap.
- Butang main.
- Pilihan mod masa.

Tahap 1: Asas.
Tahap 2: Sedang Maju.
Tahap 3: Hebat.

Semua tahap perlu boleh dicuba. Cadangkan tahap mengikut prestasi, tetapi jangan mengunci kanak-kanak secara keterlaluan.

### SCREEN E — GAMEPLAY

Mesti mempunyai:
- Nama kategori.
- Progress 1/8 hingga 8/8.
- Progress bar animasi.
- Butang Home.
- Butang Sound.
- Paparan timer jika dipilih.
- Kad soalan interaktif besar di tengah.
- Maskot dan visual sokongan.
- Butang jawapan atau zon drag & drop.
- Feedback animasi betul dan salah.
- Butang petunjuk.

Fokus visual mestilah pada satu soalan sahaja.

### SCREEN F — RESULT CELEBRATION

Selepas tepat 8 soalan selesai:
- Paparkan kad markah.
- Bintang besar beranimasi.
- Markah dan kemajuan.
- Mesej tahniah.
- Sticker baru yang diperoleh.
- Animasi celebration yang sangat meriah.
- Butang "MAIN LAGI".
- Butang "PILIH MISI LAIN".
- Butang "LIHAT STICKER".
- Butang "LAPORAN IBU BAPA".

### SCREEN G — STICKER COLLECTION

Paparkan buku sticker seperti album koleksi kanak-kanak.

### SCREEN H — PARENT REPORT

Paparkan prestasi sebenar dan cadangan latihan.

### SCREEN I — SETTINGS

Bahasa, audio, animasi dan tetapan lain.

---

## 5. ENAM KATEGORI GAME UTAMA

BINA TEPAT 6 KATEGORI BERIKUT.

Setiap kategori mesti mempunyai:
- Tema visual tersendiri.
- 3 tahap kesukaran.
- Soalan yang benar-benar boleh dimainkan.
- Semua lima jenis mekanik apabila sesuai.
- Pembelajaran berperingkat.
- Peta kemajuan kategori.

### KATEGORI 1 — DUNIA HURUF & BUNYI

Tema: Hutan Huruf Ajaib.
Warna: Hijau mint.

Objektif:
Menguasai pengecaman huruf, bunyi asas huruf dan hubungan huruf dengan perkataan.

Tahap 1:
- Kenal huruf A–Z.
- Huruf besar dan kecil.
- Pilih huruf yang disebut atau ditunjukkan.

Tahap 2:
- Kenal bunyi awal perkataan.
- Padankan huruf dengan gambar.
- Bezakan huruf yang hampir sama.

Tahap 3:
- Kenal bunyi awal dan akhir.
- Lengkapkan huruf yang hilang.
- Susun huruf mudah.

Contoh:
"Apakah huruf pertama bagi perkataan BUKU?"
Jawapan: B.

Pastikan bunyi huruf BM betul dan tidak dikelirukan dengan nama huruf.

### KATEGORI 2 — PULAU SUKU KATA

Tema: Pulau Suku Kata Pelangi.
Warna: Biru.

Objektif:
Menguasai suku kata dan gabungan bunyi untuk membaca.

Tahap 1:
- Gabungan KV seperti ba, bi, bu, ma, mi, mu.
- Padankan bunyi dengan suku kata.

Tahap 2:
- Gabungkan KV + KV.
- Contoh: ba + ju = baju.
- Contoh: bo + la = bola.

Tahap 3:
- Gabungan yang lebih mencabar seperti KVK dan perkataan bersesuaian.
- Kenal pasti suku kata yang hilang.
- Bezakan susunan suku kata yang betul.

Gunakan ilustrasi objek untuk membantu pemahaman.

### KATEGORI 3 — BANDAR PERKATAAN & EJAAN

Tema: Bandar Perkataan Ceria.
Warna: Pink coral.

Objektif:
Mengeja, mengenal dan membina perkataan mudah.

Tahap 1:
- Perkataan mudah dua suku kata.
- Padankan gambar dan perkataan.

Tahap 2:
- Susun huruf menjadi perkataan.
- Pilih ejaan yang betul.
- Lengkapkan huruf hilang.

Tahap 3:
- Bina perkataan lebih panjang.
- Bezakan perkataan hampir sama.
- Kenal kosa kata dalam situasi harian.

Contoh:
Gambar bola.
Susun: B, O, L, A.
Jawapan: BOLA.

Gunakan perkataan BM yang sah, biasa dan sesuai untuk murid sekolah rendah Malaysia.

### KATEGORI 4 — TAMAN AYAT & CERITA

Tema: Taman Cerita Ajaib.
Warna: Purple lavender.

Objektif:
Memahami pembinaan ayat dan kefahaman bacaan ringkas.

Tahap 1:
- Padankan ayat mudah dengan gambar.
- Kenal subjek dan tindakan.

Tahap 2:
- Susun perkataan menjadi ayat yang betul.
- Lengkapkan perkataan yang hilang dalam ayat.

Tahap 3:
- Baca cerita pendek 1–3 ayat.
- Jawab soalan kefahaman mudah.
- Kenal siapa, apa, di mana dan tindakan.

Contoh:
Susun perkataan:
"nasi" / "Ibu" / "memasak"
Jawapan: "Ibu memasak nasi."

Contoh kefahaman:
"Ali minum air."
Soalan: "Siapakah yang minum air?"
Jawapan: Ali.

### KATEGORI 5 — PLANET NOMBOR & KUANTITI

Tema: Planet Nombor.
Warna: Kuning.

Objektif:
Menguasai nombor, nilai dan kuantiti.

Tahap 1:
- Kenal nombor 0–10.
- Bilang objek.
- Padankan nombor dan bilangan.

Tahap 2:
- Nombor 0–20.
- Susun nombor menaik dan menurun.
- Bandingkan lebih besar, lebih kecil dan sama nilai.

Tahap 3:
- Nombor sehingga 100 mengikut kesediaan murid.
- Nilai tempat puluh dan sa.
- Pola nombor mudah.

Contoh:
Paparkan lima bintang.
Soalan: "Ada berapa bintang?"
Jawapan: 5.

### KATEGORI 6 — MISI TAMBAH, TOLAK & MASALAH HARIAN

Tema: Kota Matematik Ajaib.
Warna: Orange.

Objektif:
Menguasai tambah, tolak dan penyelesaian masalah mudah.

Tahap 1:
- Tambah dan tolak menggunakan objek visual.
- Operasi mudah dalam lingkungan 10.

Tahap 2:
- Tambah dan tolak dalam lingkungan 20.
- Soalan berdasarkan gambar.
- Mencari nombor yang hilang.

Tahap 3:
- Operasi bersesuaian sehingga 100.
- Masalah harian satu langkah.
- Pengenalan wang ringgit Malaysia dalam masalah mudah.

Contoh:
"Ali ada 4 biji epal. Ibu beri 2 biji lagi. Berapa biji epal Ali ada sekarang?"
Jawapan: 6.

Soalan mesti mengajar konsep, bukan sekadar menghafal jawapan.

---

## 6. LIMA MEKANIK GAME WAJIB BERFUNGSI

JANGAN jadikan semua soalan sebagai kuiz objektif.

Setiap kategori perlu menggunakan campuran lima mekanik mengikut kesesuaian kemahiran.

### MEKANIK 1 — OBJEKTIF / MULTIPLE CHOICE

- Paparkan soalan dengan visual.
- Paparkan 3 atau 4 pilihan jawapan.
- Butang besar.
- Boleh tekan menggunakan mouse atau sentuhan.
- Highlight jawapan yang dipilih.
- Jawapan disemak secara automatik.
- Randomize kedudukan jawapan.
- Pastikan hanya satu jawapan sah.

Contoh:
"2 + 3 = ?"
Pilihan: 4, 5, 6.
Jawapan: 5.

### MEKANIK 2 — DRAG & DROP

WAJIB DRAG & DROP SEBENAR.

- Kad boleh dipegang dan diseret.
- Zon drop diserlahkan.
- Kad bergerak dengan animasi.
- Jika salah, kad kembali ke lokasi asal.
- Jika betul, kad snap ke slot.
- Paparkan confetti dan feedback selepas jawapan lengkap.

Contoh:
"ba" + "ju" = "baju".

Gunakan pointer/touch-compatible interactions.
Jangan hanya bergantung pada native HTML desktop drag event.
Sediakan alternatif tap-to-select kemudian tap-to-place untuk peranti yang sukar menggunakan drag.

### MEKANIK 3 — SUSUNAN / ARRANGEMENT

- Paparkan kad perkataan, huruf, nombor atau langkah dalam susunan rawak.
- Anak susun kad ke dalam slot.
- Boleh tukar posisi kad.
- Boleh reset.
- Semak susunan yang lengkap.

Contoh:
"Ibu" + "membaca" + "buku".

Beri feedback selepas anak menekan butang SEMAK atau selepas susunan lengkap jika jelas.

### MEKANIK 4 — PADANAN / MATCHING

- Paparkan kad sebelah kiri dan kanan.
- Anak padankan pasangan betul.
- Boleh gunakan garis bersambung atau mekanik memilih pasangan.
- Garis padanan berwarna dan beranimasi.
- Jika betul, pasangan terkunci dan berkilau.
- Jika salah, animasi cuba lagi dan benarkan pilihan semula.

Contoh:
Gambar tiga epal dipadankan kepada nombor 3.

Sokong sekurang-kurangnya 3 pasangan dalam satu aktiviti.

Pastikan semua pasangan mesti lengkap untuk menamatkan soalan tersebut.

### MEKANIK 5 — FILL IN THE BLANK

- Paparkan ruang jawapan kosong yang jelas.
- Anak melengkapkan huruf, suku kata, perkataan atau nombor.
- Gunakan pilihan kad huruf / suku kata / nombor atau keypad mesra kanak-kanak.
- Sokong input keyboard apabila sesuai.
- Besarkan font jawapan.

Contoh:
"bo__" dengan pilihan "la", "ku", "mi".
Jawapan: "la" menghasilkan "bola".

Contoh Matematik:
"5 + 2 = __"
Jawapan: 7.

Semak berdasarkan jawapan sebenar yang ditetapkan dalam question bank, bukan hardcoded untuk satu contoh sahaja.

---

## 7. GAME ENGINE DAN QUESTION BANK

Bina sistem data berstruktur yang reusable.

Setiap soalan mesti mempunyai sekurang-kurangnya:
- id
- categoryId
- level
- skillId
- type
- language
- prompt
- visual data
- options atau movable items
- correct answer
- validation rules
- explanation
- hint

Sediakan bank soalan asli untuk semua kategori.

SASARAN KANDUNGAN:
- Minimum 24 soalan atau variasi yang telah disahkan bagi setiap kategori.
- Minimum 8 soalan untuk setiap tahap kategori.
- Semua lima mekanik mesti digunakan apabila sesuai.
- Minimum keseluruhan 144 variasi valid.
- Gunakan data dan generator berstruktur untuk mengelakkan kod terlalu besar.

Jika saiz Canva Code terhad, utamakan 8 soalan yang lengkap dan benar-benar playable untuk setiap kategori dahulu. Pastikan struktur kandungan boleh diperluas tanpa menulis semula engine.

Jangan gunakan soalan placeholder seperti "Question 1", "Option A" atau "Coming Soon".

RANDOMIZATION:
- Elak mengulangi soalan yang sama dalam satu sesi.
- Campurkan mekanik soalan.
- Randomize pilihan jawapan.
- Elak pengulangan terlalu kerap antara sesi.
- Jangan hasilkan soalan yang tiada jawapan sah.
- Jangan menghasilkan dua pilihan jawapan betul bagi soalan objektif.

GAME SESSION:
Setiap sesi mesti mengandungi TEPAT 8 SOALAN.

Aliran:
Pilih kategori → pilih tahap → pilih mod masa → mula → jawab 8 soalan → kad markah → sticker → kembali dashboard / main lagi.

Pastikan semua skrin terhubung dengan state aplikasi yang konsisten.

---

## 8. MOD MASA

Sediakan pilihan sebelum bermain:

1. 30 SAAT
2. 1 MINIT
3. TANPA HAD

Masa ditetapkan PER SOALAN.

Jika 30 saat:
- Countdown 30 hingga 0.

Jika 1 minit:
- Countdown 60 hingga 0.

Jika tanpa had:
- Tiada countdown yang menekan kanak-kanak.

Paparkan timer sebagai progress ring yang menarik.

Jika masa tamat:
- Paparkan "Masa Tamat! Jom Cuba Soalan Seterusnya!"
- Tunjukkan jawapan betul dan penjelasan ringkas.
- Catat soalan sebagai tidak diselesaikan secara berdikari.
- Bergerak ke soalan seterusnya.
- Tidak menyebabkan game tergantung.

Timer mesti:
- Reset setiap soalan.
- Tidak mempunyai interval berganda.
- Berhenti ketika animasi kemenangan, skrin bantuan atau hasil dipaparkan.
- Dibersihkan dengan betul apabila game dihentikan.
- Tidak dikira ketika skrin permainan tiada fokus jika sesi dipause.

---

## 9. FEEDBACK JAWAPAN BETUL — SUPER CELEBRATION

INI SALAH SATU CIRI PALING PENTING.

Setiap kali anak berjaya menjawab, hasilkan celebratory feedback yang sangat menyeronokkan.

ANIMASI WAJIB:
- Fireworks berwarna-warni.
- Confetti particles yang meriah.
- Reben panjang berterbangan.
- Bintang bercahaya.
- Sparkle trails.
- Kiko melompat kegembiraan.
- Teks besar animasi.
- Bounce dan scale animation.
- Bunyi kemenangan yang lembut tetapi ceria jika sound diaktifkan.

Teks rawak:
- "HEBATNYA!"
- "TAHNIAH!"
- "WOW! PANDAINYA!"
- "BAGUS SEKALI!"
- "ANDA JUARA!"
- "TERBAIK!"

Gaya visual:
- Multi-layer celebration.
- Particle burst dari kiri dan kanan.
- Confetti jatuh dari atas.
- Ribbon berputar.
- Sparkle di sekitar jawapan.
- Kesan seperti mendapat hadiah dalam kids adventure game.

Animasi boleh menjadi sangat meriah tetapi jangan sampai menyekat interaksi atau menyebabkan lag.

Cadangan:
- 3–5 fireworks bursts.
- 80–140 particles untuk peranti yang mampu.
- Ribbon SVG.
- Animasi selama sekitar 1–2 saat.
- Kurangkan particles secara automatik pada peranti lemah.

Benarkan pengguna memilih Reduced Motion dalam Settings.

---

## 10. FEEDBACK JAWAPAN SALAH

JANGAN gunakan mesej menakutkan atau suara negatif.

Jika salah:
- Kad bergetar lembut.
- Muncul teks animasi "CUBA LAGI!"
- Kiko memberikan galakan.
- Jawapan salah ditandakan secara lembut.
- Sediakan peluang mencuba semula.

Contoh mesej:
- "Tak apa, cuba sekali lagi!"
- "Hampir betul! Jom cuba lagi."
- "Kiko tahu kamu boleh!"
- "Cuba tengok petunjuk ini."

Selepas dua cubaan salah:
- Berikan bantuan atau hint yang lebih jelas.
- Benarkan satu cubaan berpandu.
- Jika masih tidak berjaya, tunjuk jawapan dan penerangan mudah.
- Kemudian teruskan ke soalan seterusnya.

Jangan paksa kanak-kanak tersangkut pada soalan yang sama tanpa cara untuk meneruskan.

Rekodkan jumlah cubaan untuk laporan ibu bapa.

---

## 11. KAD MARKAH SELEPAS 8 SOALAN

SELEPAS TEPAT 8 SOALAN, AUTOMATIK PAPARKAN FULL CELEBRATION SCREEN.

Reka kad markah seperti hadiah premium untuk kanak-kanak.

Wajib paparkan:
- Avatar anak.
- Nama anak.
- Nama kategori.
- Tahap.
- Bilangan soalan selesai: 8.
- Jumlah jawapan betul tanpa bantuan.
- Jumlah jawapan dibantu.
- Jumlah tidak selesai atau masa tamat.
- 1 hingga 3 bintang.
- Sticker yang diperoleh.
- Mesej positif.

LOGIK BINTANG:
- 7–8 betul tanpa bantuan: 3 bintang.
- 5–6 betul tanpa bantuan: 2 bintang.
- 0–4 betul tanpa bantuan: 1 bintang.

Markah mesti berdasarkan jawapan sebenar.

Jika jawapan diberikan oleh sistem selepas gagal, jangan kira sebagai betul tanpa bantuan.

Contoh mesej:
"TAHNIAH, AINA!"
"Kamu berjaya menyelesaikan 8 misi!"
"Kiko bangga dengan usaha kamu!"

ANIMASI KAD MARKAH:
- Kiko masuk dengan animasi melompat.
- Kad muncul dengan animasi zoom dan bounce.
- Bintang pertama, kedua, ketiga muncul satu demi satu.
- Fireworks meletup di belakang kad.
- Reben berpusing dari dua sisi.
- Confetti jatuh dengan sangat meriah.
- Sticker baru muncul dengan animasi hadiah dibuka.
- Sparkle, glow dan floating stars.

Jadikan visual kemenangan lebih meriah daripada feedback jawapan biasa.

Benarkan animasi dimainkan semula menggunakan butang kecil "RAIKAN LAGI".

---

## 12. SISTEM STICKER COLLECTIBLES

Cipta sistem ganjaran sticker yang benar-benar menyeronokkan untuk anak.

Nama sistem: ALBUM STICKER KIKO.

Wajib:
- Sticker berbentuk SVG/vector original.
- Efek glossy, soft 3D dan bayang.
- Border sticker putih.
- Animasi sticker keluar dari kotak hadiah.
- Sticker boleh dilihat dalam album.
- Koleksi dikunci/dibuka mengikut progress.
- Sticker diperoleh selepas selesai satu sesi 8 soalan.
- Rekod sticker tidak hilang selepas refresh jika storage tersedia.
- Sticker tidak berulang sehingga koleksi yang layak telah diperoleh.

Cadangan 24 sticker:
1. Kiko Hebat
2. Bintang Emas
3. Pelangi Comel
4. Roket Mini
5. Dino Ceria
6. Panda Comel
7. Robot Kecil
8. Awan Pelangi
9. Bintang Ajaib
10. Unicorn Mini
11. Planet Senyum
12. Kapal Angkasa
13. Kucing Super
14. Naga Comel
15. Beruang Bijak
16. Si Arnab Laju
17. Mahkota Juara
18. Pensel Ajaib
19. Buku Bersinar
20. Trofi Emas
21. Bunga Ceria
22. Bulan Senyum
23. Burung Pelangi
24. Kancil Super

Reka semua sticker dengan gaya yang konsisten.

STICKER REVEAL:
- Paparkan mystery gift box.
- Anak tekan kotak.
- Kotak terbuka.
- Glow dan confetti keluar.
- Sticker membesar dan berpusing.
- Mesej "STICKER BARU DAPAT!"
- Butang "SIMPAN DALAM ALBUM".

Sticker mesti benar-benar dimasukkan ke dalam koleksi apabila butang ditekan. Jika anak keluar awal, ganjaran yang telah diperoleh masih disimpan.

Jangan gunakan random reward berbayar, loot box pembelian atau unsur perjudian.

---

## 13. ADAPTIVE LEARNING — LATIHAN IKUT KELEMAHAN ANAK

Ini ialah USP utama produk.

Jangan hanya memberi soalan rawak.

Setiap soalan mesti mempunyai skillId supaya prestasi boleh diukur mengikut kemahiran.

CONTOH SKILL:
- Pengecaman huruf
- Bunyi awal
- Suku kata KV
- Gabungan suku kata
- Ejaan
- Susunan ayat
- Kefahaman bacaan
- Nombor dan kuantiti
- Tambah
- Tolak
- Masalah berayat

LOGIK ADAPTIF:
- Jika anak banyak betul tanpa bantuan, cadangkan kemahiran tahap berikut.
- Jika banyak salah, ulang kemahiran yang sama dengan soalan berbeza.
- Jika anak gagal pada kemahiran tertentu, tambahkan soalan latihan kemahiran itu dalam sesi berikut.
- Jika anak memerlukan hint berulang kali, tandakan kemahiran sebagai perlu latihan.
- Jangan meningkatkan kesukaran hanya kerana umur anak lebih tinggi.

Setiap kemahiran boleh mempunyai status:
- Baru belajar
- Sedang berlatih
- Semakin mahir
- Telah menguasai

Gunakan peraturan yang jelas berdasarkan data jawapan, bukan AI API.

Paparkan sebab cadangan latihan secara mudah kepada ibu bapa.

Jangan melabel anak dengan diagnosis atau masalah perubatan.

---

## 14. LAPORAN IBU BAPA

Cipta dashboard laporan ringkas yang mudah difahami ibu bapa Malaysia.

Paparkan:
- Nama anak.
- Umur.
- Jumlah sesi dimainkan.
- Jumlah misi selesai.
- Jumlah bintang.
- Jumlah sticker.
- Kemajuan setiap kategori.
- Kemahiran yang sudah dikuasai.
- Kemahiran yang masih perlu latihan.
- Kekerapan penggunaan hint.
- Prestasi menjawab tanpa bantuan.
- Cadangan kategori untuk sesi berikutnya.

Contoh:
"AINA MEMERLUKAN LATIHAN TAMBAHAN"

Kemahiran: Suku kata KVKV.

Cadangan:
"Main semula Pulau Suku Kata — Tahap 2."

Tambahkan butang "MULA LATIHAN CADANGAN".

Jangan paparkan angka rekaan. Semua laporan berdasarkan jawapan sebenar yang disimpan.

Paparkan mesej jelas jika belum ada data.

Parent Dashboard perlu mempunyai adult gate ringkas untuk mengelakkan anak mengubah tetapan penting secara tidak sengaja.

---

## 15. LANGUAGE SETTINGS — BM / ENGLISH

Bahasa lalai: Bahasa Melayu Malaysia.

Dalam Settings:
- Pilihan Bahasa Melayu / English.
- Ikon globe atau language.
- Pilihan kekal selepas refresh jika storage tersedia.

TOGGLE BAHASA MESTI BERFUNGSI.

Apabila BM dipilih:
- Semua menu dalam BM.
- Arahan BM.
- Feedback BM.
- Kad markah BM.
- Laporan ibu bapa BM.
- Kandungan literasi BM.
- Audio BM jika tersedia.

Apabila English dipilih:
- Semua menu dalam English.
- Instructions in English.
- Correct/wrong feedback in English.
- Result card in English.
- Parent report in English.
- English literacy questions from a dedicated English question bank.
- Appropriate English audio if available.

PENTING:
Jangan menterjemah suku kata Bahasa Melayu secara literal kepada English.

Untuk English:
- Gunakan letter sounds, basic phonics, simple word building, spelling, sentence order dan comprehension yang sesuai bagi murid awal.
- Sediakan word bank English berasingan.
- Soalan Matematik boleh menggunakan nombor yang sama tetapi arahan diterjemah dengan betul.

Perubahan bahasa tidak memadamkan kemajuan lama.

Jika bahasa diubah ketika sesi sedang dimainkan, gunakan bahasa baru bermula dari soalan seterusnya atau minta anak mulakan semula sesi dengan mesej mesra.

---

## 16. AUDIO DAN MESRA KANAK-KANAK

Sediakan:
- Butang dengar soalan.
- Audio feedback betul.
- Audio feedback salah yang lembut.
- Audio hadiah sticker.
- Audio celebration.

Jika browser menyokong Speech Synthesis, gunakan suara BM Malaysia dan English yang sesuai.

Audio hanya bermula selepas tindakan pengguna supaya tidak melanggar polisi autoplay.

Jika suara BM tidak tersedia:
- Jangan pura-pura audio sudah berfungsi.
- Gunakan teks dan visual sebagai fallback.
- Sediakan ikon audio unavailable atau matikan fungsi itu dengan kemas.

Pastikan semua game boleh digunakan tanpa audio.

---

## 17. SISTEM SIMPANAN PROGRESS

Gunakan state management yang konsisten.

Simpan, jika persekitaran menyokong:
- Profil.
- Bahasa.
- Settings.
- Progress kategori.
- Progress kemahiran.
- Sejarah sesi.
- Bintang.
- Sticker collection.
- Pilihan timer.

Gunakan localStorage apabila tersedia dan dibenarkan.

Tangani storage unavailable dengan fallback dalam memori agar permainan masih boleh dimainkan.

Jangan mendakwa progress disegerakkan antara peranti tanpa backend sebenar.

Gunakan struktur data dengan schema version supaya mudah dikemas kini.

Elakkan penyimpanan data peribadi yang tidak perlu.

---

## 18. MOBILE-FIRST UI/UX

Game WAJIB sesuai untuk:
- Desktop.
- Tablet.
- iPad.
- iPhone.
- Android.

Syarat:
- Portrait mobile friendly.
- Landscape tablet friendly.
- Touch target besar, sekurang-kurangnya sekitar 44px.
- Teks senang dibaca.
- Tiada horizontal overflow.
- Kad jawapan tidak terpotong.
- Drag & drop boleh digunakan pada touch screen.
- Padanan tidak bergantung pada hover.
- Kanak-kanak boleh bermain tanpa perlu menaip panjang.
- Navigasi Home dan Back jelas.
- Elakkan popup yang menutupi seluruh soalan secara tidak sengaja.
- Beri perhatian kepada safe area pada telefon.

Latar belakang boleh mempunyai animasi lembut tetapi jangan mengganggu fokus.

---

## 19. TEKNIKAL IMPLEMENTASI CANVA CODE

Bina sebagai satu responsive interactive application.

Cadangan:
- HTML, CSS dan JavaScript atau React jika disokong oleh Canva Code.
- Reusable components.
- Data-driven question engine.
- Component khusus bagi setiap mekanik.
- Centralized game session state.
- Accurate answer validation.
- Lightweight SVG illustrations.
- CSS animations.
- Canvas / DOM confetti yang dioptimumkan.
- No backend required.
- No external paid API.
- No dependency kepada sumber gambar remote yang tidak stabil.

COMPONENT ARCHITECTURE:
- App
- WelcomeScreen
- ProfileSetup
- WorldMap
- CategoryScreen
- LevelSelector
- TimerSelector
- GameEngine
- MultipleChoice
- DragDropGame
- ArrangementGame
- MatchingGame
- FillBlankGame
- AnswerFeedback
- CelebrationOverlay
- ResultCard
- StickerReveal
- StickerAlbum
- ParentReport
- Settings
- ProgressStorage

Semua component mesti berinteraksi melalui state yang betul.

PERFORMANCE:
- Gunakan requestAnimationFrame jika perlu untuk animasi.
- Hentikan animasi yang tidak aktif.
- Bersihkan timers dan listeners.
- Kurangkan effects pada peranti lemah.
- Elakkan heavy external libraries.
- Elakkan infinite animation loops.
- Gunakan transform dan opacity untuk animasi utama.
- Sokong prefers-reduced-motion.

Canva Code mungkin mempunyai had saiz. Jika perlu, gunakan komponen dan data generator yang ringkas supaya game masih boleh dipublish.

Jangan buang fungsi utama hanya untuk menjadikan UI cantik.

---

## 20. FUNGSIONAL REQUIREMENTS — MESTI LULUS

Semak semua perkara berikut selepas membina:

[ ] Game boleh dibuka dan dimainkan.
[ ] Profil boleh dibuat.
[ ] Dashboard memaparkan semua 6 kategori.
[ ] Setiap kategori boleh dibuka.
[ ] Semua 3 tahap boleh dipilih.
[ ] Mode 30 saat berfungsi.
[ ] Mode 1 minit berfungsi.
[ ] Mode tanpa had berfungsi.
[ ] Objektif berfungsi.
[ ] Drag & Drop berfungsi pada mouse dan touch.
[ ] Susunan berfungsi.
[ ] Padanan berfungsi.
[ ] Fill in the Blank berfungsi.
[ ] Jawapan betul dikesan dengan tepat.
[ ] Jawapan salah boleh dicuba semula.
[ ] Hint berfungsi.
[ ] Feedback betul mempunyai confetti, reben dan fireworks.
[ ] Soalan tidak berulang dalam sesi yang sama.
[ ] Progress soalan bergerak dari 1/8 hingga 8/8.
[ ] Selepas 8 soalan kad markah muncul.
[ ] Pengiraan markah tepat.
[ ] Bintang dikira berdasarkan prestasi sebenar.
[ ] Sticker baru boleh diperoleh.
[ ] Sticker disimpan dalam album.
[ ] Progress disimpan jika storage tersedia.
[ ] Laporan ibu bapa berdasarkan data sebenar.
[ ] Cadangan kemahiran lemah berfungsi.
[ ] Toggle BM ke English berfungsi.
[ ] Content English menggunakan bank pembelajaran yang sesuai.
[ ] Navigation, Home, Back dan Restart berfungsi.
[ ] Tiada dead button atau skrin kosong.
[ ] Game berfungsi pada mobile, tablet dan desktop.
[ ] Tiada soalan yang mustahil dijawab.
[ ] Tiada visual atau font yang rosak.

UJIAN TAMBAHAN:
- Main satu sesi lengkap bagi setiap kategori.
- Uji satu sesi tanpa had masa.
- Uji apabila masa tamat.
- Uji semua jenis input.
- Uji apabila jawapan pertama salah.
- Uji jika semua jawapan betul.
- Uji apabila anak perlu bantuan.
- Uji selepas page refresh.
- Uji tukar bahasa.
- Uji dua sesi berturut-turut.
- Uji pengulangan dan unlock sticker.
- Uji responsive pada skrin kecil.

---

## 21. ARAHAN FINAL

HASIL AKHIR YANG SAYA MAHUKAN:

Sebuah educational adventure game interaktif premium dengan nama MISI PEMULIHAN 3M.

Ia mesti kelihatan seperti game kanak-kanak sebenar, bukan laman kuiz biasa.

Rasa permainan:
- Magical.
- Colorful.
- Cute.
- Rewarding.
- Interactive.
- Smooth.
- High quality.
- Exciting for children.

Anak mesti rasa seronok apabila menyelesaikan misi, mendapat bintang dan mengumpul sticker.

WAJIB:
- Bina aplikasi sebenar terus di Canva Code.
- Semua 6 kategori playable.
- Lima jenis mekanik berfungsi.
- Tepat 8 soalan setiap sesi.
- Fireworks, reben dan confetti meriah apabila betul dan selepas kad markah.
- Sticker collection berfungsi.
- Timer 30s / 60s / unlimited.
- Pembelajaran adaptif.
- Laporan ibu bapa.
- Default Bahasa Melayu dengan toggle English.
- Rujukan kandungan pendidikan berasaskan KPM.
- Original kids-game UI.

Jangan hanya terangkan cara membuat game.
Jangan paparkan proposal, wireframe atau mockup sebagai hasil akhir.
Jangan cipta butang yang tidak berfungsi.
Jangan biarkan mana-mana kategori sebagai placeholder.

TERUS GENERATE INTERACTIVE GAME YANG BOLEH DIMAINKAN SEKARANG.
