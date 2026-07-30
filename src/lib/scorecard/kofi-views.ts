// Sub-views for the "Kofinanzierung & Proposal-Erfolg" KPI detail page.
// Source: scorecard_kpi_detail_config.json → details.kofi_proposal
// The board card shows one number (Volumen); the detail page exposes four
// sights on the same underlying register (Proposal-Erfolg on volume basis,
// Stückquote as a fixed secondary read, EU broken out, Kofinanzierung).
// Divergence between Volumen and Stück is itself the finding.

import type { HistoryPoint } from "./history";

export interface KofiView {
  id: "volumen" | "stueck" | "eu" | "kofinanzierung";
  label: string;
  definition: string;
  /** 2026-Q3 baseline value used by the detail head-card. */
  baseline: number;
  /** Current period value used by the detail head-card. */
  current: number;
  history: HistoryPoint[];
  workedExample: string;
}

export const KOFI_VIEWS: KofiView[] = [
  {
    id: "volumen",
    label: "Volumen",
    definition:
      "Gewonnenes ÷ eingereichtes Proposal-Volumen (Mio €, rollierend 24 Monate). Offene Proposals zählen nicht.",
    baseline: 31,
    current: 54,
    history: [
      { period: "2024/25", value: 27 },
      { period: "2025/26", value: 31 },
      { period: "2026/27", value: 54 },
    ],
    workedExample: "7,9 ÷ 14,6 Mio € = 54 % · Basis: 21 Proposals in 24 Monaten",
  },
  {
    id: "stueck",
    label: "Stück",
    definition:
      "Gewonnene ÷ eingereichte Anzahl. Fester Zweitwert — Divergenz zum Volumen ist selbst die Diagnose: Volumen hoch, Stück niedrig heißt: die großen sitzen, die kleinen nicht. Umgekehrt: Fleiß ohne strategische Treffer.",
    baseline: 33,
    current: 38,
    history: [
      { period: "2024/25", value: 30 },
      { period: "2025/26", value: 33 },
      { period: "2026/27", value: 38 },
    ],
    workedExample: "8 ÷ 21 = 38 % · Lesart der Divergenz 54 vs. 38: die großen Anträge sitzen, die kleinen nicht.",
  },
  {
    id: "eu",
    label: "EU gesondert",
    definition:
      "Auf EU-Ausschreibungen isoliert. Beide Basen ausgewiesen: EU-Volumen und EU-Stück. Anschluss zur EU-Practice.",
    baseline: 20,
    current: 48,
    history: [
      { period: "2024/25", value: 12 },
      { period: "2025/26", value: 20 },
      { period: "2026/27", value: 48 },
    ],
    workedExample:
      "Volumen: 4,0 ÷ 8,3 Mio € = 48 % · Stück: 2 ÷ 6 = 33 %",
  },
  {
    id: "kofinanzierung",
    label: "Kofinanzierung",
    definition:
      "Kofinanzierungsvolumen im Verhältnis zum BMZ-Grundauftrag. Kontextzeile Geberkonzentration (BMZ-Anteil) läuft ohne Zielwert mit — Diversifizierung ist die Resilienzfrage, kein Steuerungsziel.",
    baseline: 26,
    current: 34,
    history: [
      { period: "2024/25", value: 22 },
      { period: "2025/26", value: 26 },
      { period: "2026/27", value: 34 },
    ],
    workedExample: "6,2 ÷ 18,5 Mio € = 34 % · Kontext: BMZ-Anteil 71 %",
  },
];

/** Cross-reference to the acquisition pipeline (diagnostik).
 *  Rendered at the bottom of the Kofi detail page so a stagnating Proposal-
 *  Erfolg can be explained by the trichter: is it the top (few leads →
 *  foresight issue) or conversion (many leads, few formalised → capacity/
 *  proposal quality)?
 */
export const PIPELINE_SUMMARY = {
  stage1: { count: 12, volumeMio: 8.4 },
  stage2: { count: 5, volumeMio: 6.1 },
  stage3: { count: 2, volumeMio: 4.0 },
  conversionVolume: "1 → 2: 73 % · 2 → 3: 66 %",
  eu: { stage2Count: 3, stage2VolumeMio: 4.9, stage3Count: 1, stage3VolumeMio: 4.0 },
} as const;
