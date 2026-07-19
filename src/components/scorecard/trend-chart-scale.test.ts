import { describe, expect, it } from "vitest";
import { computeYDomain, baselineLabel } from "./trend-chart-scale";
import type { HistoryPoint } from "@/lib/scorecard/history";

const h = (values: (number | null)[]): HistoryPoint[] =>
  values.map((v, i) => ({ period: `P${i + 1}`, value: v }));

describe("computeYDomain — Baseline ± 15 % zoom", () => {
  it("pads the min/max span (history + baseline) by 15 % on both ends", () => {
    // fachzeit-style: history 66 → 72, baseline 64. Span = 72 − 64 = 8, pad = 1.2.
    const [lo, hi] = computeYDomain(h([66, 69, 72]), 64);
    expect(lo).toBeCloseTo(62.8, 6);
    expect(hi).toBeCloseTo(73.2, 6);
    // Never anchors to 0 — the whole point of the zoom rule.
    expect(lo).toBeGreaterThan(0);
  });

  it("includes the baseline in the range even when it sits outside the series", () => {
    // Baseline 50 well below the series 66..72 must appear inside the domain.
    const [lo, hi] = computeYDomain(h([66, 69, 72]), 50);
    const span = 72 - 50;
    expect(lo).toBeCloseTo(50 - span * 0.15, 6);
    expect(hi).toBeCloseTo(72 + span * 0.15, 6);
    expect(lo).toBeLessThanOrEqual(50);
    expect(hi).toBeGreaterThanOrEqual(72);
  });

  it("ignores null history points (missing readings)", () => {
    // Nums = [2.9, 3.0]; span 0.1 falls below the floor of 1, so pad = 0.15.
    const [lo, hi] = computeYDomain(h([2.9, null]), 3.0);
    expect(lo).toBeCloseTo(2.75, 6);
    expect(hi).toBeCloseTo(3.15, 6);
  });

  it("keeps a meaningful pad when all values collapse to one point", () => {
    // min == max → span floor of 1, so pad = 0.15.
    const [lo, hi] = computeYDomain(h([80]), 80);
    expect(lo).toBeCloseTo(79.85, 6);
    expect(hi).toBeCloseTo(80.15, 6);
  });

  it("falls back to [0, 1] when there is nothing numeric to plot", () => {
    expect(computeYDomain(h([null, null]), undefined)).toEqual([0, 1]);
    expect(computeYDomain([], undefined)).toEqual([0, 1]);
  });

  it("works when no baseline is provided", () => {
    const [lo, hi] = computeYDomain(h([66, 72]), undefined);
    expect(lo).toBeCloseTo(66 - 0.9, 6);
    expect(hi).toBeCloseTo(72 + 0.9, 6);
  });
});

describe("baselineLabel — reference line carries its numeric value", () => {
  it("renders as 'Baseline <value>'", () => {
    expect(baselineLabel(64)).toBe("Baseline 64");
    expect(baselineLabel(3.6)).toBe("Baseline 3.6");
    expect(baselineLabel(0)).toBe("Baseline 0");
  });
});
