"use client";

import type { ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { getLocale } from "@/lib/locale";
import { useIsMobile } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

/**
 * Shared docked-panel / full-screen-sheet primitive (Phase 2 §11.11-11.13,
 * Phase 5 §13). Used identically by the AI Assistant trigger and the
 * Notifications trigger — one implementation, two content slots — so the
 * mutual-exclusivity behavior (D-014) lives once, in AppShell, not per panel.
 *
 * Docking side: the underlying shadcn Sheet only accepts a *physical*
 * left/right side prop (it hardcodes left-0/right-0, not logical CSS). To
 * still satisfy D-017 (panels dock to the logical END edge), we choose the
 * physical side from the current writing direction here, once: in LTR the
 * inline-end is physically right; in RTL the inline-end is physically left.
 * Do not hardcode "right" below — it must stay derived from `dir`.
 */
export interface SidePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: ReactNode;
}

export function SidePanel({
  open,
  onOpenChange,
  title,
  description,
  children,
}: SidePanelProps) {
  const { dir } = getLocale();
  const endSide = dir === "rtl" ? "left" : "right";
  const isMobile = useIsMobile();

  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={isMobile}>
      <SheetContent
        side={endSide}
        showOverlay={isMobile}
        className={cn(
          "w-full sm:max-w-sm",
          // Desktop/tablet only: stay below the topbar's z-40 (Topbar.tsx)
          // so the topbar's own trigger buttons remain clickable above a
          // non-modal panel docked at the same screen edge. Mobile keeps
          // the default z-50 to match its modal overlay.
          !isMobile && "z-30",
        )}
      >
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description ? (
            <SheetDescription>{description}</SheetDescription>
          ) : null}
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4 pb-4">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
