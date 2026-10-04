import { test } from "node:test";
import assert from "node:assert/strict";
import type { Client } from "@/types/entities";
import {
  addClientInteraction,
  updateClientFields,
  applyClientOverride,
  getAddedInteractions,
  resetClientOverrides,
} from "@/domain/clientMutations";
import { DEMO_TODAY_ISO } from "@/lib/demo-clock";

function makeClient(overrides: Partial<Client> = {}): Client {
  return {
    id: "cl_mut_test",
    workspaceId: "ws_test",
    name: "Test Client",
    status: "active",
    primaryContactName: "Jordan Lee",
    createdAt: "2026-01-01T09:00:00.000Z",
    ...overrides,
  };
}

test.afterEach(() => {
  resetClientOverrides();
});

test("addClientInteraction: rejects an empty/whitespace-only summary", () => {
  const result = addClientInteraction("cl1", "note", "   ", "usr_maya");
  assert.equal(result.ok, false);
  assert.equal(getAddedInteractions().length, 0);
});

test("addClientInteraction: appends a trimmed interaction stamped with today by default", () => {
  const result = addClientInteraction("cl1", "call", "  Discussed renewal.  ", "usr_maya");
  assert.equal(result.ok, true);
  const added = getAddedInteractions();
  assert.equal(added.length, 1);
  assert.equal(added[0]!.summary, "Discussed renewal.");
  assert.equal(added[0]!.clientId, "cl1");
  assert.equal(added[0]!.type, "call");
  assert.equal(added[0]!.createdByUserId, "usr_maya");
  assert.equal(added[0]!.occurredAt, DEMO_TODAY_ISO);
});

test("addClientInteraction: each call gets a distinct id", () => {
  addClientInteraction("cl1", "note", "First note", "usr_maya");
  addClientInteraction("cl1", "note", "Second note", "usr_maya");
  const added = getAddedInteractions();
  assert.equal(added.length, 2);
  assert.notEqual(added[0]!.id, added[1]!.id);
});

test("updateClientFields: rejects an empty primaryContactName", () => {
  const client = makeClient();
  const result = updateClientFields(client.id, { primaryContactName: "   " });
  assert.equal(result.ok, false);
  assert.deepEqual(applyClientOverride(client), client);
});

test("updateClientFields: applies a partial edit via applyClientOverride", () => {
  const client = makeClient();
  updateClientFields(client.id, { primaryContactName: "Alex Rivera" });
  const result = applyClientOverride(client);
  assert.equal(result.primaryContactName, "Alex Rivera");
  assert.equal(result.status, client.status, "unedited fields are untouched");
});

test("updateClientFields: null clears primaryContactEmail", () => {
  const client = makeClient({ primaryContactEmail: "old@example.com" });
  updateClientFields(client.id, { primaryContactEmail: null });
  assert.equal(applyClientOverride(client).primaryContactEmail, undefined);
});

test("updateClientFields: edits merge across multiple calls on the same client", () => {
  const client = makeClient();
  updateClientFields(client.id, { primaryContactName: "Alex Rivera" });
  updateClientFields(client.id, { status: "dormant" });
  const result = applyClientOverride(client);
  assert.equal(result.primaryContactName, "Alex Rivera");
  assert.equal(result.status, "dormant");
});

test("applyClientOverride: a client with no recorded override is returned unchanged", () => {
  const client = makeClient();
  assert.deepEqual(applyClientOverride(client), client);
});

test("resetClientOverrides: clears both field overrides and added interactions", () => {
  const client = makeClient();
  updateClientFields(client.id, { status: "dormant" });
  addClientInteraction(client.id, "note", "A note", "usr_maya");
  assert.equal(applyClientOverride(client).status, "dormant");
  assert.equal(getAddedInteractions().length, 1);

  resetClientOverrides();

  assert.equal(applyClientOverride(client).status, "active");
  assert.equal(getAddedInteractions().length, 0);
});
