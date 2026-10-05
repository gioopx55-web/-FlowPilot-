import type { TeamWorkloadEntry } from "@/domain/selectors";
import { ShowcaseLayout } from "@/components/marketing/ShowcaseLayout";
import { PreviewCard, PreviewCardHeader } from "@/components/marketing/PreviewCard";
import { WorkloadBadge } from "@/components/primitives/WorkloadBadge";

/**
 * Team workload (Phase 13.5 §3.7) — real `getTeamWorkloadSnapshot`
 * entries with the exact `WorkloadBadge`, including its fallback-hour
 * disclosure, so nothing is hidden about how the percentage was
 * computed.
 */
export function TeamShowcase({ entries }: { entries: TeamWorkloadEntry[] }) {
  return (
    <ShowcaseLayout
      eyebrow="Team"
      title="Know who's overloaded before they tell you."
      description="Workload is assigned hours against weekly capacity, computed from real task estimates — falling back to a documented estimate only when a task has none, and always disclosed when it does."
      bullets={[
        "Available / Healthy / High / Overloaded — four plain bands",
        "Every percentage explains the hours and capacity behind it",
        "Completed tasks stop counting toward load the moment they're done",
      ]}
      visual={
        <PreviewCard>
          <PreviewCardHeader title="Team Workload" />
          <ul className="divide-y divide-border">
            {entries.slice(0, 4).map((entry) => (
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
