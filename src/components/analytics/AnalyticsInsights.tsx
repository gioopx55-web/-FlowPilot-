import type {
  OnTimeDeliveryResult,
  WorkloadDistributionEntry,
  ProjectRiskDistributionEntry,
  OverdueTrendPoint,
} from "@/domain/analytics";

/**
 * Supporting textual insights (Phase 11 §9) — plain sentences derived
 * from the same section data above, not a separate AI-generated
 * narrative (explicitly out of scope, Phase 11 §20). Each sentence
 * only appears when its underlying condition is actually true.
 */
export function AnalyticsInsights({
  onTimeDelivery,
  workload,
  risk,
  overdueTrend,
}: {
  onTimeDelivery: OnTimeDeliveryResult | undefined;
  workload: WorkloadDistributionEntry[];
  risk: ProjectRiskDistributionEntry[];
  overdueTrend: OverdueTrendPoint[];
}) {
  const insights: string[] = [];

  const overloaded = workload.find((e) => e.band === "Overloaded");
  if (overloaded && overloaded.count > 0) {
    insights.push(
      `${overloaded.count} team member${overloaded.count === 1 ? " is" : "s are"} currently overloaded — see Team for who and why.`,
    );
  }

  const critical = risk.find((e) => e.level === "critical_risk");
  if (critical && critical.count > 0) {
    insights.push(
      `${critical.count} active project${critical.count === 1 ? " is" : "s are"} at Critical Risk right now.`,
    );
  }

  const first = overdueTrend[0];
  const last = overdueTrend[overdueTrend.length - 1];
  if (first && last) {
    if (last.overdueCount > first.overdueCount) {
      insights.push(
        `Overdue tasks have increased over the reporting period (${first.overdueCount} → ${last.overdueCount}) — worth a closer look at the Overdue Task Trend above.`,
      );
    } else if (last.overdueCount < first.overdueCount) {
      insights.push(
        `Overdue tasks have decreased over the reporting period (${first.overdueCount} → ${last.overdueCount}).`,
      );
    }
  }

  if (onTimeDelivery && onTimeDelivery.lateCount > 0) {
    insights.push(
      `${onTimeDelivery.lateCount} of the last ${onTimeDelivery.completedCount} completed projects delivered late.`,
    );
  }

  if (insights.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No notable operational issues surfaced by the metrics above right now.
      </p>
    );
  }

  return (
    <ul className="list-inside list-disc space-y-1.5 text-sm text-foreground">
      {insights.map((insight) => (
        <li key={insight}>{insight}</li>
      ))}
    </ul>
  );
}
