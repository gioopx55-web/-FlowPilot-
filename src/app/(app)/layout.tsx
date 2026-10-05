import { AppShell } from "@/components/shell/AppShell";
import { getUserById } from "@/domain/selectors";
import { DEMO_CURRENT_USER_ID } from "@/lib/demo-user";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getUserById(DEMO_CURRENT_USER_ID)!;

  return (
    <AppShell displayName={user.displayName} email={user.email}>
      {children}
    </AppShell>
  );
}
