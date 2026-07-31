import { createFileRoute } from "@tanstack/react-router";
import { useStore, type Store } from "@/lib/scorecard/store";
import { KPIS } from "@/lib/scorecard/kpis";
import { useLocale } from "@/lib/scorecard/useT";
import { fmtDate } from "@/lib/scorecard/i18n";

export const Route = createFileRoute("/app/meldung/historie")({
  component: Historie,
});

function Historie() {
  const store = useStore((s: Store) => s);
  const session = store.session!;
  const locale = useLocale();
  const items = store.submissions.filter(
    (s) => s.role === session.role && (!session.cluster || s.cluster === session.cluster),
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[22px] font-semibold">Historie</h1>
      <table className="w-full text-[13px]">
        <thead className="text-[12px] text-muted-foreground uppercase tracking-wide">
          <tr className="hairline-b text-left">
            <th className="py-2">Quartal</th>
            <th className="py-2">Werte</th>
            <th className="py-2">Eingang</th>
            <th className="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id} className="hairline-b align-top">
              <td className="py-2 tabular-nums">{it.quarter}</td>
              <td className="py-2">
                {Object.entries(it.values).map(([k, v]) => {
                  const kpi = KPIS.find((x) => x.id === k);
                  return (
                    <div key={k}>
                      <span className="text-muted-foreground">{kpi?.name[locale] ?? k}:</span>{" "}
                      <span className="tabular-nums">{v ?? "—"}</span>
                    </div>
                  );
                })}
              </td>
              <td className="py-2 tabular-nums text-muted-foreground">
                {it.submittedAt ? fmtDate(it.submittedAt, locale) : "—"}
              </td>
              <td className="py-2">
                {it.status === "on_time" && `● ${t("on_time")}`}
                {it.status === "late" && `● ${t("late")}`}
                {it.status === "missing" && `✕ ${t("status_missing")}`}
                {it.status === "draft" && `○ ${t("status_draft")}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
