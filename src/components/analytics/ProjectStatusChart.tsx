"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ProjectStatusDistributionEntry } from "@/domain/analytics";
import { PROJECT_STATUS_LABEL } from "@/components/projects/projectLabels";
import { CHART_ACCENT, CHART_GRID, CHART_AXIS_TEXT } from "@/components/analytics/analyticsColors";
import { ChartTooltip } from "@/components/analytics/charts/ChartTooltip";
import { useReducedMotion } from "@/lib/useReducedMotion";

const axisTick = { fill: CHART_AXIS_TEXT, fontSize: 12 };

/**
 * Project Status Distribution (Phase 11 §1D). A single-color bar
 * chart — status is already distinguished by its axis label, so a
 * per-bar color would add nothing but visual noise (Phase 11 §6).
 */
export function ProjectStatusChart({
  distribution,
}: {
  distribution: ProjectStatusDistributionEntry[];
}) {
  const reducedMotion = useReducedMotion();
  const total = distribution.reduce((sum, e) => sum + e.count, 0);
  const chartData = distribution.map((e) => ({ ...e, label: PROJECT_STATUS_LABEL[e.status] }));

  return (
    <div>
      <div dir="ltr" className="h-[200px] w-full" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ left: 0, right: 16, top: 8 }}>
            <CartesianGrid vertical={false} stroke={CHART_GRID} />
            <XAxis dataKey="label" tick={axisTick} axisLine={{ stroke: CHART_GRID }} tickLine={false} />
            <YAxis allowDecimals={false} tick={axisTick} axisLine={{ stroke: CHART_GRID }} tickLine={false} width={28} />
            <Tooltip content={(props) => <ChartTooltip {...props} />} cursor={{ fill: "var(--fp-accent-subtle-bg)" }} />
            <Bar
              dataKey="count"
              name="Projects"
              fill={CHART_ACCENT}
              radius={[4, 4, 0, 0]}
              isAnimationActive={!reducedMotion}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="sr-only">
        Project status distribution across {total} project{total === 1 ? "" : "s"}:{" "}
        {distribution.map((e) => `${PROJECT_STATUS_LABEL[e.status]} ${e.count}`).join(", ")}.
      </p>
    </div>
  );
}
