import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { IconFrame } from "@/components/marketing/IconFrame";

export interface FlowNode {
  icon: LucideIcon;
  label: string;
}

/**
 * The "workspace data → FlowPilot analysis → structured action" flow
 * (Phase 13.6 §9/§10) — a small lightweight diagram, not a chat
 * screenshot, making the AI section's structured-intelligence story
 * visible rather than only stated in copy. Purely illustrative
 * (`aria-hidden`): the real heading/description right next to it
 * already carries the same meaning in text.
 *
 * This is a directional relationship (data flows into AI, AI
 * produces the action), so it mirrors in RTL rather than staying
 * fixed like pure decoration would (Phase 13.6 §16): the flex row
 * auto-reverses node order under `dir="rtl"`, and the connector
 * arrow is flipped (`rtl:-scale-x-100`) so it keeps pointing from
 * each node toward the next one in reading order.
 */
export function FlowDiagram({ nodes }: { nodes: FlowNode[] }) {
  return (
    <div
      aria-hidden="true"
      className="flex items-center justify-center gap-2 rounded-[var(--fp-radius-lg)] border border-border bg-[var(--fp-bg-surface)] px-4 py-5"
    >
      {nodes.map((node, i) => (
        <div key={node.label} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1.5">
            <IconFrame icon={node.icon} size="md" />
            <span className="max-w-[5.5rem] text-center text-[0.7rem] leading-tight text-muted-foreground">
              {node.label}
            </span>
          </div>
          {i < nodes.length - 1 && (
            <ArrowRight
              className="size-3.5 shrink-0 text-border rtl:-scale-x-100"
              aria-hidden="true"
            />
          )}
        </div>
      ))}
    </div>
  );
}
