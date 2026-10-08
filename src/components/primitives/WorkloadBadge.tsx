import type { TeamMemberWorkloadResult } from "@/domain/workload/workload";
import { Badge, type BadgeTone } from "@/components/primitives/Badge";
import { ConditionsDisclosure } from "@/components/primitives/ConditionsDisclosure";

const TONE_BY_BAND: Record<TeamMemberWorkloadResult["band"], BadgeTone> = {
  Available: "neutral",
  Healthy: "success",
  High: "warning",
  // Red is reserved for Critical Risk (project level) only — Overloaded
  // is a warning-tier workload band, not a critical state (visual-
  // balance pass, see DECISIONS.md).
  Overloaded: "warning",
};

/**
 * Renders a workload band with its contributing factors always
 * reachable (D-016): assigned hours, capacity, and how many assigned
 * tasks used the fallback-hours estimate rather than a real one.
 *
 * `showPercent` defaults to true (every pre-Phase-12 call site keeps
 * its inline "Overloaded 126%" exactly as before). Team Member Detail
 * (Phase 12 §8) passes `false` since that page already shows its own
 * large headline percentage — rendering both would just duplicate the
 * same number right next to itself.
 */
export function WorkloadBadge({
  workload,
  showPercent = true,
}: {
  workload: TeamMemberWorkloadResult;
  showPercent?: boolean;
}) {
  const reasons = [
    `${workload.assignedHours}h assigned / ${workload.weeklyCapacityHours}h weekly capacity (${Math.round(workload.workloadPct)}%)`,
  ];
  if (workload.fallbackTaskIds.length > 0) {
    reasons.push(
      `${workload.fallbackTaskIds.length} task${workload.fallbackTaskIds.length === 1 ? "" : "s"} used a fallback hour estimate (no real estimate set)`,
    );
  }

  return (
    <div className="flex items-center gap-1.5 self-start">
      <Badge tone={TONE_BY_BAND[workload.band]}>{workload.band}</Badge>
      {showPercent && (
        <span className="text-xs text-muted-foreground">
          {Math.round(workload.workloadPct)}%
        </span>
      )}
      <ConditionsDisclosure
        label={`Why is this workload "${workload.band}"?`}
        reasons={reasons}
      />
    </div>
  );
}
