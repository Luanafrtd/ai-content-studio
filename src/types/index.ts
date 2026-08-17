import type { ContentItem, Project } from "@prisma/client";

export type ProjectSummary = Pick<Project, "id" | "name" | "color">;

export type ProjectWithCount = Project & { _count: { contentItems: number } };

export type ProjectDetail = ProjectWithCount & { contentItems: ContentItem[] };

export type ContentItemWithProject = ContentItem & { project: ProjectSummary };

export interface PaginatedContentResponse {
  items: ContentItemWithProject[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

export interface AnalyticsResponse {
  totalProjects: number;
  totalGenerations: number;
  totalFavorites: number;
  generationsThisWeek: number;
  favoriteRate: number;
  byType: { type: string; count: number }[];
  generationsOverTime: { date: string; count: number }[];
}
