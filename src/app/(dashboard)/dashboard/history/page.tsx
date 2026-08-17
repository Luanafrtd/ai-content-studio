import type { Metadata } from "next";
import { ContentTable } from "@/components/content/content-table";

export const metadata: Metadata = { title: "History" };

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ open?: string }>;
}) {
  const { open } = await searchParams;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">History</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Every piece of content you&apos;ve generated, searchable and filterable.
        </p>
      </div>
      <ContentTable openId={open} />
    </div>
  );
}
