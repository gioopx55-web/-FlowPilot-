"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { TaskDetailEntry } from "@/domain/selectors";
import type { TeamMember } from "@/types/entities";
import { TaskDetailContent } from "@/components/tasks/TaskDetailContent";
import { getLocale } from "@/lib/locale";

/**
 * Task Detail as a panel over Tasks/Kanban/Project Tasks (Phase 9
 * §9). Modal (always — unlike the AI/Notifications panel, there is no
 * second panel it needs to coexist with) and docks to the logical end
 * edge, same physical-side derivation as SidePanel.tsx. Full-screen on
 * mobile via the sm:max-w breakpoint. Closing calls `onOpenChange`,
 * which the caller wires to clearing the `?task=` query param —
 * context (list scroll/filters) is preserved because no navigation
 * away from the underlying page ever occurs.
 */
export function TaskDetailPanel({
  open,
  onOpenChange,
  detail,
  teamMembers,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  detail: TaskDetailEntry | undefined;
  teamMembers: TeamMember[];
}) {
  const { dir } = getLocale();
  const endSide = dir === "rtl" ? "left" : "right";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={endSide} className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Task</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {detail && <TaskDetailContent detail={detail} teamMembers={teamMembers} />}
        </div>
      </SheetContent>
    </Sheet>
  );
}
