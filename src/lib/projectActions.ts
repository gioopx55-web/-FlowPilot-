"use server";

import { revalidatePath } from "next/cache";
import type { ID, ProjectStatus } from "@/types/entities";
import { getProjectById, getClientById } from "@/domain/selectors";
import {
  createProject,
  updateProjectFields,
  type ProjectEditableFields,
  type ProjectMutationResult,
} from "@/domain/projectMutations";
import { requireDemoSession } from "@/lib/demoSession";

/**
 * Next.js Server Action glue (thin — real logic stays in
 * domain/projectMutations.ts), same shape as lib/taskActions.ts/
 * lib/clientActions.ts. Phase 21.1 §1 — the release blocker this
 * closes ("Project creation/editing is declared P0 but absent").
 */

const NO_SESSION_RESULT: ProjectMutationResult = {
  ok: false,
  error: "Your demo session has ended. Sign in again to make changes.",
};

function revalidateEverything() {
  revalidatePath("/", "layout");
}

export async function createProjectAction(fields: {
  name: string;
  clientId: string;
  status: ProjectStatus;
  progressPct: number;
  startDate: string;
  dueDate?: string | null;
}): Promise<ProjectMutationResult> {
  if (!(await requireDemoSession())) return NO_SESSION_RESULT;
  if (!getClientById(fields.clientId)) {
    return { ok: false, error: "Select a valid client." };
  }
  const result = createProject(fields);
  if (result.ok) revalidateEverything();
  return result;
}

export async function updateProjectAction(
  projectId: ID,
  edits: ProjectEditableFields,
): Promise<ProjectMutationResult> {
  if (!(await requireDemoSession())) return NO_SESSION_RESULT;
  const project = getProjectById(projectId);
  if (!project) return { ok: false, error: "Project not found." };
  if (edits.clientId !== undefined && !getClientById(edits.clientId)) {
    return { ok: false, error: "Select a valid client." };
  }
  const result = updateProjectFields(projectId, project.status, edits);
  if (result.ok) revalidateEverything();
  return result;
}
