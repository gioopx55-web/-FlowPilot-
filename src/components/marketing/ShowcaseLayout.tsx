import type { ReactNode } from "react";
import { RevealOnScroll } from "@/components/marketing/RevealOnScroll";
import { cn } from "@/lib/utils";

/**
 * The shared two-column "copy + real product visual" layout every
 * feature section uses (Phase 13.5 §3/§20) — alternates sides via
 * `reverse` for visual rhythm down the page, same reveal-on-scroll
 * treatment everywhere via `RevealOnScroll`.
 */
export function ShowcaseLayout({
  id,
  eyebrow,
  title,
  description,
  bullets,
  visual,
  reverse = false,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  bullets?: string[];
  visual: ReactNode;
  reverse?: boolean;
}) {
  return (
    <section id={id} className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div
        className={cn(
          "mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16",
          reverse && "lg:[&>*:first-child]:order-2",
        )}
      >
        <RevealOnScroll className="min-w-0">
          <span className="text-xs font-semibold tracking-wide text-[var(--fp-accent)] uppercase">
            {eyebrow}
          </span>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h2>
          <p className="mt-3 text-base text-muted-foreground">{description}</p>
          {bullets && bullets.length > 0 && (
            <ul className="mt-5 space-y-2.5">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2 text-sm text-foreground">
                  <span
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--fp-accent)]"
                    aria-hidden="true"
                  />
                  {bullet}
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
