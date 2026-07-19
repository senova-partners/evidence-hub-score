import type { KpiDef } from "./types";

export const KPIS: KpiDef[] = [
  // Paket 1 — Außenbeweis
  {
    id: "partner_score",
    pkg: "aussenbeweis",
    name: { de: "Partner-Zufriedenheit", en: "Partner satisfaction" },
    unit: "score",
    direction: "higher_is_better",
    info: {
      was: {
        de: "Mittelwert der 5-Fragen-Rückmeldung von Partnerorganisationen nach Beratungsepisode.",
        en: "Mean of 5-question partner feedback after each consulting episode.",
      },
      warum: {
        de: "Direktes Außenurteil, unabhängig von Selbsteinschätzung (Kirkpatrick L1).",
        en: "External judgment, independent of self-assessment (Kirkpatrick L1).",
      },
      wie: { de: "Tokenisierter Einmal-Link, pro Episode.", en: "Tokenised one-time link, per episode." },
      verworfen: {
        de: "NPS: zu grob, kulturell unpassend im arabischen Raum.",
        en: "NPS: too coarse, culturally unfit for the region.",
      },
    },
  },
  {
    id: "uptake",
    pkg: "aussenbeweis",
    name: { de: "Umsetzungs-Quote (6M)", en: "Uptake at 6 months" },
    unit: "%",
    direction: "higher_is_better",
    info: {
      was: {
        de: "Anteil Episoden, deren Empfehlung 6 Monate später umgesetzt oder angepasst umgesetzt wurde.",
        en: "Share of episodes whose recommendation was implemented (or adapted) 6 months later.",
      },
      warum: {
        de: "Härtester verfügbarer Wirkungsproxy — nicht Zufriedenheit, sondern Handlung.",
        en: "Hardest available effect proxy — action, not satisfaction.",
      },
      wie: { de: "Follow-up-Queue, ein Satz Begründung.", en: "Follow-up queue, one-sentence rationale." },
      verworfen: {
        de: "Outcome-Kausalattribution: methodisch nicht sauber leistbar.",
        en: "Full causal outcome attribution: not methodologically defensible.",
      },
    },
  },
  {
    id: "evidenz_count",
    pkg: "aussenbeweis",
    name: { de: "Evidenz-Geschichten", en: "Evidence stories" },
    unit: "count",
    direction: "higher_is_better",
    info: {
      was: {
        de: "Anzahl dokumentierter „wäre letztes Jahr nicht gegangen“-Fälle pro Quartal.",
        en: "Documented „would not have been possible last year“ cases per quarter.",
      },
      warum: {
        de: "Qualitativer Beleg für CLT/BMZ-Kommunikation.",
        en: "Qualitative proof for CLT/BMZ communication.",
      },
      wie: { de: "Evidenzbank-Eintrag: 3 Sätze, Beteiligte, Datum.", en: "Evidenzbank entry: 3 sentences, involved, date." },
      verworfen: {
        de: "Anekdoten ohne Beteiligtenliste — nicht nachprüfbar.",
        en: "Anecdotes without named participants — not verifiable.",
      },
    },
  },
  {
    id: "clt_confidence",
    pkg: "aussenbeweis",
    name: { de: "CLT-Vertrauens-Index", en: "CLT confidence index" },
    unit: "score",
    direction: "higher_is_better",
    info: {
      was: { de: "Quartalsvotum CLT (1–5) zur Verlässlichkeit des Powerhouse.", en: "Quarterly CLT vote (1–5) on Powerhouse reliability." },
      warum: { de: "Interne Legitimation ist Voraussetzung für Ressourcen.", en: "Internal legitimacy is a precondition for resources." },
      wie: { de: "Kurzabfrage in der CLT-Sitzung.", en: "Short poll in the CLT session." },
      verworfen: { de: "360°-Umfragen — Aufwand vs. Erkenntnis unpassend.", en: "360° surveys — cost/insight ratio unsuitable." },
    },
  },

  // Paket 2 — Beratungsqualität
  {
    id: "first_time_right",
    pkg: "beratungsqualitaet",
    name: { de: "First-Time-Right", en: "First-time-right" },
    unit: "%",
    direction: "higher_is_better",
    info: {
      was: { de: "Anteil Werkstücke ohne materiellen Rückläufer im ersten Umlauf.", en: "Share of deliverables without material rework in first cycle." },
      warum: { de: "Qualitäts-Frühindikator; koppelt an Fachzeit-Nutzung.", en: "Early quality indicator; couples to expert-time usage." },
      wie: { de: "AV-Meldung je Werkstück, Peer-Panel-Stichprobe.", en: "AV self-report per deliverable, peer-panel sample." },
      verworfen: { de: "Fehlerzahl pro Dokument — zählt Rauschen mit.", en: "Defect count per document — counts noise." },
    },
  },
  {
    id: "peer_score",
    pkg: "beratungsqualitaet",
    name: { de: "Peer-Fachurteil", en: "Peer expert score" },
    unit: "score",
    direction: "higher_is_better",
    info: {
      was: { de: "Mittelwert Peer-Panel-Bewertung (2 Werkstücke × Cluster × HJ).", en: "Mean peer-panel score (2 deliverables × cluster × half-year)." },
      warum: { de: "Fachurteil, das AV-Selbstbild korrigiert.", en: "Expert judgment that corrects AV self-view." },
      wie: { de: "Zufallsziehung, obligatorischer Begründungssatz.", en: "Random draw, mandatory justification sentence." },
      verworfen: { de: "Ganze Sicht statt Stichprobe — nicht leistbar.", en: "Full census instead of sample — not feasible." },
    },
  },
  {
    id: "practice_usage",
    pkg: "beratungsqualitaet",
    name: { de: "Practice-Nutzung", en: "Practice product usage" },
    unit: "%",
    direction: "higher_is_better",
    info: {
      was: { de: "Anteil Episoden, in denen ein Practice-Produkt genutzt oder adaptiert wurde.", en: "Share of episodes in which a Practice product was used or adapted." },
      warum: { de: "Systematische Wiederverwendung schlägt Einzelkönnen.", en: "Systematic reuse beats individual heroics." },
      wie: { de: "Episoden-Mechanismus-Checkbox.", en: "Episode mechanism checkbox." },
      verworfen: { de: "Downloads/Views: keine Handlungsevidenz.", en: "Downloads/views: no evidence of action." },
    },
  },
  {
    id: "schmerzpunkt",
    pkg: "beratungsqualitaet",
    name: { de: "Schmerzpunkt-Score", en: "Pain-point score" },
    unit: "score",
    direction: "lower_is_better",
    info: {
      was: { de: "Interne Selbstbewertung Reibungspunkte in der Zusammenarbeit (1–5).", en: "Internal self-score of friction points in collaboration (1–5)." },
      warum: { de: "Frühwarnung; sinkt vor Qualitätsverlust.", en: "Early warning; drops before quality does." },
      wie: { de: "Aggregierte Meldung je Team, n ≥ 5.", en: "Aggregated report per team, n ≥ 5." },
      verworfen: { de: "Einzelfeedback — Betriebsrat-inkompatibel.", en: "Individual feedback — incompatible with works council." },
    },
  },

  // Paket 3 — Struktur-Effizienz
  {
    id: "fachzeit",
    pkg: "struktur",
    name: { de: "Fachzeit-Quote", en: "Expert-time share" },
    unit: "%",
    direction: "higher_is_better",
    scharnier: true,
    info: {
      was: { de: "Anteil produktiver Fachzeit an Gesamtarbeitszeit (Team-Aggregat).", en: "Share of productive expert time in total working time (team aggregate)." },
      warum: { de: "Scharnier zwischen Struktur und Qualität: mehr Fachzeit → bessere Werkstücke.", en: "Hinge between structure and quality: more expert time → better deliverables." },
      wie: { de: "Team-Aggregat, keine Einzelverfolgung.", en: "Team aggregate, no individual tracking." },
      verworfen: { de: "Auslastung individuell — Betriebsrat/BMZ nicht tragbar.", en: "Individual utilisation — untenable with works council/BMZ." },
    },
  },
  {
    id: "testvorgang",
    pkg: "struktur",
    name: { de: "Testvorgang", en: "Test procedure" },
    unit: "days",
    direction: "lower_is_better",
    info: {
      was: { de: "Median Kalendertage von Anfrage bis erstem qualifizierten Termin.", en: "Median calendar days from request to first qualified appointment." },
      warum: { de: "Struktur-Effizienz als Zeit, nicht als Kosten.", en: "Structural efficiency as time, not cost." },
      wie: { de: "JDU-Meldung je Anfrage.", en: "JDU report per request." },
      verworfen: { de: "Reaktionszeit-Mittelwert — von Ausreißern verzerrt.", en: "Mean response time — distorted by outliers." },
    },
  },
  {
    id: "eigenleistung",
    pkg: "struktur",
    name: { de: "Eigenleistungs-Quote", en: "In-house delivery share" },
    unit: "%",
    direction: "higher_is_better",
    info: {
      was: { de: "Anteil Beratungsvolumen ohne externe Zukauf-Consultants.", en: "Consulting volume without external consultants." },
      warum: { de: "Kontext für Testvorgang und Fachzeit.", en: "Context for test procedure and expert time." },
      wie: { de: "Finance-Meldung je Quartal.", en: "Finance report per quarter." },
      verworfen: { de: "Overhead-Quote — struktur-fremd, verzerrt.", en: "Overhead ratio — off-topic, distorting." },
    },
  },
  {
    id: "meldetreue",
    pkg: "struktur",
    name: { de: "Meldetreue", en: "Reporting discipline" },
    unit: "%",
    direction: "higher_is_better",
    info: {
      was: { de: "Anteil pünktlich eingereichter Meldebögen je Zyklus.", en: "Share of on-time submissions per cycle." },
      warum: { de: "Ohne Meldedisziplin kein System.", en: "Without reporting discipline, no system." },
      wie: { de: "Automatisch aus Steward-Konsole.", en: "Automatic from steward console." },
      verworfen: { de: "Score „Meldequalität“ — subjektiv.", en: "„Reporting quality“ score — subjective." },
    },
  },
];

export const PKG_LABEL: Record<
  "aussenbeweis" | "beratungsqualitaet" | "struktur",
  { de: string; en: string }
> = {
  aussenbeweis: { de: "Paket 1 — Außenbeweis", en: "Package 1 — External proof" },
  beratungsqualitaet: {
    de: "Paket 2 — Beratungsqualität",
    en: "Package 2 — Advisory quality",
  },
  struktur: { de: "Paket 3 — Struktur-Effizienz", en: "Package 3 — Structural efficiency" },
};

export const kpiById = (id: string) => KPIS.find((k) => k.id === id);
