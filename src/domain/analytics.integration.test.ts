import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getWorkloadDistribution,
  getProjectRiskDistribution,
  getOverdueTaskTrend,
} from "@/domain/analytics";
import { getTasksForProject, getOverdueTasks } from "@/domain/selectors";
import { setTaskStatus, updateTaskFields, resetTaskOverrides } from "@/domain/taskMutations";

/**
 * Proves analytics reflects live current state through the same
 * Phase 9 demo-state pipeline everything else uses (Phase 11 §11) —
 * no analytics-only shadow copy of task/project data.
 */
test.afterEach(() => {
  resetTaskOverrides();
});

test("getWorkloadDistribution moves a member between bands after a task reassignment", () => {
  const task = getTasksForProject("proj_harbor_refresh").find(
    (t) => t.assigneeId === "tm_omar" && t.status !== "done" && t.estimatedHours !== undefined,
  )!;
  assert.ok(task, "expected an open, real-estimate task assigned to tm_omar");

  const before = getWorkloadDistribution();
  updateTaskFields(task, { estimatedHours: (task.estimatedHours ?? 0) + 200 });
  const after = getWorkloadDistribution();

  assert.notDeepEqual(before, after, "a large estimate bump must shift the distribution");
  const totalBefore = before.reduce((sum, e) => sum + e.count, 0);
  const totalAfter = after.reduce((sum, e) => sum + e.count, 0);
  assert.equal(totalBefore, totalAfter, "total member count must stay constant");
});

test("getProjectRiskDistribution reflects a task edit that pushes a project into risk", () => {
  const before = getProjectRiskDistribution();
  const noneBefore = before.find((e) => e.level === "none")!.count;

  const tasks = getTasksForProject("proj_harbor_refresh").filter((t) => t.status !== "done");
  for (const task of tasks) {
    updateTaskFields(task, { priority: "high", dueDate: "2020-01-01T09:00:00.000Z" });
  }

  const after = getProjectRiskDistribution();
  const noneAfter = after.find((e) => e.level === "none")!.count;
  assert.ok(noneAfter < noneBefore, "proj_harbor_refresh leaving 'none' must reduce that bucket");
});

test("getOverdueTaskTrend's last point tracks getOverdueTasks() after a status change", () => {
  const before = getOverdueTaskTrend(8);
  assert.equal(before[before.length - 1]!.overdueCount, getOverdueTasks().length);

  const overdueTask = getOverdueTasks()[0];
  assert.ok(overdueTask, "expected at least one currently-overdue task in the base fixtures");
  setTaskStatus(overdueTask!, "done");

  const after = getOverdueTaskTrend(8);
  assert.equal(after[after.length - 1]!.overdueCount, getOverdueTasks().length);
  assert.ok(
    after[after.length - 1]!.overdueCount < before[before.length - 1]!.overdueCount,
    "completing an overdue task must reduce today's trend point",
  );
});
