import type { Metadata } from "next";
import Link from "next/link";
import { getDemoDataset } from "@/data/mock";
import { getUserById } from "@/domain/selectors";
import { DEMO_CURRENT_USER_ID } from "@/lib/demo-user";
import { signInToDemoAction } from "@/lib/demoSessionActions";
import { sanitizeRedirectTarget } from "@/lib/protectedRoutes";
import { Button } from "@/components/ui/button";
import { DotGrid } from "@/components/marketing/DotGrid";

export const metadata: Metadata = {
  title: "Sign in — FlowPilot AI",
};

type SearchParams = Record<string, string | string[] | undefined>;

/**
 * Demo entry point (Phase 14 §1-§2). Lives outside the `(app)` shell
 * (no sidebar/topbar) but still visually FlowPilot — restrained,
 * calm, one strong action, no second marketing page. Per Phase 14's
 * external-research note: the composition (centered minimal card,
 * single primary CTA, concise supporting copy, subtle brand context)
 * follows the general "minimal, frictionless, single clear action"
 * pattern common to professional SaaS sign-in pages — not any
 * specific copied design — adapted here with FlowPilot's own
 * existing tokens and the same `DotGrid` motif Phase 13.6 already
 * established, rather than a new visual language just for this page.
 *
 * There are no real credentials: "Continue to Demo" is the one
 * action, honestly labeled, establishing the lightweight presence
 * cookie documented in `lib/demoSession.ts` (D-061).
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const redirectParam = Array.isArray(sp.redirect) ? sp.redirect[0] : sp.redirect;
  const redirectTo = sanitizeRedirectTarget(redirectParam);

  const { workspace } = getDemoDataset();
  const demoUser = getUserById(DEMO_CURRENT_USER_ID);

  const signIn = async () => {
    "use server";
    await signInToDemoAction(redirectTo);
  };

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[var(--fp-bg-canvas)] px-4">
      <DotGrid className="pointer-events-none absolute inset-0 -z-10 text-border/40" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,var(--fp-accent-subtle-bg),transparent)]"
      />

      <div className="w-full max-w-sm rounded-[var(--fp-radius-lg)] border border-border bg-[var(--fp-bg-surface-raised)] p-8 shadow-[var(--fp-shadow-level-2)]">
        <Link
          href="/"
          className="mb-6 inline-block rounded-sm text-sm font-semibold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
        >
          FlowPilot AI
        </Link>

        <h1 className="text-xl font-semibold tracking-tight text-foreground">Sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This is a demo workspace — there&apos;s no account to create and nothing to type.
          Continue to explore {workspace.name} as {demoUser?.displayName ?? "the demo user"}.
        </p>

        <form action={signIn} className="mt-6">
          <Button type="submit" size="lg" className="w-full">
            Continue to Demo
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Demo session only — no real account, password, or data leaves this workspace.
        </p>
      </div>
    </div>
  );
}
