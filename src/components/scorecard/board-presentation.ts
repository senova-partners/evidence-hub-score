// Presentation-only helpers for the Beweis Board.
// Deliberately separate from src/lib/scorecard/kpis.ts (KPI content is frozen v1.x).
// These strings live here because they are UI copy tuned for the card layout —
// short, abbreviation-free, one line each.

import type { KpiDef, Locale } from "@/lib/scorecard/types";
import { fmtNumber } from "@/lib/scorecard/i18n";

/** One-line plain-language subtitle for each board card (row 2). */
export const CARD_SUBTITLE: Record<string, { de: string; en: string }> = {
  wiederbeauftragung: {
    de: "Anteil des fortgeführten Auftragsvolumens",
    en: "Share of continued commission volume",
  },
  kofi_proposal: {
    de: "Anteil erfolgreicher Angebote und Kofinanzierung",
    en: "Share of successful proposals and co-financing",
  },
  partnerfeedback_jahr: {
    de: "Saldo der Partner, die Verbesserung berichten",
    en: "Balance of partners reporting improvement",
  },
  partnerbogen: {
    de: "Zufriedenheit der Partner je Beratungsepisode",
    en: "Partner satisfaction per advisory episode",
  },
  uptake: {
    de: "Anteil umgesetzter Empfehlungen nach sechs Monaten",
    en: "Share of recommendations implemented after six months",
  },
  peer_review: {
    de: "Nutzbarkeit von Practice- und Machine-Room-Leistungen",
    en: "Usability of practice and machine room services",
  },
  leadership_review: {
    de: "Bewertung der Struktureinheiten durch PFM/LD und die CCs",
    en: "Assessment of the structural units by PFM/LD and the CCs",
  },
  fachzeit: {
    de: "Anteil der Expertenzeit für fachliche Arbeit",
    en: "Share of expert time spent on substantive work",
  },
  mechanismus: {
    de: "Anteil der Episoden mit Struktur-Beteiligung",
    en: "Share of episodes with structure involvement",
  },
  schmerzpunkt: {
    de: "Bewertung der Ausgangs-Schmerzpunkte im Jahresvergleich",
    en: "Rating of starting pain points in year comparison",
  },
};

/** Short, abbreviation-free base-of-measurement label for footer (row 5). */
export const CARD_FOOTER_N: Record<string, { de: string; en: string }> = {
  wiederbeauftragung: { de: "41,5 Mio € Volumen", en: "EUR 41.5 m volume" },
  kofi_proposal: { de: "21 Proposals", en: "21 proposals" },
  partnerfeedback_jahr: { de: "10 Organisationen", en: "10 organisations" },
  partnerbogen: { de: "14 Episoden", en: "14 episodes" },
  uptake: { de: "11 Episoden fällig", en: "11 episodes due" },
  peer_review: { de: "6 Bewertungen", en: "6 ratings" },
  leadership_review: { de: "6 Bewertungen halbjährlich", en: "6 assessments bi-annually" },
  fachzeit: { de: "9 Teams aggregiert", en: "9 teams aggregated" },
  mechanismus: { de: "14 Episoden", en: "14 episodes" },
  schmerzpunkt: { de: "3 Cluster-Listen", en: "3 cluster lists" },
};

/** Short label for the two secondary values embedded in the Scharnier footer. */
export const SECONDARY_LABEL: Record<string, { de: string; en: string }> = {
  inhouse_beratungsquote: { de: "Eigenanteil", en: "Own share" },
};

const decimalsFor = (fmt: KpiDef["format"]) => (fmt === "score" ? 1 : 0);

/**
 * Bare card value: number + % for percent, signed for delta, plain otherwise.
 * No "Pkt", no unit suffix on scores/scales.
 */
export function bareValue(v: number | null, kpi: KpiDef, locale: Locale): string {
  if (v === null || v === undefined || Number.isNaN(v)) return "—";
  const d = decimalsFor(kpi.format);
  if (kpi.format === "percent") return `${fmtNumber(v, locale, d)} %`;
  if (kpi.format === "delta") {
    const sign = v > 0 ? "+" : v < 0 ? "−" : "±";
    return `${sign}${fmtNumber(Math.abs(v), locale, d)}`;
  }
  return fmtNumber(v, locale, d);
}

/** Bare signed delta vs baseline — no unit repetition. */
export function bareDelta(
  v: number | null,
  baseline: number | null | undefined,
  kpi: KpiDef,
  locale: Locale,
): string {
  if (v === null || baseline === null || baseline === undefined) return "—";
  const diff = v - baseline;
  const d = decimalsFor(kpi.format);
  const sign = diff > 0 ? "+" : diff < 0 ? "−" : "±";
  return `${sign}${fmtNumber(Math.abs(diff), locale, d)}`;
}

/** Bare baseline value for footer — no % / no Pkt. */
export function bareBaseline(
  baseline: number | null | undefined,
  kpi: KpiDef,
  locale: Locale,
): string {
  if (baseline === null || baseline === undefined) return "—";
  const d = decimalsFor(kpi.format);
  if (kpi.format === "percent") return `${fmtNumber(baseline, locale, d)} %`;
  return fmtNumber(baseline, locale, d);
}
