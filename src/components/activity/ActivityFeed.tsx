import Link from "next/link";
import {
  FilePlus2,
  RefreshCw,
  UserRoundCog,
  CalendarClock,
  CheckCircle2,
  Ban,
  History,
  type LucideIcon,
} from "lucide-react";
import type { ActivityType } from "@/types/entities";
import { formatShortDate } from "@/lib/format";
import { EmptyState } from "@/components/primitives/EmptyState";

// `Ban` (not an exclamation/alert shape) reads as "blocked," not
// "warning" — alert-triangle/circle iconography is reserved for a
// genuinely critical state, never an ordinary activity row
// (alert-styling correction).
const ICON_BY_TYPE: Record<ActivityType, LucideIcon> = {
  created: FilePlus2,
  status_changed: RefreshCw,
  reassigned: UserRoundCog,
  due_date_changed: CalendarClock,
  completed: CheckCircle2,
  blocker_opened: Ban,
  blocker_resolved: CheckCircle2,
};

// Neutral for routine changes; success for completions/resolutions;
// warning (never red — a blocker is a concern, not a critical alarm)
// for a newly-opened blocker. Semantic color stays inside this small
// icon chip only, never the row itself (visual-balance pass).
const TONE_BY_TYPE: Record<ActivityType, string> = {
  created: "text-muted-foreground bg-muted",
  status_changed: "text-muted-foreground bg-muted",
  reassigned: "text-muted-foreground bg-muted",
  due_date_changed: "text-muted-foreground bg-muted",
  completed: "text-[var(--fp-success)] bg-[var(--fp-success)]/10",
  blocker_opened: "text-[var(--fp-warning)] bg-[var(--fp-warning)]/10",
  blocker_resolved: "text-[var(--fp-success)] bg-[var(--fp-success)]/10",
};

/**
 * Every `Activity.summary` in this product is authored "<Name> <verb
 * phrase>..." (confirmed across all fixtures) — the actor's name is
 * already the leading word of the frozen summary sentence. Reading it
 * from there (rather than resolving a separate `actorUserId`) is
 * deliberate: `actorUserId` only ever points at one of the two demo
 * *login* Users, not the up-to-8 TeamMembers a summary actually
 * narrates (a real mismatch confirmed in the fixtures — e.g. one
 * entry's `actorUserId` resolves to "Maya" while its summary reads
 * "Marcus completed..."). Splitting the real, already-correct leading
 * name out of the summary avoids ever showing a wrong actor.
 */
function splitLeadingActor(summary: string): { actor: string; rest: string } {
  const match = summary.match(/^(\S+)\s(.*)$/);
  if (!match) return { actor: "", rest: summary };
  return { actor: match[1]!, rest: match[2]! };
}

export interface ActivityFeedEntry {
  id: string;
  type: ActivityType;
  summary: string;
  occurredAt: string;
  relatedLabel?: string;
  relatedHref?: string;
}

/**
 * Shared, reusable activity feed (visual-balance pass) — used by
 * Dashboard's Recent Activity, Project Overview's activity teaser,
 * and the Project Detail Activity tab, replacing three near-identical
 * plain-text implementations with one polished component (brief §5/
 * §7: a dense vertical-timeline layout with an event-type icon, an
 * actor initial, the related entity, and a timestamp — not plain text
 * appended to the page). Purely presentational: callers map their own
 * `Activity` records into `ActivityFeedEntry[]`; no domain/selector
 * import lives here, and no field is re-derived — only the already-
 * frozen `summary` string is parsed for display, never recomputed.
 */
export function ActivityFeed({
  entries,
  emptyTitle = "No activity yet",
  emptyDescription = "Changes will appear here as they happen.",
}: {
  entries: ActivityFeedEntry[];
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (entries.length === 0) {
    return (
      <div className="rounded-md border border-border">
        <EmptyState icon={History} title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  return (
    <ul className="rounded-md border border-border bg-[var(--fp-bg-surface)] px-3">
      {entries.map((entry, index) => {
        const Icon = ICON_BY_TYPE[entry.type];
        const isLast = index === entries.length - 1;
        const { actor, rest } = splitLeadingActor(entry.summary);
        return (
          <li key={entry.id} className="flex gap-3 py-2.5">
            <div className="flex shrink-0 flex-col items-center">
              <span
                className={`flex size-6 shrink-0 items-center justify-center rounded-full ${TONE_BY_TYPE[entry.type]}`}
                title={actor || undefined}
              >
                <Icon className="size-3.5" aria-hidden="true" />
              </span>
              {!isLast && <span aria-hidden="true" className="mt-1 w-px flex-1 bg-border" />}
            </div>

            <div className="min-w-0 flex-1 pb-0.5">
              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-0.5">
                <p className="min-w-0 text-sm text-foreground">
                  {actor && <span className="font-medium">{actor} </span>}
                  <span className="text-muted-foreground">{rest}</span>
                </p>
                <time
                  dateTime={entry.occurredAt}
                  className="shrink-0 whitespace-nowrap text-xs text-muted-foreground"
                >
                  {formatShortDate(entry.occurredAt)}
                </time>
              </div>
              {entry.relatedLabel && (
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {entry.relatedHref ? (
                    <Link
                      href={entry.relatedHref}
                      className="rounded-sm outline-none hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring/70"
                    >
                      {entry.relatedLabel}
                    </Link>
                  ) : (
                    entry.relatedLabel
                  )}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
