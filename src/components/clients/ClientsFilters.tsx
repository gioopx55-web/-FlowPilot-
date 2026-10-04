"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "retainer", label: "Retainer" },
  { value: "dormant", label: "Dormant" },
];

const SORT_OPTIONS = [
  { value: "attention", label: "Sort: Needs attention" },
  { value: "lastInteraction", label: "Sort: Last interaction" },
  { value: "name", label: "Sort: Name" },
  { value: "activeProjects", label: "Sort: Active projects" },
];

const selectClassName =
  "h-9 rounded-sm border border-border bg-background px-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/70";

/**
 * Clients list filters (Phase 10 §2) — same URL-driven pattern as
 * ProjectsFilters/TasksFilters: `router.replace` keeps filtering off
 * browser history, deep-linkable, Back-restorable.
 */
export function ClientsFilters() {
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
          aria-label="Search clients by name or contact"
          placeholder="Search clients…"
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

      <label className="flex h-9 items-center gap-1.5 rounded-sm border border-border px-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={searchParams.get("followUp") === "1"}
          onChange={(e) => setParam("followUp", e.target.checked ? "1" : "")}
          className="size-4 rounded-sm border-border"
        />
        Needs follow-up only
      </label>

      <select
        aria-label="Sort clients"
        value={searchParams.get("sort") ?? "attention"}
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
