import { test } from "node:test";
import assert from "node:assert/strict";
import { getProjectRisk, getTeamMemberWorkload, getTasksForProject } from "@/domain/selectors";
import { setTaskStatus, updateTaskFields, resetTaskOverrides } from "@/domain/taskMutations";

/**
 * Proves mutations flow through to the SAME shared domain functions
 * everything else uses (Phase 9 §13) — no UI state manually patches a
 * derived value. Uses the real demo dataset (not synthetic fixtures)
 * specifically to exercise the full getDemoDataset() -> override ->
 * computeProjectRisk/computeTeamMemberWorkload pipeline end to end.
 */
test.afterEach(() => {
  resetTaskOverrides();
});

test("project risk recalculates after a task edit changes the overdue ratio", () => {
  // proj_harbor_refresh is risk 'none' in the base fixtures (Phase 6).
  const before = getProjectRisk("proj_harbor_refresh");
  assert.equal(before.level, "none");

  // Pushing every one of its open tasks' due dates into the past and
  // marking them high priority should trigger both overdue-ratio and
  // high-priority-overdue conditions -> critical_risk.
  const tasks = getTasksForProject("proj_harbor_refresh").filter((t) => t.status !== "done");
  assert.ok(tasks.length > 0, "expected open tasks on proj_harbor_refresh");
  for (const task of tasks) {
    updateTaskFields(task, { priority: "high", dueDate: "2020-01-01T09:00:00.000Z" });
  }

  const after = getProjectRisk("proj_harbor_refresh");
  assert.notEqual(after.level, "none");
  assert.ok(after.conditions.includes("overdue_task_ratio_exceeded"));
});

test("project risk returns to 'none' after the triggering edit is reverted via reset", () => {
  const tasks = getTasksForProject("proj_harbor_refresh").filter((t) => t.status !== "done");
  for (const task of tasks) {
    updateTaskFields(task, { dueDate: "2020-01-01T09:00:00.000Z", priority: "high" });
  }
  assert.notEqual(getProjectRisk("proj_harbor_refresh").level, "none");

  resetTaskOverrides();
  assert.equal(getProjectRisk("proj_harbor_refresh").level, "none");
});

test("team workload recalculates after a status change moves a task to done", () => {
  // tm_omar is Available in the base fixtures with a specific set of
  // open tasks (Phase 6). Completing one of them should reduce his
  // assigned hours.
  const before = getTeamMemberWorkload("tm_omar");
  const openOmarTask = getTasksForProject("proj_harbor_refresh").find(
    (t) => t.assigneeId === "tm_omar" && t.status !== "done",
  );
  assert.ok(openOmarTask, "expected an open task assigned to tm_omar on proj_harbor_refresh");

  setTaskStatus(openOmarTask!, "done");
  const after = getTeamMemberWorkload("tm_omar");

  assert.ok(after.assignedHours < before.assignedHours);
});

test("team workload recalculates after a task is reassigned to a different member", () => {
  const task = getTasksForProject("proj_harbor_refresh").find(
    (t) => t.assigneeId === "tm_omar" && t.status !== "done",
  )!;
  const omarBefore = getTeamMemberWorkload("tm_omar");
  const priyaBefore = getTeamMemberWorkload("tm_priya");

  updateTaskFields(task, { assigneeId: "tm_priya" });

  const omarAfter = getTeamMemberWorkload("tm_omar");
  const priyaAfter = getTeamMemberWorkload("tm_priya");

  assert.ok(omarAfter.assignedHours < omarBefore.assignedHours);
  assert.ok(priyaAfter.assignedHours > priyaBefore.assignedHours);
});

test("team workload recalculates after an estimated-hours edit", () => {
  const task = getTasksForProject("proj_harbor_refresh").find(
    (t) => t.assigneeId === "tm_omar" && t.status !== "done" && t.estimatedHours !== undefined,
  )!;
  assert.ok(task, "expected an open, real-estimate task assigned to tm_omar");

  const before = getTeamMemberWorkload("tm_omar");
  updateTaskFields(task, { estimatedHours: (task.estimatedHours ?? 0) + 20 });
  const after = getTeamMemberWorkload("tm_omar");

  assert.equal(after.assignedHours, before.assignedHours + 20);
});
