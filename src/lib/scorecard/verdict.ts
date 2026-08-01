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
 * Verdict rule (v1.1 — strengere Fassung).
 *
 * Grundregel: "aus weniger DURCHGEHEND Besseres". Eine Verschlechterung in
 * einem Beweis-Paket darf kein grünes Quartal produzieren — sonst mittelt
 * das Urteil Bewegungen weg, die einzeln erklärungspflichtig sind.
 *
 *   1. Fehlt eine Baseline eines Board-KPIs? → "baseline_fehlt".
 *   2. Fehlt ein Wert in Paket 1 oder Paket 2? → "unvollstaendig" (nie "erfüllt").
 *   3. "Erfüllt" nur, wenn ALLE drei Pakete "steigend im engen Sinn" sind:
 *      mindestens ein KPI verbessert UND kein KPI verschlechtert.
 *      "Flat" (Bewegung unter Toleranz `eps`) zählt weder als Verbesserung
 *      noch als Verschlechterung — nur echte Verschlechterungen kippen das
 *      Urteil. Damit sinken kleine Zufallsschwankungen nicht sofort auf rot.
 *   4. Sonst: "nicht_erfuellt".
 *
 * Ersetzt die frühere Mehrheitsregel (≥50 % steigend), die eine Verschlech-
 * terung in einem 3er-Paket toleriert hätte. Beispiel: Außenbeweis mit
 * Wiederbeauftragung ↑, Kofi ↑, Partnerfeedback ↓ war unter v1.0 grün — unter
 * v1.1 rot, mit klarer Adresse für den Halbjahres-Review.
 */
export function boardKpis() {
  // KPIs shown on the board grid: exclude diagnostik-only and secondary-embedded.
  const secondaries = new Set<string>();
  for (const k of KPIS) {
    if (k.secondaryKpiId) secondaries.add(k.secondaryKpiId);
    if (k.secondaryKpiIds) k.secondaryKpiIds.forEach((id) => secondaries.add(id));
  }
  return KPIS.filter((k) => !k.diagnostik && !secondaries.has(k.id));
}

export function computeVerdict(store: Store, quarter: string): Verdict {
  const active = boardKpis();
  const missingBaseline = active.some((k) => store.baselines[k.id] === undefined);
  if (missingBaseline) return "baseline_fehlt";

  const missingP1P2 = active
    .filter((k) => k.pkg === "beratungsqualitaet" || k.pkg === "struktur")
    .some((k) => {
      const v = store.values[k.id]?.[quarter]?.value;
      return v === null || v === undefined;
    });
  if (missingP1P2) return "unvollstaendig";

  /**
   * A package is "rising" (v1.1) iff:
   *   - at least one KPI is trending "up" (improved beyond `eps`), AND
   *   - no KPI is trending "down" (worsened beyond `eps`).
   * "flat" moves are ignored — small noise does not kip the verdict.
   */
  const packageRisingStrict = (pkg: "aussenbeweis" | "beratungsqualitaet" | "struktur") => {
    const kpis = active.filter((k) => k.pkg === pkg);
    const trends = kpis
      .map((k) => trend(k.id, store.values[k.id]?.[quarter]?.value ?? null, store.baselines[k.id]))
      .filter((t) => t !== "missing");
    if (trends.length === 0) return false;
    const hasImprovement = trends.some((t) => t === "up");
    const hasWorsening = trends.some((t) => t === "down");
    return hasImprovement && !hasWorsening;
  };

  const ok =
    packageRisingStrict("struktur") &&
    packageRisingStrict("beratungsqualitaet") &&
    packageRisingStrict("aussenbeweis");
  return ok ? "erfuellt" : "nicht_erfuellt";
}

/** Meldetreue: wie viele der aktiven Board-KPIs haben in diesem Quartal einen Wert? */
export function meldetreue(
  store: Store,
  quarter: string,
): { onTime: number; total: number } {
  const active = boardKpis();
  const total = active.length;
  const onTime = active.filter((k) => {
    const v = store.values[k.id]?.[quarter];
    return v && v.value !== null && v.value !== undefined && v.reported;
  }).length;
  return { onTime, total };
}

export function plausibilityFlag(prev: number | null, curr: number | null): boolean {
  if (prev === null || curr === null || prev === 0) return false;
  return Math.abs((curr - prev) / prev) > 0.3;
}
