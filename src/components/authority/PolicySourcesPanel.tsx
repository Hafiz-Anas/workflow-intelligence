"use client";

import { FileText, RefreshCw } from "lucide-react";
import { EmptyState, ErrorState } from "@/components/shared/EmptyState";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/format";
import { usePolicies } from "@/lib/hooks/usePolicies";

interface PolicySourcesPanelProps {
  onOpenPolicy: (policyId: string) => void;
  onReplace: (policyId: string) => void;
}

export function PolicySourcesPanel({ onOpenPolicy, onReplace }: PolicySourcesPanelProps) {
  const { data: policies, isLoading, error, refetch } = usePolicies();

  return (
    <SectionCard
      title="Active Policy Sources"
      description="Documents the authority rules are read from."
      contentClassName="px-0 pb-0"
    >
      {error ? (
        <ErrorState error={error} onRetry={() => void refetch()} />
      ) : isLoading || !policies ? (
        <div className="space-y-3 px-4 pb-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : policies.length === 0 ? (
        <EmptyState title="No policies uploaded" description="Upload policies in the Policy Library to ground authority rules." />
      ) : (
        <ul className="divide-y border-t">
          {policies.map((policy) => (
            <li key={policy.id} className="flex items-center gap-3 px-4 py-2.5">
              <FileText className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              <div className="min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => onOpenPolicy(policy.id)}
                  className="block max-w-full truncate text-start text-sm font-medium hover:text-accent hover:underline"
                >
                  {policy.name}
                </button>
                <p className="text-xs text-muted-foreground">
                  <span className="font-mono tabular">v{policy.version}</span> · Uploaded {formatDate(policy.uploadedAt)}
                </p>
              </div>
              <StatusBadge status={policy.status} />
              <Button variant="outline" size="sm" onClick={() => onReplace(policy.id)} aria-label={`Replace ${policy.name}`}>
                <RefreshCw /> Replace
              </Button>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
