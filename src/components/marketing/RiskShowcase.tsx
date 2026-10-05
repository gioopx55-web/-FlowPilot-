import { CircleCheck, ListChecks, ShieldAlert } from "lucide-react";
import type { AtRiskProjectEntry } from "@/domain/selectors";
import { ShowcaseLayout } from "@/components/marketing/ShowcaseLayout";
import { PreviewCard, PreviewCardHeader } from "@/components/marketing/PreviewCard";
import { RiskBadge } from "@/components/primitives/RiskBadge";
import { RISK_CONDITION_LABELS } from "@/components/primitives/riskConditionLabels";

/**
 * Projects / Risk intelligence (Phase 13.5 §3.4) — the real
 * `computeProjectRisk` output for the workspace's current top-risk
 * project, shown with the exact same `RiskBadge` and
 * `RISK_CONDITION_LABELS` the app uses — never a paraphrased or
 * invented condition.
 */
export function RiskShowcase({ entry }: { entry: AtRiskProjectEntry | undefined }) {
  return (
    <ShowcaseLayout
      eyebrow="Projects"
      eyebrowIcon={ShieldAlert}
      title="Risk you can explain, not just a red dot."
      description="FlowPilot computes project risk from four concrete conditions — overdue task ratio, stale high-priority work, due-soon-with-low-progress, and unresolved blockers — and always shows which ones are true. Never a bare status label."
      bullets={[
        { icon: ListChecks, text: "Four named, always-visible risk conditions" },
        { icon: ShieldAlert, text: "Critical Risk vs. At Risk is a real distinction, not a vibe" },
        { icon: CircleCheck, text: "Completed and on-hold work never pollutes the risk view" },
      ]}
      tone="surface"
      reverse
      visual={
        entry ? (
          <PreviewCard>
            <PreviewCardHeader title="Project Risk" icon={ShieldAlert} />
            <div className="p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="truncate text-sm font-medium text-foreground">
                  {entry.project.name}
                </span>
                <RiskBadge risk={entry.risk} />
              </div>
              <ul className="list-inside list-disc space-y-1.5 text-sm text-muted-foreground">
                {entry.risk.conditions.map((condition) => (
                  <li key={condition}>{RISK_CONDITION_LABELS[condition]}</li>
                ))}
              </ul>
            </div>
          </PreviewCard>
        ) : (
          <PreviewCard>
            <PreviewCardHeader title="Project Risk" />
            <p className="p-4 text-sm text-muted-foreground">
              No projects are currently at risk in this workspace.
            </p>
          </PreviewCard>
        )
      }
    />
  );
}
