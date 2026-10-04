import { LogIn } from "lucide-react";
import { ComingSoon } from "@/components/primitives/ComingSoon";

/**
 * Placeholder only — real demo auth is a later phase (Constitution §4
 * exclusions: no real authentication in Phase 5).
 */
export default function LoginPage() {
  return (
    <div className="flex h-dvh items-center justify-center">
      <ComingSoon
        icon={LogIn}
        title="Sign in"
        description="Demo authentication ships in a later phase."
      />
    </div>
  );
}
