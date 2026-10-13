"use client";

import { Clock, GitBranch, Target } from "lucide-react";
import { ErrorState } from "@/components/shared/EmptyState";
import { StatCard, StatCardSkeleton } from "@/components/shared/StatCard";
import { Card } from "@/components/ui/card";
import { formatNumber, formatPercent } from "@/lib/format";
import { useAuthorityKpis } from "@/lib/hooks/useTiers";

export function AuthorityKpis() {
  const { data, isLoading, error, refetch } = useAuthorityKpis();

  if (error) {
    return (
      <Card className="mb-4">
        <ErrorState error={error} onRetry={() => void refetch()} />
      </Card>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="mb-4 grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const gap = data.directApprovalTarget - data.directApprovalRate;
  const belowTarget = gap > 0;

  return (
    <div className="mb-4 grid gap-4 md:grid-cols-3">
      <StatCard
        label="Direct approval rate"
        value={formatPercent(data.directApprovalRate)}
        icon={Target}
        tone={belowTarget ? "warning" : "success"}
        hint={
          <span>
            Target {formatPercent(data.directApprovalTarget, 0)} ·{" "}
            <span className={belowTarget ? "font-medium text-warning-fg" : "font-medium text-success-fg"}>
              {formatNumber(Math.abs(gap), 1)} pts {belowTarget ? "below" : "above"} target
            </span>
          </span>
        }
        footer={
          <div className="relative">
            <div
              className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={data.directApprovalRate}
              aria-label={`Direct approval rate ${formatPercent(data.directApprovalRate)} against a target of ${formatPercent(data.directApprovalTarget, 0)}`}
            >
              <div className="h-full rounded-full bg-accent" style={{ width: `${data.directApprovalRate}%` }} />
            </div>
            <span
              className="absolute -top-1 h-3.5 w-0.5 rounded-full bg-text"
              style={{ insetInlineStart: `${data.directApprovalTarget}%` }}
              aria-hidden
            />
          </div>
        }
      />
      <StatCard
        label="Friction escalations"
        value={formatPercent(data.frictionEscalationRate)}
        icon={GitBranch}
        tone="danger"
        hint={`Escalated although a lower tier could approve · ${formatNumber(Math.round((data.frictionEscalationRate / 100) * data.totalDecisions))} of ${formatNumber(data.totalDecisions)} decisions`}
      />
      <StatCard
        label="Review latency"
        value={`${formatNumber(data.reviewLatencyHours)} h`}
        icon={Clock}
        tone="warning"
        hint="Reviewer hours spent on unnecessary escalations"
      />
    </div>
  );
}
