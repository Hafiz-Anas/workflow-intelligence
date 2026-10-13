"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { configureConnector, getConnectors, getPipelineStatus, testConnection } from "@/lib/api";
import { queryKeys } from "./query-keys";

export function useConnectors() {
  return useQuery({ queryKey: queryKeys.connectors, queryFn: getConnectors });
}

export function usePipelineStatus() {
  return useQuery({ queryKey: queryKeys.pipeline, queryFn: getPipelineStatus });
}

export function useConfigureConnector() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: configureConnector,
    onSuccess: () => void client.invalidateQueries({ queryKey: queryKeys.connectors }),
  });
}

export function useTestConnection() {
  return useMutation({ mutationFn: testConnection });
}
