"use client";

import { useDroppable } from "@dnd-kit/core";
import type { TaskStatus } from "@/types/entities";
import type { TaskListEntry } from "@/domain/selectors";
import { KanbanCard } from "@/components/tasks/KanbanCard";
import { TASK_STATUS_LABEL } from "@/components/primitives/StatusBadge";
import { cn } from "@/lib/utils";

export function KanbanColumn({
  status,
  entries,
  showProject,
  onOpenTask,
}: {
  status: TaskStatus;
  entries: TaskListEntry[];
  showProject: boolean;
  onOpenTask: (taskId: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex w-72 shrink-0 snap-start flex-col">
      <div className="mb-2 flex items-center justify-between px-1">
        <h3 className="text-xs font-semibold text-foreground">{TASK_STATUS_LABEL[status]}</h3>
        <span className="text-xs text-muted-foreground">{entries.length}</span>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-24 flex-1 flex-col gap-2 rounded-md border border-dashed border-border p-2 transition-colors",
          isOver && "border-[var(--fp-accent)] bg-[var(--fp-accent-subtle-bg)]",
        )}
      >
        {entries.map((entry) => (
          <KanbanCard
            key={entry.task.id}
            entry={entry}
            showProject={showProject}
            onOpen={onOpenTask}
          />
        ))}
      </div>
    </div>
  );
}
