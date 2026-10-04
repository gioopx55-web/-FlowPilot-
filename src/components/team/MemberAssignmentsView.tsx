"use client";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { TeamMember } from "@/types/entities";
import type { MemberProjectGroup, TaskDetailEntry } from "@/domain/selectors";
import { RiskBadge } from "@/components/primitives/RiskBadge";
import { TaskStatusBadge, TaskPriorityBadge, TaskBlockerIndicator } from "@/components/primitives/StatusBadge";
import { TaskDetailPanel } from "@/components/tasks/TaskDetailPanel";
import { PROJECT_STATUS_LABEL } from "@/components/projects/projectLabels";
import { Badge } from "@/components/primitives/Badge";
import { formatShortDate } from "@/lib/format";

/**
 * This member's assignments grouped by project (Phase 12 §6-§7).
 * Opening a task sets `?task=<id>` on THIS page's URL and reuses the
 * exact same `TaskDetailPanel`/`TaskDetailContent` Phase 9 built —
 * no duplicated task data or a second detail implementation.
 */
export function MemberAssignmentsView({
  groups,
  teamMembers,
  selectedTaskDetail,
}: {
  groups: MemberProjectGroup[];
  teamMembers: TeamMember[];
  selectedTaskDetail: TaskDetailEntry | undefined;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function openTask(taskId: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("task", taskId);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function closeTask() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("task");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <>
      <div className="space-y-6">
        {groups.map((group) => (
          <div key={group.project.id}>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Link
                href={`/projects/${group.project.id}`}
                className="rounded-sm text-sm font-medium text-foreground outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/70"
              >
                {group.project.name}
              </Link>
              <Badge tone="neutral">{PROJECT_STATUS_LABEL[group.project.status]}</Badge>
              <RiskBadge risk={group.risk} />
              <span className="ms-auto text-xs text-muted-foreground">
                {group.assignedHours}h on this project
                {group.fallbackTaskIds.length > 0 && " (est.)"}
              </span>
            </div>

            <ul className="divide-y divide-border rounded-md border border-border">
              {group.tasks.map(({ task, isOverdue }) => (
                <li key={task.id} className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <button
                      type="button"
                      onClick={() => openTask(task.id)}
                      className="rounded-sm text-start text-sm font-medium text-foreground outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/70"
                    >
                      {task.title}
                    </button>
                    {task.hasActiveBlocker && (
                      <span className="ms-2 inline-block align-middle">
                        <TaskBlockerIndicator />
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <TaskStatusBadge status={task.status} />
                    <TaskPriorityBadge priority={task.priority} />
                    <span className={isOverdue ? "text-[var(--fp-danger)]" : "text-muted-foreground"}>
                      {formatShortDate(task.dueDate)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <TaskDetailPanel
        open={selectedTaskDetail !== undefined}
        onOpenChange={(open) => {
          if (!open) closeTask();
        }}
        detail={selectedTaskDetail}
        teamMembers={teamMembers}
      />
    </>
  );
}
