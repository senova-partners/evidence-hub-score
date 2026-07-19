import { createFileRoute } from "@tanstack/react-router";
import { useStore, setStore, type Store } from "@/lib/scorecard/store";
import { useLocale } from "@/lib/scorecard/useT";
import { fmtDate } from "@/lib/scorecard/i18n";

export const Route = createFileRoute("/app/closed-loop")({
  component: ClosedLoop,
});

function ClosedLoop() {
  const store = useStore((s: Store) => s);
  const locale = useLocale();

  function close(id: string) {
    setStore((s) => ({
      ...s,
      closedLoop: s.closedLoop.map((i) => (i.id === id ? { ...i, status: "closed" } : i)),
    }));
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[22px] font-semibold">Closed-Loop-Tracker</h1>
        <p className="text-[13px] text-muted-foreground mt-1">
          {locale === "de"
            ? "Jedes Partnerurteil unter Schwelle erzeugt eine Nachfrage. Frist: 14 Tage."
            : "Every partner score below threshold creates a follow-up. Deadline: 14 days."}
        </p>
      </div>
      <table className="w-full text-[13px]">
        <thead className="text-[12px] text-muted-foreground uppercase tracking-wide">
          <tr className="hairline-b text-left">
            <th className="py-2">Episode</th>
            <th className="py-2">Grund</th>
            <th className="py-2">Owner</th>
            <th className="py-2">Frist</th>
            <th className="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {store.closedLoop.map((c) => (
            <tr key={c.id} className="hairline-b">
              <td className="py-2 tabular-nums">{c.episodeId}</td>
              <td className="py-2">{c.reason}</td>
              <td className="py-2">{c.owner}</td>
              <td className="py-2 tabular-nums">{fmtDate(c.dueDate, locale)}</td>
              <td className="py-2">
                {c.status === "open" ? (
                  <button onClick={() => close(c.id)} className="hairline px-2 py-1 text-[12px]">
                    ○ offen — schließen
                  </button>
                ) : (
                  <span>● geschlossen</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
