import { test, expect } from "@playwright/test";
import { loginAsDemoUser } from "./utils/auth";

test.describe("Core generation flow", () => {
  test("create a project, generate content, favorite it, and find it in history and favorites", async ({
    page,
  }) => {
    await loginAsDemoUser(page);

    // 1. Create a project.
    const projectName = `E2E Project ${Date.now()}`;
    await page.getByRole("link", { name: "Projects" }).click();
    await page.waitForURL("**/dashboard/projects");
    await page.getByRole("button", { name: "New project" }).click();
    await page.getByLabel("Name").fill(projectName);
    await page.getByRole("button", { name: "Create project" }).click();
    await expect(page.getByRole("heading", { name: projectName })).toBeVisible();

    // 2. Generate content in that project (mock provider, no network/secrets needed).
    await page.getByRole("link", { name: "Generate" }).click();
    await page.waitForURL("**/dashboard/generate");

    await page.getByRole("combobox", { name: "Project" }).click();
    await page.getByRole("option", { name: projectName }).click();

    await page.getByRole("combobox", { name: "Length" }).click();
    await page.getByRole("option", { name: "Short" }).click();

    const prompt = "a project management tool for small creative agencies";
    await page.getByLabel("What do you need?").fill(prompt);
    await page.getByRole("button", { name: "Generate" }).click();

    await expect(page.getByRole("button", { name: "Discard" })).toBeVisible({ timeout: 15_000 });
    const generatedTitle = await page.locator("h3.text-lg").innerText();
    expect(generatedTitle.length).toBeGreaterThan(0);

    // 3. Confirm it landed in History, scoped to the new project.
    await page.getByRole("link", { name: "History", exact: true }).click();
    await page.waitForURL("**/dashboard/history");
    await page.getByRole("combobox", { name: "Filter by project" }).click();
    await page.getByRole("option", { name: projectName }).click();
    await expect(page.getByText(generatedTitle)).toBeVisible();

    // 4. Favorite it from the history table.
    await page
      .getByRole("button", { name: /Add to favorites/ })
      .first()
      .click();

    // 5. Confirm it shows up in Favorites.
    await page.getByRole("link", { name: "Favorites" }).click();
    await page.waitForURL("**/dashboard/favorites");
    await expect(page.getByText(generatedTitle)).toBeVisible();

    // 6. Search/filter behaves as expected.
    await page.getByRole("searchbox", { name: "Search favorites" }).fill("zzz-no-such-content-zzz");
    await expect(page.getByText("No favorites yet")).toBeVisible();
  });
});
