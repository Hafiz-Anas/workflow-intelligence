"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { riskLevelLabels, type Contract } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { heatBand, heatClasses, legendBands } from "./heat";

const levels = [5, 4, 3, 2, 1] as const;
const impacts = [1, 2, 3, 4, 5] as const;

interface RiskHeatmapProps {
  contracts: Contract[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

/** 5x5 likelihood × impact grid with contracts plotted as selectable markers. */
export function RiskHeatmap({ contracts, selectedId, onSelect }: RiskHeatmapProps) {
  const markerIndex = new Map(contracts.map((c, i) => [c.id, i + 1]));

  return (
    <div>
      <div className="flex gap-2">
        <div className="flex items-center">
          <span className="-rotate-180 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground [writing-mode:vertical-rl]">
            Likelihood
          </span>
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-[1.5rem_repeat(5,minmax(0,1fr))] gap-1" role="grid" aria-label="Risk heatmap, likelihood by impact">
            {levels.map((likelihood) => (
              <div key={likelihood} role="row" className="contents">
                <div className="flex items-center justify-center font-mono text-xs text-muted-foreground tabular" aria-hidden>
                  {likelihood}
                </div>
                {impacts.map((impact) => {
                  const score = likelihood * impact;
                  const cellContracts = contracts.filter((c) => c.likelihood === likelihood && c.impact === impact);
                  return (
                    <div
                      key={impact}
                      role="gridcell"
                      aria-label={`Likelihood ${likelihood}, impact ${impact}, score ${score}, ${cellContracts.length} contracts`}
                      className={cn(
                        "relative flex min-h-[64px] flex-wrap content-center items-center justify-center gap-1.5 rounded-sm p-1.5",
                        heatClasses[heatBand(score)],
                      )}
                    >
                      <span className="absolute end-1 top-0.5 font-mono text-[10px] text-text/60 tabular" aria-hidden>
                        {score}
                      </span>
                      {cellContracts.map((c) => {
                        const selected = c.id === selectedId;
                        return (
                          <Tooltip key={c.id}>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                onClick={() => onSelect(c.id)}
                                aria-pressed={selected}
                                aria-label={`${c.name}, ${c.vendor}, ${riskLevelLabels[c.riskLevel]} risk`}
                                className={cn(
                                  "flex items-center justify-center rounded-full border-2 border-card bg-navy-900 font-mono text-[11px] font-semibold text-primary-foreground shadow-card transition-all hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 dark:bg-card dark:text-text",
                                  selected ? "h-8 w-8 ring-2 ring-accent ring-offset-2 ring-offset-card" : "h-6 w-6",
                                )}
                              >
                                {markerIndex.get(c.id)}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="font-medium">{c.name}</p>
                              <p className="opacity-80">{c.vendor}</p>
                              <p className="mt-0.5">
                                {riskLevelLabels[c.riskLevel]} · L{c.likelihood} × I{c.impact}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
            <div aria-hidden />
            {impacts.map((impact) => (
              <div key={impact} className="text-center font-mono text-xs text-muted-foreground tabular" aria-hidden>
                {impact}
              </div>
            ))}
          </div>
          <p className="mt-1 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Impact</p>
        </div>
      </div>

      <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs" aria-label="Heatmap legend">
        {legendBands.map((b) => (
          <li key={b.band} className="flex items-center gap-1.5">
            <span className={cn("h-3 w-5 rounded-sm border", heatClasses[b.band])} aria-hidden />
            <span className="font-medium">{riskLevelLabels[b.level]}</span>
            <span className="font-mono text-muted-foreground tabular">{b.range}</span>
          </li>
        ))}
        <li className="flex items-center gap-1.5 text-muted-foreground">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-navy-900 font-mono text-[9px] text-primary-foreground dark:bg-navy-700 dark:text-primary-foreground" aria-hidden>
            1
          </span>
          Contract (number matches table order)
        </li>
      </ul>
    </div>
  );
}

export function RiskHeatmapSkeleton() {
  return (
    <div className="grid grid-cols-5 gap-1 ps-8">
      {Array.from({ length: 25 }).map((_, i) => (
        <Skeleton key={i} className="h-16" />
      ))}
    </div>
  );
}
