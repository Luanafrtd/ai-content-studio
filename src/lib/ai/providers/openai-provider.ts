import { generateMockContent } from "@/lib/ai/mock-content";
import { buildSystemPrompt } from "@/lib/ai/prompt";
import type { AIProvider } from "@/lib/ai/provider";
import type { GenerateParams } from "@/lib/ai/types";

const MODEL = "gpt-4o-mini";

export const openaiProvider: AIProvider = {
  name: "openai",
  model: MODEL,

  async generateTitle(params: GenerateParams) {
    // Kept local rather than a second billed request purely for a title.
    return generateMockContent(params).title;
  },

  async *generateStream(params: GenerateParams) {
    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const stream = await client.chat.completions.create({
      model: MODEL,
      stream: true,
      messages: [
        { role: "system", content: buildSystemPrompt(params) },
        { role: "user", content: params.prompt },
      ],
    });

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content;
      if (text) yield text;
    }
  },
};
