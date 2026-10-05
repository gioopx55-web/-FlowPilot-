"use client";

import { useEffect, useRef, type ReactNode } from "react";
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
 *
 * Phase 18: on desktop/tablet the panel now starts below the topbar
 * (`top-14`/adjusted height) instead of underlapping it — see the
 * className comment below for why.
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

  // Phase 17 finding: Radix only auto-restores focus to the trigger for
  // *modal* dialogs — this panel is non-modal on desktop/tablet (D-032),
  // so closing it (e.g. via Escape) otherwise drops focus to <body>
  // with no restoration at all. Track the element that had focus when
  // the panel opened (always the trigger button) and restore it
  // ourselves on close, regardless of modal state.
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (open) {
      previouslyFocusedRef.current = document.activeElement as HTMLElement;
    } else if (previouslyFocusedRef.current) {
      previouslyFocusedRef.current.focus();
      previouslyFocusedRef.current = null;
    }
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={isMobile}>
      <SheetContent
        side={endSide}
        showOverlay={isMobile}
        className={cn(
          // Phase 16 finding: a plain "w-full" here loses to the base
          // Sheet primitive's own `data-[side=left/right]:w-3/4` (a
          // data-attribute selector outranks a plain class of equal
          // specificity), so on mobile the panel silently rendered at
          // 3/4 width instead of full-screen. Matching the same
          // data-attribute-variant syntax restores full-screen mobile.
          "data-[side=left]:w-full data-[side=right]:w-full sm:data-[side=left]:max-w-sm sm:data-[side=right]:max-w-sm",
          // Desktop/tablet only: stay below the topbar's z-40 (Topbar.tsx)
          // so the topbar's own trigger buttons remain clickable above a
          // non-modal panel docked at the same screen edge. Mobile keeps
          // the default z-50 to match its modal overlay.
          !isMobile && "z-30",
          // Phase 18 bug fix: the base primitive docks the panel at
          // `inset-y-0`/`h-full` (the full viewport height, starting at
          // y=0) on every breakpoint, relying on the topbar's higher
          // z-index to visually hide the ~56px of panel header that
          // underlaps it. That worked only while the topbar had an
          // opaque background — Phase 17.5 made it a translucent
          // `backdrop-blur` surface, which let the panel's own title/
          // description bleed through underneath it (confirmed via
          // `getBoundingClientRect`: the SheetHeader's top 56px sat
          // directly behind the topbar). Desktop/tablet now starts the
          // panel below the topbar instead of underlapping it — mobile
          // is untouched (it's a true full-screen modal at z-50, above
          // the topbar entirely, so this never applied there). Needs
          // the same `data-[side=...]:` variant form as the Phase 16
          // width fix (D-068) — a plain `top-14`/`h-[...]` loses to the
          // primitive's own `data-[side=...]:inset-y-0`/`h-full` at
          // equal specificity.
          !isMobile &&
            "data-[side=left]:top-14 data-[side=right]:top-14 data-[side=left]:h-[calc(100%-3.5rem)] data-[side=right]:h-[calc(100%-3.5rem)]",
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
