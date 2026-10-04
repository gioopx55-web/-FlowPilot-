import type { Activity, ID, Client, Project, Task, TeamMember } from "@/types/entities";
import { getDemoDataset } from "@/data/mock";
import { computeProjectRisk, type ProjectRiskResult } from "@/domain/risk/risk";
import {
  computeTeamMemberWorkload,
  type TeamMemberWorkloadResult,
} from "@/domain/workload/workload";
import {
  getClientFollowUpStatus,
  type ClientFollowUpStatus,
} from "@/domain/clients/followUp";
import { daysFromToday } from "@/lib/demo-clock";

const RISK_LEVEL_RANK: Record<ProjectRiskResult["level"], number> = {
  critical_risk: 0,
  at_risk: 1,
  none: 2,
};

const WORKLOAD_BAND_RANK: Record<TeamMemberWorkloadResult["band"], number> = {
  Overloaded: 0,
  High: 1,
  Healthy: 2,
  Available: 3,
};

/**
 * Reusable domain queries over the mock dataset (PROJECT_PLAN.md
 * §13's "Phase 7 Dashboard should consume these functions rather
 * than recompute business rules itself"). No React/UI code belongs
 * here — these are plain functions over data, callable from a future
 * server component, API route, or test with no change.
 */

export function getProjectById(id: ID): Project | undefined {
  return getDemoDataset().projects.find((p) => p.id === id);
}

export function getClientById(id: ID): Client | undefined {
  return getDemoDataset().clients.find((c) => c.id === id);
}

export function getTeamMemberById(id: ID): TeamMember | undefined {
  return getDemoDataset().teamMembers.find((m) => m.id === id);
}

export function getTasksForProject(projectId: ID): Task[] {
  return getDemoDataset().tasks.filter((t) => t.projectId === projectId);
}

export function getProjectsForClient(clientId: ID): Project[] {
  return getDemoDataset().projects.filter((p) => p.clientId === clientId);
}

export function getTasksForMember(memberId: ID): Task[] {
  return getDemoDataset().tasks.filter((t) => t.assigneeId === memberId);
}

export function getClientInteractions(clientId: ID) {
  return getDemoDataset().clientInteractions.filter(
    (i) => i.clientId === clientId,
  );
}

export { getLatestClientInteraction } from "@/domain/clients/followUp";

export function getProjectRisk(projectId: ID): ProjectRiskResult {
  const project = getProjectById(projectId);
  if (!project) {
    throw new Error(`getProjectRisk: unknown projectId "${projectId}"`);
  }
  return computeProjectRisk(project, getTasksForProject(projectId));
}

export function getTeamMemberWorkload(memberId: ID): TeamMemberWorkloadResult {
  const member = getTeamMemberById(memberId);
  if (!member) {
    throw new Error(`getTeamMemberWorkload: unknown memberId "${memberId}"`);
  }
  return computeTeamMemberWorkload(member, getDemoDataset().tasks);
}

/**
 * Overdue tasks, excluding tasks that belong to a `completed` or
 * `on_hold` project — an overdue leftover on paused/finished work
 * isn't actionable "today" work, mirroring the same exclusion
 * philosophy as computeProjectRisk (PROJECT_PLAN.md §13.22). Found
 * via visual verification during Phase 7: without this, the
 * Dashboard's Overdue Tasks widget surfaced tasks from a completed
 * and an on_hold project (the very fixtures authored in Phase 6 to
 * prove the *risk* exclusion), which is misleading noise, not signal.
 */
export function getOverdueTasks(): Task[] {
  const { tasks, projects } = getDemoDataset();
  const excludedProjectIds = new Set(
    projects
      .filter((p) => p.status === "completed" || p.status === "on_hold")
      .map((p) => p.id),
  );
  return tasks.filter(
    (t) =>
      t.status !== "done" &&
      t.dueDate !== undefined &&
      daysFromToday(t.dueDate) < 0 &&
      !excludedProjectIds.has(t.projectId),
  );
}

export function getClientsNeedingFollowUp(): Client[] {
  const { clients, clientInteractions } = getDemoDataset();
  return clients.filter(
    (c) => getClientFollowUpStatus(c, clientInteractions).needsFollowUp,
  );
}

export function getAtRiskProjects(): { project: Project; risk: ProjectRiskResult }[] {
  const { projects } = getDemoDataset();
  return projects
    .map((project) => ({ project, risk: getProjectRisk(project.id) }))
    .filter(({ risk }) => risk.level !== "none");
}

export interface AtRiskProjectEntry {
  project: Project;
  risk: ProjectRiskResult;
  client: Client | undefined;
}

/** At-risk projects, Critical Risk first then At Risk (Phase 7 Dashboard §2). */
export function getAtRiskProjectsSorted(): AtRiskProjectEntry[] {
  return getAtRiskProjects()
    .map(({ project, risk }) => ({
      project,
      risk,
      client: getClientById(project.clientId),
    }))
    .sort((a, b) => RISK_LEVEL_RANK[a.risk.level] - RISK_LEVEL_RANK[b.risk.level]);
}

export interface OverdueTaskEntry {
  task: Task;
  daysOverdue: number;
  project: Project | undefined;
  assignee: TeamMember | undefined;
}

/** Overdue tasks, most overdue first (Phase 7 Dashboard §3). */
export function getOverdueTasksSorted(): OverdueTaskEntry[] {
  return getOverdueTasks()
    .map((task) => ({
      task,
      daysOverdue: task.dueDate !== undefined ? -daysFromToday(task.dueDate) : 0,
      project: getProjectById(task.projectId),
      assignee: task.assigneeId ? getTeamMemberById(task.assigneeId) : undefined,
    }))
    .sort((a, b) => b.daysOverdue - a.daysOverdue);
}

export interface ClientFollowUpEntry {
  client: Client;
  status: ClientFollowUpStatus;
}

/** Clients needing follow-up, most overdue-for-contact first (Phase 7 Dashboard §4). */
export function getClientsNeedingFollowUpSorted(): ClientFollowUpEntry[] {
  const { clientInteractions } = getDemoDataset();
  return getClientsNeedingFollowUp()
    .map((client) => ({
      client,
      status: getClientFollowUpStatus(client, clientInteractions),
    }))
    .sort(
      (a, b) =>
        (b.status.daysSinceLastInteraction ?? Number.POSITIVE_INFINITY) -
        (a.status.daysSinceLastInteraction ?? Number.POSITIVE_INFINITY),
    );
}

export interface TeamWorkloadEntry {
  member: TeamMember;
  workload: TeamMemberWorkloadResult;
}

/** Every team member's workload, Overloaded first then High/Healthy/Available (Phase 7 Dashboard §5). */
export function getTeamWorkloadSnapshot(): TeamWorkloadEntry[] {
  const { teamMembers } = getDemoDataset();
  return teamMembers
    .map((member) => ({ member, workload: getTeamMemberWorkload(member.id) }))
    .sort((a, b) => {
      const bandDiff = WORKLOAD_BAND_RANK[a.workload.band] - WORKLOAD_BAND_RANK[b.workload.band];
      return bandDiff !== 0 ? bandDiff : b.workload.workloadPct - a.workload.workloadPct;
    });
}

/** Most recent activity entries, newest first (Phase 7 Dashboard §6). */
export function getRecentActivities(limit: number): Activity[] {
  const { activities } = getDemoDataset();
  return [...activities]
    .sort((a, b) => (a.occurredAt < b.occurredAt ? 1 : -1))
    .slice(0, limit);
}
