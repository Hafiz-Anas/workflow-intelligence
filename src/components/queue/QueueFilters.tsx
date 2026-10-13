"use client";

import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { PriorityLabel } from "@/lib/schemas";
import { ALL, useQueueFilters } from "@/lib/store/queueFilters";

interface QueueFiltersProps {
  departments: string[];
  categories: string[];
}

export function QueueFilters({ departments, categories }: QueueFiltersProps) {
  const filters = useQueueFilters();
  const active = filters.department !== ALL || filters.category !== ALL || filters.priority !== ALL || filters.search !== "";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-[200px] flex-1">
        <Search className="pointer-events-none absolute start-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          value={filters.search}
          onChange={(e) => filters.setSearch(e.target.value)}
          placeholder="Filter by title or ID"
          aria-label="Filter requests by title or ID"
          className="h-8 ps-8"
        />
      </div>
      <Select value={filters.department} onValueChange={filters.setDepartment}>
        <SelectTrigger className="h-8 w-[180px]" aria-label="Department">
          <SelectValue placeholder="Department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All departments</SelectItem>
          {departments.map((d) => (
            <SelectItem key={d} value={d}>
              {d}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={filters.category} onValueChange={filters.setCategory}>
        <SelectTrigger className="h-8 w-[170px]" aria-label="Category">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All categories</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={filters.priority} onValueChange={(v) => filters.setPriority(v as PriorityLabel | typeof ALL)}>
        <SelectTrigger className="h-8 w-[130px]" aria-label="Priority">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All priorities</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>
      {active && (
        <Button variant="ghost" size="sm" onClick={filters.reset}>
          <X /> Clear
        </Button>
      )}
    </div>
  );
}
