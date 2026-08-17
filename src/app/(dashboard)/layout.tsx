import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const user = {
    name: session.user.name ?? "User",
    email: session.user.email ?? "",
    image: session.user.image,
  };

  return (
    <div className="flex min-h-screen">
      <AppSidebar user={user} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar user={user} />
        <main id="main-content" className="flex-1 px-4 py-6 sm:px-6 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
