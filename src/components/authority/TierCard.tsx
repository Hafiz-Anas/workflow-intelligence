"use client";

import { BookOpen, Landmark, PanelLeftOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatMoney, formatNumber, formatPercent } from "@/lib/format";
import type { AuthorityTier } from "@/lib/schemas";
import { cn } from "@/lib/utils";

export function clauseOf(groundingClause: string): string {
  return groundingClause.match(/§[\d.()a-z]+/)?.[0] ?? "";
}

export function tierLimitLabel(tier: AuthorityTier): string {
  if (tier.maxLimit === null) return `Above ${formatMoney(tier.minLimit)}`;
  if (tier.minLimit > 0) return `${formatMoney(tier.minLimit)} – ${formatMoney(tier.maxLimit)}`;
  return `Up to ${formatMoney(tier.maxLimit)}`;
}

interface TierCardProps {
  tier: AuthorityTier;
  onOpenClause: (policyId: string, clause: string) => void;
  onOpenTier: (tierId: AuthorityTier["id"]) => void;
}

/** Clicking anywhere on the card opens the tier drawer; the Details button is the keyboard path. */
export function TierCard({ tier, onOpenClause, onOpenTier }: TierCardProps) {
  const total = tier.directApprovals + tier.friendlyEscalations;
  const directPct = total ? (tier.directApprovals / total) * 100 : 0;
  const efficiencyTone =
    tier.delegationEfficiency >= 85 ? "text-success-fg" : tier.delegationEfficiency >= 75 ? "text-warning-fg" : "text-danger";

  return (
    <Card
      className="cursor-pointer p-4 transition-colors hover:border-accent/50"
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) return;
        onOpenTier(tier.id);
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground dark:bg-navy-700">
            <Landmark className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <h3 className="text-base font-semibold leading-tight">
              {tier.name} <span className="font-normal text-muted-foreground">· {tier.role}</span>
            </h3>
            <p className="mt-1 text-sm">
              <span className="text-muted-foreground">Authorization limit: </span>
              <span className="font-mono font-semibold tabular">{tierLimitLabel(tier)}</span>
              {tier.limitNote && <span className="text-muted-foreground"> · {tier.limitNote}</span>}
            </p>
            <button
              type="button"
              onClick={() => onOpenClause(tier.policySourceId, clauseOf(tier.groundingClause))}
              className="mt-1 inline-flex items-center gap-1.5 rounded-sm text-xs text-accent underline decoration-dotted underline-offset-2 hover:decoration-solid"
            >
              <BookOpen className="h-3.5 w-3.5" aria-hidden />
              <span>
                Grounded in <span className="font-mono">{tier.groundingClause}</span>
              </span>
            </button>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="text-end">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Delegation efficiency</p>
            <p className={cn("font-mono text-xl font-semibold tabular", efficiencyTone)}>
              {formatPercent(tier.delegationEfficiency)}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => onOpenTier(tier.id)} aria-label={`Details for ${tier.name}`}>
            <PanelLeftOpen /> Details
          </Button>
        </div>
      </div>

      <div className="mt-3">
        <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Approvable without escalation
        </p>
        <div className="flex flex-wrap gap-1">
          {tier.categoriesApprovable.map((c) => (
            <Badge key={c} variant="muted">
              {c}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mt-3">
        <div className="mb-1 flex items-baseline justify-between text-[11px] text-muted-foreground">
          <span>Decisions reaching this tier</span>
          <span className="font-mono tabular">{formatNumber(total)} total</span>
        </div>
        <div
          className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted"
          role="img"
          aria-label={`${formatNumber(tier.directApprovals)} approved directly, ${formatNumber(tier.friendlyEscalations)} escalated unnecessarily`}
        >
          <div className="h-full bg-success" style={{ width: `${directPct}%` }} />
          <div
            className="h-full bg-danger/70 bg-[repeating-linear-gradient(45deg,transparent,transparent_3px,rgb(var(--card)/0.45)_3px,rgb(var(--card)/0.45)_5px)]"
            style={{ width: `${100 - directPct}%` }}
          />
        </div>
        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-success" aria-hidden />
            Directly approved <span className="font-mono font-semibold tabular">{formatNumber(tier.directApprovals)}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-sm bg-danger/70 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgb(var(--card)/0.45)_2px,rgb(var(--card)/0.45)_3px)]"
              aria-hidden
            />
            Unnecessarily escalated{" "}
            <span className="font-mono font-semibold tabular">{formatNumber(tier.friendlyEscalations)}</span>
          </span>
        </div>
      </div>
    </Card>
  );
}
