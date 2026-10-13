import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Tone = "default" | "success" | "warning" | "danger";

const toneStyles: Record<Tone, string> = {
  default: "text-muted-foreground",
  success: "text-success-fg",
  warning: "text-warning-fg",
  danger: "text-danger",
};

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon?: LucideIcon;
  tone?: Tone;
  /** Secondary line under the value: target, delta, context. */
  hint?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function StatCard({ label, value, icon: Icon, tone = "default", hint, footer, className }: StatCardProps) {
  return (
    <Card className={cn("p-4", className)}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        {Icon && <Icon className={cn("h-4 w-4 shrink-0", toneStyles[tone])} aria-hidden />}
      </div>
      <p className="mt-2 font-mono text-2xl font-semibold tabular">{value}</p>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
      {footer && <div className="mt-3">{footer}</div>}
    </Card>
  );
}

export function StatCardSkeleton() {
  return (
    <Card className="p-4">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-3 h-7 w-20" />
      <Skeleton className="mt-2 h-3 w-32" />
    </Card>
  );
}
