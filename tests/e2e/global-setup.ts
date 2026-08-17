import { execSync } from "node:child_process";

export default function globalSetup() {
  // Reseed the database so e2e tests run against known, deterministic data.
  // Uses the app's own seed script (which clears tables via Prisma Client, not
  // a destructive migration command) rather than `prisma db push --force-reset`.
  execSync("npx prisma db push --skip-generate", { stdio: "inherit" });
  execSync("npx tsx prisma/seed.ts", { stdio: "inherit" });
}
