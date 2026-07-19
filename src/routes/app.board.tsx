import { createFileRoute } from "@tanstack/react-router";
import { useStore, type Store } from "@/lib/scorecard/store";
import { KPIS, PKG_LABEL, kpiById } from "@/lib/scorecard/kpis";
import { KpiCard } from "@/components/scorecard/KpiCard";
import { VerdictBadge } from "@/components/scorecard/VerdictBadge";
import { computeVerdict, meldetreue, boardKpis } from "@/lib/scorecard/verdict";
import { useT, useLocale } from "@/lib/scorecard/useT";

export const Route = createFileRoute("/app/board")({
  component: Board,
});

function Board() {
  const store = useStore((s: Store) => s);
  const session = store.session!;
  const t = useT();
  const locale = useLocale();
  const verdict = computeVerdict(store, session.quarter);
  const mt = meldetreue(store, session.quarter);

  const visible = boardKpis();
  const grouped = (["aussenbeweis", "beratungsqualitaet", "struktur"] as const).map((pkg) => ({
    pkg,
    kpis: visible.filter((k) => k.pkg === pkg),
  }));
  // Silence unused warning; KPIS/kpiById remain re-exportable for other views.
  void KPIS; void kpiById;

  return (
    <div className="mx-auto w-full max-w-[1200px] flex flex-col gap-14">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <h1 className="text-[22px] font-semibold">{t("nav_board")}</h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            {session.quarter} · {mt.onTime}/{mt.total} {t("meldetreue_short")}
            {session.cluster && ` · ${session.cluster}`}
          </p>
        </div>
        <VerdictBadge verdict={verdict} />
      </div>

      {grouped.map(({ pkg, kpis }) => (
        <section key={pkg} className="flex flex-col gap-4">
          <h2 className="text-[13px] uppercase tracking-wide text-muted-foreground">
            {PKG_LABEL[pkg][locale]}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {kpis.map((k) => (
              <KpiCard
                key={k.id}
                kpiId={k.id}
                value={store.values[k.id]?.[session.quarter]}
                baseline={store.baselines[k.id]}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
