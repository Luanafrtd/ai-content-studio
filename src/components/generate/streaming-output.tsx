"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { Copy, Check, Trash2, RotateCcw, Sparkles, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDeleteContentItem } from "@/hooks/use-content";
import { ApiClientError } from "@/lib/api-client";

interface StreamingOutputProps {
  status: "idle" | "streaming" | "done" | "error";
  title: string;
  content: string;
  error: string | null;
  itemId: string | null;
  onDiscard: () => void;
  onReset: () => void;
}

export function StreamingOutput({
  status,
  title,
  content,
  error,
  itemId,
  onDiscard,
  onReset,
}: StreamingOutputProps) {
  const [copied, setCopied] = useState(false);
  const deleteItem = useDeleteContentItem();

  if (status === "idle") {
    return (
      <Card className="flex h-full min-h-[24rem] items-center justify-center border-dashed">
        <CardContent className="flex flex-col items-center gap-3 text-center">
          <div className="bg-muted flex size-12 items-center justify-center rounded-full">
            <Sparkles className="text-muted-foreground size-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium">Your generation will appear here</p>
            <p className="text-muted-foreground mt-1 max-w-xs text-sm">
              Pick a template, describe what you need, and hit generate.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === "error") {
    return (
      <Card className="border-destructive/30 flex h-full min-h-[24rem] items-center justify-center">
        <CardContent className="flex flex-col items-center gap-3 text-center">
          <div className="bg-destructive/10 flex size-12 items-center justify-center rounded-full">
            <AlertCircle className="text-destructive size-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium">Generation failed</p>
            <p className="text-muted-foreground mt-1 max-w-xs text-sm">{error}</p>
          </div>
          <Button size="sm" variant="outline" onClick={onReset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Try again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const copyContent = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy to clipboard");
    }
  };

  const discard = async () => {
    if (!itemId) {
      onDiscard();
      return;
    }
    try {
      await deleteItem.mutateAsync(itemId);
      toast.success("Discarded");
      onDiscard();
    } catch (err) {
      const message =
        err instanceof ApiClientError ? err.message : "Couldn't discard. Please try again.";
      toast.error(message);
    }
  };

  return (
    <Card className="flex h-full min-h-[24rem] flex-col">
      <CardContent className="flex min-h-0 flex-1 flex-col gap-4">
        <div className="shrink-0">
          <p className="text-muted-foreground text-xs font-medium">
            {status === "streaming" ? "Generating…" : "Generated"}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-balance">
            {title || <span className="text-muted-foreground">Untitled</span>}
          </h3>
        </div>

        <div className="border-border min-h-0 flex-1 overflow-y-auto rounded-md border p-4">
          <div aria-live="polite" className="text-sm whitespace-pre-wrap">
            {content}
            {status === "streaming" ? (
              <span className="bg-foreground ml-0.5 inline-block h-4 w-1.5 animate-pulse align-middle" />
            ) : null}
          </div>
        </div>

        {status === "done" ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" onClick={copyContent}>
              {copied ? (
                <Check className="size-4" aria-hidden="true" />
              ) : (
                <Copy className="size-4" aria-hidden="true" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button size="sm" variant="outline" onClick={discard} disabled={deleteItem.isPending}>
              <Trash2 className="size-4" aria-hidden="true" />
              Discard
            </Button>
            <Button size="sm" variant="outline" onClick={onReset}>
              <RotateCcw className="size-4" aria-hidden="true" />
              Generate another
            </Button>
            <Button size="sm" variant="ghost" asChild className="ml-auto">
              <Link href={`/dashboard/history?open=${itemId}`}>View in history</Link>
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
