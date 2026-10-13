import { contractSchema, riskKpisSchema, type Contract, type RiskKpis } from "@/lib/schemas";
import { simulateLatency } from "@/lib/utils";
import { db } from "./db";
import { ApiError } from "./errors";

export async function getContracts(): Promise<Contract[]> {
  await simulateLatency();
  return contractSchema
    .array()
    .parse(db.contracts)
    .sort((a, b) => b.likelihood * b.impact - a.likelihood * a.impact);
}

export async function getContractRisk(id: string): Promise<Contract> {
  await simulateLatency(200, 350);
  const contract = db.contracts.find((c) => c.id === id);
  if (!contract) throw new ApiError(404, `Contract ${id} was not found.`);
  return contractSchema.parse(contract);
}

/** Portfolio figures derived from the contract register. */
export async function getRiskKpis(): Promise<RiskKpis> {
  await simulateLatency();
  const contracts = db.contracts;
  const sum = (pick: (c: Contract) => number) => contracts.reduce((total, c) => total + pick(c), 0);
  const avgScore = sum((c) => c.likelihood * c.impact) / Math.max(1, contracts.length);
  return riskKpisSchema.parse({
    totalExposure: sum((c) => c.currentExposure),
    criticalContracts: contracts.filter((c) => c.riskLevel === "critical").length,
    vulnerabilityIndex: Math.round((avgScore / 25) * 1000) / 10,
    mitigated: sum((c) => c.mitigated),
  });
}

export async function recordRiskAction(id: string): Promise<{ contractId: string; action: string }> {
  await simulateLatency(250, 400);
  const contract = db.contracts.find((c) => c.id === id);
  if (!contract) throw new ApiError(404, `Contract ${id} was not found.`);
  return { contractId: id, action: contract.signals.recommendedAction };
}
