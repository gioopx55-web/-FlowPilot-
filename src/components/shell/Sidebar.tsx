"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { sidebarNavItems } from "@/components/shell/nav-config";
import { createLocalStorageStore } from "@/lib/local-storage-store";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { getLocale } from "@/lib/locale";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const STORAGE_KEY = "flowpilot-sidebar-collapsed";

const collapsedStore = createLocalStorageStore<boolean>(
  STORAGE_KEY,
  (raw) => raw === "1",
  (value) => (value ? "1" : "0"),
);

/**
 * Desktop/tablet sidebar — Phase 2 §11.2-11.3, Phase 4 §15.8/§15.24,
 * Phase 5 §10, Phase 17.5 visual polish. Hidden entirely below the
 * tablet breakpoint (MobileNav takes over there, per §11.13/§22).
 * Collapse state is a per-viewer localStorage convenience only, never
 * shared state.
 *
 * Phase 17.5: the active item now carries a `layoutId`-animated
 * indicator (shared across renders, so Motion tweens its position
 * when the route changes instead of two items independently fading)
 * — falls back to a static, non-animated indicator under
 * `prefers-reduced-motion: reduce`, same branch-on-the-hook pattern
 * `RevealOnScroll.tsx` already established. Collapsed mode now
 * centers each icon (previously left-aligned with dead space where
 * the hidden label used to be) and wraps every item in a Tooltip so
 * the icon-only state never leaves a sighted mouse/keyboard user
 * guessing a label.
 *
 * Phase 17.6: the brand mark/name is now a real link to `/` (the
 * public Landing Page) — previously plain text with no way back to
 * the marketing site from inside the app short of editing the URL.
 */
export function Sidebar() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  // Tooltips open toward the sidebar's logical end (physically right in
  // LTR, left in RTL) — same side-from-dir derivation as SidePanel.tsx,
  // since Radix's `side` prop is always physical, never logical.
  const { dir } = getLocale();
  const tooltipSide = dir === "rtl" ? "left" : "right";
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
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/"
                className="flex size-7 shrink-0 items-center justify-center rounded-md bg-[var(--fp-accent)] text-xs font-bold text-[var(--fp-accent-foreground)] outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
              >
                N
              </Link>
            </TooltipTrigger>
            <TooltipContent side={tooltipSide}>Back to website</TooltipContent>
          </Tooltip>
        ) : (
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
          >
            <span
              aria-hidden="true"
              className="flex size-7 shrink-0 items-center justify-center rounded-md bg-[var(--fp-accent)] text-xs font-bold text-[var(--fp-accent-foreground)]"
            >
              N
            </span>
            <span className="truncate text-sm font-semibold text-foreground">
              Northbound Studio
            </span>
          </Link>
        )}
      </div>

      <nav className="flex-1 space-y-0.5 px-2" aria-label="Main">
        {sidebarNavItems.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const Icon = item.icon;

          const link = (
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex h-11 items-center gap-3 rounded-md text-sm font-medium text-muted-foreground outline-none",
                "transition-colors duration-150 ease-out",
                collapsed ? "justify-center px-0" : "px-3",
                "hover:bg-accent hover:text-accent-foreground",
                "focus-visible:ring-2 focus-visible:ring-ring/70",
                active && "text-[var(--fp-accent)]",
              )}
            >
              {active &&
                (reducedMotion ? (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-md bg-[var(--fp-accent-subtle-bg)]"
                  />
                ) : (
                  <motion.span
                    aria-hidden="true"
                    layoutId="sidebar-active-surface"
                    className="absolute inset-0 rounded-md bg-[var(--fp-accent-subtle-bg)]"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                ))}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-y-1 start-0 w-0.5 rounded-full bg-[var(--fp-accent)]",
                  active ? "opacity-100" : "opacity-0",
                )}
              />
              <Icon className="relative size-[18px] shrink-0" aria-hidden="true" />
              <span className={cn("relative truncate", collapsed && "sr-only")}>
                {item.label}
              </span>
            </Link>
          );

          if (!collapsed) {
            return <React.Fragment key={item.href}>{link}</React.Fragment>;
          }

          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>{link}</TooltipTrigger>
              <TooltipContent side={tooltipSide}>{item.label}</TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      <div className="p-2">
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={toggleCollapsed}
                aria-pressed={collapsed}
                className="flex h-11 w-full items-center justify-center rounded-md text-sm font-medium text-muted-foreground outline-none transition-colors duration-150 ease-out hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/70"
              >
                <PanelLeftOpen className="size-[18px] shrink-0" aria-hidden="true" />
                <span className="sr-only">Expand</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side={tooltipSide}>Expand</TooltipContent>
          </Tooltip>
        ) : (
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-pressed={collapsed}
            className="flex h-11 w-full items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground outline-none transition-colors duration-150 ease-out hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/70"
          >
            <PanelLeftClose className="size-[18px] shrink-0" aria-hidden="true" />
            <span className="truncate">Collapse</span>
          </button>
        )}
      </div>
    </aside>
  );
}
