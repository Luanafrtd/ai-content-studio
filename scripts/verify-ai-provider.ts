/**
 * Exercises the currently-configured real AI provider (Anthropic or OpenAI)
 * directly against the live API — bypassing the app/auth entirely, since
 * this is about proving the provider layer itself works, not the route
 * around it. Run with the relevant key set:
 *
 *   ANTHROPIC_API_KEY=sk-ant-... npx tsx scripts/verify-ai-provider.ts
 *   OPENAI_API_KEY=sk-... npx tsx scripts/verify-ai-provider.ts
 *
 * Prints the resolved provider/model, the title (should return instantly,
 * with no network call — see src/lib/ai/prompt.ts), then streams and prints
 * the generated content chunk-by-chunk so you can see it arrive live.
 */
import { getAIProvider } from "../src/lib/ai";
import type { GenerateParams } from "../src/lib/ai/types";

const params: GenerateParams = {
  type: "SOCIAL_CAPTION",
  prompt: "a 30-second smoke test confirming this AI provider actually works",
  tone: "FRIENDLY",
  length: "SHORT",
};

async function main() {
  const provider = getAIProvider();

  if (provider.name === "mock") {
    console.error(
      "No ANTHROPIC_API_KEY or OPENAI_API_KEY is set, so getAIProvider() resolved to the " +
        "mock provider — nothing to verify. Set one of those env vars and re-run.",
    );
    process.exit(1);
  }

  console.log(`Provider: ${provider.name}`);
  console.log(`Model: ${provider.model}`);
  console.log("");

  const titleStart = Date.now();
  const title = await provider.generateTitle(params);
  const titleMs = Date.now() - titleStart;
  console.log(`Title (${titleMs}ms, should be near-instant — no network call): ${title}`);
  if (titleMs > 200) {
    console.warn(
      "  ⚠ generateTitle took longer than expected for a local-only call — check it isn't " +
        "accidentally hitting the network.",
    );
  }
  console.log("");

  console.log("Streaming content:");
  console.log("---");
  const streamStart = Date.now();
  let fullText = "";
  let chunkCount = 0;
  try {
    for await (const chunk of provider.generateStream(params)) {
      process.stdout.write(chunk);
      fullText += chunk;
      chunkCount++;
    }
  } catch (error) {
    console.error("\n---");
    console.error("generateStream threw:", error);
    process.exit(1);
  }
  console.log("\n---");
  console.log(
    `Done in ${Date.now() - streamStart}ms, ${chunkCount} chunks, ${fullText.length} characters.`,
  );

  if (fullText.trim().length === 0) {
    console.error("Stream completed but produced no text — that's a bug.");
    process.exit(1);
  }

  console.log("\n✔ Provider works end to end.");
}

main().catch((error) => {
  console.error("VERIFICATION FAILED:", error);
  process.exit(1);
});
