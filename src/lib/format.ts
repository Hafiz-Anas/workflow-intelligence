import { format, formatDistanceToNowStrict } from "date-fns";
import { formatNumber } from "@/lib/config/locale";

export { formatMoney, formatNumber, formatPercent } from "@/lib/config/locale";

/** Human duration from hours, e.g. 18.4 h, 52 h, 4.2 d. */
export function formatDuration(hours: number): string {
  const abs = Math.abs(hours);
  if (abs < 1) return `${Math.round(hours * 60)} min`;
  if (abs < 100) return `${formatNumber(hours, oneDecimalIfNeeded(hours))} h`;
  return `${formatNumber(hours / 24, oneDecimalIfNeeded(hours / 24))} d`;
}

/** 18.4 keeps its decimal; 52.0 is shown as 52. */
function oneDecimalIfNeeded(value: number) {
  return Number.isInteger(Math.round(value * 10) / 10) ? 0 : 1;
}

export function formatMinutes(minutes: number): string {
  return `${minutes} min`;
}

export function formatDate(value: string | Date, pattern = "d MMM yyyy"): string {
  return format(typeof value === "string" ? new Date(value) : value, pattern);
}

export function formatDateTime(value: string | Date): string {
  return formatDate(value, "d MMM yyyy, HH:mm");
}

export function formatRelative(value: string | Date): string {
  return `${formatDistanceToNowStrict(typeof value === "string" ? new Date(value) : value)} ago`;
}

/** mm:ss clock display. */
export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
