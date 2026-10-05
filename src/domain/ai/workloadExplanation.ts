import type { TeamMember } from "@/types/entities";
import type { TeamMemberWorkloadResult } from "@/domain/workload/workload";
import {
  getTeamMemberDetail,
  getMemberWorkloadContributors,
  type MemberWorkloadContributor,
} from "@/domain/selectors";

export interface AIWorkloadExplanation {
  member: TeamMember;
  workload: TeamMemberWorkloadResult;
  contributors: MemberWorkloadContributor[];
}

/**
 * "Why is this member overloaded?" (Phase 13 §9) — pure reuse of the
 * Phase 12 Team selectors (`getTeamMemberDetail`,
 * `getMemberWorkloadContributors`), which themselves only read the
 * one shared `computeTeamMemberWorkload`. No workload math here.
 */
export function buildWorkloadExplanation(memberId: string): AIWorkloadExplanation | undefined {
  const detail = getTeamMemberDetail(memberId);
  if (!detail) return undefined;
  return {
    member: detail.member,
    workload: detail.workload,
    contributors: getMemberWorkloadContributors(memberId),
  };
}
