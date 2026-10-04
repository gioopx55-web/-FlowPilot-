import { Suspense } from "react";
import { ListChecks } from "lucide-react";
import { getTasksFiltered, getTaskDetail } from "@/domain/selectors";
import { getDemoDataset } from "@/data/mock";
import { requireProject } from "@/components/projects/requireProject";
import { EmptyState } from "@/components/primitives/EmptyState";
import { TasksView } from "@/components/tasks/TasksView";
import {
  parseTaskFilters,
  parseTaskSort,
  parseTaskView,
  firstParam,
  type SearchParams,
} from "@/components/tasks/parseTaskSearchParams";

/**
 * Project-scoped Tasks tab (Phase 8 §7, Phase 9 §14). Reuses the exact
 * same TasksView/TasksTable/KanbanBoard/TaskDetailPanel Phase 9 built
 * for the global Tasks module, scoped by `projectId` via the same
 * `getTasksFiltered` selector — no separate Project Kanban
 * implementation, no duplicated Task data. The project filter control
 * is hidden (already scoped); opening a task sets `?task=` on THIS
 * project-tasks URL, preserving project context exactly as Phase 8
 * required.
 */
export async function ProjectTasksTab({
  projectId,
  searchParams,
}: {
  projectId: string;
  searchParams: SearchParams;
}) {
  requireProject(projectId);

  const view = parseTaskView(searchParams);
  const sort = parseTaskSort(searchParams);
  const filters = parseTaskFilters(searchParams, { projectId });
  const entries = getTasksFiltered(filters, sort);

  if (entries.length === 0) {
    return (
      <EmptyState
        icon={ListChecks}
        title="No tasks yet"
        description="Tasks added to this project will show up here."
      />
    );
  }

  const { teamMembers, projects } = getDemoDataset();
  const taskId = firstParam(searchParams.task);
  const selectedTaskDetail = taskId ? getTaskDetail(taskId) : undefined;

  return (
    <Suspense fallback={null}>
      <TasksView
        entries={entries}
        teamMembers={teamMembers}
        projects={projects}
        view={view}
        selectedTaskDetail={selectedTaskDetail}
        showProjectFilter={false}
      />
    </Suspense>
  );
}
