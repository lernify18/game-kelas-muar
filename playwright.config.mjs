import { defineConfig } from "@playwright/test";
import { fileURLToPath } from "node:url";

export default defineConfig({
  testDir: "tests",
  testIgnore: [fileURLToPath(new URL("./worktrees/", import.meta.url)) + "**"],
  timeout: 180000,
  workers: 2,
  reporter: "list",
});
