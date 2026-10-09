import type { Activity } from "@/types/entities";
import { getBaseDataset } from "@/data/mock";
import { computeProjectRisk, type ProjectRiskResult } from "@/domain/risk/risk";
import { computeTeamMemberWorkload, type TeamMemberWorkloadResult } from "@/domain/workload/workload";
import { getClientFollowUpStatus } from "@/domain/clients/followUp";
import { daysFromToday } from "@/lib/demo-clock";
import {
  composeDailyBriefItems,
  type DailyBriefItem,
} from "@/domain/dailyBrief";
import {
  computeOnTimeDeliveryRate,
  computeWorkloadDistribution,
  type OnTimeDeliveryResult,
  type WorkloadDistributionEntry,
} from "@/domain/analytics";
import type {
  ProjectListEntry,
  AtRiskProjectEntry,
  OverdueTaskEntry,
  TeamWorkloadEntry,
  ClientListEntry,
} from "@/domain/selectors";
import type { AIAnswer } from "@/domain/ai/executeIntent";

/**
 * Read-only data source for the PUBLIC Landing Page only.
 *
 * Every function here reads `getBaseDataset()` (`data/mock/index.ts`)
 * — the immutable Phase 6 fixtures exactly as authored — and NEVER
 * `getDemoDataset()`/`getDemoStore()` (`domain/demoStore.ts`), the
 * shared, request-mutable registry the authenticated app's Server
 * Actions write to. This means nothing a demo visitor does inside the
 * app (create/edit a project, mark a notification read, change a
 * preference, reset demo data) can ever change what the public
 * marketing page shows — by construction, not by convention, since
 * this file has no code path that can reach mutable state at all.
 *
 * Every actual FORMULA (risk conditions, workload percentage,
 * follow-up staleness, Daily Brief ranking, on-time delivery rate,
 * workload bucketing) is the exact same function the authenticated
 * app uses (`computeProjectRisk`, `computeTeamMemberWorkload`,
 * `getClientFollowUpStatus`, `composeDailyBriefItems`,
 * `computeOnTimeDeliveryRate`, `computeWorkloadDistribution`) —
 * nothing here recomputes a threshold or a percentage. Only the thin
 * selection/sort/filter glue that `domain/selectors.ts` normally
 * provides is mirrored here, because that glue is hardwired to
 * `getDemoDataset()` throughout `domain/selectors.ts` (used by every
 * authenticated page) and was judged too invasive to parameterize
 * app-wide just for this one read-only, low-traffic public page.
 *
 * Fixture CONTENT is never duplicated: every project/client/task/team
 * member below comes from `getBaseDataset()`, i.e. the exact same
 * `data/mock/*.ts` arrays the authenticated app's base dataset uses.
 */

const RISK_LEVEL_RANK: Record<ProjectRiskResult["level"], number> = {
  critical_risk: 0,
  at_risk: 1,
  none: 2,
};

const WORKLOAD_BAND_RANK: Record<TeamMemberWorkloadResult["band"], number> = {
  Overloaded: 0,
  High: 1,
  Healthy: 2,
  Available: 3,
};

export function getImmutableProjectsWithRisk(): ProjectListEntry[] {
  const { projects, tasks, clients } = getBaseDataset();
  return projects.map((project) => ({
    project,
    risk: computeProjectRisk(
      project,
      tasks.filter((t) => t.projectId === project.id),
    ),
    client: clients.find((c) => c.id === project.clientId),
  }));
}

export function getImmutableAtRiskProjectsSorted(): AtRiskProjectEntry[] {
  return getImmutableProjectsWithRisk()
    .filter((e) => e.risk.level !== "none")
    .sort((a, b) => RISK_LEVEL_RANK[a.risk.level] - RISK_LEVEL_RANK[b.risk.level]);
}

export function getImmutableOverdueTasksSorted(): OverdueTaskEntry[] {
  const { tasks, projects, teamMembers } = getBaseDataset();
  const excludedProjectIds = new Set(
    projects.filter((p) => p.status === "completed" || p.status === "on_hold").map((p) => p.id),
  );
  return tasks
    .filter(
      (t) =>
        t.status !== "done" &&
        t.dueDate !== undefined &&
        daysFromToday(t.dueDate) < 0 &&
        !excludedProjectIds.has(t.projectId),
    )
    .map((task) => ({
      task,
      daysOverdue: task.dueDate !== undefined ? -daysFromToday(task.dueDate) : 0,
      project: projects.find((p) => p.id === task.projectId),
      assignee: task.assigneeId ? teamMembers.find((m) => m.id === task.assigneeId) : undefined,
    }))
    .sort((a, b) => b.daysOverdue - a.daysOverdue);
}

export function getImmutableTeamWorkloadSnapshot(): TeamWorkloadEntry[] {
  const { teamMembers, tasks } = getBaseDataset();
  return teamMembers
    .map((member) => ({ member, workload: computeTeamMemberWorkload(member, tasks) }))
    .sort((a, b) => {
      const bandDiff = WORKLOAD_BAND_RANK[a.workload.band] - WORKLOAD_BAND_RANK[b.workload.band];
      return bandDiff !== 0 ? bandDiff : b.workload.workloadPct - a.workload.workloadPct;
    });
}

export function getImmutableClientsWithFollowUp(): ClientListEntry[] {
  const { clients, clientInteractions, projects, tasks } = getBaseDataset();
  return clients
    .map((client) => {
      const followUp = getClientFollowUpStatus(client, clientInteractions);
      const clientProjects = projects.filter((p) => p.clientId === client.id);
      const activeProjectCount = clientProjects.filter(
        (p) => p.status !== "completed" && p.status !== "on_hold",
      ).length;
      const atRiskProjectCount = clientProjects.filter(
        (p) => computeProjectRisk(p, tasks.filter((t) => t.projectId === p.id)).level !== "none",
      ).length;
      return { client, followUp, activeProjectCount, atRiskProjectCount };
    })
    .sort((a, b) => a.client.name.localeCompare(b.client.name));
}

export function getImmutableRecentActivities(limit: number): Activity[] {
  const { activities } = getBaseDataset();
  return [...activities].sort((a, b) => (a.occurredAt < b.occurredAt ? 1 : -1)).slice(0, limit);
}

/** The Daily Brief, ranked by the exact same rule as the authenticated app, against immutable base data only. */
export function getImmutableDailyBriefItems(limit: number): DailyBriefItem[] {
  return composeDailyBriefItems(limit, {
    riskEntries: getImmutableAtRiskProjectsSorted(),
    overdueTasks: getImmutableOverdueTasksSorted(),
    followUps: getImmutableClientsWithFollowUp()
      .filter((e) => e.followUp.needsFollowUp)
      .map((e) => ({ client: e.client, status: e.followUp }))
      .sort(
        (a, b) =>
          (b.status.daysSinceLastInteraction ?? Number.POSITIVE_INFINITY) -
          (a.status.daysSinceLastInteraction ?? Number.POSITIVE_INFINITY),
      ),
    workload: getImmutableTeamWorkloadSnapshot(),
    recentActivities: getImmutableRecentActivities(1),
  });
}

export function getImmutableOnTimeDeliveryRate(): OnTimeDeliveryResult | undefined {
  return computeOnTimeDeliveryRate(getBaseDataset().projects);
}

export function getImmutableWorkloadDistribution(): WorkloadDistributionEntry[] {
  return computeWorkloadDistribution(getImmutableTeamWorkloadSnapshot());
}

export function getImmutableTasks() {
  return getBaseDataset().tasks;
}

/**
 * The same "Clients Needing Follow-Up" list shape
 * `executeAIIntent("clients_follow_up")` returns (used by the real AI
 * Assistant panel), built from immutable data instead of calling the
 * live intent executor — AIShowcase demonstrates the real AI answer
 * FORMAT the product uses, without the Landing Page depending on
 * `getDemoDataset()` to produce it. The mapping below is copied from
 * `domain/ai/executeIntent.ts`'s `"clients_follow_up"` case verbatim,
 * not reinvented.
 */
export function getImmutableClientsFollowUpAnswer(): AIAnswer {
  const entries = getImmutableClientsWithFollowUp()
    .filter((e) => e.followUp.needsFollowUp)
    .sort(
      (a, b) =>
        (b.followUp.daysSinceLastInteraction ?? Number.POSITIVE_INFINITY) -
        (a.followUp.daysSinceLastInteraction ?? Number.POSITIVE_INFINITY),
    );
  return {
    kind: "list",
    intentId: "clients_follow_up",
    heading: "Clients Needing Follow-Up",
    rows: entries.map((e) => ({
      id: e.client.id,
      title: e.client.name,
      meta:
        e.followUp.daysSinceLastInteraction !== undefined
          ? `No contact in ${e.followUp.daysSinceLastInteraction} days`
          : "No interaction logged yet",
      href: `/clients/${e.client.id}`,
    })),
    emptyMessage: "No clients need follow-up right now.",
  };
}
