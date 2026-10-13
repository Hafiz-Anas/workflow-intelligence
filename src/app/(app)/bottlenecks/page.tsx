"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { AlertBanner } from "@/components/bottlenecks/AlertBanner";
import { DelayedRequestDrawer } from "@/components/bottlenecks/DelayedRequestDrawer";
import { DetectedPatterns } from "@/components/bottlenecks/DetectedPatterns";
import { EscalationTrendChart } from "@/components/bottlenecks/EscalationTrendChart";
import { ImprovementOverTime } from "@/components/bottlenecks/ImprovementOverTime";
import { MostDelayedTable } from "@/components/bottlenecks/MostDelayedTable";
import { PatternDrawer } from "@/components/bottlenecks/PatternDrawer";
import { ProcessSimplification } from "@/components/bottlenecks/ProcessSimplification";
import { StageDrawer } from "@/components/bottlenecks/StageDrawer";
import { VelocityChart } from "@/components/bottlenecks/VelocityChart";
import { ErrorState } from "@/components/shared/EmptyState";
import { SectionCard } from "@/components/shared/SectionCard";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBottlenecks, usePatterns } from "@/lib/hooks/useBottlenecks";

/** One drawer at a time on this screen. */
type Drawer = { kind: "pattern"; id: string } | { kind: "delayed"; requestId: string } | { kind: "stage"; key: string } | null;

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-20 w-full" />
      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="space-y-4">
          <Skeleton className="h-[320px] w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-[260px] w-full" />
          <Skeleton className="h-[360px] w-full" />
        </div>
      </div>
    </div>
  );
}

export default function BottlenecksPage() {
  const { data: report, isLoading, error, refetch } = useBottlenecks();
  const { data: patterns } = usePatterns();
  const [drawer, setDrawer] = useState<Drawer>(null);
  const close = (open: boolean) => !open && setDrawer(null);

  const pattern = drawer?.kind === "pattern" ? (patterns?.find((p) => p.id === drawer.id) ?? null) : null;
  const delayed = drawer?.kind === "delayed" ? (report?.mostDelayed.find((r) => r.requestId === drawer.requestId) ?? null) : null;
  const stage = drawer?.kind === "stage" ? (report?.currentWorkflow.find((s) => s.key === drawer.key) ?? null) : null;
  // The detected pattern that proposes removing the flagged stage, if any.
  const stagePattern = patterns?.find((p) => report && p.text.includes(`Stage ${report.alert.stage}`));

  return (
    <>
      <PageHeader
        title="Bottlenecks and Performance"
        description="Where approvals slow down, which escalations were avoidable, and what to change."
      />

      {error ? (
        <Card>
          <ErrorState error={error} onRetry={() => void refetch()} />
        </Card>
      ) : isLoading || !report ? (
        <LoadingSkeleton />
      ) : (
        <div className="space-y-4">
          <AlertBanner alert={report.alert} avoidable={report.avoidableEscalations} />

          <div className="grid grid-cols-[minmax(0,1fr)] gap-4 xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
            <div className="space-y-4">
              <SectionCard
                title="Average approval time by department"
                description="Hours from intake to decision, slowest first."
              >
                <VelocityChart data={report.approvalTimeByDepartment} />
              </SectionCard>
              <SectionCard title="Escalation volume" description="All escalations and avoidable escalations, last six months.">
                <EscalationTrendChart data={report.escalationTrend} />
              </SectionCard>
            </div>
            <div className="space-y-4">
              <SectionCard
                title="Improvement over time"
                description={`${report.improvement.baselineLabel} compared with ${report.improvement.currentLabel.toLowerCase()}.`}
              >
                <ImprovementOverTime improvement={report.improvement} />
              </SectionCard>
              <SectionCard title="Detected patterns" description="Recurring causes of delay found in approval history.">
                <DetectedPatterns
                  selectedId={drawer?.kind === "pattern" ? drawer.id : null}
                  onOpen={(id) => setDrawer({ kind: "pattern", id })}
                />
              </SectionCard>
            </div>
          </div>

          <SectionCard
            title="Process simplification"
            description="The current approval workflow compared with the proposed workflow."
          >
            <ProcessSimplification
              current={report.currentWorkflow}
              proposed={report.proposedWorkflow}
              reductionPct={report.cycleTimeReductionPct}
              onOpenStep={(step) => setDrawer({ kind: "stage", key: step.key })}
            />
          </SectionCard>

          <SectionCard
            title="Most delayed requests"
            description="Top five by delay beyond the service-level target. Select a row for delay reasons and timeline."
            contentClassName="px-0 pb-0"
          >
            <div className="border-t">
              <MostDelayedTable
                rows={report.mostDelayed}
                selectedId={drawer?.kind === "delayed" ? drawer.requestId : null}
                onSelect={(requestId) => setDrawer({ kind: "delayed", requestId })}
              />
            </div>
          </SectionCard>

          <PatternDrawer pattern={pattern} onOpenChange={close} />
          <DelayedRequestDrawer row={delayed} onOpenChange={close} />
          <StageDrawer
            step={stage}
            report={report}
            onOpenChange={close}
            onOpenRecommendation={stagePattern ? () => setDrawer({ kind: "pattern", id: stagePattern.id }) : undefined}
          />
        </div>
      )}
    </>
  );
}
