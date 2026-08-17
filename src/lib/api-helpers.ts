import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { auth } from "@/auth";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function jsonError(status: number, message: string) {
  return NextResponse.json({ error: message }, { status });
}

export async function requireSession() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new ApiError(401, "Unauthorized");
  }
  return session;
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return jsonError(error.status, error.message);
  }
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: "Validation failed", issues: error.flatten().fieldErrors },
      { status: 422 },
    );
  }
  console.error(error);
  return jsonError(500, "Something went wrong");
}

export function parsePagination(searchParams: URLSearchParams) {
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const pageSizeRaw = Number(searchParams.get("pageSize") ?? "20") || 20;
  const pageSize = Math.min(100, Math.max(1, pageSizeRaw));
  return { page, pageSize, skip: (page - 1) * pageSize, take: pageSize };
}
