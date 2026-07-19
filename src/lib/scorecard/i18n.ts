import type { Locale } from "./types";

type Dict = Record<string, { de: string; en: string }>;

export const T: Dict = {
  app_name: { de: "Expert Powerhouse Scorecard", en: "Expert Powerhouse Scorecard" },
  giz_jordan: { de: "GIZ Jordanien", en: "GIZ Jordan" },
  login_title: { de: "Anmeldung", en: "Sign in" },
  role: { de: "Rolle", en: "Role" },
  pin: { de: "PIN", en: "PIN" },
  cluster: { de: "Cluster", en: "Cluster" },
  sign_in: { de: "Anmelden", en: "Sign in" },
  demo_hint: {
    de: "Demo: PIN 000000 für jede Rolle. Daten liegen nur im Browser.",
    en: "Demo: PIN 000000 for any role. Data lives in the browser only.",
  },
  language: { de: "Sprache", en: "Language" },
  logout: { de: "Abmelden", en: "Sign out" },
  quarter: { de: "Quartal", en: "Quarter" },
  meldetreue_short: { de: "Meldetreue", en: "On-time" },

  // nav
  nav_board: { de: "Beweis Board", en: "Evidence Board" },
  nav_diagnostik: { de: "Diagnostik", en: "Diagnostics" },
  nav_evidenz: { de: "Evidenzbank", en: "Evidence bank" },
  nav_nicht_gemessen: { de: "Nicht gemessen", en: "Not measured" },
  nav_export: { de: "Export", en: "Export" },
  nav_review: { de: "Review", en: "Review" },
  nav_meldung: { de: "Meine Meldung", en: "My report" },
  nav_historie: { de: "Historie", en: "History" },
  nav_episoden: { de: "Episoden", en: "Episodes" },
  nav_uptake: { de: "Uptake", en: "Uptake" },
  nav_closed_loop: { de: "Closed-Loop", en: "Closed-loop" },
  nav_peer: { de: "Peer-Review", en: "Peer review" },
  nav_steward: { de: "Steward-Konsole", en: "Steward console" },
  nav_voraussetzungen: { de: "Voraussetzungen", en: "Preconditions" },

  // verdict
  verdict_erfuellt: { de: "Test erfüllt", en: "Test passed" },
  verdict_nicht: { de: "Test nicht erfüllt", en: "Test not passed" },
  verdict_unvollstaendig: {
    de: "Unvollständig — Meldung fehlt",
    en: "Incomplete — report missing",
  },
  verdict_baseline: { de: "Baseline fehlt", en: "Baseline missing" },
  verdict_rule: {
    de: "Regel: Paket 1–2 steigen, Paket 3 stabil oder besser. Fehlt eine Meldung in Paket 1 oder 2, gilt 'unvollständig'.",
    en: "Rule: Packages 1–2 rise, package 3 stable or better. A missing value in package 1 or 2 counts as 'incomplete'.",
  },

  // kpi card
  vs_baseline: { de: "ggü. Baseline", en: "vs. baseline" },
  missing: { de: "Meldung fehlt", en: "Report missing" },
  flagged: { de: "Plausibilität prüfen", en: "Plausibility check" },
  scharnier: { de: "Scharnier-KPI", en: "Hinge KPI" },
  info: { de: "Info", en: "Info" },
  was_misst: { de: "Was es misst", en: "What it measures" },
  warum: { de: "Warum diese Kennzahl", en: "Why this measure" },
  wie: { de: "Wie verifiziert", en: "How verified" },
  verworfen: { de: "Geprüft und verworfen", en: "Considered and rejected" },
  einheit: { de: "Einheit", en: "Unit" },
  kontext: { de: "Kontext", en: "Context" },
  baseline: { de: "Baseline", en: "Baseline" },
  trend: { de: "Verlauf", en: "Trend" },

  // states
  reported: { de: "gemeldet", en: "reported" },
  on_time: { de: "pünktlich", en: "on time" },
  late: { de: "verspätet", en: "late" },
  status_missing: { de: "fehlt", en: "missing" },

  // forms
  submit: { de: "Meldung abschicken", en: "Submit report" },
  save_draft: { de: "Entwurf speichern", en: "Save draft" },
  n_guard: {
    de: "Aggregat-Meldung erforderlich (n ≥ 5). Einzelwerte sind nicht zulässig.",
    en: "Aggregate report required (n ≥ 5). Individual values not permitted.",
  },
  submitted_ok: { de: "Meldung eingegangen.", en: "Report received." },
  submitted_next: {
    de: "Der Steward konsolidiert; Änderungen nur über den Steward.",
    en: "The steward consolidates; changes only via the steward.",
  },
  deadline: { de: "Frist", en: "Deadline" },

  // partner
  partner_thanks: {
    de: "Danke. Ihre Rückmeldung ist beim Team eingegangen.",
    en: "Thank you. Your feedback has reached the team.",
  },
  partner_title: {
    de: "Rückmeldung zur Beratung",
    en: "Feedback on the advisory episode",
  },
  partner_q1: { de: "Die Beratung war fachlich fundiert.", en: "The advice was substantively sound." },
  partner_q2: { de: "Die Empfehlung war umsetzbar.", en: "The recommendation was actionable." },
  partner_q3: { de: "Die Zusammenarbeit war respektvoll.", en: "The collaboration was respectful." },
  partner_q4: {
    de: "Wir würden erneut mit diesem Team arbeiten.",
    en: "We would work with this team again.",
  },
  partner_q5: {
    de: "Die Beratung hat zu einer Entscheidung geführt.",
    en: "The advice led to a decision.",
  },
  partner_comment: { de: "Kommentar (optional)", en: "Comment (optional)" },
  partner_send: { de: "Absenden", en: "Send" },

  // nicht gemessen
  nm_title: { de: "Nicht gemessen — mit Absicht.", en: "Not measured — deliberately." },
  nm_intro: {
    de: "Was wir bewusst nicht messen, und warum. Ehrlichkeit als Produkteigenschaft.",
    en: "What we deliberately do not measure, and why. Honesty as a product feature.",
  },
};

export const t = (key: string, locale: Locale): string => T[key]?.[locale] ?? key;

export const fmtNumber = (v: number | null, locale: Locale, digits = 0): string => {
  if (v === null || v === undefined || Number.isNaN(v)) return "—";
  return new Intl.NumberFormat(locale === "de" ? "de-DE" : "en-GB", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(v);
};

export const fmtDate = (iso: string, locale: Locale): string => {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(locale === "de" ? "de-DE" : "en-GB").format(d);
};
