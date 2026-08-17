/**
 * In-memory, per-instance rate limiter. Deliberately not Redis-backed — that
 * would be the first thing to swap in for a real multi-instance deployment
 * (see CASE_STUDY.md). Good enough here because the mock provider is free
 * and the real providers are opt-in via the user's own API key.
 */

const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 30;

const hits = new Map<string, number[]>();

export function checkRateLimit(key: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const existing = (hits.get(key) ?? []).filter((ts) => ts > windowStart);

  if (existing.length >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfterSeconds = Math.ceil((existing[0]! + WINDOW_MS - now) / 1000);
    hits.set(key, existing);
    return { allowed: false, retryAfterSeconds };
  }

  existing.push(now);
  hits.set(key, existing);
  return { allowed: true };
}
