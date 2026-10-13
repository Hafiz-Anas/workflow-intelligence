"use client";

import { create } from "zustand";
import type { PriorityLabel } from "@/lib/schemas";

export const ALL = "all";

interface QueueFiltersState {
  department: string;
  category: string;
  priority: PriorityLabel | typeof ALL;
  search: string;
  setDepartment: (value: string) => void;
  setCategory: (value: string) => void;
  setPriority: (value: PriorityLabel | typeof ALL) => void;
  setSearch: (value: string) => void;
  reset: () => void;
}

const initial = { department: ALL, category: ALL, priority: ALL, search: "" } as const;

export const useQueueFilters = create<QueueFiltersState>((set) => ({
  ...initial,
  setDepartment: (department) => set({ department }),
  setCategory: (category) => set({ category }),
  setPriority: (priority) => set({ priority }),
  setSearch: (search) => set({ search }),
  reset: () => set(initial),
}));
