import type { Locale } from "./types";

/** A bilingual string. Every user-visible piece of content uses this shape. */
export interface Bi {
  de: string;
  en: string;
}

type Dict = Record<string, Bi>;

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
  pin_wrong: { de: "PIN falsch.", en: "Incorrect PIN." },
  language: { de: "Sprache", en: "Language" },
  logout: { de: "Abmelden", en: "Sign out" },
  quarter: { de: "Quartal", en: "Quarter" },
  meldetreue_short: { de: "Meldetreue", en: "On-time" },
  reset_demo: { de: "Demodaten zurücksetzen?", en: "Reset demo data?" },
  reset_demo_title: { de: "Demo zurücksetzen", en: "Reset demo" },
  aggregate_note: {
    de: "Nur Aggregate (n ≥ 5). Personenbezogene Werte werden nicht gezeigt.",
    en: "Aggregate only (n ≥ 5). Person-level values are not shown.",
  },

  // generic UI
  ui_save: { de: "Speichern", en: "Save" },
  ui_cancel: { de: "Abbrechen", en: "Cancel" },
  ui_edit: { de: "Bearbeiten", en: "Edit" },
  ui_create: { de: "Anlegen", en: "Create" },
  ui_open: { de: "öffnen", en: "open" },
  ui_search: { de: "Suchen", en: "Search" },
  ui_close: { de: "Schließen", en: "Close" },
  ui_unknown_kpi: { de: "Unbekannte Kennzahl.", en: "Unknown KPI." },
  ui_invalid_link: { de: "Der Link ist ungültig.", en: "Link is not valid." },

  // table columns
  col_kpi: { de: "KPI", en: "KPI" },
  col_role: { de: "Rolle", en: "Role" },
  col_time: { de: "Zeit", en: "Time" },
  col_field: { de: "Feld", en: "Field" },
  col_old_new: { de: "alt → neu", en: "old → new" },
  col_quarter: { de: "Quartal", en: "Quarter" },
  col_values: { de: "Werte", en: "Values" },
  col_received: { de: "Eingang", en: "Received" },
  col_status: { de: "Status", en: "Status" },
  col_trend: { de: "Trend", en: "Trend" },
  col_episode: { de: "Episode", en: "Episode" },
  col_reason: { de: "Grund", en: "Reason" },
  col_owner: { de: "Owner", en: "Owner" },
  col_due: { de: "Frist", en: "Deadline" },
  col_id: { de: "ID", en: "ID" },
  col_partner: { de: "Partner", en: "Partner" },
  col_close: { de: "Abschluss", en: "Close" },
  col_practice: { de: "Practice", en: "Practice" },
  col_mr: { de: "MR", en: "MR" },
  col_partner_link: { de: "Partner-Link", en: "Partner link" },
  col_response: { de: "Antwort", en: "Response" },

  // nav
  nav_board: { de: "Performance Board", en: "Performance Board" },
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
    de: "Regel: Paket 1 und 2 steigen, Paket 3 stabil oder besser. Fehlt eine Meldung in Paket 1 oder 2, gilt 'unvollständig'.",
    en: "Rule: packages 1 and 2 rise, package 3 stable or better. A missing value in package 1 or 2 counts as 'incomplete'.",
  },
  verdict_short_erfuellt: { de: "Erfüllt", en: "Passed" },
  verdict_short_nicht: { de: "Nicht erfüllt", en: "Not passed" },

  // kpi card
  vs_baseline: { de: "ggü. Baseline", en: "vs. baseline" },
  since_baseline: { de: "seit Baseline", en: "since baseline" },
  last_round: { de: "Letzte Runde", en: "Last round" },
  peer_session_hint: { de: "Session 15.07.", en: "Session 15 Jul" },
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
  status_draft: { de: "Entwurf", en: "draft" },

  // forms
  submit: { de: "Meldung abschicken", en: "Submit report" },
  save_draft: { de: "Entwurf speichern", en: "Save draft" },
  n_guard: {
    de: "Aggregat-Meldung erforderlich (n ≥ 5). Einzelwerte sind nicht zulässig.",
    en: "Aggregate report required (n ≥ 5). Individual values not permitted.",
  },
  n_field_label: { de: "n (Aggregatgröße)", en: "n (aggregate size)" },
  submitted_ok: { de: "Meldung eingegangen.", en: "Report received." },
  submitted_next: {
    de: "Der Steward konsolidiert; Änderungen nur über den Steward.",
    en: "The steward consolidates; changes only via the steward.",
  },
  deadline: { de: "Frist", en: "Deadline" },
  meldung_none_required: {
    de: "Für Ihre Rolle ist in diesem Zyklus keine Meldung erforderlich.",
    en: "No report required for your role this cycle.",
  },

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

  // diagnostik
  dg_intro: {
    de: "Nur Abweichungen. Kontext-Zeilen zeigen, wo der Test klemmt.",
    en: "Deviations only. Context rows show where the test clamps.",
  },
  dg_tag: { de: "Diagnostik · kein Beweis-KPI", en: "Diagnostic · not a proof KPI" },
  dg_process_context: { de: "Prozess-Kontext", en: "Process context" },
  dg_no_deviations: {
    de: "Keine Abweichungen in diesem Quartal.",
    en: "No deviations this quarter.",
  },
  dg_declined: { de: "verschlechtert", en: "declined" },
  dg_pipeline_title: {
    de: "Akquise-Pipeline (EU & Drittmittel)",
    en: "Acquisition pipeline (EU & third-party)",
  },
  dg_pipeline_intro: {
    de: "Erklärt KPI 2. Stagniert der Proposal-Erfolg, zeigt der Trichter, ob es am Anfang (keine Leads: Foresight-Problem) oder an der Konversion (Kapazität/Qualität) hakt. Bewusst kein Zielwert auf Stage 1 — Leads kosten nichts.",
    en: "Explains KPI 2. If proposal success stalls, the funnel shows whether the bottleneck is at the top (no leads: foresight problem) or in conversion (capacity/quality). Deliberately no target on stage 1 — leads are cheap.",
  },
  dg_hygiene: {
    de: "Hygiene: Leads ohne Bewegung seit 2 Quartalen werden aktiv geschlossen — sonst verfettet Stage 1 und die Sicht lügt.",
    en: "Hygiene: leads with no movement for 2 quarters are actively closed — otherwise stage 1 bloats and the view lies.",
  },
  dg_conv_1_2: { de: "Konversion 1 → 2", en: "Conversion 1 → 2" },
  dg_conv_2_3: { de: "Konversion 2 → 3", en: "Conversion 2 → 3" },
  dg_stage: { de: "Stage", en: "Stage" },
  dg_volume_short: { de: "Vol.", en: "vol." },
  dg_count_short: { de: "Anz.", en: "count" },
  mio_eur: { de: "Mio €", en: "EUR m" },

  // kpi detail
  d_missing_headline: { de: "✕ Meldung fehlt", en: "✕ Report missing" },
  d_missing_detail_config: { de: "Detail-Konfiguration", en: "detail configuration" },
  d_missing_history: { de: "Verlaufsdaten", en: "trend data" },
  d_missing_prefix: { de: "Für", en: "For" },
  d_missing_body: {
    de: "liegen noch keine {missing} vor. Sobald die Meldung eingeht, erscheinen hier Verlauf, Erhebung, Rohdaten und Berechnung.",
    en: "there is no {missing} yet. As soon as the report arrives, trend, collection, raw data and calculation appear here.",
  },
  d_and: { de: "und", en: "and" },
  d_voraussetzung: { de: "Voraussetzung", en: "Precondition" },
  sec_verlauf: { de: "Verlauf", en: "Trend" },
  sec_erhebung: { de: "Erhebung", en: "Data collection" },
  sec_rohdaten: { de: "Rohdaten", en: "Raw data" },
  sec_berechnung: { de: "Berechnung", en: "Calculation" },
  f_owner: { de: "Wer erhebt", en: "Who collects" },
  f_when: { de: "Wann", en: "When" },
  f_method: { de: "Wie (Methode)", en: "How (method)" },
  f_verification: { de: "Verifizierung (Prüfregel)", en: "Verification (check rule)" },
  d_counts: { de: "Zählung", en: "Counts" },
  d_formula: { de: "Formel", en: "Formula" },
  d_worked_example: { de: "Rechenweg", en: "Worked example" },
  mech_views_label: { de: "Mechanismus-Sichten", en: "Mechanism views" },
  kofi_views_label: { de: "Kofinanzierungs-Sichten", en: "Co-financing views" },
  pipe_title: {
    de: "Vorlaufende Diagnostik — Akquise-Pipeline",
    en: "Leading diagnostics — acquisition pipeline",
  },
  pipe_link: { de: "Zur Pipeline →", en: "To the pipeline →" },
  pipe_intro: {
    de: "Getrennt bewertet, verbunden navigiert: Stagniert der Proposal-Erfolg, zeigt der Trichter, ob es am Anfang klemmt (wenige Leads → Foresight-Problem) oder an der Konversion (viele Leads, wenige formalisiert → Kapazität oder Proposal-Qualität).",
    en: "Assessed separately, navigated together: if proposal success stalls, the funnel shows whether the bottleneck is at the top (few leads → foresight problem) or in conversion (many leads, few formalised → capacity or proposal quality).",
  },
  pipe_s1: { de: "1 · Identifiziert", en: "1 · Identified" },
  pipe_s2: { de: "2 · Formalisiert", en: "2 · Formalised" },
  pipe_s3: { de: "3 · Beauftragt", en: "3 · Contracted" },
  pipe_leads: { de: "Leads", en: "leads" },
  pipe_contracts: { de: "Verträge", en: "contracts" },
  pipe_of_which_eu: { de: "davon EU", en: "of which EU" },
  pipe_conv_volume: { de: "Konversion Volumen", en: "Conversion by volume" },
  pipe_stage1: { de: "1 · Identifiziert", en: "1 · Identified" },
  pipe_stage2: { de: "2 · Formalisiert", en: "2 · Formalised" },
  pipe_stage3: { de: "3 · Beauftragt", en: "3 · Commissioned" },
  ctx_fachzeit: {
    de: "Drei Währungen derselben Freisetzung: Zeit · Substanz · Geld — drei Rechenwege, kein Index.",
    en: "Three currencies of the same release: time · substance · money — three calculations, no composite index.",
  },

  // steward
  st_title: { de: "Steward-Konsole", en: "Steward console" },
  st_locked: { de: "gesperrt", en: "locked" },
  st_open: { de: "offen", en: "open" },
  st_unlock: { de: "Freigeben", en: "Unlock" },
  st_lock: { de: "Quartal sperren", en: "Lock quarter" },
  st_tab_submissions: { de: "Meldungen", en: "Submissions" },
  st_tab_flags: { de: "Auffälligkeiten", en: "Flags" },
  st_tab_log: { de: "Änderungsprotokoll", en: "Change log" },
  st_tab_baseline: { de: "Baselines", en: "Baselines" },
  st_no_flags: { de: "Keine Plausibilitäts-Auffälligkeiten.", en: "No plausibility flags." },
  st_flag_jump: {
    de: "✕ > 30 % Sprung — Query erforderlich",
    en: "✕ > 30 % jump — query required",
  },

  // evidenzbank
  ev_intro: {
    de: "„Wäre letztes Jahr nicht gegangen“ — dokumentierte Fälle je Cluster.",
    en: "“Would not have been possible last year” — documented cases per cluster.",
  },
  ev_sentences_placeholder: { de: "3 Sätze", en: "3 sentences" },
  ev_involved_placeholder: { de: "Beteiligte", en: "People involved" },
  ev_saving_placeholder: { de: "Ersparnis (EUR, optional)", en: "Saving (EUR, optional)" },

  // episoden
  ep_title: { de: "Episoden", en: "Episodes" },
  ep_intro: {
    de: "Beratungsepisoden — Basis für Partnerbogen, Uptake, Peer-Review.",
    en: "Advisory episodes — basis for partner form, uptake, peer review.",
  },
  ep_new: { de: "Episode", en: "Episode" },
  ep_partner_placeholder: { de: "Partnerorganisation", en: "Partner organisation" },
  ep_pending: { de: "offen", en: "pending" },

  // uptake
  up_title: { de: "Uptake-Follow-up", en: "Uptake follow-up" },
  up_intro: {
    de: "6-Monats-Nachfrage: umgesetzt / angepasst / nicht genutzt + ein Satz.",
    en: "6-month follow-up: implemented / adapted / not used + one sentence.",
  },
  up_open: { de: "Offen", en: "Open" },
  up_none_open: { de: "Keine offenen Nachfragen.", en: "No open follow-ups." },
  up_done: { de: "Abgeschlossen", en: "Completed" },
  up_closed_on: { de: "geschlossen", en: "closed" },
  up_status_umgesetzt: { de: "umgesetzt", en: "implemented" },
  up_status_angepasst: { de: "angepasst", en: "adapted" },
  up_status_nicht_genutzt: { de: "nicht genutzt", en: "not used" },
  up_note_placeholder: { de: "Ein Satz", en: "One sentence" },

  // closed loop
  cl_title: { de: "Closed-Loop-Tracker", en: "Closed-loop tracker" },
  cl_intro: {
    de: "Jedes Partnerurteil unter Schwelle erzeugt eine Nachfrage. Frist: 14 Tage.",
    en: "Every partner score below threshold creates a follow-up. Deadline: 14 days.",
  },
  cl_close_action: { de: "○ offen — schließen", en: "○ open — close" },
  cl_closed: { de: "● geschlossen", en: "● closed" },

  // review
  rv_intro: {
    de: "Drei stehende Fragen. Anmerkungen bleiben je Halbjahr erhalten.",
    en: "Three standing questions. Notes persist per half-year.",
  },
  rv_placeholder: { de: "Beobachtung notieren", en: "Note observation" },
  rv_q1: {
    de: "Wo hält der Test — wo nicht?",
    en: "Where does the test hold — where not?",
  },
  rv_q2: {
    de: "Welche Muster über Cluster hinweg sind neu?",
    en: "Which cross-cluster patterns are new?",
  },
  rv_q3: {
    de: "Welche Kennzahl braucht die nächste Interpretationsrunde?",
    en: "Which measure needs the next interpretation round?",
  },

  // peer review
  pr_title: { de: "Peer-Review", en: "Peer review" },
  pr_intro: {
    de: "Zufallsziehung 2 Werkstücke × Cluster × Halbjahr. Bewertung mit Begründung.",
    en: "Random draw of 2 deliverables × cluster × half-year. Score with justification.",
  },
  pr_draw: { de: "Ziehung starten", en: "Draw" },
  pr_rate: { de: "bewerten", en: "rate" },
  pr_edit: { de: "bearbeiten", en: "edit" },
  pr_crit_fachlich: { de: "fachlich", en: "substance" },
  pr_crit_klarheit: { de: "Klarheit", en: "clarity" },
  pr_crit_umsetzbarkeit: { de: "Umsetzbarkeit", en: "feasibility" },
  pr_justification_placeholder: {
    de: "Begründung (Pflicht)",
    en: "Justification (required)",
  },

  // historie
  hist_title: { de: "Historie", en: "History" },

  // export / snapshot
  ex_title: { de: "Snapshot", en: "Snapshot" },
  ex_intro: {
    de: "Eine A4-Seite quer für CLT/AoA.",
    en: "One A4 landscape page for CLT/AoA.",
  },
  ex_print: { de: "Drucken / PDF", en: "Print / PDF" },
  ex_verdict: { de: "Verdict", en: "Verdict" },
  ex_footer: {
    de: "Person-Ebene wird nicht gezeigt. Aggregate nur ab n ≥ 5. Fehlende Werte werden nicht geschätzt.",
    en: "Person-level data is not shown. Aggregates only for n ≥ 5. Missing values are never interpolated.",
  },

  // voraussetzungen
  vr_eyebrow: {
    de: "Vor der Baseline zu schaffen",
    en: "To be established before baseline",
  },
  vr_title: {
    de: "Strukturelle Voraussetzungen der Messung",
    en: "Structural preconditions of measurement",
  },
  vr_intro: {
    de: "Ohne diese Voraussetzungen ist die Baseline nicht erhebbar. Zugleich die ersten konkreten Mandate des Daten-Büros (DAIO) aus dem Messgerüst.",
    en: "Without these preconditions the baseline cannot be established. They are also the first concrete mandates for the data office (DAIO) from the measurement framework.",
  },
  vr_owner: { de: "Verantwortlich", en: "Owner" },
  vr_affects: { de: "Betrifft KPIs", en: "Affects KPIs" },
  vr_revision_title: { de: "Revisions-Referenz", en: "Audit reference" },
  vr_report: { de: "Bericht", en: "Report" },
  vr_measure: { de: "Maßnahme", en: "Measure" },
  vr_deadline: { de: "Frist", en: "Deadline" },
  vr_assessment: { de: "Einordnung", en: "Assessment" },
  vr_status_offen: { de: "offen", en: "open" },
  vr_status_definiert: { de: "definiert", en: "defined" },
  vr_status_eingefuehrt: { de: "eingeführt", en: "rolled out" },
};

/**
 * Translate a dictionary key. Unknown keys and missing English fall back to
 * German (never to the raw key) so a forgotten translation degrades
 * gracefully instead of leaking identifiers into the UI.
 */
export const t = (key: string, locale: Locale): string => {
  const entry = T[key];
  if (!entry) {
    if (import.meta.env?.DEV) console.warn(`[i18n] missing key: ${key}`);
    return key;
  }
  return pick(entry, locale);
};

/**
 * Resolve any bilingual content value for a locale, with de as the fallback.
 * Accepts plain strings so content modules can be translated incrementally.
 */
export function pick(value: Bi | string | undefined | null, locale: Locale): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  const out = value[locale];
  if (out) return out;
  if (locale === "en" && import.meta.env?.DEV) {
    console.warn(`[i18n] missing English for: ${value.de}`);
  }
  return value.de ?? "";
}

/** Fill {placeholders} in a translated template. */
export function format(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`));
}

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

/**
 * Locale-aware decimal separator fix for numbers that live inside content
 * strings (e.g. worked examples authored in German notation).
 */
export const fmtDecimal = (v: number, locale: Locale, digits = 1): string =>
  fmtNumber(v, locale, digits);
