import { test, expect } from "@playwright/test";
import { loginAsDemoUser, loginWithCredentials, DEMO_EMAIL, DEMO_PASSWORD } from "./utils/auth";

test.describe("Authentication", () => {
  test("shows the login page with a one-click demo option", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Try the demo — one click" })).toBeVisible();
  });

  test("shows an error for invalid credentials", async ({ page }) => {
    await loginWithCredentials(page, "wrong@example.com", "wrongpassword");

    await expect(page.locator("#login-form-error")).toContainText("Invalid email or password");
    await expect(page).toHaveURL(/\/login/);
  });

  test("logs in with the one-click demo account and reaches the dashboard", async ({ page }) => {
    await loginAsDemoUser(page);
    await expect(page.getByRole("heading", { name: "Overview" })).toBeVisible();
    await expect(page.getByText("Demo User")).toBeVisible();
  });

  test("logs in with valid demo credentials directly", async ({ page }) => {
    await loginWithCredentials(page, DEMO_EMAIL, DEMO_PASSWORD);
    await page.waitForURL("**/dashboard");
    await expect(page.getByRole("heading", { name: "Overview" })).toBeVisible();
  });

  test("registers a new account and reaches the dashboard", async ({ page }) => {
    const uniqueEmail = `e2e-${Date.now()}@example.com`;
    await page.goto("/register");
    await page.getByLabel("Name").fill("E2E Test User");
    await page.getByLabel("Email").fill(uniqueEmail);
    await page.getByLabel("Password", { exact: true }).fill("password123");
    await page.getByLabel("Confirm password").fill("password123");
    await page.getByRole("button", { name: "Create account" }).click();

    await page.waitForURL("**/dashboard");
    await expect(page.getByRole("heading", { name: "Overview" })).toBeVisible();
    await expect(page.getByText("E2E Test User")).toBeVisible();
  });

  test("rejects registration with mismatched passwords", async ({ page }) => {
    await page.goto("/register");
    await page.getByLabel("Name").fill("Mismatch User");
    await page.getByLabel("Email").fill(`mismatch-${Date.now()}@example.com`);
    await page.getByLabel("Password", { exact: true }).fill("password123");
    await page.getByLabel("Confirm password").fill("differentpassword");
    await page.getByRole("button", { name: "Create account" }).click();

    await expect(page.getByText("Passwords don't match")).toBeVisible();
    await expect(page).toHaveURL(/\/register/);
  });

  test("logs out and returns to the login page", async ({ page }) => {
    await loginAsDemoUser(page);
    await page.getByRole("button", { name: /Demo User/ }).click();
    await page.getByRole("menuitem", { name: "Sign out" }).click();
    await page.waitForURL("**/login");
    await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  });
});
