import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Per-user generation rate limit: 30 requests/hour.
 *
 * Backed by Upstash Redis when UPSTASH_REDIS_REST_URL/TOKEN are set — a
 * sliding-window counter that persists across serverless cold starts and
 * multiple instances, unlike an in-memory Map. Falls back to an in-memory
 * limiter (this project's original implementation) when Redis isn't
 * configured, so local dev and forks of this repo keep working with zero
 * setup — same "mock by default, real when configured" pattern as the AI
 * provider factory in src/lib/ai/index.ts. The fallback is a real safety
 * net, not a stub: it enforces the same limit, just per-instance rather
 * than globally.
 */

const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 30;

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
}

const inMemoryHits = new Map<string, number[]>();

function checkInMemory(key: string): RateLimitResult {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const existing = (inMemoryHits.get(key) ?? []).filter((ts) => ts > windowStart);

  if (existing.length >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfterSeconds = Math.ceil((existing[0]! + WINDOW_MS - now) / 1000);
    inMemoryHits.set(key, existing);
    return { allowed: false, retryAfterSeconds };
  }

  existing.push(now);
  inMemoryHits.set(key, existing);
  return { allowed: true };
}

function createRedisLimiter(): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  return new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(MAX_REQUESTS_PER_WINDOW, "1 h"),
    prefix: "quill:generate",
    analytics: false,
  });
}

const redisLimiter = createRedisLimiter();

export async function checkRateLimit(key: string): Promise<RateLimitResult> {
  if (!redisLimiter) {
    return checkInMemory(key);
  }

  const result = await redisLimiter.limit(key);
  if (result.success) return { allowed: true };

  const retryAfterSeconds = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000));
  return { allowed: false, retryAfterSeconds };
}
