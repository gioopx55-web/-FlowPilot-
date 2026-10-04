"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "kickoff", label: "Kickoff" },
  { value: "in_progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "completed", label: "Completed" },
  { value: "on_hold", label: "On Hold" },
];

const RISK_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "Any risk" },
  { value: "critical_risk", label: "Critical Risk" },
  { value: "at_risk", label: "At Risk" },
  { value: "none", label: "No risk" },
];

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "risk", label: "Sort: Risk" },
  { value: "dueDate", label: "Sort: Due date" },
  { value: "name", label: "Sort: Name" },
  { value: "progress", label: "Sort: Progress" },
];

const selectClassName =
  "h-9 rounded-sm border border-border bg-background px-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/70";

/**
 * Projects list filters (Phase 8 §2). Reflects state in the URL query
 * string so filtered views are deep-linkable and browser Back
 * restores the prior filter state. Uses `replace` (not `push`) so
 * every keystroke/selection doesn't flood browser history — the list
 * page itself stays one history entry, and navigating into a project
 * (a real `push`) still returns here correctly on Back.
 */
export function ProjectsFilters({
  clientOptions,
}: {
  clientOptions: [string, string][];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
          aria-label="Search projects by name"
          placeholder="Search projects…"
          defaultValue={searchParams.get("q") ?? ""}
          onChange={(e) => setParam("q", e.target.value)}
          className="h-9 w-48 rounded-sm border border-border bg-background ps-8 pe-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/70 sm:w-56"
        />
      </div>

      <select
        aria-label="Filter by status"
        value={searchParams.get("status") ?? "all"}
        onChange={(e) => setParam("status", e.target.value)}
        className={selectClassName}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        aria-label="Filter by risk level"
        value={searchParams.get("risk") ?? "all"}
        onChange={(e) => setParam("risk", e.target.value)}
        className={selectClassName}
      >
        {RISK_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        aria-label="Filter by client"
        value={searchParams.get("client") ?? "all"}
        onChange={(e) => setParam("client", e.target.value)}
        className={selectClassName}
      >
        <option value="all">All clients</option>
        {clientOptions.map(([id, name]) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>

      <select
        aria-label="Sort projects"
        value={searchParams.get("sort") ?? "risk"}
        onChange={(e) => setParam("sort", e.target.value)}
        className={`${selectClassName} ms-auto`}
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
