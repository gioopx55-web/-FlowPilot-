import type { TeamMemberWorkloadResult } from "@/domain/workload/workload";
import { Badge, type BadgeTone } from "@/components/primitives/Badge";
import { ConditionsDisclosure } from "@/components/primitives/ConditionsDisclosure";

const TONE_BY_BAND: Record<TeamMemberWorkloadResult["band"], BadgeTone> = {
  Available: "neutral",
  Healthy: "success",
  High: "warning",
  Overloaded: "danger",
};

/**
 * Renders a workload band with its contributing factors always
 * reachable (D-016): assigned hours, capacity, and how many assigned
 * tasks used the fallback-hours estimate rather than a real one.
 */
export function WorkloadBadge({ workload }: { workload: TeamMemberWorkloadResult }) {
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
      <span className="text-xs text-muted-foreground">
        {Math.round(workload.workloadPct)}%
      </span>
      <ConditionsDisclosure
        label={`Why is this workload "${workload.band}"?`}
        reasons={reasons}
      />
    </div>
  );
}
