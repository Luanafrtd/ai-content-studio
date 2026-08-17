import { test, expect } from "@playwright/test";
import { registerUser } from "./utils/auth";

/**
 * Every API route scopes reads/writes by `userId` at the query level
 * (`findFirst({ where: { id, userId } })`), returning 404 rather than 403 so
 * a request for someone else's resource can't be distinguished from a
 * request for a resource that doesn't exist at all. This spec proves that
 * boundary actually holds, from the outside, via the real HTTP API — not by
 * reading the route handler source and trusting it.
 */

interface NdjsonEvent {
  type: string;
  id?: string;
}

async function createProject(request: import("@playwright/test").APIRequestContext) {
  const response = await request.post("/api/projects", {
    data: { name: "Isolation Test Project", description: "", color: "teal" },
  });
  expect(response.status()).toBe(201);
  const { project } = await response.json();
  return project.id as string;
}

async function generateContent(
  request: import("@playwright/test").APIRequestContext,
  projectId: string,
) {
  const response = await request.post("/api/generate", {
    data: {
      projectId,
      type: "BLOG_POST",
      prompt: "a tenant isolation test fixture, please ignore",
      tone: "PROFESSIONAL",
      length: "SHORT",
    },
  });
  expect(response.ok()).toBe(true);
  const body = await response.text();
  const events = body
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line) as NdjsonEvent);
  const done = events.find((e) => e.type === "done");
  expect(done?.id).toBeTruthy();
  return done!.id!;
}

test.describe("Tenant isolation", () => {
  test("a user cannot read, modify, delete, or list another user's content or projects", async ({
    browser,
  }) => {
    const contextA = await browser.newContext();
    const contextB = await browser.newContext();
    const pageA = await contextA.newPage();
    const pageB = await contextB.newPage();

    await registerUser(pageA, {
      name: "Tenant A",
      email: `tenant-a-${Date.now()}@example.com`,
      password: "password123",
    });
    await registerUser(pageB, {
      name: "Tenant B",
      email: `tenant-b-${Date.now()}@example.com`,
      password: "password123",
    });

    const projectId = await createProject(pageA.request);
    const itemId = await generateContent(pageA.request, projectId);

    // B attempts to read A's content.
    const getAsB = await pageB.request.get(`/api/content/${itemId}`);
    expect(getAsB.status()).toBe(404);

    // B attempts to favorite A's content.
    const patchAsB = await pageB.request.patch(`/api/content/${itemId}`, {
      data: { isFavorite: true },
    });
    expect(patchAsB.status()).toBe(404);

    // B attempts to delete A's content.
    const deleteAsB = await pageB.request.delete(`/api/content/${itemId}`);
    expect(deleteAsB.status()).toBe(404);

    // B attempts to read A's project.
    const getProjectAsB = await pageB.request.get(`/api/projects/${projectId}`);
    expect(getProjectAsB.status()).toBe(404);

    // A's item does not leak into B's content list.
    const listAsB = await pageB.request.get("/api/content?page=1&pageSize=50");
    expect(listAsB.ok()).toBe(true);
    const { items: itemsForB } = await listAsB.json();
    expect(itemsForB.some((item: { id: string }) => item.id === itemId)).toBe(false);

    // A's project does not leak into B's project list.
    const projectsAsB = await pageB.request.get("/api/projects");
    expect(projectsAsB.ok()).toBe(true);
    const { projects: projectsForB } = await projectsAsB.json();
    expect(projectsForB.some((p: { id: string }) => p.id === projectId)).toBe(false);

    // None of B's attempts actually mutated or deleted A's data.
    const getAsA = await pageA.request.get(`/api/content/${itemId}`);
    expect(getAsA.status()).toBe(200);
    const { item } = await getAsA.json();
    expect(item.isFavorite).toBe(false);

    await contextA.close();
    await contextB.close();
  });
});
