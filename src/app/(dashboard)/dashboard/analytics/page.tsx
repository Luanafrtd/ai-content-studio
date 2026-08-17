import type { Metadata } from "next";
import { AnalyticsView } from "@/components/dashboard/analytics-view";

export const metadata: Metadata = { title: "Analytics" };

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          What you&apos;re producing, and what you&apos;re actually keeping.
        </p>
      </div>
      <AnalyticsView />
    </div>
  );
}
