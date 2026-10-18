import Link from "next/link";
import { FileSearch } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/** A Decision Brief only exists for a specific request; without an id there is nothing to show. */
export default function DecisionBriefIndexPage() {
  return (
    <Card>
      <EmptyState
        icon={FileSearch}
        title="No request selected"
        description="Select a request from the Priority Queue to view its Decision Brief."
        action={
          <Button asChild variant="outline" size="sm">
            <Link href="/priority-queue">Go to Priority Queue</Link>
          </Button>
        }
      />
    </Card>
  );
}
