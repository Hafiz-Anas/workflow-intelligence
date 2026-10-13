import { AlertOctagon, ArrowDownToLine } from "lucide-react";
import { formatNumber, formatPercent } from "@/lib/format";
import type { BottleneckReport } from "@/lib/schemas";

interface AlertBannerProps {
  alert: BottleneckReport["alert"];
  avoidable: BottleneckReport["avoidableEscalations"];
}

/** Red alert for the main unnecessary-escalation bottleneck, with the avoidable escalation metric. */
export function AlertBanner({ alert, avoidable }: AlertBannerProps) {
  return (
    <div
      role="alert"
      className="grid gap-4 rounded-lg border border-danger/40 bg-danger/10 p-4 lg:grid-cols-[minmax(0,1fr)_auto]"
    >
      <div className="flex items-start gap-3">
        <AlertOctagon className="mt-0.5 h-5 w-5 shrink-0 text-danger" aria-hidden />
        <div>
          <p className="text-sm font-semibold text-danger">
            {alert.title}: <span className="font-mono tabular">{formatNumber(alert.idleHours)}</span> hours idle backlog
          </p>
          <p className="mt-0.5 text-sm text-text">{alert.detail}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-md border border-danger/30 bg-card px-4 py-2.5">
        <ArrowDownToLine className="h-4 w-4 shrink-0 text-danger" aria-hidden />
        <div>
          <p className="font-mono text-xl font-semibold tabular">
            {formatNumber(avoidable.count)}{" "}
            <span className="text-sm font-normal text-muted-foreground">of {formatNumber(avoidable.total)}</span>{" "}
            <span className="text-sm text-danger">({formatPercent(avoidable.percent)})</span>
          </p>
          <p className="text-xs text-muted-foreground">escalations could have been resolved at a lower authority level</p>
        </div>
      </div>
    </div>
  );
}
