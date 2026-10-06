"use server";

import { revalidatePath } from "next/cache";
import type { ID } from "@/types/entities";
import { getProjectById } from "@/domain/selectors";
import {
  createProject,
  updateProjectFields,
  type ProjectCreateFields,
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

function revalidateEverything() {
  revalidatePath("/", "layout");
}

export async function createProjectAction(
  fields: ProjectCreateFields,
): Promise<ProjectMutationResult> {
  await requireDemoSession();
  const result = createProject(fields);
  if (result.ok) revalidateEverything();
  return result;
}

export async function updateProjectAction(
  projectId: ID,
  edits: ProjectEditableFields,
): Promise<ProjectMutationResult> {
  await requireDemoSession();
  const project = getProjectById(projectId);
  if (!project) return { ok: false, error: "Project not found." };
  const result = updateProjectFields(project, edits);
  if (result.ok) revalidateEverything();
  return result;
}
