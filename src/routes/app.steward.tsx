import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore, setStore, QUARTERS, type Store } from "@/lib/scorecard/store";
import { KPIS } from "@/lib/scorecard/kpis";
import { useLocale } from "@/lib/scorecard/useT";
import { fmtDate } from "@/lib/scorecard/i18n";
import { plausibilityFlag } from "@/lib/scorecard/verdict";
import type { Role } from "@/lib/scorecard/types";

export const Route = createFileRoute("/app/steward")({
  component: Steward,
});

const ROLES: Role[] = ["av", "practice", "jdu", "finance", "bt3", "panel"];

function Steward() {
  const store = useStore((s: Store) => s);
  const locale = useLocale();
  const q = store.session!.quarter;
  const [tab, setTab] = useState<"submissions" | "flags" | "log" | "baseline">("submissions");
  const locked = store.lockedQuarters.includes(q);

  function toggleLock() {
    setStore((s) => ({
      ...s,
      lockedQuarters: s.lockedQuarters.includes(q)
        ? s.lockedQuarters.filter((x) => x !== q)
        : [...s.lockedQuarters, q],
    }));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[22px] font-semibold">Steward-Konsole</h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            {q} · {locked ? "● gesperrt" : "○ offen"}
          </p>
        </div>
        <button onClick={toggleLock} className="hairline px-3 py-2 text-[13px]">
          {locked ? "Freigeben" : "Quartal sperren"}
        </button>
      </div>

      <div className="hairline-b flex gap-6">
        {(["submissions", "flags", "log", "baseline"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`pb-2 text-[13px] ${tab === k ? "font-semibold border-b-2 border-foreground -mb-px" : "text-muted-foreground"}`}
          >
            {k}
          </button>
        ))}
      </div>

      {tab === "submissions" && <SubmissionsMatrix />}
      {tab === "flags" && <FlagsTab />}
      {tab === "log" && <ChangeLogTab />}
      {tab === "baseline" && <BaselineTab />}
    </div>
  );
}

function SubmissionsMatrix() {
  const store = useStore((s: Store) => s);
  return (
    <table className="w-full text-[13px]">
      <thead className="text-[12px] text-muted-foreground uppercase tracking-wide">
        <tr className="hairline-b text-left">
          <th className="py-2">Rolle</th>
          {QUARTERS.map((q) => (
            <th key={q} className="py-2 tabular-nums">{q}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {ROLES.map((r) => (
          <tr key={r} className="hairline-b">
            <td className="py-2 font-semibold">{r.toUpperCase()}</td>
            {QUARTERS.map((q) => {
              const subs = store.submissions.filter((s) => s.role === r && s.quarter === q);
              const s = subs[0];
              if (!s) return <td key={q} className="py-2 text-muted-foreground">—</td>;
              const glyph =
                s.status === "on_time" ? "●" : s.status === "late" ? "◐" : s.status === "missing" ? "✕" : "○";
              return (
                <td key={q} className="py-2">
                  {glyph} {s.status}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function FlagsTab() {
  const store = useStore((s: Store) => s);
  const locale = useLocale();
  const q = store.session!.quarter;
  const prevIdx = QUARTERS.indexOf(q as (typeof QUARTERS)[number]) - 1;
  const prevQ = prevIdx >= 0 ? QUARTERS[prevIdx] : null;

  const flags = KPIS.map((k) => {
    const curr = store.values[k.id]?.[q]?.value ?? null;
    const prev = prevQ ? store.values[k.id]?.[prevQ]?.value ?? null : null;
    return { k, curr, prev, flag: plausibilityFlag(prev, curr) };
  }).filter((r) => r.flag);

  if (flags.length === 0) {
    return (
      <div className="hairline p-6 text-[13px] text-muted-foreground">
        {locale === "de" ? "Keine Plausibilitäts-Auffälligkeiten." : "No plausibility flags."}
      </div>
    );
  }

  return (
    <ul>
      {flags.map(({ k, curr, prev }) => (
        <li key={k.id} className="hairline-b py-3 text-[13px]">
          <span className="font-semibold">{k.name[locale]}</span>{" "}
          <span className="tabular-nums">
            {prev} → {curr}
          </span>{" "}
          <span className="text-[color:var(--giz-red)]">✕ &gt; 30 % Sprung — Query erforderlich</span>
        </li>
      ))}
    </ul>
  );
}

function ChangeLogTab() {
  const store = useStore((s: Store) => s);
  const locale = useLocale();
  return (
    <table className="w-full text-[12px] font-mono">
      <thead className="text-muted-foreground uppercase">
        <tr className="hairline-b text-left">
          <th className="py-2">Zeit</th>
          <th className="py-2">Rolle</th>
          <th className="py-2">Feld</th>
          <th className="py-2">alt → neu</th>
        </tr>
      </thead>
      <tbody>
        {[...store.changeLog].reverse().map((c) => (
          <tr key={c.id} className="hairline-b">
            <td className="py-2">{fmtDate(c.at, locale)}</td>
            <td className="py-2">{c.role}</td>
            <td className="py-2">{c.field}</td>
            <td className="py-2 tabular-nums">
              {c.from || "—"} → {c.to || "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function BaselineTab() {
  const store = useStore((s: Store) => s);
  const locale = useLocale();
  function update(id: string, v: string) {
    setStore((s) => ({
      ...s,
      baselines: { ...s.baselines, [id]: Number(v) },
      changeLog: [
        ...s.changeLog,
        {
          id: `cl-${Date.now()}`,
          at: new Date().toISOString(),
          role: "steward",
          field: `baseline:${id}`,
          from: String(s.baselines[id] ?? ""),
          to: v,
        },
      ],
    }));
  }
  return (
    <table className="w-full text-[13px]">
      <thead className="text-[12px] text-muted-foreground uppercase tracking-wide">
        <tr className="hairline-b text-left">
          <th className="py-2">KPI</th>
          <th className="py-2">Baseline</th>
        </tr>
      </thead>
      <tbody>
        {KPIS.map((k) => (
          <tr key={k.id} className="hairline-b">
            <td className="py-2">{k.name[locale]}</td>
            <td className="py-2">
              <input
                type="number"
                step="0.1"
                value={store.baselines[k.id] ?? ""}
                onChange={(e) => update(k.id, e.target.value)}
                className="hairline bg-background px-2 py-1 text-[13px] w-24 tabular-nums"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
