// Sub-views for the "Mechanismus-Beteiligung" KPI detail page.
// Source: scorecard_kpi_detail_config.json → details.mechanismus.tabs
// The KPI has a single set of raw data (2 checkboxes per episode) but three
// derived views. Board card shows only "Gesamt"; the detail page exposes all
// three as nested tabs under the primary KPI tab.

import type { HistoryPoint } from "./history";
import type { Bi } from "./i18n";

export interface MechanismusView {
  id: "gesamt" | "practices" | "machine_room";
  label: Bi;
  definition: Bi;
  baseline: number;
  current: number;
  history: HistoryPoint[];
  workedExample: Bi;
}

export const MECHANISMUS_VIEWS: MechanismusView[] = [
  {
    id: "gesamt",
    label: { de: "Gesamt", en: "Total" },
    definition: {
      de: "Episoden mit mindestens einem Ja (Practice ODER Machine Room)",
      en: "Episodes with at least one yes (practice OR machine room)",
    },
    baseline: 34,
    current: 50,
    history: [
      { period: "2026-Q3", value: 34 },
      { period: "2026-Q4", value: 39 },
      { period: "2027-Q1", value: 44 },
      { period: "2027-Q2", value: 50 },
    ],
    workedExample: {
      de: "(3 nur Practice + 2 nur MR + 2 beides) ÷ 14 = 7 ÷ 14 = 50 %",
      en: "(3 practice only + 2 MR only + 2 both) ÷ 14 = 7 ÷ 14 = 50 %",
    },
  },
  {
    id: "practices",
    label: { de: "Practices", en: "Practices" },
    definition: {
      de: "Episoden, in denen ein Practice-Produkt oder eine Practice-Methode genutzt wurde (auch adaptiert)",
      en: "Episodes in which a practice product or practice method was used (including adapted use)",
    },
    baseline: 21,
    current: 36,
    history: [
      { period: "2026-Q3", value: 21 },
      { period: "2026-Q4", value: 26 },
      { period: "2027-Q1", value: 31 },
      { period: "2027-Q2", value: 36 },
    ],
    workedExample: {
      de: "(3 nur Practice + 2 beides) ÷ 14 = 5 ÷ 14 = 36 % · Plausibilisiert gegen die Anfragenlisten der Practices",
      en: "(3 practice only + 2 both) ÷ 14 = 5 ÷ 14 = 36 % · Plausibility-checked against the practices' request lists",
    },
  },
  {
    id: "machine_room",
    label: { de: "Machine Room", en: "Machine Room" },
    definition: {
      de: "Episoden mit Zuarbeit des Machine Room (Daten, Evidenz, Logistik, Beschaffung)",
      en: "Episodes with machine room input (data, evidence, logistics, procurement)",
    },
    baseline: 18,
    current: 29,
    history: [
      { period: "2026-Q3", value: 18 },
      { period: "2026-Q4", value: 22 },
      { period: "2027-Q1", value: 26 },
      { period: "2027-Q2", value: 29 },
    ],
    workedExample: {
      de: "(2 nur MR + 2 beides) ÷ 14 = 4 ÷ 14 = 29 % · Plausibilisiert gegen die Vorgangslisten des MR",
      en: "(2 MR only + 2 both) ÷ 14 = 4 ÷ 14 = 29 % · Plausibility-checked against the MR case lists",
    },
  },
];
