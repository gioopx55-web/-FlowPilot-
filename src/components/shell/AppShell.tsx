"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/shell/Sidebar";
import { Topbar } from "@/components/shell/Topbar";
import { MobileNav } from "@/components/shell/MobileNav";
import { SidePanel } from "@/components/shell/SidePanel";
import { PanelProvider, useShellPanels } from "@/components/shell/panel-context";
import { getPageTitle } from "@/components/shell/nav-config";
import { AIPanelContent } from "@/components/ai/AIPanelContent";

/**
 * Shared application shell — Phase 2 §11.1-11.3/§11.11-11.13, Phase 5 §9.
 * Composes Sidebar + Topbar + MobileNav + the two mutually-exclusive
 * panels around the route content. No business feature content lives
 * here (Phase 5 scope) — only shell chrome.
 */
export function AppShell({
  children,
  displayName,
  email,
}: {
  children: React.ReactNode;
  displayName: string;
  email: string;
}) {
  return (
    <PanelProvider>
      <ShellLayout displayName={displayName} email={email}>
        {children}
      </ShellLayout>
    </PanelProvider>
  );
}

function ShellLayout({
  children,
  displayName,
  email,
}: {
  children: React.ReactNode;
  displayName: string;
  email: string;
}) {
  const pathname = usePathname();
  const { openPanelId, closePanel } = useShellPanels();
  const title = getPageTitle(pathname ?? "");

  return (
    <div className="flex h-dvh">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} displayName={displayName} email={email} />
        <main id="main-content" className="flex-1 overflow-y-auto pb-16 lg:pb-0">
          {children}
        </main>
      </div>

      <MobileNav />

      <SidePanel
        open={openPanelId === "ai"}
        onOpenChange={(open) => (open ? undefined : closePanel())}
        title="AI Assistant"
        description="Daily Brief, risk, overdue tasks, follow-ups, and workload — grounded in your current workspace data."
      >
        <AIPanelContent />
      </SidePanel>

      <SidePanel
        open={openPanelId === "notifications"}
        onOpenChange={(open) => (open ? undefined : closePanel())}
        title="Notifications"
        description="Overdue, assigned, mentioned, and follow-up alerts."
      >
        <p className="text-sm text-muted-foreground">
          A real notification feed isn&apos;t part of this demo&apos;s scope — every
          alert type it would surface (overdue tasks, follow-ups, workload) is
          already answerable directly from the Dashboard or the AI Assistant.
        </p>
      </SidePanel>
    </div>
  );
}
