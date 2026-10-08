import { CalendarClock, History, MoonStar, Users } from "lucide-react";
import type { ClientFollowUpEntry } from "@/domain/selectors";
import { ShowcaseLayout } from "@/components/marketing/ShowcaseLayout";
import { PreviewCard, PreviewCardHeader } from "@/components/marketing/PreviewCard";
import { FollowUpBadge } from "@/components/primitives/FollowUpBadge";

/**
 * Clients / Follow-up (Phase 13.5 §3.6; reframed for the Landing Page
 * warning-balance pass, see DECISIONS.md) — `entries` arrives here
 * already curated (`landingCuration.ts`'s `pickMarketingClients`,
 * called from `app/page.tsx`): mostly real "Up to date" clients, with
 * at most one real "Needs Follow-Up" example, rendered with the exact
 * `FollowUpBadge` the real Clients list uses. The real, uncurated
 * `getClientsNeedingFollowUpSorted()` list is still exactly what the
 * authenticated Clients page/Dashboard show.
 */
export function ClientShowcase({ entries }: { entries: ClientFollowUpEntry[] }) {
  return (
    <ShowcaseLayout
      eyebrow="Clients"
      eyebrowIcon={Users}
      title="No client goes quiet without someone noticing."
      description="FlowPilot tracks every call, email, and meeting logged against a client, and flags anyone who's gone more than a week without contact — dormant clients excluded, since they're not expected to need regular touch."
      bullets={[
        { icon: CalendarClock, text: "A 7-day stale-contact threshold, applied consistently everywhere" },
        { icon: History, text: "Every client's projects and interaction history in one place" },
        { icon: MoonStar, text: "Dormant clients stay out of the follow-up list on purpose" },
      ]}
      tone="surface"
      reverse
      visual={
        <PreviewCard>
          <PreviewCardHeader title="Client Status" icon={Users} />
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
