import Link from "next/link";
import type { AIResultRow } from "@/domain/ai/executeIntent";

/**
 * The one generic list renderer for the 5 list-style intents
 * (daily_brief/overdue_tasks/at_risk_projects/clients_follow_up/
 * workload_analysis) — same dense row pattern as the Dashboard
 * widgets (Phase 7), not a new chat-bubble list style.
 */
export function AIResultList({
  heading,
  rows,
  emptyMessage,
}: {
  heading: string;
  rows: AIResultRow[];
  emptyMessage: string;
}) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-foreground">{heading}</h3>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <ul className="divide-y divide-border rounded-md border border-border">
          {rows.map((row) => (
            <li key={row.id}>
              <Link
                href={row.href}
                className="block p-3 outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/70"
              >
                <span className="block truncate text-sm font-medium text-foreground">
                  {row.title}
                </span>
                <span className="block truncate text-xs text-muted-foreground">{row.meta}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
