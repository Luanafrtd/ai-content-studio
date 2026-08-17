import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { NavLinks } from "@/components/layout/nav-links";
import { UserMenu } from "@/components/layout/user-menu";

export function AppSidebar({
  user,
}: {
  user: { name: string; email: string; image?: string | null };
}) {
  return (
    <aside className="bg-sidebar border-sidebar-border sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r lg:flex">
      <div className="border-sidebar-border flex h-16 items-center border-b px-4">
        <Link href="/dashboard" className="w-fit">
          <Logo />
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <NavLinks />
      </div>
      <div className="border-sidebar-border border-t p-2">
        <UserMenu {...user} />
      </div>
    </aside>
  );
}
