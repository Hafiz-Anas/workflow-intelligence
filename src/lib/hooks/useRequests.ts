"use client";

import { useQuery } from "@tanstack/react-query";
import { getQueueSummary, getRequests } from "@/lib/api";
import { queryKeys } from "./query-keys";

export function useRequests() {
  return useQuery({ queryKey: queryKeys.requests, queryFn: getRequests });
}

export function useQueueSummary() {
  return useQuery({ queryKey: queryKeys.queueSummary, queryFn: getQueueSummary });
}
