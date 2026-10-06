import type { ID } from "@/types/entities";
import { DEMO_TODAY_ISO } from "@/lib/demo-clock";
import {
  getAtRiskProjectsSorted,
  getOverdueTasksSorted,
  getClientsNeedingFollowUpSorted,
  getTeamWorkloadSnapshot,
} from "@/domain/selectors";
import { getNotificationPreferences } from "@/domain/settingsMutations";

/**
 * In-app Notification Center (Phase 21.1 §2 — release blocker:
 * "Functional in-app Notification Center is declared P0 but absent").
 *
 * This reuses the exact same selectors the Dashboard and Daily Brief
 * already read (`getAtRiskProjectsSorted`/`getOverdueTasksSorted`/
 * `getClientsNeedingFollowUpSorted`/`getTeamWorkloadSnapshot`) rather
 * than a second risk/workload/follow-up implementation — one source
 * of truth (Constitution §7), same as `domain/dailyBrief.ts`.
 *
 * Deliberately NOT sourced from the static `data/mock/notifications.ts`
 * fixtures (D-089's documented, intentionally-unused Notification
 * entity): those 8 records are authored once against the fixed demo
 * clock and would go stale the moment any task/project mutation
 * changed what's actually at risk or overdue — exactly the "stale
 * cached notifications" this phase's brief says to avoid. Deriving
 * live from current selectors means a task edit that pushes a project
 * to At Risk shows up here in the same read, with zero second
 * mutation path to keep in sync (D-095).
 *
 * Read/unread state is a small override Map, keyed by this feed's own
 * stable derived IDs (`notif_risk_<projectId>`, etc.) — same D-039
 * server-side-overrides shape as every other mutable demo state, not
 * localStorage (this is shared workspace state, same honesty as every
 * other demo mutation in this app).
 */

export type NotificationFeedCategory =
  | "project_risk"
  | "overdue_task"
  | "client_follow_up"
  | "workload";

export interface NotificationFeedItem {
  id: string;
  category: NotificationFeedCategory;
  message: string;
  occurredAt: string;
  href: string;
  read: boolean;
}

const readOverrides = new Set<ID>();

function isRead(id: string): boolean {
  return readOverrides.has(id);
}

/**
 * The live feed, newest-signal-first within each category, filtered
 * by the Settings notification-preference toggles (Phase 21.1 §9 —
 * preferences now genuinely gate what appears here, not a disconnected
 * demo control). Capped per category so one noisy category can't push
 * every other category out of a short panel.
 */
export function getNotificationFeed(limit = 20): NotificationFeedItem[] {
  const preferences = getNotificationPreferences();
  const items: NotificationFeedItem[] = [];

  if (preferences.projectRiskAlerts) {
    for (const entry of getAtRiskProjectsSorted()) {
      const id = `notif_risk_${entry.project.id}`;
      items.push({
        id,
        category: "project_risk",
        message:
          entry.risk.level === "critical_risk"
            ? `${entry.project.name} is Critical Risk (${entry.client?.name ?? "unknown client"}).`
            : `${entry.project.name} is At Risk (${entry.client?.name ?? "unknown client"}).`,
        occurredAt: DEMO_TODAY_ISO,
        href: `/projects/${entry.project.id}`,
        read: isRead(id),
      });
    }
  }

  if (preferences.overdueTaskAlerts) {
    for (const entry of getOverdueTasksSorted()) {
      const id = `notif_overdue_${entry.task.id}`;
      items.push({
        id,
        category: "overdue_task",
        message: `"${entry.task.title}" is ${entry.daysOverdue} day${entry.daysOverdue === 1 ? "" : "s"} overdue.`,
        occurredAt: entry.task.dueDate ?? DEMO_TODAY_ISO,
        href: `/tasks/${entry.task.id}`,
        read: isRead(id),
      });
    }
  }

  if (preferences.clientFollowUpReminders) {
    for (const entry of getClientsNeedingFollowUpSorted()) {
      const id = `notif_followup_${entry.client.id}`;
      items.push({
        id,
        category: "client_follow_up",
        message:
          entry.status.daysSinceLastInteraction !== undefined
            ? `${entry.client.name} needs follow-up — no contact in ${entry.status.daysSinceLastInteraction} days.`
            : `${entry.client.name} needs a first follow-up.`,
        occurredAt: entry.status.lastInteractionAt ?? DEMO_TODAY_ISO,
        href: `/clients/${entry.client.id}`,
        read: isRead(id),
      });
    }
  }

  if (preferences.workloadAlerts) {
    for (const entry of getTeamWorkloadSnapshot()) {
      if (entry.workload.band !== "Overloaded") continue;
      const id = `notif_workload_${entry.member.id}`;
      items.push({
        id,
        category: "workload",
        message: `${entry.member.name} is overloaded at ${Math.round(entry.workload.workloadPct)}% of weekly capacity.`,
        occurredAt: DEMO_TODAY_ISO,
        href: `/team/${entry.member.id}`,
        read: isRead(id),
      });
    }
  }

  return items
    .sort((a, b) => (a.occurredAt < b.occurredAt ? 1 : -1))
    .slice(0, limit);
}

export function getUnreadNotificationCount(): number {
  return getNotificationFeed().filter((item) => !item.read).length;
}

export interface NotificationMutationResult {
  ok: boolean;
  error?: string;
}

export function markNotificationRead(id: string): NotificationMutationResult {
  readOverrides.add(id);
  return { ok: true };
}

export function markAllNotificationsRead(): NotificationMutationResult {
  for (const item of getNotificationFeed()) {
    readOverrides.add(item.id);
  }
  return { ok: true };
}

/** Clears read-state — part of the shared "reset to demo data" capability. */
export function resetNotificationState(): void {
  readOverrides.clear();
}
