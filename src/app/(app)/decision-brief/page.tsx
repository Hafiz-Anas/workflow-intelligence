"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/EmptyState";
import { useTopRequestId } from "@/lib/hooks/useRequests";

/** The sidebar link lands here and forwards to the highest-priority open request. */
export default function DecisionBriefIndexPage() {
  const router = useRouter();
  const { data: topId, error, refetch } = useTopRequestId();

  useEffect(() => {
    if (topId) router.replace(`/decision-brief/${topId}`);
  }, [topId, router]);

  if (error) {
    return (
      <Card>
        <ErrorState error={error} onRetry={() => void refetch()} />
      </Card>
    );
  }

  return (
    <div className="space-y-4" aria-busy="true" aria-label="Opening the highest-priority request">
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-10 w-full" />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Skeleton className="h-[480px]" />
        <Skeleton className="h-[480px]" />
      </div>
    </div>
  );
}
