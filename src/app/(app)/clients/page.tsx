import { Suspense } from "react";
import { getClientsFiltered, type ClientSortKey, type ClientListFilters } from "@/domain/selectors";
import type { ClientStatus } from "@/types/entities";
import { ClientsFilters } from "@/components/clients/ClientsFilters";
import { ClientsTable } from "@/components/clients/ClientsTable";
import { PageHeader } from "@/components/primitives/PageHeader";

type SearchParams = Record<string, string | string[] | undefined>;

const VALID_STATUSES: ClientStatus[] = ["active", "retainer", "dormant"];
const VALID_SORTS: ClientSortKey[] = ["attention", "lastInteraction", "name", "activeProjects"];

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseFilters(sp: SearchParams): ClientListFilters {
  const status = first(sp.status);
  return {
    query: first(sp.q),
    status: VALID_STATUSES.includes(status as ClientStatus) ? (status as ClientStatus) : undefined,
    followUpOnly: first(sp.followUp) === "1",
  };
}

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const filters = parseFilters(sp);
  const sortParam = first(sp.sort);
  const sort: ClientSortKey = VALID_SORTS.includes(sortParam as ClientSortKey)
    ? (sortParam as ClientSortKey)
    : "attention";

  const entries = getClientsFiltered(filters, sort);

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title="Clients"
        description="Every client relationship, with follow-up risk surfaced automatically."
      />
      <Suspense fallback={null}>
        <ClientsFilters />
      </Suspense>
      <ClientsTable entries={entries} />
    </div>
  );
}
