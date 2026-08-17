import { describe, expect, it } from "vitest";
import { checkRateLimit } from "@/lib/ai/rate-limiter";

function uniqueKey() {
  return `test-user-${Math.random().toString(36).slice(2)}`;
}

describe("checkRateLimit", () => {
  it("allows requests under the limit", () => {
    const key = uniqueKey();
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit(key).allowed).toBe(true);
    }
  });

  it("blocks requests once the limit is exceeded", () => {
    const key = uniqueKey();
    for (let i = 0; i < 30; i++) {
      expect(checkRateLimit(key).allowed).toBe(true);
    }
    const result = checkRateLimit(key);
    expect(result.allowed).toBe(false);
    expect(result.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("tracks separate keys independently", () => {
    const keyA = uniqueKey();
    const keyB = uniqueKey();
    for (let i = 0; i < 30; i++) checkRateLimit(keyA);
    expect(checkRateLimit(keyA).allowed).toBe(false);
    expect(checkRateLimit(keyB).allowed).toBe(true);
  });
});
