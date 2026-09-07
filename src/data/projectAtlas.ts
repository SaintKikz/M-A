// ─── PROJECT ATLAS — données canoniques ─────────────────────────────────────
// SOURCE UNIQUE DE VÉRITÉ. Ce fichier est consommé par :
//   • scripts/generate-project-atlas.mjs  (construit les classeurs)
//   • scripts/validate-project-atlas.mjs  (vérifie les classeurs)
//   • src/lib/atlasGrader.ts              (corrige la soumission)
//   • src/data/projectAtlas.test.ts       (vérifie les valeurs attendues)
//
// Toutes les valeurs attendues sont CALCULÉES depuis ces entrées via
// src/lib/finance.ts — jamais recopiées à la main. Modifier une hypothèse ici
// et relancer `npm run generate:atlas` suffit à resynchroniser l'ensemble.
//
// Société, comparables et chiffres entièrement FICTIFS.

// L'extension .ts est explicite (allowImportingTsExtensions) pour que Node
// puisse importer ce module tel quel dans les scripts de génération, sans
// étape de build. Vite la résout sans problème.
import { dcf, equityFromEv, costOfEquityCapm, wacc as waccFn, sampleStats, type SampleStats } from "../lib/finance.ts";

export const ATLAS_CASE_ID = "project_atlas_v1";
export const ATLAS_CASE_VERSION = "1.1.0";
export const ATLAS_GRADER_VERSION = "1.2";

// ─── Calendrier ─────────────────────────────────────────────────────────────
export const YEARS = ["FY23A", "FY24A", "FY25A", "FY26E", "FY27E", "FY28E", "FY29E", "FY30E"] as const;
export const FORECAST_YEARS = ["FY26E", "FY27E", "FY28E", "FY29E", "FY30E"] as const;
export const HISTORICAL_COUNT = 3;

// ─── La cible ───────────────────────────────────────────────────────────────
// Croissance qui décélère (post-Covid puis normalisation) et marge qui se
// redresse progressivement : volontairement non linéaire, comme un vrai plan.
export interface AtlasFinancials {
  revenue: number[];      // M€, un par année de YEARS
  ebitda: number[];
  da: number[];
  capex: number[];
  deltaNwc: number[];     // variation du BFR (positif = consomme du cash)
}

export const atlasCompany = {
  name: "Atlas Consumer Group",
  codename: "Project Atlas",
  sector: "Consommation / Produits de marque",
  geography: "Europe",
  currency: "EUR",
  unit: "M€",
  description:
    "Groupe européen de produits de grande consommation de marque : soin de la personne, entretien de la maison et petits appareils. Trois marques principales, distribution en grande surface et en pharmacie, présence en France, Benelux, Allemagne et Italie. Croissance tirée par le premium et l'export.",
  financials: {
    //          FY23A   FY24A   FY25A   FY26E   FY27E   FY28E   FY29E   FY30E
    revenue:  [ 742.0,  798.5,  841.2,  892.0,  945.5,  996.0, 1041.0, 1082.6 ],
    ebitda:   [ 118.7,  133.6,  145.5,  158.8,  172.1,  184.3,  194.7,  204.6 ],
    da:       [  29.7,   31.1,   32.8,   34.8,   36.9,   38.8,   40.6,   42.2 ],
    capex:    [  31.2,   33.5,   35.3,   37.5,   39.7,   41.8,   43.7,   45.5 ],
    deltaNwc: [   7.4,    5.7,    4.3,    5.1,    5.4,    5.1,    4.5,    4.2 ],
  } as AtlasFinancials,
  // Structure de capital au dernier arrêté (FY25A)
  cash: 68.4,
  grossDebt: 315.0,
  leaseLiabilities: 84.5,
  minorityInterests: 22.0,
  dilutedShares: 48.6,      // millions
  taxRate: 0.26,
} as const;

// ─── Les comparables ────────────────────────────────────────────────────────
export interface Peer {
  name: string;
  sharePrice: number;
  dilutedShares: number;
  cash: number;
  debt: number;
  leaseLiabilities: number;
  minorities: number;
  revenue: { fy25: number; fy26: number; fy27: number };
  ebitda: { fy25: number; fy26: number; fy27: number };
  ebit: { fy25: number; fy26: number; fy27: number };
  /** Note interne : pourquoi ce comparable mérite un regard critique. */
  caveat?: string;
}

export const atlasPeers: Peer[] = [
  {
    name: "Nova Brands", sharePrice: 42.80, dilutedShares: 96.2, cash: 121.0, debt: 640.0,
    leaseLiabilities: 152.0, minorities: 18.0,
    revenue: { fy25: 1980.0, fy26: 2079.0, fy27: 2172.6 },
    ebitda: { fy25: 356.4, fy26: 385.0, fy27: 410.6 },
    ebit: { fy25: 267.3, fy26: 291.1, fy27: 312.1 },
  },
  {
    name: "Everest Consumer", sharePrice: 28.15, dilutedShares: 145.0, cash: 88.0, debt: 720.0,
    leaseLiabilities: 118.0, minorities: 0,
    revenue: { fy25: 2310.0, fy26: 2402.4, fy27: 2486.5 },
    ebitda: { fy25: 392.7, fy26: 414.4, fy27: 435.1 },
    ebit: { fy25: 289.6, fy26: 308.9, fy27: 326.3 },
  },
  {
    name: "Northstar Products", sharePrice: 61.40, dilutedShares: 52.8, cash: 54.0, debt: 385.0,
    leaseLiabilities: 66.0, minorities: 12.0,
    revenue: { fy25: 1104.0, fy26: 1181.3, fy27: 1252.2 },
    ebitda: { fy25: 210.0, fy26: 229.2, fy27: 247.9 },
    ebit: { fy25: 163.8, fy26: 180.0, fy27: 195.8 },
  },
  {
    // Le piège : décote apparente, mais croissance quasi nulle et marge en repli.
    name: "Velora Group", sharePrice: 9.60, dilutedShares: 210.0, cash: 42.0, debt: 980.0,
    leaseLiabilities: 205.0, minorities: 34.0,
    revenue: { fy25: 2650.0, fy26: 2676.5, fy27: 2690.0 },
    ebitda: { fy25: 397.5, fy26: 388.1, fy27: 376.6 },
    ebit: { fy25: 278.3, fy26: 267.7, fy27: 255.6 },
    caveat:
      "Multiples les plus bas de l'échantillon, mais croissance de 1% et marge d'EBITDA qui recule de 15,0% à 14,0%. La décote est méritée : la retenir sans commentaire tire la médiane vers le bas artificiellement.",
  },
  {
    name: "Prime Household", sharePrice: 35.60, dilutedShares: 78.4, cash: 96.0, debt: 410.0,
    leaseLiabilities: 74.0, minorities: 8.0,
    revenue: { fy25: 1385.0, fy26: 1468.1, fy27: 1548.8 },
    ebitda: { fy25: 249.3, fy26: 268.6, fy27: 287.1 },
    ebit: { fy25: 194.0, fy26: 211.0, fy27: 227.3 },
  },
  {
    name: "Meridian Brands", sharePrice: 54.25, dilutedShares: 63.5, cash: 73.0, debt: 495.0,
    leaseLiabilities: 92.0, minorities: 15.0,
    revenue: { fy25: 1512.0, fy26: 1602.7, fy27: 1690.9 },
    ebitda: { fy25: 279.7, fy26: 302.9, fy27: 324.6 },
    ebit: { fy25: 215.2, fy26: 235.6, fy27: 254.9 },
  },
  {
    name: "Orion Consumer", sharePrice: 23.70, dilutedShares: 118.0, cash: 61.0, debt: 528.0,
    leaseLiabilities: 103.0, minorities: 0,
    revenue: { fy25: 1740.0, fy26: 1809.6, fy27: 1881.9 },
    ebitda: { fy25: 295.8, fy26: 312.1, fy27: 329.3 },
    ebit: { fy25: 217.5, fy26: 231.6, fy27: 246.5 },
  },
  {
    name: "Summit Products", sharePrice: 78.90, dilutedShares: 34.2, cash: 38.0, debt: 268.0,
    leaseLiabilities: 47.0, minorities: 6.0,
    revenue: { fy25: 826.0, fy26: 891.1, fy27: 954.2 },
    ebitda: { fy25: 165.2, fy26: 181.8, fy27: 197.5 },
    ebit: { fy25: 132.2, fy26: 146.5, fy27: 160.1 },
  },
];

// ─── Hypothèses du DCF ──────────────────────────────────────────────────────
export const atlasAssumptions = {
  riskFreeRate: 0.032,
  equityRiskPremium: 0.065,
  beta: 1.12,
  pretaxCostOfDebt: 0.050,
  taxRate: 0.26,
  debtWeight: 0.30,
  equityWeight: 0.70,
  terminalGrowth: 0.025,
  midYearConvention: true,
  /** Grilles de la table de sensibilité (WACC en lignes, g en colonnes). */
  sensitivityWacc: [0.075, 0.080, 0.085, 0.090, 0.095],
  sensitivityGrowth: [0.015, 0.020, 0.025, 0.030, 0.035],
} as const;

// ─── Calculs — tout passe par src/lib/finance.ts ────────────────────────────
const idxOf = (y: string) => YEARS.indexOf(y as (typeof YEARS)[number]);

/** EV d'un comparable : market cap + dette + leases + minoritaires − cash. */
export function peerEnterpriseValue(p: Peer): number {
  return p.sharePrice * p.dilutedShares + p.debt + p.leaseLiabilities + p.minorities - p.cash;
}

export function peerMarketCap(p: Peer): number {
  return p.sharePrice * p.dilutedShares;
}

export interface PeerMultiples {
  name: string; marketCap: number; enterpriseValue: number;
  evRevenue26: number; evRevenue27: number;
  evEbitda26: number; evEbitda27: number;
  evEbit26: number; evEbit27: number;
}

export function peerMultiples(p: Peer): PeerMultiples {
  const ev = peerEnterpriseValue(p);
  return {
    name: p.name, marketCap: peerMarketCap(p), enterpriseValue: ev,
    evRevenue26: ev / p.revenue.fy26, evRevenue27: ev / p.revenue.fy27,
    evEbitda26: ev / p.ebitda.fy26, evEbitda27: ev / p.ebitda.fy27,
    evEbit26: ev / p.ebit.fy26, evEbit27: ev / p.ebit.fy27,
  };
}

/** UFCF = EBIT × (1 − t) + D&A − capex − ΔBFR, pour une année donnée. */
export function atlasUfcf(year: string): number {
  const i = idxOf(year);
  const f = atlasCompany.financials;
  const ebit = f.ebitda[i] - f.da[i];
  return ebit * (1 - atlasCompany.taxRate) + f.da[i] - f.capex[i] - f.deltaNwc[i];
}

export function atlasWacc(): number {
  const ke = costOfEquityCapm(
    atlasAssumptions.riskFreeRate, atlasAssumptions.beta, atlasAssumptions.equityRiskPremium);
  return waccFn(
    atlasAssumptions.equityWeight, atlasAssumptions.debtWeight,
    ke, atlasAssumptions.pretaxCostOfDebt, atlasAssumptions.taxRate);
}

/** Bridge EV → Equity d'Atlas : − dette − leases − minoritaires + cash. */
export function atlasEquityFromEv(ev: number): number {
  return equityFromEv(ev, {
    debt: atlasCompany.grossDebt, cash: atlasCompany.cash,
    leases: atlasCompany.leaseLiabilities, minorities: atlasCompany.minorityInterests,
  });
}

export interface AtlasExpected {
  peers: PeerMultiples[];
  stats: {
    evRevenue26: SampleStats; evRevenue27: SampleStats;
    evEbitda26: SampleStats; evEbitda27: SampleStats;
    evEbit26: SampleStats; evEbit27: SampleStats;
  };
  comps: { medianEvEbitda27: number; impliedEv: number; impliedEquity: number; impliedPrice: number };
  dcf: {
    wacc: number; costOfEquity: number;
    ufcf: Record<string, number>;
    pvFcf: number; pvTv: number; terminalValue: number;
    enterpriseValue: number; equityValue: number; pricePerShare: number;
    sensitivity: number[][]; // [wacc][growth] → prix par action
  };
  summary: { compsLow: number; compsMid: number; compsHigh: number; dcfLow: number; dcfMid: number; dcfHigh: number; rangeLow: number; rangeHigh: number };
}

/** Calcule TOUTES les valeurs attendues du cas. Déterministe. */
export function computeAtlasExpected(): AtlasExpected {
  const peers = atlasPeers.map(peerMultiples);
  const col = (k: keyof PeerMultiples) => peers.map((p) => p[k] as number);
  const stats = {
    evRevenue26: sampleStats(col("evRevenue26")), evRevenue27: sampleStats(col("evRevenue27")),
    evEbitda26: sampleStats(col("evEbitda26")), evEbitda27: sampleStats(col("evEbitda27")),
    evEbit26: sampleStats(col("evEbit26")), evEbit27: sampleStats(col("evEbit27")),
  };

  // Comps : médiane EV/EBITDA FY27E × EBITDA FY27E d'Atlas
  const medianEvEbitda27 = stats.evEbitda27.median;
  const atlasEbitda27 = atlasCompany.financials.ebitda[idxOf("FY27E")];
  const impliedEv = medianEvEbitda27 * atlasEbitda27;
  const impliedEquity = atlasEquityFromEv(impliedEv);
  const impliedPrice = impliedEquity / atlasCompany.dilutedShares;

  // DCF
  const w = atlasWacc();
  const ke = costOfEquityCapm(atlasAssumptions.riskFreeRate, atlasAssumptions.beta, atlasAssumptions.equityRiskPremium);
  const fcfs = FORECAST_YEARS.map(atlasUfcf);
  const r = dcf({
    fcfs, discountRate: w, midYear: atlasAssumptions.midYearConvention,
    terminal: { kind: "gordon", g: atlasAssumptions.terminalGrowth },
  });
  const equityValue = atlasEquityFromEv(r.enterpriseValue);
  const pricePerShare = equityValue / atlasCompany.dilutedShares;

  const sensitivity = atlasAssumptions.sensitivityWacc.map((sw) =>
    atlasAssumptions.sensitivityGrowth.map((sg) => {
      const s = dcf({ fcfs, discountRate: sw, midYear: atlasAssumptions.midYearConvention, terminal: { kind: "gordon", g: sg } });
      return atlasEquityFromEv(s.enterpriseValue) / atlasCompany.dilutedShares;
    }));

  // Fourchettes : comps sur Q1/médiane/Q3 du multiple, DCF sur les bornes de sensibilité
  const priceFromMultiple = (m: number) => atlasEquityFromEv(m * atlasEbitda27) / atlasCompany.dilutedShares;
  const flat = sensitivity.flat();
  const summary = {
    compsLow: priceFromMultiple(stats.evEbitda27.q1),
    compsMid: impliedPrice,
    compsHigh: priceFromMultiple(stats.evEbitda27.q3),
    dcfLow: Math.min(...flat), dcfMid: pricePerShare, dcfHigh: Math.max(...flat),
    rangeLow: 0, rangeHigh: 0,
  };
  summary.rangeLow = Math.min(summary.compsLow, summary.dcfLow);
  summary.rangeHigh = Math.max(summary.compsHigh, summary.dcfHigh);

  return {
    peers, stats,
    comps: { medianEvEbitda27, impliedEv, impliedEquity, impliedPrice },
    dcf: {
      wacc: w, costOfEquity: ke,
      ufcf: Object.fromEntries(FORECAST_YEARS.map((y) => [y, atlasUfcf(y)])),
      pvFcf: r.pvExplicit, pvTv: r.pvTerminal, terminalValue: r.terminalValue,
      enterpriseValue: r.enterpriseValue, equityValue, pricePerShare, sensitivity,
    },
    summary,
  };
}

// ─── Tolérances de correction ───────────────────────────────────────────────
export type ToleranceKind = "currency" | "multiple" | "percent" | "perShare" | "sensitivity";

export const atlasTolerances: Record<ToleranceKind, { rel?: number; abs?: number; label: string }> = {
  currency:    { rel: 0.005, label: "±0,5%" },
  multiple:    { abs: 0.02,  label: "±0,02x" },
  percent:     { abs: 0.0005, label: "±0,05 pt" },
  perShare:    { rel: 0.005, label: "±0,5%" },
  sensitivity: { rel: 0.01,  label: "±1%" },
};

/** Compare une valeur soumise à l'attendu selon le type de tolérance. */
export function withinTolerance(actual: number, expected: number, kind: ToleranceKind): boolean {
  if (!Number.isFinite(actual)) return false;
  const t = atlasTolerances[kind];
  if (t.abs !== undefined && Math.abs(actual - expected) <= t.abs) return true;
  if (t.rel !== undefined) {
    const allowed = Math.abs(expected) * t.rel;
    return Math.abs(actual - expected) <= Math.max(allowed, 1e-9);
  }
  return false;
}

// ─── Noms définis attendus dans le classeur ─────────────────────────────────
export const ATLAS_NAMED_RANGES = [
  // Trading comps — un exemple de peer contrôlé cellule à cellule
  "ATLAS_MARKET_CAP_NOVA", "ATLAS_EV_NOVA",
  "ATLAS_COMPS_MEDIAN_EV_EBITDA_27",
  "ATLAS_IMPLIED_EV_COMPS", "ATLAS_IMPLIED_EQUITY_COMPS", "ATLAS_IMPLIED_PRICE_COMPS",
  // DCF
  "ATLAS_WACC",
  "ATLAS_UFCF_26", "ATLAS_UFCF_27", "ATLAS_UFCF_28", "ATLAS_UFCF_29", "ATLAS_UFCF_30",
  "ATLAS_DCF_PV_FCF", "ATLAS_DCF_PV_TV",
  "ATLAS_DCF_EV", "ATLAS_DCF_EQUITY", "ATLAS_DCF_PRICE",
  // Checks
  "ATLAS_MODEL_CHECK",
] as const;

export type AtlasNamedRange = (typeof ATLAS_NAMED_RANGES)[number];

export const ATLAS_SHEETS = [
  "Cover", "Instructions", "Atlas_Raw", "Comps_Raw",
  "Trading_Comps", "DCF", "Valuation_Summary", "Checks",
] as const;

/** Cellules dont on exige une FORMULE (un chiffre juste mais tapé en dur est partiellement crédité). */
export const ATLAS_FORMULA_REQUIRED: AtlasNamedRange[] = [
  "ATLAS_MARKET_CAP_NOVA", "ATLAS_EV_NOVA", "ATLAS_COMPS_MEDIAN_EV_EBITDA_27",
  "ATLAS_IMPLIED_EV_COMPS", "ATLAS_IMPLIED_EQUITY_COMPS", "ATLAS_IMPLIED_PRICE_COMPS",
  "ATLAS_WACC", "ATLAS_UFCF_26", "ATLAS_UFCF_27", "ATLAS_UFCF_28", "ATLAS_UFCF_29", "ATLAS_UFCF_30",
  "ATLAS_DCF_PV_FCF", "ATLAS_DCF_PV_TV", "ATLAS_DCF_EV", "ATLAS_DCF_EQUITY", "ATLAS_DCF_PRICE",
];

// ─── Cibles de correction ───────────────────────────────────────────────────
// Toutes dérivées de computeAtlasExpected() : il n'existe aucune seconde table
// de réponses à maintenir. Chaque cible porte son adresse, sa valeur attendue,
// sa tolérance et si une formule est exigée.

import {
  PEER_FIELDS, STAT_ROWS, STAT_COLUMNS, SUMMARY_CELLS, SENS, DCF_USER_ROWS, DCF_COLS,
  peerCell, statCell, sensCell, SHEETS, NAMED,
  type PeerFieldKey, type StatKey, type SummaryKey,
} from "./projectAtlasLayout.ts";

export interface GradeTarget {
  id: string;
  sheet: string;
  cell: string;
  label: string;
  expected: number;
  kind: ToleranceKind;
  /** Une formule est-elle attendue ici ? (faux pour les hypothèses saisies) */
  formulaExpected: boolean;
  /** Groupe de pondération dans la note de précision. */
  group: "peers" | "stats" | "compsImplied" | "dcfCore" | "sensitivity" | "summary";
  /** Étiquette pour le Mistake Book. */
  tag: string;
  /** Nom du comparable concerné, quand il y en a un. */
  peer?: string;
}

const KIND_OF_FIELD: Record<string, ToleranceKind> = { currency: "currency", multiple: "multiple" };

/** Le layout nomme la colonne « ev » ; PeerMultiples la nomme « enterpriseValue ». */
const PEER_FIELD_SOURCE: Record<string, keyof PeerMultiples> = {
  marketCap: "marketCap", ev: "enterpriseValue",
  evRevenue26: "evRevenue26", evRevenue27: "evRevenue27",
  evEbitda26: "evEbitda26", evEbitda27: "evEbitda27",
  evEbit26: "evEbit26", evEbit27: "evEbit27",
};

/** Les 64 cellules calculées du tableau de comparables. */
export function peerTargets(E = computeAtlasExpected()): GradeTarget[] {
  const out: GradeTarget[] = [];
  E.peers.forEach((p, i) => {
    for (const f of PEER_FIELDS) {
      out.push({
        id: `peer.${i}.${f.key}`,
        sheet: SHEETS.comps, cell: peerCell(i, f.key),
        label: `${p.name} — ${f.label}`,
        expected: p[PEER_FIELD_SOURCE[f.key]] as number,
        kind: KIND_OF_FIELD[f.kind],
        formulaExpected: true, group: "peers",
        tag: f.key === "ev" || f.key === "marketCap" ? "Enterprise Value" : "Trading Comps",
        peer: p.name,
      });
    }
  });
  return out;
}

/** Les 30 statistiques du tableau de comparables. */
export function statTargets(E = computeAtlasExpected()): GradeTarget[] {
  const out: GradeTarget[] = [];
  for (const col of STAT_COLUMNS) {
    const stats = E.stats[col.key as keyof typeof E.stats];
    for (const s of STAT_ROWS) {
      out.push({
        id: `stat.${col.key}.${s.key}`,
        sheet: SHEETS.comps, cell: statCell(s.key as StatKey, col.key as PeerFieldKey),
        label: `${s.label} ${col.label}`,
        expected: stats[s.key as StatKey],
        kind: "multiple", formulaExpected: true, group: "stats", tag: "Trading Comps",
      });
    }
  }
  return out;
}

/** Les 25 sorties de la table de sensibilité. */
export function sensitivityTargets(E = computeAtlasExpected()): GradeTarget[] {
  const out: GradeTarget[] = [];
  atlasAssumptions.sensitivityWacc.forEach((w, i) => {
    atlasAssumptions.sensitivityGrowth.forEach((g, j) => {
      out.push({
        id: `sens.${i}.${j}`,
        sheet: SHEETS.dcf, cell: sensCell(i, j),
        label: `Sensibilité WACC ${(w * 100).toFixed(1)}% × g ${(g * 100).toFixed(1)}%`,
        expected: E.dcf.sensitivity[i][j],
        kind: "sensitivity",
        // Une table de données Excel ne laisse pas de formule lisible par cellule :
        // on note la valeur, pas la présence de formule (cf. README, limite assumée).
        formulaExpected: false, group: "sensitivity", tag: "DCF",
      });
    });
  });
  return out;
}

/** Les 8 sorties du Valuation_Summary. */
export function summaryTargets(E = computeAtlasExpected()): GradeTarget[] {
  return SUMMARY_CELLS.map((c) => ({
    id: `summary.${c.key}`,
    sheet: SHEETS.summary, cell: c.cell, label: c.label,
    expected: E.summary[c.key as SummaryKey],
    kind: "perShare" as ToleranceKind,
    formulaExpected: true, group: "summary" as const, tag: "Valuation Summary",
  }));
}

/** Les sorties clés du DCF et de la valorisation par comparables (noms définis). */
export function coreTargets(E = computeAtlasExpected()): GradeTarget[] {
  const N = (id: string) => NAMED_ADDR[id];
  return [
    // La médiane EV/EBITDA FY27E (H18) est déjà notée par statTargets : on ne
    // la compte pas deux fois. Le nom défini ATLAS_COMPS_MEDIAN_EV_EBITDA_27
    // pointe sur cette même cellule et reste donc couvert.
    { id: "core.impliedEv", label: "EV implicite (comps)", expected: E.comps.impliedEv, kind: "currency", group: "compsImplied", tag: "Trading Comps", ...N("ATLAS_IMPLIED_EV_COMPS") },
    { id: "core.impliedEquity", label: "Equity value implicite (comps)", expected: E.comps.impliedEquity, kind: "currency", group: "compsImplied", tag: "Net Debt", ...N("ATLAS_IMPLIED_EQUITY_COMPS") },
    { id: "core.impliedPrice", label: "Prix par action implicite (comps)", expected: E.comps.impliedPrice, kind: "perShare", group: "compsImplied", tag: "Trading Comps", ...N("ATLAS_IMPLIED_PRICE_COMPS") },
    { id: "core.wacc", label: "WACC", expected: E.dcf.wacc, kind: "percent", group: "dcfCore", tag: "WACC", ...N("ATLAS_WACC") },
    ...FORECAST_YEARS.map((y, i) => ({
      id: `core.ufcf${i}`, label: `UFCF ${y}`, expected: E.dcf.ufcf[y],
      kind: "currency" as ToleranceKind, group: "dcfCore" as const, tag: "DCF",
      ...N(`ATLAS_UFCF_${26 + i}`),
    })),
    { id: "core.pvFcf", label: "Somme des PV des UFCF", expected: E.dcf.pvFcf, kind: "currency", group: "dcfCore", tag: "DCF", ...N("ATLAS_DCF_PV_FCF") },
    { id: "core.pvTv", label: "PV de la valeur terminale", expected: E.dcf.pvTv, kind: "currency", group: "dcfCore", tag: "Terminal Value", ...N("ATLAS_DCF_PV_TV") },
    { id: "core.dcfEv", label: "Enterprise value (DCF)", expected: E.dcf.enterpriseValue, kind: "currency", group: "dcfCore", tag: "DCF", ...N("ATLAS_DCF_EV") },
    { id: "core.dcfEquity", label: "Equity value (DCF)", expected: E.dcf.equityValue, kind: "currency", group: "dcfCore", tag: "Lease Liabilities", ...N("ATLAS_DCF_EQUITY") },
    { id: "core.dcfPrice", label: "Prix par action (DCF)", expected: E.dcf.pricePerShare, kind: "perShare", group: "dcfCore", tag: "DCF", ...N("ATLAS_DCF_PRICE") },
  ].map((t) => ({ ...t, formulaExpected: true } as GradeTarget));
}

/** Toutes les cibles, calculées une fois. */
export function allGradeTargets(E = computeAtlasExpected()): GradeTarget[] {
  return [...peerTargets(E), ...statTargets(E), ...coreTargets(E), ...sensitivityTargets(E), ...summaryTargets(E)];
}

/** Cellules du DCF construites par l'utilisateur, pour l'intégrité des formules. */
export function dcfFormulaCells(): { sheet: string; cell: string; label: string }[] {
  const out: { sheet: string; cell: string; label: string }[] = [];
  for (const r of DCF_USER_ROWS) {
    for (const c of DCF_COLS) out.push({ sheet: SHEETS.dcf, cell: `${c}${r.row}`, label: `${r.label} (${c})` });
  }
  return out;
}

/** Répartition des 45 points de précision entre les groupes. */
export const ACCURACY_WEIGHTS: Record<GradeTarget["group"], number> = {
  peers: 12,        // 64 cellules
  stats: 5,         // 30 cellules
  compsImplied: 5,  // 4 sorties
  dcfCore: 12,      // 12 sorties
  sensitivity: 6,   // 25 cellules
  summary: 5,       // 8 sorties
};

/** Répartition des 20 points d'intégrité des formules. */
export const INTEGRITY_WEIGHTS = {
  peers: 6, stats: 3, compsImplied: 3, dcfCore: 4, dcfRows: 2, summary: 2,
};

// Les adresses des noms définis viennent du layout partagé.
const NAMED_ADDR = NAMED;
