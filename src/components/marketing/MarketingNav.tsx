"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { getLocale } from "@/lib/locale";
import { BrandLockup } from "@/components/primitives/BrandMark";

const NAV_LINKS = [
  { href: "#product-preview", label: "Product" },
  { href: "#features", label: "Features" },
  { href: "#ai", label: "AI Assistant" },
];

/**
 * Restrained public navigation (Phase 13.5 §13) — no pricing/billing
 * marketing, just in-page anchors plus the one real CTA into the
 * actual demo app. A light backdrop-blur appears once the hero has
 * scrolled past, same restrained motion language as the rest of the
 * page (opacity/background only, no transform).
 */
export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const { dir } = getLocale();
  const endSide = dir === "rtl" ? "left" : "right";

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 32);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-colors duration-200",
        scrolled
          ? "border-border bg-[var(--fp-bg-surface)]/90 backdrop-blur-sm"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
        >
          <BrandLockup />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-sm text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/70"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button asChild size="sm">
            <Link href="/login">Open Demo</Link>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
              <Menu className="size-5" aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side={endSide}
            // Phase 16 finding: see SidePanel.tsx's identical fix — a
            // plain "w-full" loses to the base Sheet primitive's own
            // `data-[side=left/right]:w-3/4` (attribute selector beats
            // a plain class of equal specificity).
            className="data-[side=left]:w-full data-[side=right]:w-full sm:data-[side=left]:max-w-xs sm:data-[side=right]:max-w-xs"
          >
            <SheetHeader>
              <SheetTitle>FlowPilot AI</SheetTitle>
            </SheetHeader>
            <nav aria-label="Main" className="flex flex-col gap-1 px-4">
              {NAV_LINKS.map((link) => (
                <SheetClose asChild key={link.href}>
                  <a
                    href={link.href}
                    className="rounded-sm px-2 py-2.5 text-sm font-medium text-foreground outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/70"
                  >
                    {link.label}
                  </a>
                </SheetClose>
              ))}
              <SheetClose asChild>
                <Button asChild size="sm" className="mt-2">
                  <Link href="/login">Open Demo</Link>
                </Button>
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
