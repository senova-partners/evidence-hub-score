import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore, type Store } from "@/lib/scorecard/store";
import { kpiById, PKG_LABEL, formatValue, formatDelta } from "@/lib/scorecard/kpis";
import { kpiCopy } from "@/lib/scorecard/kpi-copy";
import { kpiDetailLocalized, summaryKeyLabel } from "@/lib/scorecard/kpi-details";
import { kpiHistory, type HistoryPoint } from "@/lib/scorecard/history";
import { MECHANISMUS_VIEWS, type MechanismusView } from "@/lib/scorecard/mechanismus-views";
import { KOFI_VIEWS, PIPELINE_SUMMARY, type KofiView } from "@/lib/scorecard/kofi-views";
import { TrendChart } from "@/components/scorecard/TrendChart";
import { InfoPanel } from "@/components/scorecard/InfoPanel";
import { useT, useLocale } from "@/lib/scorecard/useT";
import { pick, fmtDecimal } from "@/lib/scorecard/i18n";
import { trend } from "@/lib/scorecard/verdict";
import type { KpiDef } from "@/lib/scorecard/types";

export const Route = createFileRoute("/app/kpi/$id")({
  component: KpiDetailPage,
});

const trendGlyph = { up: "↑", down: "↓", flat: "→", missing: "✕" } as const;

/** Card-level context lines for hinge cards with multiple currencies. */
const CONTEXT_LINE: Record<string, { de: string; en: string }> = {
  fachzeit: {
    de: "Drei Währungen derselben Freisetzung: Zeit · Substanz · Geld — drei Rechenwege, kein Index.",
    en: "Three currencies of the same release: time · substance · money — three calculations, no composite index.",
  },
};

function KpiDetailPage() {
  const { id } = Route.useParams();
  const t = useT();
  const locale = useLocale();
  const primary = kpiById(id);
  if (!primary) return <p>Unknown KPI.</p>;

  const secondaryIds =
    primary.secondaryKpiIds ??
    ((primary as KpiDef).secondaryKpiId ? [(primary as KpiDef).secondaryKpiId as string] : []);
  const tabIds = [primary.id, ...secondaryIds];
  const tabs = tabIds.map((tid) => kpiById(tid)).filter((k): k is KpiDef => !!k);
  const hasTabs = tabs.length > 1;
  const [activeId, setActiveId] = useState(primary.id);
  const active = tabs.find((k) => k.id === activeId) ?? primary;

  const context = CONTEXT_LINE[primary.id]?.[locale];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link to="/app/board" className="text-[12px] text-muted-foreground hover:underline">
          ← {t("nav_board")}
        </Link>
        <div className="text-[12px] uppercase tracking-wide text-muted-foreground mt-3">
          {PKG_LABEL[primary.pkg][locale]}
        </div>
        <div className="flex items-center gap-3 mt-1">
          <h1 className="text-[22px] font-semibold">{primary.name[locale]}</h1>
          <InfoPanel kpiId={primary.id} />
        </div>
        {context && <p className="text-[13px] text-muted-foreground mt-2">{context}</p>}
      </div>

      {hasTabs && (
        <div
          role="tablist"
          aria-label={primary.name[locale]}
          className="flex gap-6 hairline-b -mt-2"
        >
          {tabs.map((k) => {
            const isActive = k.id === activeId;
            const label = (k.tabLabel ?? k.name)[locale];
            return (
              <div key={k.id} className="flex items-center gap-2">
                <button
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveId(k.id)}
                  className={
                    "py-2 text-[13px] -mb-px border-b-2 " +
                    (isActive
                      ? "border-[color:var(--foreground)] text-foreground font-semibold"
                      : "border-transparent text-muted-foreground hover:text-foreground")
                  }
                >
                  {label}
                </button>
                {isActive && (
                  <InfoPanel
                    kpiId={k.id}
                    copyKey={k.id === primary.id ? `${k.id}:tab` : k.id}
                    title={label}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {active.id === "mechanismus" ? (
        <MechanismusPanel kpi={active} />
      ) : active.id === "kofi_proposal" ? (
        <KofiPanel kpi={active} />
      ) : (
        <KpiTabPanel key={active.id} kpi={active} />
      )}
    </div>
  );
}

function KpiTabPanel({
  kpi,
  overrides,
  preamble,
}: {
  kpi: KpiDef;
  overrides?: {
    baseline?: number | null;
    current?: number | null;
    history?: HistoryPoint[];
    workedExample?: string;
    subtitle?: string;
    rechenwegKurz?: string;
  };
  preamble?: React.ReactNode;
}) {
  const store = useStore((s: Store) => s);
  const t = useT();
  const locale = useLocale();
  const detail = kpiDetailLocalized(kpi.id, locale);
  const baseline = overrides?.baseline ?? store.baselines[kpi.id];
  const history = overrides?.history ?? kpiHistory(kpi.id);
  const current =
    overrides?.current ?? store.values[kpi.id]?.[store.session!.quarter]?.value ?? null;
  const tr = trend(kpi.id, current, baseline);
  const voraussetzung = kpi.voraussetzung?.[locale];

  // Data completeness gate: a tab is only "complete" when a detail config
  // exists AND the history series carries at least one real point.
  const historyHasData = history.length > 0 && history.some((p) => p.value != null);
  const missing: string[] = [];
  if (!detail) missing.push(t("d_missing_detail_config"));
  if (!historyHasData) missing.push(t("d_missing_history"));

  if (missing.length > 0) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-[12px] text-muted-foreground">{kpi.nLabel[locale]}</p>
        <div
          role="alert"
          className="hairline p-6 text-[13px]"
          style={{ borderLeft: "3px solid var(--giz-red)" }}
        >
          <div
            className="text-[12px] uppercase tracking-wide mb-2"
            style={{ color: "var(--giz-red)" }}
          >
            {t("d_missing_headline")}
          </div>
          <div>
            {t("d_missing_prefix")} <span className="font-semibold">{kpi.name[locale]}</span>{" "}
            {t("d_missing_body").replace("{missing}", missing.join(` ${t("d_and")} `))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <p className="text-[12px] text-muted-foreground -mt-4">{kpi.nLabel[locale]}</p>

      {preamble}

      {overrides?.subtitle && (
        <p className="text-[13px] -mt-4">{overrides.subtitle}</p>
      )}

      {overrides?.rechenwegKurz && (
        <p className="text-[13px] text-muted-foreground -mt-6">{overrides.rechenwegKurz}</p>
      )}



      {voraussetzung && (
        <div
          role="note"
          className="hairline p-4 text-[13px]"
          style={{ borderLeft: "3px solid var(--giz-red)" }}
        >
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">
            {t("d_voraussetzung")}
          </div>
          {voraussetzung}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Stat label={t("baseline")} value={formatValue(baseline ?? null, kpi, locale)} />
          <Stat label={store.session!.quarter} value={formatValue(current, kpi, locale)} />
          <Stat
            label={t("vs_baseline")}
            value={`${trendGlyph[tr]} ${formatDelta(current, baseline, kpi, locale)}`}
          />
        </div>
        {!overrides?.subtitle && (kpiCopy(`${kpi.id}:tab`) ?? kpiCopy(kpi.id)) && (
          <p className="text-[13px] text-muted-foreground">
            {(kpiCopy(`${kpi.id}:tab`) ?? kpiCopy(kpi.id))!.subtitle[locale]}
          </p>
        )}
        {!overrides?.rechenwegKurz && (kpiCopy(`${kpi.id}:tab`) ?? kpiCopy(kpi.id)) && (
          <p className="text-[13px] text-muted-foreground">
            {(kpiCopy(`${kpi.id}:tab`) ?? kpiCopy(kpi.id))!.rechenwegKurz[locale]}
          </p>
        )}
      </div>

      <Section title={t("sec_verlauf")}>
        <TrendChart history={history} baseline={baseline} label={kpi.name[locale]} />
      </Section>

      {detail && (
        <Section title={t("sec_erhebung")}>
          <dl className="grid grid-cols-1 md:grid-cols-4 gap-6 text-[13px]">
            <Field label={t("f_owner")} value={detail.erhebung.owner} />
            <Field label={t("f_when")} value={detail.erhebung.cadence} />
            <Field
              label={t("f_method")}
              value={detail.erhebung.methode ?? kpi.info.wie[locale]}
            />
            <Field label={t("f_verification")} value={detail.erhebung.verifizierung} />
          </dl>
        </Section>
      )}

      {detail && (
        <Section title={t("sec_rohdaten")}>
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
            <span className="uppercase tracking-wide mr-2">{t("d_counts")}</span>
            {Object.entries(detail.raw_summary).map(([k, v], i, arr) => (
              <span key={k}>
                <span className="text-foreground">{summaryKeyLabel(k, locale)}</span>{" "}
                <span className="tabular-nums">{v === null ? "—" : String(v)}</span>
                {i < arr.length - 1 ? " · " : ""}
              </span>
            ))}
          </div>
        </Section>
      )}

      {detail && (
        <Section title={t("sec_berechnung")}>
          <div className="flex flex-col gap-4 text-[13px]">
            <div>
              <div className="text-[12px] uppercase tracking-wide text-muted-foreground mb-1">
                {t("d_formula")}
              </div>
              <div>{detail.formula_text}</div>
            </div>
            <div>
              <div className="text-[12px] uppercase tracking-wide text-muted-foreground mb-1">
                {t("d_worked_example")}
              </div>
              <div className="font-mono text-[13px] tabular-nums whitespace-pre-wrap">
                {overrides?.workedExample ?? detail.worked_example}
              </div>
            </div>
          </div>
        </Section>
      )}
    </div>
  );
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

function MechanismusPanel({ kpi }: { kpi: KpiDef }) {
  const t = useT();
  const locale = useLocale();
  const [viewId, setViewId] = useState<MechanismusView["id"]>("gesamt");
  const view = MECHANISMUS_VIEWS.find((v) => v.id === viewId) ?? MECHANISMUS_VIEWS[0];

  const preamble = (
    <div
      role="tablist"
      aria-label={t("mech_views_label")}
      className="flex gap-6 hairline-b -mt-4"
    >
      {MECHANISMUS_VIEWS.map((v) => {
        const isActive = v.id === viewId;
        const label = pick(v.label, locale);
        return (
          <div key={v.id} className="flex items-center gap-2">
            <button
              role="tab"
              aria-selected={isActive}
              onClick={() => setViewId(v.id)}
              className={
                "py-2 text-[13px] -mb-px border-b-2 " +
                (isActive
                  ? "border-[color:var(--foreground)] text-foreground font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground")
              }
            >
              {label}
            </button>
            {isActive && (
              <InfoPanel kpiId={kpi.id} copyKey={`${kpi.id}:${v.id}`} title={label} />
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <KpiTabPanel
      key={view.id}
      kpi={kpi}
      preamble={preamble}
      overrides={{
        baseline: view.baseline,
        current: view.current,
        history: view.history,
        workedExample: pick(view.workedExample, locale),
        subtitle: kpiCopy(`${kpi.id}:${view.id}`)?.subtitle[locale] ?? pick(view.definition, locale),
        rechenwegKurz: kpiCopy(`${kpi.id}:${view.id}`)?.rechenwegKurz[locale],
      }}
    />
  );
}

function KofiPanel({ kpi }: { kpi: KpiDef }) {
  const t = useT();
  const locale = useLocale();
  const [viewId, setViewId] = useState<KofiView["id"]>("volumen");
  const view = KOFI_VIEWS.find((v) => v.id === viewId) ?? KOFI_VIEWS[0];

  const preamble = (
    <div
      role="tablist"
      aria-label={t("kofi_views_label")}
      className="flex gap-6 hairline-b -mt-4"
    >
      {KOFI_VIEWS.map((v) => {
        const isActive = v.id === viewId;
        const label = pick(v.label, locale);
        return (
          <div key={v.id} className="flex items-center gap-2">
            <button
              role="tab"
              aria-selected={isActive}
              onClick={() => setViewId(v.id)}
              className={
                "py-2 text-[13px] -mb-px border-b-2 " +
                (isActive
                  ? "border-[color:var(--foreground)] text-foreground font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground")
              }
            >
              {label}
            </button>
            {isActive && (
              <InfoPanel kpiId={kpi.id} copyKey={`${kpi.id}:${v.id}`} title={label} />
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      <KpiTabPanel
        key={view.id}
        kpi={kpi}
        preamble={preamble}
        overrides={{
          baseline: view.baseline,
          current: view.current,
          history: view.history,
          workedExample: pick(view.workedExample, locale),
          subtitle: kpiCopy(`${kpi.id}:${view.id}`)?.subtitle[locale] ?? pick(view.definition, locale),
          rechenwegKurz: kpiCopy(`${kpi.id}:${view.id}`)?.rechenwegKurz[locale],
        }}
      />
      <PipelineFooter />
    </>
  );
}

function PipelineFooter() {
  const t = useT();
  const locale = useLocale();
  const p = PIPELINE_SUMMARY;
  const mio = (v: number) => `${fmtDecimal(v, locale)} ${t("mio_eur")}`;
  const stages = [
    { key: "pipe_stage1", count: p.stage1.count, vol: p.stage1.volumeMio, unit: t("pipe_leads"), eu: null },
    { key: "pipe_stage2", count: p.stage2.count, vol: p.stage2.volumeMio, unit: t("pipe_leads"), eu: p.eu.stage2Count },
    { key: "pipe_stage3", count: p.stage3.count, vol: p.stage3.volumeMio, unit: t("pipe_contracts"), eu: p.eu.stage3Count },
  ];
  return (
    <section
      aria-labelledby="pipeline-heading"
      className="mt-8 hairline p-6 rounded-none bg-card"
    >
      <div className="flex items-baseline justify-between mb-3">
        <h3 id="pipeline-heading" className="text-[13px] font-semibold uppercase tracking-wider">
          {t("pipe_title")}
        </h3>
        <a
          href="/app/diagnostik#pipeline"
          className="text-[12px] text-muted-foreground hover:text-foreground underline underline-offset-4"
        >
          {t("pipe_link")}
        </a>
      </div>
      <p className="text-[12px] text-muted-foreground leading-relaxed mb-3">{t("pipe_intro")}</p>
      <div className="grid grid-cols-3 gap-4 text-[13px] tabular-nums">
        {stages.map((s) => (
          <div key={s.key} className="hairline p-3">
            <div className="text-[11px] text-muted-foreground uppercase tracking-wider">
              {t(s.key)}
            </div>
            <div className="text-[18px] font-semibold mt-1">
              {s.count} {s.unit}
            </div>
            <div className="text-[12px] text-muted-foreground">
              {mio(s.vol)}
              {s.eu != null ? ` \u00b7 ${t("pipe_of_which_eu")}: ${s.eu}` : ""}
            </div>
          </div>
        ))}
      </div>
      <div className="text-[12px] text-muted-foreground mt-3">
        {t("pipe_conv_volume")} · {p.conversionVolume}
      </div>
    </section>
  );
}
