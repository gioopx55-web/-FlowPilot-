"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Shell-level error boundary — Phase 4 §15.10, Phase 5 §26. Catches a
 * rendering failure inside the (app) shell without taking down the
 * whole app. Scoped, inline, with a retry action — never a raw stack
 * trace surfaced to the user.
 */
export default function AppError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 py-24 text-center">
      <AlertTriangle
        className="size-6 text-[var(--fp-danger)]"
        aria-hidden="true"
      />
      <h2 className="text-sm font-semibold text-foreground">
        Something went wrong
      </h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        This section couldn&apos;t load. The rest of FlowPilot AI is unaffected.
      </p>
      <Button variant="outline" size="sm" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
