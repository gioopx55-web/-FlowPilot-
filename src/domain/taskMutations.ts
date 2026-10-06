import type { ID, Task, TaskPriority, TaskStatus } from "@/types/entities";
import { DEMO_TODAY_ISO } from "@/lib/demo-clock";
import { teamMembers } from "@/data/mock/team-members";
import { getDemoStore, type TaskOverride } from "@/domain/demoStore";
import {
  hasOnlyKeys,
  isBoolean,
  isDateOnly,
  isEnumValue,
  isFiniteNumberInRange,
  isOptionalNullableBoundedString,
  isIsoTimestamp,
  isRecord,
} from "@/domain/runtimeValidation";

const TASK_STATUSES = ["todo", "in_progress", "blocked", "review", "done"] as const;
const TASK_PRIORITIES = ["low", "medium", "high"] as const;
const TASK_EDITABLE_KEYS = [
  "priority",
  "assigneeId",
  "dueDate",
  "estimatedHours",
  "description",
] as const;

export interface TaskMutationResult {
  ok: boolean;
  error?: string;
}

export interface TaskEditableFields {
  priority?: TaskPriority;
  assigneeId?: ID | null;
  dueDate?: string | null;
  estimatedHours?: number | null;
  description?: string | null;
}

export function applyTaskOverride(task: Task): Task {
  const override = getDemoStore().taskOverrides.get(task.id);
  return override ? { ...task, ...override } : task;
}

function recordOverride(taskId: ID, patch: TaskOverride): void {
  const overrides = getDemoStore().taskOverrides;
  overrides.set(taskId, { ...overrides.get(taskId), ...patch });
}

export function setTaskStatus(currentTask: Task, status: TaskStatus): TaskMutationResult {
  if (!isEnumValue(status, TASK_STATUSES)) {
    return { ok: false, error: "Select a valid task status." };
  }
  const patch: TaskOverride = { status };
  if (status === "done") patch.completedAt = DEMO_TODAY_ISO;
  else if (currentTask.status === "done") patch.completedAt = undefined;
  recordOverride(currentTask.id, patch);
  return { ok: true };
}

export function setTaskBlocker(
  currentTask: Task,
  hasActiveBlocker: boolean,
): TaskMutationResult {
  if (!isBoolean(hasActiveBlocker)) {
    return { ok: false, error: "Blocker state must be true or false." };
  }
  recordOverride(currentTask.id, {
    hasActiveBlocker,
    blockerStartedAt: hasActiveBlocker ? DEMO_TODAY_ISO : undefined,
  });
  return { ok: true };
}

export function updateTaskFields(
  currentTask: Task,
  edits: TaskEditableFields,
): TaskMutationResult {
  if (!isRecord(edits) || !hasOnlyKeys(edits, TASK_EDITABLE_KEYS)) {
    return { ok: false, error: "Task changes contain unsupported fields." };
  }
  if (edits.priority !== undefined && !isEnumValue(edits.priority, TASK_PRIORITIES)) {
    return { ok: false, error: "Select a valid priority." };
  }
  if (
    edits.assigneeId !== undefined &&
    edits.assigneeId !== null &&
    (typeof edits.assigneeId !== "string" || !teamMembers.some((m) => m.id === edits.assigneeId))
  ) {
    return { ok: false, error: "Select a valid assignee." };
  }
  if (
    edits.dueDate !== undefined &&
    edits.dueDate !== null &&
    !isDateOnly(edits.dueDate) &&
    !isIsoTimestamp(edits.dueDate)
  ) {
    return { ok: false, error: "Due date is invalid." };
  }
  if (
    edits.estimatedHours !== undefined &&
    edits.estimatedHours !== null &&
    !isFiniteNumberInRange(edits.estimatedHours, 0, 1000)
  ) {
    return { ok: false, error: "Estimated hours must be between 0 and 1,000." };
  }
  if (!isOptionalNullableBoundedString(edits.description, 2000)) {
    return { ok: false, error: "Description must be 2,000 characters or fewer." };
  }

  const patch: TaskOverride = {};
  if (edits.priority !== undefined) patch.priority = edits.priority;
  if (edits.assigneeId !== undefined) patch.assigneeId = edits.assigneeId ?? undefined;
  if (edits.dueDate !== undefined) patch.dueDate = edits.dueDate ?? undefined;
  if (edits.estimatedHours !== undefined) patch.estimatedHours = edits.estimatedHours ?? undefined;
  if (edits.description !== undefined) {
    patch.description = edits.description === null ? undefined : edits.description.trim();
  }
  recordOverride(currentTask.id, patch);
  return { ok: true };
}

export function resetTaskOverrides(): void {
  getDemoStore().taskOverrides.clear();
}

export function getOverrideCount(): number {
  return getDemoStore().taskOverrides.size;
}
