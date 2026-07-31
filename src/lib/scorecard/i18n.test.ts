// Guard rails for the bilingual layer.
// These tests fail as soon as new content is added without an English
// counterpart — that is the mechanism that keeps the English view working
// "in the future", not just today.

import { describe, it, expect } from "vitest";
import { T } from "./i18n";
import { KPIS } from "./kpis";
import { KPI_DETAILS } from "./kpi-details";
import { KPI_DETAILS_EN } from "./kpi-details.en";
import { MECHANISMUS_VIEWS } from "./mechanismus-views";
import { KOFI_VIEWS } from "./kofi-views";

describe("i18n dictionary", () => {
  it("has a non-empty English string for every key", () => {
    const missing = Object.entries(T)
      .filter(([, v]) => !v.en || !v.en.trim())
      .map(([k]) => k);
    expect(missing).toEqual([]);
  });

  it("has a non-empty German string for every key", () => {
    const missing = Object.entries(T)
      .filter(([, v]) => !v.de || !v.de.trim())
      .map(([k]) => k);
    expect(missing).toEqual([]);
  });
});

describe("KPI definitions", () => {
  it("carry both locales for name, unit and info blocks", () => {
    const problems: string[] = [];
    for (const kpi of KPIS) {
      const bilinguals: Array<[string, { de?: string; en?: string } | undefined]> = [
        ["name", kpi.name],
        ["nLabel", kpi.nLabel],
        ["info.was", kpi.info?.was],
        ["info.warum", kpi.info?.warum],
        ["info.wie", kpi.info?.wie],
      ];
      for (const [field, value] of bilinguals) {
        if (!value?.de?.trim() || !value?.en?.trim()) {
          problems.push(`${kpi.id}.${field}`);
        }
      }
    }
    expect(problems).toEqual([]);
  });
});

describe("KPI detail content", () => {
  it("has an English overlay for every detail record", () => {
    const missing = Object.keys(KPI_DETAILS).filter((id) => !KPI_DETAILS_EN[id]);
    expect(missing).toEqual([]);
  });

  it("translates every field of every detail record", () => {
    const problems: string[] = [];
    for (const [id, de] of Object.entries(KPI_DETAILS)) {
      const en = KPI_DETAILS_EN[id];
      if (!en) continue;
      if (!en.formula_text?.trim()) problems.push(`${id}.formula_text`);
      if (!en.worked_example?.trim()) problems.push(`${id}.worked_example`);
      if (en.raw_schema?.length !== de.raw_schema.length) problems.push(`${id}.raw_schema`);
      if (en.raw_rows?.length !== de.raw_rows.length) problems.push(`${id}.raw_rows`);
      for (const key of ["owner", "cadence", "verifizierung"] as const) {
        if (!en.erhebung?.[key]?.trim()) problems.push(`${id}.erhebung.${key}`);
      }
      if (de.erhebung.methode && !en.erhebung?.methode?.trim()) {
        problems.push(`${id}.erhebung.methode`);
      }
    }
    expect(problems).toEqual([]);
  });
});

describe("KPI sub-views", () => {
  it("are bilingual for label, definition and worked example", () => {
    const problems: string[] = [];
    for (const view of [...MECHANISMUS_VIEWS, ...KOFI_VIEWS]) {
      for (const field of ["label", "definition", "workedExample"] as const) {
        const value = view[field];
        if (!value.de?.trim() || !value.en?.trim()) problems.push(`${view.id}.${field}`);
      }
    }
    expect(problems).toEqual([]);
  });
});
