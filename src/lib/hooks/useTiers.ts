"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { getAuthorityKpis, getTiers, testRule } from "@/lib/api";
import type { RuleTestInput } from "@/lib/schemas";
import { queryKeys } from "./query-keys";

export function useTiers() {
  return useQuery({ queryKey: queryKeys.tiers, queryFn: getTiers });
}

export function useAuthorityKpis() {
  return useQuery({ queryKey: queryKeys.authorityKpis, queryFn: getAuthorityKpis });
}

export function useRuleTest() {
  return useMutation({ mutationFn: (input: RuleTestInput) => testRule(input) });
}
