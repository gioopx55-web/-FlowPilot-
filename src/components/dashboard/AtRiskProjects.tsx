import Link from "next/link";
import { getAtRiskProjectsSorted } from "@/domain/selectors";
import { RiskBadge } from "@/components/primitives/RiskBadge";

/**
 * At-Risk Projects (Phase 7 §2). Risk is read entirely from
 * getAtRiskProjectsSorted() — computeProjectRisk is never called
 * again here.
 */
export function AtRiskProjects() {
  const entries = getAtRiskProjectsSorted();

  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">No projects are currently at risk.</p>;
  }

  return (
    <ul className="divide-y divide-border rounded-md border border-border">
      {entries.map(({ project, risk, client }) => (
        <li key={project.id} className="flex flex-col gap-2 p-3">
          <Link
            href={`/projects/${project.id}`}
            className="min-w-0 flex-1 outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
          >
            <span className="block truncate text-sm font-medium text-foreground hover:underline">
              {project.name}
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              {client?.name ?? "Unknown client"} · {project.progressPct}% complete
              {project.dueDate &&
                ` · due ${new Date(project.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
            </span>
          </Link>
          <RiskBadge risk={risk} />
        </li>
      ))}
    </ul>
  );
}
