"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * Route-backed project detail tabs (Phase 2 §11.7, Phase 8 §4) — real
 * navigation links, not a client-state panel switcher, so each tab is
 * its own deep-linkable route. Active state via `usePathname`, same
 * pattern as Sidebar.tsx. No second sub-sidebar: this is a single
 * horizontal tab row under the shared header.
 */
export function ProjectTabs({ projectId }: { projectId: string }) {
  const pathname = usePathname();

  const tabs = [
    { key: "overview", label: "Overview", href: `/projects/${projectId}` },
    { key: "tasks", label: "Tasks", href: `/projects/${projectId}/tasks` },
    { key: "team", label: "Team", href: `/projects/${projectId}/team` },
    { key: "activity", label: "Activity", href: `/projects/${projectId}/activity` },
  ];

  return (
    <nav
      role="tablist"
      aria-label="Project sections"
      className="flex gap-1 border-b border-border px-4 sm:px-6 lg:px-8"
    >
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.key}
            href={tab.href}
            role="tab"
            aria-selected={active}
            className={cn(
              "relative flex h-11 items-center px-3 text-sm font-medium outline-none transition-colors",
              "focus-visible:ring-2 focus-visible:ring-ring/70",
              active ? "text-[var(--fp-accent)]" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-[var(--fp-accent)]",
                active ? "opacity-100" : "opacity-0",
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
}
