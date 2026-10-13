"use client";

import { useQuery } from "@tanstack/react-query";
import { getQueueSummary, getRequests, getTopRequestId } from "@/lib/api";
import { queryKeys } from "./query-keys";

export function useRequests() {
  return useQuery({ queryKey: queryKeys.requests, queryFn: getRequests });
}

export function useQueueSummary() {
  return useQuery({ queryKey: queryKeys.queueSummary, queryFn: getQueueSummary });
}

export function useTopRequestId() {
  return useQuery({ queryKey: queryKeys.topRequestId, queryFn: getTopRequestId });
}
