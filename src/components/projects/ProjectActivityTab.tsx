import { getProjectActivity, getTasksForProject } from "@/domain/selectors";
import { requireProject } from "@/components/projects/requireProject";
import { ActivityFeed, type ActivityFeedEntry } from "@/components/activity/ActivityFeed";

/**
 * Project-scoped Activity tab (Phase 8 §9) — the full chronological
 * feed for this project (no limit), from the existing Activity
 * records only. Nothing here is invented. Renders through the shared
 * `ActivityFeed` component (visual-balance pass) rather than a
 * one-off plain list — the project itself is already the page
 * context, so the related-entity slot shows the task instead.
 */
export function ProjectActivityTab({ projectId }: { projectId: string }) {
  requireProject(projectId);
  const activity = getProjectActivity(projectId);
  const taskTitleById = new Map(
    getTasksForProject(projectId).map((t) => [t.id, t.title]),
  );

  const entries: ActivityFeedEntry[] = activity.map((entry) => ({
    id: entry.id,
    type: entry.type,
    summary: entry.summary,
    occurredAt: entry.occurredAt,
    relatedLabel: entry.taskId ? taskTitleById.get(entry.taskId) : undefined,
    relatedHref: entry.taskId ? `/tasks/${entry.taskId}` : undefined,
  }));

  return (
    <ActivityFeed
      entries={entries}
      emptyDescription="Changes to this project's tasks will appear here."
    />
  );
}
