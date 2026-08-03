// Unit tests for computeVerdict (v1.1 strict rule).
//
// Regel: "Erfüllt" nur, wenn in JEDEM Paket mindestens ein KPI verbessert und
// KEIN KPI verschlechtert ist ("flat" ist neutral). Alle anderen Zustände
// (fehlender Wert in P1/P2, fehlende Baseline, Verschlechterung irgendwo)
// blockieren "erfüllt".

import { describe, expect, it } from "vitest";
import { computeVerdict, boardKpis } from "./verdict";
import { KPIS } from "./kpis";
import type { Store } from "./store";

const Q = "2026-Q3";

// Baselines mirror seed() in store.ts. Kept as a local map so this test can
// drive the verdict without pulling the seeded store (which also sets values).
const BASELINES: Record<string, number> = {
  wiederbeauftragung: 48,
  kofi_proposal: 31,
  medien: 46.8,
  medien_engagement: 3.1,
  medien_reach: 4200,
  medien_sentiment: 52,
  partnerfeedback_jahr: 0,
  delivery_quote: 78,
  partnerbogen: 3.6,
  uptake: 42,
  peer_review: 3.4,
  leadership_review: 3.1,
  mechanismus: 34,
  fachzeit: 66,
  inhouse_beratungsquote: 40,
  berater_vze_anteil: 58,
  testvorgang: 21,
  abflusstreue: 84,
  schmerzpunkt: 3.2,
};

function makeStore(
  values: Record<string, number | null>,
  baselines?: Record<string, number>,
): Store {
  const store: Store = {
    // Store shape mirrors what verdict.ts reads; we only need baselines & values.
    // Any extra fields are safely ignored by the verdict functions.
    baselines: { ...BASELINES, ...(baselines ?? {}) },
    values: Object.fromEntries(
      Object.entries(values).map(([id, v]) => [
        id,
        { [Q]: { value: v, reported: v !== null } },
      ]),
    ),
  } as unknown as Store;
  return store;
}

// Move a KPI clearly beyond the trend tolerance (eps: 0.5 for %, 0.05 for scores).
function improved(id: string): number {
  const k = KPIS.find((x) => x.id === id)!;
  const b = BASELINES[id] ?? 0;
  const step = k.format === "score" ? 0.2 : 2;
  return k.direction === "lower_better" ? b - step : b + step;
}
function worsened(id: string): number {
  const k = KPIS.find((x) => x.id === id)!;
  const b = BASELINES[id] ?? 0;
  const step = k.format === "score" ? 0.2 : 2;
  return k.direction === "lower_better" ? b + step : b - step;
}
function flat(id: string): number {
  return BASELINES[id] ?? 0;
}

const active = boardKpis();
// Paketnummern folgen der aktuellen Nummerierung:
// P1 = Beratungsqualität, P2 = Struktur-Effizienz, P3 = Außenbeweis.
const p1 = active.filter((k) => k.pkg === "beratungsqualitaet").map((k) => k.id);
const p2 = active.filter((k) => k.pkg === "struktur").map((k) => k.id);
const p3 = active.filter((k) => k.pkg === "aussenbeweis").map((k) => k.id);

function allImproved(): Record<string, number> {
  return Object.fromEntries(active.map((k) => [k.id, improved(k.id)]));
}

describe("computeVerdict (v1.1 strict)", () => {
  it("erfüllt: alle KPIs in allen drei Paketen verbessert", () => {
    expect(computeVerdict(makeStore(allImproved()), Q)).toBe("erfuellt");
  });

  it("erfüllt: mindestens einer je Paket verbessert, Rest flat, keiner verschlechtert", () => {
    const values: Record<string, number> = {};
    for (const pkg of [p1, p2, p3]) {
      pkg.forEach((id, i) => (values[id] = i === 0 ? improved(id) : flat(id)));
    }
    expect(computeVerdict(makeStore(values), Q)).toBe("erfuellt");
  });

  it("nicht_erfuellt: eine Verschlechterung im Außenbeweis kippt das Urteil (früher unter Mehrheitsregel grün)", () => {
    const values = allImproved();
    values[p3[0]] = worsened(p3[0]); // z. B. Wiederbeauftragung ↓ bei sonst allem ↑
    expect(computeVerdict(makeStore(values), Q)).toBe("nicht_erfuellt");
  });

  it("nicht_erfuellt: eine Verschlechterung in Paket 2 kippt", () => {
    const values = allImproved();
    values[p2[0]] = worsened(p2[0]);
    expect(computeVerdict(makeStore(values), Q)).toBe("nicht_erfuellt");
  });

  it("nicht_erfuellt: alles flat (keine Verbesserung irgendwo)", () => {
    const values = Object.fromEntries(active.map((k) => [k.id, flat(k.id)]));
    expect(computeVerdict(makeStore(values), Q)).toBe("nicht_erfuellt");
  });

  it("unvollstaendig: fehlender Wert in Paket 1 überschreibt alles", () => {
    const values: Record<string, number | null> = allImproved();
    values[p1[0]] = null;
    expect(computeVerdict(makeStore(values), Q)).toBe("unvollstaendig");
  });

  it("unvollstaendig: fehlender Wert in Paket 2 überschreibt alles", () => {
    const values: Record<string, number | null> = allImproved();
    values[p2[0]] = null;
    expect(computeVerdict(makeStore(values), Q)).toBe("unvollstaendig");
  });

  it("baseline_fehlt: fehlt eine Baseline, kein anderes Urteil", () => {
    const values = allImproved();
    const baselines = { ...BASELINES };
    delete baselines[p1[0]];
    expect(
      computeVerdict(
        { ...makeStore(values), baselines } as unknown as Store,
        Q,
      ),
    ).toBe("baseline_fehlt");
  });
});
