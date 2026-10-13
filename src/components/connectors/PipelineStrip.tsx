"use client";

import { Fragment } from "react";
import { Check, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/EmptyState";
import { usePipelineStatus } from "@/lib/hooks/useConnectors";
import { pipelineStages } from "@/lib/schemas";
import { cn } from "@/lib/utils";

/** Platform lifecycle stepper. Exactly one stage is current; the caption uses the same index. */
export function PipelineStrip() {
  const { data, isLoading, error, refetch } = usePipelineStatus();

  if (error) {
    return (
      <Card>
        <ErrorState error={error} onRetry={() => void refetch()} />
      </Card>
    );
  }

  if (isLoading || !data) {
    return (
      <Card className="p-4">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="mt-3 h-10 w-full" />
      </Card>
    );
  }

  const currentIndex = pipelineStages.indexOf(data.currentStage);

  return (
    <Card className="p-4">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-semibold">
          Stage <span className="font-mono tabular">{currentIndex + 1}</span> of{" "}
          <span className="font-mono tabular">{pipelineStages.length}</span>: {pipelineStages[currentIndex]}
        </p>
        <p className="text-xs text-muted-foreground">{data.description}</p>
      </div>
      <ol className="flex flex-wrap items-center gap-y-2" aria-label="Platform pipeline">
        {pipelineStages.map((stage, index) => {
          const state = index < currentIndex ? "done" : index === currentIndex ? "current" : "upcoming";
          return (
            <Fragment key={stage}>
              <li
                aria-current={state === "current" ? "step" : undefined}
                className={cn(
                  "flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium",
                  state === "done" && "border-success/30 bg-success/10 text-success-fg",
                  state === "current" && "border-accent bg-accent text-accent-foreground shadow-card",
                  state === "upcoming" && "border-border bg-card text-muted-foreground",
                )}
              >
                {state === "done" ? (
                  <Check className="h-3.5 w-3.5" aria-hidden />
                ) : (
                  <span className="font-mono tabular">{index + 1}</span>
                )}
                {stage}
                <span className="sr-only">
                  {state === "done" ? "(complete)" : state === "current" ? "(current stage)" : "(upcoming)"}
                </span>
              </li>
              {index < pipelineStages.length - 1 && (
                <li aria-hidden className="px-1 text-muted-foreground">
                  <ChevronRight className="h-4 w-4" />
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </Card>
  );
}
