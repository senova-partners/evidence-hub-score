import type { Verdict } from "@/lib/scorecard/types";
import { useT } from "@/lib/scorecard/useT";

const glyph: Record<Verdict, string> = {
  erfuellt: "●",
  nicht_erfuellt: "✕",
  baseline_fehlt: "—",
};

const key: Record<Verdict, string> = {
  erfuellt: "verdict_erfuellt",
  nicht_erfuellt: "verdict_nicht",
  baseline_fehlt: "verdict_baseline",
};

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const t = useT();
  const accent = verdict === "nicht_erfuellt";
  return (
    <div
      className={`inline-flex items-center gap-3 px-4 py-3 hairline ${
        accent ? "border-l-4 border-l-[color:var(--giz-red)]" : ""
      }`}
      role="status"
    >
      <span aria-hidden className="text-[18px] leading-none">
        {glyph[verdict]}
      </span>
      <div>
        <div className="text-[16px] font-semibold">{t(key[verdict])}</div>
        <div className="text-[12px] text-muted-foreground">{t("verdict_rule")}</div>
      </div>
    </div>
  );
}
