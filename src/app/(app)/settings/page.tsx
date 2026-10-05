import { getUserById, getTeamMemberById } from "@/domain/selectors";
import { DEMO_CURRENT_USER_ID } from "@/lib/demo-user";
import { Section } from "@/components/primitives/Section";
import { ProfileSettingsForm } from "@/components/settings/ProfileSettingsForm";

export default function ProfileSettingsPage() {
  const user = getUserById(DEMO_CURRENT_USER_ID)!;
  const jobTitle = user.teamMemberId ? getTeamMemberById(user.teamMemberId)?.jobTitle : undefined;

  return (
    <Section title="Profile">
      <ProfileSettingsForm user={user} jobTitle={jobTitle} />
    </Section>
  );
}
