import Link from "next/link";
import { FolderX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProjectNotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 py-24 text-center">
      <FolderX className="size-6 text-muted-foreground" aria-hidden="true" />
      <h1 className="text-sm font-semibold text-foreground">Project not found</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        This project doesn&apos;t exist or may have been removed.
      </p>
      <Button asChild variant="outline" size="sm">
        <Link href="/projects">Back to Projects</Link>
      </Button>
    </div>
  );
}
