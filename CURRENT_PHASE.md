# FlowPilot AI — Current Phase

> Single-glance status for any new session. Read this after `PROJECT_CONSTITUTION.md`, `PROJECT_PLAN.md`, and `DECISIONS.md`.

**Last updated:** 2026-10-05

---

## Current phase

**Phase 1 — Product Definition & V1 Scope: COMPLETE, approved, all open items resolved.**
**Phase 2 — Information Architecture: APPROVED / COMPLETE 2026-10-04.**
**Phase 3 — Data Model: APPROVED / COMPLETE 2026-10-04.**
**Phase 4 — Design System: APPROVED / COMPLETE 2026-10-04.**
**Phase 5 — Shared Application Shell: IMPLEMENTED 2026-10-04.**
**Phase 6 — Mock Data Foundation: IMPLEMENTED 2026-10-04.**
**Phase 7 — Dashboard: IMPLEMENTED 2026-10-04.**
**Phase 8 — Projects: IMPLEMENTED 2026-10-04.**
**Phase 9 — Tasks / Kanban: IMPLEMENTED 2026-10-04.**
**Phase 10 — Clients / CRM: IMPLEMENTED 2026-10-04.**
**Phase 11 — Analytics: IMPLEMENTED 2026-10-04.**
**Phase 12 — Team: IMPLEMENTED 2026-10-04.**
**Phase 13 — AI Assistant: IMPLEMENTED 2026-10-05.**
**Phase 13.5 — Public Landing Page: IMPLEMENTED 2026-10-05.**
**Phase 13.6 — Visual Graphics & Landing Page Polish: IMPLEMENTED 2026-10-05.**
**Phase 14 — Auth / Settings / Billing Demo: IMPLEMENTED 2026-10-05.**
**Phase 15 — Arabic / RTL QA: IMPLEMENTED 2026-10-05.**

A real Next.js application exists with a working shared shell, a complete typed/validated mock-data foundation, a domain layer (risk, workload, client follow-up, project/task queries, selectors, Daily Brief, task/client/settings mutations, analytics, team, AI intents), `/dashboard`, the complete Projects module, the complete global Tasks module (`/tasks` list + Kanban, `/tasks/:taskId` direct link), the complete Clients module (`/clients` list, `/clients/:clientId` detail with Overview/Projects/Interactions tabs), the complete Analytics module (`/analytics`), the complete Team module (`/team` list, `/team/:memberId` detail), the complete V1 AI Assistant (global side panel: Daily Brief, overdue/at-risk/follow-up/workload queries, project summary/risk explanation, team member workload explanation, weekly report — deterministic/rule-based, no real LLM), the complete demo auth/session/Settings/Billing layer (`/login` demo entry, a presence-cookie demo session, centralized route protection via `src/proxy.ts`, a 5-tab Settings area — Profile/Workspace/Appearance/Notifications/Billing — and a compact account menu with logout), and a premium, visually-polished public Landing Page at `/` (structurally separate from the `(app)` shell, reusing real selectors/components for every product preview, with a restrained graphic layer — icon-framed bullets, a backdrop-layered Hero, an AI flow diagram, alternating section backgrounds; its CTAs now route through `/login`, not directly into the app) — all backed by a server-side in-memory demo-state layer (D-039, extended for clients, and again for Phase 14 settings) so edits are consistent everywhere without a real backend. Real auth/backend/payments do not exist — the demo session is an unencrypted presence cookie and Billing is a disabled, truthful read-only summary (D-061/D-063). The whole product has now been through a dedicated RTL/localization QA pass (Phase 15): a full-codebase directional-CSS grep audit found the architecture already sound (centralized `getLocale()` seam, logical CSS/flex throughout, no hardcoded `ml-`/`mr-`/`left-`/`right-` outside legitimate physical/decorative cases), and a full Playwright RTL visual sweep across every module found and fixed 2 real bugs — both confined to Phase 14's Settings additions (bidi-scrambled numeric summary lines, a bare bullet-marker character) — documented in D-065/D-066/D-067. `tsc --noEmit`, `eslint`, `npm run validate:data`, and `npm test` (158/158, unchanged) all pass cleanly. **`next build` could not be re-confirmed during Phase 15** — the same `fonts.googleapis.com` gap documented since Phase 11 (D-060) was still failing at the end of this phase; re-confirmed via `curl` that only this one host times out. Not a code issue. See `PROJECT_PLAN.md` §26-§33 and `DECISIONS.md` D-036/D-039/D-040/D-041 (Phase 10), D-042/D-043/D-044 (Phase 11), D-045/D-046/D-047 (Phase 12), D-048/D-049/D-050/D-051 (Phase 13), D-052 through D-056 (Phase 13.5), D-057 through D-060 (Phase 13.6), D-061 through D-064 (Phase 14), D-065 through D-067 (Phase 15) for these phases' key decisions.

Committed in logical checkpoints per phase (Phase 10: demo-state layer, UI components, routes, tests, docs; Phase 11: data-model extension, domain layer, UI components, tests, docs; Phase 12: domain layer, UI components, tests, docs; Phase 13: AI domain layer, Server Action + panel-context extension, UI components + contextual entry points, tests, docs; Phase 13.5: animation dependency + shared marketing primitives, Hero + showcase sections, shared-primitive bug fixes, docs; Phase 13.6: graphic-layer primitives, Hero depth + 7 showcases' icon/background treatment, RTL arrow fix, docs; Phase 14: demo-session + route-protection primitives, Login page, Settings (5 tabs) + account menu, Landing CTA rewiring, tests, docs; Phase 15: 2 RTL bug fixes in Settings, docs) — see `git log`.

---

**Approved roadmap (binding, D-024):** Phase 3 — Data Model → Phase 4 — Design System → Phase 5 — Shared Application Shell → Phase 6 — Mock Data Foundation → Phase 7 — Dashboard → Phase 8 — Projects → Phase 9 — Tasks/Kanban → Phase 10 — Clients/CRM → Phase 11 — Analytics → Phase 12 — Team → Phase 13 — AI Assistant → Phase 13.5 — Public Landing Page → Phase 13.6 — Visual Graphics & Landing Page Polish → Phase 14 — Auth / Settings / Billing Demo → Phase 15 — Arabic / RTL QA → Phase 16+ TBD.

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
- `FOLLOW_UP_STALE_DAYS = 7` — **approved** as the authoritative V1 threshold (`DECISIONS.md` D-033).
- Zero new dependencies: Node 24's native `node --test` plus a small custom ESM loader hook (`scripts/alias-loader.mjs`) resolve the existing `@/*` alias for scripts/tests.

## Phase 6 open items

None. Both resolved in Phase 7 (D-033 approved, D-034 performed as D-035).

## What is approved and locked (Phase 7)

- `/dashboard` — the first real business screen, six sections in the approved order (Daily Brief / At-Risk Projects / Overdue Tasks / Clients Needing Follow-Up / Team Workload Snapshot / Recent Activity), consuming only `src/domain` selectors (`PROJECT_PLAN.md` §20).
- `domain/dailyBrief.ts`: deterministic rule-based Daily Brief — explicitly not an AI call.
- New sorted selectors (`getAtRiskProjectsSorted`, `getOverdueTasksSorted`, `getClientsNeedingFollowUpSorted`, `getTeamWorkloadSnapshot`, `getRecentActivities`); `getOverdueTasks` now excludes completed/on_hold projects' tasks (a real bug found via visual verification, with a regression test).
- `RiskBadge`/`WorkloadBadge`/`ConditionsDisclosure`: risk/workload reasons always reachable (D-016), one disclosure implementation satisfying both desktop keyboard-accessibility and mobile tap-to-expand (D-027).
- Dashboard list rows use an always-stacked layout, not a viewport-breakpoint row/column switch — found to be the only robust fix once the page's own 2-column section grid made column width unpredictable from viewport width alone.
- D-035: WCAG AA contrast audit performed against real rendered content; 4 tokens adjusted (light success/warning/danger darkened, dark accent lightened, focus-ring opacity /50→/70 sitewide), each documented with before/after ratios in `tokens.css`.
- Validation: `tsc --noEmit`, `eslint`, `next build` clean; `npm test` 33/33; `npm run validate:data` clean; Playwright visual verification at desktop/tablet/mobile × light/dark + RTL, zero console errors, zero horizontal overflow.

## Phase 7 open items

None outstanding.

## What is approved and locked (Phase 8)

- Complete Projects module: `/projects` (filterable/sortable dense list) and `/projects/:projectId` with a shared header + route-backed tabs (Overview/Tasks/Team/Activity) (`PROJECT_PLAN.md` §22).
- Filters/sort reflected in the URL (deep-linkable, Back-restorable); filtering/sorting rules live in `domain/selectors.ts` (`getFilteredProjects`), not in the filter component.
- Project Team tab: membership derived from task assignments, never a separately authored list; project-scoped hours explicitly distinct from "Global workload" — binding pattern for any future per-project member view.
- Project Tasks tab reads the same `Task` records the future global Tasks module will use — no duplicated data. List/Kanban toggle present with Kanban genuinely disabled and labeled "(Phase 9)."
- Thin link-target placeholders at `/tasks/:taskId`, `/team/:memberId`, `/clients/:clientId` so Project Detail's links resolve — ID-validated, 404 on a genuinely bad ID.
- D-036: shared `requireProject()` not-found guard required at every project-scoped entry point (layout + all 4 tabs), and `not-found.tsx` placed in the *parent* segment — binding pattern for any future nested dynamic route. Known limitation: not-found responses return HTTP 200 (Phase 5's loading.tsx streaming boundary), not 404 — content is correct, status code is not; not pursued further.
- D-037: `npm test` was silently running only 1 of 5 test files since Phase 6 (no globstar support in npm's script shell) — fixed with `find | xargs`; confirmed 43/43 actually run now.
- Validation: `tsc --noEmit`, `eslint`, `next build` clean; `npm test` 43/43; `npm run validate:data` clean; whole-app route smoke check all 200; Playwright visual verification at desktop/tablet/mobile × light/dark + live RTL, zero console errors, zero horizontal overflow.

## Phase 8 open items

None outstanding. D-036's HTTP-200-on-not-found is a documented limitation, not an open item requiring action.

## What is approved and locked (Phase 9)

- Complete global Tasks module: `/tasks` (list + Kanban, URL-driven filters/sort/view) and `/tasks/:taskId` (direct deep link) (`PROJECT_PLAN.md` §24).
- D-038: Kanban's 5 columns map 1:1 onto the locked `TaskStatus` enum (no "Backlog" status added, "Blocked" is a real column) — `TASK_STATUS_LABEL` in `StatusBadge.tsx` is the one canonical source. **Binding** on any future Kanban-adjacent UI.
- D-039: V1 demo-state/persistence is a server-side, in-memory overrides map (`domain/taskMutations.ts`), process-lifetime, applied at `getDemoDataset()` read time — not localStorage, not a client store. Next.js Server Actions (`lib/taskActions.ts`) + `revalidatePath` keep every page consistent. **Binding** on any future task/project/client mutation feature — reuse this pattern, don't introduce a second state store.
- `TaskDetailContent`: the one shared Task Detail implementation, rendered identically by the `?task=`-query-param panel (preserves list/Kanban/Project-Tasks context, no navigation) and the direct page.
- `StatusSelect`: the guaranteed-accessible alternate to Kanban drag, present on every card and in Task Detail — real mouse/touch drag (`@dnd-kit/core`) is an accelerator on top of it, never the only path.
- Project Tasks tab now reuses the exact same `TasksView`/`TasksTable`/`KanbanBoard` components, project-scoped — no separate Project Kanban implementation.
- Domain recalculation proven end-to-end: 5 integration tests confirm a task edit changes `computeProjectRisk`/`computeTeamMemberWorkload` output through the real demo dataset.
- Validation: `tsc --noEmit`, `eslint`, `next build` clean; `npm test` 67/67; `npm run validate:data` clean; whole-app route smoke check all 200; real mouse drag-and-drop verified end-to-end via Playwright (not just the accessible fallback); RTL verified via the real `getLocale()` path.

## Phase 9 open items

None outstanding.

## What is approved and locked (Phase 10)

- Complete Clients module: `/clients` (filterable/sortable dense list, default sort needs-follow-up-first) and `/clients/:clientId` with a shared header + route-backed tabs (Overview/Projects/Interactions) (`PROJECT_PLAN.md` §26).
- Follow-up computation is read-only consumed, never re-implemented: all client-list/detail follow-up state goes through `getClientFollowUpStatus`/`getLatestClientInteraction` (`domain/clients/followUp.ts`, D-033).
- D-039 (demo-state architecture) extended, not duplicated: `domain/clientMutations.ts` adds client field overrides + an appended-interactions list, both server-side/in-memory; `getDemoDataset()` re-derives `lastInteractionAt` fresh from base+added interactions on every call, so an added interaction flows through the one real follow-up computation automatically (interaction list, follow-up badge, and Dashboard's Clients Needing Follow-Up all update together via `revalidatePath`, no manual per-view patching). **Binding** on any future client-mutation feature — reuse this pattern.
- D-040: Client Detail has a lightweight Overview tab beyond the original Phase 2 §11.7 IA (Projects/Interactions only) — justified as matching Project Detail's existing Overview-as-landing pattern, no new data/selectors introduced.
- D-041: Add Interaction uses a plain native controlled form, not React Hook Form + Zod — judged unjustified for 2 fields/1 validation rule; same native-input pattern as `TaskDetailContent.tsx`.
- Projects tab reuses the global `ProjectsTable` (new `showClient` prop, default `true`) with `getClientProjectsWithRisk` — zero duplicated project/risk data. Interactions tab is backed entirely by `ClientInteraction`, no new interaction types.
- D-036 guard pattern reused without modification: `requireClient()` called from `[clientId]/layout.tsx` and every tab; `clients/not-found.tsx` lives in the parent segment.
- Client `status` (active/retainer/dormant) and computed follow-up state remain structurally separate — editing one never touches the other's storage.
- The Phase 2 "Draft update for this client" AI entry point is intentionally absent from this phase's UI (not even a disabled stub — the real tabs already fill the header/action space).
- Validation: `tsc --noEmit`, `eslint`, `next build` clean; `npm test` 84/84 (17 new); `npm run validate:data` clean; whole-app route smoke check all 200 (no regressions); Playwright interactive verification of list/detail/tabs/add-interaction/not-found/dashboard with zero console errors; dark mode, real-`getLocale()` RTL, and mobile (390×844) all verified on Client Detail; bidirectional Project↔Client navigation confirmed.

## Phase 10 open items

None outstanding.

## What is approved and locked (Phase 11)

- Complete Analytics module: `/analytics` with a top operational summary, On-Time Delivery, Overdue Task Trend, Workload Distribution, Project Status + Project Risk distributions, and a text-only Insights section (`PROJECT_PLAN.md` §27).
- D-042: `Project.completedAt` added (mirrors `Task.completedAt`'s invariant) — a genuine Phase 3 data-model extension, stopped-and-reported to the owner before being made. 5 completed-project fixtures added so On-Time Delivery Rate has a real 6-project sample (4 on-time, 2 late) instead of N=1. **Binding**: any future "completed project" feature reads this field, never re-derives a delivery date from elsewhere.
- `domain/analytics.ts` is the one place analytics math lives — `getOnTimeDeliveryRate`, `getWorkloadDistribution`, `getOverdueTaskTrend`, `getProjectStatusDistribution`, `getProjectRiskDistribution`, `getActiveProjectAverageProgress` — all reading `getDemoDataset()`/existing selectors, never recomputing risk or workload. **Binding** on any future analytics/reporting feature — extend this file, don't compute chart data in components.
- D-043: Overdue Task Trend is reconstructed from real `Task.dueDate`/`completedAt` fields (no synthetic historical fixture) — proven identical to `getOverdueTasks()` at its last point and live-reactive to task mutations.
- On-Time Delivery Rate only scores a completed project with BOTH `completedAt` and `dueDate`, and renders an explicit "not enough data" message (never a misleading 0%/100%) when there are zero scoreable completed projects.
- Recharts (`^3.10.1`) installed per Phase 11 §5 — the only chart library approved; every chart is wrapped behind a FlowPilot component (never raw Recharts in page code), themed only through existing semantic tokens (`analyticsColors.ts`), with a shared `ChartTooltip` and a `useReducedMotion` hook (`useSyncExternalStore`-based) disabling entrance animation under reduced motion.
- D-044: every chart's SVG container is forced `dir="ltr"` regardless of page direction — Recharts is not RTL-aware and without this the Workload Distribution Y-axis labels overlapped the bars in RTL (found and fixed via visual verification). **Binding** on any future Recharts/SVG-chart component.
- Validation: `tsc --noEmit`, `eslint` clean; `npm test` 97/97 (13 new); `npm run validate:data` clean; whole-app route smoke check all 200 (no regressions); Playwright visual verification across desktop light/dark/RTL, tablet, mobile (no horizontal overflow), and `prefers-reduced-motion: reduce`, zero console errors. `next build` passed earlier in the session but could not be re-verified after this phase's changes due to a network route to `fonts.googleapis.com` being unavailable in this environment (unrelated to Phase 11's code — see `PROJECT_PLAN.md` §27's "Known limitation"). Re-run `next build` once that network access returns, before treating this phase's build status as fully re-confirmed.

## Phase 11 open items

Superseded by the Phase 12 open item below — the `next build` gap was re-checked during Phase 12, not resolved.

## What is approved and locked (Phase 12)

- Complete Team module: `/team` (filterable/sortable dense list, default sort action-oriented) and `/team/:memberId` (one scrollable detail page — no tabs) (`PROJECT_PLAN.md` §28).
- Workload logic is read-only consumed everywhere, never recomputed: `getTeamMembersWithWorkload`/`getTeamMembersFiltered`/`getTeamMemberDetail` all call the existing `computeTeamMemberWorkload`/`getTeamMemberWorkload`. **Binding**: no Team component may compute a workload percentage or band itself.
- Default team sort is `workload` (Overloaded → High → Healthy → Available, ties by % desc), reusing the exact `WORKLOAD_BAND_RANK` constant Dashboard's `getTeamWorkloadSnapshot` already defined — never alphabetical by default.
- D-045: `hoursForTask` exported from `domain/workload/workload.ts` so `getMemberWorkloadContributors` can show each task's own hour contribution without a second fallback-hours implementation.
- D-046: `WorkloadBadge` gained an optional `showPercent` prop (default `true`, every pre-Phase-12 call site unchanged) — Team Member Detail passes `false` to avoid showing its own headline percentage twice. **Binding**: any future page that shows its own large workload number should do the same rather than duplicating WorkloadBadge's logic.
- D-047: no active/inactive filter (every fixture member is active — it would filter nothing) and no capacity editing (kept read-only; nothing in Phase 12's requirements needed it).
- Assignments grouped by project (`getMemberAssignmentsGroupedByProject`) explicitly separates project-scoped contribution hours from the page's own global workload percentage — same distinction established for `ProjectTeamTab` in Phase 8 §8. Opening a task reuses the exact `TaskDetailPanel`/`TaskDetailContent` Phase 9 built, via `?task=` on the Team Member Detail URL.
- D-036 guard pattern reused without modification: `requireTeamMember()` called from the detail page; `team/not-found.tsx` lives in the parent segment.
- Current-state mutation integration proven: reassignment/estimate-edit/completion all update Team, and `getTeamWorkloadSnapshot` (Dashboard)/`getWorkloadDistribution` (Analytics) agree exactly with Team's own numbers (`team.integration.test.ts`).
- Validation: `tsc --noEmit`, `eslint` clean (after removing stale `.next/types/* 2.ts` duplicate files — a macOS/iCloud Desktop-sync artifact, not a Team code issue); `npm test` 111/111 (14 new); `npm run validate:data` clean; whole-app route smoke check all 200 (no regressions); Playwright visual verification across desktop light/dark/RTL, tablet, mobile (no horizontal overflow, correct state→reason→assignments priority order), and `prefers-reduced-motion: reduce`, zero console errors.

## Phase 12 open items

Resolved — see D-051. The `fonts.googleapis.com` gap carried from Phases 11-12 was re-verified and confirmed fixed during Phase 13 (two independent clean `next build` runs, both successful). `PROJECT_PLAN.md` §27/§28/§29 and this file are updated accordingly.

## What is approved and locked (Phase 13)

- Complete V1 AI Assistant: the existing Phase 5 global side panel (no new route) — Daily Brief, overdue tasks, at-risk projects, clients needing follow-up, workload analysis, project summary, project risk explanation, team member workload explanation, weekly report (`PROJECT_PLAN.md` §29).
- D-048: `domain/ai/` is the one AI orchestration layer (`intents.ts`/`executeIntent.ts`/4 detail builders), behind the one read-only Server Action boundary `lib/aiActions.ts`. **Binding**: no AI business reasoning may live in `components/ai/*`; any new intent is added here, not in a component.
- The 9-intent system is finite and keyword-matched (`matchFreeText`) — never unrestricted NLU. Unmatched/unsupported input always returns the exact honest fallback sentence, never a fabricated answer.
- D-049: entity name resolution matches a full name or any individual name word (whole-word only) — a real "first name only" matching gap was found and fixed via the test suite before visual verification.
- One data source: every intent's answer comes from existing Phase 7/8/12 selectors (`getDailyBriefItems`, `getOverdueTasksSorted`, `getAtRiskProjectsSorted`, `getClientsNeedingFollowUpSorted`, `getTeamWorkloadSnapshot`, `getProjectRisk`, `getTeamMemberDetail`/`getMemberWorkloadContributors`, etc.) — zero re-implemented risk/workload/follow-up logic. The AI's Daily Brief is proven byte-identical to the Dashboard's.
- Contextual entry points live on Project Detail ("Summarize"/"Explain risk") and Team Member Detail ("Explain workload"), via a new `aiPendingRequest` on `panel-context.tsx` — both open the SAME global panel pre-scoped, never a separate AI implementation. A `useRef` guard prevents React Strict Mode's dev-only double-invoke from double-appending an answer (found and fixed during visual verification).
- D-048: conversation state is plain `useState` inside the panel component — lightweight, current-session-only, resets on reload. The `AIConversation`/`AIMessage` entities and the D-039 demo-state layer are deliberately NOT used for this.
- D-050: no artificial composing/"thinking" delay — answers render as soon as the Server Action resolves.
- One honest disclosure line ("Demo AI — powered by workspace rules, not a live model.") at the top of the panel, not repeated elsewhere.
- Current-state mutation integration proven: reassignment/completion/blocker-resolution/client-interaction all update the relevant AI answer immediately (`ai.integration.test.ts`).
- D-051: the Phase 11/12 `next build` network gap is resolved — re-verified with two independent clean builds, no font-architecture change made.
- Validation: `tsc --noEmit`, `eslint` clean; `npm test` 142/142 (31 new); `npm run validate:data` clean; whole-app route smoke check all 200 (no regressions); `next build` passes; Playwright visual verification across desktop light/dark/RTL, tablet, mobile (full-screen sheet, no horizontal overflow), `prefers-reduced-motion: reduce`, and AI/Notifications mutual exclusivity, zero console errors.

## Phase 13 open items

None outstanding.

## What is approved and locked (Phase 13.5)

- `/` is the public Landing Page (D-052) — structurally separate from the `(app)` shell, no `AppShell`, no shared composition with `components/shell/*`. Every authenticated route is unchanged. **Binding**: future marketing-page work extends `components/marketing/*`, never the app shell, and vice versa.
- Motion (`motion` ^14.0.0) is the one animation library (D-053), used only where scroll-progress-linked motion is genuinely needed (`RevealOnScroll`, `StaggerGroup`/`StaggerItem`, the Hero's scroll-driven tilt); simpler interactions (the nav's scroll-triggered background) stay plain CSS/DOM. **Binding**: do not add a second animation library.
- Depth/3D is a CSS-perspective tilt on the Hero preview only (D-054) — no 3D library anywhere in the app.
- D-055: every showcase visual reads real domain selectors and renders real primitive components against the live demo dataset — never a separate marketing fixture set. Two documented, narrow exceptions (Hero glance-tiles use plain `Badge`; Analytics showcase avoids importing Recharts into the public bundle).
- D-056: three real bugs found via visual verification, all fixed — `ConditionsDisclosure` needed `shrink-0` (now fixed at the primitive level, affects nothing else), the Hero's glance-tiles were simplified away from the full `RiskBadge`/`WorkloadBadge` (too little width for that primitive's reason-text + disclosure button), and `min-w-0` was added to 3 `lg:grid-cols-2` layouts to fix a real mobile horizontal-scroll bug (CSS Grid blowout).
- Validation: `tsc --noEmit`, `eslint` clean; `npm test` 142/142 (no new tests — no new business logic, only presentation); `npm run validate:data` clean; `next build` passes, `/` prerenders statically; whole-app route smoke check all 200 (no regressions); CTA-to-demo navigation confirmed; Playwright visual verification across desktop light/dark, full RTL scroll sweep, mobile (no horizontal overflow, mobile nav menu), tablet, and a complete reduced-motion pass, zero console errors.

## Phase 13.5 open items

None outstanding.

## What is approved and locked (Phase 13.6)

- A restrained graphic layer on the Landing Page only: `IconFrame`, `DotGrid`, `FlowDiagram`, plus `icon`/`eyebrowIcon`/`tone` props on `PreviewCard`/`ShowcaseLayout` (D-057). No new npm dependency.
- Every showcase's eyebrow + bullets carry a semantically chosen Lucide icon in an `IconFrame` — never a generic sparkle as decoration, never a giant colorful icon.
- Alternating `canvas`/`surface` section backgrounds (with a low-opacity `DotGrid` on `surface` sections) give the 7 showcases visual rhythm without seven different layouts.
- D-058: the Hero gained a layered backdrop fragment + a floating "N need attention" chip, both purely decorative (`aria-hidden`), both rendered as siblings of the main card (never children — the card's own `overflow-hidden` would clip them).
- D-059: `FlowDiagram` (the AI section's "Workspace data → FlowPilot AI → Structured action" composition) is a directional relationship, so it mirrors in RTL (node order + a flipped connector arrow, `rtl:-scale-x-100`) — found and fixed a real arrow-direction mismatch via RTL visual verification. `IconFrame`/`DotGrid` are pure decoration and intentionally do not mirror. **Binding**: any future directional marketing graphic should follow the same rule — mirror what's directional, leave pure decoration alone, and document the exception either way.
- D-060: the `next build` `fonts.googleapis.com` gap (resolved in Phase 13, D-051) recurred intermittently during Phase 13.6 and was not re-confirmed — this is an environment network fluctuation, not a code regression. Every other validation (`tsc`/`eslint`/142 tests/data-validation/route-smoke-tests/full Playwright visual verification) passed cleanly.
- Only `components/marketing/*` plus the two small `PreviewCard`/`ShowcaseLayout` prop additions were touched — zero changes to `domain/`, any `(app)` route, or application business logic.

## Phase 13.6 open items

`next build` needs one more clean run once this environment has network access to `fonts.googleapis.com` again (D-060) — not expected to fail (nothing in Phase 13.6 touches font loading, and it passed twice during Phase 13.5 with this exact same font setup), but not directly re-confirmed after this phase's changes. Re-run it before treating any future phase's build status as resting on a confirmed baseline.

## What is approved and locked (Phase 14)

- `/login`: a real, standalone (outside the `(app)` shell) demo entry point — one primary action ("Continue to Demo"), no credential fields, reusing the existing `DotGrid` marketing motif as a legitimate public-surface pattern (`PROJECT_PLAN.md` §32).
- D-061: the demo session is a single `httpOnly`/`sameSite=lax` presence cookie (`fp_demo_session`), not an encrypted/signed token — deliberately simpler than the Next.js "Stateless Sessions" JWT pattern, since every visitor shares one workspace and there is no real secret to protect. Route protection is centralized in `src/proxy.ts` (Next.js 16's renamed middleware convention) using only an "optimistic" cookie-presence check, with `lib/protectedRoutes.ts` as the single shared allowlist (used by both the proxy and the sign-in redirect) and `sanitizeRedirectTarget()` guarding against open redirects. **Binding**: any future protected route is added to `PROTECTED_ROUTE_PREFIXES`, never guarded ad hoc in a page.
- D-062: Settings state extends D-039's server-side in-memory overrides pattern (`domain/settingsMutations.ts`) rather than introducing a second persistence mechanism — Profile (`displayName`/`email`) and Notification preferences are mutable demo state; Workspace and Profile's `jobTitle` are deliberately read-only (`jobTitle` specifically to avoid reopening D-047's Team-is-read-only-in-V1 boundary). `resetDemoDataAction` now also clears settings overrides — one reset mechanism, not two.
- 5-tab Settings area (`/settings`, `/settings/workspace`, `/settings/appearance`, `/settings/notifications`, `/settings/billing`), a persistent header + route-backed tabs shell, same pattern as Project/Client Detail's tabs.
- D-063: Billing is a static, truthful summary (plan label, included capabilities, real workspace-usage counts from `getDemoDataset()`, a disabled "Manage billing" action) — no Stripe, checkout, card fields, or fake invoices anywhere.
- D-064: Login's visual composition follows general SaaS sign-in principles gathered via external research (centered minimal card, one strong CTA, no clutter) — not a copied design; documented inline in `src/app/login/page.tsx`.
- A compact account menu (`components/shell/AccountMenu.tsx`) reuses the existing `Popover` primitive (no new dropdown-menu/avatar dependency) — name/email, a Profile & Settings link, and Logout (`signOutOfDemoAction`), rendered in `Topbar.tsx` for every authenticated route.
- Landing Page CTAs (`Hero`, `FinalCTA`, `MarketingNav`, `MarketingFooter`) now route to `/login`, not directly to `/dashboard` — the demo entry flow is no longer bypassable from marketing surfaces.
- Validation: `tsc --noEmit`, `eslint` clean; `npm test` 158/158 (16 new: `lib/protectedRoutes.test.ts`, `domain/settingsMutations.test.ts`); `npm run validate:data` clean; whole-app route smoke check (public `/`,`/login` → 200; all 7 protected routes → 307 to `/login?redirect=...` without a session; both resolve correctly with a session cookie present); Playwright visual verification of Login (desktop/mobile, light/dark, RTL), all 5 Settings tabs, the account menu, and the full Landing→Login→Dashboard→Settings→Logout→Landing flow, zero console errors under properly-sequenced navigation (a hydration warning seen only under artificially rapid, unwaited test navigation was isolated and confirmed to be a test-timing artifact, not reproducible with correct waits — see Phase 14 final report).
- `next build` could not be re-confirmed this phase — same pre-existing `fonts.googleapis.com` network gap as D-060, reconfirmed via `curl` (connection timeout, unrelated to Phase 14 code).

## Phase 14 open items

Resolved — `next build`'s `fonts.googleapis.com` gap was re-checked during Phase 15, not independently resolved (still failing, same cause). No other Phase 14 open items.

## What is approved and locked (Phase 15)

- RTL/localization QA pass across the whole product — correction-only, no new product features (per the phase's explicit scope). `lib/locale.ts`'s single `getLocale()` seam is unchanged and confirmed still sufficient; no new i18n system, locale switcher, or translation layer was added (D-065).
- D-065: Phase 15's (and every prior phase's) RTL verification method is documented plainly — `document.documentElement.setAttribute('dir', 'rtl')` injected via Playwright/devtools after page load, since `getLocale()` has no real runtime toggle. The architecture is RTL-*ready*; V1 content is English-only. This was always true but is now stated explicitly rather than left implicit.
- A full-codebase grep audit (`ml-`/`mr-`/`pl-`/`pr-`/`left-`/`right-`/`border-l`/`border-r`/`translate-x`/`rotate`/`ChevronLeft`/`ChevronRight`/`ArrowLeft`/`ArrowRight`) found the codebase already RTL-sound: every physical-looking match was either a legitimate Radix-primitive internal (Popover/Tooltip auto-positioning, `sheet.tsx`'s already-direction-derived `side` prop per the existing `SidePanel.tsx` D-017/D-032 pattern), an already-RTL-aware exception (`dialog.tsx`'s `rtl:translate-x-1/2` centering flip, `FlowDiagram`'s D-059 arrow mirror), or symmetric/non-directional (`inset-x-0`). Zero new logical-property replacements were needed anywhere outside Settings.
- D-066: 2 real RTL bugs found and fixed, both confined to Phase 14's Settings additions — a bidi-scrambled `{count} label · {count} label` stat line (Workspace and Billing settings; fixed via `dir="ltr"` + bidi isolation, the same pattern already established for email fields) and a hand-rolled `"· "` bullet-prefix in the Billing capability list (the one list in the whole app not using `list-disc`; fixed to match every other list). A full test of the exact same 5-page Settings sequence with proper waits (see Phase 14's own hydration-timing finding) and a dedicated Playwright RTL sweep across Landing/Login/Dashboard/Projects/Tasks-Kanban/Clients/Team/Analytics/AI/Settings/mobile found nothing else.
- Kanban (list + board) was specifically re-verified: 5-column DOM order and horizontal-scroll-with-partial-clip behavior both mirror correctly under RTL (confirmed via direct DOM bounding-rect inspection, not just screenshot reading) — D-038's column model is untouched.
- Analytics charts' D-044 exception (forced `dir="ltr"` chart SVG internals, RTL-correct surrounding labels/titles) was re-verified and reaffirmed, not revisited — still the right call, no change made.
- D-067: no Arabic font decision was made (no new typeface, no silent fallback change) — there is no Arabic copy anywhere in the product to evaluate font rendering against. D-026's open Arabic-typeface decision remains open, explicitly re-affirmed as still deferred to a future real-content phase.
- A dnd-kit + React Strict Mode dev-mode hydration warning (`aria-describedby="DndDescribedBy-N"` mismatch on Kanban drag handles) was found, isolated, and confirmed **unrelated to RTL** — it reproduces identically on a single fresh page load in plain LTR with no `dir` manipulation at all (a pre-existing dnd-kit/dev-mode interaction dating to Phase 9, out of this phase's RTL/localization scope, not fixed).
- Validation: `tsc --noEmit`, `eslint` clean; full test suite 158/158 (unchanged — the 2 bugs fixed were bidi/CSS rendering issues, not meaningfully unit-testable under `node --test`'s non-rendering environment, so no new tests were added, consistent with the brief's "keep tests meaningful" instruction); `npm run validate:data` clean; route smoke tests unchanged (public 200, protected 307→`/login` without a session, 200 with one); `next build` not re-confirmed (same D-060 network gap).

## Phase 15 open items

`next build` needs one more clean run once this environment has network access to `fonts.googleapis.com` again (same gap as D-060, now also observed in Phase 15) — nothing in Phase 15 touches font loading. D-026/D-067's Arabic typeface decision remains open, deferred until real Arabic content is scoped. No other open items; Phase 16 has not been scoped, planned, or approved.

## Session checklist (do this before any new work)

1. Read `PROJECT_CONSTITUTION.md`.
2. Read `PROJECT_PLAN.md`.
3. Read `DECISIONS.md` (especially "Open").
4. Read this file.
5. Confirm requested task fits the current phase and doesn't conflict with a Decided entry.
6. If it conflicts: stop, explain the conflict, wait for direction.
7. If it fits: implement only what's approved for this phase.
8. If a decision or phase genuinely changes as a result of the task, update the relevant file(s) — `DECISIONS.md` for new/changed decisions, `CURRENT_PHASE.md` for phase transitions, `PROJECT_PLAN.md`/`PROJECT_CONSTITUTION.md` only when their content itself changes.
