"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowUpRight, Building2, Check, ChevronLeft, FileSearch, Landmark, X } from "lucide-react";
import { RichTextView } from "@/components/brief/ClickableTerm";
import { ConnectedContextPanel } from "@/components/brief/ConnectedContextPanel";
import { ContextItemDrawer } from "@/components/brief/ContextItemDrawer";
import { DossierSection } from "@/components/brief/DossierSection";
import { RecommendationBox } from "@/components/brief/RecommendationBox";
import { RelationshipStrip } from "@/components/brief/RelationshipStrip";
import { SignoffDialog } from "@/components/brief/SignoffDialog";
import { Timeline } from "@/components/brief/Timeline";
import { EmptyState, ErrorState } from "@/components/shared/EmptyState";
import { PolicyDrawer } from "@/components/shared/PolicyDrawer";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TierBadge } from "@/components/shared/TierBadge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api";
import { formatDate, formatMoney } from "@/lib/format";
import { useDecisionBrief } from "@/lib/hooks/useRequest";
import type { BriefSectionKey, ContextGroupKey, ContextItem, Decision, Relationship } from "@/lib/schemas";
import { cn } from "@/lib/utils";

const sections: { key: Exclude<BriefSectionKey, "timeline" | "signoff">; title: string }[] = [
  { key: "statement", title: "Request Statement" },
  { key: "justification", title: "Strategic Justification" },
  { key: "impact", title: "Impact of Inaction" },
  { key: "authority", title: "Governing Authority" },
  { key: "recommendation", title: "Recommendation" },
];

const decisionLabels: Record<Decision, string> = { approve: "Approved", decline: "Declined", escalate: "Escalated" };

const sectionId = (key: BriefSectionKey) => `section-${key}`;

export default function DecisionBriefPage() {
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id);
  const { data: brief, isLoading, error, refetch } = useDecisionBrief(id);

  const [selectedRef, setSelectedRef] = useState<string | null>(null);
  const [activeRelationship, setActiveRelationship] = useState<string | null>(null);
  const [focusedGroup, setFocusedGroup] = useState<ContextGroupKey | null>(null);
  const [highlightedSection, setHighlightedSection] = useState<BriefSectionKey | null>(null);
  const [openGroups, setOpenGroups] = useState<ContextGroupKey[]>(["policy", "contract", "financial_exposure"]);
  const [openItem, setOpenItem] = useState<ContextItem | null>(null);
  const [policy, setPolicy] = useState<{ id: string; clause?: string } | null>(null);
  const [pendingDecision, setPendingDecision] = useState<Decision | null>(null);
  const highlightTimer = useRef<number | undefined>(undefined);

  // Reset local selection when navigating between briefs.
  useEffect(() => {
    setSelectedRef(null);
    setActiveRelationship(null);
    setFocusedGroup(null);
  }, [id]);

  useEffect(() => () => window.clearTimeout(highlightTimer.current), []);

  const groupOfItem = useMemo(() => {
    const map = new Map<string, { key: ContextGroupKey; label: string; item: ContextItem }>();
    brief?.context.forEach((g) => g.items.forEach((item) => map.set(item.id, { key: g.key, label: g.label, item })));
    return map;
  }, [brief]);

  const flashSection = useCallback((key: BriefSectionKey) => {
    setHighlightedSection(key);
    window.clearTimeout(highlightTimer.current);
    highlightTimer.current = window.setTimeout(() => setHighlightedSection(null), 1800);
  }, []);

  const selectRef = useCallback(
    (ref: string) => {
      const group = groupOfItem.get(ref);
      setSelectedRef(ref);
      setFocusedGroup(null);
      setActiveRelationship(null);
      if (group) {
        setOpenGroups((prev) => (prev.includes(group.key) ? prev : [...prev, group.key]));
        // Selecting a phrase also opens the item's detail drawer (one drawer at a time).
        setPolicy(null);
        setOpenItem(group.item);
      }
    },
    [groupOfItem],
  );

  const selectRelationship = useCallback(
    (rel: Relationship) => {
      setActiveRelationship(rel.key);
      setSelectedRef(null);
      setFocusedGroup(rel.group);
      setOpenGroups((prev) => (prev.includes(rel.group) ? prev : [...prev, rel.group]));
      document.getElementById(sectionId(rel.section))?.scrollIntoView({ behavior: "smooth", block: "start" });
      flashSection(rel.section);
    },
    [flashSection],
  );

  if (error) {
    const notFound = error instanceof ApiError && error.status === 404;
    return (
      <Card>
        {notFound ? (
          <EmptyState
            icon={FileSearch}
            title="Request not found"
            description={`There is no request with ID ${id}. Select a request from the Priority Queue to view its Decision Brief.`}
            action={
              <Button asChild variant="outline" size="sm">
                <Link href="/priority-queue">Go to Priority Queue</Link>
              </Button>
            }
          />
        ) : (
          <ErrorState error={error} onRetry={() => void refetch()} />
        )}
      </Card>
    );
  }

  if (isLoading || !brief) return <BriefSkeleton />;

  const { request, recommendation } = brief;
  const decided = brief.decision !== null;

  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-2">
        <Button asChild variant="ghost" size="sm" className="-ms-2 text-muted-foreground">
          <Link href="/priority-queue">
            <ChevronLeft /> Priority Queue
          </Link>
        </Button>
        <span className="text-xs text-muted-foreground">
          Received <span className="font-mono tabular">{formatDate(request.receivedAt, "d MMM yyyy, HH:mm")}</span> · Deadline{" "}
          <span className="font-mono tabular">{formatDate(request.deadlineAt, "d MMM yyyy, HH:mm")}</span>
        </span>
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">{request.id}</span>
            <StatusBadge status={request.status} />
            <PriorityBadge score={request.priorityScore} label={request.priorityLabel} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{request.title}</h1>
          <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-xs text-muted-foreground">Amount</dt>
              <dd className="font-mono text-lg font-semibold tabular">{formatMoney(request.amount)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Department</dt>
              <dd className="flex items-center gap-1.5 font-medium">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                {request.originDepartment}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Required authority</dt>
              <dd className="mt-0.5">
                <TierBadge tier={request.requiredAuthorityTier} />
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Category</dt>
              <dd className="font-medium">{request.category}</dd>
            </div>
          </dl>
        </div>
        <RecommendationBox
          recommendation={recommendation}
          onOpenPolicy={() => {
            setOpenItem(null);
            setPolicy({ id: recommendation.policySource.policyId, clause: recommendation.policySource.clause });
          }}
        />
      </div>

      <div className="sticky top-14 z-20 -mx-6 mb-4 bg-background/95 px-6 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <RelationshipStrip relationships={brief.relationships} activeKey={activeRelationship} onSelect={selectRelationship} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Card className="min-w-0 py-2">
          {sections.map((section, index) => (
            <DossierSection
              key={section.key}
              id={sectionId(section.key)}
              number={index + 1}
              title={section.title}
              highlighted={highlightedSection === section.key}
            >
              <RichTextView value={brief.sections[section.key]} selectedRef={selectedRef} onSelectRef={selectRef} />
            </DossierSection>
          ))}

          <DossierSection id={sectionId("timeline")} number={6} title="Timeline" highlighted={highlightedSection === "timeline"}>
            <Timeline events={brief.timeline} />
          </DossierSection>

          <DossierSection id={sectionId("signoff")} number={7} title="Sign-off" highlighted={highlightedSection === "signoff"}>
            {decided && brief.decision ? (
              <div
                role="status"
                className={cn(
                  "mb-3 flex items-center gap-2 rounded-md border p-3 text-sm",
                  brief.decision === "decline" ? "border-danger/30 bg-danger/5" : "border-success/30 bg-success/5",
                )}
              >
                <Check className={cn("h-4 w-4", brief.decision === "decline" ? "text-danger" : "text-success-fg")} aria-hidden />
                Decision recorded: <span className="font-semibold">{decisionLabels[brief.decision]}</span>. See the timeline for
                your comment.
              </div>
            ) : (
              <p className="mb-3 text-sm text-muted-foreground">
                Every decision requires a written comment. It is added to the timeline and the audit record.
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <Button variant="success" onClick={() => setPendingDecision("approve")} disabled={decided}>
                <Check /> Approve
              </Button>
              <Button variant="destructive" onClick={() => setPendingDecision("decline")} disabled={decided}>
                <X /> Decline
              </Button>
              <Button variant="outline" onClick={() => setPendingDecision("escalate")} disabled={decided}>
                <ArrowUpRight /> Escalate
              </Button>
            </div>
          </DossierSection>
        </Card>

        <aside aria-label="Connected context" className="lg:sticky lg:top-32 lg:self-start">
          <Card className="overflow-hidden">
            <CardHeader className="border-b pb-3">
              <CardTitle className="flex items-center gap-2">
                <Landmark className="h-4 w-4 text-accent" aria-hidden /> Connected Context
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Select a highlighted phrase or a relationship to see linked records.
              </p>
            </CardHeader>
            <div className="max-h-[calc(100vh-15rem)] overflow-y-auto">
              <ConnectedContextPanel
                groups={brief.context}
                openGroups={openGroups}
                onOpenGroupsChange={setOpenGroups}
                selectedItemId={selectedRef}
                focusedGroup={focusedGroup}
                onOpenItem={(item) => {
                  setSelectedRef(item.id);
                  setOpenItem(item);
                }}
              />
            </div>
          </Card>
        </aside>
      </div>

      <ContextItemDrawer
        item={openItem}
        groupLabel={openItem ? groupOfItem.get(openItem.id)?.label : undefined}
        onOpenChange={(open) => !open && setOpenItem(null)}
        onOpenPolicy={(policyId, clause) => {
          setOpenItem(null);
          setPolicy({ id: policyId, clause });
        }}
      />
      <PolicyDrawer policyId={policy?.id ?? null} clause={policy?.clause} onOpenChange={(open) => !open && setPolicy(null)} />
      <SignoffDialog
        requestId={request.id}
        decision={pendingDecision}
        onOpenChange={(open) => !open && setPendingDecision(null)}
      />
    </>
  );
}

function BriefSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading decision brief">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-3">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-12 w-full" />
        </div>
        <Skeleton className="h-40" />
      </div>
      <Skeleton className="h-11 w-full" />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4 rounded-lg border bg-card p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
        <Skeleton className="h-[420px]" />
      </div>
    </div>
  );
}
