"use client";

import { CONTENT_TYPES } from "@/lib/content-types";
import { cn } from "@/lib/utils";

export function TemplateGallery({
  value,
  onChange,
}: {
  value: string;
  onChange: (type: string) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Content type"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      {CONTENT_TYPES.map((template) => {
        const Icon = template.icon;
        const selected = value === template.value;
        return (
          <button
            key={template.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(template.value)}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-colors",
              "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
              selected
                ? "border-primary bg-primary/5 ring-primary ring-1"
                : "border-border hover:border-primary/40 hover:bg-accent/40",
            )}
          >
            <div
              className={cn(
                "flex size-9 items-center justify-center rounded-md",
                selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold">{template.label}</p>
              <p className="text-muted-foreground mt-0.5 text-xs">{template.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
