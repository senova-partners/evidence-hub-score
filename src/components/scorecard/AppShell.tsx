import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useStore, setStore, QUARTERS, resetDemo, type Store } from "@/lib/scorecard/store";
import { useT } from "@/lib/scorecard/useT";
import { meldetreue } from "@/lib/scorecard/verdict";
import type { Role } from "@/lib/scorecard/types";

const NAV_BY_ROLE: Record<Role, Array<{ to: string; key: string }>> = {
  clt: [
    { to: "/app/board", key: "nav_board" },
    { to: "/app/diagnostik", key: "nav_diagnostik" },
    { to: "/app/evidenzbank", key: "nav_evidenz" },
    { to: "/app/nicht-gemessen", key: "nav_nicht_gemessen" },
    { to: "/app/export", key: "nav_export" },
  ],
  aoa: [
    { to: "/app/board", key: "nav_board" },
    { to: "/app/review", key: "nav_review" },
    { to: "/app/diagnostik", key: "nav_diagnostik" },
    { to: "/app/evidenzbank", key: "nav_evidenz" },
    { to: "/app/nicht-gemessen", key: "nav_nicht_gemessen" },
    { to: "/app/export", key: "nav_export" },
  ],
  cc: [
    { to: "/app/board", key: "nav_board" },
    { to: "/app/diagnostik", key: "nav_diagnostik" },
    { to: "/app/evidenzbank", key: "nav_evidenz" },
    { to: "/app/export", key: "nav_export" },
  ],
  steward: [
    { to: "/app/steward", key: "nav_steward" },
    { to: "/app/board", key: "nav_board" },
    { to: "/app/diagnostik", key: "nav_diagnostik" },
    { to: "/app/evidenzbank", key: "nav_evidenz" },
    { to: "/app/nicht-gemessen", key: "nav_nicht_gemessen" },
    { to: "/app/export", key: "nav_export" },
  ],
  av: [
    { to: "/app/meldung", key: "nav_meldung" },
    { to: "/app/episoden", key: "nav_episoden" },
    { to: "/app/uptake", key: "nav_uptake" },
    { to: "/app/closed-loop", key: "nav_closed_loop" },
    { to: "/app/meldung/historie", key: "nav_historie" },
  ],
  practice: [
    { to: "/app/meldung", key: "nav_meldung" },
    { to: "/app/meldung/historie", key: "nav_historie" },
  ],
  jdu: [
    { to: "/app/meldung", key: "nav_meldung" },
    { to: "/app/meldung/historie", key: "nav_historie" },
  ],
  finance: [
    { to: "/app/meldung", key: "nav_meldung" },
    { to: "/app/meldung/historie", key: "nav_historie" },
  ],
  bt3: [
    { to: "/app/meldung", key: "nav_meldung" },
    { to: "/app/meldung/historie", key: "nav_historie" },
  ],
  panel: [
    { to: "/app/peer-review", key: "nav_peer" },
    { to: "/app/meldung/historie", key: "nav_historie" },
  ],
};

export function AppShell() {
  const session = useStore((s: Store) => s.session);
  const store = useStore((s: Store) => s);
  const t = useT();
  const nav = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (!session) {
    // redirect handled by route guards; render nothing
    return null;
  }
  const links = NAV_BY_ROLE[session.role];
  const mt = meldetreue(store, session.quarter);

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="hairline-b bg-background no-print">
        <div className="max-w-[1280px] mx-auto px-6 py-3 flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="inline-block w-6 h-6 bg-[color:var(--giz-red)]"
            />
            <div className="leading-tight">
              <div className="text-[12px] text-muted-foreground">{t("giz_jordan")}</div>
              <div className="text-[13px] font-semibold">{t("app_name")}</div>
            </div>
          </div>

          <nav className="flex items-center gap-4 flex-1 flex-wrap">
            {links.map((l) => {
              const active = pathname === l.to || (l.to !== "/app/meldung" && pathname.startsWith(l.to));
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`text-[13px] ${
                    active ? "font-semibold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t(l.key)}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 text-[12px]">
            <span className="hairline px-2 py-1">
              {mt.onTime}/{mt.total} {t("meldetreue_short")}
            </span>
            <label className="flex items-center gap-1">
              <span className="sr-only">{t("quarter")}</span>
              <select
                value={session.quarter}
                onChange={(e) =>
                  setStore((s) => ({ ...s, session: s.session ? { ...s.session, quarter: e.target.value } : s.session }))
                }
                className="hairline bg-background px-2 py-1 text-[12px]"
              >
                {QUARTERS.map((q) => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-1">
              <span className="sr-only">{t("language")}</span>
              <select
                value={session.locale}
                onChange={(e) =>
                  setStore((s) => ({
                    ...s,
                    session: s.session ? { ...s.session, locale: e.target.value as "de" | "en" } : s.session,
                  }))
                }
                className="hairline bg-background px-2 py-1 text-[12px]"
              >
                <option value="de">DE</option>
                <option value="en">EN</option>
              </select>
            </label>
            <button
              type="button"
              onClick={() => {
                if (confirm("Reset demo data?")) resetDemo();
              }}
              className="text-muted-foreground hover:text-foreground"
              title="Reset demo"
            >
              ↺
            </button>
            <button
              type="button"
              onClick={() => {
                setStore((s) => ({ ...s, session: null }));
                nav({ to: "/" });
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              {t("logout")}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1280px] mx-auto w-full px-6 py-8 print-page">
        <Outlet />
      </main>

      <footer className="hairline-t no-print">
        <div className="max-w-[1280px] mx-auto px-6 py-3 text-[11px] text-muted-foreground flex items-center justify-between">
          <span>
            {session.role.toUpperCase()}
            {session.cluster ? ` · ${session.cluster}` : ""} · {session.quarter}
          </span>
          <span>Aggregate only (n ≥ 5). Person-level values are not shown.</span>
        </div>
      </footer>
    </div>
  );
}
