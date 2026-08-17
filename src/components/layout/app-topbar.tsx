import { MobileNav } from "@/components/layout/mobile-nav";
import { PageTitle } from "@/components/layout/page-title";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function AppTopbar({
  user,
}: {
  user: { name: string; email: string; image?: string | null };
}) {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 flex h-16 items-center gap-3 border-b px-4 backdrop-blur sm:px-6">
      <MobileNav user={user} />
      <PageTitle />
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
