// English overlay for KPI_DETAILS (src/lib/scorecard/kpi-details.ts).
// The German file stays the authoring source; this file mirrors it field by
// field. Anything missing here falls back to German at render time, so a new
// KPI never breaks the English view — it only shows untranslated content until
// its entry is added below (the i18n test flags that).

import type { KpiDetail } from "./kpi-details";

export type KpiDetailEn = Partial<Omit<KpiDetail, "erhebung">> & {
  erhebung?: Partial<KpiDetail["erhebung"]>;
};

export const KPI_DETAILS_EN: Record<string, KpiDetailEn> = {
  wiederbeauftragung: {
    raw_schema: ["Commission", "Cluster", "Volume (EUR m)", "Decision (consultation)", "Status"],
    raw_rows: [
      ["A-2025-011", "W&E", "4.2", "2026", "extended (+0.0)"],
      ["A-2025-014", "E&T", "3.1", "2026", "topped up (+1.4)"],
      ["A-2025-019", "GOV", "2.8", "2026", "ended"],
      ["A-2025-021", "W&E", "5.0", "2025", "follow-on module (5.5)"],
      ["…", "…", "…", "…", "Extract — full list held by JDU/BD"],
    ],
    formula_text:
      "(continued volume + top-ups + follow-on module volume) ÷ volume up for decision × 100, rolling 24 months, recorded after the government consultations. Number of commissions as context only (consolidation is not a loss).",
    worked_example:
      "(17.6 + 2.3 + 2.5) ÷ 41.5 = 22.4 ÷ 41.5 = 54 %  ·  Context: 14 of 28 commissions continued",
    erhebung: {
      owner: "JDU / BD",
      cadence:
        "annually after the government consultations, rolling over 24 months (two negotiation cycles); the rolling window absorbs empty years",
      verifizierung:
        "four-eyes check by Finance against the commission overview; volumes from contract files, no year qualified as “does not count”",
    },
  },

  kofi_proposal: {
    raw_schema: ["Proposal", "Donor", "Volume (EUR m)", "Result"],
    raw_rows: [
      ["P-26-03", "EU", "4.0", "won"],
      ["P-26-05", "BMZ special funds", "2.1", "won"],
      ["P-26-07", "EU", "3.5", "rejected"],
      ["P-26-09", "Third-party donor", "1.2", "open (not counted)"],
      ["…", "…", "…", "Extract — register held by BD, 21 proposals in 24 months"],
    ],
    formula_text:
      "Main value: won ÷ submitted volume × 100, rolling 24 months; open proposals count in neither numerator nor denominator. Secondary: count rate. EU shown separately (both bases), co-financing (co-fi volume ÷ core commission). Donor concentration as a context row without a target.",
    worked_example:
      "Volume: 7.9 ÷ 14.6 = 54 % · Count: 8 ÷ 21 = 38 % · EU: 4.0 ÷ 8.3 = 48 % (volume), 2 ÷ 6 = 33 % (count) · Co-fi: 6.2 ÷ 18.5 = 34 % · Reading 54 vs. 38: the large bids land, the small ones do not.",
    erhebung: {
      owner: "BD",
      cadence: "quarterly, rolling 24 months",
      verifizierung: "proposal register reconciled with Finance figures",
    },
  },

  partnerfeedback_jahr: {
    raw_schema: ["Organisation", "Level", "Q1 cooperation", "Q2 advice", "Q3 mentions (coded)"],
    raw_rows: [
      ["Ministry A", "working level", "better", "better", "P (climate finance)"],
      ["Ministry A", "leadership level", "better", "same", "U (project delivery)"],
      ["Agency C", "working level", "better", "better", "F (water data) ⚠ not in portfolio → pipeline"],
      ["Ministry of Planning", "leadership level", "same", "better", "P (EU programming)"],
      ["… (9 organisations, 22 interviews)", "…", "…", "…", "…"],
    ],
    formula_text:
      "Per organisation: median of the 2–3 respondents per question (on divergence the more conservative value; divergence is noted). Main value: balance of organisations better − worse (question 2). Expertise share: organisations with ≥1 substantive mention (P/F) ÷ organisations. Mentions are matched prospectively against pipeline and follow-on commissions.",
    worked_example:
      "Q2: 6 better − 1 worse = +5 · Expertise share: 7 ÷ 9 = 78 % · Match: mention “water data” (F) with no portfolio offer → handed to the pipeline as a lead",
    erhebung: {
      owner: "JDU (never the responsible AV); partner list set by AoA/CLT",
      cadence: "annually, identical partner list",
      verifizierung:
        "fixed interview guide (Partnerfeedback_Leitfaden.md), analysis at organisation level",
    },
  },

  delivery_quote: {
    raw_schema: ["Item", "Amount (EUR m)"],
    raw_rows: [
      [
        "⚠ Precondition",
        "Budget/OP structure must be split into internal-operational vs. impact-related — not available today",
      ],
      ["Total commission funds (year)", "24.0"],
      ["of which internal processing (cost centres per frozen boundary)", "4.8"],
      ["of which partner delivery", "19.2"],
    ],
    formula_text:
      "(commission funds − internal processing) ÷ commission funds × 100. The “internal processing” boundary is defined once and frozen.",
    worked_example: "(24.0 − 4.8) ÷ 24.0 = 19.2 ÷ 24.0 = 80 %",
    erhebung: {
      owner: "Finance",
      cadence: "annually",
      methode: "one annual figure from the cost-centre logic, after the frozen boundary",
      verifizierung:
        "internal processing / partner delivery boundary documented and frozen; four-eyes check by Finance; requires precondition 2 (budgets/OP split into internal-operational vs. impact-related)",
    },
  },

  inhouse_beratungsquote: {
    raw_schema: ["Item", "Amount (EUR m)"],
    raw_rows: [
      ["Internal expert staff costs (expert roles per taxonomy)", "4.8"],
      ["External consulting spend (subcontracts)", "2.4"],
      ["Financing (grants to implementing partners)", "4.7"],
      ["⚠ Precondition", "Role taxonomy defined and frozen (precondition 4)"],
    ],
    formula_text:
      "Main value (in-house share of delivery): expert staff costs ÷ (expert staff costs + consulting + financing) × 100. Secondary (expertise substitution): expert staff costs ÷ (expert staff costs + consulting) × 100. Divergence reading: if the main value falls while the secondary stays stable, the financing share of the portfolio is growing — no loss of substance; if both fall, expertise is being outsourced.",
    worked_example:
      "Main value: 4.8 ÷ (4.8 + 2.4 + 4.7) = 4.8 ÷ 11.9 = 40 %\nSecondary: 4.8 ÷ (4.8 + 2.4) = 4.8 ÷ 7.2 = 67 %\n\nReading: if the main value falls while the secondary stays stable, the financing share is growing — no loss of substance. If both fall, expertise is being outsourced.",
    erhebung: {
      owner: "Finance (expert staff costs + consulting spend + financing)",
      cadence: "annually",
      methode:
        "three Finance figures from contract and financial overviews (expert staff costs, consulting spend, financing volume)",
      verifizierung:
        "expert-role classification follows the frozen role taxonomy; no conversion via consultant days",
    },
  },

  partnerbogen: {
    raw_schema: [
      "Episode",
      "Cluster",
      "Q1 problem fit",
      "Q2 understanding",
      "Q3 timing",
      "Q4 feasibility",
      "Q5 recommendation",
      "Ø",
    ],
    raw_rows: [
      ["E-2026-031", "W&E", "4", "4", "3", "4", "4", "3.8"],
      ["E-2026-034", "GOV", "5", "4", "4", "4", "5", "4.4"],
      ["E-2026-036", "E&T", "3", "4", "3", "4", "3", "3.4"],
      ["…", "…", "…", "…", "…", "…", "…", "Extract from 14 responses"],
    ],
    formula_text:
      "Episode mean across Q1–Q5; KPI value = mean of the episode means (returned forms); response rate = returned ÷ sent. Full census: every episode closure triggers the form, no selection. Episode = advisory unit (occasion · recipient · result · period); definition and question wording in Episodenbogen_Partner.md.",
    worked_example: "54.6 ÷ 14 = 3.9 · Response rate: 14 ÷ 22 = 64 %",
    erhebung: {
      owner: "AV per episode",
      cadence: "after episode closure",
      verifizierung: "tokenised single-use link, steward overview",
    },
  },

  uptake: {
    raw_schema: ["Episode", "Recommendation (short)", "Status after 6 m", "Why (1 sentence)"],
    raw_rows: [
      ["E-2025-044", "Tariff model adjustment", "implemented", "Adopted in the draft budget"],
      ["E-2025-047", "Reporting data standard", "adapted", "Simplified variant introduced"],
      ["E-2025-049", "Delivery structure recommendation", "not used", "Political resistance in the board"],
      ["…", "…", "…", "Extract from 9 assessed (2 pending)"],
    ],
    formula_text:
      "(implemented + adapted) ÷ episodes due × 100. Adapted uptake counts as success. Pending cases stay in the denominator (honesty rule).",
    worked_example: "(4 + 2) ÷ 11 = 6 ÷ 11 = 55 %",
    erhebung: {
      owner: "AV / steward",
      cadence: "6 months after episode closure (calendar-triggered)",
      verifizierung: "partner and AV statements cross-checked",
    },
  },

  peer_review: {
    raw_schema: [
      "Product",
      "Cluster",
      "Evidence base",
      "Problem sharpness",
      "Context fit",
      "Feasibility",
      "Clarity",
      "Ø",
    ],
    raw_rows: [
      ["(H1 2027: draw done, session 15 Jul — report missing)", "", "", "", "", "", "", ""],
      ["Last round H2 2026:", "", "", "", "", "", "", ""],
      ["PR-26-01 water tariff review", "W&E", "3", "3", "4", "3", "3", "3.2"],
      ["PR-26-02 TVET curriculum concept", "E&T", "3", "2", "3", "3", "3", "2.8"],
      ["… (6 products per round)", "…", "…", "…", "…", "…", "…", "…"],
    ],
    formula_text:
      "Mean across 6 products (2 per cluster, randomly drawn by the steward from the episode register) × 5 criteria × panel mean per criterion.",
    worked_example:
      "H2 2026: sum of product means 17.4 ÷ 6 = 2.9. Current: report missing — no value is estimated.",
    erhebung: {
      owner: "Peer panel",
      cadence: "half-yearly",
      verifizierung: "random draw by the steward, forms archived",
    },
  },

  mechanismus: {
    raw_schema: ["Episode", "Practice product used?", "MR contribution?"],
    raw_rows: [
      ["E-2026-031", "yes", "no"],
      ["E-2026-032", "no", "yes"],
      ["E-2026-033", "yes", "yes"],
      ["E-2026-034", "no", "no"],
      ["… (14 episodes in total)", "…", "…"],
    ],
    formula_text:
      "Three views from the same two ticks per episode: total (at least one yes — board value), practices (practice product used), machine room (MR contribution). The split view shows WHICH part of the structure lands in advisory work — practices and MR can take hold at different speeds. The dose-effect crossing with quality values runs separately per view.",
    worked_example:
      "Total: (3 + 2 + 2) ÷ 14 = 50 % · Practices: (3 + 2) ÷ 14 = 36 % · Machine Room: (2 + 2) ÷ 14 = 29 %",
    erhebung: {
      owner: "AV per episode",
      cadence: "after episode closure",
      verifizierung: "plausibility check against the practices' request lists",
    },
  },

  fachzeit: {
    raw_schema: ["Team (anonymised)", "People (n)", "Expert-time share"],
    raw_rows: [
      ["Team 1", "6", "74 %"],
      ["Team 2", "7", "69 %"],
      ["Team 3", "5", "75 %"],
      ["… (9 teams in total, aggregates ≥ 5 people only)", "…", "…"],
    ],
    formula_text:
      "Person-weighted mean of the team aggregates. Individual logs never leave the team; reporting only as a team total.",
    worked_example: "3,888 percentage points ÷ 54 people = 72 %",
    erhebung: {
      owner: "Teams themselves (aggregate)",
      cadence: "two-week self-logging, quarterly reporting",
      methode:
        "uniform time category scheme; reported only as a person-weighted team aggregate",
      verifizierung:
        "n ≥ 5 per team; jumps > 30 percentage points against the previous period are queried by the steward",
    },
  },

  testvorgang: {
    raw_schema: ["Quarter", "Process (frozen spec)", "Start", "End", "Calendar days", "People involved"],
    raw_rows: [
      ["2026-Q3 (baseline)", "Procurement standard lot A", "07 Jul", "28 Jul", "21", "9"],
      ["2026-Q4", "identical", "06 Oct", "25 Oct", "19", "8"],
      ["2027-Q1", "identical", "12 Jan", "29 Jan", "17", "6"],
    ],
    formula_text:
      "Calendar days from intake to completion; secondary value: number of people involved. Specification frozen — any change is a structural effect.",
    worked_example: "End 29 Jan − start 12 Jan = 17 calendar days (baseline 21 → 4 days better)",
    erhebung: {
      owner: "Steward",
      cadence: "quarterly, 1 identical process",
      verifizierung: "written, frozen specification; timestamps at each station",
    },
  },

  abflusstreue: {
    raw_schema: ["Item", "Amount (EUR m)"],
    raw_rows: [
      ["Planned disbursement portfolio (year)", "21.4"],
      ["Actual disbursement (as of Q3)", "19.0"],
      ["Residual funds forecast year-end", "1.1"],
    ],
    formula_text:
      "Actual ÷ planned disbursement × 100. Residual funds share shown as an additional figure in the detail view.",
    worked_example: "19.0 ÷ 21.4 = 89 %",
    erhebung: {
      owner: "Finance / Controlling",
      cadence: "quarterly",
      verifizierung: "controlling report",
    },
  },

  schmerzpunkt: {
    raw_schema: ["Cluster", "Pain points (reach-in list)", "Ø today (1 solved – 5 unchanged)"],
    raw_rows: [
      ["W&E", "11 points", "2.5"],
      ["E&T", "9 points", "2.8"],
      ["GOV", "10 points", "2.8"],
      ["New pain points (extra field)", "4 named", "→ to BT 1"],
    ],
    formula_text:
      "Mean across all points of all cluster lists; identical list, identical group of participants as in the reach-in.",
    worked_example: "81 ÷ 30 = 2.7 (baseline 3.2 → 0.5 better)",
    erhebung: {
      owner: "BT 3",
      cadence: "12 months after reach-in, then annually",
      verifizierung: "identical list, identical group of participants",
    },
  },

  berater_vze_anteil: {
    raw_schema: ["Position category (taxonomy)", "FTE", "Classification"],
    raw_rows: [
      ["Sector planners/advisors national & international", "38.0", "expert"],
      ["Project administration & finance", "16.5", "administrative"],
      ["Mixed roles (e.g. officer 50/50 per share rule)", "8.0", "4.0 expert / 4.0 administrative"],
      ["Machine Room / service units", "9.5", "administrative (centralised)"],
      [
        "⚠ Precondition",
        "",
        "Role taxonomy must be defined and frozen — not cleanly available today",
      ],
    ],
    formula_text:
      "Expert FTE (incl. mixed-role shares per the frozen taxonomy) ÷ total FTE × 100. Context row without judgement: revenue per advisor FTE.",
    worked_example:
      "42.0 ÷ 72.0 = 58 % (baseline) · Context: EUR 21.0 m ÷ 42.0 = EUR 0.50 m per advisor FTE",
    erhebung: {
      owner: "HR (taxonomy with DAIO)",
      cadence: "annually",
      methode: "aggregated from the HR position overview; categories are assessed, not individuals",
      verifizierung:
        "precondition 4 (role taxonomy) frozen; mixed roles per the documented share rule",
    },
  },
};
