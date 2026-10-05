import { Section } from "@/components/primitives/Section";
import { AppearanceSettingsForm } from "@/components/settings/AppearanceSettingsForm";

export default function AppearanceSettingsPage() {
  return (
    <Section title="Appearance">
      <AppearanceSettingsForm />
    </Section>
  );
}
