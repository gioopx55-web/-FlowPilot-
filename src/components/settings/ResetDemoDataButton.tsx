"use client";

import { useState, useTransition } from "react";
import { resetDemoDataAction } from "@/lib/taskActions";
import { Button } from "@/components/ui/button";

/**
 * Reset demo data (Phase 19 finding) — `resetDemoDataAction` has
 * existed since Phase 9/10/14 (reverts every task/client/settings
 * override back to the fixture-authored values) and has been
 * exercised continuously by the integration test suite, but no real
 * UI ever called it: there was no way for an actual user of the demo
 * to reach it. Wiring it up here is completing already-approved,
 * already-built, already-tested work (D-039's "one centralized reset
 * mechanism" requirement), not inventing a new feature.
 *
 * A native `window.confirm` guards the action — consistent with the
 * project's established preference for plain native controls over a
 * new dialog component for a single, infrequent, low-complexity
 * confirmation (D-041's precedent), and honest about what it does
 * rather than silent.
 */
export function ResetDemoDataButton() {
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  function handleReset() {
    const confirmed = window.confirm(
      "Reset all demo data? This reverts the shared task, client, and settings state for every visitor back to the original demo workspace.",
    );
    if (!confirmed) return;
    setDone(false);
    startTransition(async () => {
      await resetDemoDataAction();
      setDone(true);
    });
  }

  return (
    <div className="max-w-md">
      <Button type="button" size="sm" variant="secondary" onClick={handleReset} disabled={isPending}>
        {isPending ? "Resetting…" : "Reset demo data"}
      </Button>
      <p className="mt-2 text-xs text-muted-foreground">
        Reverts every task, client, and settings change back to the original demo workspace.
        This demo state is shared across visitors and lasts only until the server restarts.
      </p>
      {done && !isPending && (
        <p className="mt-1 text-xs text-[var(--fp-success)]">Demo data reset.</p>
      )}
    </div>
  );
}
