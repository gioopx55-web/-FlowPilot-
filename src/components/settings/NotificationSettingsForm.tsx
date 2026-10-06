"use client";

import { useState, useTransition } from "react";
import type { NotificationPreferences } from "@/domain/settingsMutations";
import { updateNotificationPreferencesAction } from "@/lib/settingsActions";

const TOGGLES: { key: keyof NotificationPreferences; label: string; description: string }[] = [
  {
    key: "overdueTaskAlerts",
    label: "Overdue task alerts",
    description: "Notify when a task becomes overdue.",
  },
  {
    key: "projectRiskAlerts",
    label: "Project risk alerts",
    description: "Notify when a project becomes At Risk or Critical Risk.",
  },
  {
    key: "clientFollowUpReminders",
    label: "Client follow-up reminders",
    description: "Notify when a client needs a follow-up.",
  },
  {
    key: "workloadAlerts",
    label: "Workload alerts",
    description: "Notify when a teammate becomes overloaded.",
  },
];

/**
 * Notification preferences (Phase 14 §12, wired to a real in-app
 * feed in Phase 21.1 §9) — each toggle genuinely gates whether that
 * category appears in the Notification Center (`domain/notifications.ts`
 * reads these same preferences). Still honestly scoped: toggling one
 * off hides that category from the in-app panel only — there is no
 * email/push/Slack delivery to suppress, per the copy below.
 */
export function NotificationSettingsForm({
  preferences,
}: {
  preferences: NotificationPreferences;
}) {
  const [values, setValues] = useState(preferences);
  const [isPending, startTransition] = useTransition();

  function toggle(key: keyof NotificationPreferences) {
    const next = { ...values, [key]: !values[key] };
    setValues(next);
    startTransition(async () => {
      await updateNotificationPreferencesAction({ [key]: next[key] });
    });
  }

  return (
    <div className="max-w-md">
      <ul className="divide-y divide-border rounded-md border border-border">
        {TOGGLES.map((item) => (
          <li key={item.key} className="flex items-start justify-between gap-4 p-3">
            <div className="min-w-0">
              <label htmlFor={`toggle-${item.key}`} className="block text-sm font-medium text-foreground">
                {item.label}
              </label>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
            <input
              id={`toggle-${item.key}`}
              type="checkbox"
              role="switch"
              aria-checked={values[item.key]}
              checked={values[item.key]}
              disabled={isPending}
              onChange={() => toggle(item.key)}
              className="mt-0.5 size-5 shrink-0 rounded-sm border-border accent-[var(--fp-accent)]"
            />
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">
        In-app notification preferences — each toggle controls what appears in the Notification
        Center. This demo doesn&apos;t send real emails, push notifications, or Slack messages.
      </p>
    </div>
  );
}
