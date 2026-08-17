import Link from "next/link";
import {
  Sparkles,
  FolderKanban,
  Search,
  Star,
  BarChart3,
  MoonStar,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/brand/logo";
import { PublicNav } from "@/components/marketing/public-nav";
import { HeroMockup } from "@/components/marketing/hero-mockup";
import { CONTENT_TYPES } from "@/lib/content-types";

const features = [
  {
    icon: Sparkles,
    title: "AI-powered generation",
    description:
      "Blog posts, captions, emails, and four more formats — streamed live from a single prompt.",
  },
  {
    icon: FolderKanban,
    title: "Organized by project",
    description: "Every generation lives inside a project, not scattered across a chat log.",
  },
  {
    icon: Search,
    title: "Search & filtering",
    description: "Find anything by keyword, content type, project, favorite status, or date.",
  },
  {
    icon: Star,
    title: "Favorites",
    description: "Star the pieces worth reusing and pull them up instantly.",
  },
  {
    icon: BarChart3,
    title: "Analytics built in",
    description: "See what you're producing and what you're actually keeping, at a glance.",
  },
  {
    icon: MoonStar,
    title: "Accessible by default",
    description: "WCAG AA, fully responsive, and equally polished in dark or light mode.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNav />

      <main id="main-content" className="flex-1">
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <div>
            <span className="bg-accent text-accent-foreground inline-flex items-center rounded-full px-3 py-1 text-xs font-medium">
              No API key required to try it
            </span>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              AI content, on brand, on demand.
            </h1>
            <p className="text-muted-foreground mt-4 max-w-lg text-lg text-pretty">
              Quill turns a prompt into on-brand marketing copy — blog posts, social captions,
              emails, ad copy, and more — organized by project, searchable, and measurable from day
              one.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="/register">
                  Start for free
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/login">Try the demo</Link>
              </Button>
            </div>
            <p className="text-muted-foreground mt-4 text-sm">
              Free to run — the live demo uses a built-in mock AI provider, no billing required.
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <HeroMockup />
          </div>
        </section>

        <section className="border-border/60 border-y">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight">
                Everything a content team actually needs
              </h2>
              <p className="text-muted-foreground mt-3">
                Not just a chat window — a studio built around organizing, reusing, and measuring
                what you generate.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon: Icon, title, description }) => (
                <Card key={title}>
                  <CardContent>
                    <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 font-semibold">{title}</h3>
                    <p className="text-muted-foreground mt-1.5 text-sm">{description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight">Seven templates, one voice</h2>
            <p className="text-muted-foreground mt-3">
              Pick a format, describe what you need, and watch it write itself.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CONTENT_TYPES.map((template) => {
              const Icon = template.icon;
              return (
                <div
                  key={template.value}
                  className="border-border flex items-start gap-3 rounded-lg border p-4"
                >
                  <div className="bg-muted text-muted-foreground flex size-9 items-center justify-center rounded-md">
                    <Icon className="size-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{template.label}</p>
                    <p className="text-muted-foreground mt-0.5 text-xs">{template.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="border-border/60 border-t">
          <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
            <h2 className="text-3xl font-semibold tracking-tight">
              Try it now — it&apos;s already loaded with sample content.
            </h2>
            <p className="text-muted-foreground mt-3">
              The one-click demo account comes preloaded with projects and generation history, so
              you can see the whole product in under a minute.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/login">
                  Try the demo
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/register">Create an account</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-border/60 border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <Logo className="text-sm" />
          <p className="text-muted-foreground text-center text-xs sm:text-right">
            © {new Date().getFullYear()} Quill. A portfolio project — not a real product.
          </p>
        </div>
      </footer>
    </div>
  );
}
