import type {
  Activity,
  Client,
  ClientInteraction,
  Notification,
  Project,
  Task,
  TeamMember,
  User,
  Workspace,
} from "@/types/entities";
import { computeProjectRisk } from "@/domain/risk/risk";
import { computeTeamMemberWorkload } from "@/domain/workload/workload";
import { getClientFollowUpStatus } from "@/domain/clients/followUp";

export interface DemoDataset {
  workspace: Workspace;
  users: User[];
  teamMembers: TeamMember[];
  clients: Client[];
  clientInteractions: ClientInteraction[];
  projects: Project[];
  tasks: Task[];
  activities: Activity[];
  notifications: Notification[];
}

export interface ValidationResult {
  errors: string[];
}

function checkUniqueIds(
  label: string,
  items: { id: string }[],
  errors: string[],
): void {
  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.id)) {
      errors.push(`Duplicate ${label} id: "${item.id}"`);
    }
    seen.add(item.id);
  }
}

function checkWorkspaceOwnership(
  label: string,
  items: { id: string; workspaceId: string }[],
  workspaceId: string,
  errors: string[],
): void {
  for (const item of items) {
    if (item.workspaceId !== workspaceId) {
      errors.push(
        `${label} "${item.id}" has workspaceId "${item.workspaceId}", expected "${workspaceId}"`,
      );
    }
  }
}

/**
 * Checks the full demo dataset against every rule required by Phase 6:
 * referential integrity, unique IDs, workspace ownership, required
 * state coverage (risk/workload/follow-up), completed/on-hold
 * exclusion, fallback-hours behavior, and impossible field
 * combinations. Returns every problem found — never throws itself,
 * so a caller can decide whether to throw, log, or assert in a test.
 */
export function validateDemoDataset(dataset: DemoDataset): ValidationResult {
  const errors: string[] = [];
  const {
    workspace,
    users,
    teamMembers,
    clients,
    clientInteractions,
    projects,
    tasks,
    activities,
    notifications,
  } = dataset;

  // --- 2. Unique IDs ---
  checkUniqueIds("Workspace", [workspace], errors);
  checkUniqueIds("User", users, errors);
  checkUniqueIds("TeamMember", teamMembers, errors);
  checkUniqueIds("Client", clients, errors);
  checkUniqueIds("ClientInteraction", clientInteractions, errors);
  checkUniqueIds("Project", projects, errors);
  checkUniqueIds("Task", tasks, errors);
  checkUniqueIds("Activity", activities, errors);
  checkUniqueIds("Notification", notifications, errors);

  // --- 3. Workspace ownership consistency ---
  checkWorkspaceOwnership("User", users, workspace.id, errors);
  checkWorkspaceOwnership("TeamMember", teamMembers, workspace.id, errors);
  checkWorkspaceOwnership("Client", clients, workspace.id, errors);
  checkWorkspaceOwnership(
    "ClientInteraction",
    clientInteractions,
    workspace.id,
    errors,
  );
  checkWorkspaceOwnership("Project", projects, workspace.id, errors);
  checkWorkspaceOwnership("Task", tasks, workspace.id, errors);
  checkWorkspaceOwnership("Activity", activities, workspace.id, errors);
  checkWorkspaceOwnership("Notification", notifications, workspace.id, errors);

  // --- 1. Referential integrity ---
  const clientIds = new Set(clients.map((c) => c.id));
  const teamMemberIds = new Set(teamMembers.map((m) => m.id));
  const projectIds = new Set(projects.map((p) => p.id));
  const taskIds = new Set(tasks.map((t) => t.id));
  const userIds = new Set(users.map((u) => u.id));

  for (const project of projects) {
    if (!clientIds.has(project.clientId)) {
      errors.push(
        `Project "${project.id}" references missing clientId "${project.clientId}"`,
      );
    }
  }

  for (const task of tasks) {
    if (!projectIds.has(task.projectId)) {
      errors.push(
        `Task "${task.id}" references missing projectId "${task.projectId}"`,
      );
    }
    if (task.assigneeId !== undefined && !teamMemberIds.has(task.assigneeId)) {
      errors.push(
        `Task "${task.id}" references missing assigneeId "${task.assigneeId}"`,
      );
    }
  }

  for (const interaction of clientInteractions) {
    if (!clientIds.has(interaction.clientId)) {
      errors.push(
        `ClientInteraction "${interaction.id}" references missing clientId "${interaction.clientId}"`,
      );
    }
    if (!userIds.has(interaction.createdByUserId)) {
      errors.push(
        `ClientInteraction "${interaction.id}" references missing createdByUserId "${interaction.createdByUserId}"`,
      );
    }
  }

  for (const user of users) {
    if (user.teamMemberId !== undefined && !teamMemberIds.has(user.teamMemberId)) {
      errors.push(
        `User "${user.id}" references missing teamMemberId "${user.teamMemberId}"`,
      );
    }
  }

  for (const activity of activities) {
    if (!projectIds.has(activity.projectId)) {
      errors.push(
        `Activity "${activity.id}" references missing projectId "${activity.projectId}"`,
      );
    }
    if (activity.taskId !== undefined && !taskIds.has(activity.taskId)) {
      errors.push(
        `Activity "${activity.id}" references missing taskId "${activity.taskId}"`,
      );
    }
    if (activity.actorUserId !== undefined && !userIds.has(activity.actorUserId)) {
      errors.push(
        `Activity "${activity.id}" references missing actorUserId "${activity.actorUserId}"`,
      );
    }
  }

  const referenceSetByType: Record<Notification["referenceType"], Set<string>> = {
    task: taskIds,
    project: projectIds,
    client: clientIds,
  };
  for (const notification of notifications) {
    if (!userIds.has(notification.recipientUserId)) {
      errors.push(
        `Notification "${notification.id}" references missing recipientUserId "${notification.recipientUserId}"`,
      );
    }
    const validTypes: Notification["referenceType"][] = ["task", "project", "client"];
    if (!validTypes.includes(notification.referenceType)) {
      errors.push(
        `Notification "${notification.id}" has unsupported referenceType "${notification.referenceType}"`,
      );
    } else if (!referenceSetByType[notification.referenceType].has(notification.referenceId)) {
      errors.push(
        `Notification "${notification.id}" references missing ${notification.referenceType} "${notification.referenceId}"`,
      );
    }
  }

  // --- 10. No impossible field combinations ---
  for (const task of tasks) {
    if (task.completedAt !== undefined && task.status !== "done") {
      errors.push(
        `Task "${task.id}" has completedAt set but status is "${task.status}" (expected "done")`,
      );
    }
    if (task.status === "done" && task.completedAt === undefined) {
      errors.push(`Task "${task.id}" has status "done" but no completedAt`);
    }
    if (task.hasActiveBlocker && task.blockerStartedAt === undefined) {
      errors.push(
        `Task "${task.id}" has hasActiveBlocker=true but no blockerStartedAt`,
      );
    }
    if (!task.hasActiveBlocker && task.blockerStartedAt !== undefined) {
      errors.push(
        `Task "${task.id}" has blockerStartedAt set but hasActiveBlocker=false`,
      );
    }
    if (task.estimatedHours !== undefined && task.estimatedHours < 0) {
      errors.push(`Task "${task.id}" has negative estimatedHours`);
    }
  }

  for (const project of projects) {
    if (project.progressPct < 0 || project.progressPct > 100) {
      errors.push(
        `Project "${project.id}" has progressPct ${project.progressPct} outside 0-100`,
      );
    }
  }

  for (const member of teamMembers) {
    if (member.weeklyCapacityHours <= 0) {
      errors.push(
        `TeamMember "${member.id}" has non-positive weeklyCapacityHours (${member.weeklyCapacityHours})`,
      );
    }
  }

  // --- 5/8. Project risk state coverage + completed/on-hold exclusion ---
  const tasksByProject = new Map<string, Task[]>();
  for (const task of tasks) {
    const list = tasksByProject.get(task.projectId) ?? [];
    list.push(task);
    tasksByProject.set(task.projectId, list);
  }

  const riskLevelsSeen = new Set<string>();
  for (const project of projects) {
    const projectTasks = tasksByProject.get(project.id) ?? [];
    const { level } = computeProjectRisk(project, projectTasks);
    riskLevelsSeen.add(level);
    if (
      (project.status === "completed" || project.status === "on_hold") &&
      level !== "none"
    ) {
      errors.push(
        `Project "${project.id}" has status "${project.status}" but computeProjectRisk returned "${level}" (must be excluded, "none")`,
      );
    }
  }
  for (const required of ["none", "at_risk", "critical_risk"]) {
    if (!riskLevelsSeen.has(required)) {
      errors.push(
        `Required state coverage missing: no project computes to risk level "${required}"`,
      );
    }
  }
  if (!projects.some((p) => p.status === "completed")) {
    errors.push("Required state coverage missing: no completed project");
  }
  if (!projects.some((p) => p.status === "on_hold")) {
    errors.push("Required state coverage missing: no on_hold project");
  }

  // --- 6/9. Workload band coverage + fallback-hours behavior ---
  const bandsSeen = new Set<string>();
  let anyFallbackUsed = false;
  for (const member of teamMembers) {
    const { band, fallbackTaskIds } = computeTeamMemberWorkload(member, tasks);
    bandsSeen.add(band);
    if (fallbackTaskIds.length > 0) anyFallbackUsed = true;
  }
  for (const required of ["Available", "Healthy", "High", "Overloaded"]) {
    if (!bandsSeen.has(required)) {
      errors.push(
        `Required state coverage missing: no team member computes to workload band "${required}"`,
      );
    }
  }
  if (!anyFallbackUsed) {
    errors.push(
      "Required state coverage missing: no team member's workload used a fallback-hours task",
    );
  }
  const hasRealEstimateTask = tasks.some((t) => t.estimatedHours !== undefined);
  const hasFallbackTask = tasks.some((t) => t.estimatedHours === undefined);
  if (!hasRealEstimateTask) {
    errors.push("Required state coverage missing: no task has a real estimatedHours");
  }
  if (!hasFallbackTask) {
    errors.push("Required state coverage missing: no task omits estimatedHours (fallback)");
  }

  // --- 7. Client follow-up coverage ---
  let anyNeedsFollowUp = false;
  let anyDoesNotNeedFollowUp = false;
  let anyDormant = false;
  for (const client of clients) {
    if (client.status === "dormant") {
      anyDormant = true;
      continue;
    }
    const { needsFollowUp } = getClientFollowUpStatus(client, clientInteractions);
    if (needsFollowUp) anyNeedsFollowUp = true;
    else anyDoesNotNeedFollowUp = true;
  }
  if (!anyNeedsFollowUp) {
    errors.push("Required state coverage missing: no client needs follow-up");
  }
  if (!anyDoesNotNeedFollowUp) {
    errors.push("Required state coverage missing: no client that does NOT need follow-up");
  }
  if (!anyDormant) {
    errors.push("Required state coverage missing: no dormant client");
  }

  // --- task-level state coverage (overdue, due soon, blocked, high priority) ---
  if (!tasks.some((t) => t.status === "blocked")) {
    errors.push("Required state coverage missing: no task with status \"blocked\"");
  }
  if (!tasks.some((t) => t.hasActiveBlocker)) {
    errors.push("Required state coverage missing: no task with hasActiveBlocker=true");
  }
  if (!tasks.some((t) => t.priority === "high")) {
    errors.push("Required state coverage missing: no high-priority task");
  }
  if (!tasks.some((t) => t.status === "done")) {
    errors.push("Required state coverage missing: no completed task");
  }

  return { errors };
}
