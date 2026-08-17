import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed px-6 py-24 text-center">
      <div className="bg-muted flex size-14 items-center justify-center rounded-full">
        <SearchX className="text-muted-foreground size-6" aria-hidden="true" />
      </div>
      <div className="space-y-2">
        <h1 className="text-lg font-semibold">Not found</h1>
        <p className="text-muted-foreground max-w-sm text-sm">
          This item doesn&apos;t exist or may have been deleted.
        </p>
      </div>
      <Button asChild variant="outline" size="sm">
        <Link href="/dashboard">Back to dashboard</Link>
      </Button>
    </div>
  );
}
