import { Landmark } from "lucide-react";
import type { TierId } from "@/lib/schemas";
import { Badge } from "@/components/ui/badge";

const labels: Record<TierId, string> = {
  "tier-1": "Tier 1 · Executive",
  "tier-2": "Tier 2 · Director",
  "tier-3": "Tier 3 · Dept. Head",
};

/** Pass `short` in dense tables: shows "Tier 1" with the role in a tooltip-style title. */
export function TierBadge({ tier, short = false }: { tier: TierId; short?: boolean }) {
  const label = labels[tier];
  return (
    <Badge variant="outline" title={short ? label : undefined}>
      <Landmark aria-hidden />
      {short ? label.split(" · ")[0] : label}
    </Badge>
  );
}
