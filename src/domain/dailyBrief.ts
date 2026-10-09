import {
  getAtRiskProjectsSorted,
  getOverdueTasksSorted,
  getClientsNeedingFollowUpSorted,
  getTeamWorkloadSnapshot,
  getRecentActivities,
  type AtRiskProjectEntry,
  type OverdueTaskEntry,
  type ClientFollowUpEntry,
  type TeamWorkloadEntry,
} from "@/domain/selectors";
import type { Activity } from "@/types/entities";

export type DailyBriefItemKind =
  | "critical_risk"
  | "at_risk"
  | "overdue_task"
  | "follow_up"
  | "overloaded_member"
  | "activity";

export interface DailyBriefItem {
  id: string;
  kind: DailyBriefItemKind;
  title: string;
  description: string;
  href: string;
}

const DEFAULT_LIMIT = 5;

/**
 * The ranking RULE (Critical Risk > At Risk > most-overdue task >
 * most-stale follow-up > most-overloaded member > most recent
 * activity) extracted as a pure function of its 5 input arrays — the
 * actual "business logic" of the Daily Brief, reused unchanged by
 * both `getDailyBriefItems` (below, reads live mutable state for the
 * authenticated app) and `domain/landingSnapshot.ts` (reads the
 * immutable base dataset for the public Landing Page). Neither this
 * function's ranking rule nor the risk/workload/follow-up formulas it
 * reads results from ever change based on which caller feeds it —
 * only the INPUT arrays differ.
 */
export function composeDailyBriefItems(
  limit: number,
  inputs: {
    riskEntries: AtRiskProjectEntry[];
    overdueTasks: OverdueTaskEntry[];
    followUps: ClientFollowUpEntry[];
    workload: TeamWorkloadEntry[];
    recentActivities: Activity[];
  },
): DailyBriefItem[] {
  const { riskEntries, overdueTasks, followUps, workload, recentActivities } = inputs;
  const items: DailyBriefItem[] = [];

  for (const entry of riskEntries) {
    if (entry.risk.level !== "critical_risk") continue;
    items.push({
      id: `brief_critical_${entry.project.id}`,
      kind: "critical_risk",
      title: `${entry.project.name} is Critical Risk`,
      description: `${entry.risk.conditions.length} risk conditions are currently true for ${entry.client?.name ?? "this client"}.`,
      href: `/projects/${entry.project.id}`,
    });
  }

  for (const entry of riskEntries) {
    if (entry.risk.level !== "at_risk") continue;
    items.push({
      id: `brief_at_risk_${entry.project.id}`,
      kind: "at_risk",
      title: `${entry.project.name} is At Risk`,
      description: `${entry.client?.name ?? "This client"}'s project has a risk condition flagged.`,
      href: `/projects/${entry.project.id}`,
    });
  }

  if (overdueTasks.length > 0) {
    const worst = overdueTasks[0]!;
    items.push({
      id: `brief_overdue_${worst.task.id}`,
      kind: "overdue_task",
      title: `"${worst.task.title}" is ${worst.daysOverdue} days overdue`,
      description: `${worst.project?.name ?? "A project"} task assigned to ${worst.assignee?.name ?? "someone"}.`,
      href: `/tasks/${worst.task.id}`,
    });
  }

  if (followUps.length > 0) {
    const stalest = followUps[0]!;
    items.push({
      id: `brief_follow_up_${stalest.client.id}`,
      kind: "follow_up",
      title: `${stalest.client.name} needs follow-up`,
      description: `No contact in ${stalest.status.daysSinceLastInteraction ?? "?"} days.`,
      href: `/clients/${stalest.client.id}`,
    });
  }

  const mostOverloaded = workload.find((w) => w.workload.band === "Overloaded");
  if (mostOverloaded) {
    items.push({
      id: `brief_overloaded_${mostOverloaded.member.id}`,
      kind: "overloaded_member",
      title: `${mostOverloaded.member.name} is overloaded`,
      description: `${Math.round(mostOverloaded.workload.workloadPct)}% of weekly capacity (${mostOverloaded.workload.assignedHours}h / ${mostOverloaded.workload.weeklyCapacityHours}h).`,
      href: `/team/${mostOverloaded.member.id}`,
    });
  }

  if (items.length < limit) {
    const [latestActivity] = recentActivities;
    if (latestActivity) {
      items.push({
        id: `brief_activity_${latestActivity.id}`,
        kind: "activity",
        title: latestActivity.summary,
        description: "Most recent workspace activity.",
        href: `/projects/${latestActivity.projectId}`,
      });
    }
  }

  return items.slice(0, limit);
}

/**
 * Deterministic, rule-based Daily Brief (Phase 7 §1) for the
 * authenticated app. Not an AI Assistant and not a real AI API call —
 * reads the same live, mutable domain selectors as the rest of the
 * Dashboard, then ranks them via `composeDailyBriefItems` above.
 * Capped at `limit` items (default 5, per the approved "3-5 signals"
 * scope).
 */
export function getDailyBriefItems(limit: number = DEFAULT_LIMIT): DailyBriefItem[] {
  return composeDailyBriefItems(limit, {
    riskEntries: getAtRiskProjectsSorted(),
    overdueTasks: getOverdueTasksSorted(),
    followUps: getClientsNeedingFollowUpSorted(),
    workload: getTeamWorkloadSnapshot(),
    recentActivities: getRecentActivities(1),
  });
}
