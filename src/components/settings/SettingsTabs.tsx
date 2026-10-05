"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "profile", label: "Profile", href: "/settings" },
  { key: "workspace", label: "Workspace", href: "/settings/workspace" },
  { key: "appearance", label: "Appearance", href: "/settings/appearance" },
  { key: "notifications", label: "Notifications", href: "/settings/notifications" },
  { key: "billing", label: "Billing", href: "/settings/billing" },
];

/**
 * Route-backed Settings tabs (Phase 14 §8) — same pattern as ClientTabs/ProjectTabs.
 * Plain nav links with `aria-current="page"`, not `role="tablist"`/`role="tab"`
 * (Phase 17 fix): each item is a real, deep-linkable route — not an
 * in-page panel switcher — so the ARIA tab pattern's expectations
 * (arrow-key navigation between tabs, `aria-controls`/`tabpanel`) don't
 * match the actual behavior and would mislead screen-reader users.
 */
export function SettingsTabs() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Settings sections"
      className="flex gap-1 overflow-x-auto border-b border-border px-4 sm:px-6 lg:px-8"
    >
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.key}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative flex h-11 shrink-0 items-center px-3 text-sm font-medium outline-none transition-colors",
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
