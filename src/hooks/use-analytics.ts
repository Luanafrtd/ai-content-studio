import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { AnalyticsResponse } from "@/types";

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: () => apiFetch<AnalyticsResponse>("/api/analytics"),
  });
}
