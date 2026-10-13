/**
 * DEMO: sample data helper. Remove /lib/mock when connecting a real backend.
 *
 * Mock timestamps are generated relative to the moment the app loads so the
 * demo always looks current.
 */

const HOUR = 60 * 60 * 1000;
const loadedAt = Date.now();

export function hoursAgo(hours: number): string {
  return new Date(loadedAt - hours * HOUR).toISOString();
}

export function hoursFromNow(hours: number): string {
  return new Date(loadedAt + hours * HOUR).toISOString();
}

export function daysAgo(days: number): string {
  return hoursAgo(days * 24);
}

export function daysFromNow(days: number): string {
  return hoursFromNow(days * 24);
}
