import type { Activity, Client, Project } from "@/types/entities";
import type { ProjectRiskResult } from "@/domain/risk/risk";
import {
  getProjectById,
  getClientById,
  getProjectRisk,
  getProjectTaskSummary,
  getProjectAssignedMembers,
  getProjectActivity,
  type ProjectTaskSummary,
  type ProjectAssignedMemberEntry,
} from "@/domain/selectors";
import { formatShortDate } from "@/lib/format";

export interface AIProjectSummary {
  project: Project;
  client: Client | undefined;
  risk: ProjectRiskResult;
  taskSummary: ProjectTaskSummary;
  members: ProjectAssignedMemberEntry[];
  recentActivity: Activity[];
  nextAttentionItem: string;
}

/**
 * "Summarize this project" (Phase 13 §7) — pure orchestration over
 * the exact Phase 8 selectors Project Overview already uses. No new
 * business logic; `nextAttentionItem` is a deterministic sentence
 * assembled from already-computed facts, not an invented judgment.
 */
export function buildProjectSummary(projectId: string): AIProjectSummary | undefined {
  const project = getProjectById(projectId);
  if (!project) return undefined;

  const risk = getProjectRisk(projectId);
  const taskSummary = getProjectTaskSummary(projectId);
  const members = getProjectAssignedMembers(projectId);
  const recentActivity = getProjectActivity(projectId, 3);

  return {
    project,
    client: getClientById(project.clientId),
    risk,
    taskSummary,
    members,
    recentActivity,
    nextAttentionItem: buildNextAttentionItem(project, risk, taskSummary),
  };
}

function buildNextAttentionItem(
  project: Project,
  risk: ProjectRiskResult,
  taskSummary: ProjectTaskSummary,
): string {
  if (risk.level === "critical_risk") {
    return `Review this project first — it's Critical Risk with ${risk.conditions.length} conditions true.`;
  }
  if (risk.level === "at_risk") {
    return "This project is At Risk — check the triggering condition below.";
  }
  if (taskSummary.overdueCount > 0) {
    return `${taskSummary.overdueCount} task${taskSummary.overdueCount === 1 ? " is" : "s are"} overdue — not yet enough to trigger risk, but worth a look.`;
  }
  if (project.dueDate) {
    return `No open issues — on track for its ${formatShortDate(project.dueDate)} due date.`;
  }
  return "No open issues right now.";
}
