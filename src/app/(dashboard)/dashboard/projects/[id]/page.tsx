"use client";

import { use, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, FolderKanban, Pencil, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { PROJECT_COLOR_CLASSES } from "@/lib/content-types";
import { cn } from "@/lib/utils";
import { useProject } from "@/hooks/use-projects";
import { useDeleteContentItem } from "@/hooks/use-content";
import { ProjectFormDialog } from "@/components/projects/project-form-dialog";
import { ContentItemRow } from "@/components/content/content-item-row";
import { ContentDetailDialog } from "@/components/content/content-detail-dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ApiClientError } from "@/lib/api-client";
import type { ContentItemWithProject, ProjectWithCount } from "@/types";

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading } = useProject(id);
  const deleteItem = useDeleteContentItem();

  const [editOpen, setEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ContentItemWithProject | null>(null);
  const [deletingItem, setDeletingItem] = useState<ContentItemWithProject | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!data?.project) return null;

  const project = data.project;
  const items = project.contentItems.map((item) => ({
    ...item,
    project: { id: project.id, name: project.name, color: project.color },
  }));

  const confirmDelete = async () => {
    if (!deletingItem) return;
    try {
      await deleteItem.mutateAsync(deletingItem.id);
      toast.success("Content deleted");
      setDeletingItem(null);
      setSelectedItem(null);
    } catch (error) {
      const message = error instanceof ApiClientError ? error.message : "Something went wrong";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
        <Link href="/dashboard/projects">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Projects
        </Link>
      </Button>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex size-12 items-center justify-center rounded-lg",
              PROJECT_COLOR_CLASSES[project.color] ?? PROJECT_COLOR_CLASSES.teal,
            )}
          >
            <FolderKanban className="size-6" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">{project.name}</h2>
            {project.description ? (
              <p className="text-muted-foreground mt-1 max-w-xl text-sm">{project.description}</p>
            ) : null}
            <p className="text-muted-foreground mt-1 text-xs">
              {project._count.contentItems} content items
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" onClick={() => setEditOpen(true)}>
            <Pencil className="size-4" aria-hidden="true" />
            Edit
          </Button>
          <Button asChild>
            <Link href={`/dashboard/generate?projectId=${project.id}`}>
              <Plus className="size-4" aria-hidden="true" />
              Generate
            </Link>
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="Nothing generated yet"
          description="Generate your first piece of content for this project."
          action={
            <Button asChild variant="outline" size="sm">
              <Link href={`/dashboard/generate?projectId=${project.id}`}>
                <Sparkles className="size-4" aria-hidden="true" />
                Generate content
              </Link>
            </Button>
          }
        />
      ) : (
        <ul className="divide-border divide-y rounded-lg border px-4">
          {items.map((item) => (
            <ContentItemRow key={item.id} item={item} onSelect={setSelectedItem} />
          ))}
        </ul>
      )}

      <ProjectFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        project={project as ProjectWithCount}
      />

      <ContentDetailDialog
        item={selectedItem}
        open={!!selectedItem}
        onOpenChange={(open) => !open && setSelectedItem(null)}
        onDelete={setDeletingItem}
      />

      <ConfirmDialog
        open={!!deletingItem}
        onOpenChange={(open) => !open && setDeletingItem(null)}
        title="Delete this content?"
        description="This will permanently delete this generated content. This can't be undone."
        confirmLabel="Delete"
        destructive
        isLoading={deleteItem.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
