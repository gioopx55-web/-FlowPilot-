import { notFound } from "next/navigation";
import { getTeamMemberById } from "@/domain/selectors";
import type { TeamMember } from "@/types/entities";

/** D-036 guard, same pattern as requireProject/requireClient. */
export function requireTeamMember(memberId: string): TeamMember {
  const member = getTeamMemberById(memberId);
  if (!member) {
    notFound();
  }
  return member;
}
