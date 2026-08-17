import { chromium } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdirSync } from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "docs", "screenshots");
mkdirSync(outDir, { recursive: true });

const baseURL = "http://localhost:3000";

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Marketing landing page (light mode, default)
  await page.goto(`${baseURL}/`);
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, "landing.png") });

  // Login
  await page.goto(`${baseURL}/login`, { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, "login.png") });

  await page.getByRole("button", { name: "Try the demo — one click" }).click();
  await page.waitForURL("**/dashboard", { timeout: 15000 });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, "dashboard.png") });

  await page.goto(`${baseURL}/dashboard/generate`);
  await page.waitForFunction(() => {
    const trigger = document.querySelector("#projectId");
    return !!trigger && !trigger.textContent?.includes("Loading");
  });
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(outDir, "generate.png") });

  await page.goto(`${baseURL}/dashboard/history`);
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(outDir, "history.png") });

  await page.goto(`${baseURL}/dashboard/analytics`);
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(outDir, "analytics.png") });

  // Dark mode dashboard
  await page.goto(`${baseURL}/dashboard`);
  await page.evaluate(() => {
    window.localStorage.setItem("theme", "dark");
  });
  await page.reload();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, "dashboard-dark.png") });

  // Mobile viewport
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseURL}/dashboard/history`);
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, "mobile-history.png") });

  await browser.close();
  console.log("Screenshots saved to docs/screenshots/");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
