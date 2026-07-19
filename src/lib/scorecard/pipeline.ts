// Akquise-Pipeline — Diagnostik zu KPI "Kofinanzierung & Proposal-Erfolg".
// Bewusst KEIN Beweis-KPI (kein Zielwert): misst Aktivität und Zukunft.
// Werte aus scorecard_kpi_config.json / diagnostik_context.pipeline.

export interface PipelineStage {
  id: 1 | 2 | 3;
  name: { de: string; en: string };
  definition: { de: string; en: string };
  anzahl: number;
  volumenMio: number;
  eu?: { anzahl: number; volumenMio: number };
}

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 1,
    name: { de: "Identifiziert", en: "Identified" },
    definition: {
      de: "Lead / Programming-Signal (EU) · Interessensbekundung, Ausschreibung gesichtet (Drittgeber)",
      en: "Lead / programming signal (EU) · expression of interest, tender spotted (third-party)",
    },
    anzahl: 12,
    volumenMio: 8.4,
  },
  {
    id: 2,
    name: { de: "Formalisiert", en: "Formalised" },
    definition: {
      de: "Action Document in Vorbereitung / eingereicht (EU) · Concept Note, Proposal, Ausschreibungsteilnahme (Drittgeber)",
      en: "Action Document in prep / submitted (EU) · concept note, proposal, tender participation (third-party)",
    },
    anzahl: 5,
    volumenMio: 6.1,
    eu: { anzahl: 3, volumenMio: 4.9 },
  },
  {
    id: 3,
    name: { de: "Beauftragt", en: "Contracted" },
    definition: {
      de: "Contribution Agreement gezeichnet (EU) · Vertrag / Zusage gezeichnet (Drittgeber)",
      en: "Contribution agreement signed (EU) · contract / commitment signed (third-party)",
    },
    anzahl: 2,
    volumenMio: 4.0,
    eu: { anzahl: 1, volumenMio: 4.0 },
  },
];

export function conversion(from: PipelineStage, to: PipelineStage) {
  return {
    anzahl: from.anzahl > 0 ? (to.anzahl / from.anzahl) * 100 : 0,
    volumen: from.volumenMio > 0 ? (to.volumenMio / from.volumenMio) * 100 : 0,
  };
}
