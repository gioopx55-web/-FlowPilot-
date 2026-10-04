import { test } from "node:test";
import assert from "node:assert/strict";
import { getDemoDataset } from "@/data/mock/index";
import { computeProjectRisk } from "@/domain/risk/risk";
import { computeTeamMemberWorkload } from "@/domain/workload/workload";
import { getClientFollowUpStatus } from "@/domain/clients/followUp";
import { getOverdueTasks } from "@/domain/selectors";

test("mock dataset: loads and passes validation without throwing", () => {
  assert.doesNotThrow(() => getDemoDataset());
});

test("mock dataset: has the approximate required scale", () => {
  const ds = getDemoDataset();
  assert.equal(ds.teamMembers.length, 8);
  assert.equal(ds.clients.length, 15);
  assert.ok(ds.projects.length >= 12);
  assert.ok(ds.tasks.length >= 24, "expected 'dozens' of tasks");
});

test("mock dataset: every approved project risk level is produced", () => {
  const ds = getDemoDataset();
  const tasksByProject = new Map<string, typeof ds.tasks>();
  for (const t of ds.tasks) {
    tasksByProject.set(t.projectId, [...(tasksByProject.get(t.projectId) ?? []), t]);
  }
  const levels = new Set(
    ds.projects.map((p) => computeProjectRisk(p, tasksByProject.get(p.id) ?? []).level),
  );
  assert.ok(levels.has("none"));
  assert.ok(levels.has("at_risk"));
  assert.ok(levels.has("critical_risk"));
});

test("mock dataset: completed and on_hold projects compute to risk 'none'", () => {
  const ds = getDemoDataset();
  const completed = ds.projects.find((p) => p.status === "completed");
  const onHold = ds.projects.find((p) => p.status === "on_hold");
  assert.ok(completed, "expected a completed project fixture");
  assert.ok(onHold, "expected an on_hold project fixture");

  const completedTasks = ds.tasks.filter((t) => t.projectId === completed!.id);
  const onHoldTasks = ds.tasks.filter((t) => t.projectId === onHold!.id);

  assert.equal(computeProjectRisk(completed!, completedTasks).level, "none");
  assert.equal(computeProjectRisk(onHold!, onHoldTasks).level, "none");
});

test("mock dataset: every approved workload band is produced", () => {
  const ds = getDemoDataset();
  const bands = new Set(
    ds.teamMembers.map((m) => computeTeamMemberWorkload(m, ds.tasks).band),
  );
  assert.ok(bands.has("Available"));
  assert.ok(bands.has("Healthy"));
  assert.ok(bands.has("High"));
  assert.ok(bands.has("Overloaded"));
});

test("mock dataset: client follow-up coverage includes needing, not-needing, and dormant", () => {
  const ds = getDemoDataset();
  const dormant = ds.clients.filter((c) => c.status === "dormant");
  const nonDormant = ds.clients.filter((c) => c.status !== "dormant");
  const statuses = nonDormant.map(
    (c) => getClientFollowUpStatus(c, ds.clientInteractions).needsFollowUp,
  );

  assert.ok(dormant.length >= 1);
  assert.ok(statuses.includes(true));
  assert.ok(statuses.includes(false));
  for (const client of dormant) {
    assert.equal(getClientFollowUpStatus(client, ds.clientInteractions).needsFollowUp, false);
  }
});

test("getOverdueTasks: excludes tasks belonging to completed or on_hold projects", () => {
  const ds = getDemoDataset();
  const excludedProjectIds = new Set(
    ds.projects.filter((p) => p.status === "completed" || p.status === "on_hold").map((p) => p.id),
  );
  const overdue = getOverdueTasks();
  assert.ok(overdue.length > 0, "expected at least one actionable overdue task");
  for (const task of overdue) {
    assert.equal(
      excludedProjectIds.has(task.projectId),
      false,
      `overdue task "${task.id}" belongs to an excluded (completed/on_hold) project`,
    );
  }
});

test("mock dataset: Client.lastInteractionAt matches max(ClientInteraction.occurredAt), never hand-set", () => {
  const ds = getDemoDataset();
  for (const client of ds.clients) {
    const clientInteractions = ds.clientInteractions.filter((i) => i.clientId === client.id);
    const expectedLatest = clientInteractions
      .map((i) => i.occurredAt)
      .sort()
      .at(-1);
    assert.equal(client.lastInteractionAt, expectedLatest);
  }
});
