import { generateMockContent } from "@/lib/ai/mock-content";
import { buildSystemPrompt } from "@/lib/ai/prompt";
import type { AIProvider } from "@/lib/ai/provider";
import type { GenerateParams } from "@/lib/ai/types";

const MODEL = "claude-sonnet-5";

export const anthropicProvider: AIProvider = {
  name: "anthropic",
  model: MODEL,

  async generateTitle(params: GenerateParams) {
    // Kept local rather than a second billed request purely for a title.
    return generateMockContent(params).title;
  },

  async *generateStream(params: GenerateParams) {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const stream = client.messages.stream({
      model: MODEL,
      max_tokens: 2048,
      system: buildSystemPrompt(params),
      messages: [{ role: "user", content: params.prompt }],
    });

    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        yield event.delta.text;
      }
    }
  },
};
