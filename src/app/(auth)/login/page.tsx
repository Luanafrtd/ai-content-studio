import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { BarChart3, Sparkles, FolderKanban } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in",
};

const highlights = [
  {
    icon: Sparkles,
    title: "AI-powered generation",
    description: "Blog posts, captions, emails, and more — streamed live from a prompt.",
  },
  {
    icon: FolderKanban,
    title: "Organized by project",
    description: "Every piece of content lives somewhere searchable, not lost in a chat log.",
  },
  {
    icon: BarChart3,
    title: "Analytics built in",
    description: "See what you're producing and what you're actually keeping.",
  },
];

export default function LoginPage() {
  return (
    <main id="main-content" className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-between p-8 sm:p-12">
        <Link href="/" className="w-fit">
          <Logo />
        </Link>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <div className="mb-8 space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground text-sm">Sign in to your workspace to continue.</p>
          </div>
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>

        <p className="text-muted-foreground text-xs">
          © {new Date().getFullYear()} Quill. A portfolio project — not a real product.
        </p>
      </div>

      <div className="from-primary relative hidden overflow-hidden bg-gradient-to-br to-teal-900 p-12 lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 60% 70%, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="text-primary-foreground relative z-10">
          <h2 className="max-w-md text-3xl font-semibold text-balance">
            Turn a prompt into on-brand content in seconds.
          </h2>
          <p className="mt-3 max-w-sm text-sm text-white/80">
            One studio for every piece of marketing copy your team writes — organized, searchable,
            and reusable.
          </p>
        </div>

        <ul className="relative z-10 space-y-4">
          {highlights.map(({ icon: Icon, title, description }) => (
            <li key={title} className="text-primary-foreground flex items-start gap-3">
              <span className="mt-0.5 rounded-lg bg-white/10 p-2">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-sm text-white/70">{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
