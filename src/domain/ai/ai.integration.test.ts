import { test } from "node:test";
import assert from "node:assert/strict";
import { executeAIIntent } from "@/domain/ai/executeIntent";
import { getTasksForProject } from "@/domain/selectors";
import {
  setTaskStatus,
  setTaskBlocker,
  updateTaskFields,
  resetTaskOverrides,
} from "@/domain/taskMutations";
import {
  addClientInteraction,
  resetClientOverrides,
} from "@/domain/clientMutations";

/**
 * Proves the AI layer reads current `getDemoDataset()` state through
 * the same shared selectors/mutations everything else uses (Phase 13
 * §18) — no cached or stale answer survives a task/client mutation.
 */
test.afterEach(() => {
  resetTaskOverrides();
  resetClientOverrides();
});

test("task reassigned: workload answers change for both the old and new member", () => {
  const task = getTasksForProject("proj_harbor_refresh").find(
    (t) => t.assigneeId === "tm_omar" && t.status !== "done" && t.estimatedHours !== undefined,
  )!;
  assert.ok(task);

  const before = executeAIIntent("team_member_workload_explanation", {
    kind: "team_member",
    id: "tm_omar",
  });
  assert.equal(before.kind, "team_member_workload_explanation");
  const omarHoursBefore = before.kind === "team_member_workload_explanation" ? before.data.workload.assignedHours : -1;

  updateTaskFields(task, { assigneeId: "tm_maya" });

  const after = executeAIIntent("team_member_workload_explanation", {
    kind: "team_member",
    id: "tm_omar",
  });
  assert.equal(after.kind, "team_member_workload_explanation");
  const omarHoursAfter = after.kind === "team_member_workload_explanation" ? after.data.workload.assignedHours : -1;
  assert.ok(omarHoursAfter < omarHoursBefore);
});

test("task completed: overdue_tasks and at_risk_projects answers update immediately", () => {
  const tasks = getTasksForProject("proj_harbor_refresh").filter((t) => t.status !== "done");
  for (const task of tasks) {
    updateTaskFields(task, { priority: "high", dueDate: "2020-01-01T09:00:00.000Z" });
  }
  const riskyBefore = executeAIIntent("project_risk_explanation", {
    kind: "project",
    id: "proj_harbor_refresh",
  });
  assert.equal(riskyBefore.kind, "project_risk_explanation");
  if (riskyBefore.kind === "project_risk_explanation") {
    assert.notEqual(riskyBefore.data.risk.level, "none");
  }

  resetTaskOverrides();

  const after = executeAIIntent("project_risk_explanation", { kind: "project", id: "proj_harbor_refresh" });
  assert.equal(after.kind, "project_risk_explanation");
  if (after.kind === "project_risk_explanation") {
    assert.equal(after.data.risk.level, "none");
  }
});

test("blocker resolved: project risk explanation's blockedTasks list shrinks", () => {
  const blockedTask = getTasksForProject("proj_mariner_fleet").find((t) => t.hasActiveBlocker);
  assert.ok(blockedTask, "expected proj_mariner_fleet to have a stale-blocker fixture task");

  const before = executeAIIntent("project_risk_explanation", { kind: "project", id: "proj_mariner_fleet" });
  assert.equal(before.kind, "project_risk_explanation");
  const blockedBefore = before.kind === "project_risk_explanation" ? before.data.blockedTasks.length : -1;
  assert.ok(blockedBefore > 0);

  setTaskBlocker(blockedTask!, false);

  const after = executeAIIntent("project_risk_explanation", { kind: "project", id: "proj_mariner_fleet" });
  assert.equal(after.kind, "project_risk_explanation");
  const blockedAfter = after.kind === "project_risk_explanation" ? after.data.blockedTasks.length : -1;
  assert.ok(blockedAfter < blockedBefore);
});

test("client interaction added: client disappears from the clients_follow_up answer", () => {
  const before = executeAIIntent("clients_follow_up");
  assert.equal(before.kind, "list");
  const hadLumen = before.kind === "list" && before.rows.some((r) => r.id === "cl_lumen_analytics");
  assert.equal(hadLumen, true, "expected cl_lumen_analytics to need follow-up before the mutation");

  addClientInteraction("cl_lumen_analytics", "call", "Renewal call.", "usr_maya");

  const after = executeAIIntent("clients_follow_up");
  assert.equal(after.kind, "list");
  const hasLumen = after.kind === "list" && after.rows.some((r) => r.id === "cl_lumen_analytics");
  assert.equal(hasLumen, false);
});

test("resetTaskOverrides/resetClientOverrides return AI answers to fixture-derived values", () => {
  const task = getTasksForProject("proj_harbor_refresh").find((t) => t.status !== "done")!;
  setTaskStatus(task, "done");
  addClientInteraction("cl_lumen_analytics", "note", "temp", "usr_maya");

  resetTaskOverrides();
  resetClientOverrides();

  const overdue = executeAIIntent("overdue_tasks");
  const followUp = executeAIIntent("clients_follow_up");
  assert.equal(overdue.kind, "list");
  assert.equal(followUp.kind, "list");
  if (followUp.kind === "list") {
    assert.ok(followUp.rows.some((r) => r.id === "cl_lumen_analytics"));
  }
});
