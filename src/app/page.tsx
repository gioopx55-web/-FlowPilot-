import { redirect } from "next/navigation";

/**
 * Dashboard is the default landing route (Phase 2 §11.2). No real auth
 * gate exists yet (Phase 5 scope), so "/" redirects straight there.
 */
export default function RootPage() {
  redirect("/dashboard");
}
