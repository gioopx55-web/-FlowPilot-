import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Small icon-in-frame treatment (Phase 13.6 §3) — the one way an
 * icon gets visual weight on the Landing Page: a restrained
 * rounded-square surface in the accent or a semantic tone, never a
 * giant colorful icon or a generic AI sparkle used as decoration.
 * Purely decorative (`aria-hidden`) — the icon always sits beside
 * real text that carries the actual meaning.
 */
export function IconFrame({
  icon: Icon,
  tone = "accent",
  size = "sm",
}: {
  icon: LucideIcon;
  tone?: "accent" | "neutral";
  size?: "sm" | "md";
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-[var(--fp-radius-sm)] border",
        tone === "accent"
          ? "border-[var(--fp-accent)]/20 bg-[var(--fp-accent-subtle-bg)] text-[var(--fp-accent)]"
          : "border-border bg-[var(--fp-bg-surface)] text-muted-foreground",
        size === "sm" ? "size-6" : "size-9",
      )}
    >
      <Icon className={size === "sm" ? "size-3.5" : "size-4.5"} aria-hidden="true" />
    </span>
  );
}
