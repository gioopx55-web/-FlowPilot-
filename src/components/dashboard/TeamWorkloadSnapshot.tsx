import Link from "next/link";
import { getTeamWorkloadSnapshot } from "@/domain/selectors";
import { WorkloadBadge } from "@/components/primitives/WorkloadBadge";

const PRIORITY_LIMIT = 5;

/**
 * Team Workload Snapshot (Phase 7 §5). Overloaded/High surfaced
 * first (per getTeamWorkloadSnapshot's sort); Healthy/Available fill
 * remaining space up to a small cap, never a full progress-bar wall.
 */
export function TeamWorkloadSnapshot() {
  const entries = getTeamWorkloadSnapshot().slice(0, PRIORITY_LIMIT);

  return (
    <ul className="divide-y divide-border rounded-md border border-border">
      {entries.map(({ member, workload }) => (
        <li key={member.id} className="flex flex-col gap-2 p-3">
          <Link
            href={`/team/${member.id}`}
            className="min-w-0 flex-1 outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
          >
            <span className="block truncate text-sm font-medium text-foreground hover:underline">
              {member.name}
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              {member.jobTitle}
            </span>
          </Link>
          <WorkloadBadge workload={workload} />
        </li>
      ))}
    </ul>
  );
}
