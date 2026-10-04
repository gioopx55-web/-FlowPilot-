import Link from "next/link";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ClientNotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 py-24 text-center">
      <Users className="size-6 text-muted-foreground" aria-hidden="true" />
      <h1 className="text-sm font-semibold text-foreground">Client not found</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        This client doesn&apos;t exist or may have been removed.
      </p>
      <Button asChild variant="outline" size="sm">
        <Link href="/clients">Back to Clients</Link>
      </Button>
    </div>
  );
}
