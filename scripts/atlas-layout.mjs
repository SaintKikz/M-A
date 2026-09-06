// ─── Plan du classeur Project Atlas ─────────────────────────────────────────
// Partagé par le générateur et le validateur : une seule définition des
// coordonnées, des noms définis et des styles.

export const SHEETS = {
  cover: "Cover", instructions: "Instructions", atlasRaw: "Atlas_Raw",
  compsRaw: "Comps_Raw", comps: "Trading_Comps", dcf: "DCF",
  summary: "Valuation_Summary", checks: "Checks", meta: "_LAB_META",
};

// ─── Palette et styles « banker » ───────────────────────────────────────────
export const INPUT_FONT = { name: "Calibri", size: 10, color: { argb: "FF0000CC" } };       // bleu = saisie
export const FORMULA_FONT = { name: "Calibri", size: 10, color: { argb: "FF000000" } };     // noir = formule
export const LINK_FONT = { name: "Calibri", size: 10, color: { argb: "FF007A3D" } };        // vert = lien inter-onglets
export const LABEL_FONT = { name: "Calibri", size: 10, color: { argb: "FF333333" } };
export const HEADER_FONT = { name: "Calibri", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
export const TITLE_FONT = { name: "Calibri", size: 14, bold: true, color: { argb: "FF1F3864" } };
export const SECTION_FONT = { name: "Calibri", size: 10, bold: true, color: { argb: "FF1F3864" } };

export const HEADER_FILL = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F3864" } };
export const SUBHEAD_FILL = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD9E1F2" } };
export const INPUT_FILL = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF9E6" } };

// Formats : négatifs entre parenthèses, zéros en tiret — conventions de desk
export const FMT = {
  money0: '#,##0;(#,##0);"–"',
  money1: '#,##0.0;(#,##0.0);"–"',
  money2: '#,##0.00;(#,##0.00);"–"',
  mult: '0.0"x";(0.0"x");"–"',
  mult2: '0.00"x";(0.00"x");"–"',
  pct1: '0.0%;(0.0%);"–"',
  pct2: '0.00%;(0.00%);"–"',
  shares: '#,##0.0;(#,##0.0);"–"',
  text: "@",
};

export const thinBorder = { style: "thin", color: { argb: "FFBFBFBF" } };
export const topBorder = { top: { style: "thin", color: { argb: "FF1F3864" } } };

// ─── Coordonnées des noms définis ───────────────────────────────────────────
// Un seul endroit où elles vivent : le générateur écrit ici, le validateur et
// le grader lisent par NOM, pas par coordonnée.
export const NAMED = {
  ATLAS_MARKET_CAP_NOVA:          { sheet: SHEETS.comps, cell: "C7" },
  ATLAS_EV_NOVA:                  { sheet: SHEETS.comps, cell: "D7" },
  ATLAS_COMPS_MEDIAN_EV_EBITDA_27:{ sheet: SHEETS.comps, cell: "H18" },
  ATLAS_IMPLIED_EV_COMPS:         { sheet: SHEETS.comps, cell: "D24" },
  ATLAS_IMPLIED_EQUITY_COMPS:     { sheet: SHEETS.comps, cell: "D29" },
  ATLAS_IMPLIED_PRICE_COMPS:      { sheet: SHEETS.comps, cell: "D31" },
  ATLAS_WACC:                     { sheet: SHEETS.dcf,   cell: "D16" },
  ATLAS_UFCF_26:                  { sheet: SHEETS.dcf,   cell: "D30" },
  ATLAS_UFCF_27:                  { sheet: SHEETS.dcf,   cell: "E30" },
  ATLAS_UFCF_28:                  { sheet: SHEETS.dcf,   cell: "F30" },
  ATLAS_UFCF_29:                  { sheet: SHEETS.dcf,   cell: "G30" },
  ATLAS_UFCF_30:                  { sheet: SHEETS.dcf,   cell: "H30" },
  ATLAS_DCF_PV_FCF:               { sheet: SHEETS.dcf,   cell: "D40" },
  ATLAS_DCF_PV_TV:                { sheet: SHEETS.dcf,   cell: "D41" },
  ATLAS_DCF_EV:                   { sheet: SHEETS.dcf,   cell: "D42" },
  ATLAS_DCF_EQUITY:               { sheet: SHEETS.dcf,   cell: "D47" },
  ATLAS_DCF_PRICE:                { sheet: SHEETS.dcf,   cell: "D49" },
  ATLAS_MODEL_CHECK:              { sheet: SHEETS.checks, cell: "D18" },
};

/** Colonnes du tableau de comps : une ligne par peer à partir de la ligne 7. */
export const COMPS_FIRST_ROW = 7;
export const COMPS_COLS = {
  name: "B", marketCap: "C", ev: "D",
  evRev26: "E", evRev27: "F", evEbitda26: "G", evEbitda27: "H", evEbit26: "I", evEbit27: "J",
};
/** Lignes des statistiques sous le tableau. */
export const COMPS_STATS_ROWS = { min: 16, q1: 17, median: 18, q3: 19, max: 20 };

/** Colonnes du DCF : D..H pour FY26E..FY30E. */
export const DCF_COLS = ["D", "E", "F", "G", "H"];
export const DCF_ROWS = {
  revenue: 22, growth: 23, ebitda: 24, margin: 25, da: 26, ebit: 27,
  tax: 28, nopat: 29, ufcf: 30, discountFactor: 34, pvUfcf: 35,
};
export const SENS_ORIGIN = { row: 54, col: 4 }; // D54 = coin haut-gauche de la grille
