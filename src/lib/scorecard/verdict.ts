import { KPIS, kpiById } from "./kpis";
import type { Store } from "./store";
import type { KpiDef, Trend, Verdict } from "./types";

/**
 * Arithmetic delta: current − baseline (signed, unchanged by direction).
 * Used purely for numeric display next to the trend arrow.
 */
export function delta(
  _kpiId: string,
  current: number | null,
  baseline: number | null | undefined,
): number | null {
  if (current === null || baseline === null || baseline === undefined) return null;
  return current - baseline;
}

/** True if the current value is an improvement over baseline given the KPI's direction. */
export function isImprovement(kpi: KpiDef, current: number, baseline: number): boolean {
  return kpi.direction === "lower_better" ? current < baseline : current > baseline;
}

/**
 * Trend arrow reflects *improvement*, not arithmetic sign.
 * Testvorgang 17 vs. baseline 21 → "up" (verbessert), display "−4 d".
 */
export function trend(
  kpiId: string,
  current: number | null,
  baseline: number | null | undefined,
): Trend {
  if (current === null) return "missing";
  if (baseline === null || baseline === undefined) return "flat";
  const kpi = kpiById(kpiId);
  if (!kpi) return "flat";
  const diff = current - baseline;
  // Tolerance: half a display step (scores 0.05, others 0.5).
  const eps = kpi.format === "score" ? 0.05 : 0.5;
  if (Math.abs(diff) < eps) return "flat";
  return isImprovement(kpi, current, baseline) ? "up" : "down";
}

/**
 * Verdict rule (v1.0):
 *   - Baselines vollständig? sonst "baseline_fehlt".
 *   - Fehlt ein Messpunkt in Paket 1 oder 2? → "unvollstaendig" (nie "erfüllt").
 *   - Sonst: Paket 1 UND Paket 2 mehrheitlich steigend UND Paket 3 stabil/besser → "erfüllt".
 *   - Sonst: "nicht_erfuellt".
 */
export function computeVerdict(store: Store, quarter: string): Verdict {
  const missingBaseline = KPIS.some((k) => store.baselines[k.id] === undefined);
  if (missingBaseline) return "baseline_fehlt";

  const missingP1P2 = KPIS.filter(
    (k) => k.pkg === "aussenbeweis" || k.pkg === "beratungsqualitaet",
  ).some((k) => {
    const v = store.values[k.id]?.[quarter]?.value;
    return v === null || v === undefined;
  });
  if (missingP1P2) return "unvollstaendig";

  const packageRising = (pkg: "aussenbeweis" | "beratungsqualitaet") => {
    const kpis = KPIS.filter((k) => k.pkg === pkg);
    const rep = kpis
      .map((k) => ({ k, v: store.values[k.id]?.[quarter]?.value ?? null }))
      .filter((x) => x.v !== null);
    if (rep.length === 0) return false;
    const ups = rep.filter(
      (x) => trend(x.k.id, x.v, store.baselines[x.k.id]) === "up",
    ).length;
    return ups / rep.length >= 0.5;
  };

  const packageStableOrBetter = () => {
    const kpis = KPIS.filter((k) => k.pkg === "struktur");
    const rep = kpis
      .map((k) => ({ k, v: store.values[k.id]?.[quarter]?.value ?? null }))
      .filter((x) => x.v !== null);
    if (rep.length === 0) return false;
    return rep.every((x) => {
      const tr = trend(x.k.id, x.v, store.baselines[x.k.id]);
      return tr === "up" || tr === "flat";
    });
  };

  const ok =
    packageRising("aussenbeweis") &&
    packageRising("beratungsqualitaet") &&
    packageStableOrBetter();
  return ok ? "erfuellt" : "nicht_erfuellt";
}

/**
 * Meldetreue-Header: wie viele der 12 KPIs haben in diesem Quartal einen Wert?
 * Denominator ist immer KPIS.length (12), konsistent zum tatsächlichen Set.
 */
export function meldetreue(
  store: Store,
  quarter: string,
): { onTime: number; total: number } {
  const total = KPIS.length;
  const onTime = KPIS.filter((k) => {
    const v = store.values[k.id]?.[quarter];
    return v && v.value !== null && v.value !== undefined && v.reported;
  }).length;
  return { onTime, total };
}

export function plausibilityFlag(prev: number | null, curr: number | null): boolean {
  if (prev === null || curr === null || prev === 0) return false;
  return Math.abs((curr - prev) / prev) > 0.3;
}
