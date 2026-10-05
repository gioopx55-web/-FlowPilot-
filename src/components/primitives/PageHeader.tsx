import type { ReactNode } from "react";

/**
 * Shared top-level page header (Phase 17.5 §8 — "Content Header
 * System"). Before this, Dashboard had no page-level header at all
 * (only the Topbar's title), while Projects/Tasks/Clients/Team/
 * Analytics each duplicated a bare, description-less `<h1>` inline —
 * inconsistent hierarchy across otherwise-equivalent top-level pages.
 * This is the one shared shape (title + optional one-line description
 * + optional contextual action), matching the pattern Settings
 * already established in Phase 14 (`settings/layout.tsx`'s header).
 * Kept alongside the Topbar's own title (not a replacement for it) —
 * the Topbar title is the compact, always-visible wayfinding label;
 * this is the richer, in-flow heading for the page itself.
 */
export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-foreground">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
