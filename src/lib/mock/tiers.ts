/**
 * DEMO: sample data. Authority limits and counts are illustrative only.
 * Remove /lib/mock when connecting a real backend.
 */
import type { AuthorityKpis, AuthorityTier } from "@/lib/schemas";

function efficiency(direct: number, escalated: number) {
  return Math.round((direct / (direct + escalated)) * 1000) / 10;
}

export const mockTiers: AuthorityTier[] = [
  {
    id: "tier-1",
    name: "Tier 1",
    role: "Executive Committee",
    level: 1,
    minLimit: 1_500_000,
    maxLimit: null,
    limitNote: "Board ratification above 10M",
    groundingClause: "Delegation of Authority Policy v4.8, §3.1",
    policySourceId: "pol-doa",
    directApprovals: 90,
    friendlyEscalations: 14,
    delegationEfficiency: efficiency(90, 14),
    categoriesApprovable: ["All categories"],
  },
  {
    id: "tier-2",
    name: "Tier 2",
    role: "Director",
    level: 2,
    minLimit: 250_000,
    maxLimit: 1_500_000,
    groundingClause: "Delegation of Authority Policy v4.8, §3.2",
    policySourceId: "pol-doa",
    directApprovals: 630,
    friendlyEscalations: 196,
    delegationEfficiency: efficiency(630, 196),
    categoriesApprovable: ["Capital expenditure", "Contract extension", "Contract review", "Inter-agency agreement", "Property", "IT services", "Vendor onboarding", "Maintenance", "Emergency works", "Staffing", "Training", "Operational expenditure", "Minor procurement"],
  },
  {
    id: "tier-3",
    name: "Tier 3",
    role: "Head of Department",
    level: 3,
    minLimit: 0,
    maxLimit: 250_000,
    groundingClause: "Delegation of Authority Policy v4.8, §3.3",
    policySourceId: "pol-doa",
    directApprovals: 1_240,
    friendlyEscalations: 330,
    delegationEfficiency: efficiency(1_240, 330),
    categoriesApprovable: ["Operational expenditure", "Maintenance", "Emergency works", "Staffing", "Training", "Minor procurement", "IT services", "Vendor onboarding"],
  },
];

export const mockAuthorityKpis: AuthorityKpis = {
  directApprovalRate: 78.4,
  directApprovalTarget: 85,
  frictionEscalationRate: 21.6,
  reviewLatencyHours: 1_840,
  totalDecisions: 2_500,
};
