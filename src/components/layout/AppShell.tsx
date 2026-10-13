"use client";

import { cn } from "@/lib/utils";
import { useUi } from "@/lib/store/ui";
import { DemoBanner } from "./DemoBanner";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const collapsed = useUi((s) => s.sidebarCollapsed);

  return (
    <div className="flex min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-card focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <Sidebar />
      <div className={cn("flex min-w-0 flex-1 flex-col transition-[margin] duration-200", collapsed ? "ms-16" : "ms-60")}>
        <Topbar />
        <DemoBanner />
        <main id="main" className="mx-auto w-full max-w-content flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
