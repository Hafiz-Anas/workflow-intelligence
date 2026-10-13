"use client";

import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { usePatterns } from "@/lib/hooks/useBottlenecks";

/** Detected patterns list. "Recommend Change" opens the pattern drawer. */
export function DetectedPatterns({ selectedId, onOpen }: { selectedId: string | null; onOpen: (id: string) => void }) {
  const { data: patterns, isLoading, error, refetch } = usePatterns();

  if (error) return <ErrorState error={error} onRetry={() => void refetch()} />;

  if (isLoading || !patterns) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (patterns.length === 0) return <EmptyState icon={Lightbulb} title="No patterns detected yet" />;

  return (
    <ul className="divide-y">
      {patterns.map((p) => (
        <li key={p.id} className="flex items-start gap-3 py-2.5 first:pt-0 last:pb-0">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="text-sm leading-snug">{p.text}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] text-muted-foreground tabular">{p.metric}</span>
              {p.status !== "open" && <StatusBadge status={p.status} />}
            </div>
          </div>
          <Button
            size="sm"
            variant={p.status === "open" ? "outline" : "ghost"}
            onClick={() => onOpen(p.id)}
            aria-expanded={selectedId === p.id}
          >
            {p.status === "open" ? "Recommend Change" : "View change"}
          </Button>
        </li>
      ))}
    </ul>
  );
}
