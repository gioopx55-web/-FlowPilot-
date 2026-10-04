import type { Notification } from "@/types/entities";
import { WORKSPACE_ID } from "@/data/mock/workspace";

/**
 * A representative set of notifications, each referencing a real
 * task/project/client record (validated in validate.ts). Recipients
 * are the two demo Users (users.ts) — only Users receive
 * notifications, per the entity model.
 */
export const notifications: Notification[] = [
  { id: "notif_01", workspaceId: WORKSPACE_ID, recipientUserId: "usr_theo", category: "overdue", referenceType: "task", referenceId: "task_rook_01", message: "\"Fix push notification bug\" is overdue.", read: false, createdAt: "2026-09-29T09:00:00.000Z" },
  { id: "notif_02", workspaceId: WORKSPACE_ID, recipientUserId: "usr_theo", category: "overdue", referenceType: "task", referenceId: "task_fernwood_01", message: "\"Migrate donor records\" is overdue.", read: false, createdAt: "2026-10-01T09:00:00.000Z" },
  { id: "notif_03", workspaceId: WORKSPACE_ID, recipientUserId: "usr_maya", category: "follow_up_due", referenceType: "client", referenceId: "cl_lumen_analytics", message: "Lumen Analytics hasn't been contacted recently.", read: false, createdAt: "2026-09-25T09:00:00.000Z" },
  { id: "notif_04", workspaceId: WORKSPACE_ID, recipientUserId: "usr_maya", category: "follow_up_due", referenceType: "client", referenceId: "cl_copperfield", message: "Copperfield Realty Group hasn't been contacted recently.", read: true, createdAt: "2026-09-10T09:00:00.000Z" },
  { id: "notif_05", workspaceId: WORKSPACE_ID, recipientUserId: "usr_theo", category: "assigned", referenceType: "task", referenceId: "task_lumen_03", message: "\"Build interactive metrics chart\" was assigned to Jordan.", read: true, createdAt: "2026-08-06T09:00:00.000Z" },
  { id: "notif_06", workspaceId: WORKSPACE_ID, recipientUserId: "usr_theo", category: "overdue", referenceType: "project", referenceId: "proj_fernwood_donor", message: "Donor Portal Relaunch has multiple overdue tasks.", read: false, createdAt: "2026-10-01T09:00:00.000Z" },
  { id: "notif_07", workspaceId: WORKSPACE_ID, recipientUserId: "usr_maya", category: "mentioned", referenceType: "project", referenceId: "proj_mariner_fleet", message: "You were mentioned on Fleet Dashboard.", read: false, createdAt: "2026-10-02T09:00:00.000Z" },
  { id: "notif_08", workspaceId: WORKSPACE_ID, recipientUserId: "usr_theo", category: "assigned", referenceType: "task", referenceId: "task_nimbus_02", message: "\"Wire up status API polling\" was assigned to Priya.", read: true, createdAt: "2026-07-18T09:00:00.000Z" },
];
