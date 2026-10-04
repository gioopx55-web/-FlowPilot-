import type { LucideIcon } from "lucide-react";

/**
 * Placeholder content for module routes that exist only to prove the
 * shell/navigation/routing in Phase 5 — no business feature lives here.
 * Styled per the Phase 4 §15.10 empty-state pattern (small icon, one
 * short neutral sentence) rather than a generic "under construction" page.
 */
export function ComingSoon({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 py-24 text-center">
      <Icon className="size-6 text-muted-foreground" aria-hidden="true" />
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
