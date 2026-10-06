import type { Client, ClientInteraction, ID, InteractionType } from "@/types/entities";
import { demoToday } from "@/lib/demo-clock";
import { WORKSPACE_ID } from "@/data/mock/workspace";
import { clients } from "@/data/mock/clients";
import { users } from "@/data/mock/users";
import { getDemoStore, type ClientOverride } from "@/domain/demoStore";
import {
  hasOnlyKeys,
  isBoundedString,
  isEmail,
  isEnumValue,
  isIsoTimestamp,
  isRecord,
} from "@/domain/runtimeValidation";

const INTERACTION_TYPES = ["call", "email", "meeting", "update_sent", "note"] as const;
const CLIENT_STATUSES = ["active", "retainer", "dormant"] as const;
const CLIENT_EDITABLE_KEYS = ["primaryContactName", "primaryContactEmail", "status"] as const;

export interface ClientMutationResult {
  ok: boolean;
  error?: string;
}

export interface ClientEditableFields {
  primaryContactName?: string;
  primaryContactEmail?: string | null;
  status?: Client["status"];
}

export function getAddedInteractions(): ClientInteraction[] {
  return getDemoStore().addedInteractions;
}

export function applyClientOverride(client: Client): Client {
  const override = getDemoStore().clientOverrides.get(client.id);
  return override ? { ...client, ...override } : client;
}

export function addClientInteraction(
  clientId: ID,
  type: InteractionType,
  summary: string,
  createdByUserId: ID,
  occurredAt?: string,
): ClientMutationResult {
  if (typeof clientId !== "string" || !clients.some((client) => client.id === clientId)) {
    return { ok: false, error: "Client not found." };
  }
  if (!isEnumValue(type, INTERACTION_TYPES)) {
    return { ok: false, error: "Select a valid interaction type." };
  }
  if (!isBoundedString(summary, 1, 1000)) {
    return { ok: false, error: "Summary must be between 1 and 1,000 characters." };
  }
  if (typeof createdByUserId !== "string" || !users.some((user) => user.id === createdByUserId)) {
    return { ok: false, error: "User not found." };
  }
  if (occurredAt !== undefined && !isIsoTimestamp(occurredAt)) {
    return { ok: false, error: "Interaction date is invalid." };
  }

  const store = getDemoStore();
  store.interactionCounter += 1;
  store.addedInteractions.push({
    id: `ci_added_${store.interactionCounter}`,
    workspaceId: WORKSPACE_ID,
    clientId,
    type,
    summary: summary.trim(),
    occurredAt: occurredAt ?? demoToday().toISOString(),
    createdByUserId,
  });
  return { ok: true };
}

export function updateClientFields(
  clientId: ID,
  edits: ClientEditableFields,
): ClientMutationResult {
  if (typeof clientId !== "string" || !clients.some((client) => client.id === clientId)) {
    return { ok: false, error: "Client not found." };
  }
  if (!isRecord(edits) || !hasOnlyKeys(edits, CLIENT_EDITABLE_KEYS)) {
    return { ok: false, error: "Client changes contain unsupported fields." };
  }
  if (
    edits.primaryContactName !== undefined &&
    !isBoundedString(edits.primaryContactName, 1, 120)
  ) {
    return { ok: false, error: "Primary contact name must be between 1 and 120 characters." };
  }
  if (
    edits.primaryContactEmail !== undefined &&
    edits.primaryContactEmail !== null &&
    !isEmail(edits.primaryContactEmail)
  ) {
    return { ok: false, error: "Enter a valid email address." };
  }
  if (edits.status !== undefined && !isEnumValue(edits.status, CLIENT_STATUSES)) {
    return { ok: false, error: "Select a valid client status." };
  }

  const patch: ClientOverride = {};
  if (edits.primaryContactName !== undefined) patch.primaryContactName = edits.primaryContactName.trim();
  if (edits.primaryContactEmail !== undefined) {
    patch.primaryContactEmail = edits.primaryContactEmail === null ? undefined : edits.primaryContactEmail.trim();
  }
  if (edits.status !== undefined) patch.status = edits.status;

  const overrides = getDemoStore().clientOverrides;
  overrides.set(clientId, { ...overrides.get(clientId), ...patch });
  return { ok: true };
}

export function resetClientOverrides(): void {
  const store = getDemoStore();
  store.clientOverrides.clear();
  store.addedInteractions.length = 0;
  store.interactionCounter = 0;
}
