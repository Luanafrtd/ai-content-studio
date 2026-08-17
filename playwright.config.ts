import { defineConfig, devices } from "@playwright/test";

const PORT = 3000;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  // Serial execution: tests share a single SQLite file and dev server, so
  // concurrent workers can hit SQLITE_BUSY / dev-server contention.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // CI runners are slower than local hardware, and `next dev`'s on-demand
  // route compilation means the first test to hit a given route pays a
  // one-time cold-compile cost on top of the interaction itself.
  timeout: process.env.CI ? 60_000 : 30_000,
  reporter: [["html", { open: "never" }]],
  globalSetup: "./tests/e2e/global-setup.ts",
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
