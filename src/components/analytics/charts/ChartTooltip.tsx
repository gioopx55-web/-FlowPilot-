"use client";

import type { TooltipContentProps } from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

/**
 * Replaces Recharts' default tooltip styling (Phase 11 §15) with the
 * FlowPilot surface/elevation system (`--fp-bg-surface-raised`,
 * `--fp-shadow-level-2`, `--fp-border-subtle`) so it matches every
 * other floating surface in the app (ConditionsDisclosure's popover,
 * the AI/Notifications side panel) instead of Recharts' defaults.
 */
export function ChartTooltip({ active, payload, label }: TooltipContentProps<ValueType, NameType>) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div
      className="rounded-md border px-3 py-2 text-xs shadow-[var(--fp-shadow-level-2)]"
      style={{
        backgroundColor: "var(--fp-bg-surface-raised)",
        borderColor: "var(--fp-border-subtle)",
        color: "var(--fp-text-primary)",
      }}
    >
      {label !== undefined && (
        <p className="mb-1 font-medium" style={{ color: "var(--fp-text-primary)" }}>
          {label}
        </p>
      )}
      {payload.map((entry) => (
        <p key={String(entry.dataKey)} style={{ color: "var(--fp-text-secondary)" }}>
          {entry.name}: <span style={{ color: "var(--fp-text-primary)" }}>{entry.value}</span>
        </p>
      ))}
    </div>
  );
}
