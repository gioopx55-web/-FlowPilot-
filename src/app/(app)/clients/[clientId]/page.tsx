import { notFound } from "next/navigation";
import { Users } from "lucide-react";
import { getClientById } from "@/domain/selectors";
import { ComingSoon } from "@/components/primitives/ComingSoon";

/**
 * Thin placeholder (Phase 8 §10) so Project -> Client navigation
 * resolves instead of 404ing — full Client Detail is Phase 10 scope.
 */
export default async function ClientDetailPlaceholder({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const client = getClientById(clientId);
  if (!client) notFound();

  return (
    <div className="flex h-full items-center justify-center">
      <ComingSoon
        icon={Users}
        title={client.name}
        description="Full client detail ships in a later phase."
      />
    </div>
  );
}
