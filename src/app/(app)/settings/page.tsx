import { Settings } from "lucide-react";
import { ComingSoon } from "@/components/primitives/ComingSoon";

export default function SettingsPage() {
  return (
    <ComingSoon
      icon={Settings}
      title="Settings"
      description="Profile, workspace, notification, and billing settings ship in a later phase."
    />
  );
}
