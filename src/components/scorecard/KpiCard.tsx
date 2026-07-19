import { Link } from "@tanstack/react-router";
import { kpiById, formatValue, formatDelta } from "@/lib/scorecard/kpis";
import { trend } from "@/lib/scorecard/verdict";
import { useT, useLocale } from "@/lib/scorecard/useT";
import { InfoPanel } from "./InfoPanel";
import type { KpiValue } from "@/lib/scorecard/types";

const trendGlyph = { up: "↑", down: "↓", flat: "→", missing: "✕" } as const;

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
      ? locale === "de"
        ? "verbessert"
        : "improved"
      : tr === "down"
        ? locale === "de"
          ? "verschlechtert"
          : "declined"
        : tr === "flat"
          ? locale === "de"
            ? "stabil"
            : "stable"
          : locale === "de"
            ? "Meldung fehlt"
            : "report missing";

  const label = missing
    ? `${kpi.name[locale]}: ${trWord}`
    : `${kpi.name[locale]}, ${formatValue(v, kpi, locale)}, ${trWord} ggü. ${t(
        "baseline",
      )} ${formatValue(baseline ?? null, kpi, locale)}`;

  return (
    <div
      className={`hairline p-4 flex flex-col gap-2 bg-card ${
        kpi.scharnier ? "border-l-2 border-l-[color:var(--giz-red)]" : ""
      }`}
      aria-label={label}
    >
      {/* Package label deliberately NOT repeated — lives in the section heading. */}
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

      {missing ? (
        <div className="flex items-baseline gap-3 mt-1">
          <div className="text-[28px] font-semibold leading-none text-[color:var(--giz-red)]">
            ✕
          </div>
          <div className="text-[13px] text-[color:var(--giz-red)] font-semibold">
            {t("missing")}
          </div>
        </div>
      ) : (
        <div className="flex items-baseline gap-3 mt-1">
          <div className="text-[28px] font-semibold tabular-nums leading-none">
            {formatValue(v, kpi, locale)}
          </div>
          <div className="text-[12px] text-muted-foreground tabular-nums">
            <span aria-hidden>{trendGlyph[tr]}</span>{" "}
            {formatDelta(v, baseline, kpi, locale)} {t("vs_baseline")}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 text-[12px] mt-1">
        <span
          aria-hidden
          className={`inline-block w-2 h-2 rounded-full ${
            missing ? "bg-[color:var(--giz-red)]" : "bg-foreground"
          }`}
        />
        <span className="text-muted-foreground">
          {missing
            ? t("missing")
            : `${t("baseline")} ${formatValue(baseline ?? null, kpi, locale)}`}
          {` · ${kpi.nLabel[locale]}`}
          {flagged ? ` · ${t("flagged")}` : ""}
        </span>
      </div>

      {kpi.contextLine && !missing && (
        <div className="text-[11px] text-muted-foreground italic">
          {kpi.contextLine[locale]}
        </div>
      )}
    </div>
  );
}
