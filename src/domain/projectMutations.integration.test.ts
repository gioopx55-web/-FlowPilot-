import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getFilteredProjects,
  getProjectById,
  getClientProjectsWithRisk,
} from "@/domain/selectors";
import { getProjectStatusDistribution } from "@/domain/analytics";
import { createProject, updateProjectFields, resetProjectOverrides } from "@/domain/projectMutations";

/**
 * Proves a created/edited project reads through the SAME pipeline as
 * every fixture project — no second "created project" read path
 * (Phase 21.1 §1/§11 cross-module verification). A created project
 * must appear in the Projects list, its client's project list, and
 * Analytics' status distribution without any separate wiring.
 */
test.afterEach(() => {
  resetProjectOverrides();
});

test("a created project appears in getFilteredProjects, getProjectById, and the client's project list", () => {
  const created = createProject({
    name: "Integration Test Project",
    clientId: "cl_harbor_thistle",
    status: "kickoff",
    progressPct: 10,
    startDate: "2026-10-01",
  });
  assert.equal(created.ok, true);
  const id = created.projectId!;

  assert.ok(getProjectById(id));
  assert.equal(
    getFilteredProjects().some((e) => e.project.id === id),
    true,
  );
  assert.equal(
    getClientProjectsWithRisk("cl_harbor_thistle").some((e) => e.project.id === id),
    true,
  );
});

test("editing a project's status changes Analytics' status distribution", () => {
  const before = getProjectStatusDistribution();
  const beforeKickoff = before.find((e) => e.status === "kickoff")?.count ?? 0;

  const created = createProject({
    name: "Status Distribution Test",
    clientId: "cl_harbor_thistle",
    status: "kickoff",
    progressPct: 0,
    startDate: "2026-10-01",
  });
  const afterCreate = getProjectStatusDistribution();
  const afterCreateKickoff = afterCreate.find((e) => e.status === "kickoff")?.count ?? 0;
  assert.equal(afterCreateKickoff, beforeKickoff + 1);

  updateProjectFields(created.projectId!, "kickoff", { status: "review" });
  const afterEdit = getProjectStatusDistribution();
  const afterEditKickoff = afterEdit.find((e) => e.status === "kickoff")?.count ?? 0;
  const afterEditReview = afterEdit.find((e) => e.status === "review")?.count ?? 0;
  const beforeReview = before.find((e) => e.status === "review")?.count ?? 0;

  assert.equal(afterEditKickoff, beforeKickoff);
  assert.equal(afterEditReview, beforeReview + 1);
});

test("a new project with no tasks carries no risk (zero risk conditions can trigger)", () => {
  const created = createProject({
    name: "No Tasks Yet",
    clientId: "cl_harbor_thistle",
    status: "kickoff",
    progressPct: 0,
    startDate: "2026-10-01",
  });
  const entry = getFilteredProjects().find((e) => e.project.id === created.projectId)!;
  assert.equal(entry.risk.level, "none");
});
