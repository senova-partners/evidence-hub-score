import { createFileRoute } from "@tanstack/react-router";
import { useStore, setStore, type Store } from "@/lib/scorecard/store";
import { useLocale } from "@/lib/scorecard/useT";
import { kpiById } from "@/lib/scorecard/kpis";

type Status = "offen" | "definiert" | "eingefuehrt";

interface RevisionsReferenz {
  bericht: string;
  massnahme: string;
  frist: string;
  einordnung: string;
}

const ITEMS: Array<{
  id: string;
  titel: { de: string; en: string };
  beschreibung: { de: string; en: string };
  owner: string;
  kpis: string[];
  revisions_referenz?: RevisionsReferenz;
}> = [
  {
    id: "episode_definition",
    titel: {
      de: "Beratungsepisode portfolioübergreifend definieren und einführen",
      en: "Define and roll out the advisory episode across the portfolio",
    },
    beschreibung: {
      de: "Das GIZ-Datenbüro (DAIO) definiert die Beratungsepisode als einheitliche Messeinheit (Anlass · Empfänger · Ergebnis · Zeitraum) und führt sie portfolioweit ein — inklusive Episodenregister und Abschluss-Trigger. Diese Einheit existiert im heutigen Berichtswesen nicht.",
      en: "The GIZ data office (DAIO) defines the advisory episode as a unified measurement unit (occasion · recipient · result · period) and rolls it out portfolio-wide — including the episode register and closure trigger. This unit does not exist in current reporting.",
    },
    owner: "DAIO, mit AVs und JDU",
    kpis: ["partnerbogen", "uptake", "peer_review", "mechanismus"],
  },
  {
    id: "budget_trennung",
    titel: {
      de: "Operative vs. wirkungsbezogene Ausgaben in Budgets/Instrumentenkonzepten trennen",
      en: "Split operational vs. impact-related spend in budgets/instrument concepts",
    },
    beschreibung: {
      de: "Budgets und Instrumentenkonzepte (Ressourcenüberblick je Projekt) werden nach internen operativen und wirkungsbezogenen Ausgaben unterteilt — in heutigen Budgets und Operationsplänen nicht enthalten. Abgrenzungslogik einmalig definieren, in Budget-/OP-Template einziehen, rückwirkende Zuordnung fürs Baseline-Jahr, dann einfrieren.",
      en: "Budgets and instrument concepts (project resource overview) are split into internal operational and impact-related spend — not present in today's budgets/OPs. Define the boundary once, embed it in the budget/OP template, backfill for the baseline year, then freeze.",
    },
    owner: "Finance/F&A, Definition mit DAIO",
    kpis: ["delivery_quote"],
  },
  {
    id: "struktur_beteiligung_erfassung",
    titel: {
      de: "Struktur-Beteiligung je Beratungsepisode erfassen",
      en: "Capture structure involvement per advisory episode",
    },
    beschreibung: {
      de: "Je Episode wird erfasst, ob Machine Room bzw. Practices unterstützt haben (zwei Ja/Nein-Felder im Episodenbogen) — Grundlage für den Anteil struktur-unterstützter Episoden und die Dosis-Wirkungs-Auswertung. Setzt die Episoden-Definition (Voraussetzung 1) voraus.",
      en: "Per episode, record whether Machine Room / Practices contributed (two yes/no fields in the episode form) — the basis for structure-supported episode share and dose-effect analysis. Requires the episode definition (precondition 1).",
    },
    owner: "AVs im Episodenregister, Standard durch DAIO",
    kpis: ["mechanismus"],
  },
  {
    id: "rollen_taxonomie",
    titel: {
      de: "Rollen-Taxonomie: fachliche vs. administrative Stellen definieren",
      en: "Role taxonomy: define expert vs. administrative positions",
    },
    beschreibung: {
      de: "Einmalige Taxonomie, welche Stellenkategorie als fachlich, welche als administrativ zählt, inkl. Anteilsregel für Mischrollen — existiert heute nicht sauber. Definiert, dokumentiert, eingefroren; sonst wird die Zuordnung Verhandlungsmasse. Mitbestimmungsunkritisch, weil Stellenkategorien bewertet werden, nicht Personen.",
      en: "One-off taxonomy classifying which position categories count as expert vs. administrative, incl. a share rule for mixed roles — not cleanly available today. Defined, documented, frozen; otherwise the classification becomes negotiable. Uncontroversial for co-determination as categories, not individuals, are assessed.",
    },
    owner: "HR (mit DAIO)",
    kpis: ["inhouse_beratungsquote", "berater_vze_anteil"],
  },
];

const STATUS_LABEL: Record<Status, { de: string; en: string }> = {
  offen: { de: "offen", en: "open" },
  definiert: { de: "definiert", en: "defined" },
  eingefuehrt: { de: "eingeführt", en: "rolled out" },
};

export const Route = createFileRoute("/app/voraussetzungen")({
  component: VoraussetzungenPage,
});

function VoraussetzungenPage() {
  const locale = useLocale();
  const vs = useStore((s: Store) => s.voraussetzungen);

  const setStatus = (id: string, status: Status) =>
    setStore((s) => ({
      ...s,
      voraussetzungen: { ...s.voraussetzungen, [id]: status },
    }));

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <header>
        <div className="text-[12px] uppercase tracking-wide text-muted-foreground">
          {locale === "de" ? "Vor der Baseline zu schaffen" : "To be established before baseline"}
        </div>
        <h1 className="text-[24px] font-semibold mt-1">
          {locale === "de"
            ? "Strukturelle Voraussetzungen der Messung"
            : "Structural preconditions of measurement"}
        </h1>
        <p className="text-[13px] text-muted-foreground mt-2 max-w-2xl">
          {locale === "de"
            ? "Ohne diese drei Voraussetzungen ist die Baseline nicht erhebbar. Zugleich die ersten konkreten Mandate des Daten-Büros (DAIO) aus dem Messgerüst."
            : "Without these three preconditions the baseline cannot be established. Also the first concrete mandates for the data office (DAIO) from the measurement framework."}
        </p>
      </header>

      <ol className="flex flex-col gap-4">
        {ITEMS.map((item, i) => {
          const status = (vs?.[item.id] ?? "offen") as Status;
          return (
            <li key={item.id} className="hairline p-5 flex flex-col gap-3">
              <div className="flex items-baseline gap-3">
                <span className="text-[12px] text-muted-foreground tabular-nums w-6">{i + 1}.</span>
                <h2 className="text-[15px] font-semibold flex-1">{item.titel[locale]}</h2>
                <StatusPill status={status} locale={locale} />
              </div>
              <p className="text-[13px] leading-relaxed text-foreground/90 pl-9">
                {item.beschreibung[locale]}
              </p>
              <dl className="pl-9 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[12px]">
                <dt className="text-muted-foreground">{locale === "de" ? "Verantwortlich" : "Owner"}</dt>
                <dd>{item.owner}</dd>
                <dt className="text-muted-foreground">{locale === "de" ? "Betrifft KPIs" : "Affects KPIs"}</dt>
                <dd className="flex flex-wrap gap-x-2 gap-y-1">
                  {item.kpis.map((id) => {
                    const k = kpiById(id);
                    return (
                      <span key={id} className="hairline px-2 py-[1px] text-[11px]">
                        {k ? k.name[locale] : id}
                      </span>
                    );
                  })}
                </dd>
              </dl>
              <div className="pl-9 flex items-center gap-2 pt-1">
                {(["offen", "definiert", "eingefuehrt"] as Status[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(item.id, s)}
                    aria-pressed={status === s}
                    className={`text-[12px] px-2 py-1 hairline ${
                      status === s ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {STATUS_LABEL[s][locale]}
                  </button>
                ))}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function StatusPill({ status, locale }: { status: Status; locale: "de" | "en" }) {
  const color =
    status === "eingefuehrt"
      ? "bg-foreground text-background"
      : status === "definiert"
        ? "hairline"
        : "hairline text-[color:var(--giz-red)]";
  return (
    <span className={`text-[11px] px-2 py-[1px] uppercase tracking-wide ${color}`}>
      {STATUS_LABEL[status][locale]}
    </span>
  );
}
