import { test } from "node:test";
import assert from "node:assert/strict";
import type { Client, ClientInteraction } from "@/types/entities";
import { getClientFollowUpStatus, FOLLOW_UP_STALE_DAYS } from "@/domain/clients/followUp";

function makeClient(overrides: Partial<Client>): Client {
  return {
    id: "cl_test",
    workspaceId: "ws_test",
    name: "Test Client",
    status: "active",
    primaryContactName: "Test Contact",
    createdAt: "2026-01-01T09:00:00.000Z",
    ...overrides,
  };
}

function makeInteraction(occurredAt: string): ClientInteraction {
  return {
    id: "ci_test",
    workspaceId: "ws_test",
    clientId: "cl_test",
    type: "email",
    summary: "Test interaction",
    occurredAt,
    createdByUserId: "usr_test",
  };
}

test("follow-up: recent interaction does not need follow-up", () => {
  const client = makeClient({});
  // DEMO_TODAY is 2026-10-04; 2 days ago is well within the threshold.
  const result = getClientFollowUpStatus(client, [makeInteraction("2026-10-02T09:00:00.000Z")]);
  assert.equal(result.needsFollowUp, false);
  assert.equal(result.daysSinceLastInteraction, 2);
});

test("follow-up: stale interaction needs follow-up", () => {
  const client = makeClient({});
  const result = getClientFollowUpStatus(client, [makeInteraction("2026-09-01T09:00:00.000Z")]);
  assert.equal(result.needsFollowUp, true);
  assert.equal(result.daysSinceLastInteraction! > FOLLOW_UP_STALE_DAYS, true);
});

test("follow-up: no interaction at all needs follow-up", () => {
  const client = makeClient({});
  const result = getClientFollowUpStatus(client, []);
  assert.equal(result.needsFollowUp, true);
  assert.equal(result.lastInteractionAt, undefined);
});

test("follow-up: dormant clients are always excluded, even with a stale interaction", () => {
  const client = makeClient({ status: "dormant" });
  const result = getClientFollowUpStatus(client, [makeInteraction("2024-01-01T09:00:00.000Z")]);
  assert.equal(result.needsFollowUp, false);
});

test("follow-up: uses the latest of several interactions, not an arbitrary one", () => {
  const client = makeClient({});
  const result = getClientFollowUpStatus(client, [
    makeInteraction("2026-01-01T09:00:00.000Z"),
    makeInteraction("2026-10-01T09:00:00.000Z"),
    makeInteraction("2026-05-01T09:00:00.000Z"),
  ]);
  assert.equal(result.lastInteractionAt, "2026-10-01T09:00:00.000Z");
});
