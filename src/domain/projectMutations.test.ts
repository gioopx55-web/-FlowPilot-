import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createProject,
  updateProjectFields,
  applyProjectOverride,
  getAddedProjects,
  resetProjectOverrides,
} from "@/domain/projectMutations";

test.afterEach(() => {
  resetProjectOverrides();
});

function validFields(overrides: Partial<Parameters<typeof createProject>[0]> = {}) {
  return {
    name: "New Website",
    clientId: "cl_harbor_thistle",
    status: "kickoff" as const,
    progressPct: 0,
    startDate: "2026-10-01",
    ...overrides,
  };
}

test("createProject: adds a project visible via getAddedProjects", () => {
  const result = createProject(validFields({ name: "Test A" }));
  assert.equal(result.ok, true);
  assert.ok(result.projectId);
  const added = getAddedProjects();
  assert.equal(added.some((p) => p.id === result.projectId), true);
});

test("createProject: rejects an empty name", () => {
  const result = createProject(validFields({ name: "   " }));
  assert.equal(result.ok, false);
  assert.match(result.error ?? "", /name/i);
});

test("createProject: rejects a name over 120 characters", () => {
  const result = createProject(validFields({ name: "x".repeat(121) }));
  assert.equal(result.ok, false);
});

test("createProject: rejects an out-of-range progress percentage", () => {
  const result = createProject(validFields({ progressPct: 150 }));
  assert.equal(result.ok, false);
  assert.match(result.error ?? "", /progress/i);
});

test("createProject: rejects a negative progress percentage", () => {
  const result = createProject(validFields({ progressPct: -5 }));
  assert.equal(result.ok, false);
});

test("createProject: rejects an invalid status enum value", () => {
  const result = createProject(
    validFields({ status: "not_a_real_status" as unknown as "kickoff" }),
  );
  assert.equal(result.ok, false);
});

test("createProject: rejects creating directly as completed", () => {
  const result = createProject(validFields({ status: "completed" }));
  assert.equal(result.ok, false);
});

test("createProject: rejects an invalid due date", () => {
  const result = createProject(validFields({ dueDate: "not-a-date" }));
  assert.equal(result.ok, false);
});

test("createProject: rejects a due date before the start date", () => {
  const result = createProject(
    validFields({ startDate: "2026-10-10", dueDate: "2026-10-01" }),
  );
  assert.equal(result.ok, false);
  assert.match(result.error ?? "", /due date/i);
});

test("updateProjectFields: edits are visible via applyProjectOverride", () => {
  const created = createProject(validFields({ name: "Original" }));
  const id = created.projectId!;
  const base = getAddedProjects().find((p) => p.id === id)!;
  updateProjectFields(base, { name: "Renamed" });
  const withOverride = applyProjectOverride(base);
  assert.equal(withOverride.name, "Renamed");
});

test("updateProjectFields: transitioning to completed sets completedAt", () => {
  const created = createProject(validFields());
  const id = created.projectId!;
  const base = getAddedProjects().find((p) => p.id === id)!;
  updateProjectFields(base, { status: "completed" });
  const withOverride = applyProjectOverride(base);
  assert.equal(withOverride.status, "completed");
  assert.ok(withOverride.completedAt);
});

test("updateProjectFields: transitioning away from completed clears completedAt", () => {
  const created = createProject(validFields());
  const id = created.projectId!;
  const base = getAddedProjects().find((p) => p.id === id)!;
  updateProjectFields(base, { status: "completed" });
  updateProjectFields(applyProjectOverride(base), { status: "in_progress" });
  const withOverride = applyProjectOverride(base);
  assert.equal(withOverride.status, "in_progress");
  assert.equal(withOverride.completedAt, undefined);
});

test("updateProjectFields: rejects invalid edits the same way createProject does", () => {
  const created = createProject(validFields());
  const base = getAddedProjects().find((p) => p.id === created.projectId)!;
  const result = updateProjectFields(base, { progressPct: 999 });
  assert.equal(result.ok, false);
});

test("resetProjectOverrides: clears added projects and field overrides", () => {
  const created = createProject(validFields());
  const base = getAddedProjects().find((p) => p.id === created.projectId)!;
  updateProjectFields(base, { name: "Edited" });
  resetProjectOverrides();
  assert.equal(getAddedProjects().length, 0);
});

test("runtime validation: rejects malformed, incomplete, unknown-key, and nonexistent-client payloads", () => {
  assert.equal(createProject(null as unknown as Parameters<typeof createProject>[0]).ok, false);
  assert.equal(
    createProject({ name: "Missing fields" } as unknown as Parameters<typeof createProject>[0]).ok,
    false,
  );
  assert.equal(
    createProject({ ...validFields(), injected: true } as unknown as Parameters<typeof createProject>[0]).ok,
    false,
  );
  assert.equal(createProject(validFields({ clientId: "cl_missing" })).ok, false);
  assert.equal(getAddedProjects().length, 0);
});

test("updateProjectFields: validates date ordering across a partial edit", () => {
  const created = createProject(validFields({ startDate: "2026-10-10", dueDate: "2026-10-20" }));
  const project = getAddedProjects().find((p) => p.id === created.projectId)!;
  assert.equal(updateProjectFields(project, { dueDate: "2026-10-01" }).ok, false);
});
