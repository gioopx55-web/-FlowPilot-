/** Client-safe AI intent contracts and display metadata (no data/store imports). */
export type AIIntentId =
  | "daily_brief"
  | "overdue_tasks"
  | "at_risk_projects"
  | "clients_follow_up"
  | "workload_analysis"
  | "project_summary"
  | "project_risk_explanation"
  | "team_member_workload_explanation"
  | "weekly_report";

export interface AIQuickAction {
  intentId: AIIntentId;
  label: string;
}

export const AI_QUICK_ACTIONS: AIQuickAction[] = [
  { intentId: "daily_brief", label: "What needs my attention today?" },
  { intentId: "overdue_tasks", label: "Find overdue tasks" },
  { intentId: "clients_follow_up", label: "Which clients need follow-up?" },
  { intentId: "workload_analysis", label: "Analyze team workload" },
  { intentId: "weekly_report", label: "Generate weekly report" },
];

export const AI_UNSUPPORTED_MESSAGE =
  "I can currently help with project risk, overdue tasks, client follow-up, workload, and weekly summaries.";

export type AIScope =
  | { kind: "project"; id: string }
  | { kind: "team_member"; id: string };
