"use server";

import { revalidatePath } from "next/cache";
import {
  markNotificationRead,
  markAllNotificationsRead,
  type NotificationMutationResult,
} from "@/domain/notifications";
import { requireDemoSession } from "@/lib/demoSession";

function revalidateEverything() {
  revalidatePath("/", "layout");
}

export async function markNotificationReadAction(
  id: string,
): Promise<NotificationMutationResult> {
  await requireDemoSession();
  const result = markNotificationRead(id);
  if (result.ok) revalidateEverything();
  return result;
}

export async function markAllNotificationsReadAction(): Promise<NotificationMutationResult> {
  await requireDemoSession();
  const result = markAllNotificationsRead();
  if (result.ok) revalidateEverything();
  return result;
}
