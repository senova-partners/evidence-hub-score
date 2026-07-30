import type { KpiDef, KpiFormat, Locale } from "./types";
import { fmtNumber } from "./i18n";

// ---------------------------------------------------------------------------
// KPIs — verbindliche Fassung v1.x (Juli 2026)
// Board (3-3-3): Paket 1 — Außenbeweis (3) · Paket 2 — Beratungsqualität (3)
//               · Paket 3 — Struktur-Effizienz (3 Karten; Scharnier trägt zwei
//                 eingebettete Zweitwerte, außerdem drei Diagnostik-KPIs).
// Quelle: config/scorecard_kpi_config.json (Wahrheitsquelle). Bei Änderungen
// zuerst das JSON aktualisieren, dann dieses Modul angleichen — sonst driften
// Config und Code, und Rohdaten-Rechenwege verlieren ihre Grundlage.
// ---------------------------------------------------------------------------

export const KPIS: KpiDef[] = [
  // ============ Paket 1 — Außenbeweis ============
  {
    id: "wiederbeauftragung",
    pkg: "aussenbeweis",
    name: { de: "Wiederbeauftragungsquote", en: "Repeat commissioning rate" },
    unit: {
      de: "% fortgeführtes Volumen (kann > 100 % liegen, wenn Aufstockungen das ursprüngliche Volumen übersteigen)",
      en: "% continued volume (may exceed 100 % when top-ups exceed the original volume)",
    },
    unitShort: { de: "%", en: "%" },
    format: "percent",
    direction: "higher_better",
    nLabel: {
      de: "Basis: 41,5 Mio € zur Entscheidung (24 M.)",
      en: "Base: EUR 41.5 m up for decision (24 m.)",
    },
    contextLine: {
      de: "Anzahl der Aufträge als Kontextzeile im Detail — Konsolidierung durch Zusammenlegung ist kein Verlust.",
      en: "Number of commissions as a context row in the detail view — consolidation through merging is not a loss.",
    },
    info: {
      was: {
        de: "Anteil des Auftragsvolumens, das verlängert, aufgestockt oder mit einem Folgemodul fortgeführt wurde, gemessen am insgesamt zur Entscheidung stehenden Volumen.",
        en: "Share of commission volume that was extended, topped up or continued with a follow-on module, measured against the total volume up for decision.",
      },
      warum: {
        de: "Fortgeführtes und aufgestocktes Auftragsvolumen ist ein Qualitätsurteil der Auftraggeber mit Budgetbindung. Volumen statt Stückzahl, damit gewollte Konsolidierung nicht als Rückgang erscheint.",
        en: "Continued and topped-up commission volume is a client quality verdict backed by budget. Volume rather than count, so intended consolidation does not read as decline.",
      },
      wie: {
        de: "Erhebung nach Abschluss der jährlichen Regierungskonsultationen, rollierend über 24 Monate bzw. zwei Verhandlungszyklen. Vier-Augen-Prüfung durch Finance gegen Auftragsübersicht.",
        en: "Recorded after the annual government consultations, rolling over 24 months resp. two negotiation cycles. Four-eyes check by Finance against the commission overview.",
      },
      verworfen: {
        de: "Stückzahl-Quote (bestraft gewollte Konsolidierung) · Kalenderjahres-Messung zum 31.12. (misst den Verhandlungszyklus statt der Qualität) · Herausrechnen exogen ausgelaufener Aufträge (macht den Nenner verhandelbar).",
        en: "Count-based rate (penalises intended consolidation) · Calendar-year cut-off at 31 Dec (measures the negotiation cycle, not quality) · Excluding commissions that ended for exogenous reasons (makes the denominator negotiable).",
      },
    },
  },
  {
    id: "kofi_proposal",
    pkg: "aussenbeweis",
    name: { de: "Kofinanzierung & Proposal-Erfolg", en: "Co-financing & proposal success" },
    unit: { de: "%", en: "%" },
    unitShort: { de: "%", en: "%" },
    format: "percent",
    direction: "higher_better",
    nLabel: {
      de: "Basis: 14,6 Mio € eingereicht (24 Monate)",
      en: "Base: EUR 14.6 m submitted (24 months)",
    },
    contextLine: {
      de: "Stückquote als fester Zweitwert · EU gesondert · Geberkonzentration als Kontext",
      en: "Count rate as fixed secondary · EU separately · donor concentration as context",
    },
    info: {
      was: {
        de: "Drittmittel im Verhältnis zum Grundauftrag sowie gewonnene vs. eingereichte Angebote, EU gesondert.",
        en: "Third-party funds relative to core commission and won vs. submitted proposals, EU separately.",
      },
      warum: {
        de: "Externe Zahlungsbereitschaft als Qualitätsurteil. Die Geberkonzentration läuft als Kontext mit: Abhängigkeit von einem Auftraggeber ist ein Strukturrisiko (Übertragung der Client-Concentration-Logik aus der Beratungspraxis).",
        en: "External willingness to pay as a quality verdict. Donor concentration runs as context: dependence on one client is a structural risk (client-concentration logic from advisory practice).",
      },
      wie: {
        de: "BD-Übersicht, rollierend über 24 Monate wegen kleiner Fallzahlen.",
        en: "BD overview, rolling over 24 months due to small case numbers.",
      },
      verworfen: null,
    },
  },
  {
    id: "partnerfeedback_jahr",
    pkg: "aussenbeweis",
    name: { de: "Partnerfeedback (jährlich)", en: "Partner feedback (annual)" },
    unit: {
      de: "Saldo Organisationen besser − schlechter (Frage Rat)",
      en: "Balance of organisations better − worse (advice question)",
    },
    unitShort: { de: "±", en: "±" },
    format: "delta",
    direction: "higher_better",
    nLabel: {
      de: "n = 8–10 Organisationen, je 2–3 Befragte",
      en: "n = 8–10 organisations, 2–3 respondents each",
    },
    info: {
      was: {
        de: "Jährliches Gespräch mit den zentralsten Partnerorganisationen (2–3 Befragte je Organisation, Arbeits- und Leitungsebene): zwei Veränderungsfragen (Zusammenarbeit schneller? Rat besser?) plus die ungestützte Expertise-Frage. Hauptwert: Saldo der Organisationen (besser − schlechter) zur Frage nach dem fachlichen Rat.",
        en: "Annual interview with the most central partner organisations (2–3 respondents each, working and leadership level): two change questions (cooperation faster? advice better?) plus the unaided expertise question. Main value: organisation-level balance (better − worse) on the advice question.",
      },
      warum: {
        de: "Veränderungsfragen tragen den Vergleich in sich und brauchen keine Baseline. 2–3 Befragte je Organisation, damit ein Organisationsbild entsteht statt einer Einzelwahrnehmung; Divergenz zwischen Ebenen ist selbst ein Befund. Die ungestützte Frage wird quantifiziert als Expertise-Quote (Anteil Organisationen mit fachlicher Nennung) und prospektiv gegen Pipeline und Folgeaufträge gespiegelt.",
        en: "Change questions carry the comparison in themselves and need no baseline. 2–3 respondents per organisation so an organisational picture emerges rather than a single perception; divergence between levels is itself a finding. The unaided question is quantified as an expertise share (organisations with a substantive naming) and mirrored prospectively against pipeline and follow-on commissions.",
      },
      wie: {
        de: "Fixer Gesprächsleitfaden (siehe Partnerfeedback_Leitfaden.md), Partnerliste einmalig durch AoA/CLT beschlossen und über Jahre identisch — Änderungen nur mit dokumentierter Begründung. JDU führt die Gespräche, nie der betroffene AV. Auswertung nur auf Organisationsebene.",
        en: "Fixed interview guide (see Partnerfeedback_Leitfaden.md); partner list decided once by AoA/CLT and kept identical across years — changes only with documented justification. JDU runs the interviews, never the responsible AV. Analysis only at organisation level.",
      },
      verworfen: {
        de: "Geprüft und verworfen: absolute Zufriedenheitswerte (ohne Baseline aussagelos, Höflichkeitsbias); jährlich neu zusammengestellte Partnerliste (Ergebnis wäre wählbar); ein Befragter je Organisation (misst Einzelwahrnehmung statt Organisationsbild).",
        en: "Reviewed and rejected: absolute satisfaction scores (meaningless without baseline, courtesy bias); a partner list reassembled each year (result would be selectable); a single respondent per organisation (measures individual perception, not the organisational picture).",
      },
    },
  },
  {
    id: "delivery_quote",
    pkg: "struktur",
    name: { de: "Direkte Wirkungsmittel (Delivery-Quote)", en: "Direct impact funds (delivery share)" },
    tabLabel: { de: "Direkte Wirkungsmittel", en: "Direct impact funds" },
    unit: { de: "%", en: "%" },
    unitShort: { de: "%", en: "%" },
    format: "percent",
    direction: "higher_better",
    nLabel: { de: "Basis: Auftragsbudgets gesamt", en: "Base: total commission budgets" },
    contextLine: {
      de: "Voraussetzung (vor Baseline zu schaffen): Budgets und Instrumentenkonzepte je Projekt müssen nach internen operativen vs. wirkungsbezogenen Ausgaben unterteilt werden — heute in Budgets und OPs nicht enthalten. Arbeitsauftrag Finance/F&A: Abgrenzung definieren, in Budget-/OP-Template einziehen, einfrieren.",
      en: "Precondition (before baseline): budgets and instrument concepts per project must be split into internal operational vs. impact-related spend — not present in today's budgets/OPs. Work order Finance/F&A: define the boundary, embed it in budget/OP template, freeze.",
    },
    info: {
      was: {
        de: "Anteil der Auftragsmittel, der in Partnerleistung fließt, statt sich in interner Abwicklung zu verbrauchen.",
        en: "Share of commission funds that flows into partner delivery rather than internal processing.",
      },
      warum: {
        de: "Die Non-Profit-Übersetzung der Marge: „aus weniger mehr“ wörtlich genommen — mehr vom selben Geld kommt beim Partner an. Klare Handlungsrichtung: Reibung senken, genau der Machine-Room-Auftrag.",
        en: "The non-profit translation of margin: 'more from less' taken literally — more of the same money reaches the partner. Clear action direction: reduce friction, exactly the Machine Room mandate.",
      },
      wie: {
        de: "Voraussetzung: Budgets/Instrumentenkonzepte je Projekt werden nach internen operativen vs. wirkungsbezogenen Ausgaben unterteilt — diese Trennung existiert in den heutigen Budgets und Operationsplänen nicht und muss vor der Baseline geschaffen werden (Arbeitsauftrag Finance/F&A). Abgrenzung einmalig definiert, dokumentiert und eingefroren; danach eine Jahreszahl aus der Kostenstellenlogik.",
        en: "Precondition: budgets/instrument concepts per project split into internal operational vs. impact-related spend — this split is missing in today's budgets/OPs and must be created before baseline (work order Finance/F&A). Boundary defined once, documented, frozen; thereafter one annual figure.",
      },
      verworfen: {
        de: "Geprüft und verworfen: VZE/Umsatz (misst Portfoliomix und verwaltetes Volumen, belohnt Auslagerung, bestraft die gewollte Verschiebung zu mehr Beratung) und Overhead-Quote (zentral gesetzt, kein beweglicher Wert).",
        en: "Considered and rejected: FTE/revenue (measures portfolio mix and managed volume, rewards outsourcing, penalises the desired shift to more advisory) and overhead ratio (centrally set, no movable value).",
      },
    },
  },

  // ============ Paket 2 — Beratungsqualität ============
  {
    id: "partnerbogen",
    pkg: "beratungsqualitaet",
    name: { de: "Partnerbogen (je Beratungsepisode)", en: "Partner form (per advisory episode)" },
    unit: { de: "1–5", en: "1–5" },
    unitShort: { de: "Pkt", en: "pts" },
    format: "score",
    direction: "higher_better",
    nLabel: { de: "n = 14 Episoden · Rücklauf 63 %", en: "n = 14 episodes · response 63 %" },
    contextLine: {
      de: "Score ohne Rücklaufquote ungültig",
      en: "Score invalid without response rate",
    },
    info: {
      was: {
        de: "Fünf Fragen an den Partner nach jeder abgeschlossenen Beratungsepisode. Eine Episode ist die abgegrenzte Beratungseinheit mit vier Bestimmungsstücken: Anlass (die fachliche Frage des Partners), Empfänger (Partnerorganisation), Ergebnis (Empfehlung/Produkt), Zeitraum (Beginn und Abschluss) — registriert vom AV im Episodenregister. Fragen im Wortlaut: F1 Problem-Fit („Die Beratung hat das Problem adressiert, das wir lösen wollten — nicht ein anderes“), F2 Verständnis, F3 Timing, F4 Umsetzbarkeit, F5 Weiterempfehlung, F6 offen („Was hätte die Beratung wertvoller gemacht?“). Skala 1–5. Vollständiger Bogen: Episodenbogen_Partner.md.",
        en: "Five questions to the partner after every closed advisory episode. An episode is the delimited advisory unit with four elements: occasion (the partner's substantive question), recipient (partner organisation), result (recommendation/product), period (start and close date) — registered by the AV in the episode register. Questions verbatim: F1 problem fit (\"The advice addressed the problem we wanted to solve — not a different one\"), F2 understanding, F3 timing, F4 feasibility, F5 recommendation, F6 open (\"What would have made the advice more valuable?\"). Scale 1–5. Full form: Episodenbogen_Partner.md.",
      },
      warum: {
        de: "Partner beurteilen das Erlebnis, nicht die Substanz (Maister: Zufriedenheit = Wahrnehmung minus Erwartung); Problem-Fit steht deshalb als erste Frage (Levishchenko 2020) — die häufigste Qualitätslücke ist das falsche Problem, nicht die falsche Antwort. Zufriedenheit allein belegt keine Wirkung (Hershock 2021): Dieser Score steht nie allein, sondern neben Uptake und Peer-Review.",
        en: "Partners judge the experience, not the substance (Maister: satisfaction = perception minus expectation); problem fit is therefore the first question (Levishchenko 2020) — the most common quality gap is the wrong problem, not the wrong answer. Satisfaction alone does not prove effect (Hershock 2021): this score never stands alone, always beside Uptake and Peer Review.",
      },
      wie: {
        de: "Keine Auswahl — Vollerhebung: Jede im Register abgeschlossene Episode löst den Bogen automatisch aus (kalendergetriggert beim Abschluss); Auswahl durch AV oder Cluster wäre Rosinenpicken. Rücklaufquote wird immer ausgewiesen — Score ohne Rücklauf ungültig. Tokenisierter Einmal-Link je Episode. Werte < 3,0 lösen Closed-Loop-Nachfassen binnen 14 Tagen aus.",
        en: "No selection — full census: every episode closed in the register triggers the form automatically (calendar-triggered at close); selection by AV or cluster would invite cherry-picking. Response rate is always shown — score invalid without it. Tokenised single-use link per episode. Values < 3.0 trigger closed-loop follow-up within 14 days.",
      },
      verworfen: {
        de: "Geprüft und verworfen: Stichproben-Auswahl der Episoden (manipulierbar); jährliche Sammelbefragung statt episodengetrieben (Erinnerungsbias, keine Episodenzuordnung); NPS als Einzelwert (instabil bei kleinem n, keine Handlungsrichtung).",
        en: "Reviewed and rejected: sampled selection of episodes (manipulable); annual aggregate survey rather than episode-driven (recall bias, no episode attribution); NPS as a single value (unstable at small n, no direction of action).",
      },
    },
  },
  {
    id: "uptake",
    pkg: "beratungsqualitaet",
    name: { de: "Uptake-Quote (6 Monate)", en: "Uptake rate (6 months)" },
    unit: { de: "% umgesetzt oder angepasst", en: "% implemented or adapted" },
    unitShort: { de: "%", en: "%" },
    format: "percent",
    direction: "higher_better",
    nLabel: { de: "n = 11 Episoden fällig", en: "n = 11 episodes due" },
    info: {
      was: {
        de: "Sechs Monate nach jeder Beratungsepisode: Empfehlung umgesetzt, angepasst übernommen oder nicht genutzt — plus ein Satz warum. Angepasste Übernahme zählt als Erfolg: Der Partner hat sich den Rat angeeignet.",
        en: "Six months after each advisory episode: recommendation implemented, adapted, or not used — plus one sentence why. Adapted uptake counts as success: the partner has appropriated the advice.",
      },
      warum: {
        de: "Die härteste Qualitätszahl der Beratung: Ein Rat, der nicht verwendet wird, hatte keine Qualität. Implementierungsverfolgung gilt in der Forschung als eigenständige Messgröße (Levishchenko 2020; Ahouandjinou 2026). Genau diese Frage stellt das Programm-M&E strukturell nie — es misst Wirkungen, nicht die Verwendung von Rat.",
        en: "The hardest quality figure for advisory: advice that is not used had no quality. Implementation tracking is treated in the literature as a standalone measure (Levishchenko 2020; Ahouandjinou 2026). Programme M&E structurally never asks this question — it measures outcomes, not the use of advice.",
      },
      wie: {
        de: "Kalendergetriggerte Wiedervorlage aus dem Episodenregister; Partner- und AV-Angabe gegeneinander; Warum-Sätze gehen an die Evidence & ToC Engine.",
        en: "Calendar-triggered follow-up from the episode register; partner and AV statement cross-checked; 'why' sentences feed the Evidence & ToC Engine.",
      },
      verworfen: null,
    },
  },
  {
    id: "peer_review",
    pkg: "beratungsqualitaet",
    name: { de: "Peer-Review-Rating", en: "Peer review rating" },
    unit: { de: "1–5", en: "1–5" },
    unitShort: { de: "Pkt", en: "pts" },
    format: "score",
    direction: "higher_better",
    nLabel: { de: "n = 6 Produkte je Halbjahr", en: "n = 6 products per half-year" },
    info: {
      was: {
        de: "Zwei Beratungsprodukte je Cluster und Halbjahr, bewertet nach fünf Kriterien: Evidenzbasis, Problemschärfe, Kontextpassung, Umsetzbarkeit, Klarheit — mit Pflicht-Begründungssatz je Kriterium.",
        en: "Two advisory products per cluster and half-year, rated on five criteria: evidence base, problem sharpness, context fit, feasibility, clarity — with a mandatory justification sentence per criterion.",
      },
      warum: {
        de: "Das Fachurteil als strukturierte Stichprobe. Primär ein Standardsetzungs-Instrument: Das Kriterienraster definiert erstmals, was gute Beratung bei GIZ Jordan heißt. Deklariert als Richtungssignal, nicht als Kennzahl im statistischen Sinn — die Fallzahl ist dafür zu klein, und das sagen wir offen.",
        en: "Expert judgment as a structured sample. Primarily a standard-setting instrument: the criteria grid defines for the first time what good advice at GIZ Jordan means. Declared as a directional signal, not a metric in the statistical sense — the sample is too small, and we say so openly.",
      },
      wie: {
        de: "Zufallsauswahl durch den Steward aus dem Episodenregister — die bewertete Einheit wählt nie selbst (kein Rosinenpicken). Bögen archiviert.",
        en: "Random selection by the steward from the episode register — the unit assessed never chooses itself (no cherry-picking). Forms archived.",
      },
      verworfen: null,
    },
  },
  {
    id: "mechanismus",
    pkg: "struktur",
    name: { de: "Mechanismus-Beteiligung", en: "Mechanism participation" },
    tabLabel: { de: "Gesamt", en: "Total" },
    unit: { de: "% Episoden mit Struktur-Beteiligung", en: "% episodes with structure involvement" },
    unitShort: { de: "%", en: "%" },
    format: "percent",
    direction: "higher_better",
    nLabel: { de: "n = 14 Episoden", en: "n = 14 episodes" },
    contextLine: {
      de: "Detail unterscheidet Practices und Machine Room; Board zeigt Gesamt (mindestens eine Struktur beteiligt).",
      en: "Detail splits Practices and Machine Room; board shows total (at least one structure involved).",
    },
    info: {
      was: {
        de: "Je Episode zwei Ja/Nein-Felder: Wurde ein Practice-Produkt genutzt? Hat der Machine Room zugearbeitet?",
        en: "Per episode two yes/no fields: Was a Practice product used? Did the Machine Room contribute?",
      },
      warum: {
        de: "Misst, ob die Struktur in der Beratungsarbeit ankommt (Struktur-Adoption). Analytisch bleibt die Kreuzung mit den Qualitätswerten aus Paket 2 erhalten (Dosis-Wirkung: Episoden mit vs. ohne Strukturbeteiligung) — sie ist der Beleg, dass Struktur und Qualität zusammenhängen. Die Paketzuordnung ist Anzeige-, nicht Daten-Logik. Inkrementalitätslogik statt Kausalbehauptung (Arman 2026); Implementierung und Verbesserung getrennt belegen (Raineri 2011).",
        en: "Measures whether the structure lands in advisory work (structure adoption). Analytically the cross with Package 1 quality values remains (dose-effect: episodes with vs. without structure involvement) — it is the evidence that structure and quality are linked. The package assignment is a display choice, not a data choice. Incrementality logic instead of causal claim (Arman 2026); implementation and improvement evidenced separately (Raineri 2011).",
      },
      wie: {
        de: "Zwei Felder im ohnehin ausgefüllten Episodenbogen; Plausibilisierung gegen die Anfragenlisten der Practices.",
        en: "Two fields in the episode form that is filled anyway; plausibility check against Practice request lists.",
      },
      verworfen: null,
    },
  },

  // ============ Paket 3 — Struktur-Effizienz ============
  {
    id: "fachzeit",
    pkg: "struktur",
    name: { de: "Freigesetzte Beratungsressourcen", en: "Freed advisory resources" },
    tabLabel: { de: "Verhältnis Beratung/Admin", en: "Advisory/admin ratio" },
    unit: { de: "% Fachzeit (Hauptwert) · Inhouse-Beratung % · Delivery-% (Zweitwerte)", en: "% expert time (primary) · inhouse advisory % · delivery % (secondary)" },
    unitShort: { de: "%", en: "%" },
    format: "percent",
    direction: "higher_better",
    scharnier: true,
    secondaryKpiIds: ["inhouse_beratungsquote", "delivery_quote"],
    nLabel: { de: "n = 9 Teams (aggregiert, n ≥ 5)", en: "n = 9 teams (aggregated, n ≥ 5)" },
    contextLine: {
      de: "Zeit · Substanz · Geld — drei Rechenwege, kein Index. Tabs: Verhältnis Beratung/Admin · Inhouse-Beratung · Direkte Wirkungsmittel.",
      en: "Time · substance · money — three calculations, no composite index. Tabs: advisory/admin ratio · inhouse advisory · direct impact funds.",
    },
    info: {
      was: {
        de: "Die Scharnier-Karte in drei Währungen. Hauptwert: Fachzeit-Quote — Anteil der Expertenzeit für fachliche Arbeit statt Administration (zweiwöchige Selbstprotokollierung, nur Team-Aggregate). Zweitwerte: Inhouse-Beratungsquote (Make-or-Buy: Anteil inhouse generierter Beratungsleistung, Euro-Basis) und Delivery-Quote (Anteil Auftragsmittel beim Partner). Zeit, Substanz, Geld — dieselbe Freisetzungsgeschichte, drei Rechenwege, bewusst kein Index.",
        en: "The hinge card in three currencies. Primary: expert-time share. Secondaries: inhouse advisory share (make-or-buy, in euros) and delivery share (partner). Time, substance, money — same story, three calculations, deliberately no index.",
      },
      warum: {
        de: "Die Scharnierzahl: Sie erklärt den Mechanismus, warum aus weniger mehr wird — die Struktur gibt Expertenzeit für Expertenarbeit frei. Ohne sie sind Qualität und Effizienz zwei unverbundene Behauptungen (Maister: Health- vor Hygiene-Faktoren; BCG: Reibung an Schnittstellen als größter Leistungsverlust). Keine individuelle Auslastungsmessung — Mitbestimmung, nur Aggregate ab n ≥ 5, keine Anreizkopplung.",
        en: "The hinge figure explains how less becomes more.",
      },
      wie: {
        de: "Standardprotokoll; Sprünge > 30 % gegen Vorperiode werden vom Steward rückgefragt.",
        en: "Standard log; jumps > 30 % vs. prior period are queried by the steward.",
      },
      verworfen: {
        de: "Geprüft und verworfen: individuelle Auslastung als Steuerungsgröße; gewichteter Index aus den drei Werten (Gewichtung wird Verhandlungsmasse).",
        en: "Rejected: individual utilisation; weighted index of the three values (weights become negotiable).",
      },
    },
  },
  {
    id: "inhouse_beratungsquote",
    pkg: "struktur",
    name: { de: "Inhouse-Anteil der Leistungserbringung", en: "Inhouse share of service delivery" },
    tabLabel: { de: "Inhouse-Beratung", en: "Inhouse advisory" },
    unit: { de: "% der Leistungserbringung inhouse (Euro-Basis)", en: "% of service delivery inhouse (euro basis)" },
    unitShort: { de: "%", en: "%" },
    format: "percent",
    direction: "higher_better",
    nLabel: {
      de: "Basis: Fach-Personalkosten + Consulting + Finanzierungen",
      en: "Base: expert payroll + consulting + financings",
    },
    contextLine: {
      de: "Zweitwert: Expertise-Substitution (nur Consulting im Nenner). Kein 100%-Ziel — Finanzierungen und externe Spitzenexpertise bleiben legitime Instrumente.",
      en: "Secondary: expertise substitution (consulting only in denominator). No 100 % target — financings and external top expertise remain legitimate instruments.",
    },
    voraussetzung: {
      de: "Rollen-Taxonomie (Voraussetzung 4) — die Fach-Personalkosten setzen die eingefrorene Zuordnung fachlich/administrativ voraus.",
      en: "Role taxonomy (precondition 4) — expert payroll requires the frozen role classification.",
    },
    info: {
      was: {
        de: "Hauptwert: interne Fach-Personalkosten ÷ (interne Fach-Personalkosten + Consulting-Ausgaben + Finanzierungen), Euro-Basis — wie viel der Leistungserbringung trägt die GIZ mit eigener Expertise, wie viel läuft über Consultants und Finanzierungsinstrumente? Zweitwert: Expertise-Substitution — dieselbe Rechnung nur mit Consulting-Ausgaben im Nenner (die schärfere Make-or-Buy-Aussage, unverzerrt vom Finanzierungsanteil des Portfolios).",
        en: "Primary: internal expert payroll ÷ (expert payroll + consulting + financings). Secondary: expertise substitution — same calculation with consulting only in the denominator.",
      },
      warum: {
        de: "Ein Expertenhaus definiert sich darüber, wie viel es selbst erbringt statt durchzuleiten — über Consultants wie über Finanzierungen. Der Hauptwert zeigt das Gesamtbild der Leistungserbringung; der Zweitwert isoliert die Expertise-Substitution, weil ein steigender Finanzierungsanteil im Portfoliomix den Hauptwert drücken kann, ohne dass sich am eigenen Beratungsanspruch etwas ändert — die Divergenz beider Werte ist selbst die Diagnose. Kein 100%-Ziel: gemessen wird die Richtung, kein Ideal.",
        en: "An expert house is defined by how much it delivers itself vs. passes through. Divergence between primary and secondary is itself the diagnosis.",
      },
      wie: {
        de: "Drei Finance-Zahlen: Fach-Personalkosten (lt. eingefrorener Rollen-Taxonomie), Consulting-Ausgaben und Finanzierungsvolumen aus den Vertrags- und Finanzübersichten. Keine Tagessatz-Umrechnung.",
        en: "Three finance figures: expert payroll, consulting spend, financing volume. No day-rate conversion.",
      },
      verworfen: {
        de: "Geprüft und verworfen: Berater-VZE ÷ Consultingbudget (Einheiten-Mix, Tagessatz manipulierbar); Berater-VZE-Anteil als Beweis-KPI (läuft als Diagnostik weiter); allgemeine Eigenleistungsquote (unspezifisch).",
        en: "Rejected: advisor FTE ÷ consulting budget; advisor FTE share as a proof KPI (kept as diagnostic).",
      },
    },
  },
  {
    id: "testvorgang",
    pkg: "struktur",
    diagnostik: true,
    name: { de: "Testvorgang", en: "Test procedure" },
    unit: { de: "Kalendertage", en: "calendar days" },
    unitShort: { de: "d", en: "d" },
    format: "days",
    direction: "lower_better",
    nLabel: {
      de: "1 identischer Vorgang je Quartal · 6 beteiligte Personen (Baseline 9)",
      en: "1 identical procedure per quarter · 6 people involved (baseline 9)",
    },
    info: {
      was: {
        de: "Ein identisch spezifizierter Vorgang (z. B. dieselbe Beschaffungsanfrage) läuft quartalsweise durchs System; gemessen werden Kalendertage bis Erledigung und Anzahl beteiligter Personen.",
        en: "One identically specified procedure (e.g. the same procurement request) runs quarterly through the system; calendar days to completion and number of people involved are measured.",
      },
      warum: {
        de: "Weil die Anforderung konstant ist, ist jede Veränderung Struktureffekt — der interne Vergleichsmaßstab, den wir ohne Kontrollgruppe sonst nicht haben (Pre/Post-Logik).",
        en: "Because the requirement is constant, every change is a structural effect — the internal benchmark we otherwise lack without a control group (pre/post logic).",
      },
      wie: {
        de: "Spezifikation schriftlich fixiert und eingefroren — sie wird nie angepasst (Goodhart-Disziplin); Steward dokumentiert Zeitstempel je Station.",
        en: "Specification written down and frozen — it is never adjusted (Goodhart discipline); steward records timestamps per station.",
      },
      verworfen: {
        de: "First-Time-Right-Quote als separater KPI gestrichen: Überlappung — beide messen Prozessreibung.",
        en: "First-time-right rate dropped as a separate KPI: overlap — both measure process friction.",
      },
    },
  },
  {
    id: "abflusstreue",
    pkg: "struktur",
    diagnostik: true,
    name: { de: "Abflusstreue", en: "Disbursement adherence" },
    unit: { de: "% Ist vs. Plan", en: "% actual vs. plan" },
    unitShort: { de: "%", en: "%" },
    format: "percent",
    direction: "higher_better",
    nLabel: { de: "Basis: Portfolio-Planabfluss", en: "Base: portfolio planned disbursement" },
    info: {
      was: {
        de: "Ist-Abfluss gegen Plan-Abfluss; Restmittelquote zum Jahresende als Zusatzangabe.",
        en: "Actual disbursement against planned disbursement; year-end residual funds ratio as additional figure.",
      },
      warum: {
        de: "Lokal steuerbare Effizienz in der Sprache von BMZ und Zentrale. Misst das Machine-Room-Versprechen direkt: Planbarkeit und Umsetzungsgeschwindigkeit statt Jahresend-Hektik und Mittelrückgabe.",
        en: "Locally controllable efficiency in the language of BMZ and HQ. Measures the Machine Room promise directly: predictability and delivery speed instead of year-end scramble and fund returns.",
      },
      wie: {
        de: "Eine Zahl aus dem Controlling-Bericht.",
        en: "One figure from the controlling report.",
      },
      verworfen: {
        de: "Ersatz für die verworfene Overhead-Quote: Diese ist in der GIZ administrativ gesetzt und für uns kein beweglicher Wert.",
        en: "Replacement for the rejected overhead ratio: that is administratively set within GIZ and is no movable value for us.",
      },
    },
  },
  {
    id: "schmerzpunkt",
    pkg: "struktur",
    name: { de: "Schmerzpunkt-Wiedervorlage", en: "Pain-point re-review" },
    unit: { de: "Ø 1 (gelöst) – 5 (unverändert)", en: "avg 1 (solved) – 5 (unchanged)" },
    unitShort: { de: "Pkt", en: "pts" },
    format: "score",
    direction: "lower_better",
    nLabel: {
      de: "n = 3 Cluster-Listen, identischer Teilnehmerkreis",
      en: "n = 3 cluster lists, identical participants",
    },
    info: {
      was: {
        de: "Die dokumentierten Wünsche aus dem Reach-In werden nach zwölf Monaten denselben Delegationen identisch wiedervorgelegt: Wie sehr ist das heute noch ein Problem? Neue Schmerzpunkte als offenes Zusatzfeld.",
        en: "The documented wishes from the Reach-In are re-presented identically to the same delegations after twelve months: How much of a problem is this today? New pain points as an open additional field.",
      },
      warum: {
        de: "Die Transformation misst sich an ihren eigenen Ausgangsschmerzen. Die Baseline entsteht im Reach-In kostenlos mit — und es ist das sichtbarste Versprechen an die Teams: Eure Beiträge verschwinden nicht.",
        en: "The transformation measures itself against its own starting pains. The baseline emerges for free during Reach-In — and it is the most visible promise to the teams: your input does not disappear.",
      },
      wie: {
        de: "Identische Liste, identischer Teilnehmerkreis, dokumentiert durch BT 3.",
        en: "Identical list, identical participants, documented by BT 3.",
      },
      verworfen: null,
    },
  },
  {
    id: "berater_vze_anteil",
    pkg: "struktur",
    diagnostik: true,
    name: { de: "Berater-VZE-Anteil", en: "Advisor FTE share" },
    unit: { de: "% der Gesamt-VZE in Fachrollen", en: "% of total FTE in expert roles" },
    unitShort: { de: "%", en: "%" },
    format: "percent",
    direction: "higher_better",
    nLabel: { de: "Basis: HR-Stellenübersicht (aggregiert)", en: "Base: HR headcount overview (aggregated)" },
    info: {
      was: {
        de: "Anteil der Vollzeitäquivalente in Berater-/Fachrollen an den Gesamt-VZE — die Struktur-Schicht der Freisetzung: Verschiebt sich die Organisation von Verwaltungs- zu Expertenrollen?",
        en: "Share of FTE in expert roles — structural layer of freed capacity.",
      },
      warum: {
        de: "Die Fachzeit-Quote misst nur das Verhalten vorhandener Fachkräfte; sie ist blind für die Personalstruktur. Erst beide Schichten zusammen ergeben das Bild. Nenner bewusst Gesamt-VZE, nicht Umsatz.",
        en: "Expert-time share is blind to headcount structure; both layers together tell the story.",
      },
      wie: {
        de: "Jährlich aus der HR-Stellenübersicht, aggregiert — bewertet werden Stellenkategorien, nie Personen. Voraussetzung: eingefrorene Rollen-Taxonomie.",
        en: "Annually from HR overview, aggregated. Precondition: frozen role taxonomy.",
      },
      verworfen: {
        de: "Geprüft und verworfen: Berater-VZE ÷ Umsatz (Portfoliomix-anfällig).",
        en: "Rejected: advisor FTE ÷ revenue (portfolio-mix biased).",
      },
    },
  },
];

// ---------------------------------------------------------------------------
// Package labels (Sektionsüberschriften — nicht in der Karte wiederholen)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Formatting helpers — one source of truth for value/unit rendering
// ---------------------------------------------------------------------------

export function decimalsFor(format: KpiFormat): number {
  return format === "score" ? 1 : 0;
}

/** Short unit suffix rendered on the card (leading thin space). Empty string yields no suffix. */
export function unitSuffix(kpi: KpiDef, locale: Locale): string {
  const u = kpi.unitShort[locale];
  return u ? `\u202F${u}` : "";
}

export function formatValue(v: number | null, kpi: KpiDef, locale: Locale): string {
  if (v === null || v === undefined || Number.isNaN(v)) return "—";
  const digits = decimalsFor(kpi.format);
  return `${fmtNumber(v, locale, digits)}${unitSuffix(kpi, locale)}`;
}

/** Arithmetic delta (current − baseline), signed. Independent of direction. */
export function formatDelta(
  v: number | null,
  baseline: number | null | undefined,
  kpi: KpiDef,
  locale: Locale,
): string {
  if (v === null || v === undefined || baseline === null || baseline === undefined) return "—";
  const d = v - baseline;
  const digits = decimalsFor(kpi.format);
  const sign = d > 0 ? "+" : d < 0 ? "−" : "±";
  const abs = Math.abs(d);
  return `${sign}${fmtNumber(abs, locale, digits)}${unitSuffix(kpi, locale)}`;
}
