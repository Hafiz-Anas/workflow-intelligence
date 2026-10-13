"use client";

import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Request } from "@/lib/schemas";
import { RankingReasonBadge } from "./RankingReasonBadge";

interface NextActionCardProps {
  request: Request;
  onStart: () => void;
}

export function NextActionCard({ request, onStart }: NextActionCardProps) {
  return (
    <div className="rounded-md border border-accent/30 bg-accent/5 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">Next recommended action</p>
      <p className="mt-1 text-sm font-medium leading-snug">
        {request.title} <span className="whitespace-nowrap text-muted-foreground">– {request.recommendedAttentionMinutes} minutes</span>
      </p>
      <div className="mt-2 flex items-center gap-2">
        <RankingReasonBadge reason={request.rankingReason} />
        <span className="font-mono text-[11px] text-muted-foreground">{request.id}</span>
      </div>
      <div className="mt-3 flex gap-2">
        <Button size="sm" onClick={onStart}>
          <Play /> Start
        </Button>
        <Button size="sm" variant="ghost" asChild>
          <Link href={`/decision-brief/${request.id}`}>
            Open brief <ArrowRight />
          </Link>
        </Button>
      </div>
    </div>
  );
}
