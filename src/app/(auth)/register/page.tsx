import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Mail, Megaphone } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create your account",
};

const templates = [
  { icon: FileText, label: "Blog posts" },
  { icon: Mail, label: "Emails" },
  { icon: Megaphone, label: "Ad copy" },
];

export default function RegisterPage() {
  return (
    <main id="main-content" className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-between p-8 sm:p-12">
        <Link href="/" className="w-fit">
          <Logo />
        </Link>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <div className="mb-8 space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
            <p className="text-muted-foreground text-sm">
              Start generating on-brand content in minutes. No credit card required.
            </p>
          </div>
          <RegisterForm />
        </div>

        <p className="text-muted-foreground text-xs">
          © {new Date().getFullYear()} Quill. A portfolio project, not a real product.
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
            Seven content types. One consistent voice.
          </h2>
          <p className="mt-3 max-w-sm text-sm text-white/80">
            Pick a template, describe what you need, and watch it write itself, organized by
            project from day one.
          </p>
        </div>

        <ul className="relative z-10 flex gap-6">
          {templates.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="text-primary-foreground flex flex-col items-center gap-2 text-center"
            >
              <span className="rounded-lg bg-white/10 p-3">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <p className="text-xs font-medium text-white/80">{label}</p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
