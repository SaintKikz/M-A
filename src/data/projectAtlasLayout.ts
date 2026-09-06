// ─── Plan du classeur Project Atlas — métadonnées pures ─────────────────────
// Aucune dépendance : importable par le navigateur ET par les scripts Node.
// C'est le seul endroit où vivent les coordonnées de cellules.

export const SHEETS = {
  cover: "Cover", instructions: "Instructions", atlasRaw: "Atlas_Raw",
  compsRaw: "Comps_Raw", comps: "Trading_Comps", dcf: "DCF",
  summary: "Valuation_Summary", checks: "Checks", meta: "_LAB_META",
} as const;

/** Onglets sans lesquels le livrable n'a plus de sens analytique. */
export const REQUIRED_ANALYTICAL_SHEETS = [SHEETS.comps, SHEETS.dcf, SHEETS.summary, SHEETS.checks] as const;

// ─── Atlas_Raw : hypothèses de structure de capital ─────────────────────────
export const ATLAS_RAW_CELLS = {
  cash: "C17", grossDebt: "C18", leases: "C19", minorities: "C20",
  dilutedShares: "C21", taxRate: "C22",
} as const;

// ─── Trading_Comps ──────────────────────────────────────────────────────────
export const COMPS_FIRST_ROW = 7;
export const COMPS_RAW_FIRST_ROW = 6;

/** Les 8 colonnes calculées par comparable, dans l'ordre du tableau. */
export const PEER_FIELDS = [
  { key: "marketCap",   col: "C", label: "Market cap",        kind: "currency" },
  { key: "ev",          col: "D", label: "Enterprise value",  kind: "currency" },
  { key: "evRevenue26", col: "E", label: "EV/CA FY26E",       kind: "multiple" },
  { key: "evRevenue27", col: "F", label: "EV/CA FY27E",       kind: "multiple" },
  { key: "evEbitda26",  col: "G", label: "EV/EBITDA FY26E",   kind: "multiple" },
  { key: "evEbitda27",  col: "H", label: "EV/EBITDA FY27E",   kind: "multiple" },
  { key: "evEbit26",    col: "I", label: "EV/EBIT FY26E",     kind: "multiple" },
  { key: "evEbit27",    col: "J", label: "EV/EBIT FY27E",     kind: "multiple" },
] as const;

export type PeerFieldKey = (typeof PEER_FIELDS)[number]["key"];

/** Les 5 statistiques, une ligne chacune, sur les 6 colonnes de multiples. */
export const STAT_ROWS = [
  { key: "min",    row: 16, label: "Minimum" },
  { key: "q1",     row: 17, label: "1er quartile" },
  { key: "median", row: 18, label: "Médiane" },
  { key: "q3",     row: 19, label: "3e quartile" },
  { key: "max",    row: 20, label: "Maximum" },
] as const;

export type StatKey = (typeof STAT_ROWS)[number]["key"];

/** Les colonnes de multiples sur lesquelles les statistiques sont calculées. */
export const STAT_COLUMNS = PEER_FIELDS.filter((f) => f.kind === "multiple");

/** Prix implicites Q1 / médiane / Q3 — support du Valuation_Summary. */
export const COMPS_IMPLIED_ROWS = { ev: 24, equity: 29, price: 31, priceQ1: 32, priceQ3: 33 } as const;

// ─── DCF ────────────────────────────────────────────────────────────────────
export const DCF_COLS = ["D", "E", "F", "G", "H"] as const;
export const DCF_ROWS = {
  revenue: 22, growth: 23, ebitda: 24, margin: 25, da: 26, ebit: 27,
  tax: 28, nopat: 29, ufcf: 30, addDa: 31, capex: 32, nwc: 33,
  discountPeriod: 34, discountFactor: 35, pvUfcf: 36,
  pvFcf: 40, pvTv: 41, ev: 42, equity: 47, price: 49,
  wacc: 16, growthRate: 17, costOfEquity: 15,
} as const;

/** Lignes du DCF que l'utilisateur doit construire (formule attendue). */
export const DCF_USER_ROWS = [
  { row: DCF_ROWS.growth, label: "Croissance", kind: "percent" },
  { row: DCF_ROWS.margin, label: "Marge d'EBITDA", kind: "percent" },
  { row: DCF_ROWS.ebit, label: "EBIT", kind: "currency" },
  { row: DCF_ROWS.tax, label: "Impôt sur l'EBIT", kind: "currency" },
  { row: DCF_ROWS.nopat, label: "NOPAT", kind: "currency" },
  { row: DCF_ROWS.ufcf, label: "UFCF", kind: "currency" },
  { row: DCF_ROWS.discountFactor, label: "Facteur d'actualisation", kind: "factor" },
  { row: DCF_ROWS.pvUfcf, label: "PV de l'UFCF", kind: "currency" },
] as const;

/** Grille de sensibilité : origine, 5 lignes (WACC) × 5 colonnes (g). */
export const SENS = { originRow: 54, firstDataRow: 55, cols: ["D", "E", "F", "G", "H"], rowCount: 5 } as const;

// ─── Valuation_Summary ──────────────────────────────────────────────────────
export const SUMMARY_CELLS = [
  { key: "compsLow",  cell: "C7",  label: "Comps — bas (Q1)" },
  { key: "compsMid",  cell: "D7",  label: "Comps — central (médiane)" },
  { key: "compsHigh", cell: "E7",  label: "Comps — haut (Q3)" },
  { key: "dcfLow",    cell: "C8",  label: "DCF — bas" },
  { key: "dcfMid",    cell: "D8",  label: "DCF — central" },
  { key: "dcfHigh",   cell: "E8",  label: "DCF — haut" },
  { key: "rangeLow",  cell: "C10", label: "Fourchette — bas" },
  { key: "rangeHigh", cell: "E10", label: "Fourchette — haut" },
] as const;

export type SummaryKey = (typeof SUMMARY_CELLS)[number]["key"];

// ─── Checks ─────────────────────────────────────────────────────────────────
export const CHECK_ROWS = { first: 6, last: 15, modelCheck: 18 } as const;

// ─── Noms définis ───────────────────────────────────────────────────────────
export const NAMED: Record<string, { sheet: string; cell: string }> = {
  ATLAS_MARKET_CAP_NOVA:           { sheet: SHEETS.comps, cell: "C7" },
  ATLAS_EV_NOVA:                   { sheet: SHEETS.comps, cell: "D7" },
  ATLAS_COMPS_MEDIAN_EV_EBITDA_27: { sheet: SHEETS.comps, cell: "H18" },
  ATLAS_IMPLIED_EV_COMPS:          { sheet: SHEETS.comps, cell: "D24" },
  ATLAS_IMPLIED_EQUITY_COMPS:      { sheet: SHEETS.comps, cell: "D29" },
  ATLAS_IMPLIED_PRICE_COMPS:       { sheet: SHEETS.comps, cell: "D31" },
  ATLAS_WACC:                      { sheet: SHEETS.dcf,   cell: "D16" },
  ATLAS_UFCF_26:                   { sheet: SHEETS.dcf,   cell: "D30" },
  ATLAS_UFCF_27:                   { sheet: SHEETS.dcf,   cell: "E30" },
  ATLAS_UFCF_28:                   { sheet: SHEETS.dcf,   cell: "F30" },
  ATLAS_UFCF_29:                   { sheet: SHEETS.dcf,   cell: "G30" },
  ATLAS_UFCF_30:                   { sheet: SHEETS.dcf,   cell: "H30" },
  ATLAS_DCF_PV_FCF:                { sheet: SHEETS.dcf,   cell: "D40" },
  ATLAS_DCF_PV_TV:                 { sheet: SHEETS.dcf,   cell: "D41" },
  ATLAS_DCF_EV:                    { sheet: SHEETS.dcf,   cell: "D42" },
  ATLAS_DCF_EQUITY:                { sheet: SHEETS.dcf,   cell: "D47" },
  ATLAS_DCF_PRICE:                 { sheet: SHEETS.dcf,   cell: "D49" },
  ATLAS_MODEL_CHECK:               { sheet: SHEETS.checks, cell: `D${CHECK_ROWS.modelCheck}` },
};

/** Adresse d'une cellule de peer. */
export const peerCell = (peerIndex: number, field: PeerFieldKey): string => {
  const f = PEER_FIELDS.find((x) => x.key === field)!;
  return `${f.col}${COMPS_FIRST_ROW + peerIndex}`;
};

/** Adresse d'une cellule de statistique. */
export const statCell = (stat: StatKey, fieldKey: PeerFieldKey): string => {
  const row = STAT_ROWS.find((s) => s.key === stat)!.row;
  const col = PEER_FIELDS.find((f) => f.key === fieldKey)!.col;
  return `${col}${row}`;
};

/** Adresse d'une cellule de sensibilité (i = ligne WACC, j = colonne g). */
export const sensCell = (i: number, j: number): string => `${SENS.cols[j]}${SENS.firstDataRow + i}`;
