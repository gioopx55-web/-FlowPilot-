import type { RiskLevel } from "@/types/entities";
import type { WorkloadBand } from "@/domain/workload/workload";

/**
 * Chart colors are existing FlowPilot semantic tokens only (Phase 11
 * §6) — never ad-hoc hex values per chart. These map 1:1 onto the
 * same tokens `WorkloadBadge`/`RiskBadge` already use for the
 * identical bands/levels, so a chart and its matching badge are
 * always visually consistent.
 */
export const WORKLOAD_BAND_COLOR: Record<WorkloadBand, string> = {
  Available: "var(--fp-workload-available)",
  Healthy: "var(--fp-workload-healthy)",
  High: "var(--fp-workload-high)",
  Overloaded: "var(--fp-workload-overloaded)",
};

export const RISK_LEVEL_COLOR: Record<RiskLevel, string> = {
  none: "var(--fp-text-tertiary)",
  at_risk: "var(--fp-risk-at-risk)",
  critical_risk: "var(--fp-risk-critical)",
};

/** No prior phase centralized this — RiskBadge/ProjectsFilters each
 *  inline "At Risk"/"Critical Risk" locally. Centralized here since
 *  this is the first place a risk level needs a label without an
 *  attached ProjectRiskResult to read conditions from. */
export const RISK_LEVEL_LABEL: Record<RiskLevel, string> = {
  none: "No Risk",
  at_risk: "At Risk",
  critical_risk: "Critical Risk",
};

export const CHART_ACCENT = "var(--fp-accent)";
export const CHART_SUCCESS = "var(--fp-success)";
export const CHART_WARNING = "var(--fp-warning)";
export const CHART_DANGER = "var(--fp-danger)";
export const CHART_GRID = "var(--fp-border-subtle)";
export const CHART_AXIS_TEXT = "var(--fp-text-tertiary)";
