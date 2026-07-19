// Simple typed localStorage store with pub/sub for React
import { useEffect, useState } from "react";
import type {
  ChangeLogEntry,
  ClosedLoopItem,
  Episode,
  EvidenzStory,
  KpiValue,
  Locale,
  PeerDraw,
  Role,
  Submission,
} from "./types";
import { KPIS } from "./kpis";

export const QUARTERS = ["2026-Q1", "2026-Q2", "2026-Q3"] as const;
export const BASELINE_QUARTER = "2026-Q1";
export const CURRENT_QUARTER = "2026-Q3";
export const CLUSTERS = ["Governance", "Klima", "Wirtschaft", "Bildung"] as const;

export interface Session {
  role: Role;
  cluster?: string;
  locale: Locale;
  quarter: string;
}

export interface Store {
  session: Session | null;
  // KPI values keyed by kpiId then quarter
  values: Record<string, Record<string, KpiValue>>;
  baselines: Record<string, number>;
  submissions: Submission[];
  episodes: Episode[];
  peerDraws: PeerDraw[];
  closedLoop: ClosedLoopItem[];
  evidenz: EvidenzStory[];
  changeLog: ChangeLogEntry[];
  reviewNotes: Record<string, string>; // halfYear -> text
  lockedQuarters: string[];
  voraussetzungen: Record<string, "offen" | "definiert" | "eingefuehrt">;
}

const KEY = "giz-scorecard-v10";
type Listener = () => void;
const listeners = new Set<Listener>();

let state: Store = load();

function load(): Store {
  if (typeof window === "undefined") return seed();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      const s = seed();
      window.localStorage.setItem(KEY, JSON.stringify(s));
      return s;
    }
    return JSON.parse(raw) as Store;
  } catch {
    return seed();
  }
}

function persist() {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  }
  listeners.forEach((l) => l());
}

export function getStore(): Store {
  return state;
}

export function setStore(updater: (s: Store) => Store) {
  state = updater(state);
  persist();
}

export function subscribe(l: Listener) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useStore<T>(selector: (s: Store) => T): T {
  const [v, setV] = useState(() => selector(state));
  useEffect(() => {
    const unsub = subscribe(() => setV(selector(state)));
    setV(selector(state));
    return () => {
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return v;
}

export function resetDemo() {
  state = seed();
  persist();
}

// ---------------- seed ----------------
function seed(): Store {
  // Baselines und Q3-Werte aus dem KPI-Config v1.0.
  // Baselines = 2026-Q3 baseline values from KPI-Config v1.0.
  const baselines: Record<string, number> = {
    wiederbeauftragung: 48,
    kofi_proposal: 31,
    partnerfeedback_jahr: 0,
    delivery_quote: 78,
    partnerbogen: 3.6,
    uptake: 42,
    peer_review: 2.9,
    mechanismus: 34,
    fachzeit: 66,
    inhouse_beratungsquote: 40,
    berater_vze_anteil: 58,
    testvorgang: 21,
    abflusstreue: 84,
    schmerzpunkt: 3.2,
  };
  // Quarterly trend for demo purposes; Q3 = current per KPI-Config v1.0.
  const trends: Record<string, [number, number, number]> = {
    wiederbeauftragung: [48, 51, 54],
    kofi_proposal: [31, 42, 54],
    partnerfeedback_jahr: [0, 2, 5],
    delivery_quote: [78, 79, 80],
    partnerbogen: [3.6, 3.7, 3.9],
    uptake: [42, 48, 55],
    peer_review: [2.9, 3.1, 3.2],
    mechanismus: [34, 42, 50],
    fachzeit: [66, 69, 72],
    inhouse_beratungsquote: [64, 65, 67],
    berater_vze_anteil: [58, 59, 61],
    testvorgang: [21, 19, 17],
    abflusstreue: [84, 86, 89],
    schmerzpunkt: [3.2, 3.0, 2.7],
  };
  const nCounts: Record<string, number> = {
    wiederbeauftragung: 28,
    kofi_proposal: 21,
    partnerfeedback_jahr: 10,
    delivery_quote: 0,
    partnerbogen: 14,
    uptake: 11,
    peer_review: 6,
    mechanismus: 14,
    fachzeit: 9,
    inhouse_beratungsquote: 0,
    berater_vze_anteil: 0,
    testvorgang: 1,
    abflusstreue: 0,
    schmerzpunkt: 3,
  };
  const values: Store["values"] = {};
  for (const k of KPIS) {
    values[k.id] = {};
    QUARTERS.forEach((q, i) => {
      values[k.id][q] = {
        quarter: q,
        value: trends[k.id][i],
        reported: true,
        n: nCounts[k.id],
      };
    });
  }
  // Peer-Review liegt in Q3 nicht vor — löst "unvollständig — Meldung fehlt" aus.
  values.peer_review[CURRENT_QUARTER] = {
    quarter: CURRENT_QUARTER,
    value: null,
    reported: false,
  };

  const episodes: Episode[] = [
    {
      id: "EP-2026-0142",
      cluster: "Governance",
      partner: "Ministry of Local Administration",
      closeDate: "2026-06-14",
      mechanisms: { practiceUsed: true, mrContributed: true },
      partnerToken: "tok-142",
      partnerResponse: {
        submittedAt: "2026-06-20",
        scores: { q1: 4, q2: 5, q3: 5, q4: 4, q5: 4 },
        comment: "Sehr strukturierter Ablauf.",
      },
      uptake: { status: "umgesetzt", note: "Empfehlung in Kabinettsvorlage aufgenommen.", at: "2026-12-10" },
    },
    {
      id: "EP-2026-0158",
      cluster: "Klima",
      partner: "Ministry of Environment",
      closeDate: "2026-07-02",
      mechanisms: { practiceUsed: true, mrContributed: false },
      partnerToken: "tok-158",
      partnerResponse: {
        submittedAt: "2026-07-10",
        scores: { q1: 4, q2: 3, q3: 5, q4: 4, q5: 3 },
        comment: "Zeitplan war knapp.",
      },
    },
    {
      id: "EP-2026-0167",
      cluster: "Wirtschaft",
      partner: "Chamber of Commerce",
      closeDate: "2026-08-19",
      mechanisms: { practiceUsed: false, mrContributed: true },
      partnerToken: "tok-167",
    },
    {
      id: "EP-2026-0171",
      cluster: "Bildung",
      partner: "Ministry of Education",
      closeDate: "2026-09-05",
      mechanisms: { practiceUsed: true, mrContributed: true },
      partnerToken: "tok-171",
    },
  ];

  const submissions: Submission[] = [
    {
      id: "s1",
      role: "av",
      cluster: "Governance",
      quarter: CURRENT_QUARTER,
      values: { partnerbogen: 3.9, uptake: 55, mechanismus: 48 },
      submittedAt: "2026-09-28T10:00:00Z",
      deadline: "2026-09-30",
      status: "on_time",
    },
    {
      id: "s2",
      role: "jdu",
      quarter: CURRENT_QUARTER,
      values: { wiederbeauftragung: 54, kofi_proposal: 54, partnerfeedback_jahr: 5 },
      submittedAt: "2026-10-02T09:00:00Z",
      deadline: "2026-09-30",
      status: "late",
    },
    {
      id: "s3",
      role: "steward",
      quarter: CURRENT_QUARTER,
      values: { testvorgang: 17 },
      submittedAt: "2026-09-29T14:00:00Z",
      deadline: "2026-09-30",
      status: "on_time",
    },
    {
      id: "s4",
      role: "finance",
      quarter: CURRENT_QUARTER,
      values: { delivery_quote: 80, abflusstreue: 89 },
      submittedAt: "2026-09-30T16:00:00Z",
      deadline: "2026-09-30",
      status: "on_time",
    },
    {
      id: "s5",
      role: "bt3",
      quarter: CURRENT_QUARTER,
      values: { fachzeit: 72, schmerzpunkt: 2.7 },
      submittedAt: "2026-09-27T11:00:00Z",
      deadline: "2026-09-30",
      status: "on_time",
    },
    {
      id: "s6",
      role: "panel",
      quarter: CURRENT_QUARTER,
      values: { peer_review: null },
      submittedAt: null,
      deadline: "2026-09-30",
      status: "missing",
    },
  ];

  const evidenz: EvidenzStory[] = [
    {
      id: "e1",
      quarter: CURRENT_QUARTER,
      cluster: "Governance",
      sentences:
        "Ein Practice-Baustein aus dem Cluster Klima ersetzte drei Wochen Individualarbeit. Der Partner nahm die Empfehlung ins Kabinett. Ohne den Baustein wäre der Termin nicht gehalten worden.",
      involved: "Cluster Governance, Practice Governance, JDU",
      savingEur: 18000,
      date: "2026-08-15",
    },
    {
      id: "e2",
      quarter: CURRENT_QUARTER,
      cluster: "Bildung",
      sentences:
        "Zwei Beratungsepisoden nutzten dieselbe Kurzanalyse. Der zweite Turn dauerte 40 % weniger. Vor der Powerhouse-Struktur wäre die Arbeit doppelt gemacht worden.",
      involved: "Cluster Bildung, Practice Bildung",
      savingEur: 9500,
      date: "2026-09-01",
    },
  ];

  const closedLoop: ClosedLoopItem[] = [
    {
      id: "cl1",
      episodeId: "EP-2026-0158",
      reason: "Frage 2 unter Schwelle (3/5)",
      owner: "AV Klima",
      dueDate: "2026-07-24",
      status: "open",
    },
  ];

  const peerDraws: PeerDraw[] = [
    {
      id: "p1",
      halfYear: "2026-H1",
      cluster: "Governance",
      episodeId: "EP-2026-0142",
      scores: { evidenzbasis: 4, problemschaerfe: 3, kontextpassung: 4, umsetzbarkeit: 4, klarheit: 5 },
      justification: "Klare Struktur, belastbare Datengrundlage.",
    },
  ];

  const changeLog: ChangeLogEntry[] = [
    {
      id: "cl-1",
      at: "2026-09-28T10:00:00Z",
      role: "av",
      field: "uptake",
      from: "48",
      to: "55",
    },
  ];

  return {
    session: null,
    values,
    baselines,
    submissions,
    episodes,
    peerDraws,
    closedLoop,
    evidenz,
    changeLog,
    reviewNotes: {},
    lockedQuarters: [],
    voraussetzungen: {
      episode_definition: "offen",
      budget_trennung: "offen",
      struktur_beteiligung_erfassung: "offen",
      rollen_taxonomie: "offen",
    },
  };
}
