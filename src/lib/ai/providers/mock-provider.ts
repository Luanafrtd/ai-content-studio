import { generateMockContent } from "@/lib/ai/mock-content";
import type { AIProvider } from "@/lib/ai/provider";
import type { GenerateParams } from "@/lib/ai/types";

const CHUNK_WORD_SIZE = 7;
const CHUNK_DELAY_MS = 18;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const mockProvider: AIProvider = {
  name: "mock",
  model: "quill-mock-v1",

  async generateTitle(params: GenerateParams) {
    return generateMockContent(params).title;
  },

  async *generateStream(params: GenerateParams) {
    const { content } = generateMockContent(params);
    const words = content.split(" ");
    for (let i = 0; i < words.length; i += CHUNK_WORD_SIZE) {
      const chunk = words.slice(i, i + CHUNK_WORD_SIZE).join(" ");
      yield i === 0 ? chunk : ` ${chunk}`;
      await delay(CHUNK_DELAY_MS);
    }
  },
};
