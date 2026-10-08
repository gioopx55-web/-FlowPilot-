import Link from "next/link";
import type { HeroSnapshot } from "@/components/marketing/landingCuration";
import { Button } from "@/components/ui/button";
import { StaggerGroup, StaggerItem } from "@/components/marketing/StaggerGroup";
import { HeroProductPreview } from "@/components/marketing/HeroProductPreview";

export function Hero({ snapshot }: { snapshot: HeroSnapshot }) {
  return (
    <section className="relative isolate overflow-hidden px-4 pb-24 pt-28 sm:px-6 sm:pt-36 lg:px-8">
      {/* Phase 17.6: a taller, softer two-layer glow (a wide ambient
          wash plus a tighter, slightly stronger core behind the
          product preview's side of the composition) replaces the
          single flat radial — closer relationship between the
          headline and the preview it sits beside, and this glow now
          carries down far enough to bleed into DashboardShowcase
          below rather than resetting hard at the section boundary
          (Phase 17.6 §4 continuity). `--fp-accent-subtle-bg` (the
          pre-mixed, very pale badge-background token) proved almost
          invisible at this scale, so this blends `--fp-accent` itself
          at low opacity via `color-mix` instead (same function
          `button.tsx`'s secondary-hover state already uses; no new
          technique). A real bug was found fixing this: the glow
          never actually painted at any opacity — `<section
          relative>` alone does not establish a stacking context, so
          the `-z-10` layer escaped to the page root and rendered
          *below* the canvas-colored page background instead of above
          it. `isolate` (`isolation: isolate`) on the section fixes
          it — this means the Hero's glow, and every other section's,
          has been invisible since Phase 13.5 regardless of how its
          color was tuned. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px] bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,color-mix(in_oklch,var(--fp-accent)_12%,transparent),transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute end-0 top-20 -z-10 hidden h-[560px] w-[52%] bg-[radial-gradient(ellipse_60%_60%_at_70%_30%,color-mix(in_oklch,var(--fp-accent)_16%,transparent),transparent)] lg:block"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_1.08fr] lg:gap-16">
        <StaggerGroup className="min-w-0 text-center lg:text-start">
          <StaggerItem>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-[var(--fp-bg-surface)] px-3 py-1 text-xs font-medium text-muted-foreground">
              FlowPilot AI
            </span>
          </StaggerItem>
          <StaggerItem>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
              See what needs attention before it becomes a problem.
            </h1>
          </StaggerItem>
          <StaggerItem>
            <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground lg:mx-0 lg:text-lg">
              FlowPilot AI watches every project, task, client, and teammate in one
              workspace, and surfaces risk, overdue work, and overloaded people before
              they derail a delivery — with an AI layer that reasons over that same
              real data, not a generic chatbot.
            </p>
          </StaggerItem>
          <StaggerItem>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Button asChild size="lg">
                <Link href="/login">Open FlowPilot Demo</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#product-preview">See how it works</a>
              </Button>
            </div>
          </StaggerItem>
        </StaggerGroup>

        <HeroProductPreview snapshot={snapshot} />
      </div>
    </section>
  );
}
