"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { sidebarNavItems } from "@/components/shell/nav-config";
import { createLocalStorageStore } from "@/lib/local-storage-store";

const STORAGE_KEY = "flowpilot-sidebar-collapsed";

const collapsedStore = createLocalStorageStore<boolean>(
  STORAGE_KEY,
  (raw) => raw === "1",
  (value) => (value ? "1" : "0"),
);

/**
 * Desktop/tablet sidebar — Phase 2 §11.2-11.3, Phase 4 §15.8/§15.24,
 * Phase 5 §10. Hidden entirely below the tablet breakpoint (MobileNav
 * takes over there, per §11.13/§22). Collapse state is a per-viewer
 * localStorage convenience only, never shared state.
 */
export function Sidebar() {
  const pathname = usePathname();
  const collapsed = React.useSyncExternalStore(
    collapsedStore.subscribe,
    collapsedStore.getSnapshot,
    collapsedStore.getServerSnapshot,
  );

  const toggleCollapsed = React.useCallback(() => {
    collapsedStore.set(!collapsed);
  }, [collapsed]);

  return (
    <aside
      className={cn(
        "hidden shrink-0 flex-col border-border bg-card lg:flex",
        "border-e transition-[width] duration-200 ease-out",
        collapsed ? "w-16" : "w-60",
      )}
      aria-label="Primary navigation"
    >
      <div className="flex h-14 items-center px-4">
        <span
          className={cn(
            "truncate text-sm font-semibold text-foreground",
            collapsed && "sr-only",
          )}
        >
          Northbound Studio
        </span>
      </div>

      <nav className="flex-1 space-y-0.5 px-2" aria-label="Main">
        {sidebarNavItems.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex h-11 items-center gap-3 rounded-sm px-3 text-sm font-medium text-muted-foreground outline-none",
                "transition-colors duration-150 ease-out",
                "hover:bg-accent hover:text-accent-foreground",
                "focus-visible:ring-2 focus-visible:ring-ring/70",
                active && "bg-[var(--fp-accent-subtle-bg)] text-[var(--fp-accent)]",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-y-1 start-0 w-0.5 rounded-full bg-[var(--fp-accent)]",
                  active ? "opacity-100" : "opacity-0",
                )}
              />
              <Icon className="size-[18px] shrink-0" aria-hidden="true" />
              <span className={cn("truncate", collapsed && "sr-only")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-2">
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-pressed={collapsed}
          className={cn(
            "flex h-11 w-full items-center gap-3 rounded-sm px-3 text-sm font-medium text-muted-foreground outline-none",
            "transition-colors duration-150 ease-out hover:bg-accent hover:text-accent-foreground",
            "focus-visible:ring-2 focus-visible:ring-ring/70",
          )}
        >
          {collapsed ? (
            <PanelLeftOpen className="size-[18px] shrink-0" aria-hidden="true" />
          ) : (
            <PanelLeftClose className="size-[18px] shrink-0" aria-hidden="true" />
          )}
          <span className={cn("truncate", collapsed && "sr-only")}>
            {collapsed ? "Expand" : "Collapse"}
          </span>
        </button>
      </div>
    </aside>
  );
}
