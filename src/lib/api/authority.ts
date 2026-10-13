import { resolveTier } from "@/lib/rules";
import {
  authorityKpisSchema,
  authorityTierSchema,
  policyDocumentSchema,
  ruleTestInputSchema,
  type AuthorityKpis,
  type AuthorityTier,
  type PolicyDocument,
  type PolicyType,
  type RuleTestInput,
  type RuleTestResult,
} from "@/lib/schemas";
import { simulateLatency } from "@/lib/utils";
import { db } from "./db";
import { ApiError } from "./errors";

/** Tiers ordered from the highest authority (Tier 1) down. */
export async function getTiers(): Promise<AuthorityTier[]> {
  await simulateLatency();
  return authorityTierSchema
    .array()
    .parse(db.tiers)
    .sort((a, b) => a.level - b.level);
}

export async function getAuthorityKpis(): Promise<AuthorityKpis> {
  await simulateLatency();
  return authorityKpisSchema.parse(db.authorityKpis);
}

/** Computes which tier should handle a request, using the organization's tier limits. */
export async function testRule(input: RuleTestInput): Promise<RuleTestResult> {
  const parsed = ruleTestInputSchema.parse(input);
  await simulateLatency(250, 450);
  return resolveTier(db.tiers, parsed);
}

export async function getPolicies(): Promise<PolicyDocument[]> {
  await simulateLatency();
  return policyDocumentSchema.array().parse(db.policies);
}

export async function getPolicy(id: string): Promise<PolicyDocument> {
  await simulateLatency(200, 350);
  const policy = db.policies.find((p) => p.id === id);
  if (!policy) throw new ApiError(404, `Policy ${id} was not found.`);
  return policyDocumentSchema.parse(policy);
}

function bumpVersion(version: string) {
  const [major, minor = "0"] = version.split(".");
  return `${major}.${Number(minor) + 1}`;
}

export async function replacePolicy(input: { id: string; fileName: string; sizeKb: number }): Promise<PolicyDocument> {
  await simulateLatency();
  const policy = db.policies.find((p) => p.id === input.id);
  if (!policy) throw new ApiError(404, `Policy ${input.id} was not found.`);
  Object.assign(policy, {
    fileName: input.fileName,
    sizeKb: input.sizeKb,
    version: bumpVersion(policy.version),
    uploadedAt: new Date().toISOString(),
    status: "active",
    syncStatus: "synced",
  } satisfies Partial<PolicyDocument>);
  return policyDocumentSchema.parse(policy);
}

function guessType(fileName: string): PolicyType {
  const name = fileName.toLowerCase();
  if (name.includes("authority") || name.includes("delegation")) return "authority_limits";
  if (name.includes("escalation")) return "escalation_rules";
  if (name.includes("approval")) return "approval_rules";
  if (name.includes("contract")) return "contract_requirements";
  if (name.includes("procedure")) return "procedure";
  return "policy";
}

export async function uploadPolicy(input: { fileName: string; sizeKb: number }): Promise<PolicyDocument> {
  await simulateLatency();
  const name = input.fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  const policy = policyDocumentSchema.parse({
    id: `pol-${Date.now()}`,
    name,
    type: guessType(input.fileName),
    version: "1.0",
    uploadedAt: new Date().toISOString(),
    status: "needs_review",
    syncStatus: "syncing",
    sizeKb: input.sizeKb,
    fileName: input.fileName,
    owner: "Uploaded in this session",
    summary: "Newly uploaded. Clauses will be extracted and shown here once indexing completes.",
    clauses: [],
  });
  db.policies.unshift(policy);
  return policy;
}
