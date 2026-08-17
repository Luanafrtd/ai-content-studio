import type { Metadata } from "next";
import { ContentTable } from "@/components/content/content-table";

export const metadata: Metadata = { title: "Favorites" };

export default function FavoritesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Favorites</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Content you&apos;ve starred for reuse or approval.
        </p>
      </div>
      <ContentTable favoriteOnly />
    </div>
  );
}
