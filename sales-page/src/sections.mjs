// Page markup, in the exact section order of the brief. Copy is Bahasa Melayu Malaysia.
import { sprite, IC, icon, PROB, CMP, shirtArt, applesArt } from './art.mjs';
import { phone, tablet, monitor } from './devices.mjs';
import { dashboard, resultCard, gameplay, FEAT } from './screens.mjs';

const ok = `<svg class="m3-tick" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#m3-check"/></svg>`;
const no = `<svg class="m3-tick" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#m3-cross"/></svg>`;

export const PLANS = [
  {
    key: 'basic',
    title: 'MISI PEMULIHAN 3M — BASIC',
    ribbon: 'PAKEJ JIMAT',
    sub: 'Untuk ibu ayah yang nak anak mula belajar 3M dengan cara lebih menyeronokkan.',
    ref: 149,
    price: 49,
    items: [
      ['6 Kategori Pembelajaran 3M', 59],
      ['5 Jenis Aktiviti Interaktif', 29],
      ['3 Tahap Kesukaran', 19],
      ['8 Soalan Setiap Misi', 19],
      ['Pilihan Masa 30s / 1m / Tanpa Had', 10],
      ['Kad Markah & Bintang', 13],
    ],
  },
  {
    key: 'pro',
    title: 'MISI PEMULIHAN 3M — PRO',
    ribbon: 'PALING BERBALOI',
    sub: 'Untuk ibu ayah yang nak latihan lebih tersusun, boleh pantau kemajuan dan kenal pasti kemahiran anak.',
    ref: 289,
    price: 89,
    items: [
      ['Semua yang ada dalam BASIC', 149],
      ['Sistem Cadangan Latihan Mengikut Prestasi', 39],
      ['Laporan Kemajuan Ibu Bapa', 39],
      ['Analisis Kemahiran Yang Perlu Latihan', 29],
      ['Album Sticker & Ganjaran Eksklusif', 19],
      ['Pilihan Bahasa Melayu / English', 14],
    ],
  },
];

export const FEATURES = [
  {
    k: 'huruf', dev: 'phone', tone: 'coral', value: 9, title: 'Dunia Huruf & Bunyi',
    desc: 'Anak belajar mengecam huruf dan bunyi asas melalui aktiviti visual yang mudah difahami. Sesuai sebagai langkah awal sebelum mula membaca perkataan.',
    label: 'Skrin game Dunia Huruf dan Bunyi: cari huruf B dengan pilihan A, B dan C',
  },
  {
    k: 'pulau', dev: 'tablet', tone: 'sky', value: 10, title: 'Pulau Suku Kata',
    desc: 'Latih anak mencantum suku kata menjadi perkataan secara interaktif. Aktiviti seret, susun dan padan membantu anak mengulang kemahiran dengan cara lebih menyeronokkan.',
    label: 'Skrin game Pulau Suku Kata: seret BA dan JU untuk bina perkataan BAJU',
  },
  {
    k: 'bandar', dev: 'phone', tone: 'sun', value: 10, title: 'Bandar Perkataan & Ejaan',
    desc: 'Anak belajar mengeja, mengenali perkataan dan mengisi huruf yang hilang. Setiap misi memberi peluang untuk anak cuba sendiri sebelum melihat jawapan.',
    label: 'Skrin game Bandar Perkataan dan Ejaan: lengkapkan B, kosong, L, A dengan huruf O',
  },
  {
    k: 'taman', dev: 'tablet', tone: 'mint', value: 10, title: 'Taman Ayat & Cerita',
    desc: 'Daripada menyusun perkataan kepada memahami ayat pendek, anak belajar membaca dengan lebih bermakna. Aktiviti disusun daripada asas kepada cabaran yang lebih tinggi.',
    label: 'Skrin game Taman Ayat dan Cerita: susun Ibu, membaca, buku menjadi ayat',
  },
  {
    k: 'planet', dev: 'phone', tone: 'purple', value: 9, title: 'Planet Nombor & Kuantiti',
    desc: 'Kenal nombor, kira objek dan fahami nilai nombor melalui ilustrasi yang menarik. Anak belajar konsep Matematik asas sebelum beralih kepada operasi pengiraan.',
    label: 'Skrin game Planet Nombor dan Kuantiti: kira lima bintang',
  },
  {
    k: 'misi', dev: 'tablet', tone: 'peach', value: 11, title: 'Misi Tambah, Tolak & Masalah Harian',
    desc: 'Latih pengiraan tambah dan tolak menggunakan objek, situasi harian serta masalah mudah. Membantu anak memahami cara mengira, bukan sekadar menghafal jawapan.',
    label: 'Skrin game Misi Tambah, Tolak dan Masalah Harian: Ali ada 4 epal, ibu beri 2 lagi',
  },
];

const e = (s) => String(s).replace(/&/g, '&amp;');

function topBar() {
  return `<header class="m3-top" data-sec="top-bar"><p>KHAS UNTUK IBU AYAH YANG ADA ANAK BERUMUR 5–9 TAHUN</p></header>`;
}

function hero() {
  const strip = [
    ['world', '6', 'Dunia Pembelajaran'],
    ['modes', '5', 'Cara Main Interaktif'],
    ['eight', '8', 'Soalan Setiap Misi'],
    ['reward', '', 'Ganjaran Bintang & Sticker'],
  ]
    .map(([ic, n, t]) => `<li>${icon(IC[ic]())}<span>${n ? `<b>${n}</b> ` : ''}${e(t)}</span></li>`)
    .join('');
  const fc = (n, ic, t) => `<div class="m3-fc m3-fc${n}">${icon(IC[ic]())}<span>${e(t)}</span></div>`;
  return `<section class="m3-hero" data-sec="hero" aria-labelledby="m3-h1">
<div class="m3-hero-bg" aria-hidden="true"></div>
<div class="m3-wrap">
<div class="m3-hero-copy">
<h1 id="m3-h1" class="m3-h1">Anak Dah Kenal Huruf &amp; Nombor, Tapi Bila Kena Baca, Eja atau Kira Sendiri… <span class="m3-mark">Masih Tersekat-sekat?</span></h1>
<h2 class="m3-solve">Jadikan Latihan 3M Lebih Mudah Dengan Game Interaktif Yang Ikut Tahap Anak!</h2>
<p class="m3-lead">Tak perlu paksa anak hadap latihan panjang. Biar anak belajar membaca, menulis dan mengira melalui misi pendek, permainan interaktif dan ganjaran yang buat mereka seronok nak cuba lagi.</p>
<ul class="m3-strip">${strip}</ul>
</div>
<div class="m3-viz" data-io>
<div class="m3-stage">
<div class="m3-d m3-d-pc"><div class="m3-fl">${monitor(dashboard(), { label: 'Komputer memaparkan peta dunia Misi Pemulihan 3M bersama Kiko Si Kancil dan enam dunia pembelajaran' })}</div></div>
<div class="m3-d m3-d-tab"><div class="m3-fl m3-fl2"><div class="m3-tilt-l">${tablet(resultCard(), { label: 'Tablet memaparkan contoh kad keputusan: Tahniah Aina, 8 misi selesai, markah 7/8, tiga bintang', side: 'left' })}</div></div></div>
<div class="m3-d m3-d-ph"><div class="m3-fl m3-fl3"><div class="m3-tilt-r">${phone(gameplay(), { label: 'Telefon memaparkan soalan 3 daripada 8: 4 + 2 = ?, dengan pilihan 5, 6 dan 7', side: 'right' })}</div></div></div>
</div>
<div class="m3-fcs">${fc(1, 'world', '6 Dunia Pembelajaran')}${fc(2, 'stairs', 'Belajar Ikut Tahap Anak')}${fc(3, 'sticker', 'Bintang & Sticker Rewards')}</div>
</div>
<p class="m3-cap">Paparan contoh dalam game. Nama dan markah hanyalah contoh.</p>
</div>
</section>`;
}

function problems() {
  const P = [
    ['huruf', 'Kenal Huruf, Tapi Belum Lancar Membaca', 'Anak boleh sebut ABC, tapi bila kena cantum suku kata atau baca perkataan mudah, masih perlukan bantuan.'],
    ['fokus', 'Baru Sekejap Belajar, Dah Hilang Fokus', 'Buka buku latihan tak sampai lama, anak dah mula bosan. Tapi bila main game, boleh pula fokus lebih lama.'],
    ['pantau', 'Ibu Ayah Tak Pasti Anak Lemah Bahagian Mana', 'Bila anak salah jawab, susah nak tahu sama ada dia belum kuasai huruf, ejaan, nombor atau cara mengira.'],
  ];
  return `<section class="m3-sec m3-prob" data-sec="masalah" aria-labelledby="m3-h-prob">
<div class="m3-wrap">
<div class="m3-head m3-rv"><h2 id="m3-h-prob" class="m3-h2">Dah Cuba Macam-macam Cara, Tapi Anak Masih Susah Nak Fokus Belajar?</h2>
<p class="m3-sub">Bukan semua anak sesuai belajar dengan cara yang sama. Ada yang perlukan latihan lebih pendek, lebih visual dan lebih banyak peluang untuk mencuba.</p></div>
<div class="m3-grid3">${P.map(
    ([k, t, d], i) => `<article class="m3-pcard m3-pc${i + 1} m3-rv"><div class="m3-pc-art" data-io>${PROB[k]()}</div><div class="m3-pc-body"><span class="m3-pc-n">0${i + 1}</span><h3 class="m3-h3">${e(t)}</h3><p>${e(d)}</p></div></article>`,
  ).join('')}</div>
<p class="m3-bridge m3-rv">Kalau salah satu situasi ni rasa macam anak sendiri, anda tak keseorangan. Ramai ibu ayah lalui perkara yang sama.</p>
</div>
</section>`;
}

function why() {
  const A = ['Soalan sama untuk semua anak.', 'Fokus pada betul atau salah.', 'Sukar nampak kemahiran yang perlu diulang.', 'Kurang variasi cara menjawab.'];
  const B = ['Latihan disesuaikan mengikut prestasi.', 'Anak belajar dengan 5 mekanik game.', 'Kemahiran lemah boleh dikenal pasti.', 'Progress ditunjukkan kepada ibu ayah.', 'Ada bintang dan sticker sebagai galakan.'];
  const M = [
    ['modes', 'MAIN', 'Anak jawab misi pendek.', false],
    ['detect', 'KENAL PASTI', 'Sistem merekod prestasi bagi setiap kemahiran.', false],
    ['retry', 'LATIH SEMULA', 'Sistem mencadangkan latihan yang sesuai.', true],
    ['report', 'LIHAT KEMAJUAN', 'Ibu ayah boleh melihat laporan kemajuan anak.', true],
  ];
  return `<section class="m3-sec m3-why" data-sec="beza" aria-labelledby="m3-h-why">
<div class="m3-wrap">
<div class="m3-head m3-rv"><h2 id="m3-h-why" class="m3-h2">Bukan Sekadar Game Jawab Soalan… Ini Latihan Yang Ikut Kemampuan Anak!</h2>
<p class="m3-sub">Kebanyakan kuiz memberi soalan untuk dijawab. Misi Pemulihan 3M pula direka supaya anak boleh berlatih mengikut kemahiran yang masih belum dikuasai.</p></div>
<div class="m3-cmp">
<div class="m3-cmp-col m3-cmp-a m3-rv"><div class="m3-cmp-art">${CMP.biasa()}</div><h3 class="m3-h3">Latihan Biasa</h3><ul>${A.map((t) => `<li>${no}<span>${e(t)}</span></li>`).join('')}</ul></div>
<div class="m3-cmp-vs" aria-hidden="true">VS</div>
<div class="m3-cmp-col m3-cmp-b m3-rv"><div class="m3-cmp-art">${CMP.misi()}</div><h3 class="m3-h3">Misi Pemulihan 3M</h3><ul>${B.map((t) => `<li>${ok}<span>${e(t)}</span></li>`).join('')}</ul>
<p class="m3-fine">Cadangan latihan, analisis kemahiran dan laporan ibu bapa disertakan dalam Pakej PRO.</p></div>
</div>
<div class="m3-core m3-rv"><h3 class="m3-core-t">Anak Tak Semestinya Perlu Lebih Banyak Soalan. Anak Perlukan Soalan Yang <span class="m3-mark2">SESUAI DENGAN TAHAPNYA</span>.</h3></div>
<ol class="m3-mech" data-io>${M.map(
    ([ic, t, d, pro], i) => `<li class="m3-step m3-s${i + 1}"><div class="m3-step-ic">${icon(IC[ic]())}<span class="m3-step-n">${i + 1}</span></div><h4>${t}${pro ? ' <span class="m3-pro">PRO</span>' : ''}</h4><p>${e(d)}</p></li>`,
  ).join('')}</ol>
<p class="m3-fine m3-center">Langkah 3 dan 4 sepenuhnya tersedia dalam Pakej PRO.</p>
</div>
</section>`;
}

function demo() {
  return `<section class="m3-sec m3-demo-sec" data-sec="demo" aria-labelledby="m3-h-demo">
<div class="m3-wrap">
<div class="m3-head m3-rv"><h2 id="m3-h-demo" class="m3-h2">Tak Perlu Bayangkan… Cuba Main Sendiri!</h2>
<p class="m3-sub">Ini contoh bagaimana anak belajar melalui game interaktif, bukan sekadar tengok soalan dan pilih jawapan.</p></div>
<div class="m3-demo" id="m3-demo" data-io>
<p class="m3-demo-hint">${icon(IC.modes())}<span>Cuba sendiri: seret kad ke kotak, atau ketik kad untuk jawab.</span></p>
<div class="m3-ddev">
<div class="m3-dscr" id="m3-dscr">
<div class="m3-dtop">
<div class="m3-dkiko" id="m3-dkiko" aria-hidden="true"><svg viewBox="0 0 120 120" focusable="false"><use href="#m3-kiko"/></svg></div>
<div class="m3-dmeta"><span class="m3-dcat" id="m3-dcat">Pulau Suku Kata</span>
<div class="m3-dprog"><span id="m3-dq">Soalan 1/2</span><span class="m3-dbar" aria-hidden="true"><i id="m3-dfill"></i></span><span class="m3-dtime">Masa: Tanpa Had</span></div></div>
</div>
<div class="m3-dstage">
<div class="m3-q m3-q1" id="m3-q1" role="group" aria-labelledby="m3-q1t">
<div class="m3-dpic">${shirtArt()}</div>
<div class="m3-dplay">
<h3 class="m3-dtitle" id="m3-q1t" tabindex="-1">Jom Bina Perkataan!</h3>
<p class="m3-dprompt">Seret suku kata untuk bina perkataan.</p>
<div class="m3-slots"><div class="m3-slot" data-want="ba" aria-label="Kotak suku kata pertama"></div><span class="m3-op" aria-hidden="true">+</span><div class="m3-slot" data-want="ju" aria-label="Kotak suku kata kedua"></div><span class="m3-op" aria-hidden="true">=</span><span class="m3-word" id="m3-word" aria-live="polite">?</span></div>
<div class="m3-tray" role="group" aria-label="Kad suku kata"><button type="button" class="m3-syl m3-syl-a" data-syl="ba">ba</button><button type="button" class="m3-syl m3-syl-b" data-syl="ju">ju</button><button type="button" class="m3-syl m3-syl-c" data-syl="mi">mi</button></div>
</div>
</div>
<div class="m3-q m3-q2" id="m3-q2" role="group" aria-labelledby="m3-q2t" hidden>
<div class="m3-dpic m3-dpic-wide" id="m3-apples">${applesArt()}</div>
<div class="m3-dplay">
<h3 class="m3-dtitle" id="m3-q2t" tabindex="-1">Jom Kira!</h3>
<p class="m3-eq">4 + 2 = ?</p>
<div class="m3-choices" role="group" aria-label="Pilihan jawapan"><button type="button" class="m3-ch" data-v="5">5</button><button type="button" class="m3-ch" data-v="6">6</button><button type="button" class="m3-ch" data-v="7">7</button></div>
</div>
</div>
<div class="m3-dres" id="m3-dres" role="group" aria-labelledby="m3-drest" hidden>
<p class="m3-dres-rib">DEMO RINGKAS — VERSI PENUH ADA 8 SOALAN SETIAP MISI</p>
<div class="m3-dres-stars" aria-hidden="true">${[1, 2, 3].map((i) => `<svg class="m3-dstar m3-dstar${i}" viewBox="0 0 24 24" focusable="false"><use href="#m3-star"/></svg>`).join('')}</div>
<h3 class="m3-dres-t" id="m3-drest" tabindex="-1">TAHNIAH! ANDA BERJAYA!</h3>
<p class="m3-dres-score">Markah <b id="m3-dscore">2/2</b></p>
<div class="m3-dres-stk"><svg viewBox="0 0 80 80" aria-hidden="true" focusable="false"><use href="#m3-sticker"/></svg><p><b>Sticker baru dibuka!</b><span>Contoh sticker yang anak boleh kumpul.</span></p></div>
<div class="m3-dres-end"><div class="m3-dres-kiko" aria-hidden="true"><svg viewBox="0 0 120 120" focusable="false"><use href="#m3-kiko"/></svg></div><button type="button" class="m3-replay" id="m3-replay">Main Semula Demo</button></div>
</div>
</div>
<div class="m3-dtoast" id="m3-dtoast" role="status" aria-live="polite"></div>
<canvas class="m3-dfx" id="m3-dfx" aria-hidden="true"></canvas>
<div class="m3-dhand" id="m3-dhand" aria-hidden="true"><span class="m3-ripple"></span><svg viewBox="0 0 64 84" focusable="false"><use href="#m3-hand"/></svg></div>
</div>
</div>
</div>
</div>
</section>`;
}

function features() {
  return `<section class="m3-sec m3-feats" data-sec="dapat" aria-labelledby="m3-h-feat">
<div class="m3-wrap">
<div class="m3-head m3-rv"><h2 id="m3-h-feat" class="m3-h2">Satu Game, 6 Dunia Pembelajaran Yang Anak Boleh Teroka!</h2>
<p class="m3-sub">Daripada kenal huruf sampailah menyelesaikan masalah Matematik mudah — semuanya disusun dalam pengalaman bermain yang berperingkat.</p></div>
${FEATURES.map((f, i) => {
  const dev = f.dev === 'phone' ? phone(FEAT[f.k](), { label: f.label }) : tablet(FEAT[f.k](), { label: f.label, land: true });
  return `<article class="m3-feat m3-ft-${f.tone}${i % 2 ? ' m3-feat-rev' : ''}">
<div class="m3-feat-viz m3-rv" data-io><div class="m3-feat-dev m3-feat-${f.dev}"><div class="m3-fl">${dev}</div></div><span class="m3-feat-badge">${icon(IC[f.k]())}</span></div>
<div class="m3-feat-txt m3-rv"><span class="m3-feat-k">Dunia ${i + 1}</span><h3 class="m3-h3">${e(f.title)}</h3><p>${e(f.desc)}</p><p class="m3-val">Nilai: <b>RM${f.value}</b></p></div>
</article>`;
}).join('\n')}
</div>
</section>`;
}

function pricing() {
  const plan = (p) => `<article class="m3-plan m3-plan-${p.key}" data-pkg="${p.key}" data-ref="${p.ref}" data-price="${p.price}">
<span class="m3-rib">${p.ribbon}</span>
<h3 class="m3-plan-t">${e(p.title)}</h3>
<p class="m3-plan-sub">${e(p.sub)}</p>
<div class="m3-price"><span class="m3-ref">Nilai rujukan <s>RM${p.ref}</s></span><span class="m3-now" aria-label="Harga promo RM${p.price}"><small>RM</small>${p.price}</span></div>
<ul class="m3-items">${p.items.map(([t, v]) => `<li data-v="${v}">${ok}<span>${e(t)}</span><em>Nilai RM${v}</em></li>`).join('')}</ul>
<div class="m3-sum"><span>Jumlah nilai rujukan</span><b>RM${p.ref}</b></div>
<div class="m3-sum m3-sum-now"><span>Harga promo hari ini</span><b>RM${p.price}</b></div>
<a class="m3-cta" href="#" data-pkg="${p.key}">SAYA NAK PAKEJ ${p.key.toUpperCase()} — RM${p.price}</a>
<p class="m3-micro">Akses digital • Belajar melalui telefon, tablet atau komputer</p>
</article>`;
  return `<section class="m3-sec m3-pricing" data-sec="pakej" id="m3-pakej" aria-labelledby="m3-h-price">
<div class="m3-wrap">
<div class="m3-head m3-rv"><h2 id="m3-h-price" class="m3-h2">Pilih Pakej Yang Sesuai Untuk Anak Anda</h2>
<p class="m3-sub">Bayar sekali untuk akses kepada pakej permainan yang dipilih. Tiada langganan bulanan bagi tawaran ini.</p></div>
<div class="m3-plans">${PLANS.map(plan).join('')}</div>
<p class="m3-fine m3-center">Nilai rujukan ialah anggaran nilai setiap komponen pakej, bukan harga jualan terdahulu.</p>
</div>
</section>`;
}

function footer() {
  return `<footer class="m3-foot" data-sec="footer"><div class="m3-wrap">
<p class="m3-foot-brand">Misi Pemulihan 3M</p>
<p>Produk pembelajaran digital untuk latihan asas 3M.</p>
<p>Produk ini bukan produk rasmi atau diperakui oleh KPM.</p>
<p class="m3-copy">&copy; <span data-m3-year>2026</span> Misi Pemulihan 3M. Hak cipta terpelihara.</p>
</div></footer>`;
}

export const body = () =>
  `<div id="misi3m-sales-root" class="m3">
${sprite()}
${topBar()}
<div class="m3-main">
${hero()}
${problems()}
${why()}
${demo()}
${features()}
${pricing()}
</div>
${footer()}
</div>`;
