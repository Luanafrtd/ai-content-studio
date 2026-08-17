import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe auth config (no Prisma/bcrypt) shared between the full
 * Auth.js instance (src/auth.ts) and the Edge middleware (src/middleware.ts).
 */
export const authConfig = {
  // Vercel terminates TLS and proxies requests, so the Host header is
  // already trustworthy; this also allows `next start` to run locally
  // without Auth.js rejecting the request as an untrusted host.
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtectedRoute = nextUrl.pathname.startsWith("/dashboard");
      const isAuthPage = nextUrl.pathname === "/login" || nextUrl.pathname === "/register";

      if (isProtectedRoute) {
        return isLoggedIn;
      }

      if (isAuthPage && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
