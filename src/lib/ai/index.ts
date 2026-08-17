import { mockProvider } from "@/lib/ai/providers/mock-provider";
import { anthropicProvider } from "@/lib/ai/providers/anthropic-provider";
import { openaiProvider } from "@/lib/ai/providers/openai-provider";
import type { AIProvider } from "@/lib/ai/provider";

export type { AIProvider } from "@/lib/ai/provider";
export type { GenerateParams, GeneratedContent } from "@/lib/ai/types";

/**
 * The single place provider selection happens. Priority:
 * ANTHROPIC_API_KEY > OPENAI_API_KEY > mock (zero-config default).
 * The real SDKs (@anthropic-ai/sdk, openai) are dynamically imported inside
 * each provider's generateStream, so neither is loaded into the running
 * process unless its key is actually set and generation is actually called.
 */
export function getAIProvider(): AIProvider {
  if (process.env.ANTHROPIC_API_KEY) return anthropicProvider;
  if (process.env.OPENAI_API_KEY) return openaiProvider;
  return mockProvider;
}
