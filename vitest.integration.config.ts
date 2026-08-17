import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

// Separate from vitest.config.ts on purpose: these tests make real network
// calls to Anthropic/OpenAI and only run when you supply your own API key,
// so they're never part of `npm run test` or CI (see README "Unlocking real
// AI generation").
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    globals: true,
    include: ["tests/integration/**/*.test.ts"],
    testTimeout: 30_000,
  },
});
