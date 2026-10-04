import type { ID, Client, Project, Task, TeamMember } from "@/types/entities";
import { getDemoDataset } from "@/data/mock";
import { computeProjectRisk, type ProjectRiskResult } from "@/domain/risk/risk";
import {
  computeTeamMemberWorkload,
  type TeamMemberWorkloadResult,
} from "@/domain/workload/workload";
import { getClientFollowUpStatus } from "@/domain/clients/followUp";
import { daysFromToday } from "@/lib/demo-clock";

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

export function getOverdueTasks(): Task[] {
  return getDemoDataset().tasks.filter(
    (t) => t.status !== "done" && t.dueDate !== undefined && daysFromToday(t.dueDate) < 0,
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
