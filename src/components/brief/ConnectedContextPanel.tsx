"use client";

import { useEffect, useRef } from "react";
import {
  AlertTriangle,
  BookOpen,
  Building2,
  CalendarClock,
  ChevronDown,
  CircleDollarSign,
  FileSignature,
  History,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { ContextGroup, ContextGroupKey, ContextItem } from "@/lib/schemas";
import { cn } from "@/lib/utils";

const groupIcons: Record<ContextGroupKey, LucideIcon> = {
  policy: BookOpen,
  contract: FileSignature,
  department: Building2,
  project_manager: UserRound,
  stakeholders: Users,
  previous_decisions: History,
  deadlines: CalendarClock,
  financial_exposure: CircleDollarSign,
  risks: AlertTriangle,
};

interface ConnectedContextPanelProps {
  groups: ContextGroup[];
  openGroups: ContextGroupKey[];
  onOpenGroupsChange: (keys: ContextGroupKey[]) => void;
  /** Item selected from the brief text. */
  selectedItemId: string | null;
  /** Group focused from the relationship strip. */
  focusedGroup: ContextGroupKey | null;
  onOpenItem: (item: ContextItem) => void;
}

export function ConnectedContextPanel({
  groups,
  openGroups,
  onOpenGroupsChange,
  selectedItemId,
  focusedGroup,
  onOpenItem,
}: ConnectedContextPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Bring the selected item (or focused group) into view inside the panel.
  useEffect(() => {
    const target = selectedItemId
      ? containerRef.current?.querySelector(`[data-item-id="${selectedItemId}"]`)
      : focusedGroup
        ? containerRef.current?.querySelector(`[data-group-key="${focusedGroup}"]`)
        : null;
    if (target instanceof HTMLElement) {
      // Wait a frame so a just-expanded group has its height.
      requestAnimationFrame(() => target.scrollIntoView({ block: "nearest", behavior: "smooth" }));
    }
  }, [selectedItemId, focusedGroup, openGroups]);

  const toggle = (key: ContextGroupKey, open: boolean) =>
    onOpenGroupsChange(open ? [...new Set([...openGroups, key])] : openGroups.filter((k) => k !== key));

  return (
    <div ref={containerRef} className="divide-y">
      {groups.map((group) => {
        const Icon = groupIcons[group.key];
        const open = openGroups.includes(group.key);
        const focused = focusedGroup === group.key || group.items.some((i) => i.id === selectedItemId);
        return (
          <Collapsible key={group.key} open={open} onOpenChange={(o) => toggle(group.key, o)}>
            <div data-group-key={group.key} className={cn("transition-colors", focused && "bg-accent/5")}>
              <CollapsibleTrigger className="flex w-full items-center gap-2 px-4 py-2.5 text-start text-sm font-medium hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
                <Icon className={cn("h-4 w-4 shrink-0", focused ? "text-accent" : "text-muted-foreground")} aria-hidden />
                <span className="flex-1">{group.label}</span>
                <span className="rounded-sm bg-muted px-1.5 font-mono text-[11px] text-muted-foreground tabular">{group.items.length}</span>
                <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} aria-hidden />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ul className="space-y-1 px-2 pb-2">
                  {group.items.map((item) => {
                    const selected = item.id === selectedItemId;
                    return (
                      <li key={item.id} data-item-id={item.id}>
                        <button
                          type="button"
                          onClick={() => onOpenItem(item)}
                          className={cn(
                            "w-full rounded-md border px-2.5 py-2 text-start transition-colors hover:border-accent/50 hover:bg-card",
                            selected ? "border-accent bg-card ring-1 ring-accent" : "border-transparent",
                          )}
                        >
                          <span className="block text-sm font-medium leading-snug">{item.title}</span>
                          {item.subtitle && <span className="block text-xs text-muted-foreground">{item.subtitle}</span>}
                          {selected && <span className="mt-1 block text-xs text-text">{item.description}</span>}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </CollapsibleContent>
            </div>
          </Collapsible>
        );
      })}
    </div>
  );
}
