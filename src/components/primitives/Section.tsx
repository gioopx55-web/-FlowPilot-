import type { ReactNode } from "react";
import Link from "next/link";

/**
 * Shared section wrapper — a heading row plus content, no card
 * chrome/shadow. Originally built for the Phase 7 Dashboard's six
 * sections; reused as-is for Phase 8's Project Overview tab rather
 * than duplicated, since both need the identical title+action+content
 * pattern.
 */
export function Section({
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
