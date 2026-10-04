"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/shell/Sidebar";
import { Topbar } from "@/components/shell/Topbar";
import { MobileNav } from "@/components/shell/MobileNav";
import { SidePanel } from "@/components/shell/SidePanel";
import { PanelProvider, useShellPanels } from "@/components/shell/panel-context";
import { getPageTitle } from "@/components/shell/nav-config";

/**
 * Shared application shell — Phase 2 §11.1-11.3/§11.11-11.13, Phase 5 §9.
 * Composes Sidebar + Topbar + MobileNav + the two mutually-exclusive
 * panels around the route content. No business feature content lives
 * here (Phase 5 scope) — only shell chrome.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <PanelProvider>
      <ShellLayout>{children}</ShellLayout>
    </PanelProvider>
  );
}

function ShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { openPanelId, closePanel } = useShellPanels();
  const title = getPageTitle(pathname ?? "");

  return (
    <div className="flex h-dvh">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} />
        <main id="main-content" className="flex-1 overflow-y-auto pb-16 lg:pb-0">
          {children}
        </main>
      </div>

      <MobileNav />

      <SidePanel
        open={openPanelId === "ai"}
        onOpenChange={(open) => (open ? undefined : closePanel())}
        title="AI Assistant"
        description="Daily Brief, risk, and workload insights — coming in a later phase."
      >
        <p className="text-sm text-muted-foreground">
          The AI Assistant panel foundation is in place. Business logic
          (Daily Brief, overdue/at-risk queries, workload analysis) ships
          in a later phase, per the approved V1 AI scope.
        </p>
      </SidePanel>

      <SidePanel
        open={openPanelId === "notifications"}
        onOpenChange={(open) => (open ? undefined : closePanel())}
        title="Notifications"
        description="Overdue, assigned, mentioned, and follow-up alerts — coming in a later phase."
      >
        <p className="text-sm text-muted-foreground">
          The Notifications panel foundation is in place. Real notification
          data ships once Dashboard/Tasks/Clients business logic exists.
        </p>
      </SidePanel>
    </div>
  );
}
