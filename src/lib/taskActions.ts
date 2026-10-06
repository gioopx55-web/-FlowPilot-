"use server";

import { revalidatePath } from "next/cache";
import type { ID, TaskStatus } from "@/types/entities";
import { getTaskById } from "@/domain/selectors";
import {
  setTaskStatus,
  setTaskBlocker,
  updateTaskFields,
  type TaskEditableFields,
  type TaskMutationResult,
} from "@/domain/taskMutations";
import { resetDemoStore } from "@/domain/demoStore";
import { requireDemoSession } from "@/lib/demoSession";

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
  await requireDemoSession();
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
  await requireDemoSession();
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
  await requireDemoSession();
  const task = getTaskById(taskId);
  if (!task) return { ok: false, error: "Task not found." };
  const result = updateTaskFields(task, edits);
  if (result.ok) revalidateEverything();
  return result;
}

/** Resets ALL demo-state overrides (tasks + client edits/added interactions + settings + projects + notification read-state). */
export async function resetDemoDataAction(): Promise<TaskMutationResult> {
  await requireDemoSession();
  resetDemoStore();
  revalidateEverything();
  return { ok: true };
}
