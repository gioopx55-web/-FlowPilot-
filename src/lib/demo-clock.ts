/**
 * Demo reference clock — Phase 6.
 *
 * Every risk/workload/overdue/follow-up calculation in the mock-data
 * domain layer must read "today" from here, never from `new Date()`.
 * The entire fixture set (due dates, blocker timestamps, interaction
 * dates) is authored relative to this fixed instant so the demo
 * produces the same risk levels, workload bands, and follow-up flags
 * regardless of when the project is actually opened or built.
 *
 * To move the demo "forward" later, change this single constant —
 * never add a second place that reads the real system clock for
 * demo-data purposes.
 */
export const DEMO_TODAY_ISO = "2026-10-04T09:00:00.000Z";

export function demoToday(): Date {
  return new Date(DEMO_TODAY_ISO);
}

export function daysBetween(a: Date, b: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((b.getTime() - a.getTime()) / msPerDay);
}

export function hoursBetween(a: Date, b: Date): number {
  const msPerHour = 60 * 60 * 1000;
  return (b.getTime() - a.getTime()) / msPerHour;
}

/** Days from `today()` to `isoDate`; negative means isoDate is in the past. */
export function daysFromToday(isoDate: string): number {
  return daysBetween(demoToday(), new Date(isoDate));
}

/** Hours elapsed from `isoDate` to `today()`; negative means isoDate is in the future. */
export function hoursSince(isoDate: string): number {
  return hoursBetween(new Date(isoDate), demoToday());
}
