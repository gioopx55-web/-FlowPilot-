# FlowPilot AI — Project Plan

> Read `PROJECT_CONSTITUTION.md` first. This file tracks personas, workflows, V1 scope, exclusions, AI scope, demo content, and success criteria as approved in Phase 1. Treat this as the working spec future sessions build against.

**Status:** Phase 1 (Product Definition & V1 Scope) approved, final decisions locked. Phase 2 (Information Architecture) approved, final decisions locked. Phase 3 (Data Model) approved, final decisions locked. Phase 4 (Design System) approved, final decisions locked. Phase 5 (Shared Application Shell) implemented.
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

## 17. Phase Roadmap (corrected — see DECISIONS.md D-024)

- **Phase 1 — Product Definition & V1 Scope:** ✅ Approved, all open items resolved.
- **Phase 2 — Information Architecture:** ✅ APPROVED / COMPLETE 2026-10-04.
- **Phase 3 — Data Model:** ✅ APPROVED / COMPLETE 2026-10-04.
- **Phase 4 — Design System:** ✅ APPROVED / COMPLETE 2026-10-04 (tokens are a starting palette pending real contrast testing; no fixtures authored).
- **Phase 5 — Shared Application Shell:** ✅ IMPLEMENTED 2026-10-04 (see §16). No business features, no fixtures.
- **Phase 6 — Mock Data Foundation:** not started. Actual Northbound Studio fixture data is built here.
- **Phase 7+ — TBD**, defined only once Phase 6 is approved.
