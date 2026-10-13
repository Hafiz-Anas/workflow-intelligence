"use client";

import { FileText, Landmark } from "lucide-react";
import { formatDate, formatNumber } from "@/lib/format";
import { useLastDefined } from "@/lib/hooks/useLastDefined";
import { usePolicy } from "@/lib/hooks/usePolicies";
import { useTiers } from "@/lib/hooks/useTiers";
import { policyTypeLabels, type PolicyDocument } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { DetailDrawer, DrawerFacts, DrawerSection } from "./DetailDrawer";
import { ErrorState } from "./EmptyState";
import { StatusBadge } from "./StatusBadge";

interface PolicyDrawerProps {
  policyId: string | null;
  /** Clause to highlight, e.g. "§5.4". */
  clause?: string;
  onOpenChange: (open: boolean) => void;
  side?: "right" | "left";
}

/** Earlier versions implied by the current version number (display only). */
function versionHistory(policy: PolicyDocument) {
  const [major, minor = "0"] = policy.version.split(".");
  const current = Number(minor);
  const uploaded = new Date(policy.uploadedAt).getTime();
  return Array.from({ length: Math.min(3, current + 1) }, (_, i) => ({
    version: `${major}.${current - i}`,
    date: new Date(uploaded - i * 120 * 24 * 3_600_000).toISOString(),
    current: i === 0,
  }));
}

/** Policy document drawer: metadata, status, cited clause, dependent tiers and version history. */
export function PolicyDrawer({ policyId, clause, onOpenChange, side = "right" }: PolicyDrawerProps) {
  const shownId = useLastDefined(policyId);
  const shownClause = useLastDefined(policyId ? (clause ?? "") : null) || undefined;
  const { data: policy, isLoading, error, refetch } = usePolicy(shownId);
  const { data: tiers } = useTiers();
  const dependentTiers = (tiers ?? []).filter((t) => t.policySourceId === shownId);
  const ready = policy && policy.id === shownId;

  return (
    <DetailDrawer
      open={policyId !== null}
      onOpenChange={onOpenChange}
      side={side}
      width="lg"
      eyebrow="Policy document"
      title={ready ? policy.name : "Policy document"}
      subtitle={ready ? `Version ${policy.version} · ${policyTypeLabels[policy.type]}` : undefined}
      isLoading={!error && !ready && isLoading}
      isEmpty={!error && !isLoading && !ready}
      emptyTitle="Policy not available"
    >
      {error ? (
        <ErrorState error={error} onRetry={() => void refetch()} />
      ) : (
        ready && (
          <>
            <p className="text-sm text-muted-foreground">{policy.summary}</p>

            <DrawerSection title="Details" className="mt-4">
              <DrawerFacts
                items={[
                  {
                    label: "File",
                    value: (
                      <span className="inline-flex items-center gap-1.5 font-mono text-xs">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                        {policy.fileName}
                      </span>
                    ),
                  },
                  { label: "Owner", value: policy.owner },
                  { label: "Last updated", value: <span className="font-mono text-xs tabular">{formatDate(policy.uploadedAt)}</span> },
                  { label: "Size", value: <span className="font-mono text-xs tabular">{formatNumber(policy.sizeKb)} KB</span> },
                  { label: "Status", value: <StatusBadge status={policy.status} /> },
                  { label: "Sync", value: <StatusBadge status={policy.syncStatus} /> },
                ]}
              />
            </DrawerSection>

            <DrawerSection title={shownClause ? "Cited clause and other clauses" : "Clauses this policy grounds"}>
              {policy.clauses.length === 0 ? (
                <p className="text-sm text-muted-foreground">No clauses extracted yet. They appear once indexing completes.</p>
              ) : (
                <ul className="space-y-2">
                  {[...policy.clauses]
                    .sort((a, b) => Number(b.ref === shownClause) - Number(a.ref === shownClause))
                    .map((c) => {
                      const cited = shownClause !== undefined && c.ref === shownClause;
                      return (
                        <li key={c.ref} className={cn("rounded-md border p-3", cited && "border-accent bg-accent/5 ring-1 ring-accent")}>
                          <p className="flex items-center gap-2 text-sm font-medium">
                            <span className="font-mono text-accent">{c.ref}</span>
                            {c.title}
                            {cited && <span className="ms-auto text-[11px] font-normal text-accent">Cited clause</span>}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">{c.text}</p>
                        </li>
                      );
                    })}
                </ul>
              )}
            </DrawerSection>

            <DrawerSection title="Tiers that depend on it">
              {dependentTiers.length === 0 ? (
                <p className="text-sm text-muted-foreground">No authority tier reads its limit from this document.</p>
              ) : (
                <ul className="space-y-1.5">
                  {dependentTiers.map((t) => (
                    <li key={t.id} className="flex items-center gap-2 text-sm">
                      <Landmark className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                      <span className="font-medium">
                        {t.name} · {t.role}
                      </span>
                      <span className="ms-auto font-mono text-xs text-muted-foreground">{t.groundingClause.split(", ")[1]}</span>
                    </li>
                  ))}
                </ul>
              )}
            </DrawerSection>

            <DrawerSection title="Version history">
              <ol className="space-y-1.5">
                {versionHistory(policy).map((v) => (
                  <li key={v.version} className="flex items-center gap-3 text-sm">
                    <span className="w-12 font-mono font-medium tabular">v{v.version}</span>
                    <span className="font-mono text-xs text-muted-foreground tabular">{formatDate(v.date)}</span>
                    <span className="ms-auto text-xs text-muted-foreground">{v.current ? "Current" : "Superseded"}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-2 text-xs text-muted-foreground">Sample history for this demo.</p>
            </DrawerSection>
          </>
        )
      )}
    </DetailDrawer>
  );
}
