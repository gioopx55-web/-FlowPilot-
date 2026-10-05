import { getDemoDataset } from "@/data/mock";
import type { Task, Activity } from "@/types/entities";
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
import { daysFromToday } from "@/lib/demo-clock";

const REPORT_WINDOW_DAYS = 7;

export interface AIWeeklyReport {
  windowDays: number;
  atRiskProjects: AtRiskProjectEntry[];
  overdueTasks: OverdueTaskEntry[];
  completedTasks: Task[];
  followUps: ClientFollowUpEntry[];
  workloadConcerns: TeamWorkloadEntry[];
  recentActivity: Activity[];
  nextActions: string[];
}

/** Tasks completed within the last `windowDays` — the one place this "this week" window is defined. */
function getTasksCompletedWithin(windowDays: number): Task[] {
  const { tasks } = getDemoDataset();
  return tasks.filter(
    (t) => t.completedAt !== undefined && daysFromToday(t.completedAt) >= -windowDays,
  );
}

/**
 * Deterministic weekly operational report (Phase 13 §11) — assembled
 * entirely from existing selectors, no invented metrics. `nextActions`
 * is a short, grounded bullet list derived from the same counts shown
 * above it, not a generated narrative.
 */
export function buildWeeklyReport(): AIWeeklyReport {
  const atRiskProjects = getAtRiskProjectsSorted();
  const overdueTasks = getOverdueTasksSorted();
  const completedTasks = getTasksCompletedWithin(REPORT_WINDOW_DAYS);
  const followUps = getClientsNeedingFollowUpSorted();
  const workloadConcerns = getTeamWorkloadSnapshot().filter(
    (e) => e.workload.band === "Overloaded" || e.workload.band === "High",
  );
  const recentActivity = getRecentActivities(5);

  const nextActions: string[] = [];
  const criticalCount = atRiskProjects.filter((e) => e.risk.level === "critical_risk").length;
  if (criticalCount > 0) {
    nextActions.push(
      `Review ${criticalCount} Critical Risk project${criticalCount === 1 ? "" : "s"} first.`,
    );
  }
  if (overdueTasks.length > 0) {
    nextActions.push(
      `Clear or reassign ${overdueTasks.length} overdue task${overdueTasks.length === 1 ? "" : "s"}.`,
    );
  }
  if (followUps.length > 0) {
    nextActions.push(
      `Reach out to ${followUps.length} client${followUps.length === 1 ? "" : "s"} needing follow-up.`,
    );
  }
  const overloadedCount = workloadConcerns.filter((e) => e.workload.band === "Overloaded").length;
  if (overloadedCount > 0) {
    nextActions.push(
      `Rebalance work for ${overloadedCount} overloaded team member${overloadedCount === 1 ? "" : "s"}.`,
    );
  }
  if (nextActions.length === 0) {
    nextActions.push("No urgent actions — workspace is on track.");
  }

  return {
    windowDays: REPORT_WINDOW_DAYS,
    atRiskProjects,
    overdueTasks,
    completedTasks,
    followUps,
    workloadConcerns,
    recentActivity,
    nextActions,
  };
}
