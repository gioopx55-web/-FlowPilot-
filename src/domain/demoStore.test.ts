import { test } from "node:test";
import assert from "node:assert/strict";
import { getDemoDataset } from "@/data/mock";
import { getNotificationFeed, getUnreadNotificationCount, markAllNotificationsRead } from "@/domain/notifications";
import { createProject } from "@/domain/projectMutations";
import { updateNotificationPreferences, updateProfile } from "@/domain/settingsMutations";
import { updateTaskFields } from "@/domain/taskMutations";
import { addClientInteraction } from "@/domain/clientMutations";
import { resetDemoStore } from "@/domain/demoStore";
import { DEMO_CURRENT_USER_ID } from "@/lib/demo-user";

test.afterEach(resetDemoStore);

test("resetDemoStore restores every mutable server-side demo-state family", () => {
  const base = getDemoDataset();
  const task = base.tasks[0]!;
  const client = base.clients.find((entry) => entry.id === "cl_harbor_thistle")!;
  const baselineUnread = getUnreadNotificationCount();

  updateTaskFields(task, { priority: task.priority === "high" ? "low" : "high" });
  addClientInteraction(client.id, "note", "Reset coverage", DEMO_CURRENT_USER_ID);
  const created = createProject({
    name: "Reset coverage project",
    clientId: client.id,
    status: "kickoff",
    progressPct: 0,
    startDate: "2026-10-06",
  });
  updateProfile(DEMO_CURRENT_USER_ID, { displayName: "Reset Coverage" });
  updateNotificationPreferences({ workloadAlerts: false });
  markAllNotificationsRead();

  assert.equal(created.ok, true);
  assert.notEqual(getDemoDataset().tasks.find((entry) => entry.id === task.id)!.priority, task.priority);
  assert.equal(getNotificationFeed().some((item) => item.category === "workload"), false);

  resetDemoStore();

  const restored = getDemoDataset();
  assert.equal(restored.tasks.find((entry) => entry.id === task.id)!.priority, task.priority);
  assert.equal(restored.clientInteractions.length, base.clientInteractions.length);
  assert.equal(restored.projects.some((project) => project.id === created.projectId), false);
  assert.equal(restored.users.find((user) => user.id === DEMO_CURRENT_USER_ID)!.displayName, base.users.find((user) => user.id === DEMO_CURRENT_USER_ID)!.displayName);
  assert.equal(getUnreadNotificationCount(), baselineUnread);
});
