import type { ID, Task, TaskPriority, TeamMember } from "@/types/entities";

export type WorkloadBand = "Available" | "Healthy" | "High" | "Overloaded";

export interface TeamMemberWorkloadResult {
  workloadPct: number;
  assignedHours: number;
  weeklyCapacityHours: number;
  /** Task IDs whose hours came from the fallback table, not a real estimate. */
  fallbackTaskIds: ID[];
  band: WorkloadBand;
}

/**
 * Approved fallback hours (PROJECT_PLAN.md §13.20, DECISIONS.md
 * D-019). Applied only here, at computation time — never written
 * into `Task.estimatedHours`.
 */
const FALLBACK_HOURS: Record<TaskPriority, number> = {
  low: 2,
  medium: 4,
  high: 8,
};

function hoursForTask(task: Task): { hours: number; usedFallback: boolean } {
  if (task.estimatedHours !== undefined) {
    return { hours: task.estimatedHours, usedFallback: false };
  }
  return { hours: FALLBACK_HOURS[task.priority], usedFallback: true };
}

function bandForPct(pct: number): WorkloadBand {
  if (pct < 70) return "Available";
  if (pct <= 90) return "Healthy";
  if (pct <= 110) return "High";
  return "Overloaded";
}

/**
 * The single, shared Team Workload computation (PROJECT_PLAN.md
 * §13.18, DECISIONS.md D-011/D-019). Only open (not `done`) tasks
 * assigned to the member count toward workload — a completed task no
 * longer represents current load. Never store the result; always
 * recompute from live Task + TeamMember data (One Source of Truth,
 * Constitution §7).
 */
export function computeTeamMemberWorkload(
  member: TeamMember,
  assignedTasks: Task[],
): TeamMemberWorkloadResult {
  const openAssignedTasks = assignedTasks.filter(
    (task) => task.assigneeId === member.id && task.status !== "done",
  );

  let assignedHours = 0;
  const fallbackTaskIds: ID[] = [];

  for (const task of openAssignedTasks) {
    const { hours, usedFallback } = hoursForTask(task);
    assignedHours += hours;
    if (usedFallback) fallbackTaskIds.push(task.id);
  }

  const workloadPct =
    member.weeklyCapacityHours > 0
      ? (assignedHours / member.weeklyCapacityHours) * 100
      : 0;

  return {
    workloadPct,
    assignedHours,
    weeklyCapacityHours: member.weeklyCapacityHours,
    fallbackTaskIds,
    band: bandForPct(workloadPct),
  };
}
