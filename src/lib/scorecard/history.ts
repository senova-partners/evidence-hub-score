// Time-series history per KPI (source: scorecard_kpi_config v1.0, field `history`).
// Kept in a dedicated module so the frozen KPI config (kpis.ts) stays untouched.
// Consumed by the board sparkline and by the detail view's Verlauf chart.

export interface HistoryPoint {
  period: string;
  value: number | null;
}

export const KPI_HISTORY: Record<string, HistoryPoint[]> = {
  wiederbeauftragung: [
    { period: "Konsult. 2024/25", value: 44 },
    { period: "Konsult. 2025/26", value: 48 },
    { period: "Konsult. 2026/27", value: 54 },
  ],
  kofi_proposal: [
    { period: "2024/25", value: 27 },
    { period: "2025/26", value: 31 },
    { period: "2026/27", value: 54 },
  ],
  partnerfeedback_jahr: [
    { period: "2026 (Baseline)", value: 0 },
    { period: "2027", value: 5 },
  ],
  delivery_quote: [
    { period: "2026", value: 78 },
    { period: "2027", value: 80 },
  ],
  partnerbogen: [
    { period: "2026-Q3", value: 3.6 },
    { period: "2026-Q4", value: 3.7 },
    { period: "2027-Q1", value: 3.8 },
    { period: "2027-Q2", value: 3.9 },
  ],
  uptake: [
    { period: "2026-H2", value: 42 },
    { period: "2027-H1", value: 49 },
    { period: "2027-H2", value: 55 },
  ],
  peer_review: [
    { period: "2026-H2", value: 2.9 },
    { period: "2027-H1", value: null },
  ],
  mechanismus: [
    { period: "2026-Q3", value: 34 },
    { period: "2026-Q4", value: 39 },
    { period: "2027-Q1", value: 44 },
    { period: "2027-Q2", value: 50 },
  ],
  fachzeit: [
    { period: "2026-H2", value: 66 },
    { period: "2027-H1", value: 69 },
    { period: "2027-H2", value: 72 },
  ],
  inhouse_beratungsquote: [
    { period: "2026", value: 64 },
    { period: "2027", value: 67 },
  ],
  schmerzpunkt: [
    { period: "Reach-In 2026", value: 3.2 },
    { period: "Wiedervorlage 2027", value: 2.7 },
  ],
};

export const kpiHistory = (id: string): HistoryPoint[] => KPI_HISTORY[id] ?? [];
