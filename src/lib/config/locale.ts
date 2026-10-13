/**
 * Localization and tenant configuration.
 *
 * Everything that changes per client (currency, language, organization name,
 * signed-in user) lives here. Components must never hardcode currency symbols,
 * organization names or personal names.
 */

export const currency = "USD";
export const locale = "en";
export const organizationName = "Regional Utilities Authority";
export const currentUser = {
  name: "Sample User",
  role: "Director of Operations",
} as const;

/** Writing direction. Layout uses logical utilities (ms-/me-/ps-/pe-) so "rtl" can be enabled later. */
export const direction: "ltr" | "rtl" = "ltr";

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

interface MoneyOptions {
  /** Compact notation, e.g. 2.45M. Defaults to true for values of one million or more. */
  compact?: boolean;
}

export function formatMoney(amount: number, options: MoneyOptions = {}): string {
  const compact = options.compact ?? Math.abs(amount) >= 1_000_000;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 2 : 0,
  }).format(amount);
}

export function formatNumber(value: number, fractionDigits = 0): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatPercent(value: number, fractionDigits = 1): string {
  return `${formatNumber(value, fractionDigits)}%`;
}
