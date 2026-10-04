import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TaskNotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 py-24 text-center">
      <FileQuestion className="size-6 text-muted-foreground" aria-hidden="true" />
      <h1 className="text-sm font-semibold text-foreground">Task not found</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        This task doesn&apos;t exist or may have been removed.
      </p>
      <Button asChild variant="outline" size="sm">
        <Link href="/tasks">Back to Tasks</Link>
      </Button>
    </div>
  );
}
