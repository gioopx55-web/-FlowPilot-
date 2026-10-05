import { Ban, Kanban, Link2, MousePointer2 } from "lucide-react";
import type { Task, TaskStatus } from "@/types/entities";
import { ShowcaseLayout } from "@/components/marketing/ShowcaseLayout";
import {
  TaskPriorityBadge,
  TaskBlockerIndicator,
  TASK_STATUS_LABEL,
} from "@/components/primitives/StatusBadge";

/**
 * Tasks / Kanban (Phase 13.5 §3.5) — a static, non-interactive
 * preview of the real board layout (same card chrome as
 * `KanbanCard.tsx`, real task titles/priorities), without the
 * drag-and-drop machinery marketing doesn't need.
 */
export function KanbanShowcase({
  columns,
}: {
  columns: { status: TaskStatus; tasks: Task[] }[];
}) {
  return (
    <ShowcaseLayout
      eyebrow="Tasks"
      eyebrowIcon={Kanban}
      title="A real board, not a task list pretending to be one."
      description="Drag-and-drop Kanban backed by the same task records everywhere else in the product — status changes are never a second source of truth, and every card stays keyboard- and screen-reader-operable."
      bullets={[
        { icon: Ban, text: "Blocked is a real, visible column — not buried in a filter" },
        { icon: MousePointer2, text: "Every drag has an accessible select-based equivalent" },
        { icon: Link2, text: "The same board, scoped, appears on each project's Tasks tab" },
      ]}
      visual={
        <div className="mx-auto flex w-full max-w-lg gap-3 overflow-x-auto rounded-[var(--fp-radius-lg)] border border-border bg-[var(--fp-bg-surface-raised)] p-4 shadow-[var(--fp-shadow-level-2)]">
          {columns.map((column) => (
            <div key={column.status} className="w-40 shrink-0">
              <div className="mb-2 flex items-center justify-between px-0.5">
                <h3 className="text-xs font-semibold text-foreground">
                  {TASK_STATUS_LABEL[column.status]}
                </h3>
                <span className="text-xs text-muted-foreground">{column.tasks.length}</span>
              </div>
              <div className="space-y-2">
                {column.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="space-y-1.5 rounded-md border border-border bg-card p-2.5 text-xs shadow-[var(--fp-shadow-level-1)]"
                  >
                    <p className="font-medium text-foreground">{task.title}</p>
                    <div className="flex flex-wrap items-center gap-1">
                      <TaskPriorityBadge priority={task.priority} />
                      {task.hasActiveBlocker && <TaskBlockerIndicator />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      }
    />
  );
}
