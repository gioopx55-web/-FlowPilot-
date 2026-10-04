import Link from "next/link";
import { getOverdueTasksSorted } from "@/domain/selectors";
import { TaskPriorityBadge } from "@/components/primitives/StatusBadge";

const DASHBOARD_LIMIT = 6;

/**
 * Overdue Tasks (Phase 7 §3). Shows a useful subset (most overdue
 * first, via getOverdueTasksSorted) rather than every overdue task,
 * with a link to the full filtered Tasks list for the rest.
 */
export function OverdueTasks() {
  const entries = getOverdueTasksSorted();

  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">No overdue tasks right now.</p>;
  }

  const visible = entries.slice(0, DASHBOARD_LIMIT);

  return (
    <ul className="divide-y divide-border rounded-md border border-border">
      {visible.map(({ task, daysOverdue, project, assignee }) => (
        <li key={task.id} className="flex flex-col gap-2 p-3">
          <Link
            href={`/tasks/${task.id}`}
            className="min-w-0 flex-1 outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
          >
            <span className="block truncate text-sm font-medium text-foreground hover:underline">
              {task.title}
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              {project?.name ?? "Unknown project"} · {assignee?.name ?? "Unassigned"} ·{" "}
              {daysOverdue} day{daysOverdue === 1 ? "" : "s"} overdue
            </span>
          </Link>
          <span className="self-start">
            <TaskPriorityBadge priority={task.priority} />
          </span>
        </li>
      ))}
    </ul>
  );
}
