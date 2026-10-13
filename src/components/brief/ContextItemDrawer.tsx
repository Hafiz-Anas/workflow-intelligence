"use client";

import { BookOpen } from "lucide-react";
import { DetailDrawer, DrawerFacts, DrawerSection } from "@/components/shared/DetailDrawer";
import { Button } from "@/components/ui/button";
import { useLastDefined } from "@/lib/hooks/useLastDefined";
import type { ContextItem } from "@/lib/schemas";

interface ContextItemDrawerProps {
  item: ContextItem | null;
  groupLabel?: string;
  onOpenChange: (open: boolean) => void;
  onOpenPolicy: (policyId: string, clause?: string) => void;
}

/** Full detail for a Connected Context item. */
export function ContextItemDrawer({ item, groupLabel, onOpenChange, onOpenPolicy }: ContextItemDrawerProps) {
  const shown = useLastDefined(item);
  const shownGroup = useLastDefined(groupLabel);
  const clause = shown?.title.match(/§[\d.]+/)?.[0];

  return (
    <DetailDrawer
      open={item !== null}
      onOpenChange={onOpenChange}
      eyebrow={shownGroup ?? "Linked context"}
      title={shown?.title ?? "Linked context"}
      subtitle={shown?.subtitle}
      isEmpty={!shown}
      emptyTitle="No item selected"
      footer={
        shown?.policyId && (
          <Button variant="outline" onClick={() => onOpenPolicy(shown.policyId!, clause)}>
            <BookOpen /> Open policy document
          </Button>
        )
      }
    >
      {shown && (
        <>
          <p className="text-sm">{shown.description}</p>
          {shown.facts.length > 0 && (
            <DrawerSection title="Details" className="mt-4">
              <DrawerFacts
                items={shown.facts.map((f) => ({ label: f.label, value: <span className="font-mono tabular">{f.value}</span> }))}
              />
            </DrawerSection>
          )}
          <p className="mt-4 text-xs text-muted-foreground">Linked context is sample data for this demo.</p>
        </>
      )}
    </DetailDrawer>
  );
}
