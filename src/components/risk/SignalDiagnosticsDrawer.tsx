"use client";

import { AlertTriangle, CalendarClock, CircleDollarSign, FileWarning, Lightbulb, ListChecks, Loader2, Users } from "lucide-react";
import { DetailDrawer, DrawerSection } from "@/components/shared/DetailDrawer";
import { ErrorState } from "@/components/shared/EmptyState";
import { RiskLevelBadge } from "@/components/shared/RiskLevelBadge";
import { TrendIndicator } from "@/components/shared/TrendIndicator";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { useContractRisk, useRecordRiskAction } from "@/lib/hooks/useContracts";
import { useLastDefined } from "@/lib/hooks/useLastDefined";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

function Metric({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof AlertTriangle;
  label: string;
  value: React.ReactNode;
  tone?: "danger" | "warning" | "success";
}) {
  return (
    <div className="rounded-md border p-2.5">
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Icon
          className={cn(
            "h-3.5 w-3.5",
            tone === "danger" && "text-danger",
            tone === "warning" && "text-warning-fg",
            tone === "success" && "text-success-fg",
          )}
          aria-hidden
        />
        {label}
      </div>
      <p className="mt-1 font-mono text-base font-semibold tabular">{value}</p>
    </div>
  );
}

interface SignalDiagnosticsDrawerProps {
  /** Selected contract; the drawer is open while this is set. */
  contractId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Signal diagnostics for one contract, with the recommended action in the sticky footer. */
export function SignalDiagnosticsDrawer({ contractId, open, onOpenChange }: SignalDiagnosticsDrawerProps) {
  const shownId = useLastDefined(contractId);
  const { data: contract, isLoading, error, refetch } = useContractRisk(shownId);
  const record = useRecordRiskAction();
  const ready = contract && contract.id === shownId;

  return (
    <DetailDrawer
      open={open}
      onOpenChange={onOpenChange}
      width="lg"
      eyebrow="Signal diagnostics"
      title={ready ? contract.name : "Contract"}
      subtitle={ready ? `${contract.id} · ${contract.vendor}` : undefined}
      isLoading={!error && !ready && isLoading}
      isEmpty={!error && !shownId}
      emptyTitle="No contract selected"
      emptyDescription="Select a marker on the heatmap or a row in the table."
      footer={
        ready && (
          <Button
            disabled={record.isPending}
            onClick={() =>
              record.mutate(contract.id, {
                onSuccess: (result) =>
                  toast({ variant: "success", title: "Action recorded", description: `${contract.name}: ${result.action}` }),
                onError: () => toast({ variant: "destructive", title: "Could not record action" }),
              })
            }
          >
            {record.isPending ? <Loader2 className="animate-spin" /> : <Lightbulb />}
            {record.isPending ? "Recording…" : "Take recommended action"}
          </Button>
        )
      }
    >
      {error ? (
        <ErrorState error={error} onRetry={() => void refetch()} />
      ) : (
        ready && (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <RiskLevelBadge level={contract.riskLevel} />
              <TrendIndicator trend={contract.trend} />
              <span className="font-mono text-xs text-muted-foreground tabular">
                Likelihood {contract.likelihood} × impact {contract.impact}
              </span>
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-md border border-accent/30 bg-accent/5 p-3 text-sm">
              <ListChecks className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
              <p>{contract.signals.statement}</p>
            </div>

            <DrawerSection title="Signals" className="mt-5">
              <div className="mb-3">
                <div className="mb-1 flex items-baseline justify-between text-xs">
                  <span className="text-muted-foreground">Deliverables completed</span>
                  <span className="font-mono font-semibold tabular">{contract.signals.deliverablesCompletedPct}%</span>
                </div>
                <Progress
                  value={contract.signals.deliverablesCompletedPct}
                  aria-label="Deliverables completed"
                  indicatorClassName={contract.signals.deliverablesCompletedPct >= 75 ? "bg-success" : "bg-warning"}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <Metric
                  icon={AlertTriangle}
                  label="Delayed milestones"
                  value={contract.signals.delayedMilestones}
                  tone={contract.signals.delayedMilestones > 0 ? "danger" : "success"}
                />
                <Metric
                  icon={FileWarning}
                  label="Missing approvals"
                  value={contract.signals.missingApprovals}
                  tone={contract.signals.missingApprovals > 0 ? "warning" : "success"}
                />
                <Metric
                  icon={CalendarClock}
                  label="Days remaining"
                  value={contract.signals.daysRemaining}
                  tone={contract.signals.daysRemaining < 30 ? "danger" : undefined}
                />
                <Metric icon={CircleDollarSign} label="Current exposure" value={formatMoney(contract.currentExposure)} />
                <Metric
                  icon={CircleDollarSign}
                  label="Remaining risk"
                  value={formatMoney(contract.remainingRisk)}
                  tone="danger"
                />
                <Metric
                  icon={Users}
                  label="Resource issues"
                  value={contract.signals.resourceIssues.length}
                  tone={contract.signals.resourceIssues.length > 0 ? "warning" : "success"}
                />
              </div>
              {contract.signals.resourceIssues.length > 0 && (
                <ul className="mt-3 space-y-1 text-sm">
                  {contract.signals.resourceIssues.map((issue) => (
                    <li key={issue} className="flex items-start gap-1.5">
                      <Users className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning-fg" aria-hidden />
                      {issue}
                    </li>
                  ))}
                </ul>
              )}
            </DrawerSection>

            <DrawerSection title="Context">
              <p className="text-sm">
                <span className="text-muted-foreground">Primary cause:</span> {contract.primaryCause}
              </p>
              <p className="mt-1 text-sm">
                <span className="text-muted-foreground">Affected objective:</span> {contract.affectedObjective}
              </p>
            </DrawerSection>

            <DrawerSection title="Recommended action">
              <p className="text-sm">{contract.signals.recommendedAction}</p>
            </DrawerSection>
          </>
        )
      )}
    </DetailDrawer>
  );
}
