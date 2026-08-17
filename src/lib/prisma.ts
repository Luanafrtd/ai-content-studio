import { PrismaClient } from "@prisma/client";
import { existsSync, copyFileSync } from "node:fs";
import path from "node:path";

/**
 * Vercel's function filesystem is read-only except for /tmp, so production
 * points DATABASE_URL at `file:/tmp/dev.db`. On a cold start that file won't
 * exist yet, so we seed it from a pre-built snapshot committed at
 * prisma/prod-seed.db. Writes persist for the lifetime of that warm
 * instance, then reset on the next cold start — an intentional tradeoff for
 * a zero-config demo, documented in README.md. Point DATABASE_URL at a real
 * Postgres instance instead for genuine write persistence.
 */
function bootstrapProductionDatabase() {
  const databaseUrl = process.env.DATABASE_URL ?? "";
  if (!databaseUrl.startsWith("file:/tmp")) return;

  const dest = databaseUrl.replace("file:", "");
  if (existsSync(dest)) return;

  const source = path.join(process.cwd(), "prisma", "prod-seed.db");
  if (existsSync(source)) {
    copyFileSync(source, dest);
  }
}

bootstrapProductionDatabase();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
