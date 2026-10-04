import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getFilteredProjects,
  getProjectTaskSummary,
  getProjectAssignedMembers,
  getProjectActivity,
  getTasksFiltered,
  getTaskDetail,
} from "@/domain/selectors";

test("getFilteredProjects: status filter returns only matching projects", () => {
  const completed = getFilteredProjects({ status: "completed" });
  assert.ok(completed.length > 0);
  assert.ok(completed.every((e) => e.project.status === "completed"));
});

test("getFilteredProjects: risk filter returns only matching risk level", () => {
  const critical = getFilteredProjects({ risk: "critical_risk" });
  assert.ok(critical.length > 0);
  assert.ok(critical.every((e) => e.risk.level === "critical_risk"));
});

test("getFilteredProjects: query filter is case-insensitive substring match", () => {
  const results = getFilteredProjects({ query: "donor" });
  assert.ok(results.length > 0);
  assert.ok(results.every((e) => e.project.name.toLowerCase().includes("donor")));
});

test("getFilteredProjects: default sort is risk (critical first, then at-risk, then none)", () => {
  const all = getFilteredProjects();
  const ranks = all.map((e) =>
    e.risk.level === "critical_risk" ? 0 : e.risk.level === "at_risk" ? 1 : 2,
  );
  const sorted = [...ranks].sort((a, b) => a - b);
  assert.deepEqual(ranks, sorted);
});

test("getFilteredProjects: sort=name is alphabetical", () => {
  const byName = getFilteredProjects({ sort: "name" }).map((e) => e.project.name);
  const alpha = [...byName].sort((a, b) => a.localeCompare(b));
  assert.deepEqual(byName, alpha);
});

test("getProjectTaskSummary: counts match the project's actual tasks", () => {
  const summary = getProjectTaskSummary("proj_fernwood_donor");
  assert.equal(summary.total, 5);
  assert.equal(summary.doneCount, 1);
  assert.equal(summary.openCount, 4);
  assert.ok(summary.overdueCount >= 2);
});

test("getProjectAssignedMembers: project-scoped hours, not global workload", () => {
  const entries = getProjectAssignedMembers("proj_harbor_refresh");
  const sana = entries.find((e) => e.member.id === "tm_sana");
  assert.ok(sana, "expected Sana to be assigned on proj_harbor_refresh");
  // Sana's PROJECT-scoped hours here (12h) must be far smaller than her
  // global workload hours (44h, per Phase 6 fixtures) — proves this
  // selector is not accidentally returning global workload data.
  assert.equal(sana!.assignedHours, 12);
  assert.equal(sana!.taskCount, 1);
});

test("getProjectAssignedMembers: excludes members with no tasks on this project", () => {
  const entries = getProjectAssignedMembers("proj_harbor_refresh");
  const memberIds = entries.map((e) => e.member.id);
  assert.ok(!memberIds.includes("tm_priya"), "Priya has no task on proj_harbor_refresh");
});

test("getProjectActivity: scoped to the requested project only, newest first", () => {
  const activity = getProjectActivity("proj_lumen_deck");
  assert.ok(activity.length > 0);
  assert.ok(activity.every((a) => a.projectId === "proj_lumen_deck"));
  for (let i = 1; i < activity.length; i++) {
    assert.ok(activity[i - 1]!.occurredAt >= activity[i]!.occurredAt);
  }
});

test("getProjectActivity: respects the limit parameter", () => {
  const activity = getProjectActivity("proj_lumen_deck", 1);
  assert.equal(activity.length, 1);
});

test("getTasksFiltered: projectId scopes to that project's tasks only", () => {
  const entries = getTasksFiltered({ projectId: "proj_fernwood_donor" });
  assert.ok(entries.length > 0);
  assert.ok(entries.every((e) => e.task.projectId === "proj_fernwood_donor"));
});

test("getTasksFiltered: status filter matches TaskStatus exactly", () => {
  const entries = getTasksFiltered({ status: "blocked" });
  assert.ok(entries.length > 0);
  assert.ok(entries.every((e) => e.task.status === "blocked"));
});

test("getTasksFiltered: overdueOnly matches the same rule getOverdueTasks uses", () => {
  const entries = getTasksFiltered({ overdueOnly: true });
  assert.ok(entries.length > 0);
  assert.ok(entries.every((e) => e.isOverdue));
});

test("getTasksFiltered: query is a case-insensitive title substring match", () => {
  const entries = getTasksFiltered({ query: "donor records" });
  assert.ok(entries.length > 0);
  assert.ok(entries.every((e) => e.task.title.toLowerCase().includes("donor records")));
});

test("getTasksFiltered: sort=priority orders high before medium before low", () => {
  const entries = getTasksFiltered({}, "priority");
  const ranks = entries.map((e) =>
    e.task.priority === "high" ? 0 : e.task.priority === "medium" ? 1 : 2,
  );
  assert.deepEqual(ranks, [...ranks].sort((a, b) => a - b));
});

test("getTaskDetail: resolves project, client, and assignee together", () => {
  const detail = getTaskDetail("task_harbor_refresh_03");
  assert.ok(detail);
  assert.equal(detail!.task.id, "task_harbor_refresh_03");
  assert.equal(detail!.project?.id, "proj_harbor_refresh");
  assert.ok(detail!.client);
  assert.equal(detail!.assignee?.id, "tm_omar");
});

test("getTaskDetail: returns undefined for an unknown task ID", () => {
  assert.equal(getTaskDetail("does-not-exist"), undefined);
});
