import {
  getProjectRisk,
  getProjectTaskSummary,
  getProjectAssignedMembers,
  getProjectActivity,
  getTasksForProject,
} from "@/domain/selectors";
import { requireProject } from "@/components/projects/requireProject";
import { Section } from "@/components/primitives/Section";
import { RISK_CONDITION_LABELS } from "@/components/primitives/riskConditionLabels";
import { ActivityFeed, type ActivityFeedEntry } from "@/components/activity/ActivityFeed";
import { formatShortDate } from "@/lib/format";

/**
 * Project Overview tab (Phase 8 §5). Every number here is read from a
 * domain selector; risk conditions are shown in full (not just via
 * the header's disclosure) since this tab is the project's one-page
 * summary for a manager deciding what to do next.
 */
export function ProjectOverview({ projectId }: { projectId: string }) {
  const project = requireProject(projectId);
  const risk = getProjectRisk(projectId);
  const taskSummary = getProjectTaskSummary(projectId);
  const members = getProjectAssignedMembers(projectId);
  const recentActivity = getProjectActivity(projectId, 5);
  const taskTitleById = new Map(getTasksForProject(projectId).map((t) => [t.id, t.title]));
  const activityEntries: ActivityFeedEntry[] = recentActivity.map((activity) => ({
    id: activity.id,
    type: activity.type,
    summary: activity.summary,
    occurredAt: activity.occurredAt,
    relatedLabel: activity.taskId ? taskTitleById.get(activity.taskId) : undefined,
    relatedHref: activity.taskId ? `/tasks/${activity.taskId}` : undefined,
  }));

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <Section title="Timeline">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <dt className="text-muted-foreground">Started</dt>
          <dd className="text-foreground">{formatShortDate(project.startDate)}</dd>
          <dt className="text-muted-foreground">Due</dt>
          <dd className="text-foreground">{formatShortDate(project.dueDate)}</dd>
          <dt className="text-muted-foreground">Progress</dt>
          <dd className="text-foreground">{project.progressPct}%</dd>
        </dl>
      </Section>

      <Section title="Risk">
        {risk.level === "none" ? (
          <p className="text-sm text-muted-foreground">
            No risk conditions are currently true for this project.
          </p>
        ) : (
          <ul className="list-inside list-disc space-y-1 text-sm text-foreground">
            {risk.conditions.map((condition) => (
              <li key={condition}>{RISK_CONDITION_LABELS[condition]}</li>
            ))}
          </ul>
        )}
      </Section>

      <Section
        title="Tasks"
        action={{ label: "View tasks", href: `/projects/${projectId}/tasks` }}
      >
        <dl className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <dt className="text-muted-foreground">Open</dt>
            <dd className="text-base font-semibold text-foreground">{taskSummary.openCount}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Overdue</dt>
            <dd className="text-base font-semibold text-foreground">
              {taskSummary.overdueCount}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Done</dt>
            <dd className="text-base font-semibold text-foreground">{taskSummary.doneCount}</dd>
          </div>
        </dl>
      </Section>

      <Section
        title="Team"
        action={{ label: "View team", href: `/projects/${projectId}/team` }}
      >
        {members.length === 0 ? (
          <p className="text-sm text-muted-foreground">No one is assigned yet.</p>
        ) : (
          <ul className="space-y-1.5 text-sm">
            {members.slice(0, 5).map(({ member, taskCount }) => (
              <li key={member.id} className="flex items-center justify-between gap-4">
                <span className="text-foreground">{member.name}</span>
                <span className="text-muted-foreground">
                  {taskCount} task{taskCount === 1 ? "" : "s"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <div className="md:col-span-2">
        <Section
          title="Recent Activity"
          action={{ label: "View activity", href: `/projects/${projectId}/activity` }}
        >
          <ActivityFeed entries={activityEntries} emptyDescription="No activity recorded yet." />
        </Section>
      </div>
    </div>
  );
}
