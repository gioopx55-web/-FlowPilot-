import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Business-agnostic badge primitive (Phase 5 §21 primitive tier).
 * Knows nothing about tasks/risk/workload — feature code (Phase 6+)
 * supplies a `tone` and label/icon. Shape/sizing/opacity rules are
 * fixed here per Phase 4 §15.8/§23 so every badge in the product is
 * visually consistent.
 */

export type BadgeTone =
  | "neutral"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "info";

const toneClassName: Record<BadgeTone, string> = {
  neutral: "bg-muted text-muted-foreground",
  accent: "bg-[var(--fp-accent-subtle-bg)] text-[var(--fp-accent)]",
  success: "bg-[var(--fp-success)]/10 text-[var(--fp-success)]",
  warning: "bg-[var(--fp-warning)]/10 text-[var(--fp-warning)]",
  danger: "bg-[var(--fp-danger)]/10 text-[var(--fp-danger)]",
  info: "bg-[var(--fp-info)]/10 text-[var(--fp-info)]",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  icon?: React.ReactNode;
}

export function Badge({
  tone = "neutral",
  icon,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      data-slot="badge"
      data-tone={tone}
      className={cn(
        "inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-medium",
        toneClassName[tone],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </span>
  );
}
