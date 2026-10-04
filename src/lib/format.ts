/** Presentation-only date formatting — never a source of business logic (see lib/demo-clock.ts for that). */
export function formatShortDate(iso: string | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
