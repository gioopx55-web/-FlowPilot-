"use client";

import { Sparkles, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useShellPanels } from "@/components/shell/panel-context";
import { AccountMenu } from "@/components/shell/AccountMenu";

/**
 * Topbar — Phase 2 §11.11-11.12, Phase 4 §15.8/§15.25, Phase 5 §11,
 * Phase 17.5 visual polish. Title slot on the logical start side,
 * global action cluster on the logical end side (ms-auto pushes the
 * cluster to the end in both writing directions). Triggers only
 * toggle shell panel state here — no AI/notification business logic
 * exists yet (Phase 5 scope).
 *
 * Phase 17.5: previously `bg-background`, identical to the canvas
 * behind it and the scrollable content below — the chrome had no
 * visual separation from content beyond a 1px border. Now a
 * translucent raised surface + backdrop blur (distinct from canvas in
 * both themes; see tokens.css), restrained per the brief ("louder
 * than page content" was the thing to avoid). AI/Notifications are
 * grouped into one visually-connected cluster (shared surface/border)
 * so they read as one "assistant utilities" unit, with a thin logical
 * divider before the separate identity/account cluster.
 */
export function Topbar({
  title,
  displayName,
  email,
  unreadCount = 0,
}: {
  title: string;
  displayName: string;
  email: string;
  unreadCount?: number;
}) {
  const { openPanelId, togglePanel } = useShellPanels();

  return (
    <header className="relative z-40 flex h-14 shrink-0 items-center gap-2 border-b border-border/70 bg-[var(--fp-bg-surface)]/85 px-4 backdrop-blur-md lg:px-6">
      <p className="truncate text-sm font-semibold text-foreground">
        {title}
      </p>

      <div className="ms-auto flex items-center gap-2">
        <div className="flex items-center gap-0.5 rounded-md border border-border/60 bg-[var(--fp-bg-canvas)]/60 p-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-pressed={openPanelId === "ai"}
                aria-label="AI Assistant"
                className="h-11 w-11"
                onClick={() => togglePanel("ai")}
              >
                <Sparkles className="size-[18px]" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>AI Assistant</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-pressed={openPanelId === "notifications"}
                aria-label={
                  unreadCount > 0
                    ? `Notifications, ${unreadCount} unread`
                    : "Notifications"
                }
                className="relative h-11 w-11"
                onClick={() => togglePanel("notifications")}
              >
                <Bell className="size-[18px]" aria-hidden="true" />
                {unreadCount > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-[var(--fp-accent)] text-[10px] font-medium text-[var(--fp-accent-foreground)]"
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>
        </div>

        <span aria-hidden="true" className="h-6 w-px bg-border" />

        <AccountMenu displayName={displayName} email={email} />
      </div>
    </header>
  );
}
