"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";

export default function GlobalError({
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
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <Logo />
      <div className="bg-destructive/10 flex size-14 items-center justify-center rounded-full">
        <AlertTriangle className="text-destructive size-6" aria-hidden="true" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="text-muted-foreground max-w-sm text-sm">
          An unexpected error occurred. You can try again, or head back to the dashboard.
        </p>
      </div>
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
