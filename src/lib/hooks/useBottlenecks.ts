"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBottleneckReport, getPatterns, updatePatternStatus } from "@/lib/api";
import { queryKeys } from "./query-keys";

export function useBottlenecks() {
  return useQuery({ queryKey: queryKeys.bottlenecks, queryFn: getBottleneckReport });
}

export function usePatterns() {
  return useQuery({ queryKey: queryKeys.patterns, queryFn: getPatterns });
}

export function useUpdatePattern() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: updatePatternStatus,
    onSuccess: () => void client.invalidateQueries({ queryKey: queryKeys.patterns }),
  });
}
