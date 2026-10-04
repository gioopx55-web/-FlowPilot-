"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { List, LayoutGrid, Search } from "lucide-react";
import type { Project, TeamMember } from "@/types/entities";
import { TASK_STATUS_OPTIONS } from "@/components/tasks/taskLabels";
import { cn } from "@/lib/utils";

const selectClassName =
  "h-9 rounded-sm border border-border bg-background px-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/70";

const SORT_OPTIONS = [
  { value: "dueDate", label: "Sort: Due date" },
  { value: "priority", label: "Sort: Priority" },
  { value: "created", label: "Sort: Recently created" },
  { value: "project", label: "Sort: Project" },
  { value: "assignee", label: "Sort: Assignee" },
];

/**
 * Tasks filters + List/Kanban view toggle (Phase 9 §1-§3), reused
 * identically by /tasks and the Project Tasks tab (projects
 * omitted/hidden when already scoped to one project). Status filter
 * is hidden in Kanban view — the board's columns already are the
 * status grouping, so a status filter control there would have no
 * visible effect. State lives in the URL via `router.replace`, same
 * pattern as ProjectsFilters.tsx.
 */
export function TasksFilters({
  projects,
  teamMembers,
  showProjectFilter = true,
}: {
  projects: Project[];
  teamMembers: TeamMember[];
  showProjectFilter?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view = searchParams.get("view") === "kanban" ? "kanban" : "list";

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <div className="relative">
        <Search
          className="pointer-events-none absolute inset-y-0 start-2 my-auto size-4 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="search"
          aria-label="Search tasks by title"
          placeholder="Search tasks…"
          defaultValue={searchParams.get("q") ?? ""}
          onChange={(e) => setParam("q", e.target.value)}
          className="h-9 w-48 rounded-sm border border-border bg-background ps-8 pe-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/70 sm:w-56"
        />
      </div>

      {showProjectFilter && (
        <select
          aria-label="Filter by project"
          value={searchParams.get("project") ?? "all"}
          onChange={(e) => setParam("project", e.target.value)}
          className={selectClassName}
        >
          <option value="all">All projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      )}

      <select
        aria-label="Filter by assignee"
        value={searchParams.get("assignee") ?? "all"}
        onChange={(e) => setParam("assignee", e.target.value)}
        className={selectClassName}
      >
        <option value="all">All assignees</option>
        {teamMembers.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>

      {view === "list" && (
        <select
          aria-label="Filter by status"
          value={searchParams.get("status") ?? "all"}
          onChange={(e) => setParam("status", e.target.value)}
          className={selectClassName}
        >
          <option value="all">All statuses</option>
          {TASK_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      <select
        aria-label="Filter by priority"
        value={searchParams.get("priority") ?? "all"}
        onChange={(e) => setParam("priority", e.target.value)}
        className={selectClassName}
      >
        <option value="all">Any priority</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      {view === "list" && (
        <select
          aria-label="Sort tasks"
          value={searchParams.get("sort") ?? "dueDate"}
          onChange={(e) => setParam("sort", e.target.value)}
          className={selectClassName}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      <div className="ms-auto flex items-center gap-1" role="group" aria-label="View">
        <button
          type="button"
          aria-pressed={view === "list"}
          onClick={() => setParam("view", "list")}
          className={cn(
            "flex h-9 items-center gap-1.5 rounded-sm border border-border px-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring/70",
            view === "list"
              ? "bg-accent text-foreground"
              : "text-muted-foreground hover:bg-accent",
          )}
        >
          <List className="size-4" aria-hidden="true" />
          List
        </button>
        <button
          type="button"
          aria-pressed={view === "kanban"}
          onClick={() => setParam("view", "kanban")}
          className={cn(
            "flex h-9 items-center gap-1.5 rounded-sm border border-border px-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring/70",
            view === "kanban"
              ? "bg-accent text-foreground"
              : "text-muted-foreground hover:bg-accent",
          )}
        >
          <LayoutGrid className="size-4" aria-hidden="true" />
          Kanban
        </button>
      </div>
    </div>
  );
}
