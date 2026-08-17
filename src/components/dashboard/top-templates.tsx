"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getContentTypeMeta } from "@/lib/content-types";
import { EmptyState } from "@/components/shared/empty-state";
import { BarChart3 } from "lucide-react";
import type { AnalyticsResponse } from "@/types";

export function TopTemplates({ data }: { data: AnalyticsResponse["byType"] }) {
  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Top templates</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <EmptyState
            icon={BarChart3}
            title="No data yet"
            description="Generate some content to see rankings."
          />
        ) : (
          <ul className="space-y-4">
            {data.map((row) => {
              const meta = getContentTypeMeta(row.type);
              const Icon = meta.icon;
              return (
                <li key={row.type}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium">
                      <Icon className="text-muted-foreground size-4" aria-hidden="true" />
                      {meta.label}
                    </span>
                    <span className="text-muted-foreground tabular-nums">{row.count}</span>
                  </div>
                  <Progress value={(row.count / max) * 100} />
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
