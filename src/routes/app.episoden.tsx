import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore, setStore, type Store } from "@/lib/scorecard/store";
import { useLocale } from "@/lib/scorecard/useT";
import { fmtDate } from "@/lib/scorecard/i18n";

export const Route = createFileRoute("/app/episoden")({
  component: Episoden,
});

function Episoden() {
  const store = useStore((s: Store) => s);
  const locale = useLocale();
  const session = store.session!;
  const items = store.episodes.filter((e) => !session.cluster || e.cluster === session.cluster);
  const [creating, setCreating] = useState(false);
  const [partner, setPartner] = useState("");

  function createEpisode(e: React.FormEvent) {
    e.preventDefault();
    const id = `EP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    setStore((s) => ({
      ...s,
      episodes: [
        ...s.episodes,
        {
          id,
          cluster: session.cluster ?? "Governance",
          partner,
          closeDate: new Date().toISOString().slice(0, 10),
          mechanisms: { practiceUsed: false, mrContributed: false },
          partnerToken: `tok-${Date.now()}`,
        },
      ],
    }));
    setPartner("");
    setCreating(false);
  }

  function toggleMechanism(id: string, key: "practiceUsed" | "mrContributed") {
    setStore((s) => ({
      ...s,
      episodes: s.episodes.map((e) =>
        e.id === id ? { ...e, mechanisms: { ...e.mechanisms, [key]: !e.mechanisms[key] } } : e,
      ),
    }));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[22px] font-semibold">Episoden</h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            {locale === "de"
              ? "Beratungsepisoden — Basis für Partnerbogen, Uptake, Peer-Review."
              : "Consulting episodes — basis for partner form, uptake, peer review."}
          </p>
        </div>
        <button
          onClick={() => setCreating(!creating)}
          className="bg-foreground text-background px-3 py-2 text-[13px]"
        >
          + {locale === "de" ? "Episode" : "Episode"}
        </button>
      </div>

      {creating && (
        <form onSubmit={createEpisode} className="hairline p-4 flex gap-2">
          <input
            required
            value={partner}
            onChange={(e) => setPartner(e.target.value)}
            placeholder={locale === "de" ? "Partnerorganisation" : "Partner organisation"}
            className="hairline bg-background px-3 py-2 text-[13px] flex-1"
          />
          <button className="bg-foreground text-background px-3 py-2 text-[13px]">
            {locale === "de" ? "Anlegen" : "Create"}
          </button>
        </form>
      )}

      <table className="w-full text-[13px]">
        <thead className="text-[12px] text-muted-foreground uppercase tracking-wide">
          <tr className="hairline-b text-left">
            <th className="py-2">ID</th>
            <th className="py-2">Cluster</th>
            <th className="py-2">Partner</th>
            <th className="py-2">Close</th>
            <th className="py-2">Practice</th>
            <th className="py-2">MR</th>
            <th className="py-2">Partner-Link</th>
            <th className="py-2">Antwort</th>
          </tr>
        </thead>
        <tbody>
          {items.map((e) => {
            const link = `/partner/${e.partnerToken}`;
            return (
              <tr key={e.id} className="hairline-b">
                <td className="py-2 tabular-nums">{e.id}</td>
                <td className="py-2">{e.cluster}</td>
                <td className="py-2">{e.partner}</td>
                <td className="py-2 tabular-nums">{fmtDate(e.closeDate, locale)}</td>
                <td className="py-2">
                  <input
                    type="checkbox"
                    checked={e.mechanisms.practiceUsed}
                    onChange={() => toggleMechanism(e.id, "practiceUsed")}
                  />
                </td>
                <td className="py-2">
                  <input
                    type="checkbox"
                    checked={e.mechanisms.mrContributed}
                    onChange={() => toggleMechanism(e.id, "mrContributed")}
                  />
                </td>
                <td className="py-2">
                  <a
                    href={link}
                    className="text-[color:var(--giz-red)] underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    öffnen
                  </a>
                </td>
                <td className="py-2">
                  {e.partnerResponse ? (
                    <span>
                      ● Ø{" "}
                      {(
                        Object.values(e.partnerResponse.scores).reduce((a, b) => a + b, 0) /
                        Object.values(e.partnerResponse.scores).length
                      ).toFixed(1)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">— offen</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
