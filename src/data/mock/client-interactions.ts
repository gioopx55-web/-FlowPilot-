import type { ClientInteraction } from "@/types/entities";
import { WORKSPACE_ID } from "@/data/mock/workspace";

/**
 * Interaction history, deliberately dated relative to DEMO_TODAY
 * (2026-10-04, see lib/demo-clock.ts) so follow-up status is
 * deterministic:
 *
 * - 6 non-dormant clients have a most-recent interaction within the
 *   last 6 days (comfortably under the 7-day threshold, O-pending —
 *   see domain/clients/followUp.ts) → do NOT need follow-up.
 * - 6 non-dormant clients have a most-recent interaction 19+ days
 *   ago (comfortably over the threshold) → DO need follow-up.
 * - The 3 dormant clients have old interactions too, but are excluded
 *   from follow-up surfacing by status regardless of recency.
 *
 * Each client has 1-2 interactions; only the latest one drives
 * `lastInteractionAt` (via getLatestClientInteraction), but a second,
 * older entry is included for several clients so "latest of several"
 * is genuinely exercised, not just "only record".
 */
export const clientInteractions: ClientInteraction[] = [
  // Recent (no follow-up needed)
  { id: "ci_harbor_1", workspaceId: WORKSPACE_ID, clientId: "cl_harbor_thistle", type: "email", summary: "Shared refreshed homepage mockups for review.", occurredAt: "2026-09-30T14:00:00.000Z", createdByUserId: "usr_theo" },
  { id: "ci_harbor_0", workspaceId: WORKSPACE_ID, clientId: "cl_harbor_thistle", type: "call", summary: "Kickoff call for brand refresh scope.", occurredAt: "2026-07-02T10:00:00.000Z", createdByUserId: "usr_maya" },

  { id: "ci_cedar_1", workspaceId: WORKSPACE_ID, clientId: "cl_cedar_grove", type: "meeting", summary: "Reviewed intake form copy with Dr. Ross.", occurredAt: "2026-10-01T16:00:00.000Z", createdByUserId: "usr_theo" },

  { id: "ci_rook_1", workspaceId: WORKSPACE_ID, clientId: "cl_rook_raven", type: "update_sent", summary: "Sent loyalty app beta build for feedback.", occurredAt: "2026-10-02T11:00:00.000Z", createdByUserId: "usr_theo" },
  { id: "ci_rook_0", workspaceId: WORKSPACE_ID, clientId: "cl_rook_raven", type: "note", summary: "Logged feedback from in-store pilot.", occurredAt: "2026-08-14T09:00:00.000Z", createdByUserId: "usr_maya" },

  { id: "ci_mariner_1", workspaceId: WORKSPACE_ID, clientId: "cl_mariner_logistics", type: "call", summary: "Discussed fleet dashboard data sources.", occurredAt: "2026-09-29T13:00:00.000Z", createdByUserId: "usr_theo" },

  { id: "ci_brightline_1", workspaceId: WORKSPACE_ID, clientId: "cl_brightline", type: "email", summary: "Confirmed compliance microsite copy sign-off.", occurredAt: "2026-10-03T15:00:00.000Z", createdByUserId: "usr_maya" },

  { id: "ci_nimbus_1", workspaceId: WORKSPACE_ID, clientId: "cl_nimbus_cloud", type: "meeting", summary: "Walked through status page redesign direction.", occurredAt: "2026-09-28T10:00:00.000Z", createdByUserId: "usr_theo" },

  // Stale (needs follow-up)
  { id: "ci_lumen_1", workspaceId: WORKSPACE_ID, clientId: "cl_lumen_analytics", type: "email", summary: "Sent investor deck site wireframes.", occurredAt: "2026-09-10T12:00:00.000Z", createdByUserId: "usr_maya" },
  { id: "ci_lumen_0", workspaceId: WORKSPACE_ID, clientId: "cl_lumen_analytics", type: "call", summary: "Initial scoping call.", occurredAt: "2026-05-02T09:00:00.000Z", createdByUserId: "usr_maya" },

  { id: "ci_pixel_1", workspaceId: WORKSPACE_ID, clientId: "cl_pixel_forge", type: "note", summary: "Logged request for updated store assets.", occurredAt: "2026-08-20T09:00:00.000Z", createdByUserId: "usr_theo" },

  { id: "ci_solstice_1", workspaceId: WORKSPACE_ID, clientId: "cl_solstice_yoga", type: "meeting", summary: "Reviewed class-booking flow prototype.", occurredAt: "2026-09-05T11:00:00.000Z", createdByUserId: "usr_theo" },

  { id: "ci_fernwood_1", workspaceId: WORKSPACE_ID, clientId: "cl_fernwood", type: "email", summary: "Sent donor portal content checklist.", occurredAt: "2026-09-01T09:00:00.000Z", createdByUserId: "usr_maya" },

  { id: "ci_verdant_1", workspaceId: WORKSPACE_ID, clientId: "cl_verdant_farms", type: "call", summary: "Discussed marketplace vendor onboarding.", occurredAt: "2026-09-15T13:00:00.000Z", createdByUserId: "usr_theo" },

  { id: "ci_copperfield_1", workspaceId: WORKSPACE_ID, clientId: "cl_copperfield", type: "update_sent", summary: "Sent listings portal progress summary.", occurredAt: "2026-08-25T09:00:00.000Z", createdByUserId: "usr_maya" },

  // Dormant clients — present but excluded from follow-up logic by status.
  { id: "ci_thistlewood_1", workspaceId: WORKSPACE_ID, clientId: "cl_thistlewood", type: "note", summary: "Project paused indefinitely by client.", occurredAt: "2025-02-10T09:00:00.000Z", createdByUserId: "usr_maya" },
  { id: "ci_quillpoint_1", workspaceId: WORKSPACE_ID, clientId: "cl_quillpoint", type: "email", summary: "Client confirmed project is on indefinite hold.", occurredAt: "2025-04-18T09:00:00.000Z", createdByUserId: "usr_theo" },
  { id: "ci_hearthstone_1", workspaceId: WORKSPACE_ID, clientId: "cl_hearthstone", type: "note", summary: "No activity since initial consultation.", occurredAt: "2024-11-05T09:00:00.000Z", createdByUserId: "usr_maya" },
];
