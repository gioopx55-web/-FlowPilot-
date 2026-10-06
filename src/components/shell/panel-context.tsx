"use client";

import * as React from "react";
import type { AIIntentId, AIScope } from "@/domain/ai/contracts";

export type ShellPanelId = "ai" | "notifications";

export interface AIPendingRequest {
  intentId: AIIntentId;
  scope?: AIScope;
  /** The pseudo "user question" text shown in the conversation for this contextual request. */
  label: string;
}

interface PanelContextValue {
  openPanelId: ShellPanelId | null;
  openPanel: (id: ShellPanelId) => void;
  closePanel: () => void;
  togglePanel: (id: ShellPanelId) => void;
  /** Set by a contextual AI entry point (e.g. Project Detail's "Explain risk"); consumed once by the AI panel then cleared. */
  aiPendingRequest: AIPendingRequest | null;
  openAIWithRequest: (request: AIPendingRequest) => void;
  clearAIPendingRequest: () => void;
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
  const [aiPendingRequest, setAIPendingRequest] = React.useState<AIPendingRequest | null>(null);

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
  const openAIWithRequest = React.useCallback((request: AIPendingRequest) => {
    setAIPendingRequest(request);
    setOpenPanelId("ai");
  }, []);
  const clearAIPendingRequest = React.useCallback(() => setAIPendingRequest(null), []);

  const value = React.useMemo(
    () => ({
      openPanelId,
      openPanel,
      closePanel,
      togglePanel,
      aiPendingRequest,
      openAIWithRequest,
      clearAIPendingRequest,
    }),
    [openPanelId, openPanel, closePanel, togglePanel, aiPendingRequest, openAIWithRequest, clearAIPendingRequest],
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
