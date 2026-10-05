import { Sparkles } from "lucide-react";
import type { AIAnswer } from "@/domain/ai/executeIntent";
import { AI_QUICK_ACTIONS } from "@/domain/ai/intents";
import { ShowcaseLayout } from "@/components/marketing/ShowcaseLayout";
import { PreviewCard } from "@/components/marketing/PreviewCard";
import { AIResultList } from "@/components/ai/AIResultList";

/**
 * AI Assistant (Phase 13.5 §17) — the real quick-action list and the
 * real `AIResultList` renderer (same component the actual panel
 * uses), so this reads as structured intelligence over workspace
 * data, not a generic chat-bubble screenshot.
 */
export function AIShowcase({ answer }: { answer: AIAnswer }) {
  return (
    <ShowcaseLayout
      id="ai"
      eyebrow="AI Assistant"
      title="An AI layer that reasons over your real workspace, not a blank prompt box."
      description="FlowPilot's AI answers a fixed set of operational questions — risk, overdue work, follow-up, workload, weekly summaries — by running the exact same domain logic the rest of the product uses. No invented numbers, no unsupported questions pretending to be answered."
      bullets={[
        "Every answer links back to the real project, task, or client",
        "Scoped entry points: open it from a project or a teammate directly",
        "Clearly labeled as rule-based — never pretending to be a live model",
      ]}
      reverse
      visual={
        <PreviewCard>
          <div className="border-b border-border px-4 py-3">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Demo AI — powered by workspace rules, not a live model.
            </p>
          </div>
          <div className="space-y-1.5 border-b border-border p-3">
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
              <AIResultList heading={answer.heading} rows={answer.rows.slice(0, 3)} emptyMessage={answer.emptyMessage} />
            )}
          </div>
        </PreviewCard>
      }
    />
  );
}
