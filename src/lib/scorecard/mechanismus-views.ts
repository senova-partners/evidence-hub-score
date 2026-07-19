// Sub-views for the "Mechanismus-Beteiligung" KPI detail page.
// Source: scorecard_kpi_detail_config.json → details.mechanismus.tabs
// The KPI has a single set of raw data (2 checkboxes per episode) but three
// derived views. Board card shows only "Gesamt"; the detail page exposes all
// three as nested tabs under the primary KPI tab.

import type { HistoryPoint } from "./history";

export interface MechanismusView {
  id: "gesamt" | "practices" | "machine_room";
  label: string;
  definition: string;
  baseline: number;
  current: number;
  history: HistoryPoint[];
  workedExample: string;
}

export const MECHANISMUS_VIEWS: MechanismusView[] = [
  {
    id: "gesamt",
    label: "Gesamt",
    definition:
      "Episoden mit mindestens einem Ja (Practice ODER Machine Room)",
    baseline: 34,
    current: 50,
    history: [
      { period: "2026-Q3", value: 34 },
      { period: "2026-Q4", value: 39 },
      { period: "2027-Q1", value: 44 },
      { period: "2027-Q2", value: 50 },
    ],
    workedExample: "(3 nur Practice + 2 nur MR + 2 beides) ÷ 14 = 7 ÷ 14 = 50 %",
  },
  {
    id: "practices",
    label: "Practices",
    definition:
      "Episoden, in denen ein Practice-Produkt oder eine Practice-Methode genutzt wurde (auch adaptiert)",
    baseline: 21,
    current: 36,
    history: [
      { period: "2026-Q3", value: 21 },
      { period: "2026-Q4", value: 26 },
      { period: "2027-Q1", value: 31 },
      { period: "2027-Q2", value: 36 },
    ],
    workedExample:
      "(3 nur Practice + 2 beides) ÷ 14 = 5 ÷ 14 = 36 % · Plausibilisiert gegen die Anfragenlisten der Practices",
  },
  {
    id: "machine_room",
    label: "Machine Room",
    definition:
      "Episoden mit Zuarbeit des Machine Room (Daten, Evidenz, Logistik, Beschaffung)",
    baseline: 18,
    current: 29,
    history: [
      { period: "2026-Q3", value: 18 },
      { period: "2026-Q4", value: 22 },
      { period: "2027-Q1", value: 26 },
      { period: "2027-Q2", value: 29 },
    ],
    workedExample:
      "(2 nur MR + 2 beides) ÷ 14 = 4 ÷ 14 = 29 % · Plausibilisiert gegen die Vorgangslisten des MR",
  },
];
