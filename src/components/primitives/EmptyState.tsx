import type { LucideIcon } from "lucide-react";
import Link from "next/link";

/**
 * Shared empty-state pattern (Phase 4 §15.10, Phase 2 §11.19): a
 * small line-icon, one short neutral-to-positive sentence, and an
 * optional action (e.g. "Clear filters") — never a decorative
 * illustration.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <Icon className="size-6 text-muted-foreground" aria-hidden="true" />
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && (
        <Link
          href={action.href}
          className="text-xs font-medium text-[var(--fp-accent)] outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/70"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
