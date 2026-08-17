import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession, handleApiError, ApiError } from "@/lib/api-helpers";
import { projectSchema } from "@/lib/validations/project";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const session = await requireSession();
    const { id } = await params;

    const project = await prisma.project.findFirst({
      where: { id, userId: session.user.id },
      include: {
        contentItems: { orderBy: { createdAt: "desc" } },
        _count: { select: { contentItems: true } },
      },
    });

    if (!project) throw new ApiError(404, "Project not found");

    return NextResponse.json({ project });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const session = await requireSession();
    const { id } = await params;
    const body = await request.json();
    const data = projectSchema.partial().parse(body);

    const existing = await prisma.project.findFirst({ where: { id, userId: session.user.id } });
    if (!existing) throw new ApiError(404, "Project not found");

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...data,
        description: data.description === "" ? null : data.description,
      },
    });

    return NextResponse.json({ project });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const session = await requireSession();
    const { id } = await params;

    const existing = await prisma.project.findFirst({ where: { id, userId: session.user.id } });
    if (!existing) throw new ApiError(404, "Project not found");

    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
