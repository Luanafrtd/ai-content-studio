import type { GenerateParams } from "@/lib/ai/types";

export interface AIProvider {
  /** Machine-readable id, persisted on the ContentItem (e.g. "mock", "anthropic", "openai"). */
  name: string;
  /** Human-readable model identifier, persisted on the ContentItem. */
  model: string;
  /**
   * Fast, non-streamed title for the piece. Deliberately kept cheap (a local
   * heuristic, not a second billed model call) — every provider implements
   * this the same lightweight way so a title is available immediately,
   * before the content stream even starts.
   */
  generateTitle(params: GenerateParams): Promise<string>;
  /** Yields text chunks as they become available, streaming-first so the UI can render output live. */
  generateStream(params: GenerateParams): AsyncIterable<string>;
}
