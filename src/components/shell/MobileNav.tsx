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
 */
export function MobileNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = React.useState(false);

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex h-16 border-t border-border bg-background lg:hidden"
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
              <Icon className="size-[20px]" aria-hidden="true" />
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
          <moreTabItem.icon className="size-[20px]" aria-hidden="true" />
          {moreTabItem.label}
        </button>
      </nav>

      <MoreSheet open={moreOpen} onOpenChange={setMoreOpen} />
    </>
  );
}
