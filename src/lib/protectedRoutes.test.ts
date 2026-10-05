import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isProtectedPath,
  sanitizeRedirectTarget,
  DEFAULT_PROTECTED_ROUTE,
} from "@/lib/protectedRoutes";

test("isProtectedPath: matches a protected prefix exactly and as a sub-route", () => {
  assert.equal(isProtectedPath("/dashboard"), true);
  assert.equal(isProtectedPath("/projects/proj_harbor_refresh"), true);
  assert.equal(isProtectedPath("/settings/billing"), true);
});

test("isProtectedPath: public routes are not protected", () => {
  assert.equal(isProtectedPath("/"), false);
  assert.equal(isProtectedPath("/login"), false);
});

test("isProtectedPath: does not false-positive on a prefix-like but distinct path", () => {
  assert.equal(isProtectedPath("/dashboardish"), false);
});

test("sanitizeRedirectTarget: accepts a known protected path", () => {
  assert.equal(sanitizeRedirectTarget("/projects"), "/projects");
  assert.equal(sanitizeRedirectTarget("/settings/billing"), "/settings/billing");
});

test("sanitizeRedirectTarget: falls back to the default for missing input", () => {
  assert.equal(sanitizeRedirectTarget(undefined), DEFAULT_PROTECTED_ROUTE);
  assert.equal(sanitizeRedirectTarget(null), DEFAULT_PROTECTED_ROUTE);
  assert.equal(sanitizeRedirectTarget(""), DEFAULT_PROTECTED_ROUTE);
});

test("sanitizeRedirectTarget: rejects an external URL (open-redirect guard)", () => {
  assert.equal(sanitizeRedirectTarget("https://evil.example.com/phish"), DEFAULT_PROTECTED_ROUTE);
});

test("sanitizeRedirectTarget: rejects a protocol-relative URL", () => {
  assert.equal(sanitizeRedirectTarget("//evil.example.com"), DEFAULT_PROTECTED_ROUTE);
});

test("sanitizeRedirectTarget: rejects an unknown internal path", () => {
  assert.equal(sanitizeRedirectTarget("/not-a-real-route"), DEFAULT_PROTECTED_ROUTE);
});
