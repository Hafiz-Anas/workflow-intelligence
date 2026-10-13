"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatNumber } from "@/lib/format";
import type { BottleneckReport } from "@/lib/schemas";
import { axisTick, chartColors, ChartTooltip } from "./chartTheme";

interface EscalationTrendChartProps {
  data: BottleneckReport["escalationTrend"];
}

/** Escalation volume over the last six months: total and avoidable. */
export function EscalationTrendChart({ data }: EscalationTrendChartProps) {
  const first = data[0];
  const last = data[data.length - 1];
  const summary =
    first && last
      ? `Line chart of escalations from ${first.month} to ${last.month}. Total fell from ${first.total} to ${last.total}; avoidable fell from ${first.avoidable} to ${last.avoidable}.`
      : "Line chart of escalation volume over six months.";

  return (
    <div role="img" aria-label={summary} className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: -8 }}>
          <CartesianGrid vertical={false} stroke={chartColors.grid} strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={axisTick} tickLine={false} axisLine={{ stroke: chartColors.grid }} />
          <YAxis tick={axisTick} tickLine={false} axisLine={false} width={44} />
          <Tooltip
            cursor={{ stroke: chartColors.axis, strokeDasharray: "3 3" }}
            content={(props) => <ChartTooltip {...props} formatValue={(v) => formatNumber(v)} />}
          />
          <Legend
            verticalAlign="top"
            align="right"
            height={28}
            iconType="plainline"
            formatter={(value: string) => <span className="text-xs text-muted-foreground">{value}</span>}
          />
          <Line
            type="monotone"
            dataKey="total"
            name="All escalations"
            stroke={chartColors.primary}
            strokeWidth={2}
            dot={{ r: 4, fill: chartColors.primary, stroke: chartColors.surface, strokeWidth: 2 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="avoidable"
            name="Avoidable escalations"
            stroke={chartColors.danger}
            strokeWidth={2}
            strokeDasharray="5 3"
            dot={{ r: 4, fill: chartColors.danger, stroke: chartColors.surface, strokeWidth: 2 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
