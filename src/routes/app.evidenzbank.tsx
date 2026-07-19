import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore, setStore, type Store } from "@/lib/scorecard/store";
import { useT, useLocale } from "@/lib/scorecard/useT";
import { fmtDate, fmtNumber } from "@/lib/scorecard/i18n";

export const Route = createFileRoute("/app/evidenzbank")({
  component: Evidenzbank,
});

function Evidenzbank() {
  const store = useStore((s: Store) => s);
  const t = useT();
  const locale = useLocale();
  const [q, setQ] = useState("");
  const [showForm, setShowForm] = useState(false);
  const canAdd = ["av", "steward", "cc"].includes(store.session!.role);

  const items = store.evidenz.filter((e) =>
    (e.sentences + e.cluster + e.involved).toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold">{t("nav_evidenz")}</h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            {locale === "de"
              ? "„Wäre letztes Jahr nicht gegangen“ — dokumentierte Fälle je Cluster."
              : "„Would not have been possible last year“ — documented cases per cluster."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={locale === "de" ? "Suchen" : "Search"}
            className="hairline bg-background px-3 py-2 text-[13px]"
          />
          {canAdd && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-foreground text-background px-3 py-2 text-[13px]"
            >
              +
            </button>
          )}
        </div>
      </div>

      {showForm && <AddStoryForm onClose={() => setShowForm(false)} />}

      <ul className="flex flex-col">
        {items.map((e) => (
          <li key={e.id} className="hairline-b py-4">
            <div className="flex items-baseline justify-between gap-4">
              <div className="font-semibold text-[14px]">{e.cluster}</div>
              <div className="text-[12px] text-muted-foreground tabular-nums">
                {fmtDate(e.date, locale)} · {e.quarter}
              </div>
            </div>
            <p className="text-[14px] mt-1">{e.sentences}</p>
            <div className="text-[12px] text-muted-foreground mt-2 flex gap-4 flex-wrap">
              <span>{e.involved}</span>
              {e.savingEur && (
                <span>≈ {fmtNumber(e.savingEur, locale)} EUR</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AddStoryForm({ onClose }: { onClose: () => void }) {
  const store = useStore((s: Store) => s);
  const [cluster, setCluster] = useState(store.session!.cluster ?? "Governance");
  const [sentences, setSentences] = useState("");
  const [involved, setInvolved] = useState("");
  const [saving, setSaving] = useState<string>("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const id = `e${Date.now()}`;
    setStore((s) => ({
      ...s,
      evidenz: [
        ...s.evidenz,
        {
          id,
          quarter: s.session!.quarter,
          cluster,
          sentences,
          involved,
          savingEur: saving ? Number(saving) : undefined,
          date: new Date().toISOString().slice(0, 10),
        },
      ],
    }));
    onClose();
  }

  return (
    <form onSubmit={submit} className="hairline p-4 flex flex-col gap-3">
      <input
        className="hairline bg-background px-3 py-2 text-[13px]"
        placeholder="Cluster"
        value={cluster}
        onChange={(e) => setCluster(e.target.value)}
      />
      <textarea
        className="hairline bg-background px-3 py-2 text-[13px] min-h-24"
        placeholder="3 Sätze"
        maxLength={500}
        value={sentences}
        onChange={(e) => setSentences(e.target.value)}
        required
      />
      <input
        className="hairline bg-background px-3 py-2 text-[13px]"
        placeholder="Beteiligte"
        value={involved}
        onChange={(e) => setInvolved(e.target.value)}
      />
      <input
        className="hairline bg-background px-3 py-2 text-[13px]"
        placeholder="Ersparnis (EUR, optional)"
        inputMode="numeric"
        value={saving}
        onChange={(e) => setSaving(e.target.value)}
      />
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onClose} className="text-[13px] text-muted-foreground">
          Cancel
        </button>
        <button type="submit" className="bg-foreground text-background px-3 py-2 text-[13px]">
          Speichern
        </button>
      </div>
    </form>
  );
}
