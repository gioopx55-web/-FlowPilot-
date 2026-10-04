# FlowPilot AI — Current Phase

> Single-glance status for any new session. Read this after `PROJECT_CONSTITUTION.md`, `PROJECT_PLAN.md`, and `DECISIONS.md`.

**Last updated:** 2026-10-04

---

## Current phase

**Phase 1 — Product Definition & V1 Scope: COMPLETE, approved, all open items resolved.**
**Phase 2 — Information Architecture: APPROVED / COMPLETE 2026-10-04.**
**Phase 3 — Data Model: APPROVED / COMPLETE 2026-10-04.**
**Phase 4 — Design System: APPROVED / COMPLETE 2026-10-04.**
**Phase 5 — Shared Application Shell: IMPLEMENTED 2026-10-04.**
**Phase 6 — Mock Data Foundation: IMPLEMENTED 2026-10-04.**
**Phase 7 — NOT STARTED, not yet proposed.**

A real Next.js application exists with a working shared shell (Sidebar/Topbar/MobileNav/SidePanel/theme/RTL architecture), placeholder pages for every module route, and now a complete typed/validated mock-data foundation (`src/data/mock/`) plus a domain layer (`src/domain/`: risk, workload, client follow-up, selectors, validation) for the fictional "Northbound Studio" workspace. No Dashboard/Projects/Tasks/Clients/Team/Analytics/AI business UI, no real auth/backend/billing exist yet — those are later phases. `tsc --noEmit`, `eslint`, `next build`, `npm run validate:data`, and `npm test` (32/32) all pass cleanly. See `PROJECT_PLAN.md` §18 for the full Phase 6 summary, `DECISIONS.md` D-032 for a Phase 5 build-time finding, and D-033/D-034 for two items that need owner attention (follow-up threshold, contrast audit timing).

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

## What is approved and locked (Phase 5)

- Next.js 16 App Router + TypeScript (strict, `noUncheckedIndexedAccess`) + Tailwind v4 + shadcn/ui (Radix base, RTL-enabled) scaffolded at the repo root (`PROJECT_PLAN.md` §16).
- Phase 4 design tokens wired into the Tailwind/shadcn theme contract; light/dark theme and `getLocale()`-driven lang/dir architecture implemented via `useSyncExternalStore` (no setState-in-effect).
- Full shell: Sidebar (collapsible, persisted), Topbar (title + AI/Notifications triggers), MobileNav (5-tab bar + More sheet per D-013), SidePanel (one shared AI/Notifications implementation, mutually exclusive per D-014, logical-end docking per D-017).
- Placeholder pages for every Phase 2 top-level route; shell-level and root-level error/loading/not-found boundaries.
- `src/types/entities.ts`: Phase 3 entity model as the single TypeScript source for later phases.
- D-032: SidePanel is non-modal on desktop/tablet and modal on mobile, with the topbar given a higher stacking position — a real architecture finding from Playwright smoke-testing, not a stylistic choice. Binding on any future panel-like component.
- Validation: `tsc --noEmit`, `eslint`, `next build` all pass with zero errors. Interactive checks (mutual exclusivity, mobile nav, dark mode repaint, real RTL path, reduced motion) all confirmed via Playwright.
- Git: repository initialized, 6 incremental commits (docs baseline → scaffold → tokens/theme → layout/primitives/entities → shell → placeholder routes).

## Phase 5 open items / known limitations

- Color tokens remain a starting palette (D-025) — not yet contrast-audited against final real content.
- Touch-target sizing (D-031, ~44×44px) was applied explicitly to Topbar/MobileNav/Sidebar controls but has not been exhaustively audited across every interactive element.
- No visible theme-toggle UI exists yet (architecture is wired; a Settings control is a later phase).
- Arabic typeface and full Arabic content remain an open, not-yet-made decision (D-026) — RTL architecture is verified working, translation is not in scope.

## What is approved and locked (Phase 6)

- Full typed Northbound Studio dataset in `src/data/mock/` (1 Workspace, 2 Users, 8 TeamMembers, 15 Clients, 18 ClientInteractions, 14 Projects, 55 Tasks, 16 Activities, 8 Notifications) — deliberately authored, not randomized, against the fixed `DEMO_TODAY_ISO` clock in `lib/demo-clock.ts` (`PROJECT_PLAN.md` §18).
- Single shared domain functions: `computeProjectRisk`, `computeTeamMemberWorkload`, `getClientFollowUpStatus`/`getLatestClientInteraction`, plus `domain/selectors.ts` as the only intended read path for future feature UI. No business logic belongs in React components (binding on Phase 7+).
- `domain/validation.ts` + `data/mock/index.ts`: the dataset is validated (referential integrity, unique IDs, workspace ownership, required state coverage, impossible field combinations) every time it's loaded, and throws loudly if invalid.
- Required state coverage confirmed by both the validator and `npm test` (32/32 passing): all 3 risk levels, all 4 workload bands, follow-up needed/not-needed/dormant, completed/on_hold risk exclusion, all 3 fallback-hours tiers.
- `FOLLOW_UP_STALE_DAYS = 7` is a Phase 6 proposal, **not yet owner-approved** (`DECISIONS.md` D-033/O-006).
- Contrast audit explicitly deferred to Phase 7 — no qualifying rendered UI exists yet to test against (`DECISIONS.md` D-034/O-007).
- Zero new dependencies: Node 24's native `node --test` plus a small custom ESM loader hook (`scripts/alias-loader.mjs`) resolve the existing `@/*` alias for scripts/tests.

## Phase 6 open items

- **O-006:** confirm or replace `FOLLOW_UP_STALE_DAYS = 7`.
- **O-007:** perform the WCAG AA contrast audit once Phase 7 (or later) renders real content using these tokens.

## Current phase scope (Phase 7 — not yet proposed)

Not started. The natural next step per `PROJECT_PLAN.md`'s approved roadmap is the first real business-feature phase (e.g., Dashboard), which should consume `domain/selectors.ts` rather than recompute risk/workload/follow-up logic in components — but Phase 7 itself has not been scoped, planned, or approved yet.

## Session checklist (do this before any new work)

1. Read `PROJECT_CONSTITUTION.md`.
2. Read `PROJECT_PLAN.md`.
3. Read `DECISIONS.md` (especially "Open").
4. Read this file.
5. Confirm requested task fits the current phase and doesn't conflict with a Decided entry.
6. If it conflicts: stop, explain the conflict, wait for direction.
7. If it fits: implement only what's approved for this phase.
8. If a decision or phase genuinely changes as a result of the task, update the relevant file(s) — `DECISIONS.md` for new/changed decisions, `CURRENT_PHASE.md` for phase transitions, `PROJECT_PLAN.md`/`PROJECT_CONSTITUTION.md` only when their content itself changes.
