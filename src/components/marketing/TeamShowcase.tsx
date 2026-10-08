import { CheckCircle2, Gauge, Hourglass } from "lucide-react";
import type { TeamWorkloadEntry } from "@/domain/selectors";
import { ShowcaseLayout } from "@/components/marketing/ShowcaseLayout";
import { PreviewCard, PreviewCardHeader } from "@/components/marketing/PreviewCard";
import { WorkloadBadge } from "@/components/primitives/WorkloadBadge";

/**
 * Team workload (Phase 13.5 §3.7; reframed for the Landing Page
 * warning-balance pass, see DECISIONS.md) — `entries` arrives here
 * already curated (`landingCuration.ts`'s `pickMarketingTeam`, called
 * from `app/page.tsx`): mostly real Available/Healthy teammates, with
 * at most one real High-or-Overloaded example. The real
 * `getTeamWorkloadSnapshot()` "Overloaded first" sort is untouched and
 * still exactly what the authenticated Team page/Dashboard use — this
 * component only renders whatever curated set it's given, with the
 * exact `WorkloadBadge` the real app uses, including its fallback-hour
 * disclosure, so nothing about how the percentage was computed is
 * hidden.
 */
export function TeamShowcase({ entries }: { entries: TeamWorkloadEntry[] }) {
  return (
    <ShowcaseLayout
      eyebrow="Team"
      eyebrowIcon={Gauge}
      title="See real capacity, not a guess."
      description="Workload is assigned hours against weekly capacity, computed from real task estimates — falling back to a documented estimate only when a task has none, and always disclosed when it does."
      bullets={[
        { icon: Gauge, text: "Available / Healthy / High / Overloaded — four plain bands" },
        { icon: Hourglass, text: "Every percentage explains the hours and capacity behind it" },
        { icon: CheckCircle2, text: "Completed tasks stop counting toward load the moment they're done" },
      ]}
      visual={
        <PreviewCard>
          <PreviewCardHeader title="Team Workload" icon={Gauge} />
          <ul className="divide-y divide-border">
            {entries.map((entry) => (
              <li key={entry.member.id} className="flex items-center justify-between gap-3 p-3">
                <span className="truncate text-sm font-medium text-foreground">
                  {entry.member.name}
                </span>
                <WorkloadBadge workload={entry.workload} />
              </li>
            ))}
          </ul>
        </PreviewCard>
      }
    />
  );
}
