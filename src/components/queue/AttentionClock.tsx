"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { CheckCircle2, CircleCheck, Pause, Play, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/shared/EmptyState";
import { formatClock } from "@/lib/format";
import { useNow } from "@/lib/hooks/useNow";
import type { Request } from "@/lib/schemas";
import { remainingSeconds, useAttentionClock, type ClockItem } from "@/lib/store/attentionClock";
import { cn } from "@/lib/utils";
import { NextActionCard } from "./NextActionCard";

const RADIUS = 76;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function toClockItem(r: Request): ClockItem {
  return { requestId: r.id, title: r.title, minutes: r.recommendedAttentionMinutes };
}

function isOpen(r: Request) {
  return r.status !== "approved" && r.status !== "declined";
}

/** "6 minutes" / "45 seconds" */
function describeDelta(ms: number) {
  const seconds = Math.round(Math.abs(ms) / 1000);
  if (seconds < 60) return `${seconds} second${seconds === 1 ? "" : "s"}`;
  const minutes = Math.round(seconds / 60);
  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
}

interface AttentionClockProps {
  requests: Request[] | undefined;
  isLoading: boolean;
  error: unknown;
  onRetry: () => void;
}

export function AttentionClock({ requests, isLoading, error, onRetry }: AttentionClockProps) {
  const clock = useAttentionClock();
  const { item, status, load, start, pause, complete, completedIds, lastResult } = clock;
  const now = useNow(250, status === "running");

  const queue = useMemo(
    () =>
      (requests ?? []).filter((r) => isOpen(r) && !completedIds.includes(r.id)).sort((a, b) => b.priorityScore - a.priorityScore),
    [requests, completedIds],
  );

  // Load the top recommended item the first time requests arrive.
  useEffect(() => {
    if (!item && queue[0]) load(toClockItem(queue[0]));
  }, [item, queue, load]);

  const next = queue.find((r) => r.id !== item?.requestId);

  if (error) {
    return (
      <Card>
        <ErrorState error={error} onRetry={onRetry} />
      </Card>
    );
  }

  if (isLoading || (!item && queue.length > 0)) {
    return (
      <Card className="p-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-2 h-4 w-48" />
        <Skeleton className="mx-auto mt-6 h-40 w-40 rounded-full" />
        <Skeleton className="mt-6 h-9 w-full" />
      </Card>
    );
  }

  if (!item) {
    return (
      <Card>
        <EmptyState icon={CircleCheck} title="Queue clear" description="There are no open requests to work on." />
      </Card>
    );
  }

  const total = item.minutes * 60;
  const remaining = remainingSeconds(clock, now);
  const over = remaining < 0;
  // Never show 00:00 while time remains: round up remaining seconds.
  const display = over ? `+${formatClock(-remaining)}` : formatClock(Math.ceil(remaining));
  const fraction = over ? 1 : Math.max(0, remaining / total);
  const deltaMs = lastResult ? lastResult.item.minutes * 60_000 - lastResult.actualMs : 0;

  const startNext = () => {
    if (!next) return;
    load(toClockItem(next));
    start();
  };

  const statusLabel = {
    idle: "Ready",
    running: over ? "Over time" : "In progress",
    paused: "Paused",
    completed: "Completed",
  }[status];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-accent" aria-hidden /> Attention Clock
          </CardTitle>
          <span
            className={cn(
              "rounded-sm px-1.5 py-0.5 text-[11px] font-medium",
              status === "running" && !over && "bg-accent/10 text-accent",
              status === "running" && over && "bg-danger/10 text-danger",
              status === "paused" && "bg-warning/10 text-warning-fg",
              status === "completed" && "bg-success/10 text-success-fg",
              status === "idle" && "bg-muted text-muted-foreground",
            )}
          >
            {statusLabel}
          </span>
        </div>
        <CardDescription>Recommended focus time for the top item in your queue.</CardDescription>
      </CardHeader>
      {/* Stacked in the side column (3xl+); a horizontal band above the table on narrower screens. */}
      <CardContent className="space-y-4 md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-x-8 md:gap-y-4 md:space-y-0 3xl:block 3xl:space-y-4">
        <div className="md:col-start-1 md:row-start-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {status === "completed" ? "Just completed" : "Top recommended item"}
          </p>
          <Link
            href={`/decision-brief/${item.requestId}`}
            className="mt-0.5 block text-sm font-medium leading-snug hover:text-accent hover:underline"
          >
            {item.title}
          </Link>
          <p className="text-xs text-muted-foreground">
            Recommended time: <span className="font-mono tabular">{item.minutes} minutes</span>
          </p>
        </div>

        <div
          className="relative mx-auto h-44 w-44 md:col-start-2 md:row-span-2 md:row-start-1 md:self-center"
          role="timer"
          aria-live="off"
          aria-label={`${statusLabel}: ${display}`}
        >
          <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90" aria-hidden>
            <circle cx="90" cy="90" r={RADIUS} fill="none" strokeWidth="10" className="stroke-muted" />
            <circle
              cx="90"
              cy="90"
              r={RADIUS}
              fill="none"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - fraction)}
              className={cn(
                "transition-[stroke-dashoffset] duration-300 ease-linear",
                over
                  ? "stroke-danger"
                  : status === "completed"
                    ? "stroke-success"
                    : status === "paused"
                      ? "stroke-warning"
                      : "stroke-accent",
              )}
            />
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn("font-mono text-3xl font-semibold tabular", over && "text-danger")}>{display}</span>
            <span className="text-[11px] text-muted-foreground">
              {status === "completed" ? "at completion" : over ? "over recommended" : "remaining"}
            </span>
          </div>
        </div>

        <div className="md:col-start-1 md:row-start-2 md:self-end">
          {status !== "completed" ? (
            <div className="grid grid-cols-3 gap-2">
              <Button
                size="sm"
                onClick={start}
                disabled={status === "running"}
                aria-pressed={status === "running"}
                className="disabled:opacity-100"
              >
                <Play /> {status === "running" ? "In progress" : status === "paused" ? "Resume" : "Start"}
              </Button>
              <Button size="sm" variant="outline" onClick={pause} disabled={status !== "running"}>
                <Pause /> Pause
              </Button>
              <Button size="sm" variant="outline" onClick={complete} disabled={status === "idle"}>
                <CheckCircle2 /> Complete
              </Button>
            </div>
          ) : (
            lastResult && (
              <div
                role="status"
                className={cn(
                  "flex items-start gap-2 rounded-md border p-3 text-sm",
                  deltaMs >= 0 ? "border-success/30 bg-success/10" : "border-warning/30 bg-warning/10",
                )}
              >
                <CheckCircle2
                  className={cn("mt-0.5 h-4 w-4 shrink-0", deltaMs >= 0 ? "text-success-fg" : "text-warning-fg")}
                  aria-hidden
                />
                <p>
                  {Math.abs(deltaMs) < 1000
                    ? "Completed exactly on the recommended time."
                    : deltaMs > 0
                      ? `Completed ${describeDelta(deltaMs)} ahead of recommended time.`
                      : `Completed ${describeDelta(deltaMs)} over the recommended time.`}
                </p>
              </div>
            )
          )}
        </div>

        <div className="md:col-start-3 md:row-span-2 md:row-start-1 3xl:space-y-4">
          {status === "completed" && next && <NextActionCard request={next} onStart={startNext} />}
          {status === "completed" && !next && (
            <p className="text-sm text-muted-foreground">No further recommended items. The queue is clear.</p>
          )}

          {status !== "completed" && next && (
            <div className="border-t pt-3 md:border-t-0 md:pt-0 3xl:border-t 3xl:pt-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Up next</p>
              <ul className="mt-1.5 space-y-1.5">
                {queue
                  .filter((r) => r.id !== item.requestId)
                  .slice(0, 3)
                  .map((r) => (
                    <li key={r.id} className="flex items-center justify-between gap-2 text-xs">
                      <Link href={`/decision-brief/${r.id}`} className="truncate hover:text-accent hover:underline">
                        {r.title}
                      </Link>
                      <span className="shrink-0 font-mono text-muted-foreground tabular">
                        {r.recommendedAttentionMinutes} min
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
