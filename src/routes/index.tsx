import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { setStore } from "@/lib/scorecard/store";
import { CURRENT_QUARTER, CLUSTERS } from "@/lib/scorecard/store";
import type { Role } from "@/lib/scorecard/types";
import { useT } from "@/lib/scorecard/useT";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Expert Powerhouse Scorecard — GIZ Jordan" },
      {
        name: "description",
        content:
          "Quarterly evidence board for the GIZ Jordan Expert Powerhouse: 12 KPIs across three packages, manual data entry, one printable snapshot.",
      },
      { property: "og:title", content: "Expert Powerhouse Scorecard — GIZ Jordan" },
      { property: "og:description", content: "The quarterly evidence board for the Expert Powerhouse." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Login,
});

const ROLES: { role: Role; de: string; en: string; needsCluster?: boolean }[] = [
  { role: "clt", de: "Country Director / CLT", en: "Country Director / CLT" },
  { role: "aoa", de: "AoA-Gruppe", en: "AoA group" },
  { role: "cc", de: "Cluster Coordinator", en: "Cluster coordinator", needsCluster: true },
  { role: "steward", de: "MR Data Steward", en: "MR data steward" },
  { role: "av", de: "AV (Auftragsverantwortliche/r)", en: "AV (project lead)", needsCluster: true },
  { role: "practice", de: "Practice Lead", en: "Practice lead" },
  { role: "jdu", de: "JDU", en: "JDU" },
  { role: "finance", de: "Finance", en: "Finance" },
  { role: "bt3", de: "BT 3", en: "BT 3" },
  { role: "panel", de: "Peer Panel", en: "Peer panel" },
];

function Login() {
  const t = useT();
  const nav = useNavigate();
  const [role, setRole] = useState<Role>("clt");
  const [pin, setPin] = useState("");
  const [cluster, setCluster] = useState<string>(CLUSTERS[0]);
  const [locale, setLocale] = useState<"de" | "en">("de");
  const [error, setError] = useState<string | null>(null);
  const roleDef = ROLES.find((r) => r.role === role)!;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pin !== "000000") {
      setError(locale === "de" ? "PIN falsch." : "Incorrect PIN.");
      return;
    }
    setStore((s) => ({
      ...s,
      session: {
        role,
        cluster: roleDef.needsCluster ? cluster : undefined,
        locale,
        quarter: CURRENT_QUARTER,
      },
    }));
    // pick landing route by role
    const dest =
      role === "steward"
        ? "/app/steward"
        : ["av", "practice", "jdu", "finance", "bt3"].includes(role)
        ? "/app/meldung"
        : role === "panel"
        ? "/app/peer-review"
        : "/app/board";
    nav({ to: dest });
  }

  return (
    <div className="min-h-dvh flex items-center justify-center px-6">
      <form
        onSubmit={submit}
        className="hairline w-full max-w-md p-8 flex flex-col gap-5 bg-card"
      >
        <div className="flex items-center gap-3">
          <span aria-hidden className="inline-block w-6 h-6 bg-[color:var(--giz-red)]" />
          <div className="leading-tight">
            <div className="text-[12px] text-muted-foreground">{t("giz_jordan")}</div>
            <div className="text-[14px] font-semibold">{t("app_name")}</div>
          </div>
        </div>

        <h1 className="text-[20px] font-semibold">{t("login_title")}</h1>

        <label className="flex flex-col gap-1">
          <span className="text-[12px] text-muted-foreground">{t("language")}</span>
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as "de" | "en")}
            className="hairline bg-background px-3 py-2"
          >
            <option value="de">Deutsch</option>
            <option value="en">English</option>
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[12px] text-muted-foreground">{t("role")}</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="hairline bg-background px-3 py-2"
          >
            {ROLES.map((r) => (
              <option key={r.role} value={r.role}>
                {locale === "de" ? r.de : r.en}
              </option>
            ))}
          </select>
        </label>

        {roleDef.needsCluster && (
          <label className="flex flex-col gap-1">
            <span className="text-[12px] text-muted-foreground">{t("cluster")}</span>
            <select
              value={cluster}
              onChange={(e) => setCluster(e.target.value)}
              className="hairline bg-background px-3 py-2"
            >
              {CLUSTERS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
        )}

        <label className="flex flex-col gap-1">
          <span className="text-[12px] text-muted-foreground">{t("pin")}</span>
          <input
            type="password"
            inputMode="numeric"
            autoComplete="current-password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="hairline bg-background px-3 py-2 tracking-widest"
            placeholder="••••••"
            aria-describedby="pin-hint"
          />
          <span id="pin-hint" className="text-[11px] text-muted-foreground">
            {t("demo_hint")}
          </span>
        </label>

        {error && (
          <div
            role="alert"
            className="text-[12px] text-[color:var(--giz-red)] hairline px-3 py-2"
          >
            ✕ {error}
          </div>
        )}

        <button
          type="submit"
          className="bg-foreground text-background px-4 py-2 text-[14px] font-semibold hover:opacity-90"
        >
          {t("sign_in")}
        </button>
      </form>
    </div>
  );
}
