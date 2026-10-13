/**
 * DEMO: sample data. Brief text, stakeholders and decisions are fictional.
 * Remove /lib/mock when connecting a real backend.
 */
import { formatMoney } from "@/lib/config/locale";
import type { ContextGroup, DecisionBrief, Relationship, Request, TimelineEvent } from "@/lib/schemas";
import { HERO_CONTRACT_ID, mockContracts } from "./contracts";
import { HERO_REQUEST_ID } from "./requests";
import { mockTiers } from "./tiers";
import { formatDate } from "@/lib/format";
import { daysAgo, daysFromNow, hoursAgo } from "./time";

export const relationships: Relationship[] = [
  { key: "request", label: "Request", section: "statement", group: "department" },
  { key: "contract", label: "Contract", section: "statement", group: "contract" },
  { key: "stakeholders", label: "Stakeholders", section: "justification", group: "stakeholders" },
  { key: "project", label: "Project", section: "justification", group: "project_manager" },
  { key: "deliverables", label: "Deliverables", section: "justification", group: "contract" },
  { key: "deadlines", label: "Deadlines", section: "impact", group: "deadlines" },
  { key: "policy", label: "Policy", section: "authority", group: "policy" },
  { key: "risks", label: "Risks", section: "impact", group: "risks" },
  { key: "decision", label: "Decision", section: "signoff", group: "previous_decisions" },
];

const tierById = (id: Request["requiredAuthorityTier"]) => mockTiers.find((t) => t.id === id)!;

function heroBrief(request: Request): DecisionBrief {
  const contract = mockContracts.find((c) => c.id === HERO_CONTRACT_ID)!;

  const context: ContextGroup[] = [
    {
      key: "policy",
      label: "Governing Policy",
      items: [
        {
          id: "ctx-doa-32",
          title: "Delegation of Authority Policy v4.8, §3.2",
          subtitle: "Tier 2 limit",
          description: "Directors may approve commitments up to the Tier 2 limit. This request is above that limit.",
          facts: [
            { label: "Tier 2 limit", value: formatMoney(1_500_000) },
            { label: "Request value", value: formatMoney(request.amount) },
          ],
          policyId: "pol-doa",
        },
        {
          id: "ctx-doa-31",
          title: "Delegation of Authority Policy v4.8, §3.1",
          subtitle: "Tier 1 authority",
          description: "The Executive Committee approves commitments above the Tier 2 limit. Board ratification applies only above 10M.",
          facts: [{ label: "Board threshold", value: formatMoney(10_000_000) }],
          policyId: "pol-doa",
        },
        {
          id: "ctx-crs-54",
          title: "Contract Requirements Standard v1.6, §5.4",
          subtitle: "Mandatory audit clause",
          description: "Extensions above 1M must include a third-party audit of costs at completion of the extended scope.",
          facts: [{ label: "Threshold", value: formatMoney(1_000_000) }],
          policyId: "pol-contract",
        },
      ],
    },
    {
      key: "contract",
      label: "Contract",
      items: [
        {
          id: "ctx-contract",
          title: `${contract.id} · ${contract.name}`,
          subtitle: contract.vendor,
          description: "Master agreement for hosting and migration services. Phases 1 and 2 are complete.",
          facts: [
            { label: "Current exposure", value: formatMoney(contract.currentExposure) },
            { label: "Risk level", value: "Medium-High" },
            { label: "Days remaining", value: String(contract.signals.daysRemaining) },
          ],
        },
        {
          id: "ctx-vendor",
          title: contract.vendor,
          subtitle: "Vendor",
          description: "Delivered 92% of Phase 1 and 2 milestones on time. No open disputes.",
          facts: [
            { label: "Milestones on time", value: "92%" },
            { label: "Open disputes", value: "0" },
          ],
        },
        {
          id: "ctx-deliverable-cutover",
          title: "Deliverable: Phase 3 cutover plan",
          subtitle: "Due in 6 weeks",
          description: "Cutover of billing and outage management workloads, with a rollback plan.",
          facts: [{ label: "Status", value: "In progress (80%)" }],
        },
        {
          id: "ctx-deliverable-decom",
          title: "Deliverable: Data centre decommissioning",
          subtitle: "After cutover",
          description: "Decommissioning of the end-of-life data centre once workloads are migrated.",
          facts: [{ label: "Status", value: "Not started" }],
        },
      ],
    },
    {
      key: "department",
      label: "Responsible Department",
      items: [
        {
          id: "ctx-dept",
          title: "Information Technology",
          subtitle: "Requesting department",
          description: "Owns the cloud migration programme and the hosting budget line.",
          facts: [
            { label: "Budget line", value: "IT-CAP-07" },
            { label: "Budget cover", value: "Confirmed by Finance" },
          ],
        },
      ],
    },
    {
      key: "project_manager",
      label: "Project Manager",
      items: [
        {
          id: "ctx-project",
          title: "Cloud Migration Programme · Phase 3",
          subtitle: "Programme Manager, Digital Services",
          description: "Moves the remaining critical workloads to cloud hosting. Phase 3 is the final phase.",
          facts: [
            { label: "Phase", value: "3 of 3" },
            { label: "Planned completion", value: "Q2 next year" },
          ],
        },
      ],
    },
    {
      key: "stakeholders",
      label: "Stakeholders",
      items: [
        { id: "ctx-stk-cio", title: "Chief Information Officer", subtitle: "Sponsor", description: "Sponsor of the migration programme. Supports the extension.", facts: [{ label: "Position", value: "Supports" }] },
        { id: "ctx-stk-cfo", title: "Chief Financial Officer", subtitle: "Budget holder", description: "Has confirmed budget cover; asked for an audit of Phase 3 costs.", facts: [{ label: "Position", value: "Supports with conditions" }] },
        { id: "ctx-stk-customer", title: "Head of Customer Services", subtitle: "Affected service owner", description: "Billing and outage reporting depend on the migrated workloads.", facts: [{ label: "Sign-off", value: "Pending" }] },
      ],
    },
    {
      key: "previous_decisions",
      label: "Previous Decisions",
      items: [
        { id: "ctx-prev-p2", title: "Phase 2 extension approved", subtitle: formatDate(daysAgo(310)), description: "Executive Committee approved the Phase 2 extension with a cost audit; the audit found no issues.", facts: [{ label: "Outcome", value: "Approved with audit" }] },
        { id: "ctx-prev-p1", title: "Phase 1 contract award", subtitle: formatDate(daysAgo(720)), description: "Original award after open tender.", facts: [{ label: "Outcome", value: "Awarded" }] },
      ],
    },
    {
      key: "deadlines",
      label: "Deadlines",
      items: [
        { id: "ctx-deadline-expiry", title: "Contract expiry", subtitle: formatDate(daysFromNow(48)), description: "The current agreement lapses on this date if no extension is signed.", facts: [{ label: "Days remaining", value: "48" }] },
        { id: "ctx-deadline-decision", title: "Decision needed by", subtitle: "Within 20 hours", description: "The vendor needs 45 days' notice to retain the migration team.", facts: [{ label: "Service-level target", value: "72 h" }] },
      ],
    },
    {
      key: "financial_exposure",
      label: "Financial Exposure",
      items: [
        { id: "ctx-fin-value", title: "Extension value", subtitle: formatMoney(request.amount), description: "18-month extension covering Phase 3 delivery.", facts: [{ label: "Value", value: formatMoney(request.amount) }] },
        { id: "ctx-fin-penalty", title: "Termination penalty", subtitle: formatMoney(180_000), description: "Payable under the termination clause if the agreement lapses mid-migration.", facts: [{ label: "Penalty", value: formatMoney(180_000) }] },
        { id: "ctx-fin-hosting", title: "Duplicate hosting costs", subtitle: `${formatMoney(74_000)} per month`, description: "Running the old data centre and cloud in parallel while Phase 3 is incomplete.", facts: [{ label: "Monthly", value: formatMoney(74_000) }] },
      ],
    },
    {
      key: "risks",
      label: "Related Risks",
      items: [
        { id: "ctx-risk-shutdown", title: "14-day service shutdown", subtitle: "High impact", description: "Migrated workloads would be suspended while services are re-contracted.", facts: [{ label: "Impact", value: "Billing and outage reporting offline" }] },
        { id: "ctx-risk-milestones", title: "Milestone slippage", subtitle: "Medium likelihood", description: "Two Phase 3 milestones are late; the vendor has a recovery plan.", facts: [{ label: "Delayed milestones", value: "2" }] },
        { id: "ctx-risk-dc", title: "End-of-life data centre", subtitle: "Rising", description: "Hardware support for the old data centre ends next year.", facts: [{ label: "Support ends", value: "Next year" }] },
      ],
    },
  ];

  const timeline: TimelineEvent[] = [
    { id: "t1", at: hoursAgo(52), actor: "Intake", action: "Request received", note: "Received from Information Technology and categorized as Contract extension.", kind: "received" },
    { id: "t2", at: hoursAgo(47), actor: "Head of Information Technology", action: "Department review completed", note: "Business case and vendor performance record attached.", kind: "review" },
    { id: "t3", at: hoursAgo(44), actor: "Routing rules", action: "Routed to Tier 2 · Director", note: "Contract extension category is held by Tier 2.", kind: "routing" },
    {
      id: "t4",
      at: hoursAgo(43.5),
      actor: "Routing rules",
      action: "Escalated to Tier 1 · Executive Committee",
      note: `Value ${formatMoney(request.amount)} is above Tier 2's ${formatMoney(1_500_000)} limit (Delegation of Authority Policy v4.8, §3.2).`,
      kind: "escalation",
    },
    { id: "t5", at: hoursAgo(30), actor: "Procurement", action: "Vendor check completed", note: "Vendor record and pricing validated against the framework.", kind: "review" },
    { id: "t6", at: hoursAgo(6), actor: "Policy Assistant", action: "Decision brief prepared", note: "Recommendation and linked context compiled from connected sources.", kind: "analysis" },
    { id: "t7", at: hoursAgo(0.5), actor: "Executive Committee", action: "Awaiting decision", note: "Decision required before the vendor notice deadline.", kind: "waiting" },
  ];

  return {
    request,
    contractId: contract.id,
    recommendation: {
      action: "Approve with mandatory audit clause",
      confidence: 96.4,
      rationale: "Phases 1 and 2 were delivered largely on time, budget cover is confirmed, and letting the agreement lapse costs more than extending it. The audit clause is required by policy for extensions of this size.",
      policySource: { policyId: "pol-contract", label: "Contract Requirements Standard v1.6", clause: "§5.4" },
    },
    sections: {
      statement: [
        "Information Technology requests approval to extend the ",
        { text: "Cloud Infrastructure Services Agreement", ref: "ctx-contract" },
        " with ",
        { text: contract.vendor, ref: "ctx-vendor" },
        " for 18 months, to complete ",
        { text: "Phase 3 of the cloud migration", ref: "ctx-project" },
        ". The extension value is ",
        { money: request.amount },
        ", and the current agreement ",
        { text: "expires in 48 days", ref: "ctx-deadline-expiry" },
        ".",
      ],
      justification: [
        "Phase 3 moves the ",
        { text: "billing and outage management workloads", ref: "ctx-deliverable-cutover" },
        " off the ",
        { text: "end-of-life data centre", ref: "ctx-risk-dc" },
        ". It completes the Digital Resilience objective sponsored by the ",
        { text: "Chief Information Officer", ref: "ctx-stk-cio" },
        " and removes ",
        { text: "duplicate hosting costs", ref: "ctx-fin-hosting" },
        " of ",
        { money: 74_000 },
        " per month. The ",
        { text: "Chief Financial Officer", ref: "ctx-stk-cfo" },
        " has confirmed budget cover.",
      ],
      impact: [
        "If no decision is made before the ",
        { text: "contract expiry", ref: "ctx-deadline-expiry" },
        ", the agreement lapses mid-migration. This triggers a ",
        { text: "termination penalty", ref: "ctx-fin-penalty" },
        " of ",
        { money: 180_000 },
        " and a ",
        { text: "14-day service shutdown", ref: "ctx-risk-shutdown" },
        " of migrated workloads while services are re-contracted. Billing and outage reporting, owned by the ",
        { text: "Head of Customer Services", ref: "ctx-stk-customer" },
        ", would be affected.",
      ],
      authority: [
        "The request value of ",
        { money: request.amount },
        " is above ",
        { text: "Tier 2's delegated limit", ref: "ctx-doa-32" },
        " of ",
        { money: 1_500_000 },
        ". Authority therefore sits with ",
        { text: "Tier 1 · Executive Committee", ref: "ctx-doa-31" },
        ". Board ratification is not required because the value is below the ",
        { money: 10_000_000 },
        " threshold in §3.1(b).",
      ],
      recommendation: [
        "Approve, with a ",
        { text: "mandatory audit clause", ref: "ctx-crs-54" },
        " requiring a third-party audit of Phase 3 costs at completion. This is required for extensions above ",
        { money: 1_000_000 },
        ". The same condition was applied to the ",
        { text: "Phase 2 extension", ref: "ctx-prev-p2" },
        ", and the vendor delivered 92% of milestones on time. Watch the ",
        { text: "two delayed milestones", ref: "ctx-risk-milestones" },
        " at the next steering meeting.",
      ],
    },
    context,
    relationships,
    timeline,
    decision: null,
  };
}

/** Builds a shorter, generic brief for every other request in the queue. */
function genericBrief(request: Request): DecisionBrief {
  const tier = tierById(request.requiredAuthorityTier);
  const overdue = new Date(request.deadlineAt).getTime() < Date.now();

  const context: ContextGroup[] = [
    {
      key: "policy",
      label: "Governing Policy",
      items: [
        {
          id: "ctx-policy",
          title: tier.groundingClause,
          subtitle: `${tier.name} · ${tier.role}`,
          description: `${tier.role} holds authority for this request under the Delegation of Authority Policy.`,
          facts: [
            { label: "Tier limit", value: tier.maxLimit === null ? "No upper limit" : formatMoney(tier.maxLimit) },
            { label: "Request value", value: formatMoney(request.amount) },
          ],
          policyId: tier.policySourceId,
        },
      ],
    },
    {
      key: "contract",
      label: "Contract",
      items: [{ id: "ctx-contract", title: "Linked contract record", subtitle: "From Contract Management", description: "Contract and deliverable details for this request.", facts: [{ label: "Status", value: "Active" }] }],
    },
    {
      key: "department",
      label: "Responsible Department",
      items: [{ id: "ctx-dept", title: request.originDepartment, subtitle: "Requesting department", description: "Department that raised and owns the request.", facts: [{ label: "Current stage", value: request.currentStage }] }],
    },
    {
      key: "project_manager",
      label: "Project Manager",
      items: [{ id: "ctx-project", title: `Request owner, ${request.originDepartment}`, subtitle: "Point of contact", description: "Accountable for providing supporting information.", facts: [{ label: "Category", value: request.category }] }],
    },
    {
      key: "stakeholders",
      label: "Stakeholders",
      items: [
        { id: "ctx-stk-finance", title: "Finance Business Partner", subtitle: "Budget cover", description: "Confirms budget cover for the commitment.", facts: [{ label: "Sign-off", value: "Received" }] },
        { id: "ctx-stk-dept", title: `Head of ${request.originDepartment}`, subtitle: "Department head", description: "Endorsed the request at department review.", facts: [{ label: "Sign-off", value: "Received" }] },
      ],
    },
    {
      key: "previous_decisions",
      label: "Previous Decisions",
      items: [{ id: "ctx-prev", title: `Similar ${request.category.toLowerCase()} requests`, subtitle: "Last 12 months", description: "Comparable requests were approved without changes in most cases.", facts: [{ label: "Approved unchanged", value: "88%" }] }],
    },
    {
      key: "deadlines",
      label: "Deadlines",
      items: [{ id: "ctx-deadline", title: "Service-level deadline", subtitle: formatDate(request.deadlineAt), description: overdue ? "The request has passed its service-level deadline." : "The request is within its service-level deadline.", facts: [{ label: "Elapsed", value: `${request.elapsedHours} h` }] }],
    },
    {
      key: "financial_exposure",
      label: "Financial Exposure",
      items: [{ id: "ctx-fin", title: "Request value", subtitle: formatMoney(request.amount), description: "Total commitment requested.", facts: [{ label: "Value", value: formatMoney(request.amount) }] }],
    },
    {
      key: "risks",
      label: "Related Risks",
      items: [{ id: "ctx-risk", title: overdue ? "Service-level breach" : "Delay risk", subtitle: overdue ? "Overdue" : "Monitor", description: "Further delay affects the requesting department's delivery plan.", facts: [{ label: "Priority score", value: String(request.priorityScore) }] }],
    },
  ];

  const timeline: TimelineEvent[] = [
    { id: "g1", at: request.receivedAt, actor: "Intake", action: "Request received", note: `Received from ${request.originDepartment} and categorized as ${request.category}.`, kind: "received" },
    { id: "g2", at: hoursAgo(request.elapsedHours * 0.7), actor: `Head of ${request.originDepartment}`, action: "Department review completed", note: "Supporting documents attached.", kind: "review" },
    { id: "g3", at: hoursAgo(request.elapsedHours * 0.5), actor: "Routing rules", action: `Routed to ${tier.name} · ${tier.role}`, note: `Value and category are within ${tier.name} authority (${tier.groundingClause}).`, kind: "routing" },
    { id: "g4", at: hoursAgo(Math.min(1, request.elapsedHours * 0.1)), actor: tier.role, action: "Awaiting decision", note: `Current stage: ${request.currentStage}.`, kind: "waiting" },
  ];

  return {
    request,
    contractId: null,
    recommendation: {
      action: request.priorityScore >= 75 ? "Approve" : "Approve with standard conditions",
      confidence: 80 + (request.priorityScore % 15),
      rationale: `The request is within ${tier.name} authority, budget cover is confirmed, and comparable requests were approved without changes.`,
      policySource: { policyId: tier.policySourceId, label: "Delegation of Authority Policy v4.8", clause: tier.groundingClause.split(", ")[1] ?? "" },
    },
    sections: {
      statement: [
        `${request.originDepartment} requests approval for `,
        { text: request.title, ref: "ctx-dept" },
        ", with a value of ",
        { money: request.amount },
        ".",
      ],
      justification: [
        "The request supports the department's delivery plan and is endorsed by the ",
        { text: `Head of ${request.originDepartment}`, ref: "ctx-stk-dept" },
        ". ",
        { text: "Budget cover", ref: "ctx-stk-finance" },
        " has been confirmed.",
      ],
      impact: [
        "Without a decision, the request ",
        { text: overdue ? "remains past its deadline" : "may miss its deadline", ref: "ctx-deadline" },
        " and the department carries ",
        { text: "delivery risk", ref: "ctx-risk" },
        ".",
      ],
      authority: [
        "The value of ",
        { money: request.amount },
        " and the category are within ",
        { text: `${tier.name} · ${tier.role}`, ref: "ctx-policy" },
        " authority. No escalation is needed.",
      ],
      recommendation: [
        "Approve. ",
        { text: "Comparable requests", ref: "ctx-prev" },
        " were approved without changes in most cases.",
      ],
    },
    context,
    relationships,
    timeline,
    decision: null,
  };
}

export function buildBrief(request: Request): DecisionBrief {
  return request.id === HERO_REQUEST_ID ? heroBrief(request) : genericBrief(request);
}
