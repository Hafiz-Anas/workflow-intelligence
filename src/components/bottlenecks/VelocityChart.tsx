"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatDuration } from "@/lib/format";
import type { BottleneckReport } from "@/lib/schemas";
import { axisTick, chartColors, ChartTooltip } from "./chartTheme";

const TARGET_HOURS = 24;

interface VelocityChartProps {
  data: BottleneckReport["approvalTimeByDepartment"];
}

/** Average approval time by department, slowest first, against the 24 h target. */
export function VelocityChart({ data }: VelocityChartProps) {
  const sorted = useMemo(() => [...data].sort((a, b) => b.hours - a.hours), [data]);
  const slowest = sorted[0];
  const fastest = sorted[sorted.length - 1];
  const summary =
    slowest && fastest
      ? `Bar chart of average approval time by department. Slowest: ${slowest.department}, ${formatDuration(slowest.hours)}. Fastest: ${fastest.department}, ${formatDuration(fastest.hours)}. Target ${TARGET_HOURS} hours.`
      : "Bar chart of average approval time by department.";

  return (
    <div role="img" aria-label={summary} className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sorted} layout="vertical" margin={{ top: 20, right: 24, bottom: 0, left: 0 }} barCategoryGap={6}>
          <CartesianGrid horizontal={false} stroke={chartColors.grid} strokeDasharray="3 3" />
          <XAxis
            type="number"
            tick={axisTick}
            tickLine={false}
            axisLine={{ stroke: chartColors.grid }}
            tickFormatter={(v: number) => `${v} h`}
          />
          <YAxis type="category" dataKey="department" width={150} tick={axisTick} tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ fill: chartColors.grid, fillOpacity: 0.25 }}
            content={(props) => <ChartTooltip {...props} formatValue={formatDuration} />}
          />
          <ReferenceLine
            x={TARGET_HOURS}
            stroke={chartColors.danger}
            strokeDasharray="4 4"
            label={{ value: `${TARGET_HOURS} h target`, position: "top", fill: chartColors.axis, fontSize: 11 }}
          />
          <Bar dataKey="hours" name="Avg approval time" fill={chartColors.primary} radius={[0, 4, 4, 0]} maxBarSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
