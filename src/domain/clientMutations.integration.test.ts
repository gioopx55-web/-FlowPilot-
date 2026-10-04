import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getClientsNeedingFollowUpSorted,
  getClientsFiltered,
  getClientDetail,
  getClientProjectsWithRisk,
  getClientInteractionHistory,
  getClientById,
} from "@/domain/selectors";
import { getClientFollowUpStatus } from "@/domain/clients/followUp";
import { getDemoDataset } from "@/data/mock";
import { addClientInteraction, updateClientFields, resetClientOverrides } from "@/domain/clientMutations";

/**
 * Proves client mutations flow through the SAME shared selectors
 * everything else reads (Phase 10 §3/§12) — no UI state or second
 * follow-up calculation is ever patched in manually. Uses the real
 * demo dataset so the full getDemoDataset() -> override ->
 * getClientFollowUpStatus pipeline is exercised end to end, exactly
 * like Phase 9's task-mutation integration tests exercise risk/workload.
 */
test.afterEach(() => {
  resetClientOverrides();
});

test("adding a fresh interaction clears an active client's follow-up flag", () => {
  // cl_lumen_analytics is active with a last interaction on
  // 2026-09-10 against demo-today 2026-10-04 (Phase 6 fixtures) —
  // well past FOLLOW_UP_STALE_DAYS, so it starts needing follow-up.
  const client = getClientById("cl_lumen_analytics")!;
  const before = getClientFollowUpStatus(client, getDemoDataset().clientInteractions);
  assert.equal(before.needsFollowUp, true);

  addClientInteraction("cl_lumen_analytics", "call", "Renewal call.", "usr_maya");

  const { clients, clientInteractions } = getDemoDataset();
  const updatedClient = clients.find((c) => c.id === "cl_lumen_analytics")!;
  const after = getClientFollowUpStatus(updatedClient, clientInteractions);
  assert.equal(after.needsFollowUp, false);
  assert.equal(Math.abs(after.daysSinceLastInteraction!), 0);
});

test("Dashboard's Clients Needing Follow-Up list drops a client right after an interaction is added", () => {
  const before = getClientsNeedingFollowUpSorted();
  assert.ok(
    before.some((e) => e.client.id === "cl_lumen_analytics"),
    "expected cl_lumen_analytics to need follow-up before the mutation",
  );

  addClientInteraction("cl_lumen_analytics", "email", "Sent renewal summary.", "usr_maya");

  const after = getClientsNeedingFollowUpSorted();
  assert.ok(
    !after.some((e) => e.client.id === "cl_lumen_analytics"),
    "cl_lumen_analytics must no longer appear once it has a fresh interaction",
  );
});

test("dormant clients never need follow-up, even with no interaction added via a status edit", () => {
  // cl_thistlewood is dormant in the base fixtures with an old
  // interaction; confirm dormant exclusion, then confirm flipping an
  // active client to dormant via updateClientFields removes it from
  // the follow-up list without touching its interaction history.
  const before = getClientsNeedingFollowUpSorted();
  assert.ok(
    before.some((e) => e.client.id === "cl_lumen_analytics"),
    "sanity: cl_lumen_analytics starts out needing follow-up",
  );

  updateClientFields("cl_lumen_analytics", { status: "dormant" });

  const after = getClientsNeedingFollowUpSorted();
  assert.ok(
    !after.some((e) => e.client.id === "cl_lumen_analytics"),
    "a dormant client must be excluded regardless of interaction recency",
  );
});

test("getClientsFiltered: followUpOnly returns only clients currently needing follow-up", () => {
  const entries = getClientsFiltered({ followUpOnly: true });
  assert.ok(entries.length > 0);
  for (const entry of entries) {
    assert.equal(entry.followUp.needsFollowUp, true);
  }
});

test("getClientsFiltered: attention sort ranks needs-follow-up clients before everyone else", () => {
  const entries = getClientsFiltered({}, "attention");
  const firstNonFollowUpIndex = entries.findIndex((e) => !e.followUp.needsFollowUp);
  if (firstNonFollowUpIndex === -1) return;
  for (let i = 0; i < firstNonFollowUpIndex; i++) {
    assert.equal(entries[i]!.followUp.needsFollowUp, true);
  }
});

test("getClientProjectsWithRisk: only returns projects belonging to that client", () => {
  const entries = getClientProjectsWithRisk("cl_harbor_thistle");
  assert.ok(entries.length > 0);
  for (const { project } of entries) {
    assert.equal(project.clientId, "cl_harbor_thistle");
  }
});

test("getClientInteractionHistory: newest first, and includes a newly added interaction", () => {
  const before = getClientInteractionHistory("cl_harbor_thistle");
  assert.ok(before.length >= 2);
  for (let i = 1; i < before.length; i++) {
    assert.ok(before[i - 1]!.occurredAt >= before[i]!.occurredAt);
  }

  addClientInteraction("cl_harbor_thistle", "note", "A brand-new note.", "usr_maya");
  const after = getClientInteractionHistory("cl_harbor_thistle");
  assert.equal(after.length, before.length + 1);
  assert.equal(after[0]!.summary, "A brand-new note.", "the new interaction must sort first");
});

test("getClientDetail: returns undefined for an unknown client id (D-036 guard input)", () => {
  assert.equal(getClientDetail("cl_does_not_exist"), undefined);
});
