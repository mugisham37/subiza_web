import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  webServer: {
    command: "pnpm --filter @subiza/site build && pnpm --filter @subiza/site start",
    url: "http://127.0.0.1:3000/en/design-system",
    reuseExistingServer: true,
    timeout: 180_000,
  },
  use: {
    baseURL: "http://127.0.0.1:3000",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    {
      name: "no-js",
      use: { ...devices["Desktop Chrome"], javaScriptEnabled: false },
    },
    {
      name: "reduced-motion",
      use: { ...devices["Pixel 5"], contextOptions: { reducedMotion: "reduce" } },
    },
  ],
});
