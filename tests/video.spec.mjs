// E2E stage + smoke MP4 untuk iklan Misi Pemulihan 3M (versi VO dan POV).
// Jalankan selepas `node tools/video/prep.mjs` + `node tools/video/capture-game.mjs` (+ render untuk smoke MP4).
import { test, expect } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { openStage } from "../tools/video/render.mjs";
import { SRC } from "../tools/video/prep.mjs";

const WT = fileURLToPath(new URL("../", import.meta.url));
const VERSIONS = ["vo", "pov"];

/** Lapisan teks yang kelihatan pada masa t: hook, kumpulan kapsyen, kotak POV. */
const textLayers = (page, t) => page.evaluate(async (t) => {
  await window.seek(t);
  const out = [];
  for (const el of document.querySelectorAll("[data-scene]")) {
    if (el.style.display === "none") continue;
    const kind = el.dataset.scene.split(":")[1];
    if (kind === "hook") out.push("hook");
    if (kind === "caps") el.querySelectorAll(".cap-group").forEach((g) => { if (getComputedStyle(g).display !== "none") out.push(`caps:${g.textContent}`); });
    if (kind === "pov") out.push(`pov:${el.textContent.slice(0, 20)}`);
    if (kind === "bts") out.push("bts");
    if (kind === "device") out.push(`device:${el.querySelector(".scr img").dataset.src.split("/clips/")[1].split("/")[0]}`);
  }
  return out;
}, t);

for (const v of VERSIONS) {
  test.describe(`stage ${v}`, () => {
    let stage;
    test.beforeAll(async () => { stage = await openStage(v); });
    test.afterAll(async () => { await stage.browser.close(); });

    test("muat tanpa ralat, setiap kapsyen padan VO dan setiap frame dijumpai", async () => {
      const { page, errors } = stage;
      const dur = await page.evaluate(() => window.DUR);
      for (let t = 0; t < dur; t += 0.5) await page.evaluate((t) => window.seek(t), t);
      expect(errors).toEqual([]);
      expect(await page.evaluate(() => window.STAGE_WARN)).toEqual([]);
    });

    test("tempoh 15–25 s", async () => {
      const dur = await stage.page.evaluate(() => window.DUR);
      expect(dur).toBeGreaterThanOrEqual(15);
      expect(dur).toBeLessThanOrEqual(25);
    });

    test("tiada double caption: paling banyak satu lapisan teks pada setiap 0.1 s", async () => {
      const dur = await stage.page.evaluate(() => window.DUR);
      const bad = [];
      for (let t = 0; t < dur; t += 0.1) {
        const text = (await textLayers(stage.page, t)).filter((x) => /^(hook|caps|pov)/.test(x));
        if (text.length > 1) bad.push(`${t.toFixed(1)}: ${text.join(" | ")}`);
      }
      expect(bad).toEqual([]);
    });

    test("hook = tajuk power + PROVEN di atas video BTS", async () => {
      const at = await textLayers(stage.page, 2.6);
      expect(at).toContain("bts");
      const txt = await stage.page.evaluate(() => [...document.querySelectorAll("[data-scene]")].filter((e) => e.style.display !== "none").map((e) => e.textContent).join(" "));
      expect(txt).toMatch(/PROVEN/i);
    });

    test("kapsyen gaya Iman (perkataan demi perkataan), tiada kotak POV putih/merah", async () => {
      const { page } = stage;
      const r = await page.evaluate(async () => {
        const groups = window.SCENES.filter((s) => s.type === "caps").flatMap((s) => s.groups);
        let staggered = 0;
        for (const g of groups) {
          await window.seek(g.a + 0.02);
          const vis = [...document.querySelectorAll(".cap-group")].find((e) => e.style.display !== "none" && e.closest("[data-scene]").style.display !== "none");
          const ops = vis ? [...vis.querySelectorAll(".cap-w")].map((w) => +w.style.opacity) : [];
          if (ops.length < 2 || ops.at(-1) < 0.5) staggered++;
        }
        return { groups: groups.length, staggered, povBoxes: document.querySelectorAll(".pov, .pov-line").length };
      });
      expect(r.povBoxes).toBe(0);
      expect(r.groups).toBeGreaterThanOrEqual(8);
      expect(r.staggered).toBe(r.groups);
    });

    test("B-roll = skrin game sebenar dalam telefon DAN tablet, selang-seli dengan teks", async () => {
      const scenes = await stage.page.evaluate(() => window.SCENES);
      const devs = scenes.filter((s) => s.type === "device");
      expect(new Set(devs.map((d) => d.kind))).toEqual(new Set(["phone", "tablet"]));
      const clips = readdirSync(join(WT, ".tmp/clips"));
      for (const d of devs) expect(clips).toContain(d.clip);
      // Sepanjang video, sekurang-kurangnya separuh masa ada mockup game di skrin.
      const dur = await stage.page.evaluate(() => window.DUR);
      let withDevice = 0, n = 0;
      for (let t = 0; t < dur; t += 0.25, n++) if ((await textLayers(stage.page, t)).some((x) => x.startsWith("device:"))) withDevice++;
      expect(withDevice / n).toBeGreaterThan(0.5);
    });

    if (v === "vo") {
      test("kapsyen muncul tepat pada perkataan VO (≤ 0.15 s)", async () => {
        const words = JSON.parse(readFileSync(join(WT, ".tmp/a/words.json"), "utf8")).words;
        const late = [];
        for (const w of words.filter((x) => /fireworks|stiker|mengira|enam|interaktif|demo/i.test(x.w))) {
          const shown = await stage.page.evaluate(async (t) => { await window.seek(t); return [...document.querySelectorAll(".cap-w")].filter((e) => e.closest(".cap-group").style.display !== "none" && e.closest("[data-scene]").style.display !== "none" && +e.style.opacity > 0.9).map((e) => e.textContent.toLowerCase()); }, w.start + 0.15);
          const key = w.w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
          if (!shown.some((s) => s.includes(key === "enam" ? "6" : key))) late.push(`${w.w}@${w.start}`);
        }
        expect(late).toEqual([]);
      });

      test("ketukan 'jawab betul' jatuh pada perkataan 'betul'", async () => {
        const betul = JSON.parse(readFileSync(join(WT, ".tmp/a/words.json"), "utf8")).words.find((w) => /^betul/i.test(w.w)).start;
        const op = await stage.page.evaluate(async (t) => { await window.seek(t); const tap = [...document.querySelectorAll(".tap")].find((e) => e.closest("[data-scene]").style.display !== "none"); return tap ? +tap.style.opacity : 0; }, betul + 0.12);
        expect(op).toBeGreaterThan(0.5);
      });
    }
  });
}

// ---------------- smoke: MP4 yang dirender ----------------
// VIDEO_OUT = folder render tertentu (cth. out/ dalam folder utama, yang kekal selepas worktree dibuang).
const outDirs = existsSync(join(WT, "out")) ? readdirSync(join(WT, "out")).filter((d) => d.includes("preview-iklan-3m")).sort() : [];
const latest = process.env.VIDEO_OUT || (outDirs.length ? join(WT, "out", outDirs.at(-1)) : null);
const probe = (f) => JSON.parse(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration:stream=codec_type,width,height,pix_fmt,color_range,color_space,color_primaries,color_transfer", "-of", "json", f], { encoding: "utf8" }));
const lufs = (input, pre = "") => {
  const out = execFileSync("sh", ["-c", `ffmpeg -hide_banner -nostats ${input} -af '${pre ? pre + "," : ""}ebur128' -f null - 2>&1 | grep -E '^ +I:' | tail -1`], { encoding: "utf8" });
  return +out.match(/(-?[\d.]+) LUFS/)[1];
};

for (const v of VERSIONS) {
  test(`smoke MP4 ${v}: 1080×1920, 15–25 s, ada audio, kuat bunyi wajar`, async () => {
    test.skip(!latest || !existsSync(join(latest, `iklan3m_${v}.mp4`)), "belum dirender");
    const f = join(latest, `iklan3m_${v}.mp4`);
    const p = probe(f);
    const vs = p.streams.find((s) => s.codec_type === "video");
    expect([vs.width, vs.height]).toEqual([1080, 1920]);
    // Format standard Meta/iPhone/WhatsApp: yuv420p limited range BT.709, bukan yuvj420p full range dari JPEG stage.
    expect({ pix: vs.pix_fmt, range: vs.color_range, space: vs.color_space, prim: vs.color_primaries, trc: vs.color_transfer })
      .toEqual({ pix: "yuv420p", range: "tv", space: "bt709", prim: "bt709", trc: "bt709" });
    expect(p.streams.some((s) => s.codec_type === "audio")).toBe(true);
    expect(+p.format.duration).toBeGreaterThanOrEqual(15);
    expect(+p.format.duration).toBeLessThanOrEqual(25.1);
    const I = lufs(`-i ${JSON.stringify(f)}`);
    expect(I).toBeGreaterThan(-18);
    expect(I).toBeLessThan(-11);
  });
}

test("muzik VO pada 10% dan ≥ 15 dB di bawah suara", async () => {
  test.skip(!latest || !existsSync(join(latest, "vo.json")), "belum dirender");
  const { music } = JSON.parse(readFileSync(join(latest, "vo.json"), "utf8"));
  expect(music.gain).toBe(0.1);
  const voice = lufs(`-i ${JSON.stringify(join(WT, ".tmp/a/vo.wav"))}`);
  const bed = lufs(`-ss ${music.start} -t 24 -i ${JSON.stringify(SRC.music())}`, `volume=${music.gain}`);
  expect(voice - bed).toBeGreaterThanOrEqual(15);
});
