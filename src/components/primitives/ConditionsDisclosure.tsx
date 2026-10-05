import { Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/**
 * Shared "why" disclosure for risk/workload badges (Phase 4 §15.9,
 * D-027). A click/keyboard-triggered Popover rather than a
 * hover-only Tooltip satisfies "must not depend on hover alone" on
 * desktop/tablet and doubles as the mobile tap-to-expand affordance —
 * one implementation for both, since click and tap are the same
 * event. The trigger button meets the ~44x44px touch-target
 * guidance (D-031) via the h-11 w-11 sizing below. `shrink-0` is
 * required: without it, a narrow flex container (e.g. a tight
 * marketing preview card) shrinks this fixed-size button down to its
 * icon's own min-content width instead of the sibling badge/percent
 * text wrapping, visually colliding the button with the badge text
 * (found via Phase 13.5 visual verification).
 */
export function ConditionsDisclosure({
  label,
  reasons,
}: {
  label: string;
  reasons: string[];
}) {
  return (
    <Popover>
      <PopoverTrigger
        aria-label={label}
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-sm text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/70"
      >
        <Info className="size-4" aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent>
        <p className="mb-1.5 text-xs font-medium text-foreground">{label}</p>
        <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground">
          {reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
