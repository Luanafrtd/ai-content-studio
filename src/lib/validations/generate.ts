import { z } from "zod";

export const contentTypeSchema = z.enum([
  "BLOG_POST",
  "SOCIAL_CAPTION",
  "EMAIL",
  "PRODUCT_DESCRIPTION",
  "AD_COPY",
  "SEO_META",
  "PRESS_RELEASE",
]);

export const contentToneSchema = z.enum([
  "PROFESSIONAL",
  "FRIENDLY",
  "PERSUASIVE",
  "PLAYFUL",
  "AUTHORITATIVE",
]);

export const contentLengthSchema = z.enum(["SHORT", "MEDIUM", "LONG"]);

export const generateSchema = z.object({
  projectId: z.string().min(1, "Choose a project"),
  type: contentTypeSchema,
  prompt: z.string().trim().min(10, "Describe what you need in at least 10 characters").max(2000),
  tone: contentToneSchema,
  length: contentLengthSchema,
});

export type GenerateFormInput = z.infer<typeof generateSchema>;
