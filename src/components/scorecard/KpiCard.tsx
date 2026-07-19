import { Link } from "@tanstack/react-router";
import { kpiById, formatValue, formatDelta } from "@/lib/scorecard/kpis";
import { trend } from "@/lib/scorecard/verdict";
import { useT, useLocale } from "@/lib/scorecard/useT";
import { InfoPanel } from "./InfoPanel";
import { useStore, type Store } from "@/lib/scorecard/store";
import type { KpiValue } from "@/lib/scorecard/types";

const trendGlyph = { up: "↑", down: "↓", flat: "→", missing: "✕" } as const;

/**
 * Fixed 4-line template — same height across all cards.
 *   1  Title  + ⓘ
 *   2  Value  (formatted number + short unit; "—" if missing)
 *   3  Delta  vs baseline (or status "Meldung fehlt" if missing)
 *   4  Footer (baseline · n-label · flags)
 *
 * Long-form unit and context_line are intentionally NOT rendered here —
 * they live in the Info panel.
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
  const t = useT();
  const locale = useLocale();
  if (!kpi) return null;

  const v = value?.value ?? null;
  const tr = trend(kpiId, v, baseline);
  const missing = v === null;
  const flagged = value?.flagged;

  const trWord =
    tr === "up"
      ? locale === "de" ? "verbessert" : "improved"
      : tr === "down"
        ? locale === "de" ? "verschlechtert" : "declined"
        : tr === "flat"
          ? locale === "de" ? "stabil" : "stable"
          : locale === "de" ? "Meldung fehlt" : "report missing";

  const label = missing
    ? `${kpi.name[locale]}: ${trWord}`
    : `${kpi.name[locale]}, ${formatValue(v, kpi, locale)}, ${trWord} ggü. ${t(
        "baseline",
      )} ${formatValue(baseline ?? null, kpi, locale)}`;

  return (
    <div
      className={`hairline p-4 bg-card grid grid-rows-[auto_1fr_auto_auto] gap-2 min-h-[168px] ${
        kpi.scharnier ? "border-l-2 border-l-[color:var(--giz-red)]" : ""
      }`}
      aria-label={label}
    >
      {/* Row 1 — Title + Info */}
      <div className="flex items-start justify-between gap-2">
        <Link
          to="/app/kpi/$id"
          params={{ id: kpiId }}
          className="text-[14px] font-semibold hover:underline leading-snug"
        >
          {kpi.name[locale]}
          {kpi.scharnier && (
            <span className="ml-2 text-[11px] font-normal text-muted-foreground">
              · {t("scharnier")}
            </span>
          )}
        </Link>
        <InfoPanel kpiId={kpiId} />
      </div>

      {/* Row 2 — Value (uniform size across all cards) */}
      <div
        className={`text-[32px] font-semibold tabular-nums leading-none self-center ${
          missing ? "text-[color:var(--giz-red)]" : ""
        }`}
      >
        {missing ? "—" : formatValue(v, kpi, locale)}
      </div>

      {/* Row 3 — Delta or missing status */}
      <div className="text-[12px] tabular-nums">
        {missing ? (
          <span className="text-[color:var(--giz-red)] font-semibold">
            <span aria-hidden>✕</span> {t("missing")}
          </span>
        ) : (
          <span className="text-muted-foreground">
            <span aria-hidden>{trendGlyph[tr]}</span>{" "}
            {formatDelta(v, baseline, kpi, locale)} {t("vs_baseline")}
          </span>
        )}
      </div>

      {/* Secondary KPI (embedded in same card, e.g. Delivery-Quote inside Freigesetzte Ressourcen) */}
      {kpi.secondaryKpiId && <SecondaryLine primaryQuarter={value?.quarter} secondaryId={kpi.secondaryKpiId} />}

      {/* Row 4 — Footer */}
      <div className="flex items-center gap-2 text-[12px]">
        <span
          aria-hidden
          className={`inline-block w-2 h-2 rounded-full shrink-0 ${
            missing ? "bg-[color:var(--giz-red)]" : "bg-foreground"
          }`}
        />
        <span className="text-muted-foreground truncate">
          {`${t("baseline")} ${formatValue(baseline ?? null, kpi, locale)}`}
          {` · ${kpi.nLabel[locale]}`}
          {flagged ? ` · ${t("flagged")}` : ""}
        </span>
      </div>
    </div>
  );
}

function SecondaryLine({ primaryQuarter, secondaryId }: { primaryQuarter?: string; secondaryId: string }) {
  const locale = useLocale();
  const store = useStore((s: Store) => s);
  const kpi = kpiById(secondaryId);
  if (!kpi) return null;
  const q = primaryQuarter ?? store.session?.quarter;
  const v = q ? store.values[secondaryId]?.[q]?.value ?? null : null;
  const b = store.baselines[secondaryId];
  const tr = trend(secondaryId, v, b);
  const glyph = tr === "up" ? "↑" : tr === "down" ? "↓" : tr === "flat" ? "→" : "✕";
  return (
    <div className="text-[11px] hairline-t pt-2 flex items-baseline gap-2">
      <span className="text-muted-foreground uppercase tracking-wide text-[10px] shrink-0">
        {locale === "de" ? "Zweitwert" : "Secondary"} · {kpi.name[locale]}
      </span>
      <span className="tabular-nums font-semibold ml-auto">
        {v === null ? "—" : formatValue(v, kpi, locale)}
      </span>
      <span aria-hidden className="text-muted-foreground tabular-nums text-[10px]">
        {glyph} {formatDelta(v, b, kpi, locale)}
      </span>
    </div>
  );
}
