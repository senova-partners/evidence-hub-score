import { createFileRoute } from "@tanstack/react-router";
import { useStore, type Store } from "@/lib/scorecard/store";
import { KPIS, PKG_LABEL } from "@/lib/scorecard/kpis";
import { computeVerdict, meldetreue } from "@/lib/scorecard/verdict";
import { useT, useLocale } from "@/lib/scorecard/useT";
import { fmtNumber } from "@/lib/scorecard/i18n";
import { delta, trend } from "@/lib/scorecard/verdict";

export const Route = createFileRoute("/app/export")({
  component: ExportPage,
});

const verdictText = {
  erfuellt: { de: "Erfüllt", en: "Passed" },
  nicht_erfuellt: { de: "Nicht erfüllt", en: "Not passed" },
  baseline_fehlt: { de: "Baseline fehlt", en: "Baseline missing" },
};

const trendGlyph = { up: "↑", down: "↓", flat: "→", missing: "✕" } as const;

function ExportPage() {
  const store = useStore((s: Store) => s);
  const q = store.session!.quarter;
  const t = useT();
  const locale = useLocale();
  const verdict = computeVerdict(store, q);
  const mt = meldetreue(store, q);

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-semibold">Snapshot</h1>
          <p className="text-[13px] text-muted-foreground">
            {locale === "de" ? "Eine A4-Seite quer für CLT/AoA." : "One A4 landscape page for CLT/AoA."}
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="bg-foreground text-background px-4 py-2 text-[13px]"
        >
          {locale === "de" ? "Drucken / PDF" : "Print / PDF"}
        </button>
      </div>

      <article className="hairline p-8 flex flex-col gap-6 bg-white">
        <header className="flex items-start justify-between hairline-b pb-4">
          <div className="flex items-center gap-3">
            <span aria-hidden className="inline-block w-6 h-6 bg-[color:var(--giz-red)]" />
            <div>
              <div className="text-[11px] text-muted-foreground">{t("giz_jordan")}</div>
              <div className="text-[14px] font-semibold">{t("app_name")} — {q}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-muted-foreground">Verdict</div>
            <div className="text-[16px] font-semibold">{verdictText[verdict][locale]}</div>
            <div className="text-[11px] text-muted-foreground mt-1">
              {mt.onTime}/{mt.total} {t("meldetreue_short")}
            </div>
          </div>
        </header>

        {(["aussenbeweis", "beratungsqualitaet", "struktur"] as const).map((pkg) => (
          <section key={pkg}>
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-2">
              {PKG_LABEL[pkg][locale]}
            </div>
            <table className="w-full text-[12px]">
              <tbody>
                {KPIS.filter((k) => k.pkg === pkg).map((k) => {
                  const v = store.values[k.id]?.[q]?.value ?? null;
                  const b = store.baselines[k.id];
                  const d = delta(k.id, v, b);
                  const tr = trend(k.id, v, b);
                  const digits = k.unit === "score" ? 1 : 0;
                  const suf = k.unit === "%" ? " %" : k.unit === "days" ? " d" : "";
                  return (
                    <tr key={k.id} className="hairline-b">
                      <td className="py-2">{k.name[locale]}</td>
                      <td className="py-2 text-right tabular-nums w-24">
                        {v === null ? "—" : `${fmtNumber(v, locale, digits)}${suf}`}
                      </td>
                      <td className="py-2 text-right tabular-nums w-24 text-muted-foreground">
                        {fmtNumber(b ?? null, locale, digits)}{suf}
                      </td>
                      <td className="py-2 text-right w-8" aria-label={tr}>{trendGlyph[tr]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        ))}

        <footer className="hairline-t pt-3 text-[10px] text-muted-foreground">
          {locale === "de"
            ? "Person-Ebene wird nicht gezeigt. Aggregate nur ab n ≥ 5. Fehlende Werte werden nicht geschätzt."
            : "Person-level data is not shown. Aggregates only for n ≥ 5. Missing values are never interpolated."}
        </footer>
      </article>
    </div>
  );
}
