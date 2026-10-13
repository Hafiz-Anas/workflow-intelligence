"use client";

import type { TooltipProps } from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

/** Chart styling read from design tokens so light and dark mode switch together. */
export const chartColors = {
  primary: "rgb(var(--chart-1))",
  secondary: "rgb(var(--chart-2))",
  neutral: "rgb(var(--chart-3))",
  danger: "rgb(var(--danger))",
  grid: "rgb(var(--border))",
  axis: "rgb(var(--text-muted))",
  surface: "rgb(var(--card))",
};

export const axisTick = { fill: chartColors.axis, fontSize: 12 };

interface ChartTooltipProps extends TooltipProps<ValueType, NameType> {
  formatValue: (value: number) => string;
}

/** Tooltip using card and border tokens; values in tabular mono. */
export function ChartTooltip({ active, payload, label, formatValue }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border bg-card px-3 py-2 text-xs shadow-md">
      <p className="mb-1 font-medium text-text">{label}</p>
      <ul className="space-y-0.5">
        {payload.map((entry) => (
          <li key={String(entry.dataKey)} className="flex items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: entry.color }} aria-hidden />
            <span className="text-muted-foreground">{entry.name}</span>
            <span className="ms-auto ps-3 font-mono font-semibold tabular text-text">{formatValue(Number(entry.value))}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
