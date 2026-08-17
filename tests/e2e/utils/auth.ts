import type { Page } from "@playwright/test";

export const DEMO_EMAIL = "demo@quill.app";
export const DEMO_PASSWORD = "demo1234";

export async function loginAsDemoUser(page: Page) {
  await page.goto("/login");
  await page.getByRole("button", { name: "Try the demo — one click" }).click();
  await page.waitForURL("**/dashboard");
}

export async function loginWithCredentials(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
}

export async function registerUser(
  page: Page,
  { name, email, password }: { name: string; email: string; password: string },
) {
  await page.goto("/register");
  await page.getByLabel("Name").fill(name);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByLabel("Confirm password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  await page.waitForURL("**/dashboard");
}
