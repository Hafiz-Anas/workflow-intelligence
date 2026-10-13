"use client";

import { useLayoutEffect, useRef } from "react";
import { X } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { EmptyState } from "./EmptyState";

const widths = {
  md: "sm:max-w-[480px]",
  lg: "sm:max-w-[640px]",
} as const;

export interface DetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Right by default. Use left only when a right-side drawer is also in use on the screen. */
  side?: "right" | "left";
  width?: keyof typeof widths;
  /** Sticky action area at the bottom of the drawer. */
  footer?: React.ReactNode;
  /** Small label above the title, e.g. the record type. */
  eyebrow?: React.ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  children?: React.ReactNode;
}

/**
 * Side drawer for detailed or secondary data. Built on the shadcn Sheet (Radix
 * Dialog): Escape and overlay click close it, focus is trapped while open and
 * returned to the trigger on close, and the title labels the dialog.
 *
 * The drawer and its overlay start below the top bar so the Attention Clock
 * indicator always stays visible.
 */
export function DetailDrawer({
  open,
  onOpenChange,
  title,
  subtitle,
  side = "right",
  width = "md",
  footer,
  eyebrow,
  isLoading = false,
  isEmpty = false,
  emptyTitle = "Nothing to show",
  emptyDescription,
  children,
}: DetailDrawerProps) {
  // Drawers open from state rather than a Radix Trigger, so remember what had focus and restore it on close.
  const returnFocusTo = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => {
    if (open && document.activeElement instanceof HTMLElement && document.activeElement !== document.body) {
      returnFocusTo.current = document.activeElement;
    }
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        onCloseAutoFocus={(event) => {
          const target = returnFocusTo.current;
          if (target?.isConnected) {
            event.preventDefault();
            target.focus({ preventScroll: true });
          }
          returnFocusTo.current = null;
        }}
        // A toast opened from inside the drawer becomes the top Radix layer and would swallow Escape.
        onKeyDown={(event) => {
          // Ignore Escape from portalled popups (e.g. an open Select); they close themselves first.
          const fromPopup = (event.target as HTMLElement).closest("[role=listbox], [role=menu], [role=tooltip]");
          if (event.key === "Escape" && !event.defaultPrevented && !fromPopup) onOpenChange(false);
        }}
        side={side}
        hideClose
        overlayClassName="top-14"
        className={cn("top-14 h-[calc(100dvh-3.5rem)] w-full gap-0 overflow-hidden p-0", widths[width])}
        {...(subtitle ? {} : { "aria-describedby": undefined })}
      >
        <header className="flex items-start gap-3 border-b px-5 py-4">
          <div className="min-w-0 flex-1">
            {eyebrow && <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-accent">{eyebrow}</div>}
            <SheetTitle className="text-base font-semibold leading-snug">{title}</SheetTitle>
            {subtitle && <SheetDescription className="mt-0.5 text-sm">{subtitle}</SheetDescription>}
          </div>
          <SheetClose
            className="-me-1 rounded-sm p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Close drawer"
          >
            <X className="h-4 w-4" />
          </SheetClose>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {isLoading ? (
            <div className="space-y-3" aria-busy="true" aria-label="Loading">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : isEmpty ? (
            <EmptyState title={emptyTitle} description={emptyDescription} />
          ) : (
            children
          )}
        </div>

        {footer && !isLoading && !isEmpty && (
          <footer className="flex flex-wrap items-center justify-end gap-2 border-t bg-card px-5 py-3">{footer}</footer>
        )}
      </SheetContent>
    </Sheet>
  );
}

/** Label/value list used inside drawers. */
export function DrawerFacts({ items, className }: { items: { label: string; value: React.ReactNode }[]; className?: string }) {
  return (
    <dl className={cn("divide-y rounded-md border text-sm", className)}>
      {items.map((item) => (
        <div key={item.label} className="flex items-center justify-between gap-4 px-3 py-2">
          <dt className="text-muted-foreground">{item.label}</dt>
          <dd className="text-end font-medium">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Titled block inside a drawer body. */
export function DrawerSection({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("mt-5 first:mt-0", className)}>
      <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{title}</h3>
      {children}
    </section>
  );
}
