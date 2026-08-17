import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { ContentItemWithProject, PaginatedContentResponse } from "@/types";
import type { ContentUpdateInput } from "@/lib/validations/content";

export interface ContentQueryParams {
  page: number;
  pageSize: number;
  q?: string;
  type?: string;
  projectId?: string;
  favorite?: boolean;
  from?: string;
}

function buildQuery(params: ContentQueryParams) {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("pageSize", String(params.pageSize));
  if (params.q) search.set("q", params.q);
  if (params.type) search.set("type", params.type);
  if (params.projectId) search.set("projectId", params.projectId);
  if (params.favorite) search.set("favorite", "true");
  if (params.from) search.set("from", params.from);
  return search.toString();
}

export function useContentItems(params: ContentQueryParams) {
  return useQuery({
    queryKey: ["content", params],
    queryFn: () => apiFetch<PaginatedContentResponse>(`/api/content?${buildQuery(params)}`),
    placeholderData: (previousData) => previousData,
  });
}

export function useContentItem(id: string | undefined) {
  return useQuery({
    queryKey: ["content", id],
    queryFn: () => apiFetch<{ item: ContentItemWithProject }>(`/api/content/${id}`),
    enabled: !!id,
  });
}

export function useUpdateContentItem(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ContentUpdateInput) =>
      apiFetch<{ item: ContentItemWithProject }>(`/api/content/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}

export function useDeleteContentItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch(`/api/content/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}
