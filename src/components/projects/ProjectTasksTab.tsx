import Link from "next/link";
import { ListChecks, LayoutGrid } from "lucide-react";
import { getTasksForProject, getTeamMemberById } from "@/domain/selectors";
import { requireProject } from "@/components/projects/requireProject";
import { TaskStatusBadge, TaskPriorityBadge } from "@/components/primitives/StatusBadge";
import { EmptyState } from "@/components/primitives/EmptyState";
import { formatShortDate } from "@/lib/format";

/**
 * Project-scoped Tasks tab (Phase 8 §7). Reads the SAME Task records
 * the future global Tasks module will use (getTasksForProject filters
 * the one shared dataset) — no separate per-project task data exists.
 * List/Kanban toggle: Kanban is intentionally disabled, not faked,
 * per the Phase 8 instruction to label unavailable Phase 9 behavior
 * rather than pretend it exists.
 */
export function ProjectTasksTab({ projectId }: { projectId: string }) {
  requireProject(projectId);
  const tasks = getTasksForProject(projectId);

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={ListChecks}
        title="No tasks yet"
        description="Tasks added to this project will show up here."
      />
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-1" role="group" aria-label="View">
        <span className="flex h-9 items-center gap-1.5 rounded-sm border border-border bg-accent px-3 text-sm font-medium text-foreground">
          <ListChecks className="size-4" aria-hidden="true" />
          List
        </span>
        <span
          className="flex h-9 cursor-not-allowed items-center gap-1.5 rounded-sm border border-border px-3 text-sm text-muted-foreground opacity-60"
          aria-disabled="true"
          title="Kanban is coming in Phase 9"
        >
          <LayoutGrid className="size-4" aria-hidden="true" />
          Kanban
          <span className="ms-1 text-xs">(Phase 9)</span>
        </span>
      </div>

      {/* Desktop/tablet table */}
      <table className="hidden w-full border-collapse text-sm md:table">
        <thead>
          <tr className="border-b border-border text-xs text-muted-foreground">
            <th className="px-3 py-2 text-start font-medium">Task</th>
            <th className="px-3 py-2 text-start font-medium">Status</th>
            <th className="px-3 py-2 text-start font-medium">Priority</th>
            <th className="px-3 py-2 text-start font-medium">Assignee</th>
            <th className="px-3 py-2 text-start font-medium">Due</th>
            <th className="px-3 py-2 text-start font-medium">Est. hours</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {tasks.map((task) => {
            const assignee = task.assigneeId ? getTeamMemberById(task.assigneeId) : undefined;
            return (
              <tr key={task.id} className="hover:bg-accent">
                <td className="px-3 py-2.5">
                  <Link
                    href={`/tasks/${task.id}`}
                    className="font-medium text-foreground outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/70"
                  >
                    {task.title}
                  </Link>
                </td>
                <td className="px-3 py-2.5">
                  <TaskStatusBadge status={task.status} />
                </td>
                <td className="px-3 py-2.5">
                  <TaskPriorityBadge priority={task.priority} />
                </td>
                <td className="px-3 py-2.5 text-muted-foreground">
                  {assignee?.name ?? "Unassigned"}
                </td>
                <td className="px-3 py-2.5 text-muted-foreground">
                  {formatShortDate(task.dueDate)}
                </td>
                <td className="px-3 py-2.5 text-muted-foreground">
                  {task.estimatedHours !== undefined ? `${task.estimatedHours}h` : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Mobile stacked list */}
      <ul className="divide-y divide-border rounded-md border border-border md:hidden">
        {tasks.map((task) => {
          const assignee = task.assigneeId ? getTeamMemberById(task.assigneeId) : undefined;
          return (
            <li key={task.id} className="flex flex-col gap-2 p-3">
              <Link
                href={`/tasks/${task.id}`}
                className="outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
              >
                <span className="block text-sm font-medium text-foreground hover:underline">
                  {task.title}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {assignee?.name ?? "Unassigned"} · due {formatShortDate(task.dueDate)}
                  {task.estimatedHours !== undefined && ` · ${task.estimatedHours}h`}
                </span>
              </Link>
              <div className="flex flex-wrap items-center gap-1.5">
                <TaskStatusBadge status={task.status} />
                <TaskPriorityBadge priority={task.priority} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
