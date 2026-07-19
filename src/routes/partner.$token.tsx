import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore, setStore, type Store } from "@/lib/scorecard/store";
import { t } from "@/lib/scorecard/i18n";
import type { Locale } from "@/lib/scorecard/types";

export const Route = createFileRoute("/partner/$token")({
  component: PartnerForm,
});

function PartnerForm() {
  const { token } = Route.useParams();
  const [locale, setLocale] = useState<Locale>("en");
  const episode = useStore((s: Store) => s.episodes.find((e) => e.partnerToken === token));
  const [scores, setScores] = useState<Record<string, number>>({ q1: 4, q2: 4, q3: 4, q4: 4, q5: 4 });
  const [comment, setComment] = useState("");
  const [done, setDone] = useState(!!episode?.partnerResponse);

  if (!episode) {
    return (
      <div className="min-h-dvh flex items-center justify-center p-6">
        <div className="hairline p-6 max-w-md text-[13px] text-muted-foreground">
          Link is not valid.
        </div>
      </div>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setStore((s) => ({
      ...s,
      episodes: s.episodes.map((ep) =>
        ep.partnerToken === token
          ? { ...ep, partnerResponse: { submittedAt: new Date().toISOString(), scores, comment } }
          : ep,
      ),
    }));
    setDone(true);
  }

  if (done) {
    return (
      <div className="min-h-dvh flex items-center justify-center p-6">
        <div className="hairline p-8 max-w-md text-center">
          <div className="text-[24px] font-semibold">✓</div>
          <p className="text-[14px] mt-3">{t("partner_thanks", locale)}</p>
        </div>
      </div>
    );
  }

  const questions = ["partner_q1", "partner_q2", "partner_q3", "partner_q4", "partner_q5"];

  return (
    <div className="min-h-dvh py-10 px-6 flex justify-center" dir={locale === "en" ? "ltr" : "ltr"}>
      <form onSubmit={submit} className="hairline p-8 max-w-lg w-full flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[11px] text-muted-foreground uppercase tracking-wide">GIZ Jordan</div>
            <h1 className="text-[18px] font-semibold">{t("partner_title", locale)}</h1>
          </div>
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
            className="hairline bg-background px-2 py-1 text-[12px]"
          >
            <option value="de">DE</option>
            <option value="en">EN</option>
          </select>
        </div>

        {questions.map((qk, i) => {
          const id = `q${i + 1}`;
          return (
            <div key={qk} className="flex flex-col gap-2">
              <div className="text-[13px]">{t(qk, locale)}</div>
              <div className="flex gap-2" role="radiogroup" aria-label={t(qk, locale)}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setScores((s) => ({ ...s, [id]: n }))}
                    className={`hairline w-10 h-10 text-[13px] tabular-nums ${scores[id] === n ? "bg-foreground text-background" : ""}`}
                    aria-pressed={scores[id] === n}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        <label className="flex flex-col gap-2">
          <span className="text-[12px] text-muted-foreground">{t("partner_comment", locale)}</span>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={500}
            className="hairline bg-background px-3 py-2 text-[13px] min-h-24"
          />
        </label>

        <button type="submit" className="bg-foreground text-background px-4 py-2 text-[14px] font-semibold">
          {t("partner_send", locale)}
        </button>
      </form>
    </div>
  );
}
