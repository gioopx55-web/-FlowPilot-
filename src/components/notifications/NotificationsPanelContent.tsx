"use client";

import { useTransition } from "react";
import Link from "next/link";
import { FolderKanban, Clock, Users, Gauge, BellOff } from "lucide-react";
import type { NotificationFeedCategory, NotificationFeedItem } from "@/domain/notifications";
import { markNotificationReadAction, markAllNotificationsReadAction } from "@/lib/notificationActions";
import { useShellPanels } from "@/components/shell/panel-context";
import { formatShortDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/primitives/EmptyState";

// This category covers both Critical Risk and At Risk projects, so a
// plain project icon reads correctly for both — a warning/exclamation
// shape is reserved for a genuinely critical state, never a routine
// notification row (alert-styling correction).
const CATEGORY_ICON: Record<NotificationFeedCategory, typeof FolderKanban> = {
  project_risk: FolderKanban,
  overdue_task: Clock,
  client_follow_up: Users,
  workload: Gauge,
};

const CATEGORY_LABEL: Record<NotificationFeedCategory, string> = {
  project_risk: "Project risk",
  overdue_task: "Overdue task",
  client_follow_up: "Client follow-up",
  workload: "Workload",
};

/**
 * Real in-app Notification Center (Phase 21.1 §2) — replaces the
 * Phase 5-era placeholder. Rendered inside the existing global
 * `SidePanel` (same primitive the AI Assistant uses, mutually
 * exclusive per D-014), so panel scrolling/focus-restoration/mobile
 * full-screen behavior (D-071/D-068/D-085) are all inherited for
 * free, not reimplemented here.
 *
 * `items` is server-computed (`domain/notifications.ts`, derived live
 * from the same risk/overdue/follow-up/workload selectors the
 * Dashboard uses) and passed down from `app/(app)/layout.tsx` — this
 * component only renders and triggers the two tiny mutations
 * (mark one read, mark all read). Unread is never color-only (Phase
 * 17 §12): an accent dot AND a "Mark read" action are both present,
 * and the semantic `<ul>` list plus each item's own link text already
 * carry the information independent of color.
 */
export function NotificationsPanelContent({ items }: { items: NotificationFeedItem[] }) {
  const { closePanel } = useShellPanels();
  const [isPending, startTransition] = useTransition();
  const hasUnread = items.some((item) => !item.read);

  function handleItemClick(id: string) {
    if (items.find((i) => i.id === id)?.read) return;
    startTransition(async () => {
      await markNotificationReadAction(id);
    });
  }

  function handleMarkAllRead() {
    startTransition(async () => {
      await markAllNotificationsReadAction();
    });
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={BellOff}
        title="You're all caught up"
        description="Nothing needs your attention right now — at-risk projects, overdue tasks, client follow-ups, and overloaded teammates will show up here."
      />
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between pb-3">
        <p className="text-xs text-muted-foreground">
          {items.length} notification{items.length === 1 ? "" : "s"}
        </p>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={handleMarkAllRead}
          disabled={isPending || !hasUnread}
        >
          Mark all read
        </Button>
      </div>

      <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const Icon = CATEGORY_ICON[item.category];
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                onClick={() => {
                  handleItemClick(item.id);
                  closePanel();
                }}
                className="flex items-start gap-3 rounded-md border border-transparent p-3 text-sm outline-none hover:bg-[var(--fp-bg-canvas)] focus-visible:ring-2 focus-visible:ring-ring/70"
              >
                <Icon
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    {CATEGORY_LABEL[item.category]}
                    <span aria-hidden="true">·</span>
                    {formatShortDate(item.occurredAt)}
                  </span>
                  <span
                    className={
                      item.read
                        ? "block text-foreground/80"
                        : "block font-medium text-foreground"
                    }
                  >
                    {item.message}
                  </span>
                </span>
                {!item.read && (
                  <span
                    aria-label="Unread"
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--fp-accent)]"
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
