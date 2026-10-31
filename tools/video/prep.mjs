// Sediakan bahan render daripada RAW/ dan footage/ di akar projek (tidak diubah):
//   .tmp/a/vo.wav + words.json  — VO dengan jeda dirapatkan (gaya Iman: tiada jeda panjang), −14 LUFS
//   .tmp/clips/bts/             — BTS 1080×1920 30 fps (latar hook)
//   .tmp/clips/leak_{a,b,c}/    — light leak untuk transisi
//   .tmp/clips/grid.png         — latar grid hitam 1080×1920
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync, readFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const WT = fileURLToPath(new URL("../../", import.meta.url));
const PROJ = process.env.PROJ || join(WT, "../..");
const TMP = join(WT, ".tmp");
const find = (dir, re) => {
  const f = readdirSync(join(PROJ, dir)).find((n) => re.test(n));
  if (!f) throw new Error(`Tiada fail ${re} dalam ${dir}/`);
  return join(PROJ, dir, f);
};
export const SRC = {
  vo: () => find("RAW", /^ElevenLabs.*\.mp3$/),
  bts: () => find("RAW", /\.mov$/i),
  music: () => find("footage", /\.mp3$/),
  leak: () => find("footage", /light-leak.*\.mp4$/),
  grid: () => find("footage", /\.png$/),
};
const ff = (...a) => execFileSync("ffmpeg", ["-v", "error", "-y", ...a], { stdio: ["ignore", "pipe", "inherit"] });
const fresh = (d) => { if (existsSync(d)) rmSync(d, { recursive: true }); mkdirSync(d, { recursive: true }); return d; };

// ---------- VO ----------
const KEEP = 0.12; // saat senyap yang ditinggalkan dalam setiap jeda
function prepVO() {
  const dir = fresh(join(TMP, "a"));
  const src = SRC.vo();
  ff("-i", src, "-ar", "48000", "-ac", "1", join(dir, "vo_src.wav"));
  const log = execFileSync("sh", ["-c", `ffmpeg -hide_banner -nostats -i "${join(dir, "vo_src.wav")}" -af silencedetect=n=-40dB:d=0.2 -f null - 2>&1`], { encoding: "utf8" });
  const st = [...log.matchAll(/silence_start: ([\d.]+)/g)].map((m) => +m[1]);
  const en = [...log.matchAll(/silence_end: ([\d.]+)/g)].map((m) => +m[1]);
  const lastWord = whisperWords(join(dir, "vo_src.wav"));
  const endSpeech = lastWord.at(-1).end + 0.12;
  // Potongan: buang bahagian tengah setiap jeda dalaman, tinggalkan KEEP saat.
  const cuts = st.map((s, i) => [s + KEEP / 2, (en[i] ?? s) - KEEP / 2]).filter(([a, b]) => b - a > 0.04 && a < endSpeech);
  const keep = [];
  let t = 0;
  for (const [a, b] of cuts) { keep.push([t, a]); t = b; }
  keep.push([t, endSpeech]);
  const parts = keep.map(([a, b], i) => `[0:a]atrim=${a.toFixed(3)}:${b.toFixed(3)},asetpts=PTS-STARTPTS,afade=t=in:d=0.008,afade=t=out:st=${(b - a - 0.008).toFixed(3)}:d=0.008[p${i}]`);
  const fc = `${parts.join(";")};${keep.map((_, i) => `[p${i}]`).join("")}concat=n=${keep.length}:v=0:a=1,loudnorm=I=-14:TP=-1.5:LRA=11[o]`;
  ff("-i", join(dir, "vo_src.wav"), "-filter_complex", fc, "-map", "[o]", "-ar", "48000", join(dir, "vo.wav"));
  const map = (x) => { let removed = 0; for (const [a, b] of cuts) { if (x >= b) removed += b - a; else if (x > a) removed += x - a; } return +(x - removed).toFixed(3); };
  const words = lastWord.map((w) => ({ w: w.w, start: map(w.start), end: map(w.end) }));
  const dur = +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", join(dir, "vo.wav")], { encoding: "utf8" }).trim();
  writeFileSync(join(dir, "words.json"), JSON.stringify({ dur, cuts, words }, null, 1));
  console.log(`VO: ${dur.toFixed(2)} s (asal ${endSpeech.toFixed(2)} s, ${cuts.length} jeda dirapatkan), ${words.length} perkataan`);
}

function whisperWords(wav) {
  const model = join(process.env.HOME, ".cache/whisper-cpp/ggml-large-v3-turbo-q5_0.bin");
  const out = join(dirname(wav), "whisper");
  ff("-i", wav, "-ar", "16000", "-ac", "1", out + ".wav");
  execFileSync("whisper-cli", ["-m", model, "-l", "ms", "-f", out + ".wav", "-ojf", "-of", out, "-ml", "1", "-sow", "-np"], { stdio: "ignore" });
  const j = JSON.parse(readFileSync(out + ".json", "utf8"));
  return j.transcription
    .map((s) => ({ w: s.text.trim(), start: s.offsets.from / 1000, end: s.offsets.to / 1000 }))
    .filter((s) => /[\p{L}\p{N}]/u.test(s.w));
}

// ---------- video ----------
function prepBTS() {
  const dir = fresh(join(TMP, "clips/bts"));
  // Rakaman potret (rotate 90) → ffmpeg autorotate jadi 2160×3840; kecilkan ke 1080×1920.
  ff("-ss", process.env.BTS_AT || "20", "-t", "10", "-i", SRC.bts(), "-an", "-vf", "fps=30,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920", "-q:v", "3", "-start_number", "0", join(dir, "%04d.jpg"));
  console.log(`BTS: ${readdirSync(dir).length} frame`);
}
const LEAKS = { a: [84.3, 1.1], b: [36.6, 1.3], c: [108.2, 1.0] };
function prepLeaks() {
  for (const [k, [ss, d]] of Object.entries(LEAKS)) {
    const dir = fresh(join(TMP, `clips/leak_${k}`));
    ff("-ss", String(ss), "-t", String(d), "-i", SRC.leak(), "-an", "-vf", "fps=30,scale=-2:1920:flags=bicubic,crop=1080:1920,eq=brightness=-0.06:contrast=1.15", "-q:v", "4", "-start_number", "0", join(dir, "%04d.jpg"));
  }
  console.log("Light leak: a, b, c");
}
function prepGrid() {
  ff("-i", SRC.grid(), "-vf", "scale=-2:1920:flags=lanczos,crop=1080:1920,unsharp=5:5:0.8", join(TMP, "clips/grid.png"));
  console.log("Grid: 1080×1920");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const what = process.argv.slice(2);
  const want = (k) => !what.length || what.includes(k);
  mkdirSync(join(TMP, "clips"), { recursive: true });
  if (want("vo")) prepVO();
  if (want("bts")) prepBTS();
  if (want("leak")) prepLeaks();
  if (want("grid")) prepGrid();
}
