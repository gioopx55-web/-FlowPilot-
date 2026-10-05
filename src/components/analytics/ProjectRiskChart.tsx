"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ProjectRiskDistributionEntry } from "@/domain/analytics";
import { RISK_LEVEL_COLOR, RISK_LEVEL_LABEL, CHART_GRID, CHART_AXIS_TEXT } from "@/components/analytics/analyticsColors";
import { ChartTooltip } from "@/components/analytics/charts/ChartTooltip";
import { useReducedMotion } from "@/lib/useReducedMotion";

const axisTick = { fill: CHART_AXIS_TEXT, fontSize: 12 };

/**
 * Project Risk Distribution (Phase 11 §2, optional metric). Active
 * projects only — `getProjectRiskDistribution` already excludes
 * completed/on_hold (same exclusion `computeProjectRisk` enforces).
 * Colors match `RiskBadge` exactly.
 */
export function ProjectRiskChart({
  distribution,
}: {
  distribution: ProjectRiskDistributionEntry[];
}) {
  const reducedMotion = useReducedMotion();
  const total = distribution.reduce((sum, e) => sum + e.count, 0);
  const chartData = distribution.map((e) => ({ ...e, label: RISK_LEVEL_LABEL[e.level] }));

  return (
    <div>
      <div dir="ltr" className="h-[180px] w-full" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          {/* accessibilityLayer={false}: see OverdueTrendChart.tsx's
              comment — Recharts v3's own focus/role layer conflicts with
              this wrapper's aria-hidden (Phase 17 axe finding). */}
          <BarChart
            data={chartData}
            margin={{ left: 0, right: 16, top: 8 }}
            accessibilityLayer={false}
          >
            <CartesianGrid vertical={false} stroke={CHART_GRID} />
            <XAxis dataKey="label" tick={axisTick} axisLine={{ stroke: CHART_GRID }} tickLine={false} />
            <YAxis allowDecimals={false} tick={axisTick} axisLine={{ stroke: CHART_GRID }} tickLine={false} width={28} />
            <Tooltip content={(props) => <ChartTooltip {...props} />} cursor={{ fill: "var(--fp-accent-subtle-bg)" }} />
            <Bar dataKey="count" name="Projects" radius={[4, 4, 0, 0]} isAnimationActive={!reducedMotion}>
              {chartData.map((entry) => (
                <Cell key={entry.level} fill={RISK_LEVEL_COLOR[entry.level]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="sr-only">
        Risk levels across {total} active project{total === 1 ? "" : "s"}:{" "}
        {distribution.map((e) => `${RISK_LEVEL_LABEL[e.level]} ${e.count}`).join(", ")}.
      </p>
    </div>
  );
}
