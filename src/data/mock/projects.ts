import type { Project } from "@/types/entities";
import { WORKSPACE_ID } from "@/data/mock/workspace";

/**
 * 19 projects: 12 active-stage + 6 completed + 1 on_hold. Deliberately
 * authored (not randomized) so every approved risk state is produced
 * at least once once the matching tasks (tasks.ts) are run through
 * domain/risk/risk.ts:
 *
 * - proj_harbor_refresh    → none (no triggering conditions)
 * - proj_lumen_deck        → none (Dashboard-balance pass — was at_risk
 *                            via condition 1; see tasks.ts)
 * - proj_rook_loyalty      → none (Dashboard-balance pass — was at_risk
 *                            via condition 2; see tasks.ts)
 * - proj_solstice_booking  → none (Dashboard-balance pass — was at_risk
 *                            via condition 3; due date corrected below)
 * - proj_mariner_fleet     → at_risk (condition 4: stale active blocker)
 *                            — intentionally left as the workspace's one
 *                            At Risk example (Dashboard-balance pass,
 *                            see DECISIONS.md); required by
 *                            domain/validation.ts's risk-level coverage
 *                            check and by ai.integration.test.ts
 * - proj_fernwood_donor    → critical_risk (conditions 1+2 together) —
 *                            the workspace's one Critical Risk example
 * - proj_harbor_lookbook   → completed; tasks would trigger risk if not excluded
 * - proj_quillpoint_author → on_hold; tasks would trigger risk if not excluded
 * - the remaining 6 are realistic "no risk" variety.
 *
 * Dashboard-balance pass (see DECISIONS.md): previously 5 of 12
 * active-stage projects computed to at_risk/critical_risk — correct per
 * the formula, but unrealistic for a demo workspace and visually
 * overwhelming on the Dashboard/Projects list. Fixture data for 3 of
 * those 5 was corrected (never the risk formula) so the workspace now
 * shows exactly 1 Critical Risk + 1 At Risk project, with every other
 * active project genuinely healthy — still produced by the real,
 * unmodified risk engine, not a relabeled status.
 *
 * `completedAt` (D-042, Phase 11): the 5 projects below with
 * `_delivered` names (plus proj_harbor_lookbook) are the only
 * completed projects, authored with a deliberate on-time/late mix (4
 * on-time, 2 late) so On-Time Delivery Rate has a real, non-trivial
 * sample instead of N=1. Each has zero tasks — a finished project
 * reasonably has no open work, and the point of these fixtures is the
 * delivery date, not task-level demo coverage (already provided by
 * the other 12 active projects).
 */
export const projects: Project[] = [
  {
    id: "proj_harbor_refresh",
    workspaceId: WORKSPACE_ID,
    clientId: "cl_harbor_thistle",
    name: "Brand Refresh",
    status: "in_progress",
    progressPct: 60,
    dueDate: "2026-12-01T00:00:00.000Z",
    startDate: "2026-07-01T00:00:00.000Z",
    createdAt: "2026-07-01T00:00:00.000Z",
  },
  {
    id: "proj_lumen_deck",
    workspaceId: WORKSPACE_ID,
    clientId: "cl_lumen_analytics",
    name: "Investor Deck Site",
    status: "in_progress",
    progressPct: 50,
    dueDate: "2026-12-15T00:00:00.000Z",
    startDate: "2026-08-01T00:00:00.000Z",
    createdAt: "2026-08-01T00:00:00.000Z",
  },
  {
    id: "proj_rook_loyalty",
    workspaceId: WORKSPACE_ID,
    clientId: "cl_rook_raven",
    name: "Loyalty App",
    status: "in_progress",
    progressPct: 75,
    dueDate: "2026-12-20T00:00:00.000Z",
    startDate: "2026-06-15T00:00:00.000Z",
    createdAt: "2026-06-15T00:00:00.000Z",
  },
  {
    id: "proj_solstice_booking",
    workspaceId: WORKSPACE_ID,
    clientId: "cl_solstice_yoga",
    name: "Studio Booking Platform",
    status: "in_progress",
    progressPct: 45,
    // Was 2026-10-06 — inconsistent with this project's own open tasks
    // (tasks.ts), which run out to 2026-10-25; a project can't
    // honestly be "due" before its own remaining work is scheduled to
    // finish. Moved past the latest task due date, matching this
    // fixture set's Nov/Dec due-date cadence for comparable in-progress
    // projects (Dashboard-balance pass, see DECISIONS.md).
    dueDate: "2026-11-10T00:00:00.000Z",
    startDate: "2026-07-20T00:00:00.000Z",
    createdAt: "2026-07-20T00:00:00.000Z",
  },
  {
    id: "proj_mariner_fleet",
    workspaceId: WORKSPACE_ID,
    clientId: "cl_mariner_logistics",
    name: "Fleet Dashboard",
    status: "in_progress",
    progressPct: 80,
    dueDate: "2027-01-10T00:00:00.000Z",
    startDate: "2026-05-01T00:00:00.000Z",
    createdAt: "2026-05-01T00:00:00.000Z",
  },
  {
    id: "proj_fernwood_donor",
    workspaceId: WORKSPACE_ID,
    clientId: "cl_fernwood",
    name: "Donor Portal Relaunch",
    status: "in_progress",
    progressPct: 55,
    dueDate: "2026-12-30T00:00:00.000Z",
    startDate: "2026-06-01T00:00:00.000Z",
    createdAt: "2026-06-01T00:00:00.000Z",
  },
  {
    id: "proj_brightline_compliance",
    workspaceId: WORKSPACE_ID,
    clientId: "cl_brightline",
    name: "Compliance Microsite",
    status: "kickoff",
    progressPct: 10,
    dueDate: "2027-01-15T00:00:00.000Z",
    startDate: "2026-09-25T00:00:00.000Z",
    createdAt: "2026-09-25T00:00:00.000Z",
  },
  {
    id: "proj_brightline_mobile",
    workspaceId: WORKSPACE_ID,
    clientId: "cl_brightline",
    name: "Mobile Banking Teaser",
    status: "review",
    progressPct: 90,
    dueDate: "2026-11-01T00:00:00.000Z",
    startDate: "2026-06-10T00:00:00.000Z",
    createdAt: "2026-06-10T00:00:00.000Z",
  },
  {
    id: "proj_verdant_marketplace",
    workspaceId: WORKSPACE_ID,
    clientId: "cl_verdant_farms",
    name: "Farm-to-Table Marketplace",
    status: "in_progress",
    progressPct: 65,
    dueDate: "2026-12-10T00:00:00.000Z",
    startDate: "2026-08-10T00:00:00.000Z",
    createdAt: "2026-08-10T00:00:00.000Z",
  },
  {
    id: "proj_nimbus_statuspage",
    workspaceId: WORKSPACE_ID,
    clientId: "cl_nimbus_cloud",
    name: "Status Page Redesign",
    status: "in_progress",
    progressPct: 72,
    dueDate: "2026-11-20T00:00:00.000Z",
    startDate: "2026-07-15T00:00:00.000Z",
    createdAt: "2026-07-15T00:00:00.000Z",
  },
  {
    id: "proj_copperfield_listings",
    workspaceId: WORKSPACE_ID,
    clientId: "cl_copperfield",
    name: "Listings Portal Refresh",
    status: "in_progress",
    progressPct: 58,
    dueDate: "2026-12-05T00:00:00.000Z",
    startDate: "2026-08-05T00:00:00.000Z",
    createdAt: "2026-08-05T00:00:00.000Z",
  },
  {
    id: "proj_cedar_intake",
    workspaceId: WORKSPACE_ID,
    clientId: "cl_cedar_grove",
    name: "Patient Intake Microsite",
    status: "review",
    progressPct: 95,
    dueDate: "2026-10-25T00:00:00.000Z",
    startDate: "2026-05-20T00:00:00.000Z",
    createdAt: "2026-05-20T00:00:00.000Z",
  },
  {
    // Completed — must be excluded from risk computation even though
    // its tasks (tasks.ts) are authored to otherwise trigger critical_risk.
    id: "proj_harbor_lookbook",
    workspaceId: WORKSPACE_ID,
    clientId: "cl_harbor_thistle",
    name: "Seasonal Lookbook Site",
    status: "completed",
    progressPct: 100,
    dueDate: "2026-09-01T00:00:00.000Z",
    startDate: "2026-04-01T00:00:00.000Z",
    createdAt: "2026-04-01T00:00:00.000Z",
    completedAt: "2026-08-28T00:00:00.000Z", // on-time (4 days early)
  },
  {
    // On hold — must be excluded from risk computation even though
    // its tasks (tasks.ts) are authored to otherwise trigger risk.
    id: "proj_quillpoint_author",
    workspaceId: WORKSPACE_ID,
    clientId: "cl_quillpoint",
    name: "Author Portal",
    status: "on_hold",
    progressPct: 30,
    dueDate: "2026-11-30T00:00:00.000Z",
    startDate: "2026-03-01T00:00:00.000Z",
    createdAt: "2026-03-01T00:00:00.000Z",
  },
  {
    id: "proj_pixel_delivered",
    workspaceId: WORKSPACE_ID,
    clientId: "cl_pixel_forge",
    name: "Store Launch Microsite",
    status: "completed",
    progressPct: 100,
    dueDate: "2026-07-15T00:00:00.000Z",
    startDate: "2026-04-01T00:00:00.000Z",
    createdAt: "2026-04-01T00:00:00.000Z",
    completedAt: "2026-07-10T00:00:00.000Z", // on-time (5 days early)
  },
  {
    id: "proj_hearthstone_delivered",
    workspaceId: WORKSPACE_ID,
    clientId: "cl_hearthstone",
    name: "Clinic Scheduling Microsite",
    status: "completed",
    progressPct: 100,
    dueDate: "2026-02-01T00:00:00.000Z",
    startDate: "2025-11-01T00:00:00.000Z",
    createdAt: "2025-11-01T00:00:00.000Z",
    completedAt: "2026-02-05T00:00:00.000Z", // late (4 days)
  },
  {
    id: "proj_solstice_delivered",
    workspaceId: WORKSPACE_ID,
    clientId: "cl_solstice_yoga",
    name: "Class Waiver Portal",
    status: "completed",
    progressPct: 100,
    dueDate: "2026-05-01T00:00:00.000Z",
    startDate: "2026-02-01T00:00:00.000Z",
    createdAt: "2026-02-01T00:00:00.000Z",
    completedAt: "2026-04-25T00:00:00.000Z", // on-time (6 days early)
  },
  {
    id: "proj_verdant_delivered",
    workspaceId: WORKSPACE_ID,
    clientId: "cl_verdant_farms",
    name: "Vendor Onboarding Guide",
    status: "completed",
    progressPct: 100,
    dueDate: "2026-06-01T00:00:00.000Z",
    startDate: "2026-03-01T00:00:00.000Z",
    createdAt: "2026-03-01T00:00:00.000Z",
    completedAt: "2026-06-10T00:00:00.000Z", // late (9 days)
  },
  {
    id: "proj_mariner_delivered",
    workspaceId: WORKSPACE_ID,
    clientId: "cl_mariner_logistics",
    name: "Driver Onboarding Microsite",
    status: "completed",
    progressPct: 100,
    dueDate: "2026-03-01T00:00:00.000Z",
    startDate: "2025-12-01T00:00:00.000Z",
    createdAt: "2025-12-01T00:00:00.000Z",
    completedAt: "2026-02-26T00:00:00.000Z", // on-time (3 days early)
  },
];
