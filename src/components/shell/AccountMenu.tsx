"use client";

import { User as UserIcon, LogOut, Settings, Globe, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { signOutOfDemoAction } from "@/lib/demoSessionActions";
import { onboardingStore } from "@/lib/onboardingState";

/**
 * Account menu (Phase 14 §16) — reuses the existing Popover primitive
 * rather than adding a new dropdown-menu/avatar shadcn component for
 * one small menu (same reuse-over-new-dependency reasoning as
 * `ConditionsDisclosure.tsx`). Compact by design: a profile/settings
 * link, a link back to the public site, and logout — no account-
 * management features or upsells.
 *
 * Phase 17.6: "Back to website" added — a restrained, honest way out
 * of the app that doesn't end the demo session (unlike Log out,
 * right below it). The Sidebar's own brand mark also links to `/`
 * now, so this is a second, equally-obvious path, not the only one.
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

        <Link
          href="/"
          className="flex h-9 items-center gap-2 rounded-sm px-2 text-sm text-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/70"
        >
          <Globe className="size-4" aria-hidden="true" />
          Back to website
        </Link>

        <button
          type="button"
          onClick={() => onboardingStore.set(false)}
          className="flex h-9 w-full items-center gap-2 rounded-sm px-2 text-start text-sm text-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/70"
        >
          <Sparkles className="size-4" aria-hidden="true" />
          Replay onboarding
        </button>

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
