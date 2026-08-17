import { FileText, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

const templates = ["Blog Post", "Social Caption", "Email", "Ad Copy"];

export function HeroMockup() {
  return (
    <Card className="border-border/60 w-full max-w-md p-5 shadow-2xl">
      <div className="mb-4 flex items-center gap-2">
        <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
          <FileText className="size-4" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">Blog Post · Q3 Product Launch</p>
          <p className="text-muted-foreground text-xs">Generating…</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {templates.map((t, i) => (
          <span
            key={t}
            className={
              i === 0
                ? "bg-primary text-primary-foreground rounded-full px-2.5 py-1 text-xs font-medium"
                : "bg-muted text-muted-foreground rounded-full px-2.5 py-1 text-xs font-medium"
            }
          >
            {t}
          </span>
        ))}
      </div>

      <div className="border-border bg-muted/30 space-y-2 rounded-md border p-3">
        <div className="bg-foreground/15 h-2.5 w-[92%] rounded-full" />
        <div className="bg-foreground/15 h-2.5 w-full rounded-full" />
        <div className="bg-foreground/15 h-2.5 w-[85%] rounded-full" />
        <div className="bg-foreground/10 h-2.5 w-[60%] rounded-full" />
        <div className="pt-1" />
        <div className="bg-foreground/15 h-2.5 w-full rounded-full" />
        <div className="bg-foreground/15 h-2.5 w-[78%] rounded-full" />
        <div className="flex items-center gap-1.5 pt-1">
          <span className="bg-primary size-1.5 animate-pulse rounded-full" />
          <span className="text-muted-foreground text-xs">Streaming live…</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-muted-foreground text-xs">Mock AI · no API key required</span>
        <span className="text-primary flex items-center gap-1 text-xs font-medium">
          <Sparkles className="size-3.5" aria-hidden="true" />
          Quill
        </span>
      </div>
    </Card>
  );
}
