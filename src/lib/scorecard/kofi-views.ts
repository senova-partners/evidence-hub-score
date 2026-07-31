// Sub-views for the "Kofinanzierung & Proposal-Erfolg" KPI detail page.
// Source: scorecard_kpi_detail_config.json → details.kofi_proposal
// The board card shows one number (Volumen); the detail page exposes four
// sights on the same underlying register (Proposal-Erfolg on volume basis,
// Stückquote as a fixed secondary read, EU broken out, Kofinanzierung).
// Divergence between Volumen and Stück is itself the finding.

import type { HistoryPoint } from "./history";
import type { Bi } from "./i18n";

export interface KofiView {
  id: "volumen" | "stueck" | "eu" | "kofinanzierung";
  label: Bi;
  definition: Bi;
  /** 2026-Q3 baseline value used by the detail head-card. */
  baseline: number;
  /** Current period value used by the detail head-card. */
  current: number;
  history: HistoryPoint[];
  workedExample: Bi;
}

export const KOFI_VIEWS: KofiView[] = [
  {
    id: "volumen",
    label: { de: "Volumen", en: "Volume" },
    definition: {
      de: "Gewonnenes ÷ eingereichtes Proposal-Volumen (Mio €, rollierend 24 Monate). Offene Proposals zählen nicht.",
      en: "Won ÷ submitted proposal volume (EUR m, rolling 24 months). Open proposals do not count.",
    },
    baseline: 31,
    current: 54,
    history: [
      { period: "2024/25", value: 27 },
      { period: "2025/26", value: 31 },
      { period: "2026/27", value: 54 },
    ],
    workedExample: {
      de: "7,9 ÷ 14,6 Mio € = 54 % · Basis: 21 Proposals in 24 Monaten",
      en: "EUR 7.9 m ÷ 14.6 m = 54 % · Base: 21 proposals in 24 months",
    },
  },
  {
    id: "stueck",
    label: { de: "Stück", en: "Count" },
    definition: {
      de: "Gewonnene ÷ eingereichte Anzahl. Fester Zweitwert — Divergenz zum Volumen ist selbst die Diagnose: Volumen hoch, Stück niedrig heißt: die großen sitzen, die kleinen nicht. Umgekehrt: Fleiß ohne strategische Treffer.",
      en: "Won ÷ submitted count. Fixed secondary value — divergence from volume is itself the diagnosis: high volume, low count means the large bids land and the small ones do not. The reverse means diligence without strategic hits.",
    },
    baseline: 33,
    current: 38,
    history: [
      { period: "2024/25", value: 30 },
      { period: "2025/26", value: 33 },
      { period: "2026/27", value: 38 },
    ],
    workedExample: {
      de: "8 ÷ 21 = 38 % · Lesart der Divergenz 54 vs. 38: die großen Anträge sitzen, die kleinen nicht.",
      en: "8 ÷ 21 = 38 % · Reading the 54 vs. 38 divergence: the large bids land, the small ones do not.",
    },
  },
  {
    id: "eu",
    label: { de: "EU gesondert", en: "EU separately" },
    definition: {
      de: "Auf EU-Ausschreibungen isoliert. Beide Basen ausgewiesen: EU-Volumen und EU-Stück. Anschluss zur EU-Practice.",
      en: "Isolated to EU tenders. Both bases shown: EU volume and EU count. Links to the EU practice.",
    },
    baseline: 20,
    current: 48,
    history: [
      { period: "2024/25", value: 12 },
      { period: "2025/26", value: 20 },
      { period: "2026/27", value: 48 },
    ],
    workedExample: {
      de: "Volumen: 4,0 ÷ 8,3 Mio € = 48 % · Stück: 2 ÷ 6 = 33 %",
      en: "Volume: EUR 4.0 m ÷ 8.3 m = 48 % · Count: 2 ÷ 6 = 33 %",
    },
  },
  {
    id: "kofinanzierung",
    label: { de: "Kofinanzierung", en: "Co-financing" },
    definition: {
      de: "Kofinanzierungsvolumen im Verhältnis zum BMZ-Grundauftrag. Kontextzeile Geberkonzentration (BMZ-Anteil) läuft ohne Zielwert mit — Diversifizierung ist die Resilienzfrage, kein Steuerungsziel.",
      en: "Co-financing volume relative to the BMZ core commission. The donor-concentration context row (BMZ share) runs along without a target — diversification is a resilience question, not a steering goal.",
    },
    baseline: 26,
    current: 34,
    history: [
      { period: "2024/25", value: 22 },
      { period: "2025/26", value: 26 },
      { period: "2026/27", value: 34 },
    ],
    workedExample: {
      de: "6,2 ÷ 18,5 Mio € = 34 % · Kontext: BMZ-Anteil 71 %",
      en: "EUR 6.2 m ÷ 18.5 m = 34 % · Context: BMZ share 71 %",
    },
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
