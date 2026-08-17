import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession, handleApiError, ApiError } from "@/lib/api-helpers";
import { contentUpdateSchema } from "@/lib/validations/content";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const session = await requireSession();
    const { id } = await params;

    const item = await prisma.contentItem.findFirst({
      where: { id, userId: session.user.id },
      include: { project: { select: { id: true, name: true, color: true } } },
    });
    if (!item) throw new ApiError(404, "Content not found");

    return NextResponse.json({ item });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const session = await requireSession();
    const { id } = await params;
    const body = await request.json();
    const data = contentUpdateSchema.parse(body);

    const existing = await prisma.contentItem.findFirst({ where: { id, userId: session.user.id } });
    if (!existing) throw new ApiError(404, "Content not found");

    const item = await prisma.contentItem.update({ where: { id }, data });
    return NextResponse.json({ item });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const session = await requireSession();
    const { id } = await params;

    const existing = await prisma.contentItem.findFirst({ where: { id, userId: session.user.id } });
    if (!existing) throw new ApiError(404, "Content not found");

    await prisma.contentItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
