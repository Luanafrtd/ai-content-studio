import { describe, expect, it } from "vitest";
import { mockProvider } from "@/lib/ai/providers/mock-provider";
import { generateMockContent } from "@/lib/ai/mock-content";
import type { GenerateParams } from "@/lib/ai/types";

const params: GenerateParams = {
  type: "SOCIAL_CAPTION",
  prompt: "a boutique coffee roastery launching a subscription box",
  tone: "FRIENDLY",
  length: "SHORT",
};

describe("mockProvider", () => {
  it("exposes a name and model id", () => {
    expect(mockProvider.name).toBe("mock");
    expect(mockProvider.model.length).toBeGreaterThan(0);
  });

  it("generateTitle matches the synchronous generator's title", async () => {
    const title = await mockProvider.generateTitle(params);
    expect(title).toBe(generateMockContent(params).title);
  });

  it("streamed chunks concatenate to the exact full content", async () => {
    const expected = generateMockContent(params).content;
    let streamed = "";
    for await (const chunk of mockProvider.generateStream(params)) {
      streamed += chunk;
    }
    expect(streamed).toBe(expected);
  });

  it("yields more than one chunk for non-trivial content", async () => {
    const chunks: string[] = [];
    for await (const chunk of mockProvider.generateStream(params)) {
      chunks.push(chunk);
    }
    expect(chunks.length).toBeGreaterThan(1);
  });
});
