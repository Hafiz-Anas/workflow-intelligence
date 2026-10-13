"use client";

import { create } from "zustand";

export interface ClockItem {
  requestId: string;
  title: string;
  minutes: number;
}

export type ClockStatus = "idle" | "running" | "paused" | "completed";

interface ClockResult {
  item: ClockItem;
  actualMs: number;
}

interface AttentionClockState {
  item: ClockItem | null;
  status: ClockStatus;
  /** Epoch ms when the current running segment began. */
  segmentStartedAt: number | null;
  /** Time accumulated in previous running segments. */
  accumulatedMs: number;
  completedIds: string[];
  lastResult: ClockResult | null;
  load: (item: ClockItem) => void;
  start: () => void;
  pause: () => void;
  complete: () => void;
}

/**
 * Lives outside the page tree so the timer keeps counting while the user
 * navigates between screens. Time is always derived from Date.now(), never
 * from a decrementing counter, so it stays accurate when tabs are throttled.
 */
export const useAttentionClock = create<AttentionClockState>((set, get) => ({
  item: null,
  status: "idle",
  segmentStartedAt: null,
  accumulatedMs: 0,
  completedIds: [],
  lastResult: null,

  load: (item) => set({ item, status: "idle", segmentStartedAt: null, accumulatedMs: 0 }),

  start: () => {
    const { status, item } = get();
    if (!item || status === "running" || status === "completed") return;
    set({ status: "running", segmentStartedAt: Date.now() });
  },

  pause: () => {
    const { status, segmentStartedAt, accumulatedMs } = get();
    if (status !== "running" || segmentStartedAt === null) return;
    set({ status: "paused", segmentStartedAt: null, accumulatedMs: accumulatedMs + (Date.now() - segmentStartedAt) });
  },

  complete: () => {
    const state = get();
    if (!state.item || state.status === "idle" || state.status === "completed") return;
    const actualMs = elapsedMs(state, Date.now());
    set({
      status: "completed",
      segmentStartedAt: null,
      accumulatedMs: actualMs,
      completedIds: [...state.completedIds, state.item.requestId],
      lastResult: { item: state.item, actualMs },
    });
  },
}));

export function elapsedMs(state: Pick<AttentionClockState, "status" | "segmentStartedAt" | "accumulatedMs">, now: number): number {
  const running = state.status === "running" && state.segmentStartedAt !== null ? now - state.segmentStartedAt : 0;
  return state.accumulatedMs + Math.max(0, running);
}

/** Remaining seconds; negative once the recommended time is exceeded. */
export function remainingSeconds(
  state: Pick<AttentionClockState, "item" | "status" | "segmentStartedAt" | "accumulatedMs">,
  now: number,
): number {
  if (!state.item) return 0;
  return state.item.minutes * 60 - elapsedMs(state, now) / 1000;
}
