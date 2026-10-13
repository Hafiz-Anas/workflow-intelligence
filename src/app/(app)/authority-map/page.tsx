"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { AuthorityKpis } from "@/components/authority/AuthorityKpis";
import { PolicySourcesPanel } from "@/components/authority/PolicySourcesPanel";
import { ReplacePolicyDrawer } from "@/components/authority/ReplacePolicyDrawer";
import { RuleTester } from "@/components/authority/RuleTester";
import { TierDrawer } from "@/components/authority/TierDrawer";
import { TierHierarchy } from "@/components/authority/TierHierarchy";
import { PageHeader } from "@/components/layout/PageHeader";
import { PolicyDrawer } from "@/components/shared/PolicyDrawer";
import { usePolicies } from "@/lib/hooks/usePolicies";
import { useTiers } from "@/lib/hooks/useTiers";
import type { TierId } from "@/lib/schemas";

/** One drawer at a time: opening any of them replaces the previous one. */
type Drawer =
  | { kind: "policy"; id: string; clause?: string }
  | { kind: "replace"; id: string }
  | { kind: "tier"; id: TierId }
  | null;

export default function AuthorityMapPage() {
  const [drawer, setDrawer] = useState<Drawer>(null);
  const { data: tiers } = useTiers();
  const { data: policies } = usePolicies();

  const close = (open: boolean) => !open && setDrawer(null);
  const openClause = (id: string, clause: string) => setDrawer({ kind: "policy", id, clause: clause || undefined });

  const tier = drawer?.kind === "tier" ? (tiers?.find((t) => t.id === drawer.id) ?? null) : null;
  const replacing = drawer?.kind === "replace" ? (policies?.find((p) => p.id === drawer.id) ?? null) : null;

  return (
    <>
      <PageHeader
        title="Authority and Routing Map"
        description="Who can approve what, the policy clause behind each limit, and where requests escalate without need."
      />

      <div role="note" className="mb-4 flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/5 px-4 py-2.5 text-sm">
        <ShieldCheck className="h-4 w-4 shrink-0 text-accent" aria-hidden />
        <p>Authority rules are read from your organization&apos;s own policies, not generic AI knowledge.</p>
      </div>

      <AuthorityKpis />

      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <TierHierarchy onOpenClause={openClause} onOpenTier={(id) => setDrawer({ kind: "tier", id })} />
        <div className="space-y-4">
          <PolicySourcesPanel
            onOpenPolicy={(id) => setDrawer({ kind: "policy", id })}
            onReplace={(id) => setDrawer({ kind: "replace", id })}
          />
          <RuleTester onOpenClause={openClause} />
        </div>
      </div>

      <PolicyDrawer
        policyId={drawer?.kind === "policy" ? drawer.id : null}
        clause={drawer?.kind === "policy" ? drawer.clause : undefined}
        onOpenChange={close}
      />
      <ReplacePolicyDrawer policy={replacing} onOpenChange={close} />
      <TierDrawer tier={tier} onOpenChange={close} onOpenClause={openClause} />
    </>
  );
}
