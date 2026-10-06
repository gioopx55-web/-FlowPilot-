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
import { NotificationsPanelContent } from "@/components/notifications/NotificationsPanelContent";
import type { NotificationFeedItem } from "@/domain/notifications";
import { OnboardingOverlay } from "@/components/onboarding/OnboardingOverlay";

/**
 * Shared application shell — Phase 2 §11.1-11.3/§11.11-11.13, Phase 5 §9.
 * Composes Sidebar + Topbar + MobileNav + the two mutually-exclusive
 * panels around the route content. No business feature content lives
 * here beyond composing the shared Notification Center (Phase 21.1
 * §2) and first-session onboarding (Phase 21.1 §3) — both implemented
 * elsewhere, only wired together here.
 */
export function AppShell({
  children,
  displayName,
  email,
  notifications,
}: {
  children: React.ReactNode;
  displayName: string;
  email: string;
  notifications: NotificationFeedItem[];
}) {
  return (
    <PanelProvider>
      <ShellLayout displayName={displayName} email={email} notifications={notifications}>
        {children}
      </ShellLayout>
    </PanelProvider>
  );
}

function ShellLayout({
  children,
  displayName,
  email,
  notifications,
}: {
  children: React.ReactNode;
  displayName: string;
  email: string;
  notifications: NotificationFeedItem[];
}) {
  const pathname = usePathname();
  const { openPanelId, closePanel } = useShellPanels();
  const title = getPageTitle(pathname ?? "");
  const unreadCount = notifications.filter((item) => !item.read).length;

  return (
    <div className="flex h-dvh">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} displayName={displayName} email={email} unreadCount={unreadCount} />
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
        description="Overdue tasks, project risk, client follow-ups, and workload alerts from your current workspace data."
      >
        <NotificationsPanelContent items={notifications} />
      </SidePanel>

      <OnboardingOverlay />
    </div>
  );
}
