"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen, Workflow } from "lucide-react";
import { navItems } from "@/lib/config/nav";
import { useUi } from "@/lib/store/ui";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function Sidebar() {
  const pathname = usePathname();
  const collapsed = useUi((s) => s.sidebarCollapsed);
  const toggle = useUi((s) => s.toggleSidebar);

  return (
    <aside
      className={cn(
        "fixed inset-y-0 start-0 z-40 flex flex-col bg-sidebar text-sidebar-foreground transition-[width] duration-200",
        collapsed ? "w-16" : "w-60",
      )}
      aria-label="Primary"
    >
      <div className={cn("flex h-14 items-center gap-2.5 border-b border-primary-foreground/10", collapsed ? "justify-center px-0" : "px-4")}>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary-foreground/10">
          <Workflow className="h-4 w-4" aria-hidden />
        </span>
        {!collapsed && (
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-semibold text-primary-foreground">Workflow Intelligence</p>
            <p className="truncate text-[11px] text-sidebar-muted">Decision support platform</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-0.5 p-2">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.match);
          const Icon = item.icon;
          const shortened = item.shortLabel !== item.label;
          const link = (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              // Screen readers always hear the full screen name.
              aria-label={collapsed || shortened ? item.label : undefined}
              className={cn(
                "flex h-9 items-center gap-3 rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/70",
                collapsed ? "justify-center px-0" : "px-3",
                active
                  ? "bg-sidebar-active font-medium text-primary-foreground"
                  : "text-sidebar-foreground/80 hover:bg-primary-foreground/5 hover:text-primary-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              {!collapsed && <span className="min-w-0 flex-1 truncate">{item.shortLabel}</span>}
              {active && !collapsed && <span className="h-4 w-0.5 shrink-0 rounded-full bg-primary-foreground/80" aria-hidden />}
            </Link>
          );
          // Tooltip with the full name when the sidebar is collapsed or the label is shortened.
          return collapsed || shortened ? (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>{link}</TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ) : (
            link
          );
        })}
      </nav>

      <div className="border-t border-primary-foreground/10 p-2">
        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "flex h-9 w-full items-center gap-3 rounded-md text-sm text-sidebar-muted transition-colors hover:bg-primary-foreground/5 hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/70",
            collapsed ? "justify-center" : "px-3",
          )}
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4" aria-hidden /> : <PanelLeftClose className="h-4 w-4" aria-hidden />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
