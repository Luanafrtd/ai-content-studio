"use client";

import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUpdateContentItem } from "@/hooks/use-content";
import { toast } from "sonner";

export function FavoriteButton({
  id,
  isFavorite,
  size = "icon",
}: {
  id: string;
  isFavorite: boolean;
  size?: "icon" | "sm";
}) {
  const updateItem = useUpdateContentItem(id);

  const toggle = () => {
    updateItem.mutate(
      { isFavorite: !isFavorite },
      {
        onError: () => toast.error("Couldn't update favorite. Please try again."),
      },
    );
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size={size === "icon" ? "icon" : "sm"}
      onClick={toggle}
      disabled={updateItem.isPending}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Star
        className={cn("size-4", isFavorite && "fill-chart-2 text-chart-2")}
        aria-hidden="true"
      />
      {size === "sm" ? (isFavorite ? "Favorited" : "Favorite") : null}
    </Button>
  );
}
