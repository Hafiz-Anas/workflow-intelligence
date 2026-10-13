import { bottleneckReportSchema, detectedPatternSchema, type BottleneckReport, type DetectedPattern } from "@/lib/schemas";
import { simulateLatency } from "@/lib/utils";
import { db } from "./db";
import { ApiError } from "./errors";

export async function getBottleneckReport(): Promise<BottleneckReport> {
  await simulateLatency();
  return bottleneckReportSchema.parse(db.bottlenecks);
}

export async function getPatterns(): Promise<DetectedPattern[]> {
  await simulateLatency();
  return detectedPatternSchema.array().parse(db.patterns);
}

export async function updatePatternStatus(input: { id: string; status: "accepted" | "dismissed" }): Promise<DetectedPattern> {
  await simulateLatency(250, 400);
  const pattern = db.patterns.find((p) => p.id === input.id);
  if (!pattern) throw new ApiError(404, `Pattern ${input.id} was not found.`);
  pattern.status = input.status;
  return detectedPatternSchema.parse(pattern);
}
