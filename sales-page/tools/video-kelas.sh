#!/bin/sh
# Bina semula assets/img/kelas-31okt.mp4 (15 s, 540×960, 30 fps, tanpa audio) dari eksport Photos kelas Muar
# 31 Okt 2026 dalam RAW/kelas-terkini/ (diabaikan git). Potongan: dewan IMG_4953 0–3 s, game IMG_5038 0.5–3.5 s
# dan 9–18 s.
#
# Sumber iPhone ialah yuvj420p julat penuh (pc), matriks BT.601, primari P3. Output mesti yuv420p julat terhad (tv)
# BT.709: julat penuh tidak dimain dengan betul oleh sesetengah pemain. ffmpeg 9 mengabaikan -color_primaries /
# -color_trc pada output, jadi tag warna diletak dalam setparams. Gamut tidak ditukar: nilai RGB kekal sama seperti
# poster dan gambar WebP galeri, yang juga dipapar sebagai sRGB.
#
#   sh tools/video-kelas.sh [fail-output] [crf=29, saiz ≈ fail lama 770 KB]
set -eu
cd "$(dirname "$0")/.."
RAW=../RAW/kelas-terkini
[ -d "$RAW" ] || RAW="$HOME/game kelas muar/RAW/kelas-terkini"
OUT=${1:-assets/img/kelas-31okt.mp4}
CRF=${2:-29}
case $OUT in /*) ;; *) OUT=$PWD/$OUT ;; esac

WARNA='scale=in_range=full:out_range=limited:out_color_matrix=bt709:flags=accurate_rnd+full_chroma_int,format=yuv420p,setparams=range=tv:colorspace=bt709:color_primaries=bt709:color_trc=bt709'
cd "$RAW"
ffmpeg -v error -y \
  -ss 0 -t 3 -i IMG_4953.mov \
  -ss 0.5 -t 3 -i IMG_5038.mov \
  -ss 9 -t 9 -i IMG_5038.mov \
  -filter_complex "[0:v]scale=540:960,fps=30,setsar=1[a];[1:v]scale=540:960,fps=30,setsar=1[b];[2:v]scale=540:960,fps=30,setsar=1[c];[a][b][c]concat=n=3:v=1:a=0,${WARNA}[v]" \
  -map '[v]' -c:v libx264 -preset slow -crf "$CRF" -movflags +faststart -an "$OUT"
ffprobe -v error -select_streams v -show_entries stream=pix_fmt,color_range,color_space,color_primaries,color_transfer -of compact=p=0:nk=1 "$OUT"
