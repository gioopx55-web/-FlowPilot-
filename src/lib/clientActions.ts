"use server";

import { revalidatePath } from "next/cache";
import type { ID, InteractionType } from "@/types/entities";
import {
  addClientInteraction,
  updateClientFields,
  type ClientEditableFields,
  type ClientMutationResult,
} from "@/domain/clientMutations";
import { requireDemoSession } from "@/lib/demoSession";

/**
 * Next.js Server Action glue (thin — real logic stays in
 * domain/clientMutations.ts). Same revalidatePath("/", "layout")
 * pattern as lib/taskActions.ts: Dashboard's Clients Needing
 * Follow-Up, the Clients list, and Client Detail all re-render with
 * fresh data on next visit after any mutation here — no manual
 * per-view patching (Phase 10 §8/§12).
 */

function revalidateEverything() {
  revalidatePath("/", "layout");
}

export async function addClientInteractionAction(
  clientId: ID,
  type: InteractionType,
  summary: string,
  createdByUserId: ID,
): Promise<ClientMutationResult> {
  await requireDemoSession();
  const result = addClientInteraction(clientId, type, summary, createdByUserId);
  if (result.ok) revalidateEverything();
  return result;
}

export async function updateClientFieldsAction(
  clientId: ID,
  edits: ClientEditableFields,
): Promise<ClientMutationResult> {
  await requireDemoSession();
  const result = updateClientFields(clientId, edits);
  if (result.ok) revalidateEverything();
  return result;
}
