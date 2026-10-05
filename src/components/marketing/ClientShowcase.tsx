import type { ClientFollowUpEntry } from "@/domain/selectors";
import { ShowcaseLayout } from "@/components/marketing/ShowcaseLayout";
import { PreviewCard, PreviewCardHeader } from "@/components/marketing/PreviewCard";
import { FollowUpBadge } from "@/components/primitives/FollowUpBadge";

/**
 * Clients / Follow-up (Phase 13.5 §3.6) — real
 * `getClientsNeedingFollowUpSorted` entries shown with the exact
 * `FollowUpBadge` the Clients list uses.
 */
export function ClientShowcase({ entries }: { entries: ClientFollowUpEntry[] }) {
  return (
    <ShowcaseLayout
      eyebrow="Clients"
      title="No client goes quiet without someone noticing."
      description="FlowPilot tracks every call, email, and meeting logged against a client, and flags anyone who's gone more than a week without contact — dormant clients excluded, since they're not expected to need regular touch."
      bullets={[
        "A 7-day stale-contact threshold, applied consistently everywhere",
        "Every client's projects and interaction history in one place",
        "Dormant clients stay out of the follow-up list on purpose",
      ]}
      reverse
      visual={
        <PreviewCard>
          <PreviewCardHeader title="Clients Needing Follow-Up" />
          <ul className="divide-y divide-border">
            {entries.slice(0, 4).map((entry) => (
              <li key={entry.client.id} className="flex items-center justify-between gap-3 p-3">
                <span className="truncate text-sm font-medium text-foreground">
                  {entry.client.name}
                </span>
                <FollowUpBadge followUp={entry.status} />
              </li>
            ))}
          </ul>
        </PreviewCard>
      }
    />
  );
}
