import { CheckCircle2, Database, Link2, Sparkles, Target } from "lucide-react";
import type { AIAnswer } from "@/domain/ai/executeIntent";
import { AI_QUICK_ACTIONS } from "@/domain/ai/intents";
import { RevealOnScroll } from "@/components/marketing/RevealOnScroll";
import { IconFrame } from "@/components/marketing/IconFrame";
import { PreviewCard } from "@/components/marketing/PreviewCard";
import { AIResultList } from "@/components/ai/AIResultList";
import { FlowDiagram } from "@/components/marketing/FlowDiagram";
import { DotGrid } from "@/components/marketing/DotGrid";

const BULLETS = [
  { icon: Link2, text: "Every answer links back to the real project, task, or client" },
  { icon: Target, text: "Scoped entry points: open it from a project or a teammate directly" },
  { icon: CheckCircle2, text: "Clearly labeled as rule-based — never pretending to be a live model" },
];

/**
 * AI Assistant (Phase 13.5 §17, redesigned Phase 17.6 §8) — the real
 * quick-action list and the real `AIResultList` renderer (same
 * component the actual panel uses), so this reads as structured
 * intelligence over workspace data, not a generic chat-bubble
 * screenshot.
 *
 * Phase 17.6: deliberately NOT `ShowcaseLayout`'s two-column pattern
 * — the brief named this section as the one to make visually
 * strongest, and §7 explicitly asked for variety beyond "text +
 * preview" repeated seven times. This is a wide, centered,
 * storytelling composition instead: headline/description centered
 * above, the flow diagram and result card stacked as one larger
 * focal unit below, with a restrained indigo glow behind it (one of
 * the few places Phase 17.6 §6 allows a major-preview glow) and the
 * three bullets laid out as a row beneath rather than a vertical
 * list, so the section doesn't just repeat the same internal shape
 * as everything around it.
 */
export function AIShowcase({ answer }: { answer: AIAnswer }) {
  return (
    <section
      id="ai"
      className="relative isolate overflow-hidden bg-[linear-gradient(to_bottom,transparent,var(--fp-bg-surface)_14%,var(--fp-bg-surface)_86%,transparent)] px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
    >
      <DotGrid className="pointer-events-none absolute inset-0 -z-20 text-border/40" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-[520px] -translate-y-1/2 bg-[radial-gradient(ellipse_55%_60%_at_50%_50%,color-mix(in_oklch,var(--fp-accent)_16%,transparent),transparent)]"
      />

      <RevealOnScroll className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-[var(--fp-accent)] uppercase">
          <Sparkles className="size-3.5" aria-hidden="true" />
          AI Assistant
        </span>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          An AI layer that reasons over your real workspace, not a blank prompt box.
        </h2>
        <p className="mt-3 text-base text-muted-foreground">
          FlowPilot&apos;s AI answers a fixed set of operational questions — risk, overdue
          work, follow-up, workload, weekly summaries — by running the exact same domain
          logic the rest of the product uses. No invented numbers, no unsupported
          questions pretending to be answered.
        </p>
      </RevealOnScroll>

      <RevealOnScroll delay={0.1} className="mx-auto mt-10 max-w-2xl">
        <FlowDiagram
          nodes={[
            { icon: Database, label: "Workspace data" },
            { icon: Sparkles, label: "FlowPilot AI" },
            { icon: CheckCircle2, label: "Structured action" },
          ]}
        />
        <PreviewCard className="mt-5 max-w-2xl">
          <div className="border-b border-border px-4 py-3">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Demo AI — powered by workspace rules, not a live model.
            </p>
          </div>
          <div className="grid gap-1.5 border-b border-border p-3 sm:grid-cols-3">
            {AI_QUICK_ACTIONS.slice(0, 3).map((action) => (
              <div
                key={action.intentId}
                className="rounded-sm border border-border px-2.5 py-1.5 text-xs text-foreground"
              >
                {action.label}
              </div>
            ))}
          </div>
          <div className="p-3">
            {answer.kind === "list" && (
              <AIResultList
                heading={answer.heading}
                rows={answer.rows.slice(0, 3)}
                emptyMessage={answer.emptyMessage}
              />
            )}
          </div>
        </PreviewCard>
      </RevealOnScroll>

      <RevealOnScroll
        delay={0.15}
        className="mx-auto mt-10 grid max-w-3xl gap-5 sm:grid-cols-3"
      >
        {BULLETS.map((bullet) => (
          <div key={bullet.text} className="flex flex-col items-center gap-2 text-center">
            <IconFrame icon={bullet.icon} size="md" />
            <p className="text-sm text-foreground">{bullet.text}</p>
          </div>
        ))}
      </RevealOnScroll>
    </section>
  );
}
