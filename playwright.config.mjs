import { defineConfig, devices } from '@playwright/test';
const PORT = Number(process.env.PW_PORT || 4417);
// PW_BASE_URL = jalankan spec yang sama terhadap laman hidup (contoh: Worker Cloudflare); pelayan lokal tidak dimulakan.
const LIVE = process.env.PW_BASE_URL;
export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 90_000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: { baseURL: LIVE || `http://127.0.0.1:${PORT}`, viewport: { width: 1024, height: 768 }, trace: 'retain-on-failure' },
  // Pelayan statik pada port tetap; python gagal terus jika port sudah dipakai (setara --strictPort).
  webServer: LIVE ? undefined : { command: `python3 -m http.server ${PORT} --bind 127.0.0.1`, url: `http://127.0.0.1:${PORT}/index.html`, reuseExistingServer: false, stdout: 'ignore', stderr: 'ignore' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1024, height: 768 } } },
    // Iklan video: stage dibuka sendiri oleh tools/video/render.mjs, perlukan aset .tmp/ dari `prep` + `capture`.
    { name: 'video', testDir: 'tests', testMatch: /tests\/video\.spec\.mjs$/, timeout: 180_000 },
  ],
});
