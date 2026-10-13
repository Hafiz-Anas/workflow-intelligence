"use client";

import Link from "next/link";
import { Pause, Timer } from "lucide-react";
import { formatClock } from "@/lib/format";
import { useNow } from "@/lib/hooks/useNow";
import { remainingSeconds, useAttentionClock } from "@/lib/store/attentionClock";
import { cn } from "@/lib/utils";

/** Persistent indicator of the running Attention Clock, shown in the top bar on every screen. */
export function MiniTimer() {
  const clock = useAttentionClock();
  const visible = clock.item !== null && (clock.status === "running" || clock.status === "paused");
  const now = useNow(1000, clock.status === "running");

  if (!visible || !clock.item) return null;

  const remaining = remainingSeconds(clock, now);
  const over = remaining < 0;
  const display = over ? `+${formatClock(-remaining)}` : formatClock(Math.ceil(remaining));

  return (
    <Link
      href="/priority-queue"
      className={cn(
        "flex h-8 items-center gap-2 rounded-md border px-2.5 text-xs transition-colors hover:bg-muted",
        over ? "border-danger/40 text-danger" : "border-border",
      )}
      aria-label={`Attention clock: ${clock.item.title}, ${clock.status === "paused" ? "paused" : over ? "over time" : "remaining"} ${display}`}
    >
      {clock.status === "paused" ? (
        <Pause className="h-3.5 w-3.5 text-warning-fg" aria-hidden />
      ) : (
        <Timer className="h-3.5 w-3.5 text-accent" aria-hidden />
      )}
      <span className="hidden max-w-[160px] truncate text-muted-foreground xl:inline">{clock.item.title}</span>
      <span className="font-mono font-semibold tabular">{display}</span>
    </Link>
  );
}
