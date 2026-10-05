import Link from "next/link";
import type { AIProjectSummary } from "@/domain/ai/projectSummary";
import { RiskBadge } from "@/components/primitives/RiskBadge";
import { PROJECT_STATUS_LABEL } from "@/components/projects/projectLabels";
import { formatShortDate } from "@/lib/format";

/**
 * "Summarize this project" (Phase 13 §7) — grounded entirely in
 * `AIProjectSummary`'s already-computed fields; this component only
 * lays them out.
 */
export function AIProjectSummaryCard({ data }: { data: AIProjectSummary }) {
  const { project, client, risk, taskSummary, members, recentActivity, nextAttentionItem } = data;

  return (
    <div className="space-y-3">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/projects/${project.id}`}
            className="text-sm font-semibold text-foreground outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/70"
          >
            {project.name}
          </Link>
          <RiskBadge risk={risk} />
        </div>
        <p className="text-xs text-muted-foreground">
          {client ? (
            <Link href={`/clients/${client.id}`} className="outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/70">
              {client.name}
            </Link>
          ) : (
            "Unknown client"
          )}
          {" · "}
          {PROJECT_STATUS_LABEL[project.status]}
          {" · "}
          {project.progressPct}% complete
          {project.dueDate && ` · due ${formatShortDate(project.dueDate)}`}
        </p>
      </div>

      <p className="text-sm text-foreground">{nextAttentionItem}</p>

      <dl className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <dt className="text-muted-foreground">Open tasks</dt>
          <dd className="text-sm font-medium text-foreground">{taskSummary.openCount}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Overdue</dt>
          <dd className="text-sm font-medium text-foreground">{taskSummary.overdueCount}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Done</dt>
          <dd className="text-sm font-medium text-foreground">{taskSummary.doneCount}</dd>
        </div>
      </dl>

      {members.length > 0 && (
        <div>
          <h4 className="mb-1 text-xs font-medium text-muted-foreground">Team</h4>
          <ul className="space-y-1">
            {members.slice(0, 5).map(({ member, taskCount }) => (
              <li key={member.id} className="flex items-center justify-between gap-2 text-sm">
                <Link
                  href={`/team/${member.id}`}
                  className="truncate text-foreground outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/70"
                >
                  {member.name}
                </Link>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {taskCount} task{taskCount === 1 ? "" : "s"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {recentActivity.length > 0 && (
        <div>
          <h4 className="mb-1 text-xs font-medium text-muted-foreground">Recent activity</h4>
          <ul className="space-y-1">
            {recentActivity.map((activity) => (
              <li key={activity.id} className="text-xs text-muted-foreground">
                {activity.summary}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
