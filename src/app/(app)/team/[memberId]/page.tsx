import { notFound } from "next/navigation";
import { UserRound } from "lucide-react";
import { getTeamMemberById } from "@/domain/selectors";
import { ComingSoon } from "@/components/primitives/ComingSoon";

/**
 * Thin placeholder (Phase 8) so links from the Project Team tab
 * resolve instead of 404ing — full Team Member Detail is a later
 * phase.
 */
export default async function TeamMemberDetailPlaceholder({
  params,
}: {
  params: Promise<{ memberId: string }>;
}) {
  const { memberId } = await params;
  const member = getTeamMemberById(memberId);
  if (!member) notFound();

  return (
    <div className="flex h-full items-center justify-center">
      <ComingSoon
        icon={UserRound}
        title={member.name}
        description="Full team-member detail ships in a later phase."
      />
    </div>
  );
}
