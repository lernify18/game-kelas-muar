// SVG device frames. Each frame clips its screen content with its own clipPath id;
// `side` draws the visible thickness on the left (tablet, left of the PC) or right (phone).
import { esc, shadow } from './art.mjs';

let n = 0;
const clip = () => `m3-clip${++n}`;

const glare = (x, y, w, h, id) =>
  `<path d="M${x} ${y} h${w * 0.55} L${x} ${y + h * 0.55}Z" fill="url(#m3-vGlare)" clip-path="url(#${id})" data-ui="1"/>`;

export function phone(inner, { label, side = null, cls = '' } = {}) {
  const id = clip();
  const slab = side === 'right' ? 18 : side === 'left' ? 2 : null;
  return `<svg class="m3-dev m3-dev-phone ${cls}" viewBox="0 0 400 790" role="img" aria-label="${esc(label)}" focusable="false">
<defs><clipPath id="${id}"><rect x="26" y="22" width="348" height="736" rx="44"/></clipPath></defs>
${shadow(200, 782, 150, 6, 0.25)}
${slab !== null ? `<rect x="${slab}" y="8" width="380" height="768" rx="58" fill="#120F1A" data-ui="1"/>` : ''}
<rect x="10" y="6" width="380" height="768" rx="58" fill="url(#m3-lBezel)"/>
<rect x="13" y="9" width="374" height="762" rx="55" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="2"/>
<rect x="26" y="22" width="348" height="736" rx="44" fill="#fff"/>
<g clip-path="url(#${id})"><g transform="translate(26 22)">${inner}</g></g>
<rect x="160" y="34" width="80" height="22" rx="11" fill="#0E0C18" data-ui="1"/>
<rect x="150" y="742" width="100" height="5" rx="2.5" fill="#2A1B45" opacity=".35" data-ui="1"/>
${glare(26, 22, 348, 736, id)}
</svg>`;
}

export function tablet(inner, { label, side = null, land = false, cls = '' } = {}) {
  const id = clip();
  const [W, H, sw, sh] = land ? [760, 552, 692, 482] : [580, 770, 512, 692];
  const bw = W - 20, bh = H - 22;
  const slab = side === 'right' ? 18 : side === 'left' ? 2 : null;
  return `<svg class="m3-dev m3-dev-tab ${cls}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}" focusable="false">
<defs><clipPath id="${id}"><rect x="34" y="34" width="${sw}" height="${sh}" rx="20"/></clipPath></defs>
${shadow(W / 2, H - 8, W * 0.38, 6, 0.25)}
${slab !== null ? `<rect x="${slab}" y="8" width="${bw}" height="${bh}" rx="44" fill="#120F1A" data-ui="1"/>` : ''}
<rect x="10" y="6" width="${bw}" height="${bh}" rx="44" fill="url(#m3-lBezel)"/>
<rect x="13" y="9" width="${bw - 6}" height="${bh - 6}" rx="41" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="2"/>
<rect x="34" y="34" width="${sw}" height="${sh}" rx="20" fill="#fff"/>
<g clip-path="url(#${id})"><g transform="translate(34 34)">${inner}</g></g>
<circle cx="${W / 2}" cy="20" r="4" fill="#0E0C18" data-ui="1"/>
${glare(34, 34, sw, sh, id)}
</svg>`;
}

export function monitor(inner, { label, cls = '' } = {}) {
  const id = clip();
  return `<svg class="m3-dev m3-dev-pc ${cls}" viewBox="0 0 1000 720" role="img" aria-label="${esc(label)}" focusable="false">
<defs><clipPath id="${id}"><rect x="26" y="26" width="948" height="540" rx="8"/></clipPath></defs>
${shadow(500, 704, 230, 9, 0.22)}
<path d="M438 598 H562 L584 682 H416Z" fill="url(#m3-lSilver)"/>
<path d="M452 598 H548 L556 630 H444Z" fill="#9E98B5" opacity=".45"/>
<ellipse cx="500" cy="688" rx="176" ry="15" fill="url(#m3-lSilver)"/>
<ellipse cx="470" cy="684" rx="70" ry="4" fill="#fff" opacity=".6"/>
<rect x="10" y="10" width="980" height="592" rx="24" fill="url(#m3-lBezel)"/>
<rect x="13" y="13" width="974" height="586" rx="21" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width="2"/>
<rect x="26" y="26" width="948" height="540" rx="8" fill="#fff"/>
<g clip-path="url(#${id})"><g transform="translate(26 26)">${inner}</g></g>
<circle cx="500" cy="584" r="4" fill="#6B6585" data-ui="1"/>
${glare(26, 26, 948, 540, id)}
</svg>`;
}
