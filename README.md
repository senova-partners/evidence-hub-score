# Expert Powerhouse Scorecard

GIZ Jordan - Expert Powerhouse Scorecard — Product Specification for Prototyping

Version 0.1 · July 2026 · Basis: 12 KPIs in 3 packages (Außenbeweis, Beratungsqualität, Struktur-Effizienz), manual data entry only, no system integrations.

1. Interface Type

Responsive web application (single-page app), desktop-first (primary use: office laptops, CLT meetings via beamer), fully usable on tablet; mobile = read-only views.

No external system connections. All data is entered manually through role-specific forms. Data persists in a single structured store (prototype: local JSON / browser storage; production candidate: one server-side database with nightly export).

Print/PDF export of the quarterly snapshot (one page, A4 landscape) — the artifact that goes to CLT/AoA.

No email sending, no notifications in v1; deadlines are shown in-app only.

2. User Groups and Primary User Goal

Country Director / CLT — "In 60 seconds: does the Expert Powerhouse work this quarter, and where does it not?" (read-only, portfolio level)

AoA group — "Run the half-year Werkstück review: see trends, tensions, and open interpretation questions." (read-only portfolio + annotation)

MR Data Steward (+ deputy) — "Consolidate all submissions into one master dataset, catch implausible values, keep the change log." (full read/write)

Cluster Coordinator — "See my cluster against the portfolio aggregate — not against other clusters." (read-only, own cluster + aggregate)

Submitters (AV, Practice Lead, JDU, Finance, BT 3, Peer Panel) — "Enter my Meldebogen in under 15 minutes, on time, without seeing anything I shouldn't."

Partner (indirect, no login) — answers the 5-question episode form via a share link/printout handed over by the AV; never sees the app.

3. Core Functions

Test Verdict Banner — computes and displays the binary quarterly verdict (erfüllt / nicht erfüllt / Baseline fehlt) from the rule: Paket 1–2 rising, Paket 3 stable or better. JTBD: Lorenz' "aus weniger was Besseres" answered in one glance.

Beweis Board — 12 KPI cards grouped in the three packages; each card shows current value, Δ vs. baseline, trend arrow, reporting status (✕ if missing — never estimated). JTBD: credible evidence scaffold, visible at once.

KPI Info Button — every measure carries an ⓘ opening a plain-language panel: what it measures, why we chose it (2–3 sentences, incl. literature anchor), how it is verified, and which alternatives were rejected and why (e.g., Overhead-Quote, VZE/Umsatz). JTBD: the measurement is self-explanatory and defensible without Tobias in the room.

Trend View — per KPI: time series from baseline onward, baseline marked as reference line; variance band between teams where applicable (systematics evidence). JTBD: movement, not point values, is what gets judged.

Diagnostik List — deviation-only list (Testvorgang, First-Time-Right optional, Agenda ratio, Practice usage, Schmerzpunkt scores) plus context lines (Eigenleistungsquote). JTBD: when the verdict fails, show where it clamps.

Meldebogen Forms — one form per role and cycle, mirroring the paper Meldebögen (A–H); ≤15 min completion; save draft, submit once; deadline shown; aggregate-only fields for anything people-related (n ≥ 5 guard built into the form, refuses smaller groups). JTBD: manual data entry that people actually complete.

Episode Register — lightweight list of Beratungsepisoden (ID, cluster, partner, close date, mechanism checkboxes: Practice product used? MR contributed?); feeds Partnerbogen dispatch, 6-month Uptake follow-up queue, and random draw for Peer Review. JTBD: the missing measurement unit "episode" exists and drives everything event-based.

Uptake Follow-up Queue — auto-generated worklist of episodes closing 6 months ago; capture umgesetzt / angepasst / nicht genutzt + one sentence. JTBD: the hardest quality number gets collected without anyone remembering dates.

Peer Review Draw & Capture — steward triggers random selection (2 products per cluster per half-year) from the episode register; panel enters criterion scores with mandatory justification sentence. JTBD: no cherry-picking, structured Fachurteil.

Steward Console — submission overview (on time / late / missing), plausibility flags (>30 % jump vs. previous period → mandatory query note), change log (who reported what when), baseline manager (one-time Ist capture per KPI), lock-per-quarter. JTBD: one master dataset with four-eyes discipline.

Closed-Loop Tracker — every partner score below threshold creates a follow-up item (owner: AV, due 14 days); status reported in the review. JTBD: measurement starts conversations instead of replacing them.

Evidenzbank — quarterly story entries per cluster ("wäre letztes Jahr nicht gegangen": 3 sentences, date, involved, estimated saving); searchable list. JTBD: qualitative proof for CLT/BMZ communication.

Nicht-gemessen Page — static page listing deliberately unmeasured items (individual utilization, activity counts, incentive coupling) and rejected KPIs with reasons. JTBD: honesty as a feature; Betriebsrat assurance visible in-product.

Snapshot Export — one-page PDF of the current quarter (board + verdict + Meldetreue + footer assurances). JTBD: the distributable artifact.

4. Full Navigation Flow

Entry: Login screen → role selection (dropdown or role cards) → role-specific PIN → lands on role home. No registration, no password reset flow (PINs administered by steward).

CLT / AoA / CC (read roles): Home = Beweis Board (CC: pre-filtered to own cluster with portfolio aggregate line) → tap KPI card → Trend View → ⓘ Info panel (overlay) → back. Top nav: Board · Diagnostik · Evidenzbank · Nicht gemessen · Export. Quarter switcher persistent in header. AoA additionally: "Review" tab = board + the three standing questions with free-text annotation fields per half-year.

Submitter roles: Home = "Meine Meldung" (current cycle form, deadline, status) → fill → submit → confirmation with what happens next. Secondary tab: "Meine Historie" (own past submissions only). AVs additionally: Episode Register (own episodes: create/close episode, mechanism checkboxes, trigger partner form link, Uptake queue, Closed-Loop items).

Steward: Home = Console (submission matrix roles × cycle) → drill into any submission → flag/query → master board preview → baseline manager → quarter lock → export. Full nav includes all read views.

Partner (no login): direct link → 5 questions + one free text → submit → thank-you. Nothing else reachable.

5. Key UI Elements

KPI Card: package label (small), KPI name, ⓘ button, large current value, Δ vs. baseline with direction arrow, context line (e.g., Rücklaufquote, n), status dot (reported / missing ✕ / flagged). Scharnier-KPI (Fachzeit) visually distinct (accent border, not color-only).

Verdict Badge: text + icon ("erfüllt", "nicht erfüllt", "Baseline fehlt") — never color alone.

Info Panel (per KPI): four fixed sections — Was es misst · Warum diese Kennzahl (with one-line literature anchor) · Wie verifiziert · Geprüft und verworfen. Max ~120 words, plain language, German first.

Hairline tables & ruled lists for Diagnostik and console (no zebra fills, no card shadows).

Trend chart: single line, baseline as dashed reference, no gradients; optional thin variance band.

Form elements: numeric steppers with unit suffix, date picker, segmented control for categorical answers (umgesetzt/angepasst/nicht genutzt), character-limited text areas, n ≥ 5 guard message.

Meldetreue header chip: "12/14 pünktlich" in the board header.

Change-log rows: timestamp · role · field · old→new, monospaced values.

6. Localization Needs

German (de-DE) primary — all KPI names, info texts, forms. English (en) full secondary locale (international staff, EU contingent). Language toggle in header, persisted per user.

Arabic (ar) planned for the partner form only (episode feedback goes to Jordanian partners): RTL support required for that single form in v2 — build the form layout RTL-safe from the start.

Number/date formats per locale (1.234,5 vs 1,234.5; 31.03.2027 vs 2027-03-31). All strings externalized (i18n keys), no text baked into components. Terminology fixed via glossary (Machine Room, Practice, Beratungsepisode remain untranslated terms in both locales).

7. Accessibility Requirements

WCAG 2.1 AA as target: contrast ≥ 4.5:1 (GIZ red on white passes for large text/accents only — body text stays near-black), visible focus states, full keyboard operability, logical tab order in forms.

Never color-only meaning: every trend/status is arrow/icon + text label.

Screen-reader: ARIA labels on cards ("Fachzeit-Quote, 28 Prozent, verbessert gegenüber Baseline 34 Prozent"), info panels as accessible dialogs, tables with proper headers.

Minimum body size 14 px, line height ≥ 1.4; charts carry data tables as accessible fallback.

Forms: error messages inline and programmatically associated; 15-minute forms must be save-and-resume (no session loss punishment).

8. Logins and Roles (no registration)

Separate login per role, pre-provisioned: clt, aoa, cc-<cluster>, steward, av-<team>, practice-<name>, jdu, finance, bt3, panel. PIN-based (6 digits), issued and rotated by the steward; deputy PINs for steward role.

Session: 8 h, single active view per login is acceptable for prototype.

Visibility enforcement (Stufe 1–4): submitters see only own forms/history · CC sees own cluster + portfolio aggregate, never other clusters' single values · CLT/AoA see portfolio with cluster breakdown · steward sees raw submissions. Person-level raw data appears in no view; aggregates only from n ≥ 5 (otherwise auto-rolled up one level). Partner link is tokenized per episode, single-use.

Design Direction

Brand: GIZ reference (giz.de) — white ground, near-black text, GIZ Red #C80F0F strictly as accent (verdict, Scharnier border, primary action), generous white space, Arial/Helvetica-class sans only. No decorative imagery, no icons beyond functional ones (ⓘ, arrows, status dots).

Rams applied: as little design as possible — hairlines instead of fills; one typeface, two weights, three sizes; every element earns its place (if a label can be removed, remove it); honest states (missing data shown as missing, never interpolated); long-lived layout (the board's structure does not change between quarters — only values move).

Apple-grade restraint in interaction: one primary action per screen, overlays instead of page jumps for info, no confirmation theater (submit once, undo via steward).

Tone of all UI copy: precise, unexcited German — "Meldung fehlt", not "Oops!".

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://evidence-hub-score.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7fd68cba-5c9c-407f-94a4-77b3d1fa761a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
