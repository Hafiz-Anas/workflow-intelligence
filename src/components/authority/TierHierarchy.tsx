"use client";

import { Fragment } from "react";
import { ArrowUp } from "lucide-react";
import { EmptyState, ErrorState } from "@/components/shared/EmptyState";
import { SectionCard } from "@/components/shared/SectionCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useTiers } from "@/lib/hooks/useTiers";
import type { AuthorityTier } from "@/lib/schemas";
import { TierCard } from "./TierCard";

function Connector() {
  return (
    <div className="flex h-8 items-center justify-center" aria-hidden>
      <div className="flex flex-col items-center text-muted-foreground">
        <ArrowUp className="-mb-1 h-3.5 w-3.5" />
        <span className="h-5 w-px bg-border" />
      </div>
      <span className="ms-2 text-[11px] text-muted-foreground">escalates to</span>
    </div>
  );
}

interface TierHierarchyProps {
  onOpenClause: (policyId: string, clause: string) => void;
  onOpenTier: (tierId: AuthorityTier["id"]) => void;
}

export function TierHierarchy({ onOpenClause, onOpenTier }: TierHierarchyProps) {
  const { data: tiers, isLoading, error, refetch } = useTiers();

  return (
    <SectionCard
      title="Authority tiers"
      description="Highest authority at the top. Requests route to the lowest tier whose limit and categories cover them."
    >
      {error ? (
        <ErrorState error={error} onRetry={() => void refetch()} />
      ) : isLoading || !tiers ? (
        <div className="space-y-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full" />
          ))}
        </div>
      ) : tiers.length === 0 ? (
        <EmptyState title="No authority tiers" description="Upload a delegation of authority policy to define tiers." />
      ) : (
        <ol aria-label="Authority hierarchy, highest first">
          {tiers.map((tier, index) => (
            <Fragment key={tier.id}>
              {index > 0 && (
                <li aria-hidden className="list-none">
                  <Connector />
                </li>
              )}
              <li className="list-none">
                <TierCard tier={tier} onOpenClause={onOpenClause} onOpenTier={onOpenTier} />
              </li>
            </Fragment>
          ))}
        </ol>
      )}
    </SectionCard>
  );
}
