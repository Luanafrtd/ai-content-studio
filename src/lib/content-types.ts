import type { LucideIcon } from "lucide-react";
import {
  FileText,
  MessageSquareText,
  Mail,
  ShoppingBag,
  Megaphone,
  Search,
  Newspaper,
} from "lucide-react";

export interface ContentTypeMeta {
  value: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const CONTENT_TYPES: ContentTypeMeta[] = [
  {
    value: "BLOG_POST",
    label: "Blog Post",
    description: "Long-form article with headings and a clear structure.",
    icon: FileText,
  },
  {
    value: "SOCIAL_CAPTION",
    label: "Social Caption",
    description: "Short, hook-driven copy with hashtags for social platforms.",
    icon: MessageSquareText,
  },
  {
    value: "EMAIL",
    label: "Email",
    description: "Subject line plus body, ready to send to a list.",
    icon: Mail,
  },
  {
    value: "PRODUCT_DESCRIPTION",
    label: "Product Description",
    description: "Feature-benefit copy with a scannable bullet list.",
    icon: ShoppingBag,
  },
  {
    value: "AD_COPY",
    label: "Ad Copy",
    description: "Punchy headline with multiple ad variants and CTAs.",
    icon: Megaphone,
  },
  {
    value: "SEO_META",
    label: "SEO Meta",
    description: "Title tag, meta description, and a suggested URL slug.",
    icon: Search,
  },
  {
    value: "PRESS_RELEASE",
    label: "Press Release",
    description: "Newsroom-style announcement with a quote and boilerplate.",
    icon: Newspaper,
  },
];

export const CONTENT_TONES = [
  { value: "PROFESSIONAL", label: "Professional" },
  { value: "FRIENDLY", label: "Friendly" },
  { value: "PERSUASIVE", label: "Persuasive" },
  { value: "PLAYFUL", label: "Playful" },
  { value: "AUTHORITATIVE", label: "Authoritative" },
];

export const CONTENT_LENGTHS = [
  { value: "SHORT", label: "Short" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LONG", label: "Long" },
];

export function getContentTypeMeta(value: string): ContentTypeMeta {
  return CONTENT_TYPES.find((t) => t.value === value) ?? CONTENT_TYPES[0]!;
}

export const PROJECT_COLOR_CLASSES: Record<string, string> = {
  teal: "bg-chart-1/15 text-chart-1",
  amber: "bg-chart-2/15 text-chart-2",
  coral: "bg-chart-3/15 text-chart-3",
  violet: "bg-chart-4/15 text-chart-4",
  sky: "bg-chart-5/15 text-chart-5",
};
