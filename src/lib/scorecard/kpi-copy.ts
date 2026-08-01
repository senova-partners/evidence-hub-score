// Plain-language card copy: one subtitle sentence (what the card measures)
// and one "Rechenweg kurz" sentence (how the number is produced).
//
// Keys are either a KPI id (board-card level) or "<kpiId>:<subViewId>" for a
// sub-tab inside a detail view. Missing key = nothing rendered (generic).
// Source of truth: config/scorecard_kpi_config.json (subtitle / rechenweg_kurz).

import type { Bi } from "./i18n";

export interface KpiCopy {
  subtitle: Bi;
  rechenwegKurz: Bi;
}

export const KPI_COPY: Record<string, KpiCopy> = {
  // ---- Paket 3 — Außenbeweis ----
  wiederbeauftragung: {
    subtitle: {
      de: "Wie viel des ausgelaufenen Auftragsvolumens haben unsere Auftraggeber bei uns verlängert, aufgestockt oder als Folgemodul neu beauftragt?",
      en: "How much of the expiring commission volume did our clients extend, top up or re-commission as a follow-on module?",
    },
    rechenwegKurz: {
      de: "Fortgeführtes Auftragsvolumen geteilt durch das insgesamt zur Entscheidung stehende Volumen der letzten 24 Monate, erhoben nach den jährlichen Regierungskonsultationen.",
      en: "Continued commission volume divided by the total volume up for decision over the past 24 months, recorded after the annual government consultations.",
    },
  },
  kofi_proposal: {
    subtitle: {
      de: "Wie viel des Volumens, das wir bei neuen Geldgebern beantragt haben, wurde tatsächlich gewonnen?",
      en: "How much of the volume we applied for with new funders did we actually win?",
    },
    rechenwegKurz: {
      de: "Gewonnenes Antragsvolumen geteilt durch eingereichtes Antragsvolumen der letzten 24 Monate; Stückzahl-Quote und EU-Ausschnitt daneben.",
      en: "Won proposal volume divided by submitted proposal volume over the past 24 months; count rate and EU segment alongside.",
    },
  },
  partnerfeedback_jahr: {
    subtitle: {
      de: "Wie sehen unsere zentralsten Partnerorganisationen die Zusammenarbeit — schneller geworden, fachlich besser geworden, würden sie uns weiterempfehlen?",
      en: "How do our most central partner organisations see the cooperation — faster, technically better, would they recommend us?",
    },
    rechenwegKurz: {
      de: "Zwei bis drei Gespräche pro Organisation mit rund zehn Partnern, ausgewertet als Saldo aus 'besser' minus 'schlechter'; ungestützte Expertise-Nennungen als Zusatzdiagnostik.",
      en: "Two to three conversations per organisation with around ten partners, evaluated as the balance of 'better' minus 'worse'; unprompted expertise mentions as additional diagnostics.",
    },
  },

  // ---- Paket 1 — Beratungsqualität ----
  partnerbogen: {
    subtitle: {
      de: "Wie beurteilt der Partner unmittelbar nach einer abgeschlossenen Beratungsleistung, was er von uns bekommen hat?",
      en: "How does the partner judge what they received from us immediately after a completed advisory service?",
    },
    rechenwegKurz: {
      de: "Fünf-Fragen-Bogen, den jede abgeschlossene Beratungsepisode auslöst; Mittelwert der Bewertungen, Rücklaufquote als Pflichtangabe daneben.",
      en: "Five-question form triggered by every completed advisory episode; mean of the ratings, response rate as a mandatory figure alongside.",
    },
  },
  uptake: {
    subtitle: {
      de: "Wurde unsere Empfehlung nach sechs Monaten tatsächlich umgesetzt — ganz, teilweise, oder gar nicht?",
      en: "Was our recommendation actually implemented after six months — fully, partly, or not at all?",
    },
    rechenwegKurz: {
      de: "Umgesetzte plus angepasste Empfehlungen geteilt durch alle Empfehlungen, deren Umsetzung nach sechs Monaten fällig war; ausstehende zählen im Nenner mit.",
      en: "Implemented plus adapted recommendations divided by all recommendations due after six months; pending ones count in the denominator.",
    },
  },
  peer_review: {
    subtitle: {
      de: "Wie bewerten Kolleginnen und Kollegen aus anderen Clustern die fachliche Substanz unserer Beratungsprodukte?",
      en: "How do colleagues from other clusters rate the technical substance of our advisory products?",
    },
    rechenwegKurz: {
      de: "Halbjährliche Zufallsziehung von sechs Produkten, Bewertung durch ein cross-cluster Panel entlang fünf fachlicher Kriterien; Mittelwert je Runde.",
      en: "Half-yearly random draw of six products, rated by a cross-cluster panel along five technical criteria; mean per round.",
    },
  },

  // ---- Paket 2 — Struktur-Effizienz ----
  fachzeit: {
    subtitle: {
      de: "Setzt die Struktur Beratungssubstanz frei — in Zeit, Substanz und Geld?",
      en: "Does the structure free up advisory substance — in time, substance and money?",
    },
    rechenwegKurz: {
      de: "Drei Werte in drei Währungen, kein Index; ihre Divergenz ist selbst die Diagnose.",
      en: "Three values in three currencies, no index; their divergence is itself the diagnosis.",
    },
  },
  mechanismus: {
    subtitle: {
      de: "Wie oft ist unsere neue Struktur — Practices und Machine Room — tatsächlich Teil einer Beratungsleistung?",
      en: "How often is our new structure — practices and machine room — actually part of an advisory service?",
    },
    rechenwegKurz: {
      de: "Zwei Ja-Nein-Häkchen pro Beratungsepisode; Anteil der Episoden mit mindestens einer Struktur-Beteiligung, aufgeschlüsselt nach Practices und Machine Room.",
      en: "Two yes/no ticks per advisory episode; share of episodes with at least one structure involvement, broken down by practices and machine room.",
    },
  },
  schmerzpunkt: {
    subtitle: {
      de: "Ein Jahr nach dem Reach-In — sind die Schmerzpunkte, die die Cluster damals genannt haben, gelöst oder unverändert?",
      en: "One year after the reach-in — are the pain points the clusters named back then resolved or unchanged?",
    },
    rechenwegKurz: {
      de: "Dieselbe Reach-In-Liste, derselbe Teilnehmerkreis, ein Jahr später bewertet auf einer Fünferskala von 'gelöst' bis 'unverändert'; Mittelwert über alle Punkte aller Cluster-Listen.",
      en: "The same reach-in list, the same participants, rated one year later on a five-point scale from 'resolved' to 'unchanged'; mean across all points of all cluster lists.",
    },
  },

  // ---- Sub-tabs of kofi_proposal ----
  "kofi_proposal:volumen": {
    subtitle: {
      de: "Der Kernwert — wie viel Euro wir gewonnen haben, im Verhältnis zu wie viel wir beantragt haben.",
      en: "The core value — how many euros we won, relative to how much we applied for.",
    },
    rechenwegKurz: {
      de: "Gewonnene Millionen geteilt durch eingereichte Millionen, rollierend über 24 Monate.",
      en: "Won millions divided by submitted millions, rolling over 24 months.",
    },
  },
  "kofi_proposal:stueck": {
    subtitle: {
      de: "Die Ergänzung dazu — wie viele Anträge wir gewonnen haben, unabhängig davon, wie groß sie waren.",
      en: "The complement — how many proposals we won, regardless of their size.",
    },
    rechenwegKurz: {
      de: "Anzahl gewonnene Anträge geteilt durch Anzahl eingereichte Anträge. Divergenz zum Volumen ist selbst die Diagnose.",
      en: "Number of won proposals divided by number of submitted proposals. Divergence from volume is itself the diagnosis.",
    },
  },
  "kofi_proposal:eu": {
    subtitle: {
      de: "Dasselbe nur für EU-Ausschreibungen — Anschluss an die EU-Practice.",
      en: "The same for EU tenders only — linking to the EU practice.",
    },
    rechenwegKurz: {
      de: "EU-gewonnenes Volumen geteilt durch EU-eingereichtes Volumen, plus dieselbe Rechnung nach Stückzahl.",
      en: "EU volume won divided by EU volume submitted, plus the same calculation by count.",
    },
  },
  "kofi_proposal:kofinanzierung": {
    subtitle: {
      de: "Wie viel zusätzliches Geld haben wir über den BMZ-Grundauftrag hinaus mobilisiert?",
      en: "How much additional money did we mobilise beyond the BMZ core commission?",
    },
    rechenwegKurz: {
      de: "Kofinanzierungsvolumen geteilt durch BMZ-Grundauftrag; BMZ-Anteil am Gesamtportfolio als Kontextzeile daneben.",
      en: "Co-financing volume divided by the BMZ core commission; BMZ share of the total portfolio as a context row alongside.",
    },
  },

  // ---- Sub-tabs of fachzeit (Freigesetzte Beratungsressourcen) ----
  "fachzeit:tab": {
    subtitle: {
      de: "Wieviel Prozent unserer Beraterzeit gehen in Beratung — und nicht in Verwaltung?",
      en: "What share of our advisors' time goes into advisory work — and not into administration?",
    },
    rechenwegKurz: {
      de: "Zwei-Wochen-Selbstprotokoll der Berater pro Halbjahr, gemeldet ausschließlich als Team-Mittelwert ab fünf Personen; personengewichteter Durchschnitt über alle Teams.",
      en: "Two-week self-log by advisors per half-year, reported only as a team mean from five people upwards; person-weighted average across all teams.",
    },
  },
  inhouse_beratungsquote: {
    subtitle: {
      de: "Wieviel unserer Beratung machen wir selbst — statt sie zuzukaufen oder als Finanzierung weiterzugeben?",
      en: "How much of our advisory do we deliver ourselves — instead of buying it in or passing it on as financing?",
    },
    rechenwegKurz: {
      de: "Interne Fach-Personalkosten geteilt durch Fach-Personalkosten plus Consulting-Ausgaben plus Finanzierungen; daneben derselbe Wert ohne Finanzierungen als Vergleich.",
      en: "Internal expert payroll divided by expert payroll plus consulting spend plus financings; alongside, the same value excluding financings for comparison.",
    },
  },
  delivery_quote: {
    subtitle: {
      de: "Wieviel unseres Auftragsgeldes kommt beim Partner an — und verpufft nicht in interner Abwicklung?",
      en: "How much of our commission money reaches the partner — instead of dissipating in internal processing?",
    },
    rechenwegKurz: {
      de: "Auftragsmittel minus interne Abwicklungskosten, geteilt durch Auftragsmittel; die Kostenabgrenzung ist einmalig definiert und eingefroren.",
      en: "Commission funds minus internal processing costs, divided by commission funds; the cost delineation is defined once and frozen.",
    },
  },

  // ---- Sub-tabs of mechanismus ----
  "mechanismus:gesamt": {
    subtitle: {
      de: "Der Board-Wert — Anteil der Episoden, bei denen Practices oder Machine Room mitgewirkt haben.",
      en: "The board value — share of episodes in which practices or the machine room were involved.",
    },
    rechenwegKurz: {
      de: "Episoden mit mindestens einem Ja geteilt durch alle abgeschlossenen Episoden im Berichtsquartal.",
      en: "Episodes with at least one yes divided by all completed episodes in the reporting quarter.",
    },
  },
  "mechanismus:practices": {
    subtitle: {
      de: "Nur die Nutzung der thematischen Practice-Produkte — kommen unsere fachlichen Kompetenzzentren in der Beratung an?",
      en: "Only the use of thematic practice products — do our technical competence centres land in advisory work?",
    },
    rechenwegKurz: {
      de: "Episoden mit 'Practice-Produkt genutzt' geteilt durch alle Episoden; Plausibilisierung gegen die Anfragenlisten der Practices.",
      en: "Episodes with 'practice product used' divided by all episodes; plausibility-checked against the practices' request lists.",
    },
  },
  "mechanismus:machine_room": {
    subtitle: {
      de: "Nur die Zuarbeit des Machine Room — kommt die zentrale administrative Struktur in der Beratung an?",
      en: "Only the machine room's input — does the central administrative structure land in advisory work?",
    },
    rechenwegKurz: {
      de: "Episoden mit 'Machine-Room-Zuarbeit' geteilt durch alle Episoden; Plausibilisierung gegen die Vorgangslisten des Machine Room.",
      en: "Episodes with 'machine room input' divided by all episodes; plausibility-checked against the machine room's case lists.",
    },
  },
};

/** Generic lookup — returns undefined when no copy is configured. */
export function kpiCopy(key: string | undefined): KpiCopy | undefined {
  if (!key) return undefined;
  return KPI_COPY[key];
}
