import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, FolderKanban, Sparkles, History, Star, BarChart3 } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { title: "Generate", href: "/dashboard/generate", icon: Sparkles },
  { title: "History", href: "/dashboard/history", icon: History },
  { title: "Favorites", href: "/dashboard/favorites", icon: Star },
  { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
];
