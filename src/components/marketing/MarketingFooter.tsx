import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm font-medium text-foreground">FlowPilot AI</p>
        <p className="text-center text-xs text-muted-foreground sm:text-start">
          A portfolio product demo. Not a real company, service, or offering.
        </p>
        <Link
          href="/login"
          className="rounded-sm text-xs font-medium text-[var(--fp-accent)] outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/70"
        >
          Open Demo
        </Link>
      </div>
    </footer>
  );
}
