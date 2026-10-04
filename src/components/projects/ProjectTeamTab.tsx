import Link from "next/link";
import { Users } from "lucide-react";
import { getProjectAssignedMembers, getTeamMemberWorkload } from "@/domain/selectors";
import { requireProject } from "@/components/projects/requireProject";
import { WorkloadBadge } from "@/components/primitives/WorkloadBadge";
import { EmptyState } from "@/components/primitives/EmptyState";

/**
 * Project-scoped Team tab (Phase 8 §8). Membership is DERIVED from
 * task assignments (getProjectAssignedMembers) — there is no
 * separately authored project-team list. `assignedHours`/`taskCount`
 * here are project-scoped and must never be confused with the
 * member's global workload, which is shown separately and labeled
 * "Global" explicitly.
 */
export function ProjectTeamTab({ projectId }: { projectId: string }) {
  requireProject(projectId);
  const members = getProjectAssignedMembers(projectId);

  if (members.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No one is assigned yet"
        description="Team members appear here once they're assigned a task on this project."
      />
    );
  }

  return (
    <ul className="divide-y divide-border rounded-md border border-border">
      {members.map(({ member, taskCount, assignedHours, fallbackTaskIds }) => {
        const globalWorkload = getTeamMemberWorkload(member.id);
        return (
          <li key={member.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <Link
                href={`/team/${member.id}`}
                className="text-sm font-medium text-foreground outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/70"
              >
                {member.name}
              </Link>
              <p className="text-xs text-muted-foreground">{member.jobTitle}</p>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
              <div>
                <p className="text-muted-foreground">On this project</p>
                <p className="text-sm font-medium text-foreground">
                  {taskCount} task{taskCount === 1 ? "" : "s"} · {assignedHours}h
                  {fallbackTaskIds.length > 0 && (
                    <span className="text-muted-foreground"> (est.)</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Global workload</p>
                <WorkloadBadge workload={globalWorkload} />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
