import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getTeamMembersWithWorkload,
  getTeamMembersFiltered,
  getTeamMemberDetail,
  getMemberAssignmentsGroupedByProject,
  getMemberWorkloadContributors,
  getTasksForMember,
} from "@/domain/selectors";

test("getTeamMembersWithWorkload: returns all 8 fixture members with workload + counts", () => {
  const entries = getTeamMembersWithWorkload();
  assert.equal(entries.length, 8);
  for (const entry of entries) {
    assert.ok(entry.workload.band);
    assert.ok(entry.activeTaskCount >= 0);
    assert.ok(entry.activeProjectCount >= 0);
    assert.ok(entry.activeProjectCount <= entry.activeTaskCount);
  }
});

test("getTeamMembersFiltered: default sort is Overloaded > High > Healthy > Available, ties by pct desc", () => {
  const entries = getTeamMembersFiltered();
  const bandRank = (band: string) =>
    band === "Overloaded" ? 0 : band === "High" ? 1 : band === "Healthy" ? 2 : 3;
  for (let i = 1; i < entries.length; i++) {
    const prev = entries[i - 1]!;
    const curr = entries[i]!;
    const prevRank = bandRank(prev.workload.band);
    const currRank = bandRank(curr.workload.band);
    assert.ok(
      prevRank < currRank ||
        (prevRank === currRank && prev.workload.workloadPct >= curr.workload.workloadPct),
      `expected ${prev.member.name} (${prev.workload.band} ${prev.workload.workloadPct}%) before ${curr.member.name} (${curr.workload.band} ${curr.workload.workloadPct}%)`,
    );
  }
  // Never alphabetical by default (Phase 12 §1) — first entry must not simply be the first name alphabetically.
  assert.notEqual(entries[0]!.member.name, "Elena Petrova");
});

test("getTeamMembersFiltered: sort=name is alphabetical", () => {
  const byName = getTeamMembersFiltered({}, "name").map((e) => e.member.name);
  const sorted = [...byName].sort((a, b) => a.localeCompare(b));
  assert.deepEqual(byName, sorted);
});

test("getTeamMembersFiltered: query filter matches name or job title, case-insensitive", () => {
  const byName = getTeamMembersFiltered({ query: "sana" });
  assert.equal(byName.length, 1);
  assert.equal(byName[0]!.member.name, "Sana Iyer");

  const byTitle = getTeamMembersFiltered({ query: "developer" });
  assert.ok(byTitle.length >= 2);
  assert.ok(byTitle.every((e) => e.member.jobTitle.toLowerCase().includes("developer")));
});

test("getTeamMembersFiltered: band filter returns only that band", () => {
  const overloaded = getTeamMembersFiltered({ band: "Overloaded" });
  assert.ok(overloaded.length > 0);
  assert.ok(overloaded.every((e) => e.workload.band === "Overloaded"));
});

test("getTeamMemberDetail: resolves member + workload; undefined for an unknown id", () => {
  const detail = getTeamMemberDetail("tm_sana");
  assert.ok(detail);
  assert.equal(detail!.member.name, "Sana Iyer");
  assert.equal(detail!.workload.band, "Overloaded");

  assert.equal(getTeamMemberDetail("tm_does_not_exist"), undefined);
});

test("getMemberAssignmentsGroupedByProject: groups sum to the member's full task count, sorted by contribution desc", () => {
  const groups = getMemberAssignmentsGroupedByProject("tm_elena");
  const totalTasks = groups.reduce((sum, g) => sum + g.tasks.length, 0);
  assert.equal(totalTasks, getTasksForMember("tm_elena").length);

  for (let i = 1; i < groups.length; i++) {
    assert.ok(groups[i - 1]!.assignedHours >= groups[i]!.assignedHours);
  }
  for (const group of groups) {
    assert.equal(group.project.id, group.tasks[0]!.task.projectId);
  }
});

test("getMemberAssignmentsGroupedByProject: fallbackTaskIds are a subset of that group's open tasks", () => {
  const groups = getMemberAssignmentsGroupedByProject("tm_sana");
  for (const group of groups) {
    const openTaskIds = new Set(
      group.tasks.filter((t) => t.task.status !== "done").map((t) => t.task.id),
    );
    for (const id of group.fallbackTaskIds) {
      assert.ok(openTaskIds.has(id), `fallback task ${id} must be one of this group's open tasks`);
    }
  }
});

test("getMemberWorkloadContributors: sorted by hours descending and respects limit", () => {
  const contributors = getMemberWorkloadContributors("tm_marcus", 3);
  assert.ok(contributors.length <= 3);
  for (let i = 1; i < contributors.length; i++) {
    assert.ok(contributors[i - 1]!.hours >= contributors[i]!.hours);
  }
  for (const c of contributors) {
    assert.notEqual(c.task.status, "done", "contributors must only include open tasks");
  }
});

test("getMemberWorkloadContributors: contributor hours sum does not exceed the member's total assignedHours", () => {
  const detail = getTeamMemberDetail("tm_marcus")!;
  const allContributors = getMemberWorkloadContributors("tm_marcus", 100);
  const totalContributorHours = allContributors.reduce((sum, c) => sum + c.hours, 0);
  assert.equal(totalContributorHours, detail.workload.assignedHours);
});
