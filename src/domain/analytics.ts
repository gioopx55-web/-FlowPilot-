import type { Project, ProjectStatus, RiskLevel } from "@/types/entities";
import { getDemoDataset } from "@/data/mock";
import { getProjectRisk, getTeamWorkloadSnapshot, type TeamWorkloadEntry } from "@/domain/selectors";
import type { WorkloadBand } from "@/domain/workload/workload";
import { demoToday } from "@/lib/demo-clock";

/**
 * Phase 11 analytics domain layer (PROJECT_PLAN.md §27). Every
 * function here reads `getDemoDataset()` and/or an existing selector
 * — never recomputes risk, workload, or follow-up logic, and never
 * invents a number. Chart components receive only the already-shaped
 * data these functions return; no chart computes anything itself.
 *
 * CURRENT-STATE vs HISTORICAL (Phase 11 §11): every function here
 * except `getOverdueTaskTrend` reflects live current state and
 * changes immediately when a Phase 9/10 mutation changes the
 * underlying tasks/projects/clients (proven by
 * analytics.integration.test.ts). `getOverdueTaskTrend` reconstructs
 * a real past trend from each task's current `dueDate`/`completedAt`
 * — see that function's own comment for the exact method and its one
 * documented simplification.
 */

// ---------------------------------------------------------------------
// A. On-Time Delivery Rate
// ---------------------------------------------------------------------

export interface OnTimeDeliveryResult {
  completedCount: number;
  onTimeCount: number;
  lateCount: number;
  onTimePct: number;
}

/**
 * Completed projects, on-time vs late, from real `dueDate`/`completedAt`
 * fields (D-042). A project only counts if it is `completed` AND has
 * both dates recorded — a completed project with no `dueDate` was
 * never committed to a date, so it cannot honestly be scored either
 * way and is excluded from the denominator rather than assumed
 * on-time. Returns `undefined` when there are zero scoreable
 * completed projects — callers must render an "insufficient data"
 * state, never a 0%/100% that implies a real rate was computed.
 */
export function getOnTimeDeliveryRate(): OnTimeDeliveryResult | undefined {
  return computeOnTimeDeliveryRate(getDemoDataset().projects);
}

/**
 * Pure core of `getOnTimeDeliveryRate`, reused unchanged by
 * `domain/landingSnapshot.ts` against the immutable base project list
 * for the public Landing Page — same formula, different input array.
 */
export function computeOnTimeDeliveryRate(projects: Project[]): OnTimeDeliveryResult | undefined {
  const scoreable = projects.filter(
    (p) => p.status === "completed" && p.completedAt !== undefined && p.dueDate !== undefined,
  );
  if (scoreable.length === 0) return undefined;

  let onTimeCount = 0;
  for (const project of scoreable) {
    if (project.completedAt! <= project.dueDate!) onTimeCount += 1;
  }
  const completedCount = scoreable.length;
  const lateCount = completedCount - onTimeCount;

  return {
    completedCount,
    onTimeCount,
    lateCount,
    onTimePct: Math.round((onTimeCount / completedCount) * 100),
  };
}

// ---------------------------------------------------------------------
// B. Workload Distribution
// ---------------------------------------------------------------------

export interface WorkloadDistributionEntry {
  band: WorkloadBand;
  count: number;
}

const WORKLOAD_BAND_ORDER: WorkloadBand[] = ["Available", "Healthy", "High", "Overloaded"];

/**
 * Team members bucketed by workload band — uses the exact same
 * `getTeamWorkloadSnapshot` (and therefore `computeTeamMemberWorkload`)
 * Dashboard and Team already read. No workload math lives here.
 */
export function getWorkloadDistribution(): WorkloadDistributionEntry[] {
  return computeWorkloadDistribution(getTeamWorkloadSnapshot());
}

/**
 * Pure core of `getWorkloadDistribution`, reused unchanged by
 * `domain/landingSnapshot.ts` against an immutable team-workload
 * snapshot for the public Landing Page — same bucketing, different
 * input array.
 */
export function computeWorkloadDistribution(
  snapshot: TeamWorkloadEntry[],
): WorkloadDistributionEntry[] {
  const counts: Record<WorkloadBand, number> = {
    Available: 0,
    Healthy: 0,
    High: 0,
    Overloaded: 0,
  };
  for (const { workload } of snapshot) counts[workload.band] += 1;
  return WORKLOAD_BAND_ORDER.map((band) => ({ band, count: counts[band] }));
}

// ---------------------------------------------------------------------
// C. Overdue Task Trend
// ---------------------------------------------------------------------

export interface OverdueTrendPoint {
  /** ISO instant this point represents (demo "today" minus N weeks). */
  date: string;
  overdueCount: number;
}

/**
 * Reconstructs a REAL historical overdue-task-count trend from each
 * task's own `dueDate`/`completedAt` fields — no synthetic/randomized
 * history fixture was added (Phase 11 §1C/§4). For each past weekly
 * checkpoint `d`, a task counts as overdue-as-of-`d` if its `dueDate`
 * was already before `d` AND it was not yet completed by `d`
 * (`completedAt` undefined, or after `d`) — exactly mirroring
 * `getOverdueTasks()`'s current-day definition, just evaluated at an
 * earlier instant. At `d = today` this produces the identical count
 * `getOverdueTasks()` returns (proven by
 * analytics.integration.test.ts).
 *
 * One documented simplification: this uses each task's and project's
 * CURRENT `dueDate`/status, not a full field-change history (V1 does
 * not store one — see DECISIONS.md D-042). A task whose due date was
 * edited after the fact is reconstructed using its latest due date
 * for all past points, not whatever it was originally. This is a
 * reasonable approximation for a demo trend, not an audited record.
 */
export function getOverdueTaskTrend(weeks = 8): OverdueTrendPoint[] {
  const { tasks, projects } = getDemoDataset();
  const excludedProjectIds = new Set(
    projects.filter((p) => p.status === "completed" || p.status === "on_hold").map((p) => p.id),
  );
  const relevantTasks = tasks.filter(
    (t) => t.dueDate !== undefined && !excludedProjectIds.has(t.projectId),
  );

  const today = demoToday();
  const points: OverdueTrendPoint[] = [];
  for (let weeksAgo = weeks - 1; weeksAgo >= 0; weeksAgo -= 1) {
    const checkpoint = new Date(today);
    checkpoint.setUTCDate(checkpoint.getUTCDate() - weeksAgo * 7);
    const checkpointMs = checkpoint.getTime();

    let overdueCount = 0;
    for (const task of relevantTasks) {
      const dueMs = new Date(task.dueDate!).getTime();
      if (dueMs >= checkpointMs) continue;
      if (task.completedAt !== undefined && new Date(task.completedAt).getTime() <= checkpointMs) {
        continue;
      }
      overdueCount += 1;
    }
    points.push({ date: checkpoint.toISOString(), overdueCount });
  }
  return points;
}

// ---------------------------------------------------------------------
// D. Project Status Distribution
// ---------------------------------------------------------------------

export interface ProjectStatusDistributionEntry {
  status: ProjectStatus;
  count: number;
}

const PROJECT_STATUS_ORDER: ProjectStatus[] = [
  "kickoff",
  "in_progress",
  "review",
  "completed",
  "on_hold",
];

export function getProjectStatusDistribution(): ProjectStatusDistributionEntry[] {
  const { projects } = getDemoDataset();
  const counts: Record<ProjectStatus, number> = {
    kickoff: 0,
    in_progress: 0,
    review: 0,
    completed: 0,
    on_hold: 0,
  };
  for (const project of projects) counts[project.status] += 1;
  return PROJECT_STATUS_ORDER.map((status) => ({ status, count: counts[status] }));
}

// ---------------------------------------------------------------------
// Optional: Project Risk Distribution
// ---------------------------------------------------------------------

export interface ProjectRiskDistributionEntry {
  level: RiskLevel;
  count: number;
}

const RISK_LEVEL_ORDER: RiskLevel[] = ["none", "at_risk", "critical_risk"];

/**
 * Risk levels across ACTIVE projects only (excludes `completed`/
 * `on_hold`, same exclusion `computeProjectRisk` itself already
 * enforces) — a distribution that lumped "done" and "paused" projects
 * into the "none" bucket alongside genuinely healthy active work would
 * answer a different, less useful question than "are active projects
 * healthy."
 */
export function getProjectRiskDistribution(): ProjectRiskDistributionEntry[] {
  const { projects } = getDemoDataset();
  const active = projects.filter((p) => p.status !== "completed" && p.status !== "on_hold");
  const counts: Record<RiskLevel, number> = { none: 0, at_risk: 0, critical_risk: 0 };
  for (const project of active) counts[getProjectRisk(project.id).level] += 1;
  return RISK_LEVEL_ORDER.map((level) => ({ level, count: counts[level] }));
}

// ---------------------------------------------------------------------
// Optional: Average progress across active projects
// ---------------------------------------------------------------------

/**
 * Average `progressPct` across active (non-completed/non-on_hold)
 * projects — "are projects progressing?" Returns `undefined` when
 * there are no active projects (insufficient data, not 0%).
 */
export function getActiveProjectAverageProgress(): number | undefined {
  const { projects } = getDemoDataset();
  const active = projects.filter((p) => p.status !== "completed" && p.status !== "on_hold");
  if (active.length === 0) return undefined;
  const total = active.reduce((sum, p) => sum + p.progressPct, 0);
  return Math.round(total / active.length);
}
