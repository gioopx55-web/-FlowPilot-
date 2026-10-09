"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Root-level "totally unreachable workspace" fallback — Phase 2 §11.19,
 * Phase 5 §26. Only reached if something fails above the (app) shell's
 * own error boundary.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
        {/* Hardcoded Tailwind color, not a CSS custom property: this is
            the last-resort fallback that replaces the entire <html>
            document when something fails above the app shell, so it
            cannot assume tokens.css/globals.css loaded successfully.
            orange-800 matches --fp-critical's light-mode value
            (global red-removal pass, see DECISIONS.md) — no red here
            either, by the same deliberate choice as the rest of the
            product. */}
        <AlertTriangle className="size-6 text-orange-800" aria-hidden="true" />
        <h1 className="text-sm font-semibold">FlowPilot AI couldn&apos;t load</h1>
        <p className="max-w-sm text-sm text-neutral-600">
          Something went wrong at the application level. Please try again.
        </p>
        <Button variant="outline" size="sm" onClick={reset}>
          Try again
        </Button>
      </body>
    </html>
  );
}
