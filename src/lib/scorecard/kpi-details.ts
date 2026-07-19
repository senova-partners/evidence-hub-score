// KPI detail data — Rohdaten-Auszug, Zählung, Formel, Rechenweg, Erhebung.
// Merge über KPI-id mit KPIS (kpis.ts). Der Board-Wert wird aus raw_summary
// berechnet (formula), nie hartcodiert. Rohdaten zeigen einen Auszug plus
// die vollständige Zählung. Personenbezogene Rohdaten existieren nicht:
// kleinste Einheit ist Episode, Auftrag, Team-Aggregat oder Partnerorganisation.

export interface KpiErhebung {
  owner: string;
  cadence: string;
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
    raw_schema: ["Auftrag", "Cluster", "Ende", "Status"],
    raw_rows: [
      ["A-2025-011", "W&E", "2026-03", "verlängert"],
      ["A-2025-014", "E&T", "2026-05", "aufgestockt"],
      ["A-2025-019", "GOV", "2026-06", "ausgelaufen"],
      ["A-2025-021", "W&E", "2026-06", "Folgemodul"],
      ["A-2025-mehr", "…", "…", "Auszug — vollständige Liste bei JDU/BD"],
    ],
    raw_summary: { gesamt: 28, verlaengert: 9, aufgestockt: 3, folgemodul: 2, ausgelaufen: 14 },
    formula_text: "(verlängert + aufgestockt + Folgemodul) ÷ Aufträge gesamt × 100",
    worked_example: "(9 + 3 + 2) ÷ 28 = 14 ÷ 28 = 50 %",
    erhebung: {
      owner: "JDU / BD",
      cadence: "quartalsweise, Jahresschluss verbindlich",
      verifizierung: "Vier-Augen-Prüfung durch Finance gegen Auftragsübersicht",
    },
  },

  kofi_proposal: {
    raw_schema: ["Proposal", "Geber", "Volumen (Mio €)", "Ergebnis"],
    raw_rows: [
      ["P-26-03", "EU", "4,0", "gewonnen"],
      ["P-26-05", "BMZ Sondermittel", "2,1", "gewonnen"],
      ["P-26-07", "EU", "3,5", "abgelehnt"],
      ["P-26-09", "Drittgeber", "1,2", "offen (zählt nicht)"],
      ["…", "…", "…", "Auszug — Register bei BD"],
    ],
    raw_summary: {
      eingereicht_24m: 21,
      gewonnen_24m: 8,
      eu_eingereicht: 6,
      eu_gewonnen: 2,
      kofi_volumen_mio: 6.2,
      grundauftrag_mio: 18.5,
    },
    formula_text:
      "Hauptwert: gewonnene ÷ eingereichte Proposals (rollierend 24 Monate) × 100. Kontext: EU separat; Kofinanzierungsvolumen ÷ Grundauftrag.",
    worked_example: "8 ÷ 21 = 38 % · EU: 2 ÷ 6 = 33 % · Kofi: 6,2 ÷ 18,5 Mio = 34 %",
    erhebung: {
      owner: "BD",
      cadence: "quartalsweise, rollierend 24 Monate",
      verifizierung: "Abgleich Proposal-Register mit Finance-Zahlen",
    },
  },

  partner_delta: {
    raw_schema: ["Partner (Organisation)", "Schneller geworden?", "Rat besser geworden?"],
    raw_rows: [
      ["Ministerium A", "besser", "besser"],
      ["Ministerium B", "gleich", "besser"],
      ["Behörde C", "besser", "gleich"],
      ["Kommune D", "schlechter", "gleich"],
      ["… (10 Gespräche gesamt)", "…", "…"],
    ],
    raw_summary: {
      n: 10,
      rat_besser: 6,
      rat_gleich: 3,
      rat_schlechter: 1,
      tempo_besser: 6,
      tempo_gleich: 3,
      tempo_schlechter: 1,
    },
    formula_text:
      "Saldo = Anzahl „besser“ − Anzahl „schlechter“ (Frage Beratungsqualität). Tempo-Frage als Zweitwert im Detail.",
    worked_example: "Rat: 6 besser − 1 schlechter = +5 · Tempo: 6 − 1 = +5",
    erhebung: {
      owner: "AoA / Partner Steward",
      cadence: "jährlich, gleiche Partnerliste",
      verifizierung: "standardisierter Gesprächsleitfaden, dokumentiert je Gespräch",
    },
  },

  delivery_quote: {
    raw_schema: ["Position", "Betrag (Mio €)"],
    raw_rows: [
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
      verifizierung: "eingefrorene Kostenstellenabgrenzung, dokumentiert",
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
      "Score = Mittelwert der Episoden-Mittelwerte (beantwortete Bögen). Rücklauf = beantwortet ÷ versendet. Score ohne Rücklaufquote ungültig.",
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

  peer_review: {
    raw_schema: [
      "Produkt",
      "Cluster",
      "Evidenzbasis",
      "Problemschärfe",
      "Kontextpassung",
      "Umsetzbarkeit",
      "Klarheit",
      "Ø",
    ],
    raw_rows: [
      ["(H1 2027: Ziehung erfolgt, Session 15.07. — Meldung fehlt)", "", "", "", "", "", "", ""],
      ["Letzte Runde H2 2026:", "", "", "", "", "", "", ""],
      ["PR-26-01 Gutachten Wassertarife", "W&E", "3", "3", "4", "3", "3", "3,2"],
      ["PR-26-02 TVET-Curriculum-Konzept", "E&T", "3", "2", "3", "3", "3", "2,8"],
      ["… (6 Produkte je Runde)", "…", "…", "…", "…", "…", "…", "…"],
    ],
    raw_summary: { produkte_je_runde: 6, letzte_runde_mittel: 2.9, aktuelle_runde: null },
    formula_text:
      "Mittelwert über 6 Produkte (2 je Cluster, Zufallsziehung durch Steward aus dem Episodenregister) × 5 Kriterien × Panel-Mittel je Kriterium.",
    worked_example:
      "H2 2026: Summe Produkt-Mittel 17,4 ÷ 6 = 2,9. Aktuell: Meldung fehlt — kein Wert wird geschätzt.",
    erhebung: {
      owner: "Peer-Panel",
      cadence: "halbjährlich",
      verifizierung: "Zufallsziehung durch Steward, Bögen archiviert",
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
      "Episoden mit mindestens einem Ja ÷ Episoden gesamt × 100. Auswertung nur auf Episoden-/Portfolio-Ebene, nie je Person.",
    worked_example: "(3 + 2 + 2) ÷ 14 = 7 ÷ 14 = 50 %",
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
      verifizierung: "n ≥ 5, Sprünge > 30 % gegen Vorperiode werden vom Steward rückgefragt",
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
};

export const kpiDetail = (id: string): KpiDetail | undefined => KPI_DETAILS[id];
