import { SettingsTabs } from "@/components/settings/SettingsTabs";

/**
 * Settings (Phase 14 §8) — a persistent header + route-backed tabs,
 * same shell pattern as Project Detail/Client Detail. Compact by
 * design: 5 sections, no nested sub-navigation within a section.
 */
export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="border-b border-border px-4 py-4 sm:px-6 lg:px-8">
        <h1 className="text-lg font-semibold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Profile, workspace, appearance, notifications, and billing — all demo state.
        </p>
      </header>
      <SettingsTabs />
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}
