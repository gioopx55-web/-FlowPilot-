import { getNotificationPreferences } from "@/domain/settingsMutations";
import { Section } from "@/components/primitives/Section";
import { NotificationSettingsForm } from "@/components/settings/NotificationSettingsForm";

export default function NotificationSettingsPage() {
  const preferences = getNotificationPreferences();

  return (
    <Section title="Notifications">
      <NotificationSettingsForm preferences={preferences} />
    </Section>
  );
}
