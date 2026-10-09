import type { Task } from "@/types/entities";
import { WORKSPACE_ID } from "@/data/mock/workspace";

/**
 * ~54 tasks across all 14 projects, authored (not randomized) against
 * DEMO_TODAY = 2026-10-04 (lib/demo-clock.ts) so every approved risk
 * condition, every workload band, and the fallback-hours behavior are
 * each demonstrated deterministically. See projects.ts for the
 * per-project risk-state map and team-members.ts for the per-member
 * workload-band map; the two are cross-referenced in comments below.
 *
 * `hasActiveBlocker`/`blockerStartedAt` are set only on the 3 tasks
 * meant to exercise the stale-blocker risk condition (D-023) — every
 * other task explicitly has `hasActiveBlocker: false`. One task
 * (harbor_refresh_05) has `status: "blocked"` with `hasActiveBlocker:
 * false` specifically to demonstrate the two concepts are decoupled.
 */
export const tasks: Task[] = [
  // --- proj_harbor_refresh (risk: none) ---
  { id: "task_harbor_refresh_01", workspaceId: WORKSPACE_ID, projectId: "proj_harbor_refresh", title: "Audit existing brand assets", status: "done", priority: "medium", assigneeId: "tm_marcus", estimatedHours: 5, hasActiveBlocker: false, createdAt: "2026-07-02T09:00:00.000Z", completedAt: "2026-07-20T09:00:00.000Z" },
  { id: "task_harbor_refresh_02", workspaceId: WORKSPACE_ID, projectId: "proj_harbor_refresh", title: "Draft new logo concepts", status: "in_progress", priority: "medium", assigneeId: "tm_marcus", estimatedHours: 10, dueDate: "2026-11-05T09:00:00.000Z", hasActiveBlocker: false, createdAt: "2026-07-05T09:00:00.000Z" },
  { id: "task_harbor_refresh_03", workspaceId: WORKSPACE_ID, projectId: "proj_harbor_refresh", title: "Build homepage style tile", status: "in_progress", priority: "medium", assigneeId: "tm_omar", estimatedHours: 6, dueDate: "2026-11-10T09:00:00.000Z", hasActiveBlocker: false, createdAt: "2026-07-10T09:00:00.000Z" },
  { id: "task_harbor_refresh_04", workspaceId: WORKSPACE_ID, projectId: "proj_harbor_refresh", title: "Design refreshed packaging mockups", status: "in_progress", priority: "medium", assigneeId: "tm_sana", estimatedHours: 12, dueDate: "2026-11-12T09:00:00.000Z", hasActiveBlocker: false, createdAt: "2026-07-12T09:00:00.000Z" },
  { id: "task_harbor_refresh_05", workspaceId: WORKSPACE_ID, projectId: "proj_harbor_refresh", title: "Coordinate signage vendor (workflow-blocked, no active risk blocker)", status: "blocked", priority: "low", assigneeId: "tm_elena", estimatedHours: 3, dueDate: "2026-11-20T09:00:00.000Z", hasActiveBlocker: false, createdAt: "2026-07-15T09:00:00.000Z" },

  // --- proj_lumen_deck (risk: none — Dashboard-balance pass, see
  //     DECISIONS.md: was at_risk via condition 1, overdue ratio 50%
  //     [2 of 4 open tasks overdue]. task_lumen_02's due date moved
  //     forward — it's actively in_progress, not abandoned, so an
  //     upcoming due date is the honest fix, not a status change. Now
  //     1 of 4 open tasks overdue (task_lumen_01, 25% exactly — at,
  //     not over, the >25% threshold). ---
  { id: "task_lumen_01", workspaceId: WORKSPACE_ID, projectId: "proj_lumen_deck", title: "Migrate legacy site content", status: "todo", priority: "medium", assigneeId: "tm_theo", estimatedHours: 6, dueDate: "2026-09-25T09:00:00.000Z", hasActiveBlocker: false, createdAt: "2026-08-02T09:00:00.000Z" },
  { id: "task_lumen_02", workspaceId: WORKSPACE_ID, projectId: "proj_lumen_deck", title: "Finalize investor deck copy", status: "in_progress", priority: "medium", assigneeId: "tm_maya", estimatedHours: 5, dueDate: "2026-10-25T09:00:00.000Z", hasActiveBlocker: false, createdAt: "2026-08-02T09:00:00.000Z" },
  { id: "task_lumen_03", workspaceId: WORKSPACE_ID, projectId: "proj_lumen_deck", title: "Build interactive metrics chart", status: "in_progress", priority: "medium", assigneeId: "tm_jordan", estimatedHours: 8, dueDate: "2026-11-01T09:00:00.000Z", hasActiveBlocker: false, createdAt: "2026-08-05T09:00:00.000Z" },
  { id: "task_lumen_04", workspaceId: WORKSPACE_ID, projectId: "proj_lumen_deck", title: "QA responsive layout", status: "todo", priority: "low", assigneeId: "tm_elena", estimatedHours: 4, dueDate: "2026-11-05T09:00:00.000Z", hasActiveBlocker: false, createdAt: "2026-08-05T09:00:00.000Z" },
  { id: "task_lumen_05", workspaceId: WORKSPACE_ID, projectId: "proj_lumen_deck", title: "Archive old deck assets", status: "done", priority: "low", assigneeId: "tm_theo", estimatedHours: 2, hasActiveBlocker: false, createdAt: "2026-08-10T09:00:00.000Z", completedAt: "2026-08-20T09:00:00.000Z" },

  // --- proj_rook_loyalty (risk: none — Dashboard-balance pass, see
  //     DECISIONS.md: was at_risk via condition 2, a high-priority task
  //     overdue by 6 days. task_rook_01 is now marked done [Theo fixed
  //     it] rather than its priority/date edited to dodge the
  //     condition — a completed task is excluded from "open tasks"
  //     entirely, the same exclusion every other condition already
  //     relies on. ---
  { id: "task_rook_01", workspaceId: WORKSPACE_ID, projectId: "proj_rook_loyalty", title: "Fix push notification bug", status: "done", priority: "high", assigneeId: "tm_theo", estimatedHours: 4, dueDate: "2026-09-28T09:00:00.000Z", hasActiveBlocker: false, createdAt: "2026-06-16T09:00:00.000Z", completedAt: "2026-10-03T09:00:00.000Z" },
  { id: "task_rook_02", workspaceId: WORKSPACE_ID, projectId: "proj_rook_loyalty", title: "Build rewards redemption flow", status: "todo", priority: "medium", assigneeId: "tm_priya", estimatedHours: 10, dueDate: "2026-11-10T09:00:00.000Z", hasActiveBlocker: false, createdAt: "2026-06-20T09:00:00.000Z" },
  { id: "task_rook_03", workspaceId: WORKSPACE_ID, projectId: "proj_rook_loyalty", title: "Write onboarding copy", status: "in_progress", priority: "medium", assigneeId: "tm_marcus", estimatedHours: 5, dueDate: "2026-11-15T09:00:00.000Z", hasActiveBlocker: false, createdAt: "2026-06-20T09:00:00.000Z" },
  { id: "task_rook_04", workspaceId: WORKSPACE_ID, projectId: "proj_rook_loyalty", title: "Set up analytics events", status: "todo", priority: "low", assigneeId: "tm_elena", estimatedHours: 3, dueDate: "2026-11-20T09:00:00.000Z", hasActiveBlocker: false, createdAt: "2026-06-25T09:00:00.000Z" },
  { id: "task_rook_05", workspaceId: WORKSPACE_ID, projectId: "proj_rook_loyalty", title: "Design loyalty tier badges", status: "done", priority: "medium", assigneeId: "tm_sana", estimatedHours: 4, hasActiveBlocker: false, createdAt: "2026-06-16T09:00:00.000Z", completedAt: "2026-07-01T09:00:00.000Z" },
  { id: "task_rook_06", workspaceId: WORKSPACE_ID, projectId: "proj_rook_loyalty", title: "Send weekly loyalty metrics email (due soon)", status: "todo", priority: "low", assigneeId: "tm_elena", estimatedHours: 1, dueDate: "2026-10-06T09:00:00.000Z", hasActiveBlocker: false, createdAt: "2026-09-29T09:00:00.000Z" },

  // --- proj_solstice_booking (risk: none — Dashboard-balance pass, see
  //     DECISIONS.md: was at_risk via condition 3, project due date
  //     within 3 days + progress <70%. The project's own due date
  //     (projects.ts) was genuinely inconsistent with its tasks —
  //     claimed due Oct 6 while its own open tasks run to Oct 25 — so
  //     the due date was corrected there, not the tasks here. ---
  { id: "task_solstice_01", workspaceId: WORKSPACE_ID, projectId: "proj_solstice_booking", title: "Build class booking calendar", status: "in_progress", priority: "medium", assigneeId: "tm_marcus", estimatedHours: 10, dueDate: "2026-10-15T09:00:00.000Z", hasActiveBlocker: false, createdAt: "2026-07-21T09:00:00.000Z" },
  { id: "task_solstice_02", workspaceId: WORKSPACE_ID, projectId: "proj_solstice_booking", title: "Integrate payment provider", status: "todo", priority: "medium", assigneeId: "tm_elena", estimatedHours: 8, dueDate: "2026-10-20T09:00:00.000Z", hasActiveBlocker: false, createdAt: "2026-07-21T09:00:00.000Z" },
  { id: "task_solstice_03", workspaceId: WORKSPACE_ID, projectId: "proj_solstice_booking", title: "Design instructor profile pages", status: "todo", priority: "low", assigneeId: "tm_theo", estimatedHours: 4, dueDate: "2026-10-25T09:00:00.000Z", hasActiveBlocker: false, createdAt: "2026-07-22T09:00:00.000Z" },
  { id: "task_solstice_04", workspaceId: WORKSPACE_ID, projectId: "proj_solstice_booking", title: "User-test booking flow", status: "done", priority: "medium", assigneeId: "tm_maya", estimatedHours: 3, hasActiveBlocker: false, createdAt: "2026-07-25T09:00:00.000Z", completedAt: "2026-08-05T09:00:00.000Z" },

  // --- proj_mariner_fleet (risk: at_risk — condition 4 only, stale
  //     active blocker — INTENTIONALLY left at_risk, Dashboard-balance
  //     pass: the workspace's one real At Risk example. Required by
  //     domain/validation.ts's state-coverage check (every RiskLevel
  //     must appear at least once) and by
  //     ai.integration.test.ts's "blocker resolved" test, which
  //     asserts this exact fixture starts with a stale blocker. ---
  { id: "task_mariner_01", workspaceId: WORKSPACE_ID, projectId: "proj_mariner_fleet", title: "Waiting on client fleet API keys", status: "blocked", priority: "medium", assigneeId: "tm_theo", estimatedHours: 6, dueDate: "2026-11-01T09:00:00.000Z", hasActiveBlocker: true, blockerStartedAt: "2026-10-01T09:00:00.000Z", createdAt: "2026-05-02T09:00:00.000Z" },
  { id: "task_mariner_02", workspaceId: WORKSPACE_ID, projectId: "proj_mariner_fleet", title: "Implement live vehicle tracking map", status: "in_progress", priority: "high", assigneeId: "tm_jordan", dueDate: "2026-11-10T09:00:00.000Z", hasActiveBlocker: false, createdAt: "2026-05-05T09:00:00.000Z" },
  { id: "task_mariner_03", workspaceId: WORKSPACE_ID, projectId: "proj_mariner_fleet", title: "Design dashboard KPI tiles", status: "todo", priority: "medium", assigneeId: "tm_marcus", estimatedHours: 6, dueDate: "2026-11-15T09:00:00.000Z", hasActiveBlocker: false, createdAt: "2026-05-10T09:00:00.000Z" },
  { id: "task_mariner_04", workspaceId: WORKSPACE_ID, projectId: "proj_mariner_fleet", title: "Write release notes", status: "done", priority: "low", assigneeId: "tm_elena", estimatedHours: 2, hasActiveBlocker: false, createdAt: "2026-05-15T09:00:00.000Z", completedAt: "2026-06-01T09:00:00.000Z" },

  // --- proj_fernwood_donor (risk: critical_risk — conditions 1+2, ratio 75% + high-priority overdue 4d) ---
  { id: "task_fernwood_01", workspaceId: WORKSPACE_ID, projectId: "proj_fernwood_donor", title: "Migrate donor records", status: "todo", priority: "high", assigneeId: "tm_theo", estimatedHours: 8, dueDate: "2026-09-30T09:00:00.000Z", hasActiveBlocker: false, createdAt: "2026-06-02T09:00:00.000Z" },
  { id: "task_fernwood_02", workspaceId: WORKSPACE_ID, projectId: "proj_fernwood_donor", title: "Fix broken donation form", status: "todo", priority: "medium", assigneeId: "tm_maya", estimatedHours: 5, dueDate: "2026-09-28T09:00:00.000Z", hasActiveBlocker: false, createdAt: "2026-06-02T09:00:00.000Z" },
  { id: "task_fernwood_03", workspaceId: WORKSPACE_ID, projectId: "proj_fernwood_donor", title: "Update donor portal FAQ", status: "in_progress", priority: "low", assigneeId: "tm_marcus", estimatedHours: 3, dueDate: "2026-09-29T09:00:00.000Z", hasActiveBlocker: false, createdAt: "2026-06-05T09:00:00.000Z" },
  { id: "task_fernwood_04", workspaceId: WORKSPACE_ID, projectId: "proj_fernwood_donor", title: "Build recurring-donation feature", status: "in_progress", priority: "medium", assigneeId: "tm_priya", estimatedHours: 10, dueDate: "2026-11-20T09:00:00.000Z", hasActiveBlocker: false, createdAt: "2026-06-10T09:00:00.000Z" },
  { id: "task_fernwood_05", workspaceId: WORKSPACE_ID, projectId: "proj_fernwood_donor", title: "Archive legacy donor CSVs", status: "done", priority: "low", assigneeId: "tm_elena", estimatedHours: 2, hasActiveBlocker: false, createdAt: "2026-06-12T09:00:00.000Z", completedAt: "2026-06-25T09:00:00.000Z" },

  // --- proj_brightline_compliance (risk: none) ---
  { id: "task_brightline_c_01", workspaceId: WORKSPACE_ID, projectId: "proj_brightline_compliance", title: "Draft compliance checklist", status: "in_progress", priority: "medium", assigneeId: "tm_priya", estimatedHours: 10, dueDate: "2026-11-01T09:00:00.000Z", hasActiveBlocker: false, createdAt: "2026-09-26T09:00:00.000Z" },
  { id: "task_brightline_c_02", workspaceId: WORKSPACE_ID, projectId: "proj_brightline_compliance", title: "Legal review of disclosures", status: "todo", priority: "high", assigneeId: "tm_theo", estimatedHours: 6, dueDate: "2026-11-15T09:00:00.000Z", hasActiveBlocker: false, createdAt: "2026-09-26T09:00:00.000Z" },
  { id: "task_brightline_c_03", workspaceId: WORKSPACE_ID, projectId: "proj_brightline_compliance", title: "Wireframe microsite structure", status: "todo", priority: "medium", assigneeId: "tm_marcus", estimatedHours: 5, dueDate: "2026-11-05T09:00:00.000Z", hasActiveBlocker: false, createdAt: "2026-09-27T09:00:00.000Z" },

  // --- proj_brightline_mobile (risk: none) ---
  { id: "task_brightline_m_01", workspaceId: WORKSPACE_ID, projectId: "proj_brightline_mobile", title: "Polish teaser landing animation", status: "review", priority: "medium", assigneeId: "tm_jordan", estimatedHours: 8, dueDate: "2026-10-28T09:00:00.000Z", hasActiveBlocker: false, createdAt: "2026-06-11T09:00:00.000Z" },
  { id: "task_brightline_m_02", workspaceId: WORKSPACE_ID, projectId: "proj_brightline_mobile", title: "Write App Store copy", status: "done", priority: "low", assigneeId: "tm_maya", estimatedHours: 2, hasActiveBlocker: false, createdAt: "2026-06-15T09:00:00.000Z", completedAt: "2026-07-01T09:00:00.000Z" },
  { id: "task_brightline_m_03", workspaceId: WORKSPACE_ID, projectId: "proj_brightline_mobile", title: "Record product teaser voiceover", status: "todo", priority: "medium", assigneeId: "tm_elena", estimatedHours: 3, dueDate: "2026-10-30T09:00:00.000Z", hasActiveBlocker: false, createdAt: "2026-06-20T09:00:00.000Z" },

  // --- proj_verdant_marketplace (risk: none) ---
  { id: "task_verdant_01", workspaceId: WORKSPACE_ID, projectId: "proj_verdant_marketplace", title: "Tag vendor categories", status: "todo", priority: "low", assigneeId: "tm_omar", dueDate: "2026-11-10T09:00:00.000Z", hasActiveBlocker: false, createdAt: "2026-08-11T09:00:00.000Z" },
  { id: "task_verdant_02", workspaceId: WORKSPACE_ID, projectId: "proj_verdant_marketplace", title: "Design vendor storefront template", status: "review", priority: "medium", assigneeId: "tm_sana", estimatedHours: 12, dueDate: "2026-11-15T09:00:00.000Z", hasActiveBlocker: false, createdAt: "2026-08-11T09:00:00.000Z" },
  { id: "task_verdant_03", workspaceId: WORKSPACE_ID, projectId: "proj_verdant_marketplace", title: "Set up farmer onboarding emails", status: "todo", priority: "medium", assigneeId: "tm_marcus", estimatedHours: 4, dueDate: "2026-11-20T09:00:00.000Z", hasActiveBlocker: false, createdAt: "2026-08-12T09:00:00.000Z" },
  { id: "task_verdant_04", workspaceId: WORKSPACE_ID, projectId: "proj_verdant_marketplace", title: "Load seasonal produce data", status: "done", priority: "low", assigneeId: "tm_theo", estimatedHours: 3, hasActiveBlocker: false, createdAt: "2026-08-13T09:00:00.000Z", completedAt: "2026-08-25T09:00:00.000Z" },

  // --- proj_nimbus_statuspage (risk: none) ---
  { id: "task_nimbus_01", workspaceId: WORKSPACE_ID, projectId: "proj_nimbus_statuspage", title: "Style incident timeline component", status: "in_progress", priority: "medium", assigneeId: "tm_omar", dueDate: "2026-11-01T09:00:00.000Z", hasActiveBlocker: false, createdAt: "2026-07-16T09:00:00.000Z" },
  { id: "task_nimbus_02", workspaceId: WORKSPACE_ID, projectId: "proj_nimbus_statuspage", title: "Wire up status API polling", status: "in_progress", priority: "high", assigneeId: "tm_priya", dueDate: "2026-11-05T09:00:00.000Z", hasActiveBlocker: false, createdAt: "2026-07-17T09:00:00.000Z" },
  { id: "task_nimbus_03", workspaceId: WORKSPACE_ID, projectId: "proj_nimbus_statuspage", title: "Write incident history copy", status: "todo", priority: "low", assigneeId: "tm_elena", estimatedHours: 3, dueDate: "2026-11-10T09:00:00.000Z", hasActiveBlocker: false, createdAt: "2026-07-18T09:00:00.000Z" },
  { id: "task_nimbus_04", workspaceId: WORKSPACE_ID, projectId: "proj_nimbus_statuspage", title: "Review uptime SLA language", status: "done", priority: "medium", assigneeId: "tm_maya", estimatedHours: 2, hasActiveBlocker: false, createdAt: "2026-07-19T09:00:00.000Z", completedAt: "2026-08-01T09:00:00.000Z" },

  // --- proj_copperfield_listings (risk: none) ---
  { id: "task_copperfield_01", workspaceId: WORKSPACE_ID, projectId: "proj_copperfield_listings", title: "Build saved-search feature", status: "todo", priority: "medium", assigneeId: "tm_jordan", dueDate: "2026-11-12T09:00:00.000Z", hasActiveBlocker: false, createdAt: "2026-08-06T09:00:00.000Z" },
  { id: "task_copperfield_02", workspaceId: WORKSPACE_ID, projectId: "proj_copperfield_listings", title: "Redesign listing card grid", status: "in_progress", priority: "medium", assigneeId: "tm_sana", estimatedHours: 12, dueDate: "2026-11-18T09:00:00.000Z", hasActiveBlocker: false, createdAt: "2026-08-06T09:00:00.000Z" },
  { id: "task_copperfield_03", workspaceId: WORKSPACE_ID, projectId: "proj_copperfield_listings", title: "Set up MLS data sync", status: "todo", priority: "high", assigneeId: "tm_theo", estimatedHours: 8, dueDate: "2026-11-25T09:00:00.000Z", hasActiveBlocker: false, createdAt: "2026-08-07T09:00:00.000Z" },
  { id: "task_copperfield_04", workspaceId: WORKSPACE_ID, projectId: "proj_copperfield_listings", title: "Draft agent bio template", status: "done", priority: "low", assigneeId: "tm_marcus", estimatedHours: 2, hasActiveBlocker: false, createdAt: "2026-08-08T09:00:00.000Z", completedAt: "2026-08-20T09:00:00.000Z" },

  // --- proj_cedar_intake (risk: none) ---
  { id: "task_cedar_01", workspaceId: WORKSPACE_ID, projectId: "proj_cedar_intake", title: "Build patient intake form UI", status: "todo", priority: "low", assigneeId: "tm_omar", estimatedHours: 6, dueDate: "2026-10-20T09:00:00.000Z", hasActiveBlocker: false, createdAt: "2026-05-21T09:00:00.000Z" },
  { id: "task_cedar_02", workspaceId: WORKSPACE_ID, projectId: "proj_cedar_intake", title: "Design appointment confirmation screen", status: "todo", priority: "high", assigneeId: "tm_sana", dueDate: "2026-10-22T09:00:00.000Z", hasActiveBlocker: false, createdAt: "2026-05-22T09:00:00.000Z" },
  { id: "task_cedar_03", workspaceId: WORKSPACE_ID, projectId: "proj_cedar_intake", title: "Final QA pass", status: "in_progress", priority: "medium", assigneeId: "tm_elena", estimatedHours: 3, dueDate: "2026-10-24T09:00:00.000Z", hasActiveBlocker: false, createdAt: "2026-05-23T09:00:00.000Z" },
  { id: "task_cedar_04", workspaceId: WORKSPACE_ID, projectId: "proj_cedar_intake", title: "Translate intake form (ES)", status: "done", priority: "low", assigneeId: "tm_marcus", estimatedHours: 4, hasActiveBlocker: false, createdAt: "2026-05-24T09:00:00.000Z", completedAt: "2026-06-10T09:00:00.000Z" },

  // --- proj_harbor_lookbook (completed — must be excluded from risk despite this task) ---
  { id: "task_lookbook_01", workspaceId: WORKSPACE_ID, projectId: "proj_harbor_lookbook", title: "Finalize lookbook photography", status: "done", priority: "medium", assigneeId: "tm_marcus", estimatedHours: 10, hasActiveBlocker: false, createdAt: "2026-04-02T09:00:00.000Z", completedAt: "2026-05-01T09:00:00.000Z" },
  { id: "task_lookbook_02", workspaceId: WORKSPACE_ID, projectId: "proj_harbor_lookbook", title: "Open, overdue, blocked task (exclusion test — project is completed)", status: "blocked", priority: "high", assigneeId: "tm_theo", estimatedHours: 5, dueDate: "2026-09-20T09:00:00.000Z", hasActiveBlocker: true, blockerStartedAt: "2026-09-30T09:00:00.000Z", createdAt: "2026-04-05T09:00:00.000Z" },

  // --- proj_quillpoint_author (on_hold — must be excluded from risk despite this task) ---
  { id: "task_quillpoint_01", workspaceId: WORKSPACE_ID, projectId: "proj_quillpoint_author", title: "Open, overdue, blocked task (exclusion test — project is on_hold)", status: "blocked", priority: "high", assigneeId: "tm_elena", estimatedHours: 6, dueDate: "2026-09-15T09:00:00.000Z", hasActiveBlocker: true, blockerStartedAt: "2026-09-29T09:00:00.000Z", createdAt: "2026-03-02T09:00:00.000Z" },
  { id: "task_quillpoint_02", workspaceId: WORKSPACE_ID, projectId: "proj_quillpoint_author", title: "Draft author bio template", status: "todo", priority: "low", assigneeId: "tm_marcus", estimatedHours: 3, dueDate: "2026-11-01T09:00:00.000Z", hasActiveBlocker: false, createdAt: "2026-03-05T09:00:00.000Z" },
];
