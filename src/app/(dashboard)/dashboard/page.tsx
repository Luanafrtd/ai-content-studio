import type { Metadata } from "next";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Overview</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Your content studio at a glance: volume, favorites, and what&apos;s fresh.
        </p>
      </div>
      <DashboardOverview />
    </div>
  );
}
