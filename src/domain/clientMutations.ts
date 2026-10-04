import type { Client, ClientInteraction, ID, InteractionType } from "@/types/entities";
import { demoToday } from "@/lib/demo-clock";
import { WORKSPACE_ID } from "@/data/mock/workspace";

/**
 * Client-side of the D-039 demo-state architecture — same pattern as
 * domain/taskMutations.ts, extended for Phase 10: a server-side,
 * in-memory, process-lifetime store, never localStorage, base
 * fixture arrays never mutated. Two pieces of state:
 *
 * - `addedInteractions`: new ClientInteraction records appended by
 *   "Add interaction." Logging an interaction means only that
 *   FlowPilot recorded it — nothing is sent externally (Phase 10 §9).
 * - `clientOverrides`: edits to a client's own fields (contact name/
 *   email/status).
 *
 * data/mock/index.ts merges both into the base dataset on every
 * getDemoDataset() call, and re-runs withDerivedClientFields with the
 * FULL (base + added) interaction list so `lastInteractionAt` is
 * always correct — it is never set directly here.
 */

let addedInteractions: ClientInteraction[] = [];
let interactionCounter = 0;

const clientOverrides = new Map<
  ID,
  Partial<Pick<Client, "primaryContactName" | "primaryContactEmail" | "status">>
>();

export function getAddedInteractions(): ClientInteraction[] {
  return addedInteractions;
}

export function applyClientOverride(client: Client): Client {
  const override = clientOverrides.get(client.id);
  return override ? { ...client, ...override } : client;
}

export interface ClientMutationResult {
  ok: boolean;
  error?: string;
}

/**
 * Appends a new ClientInteraction (Phase 10 §8). `occurredAt`
 * defaults to the demo clock's "now" — never the real system clock,
 * consistent with every other demo-date calculation in this codebase.
 */
export function addClientInteraction(
  clientId: ID,
  type: InteractionType,
  summary: string,
  createdByUserId: ID,
  occurredAt?: string,
): ClientMutationResult {
  if (!summary.trim()) {
    return { ok: false, error: "Summary is required." };
  }
  interactionCounter += 1;
  const interaction: ClientInteraction = {
    id: `ci_added_${interactionCounter}`,
    workspaceId: WORKSPACE_ID,
    clientId,
    type,
    summary: summary.trim(),
    occurredAt: occurredAt ?? demoToday().toISOString(),
    createdByUserId,
  };
  addedInteractions = [...addedInteractions, interaction];
  return { ok: true };
}

export interface ClientEditableFields {
  primaryContactName?: string;
  primaryContactEmail?: string | null;
  status?: Client["status"];
}

export function updateClientFields(
  clientId: ID,
  edits: ClientEditableFields,
): ClientMutationResult {
  if (edits.primaryContactName !== undefined && !edits.primaryContactName.trim()) {
    return { ok: false, error: "Primary contact name cannot be empty." };
  }
  const patch: Partial<Client> = {};
  if (edits.primaryContactName !== undefined) patch.primaryContactName = edits.primaryContactName;
  if (edits.primaryContactEmail !== undefined) {
    patch.primaryContactEmail = edits.primaryContactEmail ?? undefined;
  }
  if (edits.status !== undefined) patch.status = edits.status;

  clientOverrides.set(clientId, { ...clientOverrides.get(clientId), ...patch });
  return { ok: true };
}

/** Clears client-field overrides and added interactions — part of the shared "reset to demo data" capability. */
export function resetClientOverrides(): void {
  clientOverrides.clear();
  addedInteractions = [];
}
