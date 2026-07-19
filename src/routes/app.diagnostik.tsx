import { createFileRoute } from "@tanstack/react-router";
import { useStore, type Store } from "@/lib/scorecard/store";
import { KPIS, formatValue, formatDelta } from "@/lib/scorecard/kpis";
import { useT, useLocale } from "@/lib/scorecard/useT";
import { trend } from "@/lib/scorecard/verdict";
import { PIPELINE_STAGES, conversion } from "@/lib/scorecard/pipeline";

export const Route = createFileRoute("/app/diagnostik")({
  component: Diagnostik,
});

function Diagnostik() {
  const store = useStore((s: Store) => s);
  const q = store.session!.quarter;
  const t = useT();
  const locale = useLocale();

  const rows = KPIS.map((k) => {
    const v = store.values[k.id]?.[q]?.value ?? null;
    const b = store.baselines[k.id];
    const tr = trend(k.id, v, b);
    return { k, v, b, tr };
  }).filter((r) => r.tr === "down" || r.tr === "missing");

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-[22px] font-semibold">{t("nav_diagnostik")}</h1>
        <p className="text-[13px] text-muted-foreground mt-1">
          {locale === "de"
            ? "Nur Abweichungen. Kontext-Zeilen zeigen, wo der Test klemmt."
            : "Deviations only. Context rows show where the test clamps."}
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="hairline p-6 text-[14px] text-muted-foreground">
          {locale === "de" ? "Keine Abweichungen in diesem Quartal." : "No deviations this quarter."}
        </div>
      ) : (
        <table className="w-full text-[13px]">
          <thead>
            <tr className="hairline-b text-left text-[12px] text-muted-foreground uppercase tracking-wide">
              <th className="py-2">KPI</th>
              <th className="py-2 text-right">{q}</th>
              <th className="py-2 text-right">Baseline</th>
              <th className="py-2 text-right">Δ</th>
              <th className="py-2 pl-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ k, v, b, tr }) => (
              <tr key={k.id} className="hairline-b">
                <td className="py-2">{k.name[locale]}</td>
                <td className="py-2 text-right tabular-nums">{formatValue(v, k, locale)}</td>
                <td className="py-2 text-right tabular-nums text-muted-foreground">
                  {formatValue(b ?? null, k, locale)}
                </td>
                <td className="py-2 text-right tabular-nums">
                  {formatDelta(v, b, k, locale)}
                </td>
                <td className="py-2 pl-4">
                  <span aria-hidden>{tr === "down" ? "↓" : "✕"}</span>{" "}
                  {tr === "down"
                    ? locale === "de"
                      ? "verschlechtert"
                      : "declined"
                    : t("missing")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Pipeline locale={locale} />
    </div>
  );
}

function Pipeline({ locale }: { locale: "de" | "en" }) {
  const [s1, s2, s3] = PIPELINE_STAGES;
  const c12 = conversion(s1, s2);
  const c23 = conversion(s2, s3);
  const fmt = (n: number) =>
    n.toLocaleString(locale === "de" ? "de-DE" : "en-US", { maximumFractionDigits: 1 });

  return (
    <section className="flex flex-col gap-4">
      <div>
        <div className="text-[12px] uppercase tracking-wide text-muted-foreground">
          {locale === "de" ? "Diagnostik · kein Beweis-KPI" : "Diagnostic · not a proof KPI"}
        </div>
        <h2 className="text-[16px] font-semibold mt-1">
          {locale === "de"
            ? "Akquise-Pipeline (EU & Drittmittel)"
            : "Acquisition pipeline (EU & third-party)"}
        </h2>
        <p className="text-[12px] text-muted-foreground mt-1 max-w-3xl">
          {locale === "de"
            ? "Erklärt KPI 2. Stagniert der Proposal-Erfolg, zeigt der Trichter, ob es am Anfang (keine Leads: Foresight-Problem) oder an der Konversion (Kapazität/Qualität) hakt. Bewusst kein Zielwert auf Stage 1 — Leads kosten nichts."
            : "Explains KPI 2. If proposal success stalls, the funnel shows whether the bottleneck is at the top (no leads: foresight problem) or in conversion (capacity/quality). Deliberately no target on stage 1 — leads are cheap."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-stretch">
        <StageCard stage={s1} locale={locale} fmt={fmt} />
        <Conversion
          label={locale === "de" ? "Konversion 1 → 2" : "Conversion 1 → 2"}
          c={c12}
          fmt={fmt}
        />
        <StageCard stage={s2} locale={locale} fmt={fmt} />
        <Conversion
          label={locale === "de" ? "Konversion 2 → 3" : "Conversion 2 → 3"}
          c={c23}
          fmt={fmt}
        />
        <StageCard stage={s3} locale={locale} fmt={fmt} />
      </div>

      <div className="text-[12px] text-muted-foreground max-w-3xl">
        {locale === "de"
          ? "Hygiene: Leads ohne Bewegung seit 2 Quartalen werden aktiv geschlossen — sonst verfettet Stage 1 und die Sicht lügt."
          : "Hygiene: leads with no movement for 2 quarters are actively closed — otherwise stage 1 bloats and the view lies."}
      </div>
    </section>
  );
}

function StageCard({
  stage,
  locale,
  fmt,
}: {
  stage: (typeof PIPELINE_STAGES)[number];
  locale: "de" | "en";
  fmt: (n: number) => string;
}) {
  return (
    <div className="hairline p-4 flex flex-col gap-2 min-h-[168px]">
      <div className="text-[12px] uppercase tracking-wide text-muted-foreground">
        Stage {stage.id} · {stage.name[locale]}
      </div>
      <div className="text-[24px] font-semibold tabular-nums leading-none">
        {fmt(stage.volumenMio)}{" "}
        <span className="text-[14px] font-normal text-muted-foreground">Mio €</span>
      </div>
      <div className="text-[12px] tabular-nums">
        n = {stage.anzahl}
        {stage.eu && (
          <span className="text-muted-foreground">
            {" · "}EU {stage.eu.anzahl} / {fmt(stage.eu.volumenMio)} Mio €
          </span>
        )}
      </div>
      <div className="text-[11px] text-muted-foreground mt-auto">
        {stage.definition[locale]}
      </div>
    </div>
  );
}

function Conversion({
  label,
  c,
  fmt,
}: {
  label: string;
  c: { anzahl: number; volumen: number };
  fmt: (n: number) => string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 py-4 text-center">
      <div className="text-[12px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-[20px] font-semibold tabular-nums">{fmt(c.volumen)} %</div>
      <div className="text-[11px] text-muted-foreground tabular-nums">
        Vol. · {fmt(c.anzahl)} % Anz.
      </div>
      <div aria-hidden className="text-muted-foreground text-[18px]">
        →
      </div>
    </div>
  );
}
