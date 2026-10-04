import { Suspense } from "react";
import { FolderKanban } from "lucide-react";
import type { ProjectListFilters, ProjectSortKey } from "@/domain/selectors";
import { getFilteredProjects } from "@/domain/selectors";
import type { ProjectStatus, RiskLevel } from "@/types/entities";
import { ProjectsFilters } from "@/components/projects/ProjectsFilters";
import { ProjectsTable } from "@/components/projects/ProjectsTable";
import { EmptyState } from "@/components/primitives/EmptyState";

const VALID_STATUSES: ProjectStatus[] = [
  "kickoff",
  "in_progress",
  "review",
  "completed",
  "on_hold",
];
const VALID_RISKS: RiskLevel[] = ["none", "at_risk", "critical_risk"];
const VALID_SORTS: ProjectSortKey[] = ["risk", "dueDate", "name", "progress"];

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** URL query-string -> typed filters. Mechanical mapping only — the
 *  filtering/sorting RULES live in domain/selectors.ts, not here. */
function parseFilters(sp: SearchParams): ProjectListFilters {
  const status = first(sp.status);
  const risk = first(sp.risk);
  const sort = first(sp.sort);
  return {
    status: VALID_STATUSES.includes(status as ProjectStatus)
      ? (status as ProjectStatus)
      : undefined,
    risk: VALID_RISKS.includes(risk as RiskLevel) ? (risk as RiskLevel) : undefined,
    clientId: first(sp.client),
    query: first(sp.q),
    sort: VALID_SORTS.includes(sort as ProjectSortKey) ? (sort as ProjectSortKey) : undefined,
  };
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const filters = parseFilters(sp);
  const entries = getFilteredProjects(filters);

  const clientOptions = Array.from(
    new Map(
      getFilteredProjects().map((e) => [e.project.clientId, e.client?.name ?? "Unknown client"]),
    ).entries(),
  ).sort((a, b) => a[1].localeCompare(b[1]));

  const hasActiveFilters =
    filters.status || filters.risk || filters.clientId || filters.query;

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="mb-4 text-lg font-semibold text-foreground">Projects</h1>

      <Suspense fallback={null}>
        <ProjectsFilters clientOptions={clientOptions} />
      </Suspense>

      {entries.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title={hasActiveFilters ? "No projects match your filters" : "No projects yet"}
          description={
            hasActiveFilters
              ? "Try a different search term or clear your filters."
              : "Projects will show up here once they exist."
          }
          action={hasActiveFilters ? { label: "Clear filters", href: "/projects" } : undefined}
        />
      ) : (
        <ProjectsTable entries={entries} />
      )}
    </div>
  );
}
