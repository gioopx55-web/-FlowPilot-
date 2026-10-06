"use server";

import { revalidatePath } from "next/cache";
import {
  updateProfile,
  updateNotificationPreferences,
  type ProfileEditableFields,
  type NotificationPreferences,
  type SettingsMutationResult,
} from "@/domain/settingsMutations";
import { DEMO_CURRENT_USER_ID } from "@/lib/demo-user";
import { requireDemoSession } from "@/lib/demoSession";

const NO_SESSION_RESULT: SettingsMutationResult = {
  ok: false,
  error: "Your demo session has ended. Sign in again to make changes.",
};

function revalidateEverything() {
  revalidatePath("/", "layout");
}

export async function updateProfileAction(
  edits: ProfileEditableFields,
): Promise<SettingsMutationResult> {
  if (!(await requireDemoSession())) return NO_SESSION_RESULT;
  const result = updateProfile(DEMO_CURRENT_USER_ID, edits);
  if (result.ok) revalidateEverything();
  return result;
}

export async function updateNotificationPreferencesAction(
  patch: Partial<NotificationPreferences>,
): Promise<SettingsMutationResult> {
  if (!(await requireDemoSession())) return NO_SESSION_RESULT;
  const result = updateNotificationPreferences(patch);
  if (result.ok) revalidateEverything();
  return result;
}
