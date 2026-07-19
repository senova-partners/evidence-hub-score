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
      ["Interne Fach-Personalkosten (Fachrollen lt. Taxonomie, inkl. Mischrollen-Anteile)", "4,8"],
      ["Externe Consulting-Ausgaben (Unteraufträge lt. Vertragsübersichten)", "2,4"],
      ["⚠ Voraussetzung", "Rollen-Taxonomie definiert und eingefroren (Voraussetzung 4)"],
    ],
    raw_summary: {
      fach_personalkosten_mio: 4.8,
      consulting_ausgaben_mio: 2.4,
    },
    formula_text:
      "Interne Fach-Personalkosten ÷ (interne Fach-Personalkosten + externe Consulting-Ausgaben) × 100, beide in Euro. Kein 100%-Ziel — gemessen wird die Substitutionsrichtung.",
    worked_example: "4,8 ÷ (4,8 + 2,4) = 4,8 ÷ 7,2 = 67 %",
    erhebung: {
      owner: "Finance (mit HR-Rollen-Taxonomie)",
      cadence: "jährlich",
      methode: "zwei Finance-Quellen: Personalkosten der Fachrollen + Consulting-Ausgaben aus Vertragsübersichten",
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
};

export const kpiDetail = (id: string): KpiDetail | undefined => KPI_DETAILS[id];
