"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { Project, TeamMember } from "@/types/entities";
import type { TaskDetailEntry, TaskListEntry } from "@/domain/selectors";
import { TasksFilters } from "@/components/tasks/TasksFilters";
import { TasksTable } from "@/components/tasks/TasksTable";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";
import { TaskDetailPanel } from "@/components/tasks/TaskDetailPanel";

/**
 * Shared Tasks orchestrator (Phase 9 §1/§9/§14) — used identically by
 * `/tasks` and the Project Tasks tab (`showProjectFilter`/
 * `showProjectColumn` false when already scoped to one project).
 * Opening a task sets `?task=<id>` on the CURRENT path via
 * `router.replace` rather than navigating to `/tasks/:taskId` — the
 * underlying list/Kanban/filters never unmount, which is what
 * preserves context (Phase 2 §11.10, Phase 9 §9). Closing removes the
 * param. All filter/sort/view state also lives in the URL, so the
 * whole state (filters + open task) is one shareable link.
 */
export function TasksView({
  entries,
  teamMembers,
  projects,
  view,
  selectedTaskDetail,
  showProjectFilter = true,
}: {
  entries: TaskListEntry[];
  teamMembers: TeamMember[];
  projects: Project[];
  view: "list" | "kanban";
  selectedTaskDetail: TaskDetailEntry | undefined;
  showProjectFilter?: boolean;
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
    <div>
      <TasksFilters
        projects={projects}
        teamMembers={teamMembers}
        showProjectFilter={showProjectFilter}
      />

      {view === "kanban" ? (
        <KanbanBoard entries={entries} showProject={showProjectFilter} onOpenTask={openTask} />
      ) : (
        <TasksTable entries={entries} showProject={showProjectFilter} onOpenTask={openTask} />
      )}

      <TaskDetailPanel
        open={selectedTaskDetail !== undefined}
        onOpenChange={(open) => {
          if (!open) closeTask();
        }}
        detail={selectedTaskDetail}
        teamMembers={teamMembers}
      />
    </div>
  );
}
