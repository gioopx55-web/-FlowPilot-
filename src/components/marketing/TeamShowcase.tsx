import { CheckCircle2, Gauge, Hourglass } from "lucide-react";
import type { TeamWorkloadEntry } from "@/domain/selectors";
import { ShowcaseLayout } from "@/components/marketing/ShowcaseLayout";
import { PreviewCard, PreviewCardHeader } from "@/components/marketing/PreviewCard";
import { WorkloadBadge } from "@/components/primitives/WorkloadBadge";

const BAND_ORDER: TeamWorkloadEntry["workload"]["band"][] = [
  "Overloaded",
  "High",
  "Healthy",
  "Available",
];

/**
 * Picks up to 4 real members with one from each workload band where
 * possible — presentational curation only, never a change to
 * `getTeamWorkloadSnapshot()`'s own "Overloaded first" sort (still
 * used as-is by the real Team page/Dashboard). That sort means a
 * naive `.slice(0, 4)` here tends to show mostly Overloaded/High
 * members even when healthier real teammates exist — this instead
 * shows a representative real mix (visual-balance pass).
 */
function pickBalancedTeamPreview(entries: TeamWorkloadEntry[]): TeamWorkloadEntry[] {
  const byBand = new Map<string, TeamWorkloadEntry>();
  for (const entry of entries) {
    if (!byBand.has(entry.workload.band)) byBand.set(entry.workload.band, entry);
  }
  const onePerBand = BAND_ORDER.map((band) => byBand.get(band)).filter(
    (e): e is TeamWorkloadEntry => e !== undefined,
  );
  if (onePerBand.length >= 4) return onePerBand.slice(0, 4);
  const remaining = entries.filter((e) => !onePerBand.includes(e));
  return [...onePerBand, ...remaining].slice(0, 4);
}

export function TeamShowcase({ entries }: { entries: TeamWorkloadEntry[] }) {
  const previewEntries = pickBalancedTeamPreview(entries);
  return (
    <ShowcaseLayout
      eyebrow="Team"
      eyebrowIcon={Gauge}
      title="Know who's overloaded before they tell you."
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
            {previewEntries.map((entry) => (
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
