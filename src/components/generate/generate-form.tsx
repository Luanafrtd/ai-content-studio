"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TemplateGallery } from "@/components/generate/template-gallery";
import { generateSchema, type GenerateFormInput } from "@/lib/validations/generate";
import { CONTENT_TONES, CONTENT_LENGTHS } from "@/lib/content-types";
import { useProjects } from "@/hooks/use-projects";

export function GenerateForm({
  defaultProjectId,
  isStreaming,
  onSubmit,
}: {
  defaultProjectId?: string;
  isStreaming: boolean;
  onSubmit: (values: GenerateFormInput) => void;
}) {
  const { data: projectsData, isLoading: projectsLoading } = useProjects();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GenerateFormInput>({
    resolver: zodResolver(generateSchema),
    defaultValues: {
      projectId: defaultProjectId ?? "",
      type: "BLOG_POST",
      prompt: "",
      tone: "PROFESSIONAL",
      length: "MEDIUM",
    },
  });

  const type = watch("type");
  const projectId = watch("projectId");
  const tone = watch("tone");
  const length = watch("length");
  const prompt = watch("prompt");

  const projects = projectsData?.projects ?? [];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-6"
      aria-describedby={errors.prompt ? "prompt-error" : undefined}
    >
      <div className="space-y-2">
        <Label>Content type</Label>
        <TemplateGallery
          value={type}
          onChange={(v) => setValue("type", v as GenerateFormInput["type"])}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="projectId">Project</Label>
          <Select
            value={projectId}
            onValueChange={(v) => setValue("projectId", v, { shouldValidate: true })}
            disabled={projectsLoading}
          >
            <SelectTrigger id="projectId" className="w-full">
              <SelectValue placeholder={projectsLoading ? "Loading…" : "Choose a project"} />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.projectId ? (
            <p role="alert" className="text-destructive text-xs">
              {errors.projectId.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tone">Tone</Label>
          <Select
            value={tone}
            onValueChange={(v) => setValue("tone", v as GenerateFormInput["tone"])}
          >
            <SelectTrigger id="tone" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CONTENT_TONES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="length">Length</Label>
          <Select
            value={length}
            onValueChange={(v) => setValue("length", v as GenerateFormInput["length"])}
          >
            <SelectTrigger id="length" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CONTENT_LENGTHS.map((l) => (
                <SelectItem key={l.value} value={l.value}>
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <Label htmlFor="prompt">What do you need?</Label>
          <span className="text-muted-foreground text-xs">{prompt?.length ?? 0} / 2000</span>
        </div>
        <Textarea
          id="prompt"
          rows={5}
          placeholder="Describe the product, audience, and any key points to include…"
          aria-invalid={!!errors.prompt}
          aria-describedby={errors.prompt ? "prompt-error" : undefined}
          {...register("prompt")}
        />
        {errors.prompt ? (
          <p id="prompt-error" role="alert" className="text-destructive text-xs">
            {errors.prompt.message}
          </p>
        ) : null}
      </div>

      <Button type="submit" disabled={isStreaming} className="w-full sm:w-auto">
        {isStreaming ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Sparkles className="size-4" aria-hidden="true" />
        )}
        {isStreaming ? "Generating…" : "Generate"}
      </Button>
    </form>
  );
}
