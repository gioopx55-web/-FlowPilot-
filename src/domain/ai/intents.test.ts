import { test } from "node:test";
import assert from "node:assert/strict";
import { matchFreeText, intentRequiresScope } from "@/domain/ai/intents";

test("matchFreeText: matches daily_brief", () => {
  const result = matchFreeText("What needs my attention today?");
  assert.equal(result?.intentId, "daily_brief");
});

test("matchFreeText: matches overdue_tasks", () => {
  const result = matchFreeText("show me overdue tasks");
  assert.equal(result?.intentId, "overdue_tasks");
});

test("matchFreeText: matches clients_follow_up", () => {
  const result = matchFreeText("which clients need follow-up?");
  assert.equal(result?.intentId, "clients_follow_up");
});

test("matchFreeText: matches workload_analysis when no member is named", () => {
  const result = matchFreeText("analyze team workload");
  assert.equal(result?.intentId, "workload_analysis");
  assert.equal(result?.scope, undefined);
});

test("matchFreeText: matches weekly_report", () => {
  const result = matchFreeText("generate weekly report");
  assert.equal(result?.intentId, "weekly_report");
});

test("matchFreeText: matches at_risk_projects for an unscoped risk question", () => {
  const result = matchFreeText("which projects are at risk?");
  assert.equal(result?.intentId, "at_risk_projects");
});

test("matchFreeText: resolves project_risk_explanation by real project name", () => {
  const result = matchFreeText("why is Fleet Dashboard at risk?");
  assert.equal(result?.intentId, "project_risk_explanation");
  assert.equal(result?.scope?.kind, "project");
});

test("matchFreeText: resolves project_summary by real project name", () => {
  const result = matchFreeText("summarize Brand Refresh");
  assert.equal(result?.intentId, "project_summary");
  assert.equal(result?.scope?.kind, "project");
});

test("matchFreeText: resolves team_member_workload_explanation by real member name", () => {
  const result = matchFreeText("why is Sana overloaded?");
  assert.equal(result?.intentId, "team_member_workload_explanation");
  assert.equal(result?.scope?.kind, "team_member");
});

test("matchFreeText: a project-scoped intent falls back to the active scope when no name is given", () => {
  const activeScope = { kind: "project" as const, id: "proj_harbor_refresh" };
  const result = matchFreeText("summarize it", activeScope);
  assert.equal(result?.intentId, "project_summary");
  assert.deepEqual(result?.scope, activeScope);
});

test("matchFreeText: never invents a scope the text doesn't name and no active scope exists", () => {
  const result = matchFreeText("summarize this project");
  assert.equal(result?.intentId, "project_summary");
  assert.equal(result?.scope, undefined);
  assert.equal(result?.needsScope, true);
});

test("matchFreeText: returns undefined for genuinely unrelated input (honest unsupported case)", () => {
  assert.equal(matchFreeText("what's the weather like"), undefined);
  assert.equal(matchFreeText("tell me a joke"), undefined);
  assert.equal(matchFreeText(""), undefined);
});

test("intentRequiresScope: true only for the 3 project/member-scoped intents", () => {
  assert.equal(intentRequiresScope("project_summary"), true);
  assert.equal(intentRequiresScope("project_risk_explanation"), true);
  assert.equal(intentRequiresScope("team_member_workload_explanation"), true);
  assert.equal(intentRequiresScope("daily_brief"), false);
  assert.equal(intentRequiresScope("weekly_report"), false);
});
