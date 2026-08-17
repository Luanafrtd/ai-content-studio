"use client";

import { ContentTypeBadge } from "@/components/shared/content-type-badge";
import { FavoriteButton } from "@/components/shared/favorite-button";
import { formatRelativeTime } from "@/lib/format";
import type { ContentItemWithProject } from "@/types";

export function ContentItemRow({
  item,
  onSelect,
  showProject = false,
}: {
  item: ContentItemWithProject;
  onSelect: (item: ContentItemWithProject) => void;
  showProject?: boolean;
}) {
  return (
    <li className="flex items-center justify-between gap-3 py-3">
      <button
        type="button"
        onClick={() => onSelect(item)}
        className="min-w-0 flex-1 text-left focus-visible:outline-none"
      >
        <p className="truncate text-sm font-medium hover:underline">{item.title}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <ContentTypeBadge type={item.type} />
          {showProject ? (
            <span className="text-muted-foreground text-xs">{item.project.name}</span>
          ) : null}
          <span className="text-muted-foreground text-xs">
            {showProject ? "· " : ""}
            {formatRelativeTime(item.createdAt)}
          </span>
        </div>
      </button>
      <FavoriteButton id={item.id} isFavorite={item.isFavorite} />
    </li>
  );
}
