// Ikon SVG 3D untuk stage (cahaya atas-kiri 45°, gradient 3 hentian, highlight, rim, bayang sentuh).
// Semua <defs> dan <symbol> dipancarkan SEKALI dalam sprite tersembunyi; badan ikon hanya merujuk url(#…).
(function (root) {
  const SPRITE = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
    <filter id="sh-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.8"/></filter>

    <linearGradient id="bk-cover" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9b7bff"/><stop offset=".5" stop-color="#6c47e8"/><stop offset="1" stop-color="#3f23a8"/></linearGradient>
    <linearGradient id="bk-pageL" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#f4efe3"/><stop offset="1" stop-color="#d9cfb8"/></linearGradient>
    <linearGradient id="bk-pageR" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#f1ebdd"/><stop offset="1" stop-color="#d4c9b0"/></linearGradient>
    <linearGradient id="bk-spine" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset=".5" stop-color="#000" stop-opacity=".28"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
    <symbol id="ic-book" viewBox="0 0 64 64">
      <ellipse cx="32" cy="55" rx="25" ry="3.2" fill="#000" opacity=".24" filter="url(#sh-blur)"/>
      <path d="M5 20 Q18 15 32 19 Q46 15 59 20 L59 51 Q46 46 32 50 Q18 46 5 51 Z" fill="url(#bk-cover)"/>
      <path d="M7 17 Q19 12 31 16 L31 47 Q19 43 7 48 Z" fill="url(#bk-pageL)"/>
      <path d="M57 17 Q45 12 33 16 L33 47 Q45 43 57 48 Z" fill="url(#bk-pageR)"/>
      <rect x="28" y="15" width="8" height="33" fill="url(#bk-spine)"/>
      <g stroke="#b9ad93" stroke-width="1.3" stroke-linecap="round" opacity=".8">
        <path d="M11 22 Q19 19.5 27 21.5"/><path d="M11 27 Q19 24.5 27 26.5"/><path d="M11 32 Q19 29.5 27 31.5"/><path d="M11 37 Q17 35 23 36"/>
        <path d="M37 21.5 Q45 19.5 53 22"/><path d="M37 26.5 Q45 24.5 53 27"/><path d="M37 31.5 Q45 29.5 53 32"/><path d="M37 36.5 Q43 35 49 36.5"/>
      </g>
      <ellipse cx="17" cy="19" rx="7" ry="2.2" fill="#fff" opacity=".3"/>
      <path d="M5 20 Q18 15 32 19 Q46 15 59 20 L59 21.6 Q46 16.8 32 20.6 Q18 16.8 5 21.6 Z" fill="#fff" opacity=".22"/>
    </symbol>

    <radialGradient id="st-body" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff3b0"/><stop offset=".45" stop-color="#ffc53d"/><stop offset="1" stop-color="#e08a00"/></radialGradient>
    <symbol id="ic-star" viewBox="0 0 64 64">
      <ellipse cx="32" cy="58" rx="17" ry="2.6" fill="#000" opacity=".24" filter="url(#sh-blur)"/>
      <path d="M32 5 L39.6 21.4 57.5 23.5 44.3 35.7 47.8 53.4 32 44.6 16.2 53.4 19.7 35.7 6.5 23.5 24.4 21.4Z" fill="url(#st-body)" stroke="#d07a00" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="M32 9 L37.8 21.6 Q32 20 26.2 21.6Z" fill="#fff" opacity=".28"/>
      <ellipse cx="25" cy="25" rx="6" ry="3.4" fill="#fff" opacity=".3" transform="rotate(-30 25 25)"/>
    </symbol>

    <radialGradient id="hr-body" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#ff8a95"/><stop offset=".5" stop-color="#ef2f45"/><stop offset="1" stop-color="#a5101f"/></radialGradient>
    <symbol id="ic-heart" viewBox="0 0 64 64">
      <ellipse cx="32" cy="58" rx="16" ry="2.6" fill="#000" opacity=".24" filter="url(#sh-blur)"/>
      <path d="M32 54 C14 41 6 31 6 21 C6 13 12 8 19 8 C25 8 29 11 32 16 C35 11 39 8 45 8 C52 8 58 13 58 21 C58 31 50 41 32 54Z" fill="url(#hr-body)"/>
      <ellipse cx="19" cy="18" rx="7" ry="4.2" fill="#fff" opacity=".3" transform="rotate(-35 19 18)"/>
      <path d="M11 15 Q16 9 22 10" stroke="#fff" stroke-width="2" fill="none" opacity=".25" stroke-linecap="round"/>
    </symbol>

    <linearGradient id="cm-glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b2b33"/><stop offset=".5" stop-color="#1b1b21"/><stop offset="1" stop-color="#121216"/></linearGradient>
    <radialGradient id="cm-av" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffe08a"/><stop offset=".5" stop-color="#ff9f1c"/><stop offset="1" stop-color="#c25b00"/></radialGradient>
  </defs></svg>`;

  const book = (x, y, s) => `<use href="#ic-book" x="${x - s / 2}" y="${y - s / 2}" width="${s}" height="${s}"/>`;
  const star = (s) => `<use href="#ic-star" x="${-s / 2}" y="${-s / 2}" width="${s}" height="${s}"/>`;
  const heart = (s) => `<use href="#ic-heart" x="${-s / 2}" y="${-s / 2}" width="${s}" height="${s}"/>`;

  /** Bar komen gaya IG: avatar, medan teks (diisi `typed`), butang hantar. Lebar 900, tinggi 150, pusat (0,0). */
  const comment = (typed, caret) => `
    <g>
      <rect x="-458" y="-62" width="916" height="150" rx="75" fill="#000" opacity=".35" filter="url(#sh-blur)" transform="translate(0 14)"/>
      <rect x="-450" y="-75" width="900" height="150" rx="75" fill="url(#cm-glass)" stroke="rgba(255,255,255,.28)" stroke-width="3"/>
      <rect x="-438" y="-68" width="876" height="40" rx="20" fill="#fff" opacity=".07"/>
      <circle cx="-372" cy="0" r="46" fill="url(#cm-av)"/><ellipse cx="-386" cy="-16" rx="16" ry="9" fill="#fff" opacity=".3"/>
      <text x="-305" y="20" font-family="Inter Tight" font-weight="${typed ? 900 : 600}" font-size="${typed ? 64 : 50}" fill="${typed ? '#fff' : 'rgba(255,255,255,.55)'}" letter-spacing="${typed ? 2 : 0}">${typed || 'Tambah komen…'}</text>
      ${caret ? `<rect x="${-300 + typed.length * 44}" y="-34" width="6" height="66" rx="3" fill="#ffc53d"/>` : ''}
      <circle cx="372" cy="0" r="50" fill="#ffc53d"/><ellipse cx="358" cy="-18" rx="18" ry="9" fill="#fff" opacity=".35"/>
      <path d="M350 -2 L392 -22 L378 22 L370 4 Z" fill="#111" stroke="#111" stroke-width="4" stroke-linejoin="round"/>
    </g>`;

  root.ART = { SPRITE, book, star, heart, comment };
})(window);
