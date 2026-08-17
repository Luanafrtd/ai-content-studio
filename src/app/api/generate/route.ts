import { prisma } from "@/lib/prisma";
import { requireSession, handleApiError, ApiError } from "@/lib/api-helpers";
import { generateSchema } from "@/lib/validations/generate";
import { getAIProvider } from "@/lib/ai";
import { checkRateLimit } from "@/lib/ai/rate-limiter";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await requireSession();
    const userId = session.user.id;

    const body = await request.json();
    const params = generateSchema.parse(body);

    const project = await prisma.project.findFirst({
      where: { id: params.projectId, userId },
      select: { id: true },
    });
    if (!project) throw new ApiError(404, "Project not found");

    const rateLimit = await checkRateLimit(userId);
    if (!rateLimit.allowed) {
      const minutes = Math.max(1, Math.ceil((rateLimit.retryAfterSeconds ?? 60) / 60));
      throw new ApiError(429, `Generation limit reached. Try again in ${minutes} minute(s).`);
    }

    const provider = getAIProvider();
    const title = await provider.generateTitle(params);

    const encoder = new TextEncoder();
    let fullContent = "";

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        function send(event: Record<string, unknown>) {
          controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
        }

        send({ type: "title", title });

        try {
          for await (const chunk of provider.generateStream(params)) {
            fullContent += chunk;
            send({ type: "chunk", text: chunk });
          }

          const item = await prisma.contentItem.create({
            data: {
              type: params.type,
              title,
              prompt: params.prompt,
              tone: params.tone,
              length: params.length,
              content: fullContent,
              status: "COMPLETE",
              provider: provider.name,
              model: provider.model,
              tokensUsed: Math.max(1, Math.round(fullContent.length / 4)),
              userId,
              projectId: params.projectId,
            },
          });

          send({ type: "done", id: item.id });
        } catch (error) {
          console.error(error);
          send({ type: "error", message: "Generation failed. Please try again." });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
