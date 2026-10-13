"use client";

import { create } from "zustand";

interface UiState {
  sidebarCollapsed: boolean;
  demoBannerDismissed: boolean;
  /** Contract selected on the Risk Matrix; shared by the heatmap, table and diagnostics panel. */
  selectedContractId: string | null;
  toggleSidebar: () => void;
  dismissDemoBanner: () => void;
  selectContract: (id: string | null) => void;
}

export const useUi = create<UiState>((set) => ({
  sidebarCollapsed: false,
  demoBannerDismissed: false,
  selectedContractId: null,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  dismissDemoBanner: () => set({ demoBannerDismissed: true }),
  selectContract: (selectedContractId) => set({ selectedContractId }),
}));
