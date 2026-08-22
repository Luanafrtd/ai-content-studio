import { chromium } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdirSync } from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "docs", "screenshots");
mkdirSync(outDir, { recursive: true });

const baseURL = process.argv[2] ?? "https://ai-content-studio-kohl.vercel.app";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log(`Checking ${baseURL} ...`);

  await page.goto(`${baseURL}/login`, { waitUntil: "networkidle" });
  const title = await page.title();
  console.log("Login page title:", title);
  await page.screenshot({ path: path.join(outDir, "live-login.png") });

  await page.getByRole("button", { name: "Try the demo (one click)" }).click();
  await page.waitForURL("**/dashboard", { timeout: 15000 });
  console.log("Logged in, reached:", page.url());

  await page.waitForSelector("text=Total generations", { timeout: 15000 });
  const kpiCard = await page.locator('[data-slot="card"]').first().innerText();
  console.log("First KPI card text:", kpiCard.replace(/\n/g, " | "));
  await page.screenshot({ path: path.join(outDir, "live-dashboard.png") });

  await page.goto(`${baseURL}/dashboard/history`, { waitUntil: "networkidle" });
  const rowCount = await page.locator("table tbody tr").count();
  console.log("History rows loaded:", rowCount);
  await page.screenshot({ path: path.join(outDir, "live-history.png") });

  await page.goto(`${baseURL}/dashboard/generate`, { waitUntil: "networkidle" });
  const templateCount = await page.locator('[role="radio"]').count();
  console.log("Content type templates rendered:", templateCount);
  await page.screenshot({ path: path.join(outDir, "live-generate.png") });

  // Logged-out redirect check
  await page.context().clearCookies();
  await page.goto(`${baseURL}/dashboard`, { waitUntil: "networkidle" });
  console.log("After clearing cookies, redirected to:", page.url());

  await browser.close();
  console.log("Live verification complete.");
}

main().catch((error) => {
  console.error("LIVE VERIFICATION FAILED:", error);
  process.exit(1);
});
