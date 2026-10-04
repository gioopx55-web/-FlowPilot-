"use client";

import * as React from "react";
import { Sparkles, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useShellPanels } from "@/components/shell/panel-context";

/**
 * Topbar — Phase 2 §11.11-11.12, Phase 4 §15.8/§15.25, Phase 5 §11.
 * Title slot on the logical start side, global action cluster on the
 * logical end side (ms-auto pushes the cluster to the end in both
 * writing directions). Triggers only toggle shell panel state here —
 * no AI/notification business logic exists yet (Phase 5 scope).
 */
export function Topbar({ title }: { title: string }) {
  const { openPanelId, togglePanel } = useShellPanels();

  return (
    <header className="relative z-40 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-4 lg:px-6">
      <h1 className="truncate text-sm font-semibold text-foreground">
        {title}
      </h1>

      <div className="ms-auto flex items-center gap-1">
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
              aria-label="Notifications"
              className="h-11 w-11"
              onClick={() => togglePanel("notifications")}
            >
              <Bell className="size-[18px]" aria-hidden="true" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Notifications</TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
