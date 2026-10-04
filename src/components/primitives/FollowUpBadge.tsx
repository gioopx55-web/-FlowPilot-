import type { ClientFollowUpStatus } from "@/domain/clients/followUp";
import { Badge } from "@/components/primitives/Badge";
import { ConditionsDisclosure } from "@/components/primitives/ConditionsDisclosure";
import { formatShortDate } from "@/lib/format";

/**
 * Follow-up status with its reasoning always reachable (same D-016
 * pattern as RiskBadge/WorkloadBadge — never a bare label). Reuses
 * the shared ConditionsDisclosure rather than a second explanation
 * system (Phase 10 §3).
 */
export function FollowUpBadge({ followUp }: { followUp: ClientFollowUpStatus }) {
  if (!followUp.needsFollowUp) {
    return <Badge tone="success">Up to date</Badge>;
  }

  const reasons =
    followUp.lastInteractionAt !== undefined
      ? [
          `Last contacted ${followUp.daysSinceLastInteraction} days ago, on ${formatShortDate(
            followUp.lastInteractionAt,
          )}.`,
        ]
      : ["No interaction has been logged for this client yet."];

  return (
    <div className="flex items-center gap-1.5">
      <Badge tone="warning">Needs Follow-Up</Badge>
      <ConditionsDisclosure label="Why does this client need follow-up?" reasons={reasons} />
    </div>
  );
}
