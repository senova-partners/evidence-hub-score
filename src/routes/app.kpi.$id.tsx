import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore, QUARTERS, type Store } from "@/lib/scorecard/store";
import { kpiById, PKG_LABEL, formatValue, formatDelta } from "@/lib/scorecard/kpis";
import { kpiDetail } from "@/lib/scorecard/kpi-details";
import { TrendChart } from "@/components/scorecard/TrendChart";
import { InfoPanel } from "@/components/scorecard/InfoPanel";
import { useT, useLocale } from "@/lib/scorecard/useT";
import { trend } from "@/lib/scorecard/verdict";

export const Route = createFileRoute("/app/kpi/$id")({
  component: KpiDetail,
});

const trendGlyph = { up: "↑", down: "↓", flat: "→", missing: "✕" } as const;

function KpiDetail() {
  const { id } = Route.useParams();
  const store = useStore((s: Store) => s);
  const t = useT();
  const locale = useLocale();
  const kpi = kpiById(id);
  if (!kpi) return <p>Unknown KPI.</p>;
  const detail = kpiDetail(id);

  const baseline = store.baselines[id];
  const data = QUARTERS.map((q) => ({
    quarter: q,
    value: store.values[id]?.[q]?.value ?? null,
  }));
  const current = store.values[id]?.[store.session!.quarter]?.value ?? null;
  const tr = trend(id, current, baseline);

  return (
    <div className="flex flex-col gap-8">
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
        <p className="text-[12px] text-muted-foreground mt-2">{kpi.nLabel[locale]}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Stat label={t("baseline")} value={formatValue(baseline ?? null, kpi, locale)} />
        <Stat label={store.session!.quarter} value={formatValue(current, kpi, locale)} />
        <Stat
          label={t("vs_baseline")}
          value={`${trendGlyph[tr]} ${formatDelta(current, baseline, kpi, locale)}`}
        />
      </div>

      {/* VERLAUF */}
      <Section title="Verlauf">
        <TrendChart data={data} baseline={baseline} label={kpi.name[locale]} />
      </Section>

      {/* ERHEBUNG */}
      {detail && (
        <Section title="Erhebung">
          <dl className="grid grid-cols-1 md:grid-cols-4 gap-6 text-[13px]">
            <Field label="Wer erhebt" value={detail.erhebung.owner} />
            <Field label="Wann" value={detail.erhebung.cadence} />
            <Field label="Wie" value={kpi.info.wie[locale]} />
            <Field label="Verifizierung" value={detail.erhebung.verifizierung} />
          </dl>
        </Section>
      )}

      {/* ROHDATEN */}
      {detail && (
        <Section title="Rohdaten">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px] tabular-nums">
              <thead>
                <tr className="hairline-b">
                  {detail.raw_schema.map((h) => (
                    <th
                      key={h}
                      className="text-left font-semibold py-2 pr-4 text-[12px] uppercase tracking-wide text-muted-foreground"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {detail.raw_rows.map((row, i) => (
                  <tr key={i} className="hairline-b">
                    {row.map((cell, j) => (
                      <td key={j} className="py-2 pr-4 align-top">
                        {String(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-[12px] text-muted-foreground">
            <span className="uppercase tracking-wide mr-2">Zählung</span>
            {Object.entries(detail.raw_summary).map(([k, v], i, arr) => (
              <span key={k}>
                <span className="text-foreground">{formatSummaryKey(k)}</span>{" "}
                <span className="tabular-nums">{v === null ? "—" : String(v)}</span>
                {i < arr.length - 1 ? " · " : ""}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* BERECHNUNG */}
      {detail && (
        <Section title="Berechnung">
          <div className="flex flex-col gap-4 text-[13px]">
            <div>
              <div className="text-[12px] uppercase tracking-wide text-muted-foreground mb-1">
                Formel
              </div>
              <div>{detail.formula_text}</div>
            </div>
            <div>
              <div className="text-[12px] uppercase tracking-wide text-muted-foreground mb-1">
                Rechenweg
              </div>
              <div className="font-mono text-[13px] tabular-nums whitespace-pre-wrap">
                {detail.worked_example}
              </div>
            </div>
          </div>
        </Section>
      )}
    </div>
  );
}

function formatSummaryKey(k: string): string {
  return k.replace(/_/g, " ") + ":";
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="hairline p-6">
      <h2 className="text-[13px] uppercase tracking-wide text-muted-foreground mb-4">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[12px] uppercase tracking-wide text-muted-foreground mb-1">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="hairline p-4">
      <div className="text-[12px] text-muted-foreground">{label}</div>
      <div className="text-[28px] font-semibold tabular-nums mt-1">{value}</div>
    </div>
  );
}
