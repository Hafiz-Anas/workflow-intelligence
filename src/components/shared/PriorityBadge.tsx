import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import type { PriorityLabel } from "@/lib/schemas";
import { cn } from "@/lib/utils";

const styles: Record<PriorityLabel, { className: string; icon: typeof ArrowUp; text: string }> = {
  high: { className: "border-danger/30 bg-danger/10 text-danger", icon: ArrowUp, text: "High" },
  medium: { className: "border-warning/30 bg-warning/10 text-warning-fg", icon: Minus, text: "Medium" },
  low: { className: "border-border bg-muted text-muted-foreground", icon: ArrowDown, text: "Low" },
};

interface PriorityBadgeProps {
  score: number;
  label: PriorityLabel;
  /** Hide the text label (icon + score only). */
  compact?: boolean;
}

/** Numeric priority chip. Colour is always paired with an icon and the score. */
export function PriorityBadge({ score, label, compact = false }: PriorityBadgeProps) {
  const style = styles[label];
  const Icon = style.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 font-mono text-xs font-semibold tabular",
        style.className,
      )}
      aria-label={`${style.text} priority, score ${score}`}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {score}
      {!compact && <span className="font-sans text-[11px] font-medium">{style.text}</span>}
    </span>
  );
}
