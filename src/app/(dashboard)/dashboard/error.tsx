"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed px-6 py-24 text-center">
      <div className="bg-destructive/10 flex size-14 items-center justify-center rounded-full">
        <AlertTriangle className="text-destructive size-6" aria-hidden="true" />
      </div>
      <div className="space-y-2">
        <h1 className="text-lg font-semibold">Something went wrong</h1>
        <p className="text-muted-foreground max-w-sm text-sm">
          We couldn&apos;t load this page. Please try again.
        </p>
      </div>
      <Button size="sm" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
