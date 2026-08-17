import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  // Ensure the pre-seeded SQLite snapshot (copied to /tmp on cold start by
  // src/lib/prisma.ts) is bundled into the serverless function output — it's
  // only referenced via a dynamically-built path, so file tracing wouldn't
  // pick it up automatically.
  outputFileTracingIncludes: {
    "/**": ["./prisma/prod-seed.db"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
