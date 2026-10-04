import { Suspense } from "react";
import { getTasksFiltered, getTaskDetail } from "@/domain/selectors";
import { getDemoDataset } from "@/data/mock";
import { TasksView } from "@/components/tasks/TasksView";
import {
  parseTaskFilters,
  parseTaskSort,
  parseTaskView,
  firstParam,
  type SearchParams,
} from "@/components/tasks/parseTaskSearchParams";

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const view = parseTaskView(sp);
  const sort = parseTaskSort(sp);
  const filters = parseTaskFilters(sp, { projectId: firstParam(sp.project) });
  const entries = getTasksFiltered(filters, sort);

  const { teamMembers, projects } = getDemoDataset();
  const taskId = firstParam(sp.task);
  const selectedTaskDetail = taskId ? getTaskDetail(taskId) : undefined;

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="mb-4 text-lg font-semibold text-foreground">Tasks</h1>
      <Suspense fallback={null}>
        <TasksView
          entries={entries}
          teamMembers={teamMembers}
          projects={projects}
          view={view}
          selectedTaskDetail={selectedTaskDetail}
        />
      </Suspense>
    </div>
  );
}
