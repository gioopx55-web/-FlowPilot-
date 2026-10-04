import type { RiskCondition } from "@/types/entities";

/**
 * Human-readable sentences for each RiskCondition — presentation-layer
 * lookup only, per PROJECT_PLAN.md §13.17 ("kept in UI/presentation
 * code, not duplicated into the data model"). The condition flags
 * themselves come from domain/risk/risk.ts; this file only supplies
 * display text, so there is still exactly one place the risk formula
 * lives.
 */
export const RISK_CONDITION_LABELS: Record<RiskCondition, string> = {
  overdue_task_ratio_exceeded: "More than 25% of open tasks are overdue",
  high_priority_overdue: "A high-priority task is overdue by more than 2 days",
  due_soon_low_progress: "Due within 3 days with progress below 70%",
  unresolved_blocker_stale: "An active blocker has been open for more than 48 hours",
};
