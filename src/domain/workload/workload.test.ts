import { test } from "node:test";
import assert from "node:assert/strict";
import type { Task, TeamMember } from "@/types/entities";
import { computeTeamMemberWorkload } from "@/domain/workload/workload";

function makeMember(capacity: number): TeamMember {
  return {
    id: "tm_test",
    workspaceId: "ws_test",
    name: "Test Member",
    jobTitle: "Tester",
    weeklyCapacityHours: capacity,
    active: true,
  };
}

function makeTask(overrides: Partial<Task>): Task {
  return {
    id: "task_test",
    workspaceId: "ws_test",
    projectId: "proj_test",
    title: "Test task",
    status: "in_progress",
    priority: "medium",
    assigneeId: "tm_test",
    hasActiveBlocker: false,
    createdAt: "2026-01-01T09:00:00.000Z",
    ...overrides,
  };
}

test("workload: uses real estimatedHours when present", () => {
  const member = makeMember(40);
  const tasks = [makeTask({ id: "t1", estimatedHours: 10 }), makeTask({ id: "t2", estimatedHours: 10 })];
  const result = computeTeamMemberWorkload(member, tasks);
  assert.equal(result.assignedHours, 20);
  assert.deepEqual(result.fallbackTaskIds, []);
});

test("workload: falls back to priority-based hours when estimatedHours is absent, and never mutates the task", () => {
  const member = makeMember(40);
  const lowTask = makeTask({ id: "t_low", priority: "low" });
  const mediumTask = makeTask({ id: "t_medium", priority: "medium" });
  const highTask = makeTask({ id: "t_high", priority: "high" });
  const result = computeTeamMemberWorkload(member, [lowTask, mediumTask, highTask]);

  assert.equal(result.assignedHours, 2 + 4 + 8);
  assert.deepEqual([...result.fallbackTaskIds].sort(), ["t_high", "t_low", "t_medium"]);
  // The distinction must remain inspectable — fallback is never written back.
  assert.equal(lowTask.estimatedHours, undefined);
  assert.equal(mediumTask.estimatedHours, undefined);
  assert.equal(highTask.estimatedHours, undefined);
});

test("workload: done tasks do not count toward assigned hours", () => {
  const member = makeMember(40);
  const tasks = [
    makeTask({ id: "t1", estimatedHours: 20, status: "done", completedAt: "2026-02-01T09:00:00.000Z" }),
    makeTask({ id: "t2", estimatedHours: 5, status: "in_progress" }),
  ];
  const result = computeTeamMemberWorkload(member, tasks);
  assert.equal(result.assignedHours, 5);
});

test("workload: tasks assigned to a different member are excluded", () => {
  const member = makeMember(40);
  const tasks = [makeTask({ id: "t1", estimatedHours: 20, assigneeId: "tm_other" })];
  const result = computeTeamMemberWorkload(member, tasks);
  assert.equal(result.assignedHours, 0);
});

test("workload band: Available (< 70%)", () => {
  const member = makeMember(40);
  const result = computeTeamMemberWorkload(member, [makeTask({ id: "t1", estimatedHours: 20 })]);
  assert.equal(result.workloadPct, 50);
  assert.equal(result.band, "Available");
});

test("workload band: Healthy (70-90%)", () => {
  const member = makeMember(40);
  const result = computeTeamMemberWorkload(member, [makeTask({ id: "t1", estimatedHours: 32 })]);
  assert.equal(result.workloadPct, 80);
  assert.equal(result.band, "Healthy");
});

test("workload band: High (91-110%)", () => {
  const member = makeMember(40);
  const result = computeTeamMemberWorkload(member, [makeTask({ id: "t1", estimatedHours: 40 })]);
  assert.equal(result.workloadPct, 100);
  assert.equal(result.band, "High");
});

test("workload band: Overloaded (> 110%)", () => {
  const member = makeMember(40);
  const result = computeTeamMemberWorkload(member, [makeTask({ id: "t1", estimatedHours: 50 })]);
  assert.equal(result.workloadPct, 125);
  assert.equal(result.band, "Overloaded");
});
