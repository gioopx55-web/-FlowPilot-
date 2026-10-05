import { Suspense } from "react";
import { ListChecks } from "lucide-react";
import {
  getTeamMemberDetail,
  getMemberAssignmentsGroupedByProject,
  getMemberWorkloadContributors,
  getTaskDetail,
} from "@/domain/selectors";
import { getDemoDataset } from "@/data/mock";
import { requireTeamMember } from "@/components/team/requireTeamMember";
import { Section } from "@/components/primitives/Section";
import { EmptyState } from "@/components/primitives/EmptyState";
import { MemberWorkloadExplanation } from "@/components/team/MemberWorkloadExplanation";
import { MemberAssignmentsView } from "@/components/team/MemberAssignmentsView";
import { TeamMemberAIActions } from "@/components/ai/TeamMemberAIActions";

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Team Member Detail (Phase 12 §5) — one scrollable page, intentionally
 * shallow (no nested tabs): a header, a workload explanation, and
 * assignments grouped by project. `requireTeamMember` is the D-036
 * guard; `team/not-found.tsx` lives in the parent segment.
 */
export default async function TeamMemberDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ memberId: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { memberId } = await params;
  requireTeamMember(memberId);
  const sp = await searchParams;

  const detail = getTeamMemberDetail(memberId)!;
  const groups = getMemberAssignmentsGroupedByProject(memberId);
  const contributors = getMemberWorkloadContributors(memberId);
  const { teamMembers } = getDemoDataset();
  const taskId = first(sp.task);
  const selectedTaskDetail = taskId ? getTaskDetail(taskId) : undefined;

  return (
    <div className="mx-auto max-w-[1440px] space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-foreground">{detail.member.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{detail.member.jobTitle}</p>
        </div>
        <TeamMemberAIActions memberId={detail.member.id} memberName={detail.member.name} />
      </div>

      <Section title="Workload">
        <MemberWorkloadExplanation workload={detail.workload} contributors={contributors} />
      </Section>

      <Section title="Assignments">
        {groups.length === 0 ? (
          <EmptyState
            icon={ListChecks}
            title="No assignments yet"
            description={`${detail.member.name} has no tasks assigned right now.`}
          />
        ) : (
          <Suspense fallback={null}>
            <MemberAssignmentsView
              groups={groups}
              teamMembers={teamMembers}
              selectedTaskDetail={selectedTaskDetail}
            />
          </Suspense>
        )}
      </Section>
    </div>
  );
}
