// Shared SVG art. One hidden sprite holds every gradient, filter and symbol; icons and
// illustrations only reference url(#m3-…), so ids never repeat across inlined copies.
// Light comes from the top-left at 45° for every object in the set.

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

export const T = (x, y, str, o = {}) => {
  const { s = 14, w = 700, f = '#202039', a = 'middle', ls, op, cls } = o;
  return `<text x="${x}" y="${y}" font-size="${s}" font-weight="${w}" fill="${f}" text-anchor="${a}"${ls ? ` letter-spacing="${ls}"` : ''}${op ? ` opacity="${op}"` : ''}${cls ? ` class="${cls}"` : ''}>${esc(str)}</text>`;
};

export const use = (id, x, y, w, h, extra = '') =>
  `<use href="#m3-${id}" x="${x}" y="${y}" width="${w}" height="${h}"${extra ? ' ' + extra : ''}/>`;

export const shadow = (cx, cy, rx, ry, o = 0.22) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#2A1B45" opacity="${o}" filter="url(#m3-fBlur)"/>`;

export const hl = (cx, cy, rx, ry, rot = -20, o = 0.3) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" opacity="${o}" transform="rotate(${rot} ${cx} ${cy})"/>`;

export const icon = (body, label) =>
  `<svg class="m3-ic" viewBox="0 0 64 64"${label ? ` role="img" aria-label="${esc(label)}"` : ' aria-hidden="true"'} focusable="false">${body}</svg>`;

const FAM = {
  Purple: ['#B39CFF', '#7856E8', '#4A2CB0'],
  Lav: ['#F3EDFF', '#CDBDF8', '#9C82E6'],
  Sky: ['#D2EEFF', '#82CCFF', '#3D97DA'],
  Mint: ['#C2F5E0', '#76DDB5', '#2FA97B'],
  Coral: ['#FFD0D8', '#FF8FA3', '#DE5571'],
  Sun: ['#FFF3B8', '#FFD66D', '#EFA43A'],
  Peach: ['#FFE0CA', '#FFB385', '#EC8450'],
  Cream: ['#FFFFFF', '#FFF5E4', '#EDD7B5'],
  Brown: ['#EDB989', '#C98450', '#8C4F2B'],
  Apple: ['#FF9C9C', '#EE4650', '#AE1E2B'],
  Leaf: ['#C9F2AE', '#80D27B', '#3B9A54'],
  Skin: ['#FFE7D0', '#F6C49A', '#D99263'],
  Hair: ['#6A4A3E', '#3E2A22', '#1E120E'],
  Cloud: ['#FFFFFF', '#F6F3FF', '#DCD4F4'],
  Silver: ['#FFFFFF', '#E6E3F0', '#B2ADC6'],
  Bezel: ['#4B4663', '#2A2640', '#15121E'],
  Grey: ['#FFFFFF', '#ECEAF3', '#C9C5D8'],
};

const stops = (c) =>
  `<stop offset="0" stop-color="${c[0]}"/><stop offset=".55" stop-color="${c[1]}"/><stop offset="1" stop-color="${c[2]}"/>`;

function gradients() {
  let out = '';
  for (const [k, c] of Object.entries(FAM)) {
    out += `<radialGradient id="m3-r${k}" cx="36%" cy="30%" r="78%">${stops(c)}</radialGradient>`;
    out += `<linearGradient id="m3-l${k}" x1="0" y1="0" x2=".6" y2="1">${stops(c)}</linearGradient>`;
  }
  out += `<linearGradient id="m3-vSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BFE3FF"/><stop offset=".55" stop-color="#EAF5FF"/><stop offset="1" stop-color="#FFF6E6"/></linearGradient>`;
  out += `<linearGradient id="m3-vGrass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B9EBA2"/><stop offset="1" stop-color="#6FC57F"/></linearGradient>`;
  out += `<linearGradient id="m3-vHill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DDF5CF"/><stop offset="1" stop-color="#A9DFA0"/></linearGradient>`;
  out += `<radialGradient id="m3-rResult" cx="50%" cy="40%" r="75%"><stop offset="0" stop-color="#A68BFF"/><stop offset=".6" stop-color="#7856E8"/><stop offset="1" stop-color="#4F30B8"/></radialGradient>`;
  out += `<radialGradient id="m3-rSpace" cx="50%" cy="35%" r="80%"><stop offset="0" stop-color="#F6F1FF"/><stop offset=".7" stop-color="#E4DAFF"/><stop offset="1" stop-color="#CDBDF8"/></radialGradient>`;
  out += `<linearGradient id="m3-vGlare" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient>`;
  return out;
}

function filters() {
  return (
    `<filter id="m3-fBlur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.8"/></filter>` +
    `<filter id="m3-fGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="7"/></filter>` +
    `<filter id="m3-fDrop" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="#41258E" flood-opacity=".18"/></filter>`
  );
}

const STAR = 'M12 1.6l2.95 6.3 6.85.78-5.08 4.68 1.36 6.78L12 16.8l-6.08 3.34 1.36-6.78L2.2 8.68l6.85-.78z';

function symbols() {
  const kiko = `<symbol id="m3-kiko" viewBox="0 0 120 120">
${shadow(60, 113, 30, 5)}
<ellipse cx="85" cy="86" rx="7" ry="4.5" fill="#B87445" transform="rotate(-30 85 86)"/>
<rect x="43" y="95" width="9" height="17" rx="4.5" fill="#8E5230"/><rect x="68" y="95" width="9" height="17" rx="4.5" fill="#8E5230"/>
<rect x="43" y="107" width="9" height="6" rx="3" fill="#3B2A22"/><rect x="68" y="107" width="9" height="6" rx="3" fill="#3B2A22"/>
<ellipse cx="60" cy="87" rx="25" ry="17" fill="url(#m3-rBrown)"/>
<ellipse cx="60" cy="92" rx="13" ry="10" fill="url(#m3-rCream)"/>
<path d="M37 71 Q60 84 83 71 L83 79 Q60 92 37 79Z" fill="url(#m3-lPurple)"/>
<path d="M73 78 l9 15 l-11 -3z" fill="#5A3BC4"/>
<path d="M60 76.5l1.6 3.3 3.6.4-2.7 2.5.7 3.6-3.2-1.8-3.2 1.8.7-3.6-2.7-2.5 3.6-.4z" fill="#FFD66D"/>
<ellipse cx="31" cy="30" rx="10" ry="19" transform="rotate(-36 31 30)" fill="url(#m3-rBrown)"/>
<ellipse cx="31.5" cy="31" rx="5" ry="11.5" transform="rotate(-36 31.5 31)" fill="#F7A99A"/>
<ellipse cx="89" cy="30" rx="10" ry="19" transform="rotate(36 89 30)" fill="url(#m3-rBrown)"/>
<ellipse cx="88.5" cy="31" rx="5" ry="11.5" transform="rotate(36 88.5 31)" fill="#F7A99A"/>
<ellipse cx="60" cy="50" rx="33" ry="29" fill="url(#m3-rBrown)"/>
<ellipse cx="60" cy="64" rx="18.5" ry="12.5" fill="url(#m3-rCream)"/>
<g class="m3-eye"><ellipse cx="46" cy="47" rx="6.2" ry="7.6" fill="#2A1B45"/><circle cx="48.3" cy="44.2" r="2.5" fill="#fff"/><circle cx="44.6" cy="50.2" r="1.1" fill="#fff" opacity=".8"/></g>
<g class="m3-eye"><ellipse cx="74" cy="47" rx="6.2" ry="7.6" fill="#2A1B45"/><circle cx="76.3" cy="44.2" r="2.5" fill="#fff"/><circle cx="72.6" cy="50.2" r="1.1" fill="#fff" opacity=".8"/></g>
<ellipse cx="37" cy="60" rx="5.5" ry="3.2" fill="#FF8FA3" opacity=".55"/><ellipse cx="83" cy="60" rx="5.5" ry="3.2" fill="#FF8FA3" opacity=".55"/>
<ellipse cx="60" cy="59.5" rx="5.4" ry="3.7" fill="#2A1B45"/><ellipse cx="58.5" cy="58.4" rx="1.7" ry="1" fill="#fff" opacity=".7"/>
<path d="M52.5 66 Q60 72.5 67.5 66" stroke="#2A1B45" stroke-width="2.3" fill="none" stroke-linecap="round"/>
${hl(46, 31, 13, 7, -18, 0.28)}
</symbol>`;

  const hand = `<symbol id="m3-hand" viewBox="0 0 64 84">
${shadow(36, 80, 16, 3)}
<rect x="17" y="62" width="34" height="18" rx="6" fill="url(#m3-lPurple)"/>
<rect x="19" y="63" width="30" height="5" rx="2.5" fill="#fff" opacity=".28"/>
<rect x="14" y="33" width="38" height="33" rx="14" fill="url(#m3-rSkin)"/>
<rect x="18" y="3" width="12.5" height="42" rx="6.25" fill="url(#m3-lSkin)"/>
<rect x="20.4" y="5.5" width="7.6" height="6.5" rx="3.2" fill="#FFEBDD"/>
<ellipse cx="21.6" cy="20" rx="2" ry="6" fill="#fff" opacity=".35"/>
<path d="M31 40 q5 -4.5 10 0 M41 42 q5 -4.5 10 0" stroke="#D18A5C" stroke-width="2" fill="none" stroke-linecap="round"/>
<ellipse cx="13" cy="47" rx="7" ry="10.5" transform="rotate(26 13 47)" fill="url(#m3-rSkin)"/>
${hl(24, 40, 6, 3, -10, 0.25)}
</symbol>`;

  const star = `<symbol id="m3-star" viewBox="0 0 24 24"><path d="${STAR}" fill="url(#m3-rSun)" stroke="#E2952C" stroke-width=".7" stroke-linejoin="round"/><ellipse cx="9.6" cy="8.6" rx="2.4" ry="1.3" fill="#fff" opacity=".55" transform="rotate(-25 9.6 8.6)"/></symbol>`;
  const starOff = `<symbol id="m3-starOff" viewBox="0 0 24 24"><path d="${STAR}" fill="#EDE8FA" stroke="#CFC5EE" stroke-width=".9" stroke-linejoin="round"/></symbol>`;

  const apple = `<symbol id="m3-apple" viewBox="0 0 40 46">
${shadow(20, 43, 13, 2.4)}
<path d="M20 13 C8 6 0 16 2.5 28 C5 39 13 44 20 40.5 C27 44 35 39 37.5 28 C40 16 32 6 20 13Z" fill="url(#m3-rApple)"/>
<path d="M19 13 Q18 7 21 3" stroke="#7A4A2A" stroke-width="2.6" fill="none" stroke-linecap="round"/>
<path d="M21.5 8 C25 3 31 3 33 5 C30 9.5 25 10 21.5 8Z" fill="url(#m3-lLeaf)"/>
${hl(11, 19, 4, 6.5, -25, 0.5)}
</symbol>`;

  const check = `<symbol id="m3-check" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="url(#m3-rMint)"/><ellipse cx="8.5" cy="7" rx="4" ry="2" fill="#fff" opacity=".35" transform="rotate(-25 8.5 7)"/><path d="M6.8 12.4l3.3 3.3 7-7.1" stroke="#fff" stroke-width="2.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/></symbol>`;
  const cross = `<symbol id="m3-cross" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="url(#m3-rCoral)"/><ellipse cx="8.5" cy="7" rx="4" ry="2" fill="#fff" opacity=".35" transform="rotate(-25 8.5 7)"/><path d="M8.2 8.2l7.6 7.6M15.8 8.2l-7.6 7.6" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></symbol>`;

  const sticker = `<symbol id="m3-sticker" viewBox="0 0 80 80">
${shadow(40, 76, 24, 3.5)}
<circle cx="40" cy="38" r="35" fill="#fff"/>
<circle cx="40" cy="38" r="35" fill="none" stroke="#EDE5FF" stroke-width="2"/>
<circle cx="40" cy="38" r="29" fill="url(#m3-rPurple)"/>
<path d="M40 14l6 12.6 13.8 1.6-10.2 9.4 2.7 13.6L40 44.4l-12.3 6.8 2.7-13.6-10.2-9.4L34 26.6z" fill="url(#m3-rSun)" stroke="#E2952C" stroke-width=".8"/>
${hl(31, 22, 9, 4, -25, 0.3)}
<rect x="15" y="52" width="50" height="15" rx="7.5" fill="url(#m3-lCoral)"/>
${T(40, 63.2, 'HEBAT', { s: 10, w: 700, f: '#fff', ls: 1 })}
</symbol>`;

  const cloud = `<symbol id="m3-cloud" viewBox="0 0 100 50"><path d="M20 44 A12 12 0 0 1 22 20.5 A18 18 0 0 1 56 12 A14 14 0 0 1 80 24 A10 10 0 0 1 82 44 Z" fill="url(#m3-rCloud)"/><ellipse cx="44" cy="17" rx="13" ry="4.5" fill="#fff" opacity=".8"/></symbol>`;

  const tree = `<symbol id="m3-tree" viewBox="0 0 40 60">${shadow(20, 57, 12, 2.5)}<rect x="17" y="34" width="6" height="22" rx="3" fill="url(#m3-lBrown)"/><circle cx="20" cy="24" r="16" fill="url(#m3-rLeaf)"/><circle cx="12" cy="31" r="9" fill="url(#m3-rLeaf)"/><circle cx="29" cy="31" r="9" fill="url(#m3-rLeaf)"/>${hl(14, 16, 6, 3.5, -25, 0.35)}</symbol>`;

  const sparkle = `<symbol id="m3-spark" viewBox="0 0 20 20"><path d="M10 0 C11 7 13 9 20 10 C13 11 11 13 10 20 C9 13 7 11 0 10 C7 9 9 7 10 0Z" fill="#FFD66D"/></symbol>`;

  return kiko + hand + star + starOff + apple + check + cross + sticker + cloud + tree + sparkle;
}

export const sprite = () =>
  `<svg class="m3-sprite" width="0" height="0" aria-hidden="true" focusable="false"><defs>${gradients()}${filters()}</defs>${symbols()}</svg>`;

/* ---------- 64×64 icons ---------- */

const block = (x, y, w, fam, dark, inner) =>
  `<rect x="${x + 4}" y="${y + 5}" width="${w}" height="${w}" rx="${w * 0.26}" fill="${dark}"/>` +
  `<rect x="${x}" y="${y}" width="${w}" height="${w}" rx="${w * 0.26}" fill="url(#m3-l${fam})"/>` +
  `<rect x="${x + 4}" y="${y + 3}" width="${w - 8}" height="${w * 0.3}" rx="${w * 0.15}" fill="#fff" opacity=".25"/>` +
  inner;

export const IC = {
  huruf: () =>
    shadow(30, 58, 20, 3) +
    block(10, 14, 36, 'Coral', '#C8475F', T(28, 42.5, 'A', { s: 25, f: '#fff' })) +
    `<path d="M52 22 q5 6 0 12 M57 18 q9 10 0 20" stroke="url(#m3-lSky)" stroke-width="3.4" fill="none" stroke-linecap="round"/>`,
  pulau: () =>
    `<ellipse cx="32" cy="50" rx="27" ry="8" fill="url(#m3-lSky)"/><ellipse cx="26" cy="47" rx="10" ry="2" fill="#fff" opacity=".45"/>` +
    `<path d="M14 49 C18 37 46 37 50 49Z" fill="url(#m3-lSun)"/>` +
    `<path d="M33 46 C33 34 30 26 26 18" stroke="url(#m3-lBrown)" stroke-width="4" fill="none" stroke-linecap="round"/>` +
    `<path d="M26 18 C18 12 9 14 6 20 C14 18 20 20 26 18Z M26 18 C30 9 40 8 45 12 C37 13 31 15 26 18Z M26 18 C33 18 41 23 42 30 C36 25 30 21 26 18Z M26 18 C20 21 15 28 15 34 C19 27 23 22 26 18Z" fill="url(#m3-lLeaf)"/>` +
    `<rect x="37" y="28" width="22" height="16" rx="5" fill="#fff" stroke="#CDBDF8" stroke-width="1.5"/>` +
    T(48, 40, 'ba', { s: 11, f: '#7856E8' }),
  bandar: () =>
    shadow(32, 58, 24, 3) +
    `<rect x="8" y="26" width="16" height="30" rx="4" fill="url(#m3-lPeach)"/><rect x="24" y="12" width="18" height="44" rx="4" fill="url(#m3-lSun)"/><rect x="42" y="22" width="15" height="34" rx="4" fill="url(#m3-lSky)"/>` +
    T(16, 42, 'B', { s: 11, f: '#fff' }) + T(33, 30, 'O', { s: 12, f: '#9A5B00' }) + T(33, 46, 'L', { s: 12, f: '#9A5B00' }) + T(49.5, 38, 'A', { s: 11, f: '#fff' }) +
    `<rect x="27" y="14" width="12" height="4" rx="2" fill="#fff" opacity=".4"/>`,
  taman: () =>
    shadow(32, 58, 22, 3) +
    `<path d="M32 26 C24 20 14 20 8 23 V52 C14 49 24 49 32 55Z" fill="url(#m3-lCream)" stroke="#E2C9A2" stroke-width="1.2"/>` +
    `<path d="M32 26 C40 20 50 20 56 23 V52 C50 49 40 49 32 55Z" fill="url(#m3-lCream)" stroke="#E2C9A2" stroke-width="1.2"/>` +
    T(20, 37, 'Ibu', { s: 7.5, w: 600, f: '#7A6A55' }) + T(44, 37, 'baca', { s: 7.5, w: 600, f: '#7A6A55' }) +
    `<path d="M32 26 V10" stroke="#3B9A54" stroke-width="2.4" stroke-linecap="round"/>` +
    `<path d="M32 18 C27 16 25 12 26 9 C30 10 32 13 32 18Z" fill="url(#m3-lLeaf)"/>` +
    `<circle cx="32" cy="8" r="6.5" fill="url(#m3-rCoral)"/><circle cx="32" cy="8" r="2.6" fill="#FFD66D"/>`,
  planet: () =>
    shadow(32, 58, 18, 3) +
    `<circle cx="32" cy="31" r="19" fill="url(#m3-rPurple)"/>` +
    `<ellipse cx="32" cy="33" rx="29" ry="8" fill="none" stroke="url(#m3-lSun)" stroke-width="3.4" transform="rotate(-14 32 33)"/>` +
    T(32, 36, '123', { s: 11, f: '#fff' }) + hl(25, 22, 6, 3.5, -25, 0.32) +
    use('spark', 50, 4, 10, 10) + use('spark', 4, 8, 7, 7),
  misi: () =>
    shadow(32, 58, 24, 3) +
    block(6, 18, 28, 'Coral', '#C8475F', `<path d="M20 25 v14 M13 32 h14" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`) +
    block(31, 22, 26, 'Sky', '#2F7FBE', `<path d="M37.5 35 h13" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`),
  world: () =>
    shadow(32, 58, 18, 3) +
    `<circle cx="32" cy="31" r="20" fill="url(#m3-rSky)"/>` +
    `<path d="M20 24 C24 18 32 20 33 26 C34 31 27 33 26 38 C22 37 17 30 20 24Z M38 36 C42 33 49 35 49 40 C46 46 40 48 37 45 C35 42 35 38 38 36Z M38 15 C42 14 46 17 45 20 C41 21 38 19 38 15Z" fill="url(#m3-lMint)"/>` +
    `<ellipse cx="32" cy="33" rx="30" ry="7.5" fill="none" stroke="url(#m3-lPurple)" stroke-width="3" transform="rotate(-12 32 33)"/>` +
    hl(24, 20, 6, 3.5, -25, 0.35) + use('spark', 49, 5, 10, 10) + use('spark', 5, 44, 7, 7),
  modes: () =>
    shadow(32, 56, 24, 3) +
    `<path d="M12 22 H52 C58 22 61 30 61 38 C61 47 56 52 51 49 L44 42 H20 L13 49 C8 52 3 47 3 38 C3 30 6 22 12 22Z" fill="url(#m3-lPurple)"/>` +
    `<rect x="12" y="24" width="40" height="5" rx="2.5" fill="#fff" opacity=".25"/>` +
    `<path d="M17 30 v12 M11 36 h12" stroke="#fff" stroke-width="4" stroke-linecap="round"/>` +
    `<circle cx="44" cy="31" r="3.4" fill="#FFD66D"/><circle cx="51" cy="36" r="3.4" fill="#FF8FA3"/><circle cx="37" cy="37" r="3.4" fill="#76DDB5"/><circle cx="44" cy="42" r="3.4" fill="#82CCFF"/>`,
  eight: () =>
    shadow(32, 59, 18, 3) +
    `<rect x="12" y="10" width="40" height="48" rx="8" fill="url(#m3-lCream)" stroke="#E7D3B2" stroke-width="1.3"/>` +
    `<rect x="22" y="5" width="20" height="10" rx="4" fill="url(#m3-lPurple)"/>` +
    T(32, 44, '8', { s: 28, f: '#7856E8' }) + use('check', 39, 44, 13, 13),
  reward: () =>
    `<g transform="translate(6 10) scale(.6)">${`<use href="#m3-sticker" width="80" height="80"/>`}</g>` +
    use('star', 30, 4, 30, 30) + use('spark', 50, 34, 10, 10),
  stairs: () =>
    shadow(32, 58, 26, 3) +
    `<rect x="6" y="40" width="17" height="16" rx="4" fill="url(#m3-lMint)"/><rect x="23" y="29" width="17" height="27" rx="4" fill="url(#m3-lSky)"/><rect x="40" y="18" width="17" height="38" rx="4" fill="url(#m3-lPurple)"/>` +
    `<rect x="8" y="42" width="13" height="4" rx="2" fill="#fff" opacity=".35"/><rect x="25" y="31" width="13" height="4" rx="2" fill="#fff" opacity=".35"/><rect x="42" y="20" width="13" height="4" rx="2" fill="#fff" opacity=".35"/>` +
    `<path d="M48.5 18 V4" stroke="#7A4A2A" stroke-width="2.2" stroke-linecap="round"/><path d="M49 4 L60 8 L49 12Z" fill="url(#m3-lCoral)"/>` +
    use('star', 9, 26, 12, 12),
  sticker: () => `<use href="#m3-sticker" x="2" y="2" width="60" height="60"/>` + use('spark', 48, 2, 12, 12),
  detect: () =>
    shadow(28, 58, 18, 3) +
    `<path d="M44 44 L58 58" stroke="url(#m3-lBrown)" stroke-width="8" stroke-linecap="round"/>` +
    `<circle cx="28" cy="28" r="19" fill="url(#m3-rSky)" opacity=".55"/><circle cx="28" cy="28" r="19" fill="none" stroke="url(#m3-lPurple)" stroke-width="5.5"/>` +
    `<rect x="18" y="30" width="5" height="8" rx="1.5" fill="#76DDB5"/><rect x="25.5" y="22" width="5" height="16" rx="1.5" fill="#7856E8"/><rect x="33" y="33" width="5" height="5" rx="1.5" fill="#FF8FA3"/>` +
    hl(21, 18, 6, 3, -30, 0.5),
  retry: () =>
    shadow(32, 58, 20, 3) +
    `<path d="M50 30 A18 18 0 1 0 44 45" stroke="url(#m3-lMint)" stroke-width="6" fill="none" stroke-linecap="round"/>` +
    `<path d="M54 22 L51 34 L41 28Z" fill="#2FA97B"/>` +
    use('star', 21, 19, 22, 22),
  report: () =>
    shadow(32, 59, 18, 3) +
    `<rect x="11" y="9" width="42" height="49" rx="8" fill="url(#m3-lCream)" stroke="#E7D3B2" stroke-width="1.3"/>` +
    `<rect x="22" y="4" width="20" height="10" rx="4" fill="url(#m3-lCoral)"/>` +
    `<path d="M18 46 L27 36 L34 41 L46 25" stroke="#7856E8" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<circle cx="46" cy="25" r="3.6" fill="#FFD66D" stroke="#E2952C" stroke-width="1"/>` + T(32, 54, 'LAPORAN', { s: 6, f: '#8A6BB8' }),
};

/* ---------- people ---------- */

function kid({ x, y, s = 1, shirt = 'Sky', face = 'happy', arm = 'none', pony = false }) {
  const eyes = {
    happy: `<path d="M34 63 q5 -6 10 0 M56 63 q5 -6 10 0" stroke="#2A1B45" stroke-width="2.8" fill="none" stroke-linecap="round"/>`,
    puzzled:
      `<ellipse cx="39" cy="62" rx="3.7" ry="4.7" fill="#2A1B45"/><ellipse cx="61" cy="62" rx="3.7" ry="4.7" fill="#2A1B45"/><circle cx="40.4" cy="60.4" r="1.4" fill="#fff"/><circle cx="62.4" cy="60.4" r="1.4" fill="#fff"/>` +
      `<path d="M32 52 q6 -6 13 -2 M56 54 q6 -1 12 1" stroke="#3E2A22" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,
    bored:
      `<path d="M33 61 h11 M56 61 h11" stroke="#3E2A22" stroke-width="2.4" stroke-linecap="round"/><path d="M34.5 62 a4.5 4 0 0 0 8 0Z M57.5 62 a4.5 4 0 0 0 8 0Z" fill="#2A1B45"/>`,
  }[face];
  const mouth = {
    happy: `<path d="M42 73 q8 9 16 0Z" fill="#E25C78"/>`,
    puzzled: `<path d="M44 77 q3 -3 6 0 q3 3 6 0" stroke="#7A3A2A" stroke-width="2.2" fill="none" stroke-linecap="round"/>`,
    bored: `<path d="M45 77 h10" stroke="#7A3A2A" stroke-width="2.4" stroke-linecap="round"/>`,
  }[face];
  const arms = {
    none: '',
    scratch: `<path d="M74 114 C88 102 92 82 83 68" stroke="url(#m3-l${shirt})" stroke-width="12" fill="none" stroke-linecap="round"/><circle cx="82" cy="65" r="7.5" fill="url(#m3-rSkin)"/>`,
    chin: `<path d="M30 146 C30 124 36 104 44 94" stroke="url(#m3-l${shirt})" stroke-width="12" fill="none" stroke-linecap="round"/><ellipse cx="46" cy="90" rx="9" ry="7" fill="url(#m3-rSkin)"/>`,
    wave: `<path d="M76 116 C90 106 94 92 92 80" stroke="url(#m3-l${shirt})" stroke-width="12" fill="none" stroke-linecap="round"/><circle cx="92" cy="76" r="7.5" fill="url(#m3-rSkin)"/>`,
  }[arm];
  return `<g transform="translate(${x} ${y}) scale(${s})">
${shadow(50, 147, 32, 5)}
<path d="M20 149 C20 113 32 100 50 100 C68 100 80 113 80 149Z" fill="url(#m3-l${shirt})"/>
<path d="M39 101 Q50 110 61 101" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="3" stroke-linecap="round"/>
${hl(34, 116, 8, 5, -20, 0.25)}
<rect x="43" y="87" width="14" height="17" rx="6" fill="#E3A57B"/>
<circle cx="19" cy="62" r="7" fill="url(#m3-rSkin)"/><circle cx="81" cy="62" r="7" fill="url(#m3-rSkin)"/>
<circle cx="50" cy="58" r="32" fill="url(#m3-rSkin)"/>
${pony ? `<circle cx="84" cy="34" r="11" fill="url(#m3-rHair)"/><circle cx="77" cy="27" r="5" fill="url(#m3-rCoral)"/>` : ''}
<path d="M17 57 C14 27 34 18 52 19 C72 20 88 32 83 58 C80 46 72 38 58 37 C52 44 40 46 30 44 C24 47 20 52 17 57Z" fill="url(#m3-rHair)"/>
${hl(38, 28, 10, 4, -15, 0.22)}
${eyes}
<ellipse cx="32" cy="70" rx="5" ry="3" fill="#FF8FA3" opacity=".45"/><ellipse cx="68" cy="70" rx="5" ry="3" fill="#FF8FA3" opacity=".45"/>
${mouth}
${arms}
</g>`;
}

function mom({ x, y, s = 1 }) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
${shadow(60, 167, 40, 5)}
<path d="M14 169 C14 123 34 104 60 104 C86 104 106 123 106 169Z" fill="url(#m3-lPurple)"/>
${hl(38, 124, 10, 6, -20, 0.22)}
<path d="M22 70 C22 30 42 13 60 13 C78 13 98 30 98 70 C98 100 86 119 60 125 C34 119 22 100 22 70Z" fill="url(#m3-lLav)"/>
<ellipse cx="60" cy="67" rx="24" ry="27" fill="url(#m3-rSkin)"/>
<path d="M35 54 C36 37 48 30 60 30 C72 30 84 37 85 54 C78 45 70 42 60 42 C50 42 42 45 35 54Z" fill="url(#m3-lLav)"/>
${hl(44, 28, 12, 6, -22, 0.35)}
<ellipse cx="52" cy="68" rx="3.2" ry="3.9" fill="#2A1B45"/><ellipse cx="70" cy="68" rx="3.2" ry="3.9" fill="#2A1B45"/><circle cx="53.2" cy="66.6" r="1.1" fill="#fff"/><circle cx="71.2" cy="66.6" r="1.1" fill="#fff"/>
<path d="M46 59 q5 -3 10 0 M64 59 q5 -3 10 0" stroke="#5A3A2E" stroke-width="2" fill="none" stroke-linecap="round"/>
<path d="M54 80 q6 5 12 0" stroke="#A0453A" stroke-width="2.4" fill="none" stroke-linecap="round"/>
<ellipse cx="45" cy="77" rx="4.5" ry="2.6" fill="#FF8FA3" opacity=".45"/><ellipse cx="76" cy="77" rx="4.5" ry="2.6" fill="#FF8FA3" opacity=".45"/>
<circle cx="60" cy="119" r="4.5" fill="url(#m3-rSun)"/>
</g>`;
}

const card3d = (x, y, w, h, fam, dark, label, size = 18) =>
  `<rect x="${x}" y="${y + 5}" width="${w}" height="${h}" rx="10" fill="${dark}"/>` +
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="url(#m3-l${fam})"/>` +
  `<rect x="${x + 5}" y="${y + 3}" width="${w - 10}" height="${h * 0.28}" rx="5" fill="#fff" opacity=".28"/>` +
  T(x + w / 2, y + h / 2 + size * 0.36, label, { s: size, f: '#fff' });

/* ---------- problem illustrations (320×220) ---------- */

export const PROB = {
  huruf: () => `<svg class="m3-illus" viewBox="0 0 320 220" role="img" aria-label="Anak keliru melihat kad suku kata BA, BI dan BU" focusable="false">
${shadow(232, 204, 70, 6, 0.18)}
<path d="M232 168 C214 158 186 158 168 164 V202 C186 196 214 196 232 204Z" fill="url(#m3-lCream)" stroke="#E2C9A2" stroke-width="1.5"/>
<path d="M232 168 C250 158 278 158 296 164 V202 C278 196 250 196 232 204Z" fill="url(#m3-lCream)" stroke="#E2C9A2" stroke-width="1.5"/>
${T(200, 186, 'ba bi bu', { s: 12, w: 600, f: '#8C7656' })}${T(264, 186, 'ca ci cu', { s: 12, w: 600, f: '#8C7656' })}
${T(232, 160, 'Buku Suku Kata', { s: 11, w: 700, f: '#7856E8' })}
${kid({ x: 22, y: 52, s: 1.04, shirt: 'Sky', face: 'puzzled', arm: 'scratch' })}
<g class="m3-bob"><circle cx="118" cy="44" r="17" fill="#fff" filter="url(#m3-fDrop)"/>${T(118, 52, '?', { s: 24, f: '#7856E8' })}</g>
<g class="m3-bob m3-d1">${card3d(168, 26, 56, 44, 'Purple', '#4A2CB0', 'BA')}</g>
<g class="m3-bob m3-d2">${card3d(240, 52, 56, 44, 'Coral', '#C8475F', 'BI')}</g>
<g class="m3-bob m3-d3">${card3d(176, 92, 56, 44, 'Sky', '#2F7FBE', 'BU')}</g>
${use('spark', 290, 22, 14, 14)}
</svg>`,

  fokus: () => `<svg class="m3-illus" viewBox="0 0 320 220" role="img" aria-label="Anak bosan dengan buku latihan, manakala skrin game interaktif berwarna-warni di sebelahnya" focusable="false">
<g class="m3-zz">${T(30, 46, 'z', { s: 16, f: '#B6AFC9' })}${T(44, 34, 'z', { s: 20, f: '#B6AFC9' })}</g>
${kid({ x: 60, y: 22, s: 0.98, shirt: 'Lav', face: 'bored', arm: 'chin', pony: true })}
<rect x="10" y="170" width="200" height="16" rx="8" fill="#E5DFF2"/>
<g transform="translate(-6 14) rotate(-5 70 150)"><rect x="22" y="124" width="104" height="58" rx="6" fill="#fff" stroke="#DAD5E6" stroke-width="1.5"/>
${T(74, 140, 'Latihan 12', { s: 10, w: 700, f: '#9A95AD' })}${T(30, 156, '1) ba + ju = ____', { s: 9, w: 600, f: '#A9A4BA', a: 'start' })}${T(30, 170, '2) 7 - 3 = ____', { s: 9, w: 600, f: '#A9A4BA', a: 'start' })}</g>
<g class="m3-float-s">
<ellipse cx="248" cy="104" rx="66" ry="60" fill="#FFD66D" opacity=".35" filter="url(#m3-fGlow)"/>
<rect x="190" y="40" width="118" height="150" rx="16" fill="url(#m3-lBezel)"/>
<rect x="198" y="48" width="102" height="134" rx="10" fill="url(#m3-vSky)"/>
${T(249, 68, 'Hebat!', { s: 15, f: '#7856E8' })}
${use('star', 214, 76, 20, 20)}${use('star', 238, 72, 24, 24)}${use('star', 266, 76, 20, 20)}
${use('kiko', 220, 100, 58, 58)}
<rect x="214" y="160" width="70" height="16" rx="8" fill="url(#m3-lPurple)"/>${T(249, 171.5, 'Main lagi', { s: 9, f: '#fff' })}
</g>
${use('spark', 180, 30, 14, 14, 'class="m3-twinkle"')}${use('spark', 302, 24, 12, 12, 'class="m3-twinkle m3-d2"')}
</svg>`,

  pantau: () => `<svg class="m3-illus" viewBox="0 0 320 220" role="img" aria-label="Ibu melihat papan laporan kemahiran anak dengan bahagian ejaan ditanda perlu latihan" focusable="false">
${mom({ x: 6, y: 44, s: 1 })}
<rect x="128" y="22" width="182" height="176" rx="16" fill="#fff" filter="url(#m3-fDrop)"/>
${T(142, 46, 'Laporan Kemahiran Aina', { s: 11.5, w: 700, f: '#41258E', a: 'start' })}
${[
  ['Huruf', 0.9, 'Mint', '90%'],
  ['Suku Kata', 0.75, 'Sky', '75%'],
  ['Ejaan', 0.4, 'Coral', '40%'],
  ['Tambah', 0.65, 'Sun', '65%'],
]
  .map(([l, v, c, p], i) => {
    const yy = 70 + i * 32;
    return (
      T(142, yy, l, { s: 10.5, w: 600, f: '#4A4A6A', a: 'start' }) +
      T(296, yy, p, { s: 10.5, w: 700, f: '#4A4A6A', a: 'end' }) +
      `<rect x="142" y="${yy + 6}" width="154" height="8" rx="4" fill="#EEEAF7" data-ui="1"/>` +
      `<rect x="142" y="${yy + 6}" width="${154 * v}" height="8" rx="4" fill="url(#m3-l${c})" data-ui="1"/>`
    );
  })
  .join('')}
<rect x="134" y="125" width="170" height="34" rx="9" fill="none" stroke="#FF8FA3" stroke-width="2" stroke-dasharray="5 4"/>
<g class="m3-pulse"><rect x="190" y="122" width="78" height="18" rx="9" fill="#FFE3E9"/>${T(229, 134.5, 'Perlu latihan', { s: 9.5, w: 700, f: '#C8475F' })}</g>
</svg>`,
};

/* ---------- comparison illustrations (220×140) ---------- */

export const CMP = {
  biasa: () => `<svg class="m3-cmp-art" viewBox="0 0 220 140" role="img" aria-label="Kertas latihan yang sama untuk semua anak" focusable="false">
${shadow(110, 132, 70, 5, 0.15)}
<g transform="rotate(-8 90 70)"><rect x="40" y="22" width="110" height="104" rx="8" fill="#F1EEF7" stroke="#DCD7E8"/></g>
<g transform="rotate(4 120 70)"><rect x="60" y="14" width="110" height="110" rx="8" fill="#fff" stroke="#DCD7E8" stroke-width="1.5"/>
${T(115, 36, 'Latihan Harian', { s: 11, w: 700, f: '#8E89A3' })}
${T(72, 58, '1) 3 + 4 = ____', { s: 10, w: 600, f: '#A39EB6', a: 'start' })}${T(72, 76, '2) 5 + 2 = ____', { s: 10, w: 600, f: '#A39EB6', a: 'start' })}${T(72, 94, '3) 6 + 1 = ____', { s: 10, w: 600, f: '#A39EB6', a: 'start' })}${T(72, 112, '4) 2 + 5 = ____', { s: 10, w: 600, f: '#A39EB6', a: 'start' })}</g>
<path d="M170 26 l10 -10 6 6 -10 10z" fill="#C9C5D8"/><rect x="150" y="30" width="8" height="54" rx="3" transform="rotate(45 154 57)" fill="#D7D2E4"/>
</svg>`,
  misi: () => `<svg class="m3-cmp-art" viewBox="0 0 220 140" role="img" aria-label="Tablet memaparkan peta misi bersama Kiko, bintang dan kemajuan" focusable="false">
<ellipse cx="110" cy="70" rx="90" ry="54" fill="#FFD66D" opacity=".3" filter="url(#m3-fGlow)"/>
${shadow(110, 132, 76, 5, 0.18)}
<rect x="28" y="12" width="164" height="116" rx="14" fill="url(#m3-lBezel)"/>
<rect x="36" y="20" width="148" height="100" rx="8" fill="url(#m3-vSky)"/>
<path d="M60 96 C80 70 100 96 120 70 C136 50 150 66 164 46" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-dasharray="1 9"/>
<circle cx="60" cy="96" r="9" fill="url(#m3-rCoral)"/><circle cx="120" cy="70" r="9" fill="url(#m3-rSky)"/><circle cx="164" cy="46" r="9" fill="url(#m3-rPurple)"/>
${use('star', 112, 48, 16, 16)}${use('star', 52, 74, 16, 16)}
${use('kiko', 132, 70, 48, 48, 'class="m3-bob"')}
<rect x="44" y="27" width="60" height="14" rx="7" fill="#fff"/>${T(74, 37.5, 'Tahap 2', { s: 9, f: '#7856E8' })}
</svg>`,
};

/* ---------- demo pictures ---------- */

export const shirtArt = () => `<svg class="m3-dart" viewBox="0 0 180 170" role="img" aria-label="Gambar sehelai baju" focusable="false">
${shadow(90, 162, 56, 5, 0.2)}
<path d="M40 30 L70 17 Q90 32 110 17 L140 30 L164 62 L138 77 L132 67 V152 Q90 160 48 152 V67 L42 77 L16 62Z" fill="url(#m3-lSky)"/>
<path d="M70 17 Q90 32 110 17 Q100 40 90 40 Q80 40 70 17Z" fill="#2F7FBE"/>
<path d="M90 40 V150" stroke="#fff" stroke-opacity=".35" stroke-width="2"/>
<circle cx="90" cy="62" r="4" fill="#fff"/><circle cx="90" cy="86" r="4" fill="#fff"/><circle cx="90" cy="110" r="4" fill="#fff"/>
<rect x="104" y="72" width="22" height="20" rx="4" fill="#5FB3EC" stroke="#fff" stroke-opacity=".5"/>
${hl(62, 52, 12, 22, -10, 0.25)}
</svg>`;

export const applesArt = () => `<svg class="m3-dart" viewBox="0 0 300 130" role="img" aria-label="Empat biji epal ditambah dua biji epal" focusable="false">
<g class="m3-grp-a">${use('apple', 12, 14, 46, 52)}${use('apple', 62, 14, 46, 52)}${use('apple', 12, 68, 46, 52)}${use('apple', 62, 68, 46, 52)}</g>
${T(146, 82, '+', { s: 44, f: '#E25C78' })}
<g class="m3-grp-b">${use('apple', 186, 40, 46, 52)}${use('apple', 236, 40, 46, 52)}</g>
</svg>`;

export const people = { kid, mom };
