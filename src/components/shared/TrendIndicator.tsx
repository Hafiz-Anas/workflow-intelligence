import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Trend } from "@/lib/schemas";
import { cn } from "@/lib/utils";

const map: Record<Trend, { label: string; icon: typeof ArrowUpRight; className: string }> = {
  rising: { label: "Rising", icon: ArrowUpRight, className: "text-danger" },
  stable: { label: "Stable", icon: ArrowRight, className: "text-muted-foreground" },
  falling: { label: "Falling", icon: ArrowDownRight, className: "text-success-fg" },
};

/** Risk trend: rising risk is bad (red), falling risk is good (green). */
export function TrendIndicator({ trend }: { trend: Trend }) {
  const entry = map[trend];
  const Icon = entry.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-medium", entry.className)}>
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {entry.label}
    </span>
  );
}
