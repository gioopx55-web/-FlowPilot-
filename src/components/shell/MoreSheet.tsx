"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { moreSheetItems } from "@/components/shell/nav-config";
import { cn } from "@/lib/utils";

/**
 * Mobile "More" sheet — D-013. Flat list only (Team/Analytics/Settings),
 * no further nesting. Opens as a bottom sheet since it's triggered from
 * the bottom tab bar (Phase 2 §11.13).
 */
export function MoreSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-md">
        <SheetHeader>
          <SheetTitle>More</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4 pb-6" aria-label="More destinations">
          {moreSheetItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onOpenChange(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-sm px-3 text-sm font-medium text-foreground",
                  "transition-colors duration-150 ease-out hover:bg-accent",
                  active && "bg-[var(--fp-accent-subtle-bg)] text-[var(--fp-accent)]",
                )}
              >
                <Icon className="size-[18px] shrink-0" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
