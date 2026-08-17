import { PrismaClient, ContentType, ContentTone, ContentLength } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import { generateMockContent } from "@/lib/ai/mock-content";

const prisma = new PrismaClient();

const CONTENT_TYPES = Object.values(ContentType);
const CONTENT_TONES = Object.values(ContentTone);
const CONTENT_LENGTHS = Object.values(ContentLength);

const PROJECT_TEMPLATES = [
  {
    name: "Q3 Product Launch",
    description: "Copy for the autumn product launch campaign.",
    color: "teal",
  },
  {
    name: "Weekly Newsletter",
    description: "Recurring email content for subscribers.",
    color: "amber",
  },
  {
    name: "Social Refresh",
    description: "A month of fresh captions across channels.",
    color: "violet",
  },
  {
    name: "Client: Northwind Retail",
    description: "Ad copy and product descriptions for a retail client.",
    color: "sky",
  },
];

const PROMPTS = [
  "a productivity app that helps remote teams stay in sync",
  "a sustainable skincare line made with ocean-safe ingredients",
  "a boutique coffee roastery launching a subscription box",
  "an accounting SaaS tool built for freelancers",
  "a fitness app with AI-generated workout plans",
  "a project management tool for creative agencies",
  "a direct-to-consumer mattress brand",
  "a language-learning app focused on conversational fluency",
  "an eco-friendly packaging startup",
  "a fintech app that automates small business bookkeeping",
];

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

async function main() {
  console.log("Seeding database...");

  await prisma.contentItem.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  const demoPasswordHash = await bcrypt.hash("demo1234", 10);
  const demoUser = await prisma.user.create({
    data: {
      name: "Demo User",
      email: "demo@quill.app",
      passwordHash: demoPasswordHash,
      avatarUrl: null,
    },
  });

  const projects = await Promise.all(
    PROJECT_TEMPLATES.map((template) =>
      prisma.project.create({
        data: { ...template, userId: demoUser.id },
      }),
    ),
  );

  let itemCount = 0;
  for (const project of projects) {
    const itemsForProject = faker.number.int({ min: 5, max: 9 });
    for (let i = 0; i < itemsForProject; i++) {
      const type = pick(CONTENT_TYPES);
      const tone = pick(CONTENT_TONES);
      const length = pick(CONTENT_LENGTHS);
      const prompt = pick(PROMPTS);
      const generated = generateMockContent({ type, prompt, tone, length });
      const createdAt = faker.date.past({ years: 1 });

      await prisma.contentItem.create({
        data: {
          type,
          title: generated.title,
          prompt,
          tone,
          length,
          content: generated.content,
          isFavorite: faker.datatype.boolean({ probability: 0.25 }),
          status: "COMPLETE",
          provider: "mock",
          model: "quill-mock-v1",
          tokensUsed: faker.number.int({ min: 80, max: 900 }),
          userId: demoUser.id,
          projectId: project.id,
          createdAt,
          updatedAt: createdAt,
        },
      });
      itemCount++;
    }
  }

  console.log(`Seeded 1 user, ${projects.length} projects, ${itemCount} content items.`);
  console.log("Demo login: demo@quill.app / demo1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
