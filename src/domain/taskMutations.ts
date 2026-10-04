import type { ID, Task, TaskPriority, TaskStatus } from "@/types/entities";
import { DEMO_TODAY_ISO } from "@/lib/demo-clock";

/**
 * V1 demo-state architecture (Phase 9, DECISIONS.md D-039).
 *
 * There is no backend. Edits (Kanban drag, Task Detail edits) are
 * applied as an in-memory "overrides" map, keyed by task ID, layered
 * on top of the Phase 6 base fixtures at read time by
 * `data/mock/index.ts`. This is a SERVER-SIDE, process-lifetime store
 * (module-level state in the Node process running `next dev`/`next
 * start`) — not localStorage, not a per-browser store. Every Server
 * Component re-reads `getDemoDataset()` on each render, so every page
 * (Dashboard, Projects, Tasks, Kanban) stays consistent automatically
 * with zero client-side merging logic. It resets when the server
 * process restarts, and (since this demo has no real auth/tenancy) is
 * shared across every browser tab hitting this server — both
 * explicitly acceptable and documented tradeoffs for a V1 demo, never
 * presented as real persistence. `resetTaskOverrides()` provides the
 * "reset to demo data" capability.
 *
 * The BASE fixture arrays (data/mock/tasks.ts etc.) are never
 * mutated — only this separate overrides map is written to.
 */

type TaskOverride = Partial<
  Pick<
    Task,
    | "status"
    | "priority"
    | "assigneeId"
    | "dueDate"
    | "estimatedHours"
    | "hasActiveBlocker"
    | "blockerStartedAt"
    | "completedAt"
    | "description"
  >
>;

const overrides = new Map<ID, TaskOverride>();

/** Applies any recorded override on top of a base task (read path). */
export function applyTaskOverride(task: Task): Task {
  const override = overrides.get(task.id);
  return override ? { ...task, ...override } : task;
}

export interface TaskMutationResult {
  ok: boolean;
  error?: string;
}

function recordOverride(taskId: ID, patch: TaskOverride): void {
  overrides.set(taskId, { ...overrides.get(taskId), ...patch });
}

/**
 * Status transition — the one path Kanban drag-and-drop and the
 * accessible "Change status" control both use. `completedAt` is
 * derived automatically (set on transition to "done", cleared
 * otherwise) rather than exposed as a directly editable field, so the
 * completedAt/status impossible-state rule (domain/validation.ts)
 * can never be violated by this path.
 */
export function setTaskStatus(
  currentTask: Task,
  status: TaskStatus,
): TaskMutationResult {
  const patch: TaskOverride = { status };
  if (status === "done") {
    patch.completedAt = DEMO_TODAY_ISO;
  } else if (currentTask.status === "done") {
    patch.completedAt = undefined;
  }
  recordOverride(currentTask.id, patch);
  return { ok: true };
}

/**
 * The active-blocker flag, decoupled from `status` (D-023) —
 * `blockerStartedAt` is managed automatically so the
 * hasActiveBlocker/blockerStartedAt pairing rule can never be
 * violated by this path either.
 */
export function setTaskBlocker(
  currentTask: Task,
  hasActiveBlocker: boolean,
): TaskMutationResult {
  recordOverride(currentTask.id, {
    hasActiveBlocker,
    blockerStartedAt: hasActiveBlocker ? DEMO_TODAY_ISO : undefined,
  });
  return { ok: true };
}

export interface TaskEditableFields {
  priority?: TaskPriority;
  assigneeId?: ID | null;
  dueDate?: string | null;
  estimatedHours?: number | null;
  description?: string | null;
}

/**
 * General field edits from Task Detail (priority/assignee/due
 * date/estimated hours/description). `null` clears a field (e.g. "no
 * due date"); `undefined` (the key simply absent) leaves it
 * unchanged. Rejects an invalid estimatedHours rather than silently
 * accepting bad data.
 */
export function updateTaskFields(
  currentTask: Task,
  edits: TaskEditableFields,
): TaskMutationResult {
  if (
    edits.estimatedHours !== undefined &&
    edits.estimatedHours !== null &&
    edits.estimatedHours < 0
  ) {
    return { ok: false, error: "Estimated hours cannot be negative." };
  }

  const patch: TaskOverride = {};
  if (edits.priority !== undefined) patch.priority = edits.priority;
  if (edits.assigneeId !== undefined) {
    patch.assigneeId = edits.assigneeId === null ? undefined : edits.assigneeId;
  }
  if (edits.dueDate !== undefined) {
    patch.dueDate = edits.dueDate === null ? undefined : edits.dueDate;
  }
  if (edits.estimatedHours !== undefined) {
    patch.estimatedHours = edits.estimatedHours === null ? undefined : edits.estimatedHours;
  }
  if (edits.description !== undefined) {
    patch.description = edits.description === null ? undefined : edits.description;
  }

  recordOverride(currentTask.id, patch);
  return { ok: true };
}

/** Clears every recorded override — the "reset to demo data" capability. */
export function resetTaskOverrides(): void {
  overrides.clear();
}

/** Test/debug visibility into how many tasks currently have an override applied. */
export function getOverrideCount(): number {
  return overrides.size;
}
