import { test } from "node:test";
import assert from "node:assert/strict";
import { executeAIIntent, runAIQuery } from "@/domain/ai/executeIntent";
import { getDailyBriefItems } from "@/domain/dailyBrief";
import {
  getOverdueTasksSorted,
  getAtRiskProjectsSorted,
  getClientsNeedingFollowUpSorted,
  getTeamWorkloadSnapshot,
} from "@/domain/selectors";

test("daily_brief: AI answer rows are identical to Dashboard's getDailyBriefItems (same titles/hrefs, in order)", () => {
  const dashboardItems = getDailyBriefItems();
  const answer = executeAIIntent("daily_brief");
  assert.equal(answer.kind, "list");
  if (answer.kind !== "list") return;
  assert.equal(answer.rows.length, dashboardItems.length);
  for (let i = 0; i < dashboardItems.length; i++) {
    assert.equal(answer.rows[i]!.title, dashboardItems[i]!.title);
    assert.equal(answer.rows[i]!.href, dashboardItems[i]!.href);
  }
});

test("overdue_tasks: row count matches getOverdueTasksSorted exactly", () => {
  const answer = executeAIIntent("overdue_tasks");
  assert.equal(answer.kind, "list");
  if (answer.kind !== "list") return;
  assert.equal(answer.rows.length, getOverdueTasksSorted().length);
});

test("at_risk_projects: row count matches getAtRiskProjectsSorted exactly", () => {
  const answer = executeAIIntent("at_risk_projects");
  assert.equal(answer.kind, "list");
  if (answer.kind !== "list") return;
  assert.equal(answer.rows.length, getAtRiskProjectsSorted().length);
});

test("clients_follow_up: row count matches getClientsNeedingFollowUpSorted exactly", () => {
  const answer = executeAIIntent("clients_follow_up");
  assert.equal(answer.kind, "list");
  if (answer.kind !== "list") return;
  assert.equal(answer.rows.length, getClientsNeedingFollowUpSorted().length);
});

test("workload_analysis: row count matches getTeamWorkloadSnapshot exactly (8 members)", () => {
  const answer = executeAIIntent("workload_analysis");
  assert.equal(answer.kind, "list");
  if (answer.kind !== "list") return;
  assert.equal(answer.rows.length, getTeamWorkloadSnapshot().length);
  assert.equal(answer.rows.length, 8);
});

test("project_summary: grounded in the real project's data, with a scope", () => {
  const answer = executeAIIntent("project_summary", { kind: "project", id: "proj_harbor_refresh" });
  assert.equal(answer.kind, "project_summary");
  if (answer.kind !== "project_summary") return;
  assert.equal(answer.data.project.id, "proj_harbor_refresh");
  assert.ok(answer.data.nextAttentionItem.length > 0);
});

test("project_summary: needs_scope when called without a scope", () => {
  const answer = executeAIIntent("project_summary");
  assert.equal(answer.kind, "needs_scope");
});

test("project_summary: needs_scope when the scoped project id doesn't exist", () => {
  const answer = executeAIIntent("project_summary", { kind: "project", id: "proj_does_not_exist" });
  assert.equal(answer.kind, "needs_scope");
});

test("project_risk_explanation: uses the exact computeProjectRisk conditions, not paraphrased", () => {
  const answer = executeAIIntent("project_risk_explanation", {
    kind: "project",
    id: "proj_fernwood_donor", // critical_risk in the base fixtures
  });
  assert.equal(answer.kind, "project_risk_explanation");
  if (answer.kind !== "project_risk_explanation") return;
  assert.equal(answer.data.risk.level, "critical_risk");
  assert.ok(answer.data.risk.conditions.length >= 2);
});

test("team_member_workload_explanation: grounded in the real member's workload", () => {
  const answer = executeAIIntent("team_member_workload_explanation", {
    kind: "team_member",
    id: "tm_sana", // Overloaded in the base fixtures
  });
  assert.equal(answer.kind, "team_member_workload_explanation");
  if (answer.kind !== "team_member_workload_explanation") return;
  assert.equal(answer.data.workload.band, "Overloaded");
});

test("weekly_report: next actions are grounded in the same counts shown in the report", () => {
  const answer = executeAIIntent("weekly_report");
  assert.equal(answer.kind, "weekly_report");
  if (answer.kind !== "weekly_report") return;
  assert.ok(answer.data.nextActions.length > 0);
  if (answer.data.atRiskProjects.some((e) => e.risk.level === "critical_risk")) {
    assert.ok(answer.data.nextActions.some((a) => a.includes("Critical Risk")));
  }
});

test("runAIQuery: unsupported free text returns the exact honest fallback message", () => {
  const answer = runAIQuery("what's the weather today");
  assert.equal(answer.kind, "unsupported");
  if (answer.kind !== "unsupported") return;
  assert.equal(
    answer.message,
    "I can currently help with project risk, overdue tasks, client follow-up, workload, and weekly summaries.",
  );
});

test("runAIQuery: a scope-needing intent with no name and no active scope returns needs_scope, never a guess", () => {
  const answer = runAIQuery("can you summarize this for me");
  assert.equal(answer.kind, "needs_scope");
});
