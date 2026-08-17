import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const limitMock = vi.fn();

vi.mock("@upstash/redis", () => ({
  Redis: vi.fn().mockImplementation(function Redis() {
    return {};
  }),
}));

vi.mock("@upstash/ratelimit", () => ({
  Ratelimit: Object.assign(
    vi.fn().mockImplementation(function Ratelimit() {
      return { limit: limitMock };
    }),
    { slidingWindow: vi.fn() },
  ),
}));

function uniqueKey() {
  return `test-user-${Math.random().toString(36).slice(2)}`;
}

describe("checkRateLimit — in-memory fallback (no Redis configured)", () => {
  beforeEach(() => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("allows requests under the limit", async () => {
    const { checkRateLimit } = await import("@/lib/ai/rate-limiter");
    const key = uniqueKey();
    for (let i = 0; i < 5; i++) {
      expect((await checkRateLimit(key)).allowed).toBe(true);
    }
  });

  it("blocks requests once the limit is exceeded", async () => {
    const { checkRateLimit } = await import("@/lib/ai/rate-limiter");
    const key = uniqueKey();
    for (let i = 0; i < 30; i++) {
      expect((await checkRateLimit(key)).allowed).toBe(true);
    }
    const result = await checkRateLimit(key);
    expect(result.allowed).toBe(false);
    expect(result.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("tracks separate keys independently", async () => {
    const { checkRateLimit } = await import("@/lib/ai/rate-limiter");
    const keyA = uniqueKey();
    const keyB = uniqueKey();
    for (let i = 0; i < 30; i++) await checkRateLimit(keyA);
    expect((await checkRateLimit(keyA)).allowed).toBe(false);
    expect((await checkRateLimit(keyB)).allowed).toBe(true);
  });
});

describe("checkRateLimit — Redis-backed (Upstash configured)", () => {
  beforeEach(() => {
    limitMock.mockReset();
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://example.upstash.io");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test-token");
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("allows the request when Redis reports success", async () => {
    limitMock.mockResolvedValue({ success: true, reset: Date.now() + 1000 });
    const { checkRateLimit } = await import("@/lib/ai/rate-limiter");

    const result = await checkRateLimit("user-1");

    expect(result.allowed).toBe(true);
    expect(limitMock).toHaveBeenCalledWith("user-1");
  });

  it("blocks the request and reports retryAfterSeconds when Redis reports failure", async () => {
    const reset = Date.now() + 45_000;
    limitMock.mockResolvedValue({ success: false, reset });
    const { checkRateLimit } = await import("@/lib/ai/rate-limiter");

    const result = await checkRateLimit("user-1");

    expect(result.allowed).toBe(false);
    expect(result.retryAfterSeconds).toBeGreaterThan(0);
    expect(result.retryAfterSeconds).toBeLessThanOrEqual(45);
  });

  it("does not fall back to the in-memory limiter when Redis is configured", async () => {
    limitMock.mockResolvedValue({ success: true, reset: Date.now() + 1000 });
    const { checkRateLimit } = await import("@/lib/ai/rate-limiter");

    await checkRateLimit("user-1");

    expect(limitMock).toHaveBeenCalledTimes(1);
  });
});
