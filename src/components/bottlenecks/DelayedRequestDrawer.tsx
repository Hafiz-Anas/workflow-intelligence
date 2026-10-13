"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Timeline } from "@/components/brief/Timeline";
import { DetailDrawer, DrawerFacts, DrawerSection } from "@/components/shared/DetailDrawer";
import { ErrorState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDuration } from "@/lib/format";
import { useLastDefined } from "@/lib/hooks/useLastDefined";
import { useDecisionBrief } from "@/lib/hooks/useRequest";
import type { BottleneckReport } from "@/lib/schemas";

type Delayed = BottleneckReport["mostDelayed"][number];

interface DelayedRequestDrawerProps {
  row: Delayed | null;
  onOpenChange: (open: boolean) => void;
}

/** Why a request is late, with its approval timeline. */
export function DelayedRequestDrawer({ row, onOpenChange }: DelayedRequestDrawerProps) {
  const shown = useLastDefined(row);
  const brief = useDecisionBrief(shown?.requestId ?? "");

  return (
    <DetailDrawer
      open={row !== null}
      onOpenChange={onOpenChange}
      eyebrow="Delayed request"
      title={shown?.title ?? "Delayed request"}
      subtitle={shown ? `${shown.requestId} · ${shown.department}` : undefined}
      isEmpty={!shown}
      emptyTitle="No request selected"
      footer={
        shown && (
          <Button asChild>
            <Link href={`/decision-brief/${shown.requestId}`}>
              Open full Decision Brief <ArrowRight />
            </Link>
          </Button>
        )
      }
    >
      {shown && (
        <>
          <DrawerFacts
            items={[
              {
                label: "Delay beyond target",
                value: <span className="font-mono font-semibold text-danger tabular">+{formatDuration(shown.delayHours)}</span>,
              },
              { label: "Department", value: shown.department },
              ...(brief.data ? [{ label: "Current stage", value: brief.data.request.currentStage }] : []),
            ]}
          />

          <DrawerSection title="Reason for delay">
            <p className="rounded-md border border-danger/30 bg-danger/5 p-3 text-sm">{shown.reason}</p>
          </DrawerSection>

          <DrawerSection title="Timeline">
            {brief.error ? (
              <ErrorState error={brief.error} onRetry={() => void brief.refetch()} />
            ) : brief.isLoading || !brief.data ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <Timeline events={brief.data.timeline} />
            )}
          </DrawerSection>
        </>
      )}
    </DetailDrawer>
  );
}
