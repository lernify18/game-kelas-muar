// Render satu versi iklan: node tools/video/render.mjs <vo|pov> [--out <folder>] [--frames 0,3.2,10] [--fast]
//   --frames  hanya simpan still JPG pada saat-saat itu (semakan cepat, tiada MP4)
//   --fast    15 fps, untuk semak gerak cepat
import { chromium } from "@playwright/test";
import { spawn, execFileSync } from "node:child_process";
import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { SRC } from "./prep.mjs";

const WT = fileURLToPath(new URL("../../", import.meta.url));
const TMP = join(WT, ".tmp");
const args = process.argv.slice(2);
const version = args[0] || "vo";
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const stamp = new Date().toISOString().slice(0, 16).replace("T", "_").replace(":", "");
const OUT = opt("--out") || join(WT, "out", `${stamp}_preview-iklan-3m`);
const FPS = args.includes("--fast") ? 15 : 30;

export function clipIndex() {
  const dir = join(TMP, "clips");
  const out = {};
  for (const name of readdirSync(dir)) {
    const d = join(dir, name);
    if (!existsSync(join(d, "0000.jpg"))) continue;
    const n = readdirSync(d).filter((f) => f.endsWith(".jpg")).length;
    const taps = existsSync(join(d, "klik.json")) ? JSON.parse(readFileSync(join(d, "klik.json"), "utf8")) : [];
    out[name] = { n, taps };
  }
  return out;
}

export async function openStage(v) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const words = JSON.parse(readFileSync(join(TMP, "a/words.json"), "utf8"));
  await page.addInitScript(([w, c]) => { window.WORDS = w; window.CLIPS = c; }, [words, clipIndex()]);
  await page.goto("file://" + encodeURI(join(WT, "video/stage.html")) + `?v=${v}`);
  await page.waitForFunction(() => window.STAGE_READY === true, null, { timeout: 30000 });
  return { browser, page, errors };
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const { browser, page, errors } = await openStage(version);
  const { dur, sfx, music, warn } = await page.evaluate(() => ({ dur: window.DUR, sfx: window.SFX, music: window.MUSIC, warn: window.STAGE_WARN }));
  if (warn.length) console.log("AMARAN STAGE:", warn);

  const frames = opt("--frames");
  if (frames) {
    for (const t of frames.split(",").map(Number)) {
      await page.evaluate((t) => window.seek(t), t);
      await page.screenshot({ path: join(OUT, `${version}_${t.toFixed(2)}.jpg`), type: "jpeg", quality: 85 });
    }
    console.log(`still → ${OUT}`);
    await browser.close();
    return;
  }

  const silent = join(TMP, `${version}_silent.mp4`);
  if (!args.includes("--mix")) await renderVideo(page, silent, dur);
  await browser.close();
  if (errors.length) console.log("RALAT HALAMAN:", errors);
  mix(silent, dur, sfx, music);
}

async function renderVideo(page, silent, dur) {
  const ff = spawn("ffmpeg", ["-v", "error", "-y", "-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
    "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-r", String(FPS), silent], { stdio: ["pipe", "inherit", "inherit"] });
  const n = Math.round(dur * FPS);
  const t0 = Date.now();
  for (let f = 0; f < n; f++) {
    await page.evaluate((t) => window.seek(t), f / FPS);
    const buf = await page.screenshot({ type: "jpeg", quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
    if (f % 150 === 0) console.log(`  ${version} ${f}/${n}`);
  }
  ff.stdin.end();
  await new Promise((r, j) => ff.on("close", (c) => (c ? j(new Error(`ffmpeg ${c}`)) : r())));
  console.log(`  video ${((Date.now() - t0) / 1000).toFixed(0)} s`);
}

function mix(silent, dur, sfx, music) {
  const inputs = [];
  const chains = [];
  let idx = 0;
  const add = (file, chain) => { inputs.push("-i", file); chains.push(`[${++idx}:a]${chain}`); };
  const hasVO = version === "vo";
  if (hasVO) add(join(TMP, "a/vo.wav"), "aresample=48000,aformat=channel_layouts=stereo,volume=1.0");
  if (music) {
    const fo = Math.max(0, dur - (music.fadeOut || 1));
    inputs.push("-ss", String(music.start), "-t", String(dur + 0.5));
    add(SRC.music(), `aresample=48000,volume=${music.gain},afade=t=in:d=0.4,afade=t=out:st=${fo.toFixed(2)}:d=${(music.fadeOut || 1).toFixed(2)}`);
  }
  for (const s of sfx) {
    const ms = Math.max(0, Math.round(s.t * 1000));
    add(join(TMP, "game/sfx", `${s.f}.mp3`), `aresample=48000,aformat=channel_layouts=stereo,volume=${s.g},adelay=${ms}|${ms}`);
  }
  const labels = chains.map((c, i) => `${c}[s${i}]`);
  const fc = `${labels.join(";")};${chains.map((_, i) => `[s${i}]`).join("")}amix=inputs=${chains.length}:normalize=0:dropout_transition=0,atrim=0:${dur},alimiter=limit=0.89:level=false[mix]`;
  const final = join(OUT, `iklan3m_${version}.mp4`);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", silent, ...inputs, "-filter_complex", fc, "-map", "0:v", "-map", "[mix]",
    "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-shortest", final], { stdio: "inherit" });
  writeFileSync(join(OUT, `${version}.json`), JSON.stringify({ version, dur, fps: FPS, music, sfx }, null, 1));
  console.log(`SIAP → ${final}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await main();
