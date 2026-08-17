"use client";

import Link from "next/link";
import { FolderKanban, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { PROJECT_COLOR_CLASSES } from "@/lib/content-types";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ProjectWithCount } from "@/types";

export function ProjectCard({
  project,
  onEdit,
  onDelete,
}: {
  project: ProjectWithCount;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className="group relative">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-lg",
            PROJECT_COLOR_CLASSES[project.color] ?? PROJECT_COLOR_CLASSES.teal,
          )}
        >
          <FolderKanban className="size-5" aria-hidden="true" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label={`Actions for ${project.name}`}
            >
              <MoreVertical className="size-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={onEdit}>
              <Pencil className="size-4" aria-hidden="true" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onSelect={onDelete}>
              <Trash2 className="size-4" aria-hidden="true" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <Link href={`/dashboard/projects/${project.id}`} className="block">
          <h3 className="font-semibold tracking-tight hover:underline">{project.name}</h3>
        </Link>
        {project.description ? (
          <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{project.description}</p>
        ) : null}
        <div className="text-muted-foreground mt-4 flex items-center justify-between text-xs">
          <span>{project._count.contentItems} items</span>
          <span>Updated {formatRelativeTime(project.updatedAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
