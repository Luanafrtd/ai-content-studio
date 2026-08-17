"use client";

import { usePathname } from "next/navigation";
import { navItems } from "@/components/layout/nav-items";

export function PageTitle() {
  const pathname = usePathname();
  const active = [...navItems]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => pathname.startsWith(item.href));

  return <h1 className="text-base font-semibold">{active?.title ?? "Dashboard"}</h1>;
}
