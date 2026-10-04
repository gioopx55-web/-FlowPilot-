import { test } from "node:test";
import assert from "node:assert/strict";
import type { Project, Task } from "@/types/entities";
import { computeProjectRisk } from "@/domain/risk/risk";
import { DEMO_TODAY_ISO } from "@/lib/demo-clock";

const BASE_PROJECT: Project = {
  id: "proj_test",
  workspaceId: "ws_test",
  clientId: "cl_test",
  name: "Test Project",
  status: "in_progress",
  progressPct: 50,
  dueDate: "2027-06-01T09:00:00.000Z", // far future by default
  startDate: "2026-01-01T09:00:00.000Z",
  createdAt: "2026-01-01T09:00:00.000Z",
};

function makeTask(overrides: Partial<Task>): Task {
  return {
    id: "task_test",
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

test("project risk: none when no condition is true", () => {
  const tasks: Task[] = [
    makeTask({ id: "t1", status: "todo", dueDate: "2027-01-01T09:00:00.000Z" }),
    makeTask({ id: "t2", status: "in_progress", dueDate: "2027-01-05T09:00:00.000Z" }),
  ];
  const result = computeProjectRisk(BASE_PROJECT, tasks);
  assert.equal(result.level, "none");
  assert.deepEqual(result.conditions, []);
});

test("project risk: condition 1 (overdue task ratio > 25%)", () => {
  const tasks: Task[] = [
    makeTask({ id: "t1", status: "todo", priority: "medium", dueDate: "2026-09-20T09:00:00.000Z" }), // overdue
    makeTask({ id: "t2", status: "todo", priority: "medium", dueDate: "2026-09-20T09:00:00.000Z" }), // overdue
    makeTask({ id: "t3", status: "todo", dueDate: "2027-01-01T09:00:00.000Z" }),
    makeTask({ id: "t4", status: "todo", dueDate: "2027-01-01T09:00:00.000Z" }),
  ];
  const result = computeProjectRisk(BASE_PROJECT, tasks);
  assert.equal(result.level, "at_risk");
  assert.deepEqual(result.conditions, ["overdue_task_ratio_exceeded"]);
});

test("project risk: condition 2 (high-priority task overdue by more than 2 days)", () => {
  const tasks: Task[] = [
    makeTask({ id: "t1", priority: "high", status: "todo", dueDate: "2026-09-25T09:00:00.000Z" }), // ~9 days overdue
    makeTask({ id: "t2", status: "todo", dueDate: "2027-01-01T09:00:00.000Z" }),
    makeTask({ id: "t3", status: "todo", dueDate: "2027-01-01T09:00:00.000Z" }),
    makeTask({ id: "t4", status: "todo", dueDate: "2027-01-01T09:00:00.000Z" }),
  ];
  const result = computeProjectRisk(BASE_PROJECT, tasks);
  assert.equal(result.level, "at_risk");
  assert.deepEqual(result.conditions, ["high_priority_overdue"]);
});

test("project risk: high-priority task overdue by exactly 2 days does NOT trigger condition 2", () => {
  // DEMO_TODAY is 2026-10-04; 2 days overdue = 2026-10-02. Three extra
  // non-overdue open tasks keep the overdue RATIO (condition 1) at a
  // non-triggering 25%, isolating this case to condition 2 alone.
  const tasks: Task[] = [
    makeTask({ id: "t1", priority: "high", status: "todo", dueDate: "2026-10-02T09:00:00.000Z" }),
    makeTask({ id: "t2", status: "todo", dueDate: "2027-01-01T09:00:00.000Z" }),
    makeTask({ id: "t3", status: "todo", dueDate: "2027-01-01T09:00:00.000Z" }),
    makeTask({ id: "t4", status: "todo", dueDate: "2027-01-01T09:00:00.000Z" }),
  ];
  const result = computeProjectRisk(BASE_PROJECT, tasks);
  assert.equal(result.level, "none");
});

test("project risk: condition 3 (due date within 3 days and progress below 70%)", () => {
  const project: Project = {
    ...BASE_PROJECT,
    dueDate: "2026-10-06T09:00:00.000Z", // 2 days from DEMO_TODAY
    progressPct: 45,
  };
  const tasks: Task[] = [makeTask({ id: "t1", dueDate: "2027-01-01T09:00:00.000Z" })];
  const result = computeProjectRisk(project, tasks);
  assert.equal(result.level, "at_risk");
  assert.deepEqual(result.conditions, ["due_soon_low_progress"]);
});

test("project risk: due soon but progress >= 70% does NOT trigger condition 3", () => {
  const project: Project = {
    ...BASE_PROJECT,
    dueDate: "2026-10-06T09:00:00.000Z",
    progressPct: 75,
  };
  const result = computeProjectRisk(project, [makeTask({ id: "t1", dueDate: "2027-01-01T09:00:00.000Z" })]);
  assert.equal(result.level, "none");
});

test("project risk: condition 4 (active blocker open more than 48 hours)", () => {
  const tasks: Task[] = [
    makeTask({
      id: "t1",
      status: "blocked",
      hasActiveBlocker: true,
      blockerStartedAt: "2026-10-01T09:00:00.000Z", // 72h before DEMO_TODAY
      dueDate: "2027-01-01T09:00:00.000Z",
    }),
  ];
  const result = computeProjectRisk(BASE_PROJECT, tasks);
  assert.equal(result.level, "at_risk");
  assert.deepEqual(result.conditions, ["unresolved_blocker_stale"]);
});

test("project risk: active blocker open less than 48 hours does NOT trigger condition 4", () => {
  const tasks: Task[] = [
    makeTask({
      id: "t1",
      status: "blocked",
      hasActiveBlocker: true,
      blockerStartedAt: "2026-10-03T12:00:00.000Z", // 21h before DEMO_TODAY (09:00)
      dueDate: "2027-01-01T09:00:00.000Z",
    }),
  ];
  const result = computeProjectRisk(BASE_PROJECT, tasks);
  assert.equal(result.level, "none");
});

test("project risk: critical_risk when 2+ conditions are true", () => {
  const tasks: Task[] = [
    makeTask({ id: "t1", priority: "high", status: "todo", dueDate: "2026-09-20T09:00:00.000Z" }), // overdue, high
    makeTask({ id: "t2", status: "todo", dueDate: "2026-09-22T09:00:00.000Z" }), // overdue
    makeTask({ id: "t3", status: "todo", dueDate: "2027-01-01T09:00:00.000Z" }),
  ];
  const result = computeProjectRisk(BASE_PROJECT, tasks);
  assert.equal(result.level, "critical_risk");
  assert.equal(result.conditions.length >= 2, true);
  assert.deepEqual(
    [...result.conditions].sort(),
    ["high_priority_overdue", "overdue_task_ratio_exceeded"].sort(),
  );
});

test("project risk: completed projects are excluded regardless of tasks", () => {
  const project: Project = { ...BASE_PROJECT, status: "completed" };
  const tasks: Task[] = [
    makeTask({
      id: "t1",
      priority: "high",
      status: "blocked",
      hasActiveBlocker: true,
      blockerStartedAt: "2026-09-01T09:00:00.000Z",
      dueDate: "2026-08-01T09:00:00.000Z",
    }),
  ];
  const result = computeProjectRisk(project, tasks);
  assert.equal(result.level, "none");
  assert.deepEqual(result.conditions, []);
});

test("project risk: on_hold projects are excluded regardless of tasks", () => {
  const project: Project = { ...BASE_PROJECT, status: "on_hold" };
  const tasks: Task[] = [
    makeTask({
      id: "t1",
      priority: "high",
      status: "blocked",
      hasActiveBlocker: true,
      blockerStartedAt: "2026-09-01T09:00:00.000Z",
      dueDate: "2026-08-01T09:00:00.000Z",
    }),
  ];
  const result = computeProjectRisk(project, tasks);
  assert.equal(result.level, "none");
  assert.deepEqual(result.conditions, []);
});

test("sanity: DEMO_TODAY_ISO is the fixed reference date these tests assume", () => {
  assert.equal(DEMO_TODAY_ISO, "2026-10-04T09:00:00.000Z");
});
