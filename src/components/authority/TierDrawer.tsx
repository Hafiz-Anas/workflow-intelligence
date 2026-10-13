"use client";

import { BookOpen } from "lucide-react";
import { DetailDrawer, DrawerFacts, DrawerSection } from "@/components/shared/DetailDrawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatMoney, formatNumber, formatPercent } from "@/lib/format";
import { useLastDefined } from "@/lib/hooks/useLastDefined";
import type { AuthorityTier } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { clauseOf, tierLimitLabel } from "./TierCard";

interface TierDrawerProps {
  tier: AuthorityTier | null;
  onOpenChange: (open: boolean) => void;
  onOpenClause: (policyId: string, clause: string) => void;
}

/** Tier details. Opens on the left so it never clashes with the right-side policy drawer. */
export function TierDrawer({ tier, onOpenChange, onOpenClause }: TierDrawerProps) {
  const shown = useLastDefined(tier);
  const total = shown ? shown.directApprovals + shown.friendlyEscalations : 0;
  const directPct = shown && total ? (shown.directApprovals / total) * 100 : 0;

  return (
    <DetailDrawer
      open={tier !== null}
      onOpenChange={onOpenChange}
      side="left"
      eyebrow="Authority tier"
      title={shown ? `${shown.name} · ${shown.role}` : "Authority tier"}
      subtitle={shown ? tierLimitLabel(shown) : undefined}
      isEmpty={!shown}
      emptyTitle="No tier selected"
      footer={
        shown && (
          <Button variant="outline" onClick={() => onOpenClause(shown.policySourceId, clauseOf(shown.groundingClause))}>
            <BookOpen /> Open grounding policy
          </Button>
        )
      }
    >
      {shown && (
        <>
          <DrawerFacts
            items={[
              { label: "Authorization limit", value: <span className="font-mono tabular">{tierLimitLabel(shown)}</span> },
              ...(shown.limitNote ? [{ label: "Note", value: shown.limitNote }] : []),
              { label: "Grounding clause", value: <span className="font-mono text-xs">{shown.groundingClause}</span> },
              {
                label: "Delegation efficiency",
                value: (
                  <span
                    className={cn(
                      "font-mono tabular",
                      shown.delegationEfficiency >= 85
                        ? "text-success-fg"
                        : shown.delegationEfficiency >= 75
                          ? "text-warning-fg"
                          : "text-danger",
                    )}
                  >
                    {formatPercent(shown.delegationEfficiency)}
                  </span>
                ),
              },
            ]}
          />

          <DrawerSection title="Approvable without escalation">
            <div className="flex flex-wrap gap-1">
              {shown.categoriesApprovable.map((c) => (
                <Badge key={c} variant="muted">
                  {c}
                </Badge>
              ))}
            </div>
          </DrawerSection>

          <DrawerSection title="Direct approvals vs escalations">
            <div
              className="flex h-3 w-full overflow-hidden rounded-full bg-muted"
              role="img"
              aria-label={`${formatNumber(shown.directApprovals)} approved directly, ${formatNumber(shown.friendlyEscalations)} escalated unnecessarily`}
            >
              <div className="h-full bg-success" style={{ width: `${directPct}%` }} />
              <div className="h-full bg-danger/70" style={{ width: `${100 - directPct}%` }} />
            </div>
            <DrawerFacts
              className="mt-3"
              items={[
                {
                  label: "Directly approved",
                  value: <span className="font-mono tabular">{formatNumber(shown.directApprovals)}</span>,
                },
                {
                  label: "Unnecessarily escalated",
                  value: <span className="font-mono tabular">{formatNumber(shown.friendlyEscalations)}</span>,
                },
                { label: "Total decisions", value: <span className="font-mono tabular">{formatNumber(total)}</span> },
                {
                  label: "Range start",
                  value: <span className="font-mono tabular">{formatMoney(shown.minLimit, { compact: false })}</span>,
                },
              ]}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Unnecessary escalations are requests sent above this tier although its limit and categories covered them.
            </p>
          </DrawerSection>
        </>
      )}
    </DetailDrawer>
  );
}
