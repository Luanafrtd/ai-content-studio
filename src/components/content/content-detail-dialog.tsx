"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, Check, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ContentTypeBadge } from "@/components/shared/content-type-badge";
import { FavoriteButton } from "@/components/shared/favorite-button";
import { formatDateTime } from "@/lib/format";
import { CONTENT_TONES, CONTENT_LENGTHS } from "@/lib/content-types";
import type { ContentItemWithProject } from "@/types";

export function ContentDetailDialog({
  item,
  open,
  onOpenChange,
  onDelete,
}: {
  item: ContentItemWithProject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete?: (item: ContentItemWithProject) => void;
}) {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const tone = CONTENT_TONES.find((t) => t.value === item.tone)?.label ?? item.tone;
  const length = CONTENT_LENGTHS.find((l) => l.value === item.length)?.label ?? item.length;

  const copyContent = async () => {
    try {
      await navigator.clipboard.writeText(item.content);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy to clipboard");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col sm:max-w-2xl">
        <DialogHeader className="shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <DialogTitle className="pr-6">{item.title}</DialogTitle>
              <DialogDescription className="mt-1">
                {item.project.name} · Generated {formatDateTime(item.createdAt)}
              </DialogDescription>
            </div>
            <FavoriteButton id={item.id} isFavorite={item.isFavorite} />
          </div>
        </DialogHeader>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <ContentTypeBadge type={item.type} />
          <span className="text-muted-foreground text-xs">{tone}</span>
          <span className="text-muted-foreground text-xs">· {length}</span>
          <span className="text-muted-foreground text-xs">
            · {item.provider === "mock" ? "Mock AI" : item.model}
          </span>
        </div>

        <div className="border-border bg-muted/40 shrink-0 rounded-md border p-3">
          <p className="text-muted-foreground text-xs font-medium">Prompt</p>
          <p className="mt-1 text-sm">{item.prompt}</p>
        </div>

        <div className="border-border min-h-0 flex-1 overflow-y-auto rounded-md border p-4">
          <div className="text-sm whitespace-pre-wrap">{item.content}</div>
        </div>

        <DialogFooter className="shrink-0 flex-row justify-between sm:justify-between">
          {onDelete ? (
            <Button
              type="button"
              variant="ghost"
              className="text-destructive"
              onClick={() => onDelete(item)}
            >
              <Trash2 className="size-4" aria-hidden="true" />
              Delete
            </Button>
          ) : (
            <span />
          )}
          <Button type="button" variant="outline" onClick={copyContent}>
            {copied ? (
              <Check className="size-4" aria-hidden="true" />
            ) : (
              <Copy className="size-4" aria-hidden="true" />
            )}
            {copied ? "Copied" : "Copy content"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
