import type { GenerateParams } from "@/lib/ai/types";
import { formatContentType } from "@/lib/format";

const TONE_LABELS: Record<GenerateParams["tone"], string> = {
  PROFESSIONAL: "professional and measured",
  FRIENDLY: "warm and conversational",
  PERSUASIVE: "persuasive and benefit-driven",
  PLAYFUL: "playful and energetic",
  AUTHORITATIVE: "authoritative and expert",
};

const LENGTH_LABELS: Record<GenerateParams["length"], string> = {
  SHORT: "short (a couple of short paragraphs at most)",
  MEDIUM: "medium length (a few well-developed paragraphs)",
  LONG: "long and thorough (multiple sections)",
};

/** System prompt shared by every real (non-mock) provider, so swapping providers changes nothing about instruction quality. */
export function buildSystemPrompt(params: GenerateParams): string {
  return [
    `You are Quill, an AI copywriting assistant embedded in a content studio product.`,
    `Write a ${formatContentType(params.type)} in a ${TONE_LABELS[params.tone]} tone.`,
    `Target length: ${LENGTH_LABELS[params.length]}.`,
    `Respond with the content only — no preamble, no markdown code fences, no meta-commentary about the task.`,
  ].join(" ");
}
