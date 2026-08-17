import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireSession, handleApiError, parsePagination } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  try {
    const session = await requireSession();
    const searchParams = request.nextUrl.searchParams;
    const { page, pageSize, skip, take } = parsePagination(searchParams);

    const q = searchParams.get("q")?.trim();
    const type = searchParams.get("type");
    const projectId = searchParams.get("projectId");
    const favorite = searchParams.get("favorite");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const where: Prisma.ContentItemWhereInput = {
      userId: session.user.id,
      ...(type ? { type: type as Prisma.ContentItemWhereInput["type"] } : {}),
      ...(projectId ? { projectId } : {}),
      ...(favorite === "true" ? { isFavorite: true } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q } },
              { content: { contains: q } },
              { prompt: { contains: q } },
            ],
          }
        : {}),
      ...(from || to
        ? {
            createdAt: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
            },
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.contentItem.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
        include: { project: { select: { id: true, name: true, color: true } } },
      }),
      prisma.contentItem.count({ where }),
    ]);

    return NextResponse.json({
      items,
      pagination: { page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
