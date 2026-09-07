#!/usr/bin/env node --experimental-strip-types
// ─── Générateur des classeurs Project Atlas ─────────────────────────────────
// Produit Starter et Solution de façon déterministe depuis les données
// canoniques de src/data/projectAtlas.ts. Aucune valeur n'est recopiée à la
// main : les résultats en cache proviennent de src/lib/finance.ts.
//
//   npm run generate:atlas

import ExcelJS from "exceljs";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  atlasCompany, atlasPeers, atlasAssumptions, computeAtlasExpected,
  peerMultiples, peerEnterpriseValue, peerMarketCap,
  YEARS, FORECAST_YEARS, HISTORICAL_COUNT,
  ATLAS_CASE_ID, ATLAS_CASE_VERSION, ATLAS_GRADER_VERSION, ATLAS_NAMED_RANGES,
} from "../src/data/projectAtlas.ts";

import * as L from "./atlas-layout.mjs";
import { COMPS_IMPLIED_ROWS, SUMMARY_CELLS, SENS } from "../src/data/projectAtlasLayout.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, "../public/project-atlas");

const E = computeAtlasExpected();
const F = atlasCompany.financials;
const A = atlasAssumptions;

// ─── Helpers d'écriture ─────────────────────────────────────────────────────
const put = (ws, addr, value, { font, fmt, fill, border, align } = {}) => {
  const c = ws.getCell(addr);
  c.value = value;
  if (font) c.font = font;
  if (fmt) c.numFmt = fmt;
  if (fill) c.fill = fill;
  if (border) c.border = border;
  if (align) c.alignment = align;
  return c;
};

/** Écrit une formule avec son résultat en cache (Solution) ou laisse vide (Starter). */
const putFormula = (ws, addr, formula, result, opts = {}, blank = false) => {
  const c = ws.getCell(addr);
  if (blank) {
    c.value = null;
    c.fill = L.INPUT_FILL; // les cellules à compléter sont surlignées
  } else {
    c.value = { formula, result };
  }
  c.font = opts.font ?? L.FORMULA_FONT;
  if (opts.fmt) c.numFmt = opts.fmt;
  if (opts.border) c.border = opts.border;
  return c;
};

const label = (ws, addr, text, font = L.LABEL_FONT) => put(ws, addr, text, { font });
const section = (ws, addr, text) => put(ws, addr, text, { font: L.SECTION_FONT });

const headerRow = (ws, row, cols, values) => {
  cols.forEach((col, i) => {
    put(ws, `${col}${row}`, values[i], {
      font: L.HEADER_FONT, fill: L.HEADER_FILL,
      align: { horizontal: i === 0 ? "left" : "right" },
    });
  });
};

// ═══════════════════════════════════════════════════════════════════════════
//  CONSTRUCTION D'UN CLASSEUR
//  mode = "solution" (tout rempli) | "starter" (formules critiques vides)
// ═══════════════════════════════════════════════════════════════════════════
function buildWorkbook(mode) {
  const isStarter = mode === "starter";
  const wb = new ExcelJS.Workbook();
  wb.creator = "M&A Training Lab";
  wb.created = new Date(2026, 0, 1); // date fixe → génération déterministe
  wb.modified = new Date(2026, 0, 1);

  // ─── Cover ────────────────────────────────────────────────────────────────
  const cover = wb.addWorksheet(L.SHEETS.cover, { views: [{ showGridLines: false }] });
  cover.getColumn("B").width = 26; cover.getColumn("C").width = 52;
  put(cover, "B2", "PROJECT ATLAS", { font: { ...L.TITLE_FONT, size: 20 } });
  put(cover, "B3", "Analyse de valorisation préliminaire", { font: { ...L.LABEL_FONT, size: 11, italic: true } });
  const coverRows = [
    ["Cible", atlasCompany.name],
    ["Secteur", atlasCompany.sector],
    ["Géographie", atlasCompany.geography],
    ["Devise", `${atlasCompany.currency} — montants en ${atlasCompany.unit}`],
    ["Stade", "Préparation sell-side — phase amont"],
    ["Préparé pour", "Emma Roberts, Associate"],
    ["Préparé par", "Analyste"],
    ["Version du cas", `${ATLAS_CASE_ID} · ${ATLAS_CASE_VERSION}`],
  ];
  coverRows.forEach(([k, v], i) => {
    put(cover, `B${6 + i}`, k, { font: L.SECTION_FONT });
    put(cover, `C${6 + i}`, v, { font: L.LABEL_FONT });
  });
  put(cover, "B16", "CONVENTIONS", { font: L.SECTION_FONT });
  [["Bleu", "saisie en dur (hypothèse)"], ["Noir", "formule"], ["Vert", "lien depuis un autre onglet"]]
    .forEach(([k, v], i) => {
      put(cover, `B${17 + i}`, k, { font: i === 0 ? L.INPUT_FONT : i === 1 ? L.FORMULA_FONT : L.LINK_FONT });
      put(cover, `C${17 + i}`, v, { font: L.LABEL_FONT });
    });
  put(cover, "B21", "Ce classeur est un exercice pédagogique. Société et données entièrement fictives.",
    { font: { ...L.LABEL_FONT, italic: true, size: 9 } });

  // ─── Instructions ─────────────────────────────────────────────────────────
  const ins = wb.addWorksheet(L.SHEETS.instructions, { views: [{ showGridLines: false }] });
  ins.getColumn("B").width = 4; ins.getColumn("C").width = 100;
  put(ins, "B2", "INSTRUCTIONS", { font: L.TITLE_FONT });
  const steps = [
    "Complète l'onglet Trading_Comps : market cap, enterprise value et les six multiples de chaque comparable.",
    "Renseigne les statistiques (min, Q1, médiane, Q3, max) sous le tableau des comps.",
    "Applique la médiane EV/EBITDA FY27E à l'EBITDA FY27E d'Atlas, puis déroule le bridge jusqu'au prix par action.",
    "Complète l'onglet DCF : EBIT, impôt, NOPAT, UFCF sur FY26E-FY30E.",
    "Construis le WACC à partir des hypothèses (CAPM puis pondération).",
    "Actualise les flux (convention mi-année), calcule la valeur terminale par Gordon, puis l'EV, l'equity et le prix.",
    "Remplis la table de sensibilité WACC × croissance terminale.",
    "Reporte les fourchettes dans Valuation_Summary.",
    "Vérifie que l'onglet Checks affiche MODEL CHECK = OK.",
    "Enregistre le fichier au format .xlsx et dépose-le sur la plateforme.",
  ];
  steps.forEach((s, i) => {
    put(ins, `B${4 + i}`, `${i + 1}.`, { font: L.SECTION_FONT });
    put(ins, `C${4 + i}`, s, { font: L.LABEL_FONT, align: { wrapText: true, vertical: "top" } });
  });
  put(ins, "C16", "Les cellules à compléter sont surlignées en jaune pâle. Utilise des FORMULES : un chiffre saisi en dur ne reçoit qu'un crédit partiel.",
    { font: { ...L.LABEL_FONT, italic: true }, align: { wrapText: true } });
  put(ins, "C18", "Important : enregistre depuis Excel (ou LibreOffice) pour que les formules soient recalculées avant l'envoi.",
    { font: { ...L.SECTION_FONT, color: { argb: "FFC00000" } }, align: { wrapText: true } });

  // ─── Atlas_Raw ────────────────────────────────────────────────────────────
  const raw = wb.addWorksheet(L.SHEETS.atlasRaw, { views: [{ state: "frozen", xSplit: 2, ySplit: 5 }] });
  raw.getColumn("B").width = 32;
  YEARS.forEach((_, i) => (raw.getColumn(3 + i).width = 11));
  put(raw, "B2", "ATLAS CONSUMER GROUP — DONNÉES FINANCIÈRES", { font: L.TITLE_FONT });
  put(raw, "B3", `${atlasCompany.currency} en millions · A = réalisé, E = plan d'affaires`, { font: { ...L.LABEL_FONT, italic: true, size: 9 } });
  const yearCols = YEARS.map((_, i) => String.fromCharCode(67 + i)); // C..J
  headerRow(raw, 5, ["B", ...yearCols], ["Exercice", ...YEARS]);

  const rawLine = (row, name, values, fmt) => {
    label(raw, `B${row}`, name);
    values.forEach((v, i) => put(raw, `${yearCols[i]}${row}`, v, { font: L.INPUT_FONT, fmt }));
  };
  rawLine(6, "Chiffre d'affaires", F.revenue, L.FMT.money1);
  label(raw, "B7", "Croissance (%)");
  YEARS.forEach((_, i) => {
    if (i === 0) { put(raw, `${yearCols[i]}7`, "n.a.", { font: L.LABEL_FONT, align: { horizontal: "right" } }); return; }
    putFormula(raw, `${yearCols[i]}7`, `${yearCols[i]}6/${yearCols[i - 1]}6-1`,
      F.revenue[i] / F.revenue[i - 1] - 1, { fmt: L.FMT.pct1 });
  });
  rawLine(8, "EBITDA", F.ebitda, L.FMT.money1);
  label(raw, "B9", "Marge d'EBITDA (%)");
  YEARS.forEach((_, i) =>
    putFormula(raw, `${yearCols[i]}9`, `${yearCols[i]}8/${yearCols[i]}6`, F.ebitda[i] / F.revenue[i], { fmt: L.FMT.pct1 }));
  rawLine(10, "Dotations aux amortissements (D&A)", F.da, L.FMT.money1);
  label(raw, "B11", "EBIT");
  YEARS.forEach((_, i) =>
    putFormula(raw, `${yearCols[i]}11`, `${yearCols[i]}8-${yearCols[i]}10`, F.ebitda[i] - F.da[i], { fmt: L.FMT.money1 }));
  rawLine(12, "Investissements (capex)", F.capex, L.FMT.money1);
  rawLine(13, "Variation du BFR", F.deltaNwc, L.FMT.money1);

  section(raw, "B16", "STRUCTURE DE CAPITAL (au dernier arrêté FY25A)");
  const capRows = [
    ["Trésorerie et équivalents", atlasCompany.cash, L.FMT.money1],
    ["Dette financière brute", atlasCompany.grossDebt, L.FMT.money1],
    ["Dettes de loyers (IFRS 16)", atlasCompany.leaseLiabilities, L.FMT.money1],
    ["Intérêts minoritaires", atlasCompany.minorityInterests, L.FMT.money1],
    ["Nombre d'actions diluées (m)", atlasCompany.dilutedShares, L.FMT.shares],
    ["Taux d'impôt", atlasCompany.taxRate, L.FMT.pct1],
  ];
  capRows.forEach(([k, v, fmt], i) => {
    label(raw, `B${17 + i}`, k);
    put(raw, `C${17 + i}`, v, { font: L.INPUT_FONT, fmt });
  });

  // ─── Comps_Raw ────────────────────────────────────────────────────────────
  const craw = wb.addWorksheet(L.SHEETS.compsRaw, { views: [{ state: "frozen", xSplit: 2, ySplit: 5 }] });
  craw.getColumn("B").width = 24;
  for (let i = 0; i < 16; i++) craw.getColumn(3 + i).width = 11;
  put(craw, "B2", "COMPARABLES BOURSIERS — DONNÉES BRUTES", { font: L.TITLE_FONT });
  put(craw, "B3", "Cours au 31/12/2025 · montants en M€ · consensus de place (fictif)", { font: { ...L.LABEL_FONT, italic: true, size: 9 } });
  const cHead = ["Société", "Cours (€)", "Actions dil. (m)", "Trésorerie", "Dette", "Dettes loyers", "Minoritaires",
    "CA FY25", "CA FY26E", "CA FY27E", "EBITDA FY25", "EBITDA FY26E", "EBITDA FY27E", "EBIT FY25", "EBIT FY26E", "EBIT FY27E"];
  const cCols = cHead.map((_, i) => (i === 0 ? "B" : String.fromCharCode(66 + i)));
  headerRow(craw, 5, cCols, cHead);
  atlasPeers.forEach((p, i) => {
    const r = 6 + i;
    put(craw, `B${r}`, p.name, { font: L.LABEL_FONT });
    const vals = [p.sharePrice, p.dilutedShares, p.cash, p.debt, p.leaseLiabilities, p.minorities,
      p.revenue.fy25, p.revenue.fy26, p.revenue.fy27,
      p.ebitda.fy25, p.ebitda.fy26, p.ebitda.fy27,
      p.ebit.fy25, p.ebit.fy26, p.ebit.fy27];
    vals.forEach((v, j) => put(craw, `${cCols[j + 1]}${r}`, v, {
      font: L.INPUT_FONT, fmt: j === 0 ? L.FMT.money2 : j === 1 ? L.FMT.shares : L.FMT.money1,
    }));
  });
  put(craw, "B16", "Note : les données de plan proviennent du consensus. Vérifie la cohérence des périmètres avant de retenir un comparable.",
    { font: { ...L.LABEL_FONT, italic: true, size: 9 } });

  // ─── Trading_Comps ────────────────────────────────────────────────────────
  const tc = wb.addWorksheet(L.SHEETS.comps, { views: [{ state: "frozen", xSplit: 2, ySplit: 6 }] });
  tc.getColumn("B").width = 24;
  ["C", "D", "E", "F", "G", "H", "I", "J"].forEach((c) => (tc.getColumn(c).width = 13));
  put(tc, "B2", "TRADING COMPARABLES", { font: L.TITLE_FONT });
  put(tc, "B3", "Enterprise value = market cap + dette + dettes de loyers + minoritaires − trésorerie", { font: { ...L.LABEL_FONT, italic: true, size: 9 } });
  headerRow(tc, 6, ["B", "C", "D", "E", "F", "G", "H", "I", "J"],
    ["Société", "Market cap", "Enterprise value", "EV/CA FY26E", "EV/CA FY27E", "EV/EBITDA FY26E", "EV/EBITDA FY27E", "EV/EBIT FY26E", "EV/EBIT FY27E"]);

  atlasPeers.forEach((p, i) => {
    const r = L.COMPS_FIRST_ROW + i;
    const src = 6 + i; // ligne correspondante dans Comps_Raw
    const m = peerMultiples(p);
    put(tc, `B${r}`, p.name, { font: L.LINK_FONT });
    // Market cap et EV : la 1re ligne (Nova) est nommée et sert de témoin
    putFormula(tc, `C${r}`, `${L.SHEETS.compsRaw}!C${src}*${L.SHEETS.compsRaw}!D${src}`,
      peerMarketCap(p), { fmt: L.FMT.money1 }, isStarter);
    putFormula(tc, `D${r}`,
      `C${r}+${L.SHEETS.compsRaw}!F${src}+${L.SHEETS.compsRaw}!G${src}+${L.SHEETS.compsRaw}!H${src}-${L.SHEETS.compsRaw}!E${src}`,
      peerEnterpriseValue(p), { fmt: L.FMT.money1 }, isStarter);
    const mults = [
      ["E", `D${r}/${L.SHEETS.compsRaw}!J${src}`, m.evRevenue26],
      ["F", `D${r}/${L.SHEETS.compsRaw}!K${src}`, m.evRevenue27],
      ["G", `D${r}/${L.SHEETS.compsRaw}!M${src}`, m.evEbitda26],
      ["H", `D${r}/${L.SHEETS.compsRaw}!N${src}`, m.evEbitda27],
      ["I", `D${r}/${L.SHEETS.compsRaw}!P${src}`, m.evEbit26],
      ["J", `D${r}/${L.SHEETS.compsRaw}!Q${src}`, m.evEbit27],
    ];
    mults.forEach(([col, f, v]) => putFormula(tc, `${col}${r}`, f, v, { fmt: L.FMT.mult }, isStarter));
  });

  // Statistiques
  const lastRow = L.COMPS_FIRST_ROW + atlasPeers.length - 1;
  section(tc, "B15", "STATISTIQUES");
  const statDefs = [
    ["Minimum", L.COMPS_STATS_ROWS.min, "MIN", (s) => s.min],
    ["1er quartile", L.COMPS_STATS_ROWS.q1, "QUARTILE.INC", (s) => s.q1],
    ["Médiane", L.COMPS_STATS_ROWS.median, "MEDIAN", (s) => s.median],
    ["3e quartile", L.COMPS_STATS_ROWS.q3, "QUARTILE.INC", (s) => s.q3],
    ["Maximum", L.COMPS_STATS_ROWS.max, "MAX", (s) => s.max],
  ];
  const statCols = [["E", "evRevenue26"], ["F", "evRevenue27"], ["G", "evEbitda26"], ["H", "evEbitda27"], ["I", "evEbit26"], ["J", "evEbit27"]];
  statDefs.forEach(([name, row, fn, pick]) => {
    label(tc, `B${row}`, name);
    statCols.forEach(([col, key]) => {
      const rng = `${col}${L.COMPS_FIRST_ROW}:${col}${lastRow}`;
      const formula = fn === "QUARTILE.INC"
        ? `QUARTILE.INC(${rng},${row === L.COMPS_STATS_ROWS.q1 ? 1 : 3})`
        : `${fn}(${rng})`;
      putFormula(tc, `${col}${row}`, formula, pick(E.stats[key]), { fmt: L.FMT.mult2 }, isStarter);
    });
  });

  // Valorisation implicite d'Atlas — bridge EV → equity → prix par action
  section(tc, "B22", "VALORISATION IMPLICITE D'ATLAS — EV/EBITDA FY27E");
  const atlasEbitda27 = F.ebitda[YEARS.indexOf("FY27E")];
  const bridge = [
    ["B23", "EBITDA FY27E d'Atlas", "D23", `${L.SHEETS.atlasRaw}!G8`, atlasEbitda27, L.FMT.money1, "link"],
    ["B24", "× Médiane EV/EBITDA FY27E  =  Enterprise value implicite", "D24", `D23*H${L.COMPS_STATS_ROWS.median}`, E.comps.impliedEv, L.FMT.money1, "calc"],
    ["B25", "− Dette financière brute", "D25", `-${L.SHEETS.atlasRaw}!C18`, -atlasCompany.grossDebt, L.FMT.money1, "link"],
    ["B26", "− Dettes de loyers", "D26", `-${L.SHEETS.atlasRaw}!C19`, -atlasCompany.leaseLiabilities, L.FMT.money1, "link"],
    ["B27", "− Intérêts minoritaires", "D27", `-${L.SHEETS.atlasRaw}!C20`, -atlasCompany.minorityInterests, L.FMT.money1, "link"],
    ["B28", "+ Trésorerie", "D28", `${L.SHEETS.atlasRaw}!C17`, atlasCompany.cash, L.FMT.money1, "link"],
  ];
  bridge.forEach(([lc, text, vc, formula, result, fmt, kind]) => {
    label(tc, lc, text);
    if (kind === "link") putFormula(tc, vc, formula, result, { font: L.LINK_FONT, fmt });
    else putFormula(tc, vc, formula, result, { fmt }, isStarter);
  });

  put(tc, "B29", "= Equity value implicite", { font: L.SECTION_FONT });
  putFormula(tc, "D29", "SUM(D24:D28)", E.comps.impliedEquity, { fmt: L.FMT.money1, border: L.topBorder }, isStarter);
  label(tc, "B30", "÷ Actions diluées (m)");
  putFormula(tc, "D30", `${L.SHEETS.atlasRaw}!C21`, atlasCompany.dilutedShares, { font: L.LINK_FONT, fmt: L.FMT.shares });
  put(tc, "B31", "= Prix par action implicite (€)", { font: L.SECTION_FONT });
  putFormula(tc, "D31", "D29/D30", E.comps.impliedPrice, { fmt: L.FMT.money2, border: L.topBorder }, isStarter);

  // Prix implicites aux bornes du quartile — ils alimentent la synthèse, qui
  // doit être LIÉE et non recopiée à la main.
  label(tc, `B${COMPS_IMPLIED_ROWS.priceQ1}`, "Prix implicite au 1er quartile (€)");
  putFormula(tc, `D${COMPS_IMPLIED_ROWS.priceQ1}`,
    `(D23*H${L.COMPS_STATS_ROWS.q1}+SUM(D25:D28))/D30`, E.summary.compsLow, { fmt: L.FMT.money2 }, isStarter);
  label(tc, `B${COMPS_IMPLIED_ROWS.priceQ3}`, "Prix implicite au 3e quartile (€)");
  putFormula(tc, `D${COMPS_IMPLIED_ROWS.priceQ3}`,
    `(D23*H${L.COMPS_STATS_ROWS.q3}+SUM(D25:D28))/D30`, E.summary.compsHigh, { fmt: L.FMT.money2 }, isStarter);

  put(tc, "B36", "Rappel : un comparable peut sembler décoté pour de bonnes raisons. Regarde la croissance et la marge avant de conclure.",
    { font: { ...L.LABEL_FONT, italic: true, size: 9 } });


  // ─── DCF ──────────────────────────────────────────────────────────────────
  const d = wb.addWorksheet(L.SHEETS.dcf, { views: [{ state: "frozen", xSplit: 2, ySplit: 5 }] });
  d.getColumn("B").width = 34; d.getColumn("C").width = 12;
  L.DCF_COLS.forEach((c) => (d.getColumn(c).width = 12));
  put(d, "B2", "DCF — FLUX DE TRÉSORERIE DISPONIBLES NON LEVIERS", { font: L.TITLE_FONT });
  put(d, "B3", `${atlasCompany.currency} en millions · convention mi-année · valeur terminale par Gordon`, { font: { ...L.LABEL_FONT, italic: true, size: 9 } });

  // Hypothèses de WACC
  section(d, "B6", "HYPOTHÈSES DE COÛT DU CAPITAL");
  const waccInputs = [
    ["Taux sans risque", A.riskFreeRate, L.FMT.pct2],
    ["Prime de risque actions", A.equityRiskPremium, L.FMT.pct2],
    ["Beta", A.beta, "0.00"],
    ["Coût de la dette avant impôt", A.pretaxCostOfDebt, L.FMT.pct2],
    ["Taux d'impôt", A.taxRate, L.FMT.pct1],
    ["Poids de la dette", A.debtWeight, L.FMT.pct1],
    ["Poids des capitaux propres", A.equityWeight, L.FMT.pct1],
  ];
  waccInputs.forEach(([k, v, fmt], i) => {
    label(d, `B${7 + i}`, k);
    put(d, `D${7 + i}`, v, { font: L.INPUT_FONT, fmt });
  });
  label(d, "B15", "Coût des capitaux propres (CAPM)");
  putFormula(d, "D15", "D7+D9*D8", E.dcf.costOfEquity, { fmt: L.FMT.pct2 }, isStarter);
  put(d, "B16", "WACC", { font: L.SECTION_FONT });
  // WACC = Ke × poids CP + Kd × (1 − t) × poids dette
  // D13 = Ke · D10 = Kd · D11 = impôt · D12 = poids dette · D13Row+... : voir waccInputs
  putFormula(d, "D16", "D15*D13+D10*(1-D11)*D12", E.dcf.wacc, { fmt: L.FMT.pct2 }, isStarter);

  label(d, "B17", "Croissance à l'infini (g)");
  put(d, "D17", A.terminalGrowth, { font: L.INPUT_FONT, fmt: L.FMT.pct2 });

  // Projection des flux
  section(d, "B20", "PROJECTION DES FLUX");
  headerRow(d, 21, ["B", ...L.DCF_COLS], ["Exercice", ...FORECAST_YEARS]);
  const rawCol = (y) => String.fromCharCode(67 + YEARS.indexOf(y)); // colonne dans Atlas_Raw
  const R = L.DCF_ROWS;
  const lineDef = [
    [R.revenue, "Chiffre d'affaires", (c, y) => `${L.SHEETS.atlasRaw}!${rawCol(y)}6`, (y) => F.revenue[YEARS.indexOf(y)], L.FMT.money1, "link"],
    [R.growth, "Croissance (%)", (c, y, i) => i === 0 ? `${c}${R.revenue}/${L.SHEETS.atlasRaw}!${rawCol("FY25A")}6-1` : `${c}${R.revenue}/${L.DCF_COLS[i - 1]}${R.revenue}-1`,
      (y) => { const i = YEARS.indexOf(y); return F.revenue[i] / F.revenue[i - 1] - 1; }, L.FMT.pct1, "calc"],
    [R.ebitda, "EBITDA", (c, y) => `${L.SHEETS.atlasRaw}!${rawCol(y)}8`, (y) => F.ebitda[YEARS.indexOf(y)], L.FMT.money1, "link"],
    [R.margin, "Marge d'EBITDA (%)", (c) => `${c}${R.ebitda}/${c}${R.revenue}`,
      (y) => { const i = YEARS.indexOf(y); return F.ebitda[i] / F.revenue[i]; }, L.FMT.pct1, "calc"],
    [R.da, "D&A", (c, y) => `${L.SHEETS.atlasRaw}!${rawCol(y)}10`, (y) => F.da[YEARS.indexOf(y)], L.FMT.money1, "link"],
    [R.ebit, "EBIT", (c) => `${c}${R.ebitda}-${c}${R.da}`,
      (y) => { const i = YEARS.indexOf(y); return F.ebitda[i] - F.da[i]; }, L.FMT.money1, "calc"],
    [R.tax, "Impôt sur l'EBIT", (c) => `-${c}${R.ebit}*$D$11`,
      (y) => { const i = YEARS.indexOf(y); return -(F.ebitda[i] - F.da[i]) * atlasCompany.taxRate; }, L.FMT.money1, "calc"],
    [R.nopat, "NOPAT", (c) => `${c}${R.ebit}+${c}${R.tax}`,
      (y) => { const i = YEARS.indexOf(y); return (F.ebitda[i] - F.da[i]) * (1 - atlasCompany.taxRate); }, L.FMT.money1, "calc"],
  ];
  lineDef.forEach(([row, name, f, val, fmt, kind]) => {
    label(d, `B${row}`, name);
    L.DCF_COLS.forEach((c, i) => {
      const y = FORECAST_YEARS[i];
      if (kind === "link") putFormula(d, `${c}${row}`, f(c, y, i), val(y), { font: L.LINK_FONT, fmt });
      else putFormula(d, `${c}${row}`, f(c, y, i), val(y), { fmt }, isStarter);
    });
  });
  // D&A / capex / ΔBFR puis UFCF
  label(d, "B31", "+ D&A");
  label(d, "B32", "− Capex");
  label(d, "B33", "− Variation du BFR");
  L.DCF_COLS.forEach((c, i) => {
    const y = FORECAST_YEARS[i], yi = YEARS.indexOf(y);
    putFormula(d, `${c}31`, `${c}${R.da}`, F.da[yi], { font: L.LINK_FONT, fmt: L.FMT.money1 });
    putFormula(d, `${c}32`, `-${L.SHEETS.atlasRaw}!${rawCol(y)}12`, -F.capex[yi], { font: L.LINK_FONT, fmt: L.FMT.money1 });
    putFormula(d, `${c}33`, `-${L.SHEETS.atlasRaw}!${rawCol(y)}13`, -F.deltaNwc[yi], { font: L.LINK_FONT, fmt: L.FMT.money1 });
  });
  put(d, `B${R.ufcf}`, "= UFCF", { font: L.SECTION_FONT });
  L.DCF_COLS.forEach((c, i) => {
    putFormula(d, `${c}${R.ufcf}`, `${c}${R.nopat}+${c}31+${c}32+${c}33`,
      E.dcf.ufcf[FORECAST_YEARS[i]], { fmt: L.FMT.money1, border: L.topBorder }, isStarter);
  });

  // Actualisation
  label(d, "B34", "Période d'actualisation (mi-année)");
  label(d, "B35", "Facteur d'actualisation");
  label(d, "B36", "PV de l'UFCF");
  L.DCF_COLS.forEach((c, i) => {
    const t = i + 1 - 0.5;
    put(d, `${c}34`, t, { font: L.INPUT_FONT, fmt: "0.0" });
    const df = 1 / Math.pow(1 + E.dcf.wacc, t);
    putFormula(d, `${c}35`, `1/(1+$D$16)^${c}34`, df, { fmt: "0.0000" }, isStarter);
    putFormula(d, `${c}36`, `${c}${R.ufcf}*${c}35`, E.dcf.ufcf[FORECAST_YEARS[i]] * df, { fmt: L.FMT.money1 }, isStarter);
  });

  // Valeur terminale et pont
  section(d, "B39", "VALEUR TERMINALE ET VALORISATION");
  const tvT = L.DCF_COLS.length - 0.5;
  label(d, "B40", "Somme des PV des UFCF");
  putFormula(d, "D40", "SUM(D36:H36)", E.dcf.pvFcf, { fmt: L.FMT.money1 }, isStarter);
  label(d, "B41", "PV de la valeur terminale");
  putFormula(d, "D41", `(H${R.ufcf}*(1+$D$17)/($D$16-$D$17))/(1+$D$16)^${tvT}`, E.dcf.pvTv, { fmt: L.FMT.money1 }, isStarter);
  put(d, "B42", "= Enterprise value", { font: L.SECTION_FONT });
  putFormula(d, "D42", "D40+D41", E.dcf.enterpriseValue, { fmt: L.FMT.money1, border: L.topBorder }, isStarter);
  const bridge2 = [
    ["B43", "− Dette financière brute", "D43", `-${L.SHEETS.atlasRaw}!C18`, -atlasCompany.grossDebt],
    ["B44", "− Dettes de loyers", "D44", `-${L.SHEETS.atlasRaw}!C19`, -atlasCompany.leaseLiabilities],
    ["B45", "− Intérêts minoritaires", "D45", `-${L.SHEETS.atlasRaw}!C20`, -atlasCompany.minorityInterests],
    ["B46", "+ Trésorerie", "D46", `${L.SHEETS.atlasRaw}!C17`, atlasCompany.cash],
  ];
  bridge2.forEach(([lc, text, vc, f, v]) => { label(d, lc, text); putFormula(d, vc, f, v, { font: L.LINK_FONT, fmt: L.FMT.money1 }); });
  put(d, "B47", "= Equity value", { font: L.SECTION_FONT });
  putFormula(d, "D47", "SUM(D42:D46)", E.dcf.equityValue, { fmt: L.FMT.money1, border: L.topBorder }, isStarter);
  label(d, "B48", "÷ Actions diluées (m)");
  putFormula(d, "D48", `${L.SHEETS.atlasRaw}!C21`, atlasCompany.dilutedShares, { font: L.LINK_FONT, fmt: L.FMT.shares });
  put(d, "B49", "= Prix par action (€)", { font: L.SECTION_FONT });
  putFormula(d, "D49", "D47/D48", E.dcf.pricePerShare, { fmt: L.FMT.money2, border: L.topBorder }, isStarter);

  // Sensibilité
  section(d, "B52", "SENSIBILITÉ — PRIX PAR ACTION (€)");
  put(d, "C53", "WACC ↓  /  croissance à l'infini →", { font: { ...L.LABEL_FONT, italic: true, size: 9 } });
  const sc = L.SENS_ORIGIN.col, sr = L.SENS_ORIGIN.row;
  const colLetter = (n) => String.fromCharCode(64 + n);
  // Coin haut-gauche : une table de données à 2 variables exige une référence
  // vers la sortie que l'on sensibilise. Sans elle, Excel ne sait pas quoi
  // recalculer — c'était incohérent avec les instructions.
  putFormula(d, `C${sr}`, "D49", E.dcf.pricePerShare, { fmt: L.FMT.money2 });
  A.sensitivityGrowth.forEach((g, j) =>
    put(d, `${colLetter(sc + j)}${sr}`, g, { font: L.HEADER_FONT, fill: L.HEADER_FILL, fmt: L.FMT.pct1 }));
  A.sensitivityWacc.forEach((w, i) => {
    put(d, `C${sr + 1 + i}`, w, { font: L.HEADER_FONT, fill: L.HEADER_FILL, fmt: L.FMT.pct1 });
    A.sensitivityGrowth.forEach((g, j) => {
      putFormula(d, `${colLetter(sc + j)}${sr + 1 + i}`, "", E.dcf.sensitivity[i][j],
        { fmt: L.FMT.money2 }, true); // toujours à remplir par l'utilisateur
      if (!isStarter) {
        d.getCell(`${colLetter(sc + j)}${sr + 1 + i}`).value = E.dcf.sensitivity[i][j];
        d.getCell(`${colLetter(sc + j)}${sr + 1 + i}`).fill = undefined;
        d.getCell(`${colLetter(sc + j)}${sr + 1 + i}`).font = L.FORMULA_FONT;
        d.getCell(`${colLetter(sc + j)}${sr + 1 + i}`).numFmt = L.FMT.money2;
      }
    });
  });
  put(d, `B${sr + 7}`, `Sélectionne C${sr}:H${sr + 5} puis Données → Analyse de scénarios → Table de données. Cellule d'entrée en ligne : D17 (croissance). Cellule d'entrée en colonne : D16 (WACC). La cellule C${sr} référence déjà la sortie à sensibiliser.`,
    { font: { ...L.LABEL_FONT, italic: true, size: 9 } });

  // ─── Valuation_Summary ────────────────────────────────────────────────────
  // Entièrement LIÉ : chaque sortie référence Trading_Comps ou DCF. Un modèle
  // de banquier ne recopie jamais un résultat à la main.
  const vs = wb.addWorksheet(L.SHEETS.summary, { views: [{ showGridLines: false }] });
  vs.getColumn("B").width = 36; ["C", "D", "E"].forEach((c) => (vs.getColumn(c).width = 14));
  put(vs, "B2", "SYNTHÈSE DE VALORISATION", { font: L.TITLE_FONT });
  put(vs, "B3", "Prix par action implicite (€)", { font: { ...L.LABEL_FONT, italic: true, size: 9 } });
  headerRow(vs, 6, ["B", "C", "D", "E"], ["Méthode", "Bas", "Central", "Haut"]);

  const S = E.summary;
  const TC = L.SHEETS.comps, DC = L.SHEETS.dcf;
  const sensRange = `${DC}!${SENS.cols[0]}${SENS.firstDataRow}:${SENS.cols[4]}${SENS.firstDataRow + SENS.rowCount - 1}`;

  label(vs, "B7", "Comparables boursiers (EV/EBITDA FY27E)");
  label(vs, "B8", "DCF (WACC × croissance à l'infini)");

  const summaryFormulas = {
    compsLow:  `${TC}!D${COMPS_IMPLIED_ROWS.priceQ1}`,
    compsMid:  `${TC}!D${COMPS_IMPLIED_ROWS.price}`,
    compsHigh: `${TC}!D${COMPS_IMPLIED_ROWS.priceQ3}`,
    dcfLow:    `MIN(${sensRange})`,
    dcfMid:    `${DC}!D49`,
    dcfHigh:   `MAX(${sensRange})`,
    rangeLow:  "MIN(C7:C8)",
    rangeHigh: "MAX(E7:E8)",
  };

  put(vs, "B10", "Fourchette illustrative retenue", { font: L.SECTION_FONT });
  for (const c of SUMMARY_CELLS) {
    putFormula(vs, c.cell, summaryFormulas[c.key], S[c.key],
      { fmt: L.FMT.money2, border: c.cell.endsWith("10") ? L.topBorder : undefined }, isStarter);
  }

  put(vs, "B13", "Les fourchettes de valorisation sont des résultats d'analyse, pas des valeurs de marché objectives.",
    { font: { ...L.SECTION_FONT, color: { argb: "FFC00000" } } });
  put(vs, "B14", "Les méthodes ne convergent pas mécaniquement : l'écart entre comparables et DCF est une information, pas une erreur à corriger. Le choix de la fourchette relève du jugement, et doit être argumenté.",
    { font: { ...L.LABEL_FONT, italic: true, size: 9 }, align: { wrapText: true } });
  vs.getRow(14).height = 28;

  // ─── Checks ───────────────────────────────────────────────────────────────
  const ck = wb.addWorksheet(L.SHEETS.checks, { views: [{ showGridLines: false }] });
  ck.getColumn("B").width = 46; ck.getColumn("C").width = 16; ck.getColumn("D").width = 14;
  put(ck, "B2", "CONTRÔLES DU MODÈLE", { font: L.TITLE_FONT });
  headerRow(ck, 5, ["B", "C", "D"], ["Contrôle", "Attendu", "Résultat"]);

  const checks = [
    ["Bridge comps : EV − dettes + trésorerie = equity",
     `ROUND(${L.SHEETS.comps}!D24+${L.SHEETS.comps}!D25+${L.SHEETS.comps}!D26+${L.SHEETS.comps}!D27+${L.SHEETS.comps}!D28-${L.SHEETS.comps}!D29,1)=0`, true],
    ["Bridge DCF : EV − dettes + trésorerie = equity",
     `ROUND(${L.SHEETS.dcf}!D42+${L.SHEETS.dcf}!D43+${L.SHEETS.dcf}!D44+${L.SHEETS.dcf}!D45+${L.SHEETS.dcf}!D46-${L.SHEETS.dcf}!D47,1)=0`, true],
    ["Croissance à l'infini < WACC", `${L.SHEETS.dcf}!D17<${L.SHEETS.dcf}!D16`, true],
    ["Nombre d'actions strictement positif", `${L.SHEETS.atlasRaw}!C21>0`, true],
    ["Aucune erreur dans les multiples de comps", `NOT(ISERROR(SUM(${L.SHEETS.comps}!E7:J14)))`, true],
    ["Aucune erreur dans les flux du DCF", `NOT(ISERROR(SUM(${L.SHEETS.dcf}!D30:H30)))`, true],
    ["Statistiques de comps renseignées", `COUNT(${L.SHEETS.comps}!E16:J20)=30`, true],
    ["Table de sensibilité renseignée", `COUNT(${L.SHEETS.dcf}!D55:H59)=25`, true],
    ["EV du DCF strictement positive", `${L.SHEETS.dcf}!D42>0`, true],
    ["Prix par action du DCF cohérent (> 0)", `${L.SHEETS.dcf}!D49>0`, true],
  ];
  checks.forEach(([name, formula, expected], i) => {
    const r = 6 + i;
    label(ck, `B${r}`, name);
    put(ck, `C${r}`, "VRAI", { font: L.LABEL_FONT, align: { horizontal: "center" } });
    putFormula(ck, `D${r}`, formula, expected, { fmt: L.FMT.text }, isStarter);
    ck.getCell(`D${r}`).alignment = { horizontal: "center" };
  });

  put(ck, "B18", "MODEL CHECK", { font: { ...L.TITLE_FONT, size: 12 } });
  putFormula(ck, "D18", `IF(AND(D6:D15),"OK","À CORRIGER")`, "OK",
    { font: { name: "Calibri", size: 12, bold: true, color: { argb: "FF006100" } }, fmt: L.FMT.text }, isStarter);
  ck.getCell("D18").alignment = { horizontal: "center" };
  put(ck, "B20", "MODEL CHECK doit afficher OK avant tout envoi. Un contrôle rouge signifie que le modèle n'est pas prêt.",
    { font: { ...L.LABEL_FONT, italic: true, size: 9 } });

  // ─── _LAB_META (masqué) ───────────────────────────────────────────────────
  const meta = wb.addWorksheet(L.SHEETS.meta);
  meta.state = "veryHidden";
  const metaRows = [
    ["case_id", ATLAS_CASE_ID],
    ["case_version", ATLAS_CASE_VERSION],
    ["grader_version", ATLAS_GRADER_VERSION],
    ["variant", mode],
    ["required_named_ranges", ATLAS_NAMED_RANGES.join(",")],
  ];
  metaRows.forEach(([k, v], i) => { meta.getCell(`A${i + 1}`).value = k; meta.getCell(`B${i + 1}`).value = v; });

  // ─── Noms définis ─────────────────────────────────────────────────────────
  for (const [name, { sheet, cell }] of Object.entries(L.NAMED)) {
    wb.definedNames.add(`'${sheet}'!${cell}`, name);
  }

  return wb;
}


// ─── Brief imprimable ───────────────────────────────────────────────────────
// HTML autonome : l'utilisateur l'ouvre et l'imprime en PDF si besoin.
// (Le format .xlsx, lui, est non négociable et généré ci-dessus.)
function writeBrief() {
  const E2 = E;
  const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8">
<title>Project Atlas — Brief de mission</title>
<style>
  @page { size: A4; margin: 18mm; }
  body { font: 11pt/1.55 -apple-system, "Segoe UI", Roboto, sans-serif; color: #1a1a1a; max-width: 760px; margin: 40px auto; padding: 0 24px; }
  h1 { font-size: 22pt; color: #1F3864; margin: 0 0 4px; }
  h2 { font-size: 12pt; color: #1F3864; margin: 26px 0 8px; border-bottom: 1px solid #d0d7e5; padding-bottom: 4px; }
  .sub { color: #666; font-size: 10pt; margin-bottom: 24px; }
  table { border-collapse: collapse; width: 100%; margin: 8px 0; font-size: 10pt; }
  th, td { text-align: left; padding: 5px 8px; border-bottom: 1px solid #e5e9f0; }
  th { background: #1F3864; color: #fff; font-weight: 600; }
  td.n { text-align: right; font-variant-numeric: tabular-nums; }
  .box { background: #f5f7fb; border-left: 3px solid #1F3864; padding: 12px 16px; margin: 14px 0; }
  .warn { background: #fff8e6; border-left-color: #c08a00; }
  ol li, ul li { margin: 4px 0; }
  footer { margin-top: 34px; padding-top: 12px; border-top: 1px solid #d0d7e5; color: #888; font-size: 9pt; }
  @media print { body { margin: 0; } .noprint { display: none; } }
</style></head><body>
<div class="noprint" style="background:#eef2f9;padding:10px 14px;border-radius:8px;margin-bottom:20px;font-size:10pt">
  💡 Pour obtenir un PDF : <b>Fichier → Imprimer → Enregistrer au format PDF</b>.
</div>

<h1>PROJECT ATLAS</h1>
<div class="sub">Analyse de valorisation préliminaire · Confidentiel · Exercice pédagogique</div>

<h2>Contexte</h2>
<p>${atlasCompany.description}</p>
<p><b>${atlasCompany.name}</b> est envisagé pour un processus de cession. L'équipe prépare une première
fourchette de valorisation avant la réunion interne de demain. Tu es l'analyste sur le dossier.</p>

<div class="box">
  <b>Équipe</b><br>
  Sarah Laurent — Managing Director<br>
  James Chen — Vice President<br>
  Emma Roberts — Associate (ta référente sur ce livrable)<br>
  Toi — Analyste
</div>

<h2>Ce qui t'est demandé</h2>
<ol>
  <li>Compléter les <b>trading comps</b> : market cap, enterprise value et multiples des huit comparables.</li>
  <li>Calculer les statistiques de l'échantillon et appliquer la médiane <b>EV/EBITDA FY27E</b> à Atlas.</li>
  <li>Dérouler le bridge enterprise value → equity value → prix par action.</li>
  <li>Construire un <b>DCF</b> en flux non leviers sur FY26E-FY30E, avec WACC bâti par formule.</li>
  <li>Valeur terminale par la méthode de Gordon, convention mi-année.</li>
  <li>Table de sensibilité WACC × croissance à l'infini.</li>
  <li>Synthèse de valorisation et contrôles du modèle au vert.</li>
</ol>

<h2>Données financières d'Atlas</h2>
<table>
  <tr><th>${atlasCompany.unit}</th>${YEARS.map((y) => `<th style="text-align:right">${y}</th>`).join("")}</tr>
  <tr><td>Chiffre d'affaires</td>${F.revenue.map((v) => `<td class="n">${v.toFixed(1)}</td>`).join("")}</tr>
  <tr><td>EBITDA</td>${F.ebitda.map((v) => `<td class="n">${v.toFixed(1)}</td>`).join("")}</tr>
  <tr><td>D&amp;A</td>${F.da.map((v) => `<td class="n">${v.toFixed(1)}</td>`).join("")}</tr>
  <tr><td>Capex</td>${F.capex.map((v) => `<td class="n">${v.toFixed(1)}</td>`).join("")}</tr>
  <tr><td>Variation du BFR</td>${F.deltaNwc.map((v) => `<td class="n">${v.toFixed(1)}</td>`).join("")}</tr>
</table>

<h2>Structure de capital (FY25A)</h2>
<table>
  <tr><td>Trésorerie</td><td class="n">${atlasCompany.cash.toFixed(1)}</td></tr>
  <tr><td>Dette financière brute</td><td class="n">${atlasCompany.grossDebt.toFixed(1)}</td></tr>
  <tr><td>Dettes de loyers (IFRS 16)</td><td class="n">${atlasCompany.leaseLiabilities.toFixed(1)}</td></tr>
  <tr><td>Intérêts minoritaires</td><td class="n">${atlasCompany.minorityInterests.toFixed(1)}</td></tr>
  <tr><td>Actions diluées (m)</td><td class="n">${atlasCompany.dilutedShares.toFixed(1)}</td></tr>
</table>

<h2>Comparables retenus</h2>
<ul>${atlasPeers.map((p) => `<li>${p.name}</li>`).join("")}</ul>
<div class="box warn">
  <b>Point de vigilance.</b> Un comparable peut afficher des multiples bas pour de bonnes raisons.
  Regarde la croissance et la trajectoire de marge avant de conclure à une décote injustifiée :
  retenir un comparable structurellement dégradé tire la médiane vers le bas sans que ce soit pertinent.
</div>

<h2>Hypothèses de coût du capital</h2>
<table>
  <tr><td>Taux sans risque</td><td class="n">${(A.riskFreeRate * 100).toFixed(2)}%</td></tr>
  <tr><td>Prime de risque actions</td><td class="n">${(A.equityRiskPremium * 100).toFixed(2)}%</td></tr>
  <tr><td>Beta</td><td class="n">${A.beta.toFixed(2)}</td></tr>
  <tr><td>Coût de la dette avant impôt</td><td class="n">${(A.pretaxCostOfDebt * 100).toFixed(2)}%</td></tr>
  <tr><td>Taux d'impôt</td><td class="n">${(A.taxRate * 100).toFixed(1)}%</td></tr>
  <tr><td>Poids dette / capitaux propres</td><td class="n">${(A.debtWeight * 100).toFixed(0)}% / ${(A.equityWeight * 100).toFixed(0)}%</td></tr>
  <tr><td>Croissance à l'infini</td><td class="n">${(A.terminalGrowth * 100).toFixed(1)}%</td></tr>
</table>

<h2>Avant d'envoyer</h2>
<ul>
  <li>Le modèle est entièrement <b>lié</b> : aucune valeur clé saisie en dur.</li>
  <li>L'onglet Checks affiche <b>MODEL CHECK = OK</b>.</li>
  <li>Aucune erreur #REF!, #DIV/0! ou #VALUE! ne subsiste.</li>
  <li>Le fichier est enregistré au format <b>.xlsx</b> depuis Excel, formules recalculées.</li>
</ul>

<footer>
  Project Atlas — cas pédagogique de M&amp;A Training Lab. Société, comparables et données entièrement fictifs.
  Les fourchettes de valorisation produites sont des résultats d'analyse, pas des valeurs de marché objectives.
</footer>
</body></html>`;
  writeFileSync(resolve(OUT_DIR, "Project_Atlas_Brief.html"), html, "utf8");
  console.log("✓ Project_Atlas_Brief.html");
  void E2;
}

// ═══════════════════════════════════════════════════════════════════════════
async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  for (const mode of ["starter", "solution"]) {
    const wb = buildWorkbook(mode);
    const file = mode === "starter"
      ? "Project_Atlas_Model_Starter.xlsx"
      : "Project_Atlas_Model_Solution.xlsx";
    const path = resolve(OUT_DIR, file);
    await wb.xlsx.writeFile(path);
    console.log(`✓ ${file}`);
  }
  writeBrief();
  console.log(`\nValeurs de référence :`);
  console.log(`  WACC                    ${(E.dcf.wacc * 100).toFixed(2)}%`);
  console.log(`  Médiane EV/EBITDA FY27E ${E.comps.medianEvEbitda27.toFixed(2)}x`);
  console.log(`  Prix comps              ${E.comps.impliedPrice.toFixed(2)} €`);
  console.log(`  Prix DCF                ${E.dcf.pricePerShare.toFixed(2)} €`);
}

main().catch((e) => { console.error(e); process.exit(1); });
