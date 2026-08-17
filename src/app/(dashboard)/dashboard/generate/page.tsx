import type { Metadata } from "next";
import { GenerateWorkspace } from "@/components/generate/generate-workspace";

export const metadata: Metadata = { title: "Generate" };

export default async function GeneratePage({
  searchParams,
}: {
  searchParams: Promise<{ projectId?: string }>;
}) {
  const { projectId } = await searchParams;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Generate</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Pick a template, describe what you need, and watch it write itself.
        </p>
      </div>
      <GenerateWorkspace defaultProjectId={projectId} />
    </div>
  );
}
