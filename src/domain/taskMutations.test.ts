import { test } from "node:test";
import assert from "node:assert/strict";
import type { Task } from "@/types/entities";
import {
  applyTaskOverride,
  setTaskStatus,
  setTaskBlocker,
  updateTaskFields,
  resetTaskOverrides,
} from "@/domain/taskMutations";
import { DEMO_TODAY_ISO } from "@/lib/demo-clock";

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "task_mut_test",
    workspaceId: "ws_test",
    projectId: "proj_test",
    title: "Test task",
    status: "todo",
    priority: "medium",
    hasActiveBlocker: false,
    createdAt: "2026-01-01T09:00:00.000Z",
    ...overrides,
  };
}

test.afterEach(() => {
  resetTaskOverrides();
});

test("setTaskStatus: applies and is visible via applyTaskOverride", () => {
  const task = makeTask({ id: "t1" });
  setTaskStatus(task, "in_progress");
  const result = applyTaskOverride(task);
  assert.equal(result.status, "in_progress");
});

test("setTaskStatus: transitioning to done sets completedAt", () => {
  const task = makeTask({ id: "t2" });
  setTaskStatus(task, "done");
  const result = applyTaskOverride(task);
  assert.equal(result.status, "done");
  assert.equal(result.completedAt, DEMO_TODAY_ISO);
});

test("setTaskStatus: transitioning away from done clears completedAt", () => {
  const task = makeTask({ id: "t3", status: "done", completedAt: "2026-02-01T09:00:00.000Z" });
  setTaskStatus(task, "in_progress");
  const result = applyTaskOverride(task);
  assert.equal(result.status, "in_progress");
  assert.equal(result.completedAt, undefined);
});

test("setTaskBlocker: enabling sets hasActiveBlocker and blockerStartedAt together", () => {
  const task = makeTask({ id: "t4" });
  setTaskBlocker(task, true);
  const result = applyTaskOverride(task);
  assert.equal(result.hasActiveBlocker, true);
  assert.equal(result.blockerStartedAt, DEMO_TODAY_ISO);
});

test("setTaskBlocker: disabling clears both fields together (no impossible state)", () => {
  const task = makeTask({
    id: "t5",
    hasActiveBlocker: true,
    blockerStartedAt: "2026-02-01T09:00:00.000Z",
  });
  setTaskBlocker(task, false);
  const result = applyTaskOverride(task);
  assert.equal(result.hasActiveBlocker, false);
  assert.equal(result.blockerStartedAt, undefined);
});

test("setTaskBlocker: status is untouched — decoupled from workflow status (D-023)", () => {
  const task = makeTask({ id: "t6", status: "in_progress" });
  setTaskBlocker(task, true);
  const result = applyTaskOverride(task);
  assert.equal(result.status, "in_progress");
});

test("updateTaskFields: rejects negative estimatedHours", () => {
  const task = makeTask({ id: "t7" });
  const result = updateTaskFields(task, { estimatedHours: -5 });
  assert.equal(result.ok, false);
  assert.equal(applyTaskOverride(task).estimatedHours, undefined);
});

test("updateTaskFields: null clears a field, undefined (absent key) leaves it unchanged", () => {
  const task = makeTask({ id: "t8", estimatedHours: 10, priority: "low" });
  updateTaskFields(task, { estimatedHours: null });
  const afterClear = applyTaskOverride(task);
  assert.equal(afterClear.estimatedHours, undefined);
  assert.equal(afterClear.priority, "low");

  updateTaskFields(task, { priority: "high" });
  const afterPriority = applyTaskOverride(task);
  assert.equal(afterPriority.priority, "high");
  assert.equal(afterPriority.estimatedHours, undefined, "earlier clear must still hold");
});

test("updateTaskFields: assigneeId null unassigns", () => {
  const task = makeTask({ id: "t9", assigneeId: "tm_someone" });
  updateTaskFields(task, { assigneeId: null });
  assert.equal(applyTaskOverride(task).assigneeId, undefined);
});

test("applyTaskOverride: a task with no recorded override is returned unchanged", () => {
  const task = makeTask({ id: "t10", priority: "high" });
  assert.deepEqual(applyTaskOverride(task), task);
});

test("resetTaskOverrides: clears every recorded override", () => {
  const task = makeTask({ id: "t11" });
  setTaskStatus(task, "done");
  assert.equal(applyTaskOverride(task).status, "done");
  resetTaskOverrides();
  assert.equal(applyTaskOverride(task).status, "todo");
});

test("overrides merge across multiple mutation calls on the same task", () => {
  const task = makeTask({ id: "t12" });
  setTaskStatus(task, "in_progress");
  updateTaskFields(task, { priority: "high" });
  const result = applyTaskOverride(task);
  assert.equal(result.status, "in_progress");
  assert.equal(result.priority, "high");
});

test("runtime validation: rejects invalid status, blocker state, and priority", () => {
  const task = makeTask({ id: "t_invalid_enums" });
  assert.equal(setTaskStatus(task, "invalid" as Task["status"]).ok, false);
  assert.equal(setTaskBlocker(task, "yes" as unknown as boolean).ok, false);
  assert.equal(updateTaskFields(task, { priority: "urgent" as Task["priority"] }).ok, false);
  assert.deepEqual(applyTaskOverride(task), task);
});

test("runtime validation: rejects NaN hours, nonexistent assignee, and unknown patch keys", () => {
  const task = makeTask({ id: "t_invalid_patch" });
  assert.equal(updateTaskFields(task, { estimatedHours: Number.NaN }).ok, false);
  assert.equal(updateTaskFields(task, { assigneeId: "tm_missing" }).ok, false);
  assert.equal(
    updateTaskFields(task, { title: "Injected" } as unknown as Parameters<typeof updateTaskFields>[1]).ok,
    false,
  );
  assert.deepEqual(applyTaskOverride(task), task);
});
