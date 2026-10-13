import { z } from "zod";

export const detectedPatternSchema = z.object({
  id: z.string(),
  text: z.string(),
  metric: z.string(),
  recommendedChange: z.string(),
  expectedImpact: z.string(),
  status: z.enum(["open", "accepted", "dismissed"]),
});

export type DetectedPattern = z.infer<typeof detectedPatternSchema>;
