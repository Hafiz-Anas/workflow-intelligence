import { Progress } from "@/components/ui/progress";
import { formatDuration } from "@/lib/format";
import type { Request } from "@/lib/schemas";
import { cn } from "@/lib/utils";

export function slaHours(request: Request) {
  return (new Date(request.deadlineAt).getTime() - new Date(request.receivedAt).getTime()) / 3_600_000;
}

/** Time elapsed against the service-level deadline. Turns red when over. */
export function DeadlineProgress({ request }: { request: Request }) {
  const sla = slaHours(request);
  const ratio = request.elapsedHours / sla;
  const over = ratio > 1;
  const warn = !over && ratio >= 0.75;

  return (
    <div className="w-24">
      <div className="mb-1 flex items-baseline justify-between gap-1 whitespace-nowrap font-mono text-[11px] tabular">
        <span className={cn(over ? "font-semibold text-danger" : "text-text")}>{formatDuration(request.elapsedHours)}</span>
        <span className="text-muted-foreground">/ {formatDuration(sla)}</span>
      </div>
      <Progress
        value={Math.min(100, ratio * 100)}
        aria-label={`${Math.round(ratio * 100)}% of deadline used`}
        indicatorClassName={cn(over ? "bg-danger" : warn ? "bg-warning" : "bg-success")}
      />
      {over && <p className="mt-0.5 text-[11px] font-medium text-danger">Over by {formatDuration(request.elapsedHours - sla)}</p>}
    </div>
  );
}
