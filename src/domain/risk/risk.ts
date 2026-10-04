import type {
  Project,
  RiskCondition,
  RiskLevel,
  Task,
} from "@/types/entities";
import { daysFromToday, hoursSince } from "@/lib/demo-clock";

export interface ProjectRiskResult {
  level: RiskLevel;
  conditions: RiskCondition[];
}

const OVERDUE_RATIO_THRESHOLD = 0.25;
const HIGH_PRIORITY_OVERDUE_DAYS = 2;
const DUE_SOON_DAYS = 3;
const DUE_SOON_PROGRESS_THRESHOLD = 70;
const STALE_BLOCKER_HOURS = 48;

function isOpenTask(task: Task): boolean {
  return task.status !== "done";
}

function isOverdue(task: Task): boolean {
  return task.dueDate !== undefined && daysFromToday(task.dueDate) < 0;
}

/**
 * The single, shared Project Risk computation (PROJECT_PLAN.md §4a /
 * §13.16-13.17, DECISIONS.md D-010/D-022). Dashboard, Project Detail,
 * and any future AI logic must call this function — never
 * reimplement the formula. `completed`/`on_hold` projects are
 * excluded here, at the one place this matters, so no caller can
 * forget the exclusion (PROJECT_PLAN.md §13.22).
 */
export function computeProjectRisk(
  project: Project,
  projectTasks: Task[],
): ProjectRiskResult {
  if (project.status === "completed" || project.status === "on_hold") {
    return { level: "none", conditions: [] };
  }

  const conditions: RiskCondition[] = [];
  const openTasks = projectTasks.filter(isOpenTask);

  // Condition 1: more than 25% of open tasks are overdue.
  if (openTasks.length > 0) {
    const overdueOpenCount = openTasks.filter(isOverdue).length;
    if (overdueOpenCount / openTasks.length > OVERDUE_RATIO_THRESHOLD) {
      conditions.push("overdue_task_ratio_exceeded");
    }
  }

  // Condition 2: a High Priority task overdue by more than 2 days.
  const hasHighPriorityStaleOverdue = openTasks.some(
    (task) =>
      task.priority === "high" &&
      task.dueDate !== undefined &&
      -daysFromToday(task.dueDate) > HIGH_PRIORITY_OVERDUE_DAYS,
  );
  if (hasHighPriorityStaleOverdue) {
    conditions.push("high_priority_overdue");
  }

  // Condition 3: due date within 3 days and progress below 70%.
  if (
    project.dueDate !== undefined &&
    daysFromToday(project.dueDate) <= DUE_SOON_DAYS &&
    project.progressPct < DUE_SOON_PROGRESS_THRESHOLD
  ) {
    conditions.push("due_soon_low_progress");
  }

  // Condition 4: an unresolved active blocker open for more than 48 hours.
  const hasStaleActiveBlocker = projectTasks.some(
    (task) =>
      task.hasActiveBlocker &&
      task.blockerStartedAt !== undefined &&
      hoursSince(task.blockerStartedAt) > STALE_BLOCKER_HOURS,
  );
  if (hasStaleActiveBlocker) {
    conditions.push("unresolved_blocker_stale");
  }

  const level: RiskLevel =
    conditions.length === 0
      ? "none"
      : conditions.length === 1
        ? "at_risk"
        : "critical_risk";

  return { level, conditions };
}
