import type { ProjectStatus } from "@/types/entities";

/** Presentation-layer label lookup, same pattern as riskConditionLabels.ts. */
export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  kickoff: "Kickoff",
  in_progress: "In Progress",
  review: "Review",
  completed: "Completed",
  on_hold: "On Hold",
};
