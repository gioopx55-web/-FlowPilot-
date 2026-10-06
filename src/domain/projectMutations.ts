import type { ID, Project, ProjectStatus } from "@/types/entities";
import { DEMO_TODAY_ISO } from "@/lib/demo-clock";
import { WORKSPACE_ID } from "@/data/mock/workspace";

/**
 * Project create/edit — Phase 21.1 §1 (release blocker: "Project
 * creation/editing is declared P0 but absent"). Same D-039 demo-state
 * pattern as domain/taskMutations.ts and domain/clientMutations.ts: a
 * server-side, in-memory, process-lifetime store, never localStorage,
 * base fixture array never mutated.
 *
 * Two pieces of state, mirroring clientMutations.ts's
 * addedInteractions/clientOverrides split:
 * - `addedProjects`: brand-new Project records created via "New Project."
 * - `projectOverrides`: edits to an existing project's own fields.
 *
 * data/mock/index.ts merges both into the base dataset on every
 * getDemoDataset() call, so every selector (getFilteredProjects,
 * getAtRiskProjectsSorted, getClientProjectsWithRisk, the AI
 * Assistant's project lookups, Analytics' status/risk distributions)
 * picks up a created/edited project automatically — no second read
 * path, no duplicated risk/progress logic.
 */

const PROJECT_STATUSES: ProjectStatus[] = [
  "kickoff",
  "in_progress",
  "review",
  "completed",
  "on_hold",
];

let addedProjects: Project[] = [];
let projectCounter = 0;

const projectOverrides = new Map<
  ID,
  Partial<Pick<Project, "name" | "clientId" | "status" | "progressPct" | "startDate" | "dueDate" | "completedAt">>
>();

export function getAddedProjects(): Project[] {
  return addedProjects;
}

export function applyProjectOverride(project: Project): Project {
  const override = projectOverrides.get(project.id);
  return override ? { ...project, ...override } : project;
}

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

/**
 * Validates fields shared by create and edit. Runtime validation
 * (Phase 21.1 §5/D-095) — a malformed value must fail safely here,
 * not merely be caught by a TypeScript type that a Server Action's
 * untyped network boundary doesn't actually enforce at runtime.
 *
 * `clientId` existence is intentionally NOT checked here: this file
 * must stay free of `domain/selectors.ts` (which reads back through
 * `data/mock/index.ts`, which imports this file to layer project
 * overrides — importing selectors here would be a circular import).
 * The Server Action layer (`lib/projectActions.ts`) resolves and
 * validates the client via `getClientById` before calling into this
 * file, exactly like `lib/taskActions.ts` resolves a task via
 * `getTaskById` before calling `taskMutations.ts`.
 */
function validateEditableFields(fields: ProjectEditableFields): string | undefined {
  if (fields.name !== undefined && !fields.name.trim()) {
    return "Project name is required.";
  }
  if (fields.name !== undefined && fields.name.trim().length > 120) {
    return "Project name must be 120 characters or fewer.";
  }
  if (fields.status !== undefined && !PROJECT_STATUSES.includes(fields.status)) {
    return "Select a valid status.";
  }
  if (
    fields.progressPct !== undefined &&
    (!Number.isFinite(fields.progressPct) ||
      fields.progressPct < 0 ||
      fields.progressPct > 100)
  ) {
    return "Progress must be a number between 0 and 100.";
  }
  if (fields.startDate !== undefined && Number.isNaN(Date.parse(fields.startDate))) {
    return "Start date is invalid.";
  }
  if (
    fields.dueDate !== undefined &&
    fields.dueDate !== null &&
    Number.isNaN(Date.parse(fields.dueDate))
  ) {
    return "Due date is invalid.";
  }
  if (
    fields.startDate !== undefined &&
    fields.dueDate !== undefined &&
    fields.dueDate !== null &&
    Date.parse(fields.dueDate) < Date.parse(fields.startDate)
  ) {
    return "Due date cannot be before the start date.";
  }
  return undefined;
}

/**
 * Creates a new Project. Only fields actually modeled on the Project
 * entity are accepted (no invented `priority`/`description` — those
 * are not modeled on Project per `types/entities.ts`). `completedAt`
 * is never settable at creation — the completed/on_hold-exclusion and
 * completedAt-requires-status-completed invariants (domain/
 * validation.ts, D-042) stay enforced by never exposing a path that
 * could violate them.
 */
export function createProject(fields: {
  name: string;
  clientId: string;
  status: ProjectStatus;
  progressPct: number;
  startDate: string;
  dueDate?: string | null;
}): ProjectMutationResult {
  const error = validateEditableFields(fields);
  if (error) return { ok: false, error };
  if (fields.status === "completed") {
    return { ok: false, error: "A new project cannot start as Completed." };
  }

  projectCounter += 1;
  const id = `proj_added_${projectCounter}`;
  const project: Project = {
    id,
    workspaceId: WORKSPACE_ID,
    clientId: fields.clientId,
    name: fields.name.trim(),
    status: fields.status,
    progressPct: Math.round(fields.progressPct),
    startDate: fields.startDate,
    dueDate: fields.dueDate ?? undefined,
    createdAt: DEMO_TODAY_ISO,
  };
  addedProjects = [...addedProjects, project];
  return { ok: true, projectId: id };
}

/**
 * Edits an existing project's own fields. Status transitions to/from
 * "completed" manage `completedAt` automatically (mirrors
 * taskMutations.ts's setTaskStatus pattern) so the completedAt
 * invariant can never be violated through this path.
 */
export function updateProjectFields(
  projectId: ID,
  currentStatus: ProjectStatus,
  edits: ProjectEditableFields,
): ProjectMutationResult {
  const error = validateEditableFields(edits);
  if (error) return { ok: false, error };

  const patch: Partial<Project> = {};
  if (edits.name !== undefined) patch.name = edits.name.trim();
  if (edits.clientId !== undefined) patch.clientId = edits.clientId;
  if (edits.progressPct !== undefined) patch.progressPct = Math.round(edits.progressPct);
  if (edits.startDate !== undefined) patch.startDate = edits.startDate;
  if (edits.dueDate !== undefined) patch.dueDate = edits.dueDate ?? undefined;

  if (edits.status !== undefined) {
    patch.status = edits.status;
    if (edits.status === "completed" && currentStatus !== "completed") {
      patch.completedAt = DEMO_TODAY_ISO;
    } else if (edits.status !== "completed" && currentStatus === "completed") {
      patch.completedAt = undefined;
    }
  }

  projectOverrides.set(projectId, { ...projectOverrides.get(projectId), ...patch });
  return { ok: true, projectId };
}

/** Clears every created project and field override — part of the shared "reset to demo data" capability. */
export function resetProjectOverrides(): void {
  projectOverrides.clear();
  addedProjects = [];
}
