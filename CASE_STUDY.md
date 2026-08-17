# Case Study: Quill

A walkthrough of the decisions behind this project — what I built, why I built it this way, and what I'd do differently with more time or a real production mandate.

## The brief

Build a production-quality AI content studio as a portfolio piece: AI-powered generation, project-based organization, search and filtering, favorites, an analytics dashboard, automated tests, CI/CD, and a deployment story — held to the bar of "something a paying customer could actually use," not a tutorial scaffold.

The constraint that shapes everything else, on top of the usual "reviewable in under five minutes with zero setup friction": the AI generation feature specifically needed to run with **no API key and no billing risk** on a public, free-tier deployment, while still reading as a genuine AI product rather than a static demo.

## Architecture overview

```
Browser
  │
  ▼
Next.js App Router (React Server Components + Client Components)
  │              │
  │              ├─ TanStack Query ── fetch/mutate ──► Route Handlers (src/app/api/**)
  │              │                                          │
  │              └─ fetch + ReadableStream ──► POST /api/generate (streaming)
  ▼                                                          │
Auth.js middleware (Edge)                                    ▼
  │                                                  getAIProvider() ──► mock | anthropic | openai
  └─ protects /dashboard/**, redirects to /login              │
                                                                ▼
                                                        Prisma Client ──► SQLite (dev) / Postgres (prod-ready)
```

Server Components fetch initial data directly through Prisma; Client Components take over via TanStack Query for mutations and cache invalidation. The one deliberate departure from that pattern is generation itself, which needs a real byte stream rather than a JSON response — see below.

## Key decisions

### The AI layer: a provider interface, mock by default

**Decision:** `AIProvider` (`src/lib/ai/provider.ts`) is a two-method interface — `generateTitle(params)` (fast, non-streamed) and `generateStream(params)` (an `AsyncIterable<string>`) — implemented by three interchangeable modules: `mock-provider.ts`, `anthropic-provider.ts`, `openai-provider.ts`. A single factory, `getAIProvider()`, picks between them based on which API key (if any) is set: `ANTHROPIC_API_KEY` → Anthropic, else `OPENAI_API_KEY` → OpenAI, else the mock. Nothing else in the app knows or cares which one is active.

**Why:** The product requirement was blunt — a public demo that costs nothing to run and can't be abused into a bill, but that still has to feel like a real AI tool. Building the mock provider as a first-class citizen of the same interface (rather than a `NODE_ENV === "test"` special case) meant the "fake" path and the "real" path are exercised by the exact same code in `/api/generate`, the same streaming UI, and the same tests. Swapping to a real model is an environment variable, not a deploy.

**How the mock is actually generated:** `src/lib/ai/mock-content.ts` is a deterministic, template-driven text generator — no ML, just seeded pseudo-randomness (`mulberry32`, seeded from a hash of the request) picking from tone- and type-aware sentence banks. Deterministic on purpose: the same prompt/type/tone/length always produces the same output, which makes it possible to unit-test (`tests/unit/mock-content.test.ts` asserts on determinism directly) and gives the demo a consistent, repeatable feel rather than word-salad.

**The real SDKs never load unless they're used.** `@anthropic-ai/sdk` and `openai` are imported with a dynamic `await import(...)` *inside* each provider's `generateStream`, not at module scope. In the default (mock-only, no keys) deployment, neither SDK is ever pulled into the running request path.

**A deliberate asymmetry — title generation is never a second billed call.** Every provider's `generateTitle` uses the same local heuristic (derived from the mock generator's title logic), not a real model call, even when Anthropic or OpenAI is active. Real title generation would mean either a second API call per generation (double the cost and latency for something cosmetic) or awkwardly parsing a title out of the first streamed chunk. I chose "cheap and instant" over "technically AI-generated" for a field the user barely looks at before the body finishes streaming anyway.

**Honest gap this design left, and how it's covered:** the mock provider is exercised constantly (every test, every demo run), but the real Anthropic/OpenAI providers were, for a while, pure interface-conformance code — never actually run against the live APIs, so the streaming-chunk parsing (`event.delta.type === "text_delta"` for Anthropic, `chunk.choices[0]?.delta?.content` for OpenAI) was unverified against real response shapes. `scripts/verify-ai-provider.ts` and `tests/integration/ai-providers.integration.test.ts` (run via `npm run test:integration`, skipped automatically without a key) now exist specifically to close that gap — they make real calls and assert on real streamed output, separate from the always-on mock-backed suite.

### Streaming: hand-rolled NDJSON over `fetch`, not Server-Sent Events

**Decision:** `POST /api/generate` returns a `ReadableStream` of newline-delimited JSON events (`{"type":"title",...}`, `{"type":"chunk",...}`, `{"type":"done","id":...}`), read on the client with `response.body.getReader()` in `src/hooks/use-generate.ts`, not the browser's native `EventSource`.

**Why:** `EventSource` is the standard tool for server-push, but it's GET-only — it can't carry the generation request (project, prompt, tone, length) as a POST body, and stuffing structured input into query params for a prompt that can run to 2,000 characters isn't a serious option. A `fetch` POST with a streamed response body gets the same live-typing UX with a normal request. The NDJSON framing is just enough structure to distinguish "here's the title" from "here's a content chunk" from "here's the final database id" over one text stream, without needing a heavier protocol.

**Persistence happens inside the stream, after the last chunk.** The route accumulates the full text server-side as it streams it to the client, then writes one `ContentItem` row once generation completes — so a dropped connection mid-stream simply never persists a partial row, rather than persisting garbage.

### Auth: Auth.js Credentials, with real self-service signup this time

**Decision:** Auth.js v5 Credentials provider against a Prisma `User` table, same edge-safe split (`auth.config.ts` for the Edge-safe middleware config, `auth.ts` for the full Prisma/bcrypt-backed provider) as the pattern I'd use for any project needing zero-dependency auth. What's different here: a real `/register` route (bcrypt hash, Zod-validated, immediate sign-in) alongside a seeded `demo@quill.app` account surfaced as a genuine one-click sign-in button — not just an autofill.

**Why:** The brief specifically asked for the product to feel sellable, and "you can only ever log in as one shared demo user" reads as a toy. Self-service signup costs one route handler and one form; it's the difference between "here's a fixed demo" and "here's a product you could actually hand a real user."

### Data layer: Prisma + SQLite, one line from Postgres

Same reasoning and the same cold-start trick as I'd use on any zero-config demo: SQLite locally and by default in production, with `src/lib/prisma.ts` copying a committed, pre-seeded snapshot (`prisma/prod-seed.db`) into Vercel's writable `/tmp` on cold start (`bootstrapProductionDatabase()`, gated on the `DATABASE_URL` actually pointing at `file:/tmp/...`). Writes are real and persist for the life of a warm Lambda instance, then reset on the next cold start — an intentional, disclosed tradeoff, not a hidden limitation. `next.config.ts` declares `outputFileTracingIncludes` for the snapshot file because Vercel's static file tracer can't see a `path.join()`-constructed path at build time and would otherwise drop it from the deployment bundle. Point `DATABASE_URL` at real Postgres and change one line in `prisma/schema.prisma` (`provider = "sqlite"` → `"postgresql"`) for genuine persistence — `bootstrapProductionDatabase()` no-ops immediately in that case.

### Rate limiting: started in-memory, fixed once I was honest about what that meant in production

**Original decision:** ship `checkRateLimit()` as a plain in-memory `Map`, 30 generations/hour per user, no Redis — framed at the time as "correct for a single serverless instance, and the first thing to swap for Redis once there's more than one."

**Why that framing undersold the problem:** on Vercel, "one instance" isn't a stable, long-lived thing the way it is on a traditional server — cold starts happen routinely under normal, low-traffic use, not just under horizontal scale-out. A fresh cold start means a fresh, empty `Map`. In the environment this app actually deploys to, an in-memory limiter is closer to "works between some pairs of consecutive requests" than "enforces 30/hour." I'd described the tradeoff honestly but hadn't fully reasoned through how weak it was in the specific deployment target I was already shipping to.

**Fix:** `checkRateLimit()` now checks for `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` and, if present, uses `@upstash/ratelimit`'s sliding-window limiter against real Redis — a counter that persists across cold starts and is shared across every instance, because it isn't in process memory at all. If those env vars aren't set, it falls back to the original in-memory limiter rather than failing open, so local dev and any fork of this repo keep working with zero setup — the same "mock/fallback by default, real when configured" shape as the AI provider factory. The one caller (`/api/generate`) didn't need to change beyond `await`-ing a call that's now inherently async (a Redis check is a network round trip; the in-memory path could stay synchronous, but a uniform async signature keeps both paths behind one interface).

Both paths are covered in `tests/unit/rate-limiter.test.ts` — the in-memory path with the original behavioral tests, the Redis path by mocking `@upstash/ratelimit` and asserting the wrapper correctly maps its `{ success, reset }` result to this project's `{ allowed, retryAfterSeconds }` shape.

### A real bug I hit: Radix `ScrollArea` inside a flex-column dialog

Both the content-detail dialog and the live generation panel needed a header/metadata block that stays put, a body that scrolls, and a footer of action buttons pinned below — the standard `flex flex-col` + `flex-1 min-h-0` scrollable-middle pattern. I built it with shadcn's `ScrollArea` component, which wraps Radix's `ScrollArea.Viewport` (styled `size-full`, i.e. `height: 100%`) inside a flex item.

In the running app, the footer buttons rendered visually overlapping the last lines of streamed content instead of sitting cleanly below it. `getComputedStyle` on the Viewport showed why: its resolved height (460px) was *taller than its own parent's* resolved height (325px) — `height: 100%` wasn't resolving against the flex-computed parent size the way it does in a plain block layout, so the Viewport grew to fit its content instead of clipping and scrolling it, and the footer (a later flex sibling with default `flex-shrink: 1`) got squeezed by the overflow rather than pushed below it. The fix was to drop `ScrollArea` for these two spots and use a plain `overflow-y-auto` div instead — no percentage-height indirection through an extra Viewport layer, so the flex box's own height constraint is all there is to resolve. It's the same technique the sidebar's scroll region already used elsewhere in the codebase; I just hadn't reached for it consistently.

### Tables: pinned to TanStack Table v8, not the v9 that `npm install` gave me

Installing `@tanstack/react-table` with no version pin resolved to v9 — which turned out to be a from-scratch API rewrite (`useReactTable` and `getCoreRowModel` don't exist in it; the surface is a completely different `createTableHook`/feature-registration model) with no stable documentation yet. Rather than build the History and Favorites tables against an unstable, undocumented major version, I pinned to `8.21.3`, the version with a known-good, widely-used API. A small thing, but "don't build production UI against a library version you can't find documentation for" is exactly the kind of judgment call a dependency-pinning habit is supposed to catch.

### Accessibility: designed in, not retrofitted

- **The streaming output is a single `aria-live="polite"` region**, not per-chunk announcements — a screen reader user hears the result once it settles, not a word fired every ~20ms as the mock provider "types."
- **Every icon-only control has an `aria-label`**, form errors surface via `role="alert"` tied to the field with `aria-describedby`, and there's a skip-to-content link on every page.
- **The template gallery is a real `radiogroup`** (`role="radio"` cards with `aria-checked`), fully operable by keyboard, not a grid of divs with an onClick handler.
- **Charts carry a visually-hidden `<figcaption>`** stating the same data as a sentence, since a screen reader has nothing useful to say about an SVG bar chart on its own.

### What's deliberately out of scope

- **Multi-tenancy / teams.** Every account is its own workspace; there's no organization boundary or shared projects across users.
- **Billing.** No Stripe, no plan gating, no generation quota beyond the flat rate limiter.
- **Abuse protection beyond rate limiting.** No CAPTCHA on signup, no email verification — acceptable for a demo, not for a real public signup flow with a real AI bill behind it.
- **Real-time collaboration.** Two people in the same project don't see each other's generations appear live; a refetch shows the latest state, but there's no WebSocket/SSE layer for that.

## What I'd do differently with more time

1. **Postgres by default, not SQLite** — the live demo's per-cold-start data reset is a fine tradeoff for a portfolio piece, not one I'd accept for a real product.
2. **A real (rate-limited, cached) title call to the active model** when a real provider is configured, instead of always using the local heuristic — worth the extra latency once cost isn't the binding constraint.
3. **Rate limiting on `/api/auth/register` itself** — generation is now protected by a real distributed limiter, but signup has none, no email verification, and no CAPTCHA. Combined with a self-service signup flow, that's an open door for scripted account creation that the generation-side fix doesn't address.
4. **Prompt templates per content type**, editable by the user, instead of the fixed system prompt in `src/lib/ai/prompt.ts` — real products let you tune the house style.
5. **Export** (Markdown/plain text download, copy-as-HTML) — copy-to-clipboard exists today; a real content tool needs more ways to get work out of it.
