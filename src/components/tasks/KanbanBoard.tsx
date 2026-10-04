"use client";

import { useOptimistic, useTransition, useState } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import type { TaskStatus } from "@/types/entities";
import type { TaskListEntry } from "@/domain/selectors";
import { KanbanColumn } from "@/components/tasks/KanbanColumn";
import { KanbanCard } from "@/components/tasks/KanbanCard";
import { TASK_STATUS_OPTIONS } from "@/components/tasks/taskLabels";
import { changeTaskStatusAction } from "@/lib/taskActions";

/**
 * Kanban board (Phase 9 §5-§6/§16). Columns map 1:1 onto TaskStatus
 * (DECISIONS.md D-038) — no duplicate kanbanStatus concept. Drag
 * updates are optimistic (React 19 `useOptimistic`) and call the same
 * `changeTaskStatusAction` Server Action the StatusSelect alternate
 * control uses, so there is exactly one status-change code path
 * regardless of how it was triggered.
 *
 * Pointer/touch drag only — dnd-kit's core KeyboardSensor needs a
 * custom coordinate-getter to work across a multi-column board (the
 * built-in one assumes a single sortable list), which would be a
 * fragile approximation. Full keyboard/screen-reader accessibility is
 * instead guaranteed by the StatusSelect present on every card (Phase
 * 9 §17) — drag is an accelerator on top of it, never the only path.
 * Horizontal scroll-snap handles tablet/mobile (Phase 9 §16) rather
 * than squeezing 5 columns into a narrow viewport.
 */
export function KanbanBoard({
  entries,
  showProject,
  onOpenTask,
}: {
  entries: TaskListEntry[];
  showProject: boolean;
  onOpenTask: (taskId: string) => void;
}) {
  const [optimisticEntries, setOptimisticStatus] = useOptimistic(
    entries,
    (state, update: { taskId: string; status: TaskStatus }) =>
      state.map((e) =>
        e.task.id === update.taskId
          ? { ...e, task: { ...e.task, status: update.status } }
          : e,
      ),
  );
  const [, startTransition] = useTransition();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const taskId = String(event.active.id);
    const newStatus = event.over?.id as TaskStatus | undefined;
    if (!newStatus) return;
    const current = optimisticEntries.find((e) => e.task.id === taskId);
    if (!current || current.task.status === newStatus) return;

    startTransition(async () => {
      setOptimisticStatus({ taskId, status: newStatus });
      await changeTaskStatusAction(taskId, newStatus);
    });
  }

  const activeEntry = activeId
    ? optimisticEntries.find((e) => e.task.id === activeId)
    : undefined;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2">
        {TASK_STATUS_OPTIONS.map((opt) => (
          <KanbanColumn
            key={opt.value}
            status={opt.value}
            entries={optimisticEntries.filter((e) => e.task.status === opt.value)}
            showProject={showProject}
            onOpenTask={onOpenTask}
          />
        ))}
      </div>
      <DragOverlay>
        {activeEntry && (
          <KanbanCard entry={activeEntry} showProject={showProject} onOpen={() => {}} />
        )}
      </DragOverlay>
    </DndContext>
  );
}
