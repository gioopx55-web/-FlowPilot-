import type { Client, ClientInteraction } from "@/types/entities";
import { daysFromToday } from "@/lib/demo-clock";

/**
 * PROPOSED DEFAULT, not yet an owner-approved decision (unlike the
 * Phase 1-4 formulas, which were explicitly approved). No prior phase
 * defined a numeric "needs follow-up" threshold. 7 days is a
 * reasonable starting point, analogous to how fallback-hours started
 * as a Phase 3 proposal before approval (D-019). Flagged in
 * DECISIONS.md as an open item — change this one constant if the
 * owner sets a different value; do not duplicate the number
 * elsewhere.
 */
export const FOLLOW_UP_STALE_DAYS = 7;

export interface ClientFollowUpStatus {
  needsFollowUp: boolean;
  lastInteractionAt: string | undefined;
  daysSinceLastInteraction: number | undefined;
}

/** Authoritative source for a client's last-touch date: max(occurredAt). Never hand-edited. */
export function getLatestClientInteraction(
  clientId: string,
  interactions: ClientInteraction[],
): ClientInteraction | undefined {
  let latest: ClientInteraction | undefined;
  for (const interaction of interactions) {
    if (interaction.clientId !== clientId) continue;
    if (!latest || interaction.occurredAt > latest.occurredAt) {
      latest = interaction;
    }
  }
  return latest;
}

/**
 * The single, shared client follow-up computation (PROJECT_PLAN.md
 * §13.8/§13.22). Dormant clients are always excluded, regardless of
 * interaction recency — a dormant client isn't expected to need
 * regular contact (PROJECT_PLAN.md §13.22).
 */
export function getClientFollowUpStatus(
  client: Client,
  interactions: ClientInteraction[],
): ClientFollowUpStatus {
  const latest = getLatestClientInteraction(client.id, interactions);
  const lastInteractionAt = latest?.occurredAt;
  const daysSinceLastInteraction =
    lastInteractionAt !== undefined
      ? -daysFromToday(lastInteractionAt)
      : undefined;

  if (client.status === "dormant") {
    return { needsFollowUp: false, lastInteractionAt, daysSinceLastInteraction };
  }

  const needsFollowUp =
    daysSinceLastInteraction === undefined ||
    daysSinceLastInteraction > FOLLOW_UP_STALE_DAYS;

  return { needsFollowUp, lastInteractionAt, daysSinceLastInteraction };
}
