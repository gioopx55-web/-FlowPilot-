import { AlertTriangle, TriangleAlert } from "lucide-react";
import type { ProjectRiskResult } from "@/domain/risk/risk";
import { Badge } from "@/components/primitives/Badge";
import { ConditionsDisclosure } from "@/components/primitives/ConditionsDisclosure";
import { RISK_CONDITION_LABELS } from "@/components/primitives/riskConditionLabels";

/**
 * Renders a risk level with its contributing conditions always
 * reachable (D-016) — never a bare "At Risk"/"Critical Risk" label.
 * Critical Risk additionally shows its primary reason directly in
 * the UI at rest (D-027); At Risk's single reason is available
 * through the disclosure, consistent with it being the only
 * condition present.
 */
export function RiskBadge({ risk }: { risk: ProjectRiskResult }) {
  if (risk.level === "none") return null;

  const reasons = risk.conditions.map((c) => RISK_CONDITION_LABELS[c]);
  const isCritical = risk.level === "critical_risk";

  return (
    <div className="flex items-center gap-1.5 self-start">
      <div className="flex flex-col items-start gap-0.5">
        <Badge
          tone={isCritical ? "danger" : "warning"}
          icon={
            isCritical ? (
              <AlertTriangle className="size-3" aria-hidden="true" />
            ) : (
              <TriangleAlert className="size-3" aria-hidden="true" />
            )
          }
        >
          {isCritical ? "Critical Risk" : "At Risk"}
        </Badge>
        {isCritical && (
          <span className="max-w-[16rem] truncate text-xs text-muted-foreground">
            {reasons[0]}
          </span>
        )}
      </div>
      <ConditionsDisclosure
        label={`Why is this project ${isCritical ? "Critical Risk" : "At Risk"}?`}
        reasons={reasons}
      />
    </div>
  );
}
