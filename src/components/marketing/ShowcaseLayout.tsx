import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { RevealOnScroll } from "@/components/marketing/RevealOnScroll";
import { IconFrame } from "@/components/marketing/IconFrame";
import { DotGrid } from "@/components/marketing/DotGrid";
import { cn } from "@/lib/utils";

export interface ShowcaseBullet {
  icon: LucideIcon;
  text: string;
}

/**
 * The shared two-column "copy + real product visual" layout every
 * feature section uses (Phase 13.5 §3/§20) — alternates sides via
 * `reverse` for visual rhythm down the page, same reveal-on-scroll
 * treatment everywhere via `RevealOnScroll`. Phase 13.6 adds
 * restrained per-section differentiation (Phase 13.6 §7) without
 * seven different layouts: an `IconFrame` per bullet instead of a
 * plain dot, an optional `eyebrowIcon`, and an alternating `tone`
 * background so sections read as a sequence, not one component
 * repeated — the dot-grid motif appears only on `tone="surface"`
 * sections, at very low opacity, so it registers as rhythm rather
 * than noise.
 */
export function ShowcaseLayout({
  id,
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  title,
  description,
  bullets,
  visual,
  reverse = false,
  tone = "canvas",
}: {
  id?: string;
  eyebrow: string;
  eyebrowIcon?: LucideIcon;
  title: string;
  description: string;
  bullets?: ShowcaseBullet[];
  visual: ReactNode;
  reverse?: boolean;
  tone?: "canvas" | "surface";
}) {
  return (
    <section
      id={id}
      className={cn(
        // Phase 17.6 bug fix: `isolate` is required for the DotGrid
        // backdrop (-z-10) to actually paint — without it, `relative`
        // alone does not establish a stacking context, so the
        // negative-z layer escapes to the page root and renders
        // *below* the page's own canvas background instead of above
        // it. Every `tone="surface"` showcase's dot-grid has been
        // invisible since Phase 13.6 because of this (see Hero.tsx's
        // longer note on the same bug).
        "relative isolate overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-8",
        // Phase 17.6: a top/bottom fade instead of a flat fill — the
        // previous hard color block created a visible seam at every
        // section boundary (§4 continuity). Fading into the canvas
        // tone at each edge makes the surface read as a soft "island"
        // within the page rather than a reset, while staying fully
        // solid (readable) through the section's own content.
        tone === "surface" &&
          "bg-[linear-gradient(to_bottom,transparent,var(--fp-bg-surface)_14%,var(--fp-bg-surface)_86%,transparent)]",
      )}
    >
      {tone === "surface" && (
        <DotGrid className="pointer-events-none absolute inset-0 -z-10 text-border/40" />
      )}

      <div
        className={cn(
          "mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16",
          reverse && "lg:[&>*:first-child]:order-2",
        )}
      >
        <RevealOnScroll className="min-w-0">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-[var(--fp-accent)] uppercase">
            {EyebrowIcon && <EyebrowIcon className="size-3.5" aria-hidden="true" />}
            {eyebrow}
          </span>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h2>
          <p className="mt-3 text-base text-muted-foreground">{description}</p>
          {bullets && bullets.length > 0 && (
            <ul className="mt-5 space-y-3">
              {bullets.map((bullet) => (
                <li key={bullet.text} className="flex items-center gap-2.5 text-sm text-foreground">
                  <IconFrame icon={bullet.icon} />
                  {bullet.text}
                </li>
              ))}
            </ul>
          )}
        </RevealOnScroll>

        <RevealOnScroll delay={0.1} className="min-w-0">
          {visual}
        </RevealOnScroll>
      </div>
    </section>
  );
}
