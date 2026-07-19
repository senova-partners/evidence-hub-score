import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore, type Store } from "@/lib/scorecard/store";
import { kpiById, PKG_LABEL, formatValue, formatDelta } from "@/lib/scorecard/kpis";
import { kpiDetail } from "@/lib/scorecard/kpi-details";
import { kpiHistory } from "@/lib/scorecard/history";
import { TrendChart } from "@/components/scorecard/TrendChart";
import { InfoPanel } from "@/components/scorecard/InfoPanel";
import { useT, useLocale } from "@/lib/scorecard/useT";
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
            return (
              <button
                key={k.id}
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
                {(k.tabLabel ?? k.name)[locale]}
              </button>
            );
          })}
        </div>
      )}

      <KpiTabPanel key={active.id} kpi={active} />
    </div>
  );
}

function KpiTabPanel({ kpi }: { kpi: KpiDef }) {
  const store = useStore((s: Store) => s);
  const t = useT();
  const locale = useLocale();
  const detail = kpiDetail(kpi.id);
  const baseline = store.baselines[kpi.id];
  const history = kpiHistory(kpi.id);
  const current = store.values[kpi.id]?.[store.session!.quarter]?.value ?? null;
  const tr = trend(kpi.id, current, baseline);
  const voraussetzung = kpi.voraussetzung?.[locale];

  // Data completeness gate: a tab is only "complete" when a detail config
  // exists AND the history series carries at least one real point.
  const historyHasData = history.length > 0 && history.some((p) => p.value != null);
  const missing: string[] = [];
  if (!detail) missing.push("Detail-Konfiguration");
  if (!historyHasData) missing.push("Verlaufsdaten");

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
            ✕ Meldung fehlt
          </div>
          <div>
            Für <span className="font-semibold">{kpi.name[locale]}</span> liegen noch keine{" "}
            {missing.join(" und ")} vor. Sobald die Meldung eingeht, erscheinen hier Verlauf,
            Erhebung, Rohdaten und Berechnung.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <p className="text-[12px] text-muted-foreground -mt-4">{kpi.nLabel[locale]}</p>


      {voraussetzung && (
        <div
          role="note"
          className="hairline p-4 text-[13px]"
          style={{ borderLeft: "3px solid var(--giz-red)" }}
        >
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">
            Voraussetzung
          </div>
          {voraussetzung}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Stat label={t("baseline")} value={formatValue(baseline ?? null, kpi, locale)} />
        <Stat label={store.session!.quarter} value={formatValue(current, kpi, locale)} />
        <Stat
          label={t("vs_baseline")}
          value={`${trendGlyph[tr]} ${formatDelta(current, baseline, kpi, locale)}`}
        />
      </div>

      <Section title="Verlauf">
        <TrendChart history={history} baseline={baseline} label={kpi.name[locale]} />
      </Section>

      {detail && (
        <Section title="Erhebung">
          <dl className="grid grid-cols-1 md:grid-cols-4 gap-6 text-[13px]">
            <Field label="Wer erhebt" value={detail.erhebung.owner} />
            <Field label="Wann" value={detail.erhebung.cadence} />
            <Field
              label="Wie (Methode)"
              value={detail.erhebung.methode ?? kpi.info.wie[locale]}
            />
            <Field label="Verifizierung (Prüfregel)" value={detail.erhebung.verifizierung} />
          </dl>
        </Section>
      )}

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
