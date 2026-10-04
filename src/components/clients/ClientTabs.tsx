"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * Route-backed Client Detail tabs — same pattern as ProjectTabs.tsx.
 * Overview is a lightweight landing page (not in the original Phase 2
 * §11.7 IA, which only specified Projects/Interactions) added for
 * consistency with Project Detail's own Overview-as-landing pattern,
 * per Phase 10 §5's explicit allowance ("if useful... keep it
 * lightweight and consistent with the approved IA").
 */
export function ClientTabs({ clientId }: { clientId: string }) {
  const pathname = usePathname();

  const tabs = [
    { key: "overview", label: "Overview", href: `/clients/${clientId}` },
    { key: "projects", label: "Projects", href: `/clients/${clientId}/projects` },
    { key: "interactions", label: "Interactions", href: `/clients/${clientId}/interactions` },
  ];

  return (
    <nav
      role="tablist"
      aria-label="Client sections"
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
