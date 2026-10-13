"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPolicies, getPolicy, replacePolicy, uploadPolicy } from "@/lib/api";
import { queryKeys } from "./query-keys";

export function usePolicies() {
  return useQuery({ queryKey: queryKeys.policies, queryFn: getPolicies });
}

export function usePolicy(id: string | null) {
  return useQuery({
    queryKey: queryKeys.policy(id ?? ""),
    queryFn: () => getPolicy(id ?? ""),
    enabled: Boolean(id),
  });
}

export function useReplacePolicy() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: replacePolicy,
    onSuccess: () => void client.invalidateQueries({ queryKey: queryKeys.policies }),
  });
}

export function useUploadPolicy() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: uploadPolicy,
    onSuccess: () => void client.invalidateQueries({ queryKey: queryKeys.policies }),
  });
}
