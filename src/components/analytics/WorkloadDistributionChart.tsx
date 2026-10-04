"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { WorkloadDistributionEntry } from "@/domain/analytics";
import { WORKLOAD_BAND_COLOR, CHART_GRID, CHART_AXIS_TEXT } from "@/components/analytics/analyticsColors";
import { ChartTooltip } from "@/components/analytics/charts/ChartTooltip";
import { useReducedMotion } from "@/lib/useReducedMotion";

const axisTick = { fill: CHART_AXIS_TEXT, fontSize: 12 };

/**
 * Workload Distribution (Phase 11 §1B). Data is pre-computed by
 * `getWorkloadDistribution` (which itself only reads the shared
 * `computeTeamMemberWorkload` — no workload math here). Band order
 * and colors match `WorkloadBadge` exactly so this chart and that
 * badge are never visually inconsistent.
 *
 * The chart container is forced `dir="ltr"` regardless of page
 * direction: Recharts' SVG text-anchor/positioning math is not
 * RTL-aware, and without this the Y-axis category labels render
 * overlapping the bars in RTL (found via Phase 11 RTL visual
 * verification). The legend list below it (real page content, not
 * SVG) still follows the page's own direction normally.
 */
export function WorkloadDistributionChart({
  distribution,
}: {
  distribution: WorkloadDistributionEntry[];
}) {
  const reducedMotion = useReducedMotion();
  const total = distribution.reduce((sum, e) => sum + e.count, 0);

  return (
    <div>
      <div dir="ltr" className="h-[200px] w-full" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={distribution} layout="vertical" margin={{ left: 8, right: 16 }}>
            <CartesianGrid horizontal={false} stroke={CHART_GRID} />
            <XAxis type="number" allowDecimals={false} tick={axisTick} axisLine={{ stroke: CHART_GRID }} tickLine={false} />
            <YAxis type="category" dataKey="band" tick={axisTick} axisLine={{ stroke: CHART_GRID }} tickLine={false} width={80} />
            <Tooltip content={(props) => <ChartTooltip {...props} />} cursor={{ fill: "var(--fp-accent-subtle-bg)" }} />
            <Bar dataKey="count" name="Team members" radius={[0, 4, 4, 0]} isAnimationActive={!reducedMotion}>
              {distribution.map((entry) => (
                <Cell key={entry.band} fill={WORKLOAD_BAND_COLOR[entry.band]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Phase 11 §7: a text equivalent for anyone who can't read the SVG. */}
      <p className="sr-only">
        Workload distribution across {total} team member{total === 1 ? "" : "s"}:{" "}
        {distribution.map((e) => `${e.band} ${e.count}`).join(", ")}.
      </p>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground" aria-hidden="true">
        {distribution.map((e) => (
          <li key={e.band} className="flex items-center gap-1.5">
            <span
              className="inline-block size-2 rounded-full"
              style={{ backgroundColor: WORKLOAD_BAND_COLOR[e.band] }}
            />
            {e.band}: {e.count}
          </li>
        ))}
      </ul>
    </div>
  );
}
