import { getRecentActivities, getProjectById } from "@/domain/selectors";
import { ActivityFeed, type ActivityFeedEntry } from "@/components/activity/ActivityFeed";

const RECENT_LIMIT = 8;

/**
 * Recent Activity (Phase 7 §6) — workspace-wide feed, newest first.
 * Lowest visual priority of the six Dashboard sections per the
 * approved information hierarchy, but no longer plain unstyled text
 * (visual-balance pass): renders through the shared `ActivityFeed`,
 * the same component the Project Overview/Activity tab use.
 */
export function RecentActivity() {
  const activities = getRecentActivities(RECENT_LIMIT);

  const entries: ActivityFeedEntry[] = activities.map((activity) => {
    const project = getProjectById(activity.projectId);
    return {
      id: activity.id,
      type: activity.type,
      summary: activity.summary,
      occurredAt: activity.occurredAt,
      relatedLabel: project?.name,
      relatedHref: project ? `/projects/${project.id}` : undefined,
    };
  });

  return <ActivityFeed entries={entries} emptyDescription="Workspace activity will appear here." />;
}
