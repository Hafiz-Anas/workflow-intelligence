"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getDecisionBrief, getRequest, submitDecision } from "@/lib/api";
import type { DecisionInput } from "@/lib/schemas";
import { queryKeys } from "./query-keys";

export function useRequest(id: string) {
  return useQuery({ queryKey: queryKeys.request(id), queryFn: () => getRequest(id), enabled: Boolean(id) });
}

export function useDecisionBrief(id: string) {
  return useQuery({ queryKey: queryKeys.brief(id), queryFn: () => getDecisionBrief(id), enabled: Boolean(id) });
}

export function useSubmitDecision() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: DecisionInput) => submitDecision(input),
    onSuccess: (_event, input) => {
      void client.invalidateQueries({ queryKey: queryKeys.brief(input.requestId) });
      void client.invalidateQueries({ queryKey: queryKeys.requests });
    },
  });
}
