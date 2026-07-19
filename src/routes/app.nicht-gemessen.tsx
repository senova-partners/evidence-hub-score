import { createFileRoute } from "@tanstack/react-router";
import { useT, useLocale } from "@/lib/scorecard/useT";

export const Route = createFileRoute("/app/nicht-gemessen")({
  component: NichtGemessen,
});

const ITEMS = [
  {
    de: "Individuelle Auslastung",
    en: "Individual utilisation",
    why_de: "Betriebsrat-inkompatibel und disziplinierend statt lernend.",
    why_en: "Incompatible with the works council and disciplinary rather than developmental.",
  },
  {
    de: "Aktivitätszählungen (E-Mails, Meetings)",
    en: "Activity counts (emails, meetings)",
    why_de: "Falscher Proxy — misst Bewegung, nicht Wirkung.",
    why_en: "Wrong proxy — measures motion, not impact.",
  },
  {
    de: "Kopplung an Anreize (Bonus, Beurteilung)",
    en: "Coupling to incentives (bonus, appraisal)",
    why_de: "Goodhart's Law: gemessen wird das Steuern, nicht der Zustand.",
    why_en: "Goodhart's law: measuring becomes steering, not observation.",
  },
  {
    de: "Overhead-Quote",
    en: "Overhead ratio",
    why_de: "Struktur-fremd und im Powerhouse-Kontext irreführend.",
    why_en: "Off-topic and misleading in the Powerhouse context.",
  },
  {
    de: "VZE pro Umsatz",
    en: "FTE per revenue",
    why_de: "Falsche Optimierungsrichtung für ein Beratungshaus.",
    why_en: "Wrong optimisation direction for an advisory house.",
  },
  {
    de: "Net Promoter Score",
    en: "Net Promoter Score",
    why_de: "Zu grob und kulturell unpassend.",
    why_en: "Too coarse and culturally unfit.",
  },
];

function NichtGemessen() {
  const t = useT();
  const locale = useLocale();
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-[22px] font-semibold">{t("nm_title")}</h1>
        <p className="text-[13px] text-muted-foreground mt-1">{t("nm_intro")}</p>
      </div>
      <ul>
        {ITEMS.map((it, i) => (
          <li key={i} className="hairline-b py-4">
            <div className="font-semibold text-[14px]">{locale === "de" ? it.de : it.en}</div>
            <p className="text-[13px] text-muted-foreground mt-1">
              {locale === "de" ? it.why_de : it.why_en}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
