// Game screens drawn as SVG, matching the Misi Pemulihan 3M game spec: adventure-map
// dashboard, 8-question sessions, timer, stars, stickers and Kiko Si Kancil.
import { T, use, shadow, hl, IC, people } from './art.mjs';

const TH = {
  coral: { fam: 'Coral', ink: '#B53A55', soft: '#FFF2F5' },
  sky: { fam: 'Sky', ink: '#1F6FAE', soft: '#EEF8FF' },
  sun: { fam: 'Sun', ink: '#8F5300', soft: '#FFF9E6' },
  mint: { fam: 'Mint', ink: '#1E8460', soft: '#EDFBF5' },
  purple: { fam: 'Purple', ink: '#5A3BC4', soft: '#F4EFFF' },
  peach: { fam: 'Peach', ink: '#B4541F', soft: '#FFF4EC' },
};

const ring = (cx, cy, r, txt, frac, anim) => {
  const c = 2 * Math.PI * r;
  return (
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" fill-opacity=".18"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="4.5"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c * (1 - frac)).toFixed(1)}" transform="rotate(-90 ${cx} ${cy})"${anim ? ' class="m3-timer"' : ''}/>` +
    T(cx, cy + 4.5, txt, { s: 12.5, f: '#fff' })
  );
};

const back = (cx, cy) =>
  `<circle cx="${cx}" cy="${cy}" r="17" fill="#fff" fill-opacity=".3"/><path d="M${cx + 3} ${cy - 7} l-7 7 7 7" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;

function headPhone(th, cat, qn, timer, tf, anim = false) {
  const t = TH[th];
  const two = Array.isArray(cat);
  return (
    `<path d="M0 0 H348 V122 Q174 150 0 122Z" fill="url(#m3-l${t.fam})"/>` +
    `<rect x="0" y="0" width="348" height="34" fill="#fff" opacity=".12" data-ui="1"/>` +
    back(32, 58) +
    `<rect x="58" y="40" width="222" height="36" rx="18" fill="#fff"/>` +
    (two
      ? T(169, 55, cat[0], { s: 11.5, f: t.ink }) + T(169, 69.5, cat[1], { s: 11.5, f: t.ink })
      : T(169, 63, cat, { s: 13, f: t.ink })) +
    ring(314, 58, 17, timer, tf, anim) +
    T(22, 108, `Soalan ${qn}/8`, { s: 13.5, f: '#fff', a: 'start' }) +
    `<rect x="112" y="99" width="214" height="10" rx="5" fill="#fff" fill-opacity=".35" data-ui="1"/>` +
    `<rect x="112" y="99" width="${(214 * qn) / 8}" height="10" rx="5" fill="#fff" data-ui="1"/>`
  );
}

function headTab(th, cat, qn, timer, tf) {
  const t = TH[th];
  const pw = Math.max(170, cat.length * 7.6 + 36);
  const px = 62 + pw + 22;
  return (
    `<path d="M0 0 H692 V70 Q346 96 0 70Z" fill="url(#m3-l${t.fam})"/>` +
    back(34, 40) +
    `<rect x="62" y="22" width="${pw}" height="36" rx="18" fill="#fff"/>` +
    T(62 + pw / 2, 45, cat, { s: 13.5, f: t.ink }) +
    T(px, 45, `Soalan ${qn}/8`, { s: 14, f: '#fff', a: 'start' }) +
    `<rect x="${px + 92}" y="36" width="${Math.max(80, 560 - px - 92)}" height="10" rx="5" fill="#fff" fill-opacity=".35" data-ui="1"/>` +
    `<rect x="${px + 92}" y="36" width="${(Math.max(80, 560 - px - 92) * qn) / 8}" height="10" rx="5" fill="#fff" data-ui="1"/>` +
    (timer === 'Tanpa Had'
      ? `<rect x="574" y="22" width="100" height="36" rx="18" fill="#fff" fill-opacity=".25"/>` + T(624, 45, 'Tanpa Had', { s: 13, f: '#fff' })
      : ring(652, 40, 18, timer, tf))
  );
}

const bubble = (x, y, w, h, lines, tail = 'left', ink = '#41258E') =>
  `<g filter="url(#m3-fDrop)"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="#fff"/>` +
  (tail === 'left'
    ? `<path d="M${x + 2} ${y + h - 22} l-14 10 l16 2z" fill="#fff"/>`
    : `<path d="M${x + w / 2 - 8} ${y + h - 1} l8 14 l8 -14z" fill="#fff"/>`) +
  `</g>` +
  lines.map((l, i) => T(x + w / 2, y + h / 2 + 5.5 - ((lines.length - 1) * 19) / 2 + i * 19, l, { s: 15, f: ink })).join('');

const choice = (cx, cy, r, label, ok = false, cls = '') =>
  `<g${cls ? ` class="${cls}"` : ''}>` +
  `<circle cx="${cx}" cy="${cy + 5}" r="${r}" fill="${ok ? '#2FA97B' : '#DCD3F5'}"/>` +
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${ok ? 'url(#m3-lMint)' : '#fff'}" stroke="${ok ? '#fff' : '#E4DAFF'}" stroke-width="3"/>` +
  hl(cx - r * 0.35, cy - r * 0.45, r * 0.32, r * 0.16, -25, ok ? 0.4 : 0.9) +
  T(cx, cy + r * 0.36, label, { s: r * 0.98, f: ok ? '#fff' : '#41258E' }) +
  (ok ? use('check', cx + r * 0.42, cy - r * 1.08, r * 0.72, r * 0.72) : '') +
  `</g>`;

const tile = (x, y, w, h, label, fam, dark, size, cls = '') =>
  `<g${cls ? ` class="${cls}"` : ''}><rect x="${x}" y="${y + 6}" width="${w}" height="${h}" rx="14" fill="${dark}"/>` +
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="url(#m3-l${fam})"/>` +
  `<rect x="${x + 6}" y="${y + 4}" width="${w - 12}" height="${h * 0.26}" rx="8" fill="#fff" opacity=".26"/>` +
  T(x + w / 2, y + h / 2 + size * 0.36, label, { s: size, f: '#fff' }) +
  `</g>`;

const ltile = (x, y, w, h, label) =>
  `<rect x="${x}" y="${y + 6}" width="${w}" height="${h}" rx="14" fill="#DCD3F5"/>` +
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="#fff" stroke="#E4DAFF" stroke-width="2.5"/>` +
  T(x + w / 2, y + h / 2 + 13, label, { s: 36, f: '#41258E' });

const slot = (x, y, w, h) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="#F6F2FF" stroke="#BCA9F7" stroke-width="2.6" stroke-dasharray="7 6"/>`;

const card = (x, y, w, h, r = 24) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="#fff" filter="url(#m3-fDrop)"/>`;

const ball = (cx, cy, r) =>
  shadow(cx, cy + r + 4, r * 0.8, 3.2, 0.2) +
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#m3-rCoral)"/>` +
  `<path d="M${cx - r} ${cy} Q${cx} ${cy - r * 0.6} ${cx + r} ${cy}" stroke="#fff" stroke-width="${r * 0.16}" fill="none"/>` +
  `<path d="M${cx - r * 0.5} ${cy - r * 0.86} Q${cx - r * 0.2} ${cy} ${cx - r * 0.5} ${cy + r * 0.86}" stroke="#FFD66D" stroke-width="${r * 0.14}" fill="none"/>` +
  hl(cx - r * 0.38, cy - r * 0.42, r * 0.3, r * 0.17, -30, 0.5);

const nested = (ic, x, y, s) => `<svg x="${x}" y="${y}" width="${s}" height="${s}" viewBox="0 0 64 64">${IC[ic]()}</svg>`;

/* ---------- Hero: PC dashboard (948×540) ---------- */

export function dashboard() {
  const nodes = [
    { x: 330, y: 368, fam: 'Coral', ic: 'huruf', l: ['Dunia Huruf', '& Bunyi'], st: 3 },
    { x: 470, y: 278, fam: 'Sky', ic: 'pulau', l: ['Pulau Suku Kata'], st: 3 },
    { x: 612, y: 372, fam: 'Sun', ic: 'bandar', l: ['Bandar Perkataan', '& Ejaan'], st: 'now' },
    { x: 762, y: 286, fam: 'Mint', ic: 'taman', l: ['Taman Ayat', '& Cerita'], st: 0 },
    { x: 628, y: 150, fam: 'Purple', ic: 'planet', l: ['Planet Nombor', '& Kuantiti'], st: 0 },
    { x: 832, y: 146, fam: 'Peach', ic: 'misi', l: ['Misi Tambah, Tolak', '& Masalah Harian'], st: 0 },
  ];
  const nodeSvg = (n) => {
    const lw = Math.max(...n.l.map((s) => s.length)) * 7.1 + 22;
    const lh = n.l.length === 2 ? 38 : 24;
    const stars =
      n.st === 3
        ? use('star', n.x - 29, n.y - 66, 18, 18) + use('star', n.x - 9, n.y - 72, 18, 18) + use('star', n.x + 11, n.y - 66, 18, 18)
        : n.st === 0
          ? use('starOff', n.x - 29, n.y - 64, 16, 16) + use('starOff', n.x - 8, n.y - 69, 16, 16) + use('starOff', n.x + 13, n.y - 64, 16, 16)
          : '';
    const now =
      n.st === 'now'
        ? `<circle cx="${n.x}" cy="${n.y - 6}" r="50" fill="#fff" opacity=".5" class="m3-ringpulse"/>` +
          `<rect x="${n.x - 44}" y="${n.y - 80}" width="88" height="22" rx="11" fill="url(#m3-lPurple)"/>` +
          T(n.x, n.y - 64.5, 'Sedang main', { s: 11, f: '#fff' })
        : '';
    return (
      `<g>` +
      now +
      `<ellipse cx="${n.x}" cy="${n.y + 34}" rx="56" ry="16" fill="url(#m3-l${n.fam})"/>` +
      `<ellipse cx="${n.x}" cy="${n.y + 29}" rx="51" ry="11.5" fill="#fff" opacity=".55"/>` +
      nested(n.ic, n.x - 36, n.y - 46, 72) +
      stars +
      `<rect x="${n.x - lw / 2}" y="${n.y + 54}" width="${lw}" height="${lh}" rx="12" fill="#fff" stroke="#E4DAFF" stroke-width="1.5"/>` +
      n.l.map((s, i) => T(n.x, n.y + 70.5 + i * 15, s, { s: 12.5, w: 600, f: '#41258E' })).join('') +
      `</g>`
    );
  };
  const path =
    'M330 392 C380 356 420 302 470 302 C530 302 556 396 612 396 C670 396 702 310 762 310 C824 310 700 174 628 174 C700 174 776 170 832 170';
  return `
<rect width="948" height="540" fill="url(#m3-vSky)"/>
<circle cx="908" cy="104" r="44" fill="#FFD66D" opacity=".28" filter="url(#m3-fGlow)"/><circle cx="908" cy="104" r="26" fill="url(#m3-rSun)"/>
<g class="m3-drift">${use('cloud', 262, 78, 110, 55)}</g>
<g class="m3-drift m3-d2">${use('cloud', 690, 70, 86, 43)}</g>
<g class="m3-drift m3-d3">${use('cloud', 440, 118, 64, 32)}</g>
<path d="M0 420 C190 376 360 398 520 392 C700 384 820 360 948 382 V540 H0Z" fill="url(#m3-vHill)"/>
<path d="M0 470 C150 432 300 456 474 440 C650 424 800 450 948 430 V540 H0Z" fill="url(#m3-vGrass)"/>
${use('tree', 254, 404, 38, 57)}${use('tree', 898, 378, 34, 51)}${use('tree', 700, 430, 28, 42)}${use('tree', 412, 166, 30, 45)}${use('tree', 534, 118, 26, 39)}
<path d="${path}" stroke="#fff" stroke-opacity=".75" stroke-width="16" fill="none" stroke-linecap="round"/>
<path d="${path}" stroke="#7856E8" stroke-opacity=".65" stroke-width="5" fill="none" stroke-linecap="round" stroke-dasharray="1 13" class="m3-march"/>
${use('star', 392, 330, 15, 15)}${use('star', 536, 338, 15, 15)}${use('star', 684, 346, 15, 15)}${use('star', 716, 228, 15, 15)}${use('star', 726, 160, 15, 15)}
${nodes.map(nodeSvg).join('')}
<rect x="14" y="12" width="920" height="52" rx="18" fill="#fff" fill-opacity=".95" filter="url(#m3-fDrop)"/>
${use('kiko', 22, 13, 50, 50)}
${T(78, 35, 'Misi Pemulihan 3M', { s: 19, f: '#41258E', a: 'start' })}${T(78, 53, 'Main, Belajar & Jadi Hebat!', { s: 11.5, w: 600, f: '#7856E8', a: 'start' })}
<rect x="512" y="22" width="122" height="32" rx="16" fill="#FFF4CC"/>${use('star', 520, 26, 24, 24)}${T(550, 43, '42 Bintang', { s: 13, f: '#8A5A00', a: 'start' })}
<rect x="642" y="22" width="124" height="32" rx="16" fill="#FFE6EC"/>${use('sticker', 648, 23, 30, 30)}${T(682, 43, '12 Sticker', { s: 13, f: '#B53A55', a: 'start' })}
<rect x="774" y="22" width="150" height="32" rx="16" fill="#EDE5FF"/>${T(788, 35.5, 'Kemajuan', { s: 10, f: '#5A3BC4', a: 'start' })}
<rect x="788" y="40" width="94" height="7" rx="3.5" fill="#fff" data-ui="1"/><rect x="788" y="40" width="60" height="7" rx="3.5" fill="url(#m3-lPurple)" data-ui="1"/>${T(914, 47, '64%', { s: 12.5, f: '#41258E', a: 'end' })}
<rect x="14" y="76" width="222" height="270" rx="22" fill="#fff" fill-opacity=".78"/>
<rect x="28" y="90" width="194" height="66" rx="16" fill="#fff" stroke="#E4DAFF" stroke-width="2"/><path d="M112 155 l12 14 l6 -14z" fill="#fff"/>
${T(125, 117, 'Hai Aina!', { s: 18, f: '#41258E' })}${T(125, 142, 'Jom Jadi Hebat!', { s: 16, f: '#7856E8' })}
<g class="m3-bob">${use('kiko', 48, 168, 156, 156)}</g>
<rect x="262" y="486" width="210" height="44" rx="22" fill="#4A2CB0"/><rect x="262" y="482" width="210" height="44" rx="22" fill="url(#m3-lPurple)"/>${T(367, 509.5, 'SAMBUNG BELAJAR', { s: 15, w: 800, f: '#fff' })}
<rect x="488" y="484" width="186" height="40" rx="20" fill="#fff" stroke="#FFC6D0" stroke-width="2"/>${use('sticker', 496, 488, 32, 32)}${T(536, 509, 'Koleksi Sticker', { s: 13.5, f: '#B53A55', a: 'start' })}
<rect x="690" y="484" width="200" height="40" rx="20" fill="#fff" stroke="#BFE3FF" stroke-width="2"/>${nested('report', 698, 487, 34)}${T(738, 509, 'Laporan Ibu Bapa', { s: 13.5, f: '#1F6FAE', a: 'start' })}`;
}

/* ---------- Hero: tablet result card (512×692) ---------- */

const CONF = [
  [40, 210, '#FFD66D'], [470, 230, '#76DDB5'], [88, 560, '#FF8FA3'], [440, 590, '#82CCFF'], [28, 400, '#FFB385'],
  [486, 420, '#FFD66D'], [120, 150, '#82CCFF'], [392, 168, '#FF8FA3'], [250, 152, '#fff'], [70, 640, '#76DDB5'], [460, 660, '#FFD66D'],
];

export function resultCard() {
  const rays = Array.from({ length: 12 }, (_, i) => `<path d="M256 300 L${256 + 400 * Math.cos((i * Math.PI) / 6 - 0.11)} ${300 + 400 * Math.sin((i * Math.PI) / 6 - 0.11)} L${256 + 400 * Math.cos((i * Math.PI) / 6 + 0.11)} ${300 + 400 * Math.sin((i * Math.PI) / 6 + 0.11)}Z" fill="#fff" opacity=".07"/>`).join('');
  const conf = CONF.map(([x, y, c], i) => `<g class="m3-conf m3-d${(i % 5) + 1}"><rect x="${x}" y="${y}" width="${i % 2 ? 9 : 12}" height="${i % 2 ? 14 : 7}" rx="2" fill="${c}" transform="rotate(${(i * 37) % 90} ${x} ${y})"/></g>`).join('');
  const fw = (cx, cy, c, d) =>
    `<g class="m3-fw m3-d${d}">` +
    Array.from({ length: 8 }, (_, i) => {
      const a = (i * Math.PI) / 4;
      return `<circle cx="${(cx + 26 * Math.cos(a)).toFixed(1)}" cy="${(cy + 26 * Math.sin(a)).toFixed(1)}" r="3.6" fill="${c}"/>`;
    }).join('') +
    `<circle cx="${cx}" cy="${cy}" r="5" fill="#fff"/></g>`;
  return `
<rect width="512" height="692" fill="url(#m3-rResult)"/>
<g class="m3-spin">${rays}</g>
${fw(78, 108, '#FFD66D', 1)}${fw(436, 126, '#76DDB5', 3)}${fw(450, 520, '#FF8FA3', 2)}
${conf}
<path d="M36 74 H100 V134 H36 L54 104Z" fill="#C8475F"/><path d="M476 74 H412 V134 H476 L458 104Z" fill="#C8475F"/>
<rect x="76" y="62" width="360" height="62" rx="10" fill="url(#m3-lCoral)"/>
<rect x="86" y="66" width="340" height="14" rx="7" fill="#fff" opacity=".25" data-ui="1"/>
${T(256, 104, 'TAHNIAH AINA!', { s: 31, f: '#fff', ls: 1 })}
${card(48, 176, 416, 392, 30)}
<g class="m3-shim m3-d1">${use('star', 112, 140, 80, 80)}</g><g class="m3-shim m3-d2">${use('star', 204, 116, 104, 104)}</g><g class="m3-shim m3-d3">${use('star', 320, 140, 80, 80)}</g>
${T(256, 262, '8 MISI SELESAI', { s: 18, f: '#7856E8', ls: 2 })}
${T(256, 296, 'Markah', { s: 15, w: 600, f: '#6B6B8A' })}
${T(256, 372, '7/8', { s: 78, f: '#41258E' })}
<rect x="88" y="400" width="336" height="2" rx="1" fill="#EEE8FB" data-ui="1"/>
<g class="m3-pop">${use('sticker', 84, 420, 104, 104)}</g>
${T(204, 462, 'Sticker baru!', { s: 19, f: '#DE5571', a: 'start' })}
${T(204, 488, 'Kiko Bijak masuk', { s: 14, w: 600, f: '#5B5B7A', a: 'start' })}${T(204, 508, 'ke album sticker', { s: 14, w: 600, f: '#5B5B7A', a: 'start' })}
<rect x="64" y="592" width="178" height="52" rx="26" fill="#fff" fill-opacity=".22"/>${T(153, 624, 'MAIN LAGI', { s: 16, w: 800, f: '#fff' })}
<rect x="270" y="597" width="178" height="52" rx="26" fill="#E2952C"/><rect x="270" y="592" width="178" height="52" rx="26" fill="url(#m3-lSun)"/>${T(359, 624, 'TERUSKAN', { s: 16, w: 800, f: '#41258E' })}
${T(256, 676, 'Contoh paparan keputusan sesi', { s: 12, w: 600, f: '#fff', op: '.85' })}`;
}

/* ---------- Hero: phone gameplay (348×736) ---------- */

export function gameplay() {
  return `
<rect width="348" height="736" fill="#FFF4EC"/>
${headPhone('peach', ['Misi Tambah, Tolak', '& Masalah Harian'], 3, '24', 0.8, true)}
${card(18, 160, 312, 276)}
${T(174, 194, 'Jom kira!', { s: 16, f: '#8A6BB8' })}
<g>${use('apple', 34, 206, 44, 50)}${use('apple', 80, 206, 44, 50)}${use('apple', 34, 254, 44, 50)}${use('apple', 80, 254, 44, 50)}</g>
${T(160, 272, '+', { s: 38, f: '#E25C78' })}
<g>${use('apple', 196, 230, 44, 50)}${use('apple', 244, 230, 44, 50)}</g>
${T(174, 400, '4 + 2 = ?', { s: 50, f: '#41258E' })}
${choice(74, 512, 44, '5')}${choice(174, 512, 44, '6', true, 'm3-pulse')}${choice(274, 512, 44, '7')}
<g class="m3-bob">${use('kiko', 8, 584, 116, 116)}</g>
${bubble(128, 600, 204, 62, ['Hebat!', 'Jawapan betul.'])}
${T(174, 716, 'Pilih jawapan yang betul', { s: 12, w: 600, f: '#9A8AA8' })}`;
}

/* ---------- Six category screens ---------- */

export const FEAT = {
  huruf: () => `
<rect width="348" height="736" fill="${TH.coral.soft}"/>
${headPhone('coral', 'Dunia Huruf & Bunyi', 2, '45', 0.75)}
${card(18, 158, 312, 222)}
${T(174, 198, 'Cari huruf B', { s: 25, f: '#41258E' })}
<circle cx="84" cy="276" r="30" fill="url(#m3-lCoral)"/><path d="M71 268 h8 l10 -9 v34 l-10 -9 h-8z" fill="#fff"/><path d="M95 266 q6 10 0 20" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>
${ball(250, 268, 36)}
${T(84, 334, 'Dengar bunyi', { s: 13, w: 600, f: '#7A6A8A' })}${T(250, 340, 'B untuk Bola', { s: 15, f: '#B53A55' })}
<rect x="118" y="400" width="112" height="128" rx="24" fill="#FFD66D" opacity=".6" filter="url(#m3-fGlow)" class="m3-glow"/>
<g class="m3-bob">${tile(24, 410, 90, 100, 'A', 'Sky', '#2F7FBE', 52)}</g>
<g class="m3-bob m3-d2">${tile(129, 410, 90, 100, 'B', 'Coral', '#C8475F', 52)}${use('check', 196, 394, 32, 32)}</g>
<g class="m3-bob m3-d4">${tile(234, 410, 90, 100, 'C', 'Mint', '#2FA97B', 52)}</g>
<g class="m3-bob">${use('kiko', 8, 566, 120, 120)}</g>
${bubble(132, 584, 200, 64, ['Bunyi /b/,', 'macam bola!'])}`,

  pulau: () => `
<rect width="692" height="482" fill="url(#m3-vSky)"/>
<path d="M0 430 C120 412 240 440 360 424 C480 408 600 432 692 418 V482 H0Z" fill="#9FD6FF" opacity=".7"/>
${headTab('sky', 'Pulau Suku Kata', 4, 'Tanpa Had')}
${card(24, 106, 232, 304)}
<svg x="45" y="126" width="190" height="180" viewBox="0 0 180 170">${shirtInline()}</svg>
${T(140, 346, 'Apakah ini?', { s: 17, f: '#1F6FAE' })}${T(140, 372, 'Bina perkataannya', { s: 13, w: 600, f: '#6B7B98' })}
${T(478, 138, 'Jom Bina Perkataan!', { s: 25, f: '#41258E' })}
${T(478, 164, 'Seret suku kata untuk bina perkataan.', { s: 13.5, w: 600, f: '#5B6B8A' })}
${tile(288, 190, 96, 80, 'BA', 'Purple', '#4A2CB0', 30)}
${T(404, 242, '+', { s: 30, f: '#7856E8' })}
${slot(424, 190, 96, 80)}
${T(542, 242, '=', { s: 30, f: '#7856E8' })}
<g class="m3-appear">${tile(562, 192, 108, 76, 'BAJU', 'Mint', '#2FA97B', 26)}</g>
<rect x="288" y="306" width="382" height="104" rx="22" fill="#fff" fill-opacity=".75" stroke="#CDEBFF" stroke-width="2"/>
<rect x="306" y="322" width="96" height="72" rx="14" fill="none" stroke="#D9CFF7" stroke-width="2" stroke-dasharray="6 6"/>
${T(354, 364, 'ba', { s: 16, w: 600, f: '#C3B6EA' })}
<g class="m3-flyju">${tile(424, 320, 96, 72, 'JU', 'Sky', '#2F7FBE', 30)}</g>
${tile(552, 320, 96, 72, 'MI', 'Coral', '#C8475F', 30)}
<g class="m3-bob">${use('kiko', 190, 388, 84, 84)}</g>`,

  bandar: () => `
<rect width="348" height="736" fill="${TH.sun.soft}"/>
<path d="M0 736 V650 h40 v-40 h46 v60 h34 v-90 h52 v70 h40 v-50 h50 v80 h44 v-30 h42 V736Z" fill="#FFE7A8" opacity=".7"/>
${headPhone('sun', 'Bandar Perkataan & Ejaan', 5, '18', 0.6)}
${card(18, 158, 312, 196)}
${ball(174, 222, 40)}
${T(174, 302, 'Lengkapkan perkataan', { s: 17, f: '#8F5300' })}${T(174, 328, 'Isi huruf yang hilang', { s: 13, w: 600, f: '#8A7A60' })}
${tile(24, 378, 66, 78, 'B', 'Purple', '#4A2CB0', 40)}
${slot(101, 378, 66, 78)}
${tile(178, 378, 66, 78, 'L', 'Purple', '#4A2CB0', 40)}
${tile(255, 378, 66, 78, 'A', 'Purple', '#4A2CB0', 40)}
<rect x="47" y="506" width="66" height="72" rx="14" fill="none" stroke="#E8D7A8" stroke-width="2.4" stroke-dasharray="6 5"/>${ltile(141, 506, 66, 72, 'U')}${ltile(235, 506, 66, 72, 'A')}
<g class="m3-flyo">${tile(47, 506, 66, 72, 'O', 'Sun', '#E2952C', 38)}</g>
<g class="m3-bob">${use('kiko', 8, 594, 108, 108)}</g>
${bubble(122, 612, 210, 62, ['B-O-L-A,', 'bola!'])}`,

  taman: () => `
<rect width="692" height="482" fill="${TH.mint.soft}"/>
<path d="M0 440 C140 420 280 448 420 430 C560 414 640 434 692 424 V482 H0Z" fill="#BFEBD6"/>
${[60, 160, 610, 660].map((x, i) => `<circle cx="${x}" cy="${452 - (i % 2) * 8}" r="9" fill="url(#m3-rCoral)"/><circle cx="${x}" cy="${452 - (i % 2) * 8}" r="3.5" fill="#FFD66D"/>`).join('')}
${headTab('mint', 'Taman Ayat & Cerita', 6, '52', 0.85)}
${card(24, 106, 232, 304)}
<g transform="translate(64 120) scale(.98)">${momInline()}</g>
<path d="M140 300 C126 292 104 292 92 296 V326 C104 322 126 322 140 330Z" fill="url(#m3-lCream)" stroke="#E2C9A2" stroke-width="1.4"/>
<path d="M140 300 C154 292 176 292 188 296 V326 C176 322 154 322 140 330Z" fill="url(#m3-lCream)" stroke="#E2C9A2" stroke-width="1.4"/>
${T(140, 380, 'Lihat gambar', { s: 15, f: '#1E8460' })}
${T(472, 138, 'Susun perkataan menjadi ayat.', { s: 20, f: '#1E8460' })}
${tile(288, 168, 112, 60, 'Ibu', 'Purple', '#4A2CB0', 24)}
${tile(408, 168, 128, 60, 'membaca', 'Sky', '#2F7FBE', 22)}
${slot(544, 168, 120, 60)}
<rect x="288" y="262" width="376" height="90" rx="20" fill="#fff" fill-opacity=".8" stroke="#BFEBD6" stroke-width="2"/>
<g class="m3-flybuku">${tile(424, 278, 120, 56, 'buku', 'Coral', '#C8475F', 22)}</g>
${tile(306, 278, 100, 56, 'bola', 'Sun', '#E2952C', 22)}
<g class="m3-appear">${use('check', 330, 380, 26, 26)}${T(486, 401, 'Ibu membaca buku.', { s: 21, f: '#1E8460' })}</g>
<g class="m3-bob">${use('kiko', 190, 388, 84, 84)}</g>`,

  planet: () => `
<rect width="348" height="736" fill="url(#m3-rSpace)"/>
<circle cx="300" cy="640" r="34" fill="url(#m3-rSky)" opacity=".6"/>
${headPhone('purple', 'Planet Nombor & Kuantiti', 3, '30', 1)}
${card(18, 158, 312, 296)}
${T(174, 198, 'Berapa bintang?', { s: 23, f: '#41258E' })}
${[
  [52, 216], [140, 216], [228, 216], [96, 312], [184, 312],
]
  .map(
    ([x, y], i) =>
      `<g class="m3-twinkle m3-d${i + 1}">${use('star', x, y, 70, 70)}</g>` +
      `<g class="m3-cnt m3-d${i + 1}"><circle cx="${x + 62}" cy="${y + 12}" r="13" fill="url(#m3-lPurple)"/>${T(x + 62, y + 17, String(i + 1), { s: 14, f: '#fff' })}</g>`,
  )
  .join('')}
${choice(84, 528, 40, '4')}${choice(174, 528, 40, '5', true, 'm3-pulse')}${choice(264, 528, 40, '6')}
<g class="m3-bob">${use('kiko', 8, 590, 112, 112)}</g>
${bubble(124, 608, 208, 62, ['Kira satu-satu,', 'ada 5 bintang!'])}`,

  misi: () => `
<rect width="692" height="482" fill="${TH.peach.soft}"/>
${headTab('peach', 'Misi Tambah, Tolak & Masalah Harian', 7, '41', 0.7)}
${card(24, 106, 300, 304)}
${T(44, 146, 'Ali ada 4 biji epal.', { s: 18, f: '#41258E', a: 'start' })}${T(44, 174, 'Ibu beri 2 biji lagi.', { s: 18, f: '#41258E', a: 'start' })}
<g>${use('apple', 40, 204, 38, 44)}${use('apple', 80, 204, 38, 44)}${use('apple', 120, 204, 38, 44)}${use('apple', 160, 204, 38, 44)}</g>
${T(220, 236, '+', { s: 32, f: '#E25C78' })}
<g class="m3-bob">${use('apple', 238, 204, 38, 44)}${use('apple', 278, 204, 38, 44)}</g>
<path d="M54 290 H294 L278 382 Q174 396 70 382Z" fill="url(#m3-lBrown)"/>
<path d="M60 302 H288" stroke="#fff" stroke-opacity=".3" stroke-width="3"/><path d="M66 326 H282 M70 350 H278" stroke="#7A4524" stroke-opacity=".35" stroke-width="2"/>
${T(174, 345, 'Bakul Ali', { s: 16, f: '#fff' })}
${T(508, 146, 'Berapa biji epal', { s: 20, f: '#41258E' })}${T(508, 172, 'Ali sekarang?', { s: 20, f: '#41258E' })}
${T(508, 240, '4 + 2 = ?', { s: 46, f: '#B4541F' })}
${choice(418, 316, 38, '5')}${choice(508, 316, 38, '6', true, 'm3-pulse')}${choice(598, 316, 38, '7')}
${bubble(372, 394, 210, 52, ['Betul! 6 biji epal.'], 'left')}
<g class="m3-bob">${use('kiko', 590, 380, 92, 92)}</g>`,
};

function shirtInline() {
  return `${shadow(90, 162, 56, 5, 0.2)}<path d="M40 30 L70 17 Q90 32 110 17 L140 30 L164 62 L138 77 L132 67 V152 Q90 160 48 152 V67 L42 77 L16 62Z" fill="url(#m3-lSky)"/><path d="M70 17 Q90 32 110 17 Q100 40 90 40 Q80 40 70 17Z" fill="#2F7FBE"/><circle cx="90" cy="62" r="4" fill="#fff"/><circle cx="90" cy="86" r="4" fill="#fff"/><circle cx="90" cy="110" r="4" fill="#fff"/><rect x="104" y="72" width="22" height="20" rx="4" fill="#5FB3EC" stroke="#fff" stroke-opacity=".5"/>${hl(62, 52, 12, 22, -10, 0.25)}`;
}

function momInline() {
  return people.mom({ x: 0, y: 0, s: 1 });
}
