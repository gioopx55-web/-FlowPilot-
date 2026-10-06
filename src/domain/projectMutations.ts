import type { ID, Project, ProjectStatus } from "@/types/entities";
import { DEMO_TODAY_ISO } from "@/lib/demo-clock";
import { WORKSPACE_ID } from "@/data/mock/workspace";
import { clients } from "@/data/mock/clients";
import { getDemoStore, type ProjectOverride } from "@/domain/demoStore";
import {
  hasOnlyKeys,
  isBoundedString,
  isDateOnly,
  isEnumValue,
  isFiniteNumberInRange,
  isRecord,
} from "@/domain/runtimeValidation";

const PROJECT_STATUSES = ["kickoff", "in_progress", "review", "completed", "on_hold"] as const;
const PROJECT_EDITABLE_KEYS = [
  "name",
  "clientId",
  "status",
  "progressPct",
  "startDate",
  "dueDate",
] as const;

export interface ProjectMutationResult {
  ok: boolean;
  error?: string;
  projectId?: ID;
}

export interface ProjectEditableFields {
  name?: string;
  clientId?: string;
  status?: ProjectStatus;
  progressPct?: number;
  startDate?: string;
  dueDate?: string | null;
}

export interface ProjectCreateFields {
  name: string;
  clientId: string;
  status: ProjectStatus;
  progressPct: number;
  startDate: string;
  dueDate?: string | null;
}

export function getAddedProjects(): Project[] {
  return getDemoStore().addedProjects;
}

export function applyProjectOverride(project: Project): Project {
  const override = getDemoStore().projectOverrides.get(project.id);
  return override ? { ...project, ...override } : project;
}

function validateEditableFields(fields: unknown): string | undefined {
  if (!isRecord(fields) || !hasOnlyKeys(fields, PROJECT_EDITABLE_KEYS)) {
    return "Project changes contain unsupported fields.";
  }
  if (fields.name !== undefined && !isBoundedString(fields.name, 1, 120)) {
    return "Project name must be between 1 and 120 characters.";
  }
  if (
    fields.clientId !== undefined &&
    (typeof fields.clientId !== "string" || !clients.some((client) => client.id === fields.clientId))
  ) {
    return "Select a valid client.";
  }
  if (fields.status !== undefined && !isEnumValue(fields.status, PROJECT_STATUSES)) {
    return "Select a valid status.";
  }
  if (
    fields.progressPct !== undefined &&
    !isFiniteNumberInRange(fields.progressPct, 0, 100)
  ) {
    return "Progress must be a number between 0 and 100.";
  }
  if (fields.startDate !== undefined && !isDateOnly(fields.startDate)) {
    return "Start date is invalid.";
  }
  if (fields.dueDate !== undefined && fields.dueDate !== null && !isDateOnly(fields.dueDate)) {
    return "Due date is invalid.";
  }
  return undefined;
}

export function createProject(fields: ProjectCreateFields): ProjectMutationResult {
  const error = validateEditableFields(fields);
  if (error) return { ok: false, error };
  if (
    !isRecord(fields) ||
    fields.name === undefined ||
    fields.clientId === undefined ||
    fields.status === undefined ||
    fields.progressPct === undefined ||
    fields.startDate === undefined
  ) {
    return { ok: false, error: "Complete all required project fields." };
  }
  if (fields.status === "completed") {
    return { ok: false, error: "A new project cannot start as Completed." };
  }
  if (
    fields.dueDate !== undefined &&
    fields.dueDate !== null &&
    Date.parse(fields.dueDate) < Date.parse(fields.startDate)
  ) {
    return { ok: false, error: "Due date cannot be before the start date." };
  }

  const store = getDemoStore();
  store.projectCounter += 1;
  const id = `proj_added_${store.projectCounter}`;
  store.addedProjects.push({
    id,
    workspaceId: WORKSPACE_ID,
    clientId: fields.clientId,
    name: fields.name.trim(),
    status: fields.status,
    progressPct: Math.round(fields.progressPct),
    startDate: fields.startDate,
    dueDate: fields.dueDate ?? undefined,
    createdAt: DEMO_TODAY_ISO,
  });
  return { ok: true, projectId: id };
}

export function updateProjectFields(
  currentProject: Project,
  edits: ProjectEditableFields,
): ProjectMutationResult {
  const error = validateEditableFields(edits);
  if (error) return { ok: false, error };

  const nextStartDate = typeof edits.startDate === "string" ? edits.startDate : currentProject.startDate;
  const nextDueDate = edits.dueDate === null ? undefined : edits.dueDate ?? currentProject.dueDate;
  if (nextDueDate && Date.parse(nextDueDate) < Date.parse(nextStartDate)) {
    return { ok: false, error: "Due date cannot be before the start date." };
  }

  const patch: ProjectOverride = {};
  if (edits.name !== undefined) patch.name = edits.name.trim();
  if (edits.clientId !== undefined) patch.clientId = edits.clientId;
  if (edits.progressPct !== undefined) patch.progressPct = Math.round(edits.progressPct);
  if (edits.startDate !== undefined) patch.startDate = edits.startDate;
  if (edits.dueDate !== undefined) patch.dueDate = edits.dueDate ?? undefined;
  if (edits.status !== undefined) {
    patch.status = edits.status;
    if (edits.status === "completed" && currentProject.status !== "completed") {
      patch.completedAt = DEMO_TODAY_ISO;
    } else if (edits.status !== "completed" && currentProject.status === "completed") {
      patch.completedAt = undefined;
    }
  }

  const overrides = getDemoStore().projectOverrides;
  overrides.set(currentProject.id, { ...overrides.get(currentProject.id), ...patch });
  return { ok: true, projectId: currentProject.id };
}

export function resetProjectOverrides(): void {
  const store = getDemoStore();
  store.projectOverrides.clear();
  store.addedProjects.length = 0;
  store.projectCounter = 0;
}
