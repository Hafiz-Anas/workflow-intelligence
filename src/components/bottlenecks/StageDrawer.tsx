"use client";

import { AlertTriangle, Lightbulb } from "lucide-react";
import { DetailDrawer, DrawerFacts, DrawerSection } from "@/components/shared/DetailDrawer";
import { Button } from "@/components/ui/button";
import { formatDuration, formatNumber } from "@/lib/format";
import { useLastDefined } from "@/lib/hooks/useLastDefined";
import type { BottleneckReport, WorkflowStep } from "@/lib/schemas";

interface StageDrawerProps {
  step: WorkflowStep | null;
  report: BottleneckReport;
  onOpenChange: (open: boolean) => void;
  /** Opens the related detected pattern, if there is one. */
  onOpenRecommendation?: () => void;
}

/** Explains why a workflow stage was flagged. */
export function StageDrawer({ step, report, onOpenChange, onOpenRecommendation }: StageDrawerProps) {
  const shown = useLastDefined(step);
  const total = report.currentWorkflow.reduce((sum, s) => sum + s.avgHours, 0);
  const share = shown ? Math.round((shown.avgHours / total) * 100) : 0;
  const noValueShare = shown?.note?.match(/\d+%/)?.[0];

  return (
    <DetailDrawer
      open={step !== null}
      onOpenChange={onOpenChange}
      eyebrow="Flagged workflow stage"
      title={shown ? `Stage ${shown.key}: ${shown.label}` : "Workflow stage"}
      subtitle={report.alert.title}
      isEmpty={!shown}
      emptyTitle="No stage selected"
      footer={
        onOpenRecommendation && (
          <Button variant="outline" onClick={onOpenRecommendation}>
            <Lightbulb /> View recommended change
          </Button>
        )
      }
    >
      {shown && (
        <>
          <div role="alert" className="flex items-start gap-2 rounded-md border border-danger/30 bg-danger/5 p-3 text-sm">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden />
            <p>
              <span className="font-semibold">{shown.note ?? "Flagged"}.</span> {report.alert.detail}
            </p>
          </div>

          <DrawerSection title="Why it was flagged" className="mt-4">
            <DrawerFacts
              items={[
                {
                  label: "Idle backlog",
                  value: <span className="font-mono tabular">{formatNumber(report.alert.idleHours)} h</span>,
                },
                ...(noValueShare
                  ? [{ label: "Cases where it adds no value", value: <span className="font-mono tabular">{noValueShare}</span> }]
                  : []),
                {
                  label: "Average time at this stage",
                  value: <span className="font-mono tabular">{formatDuration(shown.avgHours)}</span>,
                },
                { label: "Share of cycle time", value: <span className="font-mono tabular">{share}%</span> },
              ]}
            />
          </DrawerSection>

          <DrawerSection title="Effect of removing it">
            <p className="text-sm">
              Making this stage conditional cuts the cycle time from{" "}
              <span className="font-mono font-medium tabular">{formatDuration(total)}</span> to{" "}
              <span className="font-mono font-medium tabular">{formatDuration(total - shown.avgHours)}</span>, a{" "}
              <span className="font-semibold text-success-fg">{report.cycleTimeReductionPct}% reduction</span>. It would still run
              when funding or data is shared with another agency.
            </p>
          </DrawerSection>

          <p className="mt-4 text-xs text-muted-foreground">Sample figures for demonstration; not measured results.</p>
        </>
      )}
    </DetailDrawer>
  );
}
