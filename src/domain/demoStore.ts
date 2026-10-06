import "server-only";

import type { Client, ClientInteraction, ID, Project, Task, User } from "@/types/entities";

/**
 * The single mutable state registry for the V1 demo.
 *
 * Next.js can include the same source module in multiple production server
 * bundles. Module-local Maps therefore are not an authoritative store: a
 * Server Action can mutate one module instance while the following Server
 * Component render reads another. A globalThis registry is shared by every
 * bundle loaded in the same Node process and preserves read-your-own-writes
 * across requests without adding durable persistence.
 *
 * This remains intentionally demo-only: all visitors to one process share
 * it, it has no account isolation, and it resets on process restart.
 */

export type TaskOverride = Partial<
  Pick<
    Task,
    | "status"
    | "priority"
    | "assigneeId"
    | "dueDate"
    | "estimatedHours"
    | "hasActiveBlocker"
    | "blockerStartedAt"
    | "completedAt"
    | "description"
  >
>;

export type ClientOverride = Partial<
  Pick<Client, "primaryContactName" | "primaryContactEmail" | "status">
>;

export type ProjectOverride = Partial<
  Pick<
    Project,
    | "name"
    | "clientId"
    | "status"
    | "progressPct"
    | "startDate"
    | "dueDate"
    | "completedAt"
  >
>;

export type UserOverride = Partial<Pick<User, "displayName" | "email">>;

export interface NotificationPreferences {
  overdueTaskAlerts: boolean;
  projectRiskAlerts: boolean;
  clientFollowUpReminders: boolean;
  workloadAlerts: boolean;
}

export const DEFAULT_NOTIFICATION_PREFERENCES: Readonly<NotificationPreferences> = {
  overdueTaskAlerts: true,
  projectRiskAlerts: true,
  clientFollowUpReminders: true,
  workloadAlerts: true,
};

export interface DemoStore {
  taskOverrides: Map<ID, TaskOverride>;
  clientOverrides: Map<ID, ClientOverride>;
  addedInteractions: ClientInteraction[];
  interactionCounter: number;
  projectOverrides: Map<ID, ProjectOverride>;
  addedProjects: Project[];
  projectCounter: number;
  userOverrides: Map<ID, UserOverride>;
  notificationPreferences: NotificationPreferences;
  readNotificationIds: Set<ID>;
}

declare global {
  var __flowpilotDemoStore: DemoStore | undefined;
}

function createDemoStore(): DemoStore {
  return {
    taskOverrides: new Map(),
    clientOverrides: new Map(),
    addedInteractions: [],
    interactionCounter: 0,
    projectOverrides: new Map(),
    addedProjects: [],
    projectCounter: 0,
    userOverrides: new Map(),
    notificationPreferences: { ...DEFAULT_NOTIFICATION_PREFERENCES },
    readNotificationIds: new Set(),
  };
}

export function getDemoStore(): DemoStore {
  globalThis.__flowpilotDemoStore ??= createDemoStore();
  return globalThis.__flowpilotDemoStore;
}

/** Clears every mutable demo-state family through one authoritative reset. */
export function resetDemoStore(): void {
  const store = getDemoStore();
  store.taskOverrides.clear();
  store.clientOverrides.clear();
  store.addedInteractions.length = 0;
  store.interactionCounter = 0;
  store.projectOverrides.clear();
  store.addedProjects.length = 0;
  store.projectCounter = 0;
  store.userOverrides.clear();
  store.notificationPreferences = { ...DEFAULT_NOTIFICATION_PREFERENCES };
  store.readNotificationIds.clear();
}
