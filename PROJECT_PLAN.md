# FlowPilot AI — Project Plan

> Read `PROJECT_CONSTITUTION.md` first. This file tracks personas, workflows, V1 scope, exclusions, AI scope, demo content, and success criteria as approved in Phase 1. Treat this as the working spec future sessions build against.

**Status:** Phase 1 (Product Definition & V1 Scope) approved, final decisions locked. Phase 2 (Information Architecture) approved, final decisions locked. Phase 3 (Data Model) approved, final decisions locked. Phase 4 (Design System) approved, final decisions locked. Phase 5 (Shared Application Shell) implemented. Phase 6 (Mock Data Foundation) implemented. Phase 7 (Dashboard) implemented. Phase 8 (Projects) implemented. Phase 9 (Tasks / Kanban) implemented.
**Last updated:** 2026-10-04

---

## 1. Primary Personas

### A — Small Agency Owner / Startup Founder (primary)
Runs the business and oversees delivery. Needs: 30-second business-health read, early warning on client dissatisfaction, visibility into who's quietly overloaded.
Frequent actions: scan dashboard, drill into flagged project, check client last-touch, skim team workload.
Needs on open: at-risk projects, overdue count, clients needing follow-up, team overload flags.

### B — Project Manager (primary)
Owns day-to-day execution across multiple projects. Needs: trustworthy task board, per-project status, cross-project load visibility per person.
Frequent actions: open project, triage tasks/kanban, reassign/reschedule, check capacity before assigning.
Needs on open: active projects' health, tasks due/overdue, unassigned/blocked tasks.

### C — Freelancer Managing Multiple Clients (secondary, distinct)
Is founder+PM+delivery for each client simultaneously. Needs: client-centric view, nudges on who's gone quiet.
Frequent actions: jump between clients, check last interaction, draft quick status update.
Needs on open: clients overdue for contact, all-work-due view regardless of project.

*(Operations Manager folded into PM persona; Startup Founder folded into Agency Owner persona — approved, see DECISIONS.md.)*

## 2. Core Jobs To Be Done (priority order)

1. Understand business health instantly
2. Identify urgent/at-risk work
3. Discover who needs attention (overloaded team / quiet clients)
4. Manage and triage tasks
5. Manage projects end-to-end
6. Manage client relationships
7. Monitor team workload/capacity
8. Understand recent activity/change
9. Prepare a client-facing update
10. Follow deadlines across the business

## 3. Core Workflows

- **Daily Operations:** Open app → dashboard surfaces risk/overdue/follow-up/overload → click flagged item → full-context record → inline action.
- **Project:** Projects list → project → overview/progress/risk → tasks → team → activity → AI summary.
- **Task:** Tasks (global, filterable) → open → update status/assignee/due → reflected everywhere instantly.
- **Client:** Clients list (follow-up-surfaced) → client record → linked projects + interaction history → follow-up action.
- **Team:** Team list w/ workload indicator → member detail → assignments → overloaded/available state → reassignment entry point.
- **AI:** Ask question / open Daily Brief → AI reads workspace data (mock in V1) → structured scannable answer → links back to records → optional one-click action.

## 4. V1 Feature Scope (by module)

Legend: P0 = essential · P1 = valuable/secondary · P2 = explicit future

**Dashboard** — P0: at-risk projects, overdue list, follow-up-needed clients, overloaded team, recent-activity strip, Daily Brief entry. P1: customizable widget order. P2: role-based dashboard variants.

**Projects** — P0: list w/ status+progress, detail (overview/tasks/team/activity tabs), create/edit, rule-based risk flag (formula in §4a). P1: templates, Gantt/timeline. P2: cross-project dependencies, resource forecasting.

**Tasks** — P0: global list, filter/search, detail, status update, assignment, due dates. P1: subtasks, comments. P2: recurring tasks, time tracking.

**Kanban** — P0: per-project board, drag-and-drop status, card detail. P1: swimlanes by assignee. P2: custom board config, WIP limits.

**Clients/CRM** — P0: list (follow-up sort/flag), detail (projects/interactions/last-touch), add interaction. P1: client health score. P2: full CRM pipeline, multi-contact hierarchy.

**Analytics** — P0: on-time delivery rate, workload distribution, overdue trend (small, decision-driving set only). P1: per-client/per-project breakdowns. P2: custom report builder, export/scheduling.

**Team** — P0: list w/ workload indicator, member detail, overloaded/available status (formula in §4a). P1: time-off/availability input. P2: skills-based assignment suggestions, utilization forecasting.

**Notifications** — P0: in-app center (overdue, assigned-to-you, mentioned, follow-up due). P1: preferences/filtering. P2: real email/push delivery, digests.

**AI Assistant** — P0: Daily Brief, overdue/at-risk query, workload-read query, chat-style Q&A over mock data. P1: draft client update, weekly report. P2: real model backend, proactive AI-initiated alerts.

**Settings** — P0: profile, workspace basics, notification prefs. P1: theme/density. P2: granular permissions, API/webhooks.

**Authentication (demo)** — P0: login/logout/demo-account flow (mocked). P1: simulated password reset. P2: SSO, MFA, real session hardening.

**Onboarding** — P0: first-run tour / empty-state walkthrough into seeded demo workspace. P1: interactive setup checklist. P2: multi-workspace creation, real team-invite email.

**Billing (demo)** — P1: static plan/usage display, upgrade CTA, simulated invoice history. *(Plan/usage display and upgrade CTA moved from P0 to P1 — see DECISIONS.md D-008.)* P2: real payment processing, proration, metered billing.

## 4a. Risk and Workload Formulas (binding, see DECISIONS.md D-010, D-011)

### Project Risk

A project is **At Risk** if any of the following are true:
- more than 25% of its open tasks are overdue
- a High Priority task is overdue by more than 2 days
- the project due date is within 3 days and progress is below 70%
- an unresolved blocker has been open for more than 48 hours

A project is **Critical Risk** if two or more of the above conditions are true at the same time.

These conditions drive the Dashboard's at-risk list, the Projects module's risk flag, and the AI Assistant's at-risk query — all three must read from one shared computation, not reimplement it separately (see Constitution §7, One Source of Truth).

### Team Workload

```
Workload % = Assigned Estimated Hours / Weekly Capacity × 100
```

Statuses:
- below 70% → Available
- 70–90% → Healthy
- 91–110% → High
- above 110% → Overloaded

**Fallback:** if estimated hours are unavailable for some assigned tasks, workload for those tasks is approximated using a documented fallback based on open task count and priority weighting. The hour-based calculation remains the primary source of truth; the fallback only fills gaps where hour estimates are missing, and the fallback method must be documented wherever implemented (not an undocumented guess).

## 5. Excluded From V1 (and why → V2+)

| Excluded | Reason |
|---|---|
| Real payment processing | No real transactions needed; legal/PCI complexity with no demo value. |
| Complex RBAC | Backend/enterprise concern; V1 is single-tenant-feeling by design. |
| Real email delivery | In-app notifications suffice; infra orthogonal to proving product thinking. |
| 3rd-party CRM/Slack/Calendar integrations | Proves integration engineering, not product design; each is an auth/sync scope trap. |
| File-storage system | Mock attachment metadata shows the UI pattern without storage/scanning/quota infra. |
| Advanced automation builder | A product in itself; V1 "automation" is the AI rule layer, not user-authored workflows. |
| Real-time collaboration | High infra cost (websockets/CRDT) not critical to this persona set at V1. |
| Full audit logging | Enterprise/compliance need; activity feed already covers the felt need. |
| Native mobile app | Responsive web covers the usability story. |
| Complex multi-tenant billing | Single demo workspace; no UI to show without real plans/seats infra. |
| Production-grade AI backend | V1 AI is deterministic demo logic, clearly labeled (see Constitution §8). |

## 6. V1 AI Scope

**P0:** Daily Brief, find overdue tasks, identify clients needing follow-up, analyze workload ("who's overloaded").
**P1:** Summarize a project, generate weekly report, draft client update.

Separation (binding, see Constitution §8):
- Realistic AI UX: chat-style input, structured responses, citations/links back to records, latency-appropriate "thinking" affordance.
- Deterministic/demo logic: fixed rules over seeded mock data — see §4a for the authoritative at-risk and workload formulas (replaces the earlier placeholder examples).
- Future real AI implementation: backend swap behind same UI contract — not a redesign.

**Architecture requirement (confirmed, see DECISIONS.md D-009):** V1 ships with the rule engine only — no real AI API is added at this stage. The rule engine must sit behind a stable interface (e.g., a single "insight provider" contract consumed by Dashboard/AI Assistant/Projects/Team) so that a real AI API can later replace the rule engine's internals without redesigning the UI or changing how calling code consumes results.

## 7. Demo Workspace / Content Strategy

**Business:** Small creative/digital agency — **"Northbound Studio"** (confirmed, see DECISIONS.md D-012). Does web design, brand identity, light marketing campaign work.

**Scale:** ~8 team members (designer/developer/PM/account-lead mix) · ~15 clients (active/retainer/dormant mix) · ~12 active projects (varied stages) · dozens of tasks per active project with realistic due-date/status spread.

**Guardrails:** No fake awards, press mentions, certifications, real-company-resembling names, or real financial claims.

## 8. Success Criteria

User answers within seconds: what's overdue, which project is at risk (and why), which client needs attention, which team member is overloaded.

- **Navigation:** any record reachable in ≤3 clicks from dashboard; no dead ends; back-context preserved.
- **Data consistency:** a status change reflects immediately everywhere it's shown.
- **Responsive:** fully usable at tablet width; graceful degradation at mobile.
- **Accessibility:** keyboard-navigable core flows, visible focus states, contrast sufficient, status never color-only.
- **RTL:** logical properties from day one of component structure.
- **Visual quality:** reads as credible, fundable B2B SaaS in a portfolio review — execution-quality benchmark against Linear/Attio/Clay/Asana, never a copy of their layouts.

## 9. Phase 1 Open Items — Resolved

All Phase 1 open items (O-001 through O-005) were resolved on 2026-10-04. See `DECISIONS.md` D-008 through D-012 for the final decisions. None remain outstanding; Phase 1 is fully closed.

## 11. Phase 2 — Information Architecture (APPROVED / COMPLETE)

See `DECISIONS.md` D-013–D-018 for the corrections applied on approval.

### 11.1 Complete Information Architecture (top level)

```
Dashboard
Projects
  └─ Project Detail
Tasks
  └─ Task Detail (single shared panel/sheet implementation — see §11.10)
Clients
  └─ Client Detail
Team
  └─ Team-Member Detail
Analytics
AI Assistant (global sheet/panel, not a permanent nav destination)
Notifications (global sheet/panel, not a permanent nav destination)
Settings
  ├─ Profile
  ├─ Workspace
  ├─ Notifications
  └─ Billing (P1)
Onboarding (first-run only, not in persistent nav)
Auth (login/logout — outside the app shell)
```

Tasks are a first-class global module *and* a scoped view inside Project/Kanban — same data, same component, filtered differently (One Source of Truth).

### 11.2 Primary Navigation Structure (Desktop/Tablet Sidebar)

1. Dashboard (default landing after login)
2. Projects
3. Tasks
4. Clients
5. Team
6. Analytics
7. — divider —
8. AI Assistant (opens a panel, doesn't navigate away)
9. Notifications (opens a panel, badge count visible in sidebar)
10. Settings (bottom-anchored)

Kanban is a view toggle inside Projects/Tasks, not a separate nav item.

### 11.3 Sidebar Structure

- Top: workspace indicator (single workspace in V1, no real switching logic).
- Middle: primary nav items, active state via a persistent accent bar on the logical **start** edge of the item (not left — see §11.8 RTL rule).
- Bottom: user avatar/profile menu → Settings, Logout.
- Collapse behavior: icon-only collapsed state on desktop, user-toggleable, persisted per-viewer only (not shared state).

### 11.4 Secondary Navigation Patterns

- Tabs inside detail views (Project Detail: Overview / Tasks / Team / Activity).
- Filter bar (not sub-nav) inside Tasks/Clients/Team lists — filters are query params, never route segments.
- Segmented control for Kanban⇄List toggle.
- No mega-menus, no flyout sub-nav trees.

### 11.5 Full Route Map

```
/login
/onboarding                          (first run only, redirects once complete)

/dashboard                           (default post-login)

/projects
/projects/:projectId
/projects/:projectId/tasks           (tab)
/projects/:projectId/team            (tab)
/projects/:projectId/activity        (tab)
/projects/:projectId/kanban          (view toggle on the tasks tab, not a separate tab)

/tasks                               (global list, ?project=&assignee=&status=&priority=&due=)
/tasks/:taskId                       (resolves to the complete Task Detail experience — see §11.10)

/clients
/clients/:clientId
/clients/:clientId/projects          (tab)
/clients/:clientId/interactions      (tab)

/team
/team/:memberId

/analytics

/settings
/settings/profile
/settings/workspace
/settings/notifications
/settings/billing                    (P1)
```

AI Assistant and Notifications are not routes — addressable via query param (`?ai=open`, `?notifications=open`) so they stay deep-linkable without owning a page identity.

### 11.6 Page Hierarchy

```
App Shell (sidebar + topbar)
 └─ Dashboard                                   [depth 0]
 └─ Projects (list)                              [depth 0]
     └─ Project Detail                           [depth 1]
         └─ tab: Overview / Tasks / Team / Activity   [depth 2]
 └─ Tasks (list)                                 [depth 0]
     └─ Task Detail (shared panel/sheet or full view) [depth 1, non-destructive — list state preserved beneath]
 └─ Clients (list)                                [depth 0]
     └─ Client Detail                             [depth 1]
         └─ tab: Projects / Interactions           [depth 2]
 └─ Team (list)                                   [depth 0]
     └─ Member Detail                              [depth 1]
 └─ Analytics                                     [depth 0]
 └─ Settings                                      [depth 0]
     └─ sub-sections                              [depth 1]
```

Max depth for any record: 2 (list → detail → tab), consistent with the ≤3-clicks-from-dashboard success criterion.

### 11.7 Detail-View Information Architecture

**Project Detail** — Header: name, client link, status pill, risk badge **with visible contributing conditions** (not a bare "At Risk" label — see §11.9), progress %, due date, primary actions. Tabs: Overview (risk condition breakdown, progress, key dates, activity summary), Tasks (scoped list/kanban, shared Tasks component), Team (project-scoped contribution per member), Activity (chronological log). AI entry point: "Summarize this project" (P1), opens AI panel pre-scoped to this project.

**Client Detail** — Header: name, primary contact, relationship status, last-touch date, follow-up-needed badge. Tabs: Projects (linked, with status/risk at a glance), Interactions (chronological log + "Add interaction"). AI entry point: "Draft update for this client" (P1). No multi-contact sub-entity in V1 (P2 exclusion).

**Team-Member Detail** — Header: name, role, workload badge **with visible contributing factors** (not a bare "Overloaded" label — see §11.9), avatar. Single-scroll body (no tabs): workload breakdown (assigned hours vs. weekly capacity, fallback-used indicator when applicable), current assignments grouped by project, availability indicator with contributing factors visible.

**Task Detail** — see §11.10 (shared architecture requirement).

### 11.8 Dashboard Information Hierarchy

Ordered 1–6 by attention-priority (Signal Before Data):

1. Daily Brief strip — rule-based top 3–5 items needing attention, each linking to its record.
2. At-Risk Projects — project name plus **which risk condition(s) triggered it**; Critical Risk visually distinct from At Risk.
3. Overdue Tasks — count + short list, link to filtered Tasks view.
4. Clients Needing Follow-Up — sorted by days-since-last-touch.
5. Team Workload Snapshot — Overloaded/High members surfaced first, not an alphabetical roster.
6. Recent Activity strip — lowest priority position, informational rather than actionable-urgent.

No decorative chart occupies the dashboard — decision-driving charts live in Analytics only.

### 11.9 Risk / Workload Explanation Requirement (binding, corrects earlier draft — see DECISIONS.md D-016)

The UI must never show only a bare status label (`At Risk`, `Overloaded`, etc.) without exposing the reason(s). Every surface that shows a risk or workload status — Dashboard, Project Detail, Team-Member Detail, AI Assistant answers — must also expose which specific condition(s) from the §4a formulas produced that status (e.g., "At Risk — due in 2 days, progress 58%" or "Overloaded — 118% of capacity, 3 tasks missing estimates used fallback weighting"). This is a data/UI contract requirement, not a visual-design detail, and carries into the Phase 3 data model (risk/workload must be representable as a set of condition flags, not just a final label).

### 11.10 Task Detail — Shared Architecture Requirement (binding, corrects earlier draft — see DECISIONS.md D-015)

There is exactly **one** Task Detail implementation (one component, one data contract, one set of business logic for fields/validation/status transitions). It is presented in two contexts that differ only in *chrome*, never in *capability*:

- **From Tasks/Kanban/list context:** opens as a panel/sheet over the current view; the underlying list/board scroll position and filter state are preserved underneath and restored on close.
- **From a direct deep link (`/tasks/:taskId`):** resolves to the complete, fully usable Task Detail experience (the same component, rendered as the page's primary content when there is no underlying list to preserve).

No feature, field, or business rule may exist in one presentation and not the other. Implementation must share the component and data layer between both entry paths — this is an explicit anti-duplication requirement for Phase 3/4, not just a Phase 2 preference.

### 11.11 AI Assistant Placement and Entry Points

- Global entry point: persistent icon (sidebar on desktop/tablet; a dedicated global action on mobile, not a bottom-tab slot — see §11.13) opening a docked panel (desktop/tablet) or full-screen sheet (mobile).
- Contextual entry points: "Summarize this project" (Project Detail), "Draft update" (Client Detail), "Why is this overloaded?" (Team-Member Detail) — each opens the same panel/sheet, pre-scoped to that record.
- Daily Brief is both a Dashboard-embedded strip and the AI panel's default opening state when invoked with no specific context.
- The panel/sheet never fully replaces the underlying page on desktop/tablet (docked, not covering); on mobile it is a full-screen sheet with a clear return path.
- **Mutual exclusivity with Notifications is confirmed (binding):** opening AI Assistant closes Notifications and vice versa, on every breakpoint. This is an accepted V1 simplification, not an oversight — flagged for revisit post-build if user feedback calls for simultaneous access.

### 11.12 Notification Architecture

- Entry point: bell icon (sidebar on desktop/tablet; dedicated global action on mobile) with unread-count badge, opens a panel/sheet. Mutually exclusive with AI Assistant (§11.11).
- Categories (V1): overdue (assigned to you), newly assigned, mentioned/commented (depends on comments shipping), client follow-up due.
- Each notification links directly to its record — never a context-less "view all."
- No dedicated full-page notification history in V1 — panel's scrollable list suffices at demo scale; flagged as a likely early P2 if volume grows (see §11.14 risks).

### 11.13 Mobile Navigation Strategy (corrected — see DECISIONS.md D-013)

Bottom tab bar, exactly 5 destinations:

1. Dashboard
2. Projects
3. Tasks
4. Clients
5. **More**

**Inside "More":** Team, Analytics, Settings (presented as a simple list, not nested further).

AI Assistant and Notifications are **not** bottom-tab destinations. They remain reachable via dedicated global actions (e.g., icons in the mobile topbar) that open full-screen sheets, consistent with §11.11/§11.12's mutual-exclusivity rule on every breakpoint.

Task Detail becomes a full-screen sheet on mobile (same shared component as §11.10, mobile chrome only).

### 11.14 Tablet Navigation Strategy

- Sidebar remains, defaults to collapsed/icon-only to preserve content width; user can expand.
- AI/Notification panels remain docked but narrower, or overlay partially depending on viewport width at build time.
- Task Detail remains a panel overlay (not full-screen) — tablet width supports it.

### 11.15 Desktop Navigation Strategy

- Full sidebar (expanded by default); docked AI/Notification panels push content rather than overlay it.
- Desktop is the primary design target; tablet/mobile are graceful degradations of it, not separately designed from scratch.

### 11.16 RTL Navigation Implications (corrected — see DECISIONS.md D-017)

**Logical positioning rule (binding):**
- LTR: `inline-start = left`, `inline-end = right`.
- RTL: `inline-start = right`, `inline-end = left`.
- All layout must use logical CSS properties (`inset-inline-start`, `inset-inline-end`, `margin-inline-start`, etc.) — never hardcoded `left`/`right`.

**Applied to this IA:**
- Sidebar docks to the logical **start** side (left in LTR, right in RTL) — not hardcoded to "left."
- AI Assistant and Notification panels dock to the logical **end** side (right in LTR, left in RTL) — not hardcoded to "right."
- Breadcrumb/back-chevron icons must be logical-direction-aware (the "back" chevron points toward inline-start, flipping automatically with `dir`), via the icon library's RTL-aware variants or a `dir`-driven CSS transform — decided at component-build time, not now.
- This section constrains Phase 3/4 implementation; it is not itself a build item in Phase 2.

### 11.17 Breadcrumb / Back-Navigation Strategy

- List → Detail → Tab depth (max 2) keeps breadcrumbs short: `Projects / [Project Name] / Tasks`. Always shown in Project/Client detail headers.
- Task Detail (panel/sheet context) has no breadcrumb — a close action returns to the exact scroll/filter state of the list beneath it (state preservation, not re-fetch/reset). In deep-link context it behaves as a normal page with normal back navigation.
- Browser back button behaves identically to the in-app close/back action on every path — no state loss (Success Criteria §8).

### 11.18 Deep-Link Strategy

- Every record (`/projects/:id`, `/clients/:id`, `/team/:id`, `/tasks/:id`) is independently linkable and resolves directly to the correct record/tab/panel state, including from a Daily Brief item or notification.
- AI Assistant and Notifications are deep-linkable via query param (`?ai=open&context=project:123`), not routes.
- List-view filters (Tasks, Clients) are reflected in query params so a filtered view is itself shareable.

### 11.19 Empty / Error / Loading-State Locations

- Empty states: distinct per list (Projects/Tasks/Clients/Team); since the demo workspace is pre-seeded, true empties mostly appear only after filtering and should read as a *good* result, not a dead end.
- Loading states: skeleton placeholders matching each view's actual layout — never a generic spinner-only treatment.
- Error states: inline, scoped to the failing component, with retry; full-page error reserved for a totally unreachable workspace (e.g., auth failure).
- All three states follow the existing no-decorative-animation and reduced-motion constraints from the Constitution.

### 11.20 Phase 2 Risks Carried Forward (not resolved, tracked for Phase 3/4 attention)

1. AI panel + Notification panel mutual exclusivity may feel limiting if a user wants both open at once — accepted V1 simplification, revisit post-build with real feedback.
2. Task Detail's shared-architecture requirement (§11.10) adds real implementation discipline (one component, two chromes) — flagged so Phase 4 build doesn't quietly drift into two parallel implementations.
3. Risk/workload condition-exposure requirement (§11.9) is a stronger UI/data commitment than a simple badge — confirmed as intended scope, carries directly into Phase 3's risk/workload data model (condition flags must be representable, not just a derived label).
4. RTL panel-direction behavior (§11.16) is a rule, not yet a tested implementation — needs a real RTL pass once components exist in Phase 4.
5. No dedicated notification history page (§11.12) may become a gap if notification volume grows past demo scale — acceptable now, likely early P2.
6. Mobile "More" grouping (Team, Analytics, Settings) deprioritizes Team for the PM persona and Analytics for the Agency Owner persona relative to their stated frequent actions — accepted tradeoff for a clean 5-tab bar; no per-role mobile nav variants are in V1 scope (Constitution/Plan P2: role-based dashboard variants).

## 13. Phase 3 — Data Model (APPROVED / COMPLETE)

See `DECISIONS.md` D-019–D-024 for the corrections applied on approval.

### 13.1 Complete Entity List

`Workspace`, `User`, `TeamMember`, `Client`, `ClientInteraction`, `Project`, `ProjectRiskSnapshot`, `Task`, `Activity`, `Notification`, `AIInsight`, `AIConversation`, `AIMessage`.

No separate `Contact` entity (D-004/Constitution exclusion). No separate `Comment` entity in V1 P0 (comments are P1, a thin extension of `Activity` if ever added).

### 13.2 Entity Responsibilities

- **Workspace** — single-tenant container; everything belongs to exactly one workspace.
- **User** — an authenticated login identity (demo auth) with a workspace-level role (§13.19).
- **TeamMember** — a person doing work, with a job title and a workload profile. Distinct from `User` (§13.7).
- **Client** — an external company/relationship FlowPilot tracks work for.
- **ClientInteraction** — a logged touchpoint with a client.
- **Project** — a unit of delivery work for one client.
- **ProjectRiskSnapshot** — the computed, explainable risk state of a project (latest only is used in V1 — §13.16).
- **Task** — a unit of work, belongs to a project, assignable to a team member.
- **Activity** — an immutable log entry recording a change, scoped to a project or task.
- **Notification** — a user-facing alert referencing a source record.
- **AIInsight** — a single rule-engine-produced answer/finding.
- **AIConversation** / **AIMessage** — the AI panel's chat-shaped interaction history.

### 13.3 TypeScript-Oriented Field Definitions (final)

```ts
type ID = string;

interface Workspace {
  id: ID;
  name: string;              // "Northbound Studio"
  createdAt: string;
}

type WorkspaceRole = "owner" | "manager" | "member";

interface User {
  id: ID;
  workspaceId: ID;
  email: string;
  displayName: string;
  avatarUrl?: string;
  workspaceRole: WorkspaceRole;   // authentication/workspace identity — NOT a permissions matrix (see D-021)
  teamMemberId?: ID;              // link to TeamMember, if this login represents staff
  createdAt: string;
}

interface TeamMember {
  id: ID;
  workspaceId: ID;
  name: string;
  jobTitle: string;              // renamed from `role` (D-020) — free text, flexible job title, NEVER used as a permission role
  avatarUrl?: string;
  weeklyCapacityHours: number;
  active: boolean;
}

type ClientStatus = "active" | "retainer" | "dormant";

interface Client {
  id: ID;
  workspaceId: ID;
  name: string;
  status: ClientStatus;
  primaryContactName: string;
  primaryContactEmail?: string;
  lastInteractionAt?: string;    // derived cache, recomputed on ClientInteraction write
  createdAt: string;
}

type InteractionType = "call" | "email" | "meeting" | "update_sent" | "note";

interface ClientInteraction {
  id: ID;
  workspaceId: ID;
  clientId: ID;
  type: InteractionType;
  summary: string;
  occurredAt: string;
  createdByUserId: ID;
}

type ProjectStatus = "kickoff" | "in_progress" | "review" | "completed" | "on_hold";

interface Project {
  id: ID;
  workspaceId: ID;
  clientId: ID;
  name: string;
  status: ProjectStatus;
  progressPct: number;           // 0–100, stored, manually set
  dueDate?: string;
  startDate: string;
  createdAt: string;
}

type RiskCondition =
  | "overdue_task_ratio_exceeded"
  | "high_priority_overdue"
  | "due_soon_low_progress"
  | "unresolved_blocker_stale";

type RiskLevel = "none" | "at_risk" | "critical_risk";

interface ProjectRiskSnapshot {
  id: ID;
  projectId: ID;
  level: RiskLevel;              // derived from conditions.length — never independently settable
  conditions: RiskCondition[];
  computedAt: string;
  // V1 reads/keeps only the latest snapshot per project (D-022).
  // Model remains history-capable for a future backend; no history UI/analytics in V1.
}

type TaskStatus = "todo" | "in_progress" | "blocked" | "review" | "done";
type TaskPriority = "low" | "medium" | "high";

interface Task {
  id: ID;
  workspaceId: ID;
  projectId: ID;
  title: string;
  description?: string;
  status: TaskStatus;                 // workflow state — see §13.15 for separation from blocker tracking
  priority: TaskPriority;
  assigneeId?: ID;
  dueDate?: string;
  estimatedHours?: number;            // optional; fallback (D-019) applies only at computation time, never written here
  hasActiveBlocker: boolean;          // renamed per owner clarification (D-023) — unresolved blocking condition used by risk computation
  blockerStartedAt?: string;          // set when hasActiveBlocker becomes true, cleared when resolved
  createdAt: string;
  completedAt?: string;
}

type ActivityType =
  | "status_changed" | "reassigned" | "due_date_changed"
  | "created" | "completed" | "blocker_opened" | "blocker_resolved";

interface Activity {
  id: ID;
  workspaceId: ID;
  projectId: ID;
  taskId?: ID;
  type: ActivityType;
  actorUserId?: ID;
  summary: string;                    // generated and frozen at write time
  occurredAt: string;
}

type NotificationCategory = "overdue" | "assigned" | "mentioned" | "follow_up_due";

interface Notification {
  id: ID;
  workspaceId: ID;
  recipientUserId: ID;
  category: NotificationCategory;
  referenceType: "task" | "project" | "client";
  referenceId: ID;
  message: string;
  read: boolean;
  createdAt: string;
}

type InsightType =
  | "daily_brief" | "overdue_tasks" | "follow_up_needed"
  | "workload_analysis" | "project_summary" | "weekly_report" | "client_update_draft";

interface AIInsight {
  id: ID;
  workspaceId: ID;
  type: InsightType;
  scope?: { kind: "project" | "client" | "team_member"; id: ID };
  summary: string;
  references: { type: "task" | "project" | "client" | "team_member"; id: ID }[];
  generatedAt: string;
  riskConditions?: RiskCondition[];   // mandatory population when reporting risk — never free-text-only (D-016)
}

interface AIConversation {
  id: ID;
  workspaceId: ID;
  userId: ID;
  startedAt: string;
}

interface AIMessage {
  id: ID;
  conversationId: ID;
  role: "user" | "assistant";
  content: string;
  insightId?: ID;
  createdAt: string;
}
```

### 13.4 Entity Relationships

```
Workspace 1─* User
Workspace 1─* TeamMember
Workspace 1─* Client
Workspace 1─* Project
User 0..1─1 TeamMember
Client 1─* Project
Client 1─* ClientInteraction
Project 1─* Task
Project 1─* Activity
Project 1─1 ProjectRiskSnapshot   (latest only, in V1 — see §13.16)
Task 0..1─* Activity
TeamMember 0..1─* Task            (assignee)
User 1─* Notification             (recipient)
Notification *─1 (Task|Project|Client)
AIConversation 1─* AIMessage
AIMessage 0..1─1 AIInsight
AIInsight 0..1─1 (Project|Client|TeamMember)
```

### 13.5 IDs and Reference Strategy

Opaque string IDs; V1 mock data uses human-readable slug-style IDs (e.g., `proj_nb_website_relaunch`) for developer legibility, not production UUIDs — documented so it's never mistaken for a production pattern. Polymorphic references are explicit discriminated pairs (`referenceType`+`referenceId`, `scope`), never a bare untyped field. No FK enforcement in V1 — integrity enforced by the mock-data generator and TypeScript at construction boundaries.

### 13.6 Workspace Ownership Model

Single workspace in V1. Every entity carries `workspaceId` directly (intentionally redundant now) so a future multi-workspace migration needs no backfill.

### 13.7 User / TeamMember Relationship

Deliberately separate: `User` = authentication/workspace identity (with `workspaceRole`, §13.19); `TeamMember` = staff profile with a job title and workload. A `User` may link to a `TeamMember` via `teamMemberId`; most of the ~8 demo team members have no corresponding login — only demo account(s) need one.

### 13.8 Client Model

See §13.3. `lastInteractionAt` is a derived cache, always recomputed from `ClientInteraction`, never hand-edited.

### 13.9 Project Model

See §13.3. `progressPct` is stored (a PM judgment call), and is the same field the risk formula's "progress below 70%" condition reads — exactly one progress number per project.

### 13.10 Task Model

See §13.3 and §13.15 (blocker model).

### 13.11 Activity Model

Append-only, immutable. `summary` is generated and frozen at write time, not re-rendered from field diffs later.

### 13.12 Notification Model

Generated by the same rule engine that powers Dashboard/AI — not an independent detection path (One Source of Truth).

### 13.13 AIInsight Model

Makes D-016 enforceable in data: any `AIInsight` reporting risk must populate `riskConditions` from the same `RiskCondition[]` vocabulary as `ProjectRiskSnapshot` — the AI layer cites structured conditions, never invents its own free-text risk explanation.

### 13.14 AIConversation / Client Interaction Models

One conversation per AI panel session in V1 (no multi-conversation switching UI). `ClientInteraction.type` is a closed enum, not free text.

### 13.15 Blocker Model (corrected per owner clarification — see DECISIONS.md D-023)

**Final model:**
```ts
hasActiveBlocker: boolean;
blockerStartedAt?: string;
```

**Documented intent (binding):**
- `Task.status` represents the task's **workflow state** (`todo`/`in_progress`/`blocked`/`review`/`done`) — it is what the Kanban board and task list render as the task's current stage.
- `Task.hasActiveBlocker` represents an **unresolved blocking condition** consumed only by Project Risk computation (the "unresolved blocker open >48h" condition in §4a). `blockerStartedAt` is the timestamp that condition's 48-hour threshold is measured against.
- These two concepts are **never interchangeable and never a duplicate source of truth**: a task can be `status: "in_progress"` while `hasActiveBlocker: true` (e.g., work continues around a blocking dependency), and a task with `status: "blocked"` does not automatically imply `hasActiveBlocker: true` unless that flag is explicitly set. Risk computation reads only `hasActiveBlocker`/`blockerStartedAt`; it never infers blocker state from `status`, and no UI should either.
- This replaces the earlier, more ambiguous `isBlocker` naming from the Phase 3 draft.

### 13.16 Project Risk Model (V1 scope corrected — see DECISIONS.md D-022)

`ProjectRiskSnapshot` remains its own entity (not inline `Project` fields) so the model stays future-compatible with history. **However, V1 functionality must not depend on historical snapshots:** only the latest snapshot per project is computed, stored/used, and displayed. No risk-history UI, no historical risk analytics, no trend charts in V1. A future backend may begin persisting a true time series without a schema change — that is a Phase 6+/V2 decision, not a V1 build target.

### 13.17 Risk-Condition Representation

`RiskCondition` is a closed string-literal union. `level` is derived from `conditions.length` (0→`none`, 1→`at_risk`, ≥2→`critical_risk`), never independently settable — structurally prevents `level`/`conditions` disagreement. The D-016 "reasons" UI reads directly from `conditions` via a presentation-layer lookup table (not duplicated into the data model).

### 13.18 Team Capacity / Workload Model

Fully computed, never stored (must always reflect live assigned tasks):

```
workloadPct = sum(assignedTask.estimatedHours ?? fallbackHours(task)) / teamMember.weeklyCapacityHours × 100
```

Status bands (Available <70, Healthy 70–90, High 91–110, Overloaded >110) are a pure derived mapping, never independently editable. "Contributing factors" required by D-016 (which tasks used the fallback, raw hours/capacity numbers) are assembled at read time from `Task[]` + `TeamMember.weeklyCapacityHours` — no separate factors entity.

### 13.19 Workspace Role Model (new, owner-added — see DECISIONS.md D-021)

```ts
type WorkspaceRole = "owner" | "manager" | "member";
```

`User.workspaceRole` exists solely to distinguish authentication/workspace identity from a `TeamMember`'s job title — it answers "what can this login do at the workspace level" (a thin, V1-appropriate notion), not "what is this person's job." **Explicitly not a permissions matrix:** V1 does not implement complex RBAC or per-feature permission checks keyed off this field (Constitution exclusion, reaffirmed). It exists now only so the `User` shape doesn't need a breaking change later if V1 ever needs even a minimal "who can edit workspace settings" gate.

### 13.20 Estimated-Hours Strategy (approved — see DECISIONS.md D-019)

`Task.estimatedHours` is optional. **Approved fallback-hours constants**, applied only at workload-computation time, never written into `Task.estimatedHours`:

```
low → 2h, medium → 4h, high → 8h
```

The distinction between "real estimate" and "fallback used" must always be reconstructable by checking whether `estimatedHours` is `undefined` — never by inspecting a mutated/merged value.

### 13.21 Task Priority / Status Model

`TaskPriority`: `"low" | "medium" | "high"` — matches the risk formula's "High Priority" condition and the fallback-hours lookup. `TaskStatus`: `"todo" | "in_progress" | "blocked" | "review" | "done"` — deliberately decoupled from blocker tracking (§13.15).

### 13.22 Project Status / Client Status Models

`ProjectStatus`: `"kickoff" | "in_progress" | "review" | "completed" | "on_hold"` — completed/on-hold projects are excluded from risk computation (exclusion lives in computation logic, not an extra flag). `ClientStatus`: `"active" | "retainer" | "dormant"` — dormant clients excluded from follow-up surfacing the same way.

### 13.23 Derived/Computed Values — Summary Table

| Value | Stored or computed |
|---|---|
| `Client.lastInteractionAt` | Stored cache, recomputed on every `ClientInteraction` write |
| `Project.progressPct` | Stored, manually set, read by risk engine |
| `ProjectRiskSnapshot.level` | Computed from `conditions.length` |
| `ProjectRiskSnapshot.conditions` | Computed from live `Task`/`Project` state (latest only, §13.16) |
| Team workload % and status band | Always computed at read time, never stored |
| `Notification.read` | Stored, user-toggled |
| `AIInsight.riskConditions` | Copied from live risk computation at generation time (frozen citation) |

### 13.24 Stored vs. Computed — Governing Rule

A value is stored only if (a) it's a genuine user input/judgment call, or (b) it's a derived cache needed for list-sort/filter performance that is always recomputed on write, never hand-edited. Everything else (risk level, workload %, status bands) is computed at read time. One source of truth per fact (Constitution §7).

### 13.25 Single-Source-of-Truth Rules

1. Risk level/conditions computed by one function, called identically by Dashboard, Project Detail, `AIInsight` generation.
2. Workload % computed by one function, called identically by Team, Dashboard, `AIInsight` generation.
3. `Client.lastInteractionAt` never written directly by UI code — only as a side effect of writing a `ClientInteraction`.
4. `Notification` generation and Dashboard surfacing read the same underlying computation.
5. `Task.estimatedHours` vs. fallback hours never merged into one ambiguous stored number.
6. `Task.status` and `Task.hasActiveBlocker` never treated as interchangeable (§13.15) — risk computation reads only the latter.

### 13.26 Mock-Data Architecture (constraints and rules only — fixtures NOT authored in Phase 3 or Phase 4)

- Mock data will live as **typed TypeScript fixture modules**, type-checked against §13.3's interfaces at build/compile time.
- A single root workspace fixture (Northbound Studio) seeds everything else by `workspaceId`.
- Computed values (risk snapshots, workload) will **not** be hand-authored — they are produced by running the real computation functions over hand-authored `Task`/`Project`/`TeamMember` fixtures, so demo badges are never hand-faked and the rule engine gets a built-in correctness check.
- This is the seam the swappable-rule-engine requirement (D-009) depends on: computation functions take entity data and return `RiskCondition[]`/workload numbers regardless of whether the data came from static fixtures or a real API.
- **Phase correction (binding — see DECISIONS.md D-024):** this section defines the mock-data *architecture and constraints* only. Actual Northbound Studio fixture content is **not** authored in Phase 3 or Phase 4 — it is deferred to **Phase 6 — Mock Data Foundation**, per the corrected roadmap (§14).

### 13.27 Future Database Migration Considerations

Every entity carries `workspaceId` and string `id`s already — no later "add tenant column" migration needed. `ProjectRiskSnapshot` as a separate entity means a real backend can start persisting full history without a schema change, even though V1 doesn't populate more than the latest row. Mock slug-IDs are not meant to survive migration as production IDs. `AIInsight`/`AIConversation`/`AIMessage` are shaped generically enough that swapping the rule engine for a real LLM (D-009) only changes how fields get populated, not the entities themselves.

### 13.28 Validation Rules

ISO 8601 for all dates; no future-date requirement on due dates. `progressPct`: integer 0–100. `weeklyCapacityHours`: positive number, reasonable demo range, not defensively over-validated (mock data under author control). `primaryContactEmail`: basic shape check only if present. Real input validation (React Hook Form + Zod) deferred to whichever Phase 4+/5+ feature first needs a real create/edit form.

### 13.29 Date/Time Strategy

ISO 8601 UTC storage. Display formatting via `date-fns` at component-build time (not decided now). "Today" for risk/overdue computation evaluated at read time in a single implicit workspace timezone — no per-user timezone modeling in V1.

### 13.30 Localization-Sensitive Data Considerations

No translated content stored on entities in V1 (English-only content, RTL-ready layout per Constitution §5 — translation itself is out of scope unless added later). Numbers/dates are locale-neutral in the data layer; locale-specific formatting happens only at render time.

### 13.31 Demo-Data Consistency Rules (deliberate coverage — approved, see DECISIONS.md D-024)

The future Phase 6 fixture set (not built now) must deterministically include:
- at least one project with no risk, at least one At Risk project, at least one Critical Risk project;
- at least one team member in each workload band: Available, Healthy, High, Overloaded;
- clients both requiring and not requiring follow-up;
- dormant clients;
- completed/on-hold projects (to prove exclusion logic actually excludes something).

This is deliberate, deterministic, author-curated demo data — explicitly not random generation. Referential integrity (`Task.projectId`→`Project`, `Project.clientId`→`Client`) is enforced by TypeScript at fixture-authoring time.

### 13.32 Main Data-Model Risks

1. `TeamMember.jobTitle` as free text (not a closed union) risks inconsistent values across fixtures with nothing enforcing a closed set — acceptable since job title is explicitly meant to stay flexible and is never used for permissions (D-020).
2. Fallback-hours constants (2h/4h/8h) are now approved but remain a single small constant with high blast radius — a future change to these numbers shifts every workload number across Team/Dashboard/AI simultaneously.
3. Single implicit workspace timezone is a V1 simplification that would need revisiting the moment this stops being a single-workspace demo.
4. `ProjectRiskSnapshot` history is modeled but, per D-022, deliberately not populated/used in V1 — a future session must not assume historical risk trending works today.
5. `Notification` polymorphic reference has no compile-time guarantee `referenceId` matches `referenceType` — correctness depends on disciplined generation code; a lightweight runtime assertion is a reasonable Phase 5+ addition, not required now.

## 15. Phase 4 — Design System (APPROVED / COMPLETE)

See `DECISIONS.md` D-025–D-030 for the corrections applied on approval. No fixtures were authored in this phase (deferred to Phase 6, per D-024).

### 15.1 Visual Design Philosophy & Brand Personality

The interface is an instrument panel, not a brochure: every visual decision answers "does this help someone triage faster" before "does this look nice." Brand personality: **calm competence** — precise like Linear, with enough warmth (via type/color choices) that people/client data doesn't feel like a spreadsheet. Never cute, never loud, never a generic "AI product" visual trope.

### 15.2 Color System (approved direction — see DECISIONS.md D-025)

Cool neutral foundation, one restrained indigo-blue brand accent, semantic status colors reserved only for meaning (never decoration). No generic AI-purple identity, no excessive gradients, no glassmorphism, no oversized rounded UI.

**Light theme tokens (accepted as starting palette, subject to WCAG AA re-validation — §15.3):**
```
--bg-canvas: #F7F8FA
--bg-surface: #FFFFFF
--bg-surface-raised: #FFFFFF        (differentiated by shadow, not color)
--border-subtle: #E4E7EC
--border-default: #D0D5DD
--text-primary: #101828
--text-secondary: #475467
--text-tertiary: #667085
--accent: #3A4FE0
--accent-hover: #2F3FC0
--accent-subtle-bg: #EEF0FD
```

**Dark theme tokens (accepted as starting palette, subject to WCAG AA re-validation — §15.3):**
```
--bg-canvas: #0B0D12
--bg-surface: #13161D
--bg-surface-raised: #1A1E27
--border-subtle: #242933
--border-default: #30363F
--text-primary: #F2F4F7
--text-secondary: #94A0B2
--text-tertiary: #677082
--accent: #6E7CF2
--accent-hover: #828FF5
--accent-subtle-bg: #1C2140
```

Dark mode is genuinely re-tuned for perceived elevation, not a filter over light mode.

### 15.3 Token Finality Rule (binding — see DECISIONS.md D-025)

The hex values above are the **starting palette, not permanently final.** Once real component pairings exist in Phase 5, each token must be contrast-tested (WCAG AA minimum) against its actual paired background/foreground use. **WCAG AA validation has authority over the placeholder token value** — if a value fails a real contrast test, it is adjusted, and that adjustment is a token-value correction, not a design-direction change requiring re-approval of §15.1–15.2's direction.

### 15.4 Semantic Status / Risk / Workload Colors

**Task status** (color is reinforcement, never sole signal — always paired with icon/label):
```
todo → neutral · in_progress → accent-tinted, low-saturation · blocked → amber/warning
review → desaturated info/violet-gray, distinct from accent · done → low-saturation success/green
```

**Project risk:**
```
none → no color treatment (absence of a badge is the signal)
at_risk → amber/warning family
critical_risk → red/danger family, visually distinct from at_risk at a glance, not just a darker shade
```

**Workload state:**
```
Available → neutral/calm (not green — availability isn't an achievement)
Healthy → low-saturation success/green
High → amber/warning
Overloaded → red/danger
```
Deliberately a saturation gradient of urgency (fine→fine→concern→problem), not a four-color rainbow.

### 15.5 Typography

**Approved typeface (see DECISIONS.md D-026):** Inter, for English UI only. Not installed until Phase 5 actually requires typography implementation (dependency-on-demand policy). **Arabic typeface is a separate, not-yet-made decision** — Inter is explicitly not assumed to cover Arabic; an Arabic UI typeface that visually harmonizes with Inter will be chosen during the Arabic/RTL implementation phase, so the two languages read as one product system, not two bolted-together typographic identities.

**Type scale:**
```
display 28/1.2 · h1 22/1.3 · h2 17/1.4 · h3 14/1.4 · body 14/1.55 · body-sm 13/1.5 · caption 12/1.4
```
Tabular numerals preferred where the chosen face supports them (aligned table/metric columns).

**Weight rules:** three weights only — Regular (400, body/data), Medium (500, emphasis/labels/active nav), Semibold (600, page titles and primary KPI numbers only). No Bold (700+) in-app; emphasis never carried by color alone where weight can do it.

### 15.6 Spacing, Layout, Grid

4px base unit scale: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64`. Max content width ~1440px desktop; sidebar 240px expanded / 64px collapsed. 12-column grid for dashboard widget placement only; list/table views are single-column flow, not grid-based. Gutters: 24px desktop, 16px tablet.

### 15.7 Borders, Radius, Shadow/Elevation, Surfaces

Hairline (1px) borders only — `border-subtle` for internal dividers, `border-default` for container edges; never double borders or redundant border+shadow on the same edge.

**Radius scale (approved, see DECISIONS.md D-028):**
```
--radius-sm: 6px   (badges, small buttons, inputs)
--radius-md: 8px   (cards, panels, dialogs)
--radius-lg: 12px  (large feature surfaces only, used sparingly)
```
**Binding constraint:** functional component radius must not exceed 12px without an approved design reason documented as a new decision.

**Elevation (three levels, consistent meaning everywhere):**
```
level-0 (flush)   → flat list/table rows, inline content
level-1 (raised)  → card/panel resting state
level-2 (overlay) → docked panels, dialogs, dropdowns, mobile sheet backdrop
```
Elevation is the only signal for "above the page" — never color alone, never an oversized glow.

**Surface hierarchy:** `bg-canvas` → `bg-surface` → `bg-surface-raised`, communicated by shadow in light mode and by actual lightness steps in dark mode.

### 15.8 Component-Level Rules (summary)

- **Buttons:** primary (filled accent, one per view max) / secondary (outlined) / ghost (no border/fill) / destructive (filled danger, confirmation required). Shared height scale, shared radius token, no "lg" marketing-style buttons in-app.
- **Inputs/forms:** 1px border, `radius-sm`, consistent height, visible accent focus ring (never color-change-only), labels always above field (never placeholder-as-label), inline error text + danger color (never color-only).
- **Tables:** dense rows (36–40px), tabular numerals, sticky header, no zebra-striping, status/priority/risk always a compact inline badge, never a colored cell background.
- **Cards vs. rows:** cards (`level-1`, `radius-md`, 16–20px padding) for Dashboard widgets; list rows (Tasks/Clients/Team) are flush `level-0` rows, not cards — density over card-chrome in scan-heavy views.
- **Badges:** one consistent pill/rounded-rect shape (`radius-sm`), low-opacity tinted background + full-opacity text/icon, never a solid saturated fill.
- **Sidebar:** `bg-surface`, hairline border on the logical end edge, active-item accent bar on the logical start edge plus `accent-subtle-bg` row tint (never a filled block).
- **Topbar:** minimal, breadcrumb/title on logical start, global actions clustered on logical end, user menu furthest end; hairline bottom border only.
- **Dialog/drawer/sheet:** dialog = centered modal for short interrupting decisions only; drawer = docked panel (desktop/tablet, AI/Notifications/Task Detail), slides from logical end, no backdrop scrim (content stays interactive-adjacent); sheet = full-screen mobile equivalent, with backdrop scrim.
- **AI Assistant visual language:** no chatbot-bubble/avatar aesthetic, no glowing orb; answers reuse the same card/list/badge components as the rest of the product; a single calm icon marks the AI surface; "composing" state = skeleton lines, not bouncing dots.
- **Notifications visual language:** rows styled like Activity feed rows; icon by category; unread = accent dot + subtle tint (never bold-text-only); no urgency color-coding (risk colors stay reserved for risk/workload only).

### 15.9 Risk / Workload Explanation Interaction (approved responsive behavior — see DECISIONS.md D-027)

**Desktop/Tablet:** contributing conditions are exposed via an interactive tooltip or popover — keyboard-accessible (reachable and dismissible without a mouse), and must not depend on hover alone (a focus/click-triggered open path is required alongside hover).

**Mobile:** tap-to-expand disclosure.

**Critical Risk exception (binding):** for especially important states — specifically `critical_risk` — a short primary reason must be visible directly in the interface at rest (not hidden behind any interaction), with the full set of contributing conditions still available through the detailed tooltip/popover/disclosure. Critical context must never be fully hidden behind a hover-only or tap-only affordance.

### 15.10 Empty / Loading / Error States

Empty: single small line-icon, one short neutral-to-positive sentence, "clear filters" action where filtering caused it — no decorative illustrations. Loading: skeletons matching real layout shape, subtle shimmer, muted static block under reduced motion. Error: inline, scoped to the failing region, danger-colored at low opacity + icon/text + retry, no raw error codes exposed, full-page error reserved for a totally unreachable workspace.

### 15.11 Iconography & Data-Visualization Rules

One icon set (Lucide, installed only when icon usage actually begins), consistent stroke width, 16–20px sizing, never meaning-carrying alone without label/tooltip except universally unambiguous actions (close, chevron). Directional icons (back/forward chevrons) are RTL-mirror-aware; non-directional icons (e.g., calendar) are not mirrored. Charts use only the neutral+accent+status palette — no separately invented rainbow categorical palette; exact chart color-by-series mapping is deferred to the actual Analytics build (reconciled with the `dataviz` skill at that time, not fully specified now since no chart exists yet).

### 15.12 Dark Mode, RTL, Responsive Tokens

Dark mode is a first-class theme (independently tuned tokens, not an inversion filter), follows system preference by default with a manual override later in Settings. All directional specs in this document are logical (start/end), matching the corrected Phase 2 RTL rule (D-017) — sidebar/active-bar dock start, AI/Notification drawer/topbar actions dock end, chevrons flip with `dir`; no literal left/right anywhere in this document.

**Breakpoints (approved as baseline, see DECISIONS.md D-029):**
```
mobile: <640px · tablet: 640–1024px · desktop: >1024px
```
These are baseline tokens, not license to force a broken layout. **Binding constraint:** if a specific component (Kanban, a data table, a docked panel) genuinely needs an additional content-driven breakpoint, the reason must be documented (as a new decision) before adding it — breakpoints are not added ad hoc per component.

### 15.13 Motion Principles (binding — see DECISIONS.md D-030)

Motion exists only to clarify state change — never embellishment. Timings: micro feedback 100–150ms, standard UI transition 150–250ms (matches Constitution's 150–300ms target), panel/drawer open-close 200–300ms, no full-page route transition. Ease-out for entrances, ease-in for exits; no bouncy/spring easing anywhere in the application shell (spring easing is reserved exclusively for a possible future landing-page treatment, never the app shell).

**Scroll-animation rule (binding):** no scroll-triggered reveal/parallax animation anywhere inside the application shell (Dashboard/Projects/Tasks/etc.) — that is explicitly a landing-page-only concept, specified separately when the public marketing experience is designed, not in this document.

**Micro-interactions:** button press feedback, toggle/checkbox state change, row-hover tint, badge tooltip fade-in, drawer slide — allowed. Confetti, bouncing icons, animated gradients, indefinitely-looping idle animation — not allowed (one deliberate, very subtle exception: a persistent unread-notification dot pulse, because it mirrors a convention users already recognize).

**Reduced motion (binding):** every transition/animation above must have a `prefers-reduced-motion: reduce` fallback that removes the animation or reduces it to an instant/near-instant cross-fade — never merely "faster."

### 15.14 3D / Depth Rules (clarified — see DECISIONS.md D-030)

**Inside the application shell:** no literal 3D — no WebGL/Three.js scenes, no glowing AI orbs, no tilting 3D cards, no depth-of-field gimmicks, no heavy GPU effects. Depth is communicated only through the elevation/surface system (§15.7); the AI Assistant panel sits at `level-2` like any other overlay, deliberately avoiding the "AI feature = floating 3D orb" trope.

**Public Landing Page (future, not implemented now):** a lightweight depth/3D treatment is **not permanently prohibited** and may be explored later, conditioned on all of: it supports the product's story, performance remains strong, it works responsively, reduced-motion/accessibility behavior is respected, it does not look like a generic AI visual, and it does not enter normal business workflows. No implementation is required or scoped now — this is a future option, not a Phase 5+ task.

### 15.15 shadcn/ui and External Library Strategy

shadcn/ui components (once installed, per dependency-on-demand policy) are used as unstyled structural/behavioral primitives and fully re-themed through this document's tokens — "looks like the shadcn demo" is a build-review failure, not a style preference. External library components (Recharts, TanStack Table, dnd-kit, etc.) are wrapped at the design-system layer (FlowPilot's own `<DataTable>`/`<Chart>`/`<KanbanBoard>`) rather than consumed raw in feature code, so swapping an underlying library later doesn't ripple through feature files.

### 15.16 Claude Code Design Skills Usage Rule

`frontend-design`/`design-taste-frontend`/`dataviz` skills are consulted at actual component/page-build time to execute decisions already locked in this document — they inform *how*, never *whether*, and cannot silently override an approved decision in these four persistent files. A conflict between a skill's default suggestion and an approved decision must be surfaced, per the project's standing workflow rule.

### 15.17 Anti-Patterns (explicitly forbidden)

Generic AI-purple gradients/glow; glassmorphism; functional-component radius >12px without an approved reason; decorative empty-state illustrations; zebra-striped tables; bouncy/spring easing in the app shell; scroll-triggered reveal inside the app shell; chatbot-bubble/avatar AI styling; color-only status signaling; ad hoc rainbow chart palettes; literal left/right CSS anywhere in layout code.

### 15.18 Accessibility Requirements (binding, corrected — see DECISIONS.md D-031)

WCAG AA minimum contrast for all text/icon-background pairs in both themes, re-verified against final token values (§15.3). All interactive elements keyboard-reachable with a visible accent focus ring. Status/risk/workload never color-only. Motion respects `prefers-reduced-motion` (§15.13).

**Touch target correction (binding — see DECISIONS.md D-031):** primary mobile/tablet interactive controls — icon buttons, navigation targets, close buttons, mobile disclosure controls, frequently used actions — target a minimum practical touch target of **~44×44px** where feasible. Dense desktop table rows may remain visually compact provided the actual interactive control within them stays reasonably operable; visual compactness and operable hit-area size are treated as separate concerns, not conflated.

Form errors are programmatically associated with their field for screen-reader correctness (implementation detail flagged here as a requirement for Phase 5+).

### 15.19 Design QA Checklist

- No hardcoded left/right CSS — logical properties only.
- Every risk/workload badge exposes contributing conditions per §15.9's rules (not just a label); Critical Risk shows a primary reason at rest.
- Only defined system color tokens used — no inline hex values in feature code.
- Every animation has a reduced-motion fallback.
- Contrast checked in both themes for any new token pairing (§15.3).
- No icon outside the single chosen set.
- No unthemed shadcn/Recharts/dnd-kit default styling shipped.
- Spacing values only from the 4px scale.
- Touch targets meet the ~44×44px guidance (§15.18) on mobile/tablet for primary controls.
- Empty/loading/error states present and matching §15.10 for every new list/data view.

### 15.20 Main Design Risks (carried forward, tracked for Phase 5+ attention)

1. Token hex values (§15.2) are a starting palette pending real contrast testing (§15.3) — Phase 5 must not treat them as unquestionable.
2. Arabic typeface is an open, not-yet-made decision (§15.5) — must be resolved before any Arabic/RTL content work, not assumed to be "whatever Inter's fallback is."
3. Risk/workload interaction pattern (§15.9) is now specified, but its exact component API (tooltip vs. popover primitive, keyboard trap behavior) still needs concrete definition at Phase 5 component-build time.
4. Chart color-by-series mapping remains deferred until Analytics is actually built — risk of drift from the neutral+accent+status system if not reconciled carefully with the `dataviz` skill at that time.
5. Breakpoint-addition discipline (§15.12) depends on future sessions actually documenting the reason before adding a new breakpoint — a soft process risk, not a technical one.

## 16. Phase 5 — Shared Application Shell (IMPLEMENTED)

Implemented per the approved Phase 5 plan. No Dashboard/Projects/Tasks/Clients/Team/Analytics/AI business logic, no mock fixtures, no real auth/backend/billing — shell only, exactly as scoped.

**What exists:** Next.js 16 (App Router, Turbopack) + TypeScript (strict, `noUncheckedIndexedAccess`) + Tailwind v4 + shadcn/ui (Radix base, RTL-enabled) at the repo root. Design tokens from Phase 4 wired into the Tailwind/shadcn theme contract (`src/styles/tokens.css` → `src/app/globals.css`). Theme architecture (system-preference default + persisted override, no-flash script) and locale architecture (single `getLocale()` seam, D-017) both implemented via `useSyncExternalStore` rather than a setState-in-effect pattern. Full shell: `Sidebar` (desktop/tablet, collapsible, persisted), `Topbar` (title + AI/Notifications triggers), `MobileNav` (5-tab bar + "More" sheet, D-013), `SidePanel` (one shared implementation for AI Assistant and Notifications, mutually exclusive per D-014, logical-end docking per D-017). Placeholder pages exist for every Phase 2 top-level route. Error/loading/not-found boundaries exist at both the shell and root level. Phase 3's entity types live in `src/types/entities.ts` as the single TypeScript source for later phases.

**Build-time finding (D-032):** the shared `SidePanel` needed to be non-modal (no overlay/focus-trap) on desktop/tablet and modal on mobile — a shadcn default that, left unchanged, would have silently broken D-014's "click one trigger to swap panels" requirement. Caught via Playwright smoke-testing, not manual review; fixed via `modal`/`showOverlay` props and a topbar stacking-context adjustment. See `DECISIONS.md` D-032 for the full rationale — this is a real architectural clarification, not a cosmetic tweak, and binds how any future panel-like component in this codebase should be built.

**Verified:** `tsc --noEmit`, `eslint`, and `next build` all pass with zero errors; all 10 routes render; AI/Notifications mutual exclusivity confirmed interactively; mobile 5-tab bar + More sheet confirmed; dark mode confirmed to actually repaint (not just toggle a class); the real `getLocale()`-driven RTL path confirmed end-to-end (sidebar and panel both correctly mirror to the opposite physical edge); reduced-motion emulation confirmed non-breaking.

## 18. Phase 6 — Mock Data Foundation (IMPLEMENTED)

Data/domain foundation only — no Dashboard/Projects/Tasks/Kanban/Clients/Team/Analytics/AI UI, no real auth/backend/billing, no API routes. Everything below lives in `src/data/mock/`, `src/domain/`, and `src/lib/demo-clock.ts`.

**Deterministic clock:** `lib/demo-clock.ts` fixes `DEMO_TODAY_ISO = "2026-10-04T09:00:00.000Z"`. Every risk/workload/overdue/follow-up calculation reads "today" from this one constant — never `new Date()` — so the demo produces the same states regardless of when it's opened or built.

**Dataset (Northbound Studio, all fictional):** 1 Workspace, 2 demo Users, 8 TeamMembers, 15 Clients (3 dormant), 18 ClientInteractions, 14 Projects (12 active-stage + 1 completed + 1 on_hold), 55 Tasks, 16 Activities, 8 Notifications. All names/companies/emails are clearly invented; no fake awards/press/certifications/logos.

**State coverage (deliberately authored, not randomized) — see `src/data/mock/index.test.ts` for the automated proof:**
- Project risk: `none` (7 projects), `at_risk` (4 projects, one per individual condition), `critical_risk` (1 project, conditions 1+2 together). The completed and on_hold projects each carry a task that would trigger `critical_risk` if not excluded — proving the exclusion rule in `domain/risk/risk.ts` actually excludes something.
- Team workload: all four bands produced (Sana Iyer → Overloaded ~126%, Priya Nair → High 100%, Jordan Lee → Healthy ~74%, Omar Haddad → Available 50%), using a mix of real `estimatedHours` and all three fallback tiers (low/medium/high).
- Client follow-up: 6 non-dormant clients within the proposed 7-day threshold (no follow-up needed), 6 non-dormant clients well past it (follow-up needed), 3 dormant clients excluded regardless of interaction age.
- Task-level: overdue, due-soon, completed, high-priority, `status: "blocked"` (workflow state) deliberately demonstrated separately from `hasActiveBlocker: true` (risk-relevant blocker) per D-023's decoupling rule, tasks with and without `estimatedHours`.

**Domain layer (single shared implementations, per Constitution §7 One Source of Truth):**
- `domain/risk/risk.ts` — `computeProjectRisk(project, tasks)`. The only place the §4a formula is implemented.
- `domain/workload/workload.ts` — `computeTeamMemberWorkload(member, tasks)`. Approved fallback hours (D-019) applied only at computation time; never written to `Task.estimatedHours`. Workload is never stored (Constitution §7).
- `domain/clients/followUp.ts` + `deriveClientFields.ts` — `getClientFollowUpStatus`, `getLatestClientInteraction`, and the one controlled place `Client.lastInteractionAt` is derived from `max(ClientInteraction.occurredAt)`.
- `domain/selectors.ts` — `getProjectById`, `getClientById`, `getTeamMemberById`, `getTasksForProject`, `getProjectsForClient`, `getTasksForMember`, `getClientInteractions`, `getLatestClientInteraction`, `getProjectRisk`, `getTeamMemberWorkload`, `getOverdueTasks`, `getClientsNeedingFollowUp`, `getAtRiskProjects`. Phase 7+ feature UI must consume these, not recompute business rules in components.
- `domain/validation.ts` + `data/mock/index.ts` — composes the dataset (deriving `lastInteractionAt` exactly once), validates referential integrity/unique IDs/workspace ownership/required state coverage/impossible field combinations, and throws with every problem listed if invalid.

**New proposed default needing confirmation (see DECISIONS.md D-033):** `FOLLOW_UP_STALE_DAYS = 7` — no prior phase defined a numeric client follow-up threshold. The dataset was authored with a wide margin (recent ≤6 days, stale ≥19 days) specifically so this value can be adjusted later without reshuffling fixture dates.

**Tooling (dependency-on-demand):** no test framework or path-alias package was installed. Node 24 runs `.ts` test files natively via `node --test`; `scripts/alias-loader.mjs` is a ~20-line Node ESM loader hook resolving the existing `@/*` tsconfig alias under plain `node`, so scripts/tests import exactly the way the Next.js build does. New npm scripts: `validate:data`, `test`.

**Contrast audit: explicitly deferred to Phase 7.** Phase 6 built no rendered UI consuming this data (per its own scope) — there is no "representative content in a debug view" to test against yet, so claiming a contrast pass now would not be honest. See DECISIONS.md D-034.

**Verified:** `tsc --noEmit`, `eslint`, `next build` all pass with zero errors. `npm run validate:data` passes. `npm test` — 32/32 tests pass (project risk: 11, workload: 8, client follow-up: 5, mock dataset: 7, plus a demo-clock sanity check — see test files for the exact list). Phase 5 shell re-verified non-regressed: all 10 routes still 200, AI/Notifications mutual exclusivity still holds, dark theme still applies.

## 20. Phase 7 — Dashboard (IMPLEMENTED)

The first real FlowPilot AI business screen, at `/dashboard`, replacing its Phase 5 placeholder.

**Sections, in the approved order:** Daily Brief, At-Risk Projects, Overdue Tasks, Clients Needing Follow-Up, Team Workload Snapshot, Recent Activity. Section order in the page source is priority order, so mobile's single-column stack needs no extra logic to put the most urgent information first.

**Domain layer, not components, computes everything:** `domain/dailyBrief.ts` (new — deterministic rule-based ranking: Critical Risk > At Risk > most-overdue task > most-stale follow-up > most-overloaded member > latest activity, capped at 5 items, explicitly not an AI call) plus new sorted selectors in `domain/selectors.ts` (`getAtRiskProjectsSorted`, `getOverdueTasksSorted`, `getClientsNeedingFollowUpSorted`, `getTeamWorkloadSnapshot`, `getRecentActivities`). No component recomputes risk, workload, overdue, or follow-up logic.

**Bug found via visual verification, fixed at the domain layer:** `getOverdueTasks` now excludes tasks belonging to `completed`/`on_hold` projects — without this, the Dashboard surfaced two Phase 6 fixtures deliberately authored to prove *risk* exclusion as if they were actionable "overdue" work. New regression test locks this in.

**New shared components:** `RiskBadge`, `WorkloadBadge`, `StatusBadge` (`TaskStatusBadge`/`TaskPriorityBadge`), `ConditionsDisclosure` (one click/keyboard-triggered Popover satisfying D-027's "not hover-only" desktop requirement and mobile tap-to-expand with a single implementation), `riskConditionLabels.ts` (the one presentation-layer RiskCondition→sentence lookup, per §13.17), and the six Dashboard section components plus `DashboardSection`.

**Layout finding:** list rows use an always-stacked layout (name/meta on one line, badge below) rather than a viewport-breakpoint row/column switch — a single breakpoint can't predict actual column width once the page's own responsive 2-column section grid is also active (confirmed broken at tablet width specifically), so the robust fix doesn't depend on viewport width at all. A related flex-column stretch bug (badges stretching to full row width) was also found and fixed with `self-start`.

**Contrast audit (D-034/D-035):** performed against real rendered Dashboard elements via browser-native canvas color resolution (not regex-parsed computed styles, which initially mis-parsed Tailwind v4's `oklab()`/`color-mix()` output). Four tokens adjusted — light `--fp-success`/`--fp-warning`/`--fp-danger` darkened, dark `--fp-accent` lightened, focus-ring opacity raised `/50`→`/70` sitewide — each the smallest change clearing the relevant WCAG AA threshold, documented with before/after ratios in `tokens.css` and `DECISIONS.md` D-035.

**Verified:** `tsc --noEmit`, `eslint`, `next build` — clean. `npm test` — 33/33 (added 1 regression test for the overdue-exclusion fix). `npm run validate:data` — clean. Visual verification via Playwright at desktop/tablet/mobile × light/dark, plus a live RTL check (sidebar and grid order both mirror correctly, conditions popover stays on-screen) — all pass, zero console errors, zero horizontal overflow at any combination tested.

**No Recharts, no new dependencies.** No Projects/Tasks/Clients/Team/Analytics/AI business UI built — placeholders remain for those routes.

## 22. Phase 8 — Projects (IMPLEMENTED)

The complete Projects module: `/projects` (list), `/projects/:projectId` with a shared header + route-backed tabs, and `/projects/:projectId/{tasks,team,activity}`.

**List (`/projects`):** a dense table (md+) / stacked list (mobile) — both renderings built from the start, not retrofitted after a breakpoint bug like Phase 7's. Filters (status, client, risk, search) and sort live in the URL query string via `router.replace`, so filtered views are deep-linkable and browser Back restores the prior filter state; no new dependency (native `<select>`/`<input>`, no component library). Filtering/sorting rules live in `domain/selectors.ts` (`getFilteredProjects`), not in the filter component.

**Detail header + tabs:** shared across all four tabs via `[projectId]/layout.tsx`. Tabs are real routes (`ProjectTabs`, click = navigation), not a client-state panel switcher — satisfies "no second sub-sidebar" and keeps each tab deep-linkable. Risk comes from the same `getProjectRisk`/`RiskBadge`/`ConditionsDisclosure` Phase 7 already built — no second risk-explanation system.

**Overview tab:** timeline, full risk-condition list (not just the header's popover — this tab is the one-page summary), task/team/activity summaries, each linking to its full tab.

**Tasks tab:** reads the same `Task` records the future global Tasks module will use (`getTasksForProject` filters the one shared dataset — no duplicated per-project task data). A List/Kanban toggle exists with Kanban genuinely disabled and labeled "(Phase 9)" — not faked.

**Team tab:** membership is *derived* from task assignments (`getProjectAssignedMembers`) — there is no separately authored project-team list. Project-scoped hours/task-count are shown distinctly from a member's "Global workload" badge, explicitly labeled, per the binding instruction not to conflate the two.

**Activity tab:** full chronological feed from existing `Activity` records, nothing invented.

**New domain selectors:** `getProjectsWithRisk`, `getFilteredProjects`, `getProjectTaskSummary`, `getProjectAssignedMembers`, `getProjectActivity`, `getUserById`. `workload.ts` refactored to expose `sumAssignedHours` so the fallback-hours rule has exactly one implementation shared by global and project-scoped workload math.

**Link-target placeholders:** thin stub routes for `/tasks/:taskId`, `/team/:memberId`, `/clients/:clientId` (each validates its ID and 404s on a genuinely bad one) so Project Detail's outbound links resolve instead of 404ing — these are plumbing, not early feature builds of those modules.

**Two real bugs found via visual verification, both fixed:**
1. `notFound()` thrown from `[projectId]/layout.tsx` was caught by the *root* not-found page instead of a project-specific one — a documented Next.js App Router behavior (a segment's own `not-found.tsx` only catches `notFound()` from its children, not from the segment's own layout). Fixed by moving `not-found.tsx` to the parent `projects/` segment and adding a shared `requireProject()` guard to every tab component (Next can render a layout and its page concurrently, so the layout's check alone didn't reliably stop a child from independently throwing).
2. `npm test`'s glob (`src/**/*.test.ts`) was silently matching only 1 of 5 test files under npm's script shell (no globstar support in `sh`) — every prior phase's "N/N passing" figure since Phase 6 undercounted by 4 files' worth of tests. Fixed with `find | xargs` (shell-portable); confirmed 43/43 now actually run.

**Known, documented limitation (not a content bug):** the not-found page shows the correct message but returns HTTP 200, not 404 — the `(app)/loading.tsx` Suspense boundary (an already-approved Phase 5 decision) begins streaming the 200 response before the nested `notFound()` fires. Content is correct either way; this is an HTTP-status nicety, not a user-visible defect.

**Verified:** `tsc --noEmit`, `eslint`, `next build` — clean (all `/projects/*` and placeholder routes compile as expected dynamic routes). `npm test` — 43/43 (10 new Phase 8 selector tests). `npm run validate:data` — clean. Broad route smoke check across the whole app — all 200. Playwright visual verification at desktop/tablet/mobile × light/dark, plus live RTL (sidebar, grid order, tabs, breadcrumb, disclosure all mirror correctly) — zero console errors, zero horizontal overflow, filters/popover/tabs all interactively confirmed working, not just built.

**No Kanban drag-and-drop, no global Tasks module, no Clients/Team/Analytics/AI features, no new dependencies.**

## 24. Phase 9 — Tasks / Kanban (IMPLEMENTED)

The complete global Tasks module and the real Kanban experience: `/tasks` (list + Kanban), `/tasks/:taskId` (direct deep link), and Project Tasks (Phase 8) now reusing the exact same components.

**Kanban/TaskStatus reconciliation (D-038):** the approved `TaskStatus` enum (`todo | in_progress | blocked | review | done`, Phase 3, locked) has no "backlog" value. Rather than add one, Kanban's 5 columns map 1:1 onto the 5 existing values — "To Do" stands in for the old IA sketch's "Backlog," and "Blocked" is promoted to a real, visible column. Zero duplicate `kanbanStatus` concept; `TASK_STATUS_LABEL` in `StatusBadge.tsx` is the one canonical column-label source. The active-blocker flag (`hasActiveBlocker`) remains fully decoupled from workflow status (D-023) — a card's blocker indicator shows regardless of which column it sits in, and moving a card between columns never touches `hasActiveBlocker`.

**Demo-state architecture (D-039):** there is no backend. Edits (Kanban drag, StatusSelect, Task Detail form) are applied to a **server-side, in-memory overrides map** (`domain/taskMutations.ts`), layered onto the Phase 6 base fixtures at read time by `data/mock/index.ts`. This is process-lifetime state in the Node process running `next dev`/`next start` — not localStorage, not a per-browser store, shared across every tab hitting the server (acceptable and documented given no real auth/tenancy exists). Every Server Component re-reads `getDemoDataset()` on each render, so Dashboard/Projects/Tasks/Kanban/Project Detail all stay consistent automatically with zero client-side merging logic. Next.js Server Actions (`lib/taskActions.ts`) call `revalidatePath("/", "layout")` after every mutation. Base fixture arrays are never mutated. A reset-to-demo-data capability (`resetTaskOverrides`) exists at the domain layer.

**List + Kanban:** `TasksTable` (dense table/stacked-list dual rendering, built responsive from the start this time, applying Phase 7's hard-won lesson preemptively) and `KanbanBoard` (`@dnd-kit/core` — pointer/touch drag, React 19 `useOptimistic` for instant feedback). Filters (search, project, assignee, status, priority) and sort live in the URL via `TasksFilters`/`parseTaskSearchParams.ts`, shared identically by `/tasks` and Project Tasks.

**Accessible alternative to drag (Phase 9 §17):** every card (and Task Detail) carries a `StatusSelect` — a plain native `<select>` calling the exact same `changeTaskStatusAction` drag uses. dnd-kit's core `KeyboardSensor` needs a custom coordinate-getter to work across a multi-column board (the built-in one assumes a single sortable list) — rather than ship a fragile approximation, full keyboard/screen-reader accessibility is guaranteed by `StatusSelect` instead; drag is an accelerator on top of it, never the only path.

**Task Detail — one shared implementation (Phase 2 §11.10, Phase 9 §8-§10):** `TaskDetailContent` is rendered identically by the panel (opened via a `?task=` query param on the *current* list/Kanban/Project-Tasks URL — no navigation occurs, so filters/scroll/project context are preserved) and the direct `/tasks/:taskId` page. Editable: status, priority, assignee, due date, estimated hours, active-blocker flag, description. `completedAt` is derived automatically from status transitions, never a raw editable field — the impossible-state rules from `domain/validation.ts` are enforced at the mutation boundary, not trusted to UI input.

**Domain recalculation (Phase 9 §13):** proven with 5 integration tests (`taskMutations.integration.test.ts`) that a task edit changes `computeProjectRisk`/`computeTeamMemberWorkload` output end to end, through the real demo dataset — no UI code manually patches a derived value.

**Mobile/tablet Kanban:** horizontal scroll-snap rather than squeezing 5 columns into a narrow viewport; desktop also scrolls once all 5 columns' card content is legibly sized (consistent with common real-world Kanban UX at this column count, e.g. Linear/Trello).

**Real bugs found and fixed via interactive/visual verification** (not just build passing):
1. Forgot to actually thread URL filter params into `ProjectTasksTab` on first pass — caught before shipping by re-reading my own code, not by a test failure.
2. Two apparent RTL/drag "failures" during automated verification turned out to be test-script artifacts (stale DOM references, `getLocale()` being static like Phase 5/7's SidePanel, insufficient drag-distance coordinates) — each was deliberately re-verified via direct DOM inspection and the real `getLocale()` code path before being ruled out, rather than assumed away.

**Verified:** `tsc --noEmit`, `eslint`, `next build` — clean. `npm test` — 67/67 (24 new Phase 9 tests). `npm run validate:data` — clean. Whole-app route smoke check — all 200. Real mouse-drag-and-drop tested end-to-end via Playwright (not just the accessible fallback) and confirmed to persist across navigation and reflect consistently in both Kanban and List views. RTL verified via the real `getLocale()` path (panel docks to the correct logical-end side). Project Tasks Kanban confirmed genuinely project-scoped (no project-filter clutter, no cross-project leakage) and visually polished in both themes.

**No comments, subtasks, recurring tasks, time tracking, saved views, custom columns, WIP limits, real backend, collaboration, or AI task generation.**

## 26. Phase 10 — Clients / CRM (IMPLEMENTED)

The complete Clients module: `/clients` (list), `/clients/:clientId` (Overview), `/clients/:clientId/projects`, `/clients/:clientId/interactions` — replacing the Phase 8 `ComingSoon` placeholder.

**List (`ClientsTable`/`ClientsFilters`):** sorted needs-follow-up-first by default (`attention` sort — needs-follow-up clients first, then active/retainer by recency, dormant clients last, each tier alphabetical), not alphabetical. Search, status filter, and a "Needs follow-up only" checkbox all live in the URL, same `router.replace` pattern as Projects/Tasks. Dense table at `md+`, an always-stacked list below it from the start (Phase 7's lesson applied preemptively, as Phase 9 also did).

**Follow-up computation reused, not re-implemented:** every follow-up read goes through the one shared `getClientFollowUpStatus`/`getLatestClientInteraction` (`domain/clients/followUp.ts`, `FOLLOW_UP_STALE_DAYS = 7`, D-033) via new selectors (`getClientsFiltered`, `getClientDetail`, `getClientsNeedingFollowUpSorted` — the last already existed from Phase 7's Dashboard). `FollowUpBadge` is the one D-016-compliant presentation of that status (reuses `ConditionsDisclosure`, same pattern as `RiskBadge`/`WorkloadBadge`).

**Client Detail:** a persistent header (`ClientDetailHeader` — name, contact with bidi-protected email, status badge, follow-up badge, "Add interaction" button) and three route-backed tabs (`ClientTabs`): Overview, Projects, Interactions. Overview is a lightweight addition beyond the original Phase 2 §11.7 IA, justified and documented as D-040. Projects tab reuses the global `ProjectsTable` (new `showClient` toggle, default `true`) with `getClientProjectsWithRisk` — zero duplicated project data or risk computation. Interactions tab is backed entirely by `ClientInteraction` (`getClientInteractionHistory`, newest-first) with no new interaction types.

**Add Interaction (D-041):** a plain native controlled form (`AddInteractionForm.tsx`), not React Hook Form + Zod — judged unjustified for two fields and one validation rule, and consistent with `TaskDetailContent.tsx`'s existing native-input pattern.

**Demo-state architecture extended, not duplicated (builds on D-039):** `domain/clientMutations.ts` adds client field overrides (`primaryContactName`/`primaryContactEmail`/`status` only — no multi-contact, no pipeline/sales fields) and an appended-interactions list, both server-side and in-memory. `data/mock/index.ts`'s `getDemoDataset()` merges both and **re-derives `lastInteractionAt` fresh from the full base+added interaction list on every call** — so an added interaction flows through the exact same `getClientFollowUpStatus` computation everything else uses, with no second derivation path. `lib/clientActions.ts` Server Actions call `revalidatePath("/", "layout")`, so the interaction list, the client's follow-up badge, and the Dashboard's Clients Needing Follow-Up all update together automatically. `resetDemoDataAction` now resets both tasks and clients. Client `status` (active/retainer/dormant) stays structurally separate from computed follow-up state — editing one never touches the other's storage.

**Guard pattern reused (D-036):** `requireClient(clientId)` is called from the `[clientId]/layout.tsx` and from every tab component; `src/app/(app)/clients/not-found.tsx` lives in the parent segment, exactly matching the Phase 8 `requireProject`/`projects/not-found.tsx` structure (no re-introduction of the bug D-036 already found and fixed once).

**AI entry point explicitly not implemented:** the Phase 2-approved "Draft update for this client" affordance is not present anywhere in this phase's UI — no disabled stub was added either, since the real tabs already fill the available header/action space without needing a placeholder to preserve the IA.

**No feature creep:** no multi-contact support, no sales pipeline/stages, no CRM-style deal tracking, no new `InteractionType` values, no client-level custom fields, no bulk actions, no CSV import/export.

**Tests:** `clientMutations.test.ts` (10 unit tests — interaction validation/trimming/id-uniqueness, field-edit validation/merging/null-clearing, override reset) and `clientMutations.integration.test.ts` (8 tests against the real demo dataset — follow-up status flips after an added interaction, the Dashboard's Clients Needing Follow-Up list drops a client immediately after its interaction is added, dormant-status exclusion via a live status edit, `followUpOnly`/`attention`-sort filtering, client-scoped project relationships, newest-first interaction ordering including a newly added one, the `getClientDetail` not-found-guard input case).

**Verified:** `tsc --noEmit`, `eslint`, `next build` — clean (new routes `/clients`, `/clients/[clientId]`, `/clients/[clientId]/interactions`, `/clients/[clientId]/projects` all build as dynamic routes). `npm test` — 84/84 (17 new Phase 10 tests, zero regressions in the prior 67). `npm run validate:data` — clean. Whole-app route smoke check — all 200, no regressions on Dashboard/Projects/Tasks/Clients/Team/Analytics/Settings. Interactive Playwright verification: list → detail → Projects tab → Interactions tab → Add Interaction (new entry appears newest-first, follow-up badge flips from "Needs Follow-Up" to "Up to date" immediately, no page reload) → invalid-client `not-found` route → Dashboard — zero console/page errors throughout. Dark mode and RTL (via the real `getLocale()`-driven `dir` flip) both verified on Client Detail — RTL mirrors the whole layout correctly and the contact email stays in natural left-to-right order via its existing `dir="ltr"` + `unicode-bidi: isolate` span. Mobile (390×844) verified on the list and the Interactions tab — always-stacked rows, full-width form, bottom tab bar intact. Bidirectional Project↔Client navigation confirmed working both directions.

## 27. Phase 11 — Analytics (IMPLEMENTED)

The complete `/analytics` module: top operational summary, On-Time Delivery, Overdue Task Trend, Workload Distribution, Project Status + Project Risk distributions, and a short textual Insights section — replacing the Phase 8 `ComingSoon` placeholder.

**Data-model extension (D-042, owner-approved):** `Project.completedAt` was added (mirrors `Task.completedAt`'s existing invariant) specifically because On-Time Delivery Rate needs a real delivery date to compare against `dueDate`, and the Phase 6 fixtures had only 1 completed project — not enough sample even with the field. 5 new completed-project fixtures were added (4 on-time, 2 late), bringing the dataset to 19 projects / 6 completed. This was a genuine Phase 3 data-model change, so it was stopped-and-reported to the owner before being made (see D-042 for the full option set presented and the owner's choice).

**Analytics domain layer (`domain/analytics.ts`):** `getOnTimeDeliveryRate`, `getWorkloadDistribution`, `getOverdueTaskTrend`, `getProjectStatusDistribution`, `getProjectRiskDistribution`, `getActiveProjectAverageProgress`. Every function reads `getDemoDataset()` and/or an existing selector (`getProjectRisk`, `getTeamWorkloadSnapshot`) — none recomputes risk or workload itself. Chart components receive only already-shaped data; no chart computes anything.

**On-Time Delivery Rate:** only counts a completed project if it has BOTH `completedAt` and `dueDate` — a completed project missing either is excluded from the denominator rather than assumed on-time. Returns `undefined` (rendered as an explicit "not enough data" message, not a misleading 0%/100%) when there are zero scoreable completed projects.

**Overdue Task Trend (D-043):** reconstructed from each task's own real `dueDate`/`completedAt` fields — no synthetic historical fixture was added. At each past weekly checkpoint, a task counts as overdue-as-of-that-date using the same rule `getOverdueTasks()` applies today; proven identical at the trend's last point by `analytics.test.ts`, and proven to react live to task mutations by `analytics.integration.test.ts`.

**Current-state vs. historical, documented explicitly (Phase 11 §11):** On-Time Delivery, Workload Distribution, Project Status, and Project Risk are all live current-state — they change immediately when a Phase 9/10 mutation changes the underlying data (proven by `analytics.integration.test.ts`: a task reassignment shifts the workload distribution, a task edit that pushes a project into risk shifts the risk distribution). The Overdue Task Trend's past points are a real reconstruction, not something that retroactively rewrites itself — only its own last (today) point tracks live mutations.

**Chart library:** Recharts (`^3.10.1`), installed only now per Phase 11 §5. Every chart is wrapped behind a FlowPilot component (`WorkloadDistributionChart`, `OverdueTrendChart`, `ProjectStatusChart`, `ProjectRiskChart`) — no raw Recharts styling/config appears in page code. Colors come only from existing semantic tokens (`analyticsColors.ts` maps workload bands/risk levels to the exact same CSS custom properties `WorkloadBadge`/`RiskBadge` already use) — no ad-hoc hex values. A themed `ChartTooltip` replaces Recharts' default tooltip styling with the FlowPilot surface/elevation system. `useReducedMotion` (`useSyncExternalStore`-based) disables each chart's JS-driven entrance animation under `prefers-reduced-motion: reduce`, since the existing global CSS rule (Phase 4 §15.13) only zeroes CSS transitions, not Recharts' animation.

**Accessibility:** every chart has an `aria-hidden` SVG plus a sibling text equivalent (a `sr-only` summary sentence, a visible legend list, or both) carrying the same numbers, so no information is SVG-only.

**RTL (D-044):** every chart's SVG container is forced `dir="ltr"` regardless of page direction — Recharts' text positioning is not RTL-aware, and without this the Workload Distribution chart's Y-axis labels rendered overlapping the bars in RTL (found via visual verification, fixed before completion). The surrounding page chrome (headers, grid order, legends, text summaries) still mirrors normally. The Overdue Task Trend's X axis stays chronological left-to-right by design (Phase 11 §13), not mirrored.

**No feature creep:** no report builder, export, scheduled reports, CSV/PDF, forecasting, billing analytics, or AI-generated narrative — Insights is plain conditional sentences over the same section data, not a generated summary.

**Tests:** `analytics.test.ts` (10 tests — on-time delivery against the real 6-project sample, workload/status/risk distribution totals and ordering, trend length/ordering/last-point-matches-getOverdueTasks, the zero-scoreable-completed-projects "insufficient data" rule) and `analytics.integration.test.ts` (3 tests — workload distribution reacts to a reassignment, risk distribution reacts to a task edit pushing a project into risk, the trend's last point reacts to a status change). `validation.ts` gained the `Project.completedAt`/`status` impossible-state pair, mirroring `Task`'s existing one.

**Verified:** `tsc --noEmit`, `eslint`, full test suite (97/97, 13 new), `npm run validate:data` all clean. Whole-app route smoke check all 200, zero console/page errors across Dashboard/Projects/Tasks/Clients/Team/Analytics in Playwright. Playwright visual verification: desktop light/dark/RTL, tablet, mobile (390px, no horizontal overflow, charts stack rather than squeeze), and `prefers-reduced-motion: reduce` (animation genuinely skipped, not just faster) all checked; one real RTL bug (overlapping Workload Distribution labels) found and fixed (D-044) before completion.

**Known limitation:** `next build` could not be re-verified in this environment during this phase — the sandbox has no network route to `fonts.googleapis.com` (confirmed via direct `curl`; other hosts like api.github.com/registry.npmjs.org are reachable), which `next/font/google`'s Inter setup (Phase 5, D-026, unchanged by this phase) needs to fetch at build time. This is an environment/network constraint, not a code regression — `tsc`, `eslint`, the full test suite, and a live Turbopack dev server (same compiler, same source) serving every route with zero console errors are the evidence of correctness in its place. Re-run `next build` once network access to Google Fonts is available to get a final confirmation.

## 28. Phase 12 — Team (IMPLEMENTED)

The complete Team module: `/team` (filterable/sortable dense list, default sort action-oriented) and `/team/:memberId` (one scrollable detail page) — replacing the Phase 8 `ComingSoon`/thin placeholders.

**Team list (`TeamTable`/`TeamFilters`):** default sort is `workload` — Overloaded first, then High, Healthy, Available (reusing the exact `WORKLOAD_BAND_RANK` constant `getTeamWorkloadSnapshot` already defined in Phase 7), ties broken by workload % descending — never alphabetical by default. Search (name/job title) and a workload-band filter live in the URL, same `router.replace` pattern as every other list. No active/inactive filter: every Phase 6 fixture member is active, so one would never filter anything (D-047).

**Workload logic reused, never recomputed:** every number comes from the existing `computeTeamMemberWorkload`/`getTeamMemberWorkload`/`getTeamWorkloadSnapshot` — nothing in `components/team/` computes a percentage or band itself. New selectors (`getTeamMembersWithWorkload`, `getTeamMembersFiltered`, `getTeamMemberDetail`, `getMemberAssignmentsGroupedByProject`, `getMemberWorkloadContributors`) only shape and filter/sort that same data.

**Fallback estimate disclosure:** the list shows "(est.)" next to a member's hours whenever any of their open tasks used a fallback estimate; Team Member Detail spells out the exact count ("N of M assigned tasks used an estimated (fallback) hour value") and a "Biggest contributors to this workload" list showing each task's own hours and whether it was a real estimate or fallback (`hoursForTask`, newly exported from `workload.ts` per D-045 — no second fallback-hours implementation).

**Team Member Detail:** intentionally shallow — one scrollable page (header, Workload section, Assignments section), no tabs. The workload explanation is on the page at rest, not hidden behind a click (D-016/Phase 12 §8) — `WorkloadBadge`'s own disclosure is still present for the quick-scan case, with its redundant inline percentage suppressed here via a new `showPercent` prop (D-046) since the page already shows its own large headline number.

**Assignments grouped by project (`getMemberAssignmentsGroupedByProject`):** most-contributing project first; each group shows project name/status/risk and this member's project-scoped open-task hours, explicitly never conflated with the page's own global workload percentage (same distinction established in Phase 8 §8 for `ProjectTeamTab`). Clicking a task opens the exact same `TaskDetailPanel`/`TaskDetailContent` Phase 9 built, via `?task=` on the Team Member Detail URL (`MemberAssignmentsView`) — no duplicated task data or a second detail implementation.

**Guard pattern reused (D-036):** `requireTeamMember(memberId)` called from the detail page; `src/app/(app)/team/not-found.tsx` lives in the parent `team/` segment.

**Current-state mutation integration, proven (Phase 12 §9/§13/§14):** `team.integration.test.ts` proves a task reassignment moves workload off the old member and onto the new one with `getTeamWorkloadSnapshot` (Dashboard) and `getWorkloadDistribution` (Analytics) agreeing exactly; an estimated-hours edit updates `getTeamMemberDetail` and `getMemberAssignmentsGroupedByProject` identically; completing a task reduces workload while the task still appears in Assignments (now marked Done); and `resetTaskOverrides` returns Team to fixture-derived values. No Team-specific cached workload exists anywhere.

**No feature creep:** no HR profile cards, org chart, skills matrix, time off, payroll, recruiting, reviews, utilization forecasting, or capacity editing (D-047 — kept read-only, nothing in this phase's requirements needed it).

**Tests:** `team.test.ts` (10 tests — all-members coverage, default sort ordering invariant across all 8 real fixture members, name sort, query/band filtering, detail resolution + unknown-id `undefined`, project-grouping totals/ordering/fallback-subset correctness, contributor ordering/limit/hours-sum-equals-total) and `team.integration.test.ts` (4 tests, described above).

**Verified:** `tsc --noEmit` and `eslint` clean (after removing stale duplicate `.next/types/*  2.ts` files — a macOS/iCloud Desktop-sync artifact from two Next.js processes writing concurrently earlier in the session, not a Team code issue). Full test suite 111/111 (14 new, zero regressions). `npm run validate:data` clean. Whole-app route smoke check all 200. Playwright: list, an Overloaded member's detail, an Available member's detail, the Task Detail panel opening over Team Member Detail, the not-found route, and Dashboard→Team Member Detail navigation — all zero console/page errors. Desktop light/dark/RTL, tablet, and mobile (390px, no horizontal overflow) all verified; mobile correctly prioritizes state → reason → actionable assignments top to bottom, matching Phase 12 §18's requirement. One visual issue (D-046's duplicate workload percentage) found and fixed before completion.

**Known limitation (carried over from Phase 11, re-verified, not resolved):** `next build` still fails with the identical `fonts.googleapis.com` connection-timeout error (re-confirmed via direct `curl`: that host times out while `api.github.com`/`registry.npmjs.org` return 200) — this environment still has no network route to it. Not a Team regression; `tsc`, `eslint`, the full test suite, and a live Turbopack dev server serving every route with zero console errors are the evidence of correctness in its place, exactly as documented for Phase 11. No change was made to the font architecture to work around this.

## 29. Phase 13 — AI Assistant (IMPLEMENTED)

The complete V1 AI Assistant experience, built on the existing Phase 5 global side-panel architecture — no new route, no real LLM/API.

**No new route, reused panel architecture:** the AI Assistant opens via the existing Topbar trigger and `SidePanel` (Phase 5) — docked on desktop/tablet, full-screen sheet on mobile, mutually exclusive with Notifications (D-014), underlying page context preserved. `AppShell.tsx`'s placeholder AI panel content was replaced with the real `AIPanelContent`.

**Finite deterministic intent system (D-048):** `domain/ai/intents.ts` defines exactly 9 supported intents and matches free text against a fixed keyword table — never unrestricted natural-language understanding. Unmatched input returns the exact honest fallback sentence ("I can currently help with project risk, overdue tasks, client follow-up, workload, and weekly summaries."), never a guessed or fabricated answer. Entity name resolution (D-049) matches a project's/member's full name or any individual name word by whole-word match — found and fixed a real bug where "why is Sana overloaded?" (first name only) fell through to the unscoped answer.

**One data source, zero new business logic:** `executeIntent.ts` and the 4 detail builders (`projectSummary.ts`/`projectRiskExplanation.ts`/`workloadExplanation.ts`/`weeklyReport.ts`) are pure orchestration over existing selectors — `getDailyBriefItems` (Phase 7, reused directly, proven byte-identical to the Dashboard's own Daily Brief by `executeIntent.test.ts`), `getOverdueTasksSorted`/`getAtRiskProjectsSorted`/`getClientsNeedingFollowUpSorted`/`getTeamWorkloadSnapshot` (Phase 7), `getProjectRisk`/`getProjectTaskSummary`/`getProjectAssignedMembers`/`getProjectActivity` (Phase 8), `getTeamMemberDetail`/`getMemberWorkloadContributors` (Phase 12). Risk explanations use `computeProjectRisk`'s exact conditions via `RISK_CONDITION_LABELS` — never paraphrased.

**Structured, linked answers:** every answer is an already-shaped `AIAnswer` (list rows or a detail object) rendered by dumb components (`AIResultList` + 4 detail cards) — nothing in `components/ai/` computes business state. Every row/card links to the real record (`/projects/:id`, `/tasks/:id`, `/clients/:id`, `/team/:id`). The workload explanation card (`AIWorkloadExplanationCard`) literally reuses Team Member Detail's own `MemberWorkloadExplanation` component (Phase 12) — the AI's answer and the Team page can never disagree because they're the same component.

**Contextual entry points (Phase 13 §12):** Project Detail gained "Summarize"/"Explain risk" buttons (`ProjectAIActions`); Team Member Detail gained "Explain workload" (`TeamMemberAIActions`). Both open the one global AI panel pre-scoped via a new `aiPendingRequest` on `panel-context.tsx`, consumed once (a `useRef` guard prevents React Strict Mode's dev-only double-invoke from double-appending the answer — found and fixed during visual verification). Client Detail intentionally got no contextual AI button, per the brief's explicit "Draft/update assistance remains P1."

**Conversation state (D-048):** plain `useState` inside `AIPanelContent` — a lightweight, current-session-only history that resets on reload. Nothing uses the `AIConversation`/`AIMessage` entities or the D-039 demo-state layer; V1 doesn't need chat history to survive a reload.

**Honest demo disclosure (Phase 13 §14):** one line at the top of the panel — "Demo AI — powered by workspace rules, not a live model." — not repeated elsewhere.

**No composing delay (D-050):** answers render as soon as the Server Action resolves; the brief explicitly discouraged faking latency for a deterministic V1.

**Mutable-state integration, proven:** `ai.integration.test.ts` — reassigning a task changes both members' workload answers; completing overdue tasks clears a project's risk explanation; resolving a blocker shrinks the risk explanation's linked blocked-tasks list; adding a client interaction removes that client from the follow-up answer; resetting overrides returns every answer to fixture-derived values.

**No feature creep:** no real AI API, no autonomous actions, no email/Slack/calendar actions, no vector search, no AI-driven project/task creation, no multi-chat history manager.

**Tests:** `intents.test.ts` (13), `executeIntent.test.ts` (13, including the Daily Brief/Dashboard consistency proof), `ai.integration.test.ts` (5) — 31 new tests.

**Verified:** `tsc --noEmit` and `eslint` clean. Full test suite 142/142 (31 new, zero regressions). `npm run validate:data` clean. Whole-app route smoke check all 200. **`next build` passed** — run twice, including once from a fully clean `.next`, both successful (D-051: the Phase 11/12 `fonts.googleapis.com` network gap has resolved on its own; no font-architecture change was made). Playwright: landing state, all 5 quick actions, free-text queries (supported and unsupported), both contextual entry points, multi-turn conversation, "Clear conversation," desktop light/dark/RTL, tablet, mobile (full-screen sheet, no horizontal overflow), `prefers-reduced-motion: reduce`, and AI/Notifications mutual exclusivity — all zero console errors. One real bug found and fixed during verification (the Strict-Mode double-append above); the entity name-matching bug (D-049) was caught by the test suite before visual verification even started.

**Known limitations:** none carried forward — the build gap from Phases 11-12 is resolved.

## 30. Phase 13.5 — Public Landing Page (IMPLEMENTED)

The public marketing experience — `/` is now a premium Landing Page, structurally separate from the authenticated app shell under `(app)`.

**Route/layout architecture (D-052):** `src/app/page.tsx` (previously `redirect("/dashboard")`) renders the Landing Page using only the root layout's existing theme/locale/font/skip-link setup — no `AppShell`, no sidebar/topbar. Every `(app)` route is unchanged. CTAs are the one entry point into the real demo (`/dashboard`).

**Sections (Phase 13.5 §3):** `MarketingNav`, `Hero` + `HeroProductPreview`, `DashboardShowcase` (the fuller At-Risk/Overdue proof section), then 7 feature showcases via a shared `ShowcaseLayout` (`AttentionShowcase`, `RiskShowcase`, `KanbanShowcase`, `ClientShowcase`, `TeamShowcase`, `AIShowcase`, `AnalyticsShowcase`), `FinalCTA`, `MarketingFooter`.

**Motion system (D-053):** `motion` (`^14.0.0`) — scroll-reveal (`RevealOnScroll`, `StaggerGroup`/`StaggerItem`) and the Hero's scroll-driven tilt. The nav's scroll-triggered background uses a plain scroll listener + CSS transition, not Motion, since a single threshold needs nothing more.

**Depth/3D (D-054):** a CSS-perspective tilt on the Hero product preview only (`rotateX`/`rotateY` settling flat as the hero scrolls past) — no 3D library, no other section attempts depth.

**Truthful previews (D-055):** every showcase reads the SAME domain selectors and renders the SAME primitive components the authenticated app uses, against the CURRENT demo workspace's real data — not a separate marketing fixture set. `AttentionShowcase` renders the real `DailyBrief` component unmodified. Two documented, narrow exceptions: the Hero's glance-tiles use plain `Badge` chips instead of the full `RiskBadge`/`WorkloadBadge` (D-056), and `AnalyticsShowcase`'s workload bars are a small CSS-only visualization rather than importing the Recharts-based `WorkloadDistributionChart`, keeping Recharts out of the public bundle entirely.

**Reduced motion:** every motion primitive checks `useReducedMotion` (the same hook Phase 11 built) and renders final-state content immediately with no transform, verified by a full-page reduced-motion screenshot showing complete, correctly laid-out content.

**Responsive:** mobile prioritizes headline/CTA, the Kanban preview scrolls horizontally within its own contained box (not the page), no horizontal page overflow anywhere (verified via `document.documentElement.scrollWidth`).

**RTL:** verified live — nav, hero, CTAs, mini-cards, showcase copy/visual order, and the Kanban/follow-up/workload rows all mirror correctly with no hardcoded left/right; English product terms inside RTL truncate from their logical end per standard browser behavior, consistent with the rest of the app.

**Real bugs found and fixed (D-056):** a `ConditionsDisclosure` button-shrinking bug (`shrink-0` added, a corrective fix to the shared primitive with no effect on any existing wider usage), a `RiskBadge`-in-a-180px-tile overflow (the Hero's two glance-tiles simplified to plain badges instead), and a CSS Grid width-blowout causing real mobile horizontal scroll (`min-w-0` added to 3 grid layouts' direct children).

**Performance:** transform/opacity-only animation throughout; no images; no Recharts on `/`; `/` prerenders statically (`next build` confirms `○` for `/`); zero console/page errors across every verification pass.

**No feature creep:** no pricing/checkout, no CMS/blog, no fake testimonials/logos/stats, no production signup backend, no new AI features, no 3D game-like scene, no video pipeline.

**Verified:** `tsc --noEmit`, `eslint` clean. Full existing test suite 142/142 (no new tests needed — no new business logic was added, only presentation). `npm run validate:data` clean. `next build` passes, `/` statically prerendered. Whole-app route smoke check all 200 (`/`, `/dashboard`, `/projects`, `/tasks`, `/clients`, `/team`, `/analytics`, `/settings`, `/login`). CTA-to-demo navigation confirmed end-to-end. Playwright visual verification: full scroll sweep desktop light/dark, full RTL sweep (hero + scrolled sections), mobile (hero, mobile nav menu, no overflow), tablet, and a complete reduced-motion pass — zero console errors throughout.

**Known limitations:** none.

## 31. Phase 13.6 — Visual Graphics & Landing Page Polish (IMPLEMENTED)

A focused visual-polish pass on the public Landing Page only — no business logic, data model, or application-shell change.

**Visual audit findings:** before editing, the page was reviewed section by section. Weaknesses identified: the Hero's product preview was a single flat card with no layered depth; all 7 feature showcases used the identical two-column layout with plain dot bullets, reading as one component repeated rather than an authored sequence; no background rhythm distinguished one section from the next; the AI section stated "structured intelligence" only in copy, with nothing visual to back it up; icons were almost entirely absent outside the nav/AI disclosure line.

**Graphic layer (D-057):** 5 small, centralized, dependency-free components — `IconFrame` (the one icon-in-frame treatment), `DotGrid` (static SVG dot-pattern background), `FlowDiagram` (the AI section's 3-node composition), plus icon props added to `ShowcaseLayout` and `PreviewCard`. No new npm package.

**Iconography:** every showcase's eyebrow and bullet list now carries a semantically chosen Lucide icon in a restrained `IconFrame` (e.g. `AlertTriangle`/`Clock`/`Users`/`Gauge` for Daily Brief; `ShieldAlert`/`ListChecks` for Risk; `Ban`/`MousePointer2`/`Link2` for Kanban) — never a generic sparkle used as decoration, never a giant colorful icon.

**Transparency:** restrained to two places — the Hero's backdrop fragment (a lower-opacity second card behind the main one) and the floating signal chip. Every dense product-data surface (list rows, badges, the Kanban board) stays fully solid.

**Depth/3D (D-058):** the Hero preview gained a layered backdrop fragment and a floating "N need attention" chip, both rendered as siblings of the main card (a child would be clipped by the card's own `overflow-hidden`) — still CSS-perspective/transform only, no 3D library.

**Section differentiation:** alternating `canvas`/`surface` background tone across the 7 showcases (with `DotGrid` only on `surface` sections, at low opacity) plus the icon treatment above gives each section a distinct rhythm without seven different layouts.

**AI visual treatment:** `FlowDiagram` renders "Workspace data → FlowPilot AI → Structured action" as three icon nodes connected by arrows, directly above the existing quick-actions/result preview — making Phase 13.6 §9's suggested composition literal, with no chatbot/orb/purple-magic styling anywhere.

**RTL (D-059):** `FlowDiagram` is a directional relationship, so it mirrors — node order reverses with the page direction and the connector arrow is flipped (`rtl:-scale-x-100`); found and fixed a real mismatch where the arrow kept pointing the wrong way after the node order reversed. `IconFrame`/`DotGrid` are pure decoration and intentionally do not mirror.

**Reduced motion:** every new element is either genuinely static (backdrop fragment's rotation, signal chip) or respects the existing `useReducedMotion` hook; a full-page reduced-motion screenshot confirms the complete page renders correctly with no animation.

**Performance:** no new dependency, no images, `DotGrid`/`FlowDiagram`/`IconFrame` are plain SVG/CSS with zero runtime cost beyond initial render.

**No feature creep, no business-logic change:** confirmed — only `components/marketing/*` and 2 small `PreviewCard`/`ShowcaseLayout` prop additions touched; `domain/`, `app/(app)/`, and every authenticated route are untouched.

**Verified:** `tsc --noEmit`, `eslint` clean. Full existing test suite 142/142 (no new tests — no new business logic). `npm run validate:data` clean. Whole-app route smoke check all 200 against a live dev server. Playwright visual verification: full scroll sweep desktop light/dark, RTL (hero + a surface-tone section + the AI flow diagram, confirming the arrow-mirroring fix), mobile (no horizontal overflow, flow diagram still legible at 390px), tablet, and a complete reduced-motion pass — zero console errors throughout.

**Known limitation:** `next build` could not be re-confirmed this phase — the `fonts.googleapis.com` network gap (resolved in Phase 13, D-051) recurred intermittently and was still failing at the end of this phase (D-060). Not a Phase 13.6 code issue; `tsc`/`eslint`/tests/data-validation/route-smoke-tests/visual-verification all passed cleanly against the same code. Re-run `next build` when network access to that host is available again.

## 32. Phase 14 — Auth / Settings / Billing Demo (IMPLEMENTED)

A V1 demo-entry experience and complete Settings/Billing area, completing the navigable loop: Landing Page → Login / Demo Entry → App → Settings → Logout → Landing Page. No production auth, payment processing, or real backend was added — see D-061/D-062/D-063.

**Login (`/login`):** a standalone page outside the `(app)` shell — no sidebar/topbar. One primary action, "Continue to Demo", honestly labeled as demo-only (no credentials collected, nothing validated against a real backend). Composition (centered minimal card, single strong CTA, concise copy, the existing `DotGrid` background motif reused from Phase 13.6) follows general SaaS sign-in principles gathered via the required external visual research — not a copy of any specific site (D-064).

**Demo session (D-061):** `lib/demoSession.ts` establishes a single `httpOnly`/`sameSite=lax` presence cookie (`fp_demo_session`, 7-day maxAge) — not an encrypted/signed JWT session, since every visitor shares one demo workspace and there is no real secret behind the cookie. `src/proxy.ts` (Next.js 16's renamed middleware convention) performs the Next.js-documented "optimistic check" (cookie presence only) to protect `/dashboard`, `/projects`, `/tasks`, `/clients`, `/team`, `/analytics`, and `/settings`; `/` and `/login` stay public. `lib/protectedRoutes.ts` is the single shared source of truth for the protected-prefix list and for `sanitizeRedirectTarget()`, which allow-lists only known internal protected paths for the post-login redirect (rejecting external URLs and `//`-prefixed protocol-relative targets) — preventing open redirects.

**Login/logout flow:** an unauthenticated visit to a protected route redirects to `/login?redirect=<path>`; signing in establishes the session and redirects to the sanitized target (defaulting to `/dashboard`). The account menu's "Log out" (a Server Action, `signOutOfDemoAction`) clears the cookie and returns to `/`; a subsequent visit to any protected route redirects back to `/login` again.

**Landing Page CTA integration:** every "Open Demo"/"Open FlowPilot Demo" CTA (`Hero`, `FinalCTA`, `MarketingNav`, `MarketingFooter`) now routes to `/login` rather than directly to `/dashboard` — the demo entry flow can no longer be bypassed from marketing surfaces.

**Settings IA:** `/settings` gained a persistent header + route-backed tabs shell (`SettingsTabs.tsx`, the same pattern as Project/Client Detail), with 5 sections: Profile, Workspace, Appearance, Notifications, Billing.

**Profile settings (D-062):** `displayName`/`email` are editable via a plain native controlled form (`ProfileSettingsForm.tsx`, consistent with D-041's "no form library for 2 fields" precedent), saved through `domain/settingsMutations.ts#updateProfile`. `jobTitle` is shown read-only, sourced from the linked `TeamMember` — deliberately not editable here, to avoid reopening D-047's Team-is-read-only-in-V1 boundary through a back door.

**Workspace settings:** read-only display of workspace name, creation date, and a real size summary (team/client/project counts) — nothing in the product needs a renameable workspace yet, so no mutation surface was added for it.

**Appearance settings:** a direct `useTheme()` consumer (`AppearanceSettingsForm.tsx`) — Light/Dark/System, no second theme state. Locale/RTL toggle is not exposed: `getLocale()` has no setter yet (V1 is English-only), so there is no real toggle to surface.

**Notification settings:** 4 demo preference toggles (overdue task alerts, project risk alerts, client follow-up reminders, workload alerts) via native checkboxes, consistent with the project's existing "plain native control over a new UI-kit primitive" precedent. Honestly labeled as preferences only — nothing in the product currently sends a real email/push/Slack notification.

**Billing demo (D-063):** `/settings/billing` is presentation-only — a plan label ("Demo / Pro Preview"), a static included-capabilities list, a real workspace-usage summary pulled from `getDemoDataset()`, and a `disabled` "Manage billing" button with honest adjacent copy ("Billing is disabled in demo — no payment method or invoices exist."). No Stripe, checkout, card fields, or fake invoices anywhere.

**State/persistence (D-062):** both Profile overrides and Notification preferences extend D-039's existing server-side, in-memory, process-lifetime overrides pattern (`domain/settingsMutations.ts`) — no localStorage, no second persistence architecture. `resetDemoDataAction` (`lib/taskActions.ts`) now also calls `resetSettingsOverrides()`, so the one existing "Reset demo data" action clears Profile edits and Notification preferences alongside task/client overrides.

**Account menu:** a compact `Popover`-based menu (`components/shell/AccountMenu.tsx`, reusing the existing primitive rather than adding a new dropdown-menu/avatar dependency) in the Topbar — name/email, a "Profile & settings" link, and "Log out". No account-management features, no upsells.

**Security honesty:** no claim of real authentication, encryption, or account isolation is made anywhere — copy consistently says "Demo workspace"/"Demo session"/"no real account, password, or data leaves this workspace."

**No feature creep:** no production auth (Supabase/Auth0/Clerk/Firebase/NextAuth/OAuth), no payment processor, no real invoices, no org invites/SSO/MFA/audit logs/password reset/production RBAC. Zero new npm dependencies.

**Verified:** `tsc --noEmit`, `eslint` clean. Full test suite 158/158 (16 new: `lib/protectedRoutes.test.ts` covering `isProtectedPath`/`sanitizeRedirectTarget` including the open-redirect guard; `domain/settingsMutations.test.ts` covering profile edits, validation, notification preferences, and reset). `npm run validate:data` clean. Whole-app route smoke check: public `/` and `/login` → 200; all 7 protected routes → 307 redirect to `/login?redirect=<path>` without a session cookie, and resolve normally with one present. Playwright visual verification: Login desktop/mobile, light/dark, RTL (logo/copy mirror correctly, trailing punctuation flips per bidi rules); all 5 Settings tabs; the account menu open state; the complete Landing→Login→Dashboard→Settings→Logout→Landing flow confirming the session clears and protected routes re-redirect after logout — zero console errors under correctly-sequenced (waited) navigation. A hydration-mismatch warning (`caret-color` style attribute) was observed only when a test script fired consecutive `page.goto()` calls across Settings tabs without waiting for each page to settle; isolated repro scripts with proper `waitForLoadState` calls across the identical 5-page sequence produced zero errors, confirming this was a test-navigation-speed artifact, not an application defect.

**Known limitation:** `next build` could not be re-confirmed this phase — the same `fonts.googleapis.com` network gap documented since Phase 11 (D-060) was still failing at the end of this phase; re-confirmed via direct `curl` (connection timeout, `http_code=000`) that only this host is unreachable. Not a Phase 14 code issue — every other validation passed cleanly against a live dev server running the same code. Re-run `next build` when network access to that host is available again.

## 33. Phase 15 — Arabic / RTL QA (IMPLEMENTED)

A correction-only RTL/localization audit across the entire product — no new product features, per the phase's explicit "QA and correction only" scope.

**Locale architecture review:** `lib/locale.ts`'s single `getLocale()` seam (unchanged since Phase 2/D-017) was reviewed and confirmed still sufficient — one function, no duplicated direction logic anywhere, `src/app/layout.tsx` is the one place `dir`/`lang` are set on `<html>`. No new i18n system was built (the brief explicitly forbade one unless the existing architecture were fundamentally insufficient — it is not). D-065 documents, for the first time explicitly, that every RTL verification in this and all prior phases (Phase 5 onward) has been performed by injecting `dir="rtl"` via devtools/Playwright after page load, since `getLocale()` has no real runtime toggle — the architecture is RTL-*ready*, V1 content is English-only (consistent with D-026).

**Global directional-CSS audit (§21 of the brief):** a full-codebase grep for `ml-`/`mr-`/`pl-`/`pr-`/`left-`/`right-`/`border-l`/`border-r`/`translate-x`/`rotate`/`ChevronLeft`/`ChevronRight`/`ArrowLeft`/`ArrowRight` found every match already correctly classified: Radix Popover/Tooltip `data-[side=left/right]` attributes are the primitives' own auto-computed overflow-avoidance positioning (not direction-dependent); `sheet.tsx`'s physical `side` prop is already resolved from `dir` once, in `SidePanel.tsx` (D-017/D-032, unchanged); `dialog.tsx`'s centering transform already has an `rtl:translate-x-1/2` flip; `FlowDiagram`'s connector arrow already mirrors per D-059. Every `inset-x-0` match is symmetric (non-directional). Zero new logical-property replacements were needed anywhere outside Settings.

**Per-module findings:** Landing Page, Login, App Shell (sidebar/topbar/account menu/AI panel/Notifications panel/mobile nav), Dashboard (all 6 sections), Projects (list/detail/tabs), Tasks/Kanban (list, board — 5-column order and horizontal-scroll-with-partial-clip both re-verified via DOM bounding-rect inspection, not just screenshots, and mirror correctly; D-038's column model untouched), Clients (list/detail/interactions/add-interaction form, email bidi isolation intact), Team (list/detail, including the wide `justify-between` workload-contributor rows — confirmed correctly row-paired via bounding-rect inspection after an initial screenshot misread), Analytics (D-044's forced-LTR chart-internals exception re-verified and reaffirmed, not revisited), and AI Assistant (panel direction, quick actions, input/button order) all passed with no real defects found.

**D-066 — 2 real bugs found and fixed, both in Phase 14's Settings additions:**
1. Workspace and Billing settings each had a `{count} label · {count} label · {count} label` stat line (e.g. "8 team members · 15 clients · 19 projects") whose *leading number* the Unicode Bidi Algorithm relocated to the visual end of the line under RTL — genuinely scrambled, not merely mirrored. Fixed with `dir="ltr"` + `[unicode-bidi:isolate]`, reusing the exact technical-value-isolation pattern already established for email fields (D-015-era) rather than inventing a new one.
2. The Billing capability list used a literal `"· "` text-prefix per list item instead of a native marker — the one list in the whole app not using `list-disc` (confirmed by grep against `ConditionsDisclosure`/`ProjectOverview`/`AIProjectRiskExplanationCard`/`AIWeeklyReportCard`/`AnalyticsInsights`/`RiskShowcase`, which all already do). A bare neutral character at a text node's start is exactly the bidi edge case that breaks; fixed by switching to `list-disc`/logical `ps-4` padding to match every other list.

Both are distinguished from the already-accepted, linguistically-correct "trailing sentence punctuation flips to the start under a forced-RTL English sentence" behavior (e.g. a period or "?" moving to the front — expected Unicode bidi behavior for prose, already seen and accepted in Phase 14's Login copy, not a bug) — these were different in kind: a count displacing past unrelated later counts, and a list marker detaching from its item.

**Mobile RTL:** Landing, Login, Dashboard, the "More" bottom sheet (plain flex row, no hardcoded direction — reviewed at the source level, confirmed sound), Kanban (board scroll direction re-verified), Clients, Team, Settings, and the AI panel were all swept at 390×844 with no RTL-specific defects beyond the 2 already listed (which reproduced identically at both breakpoints and are fixed site-wide, not per-breakpoint).

**Accessibility in RTL:** keyboard order, focus movement, and semantic DOM order were not altered by either fix (both were presentational CSS/markup changes with no DOM-order implications); no component was reordered purely for visual RTL effect anywhere in this phase.

**Typography / Arabic font (D-067):** no Arabic typeface was introduced, and no silent fallback change was made to `Inter`. There is currently no Arabic copy anywhere in the product to evaluate for line-height, density, or fallback-rendering quality — D-026's open Arabic-typeface decision remains explicitly deferred to a future phase that actually scopes real Arabic content, not resolved or worked around here.

**Translation quality:** not applicable — V1 has no Arabic strings implemented anywhere (confirmed via D-065); this is stated honestly rather than treated as a gap to silently fill, per the brief's explicit instruction not to invent a translation project.

**A non-RTL finding, explicitly out of scope:** a `dnd-kit`/React-Strict-Mode dev-mode hydration console warning (`aria-describedby="DndDescribedBy-N"` mismatch on Kanban drag handles) was investigated and conclusively isolated as unrelated to RTL — it reproduces identically on a single fresh page load in plain English/LTR with zero `dir` manipulation (a pre-existing dnd-kit SSR/Strict-Mode interaction dating to Phase 9's original Kanban build, dev-mode-only). Documented here for completeness; not fixed, as it is outside this phase's RTL/localization scope.

**No feature creep:** no translation CMS, no language backend, no locale-persistence backend, no new product features, no Arabic marketing campaign, no new design system. `getLocale()` was not modified.

**Tests:** no new automated tests were added. Both fixes are bidi/CSS rendering behavior, which `node --test`'s non-rendering environment cannot meaningfully exercise (a unit test would only assert the JSX contains `dir="ltr"`/`list-disc`, which doesn't actually prove the bidi algorithm resolves correctly) — consistent with the brief's "keep tests meaningful" instruction, regression coverage here is the Playwright RTL sweep itself, not a snapshot.

**Verified:** `tsc --noEmit`, `eslint` clean. Full test suite 158/158, unchanged (no business logic touched). `npm run validate:data` clean. Whole-app route smoke check unchanged (public 200, protected 307→`/login` without a session, 200 with one present). Playwright RTL visual sweep: desktop (Landing — full scroll-reveal + reduced-motion, Login, Dashboard + AI/Notifications panels + account menu, Projects list/detail/tabs, Tasks list/Kanban, Task Detail, Clients list/detail/interactions, Team list/detail, Analytics, all 5 Settings tabs, one dark-mode RTL spot-check), and mobile (Landing, Login, Dashboard, the More sheet, Kanban, Clients, Team, Settings, AI panel) — zero RTL-caused console errors.

**Known limitation:** `next build` could not be re-confirmed this phase — the same `fonts.googleapis.com` network gap documented since Phase 11 (D-060) was still failing; re-confirmed via `curl` (connection timeout, `http_code=000`). Not a Phase 15 code issue.

## 34. Phase 16 — Responsive QA (IMPLEMENTED)

A correction-only responsive audit across the entire product — no new product features, per the phase's explicit "responsive QA and correction only" scope.

**Breakpoint matrix / methodology:** rather than relying on screenshot-reading alone, the primary audit tool was a DOM-based overflow sweep — `document.documentElement.scrollWidth` vs `clientWidth` (and `document.body.scrollWidth`) checked programmatically, not visually — across 23 routes (both public routes, all 7 protected routes plus their detail/tab sub-routes, Kanban view, a direct task deep-link) × 14 viewports: mobile 320/375/390/430, tablet 768/834/1024, laptop 1280/1366, desktop 1440/1600, plus 3 short-height stress combinations (390×667, 768×700, 1280×720) — 322 route×viewport combinations total. Result: **zero page-level horizontal overflow** found anywhere, before or after this phase's fixes — the responsive foundation built up across Phases 5-13.6 (including D-056's earlier `min-w-0` grid-blowout fixes) held up cleanly under a much wider, more systematic sweep than any single prior phase ran.

**D-068 — a real, product-wide, Phase-5-era bug found and fixed:** `SidePanel.tsx` (AI Assistant + Notifications), `TaskDetailPanel.tsx`, and `MarketingNav.tsx`'s mobile hamburger menu all passed a plain `className="w-full sm:max-w-*"` to the shared `SheetContent` primitive, intending full-screen-on-mobile / bounded-width-on-desktop. This never actually worked below the `sm` (640px) breakpoint: `sheet.tsx`'s own base classes unconditionally include `data-[side=left]:w-3/4 data-[side=right]:w-3/4`, and a Radix `data-*` attribute selector carries higher CSS specificity than a plain utility class — so the primitive's `w-3/4` silently won on every phone-sized screen, with the real page visible and interactive behind a dim overlay to one side. Confirmed empirically via `getBoundingClientRect()`: panel width measured exactly 75% of viewport at 320px/390px (240px and 293px respectively), only reaching the intended `max-w-sm`/`max-w-lg`/`max-w-xs` once `sm:` also kicked in with matching `data-[side=...]` variants. All 3 consumers fixed by rewriting the override in the same `data-[side=left]:w-full data-[side=right]:w-full sm:data-[side=left]:max-w-* sm:data-[side=right]:max-w-*` syntax — equal specificity to the primitive's own classes, so the override now actually applies. Verified fixed at 320/390 (full width), unchanged-correct at 768/1280 (bounded width), and holding under RTL+mobile+dark simultaneously.

**D-069 — Kanban card title touch target:** measured 20px tall (bare line-height, zero padding) — well under the project's own ~44px guideline (D-031) on a dense, frequently-tapped mobile surface. Fixed with `py-3 -my-3` (the padding expands the clickable hit area to 44px; the equal negative margin cancels the padding's effect on the card's visible layout, so density is pixel-identical before/after). The drag handle (26px) and List/Kanban toggle (36px) were found slightly under 44px too but left unchanged — both clear WCAG AA's 24px minimum, and per D-038/Phase 9 §17 the drag handle is explicitly an accelerator on top of the always-present, correctly-sized `StatusSelect`, never the only way to move a card.

**Overlay/panel bounds:** account menu and AI/Notifications panel bounds checked via `getBoundingClientRect()` against 5 real viewports including short heights (390×667, 768×700, 1280×720) — none render outside viewport bounds at any tested size.

**Touch-target sweep:** Dashboard, Kanban, Settings/Notifications, Landing, and the mobile More sheet were scanned at 390px width for any interactive element under 40px in either dimension. Besides the two D-069 items, found: Settings/Notifications' native checkboxes (20×20px — acceptable, their full `<li>` row is the actual tap target, consistent with how every other checkbox/toggle row in the app is built), the Landing Page mobile-nav hamburger (32×32px), and the Sheet primitive's shared close button (28×28px, used by every sheet in the app). The latter two are single-instance icon buttons that already clear WCAG AA (24px minimum) — judged acceptable secondary controls, not architectural defects worth a shared-primitive-wide change.

**Text stress test:** long synthetic strings (~100 chars) were injected via DOM manipulation (never into fixture files) into Dashboard labels, a Kanban card title, and Client Detail's heading at 375px width. Result: the Kanban card wraps the long title across multiple lines with the card growing naturally (no truncation, no overflow, drag handle stays correctly anchored top-right regardless of title length); Client Detail's heading likewise wraps without overflow; the Topbar's page-title `<h1>` (which has `truncate`) correctly ellipsizes. Zero document-level overflow in any case.

**Module-by-module:** Landing Page (full scroll-reveal sweep + reduced-motion, mobile), App Shell (sidebar/topbar/account menu/AI+Notifications panels/mobile nav/More sheet), Dashboard (all 6 sections), Projects, Tasks/Kanban (list, board — 5-column order and horizontal-scroll-with-partial-clip explicitly re-confirmed untouched, D-038 preserved), Clients, Team, Analytics (D-044's forced-LTR chart-internals exception reaffirmed, not revisited), AI Assistant, Login, and Settings (all 5 tabs) were all covered by the overflow sweep and/or targeted screenshot review — no additional defects found beyond D-068/D-069.

**RTL responsive / dark mode / reduced motion:** combo-checked rather than treated as separate passes — the AI panel was verified full-width under RTL+mobile+dark simultaneously (proving the D-068 fix isn't breakpoint- or theme-fragile), and the Landing Page was verified overflow-free at mobile width with reduced motion enabled and a full programmatic scroll-through (proving Phase 13.5/13.6's scroll-reveal content isn't layout-dependent on the animation itself).

**Console/hydration:** the same `dnd-kit`/React-Strict-Mode dev-mode hydration warning already isolated and documented as unrelated to RTL in Phase 15 (D-066's investigation) reproduced again during this sweep — reconfirmed as a pre-existing, dev-mode-only, Phase-9-era artifact, not a Phase 16 regression, not fixed (out of this phase's scope).

**No feature creep:** no new product features, data entities, AI intents, auth flows, marketing sections, or design system. Both fixes are CSS-specificity/layout corrections to existing components.

**Tests:** no new automated tests added. Both fixes are CSS-specificity/layout behavior that the project's `node --test` non-rendering unit-test environment cannot meaningfully assert on, and the repository has no committed Playwright test harness (`playwright.config`, `*.spec.ts`) to extend — adding one solely to cover 2 bug fixes would itself be new test infrastructure, out of scope for a correction-only phase. Regression coverage is the documented manual/scripted verification in D-068/D-069 and this section.

**Verified:** `tsc --noEmit`, `eslint` clean. Full test suite 158/158, unchanged (no business logic touched). `npm run validate:data` clean. Whole-app route smoke check unchanged (public 200, protected 307→`/login` without a session, 200 with one present). DOM-based overflow sweep: 322 route×viewport combinations, zero overflow. Overlay-bounds and touch-target checks as described above.

**Known limitation:** `next build` could not be re-confirmed this phase — the same `fonts.googleapis.com` network gap documented since Phase 11 (D-060) was still failing; re-confirmed via `curl` (connection timeout, `http_code=000`). Not a Phase 16 code issue.

## 25. Phase Roadmap (corrected — see DECISIONS.md D-024)

- **Phase 1 — Product Definition & V1 Scope:** ✅ Approved, all open items resolved.
- **Phase 2 — Information Architecture:** ✅ APPROVED / COMPLETE 2026-10-04.
- **Phase 3 — Data Model:** ✅ APPROVED / COMPLETE 2026-10-04.
- **Phase 4 — Design System:** ✅ APPROVED / COMPLETE 2026-10-04 (tokens were a starting palette pending real contrast testing — partially verified, see §20/D-035).
- **Phase 5 — Shared Application Shell:** ✅ IMPLEMENTED 2026-10-04 (see §16). No business features, no fixtures.
- **Phase 6 — Mock Data Foundation:** ✅ IMPLEMENTED 2026-10-04 (see §18). No business UI.
- **Phase 7 — Dashboard:** ✅ IMPLEMENTED 2026-10-04 (see §20).
- **Phase 8 — Projects:** ✅ IMPLEMENTED 2026-10-04 (see §22).
- **Phase 9 — Tasks / Kanban:** ✅ IMPLEMENTED 2026-10-04 (see §24).
- **Phase 10 — Clients / CRM:** ✅ IMPLEMENTED 2026-10-04 (see §26).
- **Phase 11 — Analytics:** ✅ IMPLEMENTED 2026-10-04 (see §27).
- **Phase 12 — Team:** ✅ IMPLEMENTED 2026-10-04 (see §28).
- **Phase 13 — AI Assistant:** ✅ IMPLEMENTED 2026-10-05 (see §29; `next build` network gap from Phases 11-12 now resolved, D-051).
- **Phase 13.5 — Public Landing Page:** ✅ IMPLEMENTED 2026-10-05 (see §30).
- **Phase 13.6 — Visual Graphics & Landing Page Polish:** ✅ IMPLEMENTED 2026-10-05 (see §31; `next build` gap recurred intermittently, D-060 — not re-confirmed this phase).
- **Phase 14 — Auth / Settings / Billing Demo:** ✅ IMPLEMENTED 2026-10-05 (see §32; `next build` gap unchanged from D-060 — not re-confirmed this phase).
- **Phase 15 — Arabic / RTL QA:** ✅ IMPLEMENTED 2026-10-05 (see §33; `next build` gap unchanged from D-060 — not re-confirmed this phase).
- **Phase 16 — Responsive QA:** ✅ IMPLEMENTED 2026-10-05 (see §34; `next build` gap unchanged from D-060 — not re-confirmed this phase).
- **Phase 17+ — TBD**, not yet proposed.
