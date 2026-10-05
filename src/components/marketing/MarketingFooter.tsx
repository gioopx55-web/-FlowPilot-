import Link from "next/link";

const PRODUCT_LINKS = [
  { href: "#product-preview", label: "Product" },
  { href: "#features", label: "Features" },
  { href: "#ai", label: "AI Assistant" },
];

/**
 * Footer (Phase 13.5, redesigned Phase 17.6 §10) — previously a
 * single row (brand, disclaimer, one link), which read as appended
 * rather than designed. Now grouped columns like the rest of the
 * page's sections: brand + honest one-line description, a "Product"
 * group reusing the exact same in-page anchors `MarketingNav.tsx`
 * already defines (no invented destinations), and a "Demo" group
 * with the one real entry point. No Docs/legal links are listed —
 * none exist, and the brief is explicit about not inventing links to
 * non-existent pages.
 */
export function MarketingFooter() {
  return (
    <footer className="border-t border-border px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <span className="text-sm font-semibold text-foreground">FlowPilot AI</span>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              An AI-assisted operations cockpit for small agency teams — risk, workload,
              and follow-up, surfaced before they become problems.
            </p>
          </div>

          <div>
            <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Product
            </span>
            <ul className="mt-3 space-y-2">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="rounded-sm text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/70"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Demo
            </span>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/login"
                  className="rounded-sm text-sm font-medium text-[var(--fp-accent)] outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/70"
                >
                  Open Demo
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            A portfolio product demo. Not a real company, service, or offering.
          </p>
        </div>
      </div>
    </footer>
  );
}
