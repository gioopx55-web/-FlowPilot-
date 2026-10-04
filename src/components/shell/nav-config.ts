import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  FolderKanban,
  ListChecks,
  Users,
  UsersRound,
  BarChart3,
  Settings,
  MoreHorizontal,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

/** Desktop/tablet sidebar order — Phase 2 §11.2. */
export const sidebarNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Tasks", href: "/tasks", icon: ListChecks },
  { label: "Clients", href: "/clients", icon: Users },
  { label: "Team", href: "/team", icon: UsersRound },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
];

/** Mobile bottom tab bar — 5 items, D-013. "More" opens MoreSheet. */
export const mobileTabItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Tasks", href: "/tasks", icon: ListChecks },
  { label: "Clients", href: "/clients", icon: Users },
];

export const moreTabItem: NavItem = {
  label: "More",
  href: "#more",
  icon: MoreHorizontal,
};

/** Contents of the mobile "More" sheet — D-013. Flat list, no nesting. */
export const moreSheetItems: NavItem[] = [
  { label: "Team", href: "/team", icon: UsersRound },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

const allNavItems: NavItem[] = [...sidebarNavItems, ...moreSheetItems];

/** Derives the Topbar title from the current route — Phase 5 §11. */
export function getPageTitle(pathname: string): string {
  const match = allNavItems.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  return match?.label ?? "FlowPilot AI";
}
