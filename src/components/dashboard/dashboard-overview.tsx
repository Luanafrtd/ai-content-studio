"use client";

import Link from "next/link";
import { FolderKanban, Sparkles, Star, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { GenerationsChart } from "@/components/dashboard/generations-chart";
import { ContentTypeChart } from "@/components/dashboard/content-type-chart";
import { RecentGenerations } from "@/components/dashboard/recent-generations";
import { useAnalytics } from "@/hooks/use-analytics";

export function DashboardOverview() {
  const { data, isLoading } = useAnalytics();

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Projects" value={String(data.totalProjects)} icon={FolderKanban} />
        <KpiCard
          label="Total generations"
          value={String(data.totalGenerations)}
          icon={Sparkles}
          hint={`${data.generationsThisWeek} this week`}
        />
        <KpiCard label="Favorites" value={String(data.totalFavorites)} icon={Star} />
        <KpiCard
          label="Favorite rate"
          value={`${data.favoriteRate}%`}
          icon={TrendingUp}
          hint="Of all generations"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <GenerationsChart data={data.generationsOverTime} />
        <ContentTypeChart data={data.byType} />
      </div>

      <RecentGenerations />

      <div className="flex justify-center">
        <Button asChild>
          <Link href="/dashboard/generate">
            <Sparkles className="size-4" aria-hidden="true" />
            New generation
          </Link>
        </Button>
      </div>
    </div>
  );
}
