"use client";

import { useTransition } from "react";
import type { TaskStatus } from "@/types/entities";
import { changeTaskStatusAction } from "@/lib/taskActions";
import { TASK_STATUS_OPTIONS } from "@/components/tasks/taskLabels";

/**
 * The guaranteed-accessible way to change a task's status — a plain
 * native <select>, usable by keyboard and screen reader without any
 * drag gesture (Phase 9 §17: "the user must be able to move a task
 * without dragging"). Kanban drag-and-drop is an accelerator on top
 * of this, never a replacement for it.
 */
export function StatusSelect({
  taskId,
  status,
  label = "Change status",
  onChanged,
}: {
  taskId: string;
  status: TaskStatus;
  label?: string;
  onChanged?: (status: TaskStatus) => void;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      aria-label={label}
      value={status}
      disabled={isPending}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => {
        const next = e.target.value as TaskStatus;
        onChanged?.(next);
        startTransition(() => {
          void changeTaskStatusAction(taskId, next);
        });
      }}
      className="h-9 rounded-sm border border-border bg-background px-2 text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/70 disabled:opacity-60"
    >
      {TASK_STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
