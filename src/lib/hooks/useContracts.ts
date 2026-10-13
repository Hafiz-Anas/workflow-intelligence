"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { getContractRisk, getContracts, getRiskKpis, recordRiskAction } from "@/lib/api";
import { queryKeys } from "./query-keys";

export function useContracts() {
  return useQuery({ queryKey: queryKeys.contracts, queryFn: getContracts });
}

export function useContractRisk(id: string | null) {
  return useQuery({
    queryKey: queryKeys.contract(id ?? ""),
    queryFn: () => getContractRisk(id ?? ""),
    enabled: Boolean(id),
  });
}

export function useRiskKpis() {
  return useQuery({ queryKey: queryKeys.riskKpis, queryFn: getRiskKpis });
}

export function useRecordRiskAction() {
  return useMutation({ mutationFn: recordRiskAction });
}
