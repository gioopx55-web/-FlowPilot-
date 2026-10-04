import { History } from "lucide-react";
import { getProjectActivity, getUserById, getTasksForProject } from "@/domain/selectors";
import { requireProject } from "@/components/projects/requireProject";
import { EmptyState } from "@/components/primitives/EmptyState";
import { formatShortDate } from "@/lib/format";

/**
 * Project-scoped Activity tab (Phase 8 §9) — the full chronological
 * feed for this project (no limit), from the existing Activity
 * records only. Nothing here is invented.
 */
export function ProjectActivityTab({ projectId }: { projectId: string }) {
  requireProject(projectId);
  const activity = getProjectActivity(projectId);

  if (activity.length === 0) {
    return (
      <EmptyState
        icon={History}
        title="No activity yet"
        description="Changes to this project's tasks will appear here."
      />
    );
  }

  const taskTitleById = new Map(
    getTasksForProject(projectId).map((t) => [t.id, t.title]),
  );

  return (
    <ul className="divide-y divide-border rounded-md border border-border">
      {activity.map((entry) => {
        const actor = entry.actorUserId ? getUserById(entry.actorUserId) : undefined;
        const taskTitle = entry.taskId ? taskTitleById.get(entry.taskId) : undefined;
        return (
          <li key={entry.id} className="flex items-start justify-between gap-4 p-3 text-sm">
            <div className="min-w-0">
              <p className="text-foreground">{entry.summary}</p>
              <p className="text-xs text-muted-foreground">
                {actor?.displayName ?? "System"}
                {taskTitle && ` · ${taskTitle}`}
              </p>
            </div>
            <time
              dateTime={entry.occurredAt}
              className="shrink-0 whitespace-nowrap text-xs text-muted-foreground"
            >
              {formatShortDate(entry.occurredAt)}
            </time>
          </li>
        );
      })}
    </ul>
  );
}
