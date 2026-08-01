// Sub-views for the "Peer-Review-Rating" KPI detail page.
// Source: scorecard_kpi_detail_config.json → details.peer_review.tabs
//
// New instrument (demand side): projects that used a Practice deliverable or a
// Machine-Room contribution rate its usability for their advisory work on a
// 1–5 scale. Two independent rating fields per episode. Board card shows the
// weighted total; the detail page exposes all three views as nested tabs.

import type { HistoryPoint } from "./history";
import type { Bi } from "./i18n";
import type { Episode } from "./types";

export interface PeerReviewView {
  id: "gesamt" | "practices" | "machine_room";
  label: Bi;
  definition: Bi;
  baseline: number;
  /** History of previous periods; the current quarter is appended at render time. */
  history: HistoryPoint[];
  workedExample: Bi;
}

export const PEER_REVIEW_VIEWS: PeerReviewView[] = [
  {
    id: "gesamt",
    label: { de: "Gesamt", en: "Total" },
    definition: {
      de: "Gewichteter Mittelwert über alle Nutzbarkeitsbewertungen (Practices und Machine Room zusammen)",
      en: "Weighted mean across all usability ratings (practices and machine room combined)",
    },
    baseline: 3.4,
    history: [
      { period: "2026-Q1", value: 3.4 },
      { period: "2026-Q2", value: 3.6 },
    ],
    workedExample: {
      de: "(Summe Practice-Bewertungen + Summe Machine-Room-Bewertungen) ÷ Anzahl aller Bewertungen",
      en: "(sum of practice ratings + sum of machine room ratings) ÷ count of all ratings",
    },
  },
  {
    id: "practices",
    label: { de: "Practices", en: "Practices" },
    definition: {
      de: "Mittelwert der Nutzbarkeitsbewertungen von Practice-Leistungen (1–5)",
      en: "Mean usability rating of practice deliverables (1–5)",
    },
    baseline: 3.6,
    history: [
      { period: "2026-Q1", value: 3.6 },
      { period: "2026-Q2", value: 3.9 },
    ],
    workedExample: {
      de: "Summe der Practice-Bewertungen ÷ Anzahl der Practice-Bewertungen",
      en: "sum of practice ratings ÷ number of practice ratings",
    },
  },
  {
    id: "machine_room",
    label: { de: "Machine Room", en: "Machine Room" },
    definition: {
      de: "Mittelwert der Nutzbarkeitsbewertungen von Machine-Room-Zuarbeiten (1–5)",
      en: "Mean usability rating of machine room contributions (1–5)",
    },
    baseline: 3.0,
    history: [
      { period: "2026-Q1", value: 3.0 },
      { period: "2026-Q2", value: 3.1 },
    ],
    workedExample: {
      de: "Summe der Machine-Room-Bewertungen ÷ Anzahl der Machine-Room-Bewertungen",
      en: "sum of machine room ratings ÷ number of machine room ratings",
    },
  },
];

export interface PeerReviewResult {
  value: number | null;
  n: number;
  sum: number;
}

function mean(values: number[]): PeerReviewResult {
  const sum = values.reduce((a, b) => a + b, 0);
  return {
    n: values.length,
    sum,
    value: values.length === 0 ? null : Math.round((sum / values.length) * 100) / 100,
  };
}

/** Collect the two independent rating pools from the episode register. */
export function peerReviewPools(episodes: Episode[]): {
  practices: number[];
  machineRoom: number[];
} {
  const practices: number[] = [];
  const machineRoom: number[] = [];
  for (const e of episodes) {
    const p = e.usability?.practice;
    const m = e.usability?.machineRoom;
    if (typeof p === "number") practices.push(p);
    if (typeof m === "number") machineRoom.push(m);
  }
  return { practices, machineRoom };
}

/**
 * Per-view results over the given episodes.
 * Gesamt is a weighted mean of both pools combined — the pool with more
 * ratings therefore dominates.
 */
export function computePeerReview(
  episodes: Episode[],
): Record<PeerReviewView["id"], PeerReviewResult> {
  const { practices, machineRoom } = peerReviewPools(episodes);
  return {
    practices: mean(practices),
    machine_room: mean(machineRoom),
    gesamt: mean([...practices, ...machineRoom]),
  };
}
