import {
  Gauge,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  PackageCheck,
  CircleCheck,
  type LucideIcon,
} from "lucide-react";
import type {
  OnTimeDeliveryResult,
  WorkloadDistributionEntry,
  ProjectRiskDistributionEntry,
  OverdueTrendPoint,
} from "@/domain/analytics";

interface Insight {
  id: string;
  icon: LucideIcon;
  tone: "neutral" | "warning" | "critical" | "success";
  title: string;
  metric: string;
  description: string;
}

const TONE_CLASS: Record<Insight["tone"], string> = {
  neutral: "text-muted-foreground bg-muted",
  warning: "text-[var(--fp-warning)] bg-[var(--fp-warning)]/10",
  critical: "text-[var(--fp-critical)] bg-[var(--fp-critical)]/10",
  success: "text-[var(--fp-success)] bg-[var(--fp-success)]/10",
};

/**
 * Supporting insights (Phase 11 §9, redesigned in the visual-balance
 * pass) — the same plain, condition-gated sentences as before (not a
 * separate AI-generated narrative, still explicitly out of scope),
 * now presented as compact cards: icon, title, the real metric value,
 * and a one-line explanation, instead of a bare bullet list. Only
 * Critical Risk gets the `critical` (strong orange, never red — see
 * DECISIONS.md global red-removal pass) tone — every other insight
 * here is a warning-tier or neutral signal, matching the rest of the
 * product's semantic-color rules. Each insight only appears when its
 * underlying condition is actually true; no data is invented.
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
  const insights: Insight[] = [];

  const overloaded = workload.find((e) => e.band === "Overloaded");
  if (overloaded && overloaded.count > 0) {
    insights.push({
      id: "workload",
      icon: Gauge,
      tone: "warning",
      title: "Team workload",
      metric: String(overloaded.count),
      description: `team member${overloaded.count === 1 ? " is" : "s are"} currently overloaded — see Team for who and why.`,
    });
  }

  const critical = risk.find((e) => e.level === "critical_risk");
  if (critical && critical.count > 0) {
    insights.push({
      id: "risk",
      icon: ShieldAlert,
      tone: "critical",
      title: "Project health",
      metric: String(critical.count),
      description: `active project${critical.count === 1 ? " is" : "s are"} at Critical Risk right now.`,
    });
  }

  const first = overdueTrend[0];
  const last = overdueTrend[overdueTrend.length - 1];
  if (first && last && last.overdueCount !== first.overdueCount) {
    const increased = last.overdueCount > first.overdueCount;
    insights.push({
      id: "trend",
      icon: increased ? TrendingUp : TrendingDown,
      tone: increased ? "warning" : "success",
      title: "Overdue trend",
      metric: `${first.overdueCount} → ${last.overdueCount}`,
      description: increased
        ? "Overdue tasks have increased over the reporting period — worth a closer look above."
        : "Overdue tasks have decreased over the reporting period.",
    });
  }

  if (onTimeDelivery && onTimeDelivery.lateCount > 0) {
    insights.push({
      id: "delivery",
      icon: PackageCheck,
      tone: "warning",
      title: "Delivery",
      metric: `${onTimeDelivery.lateCount}/${onTimeDelivery.completedCount}`,
      description: "of the last completed projects delivered late.",
    });
  }

  if (insights.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-md border border-border bg-[var(--fp-bg-surface)] p-4">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--fp-success)]/10 text-[var(--fp-success)]">
          <CircleCheck className="size-4" aria-hidden="true" />
        </span>
        <p className="text-sm text-muted-foreground">
          No notable operational issues surfaced by the metrics above right now.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {insights.map((insight) => {
        const Icon = insight.icon;
        return (
          <div
            key={insight.id}
            className="rounded-md border border-border bg-[var(--fp-bg-surface)] p-3"
          >
            <div className="flex items-center gap-2">
              <span
                className={`flex size-7 shrink-0 items-center justify-center rounded-full ${TONE_CLASS[insight.tone]}`}
              >
                <Icon className="size-3.5" aria-hidden="true" />
              </span>
              <span className="text-xs font-medium text-muted-foreground">{insight.title}</span>
            </div>
            <p className="mt-2 text-sm text-foreground">
              <span className="font-semibold">{insight.metric}</span>{" "}
              <span className="text-muted-foreground">{insight.description}</span>
            </p>
          </div>
        );
      })}
    </div>
  );
}
