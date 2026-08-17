"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROJECT_COLORS, projectSchema, type ProjectInput } from "@/lib/validations/project";
import { useCreateProject, useUpdateProject } from "@/hooks/use-projects";
import { ApiClientError } from "@/lib/api-client";
import type { ProjectWithCount } from "@/types";

export function ProjectFormDialog({
  open,
  onOpenChange,
  project,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: ProjectWithCount | null;
}) {
  const isEditing = !!project;
  const createProject = useCreateProject();
  const updateProject = useUpdateProject(project?.id ?? "");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: { name: "", description: "", color: "teal" },
  });

  useEffect(() => {
    if (open) {
      reset(
        project
          ? {
              name: project.name,
              description: project.description ?? "",
              color: project.color as ProjectInput["color"],
            }
          : { name: "", description: "", color: "teal" },
      );
    }
  }, [open, project, reset]);

  const onSubmit = async (values: ProjectInput) => {
    try {
      if (isEditing) {
        await updateProject.mutateAsync(values);
        toast.success("Project updated");
      } else {
        await createProject.mutateAsync(values);
        toast.success("Project created");
      }
      onOpenChange(false);
    } catch (error) {
      const message = error instanceof ApiClientError ? error.message : "Something went wrong";
      toast.error(message);
    }
  };

  const color = watch("color");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit project" : "New project"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update this project's details."
              : "Projects keep your generations organized."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Q3 Product Launch"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name ? (
              <p role="alert" className="text-destructive text-xs">
                {errors.name.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What's this project for?"
              rows={3}
              {...register("description")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Select
              value={color}
              onValueChange={(v) => setValue("color", v as ProjectInput["color"])}
            >
              <SelectTrigger id="color" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_COLORS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c[0]!.toUpperCase() + c.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
              {isEditing ? "Save changes" : "Create project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
