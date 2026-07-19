import { Link } from "@tanstack/react-router";
import { kpiById, PKG_LABEL } from "@/lib/scorecard/kpis";
import { fmtNumber } from "@/lib/scorecard/i18n";
import { delta, trend } from "@/lib/scorecard/verdict";
import { useT, useLocale } from "@/lib/scorecard/useT";
import { InfoPanel } from "./InfoPanel";
import type { KpiValue } from "@/lib/scorecard/types";

function unitSuffix(unit: string) {
  if (unit === "%") return " %";
  if (unit === "days") return " d";
  return "";
}

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
  const d = delta(kpiId, v, baseline);
  const tr = trend(kpiId, v, baseline);
  const missing = v === null;
  const flagged = value?.flagged;
  const digits = kpi.unit === "score" ? 1 : 0;

  const label = `${kpi.name[locale]}, ${fmtNumber(v, locale, digits)}${unitSuffix(kpi.unit)}, ${
    tr === "up" ? "verbessert" : tr === "down" ? "verschlechtert" : tr === "flat" ? "stabil" : "fehlt"
  } ggü. Baseline ${fmtNumber(baseline ?? null, locale, digits)}`;

  return (
    <div
      className={`hairline p-4 flex flex-col gap-2 bg-card ${
        kpi.scharnier ? "border-l-2 border-l-[color:var(--giz-red)]" : ""
      }`}
      aria-label={label}
    >
      <div className="flex items-start justify-between">
        <div className="text-[12px] text-muted-foreground uppercase tracking-wide">
          {PKG_LABEL[kpi.pkg][locale]}
        </div>
        <InfoPanel kpiId={kpiId} />
      </div>

      <Link
        to="/app/kpi/$id"
        params={{ id: kpiId }}
        className="text-[14px] font-semibold hover:underline"
      >
        {kpi.name[locale]}
        {kpi.scharnier && (
          <span className="ml-2 text-[11px] font-normal text-muted-foreground">
            · {t("scharnier")}
          </span>
        )}
      </Link>

      <div className="flex items-baseline gap-3 mt-1">
        <div className="text-[28px] font-semibold tabular-nums leading-none">
          {missing ? "—" : `${fmtNumber(v, locale, digits)}${unitSuffix(kpi.unit)}`}
        </div>
        <div className="text-[12px] text-muted-foreground tabular-nums">
          <span aria-hidden>{trendGlyph[tr]}</span>{" "}
          {missing
            ? t("missing")
            : `${d !== null && d > 0 ? "+" : ""}${fmtNumber(d, locale, digits)}${unitSuffix(kpi.unit)} ${t("vs_baseline")}`}
        </div>
      </div>

      <div className="flex items-center gap-2 text-[12px] mt-1">
        <span
          aria-hidden
          className={`inline-block w-2 h-2 rounded-full ${
            missing ? "bg-[color:var(--giz-red)]" : "bg-foreground"
          }`}
        />
        <span className="text-muted-foreground">
          {missing ? t("missing") : `${t("baseline")} ${fmtNumber(baseline ?? null, locale, digits)}${unitSuffix(kpi.unit)}`}
          {value?.n ? ` · n=${value.n}` : ""}
          {flagged ? ` · ${t("flagged")}` : ""}
        </span>
      </div>
    </div>
  );
}
