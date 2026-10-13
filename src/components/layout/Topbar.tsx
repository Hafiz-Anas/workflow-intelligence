"use client";

import { Building2, LogOut, Settings2, UserRound } from "lucide-react";
import { currentUser, initials, organizationName } from "@/lib/config/locale";
import { toast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GlobalSearch } from "./GlobalSearch";
import { MiniTimer } from "./MiniTimer";
import { ThemeToggle } from "./ThemeToggle";

export function Topbar() {
  const notAvailable = (feature: string) =>
    toast({ title: `${feature} is not part of this demo`, description: "Authentication and settings arrive in a later phase." });

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-card/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="flex min-w-0 items-center gap-2">
        <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        <span className="truncate text-sm font-semibold">{organizationName}</span>
      </div>

      <div className="flex flex-1 justify-center">
        <GlobalSearch />
      </div>

      <div className="flex items-center gap-2">
        <MiniTimer />
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center gap-2.5 rounded-md px-1.5 py-1 text-start hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`Account menu for ${currentUser.name}`}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground dark:bg-navy-700">
              {initials(currentUser.name)}
            </span>
            <span className="hidden leading-tight lg:block">
              <span className="block text-sm font-medium">{currentUser.name}</span>
              <span className="block text-[11px] text-muted-foreground">{currentUser.role}</span>
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <p className="text-sm font-medium">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground">{currentUser.role}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => notAvailable("Profile")}>
              <UserRound /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => notAvailable("Settings")}>
              <Settings2 /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => notAvailable("Sign out")}>
              <LogOut /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
