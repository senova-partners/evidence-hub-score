import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore, setStore, CLUSTERS, type Store } from "@/lib/scorecard/store";
import { useT, useLocale } from "@/lib/scorecard/useT";

export const Route = createFileRoute("/app/peer-review")({
  component: PeerReview,
});

const CRITERIA = ["fachlich", "klarheit", "umsetzbarkeit"];

function PeerReview() {
  const store = useStore((s: Store) => s);
  const locale = useLocale();
  const canDraw = store.session!.role === "steward";
  const [expanded, setExpanded] = useState<string | null>(null);

  function draw() {
    // 2 episodes per cluster
    const draws = CLUSTERS.flatMap((c) => {
      const pool = store.episodes.filter((e) => e.cluster === c);
      const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 2);
      return shuffled.map((ep) => ({
        id: `p-${Date.now()}-${ep.id}`,
        halfYear: "2026-H2",
        cluster: c,
        episodeId: ep.id,
      }));
    });
    setStore((s) => ({ ...s, peerDraws: [...s.peerDraws, ...draws] }));
  }

  function saveScore(id: string, scores: Record<string, number>, justification: string) {
    setStore((s) => ({
      ...s,
      peerDraws: s.peerDraws.map((p) => (p.id === id ? { ...p, scores, justification } : p)),
    }));
    setExpanded(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[22px] font-semibold">Peer-Review</h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            {locale === "de"
              ? "Zufallsziehung 2 Werkstücke × Cluster × Halbjahr. Bewertung mit Begründung."
              : "Random draw of 2 deliverables × cluster × half-year. Score with justification."}
          </p>
        </div>
        {canDraw && (
          <button onClick={draw} className="bg-foreground text-background px-3 py-2 text-[13px]">
            {locale === "de" ? "Ziehung starten" : "Draw"}
          </button>
        )}
      </div>

      <ul className="flex flex-col">
        {store.peerDraws.map((p) => (
          <li key={p.id} className="hairline-b py-3">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <div className="font-semibold text-[14px]">
                  {p.episodeId} <span className="text-muted-foreground font-normal">· {p.cluster} · {p.halfYear}</span>
                </div>
                {p.scores && (
                  <div className="text-[12px] text-muted-foreground mt-1">
                    Ø{" "}
                    {(Object.values(p.scores).reduce((a, b) => a + b, 0) / Object.values(p.scores).length).toFixed(1)}
                    {p.justification && ` — „${p.justification}"`}
                  </div>
                )}
              </div>
              <button
                onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                className="hairline px-3 py-1 text-[12px]"
              >
                {p.scores ? "bearbeiten" : "bewerten"}
              </button>
            </div>
            {expanded === p.id && <ScoreForm draw={p} onSave={saveScore} />}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ScoreForm({
  draw,
  onSave,
}: {
  draw: { id: string; scores?: Record<string, number>; justification?: string };
  onSave: (id: string, scores: Record<string, number>, j: string) => void;
}) {
  const t = useT();
  const [scores, setScores] = useState<Record<string, number>>(draw.scores ?? { fachlich: 3, klarheit: 3, umsetzbarkeit: 3 });
  const [j, setJ] = useState(draw.justification ?? "");
  return (
    <div className="mt-3 hairline p-3 flex flex-col gap-3">
      {CRITERIA.map((c) => (
        <label key={c} className="flex items-center gap-3 text-[13px]">
          <span className="w-32">{c}</span>
          <input
            type="range"
            min={1}
            max={5}
            value={scores[c]}
            onChange={(e) => setScores((s) => ({ ...s, [c]: Number(e.target.value) }))}
            className="flex-1"
          />
          <span className="w-8 tabular-nums">{scores[c]}</span>
        </label>
      ))}
      <textarea
        required
        value={j}
        onChange={(e) => setJ(e.target.value)}
        placeholder={t("pr_reason_placeholder")}
        className="hairline bg-background px-3 py-2 text-[13px] min-h-20"
      />
      <button
        onClick={() => j.trim() && onSave(draw.id, scores, j)}
        className="self-start bg-foreground text-background px-3 py-2 text-[13px]"
      >
        Speichern
      </button>
    </div>
  );
}
