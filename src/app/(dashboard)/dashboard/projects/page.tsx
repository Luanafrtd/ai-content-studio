"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FolderKanban, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectFormDialog } from "@/components/projects/project-form-dialog";
import { useProjects, useDeleteProject } from "@/hooks/use-projects";
import { ApiClientError } from "@/lib/api-client";
import type { ProjectWithCount } from "@/types";

export default function ProjectsPage() {
  const { data, isLoading } = useProjects();
  const deleteProject = useDeleteProject();

  const [formOpen, setFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectWithCount | null>(null);
  const [deletingProject, setDeletingProject] = useState<ProjectWithCount | null>(null);

  const openCreate = () => {
    setEditingProject(null);
    setFormOpen(true);
  };

  const openEdit = (project: ProjectWithCount) => {
    setEditingProject(project);
    setFormOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingProject) return;
    try {
      await deleteProject.mutateAsync(deletingProject.id);
      toast.success("Project deleted");
      setDeletingProject(null);
    } catch (error) {
      const message = error instanceof ApiClientError ? error.message : "Something went wrong";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Projects</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Organize your generations by campaign, client, or channel.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" aria-hidden="true" />
          New project
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      ) : !data || data.projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create a project to start organizing your AI-generated content."
          action={
            <Button onClick={openCreate} variant="outline" size="sm">
              <Plus className="size-4" aria-hidden="true" />
              New project
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={() => openEdit(project)}
              onDelete={() => setDeletingProject(project)}
            />
          ))}
        </div>
      )}

      <ProjectFormDialog open={formOpen} onOpenChange={setFormOpen} project={editingProject} />

      <ConfirmDialog
        open={!!deletingProject}
        onOpenChange={(open) => !open && setDeletingProject(null)}
        title="Delete project?"
        description={`This will permanently delete "${deletingProject?.name}" and all ${deletingProject?._count.contentItems ?? 0} content items inside it. This can't be undone.`}
        confirmLabel="Delete project"
        destructive
        isLoading={deleteProject.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
