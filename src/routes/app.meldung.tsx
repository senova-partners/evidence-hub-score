import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore, setStore, type Store } from "@/lib/scorecard/store";
import { KPIS } from "@/lib/scorecard/kpis";
import { useT, useLocale } from "@/lib/scorecard/useT";
import type { Role } from "@/lib/scorecard/types";

// Which KPIs each submitter role reports
const ROLE_KPIS: Partial<Record<Role, string[]>> = {
  av: ["first_time_right"],
  practice: ["practice_usage"],
  jdu: ["testvorgang"],
  finance: ["eigenleistung"],
  bt3: ["fachzeit", "schmerzpunkt"],
  panel: ["peer_score"],
};

export const Route = createFileRoute("/app/meldung")({
  component: Meldung,
});

function Meldung() {
  const store = useStore((s: Store) => s);
  const t = useT();
  const locale = useLocale();
  const session = store.session!;
  const role = session.role;
  const kpiIds = ROLE_KPIS[role] ?? [];

  const existing = store.submissions.find(
    (s) => s.role === role && s.quarter === session.quarter && s.cluster === session.cluster,
  );
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    kpiIds.forEach((k) => {
      init[k] = existing?.values[k] != null ? String(existing.values[k]) : "";
    });
    return init;
  });
  const [n, setN] = useState<string>("12");
  const [submitted, setSubmitted] = useState(!!existing?.submittedAt);

  if (kpiIds.length === 0) {
    return (
      <div className="hairline p-6 text-[14px] text-muted-foreground">
        {locale === "de"
          ? "Für Ihre Rolle ist in diesem Zyklus keine Meldung erforderlich."
          : "No report required for your role this cycle."}
      </div>
    );
  }

  const nNum = Number(n);
  const nInvalid = kpiIds.some((k) => KPIS.find((x) => x.id === k)?.pkg !== "struktur") ? false : nNum < 5;
  // Any person-level aggregate must be n>=5 — enforce for all non-financial numeric roles
  const requiresN = ["bt3", "panel", "av"].includes(role);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (requiresN && nNum < 5) return;
    setStore((s) => {
      const others = s.submissions.filter(
        (x) => !(x.role === role && x.quarter === session.quarter && x.cluster === session.cluster),
      );
      const parsed: Record<string, number | null> = {};
      kpiIds.forEach((k) => {
        parsed[k] = values[k] === "" ? null : Number(values[k]);
      });
      // update KPI values in store as well
      const nextValues = { ...s.values };
      kpiIds.forEach((k) => {
        nextValues[k] = { ...nextValues[k], [session.quarter]: { quarter: session.quarter, value: parsed[k], reported: parsed[k] !== null, n: nNum } };
      });
      const changeLog = [
        ...s.changeLog,
        ...kpiIds
          .filter((k) => String(s.values[k]?.[session.quarter]?.value ?? "") !== String(parsed[k] ?? ""))
          .map((k) => ({
            id: `cl-${Date.now()}-${k}`,
            at: new Date().toISOString(),
            role,
            field: k,
            from: String(s.values[k]?.[session.quarter]?.value ?? ""),
            to: String(parsed[k] ?? ""),
          })),
      ];
      return {
        ...s,
        values: nextValues,
        changeLog,
        submissions: [
          ...others,
          {
            id: existing?.id ?? `s-${Date.now()}`,
            role,
            cluster: session.cluster,
            quarter: session.quarter,
            values: parsed,
            submittedAt: new Date().toISOString(),
            deadline: `${session.quarter.slice(0, 4)}-09-30`,
            status: "on_time",
          },
        ],
      };
    });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="hairline p-6 flex flex-col gap-2 max-w-xl">
        <div className="text-[18px] font-semibold">✓ {t("submitted_ok")}</div>
        <p className="text-[13px] text-muted-foreground">{t("submitted_next")}</p>
        <button
          onClick={() => setSubmitted(false)}
          className="self-start text-[12px] text-muted-foreground hover:text-foreground mt-4"
        >
          {locale === "de" ? "Bearbeiten" : "Edit"}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-[22px] font-semibold">{t("nav_meldung")}</h1>
        <p className="text-[13px] text-muted-foreground mt-1">
          {session.quarter} · {t("deadline")}: 30.09.{session.quarter.slice(0, 4)} · ≤ 15 min
        </p>
      </div>

      {kpiIds.map((id) => {
        const kpi = KPIS.find((x) => x.id === id)!;
        const suf = kpi.unit === "%" ? "%" : kpi.unit === "days" ? "d" : kpi.unit === "score" ? "/5" : "";
        return (
          <label key={id} className="flex flex-col gap-2">
            <span className="text-[13px] font-semibold">{kpi.name[locale]}</span>
            <span className="text-[12px] text-muted-foreground">{kpi.info.was[locale]}</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                value={values[id]}
                onChange={(e) => setValues((v) => ({ ...v, [id]: e.target.value }))}
                className="hairline bg-background px-3 py-2 text-[14px] w-32 tabular-nums"
                required
              />
              <span className="text-[13px] text-muted-foreground">{suf}</span>
            </div>
          </label>
        );
      })}

      {requiresN && (
        <label className="flex flex-col gap-1">
          <span className="text-[12px] text-muted-foreground">n (Aggregatgröße)</span>
          <input
            type="number"
            value={n}
            onChange={(e) => setN(e.target.value)}
            className="hairline bg-background px-3 py-2 text-[14px] w-32 tabular-nums"
          />
          {nNum < 5 && (
            <span className="text-[12px] text-[color:var(--giz-red)]">✕ {t("n_guard")}</span>
          )}
        </label>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={requiresN && nNum < 5}
          className="bg-foreground text-background px-4 py-2 text-[14px] font-semibold disabled:opacity-40"
        >
          {t("submit")}
        </button>
      </div>
    </form>
  );
}
