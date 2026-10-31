# Iklan video Misi Pemulihan 3M — gaya Iman Gadzhi (VO + POV)

Dua versi 9:16 untuk Meta Ads, 15–25 s:

| Versi | Audio | Teks |
|---|---|---|
| `vo` | VO ElevenLabs dari `RAW/` + muzik `footage/` pada 10% + SFX game | Hook (tajuk + SOLUSI PROVEN) atas BTS, kemudian kapsyen gaya Iman perkataan demi perkataan |
| `pov` | Muzik `footage/` + SFX game (BTS dibisukan) | Kotak POV putih/merah |

B-roll = skrin game sebenar (dari worktree `feat-misi-3m-v1`) dalam mockup telefon/tablet. Bila tiada skrin yang padan,
grafik SVG 3D (`art.js`): buku, bintang, bar komen. Latar = grid hitam dari `footage/`.

## Jalankan

```bash
GW="../feat-misi-3m-v1"; rm -rf .tmp/game && mkdir -p .tmp/game && cp -R "$GW/index.html" "$GW/src" "$GW/sfx" .tmp/game/
```
```bash
node tools/video/prep.mjs
```
```bash
node tools/video/capture-game.mjs
```
```bash
node tools/video/render.mjs vo --out out/<tarikh>_preview-iklan-3m
```
```bash
node tools/video/render.mjs pov --out out/<tarikh>_preview-iklan-3m
```
```bash
npx playwright test
```

- `prep` — VO dirapatkan (jeda → 0.12 s), −14 LUFS, whisper ke `.tmp/a/words.json`; BTS 1080×1920; light leak; grid.
- `capture-game` — rakam game (telefon 390×844 @2x, tablet 820×1180 @1.5x) ke `.tmp/clips/<nama>/` 30 fps + `klik.json`.
- `render` — `--frames 0,5.2` still sahaja; `--mix` mix semula audio tanpa render video.
- Timeline: `video/vo.js` (diikat pada perkataan VO melalui `T("perkataan")`), `video/pov.js` (saat tetap).

## Perangkap

- ffmpeg image2 mula bernombor 1; stage baca dari 0000 → `-start_number 0`.
- Kumpulan kapsyen mesti tamat 0.06 s sebelum kumpulan seterusnya muncul, atau 1 frame jadi double caption (spec menangkapnya).
- `dist/misi-pemulihan-3m.html` dalam worktree game rosak semasa dirakam (`require is not defined`); rakam dari `index.html` + `src/`.
