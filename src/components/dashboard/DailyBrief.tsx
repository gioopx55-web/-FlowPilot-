import Link from "next/link";
import {
  AlertTriangle,
  TriangleAlert,
  Clock,
  UserRound,
  Users,
  Activity as ActivityIcon,
} from "lucide-react";
import { getDailyBriefItems, type DailyBriefItemKind } from "@/domain/dailyBrief";

const ICON_BY_KIND: Record<DailyBriefItemKind, typeof AlertTriangle> = {
  critical_risk: AlertTriangle,
  at_risk: TriangleAlert,
  overdue_task: Clock,
  follow_up: Users,
  overloaded_member: UserRound,
  activity: ActivityIcon,
};

const TONE_BY_KIND: Record<DailyBriefItemKind, string> = {
  critical_risk: "text-[var(--fp-danger)]",
  at_risk: "text-[var(--fp-warning)]",
  overdue_task: "text-[var(--fp-warning)]",
  follow_up: "text-[var(--fp-info)]",
  overloaded_member: "text-[var(--fp-warning)]",
  activity: "text-muted-foreground",
};

/**
 * Deterministic rule-based Daily Brief (Phase 7 §1). Every item is
 * produced by domain/dailyBrief.ts from real demo data via the same
 * selectors the rest of the Dashboard uses — nothing here is a live
 * AI call or invented content.
 */
export function DailyBrief() {
  const items = getDailyBriefItems();

  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nothing urgent right now — everything is on track.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border rounded-md border border-border">
      {items.map((item) => {
        const Icon = ICON_BY_KIND[item.kind];
        const isCritical = item.kind === "critical_risk";
        return (
          <li key={item.id}>
            <Link
              href={item.href}
              className={`flex items-start gap-3 p-3 outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/70 ${
                // Critical gets a left accent bar so it visually leads the
                // list — everything else stays in the same calm row
                // treatment, so the page doesn't read as uniformly
                // alarming (visual-balance pass).
                isCritical ? "border-s-2 border-s-[var(--fp-danger)]" : ""
              }`}
            >
              {isCritical ? (
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--fp-danger)]/10 text-[var(--fp-danger)]">
                  <Icon className="size-3.5" aria-hidden="true" />
                </span>
              ) : (
                <Icon
                  className={`mt-0.5 size-4 shrink-0 ${TONE_BY_KIND[item.kind]}`}
                  aria-hidden="true"
                />
              )}
              <span>
                <span className="block text-sm font-medium text-foreground">
                  {item.title}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {item.description}
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
