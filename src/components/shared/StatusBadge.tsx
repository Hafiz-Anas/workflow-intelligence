import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  CircleDashed,
  Clock,
  Eye,
  RefreshCw,
  WifiOff,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui/badge";

type Variant = NonNullable<BadgeProps["variant"]>;

const statusMap: Record<string, { label: string; variant: Variant; icon: LucideIcon }> = {
  // Requests
  pending: { label: "Pending", variant: "muted", icon: Clock },
  in_review: { label: "In review", variant: "accent", icon: Eye },
  escalated: { label: "Escalated", variant: "warning", icon: ArrowUpRight },
  overdue: { label: "Overdue", variant: "danger", icon: AlertCircle },
  approved: { label: "Approved", variant: "success", icon: CheckCircle2 },
  declined: { label: "Declined", variant: "danger", icon: XCircle },
  // Policies
  active: { label: "Active", variant: "success", icon: CheckCircle2 },
  needs_review: { label: "Needs Review", variant: "warning", icon: AlertCircle },
  synced: { label: "Synced", variant: "success", icon: CheckCircle2 },
  syncing: { label: "Syncing", variant: "accent", icon: RefreshCw },
  failed: { label: "Sync failed", variant: "danger", icon: XCircle },
  // Connectors
  online: { label: "Online", variant: "success", icon: CheckCircle2 },
  offline: { label: "Offline", variant: "danger", icon: WifiOff },
  needs_setup: { label: "Needs setup", variant: "warning", icon: CircleDashed },
  // Patterns
  open: { label: "Open", variant: "muted", icon: CircleDashed },
  accepted: { label: "Accepted", variant: "success", icon: CheckCircle2 },
  dismissed: { label: "Dismissed", variant: "muted", icon: XCircle },
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const entry = statusMap[status] ?? { label: status, variant: "outline" as Variant, icon: CircleDashed };
  const Icon = entry.icon;
  return (
    <Badge variant={entry.variant} className={className}>
      <Icon aria-hidden />
      {entry.label}
    </Badge>
  );
}
