import { createFileRoute } from "@tanstack/react-router";
import { useStore, setStore, type Store } from "@/lib/scorecard/store";
import { computePeerReview, PEER_REVIEW_VIEWS } from "@/lib/scorecard/peer-review-views";
import { useT, useLocale } from "@/lib/scorecard/useT";
import { pick, fmtDecimal } from "@/lib/scorecard/i18n";
import type { Episode } from "@/lib/scorecard/types";

export const Route = createFileRoute("/app/peer-review")({
  component: PeerReview,
});

function PeerReview() {
  const episodes = useStore((s: Store) => s.episodes);
  const t = useT();
  const locale = useLocale();
  const results = computePeerReview(episodes);

  function setRating(
    episodeId: string,
    field: "practice" | "machineRoom",
    value: number | null,
  ) {
    setStore((s) => ({
      ...s,
      episodes: s.episodes.map((e) =>
        e.id === episodeId ? { ...e, usability: { ...e.usability, [field]: value } } : e,
      ),
    }));
  }

  function setDeadline(
    episodeId: string,
    field: "practiceDeadlineMet" | "machineRoomDeadlineMet",
    value: boolean,
  ) {
    setStore((s) => ({
      ...s,
      episodes: s.episodes.map((e) =>
        e.id === episodeId ? { ...e, usability: { ...e.usability, [field]: value } } : e,
      ),
    }));
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[22px] font-semibold">{t("pr_title")}</h1>
        <p className="text-[13px] text-muted-foreground mt-1 max-w-[70ch]">{t("pr_intro")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PEER_REVIEW_VIEWS.map((v) => {
          const r = results[v.id];
          return (
            <div key={v.id} className="hairline p-4">
              <div className="text-[12px] text-muted-foreground">{pick(v.label, locale)}</div>
              <div className="text-[28px] font-semibold tabular-nums mt-1">
                {r.value === null ? "—" : fmtDecimal(r.value, locale, 1)}
              </div>
              <div className="text-[12px] text-muted-foreground mt-1">
                n = {r.n} {t("pr_ratings_count")}
              </div>
            </div>
          );
        })}
      </div>

      <ul className="flex flex-col">
        {episodes.map((e) => (
          <li key={e.id} className="hairline-b py-3 flex flex-wrap items-center gap-x-8 gap-y-3">
            <div className="min-w-[220px]">
              <div className="font-semibold text-[14px]">{e.id}</div>
              <div className="text-[12px] text-muted-foreground">
                {e.cluster} · {e.partner}
              </div>
            </div>
            <RatingField
              label={t("pr_practice_rating")}
              enabled={e.mechanisms.practiceUsed}
              value={e.usability?.practice ?? null}
              disabledHint={t("pr_no_structure")}
              onChange={(v) => setRating(e.id, "practice", v)}
              deadlineMet={e.usability?.practiceDeadlineMet ?? null}
              onDeadlineChange={(v) => setDeadline(e.id, "practiceDeadlineMet", v)}
              deadlineLabel={locale === "de" ? "Frist eingehalten" : "Deadline met"}
            />
            <RatingField
              label={t("pr_mr_rating")}
              enabled={e.mechanisms.mrContributed}
              value={e.usability?.machineRoom ?? null}
              disabledHint={t("pr_no_structure")}
              onChange={(v) => setRating(e.id, "machineRoom", v)}
              deadlineMet={e.usability?.machineRoomDeadlineMet ?? null}
              onDeadlineChange={(v) => setDeadline(e.id, "machineRoomDeadlineMet", v)}
              deadlineLabel={locale === "de" ? "Frist eingehalten" : "Deadline met"}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function RatingField({
  label,
  enabled,
  value,
  disabledHint,
  onChange,
  deadlineMet,
  onDeadlineChange,
  deadlineLabel,
}: {
  label: string;
  enabled: boolean;
  value: number | null;
  disabledHint: string;
  onChange: (v: number | null) => void;
  deadlineMet: boolean | null;
  onDeadlineChange: (v: boolean) => void;
  deadlineLabel: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[12px] text-muted-foreground">{label}</span>
      {enabled ? (
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              aria-pressed={value === n}
              onClick={() => onChange(value === n ? null : n)}
              className={
                "w-7 h-7 text-[12px] tabular-nums hairline " +
                (value === n ? "bg-foreground text-background" : "hover:bg-muted")
              }
            >
              {n}
            </button>
          ))}
          <label className="flex items-center gap-1 text-[12px] text-muted-foreground ml-3">
            <input
              type="checkbox"
              checked={deadlineMet === true}
              onChange={(ev) => onDeadlineChange(ev.target.checked)}
            />
            {deadlineLabel}
          </label>
        </div>
      ) : (
        <span className="text-[12px] text-muted-foreground italic">{disabledHint}</span>
      )}
    </div>
  );
}

export type { Episode };
