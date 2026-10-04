import type { ReactNode } from "react";
import Link from "next/link";

/**
 * Shared section wrapper for the Dashboard's six approved sections
 * (Phase 7 "Approved Information Hierarchy"). Deliberately plain —
 * a heading row plus content, no card chrome/shadow, consistent with
 * "no giant KPI cards" and the information-dense Phase 4 direction.
 */
export function DashboardSection({
  title,
  action,
  children,
}: {
  title: string;
  action?: { label: string; href: string };
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={`section-${title}`}>
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <h2
          id={`section-${title}`}
          className="text-sm font-semibold text-foreground"
        >
          {title}
        </h2>
        {action && (
          <Link
            href={action.href}
            className="text-xs font-medium text-[var(--fp-accent)] outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/70"
          >
            {action.label}
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
