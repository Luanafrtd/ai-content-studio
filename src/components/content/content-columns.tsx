"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ContentTypeBadge } from "@/components/shared/content-type-badge";
import { FavoriteButton } from "@/components/shared/favorite-button";
import { formatRelativeTime } from "@/lib/format";
import type { ContentItemWithProject } from "@/types";

export function getContentColumns({
  onView,
  onDelete,
}: {
  onView: (item: ContentItemWithProject) => void;
  onDelete: (item: ContentItemWithProject) => void;
}): ColumnDef<ContentItemWithProject>[] {
  return [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <button
            type="button"
            onClick={() => onView(item)}
            className="max-w-72 text-left text-sm font-medium hover:underline focus-visible:outline-none"
          >
            <span className="block truncate">{item.title}</span>
          </button>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => <ContentTypeBadge type={row.original.type} />,
    },
    {
      accessorKey: "project",
      header: "Project",
      cell: ({ row }) => <span className="text-sm">{row.original.project.name}</span>,
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {formatRelativeTime(row.original.createdAt)}
        </span>
      ),
    },
    {
      id: "favorite",
      header: () => <span className="sr-only">Favorite</span>,
      cell: ({ row }) => (
        <FavoriteButton id={row.original.id} isFavorite={row.original.isFavorite} />
      ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={`Actions for ${item.title}`}>
                <MoreHorizontal className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => onView(item)}>
                <Eye className="size-4" aria-hidden="true" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onSelect={() => onDelete(item)}>
                <Trash2 className="size-4" aria-hidden="true" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
