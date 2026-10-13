import { riskLevelFromScore, type RiskLevel } from "@/lib/schemas";

type Band = 1 | 2 | 3 | 4 | 5;

const bandByLevel: Record<RiskLevel, Band> = {
  low: 1,
  medium: 2,
  medium_high: 3,
  high: 4,
  critical: 5,
};

/**
 * Heat band (1–5) for a likelihood × impact score. Uses the same thresholds
 * as the contract risk level so cell colour and badge always agree.
 */
export function heatBand(score: number): Band {
  return bandByLevel[riskLevelFromScore(score)];
}

export const heatClasses: Record<Band, string> = {
  1: "bg-heat-1",
  2: "bg-heat-2",
  3: "bg-heat-3",
  4: "bg-heat-4",
  5: "bg-heat-5",
};

export const legendBands: { band: Band; level: RiskLevel; range: string }[] = [
  { band: 1, level: "low", range: "1–4" },
  { band: 2, level: "medium", range: "5–9" },
  { band: 3, level: "medium_high", range: "10–14" },
  { band: 4, level: "high", range: "15–19" },
  { band: 5, level: "critical", range: "20–25" },
];
