import { KPIS, kpiById } from "./kpis";
import type { Store } from "./store";
import type { Trend, Verdict } from "./types";

export function delta(
  kpiId: string,
  current: number | null,
  baseline: number | null | undefined,
): number | null {
  if (current === null || baseline === null || baseline === undefined) return null;
  const kpi = kpiById(kpiId);
  if (!kpi) return null;
  // For lower-is-better, positive delta means improvement (baseline - current)
  return kpi.direction === "lower_is_better" ? baseline - current : current - baseline;
}

export function trend(
  kpiId: string,
  current: number | null,
  baseline: number | null | undefined,
): Trend {
  if (current === null) return "missing";
  const d = delta(kpiId, current, baseline);
  if (d === null) return "flat";
  if (Math.abs(d) < 0.5) return "flat";
  return d > 0 ? "up" : "down";
}

export function computeVerdict(store: Store, quarter: string): Verdict {
  const missingBaseline = KPIS.some((k) => store.baselines[k.id] === undefined);
  if (missingBaseline) return "baseline_fehlt";

  const packageRising = (pkg: "aussenbeweis" | "beratungsqualitaet") => {
    const kpis = KPIS.filter((k) => k.pkg === pkg);
    // rising: majority of reported KPIs show "up"
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

  const ok = packageRising("aussenbeweis") && packageRising("beratungsqualitaet") && packageStableOrBetter();
  return ok ? "erfuellt" : "nicht_erfuellt";
}

export function meldetreue(store: Store, quarter: string): { onTime: number; total: number } {
  const subs = store.submissions.filter((s) => s.quarter === quarter);
  const onTime = subs.filter((s) => s.status === "on_time").length;
  return { onTime, total: subs.length };
}

export function plausibilityFlag(prev: number | null, curr: number | null): boolean {
  if (prev === null || curr === null || prev === 0) return false;
  return Math.abs((curr - prev) / prev) > 0.3;
}
