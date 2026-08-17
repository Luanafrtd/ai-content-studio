import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession, handleApiError } from "@/lib/api-helpers";

const DAYS_BACK = 30;

export async function GET() {
  try {
    const session = await requireSession();
    const userId = session.user.id;

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const rangeStart = new Date(now.getTime() - DAYS_BACK * 24 * 60 * 60 * 1000);

    const [
      totalProjects,
      totalGenerations,
      totalFavorites,
      generationsThisWeek,
      byType,
      recentItems,
    ] = await Promise.all([
      prisma.project.count({ where: { userId } }),
      prisma.contentItem.count({ where: { userId } }),
      prisma.contentItem.count({ where: { userId, isFavorite: true } }),
      prisma.contentItem.count({ where: { userId, createdAt: { gte: weekAgo } } }),
      prisma.contentItem.groupBy({
        by: ["type"],
        where: { userId },
        _count: { _all: true },
      }),
      prisma.contentItem.findMany({
        where: { userId, createdAt: { gte: rangeStart } },
        select: { createdAt: true },
      }),
    ]);

    const byTypeCounts = byType
      .map((row) => ({ type: row.type, count: row._count._all }))
      .sort((a, b) => b.count - a.count);

    const dayBuckets = new Map<string, number>();
    for (let i = 0; i < DAYS_BACK; i++) {
      const date = new Date(rangeStart.getTime() + i * 24 * 60 * 60 * 1000);
      dayBuckets.set(date.toISOString().slice(0, 10), 0);
    }
    for (const item of recentItems) {
      const key = item.createdAt.toISOString().slice(0, 10);
      dayBuckets.set(key, (dayBuckets.get(key) ?? 0) + 1);
    }
    const generationsOverTime = Array.from(dayBuckets.entries()).map(([date, count]) => ({
      date,
      count,
    }));

    const favoriteRate =
      totalGenerations > 0 ? Math.round((totalFavorites / totalGenerations) * 100) : 0;

    return NextResponse.json({
      totalProjects,
      totalGenerations,
      totalFavorites,
      generationsThisWeek,
      favoriteRate,
      byType: byTypeCounts,
      generationsOverTime,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
