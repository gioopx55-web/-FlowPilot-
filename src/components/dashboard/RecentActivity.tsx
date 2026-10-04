import { getRecentActivities, getProjectById } from "@/domain/selectors";

const RECENT_LIMIT = 8;

/**
 * Recent Activity (Phase 7 §6). Lowest visual priority of the six
 * sections, per the approved information hierarchy — a plain
 * chronological feed, no badges or color coding.
 */
export function RecentActivity() {
  const activities = getRecentActivities(RECENT_LIMIT);

  if (activities.length === 0) {
    return <p className="text-sm text-muted-foreground">No recent activity.</p>;
  }

  return (
    <ul className="space-y-2">
      {activities.map((activity) => {
        const project = getProjectById(activity.projectId);
        return (
          <li key={activity.id} className="flex items-baseline justify-between gap-4 text-xs">
            <span className="text-foreground">
              {activity.summary}
              {project && (
                <span className="text-muted-foreground"> · {project.name}</span>
              )}
            </span>
            <time
              dateTime={activity.occurredAt}
              className="shrink-0 whitespace-nowrap text-muted-foreground"
            >
              {new Date(activity.occurredAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </time>
          </li>
        );
      })}
    </ul>
  );
}
