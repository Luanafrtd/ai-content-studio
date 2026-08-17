import { describe, expect, it } from "vitest";
import { anthropicProvider } from "@/lib/ai/providers/anthropic-provider";
import { openaiProvider } from "@/lib/ai/providers/openai-provider";
import { generateMockContent } from "@/lib/ai/mock-content";
import type { AIProvider } from "@/lib/ai/provider";
import type { GenerateParams } from "@/lib/ai/types";

/**
 * Real, network-hitting tests against the actual Anthropic/OpenAI APIs.
 * Skipped entirely unless the relevant key is present, so these never run
 * in CI or for anyone who clones the repo without keys of their own — see
 * `npm run test:integration` and README "Unlocking real AI generation".
 */

const params: GenerateParams = {
  type: "SOCIAL_CAPTION",
  prompt: "an integration test confirming this provider actually streams real content",
  tone: "FRIENDLY",
  length: "SHORT",
};

async function drain(provider: AIProvider, generateParams: GenerateParams) {
  let text = "";
  let chunks = 0;
  for await (const chunk of provider.generateStream(generateParams)) {
    text += chunk;
    chunks++;
  }
  return { text, chunks };
}

function runProviderSuite(provider: AIProvider) {
  it("generateTitle resolves immediately, without a network call", async () => {
    const start = Date.now();
    const title = await provider.generateTitle(params);
    const elapsedMs = Date.now() - start;

    // Same local heuristic every provider uses — proves this really is a
    // local computation, not a real (billed) call to the model.
    expect(title).toBe(generateMockContent(params).title);
    expect(elapsedMs).toBeLessThan(200);
  });

  it("generateStream returns real, non-empty streamed content", async () => {
    const { text, chunks } = await drain(provider, params);

    expect(text.trim().length).toBeGreaterThan(0);
    expect(chunks).toBeGreaterThan(0);
  });

  it("produces different output for a materially different prompt", async () => {
    const first = await drain(provider, params);
    const second = await drain(provider, {
      ...params,
      prompt: "a completely unrelated topic: the history of lighthouse construction",
    });

    expect(second.text).not.toBe(first.text);
  });
}

describe.skipIf(!process.env.ANTHROPIC_API_KEY)("Anthropic provider (real API)", () => {
  runProviderSuite(anthropicProvider);
});

describe.skipIf(!process.env.OPENAI_API_KEY)("OpenAI provider (real API)", () => {
  runProviderSuite(openaiProvider);
});

if (!process.env.ANTHROPIC_API_KEY && !process.env.OPENAI_API_KEY) {
  it.skip("no ANTHROPIC_API_KEY or OPENAI_API_KEY set — all real-provider tests skipped", () => {});
}
