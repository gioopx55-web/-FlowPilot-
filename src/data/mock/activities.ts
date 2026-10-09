import type { Activity } from "@/types/entities";
import { WORKSPACE_ID } from "@/data/mock/workspace";

/**
 * A representative (not exhaustive) activity log — enough to prove the
 * shape and a few event types, not a full history for every task.
 * `summary` is written as it would be frozen at log time (Phase 3
 * §13.11) — never regenerated from a diff.
 */
export const activities: Activity[] = [
  { id: "act_01", workspaceId: WORKSPACE_ID, projectId: "proj_lumen_deck", taskId: "task_lumen_01", type: "created", actorUserId: "usr_theo", summary: "Theo created \"Migrate legacy site content\".", occurredAt: "2026-08-02T09:00:00.000Z" },
  { id: "act_02", workspaceId: WORKSPACE_ID, projectId: "proj_rook_loyalty", taskId: "task_rook_01", type: "status_changed", actorUserId: "usr_theo", summary: "Theo moved \"Fix push notification bug\" to To Do.", occurredAt: "2026-06-16T09:00:00.000Z" },
  { id: "act_03", workspaceId: WORKSPACE_ID, projectId: "proj_mariner_fleet", taskId: "task_mariner_01", type: "blocker_opened", actorUserId: "usr_theo", summary: "Theo flagged \"Waiting on client fleet API keys\" as blocked.", occurredAt: "2026-10-01T09:00:00.000Z" },
  { id: "act_04", workspaceId: WORKSPACE_ID, projectId: "proj_fernwood_donor", taskId: "task_fernwood_01", type: "due_date_changed", actorUserId: "usr_maya", summary: "Maya moved \"Migrate donor records\" due date earlier.", occurredAt: "2026-07-01T09:00:00.000Z" },
  { id: "act_05", workspaceId: WORKSPACE_ID, projectId: "proj_harbor_refresh", taskId: "task_harbor_refresh_01", type: "completed", actorUserId: "usr_maya", summary: "Marcus completed \"Audit existing brand assets\".", occurredAt: "2026-07-20T09:00:00.000Z" },
  { id: "act_06", workspaceId: WORKSPACE_ID, projectId: "proj_harbor_refresh", taskId: "task_harbor_refresh_05", type: "blocker_opened", actorUserId: "usr_theo", summary: "Theo marked \"Coordinate signage vendor\" as blocked (workflow, no active-risk blocker set).", occurredAt: "2026-09-01T09:00:00.000Z" },
  { id: "act_07", workspaceId: WORKSPACE_ID, projectId: "proj_rook_loyalty", taskId: "task_rook_05", type: "completed", actorUserId: "usr_theo", summary: "Sana completed \"Design loyalty tier badges\".", occurredAt: "2026-07-01T09:00:00.000Z" },
  { id: "act_08", workspaceId: WORKSPACE_ID, projectId: "proj_lumen_deck", taskId: "task_lumen_03", type: "reassigned", actorUserId: "usr_theo", summary: "Theo reassigned \"Build interactive metrics chart\" to Jordan.", occurredAt: "2026-08-06T09:00:00.000Z" },
  { id: "act_09", workspaceId: WORKSPACE_ID, projectId: "proj_cedar_intake", taskId: "task_cedar_04", type: "completed", actorUserId: "usr_theo", summary: "Marcus completed \"Translate intake form (ES)\".", occurredAt: "2026-06-10T09:00:00.000Z" },
  { id: "act_10", workspaceId: WORKSPACE_ID, projectId: "proj_harbor_lookbook", taskId: "task_lookbook_02", type: "blocker_opened", actorUserId: "usr_theo", summary: "Theo flagged the author bio review as blocked.", occurredAt: "2026-09-30T09:00:00.000Z" },
  { id: "act_11", workspaceId: WORKSPACE_ID, projectId: "proj_quillpoint_author", taskId: "task_quillpoint_01", type: "blocker_opened", actorUserId: "usr_maya", summary: "Elena flagged the author portal task as blocked.", occurredAt: "2026-09-29T09:00:00.000Z" },
  { id: "act_12", workspaceId: WORKSPACE_ID, projectId: "proj_verdant_marketplace", taskId: "task_verdant_04", type: "completed", actorUserId: "usr_theo", summary: "Theo completed \"Load seasonal produce data\".", occurredAt: "2026-08-25T09:00:00.000Z" },
  { id: "act_13", workspaceId: WORKSPACE_ID, projectId: "proj_nimbus_statuspage", taskId: "task_nimbus_02", type: "reassigned", actorUserId: "usr_theo", summary: "Theo reassigned \"Wire up status API polling\" to Priya.", occurredAt: "2026-07-18T09:00:00.000Z" },
  { id: "act_14", workspaceId: WORKSPACE_ID, projectId: "proj_copperfield_listings", taskId: "task_copperfield_02", type: "created", actorUserId: "usr_theo", summary: "Theo created \"Redesign listing card grid\".", occurredAt: "2026-08-06T09:00:00.000Z" },
  { id: "act_15", workspaceId: WORKSPACE_ID, projectId: "proj_brightline_mobile", taskId: "task_brightline_m_02", type: "completed", actorUserId: "usr_maya", summary: "Maya completed \"Write App Store copy\".", occurredAt: "2026-07-01T09:00:00.000Z" },
  { id: "act_16", workspaceId: WORKSPACE_ID, projectId: "proj_solstice_booking", type: "created", actorUserId: "usr_maya", summary: "Maya created the Studio Booking Platform project.", occurredAt: "2026-07-20T09:00:00.000Z" },
  // Dashboard-balance pass (see DECISIONS.md) — matches task_rook_01's
  // fixture update in tasks.ts.
  { id: "act_17", workspaceId: WORKSPACE_ID, projectId: "proj_rook_loyalty", taskId: "task_rook_01", type: "completed", actorUserId: "usr_theo", summary: "Theo completed \"Fix push notification bug\".", occurredAt: "2026-10-03T09:00:00.000Z" },
];
