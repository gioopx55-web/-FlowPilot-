# FlowPilot AI — Project Constitution

> This file is the authoritative, persistent definition of what FlowPilot AI is and how it must be built. Any future Claude Code session MUST read this file before implementing anything. Changes to this file represent architectural/design decisions and must be logged in `DECISIONS.md`.

**Status:** Approved (Phase 1)
**Last updated:** 2026-10-04

---

## 1. Product Definition

FlowPilot AI is an AI-assisted business operations cockpit for small teams, agencies, and freelancers managing multiple clients and projects simultaneously.

It is **not** a generic admin dashboard and **not** a chatbot bolted onto a PM tool. Its job is to collapse the daily "scan everything for problems" ritual into a single prioritized view, and to let the user act on flagged items without leaving the page.

AI is a lens over the existing data model (projects/tasks/clients/team), not a separate feature. In V1 it is deterministic/rule-based logic behind a realistic AI-style UI — this must never be misrepresented as live model inference until it genuinely is one (see Section 7, AI Scope).

### What it should feel like
Calm, dense, confident — an instrument panel, not a filing cabinet. Every screen answers "what here needs me" before "what is here."

## 2. Design Direction

Quality bar (execution quality only, never visual identity or layout copying): **Linear, Attio, Clay, Asana.**

The interface must feel: premium, modern, professional, information-dense without feeling crowded, intentionally designed, suitable for a real B2B SaaS product.

**Explicitly avoid:** generic admin-dashboard templates, excessive gradients, excessive glassmorphism, oversized rounded cards, meaningless animations, generic purple AI styling, decorative charts, excessive whitespace.

## 3. Motion Strategy (future, not yet implemented)

- Subtle, premium, smooth, purposeful, performance-conscious, responsive, accessible.
- Target ~150–300ms for normal UI transitions.
- Always support `prefers-reduced-motion`.
- Do not animate everything — motion must be earned (scroll reveal, section transitions, controlled parallax/depth, dashboard preview motion, AI interaction demos, small micro-interactions).
- Not implemented during planning phase; implemented only when the owning feature is actually built.

## 4. Component / Library Philosophy

- Professional libraries and high-quality existing components are allowed where they genuinely improve the product — never blindly templated, never assembled as a generic kit.
- Customize to FlowPilot AI; maintain one consistent design system.
- Prefer existing project dependencies before adding new ones.
- **Do not install a library until the feature requiring it is actually being implemented.**

Potential stack (approved for future use, not yet installed):
Next.js, TypeScript, Tailwind CSS, shadcn/ui, Lucide, React Hook Form, Zod, TanStack Table, Recharts, dnd-kit, Motion, date-fns, Sonner.

## 5. Accessibility & RTL Strategy (architecture, not cleanup)

- Logical CSS properties (start/end, not left/right) from the first component built — RTL support is a structural decision, not a retrofit.
- Keyboard-navigable core flows, visible focus states, sufficient color contrast; status must never rely on color alone (pair with icon/label).
- `prefers-reduced-motion` respected wherever motion ships.
- Arabic/RTL readiness is required at the architecture level even before full translation lands.

## 6. Responsive Strategy

- Fully usable (not merely non-broken) at tablet width.
- Dashboard and dense tables degrade gracefully at mobile width without becoming unusable.

## 7. Data Consistency Principle

A given piece of status/state lives in exactly one place in the data model. Every view (dashboard, project, task, kanban) reads that one source — no cached/stale duplicates.

## 8. AI Scope Boundary (binding until explicitly changed)

- V1 AI features are deterministic, rule-based logic over mock data, wrapped in a realistic AI-style UI (chat-style input, structured answers, citations back to source records).
- V1 must never present this logic as live model inference.
- A future real AI API implementation (e.g., real LLM call) is a backend swap behind the same UI contract — not a redesign. This boundary may only be moved via a logged decision in `DECISIONS.md`.

## 9. Development Workflow Rules (binding for all future sessions)

Before any major task, a session must:
1. Read `PROJECT_CONSTITUTION.md` (this file).
2. Read `PROJECT_PLAN.md`.
3. Read relevant entries in `DECISIONS.md`.
4. Check `CURRENT_PHASE.md`.
5. Confirm the requested task does not conflict with previously approved decisions.
6. Implement only the approved phase/task — no silent scope expansion.
7. Update documentation only when a decision or project state genuinely changes.

**Never silently replace:** architecture, data model, design direction, RTL strategy, accessibility strategy, responsive strategy, dependency strategy, development workflow.

If a requested change conflicts with an approved architectural decision: **stop and explain the conflict before changing the architecture.** Do not proceed on your own judgment.

## 10. Product Principles

1. Signal before data — every screen leads with "what needs you."
2. Action before decoration — a chart/metric with no implied next action doesn't belong in V1.
3. One source of truth — status lives in one place, every view reads it.
4. AI assists judgment, never replaces the workflow — human still clicks "send/assign/resolve."
5. Honest about what's real — mock AI logic is never presented as live inference; demo data never dressed as real business claims.
6. Accessibility and RTL are architecture, not polish.
7. Density with calm — information-dense is the goal, cluttered is the failure mode.
8. Finish the slice before widening it — scope discipline is itself a design decision.
