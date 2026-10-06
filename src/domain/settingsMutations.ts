import type { ID, User } from "@/types/entities";
import { users } from "@/data/mock/users";
import {
  DEFAULT_NOTIFICATION_PREFERENCES,
  getDemoStore,
  type NotificationPreferences,
  type UserOverride,
} from "@/domain/demoStore";
import {
  hasOnlyKeys,
  isBoolean,
  isBoundedString,
  isEmail,
  isRecord,
} from "@/domain/runtimeValidation";

export type { NotificationPreferences } from "@/domain/demoStore";

const PROFILE_EDITABLE_KEYS = ["displayName", "email"] as const;
const NOTIFICATION_PREFERENCE_KEYS = [
  "overdueTaskAlerts",
  "projectRiskAlerts",
  "clientFollowUpReminders",
  "workloadAlerts",
] as const;

export interface ProfileEditableFields {
  displayName?: string;
  email?: string;
}

export interface SettingsMutationResult {
  ok: boolean;
  error?: string;
}

export function applyUserOverride(user: User): User {
  const override = getDemoStore().userOverrides.get(user.id);
  return override ? { ...user, ...override } : user;
}

export function updateProfile(
  userId: ID,
  edits: ProfileEditableFields,
): SettingsMutationResult {
  if (typeof userId !== "string" || !users.some((user) => user.id === userId)) {
    return { ok: false, error: "User not found." };
  }
  if (!isRecord(edits) || !hasOnlyKeys(edits, PROFILE_EDITABLE_KEYS)) {
    return { ok: false, error: "Profile changes contain unsupported fields." };
  }
  if (edits.displayName !== undefined && !isBoundedString(edits.displayName, 1, 120)) {
    return { ok: false, error: "Name must be between 1 and 120 characters." };
  }
  if (edits.email !== undefined && !isEmail(edits.email)) {
    return { ok: false, error: "Enter a valid email address." };
  }

  const patch: UserOverride = {};
  if (edits.displayName !== undefined) patch.displayName = edits.displayName.trim();
  if (edits.email !== undefined) patch.email = edits.email.trim();
  const overrides = getDemoStore().userOverrides;
  overrides.set(userId, { ...overrides.get(userId), ...patch });
  return { ok: true };
}

export function getNotificationPreferences(): NotificationPreferences {
  return getDemoStore().notificationPreferences;
}

export function updateNotificationPreferences(
  patch: Partial<NotificationPreferences>,
): SettingsMutationResult {
  if (!isRecord(patch) || !hasOnlyKeys(patch, NOTIFICATION_PREFERENCE_KEYS)) {
    return { ok: false, error: "Notification changes contain unsupported fields." };
  }
  for (const key of NOTIFICATION_PREFERENCE_KEYS) {
    if (patch[key] !== undefined && !isBoolean(patch[key])) {
      return { ok: false, error: "Notification preferences must be true or false." };
    }
  }
  getDemoStore().notificationPreferences = {
    ...getDemoStore().notificationPreferences,
    ...patch,
  };
  return { ok: true };
}

export function resetSettingsOverrides(): void {
  const store = getDemoStore();
  store.userOverrides.clear();
  store.notificationPreferences = { ...DEFAULT_NOTIFICATION_PREFERENCES };
}
