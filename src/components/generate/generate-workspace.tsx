"use client";

import Link from "next/link";
import { toast } from "sonner";
import { FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { GenerateForm } from "@/components/generate/generate-form";
import { StreamingOutput } from "@/components/generate/streaming-output";
import { useGenerate } from "@/hooks/use-generate";
import { useProjects } from "@/hooks/use-projects";
import { useQueryClient } from "@tanstack/react-query";
import type { GenerateFormInput } from "@/lib/validations/generate";

export function GenerateWorkspace({ defaultProjectId }: { defaultProjectId?: string }) {
  const { data: projectsData, isLoading: projectsLoading } = useProjects();
  const { status, title, content, error, itemId, generate, reset } = useGenerate();
  const queryClient = useQueryClient();

  const handleSubmit = (values: GenerateFormInput) => {
    generate(values);
  };

  const handleDiscard = () => {
    reset();
    queryClient.invalidateQueries({ queryKey: ["content"] });
    queryClient.invalidateQueries({ queryKey: ["projects"] });
    queryClient.invalidateQueries({ queryKey: ["analytics"] });
  };

  const handleReset = () => {
    reset();
    queryClient.invalidateQueries({ queryKey: ["content"] });
    queryClient.invalidateQueries({ queryKey: ["projects"] });
    queryClient.invalidateQueries({ queryKey: ["analytics"] });
  };

  if (!projectsLoading && (projectsData?.projects.length ?? 0) === 0) {
    return (
      <EmptyState
        icon={FolderPlus}
        title="Create a project first"
        description="Projects keep your generations organized. Create one to start generating content."
        action={
          <Button asChild size="sm">
            <Link href="/dashboard/projects">
              <FolderPlus className="size-4" aria-hidden="true" />
              New project
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
      <GenerateForm
        defaultProjectId={defaultProjectId}
        isStreaming={status === "streaming"}
        onSubmit={(values) => {
          if (status === "streaming") {
            toast.info("A generation is already in progress.");
            return;
          }
          handleSubmit(values);
        }}
      />
      <div className="lg:sticky lg:top-20">
        <StreamingOutput
          status={status}
          title={title}
          content={content}
          error={error}
          itemId={itemId}
          onDiscard={handleDiscard}
          onReset={handleReset}
        />
      </div>
    </div>
  );
}
