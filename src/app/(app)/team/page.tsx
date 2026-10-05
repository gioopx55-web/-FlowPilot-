import { Suspense } from "react";
import { getTeamMembersFiltered, type TeamSortKey, type TeamListFilters } from "@/domain/selectors";
import type { WorkloadBand } from "@/domain/workload/workload";
import { TeamFilters } from "@/components/team/TeamFilters";
import { TeamTable } from "@/components/team/TeamTable";
import { PageHeader } from "@/components/primitives/PageHeader";

type SearchParams = Record<string, string | string[] | undefined>;

const VALID_BANDS: WorkloadBand[] = ["Overloaded", "High", "Healthy", "Available"];
const VALID_SORTS: TeamSortKey[] = ["workload", "name"];

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseFilters(sp: SearchParams): TeamListFilters {
  const band = first(sp.band);
  return {
    query: first(sp.q),
    band: VALID_BANDS.includes(band as WorkloadBand) ? (band as WorkloadBand) : undefined,
  };
}

export default async function TeamPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const filters = parseFilters(sp);
  const sortParam = first(sp.sort);
  const sort: TeamSortKey = VALID_SORTS.includes(sortParam as TeamSortKey)
    ? (sortParam as TeamSortKey)
    : "workload";

  const entries = getTeamMembersFiltered(filters, sort);

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title="Team"
        description="Workload across the team, always explainable — never a bare percentage."
      />
      <Suspense fallback={null}>
        <TeamFilters />
      </Suspense>
      <TeamTable entries={entries} />
    </div>
  );
}
