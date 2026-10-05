import { test } from "node:test";
import assert from "node:assert/strict";
import {
  applyUserOverride,
  updateProfile,
  getNotificationPreferences,
  updateNotificationPreferences,
  resetSettingsOverrides,
} from "@/domain/settingsMutations";
import { DEMO_CURRENT_USER_ID } from "@/lib/demo-user";
import { getUserById } from "@/domain/selectors";

test.afterEach(() => {
  resetSettingsOverrides();
});

test("updateProfile: edits displayName and email, applied via applyUserOverride", () => {
  const baseUser = getUserById(DEMO_CURRENT_USER_ID)!;
  const result = updateProfile(DEMO_CURRENT_USER_ID, {
    displayName: "Maya Updated",
    email: "maya.updated@example.com",
  });
  assert.equal(result.ok, true);

  const applied = applyUserOverride(baseUser);
  assert.equal(applied.displayName, "Maya Updated");
  assert.equal(applied.email, "maya.updated@example.com");
});

test("updateProfile: rejects an empty name", () => {
  const result = updateProfile(DEMO_CURRENT_USER_ID, { displayName: "   " });
  assert.equal(result.ok, false);
  assert.ok(result.error);
});

test("updateProfile: rejects an empty email", () => {
  const result = updateProfile(DEMO_CURRENT_USER_ID, { email: "" });
  assert.equal(result.ok, false);
  assert.ok(result.error);
});

test("updateProfile: partial edits merge rather than clobber the other field", () => {
  updateProfile(DEMO_CURRENT_USER_ID, { displayName: "First Edit" });
  updateProfile(DEMO_CURRENT_USER_ID, { email: "second-edit@example.com" });

  const baseUser = getUserById(DEMO_CURRENT_USER_ID)!;
  const applied = applyUserOverride(baseUser);
  assert.equal(applied.displayName, "First Edit");
  assert.equal(applied.email, "second-edit@example.com");
});

test("applyUserOverride: a user with no recorded override is returned unchanged", () => {
  const baseUser = getUserById(DEMO_CURRENT_USER_ID)!;
  assert.deepEqual(applyUserOverride(baseUser), baseUser);
});

test("notification preferences: default state has every alert enabled", () => {
  const prefs = getNotificationPreferences();
  assert.equal(prefs.overdueTaskAlerts, true);
  assert.equal(prefs.projectRiskAlerts, true);
  assert.equal(prefs.clientFollowUpReminders, true);
  assert.equal(prefs.workloadAlerts, true);
});

test("updateNotificationPreferences: patches a single preference without affecting others", () => {
  updateNotificationPreferences({ workloadAlerts: false });
  const prefs = getNotificationPreferences();
  assert.equal(prefs.workloadAlerts, false);
  assert.equal(prefs.overdueTaskAlerts, true);
});

test("resetSettingsOverrides: clears profile overrides and notification preferences", () => {
  const baseUser = getUserById(DEMO_CURRENT_USER_ID)!;
  updateProfile(DEMO_CURRENT_USER_ID, { displayName: "Temp Name" });
  updateNotificationPreferences({ workloadAlerts: false, projectRiskAlerts: false });

  resetSettingsOverrides();

  assert.deepEqual(applyUserOverride(baseUser), baseUser);
  assert.deepEqual(getNotificationPreferences(), {
    overdueTaskAlerts: true,
    projectRiskAlerts: true,
    clientFollowUpReminders: true,
    workloadAlerts: true,
  });
});
