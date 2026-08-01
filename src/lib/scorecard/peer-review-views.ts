// Sub-views for the "Peer & Leadership Review" KPI detail page.
//
// Two structural units — Practices and Machine Room — each shown with three
// parallel values side by side. No aggregation, no index: the divergence
// between the three readings is itself the diagnosis.
//
//   1. Peer-Bewertung      — demand side, per episode (Nutzbarkeit 1–5 + Fristentreue %)
//   2. Leadership-Bewertung — bi-annual assessment by PFM/LD and the CCs (1–5)
//   3. Schmerzpunkt-Wiedervorlage — the reach-in pain-point list, re-rated (1 solved – 5 unchanged)

import type { HistoryPoint } from "./history";
import type { Bi } from "./i18n";
import type { Episode, LeadershipAssessment, PainPointReview } from "./types";

export interface PeerReviewView {
  id: "practices" | "machine_room";
  label: Bi;
  definition: Bi;
  baseline: number;
  /** History of the peer usability value; the current quarter is appended at render time. */
  history: HistoryPoint[];
  workedExample: Bi;
}

export const PEER_REVIEW_VIEWS: PeerReviewView[] = [
  {
    id: "practices",
    label: { de: "Practices", en: "Practices" },
    definition: {
      de: "Drei parallele Sichten auf die Practices: Nutzbarkeit und Fristentreue aus den Episoden, Leadership-Bewertung von PFM/LD und CCs, Schmerzpunkt-Wiedervorlage.",
      en: "Three parallel views of the practices: usability and deadline reliability from the episodes, leadership assessment by PFM/LD and the CCs, pain-point re-review.",
    },
    baseline: 3.6,
    history: [
      { period: "2026-Q1", value: 3.6 },
      { period: "2026-Q2", value: 3.9 },
    ],
    workedExample: {
      de: "Summe der Practice-Bewertungen ÷ Anzahl der Practice-Bewertungen; Fristentreue = eingehaltene Fristen ÷ bewertete Leistungen",
      en: "sum of practice ratings ÷ number of practice ratings; deadline reliability = deadlines met ÷ rated deliverables",
    },
  },
  {
    id: "machine_room",
    label: { de: "Machine Room", en: "Machine Room" },
    definition: {
      de: "Drei parallele Sichten auf den Machine Room: Nutzbarkeit und Fristentreue aus den Episoden, Leadership-Bewertung von PFM/LD und CCs, Schmerzpunkt-Wiedervorlage.",
      en: "Three parallel views of the machine room: usability and deadline reliability from the episodes, leadership assessment by PFM/LD and the CCs, pain-point re-review.",
    },
    baseline: 3.0,
    history: [
      { period: "2026-Q1", value: 3.0 },
      { period: "2026-Q2", value: 3.1 },
    ],
    workedExample: {
      de: "Summe der Machine-Room-Bewertungen ÷ Anzahl der Machine-Room-Bewertungen; Fristentreue = eingehaltene Fristen ÷ bewertete Zuarbeiten",
      en: "sum of machine room ratings ÷ number of machine room ratings; deadline reliability = deadlines met ÷ rated contributions",
    },
  },
];

/**
 * Leadership assessment — NEW data model. Bi-annual rating (1–5) per
 * structural unit by PFM/LD and the Cluster Coordinators. Demo data.
 */
export const LEADERSHIP_ASSESSMENTS: LeadershipAssessment[] = [
  { unit: "practices", period: "2026-H1", assessor: "PFM/LD", rating: 4 },
  { unit: "practices", period: "2026-H1", assessor: "CC Governance", rating: 3 },
  { unit: "practices", period: "2026-H1", assessor: "CC Klima", rating: 4 },
  { unit: "machine_room", period: "2026-H1", assessor: "PFM/LD", rating: 3 },
  { unit: "machine_room", period: "2026-H1", assessor: "CC Governance", rating: 3 },
  { unit: "machine_room", period: "2026-H1", assessor: "CC Wirtschaft", rating: 2 },
];

/**
 * Pain-point re-review — the reach-in list, re-rated one year later per unit
 * on a 1 (solved) – 5 (unchanged) scale. Demo data.
 */
export const PAIN_POINT_REVIEWS: PainPointReview[] = [
  { unit: "practices", cluster: "Governance", rating: 2.4 },
  { unit: "practices", cluster: "Klima", rating: 2.8 },
  { unit: "practices", cluster: "Wirtschaft", rating: 3.0 },
  { unit: "machine_room", cluster: "Governance", rating: 3.2 },
  { unit: "machine_room", cluster: "Klima", rating: 3.4 },
  { unit: "machine_room", cluster: "Wirtschaft", rating: 3.1 },
];

export interface PeerReviewResult {
  /** Peer usability mean (1–5) — the leading value of the sub-tab. */
  value: number | null;
  n: number;
  sum: number;
  /** Share of rated deliverables that met their deadline, in percent. */
  fristentreue: number | null;
  fristentreueN: number;
  /** Leadership assessment mean (1–5). */
  leadership: number | null;
  leadershipN: number;
  /** Pain-point re-review mean (1 solved – 5 unchanged). */
  schmerzpunkt: number | null;
  schmerzpunktN: number;
}

const round2 = (x: number) => Math.round(x * 100) / 100;

function mean(values: number[]): number | null {
  if (values.length === 0) return null;
  return round2(values.reduce((a, b) => a + b, 0) / values.length);
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

function deadlinePool(episodes: Episode[], unit: PeerReviewView["id"]): boolean[] {
  const out: boolean[] = [];
  for (const e of episodes) {
    const rated =
      unit === "practices"
        ? typeof e.usability?.practice === "number"
        : typeof e.usability?.machineRoom === "number";
    if (!rated) continue;
    const met =
      unit === "practices" ? e.usability?.practiceDeadlineMet : e.usability?.machineRoomDeadlineMet;
    if (typeof met === "boolean") out.push(met);
  }
  return out;
}

function resultFor(episodes: Episode[], unit: PeerReviewView["id"]): PeerReviewResult {
  const pools = peerReviewPools(episodes);
  const ratings = unit === "practices" ? pools.practices : pools.machineRoom;
  const deadlines = deadlinePool(episodes, unit);
  const leadership = LEADERSHIP_ASSESSMENTS.filter((a) => a.unit === unit).map((a) => a.rating);
  const pain = PAIN_POINT_REVIEWS.filter((p) => p.unit === unit).map((p) => p.rating);

  return {
    value: mean(ratings),
    n: ratings.length,
    sum: ratings.reduce((a, b) => a + b, 0),
    fristentreue:
      deadlines.length === 0
        ? null
        : Math.round((deadlines.filter(Boolean).length / deadlines.length) * 100),
    fristentreueN: deadlines.length,
    leadership: mean(leadership),
    leadershipN: leadership.length,
    schmerzpunkt: mean(pain),
    schmerzpunktN: pain.length,
  };
}

/** Per-view results over the given episodes — three parallel values, no index. */
export function computePeerReview(
  episodes: Episode[],
): Record<PeerReviewView["id"], PeerReviewResult> {
  return {
    practices: resultFor(episodes, "practices"),
    machine_room: resultFor(episodes, "machine_room"),
  };
}
