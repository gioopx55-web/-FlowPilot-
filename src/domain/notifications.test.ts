import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getNotificationFeed,
  getUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
  resetNotificationState,
} from "@/domain/notifications";
import {
  updateNotificationPreferences,
  resetSettingsOverrides,
} from "@/domain/settingsMutations";

/**
 * Proves the Notification Center reads through the exact same
 * selectors Dashboard/Daily Brief use — no second risk/overdue/
 * follow-up/workload implementation (Phase 21.1 §2/D-095) — and that
 * preference toggles (Phase 21.1 §9) genuinely gate what the feed
 * returns, not just the Settings UI.
 */
test.afterEach(() => {
  resetNotificationState();
  resetSettingsOverrides();
});

test("getNotificationFeed: includes a known at-risk project by default", () => {
  const items = getNotificationFeed();
  assert.equal(
    items.some((i) => i.category === "project_risk" && i.href === "/projects/proj_fernwood_donor"),
    true,
  );
});

test("getNotificationFeed: items start unread", () => {
  const items = getNotificationFeed();
  assert.ok(items.length > 0);
  assert.equal(items.every((i) => i.read === false), true);
});

test("preferences: disabling projectRiskAlerts removes that category from the feed", () => {
  updateNotificationPreferences({ projectRiskAlerts: false });
  const items = getNotificationFeed();
  assert.equal(items.some((i) => i.category === "project_risk"), false);
});

test("preferences: disabling overdueTaskAlerts removes that category from the feed", () => {
  updateNotificationPreferences({ overdueTaskAlerts: false });
  const items = getNotificationFeed();
  assert.equal(items.some((i) => i.category === "overdue_task"), false);
});

test("markNotificationRead: marks exactly one item read and lowers the unread count", () => {
  const before = getUnreadNotificationCount();
  const target = getNotificationFeed()[0]!;
  markNotificationRead(target.id);
  const after = getUnreadNotificationCount();
  assert.equal(after, before - 1);
  const updated = getNotificationFeed().find((i) => i.id === target.id)!;
  assert.equal(updated.read, true);
});

test("markAllNotificationsRead: unread count drops to zero", () => {
  markAllNotificationsRead();
  assert.equal(getUnreadNotificationCount(), 0);
  assert.equal(getNotificationFeed().every((i) => i.read), true);
});

test("resetNotificationState: unread count returns after a reset", () => {
  const before = getUnreadNotificationCount();
  markAllNotificationsRead();
  assert.equal(getUnreadNotificationCount(), 0);
  resetNotificationState();
  assert.equal(getUnreadNotificationCount(), before);
});

test("markNotificationRead: rejects malformed and nonexistent notification IDs", () => {
  const before = getUnreadNotificationCount();
  assert.equal(markNotificationRead(42 as unknown as string).ok, false);
  assert.equal(markNotificationRead("notif_missing").ok, false);
  assert.equal(getUnreadNotificationCount(), before);
});
