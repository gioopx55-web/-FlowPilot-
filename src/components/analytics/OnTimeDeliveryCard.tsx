import type { OnTimeDeliveryResult } from "@/domain/analytics";

/**
 * On-Time Delivery Rate (Phase 11 §1A). A plain two-segment bar, not
 * a pie chart (Phase 11 §6 discourages pie-chart clutter for a single
 * proportion) — built from div widths, not Recharts, so the exact
 * numbers are real DOM text content, not only SVG-rendered pixels.
 * Renders an explicit "not enough data" state rather than a
 * misleading 0%/100% when `result` is `undefined` (Phase 11 §16).
 */
export function OnTimeDeliveryCard({ result }: { result: OnTimeDeliveryResult | undefined }) {
  if (result === undefined) {
    return (
      <p className="text-sm text-muted-foreground">
        Not enough completed projects with both a due date and a delivery date yet to compute an
        on-time delivery rate.
      </p>
    );
  }

  const { completedCount, onTimeCount, lateCount, onTimePct } = result;
  const onTimeWidthPct = completedCount === 0 ? 0 : (onTimeCount / completedCount) * 100;

  return (
    <div>
      <p className="text-3xl font-semibold text-foreground">{onTimePct}%</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {onTimeCount} of {completedCount} completed project{completedCount === 1 ? "" : "s"}{" "}
        delivered on or before their due date ({lateCount} late).
      </p>

      <div
        className="mt-3 flex h-2 w-full overflow-hidden rounded-full bg-muted"
        role="img"
        aria-label={`${onTimePct}% delivered on time: ${onTimeCount} on time, ${lateCount} late`}
      >
        <div
          className="h-full"
          style={{ width: `${onTimeWidthPct}%`, backgroundColor: "var(--fp-success)" }}
        />
        <div
          className="h-full"
          style={{ width: `${100 - onTimeWidthPct}%`, backgroundColor: "var(--fp-danger)" }}
        />
      </div>
    </div>
  );
}
