# FlowPilot AI — Decisions Log

> Append-only log of approved decisions and currently open questions. Future sessions must check this file before implementing anything that touches a decision listed here. If a new request conflicts with a "Decided" entry below, stop and surface the conflict — do not silently override it.

**Last updated:** 2026-10-04

---

## Decided

### D-001 — Planning-only Phase 1, no implementation
**Date:** 2026-10-04
**Decision:** Phase 1 (Task 01) is product definition and V1 scope only. No files, no Next.js init, no dependency installs, no implementation code, no page designs during this phase.
**Status:** Closed — phase complete, persisted to `PROJECT_CONSTITUTION.md` / `PROJECT_PLAN.md`.

### D-002 — AI scope boundary: deterministic demo logic in V1
**Decision:** V1 AI features are rule-based/deterministic over mock data, behind a realistic AI-style UI. Never presented as live model inference. Real AI API implementation is a future backend swap behind the same UI contract.
**Why:** Portfolio product currently has no real data/backend; misrepresenting demo logic as live AI would be dishonest and is explicitly against product principles.
**Scope:** Applies to Daily Brief, overdue/follow-up/workload queries, chat Q&A, report/draft generation — all of Section 7 (V1 AI Scope) in `PROJECT_PLAN.md`.

### D-003 — Persona consolidation
**Decision:** Operations Manager folded into Project Manager persona; Startup Founder folded into Agency Owner persona. Only 3 personas carry V1 design: Agency Owner/Founder, Project Manager/Ops Manager, Freelancer.
**Why:** Needs overlap too much at this scale to justify separate design treatment; avoids persona sprawl.

### D-004 — Demo business type
**Decision:** V1 demo workspace models a small creative/digital agency (web design, brand identity, light marketing campaigns), approx. 8 team members / 15 clients / 12 active projects.
**Why:** Naturally produces varied project types and recurring client relationships without inventing false technical complexity; exercises CRM follow-up and workload features well.
**Open sub-item:** exact business name not yet finalized — see O-001.

### D-005 — RTL/accessibility as architecture
**Decision:** Logical CSS properties (start/end) and keyboard/contrast/motion-preference support are architectural requirements from the first component built, not a later cleanup pass.
**Why:** Retrofitting RTL into a left/right-hardcoded codebase is far more expensive than building it in from the start.

### D-006 — Library installation timing
**Decision:** Approved future stack (Next.js, TypeScript, Tailwind, shadcn/ui, Lucide, React Hook Form, Zod, TanStack Table, Recharts, dnd-kit, Motion, date-fns, Sonner) is not installed until the feature requiring it is actually being implemented.
**Why:** Avoid premature dependency bloat before scope/IA is settled.

### D-007 — Persistent documentation as source of truth
**Decision:** `PROJECT_CONSTITUTION.md`, `PROJECT_PLAN.md`, `DECISIONS.md`, `CURRENT_PHASE.md` are the authoritative project memory across sessions. Every future session reads all four before implementing. Architecture/data model/design direction/RTL/accessibility/responsive/dependency strategy/workflow are never silently replaced — conflicts must be surfaced before changing.
**Why:** User requirement, to keep multi-session Claude Code work consistent with approved product decisions.

### D-008 — Billing (demo) moved from P0 to P1
**Date:** 2026-10-04
**Decision:** Billing (demo)'s static plan/usage display and upgrade CTA move from P0 to P1 in `PROJECT_PLAN.md` §4. Simulated invoice history remains P1. Resolves O-004 (Billing half).
**Why:** Keeps V1 focused enough to finish at portfolio quality; Billing is not core to the "business operations cockpit" value proposition.

### D-009 — Onboarding remains P0; AI rule engine must be swappable
**Date:** 2026-10-04
**Decision:** Onboarding stays P0 (resolves O-004 Onboarding half). V1 AI remains deterministic/rule-based demo logic — no real AI API added yet (reaffirms D-002). New architectural requirement: the rule engine must sit behind a stable interface so a real AI API can later replace its internals without redesigning the UI or changing how calling code consumes results. Resolves O-005.
**Why:** Confirms the AI fidelity bar is acceptable for the portfolio goal now, while protecting future extensibility — this is a non-negotiable architecture constraint for whoever implements the rule engine.

### D-010 — Project Risk formula adopted
**Date:** 2026-10-04
**Decision:** A project is **At Risk** if any of: (a) >25% of open tasks overdue, (b) a High Priority task overdue by >2 days, (c) due date within 3 days and progress <70%, (d) an unresolved blocker open >48 hours. **Critical Risk** = two or more conditions true simultaneously. Resolves O-002. Full text in `PROJECT_PLAN.md` §4a.
**Why:** Needed as a single authoritative definition so Dashboard, Projects, and AI Assistant don't each reimplement "at risk" differently (violates One Source of Truth otherwise).

### D-011 — Team Workload formula adopted
**Date:** 2026-10-04
**Decision:** `Workload % = Assigned Estimated Hours / Weekly Capacity × 100`. Statuses: <70% Available, 70–90% Healthy, 91–110% High, >110% Overloaded. When estimated hours are missing for some tasks, use a documented fallback based on open task count and priority weighting; the hour-based calculation remains primary. Resolves O-003. Full text in `PROJECT_PLAN.md` §4a.
**Why:** Needed as a single authoritative definition so Team, Dashboard, and AI Assistant compute workload consistently; the fallback must be documented wherever implemented so it's never an undocumented guess.

### D-012 — Demo business name confirmed
**Date:** 2026-10-04
**Decision:** "Northbound Studio" is confirmed as the demo business name (not a placeholder). Resolves O-001.
**Why:** User confirmation; no further naming work needed before Phase 2.

### D-013 — Mobile primary navigation: 5-tab bar with "More"
**Date:** 2026-10-04
**Decision:** Mobile bottom tab bar = Dashboard, Projects, Tasks, Clients, More. "More" contains Team, Analytics, Settings as a flat list. AI Assistant and Notifications are not bottom-tab destinations — they remain reachable via dedicated global actions/sheets on every breakpoint. Corrects the earlier Phase 2 draft, which left the 5th mobile slot undecided.
**Why:** A clean 5-tab bar is the right tradeoff at this scale; AI/Notifications are cross-cutting overlays, not primary destinations, so giving them a tab would misrepresent their role (see Constitution principle #4, AI assists rather than replaces).

### D-014 — AI Assistant / Notifications mutual exclusivity confirmed
**Date:** 2026-10-04
**Decision:** Opening AI Assistant closes Notifications and vice versa, on every breakpoint, for all of V1. This was flagged as a risk in the Phase 2 draft and is now explicitly confirmed as accepted behavior, not an oversight.
**Why:** Keeps the UI simple and avoids two overlapping overlay panels; revisit only if real usage feedback after build demands simultaneous access.

### D-015 — Task Detail: single shared implementation (binding anti-duplication rule)
**Date:** 2026-10-04
**Decision:** Task Detail has exactly one component/data/business-logic implementation. It is presented with two different chromes — panel/sheet over a preserved list/kanban view, or full resolved experience on a direct `/tasks/:taskId` deep link — but never as two independently built implementations. No field or business rule may exist in one presentation and not the other.
**Why:** The earlier Phase 2 draft treated this as an open risk/tradeoff to confirm; the user has confirmed context-preservation must be kept, explicitly ruling out building two parallel Task Detail implementations. This is now a binding constraint on Phase 3 (data contract) and Phase 4 (component architecture).

### D-016 — Risk/workload states must expose contributing conditions, not just a label
**Date:** 2026-10-04
**Decision:** Every surface showing a risk or workload status (Dashboard, Project Detail, Team-Member Detail, AI Assistant answers) must also expose which specific condition(s) from the §4a formulas produced that status. A bare `At Risk` or `Overloaded` label with no reasons is non-compliant.
**Why:** Confirms and hardens a requirement that was implied but not firmly locked in the Phase 2 draft; directly shapes the Phase 3 data model, which must represent risk/workload as condition flags, not just a derived final label.

### D-017 — RTL logical-positioning rule corrected
**Date:** 2026-10-04
**Decision:** LTR: `inline-start = left`, `inline-end = right`. RTL: `inline-start = right`, `inline-end = left`. Sidebar docks to the logical **start** side; AI/Notification panels dock to the logical **end** side. No hardcoded left/right architecture anywhere in navigation.
**Why:** Corrects an error in the Phase 2 draft's RTL section, which stated the LTR/RTL mapping backwards. This is the authoritative version and supersedes the earlier draft text (draft was never persisted to `PROJECT_PLAN.md`, so there is no prior file text to mark superseded — this entry is the first persisted RTL-mapping decision, reaffirming `PROJECT_CONSTITUTION.md` §5's logical-properties requirement with the corrected mapping).

### D-018 — Dashboard section numbering corrected
**Date:** 2026-10-04
**Decision:** Dashboard information hierarchy is numbered 1–6 with no gaps or stray annotations. The accidental "8. (sic numbering intentional—see below)" line from the draft is removed; it was never meant to persist.
**Why:** Drafting artifact, not a design decision — corrected before persisting to `PROJECT_PLAN.md` §11.8.

### D-019 — Fallback estimated hours approved
**Date:** 2026-10-04
**Decision:** Fallback hours by priority: low=2h, medium=4h, high=8h. These are fallback estimates only, used solely at workload-computation time, and must never be written into `Task.estimatedHours`.
**Why:** Confirms the Phase 3 proposal default; the "never write to the real field" constraint keeps "real estimate" vs. "fallback used" always reconstructable from whether `estimatedHours` is `undefined` (see `PROJECT_PLAN.md` §13.20).

### D-020 — `TeamMember.role` renamed to `TeamMember.jobTitle`
**Date:** 2026-10-04
**Decision:** `TeamMember.role` is renamed to `TeamMember.jobTitle`. It remains free text (not a closed enum) and must never be used as an application permission role.
**Why:** Keeps job titles flexible for a small agency's varied titles while avoiding the word "role" colliding with authentication/permission concepts — resolved by introducing a separate `workspaceRole` concept on `User` (D-021).

### D-021 — Lightweight `WorkspaceRole` added to `User`
**Date:** 2026-10-04
**Decision:** `User.workspaceRole: "owner" | "manager" | "member"` is added to distinguish authentication/workspace identity from a `TeamMember`'s job title. This is explicitly not complex RBAC — no permission matrices or per-feature permission checks are implemented in V1 against this field.
**Why:** Owner wants a minimal identity/role distinction available in the data shape without committing to full RBAC, which remains an explicit V1 exclusion (Constitution, `PROJECT_PLAN.md` §5).

### D-022 — V1 uses latest Project Risk Snapshot only
**Date:** 2026-10-04
**Decision:** `ProjectRiskSnapshot` remains modeled as a (potentially historical) entity, but V1 functionality must not depend on historical snapshots — no risk-history UI, no historical risk analytics in V1. Only the latest snapshot per project is computed/used/displayed.
**Why:** Confirms the Phase 3 proposal's open item §33.3 in the simpler direction; keeps the model future-compatible without committing V1 build effort to history features nobody asked for.

### D-023 — Blocker model renamed for clarity: `hasActiveBlocker` / `blockerStartedAt`
**Date:** 2026-10-04
**Decision:** The ambiguous `isBlocker`/`blockerOpenedAt` naming from the Phase 3 draft is replaced with `hasActiveBlocker: boolean` and `blockerStartedAt?: string`. Documented intent (binding): `Task.status` is the workflow state (what Kanban/task list render); `hasActiveBlocker` is the unresolved-blocking-condition flag consumed only by Project Risk computation (the 48-hour-stale-blocker condition). The two must never be treated as interchangeable or allowed to become duplicate sources of truth — risk computation reads only `hasActiveBlocker`/`blockerStartedAt`, never infers blocker state from `status`.
**Why:** Owner flagged the original naming as potentially ambiguous (a task could be `status: "blocked"` without that meaning the same thing as the risk-relevant blocker flag, and vice versa). The renamed fields make the two concepts impossible to confuse by name alone. Full detail in `PROJECT_PLAN.md` §13.15.

### D-024 — Phase roadmap corrected; fixture authoring deferred to Phase 6
**Date:** 2026-10-04
**Decision:** The approved roadmap is: Phase 3 — Data Model, Phase 4 — Design System, Phase 5 — Shared Application Shell, Phase 6 — Mock Data Foundation. Phase 3 defines the mock-data architecture and constraints only (`PROJECT_PLAN.md` §13.26, §13.31) — it does not author any actual Northbound Studio fixture content. Phase 4 likewise must not author mock fixtures. Actual fixture data is built in Phase 6.
**Why:** Keeps each phase's scope honest — design-system work (Phase 4) and shell work (Phase 5) shouldn't be blocked on or tempted into writing real demo data before the design system and shell exist to display it correctly; fixture authoring is deliberately sequenced after both.

### D-025 — Visual direction and color tokens approved; WCAG AA has authority over placeholder values
**Date:** 2026-10-04
**Decision:** Approved: cool neutral foundation, one restrained indigo-blue accent, semantic status colors used only for meaning, no generic AI-purple identity, no excessive gradients, no glassmorphism, no oversized rounded UI. The proposed light/dark hex token values are accepted as the starting palette. They are NOT permanently final — once real component pairings exist in Phase 5, each token must be contrast-tested, and WCAG AA validation has authority over the placeholder value if an adjustment is needed.
**Why:** Locks the design direction now so Phase 5 isn't blocked, while explicitly preventing placeholder hex values from being treated as untouchable once real accessibility testing is possible. Full tokens in `PROJECT_PLAN.md` §15.2–15.3.

### D-026 — Typeface: Inter for English UI; Arabic typeface deferred as a separate decision
**Date:** 2026-10-04
**Decision:** Inter is the preferred English UI typeface, not installed until Phase 5 actually requires typography implementation. Inter is explicitly NOT assumed to be the Arabic solution — an Arabic UI typeface that visually harmonizes with Inter will be chosen during the Arabic/RTL implementation phase, so both languages read as one product system.
**Why:** Confirms a concrete English typeface direction while refusing to silently punt on Arabic by default-fonting it — Arabic typography needs its own deliberate choice, not an afterthought. Detail in `PROJECT_PLAN.md` §15.5.

### D-027 — Risk/workload explanation interaction pattern approved
**Date:** 2026-10-04
**Decision:** Desktop/tablet: contributing conditions via an interactive tooltip or popover, keyboard-accessible, must not depend on hover alone. Mobile: tap-to-expand disclosure. For Critical Risk specifically, a short primary reason must be visible directly in the interface at rest, with full conditions available through the detailed interaction — critical context must never be fully hidden behind hover/tap alone.
**Why:** Resolves the Phase 4 proposal's open interaction-pattern question (§49.3 of that proposal) with a concrete, accessible, and criticality-aware answer. Detail in `PROJECT_PLAN.md` §15.9.

### D-028 — Radius scale approved with a binding ceiling
**Date:** 2026-10-04
**Decision:** `radius-sm=6px`, `radius-md=8px`, `radius-lg=12px`. Functional component radius must not exceed 12px without an approved design reason (a new logged decision).
**Why:** Locks in the "crisp, not soft" visual direction and prevents radius creep back toward the generic-SaaS oversized-rounding anti-pattern the Constitution already forbids. Detail in `PROJECT_PLAN.md` §15.7.

### D-029 — Breakpoints approved as baseline, with a documented-reason rule for additions
**Date:** 2026-10-04
**Decision:** mobile <640px, tablet 640–1024px, desktop >1024px, approved as baseline responsive tokens. These are not license to force a broken layout. If a specific component (Kanban, a data table, a docked panel) genuinely needs an additional content-driven breakpoint, the reason must be documented as a new decision before it's added.
**Why:** Keeps the breakpoint set intentional rather than letting it sprawl ad hoc per component during Phase 5+ build. Detail in `PROJECT_PLAN.md` §15.12.

### D-030 — Motion and 3D/depth separation reaffirmed; landing page carved out as a distinct future scope
**Date:** 2026-10-04
**Decision:** Application shell: no scroll-triggered reveal/parallax, only purposeful UI transitions and micro-interactions, no literal 3D/WebGL/glowing orbs/tilting cards/depth-of-field — depth communicated only via the elevation/surface system. Public Landing Page (future, unscoped now): may later use premium scroll-based animation (section reveals, controlled depth/parallax, product-preview motion, AI workflow demos) and is not permanently barred from a lightweight depth/3D treatment, conditioned on supporting the product story, strong performance, responsiveness, respecting reduced-motion/accessibility, not looking like a generic AI visual, and never entering normal business workflows. No landing-page motion is implemented or specified now — it will be specified separately when the public marketing experience is designed.
**Why:** Reaffirms the application-shell/landing-page motion boundary from Phase 1–4 while explicitly not foreclosing a future landing-page opportunity, so neither "we can never do 3D" nor "let's add 3D now" becomes the wrong default. Detail in `PROJECT_PLAN.md` §15.13–15.14.

### D-031 — Mobile/tablet touch-target minimum corrected to ~44×44px
**Date:** 2026-10-04
**Decision:** Primary mobile/tablet interactive controls (icon buttons, navigation targets, close buttons, mobile disclosure controls, frequently used actions) target a minimum practical touch target of approximately 44×44px where feasible. Dense desktop table rows may remain visually compact as long as the actual interactive control stays reasonably operable — visual density and hit-area operability are separate concerns.
**Why:** Corrects/strengthens the Phase 4 proposal's accessibility section with a concrete, standard mobile touch-target size, while explicitly protecting desktop table density (the product's core "information-dense" requirement) from being compromised by a mobile-driven sizing rule. Detail in `PROJECT_PLAN.md` §15.18.

---

### D-032 — SidePanel is non-modal on desktop/tablet, modal on mobile (implementation clarification found during Phase 5 build)
**Date:** 2026-10-04
**Decision:** The shared `SidePanel` (AI Assistant / Notifications) renders without a backdrop overlay and without a focus trap on desktop/tablet (`modal={false}`, no `SheetOverlay`), and with both on mobile (`modal={true}`, overlay shown), switching on the Phase 4 §15.12 mobile breakpoint (<640px). The Topbar is given a higher stacking position (`z-40`) than the docked panel (`z-30` on desktop/tablet only) so its own AI/Notifications trigger buttons remain clickable even though the panel visually docks at the same screen edge.
**Why:** Phase 4 §15.8 explicitly specifies desktop/tablet drawers have "no backdrop scrim... content stays interactive-adjacent," and D-014 requires that clicking one trigger closes the other and opens it — which is impossible if the first panel's modal overlay/focus-trap blocks clicks on the second trigger. This was caught by Playwright smoke-testing during Phase 5 (the panel's own content div, not just the overlay, physically covered the topbar's top-right corner at the same screen position) and fixed by giving the topbar a higher stacking context rather than resizing/repositioning the panel. Mobile keeps the modal+overlay behavior since a full-screen sheet is the only thing on screen there. Implementation in `sheet.tsx` (`showOverlay` prop), `SidePanel.tsx`, and `Topbar.tsx`.

---

### D-033 — Client follow-up stale threshold: APPROVED
**Date:** 2026-10-04
**Decision:** `FOLLOW_UP_STALE_DAYS = 7` is the authoritative V1 threshold for normal (active/retainer) clients, confirmed by the owner. It remains centralized in `domain/clients/followUp.ts` as the single source — no feature code may duplicate the literal `7`; all follow-up-needed logic must call `getClientFollowUpStatus`/`getClientsNeedingFollowUp`. Dormant clients remain excluded regardless of this threshold. Making this value user-configurable is explicitly out of V1 scope.
**Why:** Resolves O-006. Same status as D-010/D-011/D-019 now — a locked V1 formula, not a proposal.

### D-034 — Contrast audit timing: deferred to Phase 7, now with a defined scope
**Date:** 2026-10-04
**Decision:** The WCAG AA contrast audit is confirmed deferred to Phase 7, which is the first phase with representative rendered business content (the Dashboard). During Phase 7, perform real contrast verification using actual Dashboard component pairings (not tokens in isolation) for: primary text, secondary text, accent, warning, danger, success, risk badges, workload badges, and focus rings — in both light and dark themes. Any failing token gets the smallest necessary adjustment, verified in both themes and documented with before/after values and a reason; this is not license to redesign the palette.
**Why:** Resolves O-007 with a concrete checklist so the audit has a defined scope once Phase 7 actually renders something to test.

### D-035 — Phase 7 contrast audit results: 4 token adjustments made
**Date:** 2026-10-04
**Decision:** Performed the D-034 audit against real rendered Dashboard elements (badges, text, links, focus rings), using the browser's own canvas color compositing rather than regex-parsing computed-style strings (an earlier version of the audit script silently mis-parsed Tailwind v4's `oklab()`/`color-mix()` output and produced false readings — the final method renders each color via `<canvas>` and reads back resolved pixels, which cannot misparse). Four tokens adjusted, smallest-change-that-clears-AA in each case:
- `--fp-success` (light): #0f9d58 → #0a6b3c (badge text was 3.13:1 against its own tint bg, now 5.68:1)
- `--fp-warning` (light): #b54708 → #a84007 (was 4.38:1, now 4.99:1)
- `--fp-danger` (light): #d92d20 → #b3251a (was 3.89:1, now 5.29:1)
- `--fp-accent` (dark): #6e7cf2 → #8591f5, with `--fp-accent-hover` nudged to #9da7f7 to stay a visible step lighter (badge text was 4.35:1, now 5.49:1; this also strengthened the already-passing dark-mode link contrast from 5.39:1 to 6.82:1)
- Focus ring opacity: `ring-ring/50` → `ring-ring/70` across all 9 usages (was 2.2-2.3:1 in both themes against canvas, now 3.27:1 light / 3.84:1 dark) — the 50% opacity itself was mathematically the limiting factor regardless of hue, so the fix is the opacity multiplier, not a token hex value
All changes verified in both light and dark themes after the fix. Primary text, secondary text, light-mode accent/info, and dark-mode warning/danger/success/info were already compliant and left unchanged. Full before/after values and reasoning are recorded as comments directly in `src/styles/tokens.css`.
**Why:** Resolves the D-034 checklist. This is not a palette redesign — every adjustment is a minimal shift of one existing token's lightness, chosen by computing the smallest change that clears the relevant WCAG threshold.

---

## Open

As of 2026-10-04: none outstanding. D-033 through D-035 are all resolved above. Phase 8 decisions, if any, will be logged as they arise during that phase's build.

---

## How to use this file

- Before starting any new task, scan "Decided" for anything the task touches.
- If the task conflicts with a Decided entry, stop and explain the conflict to the user rather than resolving it unilaterally.
- When the user resolves an Open item, move it from "Open" to "Decided" with a new D-### entry, and update `PROJECT_PLAN.md` / `PROJECT_CONSTITUTION.md` if the resolution changes their content.
- Never delete a Decided entry — if superseded, add a new entry that explicitly states it supersedes the old one, and leave the old one marked superseded.
