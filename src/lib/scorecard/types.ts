// GIZ Scorecard — types
export type Package = "aussenbeweis" | "beratungsqualitaet" | "struktur";
export type Trend = "up" | "down" | "flat" | "missing";
export type Verdict = "erfuellt" | "nicht_erfuellt" | "baseline_fehlt";
export type Locale = "de" | "en";

export type Role =
  | "clt"
  | "aoa"
  | "cc"
  | "steward"
  | "av"
  | "practice"
  | "jdu"
  | "finance"
  | "bt3"
  | "panel";

export interface KpiValue {
  quarter: string; // e.g. "2026-Q1"
  value: number | null;
  n?: number;
  reported: boolean;
  flagged?: boolean;
}

export interface KpiDef {
  id: string;
  pkg: Package;
  name: { de: string; en: string };
  unit: "%" | "days" | "score" | "count" | "ratio";
  direction: "higher_is_better" | "lower_is_better";
  scharnier?: boolean;
  info: {
    was: { de: string; en: string };
    warum: { de: string; en: string };
    wie: { de: string; en: string };
    verworfen: { de: string; en: string };
  };
}

export interface Episode {
  id: string;
  cluster: string;
  partner: string;
  closeDate: string; // ISO
  mechanisms: { practiceUsed: boolean; mrContributed: boolean };
  partnerToken: string;
  partnerResponse?: {
    submittedAt: string;
    scores: Record<string, number>;
    comment: string;
  };
  uptake?: {
    status: "umgesetzt" | "angepasst" | "nicht_genutzt";
    note: string;
    at: string;
  };
}

export interface PeerDraw {
  id: string;
  halfYear: string; // "2026-H1"
  cluster: string;
  episodeId: string;
  scores?: Record<string, number>;
  justification?: string;
}

export interface ClosedLoopItem {
  id: string;
  episodeId: string;
  reason: string;
  owner: string;
  dueDate: string;
  status: "open" | "closed";
}

export interface EvidenzStory {
  id: string;
  quarter: string;
  cluster: string;
  sentences: string;
  involved: string;
  savingEur?: number;
  date: string;
}

export interface Submission {
  id: string;
  role: Role;
  cluster?: string;
  quarter: string;
  values: Record<string, number | null>;
  submittedAt: string | null;
  deadline: string;
  status: "on_time" | "late" | "missing" | "draft";
}

export interface ChangeLogEntry {
  id: string;
  at: string;
  role: Role;
  field: string;
  from: string;
  to: string;
}
