import Link from "next/link";
import type { ReactNode } from "react";
import type { AIWeeklyReport } from "@/domain/ai/weeklyReport";
import { RiskBadge } from "@/components/primitives/RiskBadge";
import { formatShortDate } from "@/lib/format";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="mb-1 text-xs font-medium text-muted-foreground">{title}</h4>
      {children}
    </div>
  );
}

/**
 * Deterministic weekly report (Phase 13 §11) — every number here
 * comes from `AIWeeklyReport`'s already-computed fields
 * (`domain/ai/weeklyReport.ts`); this component only formats and
 * links, same inline-formatting convention `OverdueTasks.tsx`/
 * `ClientsTable.tsx` already use elsewhere.
 */
export function AIWeeklyReportCard({ data }: { data: AIWeeklyReport }) {
  const {
    windowDays,
    atRiskProjects,
    overdueTasks,
    completedTasks,
    followUps,
    workloadConcerns,
    nextActions,
  } = data;

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">Last {windowDays} days.</p>

      <Section title="Next actions">
        <ul className="list-inside list-disc space-y-1 text-sm text-foreground">
          {nextActions.map((action) => (
            <li key={action}>{action}</li>
          ))}
        </ul>
      </Section>

      <Section title={`Project health (${atRiskProjects.length} at risk)`}>
        {atRiskProjects.length === 0 ? (
          <p className="text-sm text-muted-foreground">No projects at risk.</p>
        ) : (
          <ul className="space-y-1">
            {atRiskProjects.slice(0, 5).map((e) => (
              <li key={e.project.id} className="flex items-center justify-between gap-2 text-sm">
                <Link
                  href={`/projects/${e.project.id}`}
                  className="truncate text-foreground outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/70"
                >
                  {e.project.name}
                </Link>
                <RiskBadge risk={e.risk} />
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section
        title={`Tasks (${overdueTasks.length} overdue, ${completedTasks.length} completed this period)`}
      >
        {overdueTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">No overdue tasks.</p>
        ) : (
          <ul className="space-y-1">
            {overdueTasks.slice(0, 5).map((e) => (
              <li key={e.task.id} className="text-sm">
                <Link
                  href={`/tasks/${e.task.id}`}
                  className="text-foreground outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/70"
                >
                  {e.task.title}
                </Link>
                <span className="text-xs text-muted-foreground"> · {e.daysOverdue}d overdue</span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title={`Clients needing follow-up (${followUps.length})`}>
        {followUps.length === 0 ? (
          <p className="text-sm text-muted-foreground">No clients need follow-up.</p>
        ) : (
          <ul className="space-y-1">
            {followUps.slice(0, 5).map((e) => (
              <li key={e.client.id} className="text-sm">
                <Link
                  href={`/clients/${e.client.id}`}
                  className="text-foreground outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/70"
                >
                  {e.client.name}
                </Link>
                {e.status.lastInteractionAt && (
                  <span className="text-xs text-muted-foreground">
                    {" "}
                    · last touch {formatShortDate(e.status.lastInteractionAt)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title={`Workload concerns (${workloadConcerns.length})`}>
        {workloadConcerns.length === 0 ? (
          <p className="text-sm text-muted-foreground">No workload concerns.</p>
        ) : (
          <ul className="space-y-1">
            {workloadConcerns.slice(0, 5).map((e) => (
              <li key={e.member.id} className="flex items-center justify-between gap-2 text-sm">
                <Link
                  href={`/team/${e.member.id}`}
                  className="truncate text-foreground outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/70"
                >
                  {e.member.name}
                </Link>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {e.workload.band} · {Math.round(e.workload.workloadPct)}%
                </span>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
