import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { formatDuration, formatNumber, formatPercent } from "@/lib/format";
import type { BottleneckReport } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type Improvement = BottleneckReport["improvement"];
type Metric = Improvement["metrics"][number];

function formatValue(value: number, unit: Metric["unit"]) {
  if (unit === "hours") return formatDuration(value);
  if (unit === "percent") return formatPercent(value);
  return formatNumber(value);
}

/** Before and after comparison of key metrics with percentage change. */
export function ImprovementOverTime({ improvement }: { improvement: Improvement }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-3 rounded-sm bg-chart-3" aria-hidden /> {improvement.baselineLabel}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-3 rounded-sm bg-chart-1" aria-hidden /> {improvement.currentLabel}
        </span>
      </div>
      <ul className="space-y-4">
        {improvement.metrics.map((m) => {
          const max = Math.max(m.before, m.after) || 1;
          const change = ((m.after - m.before) / m.before) * 100;
          const better = m.lowerIsBetter ? change < 0 : change > 0;
          const Icon = change < 0 ? ArrowDownRight : ArrowUpRight;
          return (
            <li key={m.key}>
              <div className="mb-1.5 flex items-baseline justify-between gap-2">
                <span className="text-sm font-medium">{m.label}</span>
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 font-mono text-xs font-semibold tabular",
                    better ? "text-success-fg" : "text-danger",
                  )}
                  aria-label={`${Math.abs(change).toFixed(0)}% ${change < 0 ? "decrease" : "increase"}, ${better ? "improvement" : "deterioration"}`}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                  {change > 0 ? "+" : "−"}
                  {Math.abs(change).toFixed(0)}%
                </span>
              </div>
              <div className="space-y-1">
                {[
                  { label: "Before", value: m.before, className: "bg-chart-3" },
                  { label: "After", value: m.after, className: "bg-chart-1" },
                ].map((row) => (
                  <div key={row.label} className="grid grid-cols-[44px_minmax(0,1fr)_64px] items-center gap-2 text-xs">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="h-2 rounded-full bg-muted">
                      <span
                        className={cn("block h-2 rounded-full", row.className)}
                        style={{ width: `${(row.value / max) * 100}%` }}
                      />
                    </span>
                    <span className="text-end font-mono tabular">{formatValue(row.value, m.unit)}</span>
                  </div>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
      <p className="text-[11px] text-muted-foreground">Sample figures for demonstration; not measured results.</p>
    </div>
  );
}
