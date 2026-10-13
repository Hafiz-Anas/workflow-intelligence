import { Fragment } from "react";
import { AlertTriangle, ArrowRight, TrendingDown } from "lucide-react";
import { formatDuration } from "@/lib/format";
import type { WorkflowStep } from "@/lib/schemas";
import { cn } from "@/lib/utils";

function totalHours(steps: WorkflowStep[]) {
  return steps.reduce((sum, s) => sum + s.avgHours, 0);
}

interface StepDiagramProps {
  steps: WorkflowStep[];
  label: string;
  onOpenStep?: (step: WorkflowStep) => void;
}

function StepDiagram({ steps, label, onOpenStep }: StepDiagramProps) {
  return (
    <ol className="flex flex-wrap items-stretch gap-y-3" aria-label={label}>
      {steps.map((step, i) => (
        <Fragment key={step.key}>
          <li
            className={cn(
              "flex w-[118px] flex-col rounded-md border bg-card p-2.5",
              step.flagged && "border-danger bg-danger/10 ring-1 ring-danger/40",
            )}
          >
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold",
                  step.flagged ? "bg-danger text-primary-foreground dark:text-background" : "bg-muted text-text",
                )}
              >
                {step.key}
              </span>
              {step.flagged && <AlertTriangle className="h-3.5 w-3.5 text-danger" aria-label="Flagged step" />}
            </div>
            <span className="mt-1.5 text-xs font-medium leading-tight">{step.label}</span>
            <span className="mt-auto pt-1 font-mono text-[11px] text-muted-foreground tabular">
              {formatDuration(step.avgHours)} avg
            </span>
            {step.flagged && step.note && (
              <span className="mt-1 text-[11px] font-medium leading-tight text-danger">{step.note}</span>
            )}
            {step.flagged && onOpenStep && (
              <button
                type="button"
                onClick={() => onOpenStep(step)}
                className="mt-1.5 self-start rounded-sm text-[11px] font-medium text-accent underline decoration-dotted underline-offset-2 hover:decoration-solid"
                aria-label={`Why stage ${step.key} was flagged`}
              >
                Why flagged?
              </button>
            )}
          </li>
          {i < steps.length - 1 && (
            <li aria-hidden className="flex items-center px-1.5 text-muted-foreground">
              <ArrowRight className="h-4 w-4" />
            </li>
          )}
        </Fragment>
      ))}
    </ol>
  );
}

interface ProcessSimplificationProps {
  current: WorkflowStep[];
  proposed: WorkflowStep[];
  reductionPct: number;
  onOpenStep: (step: WorkflowStep) => void;
}

/** Current workflow next to the proposed, simplified workflow. */
export function ProcessSimplification({ current, proposed, reductionPct, onOpenStep }: ProcessSimplificationProps) {
  const currentTotal = totalHours(current);
  const proposedTotal = totalHours(proposed);

  return (
    <div className="grid gap-4 2xl:grid-cols-2">
      <div className="space-y-3 rounded-md border p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-sm font-semibold">Current workflow</h3>
          <span className="text-xs text-muted-foreground">
            Cycle time <span className="font-mono font-semibold tabular text-text">{formatDuration(currentTotal)}</span>
          </span>
        </div>
        <StepDiagram steps={current} label="Current workflow steps" onOpenStep={onOpenStep} />
      </div>
      <div className="space-y-3 rounded-md border border-success/40 bg-success/5 p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            Proposed workflow
            <span className="inline-flex items-center gap-1 rounded-sm border border-success/30 bg-success/10 px-1.5 py-0.5 text-[11px] font-medium text-success-fg">
              <TrendingDown className="h-3 w-3" aria-hidden />
              {reductionPct}% cycle-time reduction
            </span>
          </h3>
          <span className="text-xs text-muted-foreground">
            Cycle time <span className="font-mono font-semibold tabular text-text">{formatDuration(proposedTotal)}</span>
          </span>
        </div>
        <StepDiagram steps={proposed} label="Proposed workflow steps" />
        <p className="text-xs text-muted-foreground">Stage D runs only when funding or data is shared with another agency.</p>
      </div>
    </div>
  );
}
