import { describe, expect, it } from "vitest";
import { generateMockContent } from "@/lib/ai/mock-content";
import type { GenerateParams } from "@/lib/ai/types";

const baseParams: GenerateParams = {
  type: "BLOG_POST",
  prompt: "a sustainable skincare line made with ocean-safe ingredients",
  tone: "PROFESSIONAL",
  length: "MEDIUM",
};

describe("generateMockContent", () => {
  it("is deterministic for identical inputs", () => {
    const a = generateMockContent(baseParams);
    const b = generateMockContent(baseParams);
    expect(a).toEqual(b);
  });

  it("produces different content for different prompts", () => {
    const a = generateMockContent(baseParams);
    const b = generateMockContent({ ...baseParams, prompt: "a fintech app for freelancers" });
    expect(a.content).not.toBe(b.content);
  });

  it("produces different content for different tones", () => {
    const a = generateMockContent(baseParams);
    const b = generateMockContent({ ...baseParams, tone: "PLAYFUL" });
    expect(a.content).not.toBe(b.content);
  });

  it("produces longer output for LONG than SHORT", () => {
    const short = generateMockContent({ ...baseParams, length: "SHORT" });
    const long = generateMockContent({ ...baseParams, length: "LONG" });
    expect(long.content.length).toBeGreaterThan(short.content.length);
  });

  it("returns a non-empty title for every content type", () => {
    const types: GenerateParams["type"][] = [
      "BLOG_POST",
      "SOCIAL_CAPTION",
      "EMAIL",
      "PRODUCT_DESCRIPTION",
      "AD_COPY",
      "SEO_META",
      "PRESS_RELEASE",
    ];
    for (const type of types) {
      const result = generateMockContent({ ...baseParams, type });
      expect(result.title.length).toBeGreaterThan(0);
      expect(result.content.length).toBeGreaterThan(0);
    }
  });

  it("includes section headings in blog posts", () => {
    const result = generateMockContent({ ...baseParams, type: "BLOG_POST" });
    expect(result.content).toContain("##");
  });

  it("includes structured fields in SEO meta output", () => {
    const result = generateMockContent({ ...baseParams, type: "SEO_META" });
    expect(result.content).toContain("Title Tag:");
    expect(result.content).toContain("Meta Description:");
  });

  it("falls back gracefully for a blank prompt", () => {
    const result = generateMockContent({ ...baseParams, prompt: "" });
    expect(result.content.length).toBeGreaterThan(0);
  });
});
