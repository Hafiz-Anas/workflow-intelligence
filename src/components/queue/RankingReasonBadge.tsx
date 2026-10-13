import { CircleDollarSign, Clock, ShieldAlert } from "lucide-react";
import type { RankingReason } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const reasons: Record<RankingReason, { label: string; icon: typeof Clock; explanation: string }> = {
  deadline: { label: "Deadline", icon: Clock, explanation: "Ranked here because its service-level deadline is close or has passed." },
  financial_exposure: {
    label: "Financial exposure",
    icon: CircleDollarSign,
    explanation: "Ranked here because of the value at stake or the cost of delay.",
  },
  risk_level: { label: "Risk level", icon: ShieldAlert, explanation: "Ranked here because of linked operational or contract risk." },
};

/** Small "why it ranks here" badge with an explanatory tooltip. */
export function RankingReasonBadge({ reason, className }: { reason: RankingReason; className?: string }) {
  const entry = reasons[reason];
  const Icon = entry.icon;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          tabIndex={0}
          className={cn(
            "inline-flex items-center gap-1 whitespace-nowrap rounded-sm border border-accent/25 bg-accent/5 px-1.5 py-0.5 text-[11px] font-medium text-accent",
            className,
          )}
        >
          <Icon className="h-3 w-3" aria-hidden />
          {entry.label}
        </span>
      </TooltipTrigger>
      <TooltipContent>{entry.explanation}</TooltipContent>
    </Tooltip>
  );
}
