import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { IconFrame } from "@/components/marketing/IconFrame";
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

export function PreviewCardHeader({
  title,
  meta,
  icon,
}: {
  title: string;
  meta?: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
      <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        {icon && <IconFrame icon={icon} size="sm" />}
        {title}
      </span>
      {meta && <span className="text-xs text-muted-foreground">{meta}</span>}
    </div>
  );
}
