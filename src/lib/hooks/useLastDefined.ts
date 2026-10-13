"use client";

import { useState } from "react";

/**
 * Keeps the most recent non-null value. Drawers use it so their content stays
 * in place while the close animation plays after the selection is cleared.
 */
export function useLastDefined<T>(value: T | null | undefined): T | null {
  const [last, setLast] = useState<T | null>(value ?? null);
  if (value != null && value !== last) setLast(value);
  return value ?? last;
}
