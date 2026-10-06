"use server";

import { revalidatePath } from "next/cache";
import {
  markNotificationRead,
  markAllNotificationsRead,
  type NotificationMutationResult,
} from "@/domain/notifications";
import { requireDemoSession } from "@/lib/demoSession";

const NO_SESSION_RESULT: NotificationMutationResult = {
  ok: false,
  error: "Your demo session has ended. Sign in again to make changes.",
};

function revalidateEverything() {
  revalidatePath("/", "layout");
}

export async function markNotificationReadAction(
  id: string,
): Promise<NotificationMutationResult> {
  if (!(await requireDemoSession())) return NO_SESSION_RESULT;
  const result = markNotificationRead(id);
  if (result.ok) revalidateEverything();
  return result;
}

export async function markAllNotificationsReadAction(): Promise<NotificationMutationResult> {
  if (!(await requireDemoSession())) return NO_SESSION_RESULT;
  const result = markAllNotificationsRead();
  if (result.ok) revalidateEverything();
  return result;
}
