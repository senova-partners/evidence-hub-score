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
      de: "Zahlt der externe Markt weiter für uns — durch Verlängerungen des Grundauftrags und durch gewonnene Angebote bei neuen Geldgebern?",
      en: "Does the external market keep paying for us — through extensions of the core commission and through proposals won with new funders?",
    },
    rechenwegKurz: {
      de: "Zwei Rechenwege nebeneinander: fortgeführtes Auftragsvolumen und gewonnenes Antragsvolumen, jeweils rollierend über 24 Monate — kein zusammengefasster Index.",
      en: "Two calculations side by side: continued commission volume and won proposal volume, each rolling over 24 months — no combined index.",
    },
  },
  "wiederbeauftragung:tab": {
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
  medien: {
    subtitle: {
      de: "Werden wir außerhalb der Auftraggeberbeziehung als fachliche Stimme wahrgenommen?",
      en: "Are we perceived as a substantive voice beyond the client relationship?",
    },
    rechenwegKurz: {
      de: "Engagement, Bekanntheitsgrad und Medienresonanz werden je auf 0–100 normalisiert (feste Referenzspannen) und gleichgewichtet gemittelt.",
      en: "Engagement, reach and media resonance are each normalised to 0–100 (fixed reference ranges) and averaged with equal weights.",
    },
  },
  "medien:tab": {
    subtitle: {
      de: "Wie steht die externe Sichtbarkeit insgesamt — über alle drei Teilwerte hinweg?",
      en: "How does external visibility stand overall — across all three components?",
    },
    rechenwegKurz: {
      de: "Index = (Engagement ÷ 6 % + (Follower − 2.000) ÷ 6.000 + Anteil positiv ÷ 100) ÷ 3 × 100, jeder Teilwert auf 0–100 gekappt.",
      en: "Index = (engagement ÷ 6 % + (followers − 2,000) ÷ 6,000 + positive share ÷ 100) ÷ 3 × 100, each component clipped to 0–100.",
    },
  },
  medien_engagement: {
    subtitle: {
      de: "Wie stark reagieren die Leserinnen und Leser auf unsere Beiträge?",
      en: "How strongly do readers react to our posts?",
    },
    rechenwegKurz: {
      de: "Reaktionen, Kommentare, Shares und Klicks geteilt durch Impressionen, impressionsgewichtet über alle Beiträge des Quartals.",
      en: "Reactions, comments, shares and clicks divided by impressions, impression-weighted across all posts in the quarter.",
    },
  },
  medien_reach: {
    subtitle: {
      de: "Wie viele Menschen folgen dem LinkedIn-Kanal von GIZ Jordan?",
      en: "How many people follow the GIZ Jordan LinkedIn channel?",
    },
    rechenwegKurz: {
      de: "Followerzahl des LinkedIn-Kanals zum letzten Tag des Quartals, Export aus LinkedIn Page Analytics.",
      en: "Follower count of the LinkedIn channel on the last day of the quarter, exported from LinkedIn page analytics.",
    },
  },
  medien_sentiment: {
    subtitle: {
      de: "Wie berichten Medien in Jordanien über die GIZ — positiv, neutral oder negativ?",
      en: "How do media in Jordan report on GIZ — positively, neutrally or negatively?",
    },
    rechenwegKurz: {
      de: "Jeder Medienbeitrag wird nach fixem Codierleitfaden eingestuft; Hauptwert ist der Anteil positiver Beiträge, neutral und negativ laufen als Kontext mit.",
      en: "Each media item is classified along a fixed coding guide; the primary value is the share of positive items, neutral and negative run as context.",
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
  leadership_review: {
    subtitle: {
      de: "Wie bewerten PFM/LD und die Cluster-Koordination die beiden Struktureinheiten — unabhängig von der Nachfrageseite?",
      en: "How do PFM/LD and the cluster coordination rate the two structural units — independently of the demand side?",
    },
    rechenwegKurz: {
      de: "Halbjährliche Bewertung je Struktureinheit auf einer Skala von 1 bis 5 durch PFM/LD und die CCs; Mittelwert je Einheit, keine Verrechnung mit der Peer-Bewertung.",
      en: "Bi-annual assessment per structural unit on a 1 to 5 scale by PFM/LD and the CCs; mean per unit, never merged with the peer rating.",
    },
  },
  "leadership_review:practices": {
    subtitle: {
      de: "Wie bewertet die Leitung die Leistungen der Practices?",
      en: "How does leadership rate the practices' services?",
    },
    rechenwegKurz: {
      de: "Mittelwert der halbjährlichen Bewertungen zu den Practices durch PFM/LD und die CCs (Skala 1–5).",
      en: "Mean of the bi-annual assessments of the practices by PFM/LD and the CCs (scale 1–5).",
    },
  },
  "leadership_review:machine_room": {
    subtitle: {
      de: "Wie bewertet die Leitung die Zuarbeit des Machine Room?",
      en: "How does leadership rate the machine room's contribution?",
    },
    rechenwegKurz: {
      de: "Mittelwert der halbjährlichen Bewertungen zum Machine Room durch PFM/LD und die CCs (Skala 1–5).",
      en: "Mean of the bi-annual assessments of the machine room by PFM/LD and the CCs (scale 1–5).",
    },
  },
  peer_review: {
    subtitle: {
      de: "Wie brauchbar finden die nutzenden Projekte die Leistungen von Practices und Machine Room?",
      en: "How usable do projects find the services of practices and the machine room for their advisory work?",
    },
    rechenwegKurz: {
      de: "Nach jeder Nutzung einer Practice-Leistung oder einer Machine-Room-Zuarbeit bewertet das Projekt die Nutzbarkeit für die konkrete Beratungsarbeit auf einer Skala von 1 bis 5; gewichteter Gesamtmittelwert über alle Bewertungen im Quartal.",
      en: "After each use of a practice deliverable or a machine room contribution, the project rates its usability for the concrete advisory work on a scale of 1 to 5; weighted overall mean across all ratings in the quarter.",
    },
  },

  // ---- Paket 2 — Struktur-Effizienz ----
  fachzeit: {
    subtitle: {
      de: "Setzt die Struktur Substanz für Beratung frei — mehr Zeit und mehr eigene Fachtiefe?",
      en: "Does the structure free up substance for advisory work — more time and more of our own expertise?",
    },
    rechenwegKurz: {
      de: "Zwei Werte nebeneinander in zwei Währungen (Zeit und Substanz), kein Index — Divergenz ist selbst diagnostisch.",
      en: "Two values side by side in two currencies (time and substance), no index — the divergence is itself diagnostic.",
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
      de: "Wieviel unseres Auftragsgeldes kommt beim Partner an — und verpufft nicht in Strukturkosten?",
      en: "How much of our commission money reaches the partner — and does not dissipate in structural costs?",
    },
    rechenwegKurz: {
      de: "Auftragsmittel minus Strukturkosten geteilt durch Auftragsmittel. Wir erben die Strukturkosten-Definition der GIZ Jordan aus 2024 (Cluster-Ebene) und erweitern sie um die Strukturkosten auf Projektebene.",
      en: "Commission funds minus structural costs divided by commission funds. We inherit the GIZ Jordan structural-cost definition from 2024 (cluster level) and extend it to project-level structural costs.",
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

  // ---- Sub-tabs of peer_review ----
  "peer_review:practices": {
    subtitle: {
      de: "Wie brauchbar erlebten die Projekte die Leistungen der Practices — waren die fachlichen Zuarbeiten für die Beratung tatsächlich hilfreich?",
      en: "How usable did projects find the practices' services — were the technical contributions actually helpful for advisory work?",
    },
    rechenwegKurz: {
      de: "Nutzbarkeit 1–5 und Fristentreue aus den Episoden; die Leitungssicht steht als eigenständiges KPI Leadership Review daneben — keine Aggregation, kein Index.",
      en: "Usability 1–5 and deadline reliability from the episodes; the leadership view stands beside it as the standalone Leadership Review KPI — no aggregation, no index.",
    },
  },
  "peer_review:machine_room": {
    subtitle: {
      de: "Wie brauchbar erlebten die Projekte die Zuarbeit des Machine Room — waren die administrativen Beiträge für die Beratung tatsächlich hilfreich?",
      en: "How usable did projects find the machine room's contribution — were the administrative inputs actually helpful for advisory work?",
    },
    rechenwegKurz: {
      de: "Nutzbarkeit 1–5 und Fristentreue aus den Episoden; die Leitungssicht steht als eigenständiges KPI Leadership Review daneben — keine Aggregation, kein Index.",
      en: "Usability 1–5 and deadline reliability from the episodes; the leadership view stands beside it as the standalone Leadership Review KPI — no aggregation, no index.",
    },
  },
};

/** Generic lookup — returns undefined when no copy is configured. */
export function kpiCopy(key: string | undefined): KpiCopy | undefined {
  if (!key) return undefined;
  return KPI_COPY[key];
}

// ---- Optional questionnaire block (source: config/scorecard_kpi_config.json → fragebogen) ----

export interface FragebogenFrage {
  nr: number;
  titel: Bi;
  frage: Bi;
  skala: Bi;
  zieltAuf: Bi;
}

export interface FragebogenAbschnitt {
  titel: Bi;
  frage: Bi;
  typ?: Bi;
  skala?: Bi;
  followups?: Bi[];
  hinweisInterviewer?: Bi;
  zieltAuf?: Bi;
}

export interface Fragebogen {
  title: Bi;
  intro: Bi;
  fragen?: FragebogenFrage[];
  abschnitte?: FragebogenAbschnitt[];
}

export const KPI_FRAGEBOGEN: Record<string, Fragebogen> = {
  partnerfeedback_jahr: {
    title: {
      de: "Jährlicher Partnerfeedback-Leitfaden",
      en: "Annual partner feedback interview guide",
    },
    intro: {
      de: "Halbstrukturiertes Interview, 45–60 Minuten, mit 2–3 Befragten je Organisation bei rund 10 zentralen Partnerorganisationen. Anonymisiert auf Organisationsebene ausgewertet. Interviewer ist bewusst nicht die betreuende Person aus der laufenden Zusammenarbeit.",
      en: "Semi-structured interview, 45–60 minutes, with 2–3 respondents per organisation at around 10 central partner organisations. Evaluated anonymously at organisation level. The interviewer is deliberately not the person managing the ongoing cooperation.",
    },
    abschnitte: [
      {
        titel: { de: "Öffnung — Veränderungswahrnehmung", en: "Opening — perception of change" },
        frage: {
          de: "Wenn Sie an die Zusammenarbeit mit GIZ in den letzten zwölf Monaten denken — was hat sich verändert im Vergleich zu den zwölf Monaten davor?",
          en: "Thinking of the cooperation with GIZ over the past twelve months — what has changed compared with the twelve months before?",
        },
        typ: { de: "offen", en: "open" },
        followups: [
          { de: "Was ist besser geworden?", en: "What got better?" },
          { de: "Was ist schlechter geworden?", en: "What got worse?" },
          { de: "Was ist gleich geblieben?", en: "What stayed the same?" },
        ],
        zieltAuf: {
          de: "Rahmen für alles Folgende; der Powerhouse-Anspruch ist der Veränderungsanspruch.",
          en: "Frames everything that follows; the powerhouse claim is a claim about change.",
        },
      },
      {
        titel: {
          de: "Credibility — ungestützte Expertise-Nennung",
          en: "Credibility — unprompted expertise mention",
        },
        frage: {
          de: "Wenn Sie an die drei bis fünf wichtigsten Fachfragen in Ihrem Bereich denken — welche Organisationen fallen Ihnen als kompetente Ansprechpartner ein?",
          en: "Thinking of the three to five most important technical questions in your field — which organisations come to mind as competent counterparts?",
        },
        typ: { de: "offen (ungestützt)", en: "open (unprompted)" },
        hinweisInterviewer: {
          de: "GIZ NICHT nennen. Spontane Antwort protokollieren. Wird GIZ ungestützt genannt, ist das ein starkes Credibility-Signal.",
          en: "Do NOT mention GIZ. Record the spontaneous answer. An unprompted mention of GIZ is a strong credibility signal.",
        },
        followups: [
          {
            de: "Und wenn Sie speziell an GIZ denken — für welche Themen sind wir für Sie erste Adresse, für welche eher nicht?",
            en: "And thinking specifically of GIZ — on which topics are we your first port of call, on which rather not?",
          },
        ],
      },
      {
        titel: { de: "Reliability — Verhaltensbeweis", en: "Reliability — behavioural evidence" },
        frage: {
          de: "Wie oft ist es in den letzten zwölf Monaten vorgekommen, dass GIZ eine Zusage nicht wie vereinbart eingehalten hat — bei Fristen, bei Umfängen, bei Zusagen zu Personen?",
          en: "How often in the past twelve months did GIZ fail to keep a commitment as agreed — on deadlines, on scope, on staffing commitments?",
        },
        typ: { de: "offen (Zählung)", en: "open (count)" },
        followups: [
          { de: "Welche Art von Zusagen war betroffen?", en: "Which kind of commitments were affected?" },
        ],
        zieltAuf: {
          de: "Absichtlich negativ formuliert, um Reliability nicht durch soziale Erwünschtheit zu inflieren.",
          en: "Deliberately phrased negatively so that social desirability does not inflate reliability.",
        },
      },
      {
        titel: { de: "Intimacy — Diskretionsanfragen", en: "Intimacy — discretionary requests" },
        frage: {
          de: "Gab es in den letzten zwölf Monaten Situationen, in denen Sie GIZ um Rat gefragt haben, obwohl es formal nicht in unserem Auftrag lag?",
          en: "Were there situations in the past twelve months in which you asked GIZ for advice although it formally fell outside our commission?",
        },
        typ: { de: "Anzahl", en: "count" },
        followups: [
          {
            de: "Wie viele solcher Situationen erinnern Sie insgesamt in diesem Zeitraum, bei allen Ihren Beratungspartnern?",
            en: "How many such situations do you recall in total in that period, across all your advisory partners?",
          },
        ],
        hinweisInterviewer: {
          de: "NICHT nach Inhalten fragen — die Diskretion muss geschützt bleiben. Nur Zählwerte.",
          en: "Do NOT ask about content — discretion must be protected. Counts only.",
        },
      },
      {
        titel: { de: "Self-Orientation — direkte Frage", en: "Self-orientation — direct question" },
        frage: {
          de: "Hatten Sie in den letzten zwölf Monaten den Eindruck, dass GIZ eigene institutionelle Interessen über die Ihres Ressorts gestellt hat?",
          en: "Did you have the impression in the past twelve months that GIZ put its own institutional interests above those of your department?",
        },
        typ: { de: "Skala 1–5", en: "scale 1–5" },
        skala: {
          de: "1 (nie) bis 5 (häufig) — niedrig ist gut",
          en: "1 (never) to 5 (often) — low is good",
        },
        followups: [
          { de: "Nur wenn Antwort > 2: In welchen Situationen?", en: "Only if answer > 2: in which situations?" },
        ],
      },
      {
        titel: {
          de: "Institutioneller Wandel — Powerhouse-Wahrnehmung",
          en: "Institutional change — powerhouse perception",
        },
        frage: {
          de: "Haben Sie in den letzten zwölf Monaten wahrgenommen, dass sich unsere interne Arbeitsweise verändert hat — schnellere Prozesse, breitere Expertise, klarere Ansprechpartner?",
          en: "Did you notice in the past twelve months that our internal way of working has changed — faster processes, broader expertise, clearer contacts?",
        },
        typ: { de: "offen", en: "open" },
        followups: [{ de: "Woran haben Sie das gemerkt?", en: "How did you notice?" }],
        zieltAuf: {
          de: "Direkte Prüfung der Powerhouse-Behauptung durch die, die es merken müssten.",
          en: "Direct test of the powerhouse claim by those who should notice it.",
        },
      },
      {
        titel: { de: "Zukunftsbindung", en: "Future commitment" },
        frage: {
          de: "Wenn Sie an die nächsten zwölf bis vierundzwanzig Monate denken — bei welchen Fragestellungen sehen Sie GIZ als selbstverständlichen Partner, bei welchen weniger?",
          en: "Thinking of the next twelve to twenty-four months — on which questions do you see GIZ as an obvious partner, on which less so?",
        },
        typ: { de: "offen", en: "open" },
        zieltAuf: {
          de: "Wiederbeauftragungsabsicht, aber weicher als reine Ja-Nein-Frage.",
          en: "Intent to re-commission, but softer than a plain yes/no question.",
        },
      },
      {
        titel: {
          de: "Schlussfrage — die eine ehrliche Nachfrage",
          en: "Closing question — the one honest ask",
        },
        frage: {
          de: "Wenn Sie mir eine Sache sagen sollten, die GIZ dringend anders machen müsste — was wäre das?",
          en: "If you had to tell me one thing GIZ urgently needs to do differently — what would it be?",
        },
        typ: { de: "offen", en: "open" },
        zieltAuf: {
          de: "Bewusst am Schluss; die Beziehung im Gespräch ist bis dahin so aufgebaut, dass ehrliche Antworten wahrscheinlicher sind.",
          en: "Deliberately last; by then the rapport in the conversation makes honest answers more likely.",
        },
      },
    ],
  },
  partnerbogen: {
    title: {
      de: "Partnerbogen je Beratungsepisode",
      en: "Partner form per advisory episode",
    },
    intro: {
      de: "Fünf Fragen, zwei bis drei Minuten Ausfüllzeit, direkt am Ende einer abgeschlossenen Beratungsleistung. Skala 1–5. Rücklaufquote wird als sechster Wert daneben ausgewiesen — als Meldetreue-Signal.",
      en: "Five questions, two to three minutes to complete, right at the end of a completed advisory service. Scale 1–5. The response rate is shown alongside as a sixth value — as a reporting-discipline signal.",
    },
    fragen: [
      {
        nr: 1,
        titel: { de: "Passgenauigkeit", en: "Fit" },
        frage: {
          de: "Wie gut hat die Beratung Ihre konkrete Fragestellung getroffen?",
          en: "How well did the advice address your specific question?",
        },
        skala: { de: "1 (gar nicht) bis 5 (sehr gut)", en: "1 (not at all) to 5 (very well)" },
        zieltAuf: {
          de: "Haben wir das beantwortet, was gefragt war, oder generisch beraten.",
          en: "Did we answer what was asked, or advise generically.",
        },
      },
      {
        nr: 2,
        titel: { de: "Fachliche Substanz", en: "Technical substance" },
        frage: {
          de: "Wie substanziell war der fachliche Beitrag im Vergleich zu dem, was Sie ohne uns erarbeitet hätten?",
          en: "How substantial was the technical contribution compared with what you would have developed without us?",
        },
        skala: {
          de: "1 (kein Mehrwert) bis 5 (deutlicher Mehrwert)",
          en: "1 (no added value) to 5 (clear added value)",
        },
        zieltAuf: {
          de: "Haben wir Mehrwert erbracht oder nur bestätigt, was schon klar war.",
          en: "Did we add value or merely confirm what was already clear.",
        },
      },
      {
        nr: 3,
        titel: { de: "Rechtzeitigkeit", en: "Timeliness" },
        frage: {
          de: "Kam die Beratung zu einem Zeitpunkt, an dem Sie sie nutzen konnten?",
          en: "Did the advice arrive at a point when you could use it?",
        },
        skala: { de: "1 (zu spät) bis 5 (rechtzeitig)", en: "1 (too late) to 5 (on time)" },
        zieltAuf: {
          de: "Haben wir geliefert bevor Entscheidungen gefallen waren, oder danach.",
          en: "Did we deliver before decisions were made, or after.",
        },
      },
      {
        nr: 4,
        titel: { de: "Umsetzbarkeit", en: "Actionability" },
        frage: {
          de: "Wie konkret war die Beratung — konnten Sie damit direkt weiterarbeiten?",
          en: "How concrete was the advice — could you work with it directly?",
        },
        skala: {
          de: "1 (abstrakt) bis 5 (direkt handlungsleitend)",
          en: "1 (abstract) to 5 (directly actionable)",
        },
        zieltAuf: {
          de: "Waren wir konkret handlungsleitend oder abstrakt.",
          en: "Were we concretely actionable or abstract.",
        },
      },
      {
        nr: 5,
        titel: { de: "Weiterempfehlung", en: "Recommendation" },
        frage: {
          de: "Würden Sie GIZ für eine vergleichbare Fragestellung erneut ansprechen?",
          en: "Would you approach GIZ again for a comparable question?",
        },
        skala: { de: "1 (nein) bis 5 (ja, sicher)", en: "1 (no) to 5 (yes, certainly)" },
        zieltAuf: {
          de: "Verkürzter Reichheld-Loyalitätsanker; kein klassisches NPS.",
          en: "Shortened Reichheld loyalty anchor; not a classic NPS.",
        },
      },
    ],
  },
};

/** Generic lookup — returns undefined when no questionnaire is configured. */
export function kpiFragebogen(key: string | undefined): Fragebogen | undefined {
  if (!key) return undefined;
  return KPI_FRAGEBOGEN[key];
}
