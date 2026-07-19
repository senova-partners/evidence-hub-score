import { createFileRoute } from "@tanstack/react-router";
import { useStore, setStore, type Store } from "@/lib/scorecard/store";
import { useLocale } from "@/lib/scorecard/useT";

export const Route = createFileRoute("/app/review")({
  component: Review,
});

const QUESTIONS = {
  de: [
    "Wo hält der Test — wo nicht?",
    "Welche Muster über Cluster hinweg sind neu?",
    "Welche Kennzahl braucht die nächste Interpretationsrunde?",
  ],
  en: [
    "Where does the test hold — where not?",
    "Which cross-cluster patterns are new?",
    "Which measure needs the next interpretation round?",
  ],
};

function Review() {
  const store = useStore((s: Store) => s);
  const locale = useLocale();
  const hy = store.session!.quarter.startsWith("2026-Q1") || store.session!.quarter.startsWith("2026-Q2") ? "2026-H1" : "2026-H2";
  const notes = store.reviewNotes;

  function updateNote(idx: number, text: string) {
    const key = `${hy}-${idx}`;
    setStore((s) => ({ ...s, reviewNotes: { ...s.reviewNotes, [key]: text } }));
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className="text-[22px] font-semibold">Review — {hy}</h1>
        <p className="text-[13px] text-muted-foreground mt-1">
          {locale === "de"
            ? "Drei stehende Fragen. Anmerkungen bleiben je Halbjahr erhalten."
            : "Three standing questions. Notes persist per half-year."}
        </p>
      </div>

      {QUESTIONS[locale].map((q, i) => (
        <div key={i} className="hairline p-4 flex flex-col gap-2">
          <div className="text-[13px] font-semibold">{q}</div>
          <textarea
            value={notes[`${hy}-${i}`] ?? ""}
            onChange={(e) => updateNote(i, e.target.value)}
            className="hairline bg-background px-3 py-2 text-[13px] min-h-24"
            placeholder={locale === "de" ? "Beobachtung notieren" : "Note observation"}
          />
        </div>
      ))}
    </div>
  );
}
