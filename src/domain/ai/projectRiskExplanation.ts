import type { Project, Task } from "@/types/entities";
import type { ProjectRiskResult } from "@/domain/risk/risk";
import { getProjectById, getProjectRisk, getTasksForProject, getOverdueTasksSorted } from "@/domain/selectors";

export interface AIProjectRiskExplanation {
  project: Project;
  risk: ProjectRiskResult;
  /** Overdue tasks on this project — linked evidence for overdue_task_ratio_exceeded/high_priority_overdue. */
  overdueTasks: Task[];
  /** Tasks with an active blocker on this project — linked evidence for unresolved_blocker_stale. */
  blockedTasks: Task[];
}

/**
 * "Why is this project at risk?" (Phase 13 §8). Uses the exact
 * `computeProjectRisk` conditions — never paraphrased or
 * re-derived — plus linked tasks found via the SAME predicates
 * `getOverdueTasksSorted`/`Task.hasActiveBlocker` already use
 * elsewhere, so the evidence shown is never a second implementation
 * of the risk formula's thresholds.
 */
export function buildProjectRiskExplanation(
  projectId: string,
): AIProjectRiskExplanation | undefined {
  const project = getProjectById(projectId);
  if (!project) return undefined;

  const risk = getProjectRisk(projectId);
  const overdueTasks = getOverdueTasksSorted()
    .filter((e) => e.project?.id === projectId)
    .map((e) => e.task);
  const blockedTasks = getTasksForProject(projectId).filter((t) => t.hasActiveBlocker);

  return { project, risk, overdueTasks, blockedTasks };
}
