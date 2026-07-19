// Pure helpers powering the detail-view TrendChart. Kept in a separate module
// so they can be unit-tested without pulling in Recharts / React.

import type { HistoryPoint } from "@/lib/scorecard/history";

/**
 * Compute the Y-axis domain for the detail chart.
 *
 * Rule: zoom to the actual value range (history values + baseline), padded by
 * ±15 % of the span. This keeps small movements (e.g. 66 → 72 %) visible
 * instead of vanishing against a 0-anchored axis.
 *
 * - Null history points are ignored.
 * - When min == max the span falls back to 1 so the padding stays meaningful.
 * - With no numeric data at all, returns [0, 1] as a safe placeholder.
 */
export function computeYDomain(
  history: HistoryPoint[],
  baseline: number | undefined,
): [number, number] {
  const nums: number[] = history
    .map((p) => p.value)
    .filter((v): v is number => v != null);
  if (baseline !== undefined) nums.push(baseline);
  if (nums.length === 0) return [0, 1];
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  const span = Math.max(max - min, 1);
  const pad = span * 0.15;
  return [min - pad, max + pad];
}

/** Label rendered on the Baseline reference line (includes the numeric value). */
export function baselineLabel(baseline: number): string {
  return `Baseline ${baseline}`;
}
