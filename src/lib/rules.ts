import type { AuthorityTier, RuleTestInput, RuleTestResult } from "@/lib/schemas";
import { formatMoney } from "@/lib/config/locale";

/** Tiers ordered from the lowest authority (Tier 3) to the highest (Tier 1). */
function ascending(tiers: AuthorityTier[]) {
  return [...tiers].sort((a, b) => b.level - a.level);
}

function holdsCategory(tier: AuthorityTier, category: string) {
  return tier.categoriesApprovable.includes("All categories") || tier.categoriesApprovable.includes(category);
}

function withinLimit(tier: AuthorityTier, amount: number) {
  return tier.maxLimit === null || amount <= tier.maxLimit;
}

/**
 * Routes a request to the lowest tier whose limit covers the amount and which
 * holds the category (Delegation of Authority §3.1–3.4).
 */
export function resolveTier(tiers: AuthorityTier[], input: RuleTestInput): RuleTestResult {
  const ordered = ascending(tiers);
  const byAmount = ordered.find((t) => withinLimit(t, input.amount)) ?? ordered[ordered.length - 1];
  const startIndex = ordered.indexOf(byAmount);
  const resolved = ordered.slice(startIndex).find((t) => holdsCategory(t, input.category)) ?? ordered[ordered.length - 1];
  const escalatedForCategory = resolved.id !== byAmount.id;

  const steps: string[] = [];
  for (const tier of ordered.slice(0, startIndex)) {
    steps.push(`${tier.name} (${tier.role}): ${formatMoney(input.amount)} is above the ${formatMoney(tier.maxLimit ?? 0)} limit.`);
  }
  steps.push(
    `${byAmount.name} (${byAmount.role}): amount is within the limit${
      byAmount.maxLimit === null ? "" : ` of ${formatMoney(byAmount.maxLimit)}`
    }.`,
  );
  if (escalatedForCategory) {
    steps.push(`${byAmount.name} does not hold the "${input.category}" category, so the request moves up (§3.4).`);
    steps.push(`${resolved.name} (${resolved.role}) holds "${input.category}".`);
  }

  const clause = escalatedForCategory ? "Delegation of Authority Policy v4.8, §3.4" : resolved.groundingClause;
  const explanation = escalatedForCategory
    ? `A ${input.category.toLowerCase()} request of ${formatMoney(input.amount)} from ${input.department} is within ${byAmount.name}'s financial limit, but that category is not delegated to ${byAmount.name}. It should go to ${resolved.name} (${resolved.role}).`
    : `A ${input.category.toLowerCase()} request of ${formatMoney(input.amount)} from ${input.department} can be approved by ${resolved.name} (${resolved.role}) without escalation.${
        resolved.limitNote && input.amount > 10_000_000 ? ` ${resolved.limitNote}.` : ""
      }`;

  return {
    tierId: resolved.id,
    tierName: resolved.name,
    role: resolved.role,
    clause,
    policySourceId: resolved.policySourceId,
    escalatedForCategory,
    explanation,
    steps,
  };
}
