import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Shared bordered-card chrome for every showcase visual (Phase 13.5 §19) — same tokens the real app's surfaces use. */
export function PreviewCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-md overflow-hidden rounded-[var(--fp-radius-lg)] border border-border bg-[var(--fp-bg-surface-raised)] shadow-[var(--fp-shadow-level-2)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PreviewCardHeader({ title, meta }: { title: string; meta?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-3">
      <span className="text-xs font-medium text-muted-foreground">{title}</span>
      {meta && <span className="text-xs text-muted-foreground">{meta}</span>}
    </div>
  );
}
