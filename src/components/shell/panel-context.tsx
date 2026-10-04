"use client";

import * as React from "react";

export type ShellPanelId = "ai" | "notifications";

interface PanelContextValue {
  openPanelId: ShellPanelId | null;
  openPanel: (id: ShellPanelId) => void;
  closePanel: () => void;
  togglePanel: (id: ShellPanelId) => void;
}

const PanelContext = React.createContext<PanelContextValue | null>(null);

/**
 * AI Assistant / Notifications mutual exclusivity (D-014): a single
 * `openPanelId` value makes "opening one closes the other" structurally
 * true — there is no way for both to be open at once, on any breakpoint.
 */
export function PanelProvider({ children }: { children: React.ReactNode }) {
  const [openPanelId, setOpenPanelId] = React.useState<ShellPanelId | null>(
    null,
  );

  const openPanel = React.useCallback(
    (id: ShellPanelId) => setOpenPanelId(id),
    [],
  );
  const closePanel = React.useCallback(() => setOpenPanelId(null), []);
  const togglePanel = React.useCallback(
    (id: ShellPanelId) =>
      setOpenPanelId((current) => (current === id ? null : id)),
    [],
  );

  const value = React.useMemo(
    () => ({ openPanelId, openPanel, closePanel, togglePanel }),
    [openPanelId, openPanel, closePanel, togglePanel],
  );

  return <PanelContext.Provider value={value}>{children}</PanelContext.Provider>;
}

export function useShellPanels(): PanelContextValue {
  const ctx = React.useContext(PanelContext);
  if (!ctx) {
    throw new Error("useShellPanels must be used within a PanelProvider");
  }
  return ctx;
}
