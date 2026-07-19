import { createFileRoute } from "@tanstack/react-router";
import { useStore, type Store } from "@/lib/scorecard/store";
import { KPIS } from "@/lib/scorecard/kpis";
import { useT, useLocale } from "@/lib/scorecard/useT";
import { fmtNumber } from "@/lib/scorecard/i18n";
import { delta, trend } from "@/lib/scorecard/verdict";

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
    const d = delta(k.id, v, b);
    const tr = trend(k.id, v, b);
    return { k, v, b, d, tr };
  }).filter((r) => r.tr === "down" || r.tr === "missing");

  return (
    <div className="flex flex-col gap-6">
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
            {rows.map(({ k, v, b, d, tr }) => {
              const digits = k.unit === "score" ? 1 : 0;
              const suf = k.unit === "%" ? " %" : k.unit === "days" ? " d" : "";
              return (
                <tr key={k.id} className="hairline-b">
                  <td className="py-2">{k.name[locale]}</td>
                  <td className="py-2 text-right tabular-nums">
                    {v === null ? "—" : `${fmtNumber(v, locale, digits)}${suf}`}
                  </td>
                  <td className="py-2 text-right tabular-nums text-muted-foreground">
                    {fmtNumber(b ?? null, locale, digits)}{suf}
                  </td>
                  <td className="py-2 text-right tabular-nums">
                    {d === null ? "—" : `${d > 0 ? "+" : ""}${fmtNumber(d, locale, digits)}${suf}`}
                  </td>
                  <td className="py-2 pl-4">
                    <span aria-hidden>{tr === "down" ? "↓" : "✕"}</span>{" "}
                    {tr === "down" ? (locale === "de" ? "verschlechtert" : "declined") : t("missing")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
