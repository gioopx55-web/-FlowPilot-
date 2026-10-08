import type { Activity, ProjectStatus } from "@/types/entities";
import type {
  ProjectListEntry,
  AtRiskProjectEntry,
  ClientListEntry,
  ClientFollowUpEntry,
  TeamWorkloadEntry,
} from "@/domain/selectors";
import type { DailyBriefItem, DailyBriefItemKind } from "@/domain/dailyBrief";

/**
 * Marketing-only data CURATION for the public Landing Page.
 *
 * Every function here only SELECTS from real selector output already
 * computed by the real, unmodified domain layer (`domain/selectors.ts`,
 * `domain/dailyBrief.ts`) — nothing here recomputes risk, workload, or
 * follow-up, and nothing here invents a record that doesn't exist in
 * the demo dataset. The authenticated app (Dashboard/Projects/Clients/
 * Team/Analytics) is untouched and keeps showing the real, worst-first
 * ranked lists exactly as before.
 *
 * The reason this file exists: those real lists are deliberately
 * worst-first (so the *product* surfaces the worst problem first) —
 * exactly the wrong property for a public marketing page, where a
 * naive `.slice(0, N)` of a worst-first list makes a calm, well-run
 * demo workspace look like an incident report. These helpers pick a
 * representative MIX — mostly healthy/normal real records, with at
 * most one real attention example — so the Landing Page communicates
 * "FlowPilot keeps operations healthy," not "everything is broken."
 */

const ACTIVE_STATUSES: ProjectStatus[] = ["kickoff", "in_progress", "review"];

/** Up to `count - 1` calm items plus at most one real attention example, never fabricated. */
function pickMostlyCalm<T>(calm: T[], attention: T[], count: number): T[] {
  const picked = calm.slice(0, Math.max(count - 1, 0));
  if (attention[0] && !picked.includes(attention[0])) picked.push(attention[0]);
  return picked.slice(0, count);
}

/** Real projects with zero risk flags, excluding completed/on-hold (not meaningful "on track" examples). */
export function pickHealthyProjects(
  allProjects: ProjectListEntry[],
  count: number,
): ProjectListEntry[] {
  return allProjects
    .filter((e) => e.risk.level === "none" && ACTIVE_STATUSES.includes(e.project.status))
    .slice(0, count);
}

/** Mostly on-track projects, with at most one real at-risk example — prefers "At Risk" over "Critical Risk" so the worst case isn't the one shown. */
export function pickProjectHealthExamples(
  allProjects: ProjectListEntry[],
  count: number,
): ProjectListEntry[] {
  const calm = allProjects.filter(
    (e) => e.risk.level === "none" && ACTIVE_STATUSES.includes(e.project.status),
  );
  const atRisk = allProjects.filter((e) => e.risk.level !== "none");
  const softest = atRisk.find((e) => e.risk.level === "at_risk") ?? atRisk[0];
  return pickMostlyCalm(calm, softest ? [softest] : [], count);
}

/** One real at-risk project example, preferring "At Risk" over "Critical Risk". */
export function pickMarketingRiskExample(
  atRiskEntries: AtRiskProjectEntry[],
): AtRiskProjectEntry | undefined {
  return atRiskEntries.find((e) => e.risk.level === "at_risk") ?? atRiskEntries[0];
}

/** Mostly "up to date" clients, with at most one real "needs follow-up" example mixed in. */
export function pickMarketingClients(
  allClients: ClientListEntry[],
  count: number,
): ClientFollowUpEntry[] {
  const upToDate = allClients.filter((e) => !e.followUp.needsFollowUp);
  const needsFollowUp = allClients.filter((e) => e.followUp.needsFollowUp);
  return pickMostlyCalm(upToDate, needsFollowUp, count).map((e) => ({
    client: e.client,
    status: e.followUp,
  }));
}

/** Mostly Available/Healthy teammates, with at most one High-or-Overloaded example mixed in. */
export function pickMarketingTeam(
  allMembers: TeamWorkloadEntry[],
  count: number,
): TeamWorkloadEntry[] {
  const calm = allMembers.filter(
    (e) => e.workload.band === "Available" || e.workload.band === "Healthy",
  );
  const attention = allMembers.filter(
    (e) => e.workload.band === "High" || e.workload.band === "Overloaded",
  );
  return pickMostlyCalm(calm, attention, count);
}

// Softer-first order for the single Hero/AttentionShowcase attention
// example — a follow-up or overdue item reads as "routine operational
// nudge," while Critical Risk reads as "the system is on fire." Both
// are real; this only controls which one gets the single attention
// slot when more than one exists.
const ATTENTION_PRIORITY: DailyBriefItemKind[] = [
  "follow_up",
  "overdue_task",
  "overloaded_member",
  "at_risk",
  "critical_risk",
];

/** The single least-alarming real Daily Brief signal available. */
export function pickSingleAttentionItem(items: DailyBriefItem[]): DailyBriefItem | undefined {
  for (const kind of ATTENTION_PRIORITY) {
    const match = items.find((item) => item.kind === kind);
    if (match) return match;
  }
  return undefined;
}

export interface HeroSnapshot {
  healthyProjects: ProjectListEntry[];
  attentionItem: DailyBriefItem | undefined;
  onTimeDeliveryPct: number | undefined;
  teamHealthyCount: number;
  teamTotalCount: number;
  onTrackProjectCount: number;
}

/**
 * Assembles the Hero's "workspace snapshot" (brief §2): up to 2 real
 * on-track projects, the single softest real attention item, and two
 * real summary metrics — never more than one warning-tier item in
 * the whole snapshot.
 */
export function buildHeroSnapshot(params: {
  allProjects: ProjectListEntry[];
  briefItems: DailyBriefItem[];
  workloadEntries: TeamWorkloadEntry[];
  onTimeDeliveryPct: number | undefined;
}): HeroSnapshot {
  const onTrack = params.allProjects.filter(
    (e) => e.risk.level === "none" && ACTIVE_STATUSES.includes(e.project.status),
  );
  const healthyBand = (band: TeamWorkloadEntry["workload"]["band"]) =>
    band === "Available" || band === "Healthy";

  return {
    healthyProjects: onTrack.slice(0, 2),
    attentionItem: pickSingleAttentionItem(params.briefItems),
    onTimeDeliveryPct: params.onTimeDeliveryPct,
    teamHealthyCount: params.workloadEntries.filter((e) => healthyBand(e.workload.band)).length,
    teamTotalCount: params.workloadEntries.length,
    onTrackProjectCount: onTrack.length,
  };
}

export interface MarketingBriefItem {
  id: string;
  tone: "success" | "neutral" | "warning";
  title: string;
  description: string;
}

/**
 * A balanced, mixed-entity "what's happening" preview for the
 * Landing Page (brief §3) — unlike the real `DailyBrief` component
 * (which only ever surfaces attention items, by design, for the real
 * product), this draws one example each from several different real,
 * healthy signals plus a single real attention item, so the page
 * reads as "operations are healthy" rather than "everything needs
 * attention." Any slot without a real record to show is simply
 * omitted — nothing here is invented.
 */
export function buildMarketingDailyBrief(params: {
  healthyProject: ProjectListEntry | undefined;
  upToDateClient: ClientListEntry | undefined;
  completedActivity: Activity | undefined;
  healthyMember: TeamWorkloadEntry | undefined;
  attentionItem: DailyBriefItem | undefined;
}): MarketingBriefItem[] {
  const items: MarketingBriefItem[] = [];

  if (params.healthyProject) {
    const { project, client } = params.healthyProject;
    items.push({
      id: `brief_project_${project.id}`,
      tone: "success",
      title: `${project.name} is on track`,
      description: `${client?.name ?? "Client"} · ${project.progressPct}% complete`,
    });
  }

  if (params.upToDateClient) {
    const { client, followUp } = params.upToDateClient;
    items.push({
      id: `brief_client_${client.id}`,
      tone: "neutral",
      title: `${client.name} is up to date`,
      description:
        followUp.daysSinceLastInteraction !== undefined
          ? `Last contacted ${followUp.daysSinceLastInteraction} days ago`
          : "No follow-up needed right now",
    });
  }

  if (params.completedActivity) {
    items.push({
      id: `brief_activity_${params.completedActivity.id}`,
      tone: "success",
      title: "Work completed",
      description: params.completedActivity.summary,
    });
  }

  if (params.healthyMember) {
    const { member, workload } = params.healthyMember;
    items.push({
      id: `brief_member_${member.id}`,
      tone: "neutral",
      title: `${member.name} is ${workload.band}`,
      description: `${Math.round(workload.workloadPct)}% of weekly capacity`,
    });
  }

  if (params.attentionItem) {
    items.push({
      id: `brief_attention_${params.attentionItem.id}`,
      tone: "warning",
      title: params.attentionItem.title,
      description: params.attentionItem.description,
    });
  }

  return items;
}
