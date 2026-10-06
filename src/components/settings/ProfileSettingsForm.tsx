"use client";

import { useState, useTransition } from "react";
import type { User } from "@/types/entities";
import { updateProfileAction } from "@/lib/settingsActions";
import { Button } from "@/components/ui/button";

const fieldClassName =
  "h-9 w-full rounded-sm border border-border bg-background px-2.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/70";

/**
 * Profile form (Phase 14 §9) — a plain native controlled form, same
 * pattern as `AddInteractionForm.tsx`/`TaskDetailContent.tsx` (D-041:
 * a form library isn't justified for 2 fields and 1 validation rule
 * each). `jobTitle` is shown read-only, sourced from the linked
 * `TeamMember`, never edited here (see `domain/settingsMutations.ts`
 * for why).
 */
export function ProfileSettingsForm({
  user,
  jobTitle,
}: {
  user: User;
  jobTitle: string | undefined;
}) {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [email, setEmail] = useState(user.email);
  const [error, setError] = useState<string | undefined>(undefined);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    setSaved(false);
    startTransition(async () => {
      const result = await updateProfileAction({ displayName, email });
      if (!result.ok) {
        setError(result.error ?? "Could not save your profile.");
        return;
      }
      setSaved(true);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <p className="text-xs text-muted-foreground">
        Shared demo workspace — changes may be visible to other visitors. Use fictional details only.
      </p>
      <div>
        <label htmlFor="profile-name" className="mb-1 block text-xs text-muted-foreground">
          Name
        </label>
        <input
          id="profile-name"
          className={fieldClassName}
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="profile-email" className="mb-1 block text-xs text-muted-foreground">
          Email
        </label>
        <input
          id="profile-email"
          type="email"
          dir="ltr"
          className={`${fieldClassName} [unicode-bidi:isolate]`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {jobTitle && (
        <div>
          <span className="mb-1 block text-xs text-muted-foreground">Job title</span>
          <p className="text-sm text-foreground">{jobTitle}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Set on the Team record — not editable here.
          </p>
        </div>
      )}

      {error && <p className="text-xs text-[var(--fp-danger)]">{error}</p>}
      {saved && !error && <p className="text-xs text-[var(--fp-success)]">Saved.</p>}

      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}
