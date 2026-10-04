import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getTeamMembersWithWorkload,
  getTeamMemberDetail,
  getMemberAssignmentsGroupedByProject,
  getTasksForProject,
  getTeamWorkloadSnapshot,
} from "@/domain/selectors";
import { getWorkloadDistribution } from "@/domain/analytics";
import { setTaskStatus, updateTaskFields, resetTaskOverrides } from "@/domain/taskMutations";

/**
 * Proves Team reads through the SAME shared workload pipeline
 * Dashboard (Phase 7) and Analytics (Phase 11) already use — no
 * Team-specific cached workload, and reassigning/editing/completing a
 * task updates Team, Dashboard, and Analytics in lockstep (Phase 12
 * §9/§13/§14).
 */
test.afterEach(() => {
  resetTaskOverrides();
});

test("reassigning a task moves workload off the old member and onto the new one, consistently across Team/Dashboard/Analytics", () => {
  const task = getTasksForProject("proj_harbor_refresh").find(
    (t) => t.assigneeId === "tm_omar" && t.status !== "done" && t.estimatedHours !== undefined,
  )!;
  assert.ok(task, "expected an open, real-estimate task assigned to tm_omar");

  const omarBefore = getTeamMemberDetail("tm_omar")!.workload;
  const mayaBefore = getTeamMemberDetail("tm_maya")!.workload;

  updateTaskFields(task, { assigneeId: "tm_maya" });

  const omarAfter = getTeamMemberDetail("tm_omar")!.workload;
  const mayaAfter = getTeamMemberDetail("tm_maya")!.workload;
  assert.ok(omarAfter.assignedHours < omarBefore.assignedHours);
  assert.ok(mayaAfter.assignedHours > mayaBefore.assignedHours);

  // Dashboard's getTeamWorkloadSnapshot must agree exactly.
  const snapshot = getTeamWorkloadSnapshot();
  const omarSnapshot = snapshot.find((e) => e.member.id === "tm_omar")!;
  const mayaSnapshot = snapshot.find((e) => e.member.id === "tm_maya")!;
  assert.equal(omarSnapshot.workload.assignedHours, omarAfter.assignedHours);
  assert.equal(mayaSnapshot.workload.assignedHours, mayaAfter.assignedHours);

  // Analytics' getWorkloadDistribution band totals must still sum to 8 and reflect the same bands.
  const distribution = getWorkloadDistribution();
  const total = distribution.reduce((sum, e) => sum + e.count, 0);
  assert.equal(total, 8);
  const bandCounts: Record<string, number> = {};
  for (const e of getTeamMembersWithWorkload()) {
    bandCounts[e.workload.band] = (bandCounts[e.workload.band] ?? 0) + 1;
  }
  for (const entry of distribution) {
    assert.equal(entry.count, bandCounts[entry.band] ?? 0);
  }
});

test("an estimated-hours edit changes assignedHours identically in getTeamMemberDetail and getMemberAssignmentsGroupedByProject", () => {
  const task = getTasksForProject("proj_harbor_refresh").find(
    (t) => t.assigneeId === "tm_omar" && t.status !== "done" && t.estimatedHours !== undefined,
  )!;
  const before = getTeamMemberDetail("tm_omar")!.workload.assignedHours;

  updateTaskFields(task, { estimatedHours: (task.estimatedHours ?? 0) + 10 });

  const after = getTeamMemberDetail("tm_omar")!.workload.assignedHours;
  assert.equal(after, before + 10);

  const groups = getMemberAssignmentsGroupedByProject("tm_omar");
  const totalGroupHours = groups.reduce((sum, g) => sum + g.assignedHours, 0);
  assert.equal(totalGroupHours, after);
});

test("completing a task reduces workload and its assigned project's contribution, but the task still appears in assignments", () => {
  const task = getTasksForProject("proj_harbor_refresh").find(
    (t) => t.assigneeId === "tm_omar" && t.status !== "done",
  )!;
  const before = getTeamMemberDetail("tm_omar")!.workload.assignedHours;

  setTaskStatus(task, "done");

  const after = getTeamMemberDetail("tm_omar")!.workload.assignedHours;
  assert.ok(after < before, "completing an open task must reduce assignedHours");

  const groups = getMemberAssignmentsGroupedByProject("tm_omar");
  const projectGroup = groups.find((g) => g.project.id === "proj_harbor_refresh");
  assert.ok(projectGroup, "the completed task's project must still appear in assignments");
  assert.ok(
    projectGroup!.tasks.some((t) => t.task.id === task.id && t.task.status === "done"),
    "the now-done task must still be listed as an assignment, just no longer counted in assignedHours",
  );
});

test("resetTaskOverrides returns Team to the fixture-derived workload values", () => {
  const task = getTasksForProject("proj_harbor_refresh").find(
    (t) => t.assigneeId === "tm_omar" && t.status !== "done",
  )!;
  const before = getTeamMemberDetail("tm_omar")!.workload.assignedHours;

  setTaskStatus(task, "done");
  assert.notEqual(getTeamMemberDetail("tm_omar")!.workload.assignedHours, before);

  resetTaskOverrides();
  assert.equal(getTeamMemberDetail("tm_omar")!.workload.assignedHours, before);
});
