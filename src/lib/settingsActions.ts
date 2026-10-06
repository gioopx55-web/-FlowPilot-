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

function revalidateEverything() {
  revalidatePath("/", "layout");
}

export async function updateProfileAction(
  edits: ProfileEditableFields,
): Promise<SettingsMutationResult> {
  await requireDemoSession();
  const result = updateProfile(DEMO_CURRENT_USER_ID, edits);
  if (result.ok) revalidateEverything();
  return result;
}

export async function updateNotificationPreferencesAction(
  patch: Partial<NotificationPreferences>,
): Promise<SettingsMutationResult> {
  await requireDemoSession();
  const result = updateNotificationPreferences(patch);
  if (result.ok) revalidateEverything();
  return result;
}
