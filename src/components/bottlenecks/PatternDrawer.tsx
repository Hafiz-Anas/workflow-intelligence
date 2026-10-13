"use client";

import { Check, X } from "lucide-react";
import { DetailDrawer, DrawerSection } from "@/components/shared/DetailDrawer";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useUpdatePattern } from "@/lib/hooks/useBottlenecks";
import { useLastDefined } from "@/lib/hooks/useLastDefined";
import type { DetectedPattern } from "@/lib/schemas";

interface PatternDrawerProps {
  pattern: DetectedPattern | null;
  onOpenChange: (open: boolean) => void;
}

/** A detected pattern with its proposed change; Accept and Dismiss sit in the sticky footer. */
export function PatternDrawer({ pattern, onOpenChange }: PatternDrawerProps) {
  const shown = useLastDefined(pattern);
  const update = useUpdatePattern();

  const decide = (status: "accepted" | "dismissed") => {
    if (!shown) return;
    update.mutate(
      { id: shown.id, status },
      {
        onSuccess: () => {
          toast(
            status === "accepted"
              ? { title: "Recommendation accepted", description: shown.recommendedChange, variant: "success" }
              : { title: "Recommendation dismissed", description: "The pattern stays visible for reference." },
          );
          onOpenChange(false);
        },
        onError: () => toast({ title: "Could not save the decision", description: "Please try again.", variant: "destructive" }),
      },
    );
  };

  return (
    <DetailDrawer
      open={pattern !== null}
      onOpenChange={onOpenChange}
      eyebrow="Recommended change"
      title={shown?.text ?? "Detected pattern"}
      isEmpty={!shown}
      emptyTitle="No pattern selected"
      footer={
        shown && (
          <>
            <Button
              variant="outline"
              onClick={() => decide("dismissed")}
              disabled={update.isPending || shown.status === "dismissed"}
            >
              <X /> Dismiss
            </Button>
            <Button
              variant="success"
              onClick={() => decide("accepted")}
              disabled={update.isPending || shown.status === "accepted"}
            >
              <Check /> Accept
            </Button>
          </>
        )
      }
    >
      {shown && (
        <>
          <DrawerSection title="Supporting metric">
            <p className="font-mono text-lg font-semibold tabular">{shown.metric}</p>
          </DrawerSection>
          <DrawerSection title="Proposed change">
            <p className="rounded-md border border-accent/30 bg-accent/5 p-3 text-sm">{shown.recommendedChange}</p>
          </DrawerSection>
          <DrawerSection title="Expected impact (sample estimate)">
            <p className="text-sm">{shown.expectedImpact}</p>
          </DrawerSection>
          <DrawerSection title="Current decision">
            <StatusBadge status={shown.status} />
          </DrawerSection>
        </>
      )}
    </DetailDrawer>
  );
}
