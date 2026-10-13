import { AlertOctagon, AlertTriangle, CircleCheck, CircleDot, ShieldAlert } from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { riskLevelLabels, type RiskLevel } from "@/lib/schemas";

const map: Record<RiskLevel, { variant: NonNullable<BadgeProps["variant"]>; icon: typeof AlertOctagon }> = {
  low: { variant: "success", icon: CircleCheck },
  medium: { variant: "muted", icon: CircleDot },
  medium_high: { variant: "warning", icon: AlertTriangle },
  high: { variant: "warning", icon: ShieldAlert },
  critical: { variant: "danger", icon: AlertOctagon },
};

export function RiskLevelBadge({ level }: { level: RiskLevel }) {
  const entry = map[level];
  const Icon = entry.icon;
  return (
    <Badge variant={entry.variant}>
      <Icon aria-hidden />
      {riskLevelLabels[level]}
    </Badge>
  );
}
