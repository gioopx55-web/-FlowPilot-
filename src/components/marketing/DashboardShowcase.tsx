import type { AtRiskProjectEntry, OverdueTaskEntry } from "@/domain/selectors";
import { RevealOnScroll } from "@/components/marketing/RevealOnScroll";
import { PreviewCard, PreviewCardHeader } from "@/components/marketing/PreviewCard";
import { RiskBadge } from "@/components/primitives/RiskBadge";
import { formatShortDate } from "@/lib/format";

/**
 * Product proof (Phase 13.5 §3.2) — a fuller two-panel view of the
 * real Dashboard's At-Risk Projects / Overdue Tasks sections, using
 * the current demo workspace's actual data.
 */
export function DashboardShowcase({
  atRiskEntries,
  overdueEntries,
}: {
  atRiskEntries: AtRiskProjectEntry[];
  overdueEntries: OverdueTaskEntry[];
}) {
  return (
    <section id="product-preview" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <RevealOnScroll className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold tracking-wide text-[var(--fp-accent)] uppercase">
          The Dashboard
        </span>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          One screen, the questions that actually matter.
        </h2>
        <p className="mt-3 text-base text-muted-foreground">
          Every project at risk and every overdue task, ranked and linked — this is
          the real `/dashboard` the demo opens into.
        </p>
      </RevealOnScroll>

      <RevealOnScroll delay={0.1} className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-2">
        <PreviewCard className="max-w-none">
          <PreviewCardHeader title="At-Risk Projects" />
          <ul className="divide-y divide-border">
            {atRiskEntries.slice(0, 4).map((entry) => (
              <li key={entry.project.id} className="space-y-1.5 p-3">
                <p className="truncate text-sm font-medium text-foreground">
                  {entry.project.name}
                </p>
                <RiskBadge risk={entry.risk} />
              </li>
            ))}
          </ul>
        </PreviewCard>

        <PreviewCard className="max-w-none">
          <PreviewCardHeader title="Overdue Tasks" />
          <ul className="divide-y divide-border">
            {overdueEntries.slice(0, 4).map((entry) => (
              <li key={entry.task.id} className="p-3">
                <p className="truncate text-sm font-medium text-foreground">
                  {entry.task.title}
                </p>
                <p className="truncate text-xs text-[var(--fp-danger)]">
                  {entry.daysOverdue} day{entry.daysOverdue === 1 ? "" : "s"} overdue
                  {entry.task.dueDate && ` · was due ${formatShortDate(entry.task.dueDate)}`}
                </p>
              </li>
            ))}
          </ul>
        </PreviewCard>
      </RevealOnScroll>
    </section>
  );
}
