import type { Workspace } from "@/types/entities";

export const WORKSPACE_ID = "ws_northbound";

/**
 * The single V1 demo workspace (Constitution §6, PROJECT_PLAN.md §7/D-012).
 * "Northbound Studio" — a small fictional creative/digital agency. No
 * real company, award, press mention, or certification is implied.
 */
export const workspace: Workspace = {
  id: WORKSPACE_ID,
  name: "Northbound Studio",
  createdAt: "2024-01-15T09:00:00.000Z",
};
