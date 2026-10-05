"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { mobileTabItems, moreTabItem } from "@/components/shell/nav-config";
import { MoreSheet } from "@/components/shell/MoreSheet";

/**
 * Mobile bottom tab bar — Phase 2 §11.13, D-013. Exactly 5 destinations:
 * Dashboard/Projects/Tasks/Clients + More. Visible only below the tablet
 * breakpoint (lg:hidden matches the Sidebar's lg:flex, Phase 4 §15.12).
 * AI Assistant/Notifications are intentionally absent here — they live
 * in the mobile topbar action cluster, not the tab bar (D-013/D-014).
 *
 * Phase 17.5: `bg-card` (the same raised-surface token the Sidebar
 * uses) instead of `bg-background` — matches the desktop shell's
 * chrome-vs-canvas separation rather than blending into the page.
 * Kept solid (no transparency/blur): this is a persistent, dense,
 * always-visible nav, not an overlay, and the brief explicitly keeps
 * transparency off anything dense/overlay-adjacent on mobile. Active
 * state now pairs color with a small icon-backing chip, not color
 * alone.
 */
export function MobileNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = React.useState(false);

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex h-16 border-t border-border bg-card lg:hidden"
        aria-label="Primary navigation"
      >
        {mobileTabItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground",
                active && "text-[var(--fp-accent)]",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-10 items-center justify-center rounded-full transition-colors duration-150 ease-out",
                  active && "bg-[var(--fp-accent-subtle-bg)]",
                )}
              >
                <Icon className="size-[20px]" aria-hidden="true" />
              </span>
              {item.label}
            </Link>
          );
        })}

        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={moreOpen}
          className="flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground"
        >
          <span className="flex h-7 w-10 items-center justify-center rounded-full">
            <moreTabItem.icon className="size-[20px]" aria-hidden="true" />
          </span>
          {moreTabItem.label}
        </button>
      </nav>

      <MoreSheet open={moreOpen} onOpenChange={setMoreOpen} />
    </>
  );
}
