/**
 * DEMO: sample data. All requests, departments and figures below are fictional.
 * Remove /lib/mock when connecting a real backend.
 */
import type { QueueSummary, Request, RequestStatus, PriorityLabel, RankingReason } from "@/lib/schemas";
import { resolveTier } from "@/lib/rules";
import { hoursAgo } from "./time";
import { mockTiers } from "./tiers";

export const HERO_REQUEST_ID = "REQ-2026-0418";

export const departments = [
  "Asset Management",
  "Capital Projects",
  "Customer Services",
  "Finance",
  "Human Resources",
  "Information Technology",
  "Legal and Compliance",
  "Operations",
  "Procurement",
] as const;

export const categories = [
  "Capital expenditure",
  "Contract extension",
  "Contract review",
  "Emergency works",
  "Inter-agency agreement",
  "IT services",
  "Maintenance",
  "Minor procurement",
  "Operational expenditure",
  "Property",
  "Staffing",
  "Training",
  "Vendor onboarding",
] as const;

type Row = [
  id: string,
  title: string,
  department: string,
  category: string,
  elapsedHours: number,
  slaHours: number,
  stage: string,
  score: number,
  reason: RankingReason,
  attentionMinutes: number,
  amount: number,
  status: RequestStatus,
];

const rows: Row[] = [
  [HERO_REQUEST_ID, "Cloud Infrastructure Migration Phase 3 – contract extension", "Information Technology", "Contract extension", 52, 72, "Executive approval", 96, "financial_exposure", 18, 2_450_000, "escalated"],
  ["REQ-2026-0422", "Contract Risk Review – Water Treatment Maintenance", "Asset Management", "Contract review", 30, 36, "Risk assessment", 91, "risk_level", 12, 860_000, "in_review"],
  ["REQ-2026-0409", "CAPEX Review – Substation Upgrade Programme", "Capital Projects", "Capital expenditure", 80, 72, "Director review", 89, "deadline", 25, 1_320_000, "overdue"],
  ["REQ-2026-0431", "Emergency Pump Station Repair Authorization", "Operations", "Emergency works", 6, 8, "Department review", 88, "deadline", 8, 185_000, "pending"],
  ["REQ-2026-0415", "Fleet Vehicle Lease Renewal 2027", "Operations", "Contract extension", 60, 48, "Procurement check", 84, "deadline", 15, 640_000, "overdue"],
  ["REQ-2026-0427", "Data-Sharing Agreement with Regional Transport Agency", "Legal and Compliance", "Inter-agency agreement", 40, 96, "Inter-agency review", 81, "risk_level", 20, 120_000, "in_review"],
  ["REQ-2026-0411", "Customer Billing Platform Licence True-up", "Information Technology", "IT services", 70, 72, "Director review", 79, "financial_exposure", 14, 412_000, "in_review"],
  ["REQ-2026-0433", "Grid Monitoring Sensors – Pilot Expansion", "Asset Management", "Capital expenditure", 20, 120, "Validation", 74, "financial_exposure", 10, 238_000, "pending"],
  ["REQ-2026-0402", "Temporary Staffing for Winter Readiness", "Human Resources", "Staffing", 110, 96, "Department review", 72, "deadline", 6, 96_000, "overdue"],
  ["REQ-2026-0420", "Cybersecurity Penetration Testing Services", "Information Technology", "IT services", 28, 120, "Procurement check", 70, "risk_level", 9, 145_000, "pending"],
  ["REQ-2026-0435", "Reservoir Dam Safety Inspection Contract", "Asset Management", "Contract review", 12, 168, "Intake", 68, "risk_level", 11, 520_000, "pending"],
  ["REQ-2026-0412", "Office Lease Consolidation – North Depot", "Finance", "Property", 90, 168, "Finance review", 63, "financial_exposure", 12, 780_000, "in_review"],
  ["REQ-2026-0429", "Vendor Onboarding – Meter Reading Services", "Procurement", "Vendor onboarding", 34, 72, "Validation", 60, "deadline", 7, 210_000, "pending"],
  ["REQ-2026-0405", "Annual Software Maintenance Renewals", "Information Technology", "IT services", 150, 120, "Finance review", 58, "deadline", 8, 174_000, "overdue"],
  ["REQ-2026-0437", "Community Engagement Programme Budget", "Customer Services", "Operational expenditure", 8, 240, "Intake", 52, "financial_exposure", 5, 88_000, "pending"],
  ["REQ-2026-0419", "Training Budget – Control Room Certification", "Human Resources", "Training", 44, 168, "Department review", 45, "deadline", 4, 42_000, "pending"],
  ["REQ-2026-0424", "Laboratory Equipment Calibration Services", "Operations", "Maintenance", 26, 240, "Procurement check", 41, "risk_level", 5, 36_500, "pending"],
  ["REQ-2026-0407", "Records Digitisation Phase 2", "Legal and Compliance", "Operational expenditure", 130, 120, "Department review", 38, "deadline", 6, 118_000, "overdue"],
  ["REQ-2026-0438", "Stationery and Consumables Framework", "Procurement", "Minor procurement", 4, 336, "Intake", 22, "deadline", 3, 18_000, "pending"],
  ["REQ-2026-0426", "Staff Wellbeing Survey Platform", "Human Resources", "IT services", 50, 240, "Validation", 18, "risk_level", 3, 12_500, "pending"],
];

function labelFor(score: number): PriorityLabel {
  if (score >= 75) return "high";
  if (score >= 50) return "medium";
  return "low";
}

export const mockRequests: Request[] = rows.map(
  ([id, title, department, category, elapsed, sla, stage, score, reason, minutes, amount, status]) => ({
    id,
    title,
    originDepartment: department,
    category,
    receivedAt: hoursAgo(elapsed),
    deadlineAt: hoursAgo(elapsed - sla),
    elapsedHours: elapsed,
    currentStage: stage,
    requiredAuthorityTier: resolveTier(mockTiers, { amount, category, department }).tierId,
    priorityScore: score,
    priorityLabel: labelFor(score),
    rankingReason: reason,
    recommendedAttentionMinutes: minutes,
    amount,
    status,
  }),
);

/** Organization-wide queue figures (the table shows the top 20 of these). */
export const mockQueueSummary: QueueSummary = {
  pending: 42,
  overdue: 9,
  highPriority: 16,
  medianLatencyHours: 18.4,
  targetLatencyHours: 24,
};
