import { Users } from "lucide-react";
import { ComingSoon } from "@/components/primitives/ComingSoon";

export default function ClientsPage() {
  return (
    <ComingSoon
      icon={Users}
      title="Clients"
      description="The client list, follow-up surfacing, and interaction log ship in a later phase."
    />
  );
}
