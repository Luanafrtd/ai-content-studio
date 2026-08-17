"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Sparkles, Star } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchInput } from "@/components/shared/search-input";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { getContentColumns } from "@/components/content/content-columns";
import { ContentDetailDialog } from "@/components/content/content-detail-dialog";
import { useContentItems, useDeleteContentItem, useContentItem } from "@/hooks/use-content";
import { useProjects } from "@/hooks/use-projects";
import { usePreferencesStore } from "@/store/preferences-store";
import { CONTENT_TYPES } from "@/lib/content-types";
import { ApiClientError } from "@/lib/api-client";
import type { ContentItemWithProject } from "@/types";

export function ContentTable({
  favoriteOnly = false,
  openId,
}: {
  favoriteOnly?: boolean;
  openId?: string;
}) {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [projectId, setProjectId] = useState("all");
  const [when, setWhen] = useState("all");
  const [selectedItem, setSelectedItem] = useState<ContentItemWithProject | null>(null);
  const [deletingItem, setDeletingItem] = useState<ContentItemWithProject | null>(null);

  const pageSize = usePreferencesStore((state) => state.tablePageSize);
  const setTablePageSize = usePreferencesStore((state) => state.setTablePageSize);

  const { data: projectsData } = useProjects();
  const from = useMemo(() => {
    if (when === "all") return undefined;
    const days = { "7d": 7, "30d": 30, "90d": 90 }[when] ?? 0;
    return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  }, [when]);
  const { data, isLoading, isPlaceholderData } = useContentItems({
    page,
    pageSize,
    q,
    type: type === "all" ? undefined : type,
    projectId: projectId === "all" ? undefined : projectId,
    favorite: favoriteOnly,
    from,
  });
  const { data: openItemData } = useContentItem(openId);
  const deleteItem = useDeleteContentItem();

  useEffect(() => {
    if (openItemData?.item) setSelectedItem(openItemData.item);
  }, [openItemData]);

  const columns = useMemo(
    () => getContentColumns({ onView: setSelectedItem, onDelete: setDeletingItem }),
    [],
  );

  const table = useReactTable({
    data: data?.items ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleDelete = async () => {
    if (!deletingItem) return;
    try {
      await deleteItem.mutateAsync(deletingItem.id);
      toast.success("Content deleted");
      setDeletingItem(null);
      setSelectedItem((prev) => (prev?.id === deletingItem.id ? null : prev));
    } catch (error) {
      const message = error instanceof ApiClientError ? error.message : "Something went wrong";
      toast.error(message);
    }
  };

  const hasFilters = q || type !== "all" || projectId !== "all" || when !== "all";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={q}
          onChange={(value) => {
            setQ(value);
            setPage(1);
          }}
          placeholder={favoriteOnly ? "Search favorites..." : "Search content..."}
          label={favoriteOnly ? "Search favorites" : "Search content"}
        />
        <Select
          value={type}
          onValueChange={(value) => {
            setType(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filter by type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {CONTENT_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={projectId}
          onValueChange={(value) => {
            setProjectId(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filter by project">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All projects</SelectItem>
            {projectsData?.projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={when}
          onValueChange={(value) => {
            setWhen(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-[160px]" aria-label="Filter by date">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All time</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {columns.map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-5 w-full max-w-32" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="p-0">
                    <EmptyState
                      icon={favoriteOnly ? Star : Sparkles}
                      title={favoriteOnly ? "No favorites yet" : "No content found"}
                      description={
                        hasFilters
                          ? "Try adjusting your search or filters."
                          : favoriteOnly
                            ? "Star a generation to save it here."
                            : "Generate your first piece of content to see it here."
                      }
                    />
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className={isPlaceholderData ? "opacity-60" : undefined}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <PaginationBar
        page={data?.pagination.page ?? 1}
        totalPages={data?.pagination.totalPages ?? 1}
        total={data?.pagination.total ?? 0}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setTablePageSize(size);
          setPage(1);
        }}
      />

      <ContentDetailDialog
        item={selectedItem}
        open={!!selectedItem}
        onOpenChange={(open) => !open && setSelectedItem(null)}
        onDelete={setDeletingItem}
      />

      <ConfirmDialog
        open={!!deletingItem}
        onOpenChange={(open) => !open && setDeletingItem(null)}
        title="Delete this content?"
        description="This will permanently delete this generated content. This can't be undone."
        confirmLabel="Delete"
        destructive
        isLoading={deleteItem.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
