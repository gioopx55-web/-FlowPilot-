import type { ID, User } from "@/types/entities";

/**
 * Phase 14 settings demo-state — same server-side, in-memory,
 * process-lifetime "overrides" pattern D-039 established for tasks
 * (Phase 9) and extended for clients (Phase 10): nothing here is
 * localStorage or a client store, and base fixture arrays are never
 * mutated. Layered onto `users` at every `getDemoDataset()` call in
 * `data/mock/index.ts`, exactly like `applyTaskOverride`/
 * `applyClientOverride`.
 */

export interface ProfileEditableFields {
  displayName?: string;
  email?: string;
}

const userOverrides = new Map<ID, Partial<Pick<User, "displayName" | "email">>>();

export function applyUserOverride(user: User): User {
  const override = userOverrides.get(user.id);
  return override ? { ...user, ...override } : user;
}

export interface SettingsMutationResult {
  ok: boolean;
  error?: string;
}

/**
 * Profile (Phase 14 §9) edits only `displayName`/`email` on the one
 * demo `User` record (`lib/demo-user.ts`'s `DEMO_CURRENT_USER_ID`).
 * `jobTitle` stays read-only here, sourced from the linked
 * `TeamMember` instead of becoming editable through this surface —
 * `TeamMember` mutation was deliberately scoped out of V1 (D-047);
 * editing it via Settings would reopen that decision through a back
 * door rather than extend it cleanly.
 */
export function updateProfile(userId: ID, edits: ProfileEditableFields): SettingsMutationResult {
  if (edits.displayName !== undefined && !edits.displayName.trim()) {
    return { ok: false, error: "Name cannot be empty." };
  }
  if (edits.email !== undefined && !edits.email.trim()) {
    return { ok: false, error: "Email cannot be empty." };
  }
  const patch: Partial<User> = {};
  if (edits.displayName !== undefined) patch.displayName = edits.displayName.trim();
  if (edits.email !== undefined) patch.email = edits.email.trim();

  userOverrides.set(userId, { ...userOverrides.get(userId), ...patch });
  return { ok: true };
}

export interface NotificationPreferences {
  overdueTaskAlerts: boolean;
  projectRiskAlerts: boolean;
  clientFollowUpReminders: boolean;
  workloadAlerts: boolean;
}

const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  overdueTaskAlerts: true,
  projectRiskAlerts: true,
  clientFollowUpReminders: true,
  workloadAlerts: true,
};

let notificationPreferences: NotificationPreferences = { ...DEFAULT_NOTIFICATION_PREFERENCES };

/**
 * Preference-only state (Phase 14 §12) — nothing in the product
 * currently gates a real alert on these (the Notifications panel is
 * still a Phase 5 placeholder), so this is honestly a demo
 * preference surface, not a functioning alert pipeline.
 */
export function getNotificationPreferences(): NotificationPreferences {
  return notificationPreferences;
}

export function updateNotificationPreferences(
  patch: Partial<NotificationPreferences>,
): SettingsMutationResult {
  notificationPreferences = { ...notificationPreferences, ...patch };
  return { ok: true };
}

/** Resets both the profile overrides and notification preferences to their fixture-derived defaults. */
export function resetSettingsOverrides(): void {
  userOverrides.clear();
  notificationPreferences = { ...DEFAULT_NOTIFICATION_PREFERENCES };
}
