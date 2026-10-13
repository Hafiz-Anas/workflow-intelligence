import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Simulated network latency for the mock data layer (300–600 ms). */
export function simulateLatency(min = 300, max = 600): Promise<void> {
  const ms = Math.round(min + Math.random() * (max - min));
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
