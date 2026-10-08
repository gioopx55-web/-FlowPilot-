import { FolderKanban, Clock } from "lucide-react";
import type { ProjectListEntry, OverdueTaskEntry } from "@/domain/selectors";
import { RevealOnScroll } from "@/components/marketing/RevealOnScroll";
import { PreviewCard, PreviewCardHeader } from "@/components/marketing/PreviewCard";
import { DotGrid } from "@/components/marketing/DotGrid";
import { RiskBadge } from "@/components/primitives/RiskBadge";
import { Badge } from "@/components/primitives/Badge";
import { formatShortDate } from "@/lib/format";

/**
 * Product proof (Phase 13.5 §3.2; reframed for the Landing Page
 * warning-balance pass, see DECISIONS.md) — a fuller two-panel view
 * using the current demo workspace's actual data. Previously titled
 * "At-Risk Projects" and fed every at-risk project unfiltered
 * (worst-first) — for a public marketing page that reads as "every
 * project is a problem." Now "Project Health": mostly real on-track
 * projects (progress/due date shown plainly, no badge needed) plus at
 * most one real at-risk example, curated by
 * `landingCuration.ts`'s `pickProjectHealthExamples` — the real,
 * uncurated at-risk list is still exactly what `/projects` shows.
 * Overdue Tasks stays an honest, small callout (capped at 2, not 4)
 * rather than the dominant half of the section.
 */
export function DashboardShowcase({
  projectHealthEntries,
  overdueEntries,
}: {
  projectHealthEntries: ProjectListEntry[];
  overdueEntries: OverdueTaskEntry[];
}) {
  return (
    <section id="product-preview" className="relative isolate overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <DotGrid className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 text-border/50" />

      <RevealOnScroll className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold tracking-wide text-[var(--fp-accent)] uppercase">
          The Dashboard
        </span>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          One screen, the questions that actually matter.
        </h2>
        <p className="mt-3 text-base text-muted-foreground">
          Project health and what&apos;s outstanding, ranked and linked — this is the
          real `/dashboard` the demo opens into.
        </p>
      </RevealOnScroll>

      <RevealOnScroll delay={0.1} className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-2">
        <PreviewCard className="max-w-none">
          <PreviewCardHeader title="Project Health" icon={FolderKanban} />
          <ul className="divide-y divide-border">
            {projectHealthEntries.map((entry) => (
              <li key={entry.project.id} className="space-y-1.5 p-3">
                <p className="truncate text-sm font-medium text-foreground">
                  {entry.project.name}
                </p>
                {entry.risk.level === "none" ? (
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Badge tone="success">On Track</Badge>
                    {entry.project.progressPct}% complete
                    {entry.project.dueDate && ` · due ${formatShortDate(entry.project.dueDate)}`}
                  </p>
                ) : (
                  <RiskBadge risk={entry.risk} />
                )}
              </li>
            ))}
          </ul>
        </PreviewCard>

        <PreviewCard className="max-w-none">
          <PreviewCardHeader title="Overdue Tasks" icon={Clock} />
          <ul className="divide-y divide-border">
            {overdueEntries.slice(0, 2).map((entry) => (
              <li key={entry.task.id} className="p-3">
                <p className="truncate text-sm font-medium text-foreground">
                  {entry.task.title}
                </p>
                <p className="truncate text-xs text-[var(--fp-warning)]">
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
