"use client";

import * as React from "react";
import { Sparkles, LayoutDashboard, FolderKanban, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { onboardingStore } from "@/lib/onboardingState";

const STEPS = [
  {
    icon: Sparkles,
    title: "Welcome to FlowPilot AI",
    description:
      "A project-management workspace for small agencies — projects, tasks, clients, and team workload in one place.",
  },
  {
    icon: LayoutDashboard,
    title: "See what needs attention",
    description:
      "The Dashboard surfaces at-risk projects, overdue tasks, client follow-ups, and team workload the moment you sign in.",
  },
  {
    icon: FolderKanban,
    title: "Explore Projects, Tasks, and Team",
    description:
      "Browse real demo data across Projects, Tasks/Kanban, Clients, and Team — or ask the AI Assistant a question from any page.",
  },
  {
    icon: Users,
    title: "This is a shared demo workspace",
    description:
      "Every visitor sees the same workspace, and the AI Assistant is deterministic demo logic, not a live model. Changes reset when the server restarts.",
  },
] as const;

/**
 * First-session onboarding (Phase 21.1 §3 — release blocker:
 * "Onboarding is declared P0 but absent"). A 4-step dismissible
 * dialog, not a guided-tour framework or a third-party library — it
 * reuses the existing `Dialog` primitive (Radix, already in the
 * codebase), which already gives this focus trap, Escape-to-close,
 * and RTL-correct positioning for free (same primitive precedent as
 * every other overlay in this app).
 *
 * Shown once per browser (`lib/onboardingState.ts`'s `localStorage`
 * flag, D-096) — never gated on anything security-sensitive. Read via
 * `useSyncExternalStore` directly (the same SSR-safe pattern
 * `Sidebar.tsx`'s collapse state already established — no manual
 * mount-guard `useEffect`, which the project's lint config correctly
 * flags as a setState-in-effect anti-pattern). Because this
 * subscribes to the store, `AccountMenu.tsx`'s "Replay onboarding"
 * action (`onboardingStore.set(false)`) re-opens this dialog
 * immediately, with no page reload needed.
 */
export function OnboardingOverlay() {
  const isComplete = React.useSyncExternalStore(
    onboardingStore.subscribe,
    onboardingStore.getSnapshot,
    onboardingStore.getServerSnapshot,
  );
  const [stepIndex, setStepIndex] = React.useState(0);
  const open = !isComplete;

  function finish() {
    onboardingStore.set(true);
    setStepIndex(0);
  }

  const step = STEPS[stepIndex]!;
  const Icon = step.icon;
  const isLastStep = stepIndex === STEPS.length - 1;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) finish();
      }}
    >
      <DialogContent showCloseButton={false} aria-describedby="onboarding-description">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Icon className="size-5 text-[var(--fp-accent)]" aria-hidden="true" />
            <DialogTitle>{step.title}</DialogTitle>
          </div>
          <DialogDescription id="onboarding-description">{step.description}</DialogDescription>
        </DialogHeader>

        <div
          role="group"
          aria-label={`Step ${stepIndex + 1} of ${STEPS.length}`}
          className="flex items-center justify-center gap-1.5"
        >
          {STEPS.map((s, i) => (
            <span
              key={s.title}
              aria-hidden="true"
              className={
                i === stepIndex
                  ? "size-1.5 rounded-full bg-[var(--fp-accent)]"
                  : "size-1.5 rounded-full bg-border"
              }
            />
          ))}
        </div>

        <DialogFooter>
          <Button type="button" variant="ghost" size="sm" onClick={finish}>
            Skip
          </Button>
          {stepIndex > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setStepIndex((i) => i - 1)}
            >
              Back
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            onClick={() => (isLastStep ? finish() : setStepIndex((i) => i + 1))}
          >
            {isLastStep ? "Enter Dashboard" : "Next"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
