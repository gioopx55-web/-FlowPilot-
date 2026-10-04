import type { LucideIcon } from "lucide-react";
import { EmptyState } from "@/components/primitives/EmptyState";

/**
 * Placeholder content for module routes that exist only to prove the
 * shell/navigation/routing — no business feature lives here. Thin
 * wrapper over EmptyState (same Phase 4 §15.10 pattern) at full-page
 * height, with no action.
 */
export function ComingSoon({
  icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex h-full items-center justify-center">
      <EmptyState icon={icon} title={title} description={description} />
    </div>
  );
}
