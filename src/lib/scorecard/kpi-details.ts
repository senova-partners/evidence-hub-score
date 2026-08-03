import type { Locale } from "./types";
import { KPI_DETAILS_EN } from "./kpi-details.en";

// KPI detail data — Rohdaten-Auszug, Zählung, Formel, Rechenweg, Erhebung.
// Merge über KPI-id mit KPIS (kpis.ts). Der Board-Wert wird aus raw_summary
// berechnet (formula), nie hartcodiert. Rohdaten zeigen einen Auszug plus
// die vollständige Zählung. Personenbezogene Rohdaten existieren nicht:
// kleinste Einheit ist Episode, Auftrag, Team-Aggregat oder Partnerorganisation.

export interface KpiErhebung {
  owner: string;
  cadence: string;
  /** Methode = how the measurement is produced. If set, the detail view uses
   *  this instead of the KPI info's "wie" text, to keep Wie and Verifizierung
   *  from duplicating. */
  methode?: string;
  verifizierung: string;
}

export interface KpiDetail {
  raw_schema: string[];
  raw_rows: (string | number)[][];
  raw_summary: Record<string, number | string | null>;
  formula_text: string;
  worked_example: string;
  erhebung: KpiErhebung;
}

export const KPI_DETAILS: Record<string, KpiDetail> = {
  wiederbeauftragung: {
    raw_schema: ["Auftrag", "Cluster", "Volumen (Mio €)", "Entscheidung (Konsultation)", "Status"],
    raw_rows: [
      ["A-2025-011", "W&E", "4,2", "2026", "verlängert (+0,0)"],
      ["A-2025-014", "E&T", "3,1", "2026", "aufgestockt (+1,4)"],
      ["A-2025-019", "GOV", "2,8", "2026", "ausgelaufen"],
      ["A-2025-021", "W&E", "5,0", "2025", "Folgemodul (5,5)"],
      ["…", "…", "…", "…", "Auszug — vollständige Liste bei JDU/BD"],
    ],
    raw_summary: {
      volumen_zur_entscheidung_mio_24m: 41.5,
      fortgefuehrt_mio: 17.6,
      aufstockung_mio: 2.3,
      folgemodule_mio: 2.5,
      ausgelaufen_mio: 19.1,
      kontext_anzahl_gesamt: 28,
      kontext_anzahl_fortgefuehrt: 14,
    },
    formula_text:
      "(fortgeführtes Volumen + Aufstockungen + Folgemodul-Volumen) ÷ zur Entscheidung stehendes Volumen × 100, rollierend 24 Monate, erhoben nach Abschluss der Regierungskonsultationen. Anzahl der Aufträge nur als Kontext (Konsolidierung ist kein Verlust).",
    worked_example: "(17,6 + 2,3 + 2,5) ÷ 41,5 = 22,4 ÷ 41,5 = 54 %  ·  Kontext: 14 von 28 Aufträgen fortgeführt",
    erhebung: {
      owner: "JDU / BD",
      cadence:
        "jährlich nach Abschluss der Regierungskonsultationen, rollierend über 24 Monate (zwei Verhandlungszyklen); leere Jahre fängt das rollierende Fenster auf",
      verifizierung:
        "Vier-Augen-Prüfung durch Finance gegen Auftragsübersicht; Volumina aus Vertragsakten, keine Qualifizierung einzelner Jahre als „zählt nicht“",
    },
  },

  kofi_proposal: {
    raw_schema: ["Proposal", "Geber", "Volumen (Mio €)", "Ergebnis"],
    raw_rows: [
      ["P-26-03", "EU", "4,0", "gewonnen"],
      ["P-26-05", "BMZ Sondermittel", "2,1", "gewonnen"],
      ["P-26-07", "EU", "3,5", "abgelehnt"],
      ["P-26-09", "Drittgeber", "1,2", "offen (zählt nicht)"],
      ["…", "…", "…", "Auszug — Register bei BD, 21 Proposals in 24 Monaten"],
    ],
    raw_summary: {
      eingereicht_volumen_mio_24m: 14.6,
      gewonnen_volumen_mio_24m: 7.9,
      eingereicht_anzahl: 21,
      gewonnen_anzahl: 8,
      eu_eingereicht_volumen_mio: 8.3,
      eu_gewonnen_volumen_mio: 4.0,
      eu_eingereicht_anzahl: 6,
      eu_gewonnen_anzahl: 2,
      kofi_volumen_mio: 6.2,
      grundauftrag_mio: 18.5,
      geberkonzentration_bmz_anteil_prozent: 71,
    },
    formula_text:
      "Hauptwert: gewonnenes ÷ eingereichtes Volumen × 100, rollierend 24 Monate; offene Proposals zählen weder im Zähler noch im Nenner. Zweitwert: Stückquote (Anzahl). EU gesondert (beide Basen), Kofinanzierung (Kofi-Volumen ÷ Grundauftrag). Geberkonzentration als Kontextzeile ohne Zielwert.",
    worked_example:
      "Volumen: 7,9 ÷ 14,6 = 54 % · Stück: 8 ÷ 21 = 38 % · EU: 4,0 ÷ 8,3 = 48 % (Volumen), 2 ÷ 6 = 33 % (Stück) · Kofi: 6,2 ÷ 18,5 = 34 % · Lesart 54 vs. 38: die großen Anträge sitzen, die kleinen nicht.",
    erhebung: {
      owner: "BD",
      cadence: "quartalsweise, rollierend 24 Monate",
      verifizierung: "Abgleich Proposal-Register mit Finance-Zahlen",
    },
  },

  partnerfeedback_jahr: {
    raw_schema: [
      "Organisation",
      "Ebene",
      "F1 Zusammenarbeit",
      "F2 Rat",
      "F3 Nennungen (kodiert)",
    ],
    raw_rows: [
      ["Ministerium A", "Arbeitsebene", "besser", "besser", "P (Klimafinanzierung)"],
      ["Ministerium A", "Leitungsebene", "besser", "gleich", "U (Projektumsetzung)"],
      ["Behörde C", "Arbeitsebene", "besser", "besser", "F (Wasser-Daten) ⚠ nicht im Portfolio → Pipeline"],
      ["Planungsministerium", "Leitungsebene", "gleich", "besser", "P (EU-Programmierung)"],
      ["… (9 Organisationen, 22 Gespräche)", "…", "…", "…", "…"],
    ],
    raw_summary: {
      organisationen: 9,
      gespraeche: 22,
      f2_org_besser: 6,
      f2_org_gleich: 2,
      f2_org_schlechter: 1,
      expertise_quote_orgs_mit_P_oder_F: 7,
    },
    formula_text:
      "Je Organisation: Median der 2–3 Befragten je Frage (bei Divergenz konservativerer Wert; Divergenz wird notiert). Hauptwert: Saldo Organisationen besser − schlechter (Frage 2). Expertise-Quote: Organisationen mit ≥1 fachlicher Nennung (P/F) ÷ Organisationen. Prospektiver Abgleich der Nennungen mit Pipeline und Folgeaufträgen.",
    worked_example:
      "F2: 6 besser − 1 schlechter = +5 · Expertise-Quote: 7 ÷ 9 = 78 % · Abgleich: Nennung „Wasser-Daten“ (F) ohne Portfolio-Angebot → als Lead an Pipeline übergeben",
    erhebung: {
      owner: "JDU (nie der betroffene AV); Partnerliste durch AoA/CLT",
      cadence: "jährlich, gleiche Partnerliste",
      verifizierung: "fixer Gesprächsleitfaden (Partnerfeedback_Leitfaden.md), Auswertung auf Organisationsebene",
    },
  },

  delivery_quote: {
    raw_schema: ["Position", "Betrag (Mio €)"],
    raw_rows: [
      ["⚠ Voraussetzung", "Budget-/OP-Struktur muss nach intern-operativ vs. wirkungsbezogen unterteilt sein — heute nicht vorhanden"],
      ["Auftragsmittel gesamt (Jahr)", "24,0"],
      ["davon interne Abwicklung (Kostenstellen lt. eingefrorener Abgrenzung)", "4,8"],
      ["davon Partnerleistung", "19,2"],
    ],
    raw_summary: { auftragsmittel_mio: 24.0, interne_abwicklung_mio: 4.8 },
    formula_text:
      "(Auftragsmittel − interne Abwicklung) ÷ Auftragsmittel × 100. Abgrenzung „interne Abwicklung“ einmalig definiert und eingefroren.",
    worked_example: "(24,0 − 4,8) ÷ 24,0 = 19,2 ÷ 24,0 = 80 %",
    erhebung: {
      owner: "Finance",
      cadence: "jährlich",
      methode: "eine Jahreszahl aus der Kostenstellenlogik, nach eingefrorener Abgrenzung",
      verifizierung: "Abgrenzung interne Abwicklung / Partnerleistung dokumentiert und eingefroren; Vier-Augen-Prüfung durch Finance; setzt Voraussetzung 2 (Budgets/OP nach intern-operativ vs. wirkungsbezogen) voraus",
    },
  },

  inhouse_beratungsquote: {
    raw_schema: ["Position", "Betrag (Mio €)"],
    raw_rows: [
      ["Interne Fach-Personalkosten (Fachrollen lt. Taxonomie)", "4,8"],
      ["Externe Consulting-Ausgaben (Unteraufträge)", "2,4"],
      ["Finanzierungen (Zuschüsse/Grants an Durchführungspartner)", "4,7"],
      ["⚠ Voraussetzung", "Rollen-Taxonomie definiert und eingefroren (Voraussetzung 4)"],
    ],
    raw_summary: {
      fach_personalkosten_mio: 4.8,
      consulting_ausgaben_mio: 2.4,
      finanzierungen_mio: 4.7,
    },
    formula_text:
      "Hauptwert (Inhouse-Anteil der Leistungserbringung): Fach-Personalkosten ÷ (Fach-Personalkosten + Consulting + Finanzierungen) × 100. Ohne Finanzierungen im Vergleich: Fach-Personalkosten ÷ (Fach-Personalkosten + Consulting) × 100. Divergenz-Lesart: Sinkt der Hauptwert bei stabilem Zweitwert, wächst der Finanzierungsanteil im Portfolio — kein Substanzverlust; sinken beide, wird Expertise ausgelagert.",
    worked_example:
      "Hauptwert: 4,8 ÷ (4,8 + 2,4 + 4,7) = 4,8 ÷ 11,9 = 40 %\nOhne Finanzierungen im Vergleich: 4,8 ÷ (4,8 + 2,4) = 4,8 ÷ 7,2 = 67 %\n\nLesart: Sinkt der Hauptwert bei stabilem Zweitwert, wächst der Finanzierungsanteil im Portfolio — kein Substanzverlust. Sinken beide, wird Expertise ausgelagert.",
    erhebung: {
      owner: "Finance (Personalkosten Fachrollen + Consulting-Ausgaben + Finanzierungen)",
      cadence: "jährlich",
      methode: "drei Finance-Zahlen aus Vertrags- und Finanzübersichten (Personalkosten Fachrollen, Consulting-Ausgaben, Finanzierungsvolumen)",
      verifizierung: "Fachrollen-Zuordnung folgt der eingefrorenen Rollen-Taxonomie; keine Umrechnung über Beratertage",
    },
  },

  partnerbogen: {
    raw_schema: [
      "Episode",
      "Cluster",
      "F1 Problem-Fit",
      "F2 Verständnis",
      "F3 Timing",
      "F4 Umsetzbarkeit",
      "F5 Empfehlung",
      "Ø",
    ],
    raw_rows: [
      ["E-2026-031", "W&E", "4", "4", "3", "4", "4", "3,8"],
      ["E-2026-034", "GOV", "5", "4", "4", "4", "5", "4,4"],
      ["E-2026-036", "E&T", "3", "4", "3", "4", "3", "3,4"],
      ["…", "…", "…", "…", "…", "…", "…", "Auszug aus 14 beantworteten"],
    ],
    raw_summary: { versendet: 22, beantwortet: 14, summe_episoden_mittel: 54.6 },
    formula_text:
      "Episoden-Mittelwert aus F1–F5; KPI-Wert = Mittelwert der Episoden-Mittel (beantwortete Bögen); Rücklauf = beantwortet ÷ versendet. Vollerhebung: jeder Episoden-Abschluss triggert den Bogen, keine Auswahl. Episode = Beratungseinheit (Anlass · Empfänger · Ergebnis · Zeitraum), Definition und Fragebogen-Wortlaut in Episodenbogen_Partner.md.",
    worked_example: "54,6 ÷ 14 = 3,9 · Rücklauf: 14 ÷ 22 = 64 %",
    erhebung: {
      owner: "AV je Episode",
      cadence: "nach Episodenabschluss",
      verifizierung: "tokenisierter Einmal-Link, Steward-Übersicht",
    },
  },

  uptake: {
    raw_schema: ["Episode", "Empfehlung (Kurzform)", "Status nach 6 M", "Warum (1 Satz)"],
    raw_rows: [
      ["E-2025-044", "Tarifmodell-Anpassung", "umgesetzt", "Im Haushaltsentwurf übernommen"],
      ["E-2025-047", "Datenstandard Berichtswesen", "angepasst", "Vereinfachte Variante eingeführt"],
      ["E-2025-049", "Trägerstruktur-Empfehlung", "nicht genutzt", "Politischer Widerstand im Board"],
      ["…", "…", "…", "Auszug aus 9 bewerteten (2 ausstehend)"],
    ],
    raw_summary: { faellig: 11, umgesetzt: 4, angepasst: 2, nicht_genutzt: 3, ausstehend: 2 },
    formula_text:
      "(umgesetzt + angepasst) ÷ fällige Episoden × 100. Angepasste Übernahme zählt als Erfolg. Ausstehende zählen im Nenner (Ehrlichkeitsregel).",
    worked_example: "(4 + 2) ÷ 11 = 6 ÷ 11 = 55 %",
    erhebung: {
      owner: "AV / Steward",
      cadence: "6 Monate nach Episodenabschluss (kalendergetriggert)",
      verifizierung: "Partner- und AV-Angabe gegeneinander gehalten",
    },
  },

  leadership_review: {
    raw_schema: ["Struktureinheit", "Periode", "Bewertende Stelle", "Bewertung (1–5)"],
    raw_rows: [
      ["Practices", "2026-H1", "PFM/LD", "4"],
      ["Practices", "2026-H1", "CC Governance", "3"],
      ["Practices", "2026-H1", "CC Klima", "4"],
      ["Machine Room", "2026-H1", "PFM/LD", "3"],
      ["Machine Room", "2026-H1", "CC Governance", "3"],
      ["Machine Room", "2026-H1", "CC Wirtschaft", "2"],
    ],
    raw_summary: {
      bewertungen_gesamt: 6,
      bewertungen_practices: 3,
      bewertungen_machine_room: 3,
      gesamt_mittel: 3.2,
    },
    formula_text:
      "Mittelwert der halbjährlichen Bewertungen je Struktureinheit (Practices, Machine Room) durch PFM/LD und die Cluster-Koordination. Keine Verrechnung mit der nachfrageseitigen Peer-Bewertung — beide stehen als eigenständige KPIs nebeneinander.",
    worked_example:
      "Practices: (4 + 3 + 4) ÷ 3 = 3,7 · Machine Room: (3 + 3 + 2) ÷ 3 = 2,7 · Gesamt: 19 ÷ 6 = 3,2",
    erhebung: {
      owner: "PFM/LD und Cluster-Koordination",
      cadence: "halbjährlich",
      verifizierung: "Bewertungen werden namentlich je Stelle dokumentiert; Divergenz zur Peer-Bewertung wird im Review ausgewiesen",
    },
  },

  peer_review: {
    raw_schema: ["Episode", "Cluster", "Practice-Nutzbarkeit (1–5)", "Machine-Room-Nutzbarkeit (1–5)"],
    raw_rows: [
      ["EP-2026-0142", "Governance", "4", "3"],
      ["EP-2026-0158", "Klima", "4", "—"],
      ["EP-2026-0167", "Wirtschaft", "—", "3"],
      ["EP-2026-0171", "Bildung", "3", "4"],
    ],
    raw_summary: {
      bewertungen_gesamt: 6,
      bewertungen_practices: 3,
      bewertungen_machine_room: 3,
      gesamt_mittel: 3.5,
    },
    formula_text:
      "Drei Sichten aus denselben Episodenbewertungen: Practices (Mittelwert aller Practice-Nutzbarkeitswerte), Machine Room (Mittelwert aller Machine-Room-Nutzbarkeitswerte), Gesamt (Summe beider Pools geteilt durch die Gesamtzahl der Bewertungen — häufiger genutzte Struktureinheiten zählen entsprechend stärker).",
    worked_example:
      "Practices: (4 + 4 + 3) ÷ 3 = 3,7 · Machine Room: (3 + 3 + 4) ÷ 3 = 3,3 · Gesamt: 21 ÷ 6 = 3,5",
    erhebung: {
      owner: "Projekt / AV je Episode",
      cadence: "nach jeder genutzten Practice- oder Machine-Room-Leistung",
      verifizierung: "Bewertungsfelder werden nur bei gesetztem Struktur-Häkchen ausgespielt; Plausibilisierung gegen die Anfragen- und Vorgangslisten",
    },
  },

  mechanismus: {
    raw_schema: ["Episode", "Practice-Produkt genutzt?", "MR-Zuarbeit?"],
    raw_rows: [
      ["E-2026-031", "ja", "nein"],
      ["E-2026-032", "nein", "ja"],
      ["E-2026-033", "ja", "ja"],
      ["E-2026-034", "nein", "nein"],
      ["… (14 Episoden gesamt)", "…", "…"],
    ],
    raw_summary: { episoden: 14, nur_practice: 3, nur_mr: 2, beides: 2, keins: 7 },
    formula_text:
      "Drei Sichten aus denselben zwei Häkchen je Episode: Gesamt (mindestens ein Ja — Board-Wert), Practices (Practice-Produkt genutzt), Machine Room (MR-Zuarbeit). Die getrennte Sicht zeigt, WELCHER Teil der Struktur in der Beratungsarbeit ankommt — Practices und MR können sich unterschiedlich schnell durchsetzen. Dosis-Wirkungs-Kreuzung mit den Qualitätswerten läuft je Sicht getrennt.",
    worked_example: "Gesamt: (3 + 2 + 2) ÷ 14 = 50 % · Practices: (3 + 2) ÷ 14 = 36 % · Machine Room: (2 + 2) ÷ 14 = 29 %",
    erhebung: {
      owner: "AV je Episode",
      cadence: "nach Episodenabschluss",
      verifizierung: "Plausibilisierung gegen Anfragenlisten der Practices",
    },
  },

  fachzeit: {
    raw_schema: ["Team (anonymisiert)", "Personen (n)", "Fachzeit-Anteil"],
    raw_rows: [
      ["Team 1", "6", "74 %"],
      ["Team 2", "7", "69 %"],
      ["Team 3", "5", "75 %"],
      ["… (9 Teams gesamt, nur Aggregate ≥ 5 Personen)", "…", "…"],
    ],
    raw_summary: { teams: 9, personen_gesamt: 54, gewichtete_summe_prozentpunkte: 3888 },
    formula_text:
      "Personengewichteter Mittelwert der Team-Aggregate. Einzelprotokolle verlassen das Team nie; Meldung nur als Team-Summe.",
    worked_example: "3.888 Prozentpunkte ÷ 54 Personen = 72 %",
    erhebung: {
      owner: "Teams selbst (Aggregat)",
      cadence: "zweiwöchige Selbstprotokollierung, quartalsweise Meldung",
      methode: "einheitliches Zeit-Kategorienschema; Meldung nur als personengewichtetes Team-Aggregat",
      verifizierung: "n ≥ 5 je Team; Sprünge > 30 Prozentpunkte gegen Vorperiode werden vom Steward rückgefragt",
    },
  },

  testvorgang: {
    raw_schema: [
      "Quartal",
      "Vorgang (eingefrorene Spez.)",
      "Start",
      "Ende",
      "Kalendertage",
      "Beteiligte",
    ],
    raw_rows: [
      ["2026-Q3 (Baseline)", "Beschaffung Standard-Los A", "07.07.", "28.07.", "21", "9"],
      ["2026-Q4", "identisch", "06.10.", "25.10.", "19", "8"],
      ["2027-Q1", "identisch", "12.01.", "29.01.", "17", "6"],
    ],
    raw_summary: { aktuell_tage: 17, aktuell_beteiligte: 6 },
    formula_text:
      "Kalendertage von Einspeisung bis Erledigung; Zweitwert: Anzahl beteiligter Personen. Spezifikation eingefroren — jede Veränderung ist Struktureffekt.",
    worked_example: "Ende 29.01. − Start 12.01. = 17 Kalendertage (Baseline 21 → Verbesserung um 4 Tage)",
    erhebung: {
      owner: "Steward",
      cadence: "quartalsweise, 1 identischer Vorgang",
      verifizierung: "schriftlich fixierte, eingefrorene Spezifikation; Zeitstempel je Station",
    },
  },

  abflusstreue: {
    raw_schema: ["Position", "Betrag (Mio €)"],
    raw_rows: [
      ["Plan-Abfluss Portfolio (Jahr)", "21,4"],
      ["Ist-Abfluss (Stand Q3)", "19,0"],
      ["Restmittel-Prognose Jahresende", "1,1"],
    ],
    raw_summary: { plan_mio: 21.4, ist_mio: 19.0 },
    formula_text:
      "Ist-Abfluss ÷ Plan-Abfluss × 100. Restmittelquote als Zusatzangabe im Detail.",
    worked_example: "19,0 ÷ 21,4 = 89 %",
    erhebung: {
      owner: "Finance / Controlling",
      cadence: "quartalsweise",
      verifizierung: "Controlling-Bericht",
    },
  },

  schmerzpunkt: {
    raw_schema: [
      "Cluster",
      "Schmerzpunkte (Reach-In-Liste)",
      "Ø heute (1 gelöst – 5 unverändert)",
    ],
    raw_rows: [
      ["W&E", "11 Punkte", "2,5"],
      ["E&T", "9 Punkte", "2,8"],
      ["GOV", "10 Punkte", "2,8"],
      ["Neue Schmerzpunkte (Zusatzfeld)", "4 genannt", "→ an BT 1"],
    ],
    raw_summary: { listen: 3, punkte_gesamt: 30, summe_scores: 81 },
    formula_text:
      "Mittelwert über alle Punkte aller Cluster-Listen; identische Liste, identischer Teilnehmerkreis wie im Reach-In.",
    worked_example: "81 ÷ 30 = 2,7 (Baseline 3,2 → Verbesserung um 0,5)",
    erhebung: {
      owner: "BT 3",
      cadence: "12 Monate nach Reach-In, dann jährlich",
      verifizierung: "identische Liste, identischer Teilnehmerkreis",
    },
  },

  berater_vze_anteil: {
    raw_schema: ["Stellenkategorie (Taxonomie)", "VZE", "Einordnung"],
    raw_rows: [
      ["Fachplaner/Berater national & international", "38,0", "fachlich"],
      ["Projektadministration & Finanzen", "16,5", "administrativ"],
      ["Mischrollen (z. B. Officer 50/50 lt. Anteilsregel)", "8,0", "4,0 fachlich / 4,0 administrativ"],
      ["Machine Room / Service-Einheiten", "9,5", "administrativ (zentralisiert)"],
      ["⚠ Voraussetzung", "", "Rollen-Taxonomie muss definiert und eingefroren sein — heute nicht sauber vorhanden"],
    ],
    raw_summary: {
      gesamt_vze: 72.0,
      fachlich_vze: 42.0,
      kontext_umsatz_mio: 21.0,
    },
    formula_text:
      "Fachliche VZE (inkl. Mischrollen-Anteile lt. eingefrorener Taxonomie) ÷ Gesamt-VZE × 100. Kontextzeile ohne Wertung: Umsatz je Berater-VZE.",
    worked_example: "42,0 ÷ 72,0 = 58 % (Baseline) · Kontext: 21,0 Mio ÷ 42,0 = 0,50 Mio je Berater-VZE",
    erhebung: {
      owner: "HR (Taxonomie mit DAIO)",
      cadence: "jährlich",
      methode: "aggregiert aus HR-Stellenübersicht; bewertet werden Stellenkategorien, nicht Personen",
      verifizierung: "Voraussetzung 4 (Rollen-Taxonomie) eingefroren; Mischrollen nach dokumentierter Anteilsregel",
    },
  },
};

export const kpiDetail = (id: string): KpiDetail | undefined => KPI_DETAILS[id];

/**
 * Locale-aware detail record. English content comes from the overlay in
 * kpi-details.en.ts; every field falls back to the German source when no
 * translation exists yet, so the view never renders empty.
 */
export function kpiDetailLocalized(id: string, locale: Locale): KpiDetail | undefined {
  const de = KPI_DETAILS[id];
  if (!de) return undefined;
  if (locale === "de") return de;
  const en = KPI_DETAILS_EN[id];
  if (!en) return de;
  return {
    ...de,
    ...(en.raw_schema ? { raw_schema: en.raw_schema } : {}),
    ...(en.raw_rows ? { raw_rows: en.raw_rows } : {}),
    ...(en.formula_text ? { formula_text: en.formula_text } : {}),
    ...(en.worked_example ? { worked_example: en.worked_example } : {}),
    erhebung: { ...de.erhebung, ...en.erhebung },
  };
}

/** Word-level glossary for the raw_summary keys shown under the raw table. */
const SUMMARY_TOKENS_EN: Record<string, string> = {
  volumen: "volume",
  zur: "up for",
  entscheidung: "decision",
  mio: "EUR m",
  fortgefuehrt: "continued",
  aufstockung: "top-ups",
  folgemodule: "follow-on modules",
  ausgelaufen: "ended",
  kontext: "context",
  anzahl: "count",
  gesamt: "total",
  eingereicht: "submitted",
  gewonnen: "won",
  kofi: "co-financing",
  grundauftrag: "core commission",
  geberkonzentration: "donor concentration",
  bmz: "BMZ",
  anteil: "share",
  prozent: "percent",
  organisationen: "organisations",
  gespraeche: "interviews",
  besser: "better",
  gleich: "same",
  schlechter: "worse",
  expertise: "expertise",
  quote: "rate",
  orgs: "orgs",
  mit: "with",
  oder: "or",
  auftragsmittel: "commission funds",
  interne: "internal",
  abwicklung: "processing",
  fach: "expert",
  personalkosten: "staff costs",
  consulting: "consulting",
  ausgaben: "spend",
  finanzierungen: "financing",
  versendet: "sent",
  beantwortet: "returned",
  summe: "sum",
  episoden: "episodes",
  mittel: "mean",
  faellig: "due",
  umgesetzt: "implemented",
  angepasst: "adapted",
  nicht: "not",
  genutzt: "used",
  ausstehend: "pending",
  produkte: "products",
  je: "per",
  runde: "round",
  letzte: "last",
  aktuelle: "current",
  aktuell: "current",
  nur: "only",
  practice: "practice",
  mr: "MR",
  beides: "both",
  keins: "none",
  teams: "teams",
  personen: "people",
  gewichtete: "weighted",
  prozentpunkte: "percentage points",
  tage: "days",
  beteiligte: "people involved",
  plan: "planned",
  ist: "actual",
  listen: "lists",
  punkte: "points",
  scores: "scores",
  vze: "FTE",
  fachlich: "expert",
  umsatz: "revenue",
};

/** Render a raw_summary key as a label in the active locale. */
export function summaryKeyLabel(key: string, locale: Locale): string {
  if (locale === "de") return key.replace(/_/g, " ") + ":";
  return (
    key
      .split("_")
      .map((token) => SUMMARY_TOKENS_EN[token.toLowerCase()] ?? token)
      .join(" ") + ":"
  );
}

