// Locale-aware period labels for the KPI time series.
// The stored period strings are German-flavoured ("Konsult. 2024/25",
// "2026 (Baseline)"). This module renders them for the active locale without
// touching the data, and unknown labels pass through unchanged.

import type { Locale } from "./types";

const PERIOD_REPLACEMENTS: Array<[RegExp, string]> = [
  [/Konsult\./g, "Consult."],
  [/\(Baseline\)/g, "(baseline)"],
  [/Reach-In/g, "Reach-in"],
  [/Wiedervorlage/g, "Follow-up"],
];

export function localizePeriod(period: string, locale: Locale): string {
  if (locale === "de") return period;
  return PERIOD_REPLACEMENTS.reduce((out, [re, to]) => out.replace(re, to), period);
}
