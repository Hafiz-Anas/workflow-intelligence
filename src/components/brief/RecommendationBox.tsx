"use client";

import { BookOpen, Lightbulb } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatPercent } from "@/lib/format";
import type { DecisionBrief } from "@/lib/schemas";

interface RecommendationBoxProps {
  recommendation: DecisionBrief["recommendation"];
  onOpenPolicy: () => void;
}

export function RecommendationBox({ recommendation, onOpenPolicy }: RecommendationBoxProps) {
  const { action, confidence, rationale, policySource } = recommendation;
  return (
    <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-accent">
        <Lightbulb className="h-3.5 w-3.5" aria-hidden /> Recommendation
      </div>
      <p className="mt-1.5 text-base font-semibold">{action}</p>
      <div className="mt-2 flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <span tabIndex={0} className="whitespace-nowrap text-xs text-muted-foreground underline decoration-dotted underline-offset-2">
              Sample confidence
            </span>
          </TooltipTrigger>
          <TooltipContent>Illustrative value for this demo. Not a measured accuracy figure.</TooltipContent>
        </Tooltip>
        <Progress value={confidence} className="h-1.5 flex-1" aria-label={`Sample confidence ${formatPercent(confidence)}`} />
        <span className="font-mono text-sm font-semibold tabular">{formatPercent(confidence)}</span>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{rationale}</p>
      <button
        type="button"
        onClick={onOpenPolicy}
        className="mt-3 inline-flex max-w-full items-center gap-1.5 rounded-sm border border-border bg-card px-2 py-1 text-xs transition-colors hover:border-accent hover:text-accent"
      >
        <BookOpen className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span className="text-muted-foreground">Policy source:</span>
        <span className="truncate font-medium">{policySource.label}</span>
        <span className="font-mono text-accent">{policySource.clause}</span>
      </button>
    </div>
  );
}
