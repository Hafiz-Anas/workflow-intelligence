import { ArrowUpRight, Bot, CheckCircle2, Clock, Gavel, Inbox, Route, UserCheck, type LucideIcon } from "lucide-react";
import { formatDateTime } from "@/lib/format";
import type { TimelineEvent, TimelineKind } from "@/lib/schemas";
import { cn } from "@/lib/utils";

const kinds: Record<TimelineKind, { icon: LucideIcon; className: string }> = {
  received: { icon: Inbox, className: "bg-muted text-muted-foreground" },
  review: { icon: UserCheck, className: "bg-muted text-muted-foreground" },
  routing: { icon: Route, className: "bg-accent/10 text-accent" },
  escalation: { icon: ArrowUpRight, className: "bg-warning/15 text-warning-fg" },
  analysis: { icon: Bot, className: "bg-accent/10 text-accent" },
  waiting: { icon: Clock, className: "bg-muted text-muted-foreground" },
  decision: { icon: Gavel, className: "bg-success/15 text-success-fg" },
};

export function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="relative space-y-4 ps-1">
      {events.map((event, index) => {
        const kind = kinds[event.kind];
        const Icon = kind.icon;
        const last = index === events.length - 1;
        return (
          <li key={event.id} className="relative flex gap-3">
            {!last && <span className="absolute start-[13px] top-7 h-[calc(100%-4px)] w-px bg-border" aria-hidden />}
            <span className={cn("z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full", kind.className)}>
              <Icon className="h-3.5 w-3.5" aria-hidden />
            </span>
            <div
              className={cn(
                "min-w-0 flex-1 pb-0.5",
                event.kind === "escalation" && "rounded-md border border-warning/30 bg-warning/5 p-2.5",
                event.kind === "decision" && "rounded-md border border-success/30 bg-success/5 p-2.5",
              )}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p className="text-sm font-medium">
                  {event.action}
                  {event.kind === "escalation" && <span className="ms-2 text-[11px] font-medium text-warning-fg">Escalation</span>}
                  {event.kind === "decision" && <CheckCircle2 className="ms-1.5 inline h-3.5 w-3.5 text-success-fg" aria-hidden />}
                </p>
                <time dateTime={event.at} className="font-mono text-[11px] text-muted-foreground tabular">
                  {formatDateTime(event.at)}
                </time>
              </div>
              <p className="text-xs text-muted-foreground">{event.actor}</p>
              <p className="mt-0.5 text-sm">{event.note}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
