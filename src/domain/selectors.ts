import type {
  Activity,
  ID,
  Client,
  ClientInteraction,
  ClientStatus,
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

// ---------------------------------------------------------------------
// Phase 9 — Tasks / Kanban module
// ---------------------------------------------------------------------

export function getTaskById(id: ID): Task | undefined {
  return getDemoDataset().tasks.find((t) => t.id === id);
}

const PRIORITY_RANK: Record<Task["priority"], number> = { high: 0, medium: 1, low: 2 };

export interface TaskListFilters {
  query?: string;
  projectId?: ID;
  assigneeId?: ID;
  status?: Task["status"];
  priority?: Task["priority"];
  /** Overdue per the same rule getOverdueTasks uses (open, past due, not on a completed/on_hold project). */
  overdueOnly?: boolean;
}

export type TaskSortKey = "dueDate" | "priority" | "created" | "project" | "assignee";

export interface TaskListEntry {
  task: Task;
  project: Project | undefined;
  assignee: TeamMember | undefined;
  isOverdue: boolean;
}

/**
 * Filtered/sorted task list for /tasks and the Kanban board (Phase 9
 * §1-§3). Reads the SAME Task records Project Tasks uses — this is
 * the one shared query both surfaces call, parameterized by
 * `projectId` when scoped to a single project. Filtering/sorting
 * rules live here, never duplicated in a component.
 */
export function getTasksFiltered(
  filters: TaskListFilters = {},
  sort: TaskSortKey = "dueDate",
): TaskListEntry[] {
  const { tasks } = getDemoDataset();
  const overdueIds = new Set(getOverdueTasks().map((t) => t.id));

  let list = tasks;
  if (filters.projectId) list = list.filter((t) => t.projectId === filters.projectId);
  if (filters.assigneeId) list = list.filter((t) => t.assigneeId === filters.assigneeId);
  if (filters.status) list = list.filter((t) => t.status === filters.status);
  if (filters.priority) list = list.filter((t) => t.priority === filters.priority);
  if (filters.overdueOnly) list = list.filter((t) => overdueIds.has(t.id));
  if (filters.query && filters.query.trim()) {
    const q = filters.query.trim().toLowerCase();
    list = list.filter((t) => t.title.toLowerCase().includes(q));
  }

  const entries: TaskListEntry[] = list.map((task) => ({
    task,
    project: getProjectById(task.projectId),
    assignee: task.assigneeId ? getTeamMemberById(task.assigneeId) : undefined,
    isOverdue: overdueIds.has(task.id),
  }));

  switch (sort) {
    case "priority":
      entries.sort((a, b) => PRIORITY_RANK[a.task.priority] - PRIORITY_RANK[b.task.priority]);
      break;
    case "created":
      entries.sort((a, b) => (a.task.createdAt < b.task.createdAt ? 1 : -1));
      break;
    case "project":
      entries.sort((a, b) => (a.project?.name ?? "").localeCompare(b.project?.name ?? ""));
      break;
    case "assignee":
      entries.sort((a, b) => (a.assignee?.name ?? "￿").localeCompare(b.assignee?.name ?? "￿"));
      break;
    case "dueDate":
    default:
      entries.sort((a, b) => {
        if (!a.task.dueDate) return 1;
        if (!b.task.dueDate) return -1;
        return a.task.dueDate < b.task.dueDate ? -1 : 1;
      });
  }

  return entries;
}

export interface TaskDetailEntry {
  task: Task;
  project: Project | undefined;
  client: Client | undefined;
  assignee: TeamMember | undefined;
}

/** Everything Task Detail needs, resolved once (Phase 9 §8). */
export function getTaskDetail(taskId: ID): TaskDetailEntry | undefined {
  const task = getTaskById(taskId);
  if (!task) return undefined;
  const project = getProjectById(task.projectId);
  return {
    task,
    project,
    client: project ? getClientById(project.clientId) : undefined,
    assignee: task.assigneeId ? getTeamMemberById(task.assigneeId) : undefined,
  };
}

// ---------------------------------------------------------------------
// Phase 10 — Clients / CRM module
// ---------------------------------------------------------------------

export interface ClientListEntry {
  client: Client;
  followUp: ClientFollowUpStatus;
  activeProjectCount: number;
  atRiskProjectCount: number;
}

export type ClientSortKey = "attention" | "name" | "lastInteraction" | "activeProjects";

export interface ClientListFilters {
  query?: string;
  status?: ClientStatus;
  followUpOnly?: boolean;
}

function toClientListEntry(client: Client, clientInteractions: ClientInteraction[]): ClientListEntry {
  const followUp = getClientFollowUpStatus(client, clientInteractions);
  const projects = getProjectsForClient(client.id);
  const activeProjectCount = projects.filter(
    (p) => p.status !== "completed" && p.status !== "on_hold",
  ).length;
  const atRiskProjectCount = projects.filter(
    (p) => getProjectRisk(p.id).level !== "none",
  ).length;
  return { client, followUp, activeProjectCount, atRiskProjectCount };
}

/**
 * Filtered/sorted client list for /clients (Phase 10 §1-§2). Default
 * sort ("attention"): clients needing follow-up first (most overdue
 * first), then active/retainer clients not needing follow-up (most
 * recently contacted first), then dormant clients last (by name) —
 * never plain alphabetical by default. Reuses the one shared
 * getClientFollowUpStatus computation; no date comparison happens
 * here or in any component.
 */
export function getClientsFiltered(
  filters: ClientListFilters = {},
  sort: ClientSortKey = "attention",
): ClientListEntry[] {
  const { clients, clientInteractions } = getDemoDataset();
  let list = clients;

  if (filters.status) list = list.filter((c) => c.status === filters.status);
  if (filters.query && filters.query.trim()) {
    const q = filters.query.trim().toLowerCase();
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.primaryContactName.toLowerCase().includes(q),
    );
  }

  let entries = list.map((c) => toClientListEntry(c, clientInteractions));

  if (filters.followUpOnly) {
    entries = entries.filter((e) => e.followUp.needsFollowUp);
  }

  switch (sort) {
    case "name":
      entries.sort((a, b) => a.client.name.localeCompare(b.client.name));
      break;
    case "lastInteraction":
      entries.sort(
        (a, b) =>
          (b.followUp.daysSinceLastInteraction ?? -1) -
          (a.followUp.daysSinceLastInteraction ?? -1),
      );
      break;
    case "activeProjects":
      entries.sort((a, b) => b.activeProjectCount - a.activeProjectCount);
      break;
    case "attention":
    default:
      entries.sort((a, b) => {
        const rank = (e: ClientListEntry) =>
          e.followUp.needsFollowUp ? 0 : e.client.status === "dormant" ? 2 : 1;
        const rankDiff = rank(a) - rank(b);
        if (rankDiff !== 0) return rankDiff;
        if (a.followUp.needsFollowUp) {
          return (
            (b.followUp.daysSinceLastInteraction ?? 0) -
            (a.followUp.daysSinceLastInteraction ?? 0)
          );
        }
        if (a.client.status !== "dormant") {
          return (
            (a.followUp.daysSinceLastInteraction ?? 0) -
            (b.followUp.daysSinceLastInteraction ?? 0)
          );
        }
        return a.client.name.localeCompare(b.client.name);
      });
  }

  return entries;
}

export interface ClientDetailEntry {
  client: Client;
  followUp: ClientFollowUpStatus;
}

/** Everything the Client Detail header needs, resolved once (Phase 10 §4). */
export function getClientDetail(clientId: ID): ClientDetailEntry | undefined {
  const client = getClientById(clientId);
  if (!client) return undefined;
  const { clientInteractions } = getDemoDataset();
  return { client, followUp: getClientFollowUpStatus(client, clientInteractions) };
}

export interface ClientProjectEntry {
  project: Project;
  risk: ProjectRiskResult;
}

/** Projects linked to a client, with risk resolved via the one shared computation (Phase 10 §6). */
export function getClientProjectsWithRisk(clientId: ID): ClientProjectEntry[] {
  return getProjectsForClient(clientId).map((project) => ({
    project,
    risk: getProjectRisk(project.id),
  }));
}

/** Chronological interaction history for a client, newest first (Phase 10 §7). */
export function getClientInteractionHistory(clientId: ID): ClientInteraction[] {
  return [...getClientInteractions(clientId)].sort((a, b) =>
    a.occurredAt < b.occurredAt ? 1 : -1,
  );
}
