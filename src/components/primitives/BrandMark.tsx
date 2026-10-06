import { cn } from "cn";

/**
 * FlowPilot brand mark (Phase 21.1 §7 — release blocker: "Requested
 * triangular FlowPilot brand mark is still not implemented
 * consistently"). A small, original, restrained geometric mark: two
 * overlapping triangles reading as a forward/progress arrowhead
 * inside the same rounded-square "chip" the Sidebar's collapsed-state
 * monogram already established (Phase 17.5, D-077) — this REPLACES
 * that chip's plain "N" glyph with a real mark, it doesn't add a
 * second, competing shape language. Solid fill, no gradient/glow/
 * animation per the brief. Crisp at 16px+ (pure SVG, no raster).
 *
 * `currentColor` for the triangle so it always reads against the
 * chip's own background in both themes; the chip background itself
 * is the existing `--fp-accent` token, already contrast-checked
 * (D-035) in both light and dark.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-md bg-[var(--fp-accent)] text-[var(--fp-accent-foreground)]",
        className,
      )}
    >
      <svg
        viewBox="0 0 16 16"
        className="size-3.5"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M1.5 1.5 L9 8 L1.5 14.5 Z" opacity="0.55" />
        <path d="M6 1.5 L14.5 8 L6 14.5 Z" />
      </svg>
    </span>
  );
}

/**
 * The expanded lockup — mark + wordmark, same pairing everywhere it
 * appears (Landing navbar, Login, expanded Sidebar). Footer uses a
 * quieter variant via `className`, per the brief's "Footer treatment
 * may be quieter."
 */
export function BrandLockup({
  className,
  textClassName,
}: {
  className?: string;
  textClassName?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <BrandMark />
      <span className={cn("text-sm font-semibold text-foreground", textClassName)}>
        FlowPilot AI
      </span>
    </span>
  );
}
