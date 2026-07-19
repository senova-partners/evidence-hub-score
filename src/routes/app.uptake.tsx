import { createFileRoute } from "@tanstack/react-router";
import { useStore, setStore, type Store } from "@/lib/scorecard/store";
import { useLocale } from "@/lib/scorecard/useT";
import { fmtDate } from "@/lib/scorecard/i18n";
import { useState } from "react";

export const Route = createFileRoute("/app/uptake")({
  component: Uptake,
});

function Uptake() {
  const store = useStore((s: Store) => s);
  const locale = useLocale();
  const session = store.session!;

  const now = Date.now();
  const sixMonths = 1000 * 60 * 60 * 24 * 30 * 6;
  const queue = store.episodes.filter(
    (e) => (!session.cluster || e.cluster === session.cluster) && !e.uptake && now - new Date(e.closeDate).getTime() > sixMonths,
  );
  const done = store.episodes.filter(
    (e) => (!session.cluster || e.cluster === session.cluster) && e.uptake,
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-[22px] font-semibold">Uptake-Follow-up</h1>
        <p className="text-[13px] text-muted-foreground mt-1">
          {locale === "de"
            ? "6-Monats-Nachfrage: umgesetzt / angepasst / nicht genutzt + ein Satz."
            : "6-month follow-up: implemented / adapted / not used + one sentence."}
        </p>
      </div>

      <section>
        <h2 className="text-[13px] uppercase tracking-wide text-muted-foreground mb-3">
          {locale === "de" ? "Offen" : "Open"} · {queue.length}
        </h2>
        {queue.length === 0 ? (
          <div className="hairline p-4 text-[13px] text-muted-foreground">
            {locale === "de" ? "Keine offenen Nachfragen." : "No open follow-ups."}
          </div>
        ) : (
          queue.map((e) => <UptakeRow key={e.id} episodeId={e.id} partner={e.partner} closeDate={e.closeDate} />)
        )}
      </section>

      <section>
        <h2 className="text-[13px] uppercase tracking-wide text-muted-foreground mb-3">
          {locale === "de" ? "Abgeschlossen" : "Completed"} · {done.length}
        </h2>
        <ul>
          {done.map((e) => (
            <li key={e.id} className="hairline-b py-3 text-[13px]">
              <span className="font-semibold">{e.id}</span> · {e.partner} —{" "}
              <span className="tabular-nums">{e.uptake?.status}</span>{" "}
              <span className="text-muted-foreground">— {e.uptake?.note}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function UptakeRow({ episodeId, partner, closeDate }: { episodeId: string; partner: string; closeDate: string }) {
  const locale = useLocale();
  const [status, setStatus] = useState<"umgesetzt" | "angepasst" | "nicht_genutzt">("umgesetzt");
  const [note, setNote] = useState("");

  function submit() {
    setStore((s) => ({
      ...s,
      episodes: s.episodes.map((e) =>
        e.id === episodeId ? { ...e, uptake: { status, note, at: new Date().toISOString() } } : e,
      ),
    }));
  }

  return (
    <div className="hairline p-4 flex flex-col gap-3 mb-3">
      <div className="flex items-baseline justify-between">
        <div className="font-semibold text-[14px]">{episodeId} · {partner}</div>
        <div className="text-[12px] text-muted-foreground tabular-nums">
          {locale === "de" ? "geschlossen" : "closed"} {fmtDate(closeDate, locale)}
        </div>
      </div>
      <div className="flex gap-2">
        {(["umgesetzt", "angepasst", "nicht_genutzt"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`hairline px-3 py-2 text-[12px] ${status === s ? "bg-foreground text-background" : ""}`}
          >
            {s}
          </button>
        ))}
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder={locale === "de" ? "Ein Satz" : "One sentence"}
        maxLength={280}
        className="hairline bg-background px-3 py-2 text-[13px]"
      />
      <button
        onClick={submit}
        className="self-start bg-foreground text-background px-3 py-2 text-[13px]"
      >
        {locale === "de" ? "Speichern" : "Save"}
      </button>
    </div>
  );
}
