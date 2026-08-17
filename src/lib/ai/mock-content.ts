import type { GeneratedContent, GenerateParams } from "@/lib/ai/types";

/**
 * A deterministic, template-driven "AI" — no network call, no key, no cost.
 * Seeded from the request itself so the same prompt/type/tone/length always
 * produces the same output (useful for tests and for a stable demo), while
 * different inputs still read as genuinely different copy.
 */

function hashString(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)]!;
}

function pickN<T>(rng: () => number, arr: readonly T[], n: number): T[] {
  const pool = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && pool.length > 0; i++) {
    const idx = Math.floor(rng() * pool.length);
    out.push(pool.splice(idx, 1)[0]!);
  }
  return out;
}

function topic(prompt: string): string {
  const trimmed = prompt.trim().replace(/\s+/g, " ");
  return trimmed.length > 0 ? trimmed : "your product";
}

function titleCase(input: string): string {
  return input
    .split(" ")
    .map((word) => (word.length > 3 ? word[0]!.toUpperCase() + word.slice(1) : word))
    .join(" ");
}

const TONE_OPENERS: Record<GenerateParams["tone"], string[]> = {
  PROFESSIONAL: [
    "In today's landscape,",
    "Organizations increasingly recognize that",
    "It's clear that",
  ],
  FRIENDLY: ["Let's be honest —", "Here's the thing:", "You already know this, but"],
  PERSUASIVE: [
    "Don't just take our word for it —",
    "Now more than ever,",
    "The results speak for themselves:",
  ],
  PLAYFUL: ["Okay, real talk:", "Plot twist:", "Fun fact you didn't ask for:"],
  AUTHORITATIVE: [
    "The data is unambiguous:",
    "Industry research consistently shows that",
    "Experts agree:",
  ],
};

const TONE_CLOSERS: Record<GenerateParams["tone"], string[]> = {
  PROFESSIONAL: [
    "We're committed to delivering measurable results.",
    "Reach out to learn more about our approach.",
  ],
  FRIENDLY: ["We'd love to hear what you think.", "Come say hi — we're always around."],
  PERSUASIVE: ["Don't wait — get started today.", "The opportunity won't last forever."],
  PLAYFUL: ["That's it. That's the post.", "Go forth and do the thing."],
  AUTHORITATIVE: ["The evidence supports one conclusion.", "This is the standard going forward."],
};

const TONE_ADJECTIVES: Record<GenerateParams["tone"], string[]> = {
  PROFESSIONAL: ["reliable", "efficient", "strategic", "streamlined"],
  FRIENDLY: ["easy", "welcoming", "delightful", "approachable"],
  PERSUASIVE: ["game-changing", "essential", "proven", "unmissable"],
  PLAYFUL: ["fun", "surprisingly good", "ridiculously simple", "kind of addictive"],
  AUTHORITATIVE: ["industry-leading", "battle-tested", "data-backed", "definitive"],
};

function sizeFactor(length: GenerateParams["length"]): number {
  return length === "SHORT" ? 1 : length === "MEDIUM" ? 2 : 3;
}

function buildParagraph(
  rng: () => number,
  tone: GenerateParams["tone"],
  subject: string,
  sentences: number,
): string {
  const opener = pick(rng, TONE_OPENERS[tone]);
  const adjective = pick(rng, TONE_ADJECTIVES[tone]);
  const parts = [
    `${opener} ${subject} has become a ${adjective} priority for teams that want to move faster without sacrificing quality.`,
  ];
  const fillers = [
    `It removes the guesswork, replacing scattered notes and one-off documents with a single, organized workflow.`,
    `Every detail is captured, searchable, and ready to reuse the next time it's needed.`,
    `The difference shows up immediately — less time spent starting from a blank page, more time spent refining what matters.`,
    `Teams that adopt this approach consistently report faster turnaround and more consistent output.`,
    `Instead of reinventing the process each time, the pattern is captured once and reused everywhere.`,
  ];
  for (let i = 0; i < sentences - 1; i++) {
    parts.push(pick(rng, fillers));
  }
  return parts.join(" ");
}

function generateBlogPost(rng: () => number, params: GenerateParams): GeneratedContent {
  const subject = topic(params.prompt);
  const title = titleCase(
    `${pick(rng, ["The Complete Guide to", "How to Think About", "Why", "A Practical Look at"])} ${subject}`,
  );
  const sections = sizeFactor(params.length) + 1;
  const headings = pickN(
    rng,
    [
      "Why It Matters",
      "Getting Started",
      "Common Pitfalls",
      "Best Practices",
      "What's Next",
      "The Bottom Line",
    ],
    sections - 1,
  );
  const intro = buildParagraph(rng, params.tone, subject, 3);
  const body = headings
    .map(
      (heading) =>
        `## ${heading}\n\n${buildParagraph(rng, params.tone, subject, sizeFactor(params.length) + 1)}`,
    )
    .join("\n\n");
  const closer = pick(rng, TONE_CLOSERS[params.tone]);
  return {
    title,
    content: `${intro}\n\n${body}\n\n${closer}`,
  };
}

function generateSocialCaption(rng: () => number, params: GenerateParams): GeneratedContent {
  const subject = topic(params.prompt);
  const hook = pick(rng, [
    `${pick(rng, TONE_OPENERS[params.tone])} ${subject} just got a whole lot easier.`,
    `We've been quietly working on ${subject} — here's the update.`,
    `${titleCase(subject)}, reimagined.`,
  ]);
  const sentences = sizeFactor(params.length);
  const body = Array.from({ length: sentences }, () =>
    buildParagraph(rng, params.tone, subject, 1),
  ).join(" ");
  const hashtagPool = subject
    .split(" ")
    .filter((w) => w.length > 3)
    .slice(0, 4)
    .map((w) => `#${w.replace(/[^a-zA-Z0-9]/g, "")}`);
  const hashtags = [...new Set([...hashtagPool, "#ContentStudio", "#Quill"])].slice(0, 5).join(" ");
  return {
    title: titleCase(hook.length > 60 ? hook.slice(0, 57) + "..." : hook),
    content: `${hook}\n\n${body}\n\n${hashtags}`,
  };
}

function generateEmail(rng: () => number, params: GenerateParams): GeneratedContent {
  const subject = topic(params.prompt);
  const subjectLine = titleCase(
    pick(rng, [
      `Introducing: ${subject}`,
      `${subject} — here's what's new`,
      `A quick update on ${subject}`,
    ]),
  );
  const paragraphs = sizeFactor(params.length);
  const body = Array.from({ length: paragraphs }, () =>
    buildParagraph(rng, params.tone, subject, 2),
  ).join("\n\n");
  const cta = pick(rng, ["Learn more", "Get started", "See it in action", "Book a demo"]);
  const closer = pick(rng, TONE_CLOSERS[params.tone]);
  return {
    title: subjectLine,
    content: `Subject: ${subjectLine}\n\nHi there,\n\n${body}\n\n${closer}\n\n[${cta} →]\n\nBest,\nThe Team`,
  };
}

function generateProductDescription(rng: () => number, params: GenerateParams): GeneratedContent {
  const subject = topic(params.prompt);
  const title = titleCase(subject);
  const intro = buildParagraph(rng, params.tone, subject, 2);
  const featureCount = sizeFactor(params.length) + 1;
  const features = pickN(
    rng,
    [
      "Thoughtful, intuitive design that gets out of your way",
      "Built to scale from a single user to an entire team",
      "Fast setup — no training required",
      "Works with the tools you already use",
      "Backed by real support, not just documentation",
      "Continuously improved based on real usage",
    ],
    Math.min(featureCount, 6),
  );
  const bullets = features.map((f) => `- ${f}`).join("\n");
  const closer = pick(rng, TONE_CLOSERS[params.tone]);
  return {
    title,
    content: `${intro}\n\n${bullets}\n\n${closer}`,
  };
}

function generateAdCopy(rng: () => number, params: GenerateParams): GeneratedContent {
  const subject = topic(params.prompt);
  const adjective = pick(rng, TONE_ADJECTIVES[params.tone]);
  const headline = titleCase(
    pick(rng, [
      `Meet the ${adjective} way to handle ${subject}`,
      `${titleCase(subject)}. Done right.`,
    ]),
  );
  const variantCount = sizeFactor(params.length);
  const variants = Array.from({ length: variantCount }, (_, i) => {
    const cta = pick(rng, ["Try it free", "Get started today", "See the difference", "Start now"]);
    return `Variant ${i + 1}: ${buildParagraph(rng, params.tone, subject, 1)} ${cta} →`;
  }).join("\n\n");
  return {
    title: headline,
    content: `${headline}\n\n${variants}`,
  };
}

function generateSeoMeta(rng: () => number, params: GenerateParams): GeneratedContent {
  const subject = topic(params.prompt);
  const titleTag = titleCase(`${subject} | Complete Guide`).slice(0, 60);
  const description = buildParagraph(rng, params.tone, subject, 1).slice(0, 155);
  const slug = subject
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
  return {
    title: `SEO Meta: ${titleCase(subject)}`,
    content: `Title Tag: ${titleTag}\n\nMeta Description: ${description}\n\nSuggested URL Slug: /${slug}\n\nPrimary Keyword: ${subject.split(" ")[0]}`,
  };
}

function generatePressRelease(rng: () => number, params: GenerateParams): GeneratedContent {
  const subject = topic(params.prompt);
  const headline = titleCase(`Announcing ${subject}`).toUpperCase();
  const dateline = `FOR IMMEDIATE RELEASE`;
  const lede = buildParagraph(rng, params.tone, subject, 2);
  const paragraphs = sizeFactor(params.length);
  const body = Array.from({ length: paragraphs }, () =>
    buildParagraph(rng, params.tone, subject, 2),
  ).join("\n\n");
  const quote = `"${pick(rng, [
    "This changes how our customers think about their day-to-day work.",
    "We built this because the old way was holding teams back.",
    "It's the kind of improvement that compounds over time.",
  ])}" said a company spokesperson.`;
  return {
    title: headline,
    content: `${dateline}\n\n${headline}\n\n${lede}\n\n${body}\n\n${quote}\n\n###`,
  };
}

const GENERATORS: Record<
  GenerateParams["type"],
  (rng: () => number, params: GenerateParams) => GeneratedContent
> = {
  BLOG_POST: generateBlogPost,
  SOCIAL_CAPTION: generateSocialCaption,
  EMAIL: generateEmail,
  PRODUCT_DESCRIPTION: generateProductDescription,
  AD_COPY: generateAdCopy,
  SEO_META: generateSeoMeta,
  PRESS_RELEASE: generatePressRelease,
};

export function generateMockContent(params: GenerateParams): GeneratedContent {
  const seed = hashString(`${params.type}:${params.prompt}:${params.tone}:${params.length}`);
  const rng = mulberry32(seed);
  const generator = GENERATORS[params.type];
  return generator(rng, params);
}
