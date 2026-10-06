import { AppShell } from "@/components/shell/AppShell";
import { getUserById } from "@/domain/selectors";
import { getNotificationFeed } from "@/domain/notifications";
import { DEMO_CURRENT_USER_ID } from "@/lib/demo-user";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getUserById(DEMO_CURRENT_USER_ID)!;
  const notifications = getNotificationFeed();

  return (
    <AppShell displayName={user.displayName} email={user.email} notifications={notifications}>
      {children}
    </AppShell>
  );
}
