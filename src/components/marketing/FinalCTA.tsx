import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RevealOnScroll } from "@/components/marketing/RevealOnScroll";

/**
 * Final CTA (Phase 13.5, upgraded Phase 17.6 §9) — the page's
 * culmination, not just another centered block. A single restrained
 * radial glow (same brand hue as the Hero/AI section, never a new
 * gradient) sits behind the heading, and the heading itself steps up
 * to the Hero's own size so the page visually "returns" to where it
 * started rather than trailing off smaller. Still one honest action,
 * no fake urgency, no invented social proof.
 */
export function FinalCTA() {
  return (
    <section className="relative isolate overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-[420px] -translate-y-1/2 bg-[radial-gradient(ellipse_50%_60%_at_50%_50%,color-mix(in_oklch,var(--fp-accent)_14%,transparent),transparent)]"
      />
      <RevealOnScroll className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          See it running on a real workspace.
        </h2>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          The demo is a fully working copy of FlowPilot AI, seeded with a realistic
          agency workspace — real risk, real workload, real follow-ups.
        </p>
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg">
            <Link href="/login">Open FlowPilot Demo</Link>
          </Button>
        </div>
      </RevealOnScroll>
    </section>
  );
}
