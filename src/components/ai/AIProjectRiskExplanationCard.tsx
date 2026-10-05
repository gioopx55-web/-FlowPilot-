import Link from "next/link";
import type { AIProjectRiskExplanation } from "@/domain/ai/projectRiskExplanation";
import { RiskBadge } from "@/components/primitives/RiskBadge";
import { RISK_CONDITION_LABELS } from "@/components/primitives/riskConditionLabels";

/**
 * "Why is this project at risk?" (Phase 13 §8) — uses `RiskBadge` and
 * `RISK_CONDITION_LABELS` exactly as Project Overview does; the
 * conditions shown are `computeProjectRisk`'s real output, never
 * paraphrased.
 */
export function AIProjectRiskExplanationCard({ data }: { data: AIProjectRiskExplanation }) {
  const { project, risk, overdueTasks, blockedTasks } = data;

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Link
          href={`/projects/${project.id}`}
          className="text-sm font-semibold text-foreground outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/70"
        >
          {project.name}
        </Link>
        <RiskBadge risk={risk} />
      </div>

      {risk.level === "none" ? (
        <p className="text-sm text-muted-foreground">
          No risk conditions are currently true for this project.
        </p>
      ) : (
        <>
          <p className="mb-2 text-sm text-muted-foreground">
            {risk.level === "critical_risk"
              ? `Critical Risk — ${risk.conditions.length} conditions are true at once.`
              : "At Risk — one condition is true."}
          </p>
          <ul className="list-inside list-disc space-y-1 text-sm text-foreground">
            {risk.conditions.map((condition) => (
              <li key={condition}>{RISK_CONDITION_LABELS[condition]}</li>
            ))}
          </ul>
        </>
      )}

      {overdueTasks.length > 0 && (
        <div className="mt-3">
          <h4 className="mb-1 text-xs font-medium text-muted-foreground">Overdue tasks</h4>
          <ul className="space-y-1">
            {overdueTasks.map((task) => (
              <li key={task.id}>
                <Link
                  href={`/tasks/${task.id}`}
                  className="text-sm text-foreground outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/70"
                >
                  {task.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {blockedTasks.length > 0 && (
        <div className="mt-3">
          <h4 className="mb-1 text-xs font-medium text-muted-foreground">Blocked tasks</h4>
          <ul className="space-y-1">
            {blockedTasks.map((task) => (
              <li key={task.id}>
                <Link
                  href={`/tasks/${task.id}`}
                  className="text-sm text-foreground outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/70"
                >
                  {task.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
