import Link from "next/link";
import { Users } from "lucide-react";
import type { TeamMemberWithWorkloadEntry } from "@/domain/selectors";
import { WorkloadBadge } from "@/components/primitives/WorkloadBadge";
import { EmptyState } from "@/components/primitives/EmptyState";

/**
 * Dense team list (Phase 12 §1) — same dual rendering pattern as
 * ProjectsTable/TasksTable/ClientsTable: a real <table> at md+, an
 * always-stacked list below it, both from the same data, no
 * viewport-detection JS (Phase 7's hard-won lesson, applied from the
 * start here as in every phase since).
 */
export function TeamTable({ entries }: { entries: TeamMemberWithWorkloadEntry[] }) {
  if (entries.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No team members match your filters"
        description="Try a different search term or clear your filters."
      />
    );
  }

  return (
    <>
      <table className="hidden w-full border-collapse text-sm md:table">
        <thead>
          <tr className="border-b border-border text-xs text-muted-foreground">
            <th className="px-3 py-2 text-start font-medium">Member</th>
            <th className="px-3 py-2 text-start font-medium">Workload</th>
            <th className="px-3 py-2 text-start font-medium">Hours</th>
            <th className="px-3 py-2 text-start font-medium">Active tasks</th>
            <th className="px-3 py-2 text-start font-medium">Active projects</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {entries.map(({ member, workload, activeTaskCount, activeProjectCount }) => (
            <tr key={member.id} className="hover:bg-accent">
              <td className="px-3 py-2.5">
                <Link
                  href={`/team/${member.id}`}
                  className="rounded-sm text-start font-medium text-foreground outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/70"
                >
                  {member.name}
                </Link>
                <p className="text-xs text-muted-foreground">{member.jobTitle}</p>
              </td>
              <td className="px-3 py-2.5">
                <WorkloadBadge workload={workload} />
              </td>
              <td className="px-3 py-2.5 text-muted-foreground">
                {workload.assignedHours}h / {workload.weeklyCapacityHours}h
                {workload.fallbackTaskIds.length > 0 && (
                  <span className="text-muted-foreground"> (est.)</span>
                )}
              </td>
              <td className="px-3 py-2.5 text-muted-foreground">{activeTaskCount}</td>
              <td className="px-3 py-2.5 text-muted-foreground">{activeProjectCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="space-y-2 md:hidden">
        {entries.map(({ member, workload, activeTaskCount, activeProjectCount }) => (
          <li key={member.id} className="rounded-md border border-border p-3">
            <Link
              href={`/team/${member.id}`}
              className="rounded-sm text-sm font-medium text-foreground outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/70"
            >
              {member.name}
            </Link>
            <p className="text-xs text-muted-foreground">{member.jobTitle}</p>
            <div className="mt-2">
              <WorkloadBadge workload={workload} />
            </div>
            <dl className="mt-2 grid grid-cols-3 gap-2 text-xs">
              <div>
                <dt className="text-muted-foreground">Hours</dt>
                <dd className="text-foreground">
                  {workload.assignedHours}h / {workload.weeklyCapacityHours}h
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Tasks</dt>
                <dd className="text-foreground">{activeTaskCount}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Projects</dt>
                <dd className="text-foreground">{activeProjectCount}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}
