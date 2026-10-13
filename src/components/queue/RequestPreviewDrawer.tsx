"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DetailDrawer, DrawerFacts, DrawerSection } from "@/components/shared/DetailDrawer";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TierBadge } from "@/components/shared/TierBadge";
import { Button } from "@/components/ui/button";
import { formatDateTime, formatDuration, formatMoney } from "@/lib/format";
import { useLastDefined } from "@/lib/hooks/useLastDefined";
import type { Request } from "@/lib/schemas";
import { DeadlineProgress, slaHours } from "./DeadlineProgress";
import { RankingReasonBadge } from "./RankingReasonBadge";

const reasonText: Record<Request["rankingReason"], string> = {
  deadline: "Its service-level deadline is close or has already passed, so delay now has the highest cost.",
  financial_exposure: "The value at stake, or the cost of delaying it, is high relative to the rest of the queue.",
  risk_level: "It is linked to operational or contract risk that grows the longer it waits.",
};

interface RequestPreviewDrawerProps {
  request: Request | null;
  onOpenChange: (open: boolean) => void;
}

/** Quick preview of a queue item; the full picture lives in the Decision Brief. */
export function RequestPreviewDrawer({ request, onOpenChange }: RequestPreviewDrawerProps) {
  const shown = useLastDefined(request);
  const sla = shown ? slaHours(shown) : 0;
  const remaining = shown ? sla - shown.elapsedHours : 0;

  return (
    <DetailDrawer
      open={request !== null}
      onOpenChange={onOpenChange}
      eyebrow="Request preview"
      title={shown?.title ?? "Request"}
      subtitle={shown ? `${shown.id} · ${shown.originDepartment}` : undefined}
      isEmpty={!shown}
      emptyTitle="No request selected"
      footer={
        shown && (
          <Button asChild>
            <Link href={`/decision-brief/${shown.id}`}>
              Open full Decision Brief <ArrowRight />
            </Link>
          </Button>
        )
      }
    >
      {shown && (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <PriorityBadge score={shown.priorityScore} label={shown.priorityLabel} />
            <StatusBadge status={shown.status} />
            <TierBadge tier={shown.requiredAuthorityTier} />
          </div>

          <DrawerSection title="Summary" className="mt-4">
            <p className="text-sm">
              {shown.originDepartment} requests a {shown.category.toLowerCase()} decision of{" "}
              <span className="font-mono font-medium tabular">{formatMoney(shown.amount)}</span>. It is at the{" "}
              <span className="font-medium">{shown.currentStage}</span> stage.
            </p>
          </DrawerSection>

          <DrawerSection title="Key facts">
            <DrawerFacts
              items={[
                { label: "Amount", value: <span className="font-mono tabular">{formatMoney(shown.amount, { compact: false })}</span> },
                { label: "Required authority", value: <TierBadge tier={shown.requiredAuthorityTier} /> },
                { label: "Category", value: shown.category },
                { label: "Received", value: <span className="font-mono text-xs tabular">{formatDateTime(shown.receivedAt)}</span> },
                { label: "Deadline", value: <span className="font-mono text-xs tabular">{formatDateTime(shown.deadlineAt)}</span> },
                {
                  label: "Recommended attention",
                  value: <span className="font-mono tabular">{shown.recommendedAttentionMinutes} min</span>,
                },
              ]}
            />
          </DrawerSection>

          <DrawerSection title="Elapsed time">
            <div className="flex items-center gap-4 rounded-md border p-3">
              <DeadlineProgress request={shown} />
              <p className="text-sm text-muted-foreground">
                {remaining >= 0 ? (
                  <>
                    <span className="font-mono font-medium text-text tabular">{formatDuration(remaining)}</span> left before the
                    deadline.
                  </>
                ) : (
                  <>
                    <span className="font-mono font-medium text-danger tabular">{formatDuration(-remaining)}</span> past the deadline.
                  </>
                )}
              </p>
            </div>
          </DrawerSection>

          <DrawerSection title="Why it ranks here">
            <div className="space-y-2 rounded-md border p-3">
              <RankingReasonBadge reason={shown.rankingReason} />
              <p className="text-sm">{reasonText[shown.rankingReason]}</p>
            </div>
          </DrawerSection>
        </>
      )}
    </DetailDrawer>
  );
}
