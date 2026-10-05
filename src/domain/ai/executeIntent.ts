import { getDailyBriefItems } from "@/domain/dailyBrief";
import {
  getOverdueTasksSorted,
  getAtRiskProjectsSorted,
  getClientsNeedingFollowUpSorted,
  getTeamWorkloadSnapshot,
} from "@/domain/selectors";
import { buildProjectSummary, type AIProjectSummary } from "@/domain/ai/projectSummary";
import {
  buildProjectRiskExplanation,
  type AIProjectRiskExplanation,
} from "@/domain/ai/projectRiskExplanation";
import { buildWorkloadExplanation, type AIWorkloadExplanation } from "@/domain/ai/workloadExplanation";
import { buildWeeklyReport, type AIWeeklyReport } from "@/domain/ai/weeklyReport";
import {
  matchFreeText,
  intentRequiresScope,
  AI_UNSUPPORTED_MESSAGE,
  type AIIntentId,
  type AIScope,
} from "@/domain/ai/intents";

export interface AIResultRow {
  id: string;
  title: string;
  meta: string;
  href: string;
}

export type AIAnswer =
  | { kind: "list"; intentId: AIIntentId; heading: string; rows: AIResultRow[]; emptyMessage: string }
  | { kind: "project_summary"; data: AIProjectSummary }
  | { kind: "project_risk_explanation"; data: AIProjectRiskExplanation }
  | { kind: "team_member_workload_explanation"; data: AIWorkloadExplanation }
  | { kind: "weekly_report"; data: AIWeeklyReport }
  | { kind: "needs_scope"; message: string }
  | { kind: "unsupported"; message: string };

function listAnswer(
  intentId: AIIntentId,
  heading: string,
  rows: AIResultRow[],
  emptyMessage: string,
): AIAnswer {
  return { kind: "list", intentId, heading, rows, emptyMessage };
}

/**
 * Runs one supported intent against the live demo dataset and returns
 * an already-structured answer (Phase 13 §5) — components only
 * render this, they never decide what counts as "at risk" or
 * "overloaded" themselves (Phase 13 §4/§23).
 */
export function executeAIIntent(intentId: AIIntentId, scope?: AIScope): AIAnswer {
  switch (intentId) {
    case "daily_brief": {
      const items = getDailyBriefItems();
      return listAnswer(
        intentId,
        "Daily Brief",
        items.map((item) => ({
          id: item.id,
          title: item.title,
          meta: item.description,
          href: item.href,
        })),
        "Nothing urgent right now — everything is on track.",
      );
    }

    case "overdue_tasks": {
      const entries = getOverdueTasksSorted();
      return listAnswer(
        intentId,
        "Overdue Tasks",
        entries.map((e) => ({
          id: e.task.id,
          title: e.task.title,
          meta: `${e.project?.name ?? "Unknown project"} · ${e.assignee?.name ?? "Unassigned"} · ${e.daysOverdue} day${e.daysOverdue === 1 ? "" : "s"} overdue`,
          href: `/tasks/${e.task.id}`,
        })),
        "No overdue tasks right now.",
      );
    }

    case "at_risk_projects": {
      const entries = getAtRiskProjectsSorted();
      return listAnswer(
        intentId,
        "At-Risk Projects",
        entries.map((e) => ({
          id: e.project.id,
          title: e.project.name,
          meta: `${e.risk.level === "critical_risk" ? "Critical Risk" : "At Risk"} · ${e.client?.name ?? "Unknown client"} · ${e.project.progressPct}% complete`,
          href: `/projects/${e.project.id}`,
        })),
        "No projects are currently at risk.",
      );
    }

    case "clients_follow_up": {
      const entries = getClientsNeedingFollowUpSorted();
      return listAnswer(
        intentId,
        "Clients Needing Follow-Up",
        entries.map((e) => ({
          id: e.client.id,
          title: e.client.name,
          meta:
            e.status.daysSinceLastInteraction !== undefined
              ? `No contact in ${e.status.daysSinceLastInteraction} days`
              : "No interaction logged yet",
          href: `/clients/${e.client.id}`,
        })),
        "No clients need follow-up right now.",
      );
    }

    case "workload_analysis": {
      const entries = getTeamWorkloadSnapshot();
      return listAnswer(
        intentId,
        "Team Workload",
        entries.map((e) => ({
          id: e.member.id,
          title: e.member.name,
          meta: `${e.workload.band} · ${Math.round(e.workload.workloadPct)}% · ${e.workload.assignedHours}h / ${e.workload.weeklyCapacityHours}h`,
          href: `/team/${e.member.id}`,
        })),
        "No team members found.",
      );
    }

    case "project_summary": {
      if (!scope || scope.kind !== "project") {
        return {
          kind: "needs_scope",
          message:
            "Open this from a specific project page, or ask again naming the project (e.g. \"Summarize Brand Refresh\").",
        };
      }
      const data = buildProjectSummary(scope.id);
      if (!data) {
        return { kind: "needs_scope", message: "I couldn't find that project." };
      }
      return { kind: "project_summary", data };
    }

    case "project_risk_explanation": {
      if (!scope || scope.kind !== "project") {
        return {
          kind: "needs_scope",
          message:
            "Open this from a specific project page, or ask again naming the project (e.g. \"Why is Brand Refresh at risk?\").",
        };
      }
      const data = buildProjectRiskExplanation(scope.id);
      if (!data) {
        return { kind: "needs_scope", message: "I couldn't find that project." };
      }
      return { kind: "project_risk_explanation", data };
    }

    case "team_member_workload_explanation": {
      if (!scope || scope.kind !== "team_member") {
        return {
          kind: "needs_scope",
          message:
            "Open this from a specific team member's page, or ask again naming them (e.g. \"Why is Sana overloaded?\").",
        };
      }
      const data = buildWorkloadExplanation(scope.id);
      if (!data) {
        return { kind: "needs_scope", message: "I couldn't find that team member." };
      }
      return { kind: "team_member_workload_explanation", data };
    }

    case "weekly_report": {
      return { kind: "weekly_report", data: buildWeeklyReport() };
    }

    default:
      return { kind: "unsupported", message: AI_UNSUPPORTED_MESSAGE };
  }
}

/**
 * The free-text entry point (Phase 13 §3): normalize → match → run,
 * or respond honestly when nothing matches. Never calls
 * `executeAIIntent` with a guessed intent.
 */
export function runAIQuery(rawInput: string, activeScope?: AIScope): AIAnswer {
  const match = matchFreeText(rawInput, activeScope);
  if (!match) {
    return { kind: "unsupported", message: AI_UNSUPPORTED_MESSAGE };
  }
  if (match.needsScope || (intentRequiresScope(match.intentId) && !match.scope)) {
    return executeAIIntent(match.intentId, undefined);
  }
  return executeAIIntent(match.intentId, match.scope);
}
