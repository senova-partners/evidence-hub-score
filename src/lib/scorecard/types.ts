// GIZ Scorecard — types
export type Package = "aussenbeweis" | "beratungsqualitaet" | "struktur";
export type Trend = "up" | "down" | "flat" | "missing";
export type Verdict =
  | "erfuellt"
  | "nicht_erfuellt"
  | "unvollstaendig"
  | "baseline_fehlt";
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

export type KpiFormat = "percent" | "days" | "score" | "delta" | "count";

export interface KpiDef {
  id: string;
  pkg: Package;
  name: { de: string; en: string };
  /** Long-form unit for the Info panel (e.g. "% umgesetzt oder angepasst"). */
  unit: { de: string; en: string };
  /** Short unit rendered on the card next to the value (e.g. "%", "d", "Pkt", "±"). Empty string for no suffix. */
  unitShort: { de: string; en: string };
  /** Numeric formatting hint. */
  format: KpiFormat;
  direction: "higher_better" | "lower_better";
  scharnier?: boolean;
  /** Per-KPI n label, e.g. "n = 14 Episoden". */
  nLabel: { de: string; en: string };
  /** Optional context line — rendered ONLY in the Info panel, never on the card. */
  contextLine?: { de: string; en: string };
  info: {
    was: { de: string; en: string };
    warum: { de: string; en: string };
    wie: { de: string; en: string };
    verworfen?: { de: string; en: string } | null;
  };
  /** If true, this KPI is displayed in the Diagnostik view, not on the Board and not in the Verdict. */
  diagnostik?: boolean;
  /** If set, this KPI's card also shows the referenced KPI as a secondary metric (same card). The referenced KPI is then hidden from the board grid but remains tracked. */
  secondaryKpiId?: string;
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
