import { Link } from "@tanstack/react-router";
import { kpiById } from "@/lib/scorecard/kpis";
import { kpiCopy } from "@/lib/scorecard/kpi-copy";
import { trend } from "@/lib/scorecard/verdict";
import { useLocale } from "@/lib/scorecard/useT";
import { InfoPanel } from "./InfoPanel";
import { Sparkline } from "./Sparkline";
import { kpiHistory } from "@/lib/scorecard/history";
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
 * Board card — fixed five-slot template. Whole card is a Link to the detail
 * route; the ⓘ button stops propagation. Row 3 pairs the bare value with a
 * per-card sparkline; the sparkline collapses on cards narrower than 260px.
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
  const history = kpiHistory(kpiId);

  const subtitle = kpiCopy(kpiId)?.subtitle[locale] ?? CARD_SUBTITLE[kpiId]?.[locale] ?? "";
  const seitBaseline = locale === "de" ? "seit Baseline" : "since baseline";
  const meldungFehlt = locale === "de" ? "Meldung fehlt" : "Report missing";

  // Baseline/Ziel/Zeitraum footer removed from the card — that context now
  // lives behind the ⓘ info panel. Only genuine secondary values stay.
  let footerText = "";

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
    <Link
      to="/app/kpi/$id"
      params={{ id: kpiId }}
      aria-label={ariaLabel}
      className="@container hairline-card bg-card overflow-hidden flex flex-col h-[264px] p-[30px] hover:bg-[color:var(--hover,transparent)] focus:outline focus:outline-1 focus:outline-[color:var(--giz-red)]"
    >
      {/* Row 1 — Title + Info */}
      <div className="flex items-start justify-between gap-2 h-7">
        <span
          className="text-[14px] font-semibold truncate leading-tight"
          title={kpi.name[locale]}
        >
          {kpi.name[locale]}
        </span>
        <div
          className="shrink-0 -mt-1 -mr-1"
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <InfoPanel kpiId={kpiId} />
        </div>
      </div>

      {/* Row 3 — Value + Sparkline (sparkline hidden below 260px card width) */}
      <div className="mt-[10px] flex-1 flex items-end justify-between gap-3">
        <span className="text-[40px] leading-none font-semibold tabular-nums">
          {bareValue(v, kpi, locale)}
        </span>
        {history.length >= 2 && (
          <span className="hidden @[260px]:inline-flex">
            <Sparkline history={history} />
          </span>
        )}
      </div>

      {/* Row 3b — Subtitle: fixed two-line slot, kept even when empty */}
      <div
        className="mt-[10px] h-[42px] text-[13px] font-normal leading-[21px] text-muted-foreground line-clamp-2"
        title={subtitle || undefined}
      >
        {subtitle}
      </div>

      {/* Row 4 — Delta / status (no trend arrow: the delta text carries it) */}
      <div className="mt-[10px] h-5 text-[12px] font-normal leading-5 truncate">
        {missing ? (
          <span className="text-[color:var(--giz-red)]">{meldungFehlt}</span>
        ) : (
          <span className="text-muted-foreground tabular-nums">
            {bareDelta(v, baseline, kpi, locale)} {seitBaseline}
          </span>
        )}
      </div>

      {/* Row 5 — Secondary values only (baseline context lives in the ⓘ panel) */}
      <div
        className="mt-[10px] h-5 text-[12px] font-normal leading-5 text-muted-foreground truncate"
        title={footerText || undefined}
      >
        {footerText}
      </div>
    </Link>
  );
}
