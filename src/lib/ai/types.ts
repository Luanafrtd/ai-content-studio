export type ContentTypeValue =
  | "BLOG_POST"
  | "SOCIAL_CAPTION"
  | "EMAIL"
  | "PRODUCT_DESCRIPTION"
  | "AD_COPY"
  | "SEO_META"
  | "PRESS_RELEASE";

export type ContentToneValue =
  "PROFESSIONAL" | "FRIENDLY" | "PERSUASIVE" | "PLAYFUL" | "AUTHORITATIVE";

export type ContentLengthValue = "SHORT" | "MEDIUM" | "LONG";

export interface GenerateParams {
  type: ContentTypeValue;
  prompt: string;
  tone: ContentToneValue;
  length: ContentLengthValue;
}

export interface GeneratedContent {
  title: string;
  content: string;
}
