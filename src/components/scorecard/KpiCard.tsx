import { Link } from "@tanstack/react-router";
import { kpiById } from "@/lib/scorecard/kpis";
import { trend } from "@/lib/scorecard/verdict";
import { useLocale } from "@/lib/scorecard/useT";
import { InfoPanel } from "./InfoPanel";
import { useStore, type Store } from "@/lib/scorecard/store";
import type { KpiValue } from "@/lib/scorecard/types";
import {
  CARD_SUBTITLE,
  CARD_FOOTER_N,
  SECONDARY_LABEL,
  bareValue,
  bareDelta,
  bareBaseline,
} from "./board-presentation";

const trendGlyph = { up: "↗", down: "↘", flat: "→", missing: "✕" } as const;

/**
 * Board card — fixed five-slot template. Same height across all 9 cards,
 * value baseline aligned via fixed row sizing. Any overflow is clipped
 * (ellipsis on text rows) — the card never grows.
 *
 *   1  Title (truncate)               + ⓘ
 *   2  Subtitle (plain, muted, 13px, truncate)
 *   3  Value (bare number, uniform 36px, bottom-aligned in slot)
 *   4  Delta "↗ +0,3 seit Baseline"   or  "Meldung fehlt" (red)
 *   5  Footer "Baseline 3,6 · 14 Episoden" (truncate)
 */
export function KpiCard({
  kpiId,
  value,
  baseline,
}: {
  kpiId: string;
  value: KpiValue | undefined;
  baseline: number | undefined;
}) {
  const kpi = kpiById(kpiId);
  const locale = useLocale();
  const store = useStore((s: Store) => s);
  if (!kpi) return null;

  const v = value?.value ?? null;
  const tr = trend(kpiId, v, baseline);
  const missing = v === null;

  const subtitle = CARD_SUBTITLE[kpiId]?.[locale] ?? "";
  const footerN = CARD_FOOTER_N[kpiId]?.[locale] ?? "";
  const seitBaseline = locale === "de" ? "seit Baseline" : "since baseline";
  const meldungFehlt = locale === "de" ? "Meldung fehlt" : "Report missing";
  const letzteRunde = locale === "de" ? "Letzte Runde" : "Last round";

  // Footer text — special cases: missing values show "Letzte Runde"; scharnier
  // renders its two secondary values instead.
  let footerText = `${locale === "de" ? "Baseline" : "Baseline"} ${bareBaseline(
    baseline,
    kpi,
    locale,
  )}${footerN ? ` · ${footerN}` : ""}`;

  if (missing) {
    // "Letzte Runde 2,9 · Session 15.07." (peer_review). For any other missing
    // card we substitute the standard n-label after the baseline.
    const sessionHint =
      kpiId === "peer_review" ? (locale === "de" ? "Session 15.07." : "Session 15 Jul") : footerN;
    footerText = `${letzteRunde} ${bareBaseline(baseline, kpi, locale)}${
      sessionHint ? ` · ${sessionHint}` : ""
    }`;
  }

  // Scharnier: two secondary values compacted into the footer slot.
  const secondaryIds = kpi.secondaryKpiIds ?? (kpi.secondaryKpiId ? [kpi.secondaryKpiId] : []);
  if (secondaryIds.length > 0 && !missing) {
    const q = value?.quarter ?? store.session?.quarter;
    const parts = secondaryIds
      .map((sid) => {
        const sk = kpiById(sid);
        if (!sk) return null;
        const sv = q ? store.values[sid]?.[q]?.value ?? null : null;
        const label = SECONDARY_LABEL[sid]?.[locale] ?? sk.name[locale];
        return `${label} ${bareValue(sv, sk, locale)}`;
      })
      .filter(Boolean);
    if (parts.length > 0) footerText = parts.join(" · ");
  }

  const ariaLabel = missing
    ? `${kpi.name[locale]}: ${meldungFehlt}`
    : `${kpi.name[locale]}, ${bareValue(v, kpi, locale)}, ${bareDelta(v, baseline, kpi, locale)} ${seitBaseline}`;

  return (
    <div
      className="hairline bg-card overflow-hidden flex flex-col h-[236px] p-6"
      aria-label={ariaLabel}
    >
      {/* Row 1 — Title + Info (28px slot) */}
      <div className="flex items-start justify-between gap-2 h-7">
        <Link
          to="/app/kpi/$id"
          params={{ id: kpiId }}
          className="text-[14px] font-semibold hover:underline truncate leading-tight"
          title={kpi.name[locale]}
        >
          {kpi.name[locale]}
        </Link>
        <div className="shrink-0 -mt-1 -mr-1">
          <InfoPanel kpiId={kpiId} />
        </div>
      </div>

      {/* Row 2 — Subtitle (20px slot, 10px gap above) */}
      <div
        className="mt-[10px] h-5 text-[13px] leading-5 text-muted-foreground truncate"
        title={subtitle}
      >
        {subtitle}
      </div>

      {/* Row 3 — Value (fills remaining height, bottom-aligned for shared baseline) */}
      <div
        className={`mt-[10px] flex-1 flex items-end text-[36px] leading-none font-semibold tabular-nums ${
          missing ? "text-[color:var(--giz-red)]" : ""
        }`}
      >
        {bareValue(v, kpi, locale)}
      </div>

      {/* Row 4 — Delta / status (20px slot) */}
      <div className="mt-[10px] h-5 text-[12px] leading-5 truncate">
        {missing ? (
          <span className="text-[color:var(--giz-red)] font-semibold">{meldungFehlt}</span>
        ) : (
          <span className="text-muted-foreground tabular-nums">
            <span aria-hidden>{trendGlyph[tr]}</span> {bareDelta(v, baseline, kpi, locale)}{" "}
            {seitBaseline}
          </span>
        )}
      </div>

      {/* Row 5 — Footer (20px slot) */}
      <div
        className="mt-[10px] h-5 text-[12px] leading-5 text-muted-foreground truncate"
        title={footerText}
      >
        {footerText}
      </div>
    </div>
  );
}
