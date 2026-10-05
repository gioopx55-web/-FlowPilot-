import { getDemoDataset } from "@/data/mock";
import type { Project, TeamMember } from "@/types/entities";

/**
 * Phase 13 AI Assistant — the finite, deterministic intent system
 * (Phase 13 §3). There is no free-form natural-language understanding
 * here: free text is matched against a fixed keyword table below, and
 * anything that doesn't match returns `undefined` so the caller can
 * respond honestly instead of guessing.
 */
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

/** The exact approved quick actions (Phase 13 §2) — same order shown in the AI landing state. */
export const AI_QUICK_ACTIONS: AIQuickAction[] = [
  { intentId: "daily_brief", label: "What needs my attention today?" },
  { intentId: "overdue_tasks", label: "Find overdue tasks" },
  { intentId: "clients_follow_up", label: "Which clients need follow-up?" },
  { intentId: "workload_analysis", label: "Analyze team workload" },
  { intentId: "weekly_report", label: "Generate weekly report" },
];

export const AI_UNSUPPORTED_MESSAGE =
  "I can currently help with project risk, overdue tasks, client follow-up, workload, and weekly summaries.";

/** A record this query should be scoped to, resolved deterministically by name match — never guessed. */
export type AIScope =
  | { kind: "project"; id: string }
  | { kind: "team_member"; id: string };

export interface AIMatchResult {
  intentId: AIIntentId;
  /** Resolved only when the input (or the caller-supplied active scope) names a real record. */
  scope?: AIScope;
  /** True when the matched intent needs a project/member but none could be resolved. */
  needsScope?: boolean;
}

function normalize(input: string): string {
  return input.trim().toLowerCase();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Case-insensitive match against a real entity's full name OR any one
 * of its individual name words (so "why is Sana overloaded" resolves
 * Sana Iyer by first name alone) — still never fuzzy/approximate: a
 * name word only matches as a whole word, not as a substring of a
 * longer word.
 */
function textNamesEntity(text: string, name: string): boolean {
  const lowerName = name.toLowerCase();
  if (text.includes(lowerName)) return true;
  return lowerName
    .split(/\s+/)
    .filter((word) => word.length >= 3)
    .some((word) => new RegExp(`\\b${escapeRegExp(word)}\\b`).test(text));
}

function findProjectByNameFragment(text: string): Project | undefined {
  const { projects } = getDemoDataset();
  return projects.find((p) => textNamesEntity(text, p.name));
}

function findTeamMemberByNameFragment(text: string): TeamMember | undefined {
  const { teamMembers } = getDemoDataset();
  return teamMembers.find((m) => textNamesEntity(text, m.name));
}

const SCOPED_INTENTS: ReadonlySet<AIIntentId> = new Set([
  "project_summary",
  "project_risk_explanation",
  "team_member_workload_explanation",
]);

/**
 * Matches free text to one of the 9 supported intents (Phase 13 §3).
 * Keyword rules are checked in a fixed priority order so overlapping
 * words (e.g. "risk" appears in both a global and a project-scoped
 * intent) resolve predictably. `activeScope` is the panel's current
 * contextual scope (set by opening the AI from a Project/Team Member
 * page) — used only as a fallback when the text itself doesn't name a
 * record, never silently substituted when the text names a DIFFERENT
 * record.
 */
export function matchFreeText(rawInput: string, activeScope?: AIScope): AIMatchResult | undefined {
  const text = normalize(rawInput);
  if (!text) return undefined;

  const namedProject = findProjectByNameFragment(text);
  const namedMember = findTeamMemberByNameFragment(text);

  // Project-scoped intents checked first, since they're the most specific.
  if (namedProject && (text.includes("summar"))) {
    return { intentId: "project_summary", scope: { kind: "project", id: namedProject.id } };
  }
  if (namedProject && (text.includes("risk") || text.includes("why"))) {
    return {
      intentId: "project_risk_explanation",
      scope: { kind: "project", id: namedProject.id },
    };
  }
  if (namedMember && (text.includes("workload") || text.includes("overload") || text.includes("capacity") || text.includes("why"))) {
    return {
      intentId: "team_member_workload_explanation",
      scope: { kind: "team_member", id: namedMember.id },
    };
  }

  if (text.includes("summar")) {
    const scope = activeScope?.kind === "project" ? activeScope : undefined;
    return scope
      ? { intentId: "project_summary", scope }
      : { intentId: "project_summary", needsScope: true };
  }

  if (text.includes("weekly") || (text.includes("report") && text.includes("week"))) {
    return { intentId: "weekly_report" };
  }

  if (text.includes("overdue")) {
    return { intentId: "overdue_tasks" };
  }

  if (text.includes("follow")) {
    return { intentId: "clients_follow_up" };
  }

  if (text.includes("overload") || text.includes("workload") || text.includes("capacity")) {
    const scope = activeScope?.kind === "team_member" ? activeScope : undefined;
    return scope
      ? { intentId: "team_member_workload_explanation", scope }
      : { intentId: "workload_analysis" };
  }

  if (text.includes("risk")) {
    const scope = activeScope?.kind === "project" ? activeScope : undefined;
    return scope
      ? { intentId: "project_risk_explanation", scope }
      : { intentId: "at_risk_projects" };
  }

  if (text.includes("attention") || text.includes("daily brief") || text.includes("what needs")) {
    return { intentId: "daily_brief" };
  }

  return undefined;
}

export function intentRequiresScope(intentId: AIIntentId): boolean {
  return SCOPED_INTENTS.has(intentId);
}
