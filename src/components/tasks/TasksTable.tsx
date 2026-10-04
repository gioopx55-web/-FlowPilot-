"use client";

import type { TaskListEntry } from "@/domain/selectors";
import { TaskStatusBadge, TaskPriorityBadge, TaskBlockerIndicator } from "@/components/primitives/StatusBadge";
import { EmptyState } from "@/components/primitives/EmptyState";
import { formatShortDate } from "@/lib/format";
import { ListChecks } from "lucide-react";

/**
 * Dense task list (Phase 9 §4) — same dual rendering pattern as
 * ProjectsTable (real <table> at md+, stacked list on mobile, both
 * from the same data, no viewport-detection JS).
 */
export function TasksTable({
  entries,
  showProject = true,
  onOpenTask,
}: {
  entries: TaskListEntry[];
  showProject?: boolean;
  onOpenTask: (taskId: string) => void;
}) {
  if (entries.length === 0) {
    return (
      <EmptyState
        icon={ListChecks}
        title="No tasks match your filters"
        description="Try a different search term or clear your filters."
      />
    );
  }

  return (
    <>
      <table className="hidden w-full border-collapse text-sm md:table">
        <thead>
          <tr className="border-b border-border text-xs text-muted-foreground">
            <th className="px-3 py-2 text-start font-medium">Task</th>
            {showProject && <th className="px-3 py-2 text-start font-medium">Project</th>}
            <th className="px-3 py-2 text-start font-medium">Assignee</th>
            <th className="px-3 py-2 text-start font-medium">Status</th>
            <th className="px-3 py-2 text-start font-medium">Priority</th>
            <th className="px-3 py-2 text-start font-medium">Due</th>
            <th className="px-3 py-2 text-start font-medium">Est. hours</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {entries.map(({ task, project, assignee, isOverdue }) => (
            <tr key={task.id} className="hover:bg-accent">
              <td className="px-3 py-2.5">
                <button
                  type="button"
                  onClick={() => onOpenTask(task.id)}
                  className="rounded-sm text-start font-medium text-foreground outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/70"
                >
                  {task.title}
                </button>
                {task.hasActiveBlocker && (
                  <span className="ms-2 inline-block align-middle">
                    <TaskBlockerIndicator />
                  </span>
                )}
              </td>
              {showProject && (
                <td className="px-3 py-2.5 text-muted-foreground">
                  {project?.name ?? "Unknown project"}
                </td>
              )}
              <td className="px-3 py-2.5 text-muted-foreground">
                {assignee?.name ?? "Unassigned"}
              </td>
              <td className="px-3 py-2.5">
                <TaskStatusBadge status={task.status} />
              </td>
              <td className="px-3 py-2.5">
                <TaskPriorityBadge priority={task.priority} />
              </td>
              <td className={`px-3 py-2.5 ${isOverdue ? "text-[var(--fp-danger)]" : "text-muted-foreground"}`}>
                {formatShortDate(task.dueDate)}
              </td>
              <td className="px-3 py-2.5 text-muted-foreground">
                {task.estimatedHours !== undefined ? `${task.estimatedHours}h` : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="divide-y divide-border rounded-md border border-border md:hidden">
        {entries.map(({ task, project, assignee, isOverdue }) => (
          <li key={task.id} className="flex flex-col gap-2 p-3">
            <button
              type="button"
              onClick={() => onOpenTask(task.id)}
              className="rounded-sm text-start outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
            >
              <span className="block text-sm font-medium text-foreground hover:underline">
                {task.title}
              </span>
              <span className="block text-xs text-muted-foreground">
                {showProject && `${project?.name ?? "Unknown project"} · `}
                {assignee?.name ?? "Unassigned"} ·{" "}
                <span className={isOverdue ? "text-[var(--fp-danger)]" : undefined}>
                  due {formatShortDate(task.dueDate)}
                </span>
              </span>
            </button>
            <div className="flex flex-wrap items-center gap-1.5">
              <TaskStatusBadge status={task.status} />
              <TaskPriorityBadge priority={task.priority} />
              {task.hasActiveBlocker && <TaskBlockerIndicator />}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
