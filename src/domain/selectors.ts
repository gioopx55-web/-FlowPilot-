import type {
  Activity,
  ID,
  Client,
  Project,
  ProjectStatus,
  RiskLevel,
  Task,
  TeamMember,
  User,
} from "@/types/entities";
import { getDemoDataset } from "@/data/mock";
import { computeProjectRisk, type ProjectRiskResult } from "@/domain/risk/risk";
import {
  computeTeamMemberWorkload,
  sumAssignedHours,
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

export function getUserById(id: ID): User | undefined {
  return getDemoDataset().users.find((u) => u.id === id);
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

// ---------------------------------------------------------------------
// Phase 8 — Projects module
// ---------------------------------------------------------------------

export interface ProjectListEntry {
  project: Project;
  risk: ProjectRiskResult;
  client: Client | undefined;
}

/** Every project with its risk and client resolved (Phase 8 §1). */
export function getProjectsWithRisk(): ProjectListEntry[] {
  const { projects } = getDemoDataset();
  return projects.map((project) => ({
    project,
    risk: getProjectRisk(project.id),
    client: getClientById(project.clientId),
  }));
}

export type ProjectSortKey = "risk" | "dueDate" | "name" | "progress";

export interface ProjectListFilters {
  status?: ProjectStatus;
  clientId?: ID;
  risk?: RiskLevel;
  query?: string;
  sort?: ProjectSortKey;
}

/**
 * Filtered/sorted project list for /projects (Phase 8 §1-§2). URL
 * query-param parsing happens in the page component; the filtering
 * and sorting RULES live here, so they're never duplicated if a
 * second surface (e.g. a client's own project list) needs the same
 * filters later.
 */
export function getFilteredProjects(filters: ProjectListFilters = {}): ProjectListEntry[] {
  let entries = getProjectsWithRisk();

  if (filters.status) {
    entries = entries.filter((e) => e.project.status === filters.status);
  }
  if (filters.clientId) {
    entries = entries.filter((e) => e.project.clientId === filters.clientId);
  }
  if (filters.risk) {
    entries = entries.filter((e) => e.risk.level === filters.risk);
  }
  if (filters.query && filters.query.trim()) {
    const q = filters.query.trim().toLowerCase();
    entries = entries.filter((e) => e.project.name.toLowerCase().includes(q));
  }

  const sorted = [...entries];
  switch (filters.sort) {
    case "dueDate":
      sorted.sort((a, b) => {
        if (!a.project.dueDate) return 1;
        if (!b.project.dueDate) return -1;
        return a.project.dueDate < b.project.dueDate ? -1 : 1;
      });
      break;
    case "name":
      sorted.sort((a, b) => a.project.name.localeCompare(b.project.name));
      break;
    case "progress":
      sorted.sort((a, b) => b.project.progressPct - a.project.progressPct);
      break;
    case "risk":
    default:
      sorted.sort(
        (a, b) => RISK_LEVEL_RANK[a.risk.level] - RISK_LEVEL_RANK[b.risk.level],
      );
  }
  return sorted;
}

export interface ProjectTaskSummary {
  total: number;
  openCount: number;
  doneCount: number;
  overdueCount: number;
  byStatus: Record<Task["status"], number>;
}

/** Task counts for a project's Overview/Tasks tabs (Phase 8 §5/§7). */
export function getProjectTaskSummary(projectId: ID): ProjectTaskSummary {
  const tasks = getTasksForProject(projectId);
  const byStatus: Record<Task["status"], number> = {
    todo: 0,
    in_progress: 0,
    blocked: 0,
    review: 0,
    done: 0,
  };
  let overdueCount = 0;
  for (const task of tasks) {
    byStatus[task.status] += 1;
    if (
      task.status !== "done" &&
      task.dueDate !== undefined &&
      daysFromToday(task.dueDate) < 0
    ) {
      overdueCount += 1;
    }
  }
  return {
    total: tasks.length,
    openCount: tasks.length - byStatus.done,
    doneCount: byStatus.done,
    overdueCount,
    byStatus,
  };
}

export interface ProjectAssignedMemberEntry {
  member: TeamMember;
  /** Total tasks on this project assigned to the member (any status). */
  taskCount: number;
  /** PROJECT-SCOPED hours — open tasks on this project only. Never the
   *  member's global workload; pair with getTeamMemberWorkload and
   *  label that value "global" wherever both appear (Phase 8 §8). */
  assignedHours: number;
  fallbackTaskIds: ID[];
}

/**
 * Members with at least one task on this project, derived from task
 * assignments — not a separately authored project-team list (Phase 8
 * §8). Sorted by project-scoped assigned hours, most first.
 */
export function getProjectAssignedMembers(projectId: ID): ProjectAssignedMemberEntry[] {
  const tasks = getTasksForProject(projectId);
  const memberIds = new Set(
    tasks
      .map((t) => t.assigneeId)
      .filter((id): id is ID => id !== undefined),
  );

  const entries: ProjectAssignedMemberEntry[] = [];
  for (const memberId of memberIds) {
    const member = getTeamMemberById(memberId);
    if (!member) continue;
    const memberTasks = tasks.filter((t) => t.assigneeId === memberId);
    const openMemberTasks = memberTasks.filter((t) => t.status !== "done");
    const { hours, fallbackTaskIds } = sumAssignedHours(openMemberTasks);
    entries.push({
      member,
      taskCount: memberTasks.length,
      assignedHours: hours,
      fallbackTaskIds,
    });
  }
  return entries.sort((a, b) => b.assignedHours - a.assignedHours);
}

/** Chronological activity feed scoped to one project (Phase 8 §9), newest first. */
export function getProjectActivity(projectId: ID, limit?: number): Activity[] {
  const { activities } = getDemoDataset();
  const scoped = [...activities]
    .filter((a) => a.projectId === projectId)
    .sort((a, b) => (a.occurredAt < b.occurredAt ? 1 : -1));
  return limit !== undefined ? scoped.slice(0, limit) : scoped;
}
