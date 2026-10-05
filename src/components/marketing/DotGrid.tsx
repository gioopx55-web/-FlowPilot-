/**
 * Restrained decorative dot-grid background (Phase 13.6 §2) — a
 * business-operations-adjacent motif (a loose grid, echoing rows/
 * columns of data) rather than a random shape. Static (no motion,
 * cheap to render), `aria-hidden`, and themed through existing
 * border/text tokens so it fades automatically in dark mode instead
 * of needing a second set of values.
 */
export function DotGrid({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="fp-dot-grid" width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#fp-dot-grid)" />
    </svg>
  );
}
