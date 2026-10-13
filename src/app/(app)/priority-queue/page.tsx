"use client";

import { useMemo } from "react";
import { AlertCircle, ArrowUp, Clock, Inbox } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { AttentionClock } from "@/components/queue/AttentionClock";
import { QueueFilters } from "@/components/queue/QueueFilters";
import { RequestsTable } from "@/components/queue/RequestsTable";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatCard, StatCardSkeleton } from "@/components/shared/StatCard";
import { Progress } from "@/components/ui/progress";
import { formatDuration, formatNumber } from "@/lib/format";
import { useQueueSummary, useRequests } from "@/lib/hooks/useRequests";
import { cn } from "@/lib/utils";

export default function PriorityQueuePage() {
  const requests = useRequests();
  const summary = useQueueSummary();

  const { departments, categories } = useMemo(() => {
    const data = requests.data ?? [];
    return {
      departments: [...new Set(data.map((r) => r.originDepartment))].sort(),
      categories: [...new Set(data.map((r) => r.category))].sort(),
    };
  }, [requests.data]);

  const s = summary.data;
  const underTarget = s ? s.medianLatencyHours <= s.targetLatencyHours : true;

  return (
    <>
      <PageHeader
        title="Priority Queue"
        description="Requests ranked by deadline, financial exposure and risk. Select a row for a quick preview."
      />

      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {!s ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard label="Pending" value={formatNumber(s.pending)} icon={Inbox} hint="Across all queues" />
            <StatCard label="Overdue" value={formatNumber(s.overdue)} icon={AlertCircle} tone="danger" hint="Past service-level deadline" />
            <StatCard label="High priority" value={formatNumber(s.highPriority)} icon={ArrowUp} tone="warning" hint="Score 75 and above" />
            <StatCard
              label="Median latency"
              value={formatDuration(s.medianLatencyHours)}
              icon={Clock}
              tone={underTarget ? "success" : "danger"}
              hint={
                <span>
                  Target {formatDuration(s.targetLatencyHours)} ·{" "}
                  <span className={cn("font-medium", underTarget ? "text-success-fg" : "text-danger")}>
                    {formatDuration(Math.abs(s.targetLatencyHours - s.medianLatencyHours))} {underTarget ? "under" : "over"}
                  </span>
                </span>
              }
              footer={
                <Progress
                  value={(s.medianLatencyHours / s.targetLatencyHours) * 100}
                  aria-label="Median latency against target"
                  indicatorClassName={underTarget ? "bg-success" : "bg-danger"}
                />
              }
            />
          </>
        )}
      </div>

      {/* 70/30 split where the table fits beside the clock; otherwise the clock sits above a full-width table. */}
      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 3xl:grid-cols-[minmax(0,1fr)_320px]">
        <SectionCard
          title="Requests"
          description={
            requests.data && s
              ? `Showing the ${requests.data.length} highest-priority of ${s.pending} pending requests.`
              : "Loading requests…"
          }
          contentClassName="space-y-3 px-0 pb-0"
        >
          <div className="px-4">
            <QueueFilters departments={departments} categories={categories} />
          </div>
          <div className="border-t">
            <RequestsTable
              requests={requests.data}
              isLoading={requests.isLoading}
              error={requests.error}
              onRetry={() => void requests.refetch()}
            />
          </div>
        </SectionCard>

        <div className="order-first 3xl:sticky 3xl:top-20 3xl:order-none 3xl:self-start">
          <AttentionClock
            requests={requests.data}
            isLoading={requests.isLoading}
            error={requests.error}
            onRetry={() => void requests.refetch()}
          />
        </div>
      </div>
    </>
  );
}
