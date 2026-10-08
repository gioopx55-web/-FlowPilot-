"use client";

import { useDraggable } from "@dnd-kit/core";
import type { TaskListEntry } from "@/domain/selectors";
import { TaskPriorityBadge, TaskBlockerIndicator } from "@/components/primitives/StatusBadge";
import { StatusSelect } from "@/components/tasks/StatusSelect";
import { formatShortDate } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Compact Kanban card (Phase 9 §15) — title, priority, assignee, due
 * date, project (global view only), blocker indicator. The
 * StatusSelect is always present and keyboard/touch-operable — drag
 * is an accelerator on top of it, never the only way to move a card
 * (Phase 9 §17).
 */
export function KanbanCard({
  entry,
  showProject,
  onOpen,
}: {
  entry: TaskListEntry;
  showProject: boolean;
  onOpen: (taskId: string) => void;
}) {
  const { task, project, assignee, isOverdue } = entry;
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "space-y-2 rounded-md border border-border bg-card p-3 text-sm shadow-[var(--fp-shadow-level-1)]",
        isDragging && "opacity-50",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={() => onOpen(task.id)}
          className="-my-3 rounded-sm py-3 text-start font-medium text-foreground outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/70"
        >
          {task.title}
        </button>
        <button
          type="button"
          aria-label={`Drag to move "${task.title}"`}
          {...attributes}
          {...listeners}
          className="shrink-0 cursor-grab touch-none rounded-sm p-1.5 text-muted-foreground outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/70 active:cursor-grabbing"
        >
          <GripIcon />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <TaskPriorityBadge priority={task.priority} />
        {task.hasActiveBlocker && <TaskBlockerIndicator />}
      </div>

      <p className="text-xs text-muted-foreground">
        {showProject && project && `${project.name} · `}
        {assignee?.name ?? "Unassigned"}
        {task.dueDate && (
          <>
            {" · "}
            <span className={isOverdue ? "text-[var(--fp-warning)]" : undefined}>
              due {formatShortDate(task.dueDate)}
            </span>
          </>
        )}
      </p>

      <StatusSelect taskId={task.id} status={task.status} label={`Move "${task.title}"`} />
    </div>
  );
}

function GripIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="5" cy="3" r="1.3" fill="currentColor" />
      <circle cx="11" cy="3" r="1.3" fill="currentColor" />
      <circle cx="5" cy="8" r="1.3" fill="currentColor" />
      <circle cx="11" cy="8" r="1.3" fill="currentColor" />
      <circle cx="5" cy="13" r="1.3" fill="currentColor" />
      <circle cx="11" cy="13" r="1.3" fill="currentColor" />
    </svg>
  );
}
