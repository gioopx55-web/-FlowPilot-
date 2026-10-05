import type { WorkloadDistributionEntry } from "@/domain/analytics";
import type { OnTimeDeliveryResult } from "@/domain/analytics";
import { ShowcaseLayout } from "@/components/marketing/ShowcaseLayout";
import { PreviewCard, PreviewCardHeader } from "@/components/marketing/PreviewCard";
import { OnTimeDeliveryCard } from "@/components/analytics/OnTimeDeliveryCard";
import { WORKLOAD_BAND_COLOR } from "@/components/analytics/analyticsColors";

/**
 * Analytics / visibility (Phase 13.5 §3.9) — reuses the real
 * `OnTimeDeliveryCard` (a plain div-based bar, not a chart library)
 * directly. The workload-distribution bars below are a small
 * CSS-only visualization built for this page specifically, so the
 * public landing bundle never pulls in Recharts (Phase 13.5 §8) —
 * the full interactive charts live only behind `/analytics`.
 */
export function AnalyticsShowcase({
  onTimeDelivery,
  workloadDistribution,
}: {
  onTimeDelivery: OnTimeDeliveryResult | undefined;
  workloadDistribution: WorkloadDistributionEntry[];
}) {
  const maxCount = Math.max(1, ...workloadDistribution.map((e) => e.count));

  return (
    <ShowcaseLayout
      eyebrow="Analytics"
      title="Operational answers, not a wall of charts."
      description="On-time delivery, overdue trend, and workload distribution — the handful of numbers that actually tell you whether the workspace is healthy, each one answering a real question instead of decorating a dashboard."
      bullets={[
        "On-time delivery compares real due dates against real completion dates",
        "No metric renders until there's enough data to mean something",
        "Every chart has a plain-text equivalent, not just a shape to read",
      ]}
      visual={
        <PreviewCard>
          <PreviewCardHeader title="On-Time Delivery" />
          <div className="p-4">
            <OnTimeDeliveryCard result={onTimeDelivery} />
          </div>
          <PreviewCardHeader title="Workload Distribution" />
          <div className="space-y-2 p-4">
            {workloadDistribution.map((entry) => (
              <div key={entry.band} className="flex items-center gap-2 text-xs">
                <span className="w-20 shrink-0 text-muted-foreground">{entry.band}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <span
                    className="block h-full rounded-full"
                    style={{
                      width: `${(entry.count / maxCount) * 100}%`,
                      backgroundColor: WORKLOAD_BAND_COLOR[entry.band],
                    }}
                  />
                </span>
                <span className="w-4 shrink-0 text-end text-muted-foreground">{entry.count}</span>
              </div>
            ))}
          </div>
        </PreviewCard>
      }
    />
  );
}
