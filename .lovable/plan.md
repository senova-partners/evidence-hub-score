# GIZ Jordan — Expert Powerhouse Scorecard (Prototype v0.1)

A responsive, desktop-first single-page app. Prototype uses browser localStorage only (no backend, no Cloud). German-first UI, English toggle. GIZ brand: white ground, near-black text, GIZ Red #C80F0F as accent only, single sans typeface (Arial/Helvetica), hairlines instead of fills, Rams/Apple restraint.

## Scope for v0.1 (this build)

I will ship a working clickable prototype covering every screen in the spec, seeded with plausible demo data for one baseline quarter + two reporting quarters so the verdict logic, trends, and diagnostics are visible immediately. Data persists in localStorage; a "Reset demo data" control re-seeds.

Out of scope for v0.1: Arabic/RTL partner form (stub only, English/German partner form works), real PDF export (uses `window.print()` with a print stylesheet producing the A4 landscape one-pager), email/notifications.

## Design system (locked before screens)

- Tokens in `src/styles.css`: `--background` white, `--foreground` near-black `oklch(0.15 0 0)`, `--accent` GIZ Red `oklch(0.51 0.22 27)` (≈#C80F0F), `--border` hairline `oklch(0.88 0 0)`, `--muted-foreground` `oklch(0.45 0 0)`. No shadows, no radii beyond 2px, no gradients.
- Typography: system sans stack (Arial/Helvetica/-apple-system). Two weights (400, 600). Three sizes: 12/14/28.
- Components: hairline `Card`, `KpiCard`, `VerdictBadge` (icon+text, never color-only), `InfoPanel` dialog, `TrendChart` (single line + dashed baseline reference, no gradient, uses Recharts), `HairlineTable`, `StatusDot`, `FormField` with unit steppers, `NGuard` (n≥5 message).
- All status/trend meaning carries an icon + text label (↑ improved, ↓ declined, → stable, ✕ missing).

## Routing (TanStack Router, file-based)

```
/                     → Login (role picker + PIN, PINs pre-filled hint for demo)
/app/board            → Beweis Board (default for CLT/AoA/CC)
/app/kpi/$id          → Trend View for a KPI
/app/diagnostik       → Diagnostik list
/app/evidenzbank      → Evidenzbank stories
/app/nicht-gemessen   → Static honesty page
/app/export           → Snapshot (print-ready A4 landscape)
/app/review           → AoA half-year review + annotations
/app/meldung          → Submitter home (current cycle form)
/app/meldung/historie → Own submission history
/app/episoden         → AV Episode Register (list + create/close)
/app/uptake           → Uptake follow-up queue (AV)
/app/closed-loop      → Closed-loop tracker (AV)
/app/peer-review      → Peer review draw & capture
/app/steward          → Steward console (submissions matrix, flags, log, baseline, lock)
/partner/$token       → Partner 5-question form (no chrome, no login)
```

Shared app chrome in `/app` layout: top nav with role-appropriate items, persistent quarter switcher, language toggle, Meldetreue chip, logout.

## State & data model (localStorage, typed)

Single `store` module with typed slices:

- `session`: current role, cluster (if CC/AV), language, quarter.
- `kpis`: 12 KPI defs across 3 packages (Außenbeweis, Beratungsqualität, Struktur-Effizienz) with info-panel content (Was/Warum/Wie/Verworfen).
- `baselines`: one Ist value per KPI (steward-editable, one-time).
- `submissions`: role×cycle entries with values, timestamps, status (on-time/late/missing), flags.
- `episodes`: id, cluster, partner, close date, mechanism checkboxes, partner-response token+status, uptake status.
- `peerDraws`: half-year draws with scores + justifications.
- `closedLoop`: items from low partner scores, owner, due date, status.
- `evidenz`: quarterly stories (cluster, 3 sentences, date, involved, saving).
- `changeLog`: append-only who/what/when/old→new.

Verdict computation: pure function `computeVerdict(quarter)` returns `erfüllt | nicht_erfüllt | baseline_fehlt` from rule "Paket 1–2 rising, Paket 3 stable or better". Δ vs. baseline, trend arrow, n≥5 guard, plausibility flag (>30% jump) all pure helpers with unit-testable shape.

## Role-based visibility (Stufe 1–4)

Enforced in route guards + query selectors:
- Submitters: only own forms + own history.
- CC: own cluster values + portfolio aggregate line (never other clusters' single values).
- CLT/AoA: portfolio with cluster breakdown; person-level raw never shown; n<5 auto-rolls one level up.
- Steward: raw submissions + console.
- Partner token: single episode form, single-use flag.

## i18n

- `src/i18n/{de,en}.ts` dictionaries; `useT()` hook; language persisted in localStorage.
- Numbers/dates via `Intl` locale-aware formatters. Glossary terms (Machine Room, Practice, Beratungsepisode) untranslated in both locales.
- Arabic scaffolding present (locale key + `dir="rtl"` support on the partner form container) but strings unfilled in v0.1.

## Accessibility

- WCAG 2.1 AA contrast; GIZ Red only for accents/large text.
- Focus rings visible (2px near-black outline, 2px offset).
- KPI cards as buttons with descriptive `aria-label` (e.g., "Fachzeit-Quote, 28 Prozent, verbessert gegenüber Baseline 34 Prozent").
- Info panels are Radix Dialog (shadcn) with proper labelling.
- Charts include a visually-hidden `<table>` fallback with the same series.
- Forms: inline errors, `aria-describedby`, save-draft on every change (no data loss).
- Min body 14px, line-height 1.5.

## Implementation order

1. Tokens + typography + base primitives (`Card`, `Button`, `Dialog`, `Table`) restyled to hairline/GIZ.
2. Store + seed data + verdict logic (+ small vitest sanity tests on verdict/aggregation).
3. Login + role routing + `/app` layout with quarter switcher, language toggle, Meldetreue chip.
4. Beweis Board + KPI Info Panel + Trend View.
5. Diagnostik, Evidenzbank, Nicht-gemessen, Snapshot Export (print stylesheet).
6. Submitter Meldebogen forms (one per role) + history.
7. AV: Episode Register, Uptake Queue, Closed-Loop, Partner form route.
8. Peer Review draw & capture.
9. Steward Console (matrix, plausibility flags, change log, baseline manager, quarter lock).
10. AoA Review annotations.
11. Head metadata per route, sitemap.xml, robots.txt.

## Technical notes

- TanStack Start file-based routes; loaders read from the localStorage store synchronously (no server functions needed for prototype).
- Charts: Recharts (already in stack) styled to single-line hairline + dashed baseline reference.
- Print: dedicated `@media print` rules on `/app/export` producing A4 landscape one-pager.
- No shadcn defaults leak: every used primitive is re-tokened to hairline, no shadows, no rounded-2xl, no zebra.

## What the user will see when done

Login as any role (PIN hints on the login screen for demo). Land on the appropriate home. Every screen in the spec is reachable, populated with seeded data, and the quarterly verdict computes live from that data. Switching language flips all UI strings. Steward can edit a value → change log updates → board reflects it. Printing the Export page produces the one-page A4 landscape snapshot.
