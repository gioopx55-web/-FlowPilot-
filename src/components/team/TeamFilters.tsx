"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";

const BAND_OPTIONS = [
  { value: "all", label: "All workload bands" },
  { value: "Overloaded", label: "Overloaded" },
  { value: "High", label: "High" },
  { value: "Healthy", label: "Healthy" },
  { value: "Available", label: "Available" },
];

const SORT_OPTIONS = [
  { value: "workload", label: "Sort: Needs attention" },
  { value: "name", label: "Sort: Name" },
];

const selectClassName =
  "h-9 rounded-sm border border-border bg-background px-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/70";

/**
 * Team list filters (Phase 12 §2) — same URL-driven pattern as
 * ClientsFilters/ProjectsFilters/TasksFilters. No active/inactive
 * control: every Phase 6 fixture member is active, and adding a
 * control that could never actually filter anything would be
 * exactly the "advanced HR filtering for its own sake" the brief
 * warns against (Phase 12 §2/§11).
 */
export function TeamFilters() {
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
          aria-label="Search team by name or job title"
          placeholder="Search team…"
          defaultValue={searchParams.get("q") ?? ""}
          onChange={(e) => setParam("q", e.target.value)}
          className="h-9 w-48 rounded-sm border border-border bg-background ps-8 pe-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/70 sm:w-56"
        />
      </div>

      <select
        aria-label="Filter by workload band"
        value={searchParams.get("band") ?? "all"}
        onChange={(e) => setParam("band", e.target.value)}
        className={selectClassName}
      >
        {BAND_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        aria-label="Sort team"
        value={searchParams.get("sort") ?? "workload"}
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
