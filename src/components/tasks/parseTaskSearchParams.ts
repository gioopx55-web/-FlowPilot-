import type { TaskPriority, TaskStatus } from "@/types/entities";
import type { TaskListFilters, TaskSortKey } from "@/domain/selectors";

export type SearchParams = Record<string, string | string[] | undefined>;

const VALID_STATUSES: TaskStatus[] = ["todo", "in_progress", "blocked", "review", "done"];
const VALID_PRIORITIES: TaskPriority[] = ["low", "medium", "high"];
const VALID_SORTS: TaskSortKey[] = ["dueDate", "priority", "created", "project", "assignee"];

export function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * URL query-string -> typed task filters/sort/view, shared by /tasks
 * and the Project Tasks tab so the parsing (and the "status=overdue
 * means overdueOnly, not a literal status" mapping, per the Phase 7
 * Dashboard deep link) is written exactly once.
 */
export function parseTaskFilters(
  sp: SearchParams,
  extra: Partial<TaskListFilters> = {},
): TaskListFilters {
  const status = firstParam(sp.status);
  const priority = firstParam(sp.priority);
  return {
    query: firstParam(sp.q),
    assigneeId: firstParam(sp.assignee),
    status: VALID_STATUSES.includes(status as TaskStatus) ? (status as TaskStatus) : undefined,
    priority: VALID_PRIORITIES.includes(priority as TaskPriority)
      ? (priority as TaskPriority)
      : undefined,
    overdueOnly: status === "overdue",
    ...extra,
  };
}

export function parseTaskSort(sp: SearchParams): TaskSortKey {
  const sort = firstParam(sp.sort);
  return VALID_SORTS.includes(sort as TaskSortKey) ? (sort as TaskSortKey) : "dueDate";
}

export function parseTaskView(sp: SearchParams): "list" | "kanban" {
  return firstParam(sp.view) === "kanban" ? "kanban" : "list";
}
