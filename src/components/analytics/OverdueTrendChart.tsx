"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { OverdueTrendPoint } from "@/domain/analytics";
import { CHART_DANGER, CHART_GRID, CHART_AXIS_TEXT } from "@/components/analytics/analyticsColors";
import { ChartTooltip } from "@/components/analytics/charts/ChartTooltip";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { formatShortDate } from "@/lib/format";

const axisTick = { fill: CHART_AXIS_TEXT, fontSize: 12 };

/**
 * Overdue Task Trend (Phase 11 §1C). `points` come from
 * `getOverdueTaskTrend` — a real reconstruction from each task's
 * current `dueDate`/`completedAt`, not invented history (see that
 * function's own doc comment). The X axis is chronological left to
 * right regardless of page direction (Phase 11 §13: chronological
 * axes must stay logically understandable, not mirrored).
 */
export function OverdueTrendChart({ points }: { points: OverdueTrendPoint[] }) {
  const reducedMotion = useReducedMotion();
  const chartData = points.map((p) => ({ ...p, label: formatShortDate(p.date) }));
  const first = points[0];
  const last = points[points.length - 1];
  const trendDirection =
    first && last
      ? last.overdueCount > first.overdueCount
        ? "worsened"
        : last.overdueCount < first.overdueCount
          ? "improved"
          : "stayed flat"
      : "unavailable";

  return (
    <div>
      <div dir="ltr" className="h-[220px] w-full" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ left: 0, right: 16, top: 8 }}>
            <CartesianGrid vertical={false} stroke={CHART_GRID} />
            <XAxis dataKey="label" tick={axisTick} axisLine={{ stroke: CHART_GRID }} tickLine={false} />
            <YAxis allowDecimals={false} tick={axisTick} axisLine={{ stroke: CHART_GRID }} tickLine={false} width={28} />
            <Tooltip content={(props) => <ChartTooltip {...props} />} cursor={{ stroke: CHART_GRID }} />
            <Line
              type="monotone"
              dataKey="overdueCount"
              name="Overdue tasks"
              stroke={CHART_DANGER}
              strokeWidth={2}
              dot={{ r: 3, fill: CHART_DANGER }}
              isAnimationActive={!reducedMotion}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        Overdue tasks have {trendDirection} over the last {points.length} weeks
        {first && last ? ` (${first.overdueCount} → ${last.overdueCount})` : ""}.
      </p>
    </div>
  );
}
