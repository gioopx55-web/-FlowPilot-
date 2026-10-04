# FlowPilot AI — Current Phase

> Single-glance status for any new session. Read this after `PROJECT_CONSTITUTION.md`, `PROJECT_PLAN.md`, and `DECISIONS.md`.

**Last updated:** 2026-10-04

---

## Current phase

**Phase 1 — Product Definition & V1 Scope: COMPLETE, approved, all open items resolved.**
**Phase 2 — Information Architecture: APPROVED / COMPLETE 2026-10-04.**
**Phase 3 — Data Model: APPROVED / COMPLETE 2026-10-04.**
**Phase 4 — Design System: APPROVED / COMPLETE 2026-10-04.**
**Phase 5 — Shared Application Shell: IMPLEMENTATION-PLAN PROPOSAL STAGE (not yet approved; no application code written).**

No implementation has started. No files beyond this documentation set exist in the repository. No Next.js project, no dependencies, no code, no pages, no components, no mock data, no fixtures. Phase 5's implementation plan is proposal-only until approved; even once approved, Phase 5 must NOT build Dashboard/Projects/Tasks/Clients/Team/Analytics/AI business features and must NOT author mock fixtures (deferred to Phase 6 — see `DECISIONS.md` D-024).

**Approved roadmap (binding, D-024):** Phase 3 — Data Model → Phase 4 — Design System → Phase 5 — Shared Application Shell → Phase 6 — Mock Data Foundation → Phase 7+ TBD.

## What is approved and locked (Phase 1)

- Full product definition, personas, jobs-to-be-done, core workflows (`PROJECT_PLAN.md`).
- V1 feature scope with P0/P1/P2 classification per module, including Billing (demo) at P1 and Onboarding at P0 (`PROJECT_PLAN.md` §4, `DECISIONS.md` D-008/D-009).
- Explicit V1 exclusions and rationale (`PROJECT_PLAN.md` §5).
- AI scope boundary: deterministic demo logic only in V1, never presented as live inference; rule engine must sit behind a stable interface so a real AI API can later replace it without UI redesign (`PROJECT_CONSTITUTION.md` §8, `DECISIONS.md` D-002/D-009).
- Project Risk formula (At Risk / Critical Risk conditions) and Team Workload formula (hours-based with documented fallback) — `PROJECT_PLAN.md` §4a, `DECISIONS.md` D-010/D-011.
- Persona consolidation (Founder→Agency Owner, Ops Manager→PM) — `DECISIONS.md` D-003.
- Demo business name confirmed: Northbound Studio — `DECISIONS.md` D-012.
- Design direction, accessibility/RTL-as-architecture, responsive strategy, dependency-install-on-demand policy (`PROJECT_CONSTITUTION.md`).

## Phase 1 open items

None outstanding. All resolved 2026-10-04 (see `DECISIONS.md` D-008–D-012).

## What is approved and locked (Phase 2)

- Full information architecture: nav structure, route map, page hierarchy, detail-view IA for Project/Client/Team-member/Task, dashboard hierarchy, AI Assistant placement, notification/settings/onboarding architecture (`PROJECT_PLAN.md` §11).
- Mobile nav = 5-tab bar (Dashboard/Projects/Tasks/Clients/More), with Team/Analytics/Settings inside "More"; AI Assistant and Notifications reachable via dedicated global actions, never bottom-tab destinations (`DECISIONS.md` D-013).
- AI Assistant / Notifications mutual exclusivity confirmed on every breakpoint (`DECISIONS.md` D-014).
- Task Detail: exactly one shared component/data/business-logic implementation across panel-over-list and full-deep-link presentations — no duplicate implementations allowed (`DECISIONS.md` D-015). **Binding on Phase 3 data contract and Phase 4 build.**
- Risk/workload UI must always expose contributing conditions, never a bare status label (`DECISIONS.md` D-016). **Binding on Phase 3 data model** — risk/workload must be representable as condition flags.
- RTL logical-positioning rule: `inline-start`/`inline-end` map correctly per writing direction; sidebar docks start, AI/Notification panels dock end; no hardcoded left/right (`DECISIONS.md` D-017).
- Dashboard hierarchy numbered cleanly 1–6, drafting artifact removed (`DECISIONS.md` D-018).

## Phase 2 open items

None outstanding. All corrections resolved 2026-10-04 (see `DECISIONS.md` D-013–D-018).

## What is approved and locked (Phase 3)

- Complete entity model (13 entities), TypeScript field definitions, relationships, ID/reference strategy, workspace ownership model (`PROJECT_PLAN.md` §13).
- `TeamMember.jobTitle` (renamed from `role`, free text, never used for permissions) and `User.workspaceRole: "owner"|"manager"|"member"` (lightweight identity distinction, explicitly not RBAC) — `DECISIONS.md` D-020/D-021.
- Approved fallback-hours constants (low=2h, medium=4h, high=8h), applied only at computation time, never written to `Task.estimatedHours` — `DECISIONS.md` D-019.
- `ProjectRiskSnapshot`: V1 uses latest snapshot only, no history UI/analytics — `DECISIONS.md` D-022.
- Blocker model: `hasActiveBlocker`/`blockerStartedAt`, explicitly decoupled from `Task.status` — `DECISIONS.md` D-023.
- Risk/workload condition-flag representation satisfying D-016 (`RiskCondition[]`, derived `level`) — `PROJECT_PLAN.md` §13.17.
- Mock-data architecture and demo-data coverage *rules* defined — but no fixtures authored (`PROJECT_PLAN.md` §13.26, §13.31).
- Corrected roadmap: Phase 4 Design System → Phase 5 Shared Application Shell → Phase 6 Mock Data Foundation — `DECISIONS.md` D-024.

## Phase 3 open items

None outstanding. All resolved 2026-10-04 (see `DECISIONS.md` D-019–D-024).

## What is approved and locked (Phase 4)

- Visual direction: cool neutral foundation, one restrained indigo-blue accent, semantic-only status colors, no AI-purple/gradients/glassmorphism/oversized radius (`PROJECT_PLAN.md` §15.1–15.2).
- Light/dark color tokens accepted as a **starting palette**; WCAG AA validation has authority over any placeholder value once real component pairings exist in Phase 5 (`DECISIONS.md` D-025).
- Typeface: Inter for English UI (not installed until Phase 5 needs it); Arabic typeface is a separate, still-open decision for the future Arabic/RTL phase (`DECISIONS.md` D-026).
- Risk/workload explanation interaction: tooltip/popover (desktop/tablet, keyboard-accessible, not hover-only) + tap-to-expand (mobile); Critical Risk shows a primary reason visible at rest (`DECISIONS.md` D-027).
- Radius scale 6/8/12px with a binding ≤12px ceiling absent an approved exception (`DECISIONS.md` D-028).
- Breakpoints (mobile <640, tablet 640–1024, desktop >1024) approved as baseline; new breakpoints require a documented reason (`DECISIONS.md` D-029).
- Motion/3D separation reaffirmed: no scroll animation or literal 3D in the app shell; landing page may explore motion/depth later under named conditions, specified separately when designed (`DECISIONS.md` D-030).
- Touch-target minimum ~44×44px for primary mobile/tablet controls; desktop table density unaffected (`DECISIONS.md` D-031).
- Full component-level rules (buttons, inputs, tables, cards, badges, sidebar, topbar, dialogs/drawers, AI/notification visual language), empty/loading/error states, iconography, shadcn/external-library strategy, design QA checklist, accessibility requirements (`PROJECT_PLAN.md` §15.4–15.19).

## Phase 4 open items

None outstanding. All resolved 2026-10-04 (see `DECISIONS.md` D-025–D-031). Note: Arabic typeface choice remains open for the future Arabic/RTL implementation phase (not a Phase 5 blocker).

## Current phase scope (Phase 5 — implementation-plan proposal stage)

Shared application shell only, plan form first (no code yet): Next.js/TypeScript/Tailwind/shadcn setup approach, minimal initial dependency list, folder structure, App Router structure, root layout, shell architecture (sidebar/topbar/mobile nav/drawers), theme/dark-mode/RTL architecture, logical-CSS strategy, typography and design-token implementation strategy, global styles, reusable primitive boundaries, responsive shell behavior, accessibility requirements, motion foundation + reduced-motion implementation, error/loading boundaries, lint/type-check/build validation, Git checkpoint strategy, expected files/folders, acceptance criteria. Explicitly excludes: Dashboard/Projects/Tasks/Clients/Team/Analytics/AI business features, and mock fixtures (deferred to Phase 6, per D-024). Awaits explicit user approval of the plan before any Next.js init, dependency install, or application code is written — this file must be updated again once that approval happens, with a new "What is approved and locked (Phase 5)" section.

## Session checklist (do this before any new work)

1. Read `PROJECT_CONSTITUTION.md`.
2. Read `PROJECT_PLAN.md`.
3. Read `DECISIONS.md` (especially "Open").
4. Read this file.
5. Confirm requested task fits the current phase and doesn't conflict with a Decided entry.
6. If it conflicts: stop, explain the conflict, wait for direction.
7. If it fits: implement only what's approved for this phase.
8. If a decision or phase genuinely changes as a result of the task, update the relevant file(s) — `DECISIONS.md` for new/changed decisions, `CURRENT_PHASE.md` for phase transitions, `PROJECT_PLAN.md`/`PROJECT_CONSTITUTION.md` only when their content itself changes.
