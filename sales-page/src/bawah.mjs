// Sections below the pricing table (brief 2B): objection, dream result, developer note, class proof,
// closing CTA and FAQ. Copy is Bahasa Melayu Malaysia; RM values here must match the pricing items (build checks).
import { T, use, esc } from './art.mjs';
import { phone } from './devices.mjs';

const IMG = 'assets/img/';
const e = (s) => String(s).replace(/&/g, '&amp;');
const ok = `<svg class="m3-tick" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#m3-check"/></svg>`;

export const COSTS = [
  ['Kelas tuisyen 3M', 'RM80 – RM150 sebulan', 'Setahun boleh cecah RM960 ke atas'],
  ['Buku latihan + kad imbas', 'RM30 – RM60 satu set', 'Habis diconteng, beli lagi'],
  ['App belajar berlanggan', 'RM20 – RM40 sebulan', 'Bayar setiap bulan selagi guna'],
];

const BUTS = [
  ['“Anak saya cepat bosan.”', 'Setiap misi cuma 8 soalan, dengan bintang dan sticker sebagai ganjaran. Anak habis satu misi sebelum sempat bosan, dan nak sambung misi seterusnya.'],
  ['“Takut anak lekat dengan skrin.”', 'Satu sesi pendek sahaja, dengan pilihan masa 30 saat, 1 minit atau tanpa had. Ibu ayah pegang kawalan, dan laporan tunjuk berapa sesi anak dah main.'],
  ['“Saya tak ada masa nak ajar.”', 'Game beri arahan dan petunjuk sendiri. Ibu ayah cuma buka laporan untuk tengok apa anak dah kuasai.'],
  ['“Anak dah belajar di sekolah.”', 'Sebab itulah ia berkesan. Kemahiran yang sama diulang di rumah dalam bentuk permainan, dan ulangan itulah yang buat anak benar-benar kuasai 3M.'],
];
const BUT_USAHAWAN = ['“Saya nak jual, tapi tak pandai run ads.”', 'Dalam pakej USAHAWAN, kedai, sales page dan produk dah siap untuk anda. Modul Run Ads Reseller tunjuk cara set iklan FB & IG langkah demi langkah, terus ke kedai anda.'];

export function objection() {
  return `<section class="m3-sec m3-obj" data-sec="objection" aria-labelledby="m3-h-obj">
<div class="m3-wrap">
<div class="m3-head m3-rv"><span class="m3-eyebrow">KENAPA BERBALOI</span><h2 id="m3-h-obj" class="m3-h2">Mahal Ke RM49? Jom Banding Dengan Kos Di Luar Sana</h2>
<p class="m3-sub">Ibu ayah yang serius nak bantu anak kuasai 3M biasanya habiskan jauh lebih banyak dari ini.</p></div>
<div class="m3-cost m3-rv">
${COSTS.map(([a, b, c]) => `<div class="m3-cost-row"><span class="m3-cost-k">${e(a)}</span><b class="m3-cost-v">${e(b)}</b><span class="m3-cost-n">${e(c)}</span></div>`).join('')}
<div class="m3-cost-row m3-cost-us"><span class="m3-cost-k">Misi Pemulihan 3M</span><b class="m3-cost-v">RM49 / RM89 sekali bayar</b><span class="m3-cost-n">Main berulang kali, 6 dunia, laporan ibu bapa (PRO)</span></div>
</div>
<p class="m3-fine m3-center">Harga di luar ialah anggaran pasaran dan berbeza ikut tempat.</p>
<div class="m3-value"><span>Nilai rujukan pakej PRO</span><s>RM289</s><span>Anda bayar</span><b>RM89</b></div>
<div class="m3-buts">${BUTS.map(([q, a]) => `<div class="m3-but m3-rv"><p class="m3-but-q">${e(q)}</p><p>${e(a)}</p></div>`).join('')}
<div class="m3-but m3-but-us m3-rv"><span class="m3-but-k">PAKEJ USAHAWAN</span><p class="m3-but-q">${e(BUT_USAHAWAN[0])}</p><p>${e(BUT_USAHAWAN[1])}</p></div></div>
</div>
</section>`;
}

/* ---------- dream result: drawn from the game's real Laporan Ibu Bapa screen (348×736 phone canvas) ---------- */
const CAT = [
  ['Huruf & Bunyi', 'Coral', 92], ['Suku Kata', 'Sky', 78], ['Perkataan & Ejaan', 'Sun', 54],
  ['Ayat & Cerita', 'Mint', 31], ['Nombor & Kuantiti', 'Purple', 84], ['Tambah & Tolak', 'Peach', 46],
];
const kpi = (x, n, l) => `<rect x="${x}" y="150" width="72" height="66" rx="14" fill="#fff" filter="url(#m3-fDrop)"/>${T(x + 36, 183, n, { s: 24, f: '#41258E' })}${T(x + 36, 204, l, { s: 10.5, w: 700, f: '#6B6B8A' })}`;
const reportScreen = () => `
<rect width="348" height="736" fill="#F6F2FF"/>
<path d="M0 0 H348 V128 Q174 150 0 128Z" fill="url(#m3-lPurple)"/>
<rect x="0" y="0" width="348" height="34" fill="#fff" opacity=".12"/>
<circle cx="50" cy="80" r="26" fill="#fff"/>${use('kiko', 28, 58, 44, 44)}
${T(88, 74, 'Laporan Ibu Bapa', { s: 19, f: '#fff', a: 'start' })}
${T(88, 96, 'Aina · Umur 7 tahun', { s: 13, w: 700, f: '#fff', a: 'start', op: '.9' })}
${kpi(16, '12', 'Sesi')}${kpi(96, '9', 'Misi selesai')}${kpi(176, '23', 'Bintang')}${kpi(256, '7', 'Sticker')}
<rect x="16" y="232" width="316" height="86" rx="16" fill="#FFF4CC"/>
${T(30, 256, 'AINA PERLU SEDIKIT LAGI LATIHAN', { s: 11.5, f: '#8F5300', a: 'start', ls: 0.5 })}
${T(30, 278, 'Kemahiran: Ejaan perkataan KVKV', { s: 13, w: 700, f: '#202039', a: 'start' })}
<rect x="30" y="288" width="140" height="22" rx="11" fill="url(#m3-lSun)"/>${T(100, 303, 'MULA LATIHAN', { s: 11, f: '#41258E' })}
<rect x="16" y="330" width="316" height="226" rx="16" fill="#fff" filter="url(#m3-fDrop)"/>
${T(30, 356, 'Kemajuan setiap kategori', { s: 13.5, f: '#41258E', a: 'start' })}
${CAT.map(([n, fam, v], i) => {
  const y = 378 + i * 29;
  return `${T(30, y + 4, n, { s: 11.5, w: 700, f: '#3A3A5A', a: 'start' })}${T(318, y + 4, v + '%', { s: 11.5, f: '#41258E', a: 'end' })}<rect x="30" y="${y + 10}" width="288" height="8" rx="4" fill="#EEE8FB"/><rect x="30" y="${y + 10}" width="${(288 * v) / 100}" height="8" rx="4" fill="url(#m3-l${fam})"/>`;
}).join('')}
<rect x="16" y="568" width="152" height="124" rx="16" fill="#fff" filter="url(#m3-fDrop)"/>
${T(28, 590, 'Kemahiran dikuasai', { s: 11.5, f: '#1E8460', a: 'start' })}
${['Kenal huruf vokal', 'Bunyi suku kata', 'Kira objek 1–10'].map((s, i) => `<circle cx="34" cy="${610 + i * 24}" r="5" fill="#76DDB5"/>${T(46, 614 + i * 24, s, { s: 11, w: 700, f: '#3A3A5A', a: 'start' })}`).join('')}
<rect x="180" y="568" width="152" height="124" rx="16" fill="#fff" filter="url(#m3-fDrop)"/>
${T(192, 590, 'Masih perlu latihan', { s: 11.5, f: '#B53A55', a: 'start' })}
${['Ejaan KVKV', 'Ayat pendek', 'Tolak dalam 10'].map((s, i) => `<circle cx="198" cy="${610 + i * 24}" r="5" fill="#FF8FA3"/>${T(210, 614 + i * 24, s, { s: 11, w: 700, f: '#3A3A5A', a: 'start' })}`).join('')}
${T(174, 716, 'Contoh paparan laporan', { s: 11, w: 600, f: '#6B6B8A' })}`;

// Each value is the PRO pricing item with the same title; build.mjs refuses a mismatch.
export const DREAM = [['Laporan Kemajuan Ibu Bapa', 39], ['Analisis Kemahiran Yang Perlu Latihan', 29], ['Sistem Cadangan Latihan Mengikut Prestasi', 39]];

export function impian() {
  return `<section class="m3-sec m3-dream" data-sec="impian" aria-labelledby="m3-h-dream">
<div class="m3-wrap">
<div class="m3-head m3-rv"><span class="m3-eyebrow">HASIL YANG IBU AYAH IMPIKAN</span><h2 id="m3-h-dream" class="m3-h2">Bayangkan… Anda Tahu Tepat Apa Anak Dah Kuasai, Dan Apa Yang Perlu Dilatih</h2>
<p class="m3-sub">Tiada lagi meneka. Laporan Ibu Bapa tunjuk kekuatan anak dan kemahiran yang perlu diulang, terus dari permainan anak sendiri.</p></div>
<div class="m3-dream-grid">
<div class="m3-dream-viz m3-rv">${phone(reportScreen(), { label: 'Telefon memaparkan Laporan Ibu Bapa: 12 sesi, 9 misi selesai, kemajuan 6 kategori, kemahiran dikuasai dan perlu latihan', cls: 'm3-dphone' })}
<div class="m3-strength"><p class="m3-strength-h">Kekuatan Aina</p>
<ul><li><b>Huruf &amp; Bunyi</b><em class="m3-tag m3-tag-ok">Kuasai</em></li><li><b>Nombor &amp; Kuantiti</b><em class="m3-tag m3-tag-ok">Mahir</em></li><li><b>Jawab tanpa bantuan</b><em class="m3-tag">78%</em></li></ul></div>
</div>
<div class="m3-dream-txt m3-rv">
<ul class="m3-benefits">
<li>${ok}<div><b>Nampak kekuatan anak dengan jelas.</b> Kategori mana anak dah kuasai, dan berapa kerap anak jawab tanpa bantuan.</div></li>
<li>${ok}<div><b>Fokus pada kemahiran yang lemah sahaja.</b> Game cadangkan latihan seterusnya ikut prestasi anak, bukan latihan yang sama untuk semua.</div></li>
<li>${ok}<div><b>Kemajuan boleh dilihat minggu demi minggu.</b> Bar kemajuan naik setiap kali anak main, jadi usaha anak nampak hasilnya.</div></li>
<li>${ok}<div><b>Boleh bincang dengan cikgu.</b> Tunjuk laporan pada cikgu kelas dan latih bahagian yang sama di rumah.</div></li>
</ul>
<div class="m3-vstack">${DREAM.map(([t, v]) => `<div data-v="${v}"><span>${e(t)}</span><em>Nilai RM${v}</em></div>`).join('')}
<div class="m3-vstack-sum"><span>Jumlah nilai</span><b>RM${DREAM.reduce((a, [, v]) => a + v, 0)}</b></div></div>
<p class="m3-dream-note">Inilah bahagian paling berbaloi untuk naikkan skor 3M anak. Termasuk dalam pakej <b>PRO</b> dan <b>USAHAWAN</b>.</p>
</div>
</div>
</div>
</section>`;
}

export function pembangun() {
  return `<section class="m3-sec m3-rev" data-sec="pembangun" aria-labelledby="m3-h-rev">
<div class="m3-wrap">
<div class="m3-head m3-rv"><span class="m3-eyebrow">KATA PEMBANGUN</span><h2 id="m3-h-rev" class="m3-h2">Kenapa Saya Bina Game Ini, Dan Kenapa Ia Selari Dengan Sekolah</h2></div>
<div class="m3-quote m3-rv">
<img class="m3-quote-img" src="${IMG}trainer-k29.webp" alt="Ubaidullah Jaafar, pembangun Misi Pemulihan 3M, mengajar di depan dewan" width="1080" height="1350" loading="lazy" decoding="async">
<div class="m3-quote-body">
<svg class="m3-qmark" viewBox="0 0 64 48" aria-hidden="true" focusable="false"><path d="M0 48V28C0 12 8 3 24 0l3 7C18 10 14 16 14 24h12v24Zm36 0V28c0-16 8-25 24-28l3 7c-9 3-13 9-13 17h12v24Z" fill="url(#m3-lPurple)"/></svg>
<p class="m3-quote-t">Saya bina Misi Pemulihan 3M sebab saya nak anak-anak belajar 3M dengan cara yang mereka memang suka: main. Setiap soalan saya susun berpandukan <b>DSKP KSSR (Semakan 2017)</b> dan <b>Modul Bimbingan (MOBIM) Tahun 1</b>, rujukan yang sama guru guna di sekolah.</p>
<p class="m3-quote-t">Jadi apa yang anak main di rumah selari dengan apa yang cikgu ajar di kelas. Bezanya, di rumah anak nak ulang lagi dan lagi, dan ibu ayah boleh nampak kemajuannya dalam laporan.</p>
<p class="m3-sign">~ Ubaidullah Jaafar</p>
<p class="m3-role">Pembangun Misi Pemulihan 3M · Pembina game edu Jawi Kids, Math Kids, Kids Baca dan Kids Tracing</p>
</div>
</div>
<p class="m3-fine m3-center">Misi Pemulihan 3M ialah produk pembelajaran bebas. Ia bukan produk rasmi atau diperakui oleh KPM.</p>
</div>
</section>`;
}

export const SHOTS = [
  ['kelas31-dewan', 'Dewan penuh, setiap peserta dengan laptop'],
  ['kelas31-mic', 'Rancang game ikut modul KPM di sekolah'],
  ['kelas31-juara', 'Misi Pemulihan 3M dimain di laptop kelas'],
  ['kelas31-ajar', 'Ajar langkah demi langkah, peserta ikut'],
  ['kelas31-aliran', 'Lakar aliran sales page: result, demo, CTA'],
  ['kelas31-skrin', 'Huraikan langkah di skrin sentuh besar'],
  ['kelas31-meja', 'Peserta bina terus di laptop sendiri'],
  ['kelas31-idea', 'Bentang idea game pendidikan di skrin dewan'],
];

export function bukti() {
  return `<section class="m3-sec m3-proof" data-sec="bukti" aria-labelledby="m3-h-proof">
<div class="m3-wrap">
<div class="m3-head m3-rv"><span class="m3-eyebrow">DARI KELAS KE GAME SEBENAR</span><h2 id="m3-h-proof" class="m3-h2">Game Ini Lahir Dari Kelas Game AI Saya. Ini Gambar Sebenar, Bukan Gambar Stok.</h2>
<p class="m3-sub">Misi Pemulihan 3M dibina langkah demi langkah dalam kelas Game AI saya. Gambar dan video ini dari kelas di Muar, 31 Oktober 2026. Langkah yang sama diajar dalam modul pakej USAHAWAN.</p></div>
<div class="m3-gal">
<figure class="m3-gal-vid m3-rv"><video src="${IMG}kelas-31okt.mp4" poster="${IMG}kelas-31okt-poster.webp" autoplay muted loop playsinline preload="metadata" width="540" height="960" aria-label="Video 15 saat dari kelas Game AI di Muar, 31 Oktober 2026"></video><figcaption><b>VIDEO KELAS</b> 15 saat: dewan penuh, kemudian Misi Pemulihan 3M dimain di laptop kelas.</figcaption></figure>
<div class="m3-gal-grid">${SHOTS.map(([f, c]) => `<figure class="m3-rv"><img src="${IMG}${f}.webp" alt="${esc(c)}" width="720" height="900" loading="lazy" decoding="async"><figcaption>${e(c)}</figcaption></figure>`).join('')}</div>
</div>
</div>
</section>`;
}

export function penutup(plans) {
  const blurb = { basic: '6 dunia, 5 aktiviti, kad markah', pro: 'Semua BASIC + laporan ibu bapa', usahawan: 'Semua PRO + kedai sendiri, 100% hasil' };
  return `<section class="m3-sec m3-end" data-sec="cta" aria-labelledby="m3-h-end">
<div class="m3-wrap">
<div class="m3-head m3-rv"><h2 id="m3-h-end" class="m3-h2">Mulakan Misi Anak Anda Hari Ini</h2>
<p class="m3-sub">Pilih pakej, dan anak boleh mula main misi pertama dalam beberapa minit.</p></div>
<div class="m3-mini">
${plans.map((p) => `<a class="m3-mini-b m3-mini-${p.key}" href="#m3-pakej" data-pkg="${p.key}"><span class="m3-mini-k">PAKEJ ${p.key.toUpperCase()}</span><span class="m3-mini-p"><small>RM</small>${p.price}</span><span class="m3-mini-d">${blurb[p.key]}</span><span class="m3-mini-go">PILIH PAKEJ ${p.key.toUpperCase()}</span></a>`).join('')}
</div>
<p class="m3-fine m3-center">Klik mana-mana pakej untuk terus ke jadual harga.</p>
</div>
</section>`;
}

export const FAQS = [
  ['Game ini sesuai untuk umur berapa?', 'Untuk anak berumur 5 hingga 9 tahun. Ada 3 tahap kesukaran, jadi anak boleh mula dari huruf dan bunyi, kemudian naik ke perkataan, ayat dan pengiraan.'],
  ['Perlu download atau install app?', 'Tidak perlu. Game dibuka terus dalam pelayar seperti Chrome atau Safari. Buka link, isi profil anak, dan terus main.'],
  ['Boleh main guna telefon, tablet atau komputer?', 'Boleh. Game ini direka untuk skrin sentuh telefon dan tablet, dan juga boleh dimain di komputer.'],
  ['Perlu internet untuk main?', 'Perlu internet untuk membuka game. Kemajuan anak disimpan dalam peranti itu sendiri.'],
  ['Kena bayar setiap bulan ke?', 'Tidak. Bayar sekali sahaja untuk pakej yang dipilih. Tiada langganan bulanan bagi tawaran ini.'],
  ['Apa beza pakej BASIC dan PRO?', 'BASIC beri 6 dunia pembelajaran dengan 5 jenis aktiviti, 3 tahap dan kad markah. PRO tambah Laporan Ibu Bapa, analisis kemahiran, cadangan latihan ikut prestasi, album sticker eksklusif dan pilihan Bahasa Melayu atau English.'],
  ['Boleh guna untuk lebih dari seorang anak?', 'Setiap peranti menyimpan satu profil anak. Untuk dua anak, gunakan dua peranti supaya laporan setiap anak tidak bercampur.'],
  ['Adakah isi kandungannya ikut sekolah?', 'Kandungan disusun berpandukan DSKP KSSR (Semakan 2017) dan Modul Bimbingan (MOBIM) Bahasa Melayu dan Matematik Tahun 1. Ia alat sokongan pembelajaran dan bukan produk rasmi KPM.'],
  ['Data anak saya disimpan di mana?', 'Kemajuan disimpan dalam peranti anda sahaja. Tiada akaun untuk didaftar dan tiada data anak dihantar ke server.'],
  ['Macam mana saya dapat akses selepas bayar?', 'Selepas bayaran berjaya, link akses dihantar ke emel anda. Simpan emel itu untuk buka game bila-bila masa.'],
  ['Pakej USAHAWAN: perlu tahu coding?', 'Tidak perlu. Modul tunjuk langkah demi langkah cara bina game dan sales page ini guna AI, dan cara pasang iklan FB & IG ke kedai anda.'],
  ['Macam mana saya dapat 100% hasil jualan?', 'Anda jual BASIC dan PRO dari kedai e-dagang anda sendiri, dengan payment gateway atas nama anda. Pembeli bayar terus ke akaun anda, jadi seluruh harga jualan milik anda, tolak caj gateway anda sendiri.'],
  ['Pakej USAHAWAN: apa jadi pada kedai selepas 1 tahun?', 'Kedai e-dagang aktif selama 1 tahun dari tarikh diaktifkan. Selepas itu anda boleh sambung langganan kedai pada harga semasa.'],
];

export function faq() {
  return `<section class="m3-sec m3-faq" data-sec="faq" aria-labelledby="m3-h-faq">
<div class="m3-wrap">
<div class="m3-head m3-rv"><h2 id="m3-h-faq" class="m3-h2">Soalan Yang Selalu Ibu Ayah Tanya</h2></div>
<div class="m3-faq-list">${FAQS.map(([q, a], i) => `<details${i === 0 ? ' open' : ''}><summary>${e(q)}</summary><p>${e(a)}</p></details>`).join('')}</div>
</div>
</section>`;
}
