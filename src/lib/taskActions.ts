"use server";

import { revalidatePath } from "next/cache";
import type { ID, TaskStatus } from "@/types/entities";
import { getTaskById } from "@/domain/selectors";
import {
  setTaskStatus,
  setTaskBlocker,
  updateTaskFields,
  resetTaskOverrides,
  type TaskEditableFields,
  type TaskMutationResult,
} from "@/domain/taskMutations";
import { resetClientOverrides } from "@/domain/clientMutations";
import { resetSettingsOverrides } from "@/domain/settingsMutations";
import { resetProjectOverrides } from "@/domain/projectMutations";
import { resetNotificationState } from "@/domain/notifications";
import { requireDemoSession } from "@/lib/demoSession";

const NO_SESSION_RESULT: TaskMutationResult = {
  ok: false,
  error: "Your demo session has ended. Sign in again to make changes.",
};

/**
 * Next.js Server Action glue (thin — all real logic lives in
 * domain/taskMutations.ts, which stays framework-agnostic and
 * testable). `revalidatePath("/", "layout")` after every mutation
 * tells Next.js every Server Component (Dashboard, Projects, Tasks,
 * Kanban, Project Detail) must re-render with fresh data on next
 * visit — this is what keeps "one source of truth" true across the
 * whole app without any client-side state syncing.
 */

function revalidateEverything() {
  revalidatePath("/", "layout");
}

export async function changeTaskStatusAction(
  taskId: ID,
  status: TaskStatus,
): Promise<TaskMutationResult> {
  if (!(await requireDemoSession())) return NO_SESSION_RESULT;
  const task = getTaskById(taskId);
  if (!task) return { ok: false, error: "Task not found." };
  const result = setTaskStatus(task, status);
  if (result.ok) revalidateEverything();
  return result;
}

export async function changeTaskBlockerAction(
  taskId: ID,
  hasActiveBlocker: boolean,
): Promise<TaskMutationResult> {
  if (!(await requireDemoSession())) return NO_SESSION_RESULT;
  const task = getTaskById(taskId);
  if (!task) return { ok: false, error: "Task not found." };
  const result = setTaskBlocker(task, hasActiveBlocker);
  if (result.ok) revalidateEverything();
  return result;
}

export async function updateTaskFieldsAction(
  taskId: ID,
  edits: TaskEditableFields,
): Promise<TaskMutationResult> {
  if (!(await requireDemoSession())) return NO_SESSION_RESULT;
  const task = getTaskById(taskId);
  if (!task) return { ok: false, error: "Task not found." };
  const result = updateTaskFields(task, edits);
  if (result.ok) revalidateEverything();
  return result;
}

/** Resets ALL demo-state overrides (tasks + client edits/added interactions + settings + projects + notification read-state). */
export async function resetDemoDataAction(): Promise<void> {
  if (!(await requireDemoSession())) return;
  resetTaskOverrides();
  resetClientOverrides();
  resetSettingsOverrides();
  resetProjectOverrides();
  resetNotificationState();
  revalidateEverything();
}
