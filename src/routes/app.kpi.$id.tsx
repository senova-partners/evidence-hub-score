import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore, QUARTERS, type Store } from "@/lib/scorecard/store";
import { kpiById, PKG_LABEL } from "@/lib/scorecard/kpis";
import { TrendChart } from "@/components/scorecard/TrendChart";
import { InfoPanel } from "@/components/scorecard/InfoPanel";
import { useT, useLocale } from "@/lib/scorecard/useT";
import { fmtNumber } from "@/lib/scorecard/i18n";
import { delta } from "@/lib/scorecard/verdict";

export const Route = createFileRoute("/app/kpi/$id")({
  component: KpiDetail,
});

function KpiDetail() {
  const { id } = Route.useParams();
  const store = useStore((s: Store) => s);
  const t = useT();
  const locale = useLocale();
  const kpi = kpiById(id);
  if (!kpi) return <p>Unknown KPI.</p>;

  const baseline = store.baselines[id];
  const data = QUARTERS.map((q) => ({
    quarter: q,
    value: store.values[id]?.[q]?.value ?? null,
  }));
  const current = store.values[id]?.[store.session!.quarter]?.value ?? null;
  const digits = kpi.unit === "score" ? 1 : 0;
  const d = delta(id, current, baseline);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link to="/app/board" className="text-[12px] text-muted-foreground hover:underline">
          ← {t("nav_board")}
        </Link>
        <div className="text-[12px] uppercase tracking-wide text-muted-foreground mt-3">
          {PKG_LABEL[kpi.pkg][locale]}
        </div>
        <div className="flex items-center gap-3 mt-1">
          <h1 className="text-[22px] font-semibold">{kpi.name[locale]}</h1>
          <InfoPanel kpiId={id} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Stat label={t("baseline")} value={fmtNumber(baseline ?? null, locale, digits)} unit={kpi.unit} />
        <Stat label={store.session!.quarter} value={fmtNumber(current, locale, digits)} unit={kpi.unit} />
        <Stat
          label={t("vs_baseline")}
          value={d !== null && d > 0 ? `+${fmtNumber(d, locale, digits)}` : fmtNumber(d, locale, digits)}
          unit={kpi.unit}
        />
      </div>

      <section className="hairline p-6">
        <h2 className="text-[13px] uppercase tracking-wide text-muted-foreground mb-4">
          {t("trend")}
        </h2>
        <TrendChart data={data} baseline={baseline} label={kpi.name[locale]} />
      </section>
    </div>
  );
}

function Stat({ label, value, unit }: { label: string; value: string; unit: string }) {
  const suf = unit === "%" ? " %" : unit === "days" ? " d" : "";
  return (
    <div className="hairline p-4">
      <div className="text-[12px] text-muted-foreground">{label}</div>
      <div className="text-[28px] font-semibold tabular-nums mt-1">
        {value}
        {value !== "—" ? suf : ""}
      </div>
    </div>
  );
}
