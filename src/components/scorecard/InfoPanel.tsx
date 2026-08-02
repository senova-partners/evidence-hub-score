import { useState } from "react";
import { kpiById } from "@/lib/scorecard/kpis";
import { kpiCopy, kpiFragebogen } from "@/lib/scorecard/kpi-copy";
import { useT, useLocale } from "@/lib/scorecard/useT";

/**
 * Info panel for a KPI — or, when `copyKey` / `title` are given, for one
 * sub-tab of a KPI detail view. Sub-tab mode shows the tab's subtitle as the
 * heading text and its short calculation description, then falls back to the
 * parent KPI's info fields.
 */
export function InfoPanel({
  kpiId,
  copyKey,
  title,
}: {
  kpiId: string;
  copyKey?: string;
  title?: string;
}) {
  const [open, setOpen] = useState(false);
  const t = useT();
  const locale = useLocale();
  const kpi = kpiById(kpiId);
  if (!kpi) return null;

  const copy = kpiCopy(copyKey) ?? kpiCopy(kpiId);
  const heading = title ?? kpi.name[locale];
  const subtitle = copy?.subtitle[locale] ?? kpi.subtitle?.[locale] ?? "";
  const rechenweg = copy?.rechenwegKurz[locale] ?? "";
  const fragebogen = kpiFragebogen(copyKey) ?? kpiFragebogen(kpiId);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${t("info")}: ${heading}`}
        className="text-[12px] hairline w-5 h-5 flex items-center justify-center rounded-full hover:bg-secondary"
      >
        i
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={heading}
            className="bg-background hairline max-w-lg w-full p-6 max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-[12px] text-muted-foreground uppercase tracking-wide">
                  {t("info")}
                </div>
                <h2 className="text-[16px] font-semibold">{heading}</h2>
                {subtitle && (
                  <p className="text-[13px] text-muted-foreground mt-1">{subtitle}</p>
                )}
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-[14px] px-2"
              >
                ×
              </button>
            </div>

            <dl className="space-y-4">
              {rechenweg && <Section title={t("d_formula")} body={rechenweg} />}
              <Section
                title={t("einheit") || "Einheit"}
                body={kpi.unit[locale]}
              />
              {kpi.contextLine && (
                <Section
                  title={t("kontext") || "Kontext"}
                  body={kpi.contextLine[locale]}
                />
              )}
              <Section title={t("was_misst")} body={kpi.info.was[locale]} />
              <Section title={t("warum")} body={kpi.info.warum[locale]} />
              <Section title={t("wie")} body={kpi.info.wie[locale]} />
              {kpi.info.verworfen && (
                <Section title={t("verworfen")} body={kpi.info.verworfen[locale]} />
              )}
            </dl>

            {fragebogen && (
              <section className="mt-6 pt-4 hairline-t">
                <h3 className="text-[12px] uppercase tracking-wide text-muted-foreground mb-1">
                  {fragebogen.abschnitte
                    ? locale === "de"
                      ? "Interviewleitfaden"
                      : "Interview guide"
                    : locale === "de"
                      ? "Fragebogen"
                      : "Questionnaire"}
                </h3>
                <div className="text-[13px] font-semibold">{fragebogen.title[locale]}</div>
                <p className="text-[12px] text-muted-foreground mt-1">
                  {fragebogen.intro[locale]}
                </p>
                {fragebogen.fragen && (
                  <ol className="mt-3 space-y-3">
                    {fragebogen.fragen.map((f) => (
                      <li key={f.nr}>
                        <div className="text-[12px] font-semibold tabular-nums">
                          {f.nr}. {f.titel[locale]}
                        </div>
                        <div className="text-[13px]">{f.frage[locale]}</div>
                        <div className="text-[12px] text-muted-foreground">{f.skala[locale]}</div>
                        <div className="text-[11px] italic text-muted-foreground">
                          {f.zieltAuf[locale]}
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
                {fragebogen.abschnitte && (
                  <div className="mt-3">
                    {fragebogen.abschnitte.map((a, i) => (
                      <details
                        key={a.titel.de}
                        open={i === 0}
                        className="hairline-t py-2 group"
                      >
                        <summary className="cursor-pointer list-none text-[13px] font-semibold flex items-start gap-2">
                          <span className="text-muted-foreground group-open:rotate-90 transition-transform">
                            ›
                          </span>
                          <span>{a.titel[locale]}</span>
                        </summary>
                        <div className="mt-2 pl-4 flex flex-col gap-1">
                          <div className="text-[13px]">{a.frage[locale]}</div>
                          {(a.skala ?? a.typ) && (
                            <div className="text-[12px] text-muted-foreground">
                              {(a.skala ?? a.typ)![locale]}
                            </div>
                          )}
                          {a.followups && a.followups.length > 0 && (
                            <ul className="list-disc pl-4 text-[12px] text-muted-foreground">
                              {a.followups.map((f) => (
                                <li key={f.de}>{f[locale]}</li>
                              ))}
                            </ul>
                          )}
                          {a.hinweisInterviewer && (
                            <div className="text-[12px] font-semibold text-[color:var(--giz-red)] hairline p-2">
                              {a.hinweisInterviewer[locale]}
                            </div>
                          )}
                          {a.zieltAuf && (
                            <div className="text-[11px] italic text-muted-foreground">
                              {a.zieltAuf[locale]}
                            </div>
                          )}
                        </div>
                      </details>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <dt className="text-[12px] uppercase tracking-wide text-muted-foreground mb-1">
        {title}
      </dt>
      <dd className="text-[14px]">{body}</dd>
    </div>
  );
}
