"use client";

import { User as UserIcon, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { signOutOfDemoAction } from "@/lib/demoSessionActions";

/**
 * Account menu (Phase 14 §16) — reuses the existing Popover primitive
 * rather than adding a new dropdown-menu/avatar shadcn component for
 * one small menu (same reuse-over-new-dependency reasoning as
 * `ConditionsDisclosure.tsx`). Compact by design: a profile/settings
 * link, and logout — no account-management features or upsells.
 */
export function AccountMenu({
  displayName,
  email,
}: {
  displayName: string;
  email: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Account menu"
          className="h-11 w-11"
        >
          <UserIcon className="size-[18px]" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64">
        <div className="px-1 py-1">
          <p className="truncate text-sm font-medium text-foreground">{displayName}</p>
          <p dir="ltr" className="truncate text-xs text-muted-foreground [unicode-bidi:isolate]">
            {email}
          </p>
        </div>

        <Link
          href="/settings"
          className="flex h-9 items-center gap-2 rounded-sm px-2 text-sm text-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/70"
        >
          <Settings className="size-4" aria-hidden="true" />
          Profile &amp; settings
        </Link>

        <form action={signOutOfDemoAction}>
          <button
            type="submit"
            className="flex h-9 w-full items-center gap-2 rounded-sm px-2 text-start text-sm text-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/70"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Log out
          </button>
        </form>

        <p className="px-1 pt-1 text-[11px] text-muted-foreground">
          Demo session — logging out clears it.
        </p>
      </PopoverContent>
    </Popover>
  );
}
