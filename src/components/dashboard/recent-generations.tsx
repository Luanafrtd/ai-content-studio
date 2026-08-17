"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ContentTypeBadge } from "@/components/shared/content-type-badge";
import { FavoriteButton } from "@/components/shared/favorite-button";
import { useContentItems } from "@/hooks/use-content";
import { formatRelativeTime } from "@/lib/format";

export function RecentGenerations() {
  const { data, isLoading } = useContentItems({ page: 1, pageSize: 6 });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Recent generations</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : !data || data.items.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="No generations yet"
            description="Generate your first piece of content to see it here."
          />
        ) : (
          <ul className="divide-border -my-1 divide-y">
            {data.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/dashboard/history?open=${item.id}`}
                    className="block truncate text-sm font-medium hover:underline"
                  >
                    {item.title}
                  </Link>
                  <div className="mt-1 flex items-center gap-2">
                    <ContentTypeBadge type={item.type} />
                    <span className="text-muted-foreground text-xs">{item.project.name}</span>
                    <span className="text-muted-foreground text-xs">
                      · {formatRelativeTime(item.createdAt)}
                    </span>
                  </div>
                </div>
                <FavoriteButton id={item.id} isFavorite={item.isFavorite} />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
