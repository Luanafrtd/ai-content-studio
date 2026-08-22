import { test, expect } from "@playwright/test";
import { loginAsDemoUser } from "./utils/auth";

test.describe("Route protection", () => {
  test("redirects unauthenticated users from a protected route to login", async ({ page }) => {
    await page.goto("/dashboard/projects");
    await page.waitForURL(/\/login/);
    const callbackUrl = new URL(page.url()).searchParams.get("callbackUrl");
    expect(callbackUrl).toContain("/dashboard/projects");
  });

  test("redirects unauthenticated users from the dashboard root to login", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL(/\/login/);
  });

  test("redirects authenticated users away from the login page", async ({ page }) => {
    await loginAsDemoUser(page);
    await page.goto("/login");
    await page.waitForURL("**/dashboard");
  });

  test("returns the user to their original destination after login", async ({ page }) => {
    await page.goto("/dashboard/history");
    await page.waitForURL(/\/login/);

    await page.getByRole("button", { name: "Try the demo (one click)" }).click();

    await page.waitForURL("**/dashboard/history");
    await expect(page.getByRole("heading", { name: "History", level: 2 })).toBeVisible();
  });
});
