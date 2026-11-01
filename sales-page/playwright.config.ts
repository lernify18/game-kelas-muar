import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  testIgnore: ['**/node_modules/**'],
  fullyParallel: true,
  workers: 3,
  timeout: 45_000,
  reporter: 'list',
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } },
    { name: 'webkit-iphone', use: { ...devices['iPhone 13'] } },
  ],
});
