/**
 * DEMO: sample data. All performance figures are illustrative, not measured.
 * Remove /lib/mock when connecting a real backend.
 */
import { subMonths, format } from "date-fns";
import type { BottleneckReport, DetectedPattern } from "@/lib/schemas";

const trendValues = [
  { total: 468, avoidable: 131 },
  { total: 452, avoidable: 122 },
  { total: 431, avoidable: 104 },
  { total: 410, avoidable: 96 },
  { total: 384, avoidable: 82 },
  { total: 355, avoidable: 71 },
];

const currentWorkflow = [
  { key: "A", label: "Intake", avgHours: 4, flagged: false },
  { key: "B", label: "Validation", avgHours: 10, flagged: false },
  { key: "C", label: "Department review", avgHours: 18, flagged: false },
  { key: "D", label: "Inter-agency review", avgHours: 31, flagged: true, note: "Adds no value in 70% of cases" },
  { key: "E", label: "Authority approval", avgHours: 22, flagged: false },
  { key: "F", label: "Execution", avgHours: 6, flagged: false },
];

const proposedWorkflow = currentWorkflow.filter((step) => step.key !== "D").map((step) => ({ ...step, flagged: false }));

const total = (steps: { avgHours: number }[]) => steps.reduce((sum, s) => sum + s.avgHours, 0);

export const mockBottleneckReport: BottleneckReport = {
  alert: {
    stage: "D",
    title: "Stage D inter-agency redundancy",
    idleHours: 11_480,
    detail: "Requests wait at inter-agency review although no funding or data is shared in 70% of cases.",
  },
  avoidableEscalations: { count: 540, total: 2_500, percent: 21.6 },
  approvalTimeByDepartment: [
    { department: "Finance", hours: 72 },
    { department: "Procurement", hours: 41 },
    { department: "Legal and Compliance", hours: 38 },
    { department: "Capital Projects", hours: 33 },
    { department: "Asset Management", hours: 26 },
    { department: "Information Technology", hours: 22 },
    { department: "Human Resources", hours: 18 },
    { department: "Operations", hours: 14 },
  ],
  escalationTrend: trendValues.map((v, i) => ({
    month: format(subMonths(new Date(), trendValues.length - 1 - i), "MMM"),
    ...v,
  })),
  mostDelayed: [
    { requestId: "REQ-2026-0405", title: "Annual Software Maintenance Renewals", department: "Information Technology", delayHours: 30, reason: "Waiting for Finance budget confirmation" },
    { requestId: "REQ-2026-0402", title: "Temporary Staffing for Winter Readiness", department: "Human Resources", delayHours: 14, reason: "One missing sign-off from Operations" },
    { requestId: "REQ-2026-0415", title: "Fleet Vehicle Lease Renewal 2027", department: "Operations", delayHours: 12, reason: "Procurement check queued behind framework renewals" },
    { requestId: "REQ-2026-0407", title: "Records Digitisation Phase 2", department: "Legal and Compliance", delayHours: 10, reason: "Escalated unnecessarily; within Tier 3 limit" },
    { requestId: "REQ-2026-0409", title: "CAPEX Review – Substation Upgrade Programme", department: "Capital Projects", delayHours: 8, reason: "Inter-agency review (Stage D) with no shared funding" },
  ],
  currentWorkflow,
  proposedWorkflow,
  cycleTimeReductionPct: Math.round((1 - total(proposedWorkflow) / total(currentWorkflow)) * 100),
  improvement: {
    baselineLabel: "Baseline (first quarter)",
    currentLabel: "Current quarter",
    metrics: [
      { key: "approval", label: "Median approval time", before: 31.2, after: 18.4, unit: "hours", lowerIsBetter: true },
      { key: "escalation", label: "Escalation rate", before: 29.8, after: 21.6, unit: "percent", lowerIsBetter: true },
      { key: "overdue", label: "Overdue requests", before: 17, after: 9, unit: "count", lowerIsBetter: true },
    ],
  },
};

export const mockPatterns: DetectedPattern[] = [
  {
    id: "pat-1",
    text: "Finance averages 3 days to approve; Operations averages 14 hours for comparable requests.",
    metric: "3.0 d vs 14 h",
    recommendedChange: "Apply the Operations pre-check template to Finance approvals and set a 24-hour review target.",
    expectedImpact: "Estimated 40% reduction in Finance approval time.",
    status: "open",
  },
  {
    id: "pat-2",
    text: "22% of approvals are delayed by one missing sign-off.",
    metric: "22% of approvals",
    recommendedChange: "Send automatic reminders at 50% of the service-level target and allow a nominated delegate to sign.",
    expectedImpact: "Removes the most common single cause of delay.",
    status: "open",
  },
  {
    id: "pat-3",
    text: "Contracts under 500K rarely need senior intervention.",
    metric: "96% approved unchanged",
    recommendedChange: "Raise the Tier 3 limit for contract renewals to 500K where the vendor rating is satisfactory.",
    expectedImpact: "About 180 fewer escalations per year.",
    status: "open",
  },
  {
    id: "pat-4",
    text: "Stage D inter-agency review changes nothing in 70% of cases.",
    metric: "70% no change",
    recommendedChange: "Make Stage D conditional: trigger it only where funding or data is shared with another agency (Escalation Rules §2.5).",
    expectedImpact: "34% shorter cycle time on affected requests.",
    status: "open",
  },
  {
    id: "pat-5",
    text: "Requests submitted on Fridays wait 31% longer before first review.",
    metric: "+31% wait",
    recommendedChange: "Route Friday submissions to the standby reviewer pool.",
    expectedImpact: "Evens out first-review waiting time across the week.",
    status: "open",
  },
];
