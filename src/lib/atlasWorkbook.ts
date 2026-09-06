// ─── Lecture d'un classeur Project Atlas ────────────────────────────────────
// Tout se passe dans le navigateur : le fichier de l'utilisateur n'est jamais
// envoyé sur le réseau. ExcelJS est chargé dynamiquement pour ne pas peser sur
// le bundle initial.

import {
  ATLAS_CASE_ID, ATLAS_CASE_VERSION, ATLAS_SHEETS, ATLAS_NAMED_RANGES,
  allGradeTargets, dcfFormulaCells,
} from "../data/projectAtlas.ts";
import { CHECK_ROWS, SHEETS } from "../data/projectAtlasLayout.ts";

/** Valeur lue pour un nom défini. */
export interface CellRead {
  /** Valeur numérique si la cellule en contient une, sinon null. */
  value: number | null;
  /** Valeur texte brute (pour MODEL CHECK notamment). */
  text: string | null;
  /** La cellule contient-elle une formule ? */
  hasFormula: boolean;
  /** Code d'erreur Excel rencontré (#REF!, #DIV/0!…). */
  error: string | null;
  /** La cellule existe mais est vide. */
  blank: boolean;
}

export interface ParsedAtlas {
  caseId: string | null;
  caseVersion: string | null;
  variant: string | null;
  sheets: string[];
  missingSheets: string[];
  cells: Record<string, CellRead>;
  missingNames: string[];
  /** Erreurs Excel trouvées n'importe où dans les onglets de travail. */
  errorCells: { sheet: string; address: string; error: string }[];
  /** Contrôles de l'onglet Checks : true = passé. */
  checkResults: boolean[];
  /** Nombre de cellules remplies dans le tableau de comps (sur 64). */
  compsFilled: number;
  /** Nombre de cellules remplies dans la table de sensibilité (sur 25). */
  sensitivityFilled: number;
  /** Aucune formule n'a de résultat en cache → le classeur n'a pas été recalculé. */
  noCachedResults: boolean;
  /** Lecture de CHAQUE cible de correction, indexée par son id. */
  targets: Record<string, CellRead>;
  /** Cellules du DCF que l'utilisateur construit, pour l'intégrité des formules. */
  dcfCells: { cell: string; read: CellRead }[];
  /** Les 10 contrôles de l'onglet Checks portent-ils une formule ? */
  checkFormulas: boolean[];
  /** Le MODEL CHECK est-il une formule (et non un « OK » tapé à la main) ? */
  modelCheckHasFormula: boolean;
}

export class AtlasParseError extends Error {
  // Propriété déclarée explicitement : le type-stripping de Node ne supporte
  // pas les propriétés de paramètre du constructeur.
  hint?: string;
  constructor(message: string, hint?: string) {
    super(message);
    this.name = "AtlasParseError";
    this.hint = hint;
  }
}

const ERROR_CODES = ["#REF!", "#DIV/0!", "#VALUE!", "#NAME?", "#NUM!", "#NULL!"];

/** Normalise la valeur d'une cellule ExcelJS, quelle que soit sa forme. */
function readCell(cell: unknown): CellRead {
  const out: CellRead = { value: null, text: null, hasFormula: false, error: null, blank: false };
  const c = cell as { value?: unknown; formula?: unknown; result?: unknown; type?: number };
  const raw = c?.value;

  if (raw === null || raw === undefined || raw === "") { out.blank = true; return out; }

  // Cellule de formule : { formula, result } — result peut être une erreur
  if (typeof raw === "object" && raw !== null && "formula" in (raw as object)) {
    out.hasFormula = true;
    const r = (raw as { result?: unknown }).result;
    if (r === null || r === undefined) { out.blank = true; return out; }
    if (typeof r === "object" && r !== null && "error" in (r as object)) {
      out.error = String((r as { error: unknown }).error);
      return out;
    }
    if (typeof r === "number") { out.value = r; out.text = String(r); return out; }
    out.text = String(r);
    return out;
  }

  // Cellule d'erreur directe
  if (typeof raw === "object" && raw !== null && "error" in (raw as object)) {
    out.error = String((raw as { error: unknown }).error);
    return out;
  }

  // Formule partagée / valeur riche
  if (typeof raw === "object" && raw !== null && "result" in (raw as object)) {
    out.hasFormula = true;
    const r = (raw as { result?: unknown }).result;
    if (typeof r === "number") { out.value = r; out.text = String(r); return out; }
    out.blank = r === null || r === undefined;
    out.text = r == null ? null : String(r);
    return out;
  }

  if (typeof raw === "number") { out.value = raw; out.text = String(raw); return out; }
  const s = String(raw).trim();
  out.text = s;
  if (ERROR_CODES.includes(s)) { out.error = s; return out; }
  // Nombre saisi en texte (« 12,5 ») — on tente une lecture indulgente
  const n = parseFloat(s.replace(/\s/g, "").replace(",", "."));
  if (!Number.isNaN(n) && /^[-+]?[\d\s.,]+$/.test(s)) out.value = n;
  return out;
}

/** Résout l'adresse d'un nom défini → { sheet, address }. */
function resolveName(wb: unknown, name: string): { sheet: string; address: string } | null {
  const model = (wb as { definedNames?: { model?: { name: string; ranges: string[] }[] } }).definedNames?.model;
  const entry = model?.find((m) => m.name === name);
  const ref = entry?.ranges?.[0];
  if (!ref) return null;
  // Forme : 'Sheet Name'!$D$16  ou  Sheet!D16
  const m = ref.match(/^'?([^'!]+)'?!(.+)$/);
  if (!m) return null;
  return { sheet: m[1], address: m[2].replace(/\$/g, "") };
}

/**
 * Lit un classeur Atlas soumis par l'utilisateur.
 * @throws AtlasParseError si le fichier n'est pas exploitable.
 */
export async function parseAtlasWorkbook(file: File | ArrayBuffer | Uint8Array): Promise<ParsedAtlas> {
  const ExcelJS = (await import("exceljs")).default ?? (await import("exceljs"));
  const wb = new (ExcelJS as unknown as { Workbook: new () => unknown }).Workbook() as {
    xlsx: { load: (b: ArrayBuffer) => Promise<unknown> };
    worksheets: { name: string; state?: string; eachRow: (o: unknown, cb: (row: unknown) => void) => void; getCell: (a: string) => unknown }[];
    getWorksheet: (n: string) => { getCell: (a: string) => unknown; eachRow: (o: unknown, cb: (row: unknown, n: number) => void) => void } | undefined;
    definedNames?: unknown;
  };

  // Accepte un File (navigateur), un ArrayBuffer, ou un Uint8Array/Buffer (Node).
  let buffer: ArrayBuffer;
  if (file instanceof ArrayBuffer) buffer = file;
  else if (ArrayBuffer.isView(file)) {
    const v = file as Uint8Array;
    buffer = v.buffer.slice(v.byteOffset, v.byteOffset + v.byteLength) as ArrayBuffer;
  } else if (typeof (file as File).arrayBuffer === "function") buffer = await (file as File).arrayBuffer();
  else throw new AtlasParseError("Aucun fichier exploitable n'a été fourni.");
  try {
    await wb.xlsx.load(buffer);
  } catch {
    throw new AtlasParseError(
      "Ce fichier n'a pas pu être lu.",
      "Vérifie qu'il s'agit bien d'un fichier .xlsx (et non .xls, .csv ou .numbers) enregistré depuis Excel.");
  }

  const sheets = wb.worksheets.map((w) => w.name);

  // ─── Métadonnées ──────────────────────────────────────────────────────────
  const meta = wb.getWorksheet("_LAB_META");
  const metaGet = (row: number) => {
    const v = meta?.getCell(`B${row}`) as { value?: unknown } | undefined;
    return v?.value == null ? null : String(v.value);
  };
  const caseId = metaGet(1);
  const caseVersion = metaGet(2);
  const variant = metaGet(4);

  if (caseId !== ATLAS_CASE_ID) {
    throw new AtlasParseError(
      "Ce classeur ne semble pas être le modèle Project Atlas.",
      "Repars du fichier Project_Atlas_Model_Starter.xlsx téléchargé sur cette page.");
  }
  // Une version inconnue n'est jamais corrigée en silence : le plan des cellules
  // aurait changé et la note n'aurait aucun sens.
  if (caseVersion !== ATLAS_CASE_VERSION) {
    throw new AtlasParseError(
      `Cette version du modèle Project Atlas (${caseVersion ?? "inconnue"}) n'est plus compatible avec le correcteur (version attendue : ${ATLAS_CASE_VERSION}).`,
      "Retélécharge le modèle de départ depuis cette page et reprends ton travail dessus.");
  }

  const missingSheets = ATLAS_SHEETS.filter((s) => !sheets.includes(s));

  // ─── Noms définis ─────────────────────────────────────────────────────────
  const cells: Record<string, CellRead> = {};
  const missingNames: string[] = [];
  let formulaCount = 0, cachedCount = 0;

  for (const name of ATLAS_NAMED_RANGES) {
    const loc = resolveName(wb, name);
    if (!loc) { missingNames.push(name); continue; }
    const ws = wb.getWorksheet(loc.sheet);
    if (!ws) { missingNames.push(name); continue; }
    const read = readCell(ws.getCell(loc.address));
    cells[name] = read;
    if (read.hasFormula) {
      formulaCount++;
      if (read.value !== null || read.text !== null || read.error) cachedCount++;
    }
  }

  // ─── Balayage des erreurs Excel ───────────────────────────────────────────
  const errorCells: ParsedAtlas["errorCells"] = [];
  for (const ws of wb.worksheets) {
    if (ws.state === "veryHidden") continue;
    ws.eachRow({ includeEmpty: false }, (row: unknown) => {
      (row as { eachCell: (o: unknown, cb: (c: unknown) => void) => void }).eachCell(
        { includeEmpty: false }, (cell: unknown) => {
          const r = readCell(cell);
          if (r.error && errorCells.length < 50) {
            errorCells.push({ sheet: ws.name, address: (cell as { address: string }).address, error: r.error });
          }
        });
    });
  }

  // ─── Onglet Checks ────────────────────────────────────────────────────────
  const checksWs = wb.getWorksheet("Checks");
  const checkResults: boolean[] = [];
  if (checksWs) {
    for (let r = 6; r <= 15; r++) {
      const c = readCell(checksWs.getCell(`D${r}`));
      const t = (c.text ?? "").toUpperCase();
      checkResults.push(t === "TRUE" || t === "VRAI" || c.value === 1);
    }
  }

  // ─── Complétion ───────────────────────────────────────────────────────────
  const compsWs = wb.getWorksheet("Trading_Comps");
  let compsFilled = 0;
  if (compsWs) {
    for (let r = 7; r <= 14; r++) {
      for (const col of ["C", "D", "E", "F", "G", "H", "I", "J"]) {
        const c = readCell(compsWs.getCell(`${col}${r}`));
        if (!c.blank && c.error === null) compsFilled++;
      }
    }
  }

  const dcfWs = wb.getWorksheet("DCF");
  let sensitivityFilled = 0;
  if (dcfWs) {
    for (let r = 55; r <= 59; r++) {
      for (const col of ["D", "E", "F", "G", "H"]) {
        const c = readCell(dcfWs.getCell(`${col}${r}`));
        if (!c.blank && c.error === null) sensitivityFilled++;
      }
    }
  }

  // ─── Lecture de toutes les cibles de correction ───────────────────────────
  const targets: Record<string, CellRead> = {};
  for (const t of allGradeTargets()) {
    const ws = wb.getWorksheet(t.sheet);
    targets[t.id] = ws
      ? readCell(ws.getCell(t.cell))
      : { value: null, text: null, hasFormula: false, error: null, blank: true };
    if (targets[t.id].hasFormula) {
      formulaCount++;
      if (targets[t.id].value !== null || targets[t.id].text !== null || targets[t.id].error) cachedCount++;
    }
  }

  // ─── Cellules du DCF construites par l'utilisateur ────────────────────────
  const dcfWsForCells = wb.getWorksheet(SHEETS.dcf);
  const dcfCells = dcfFormulaCells().map((c) => ({
    cell: c.cell,
    read: dcfWsForCells
      ? readCell(dcfWsForCells.getCell(c.cell))
      : { value: null, text: null, hasFormula: false, error: null, blank: true },
  }));

  // ─── Les contrôles sont-ils réellement calculés ? ─────────────────────────
  const checkFormulas: boolean[] = [];
  let modelCheckHasFormula = false;
  if (checksWs) {
    for (let r = CHECK_ROWS.first; r <= CHECK_ROWS.last; r++) {
      checkFormulas.push(readCell(checksWs.getCell(`D${r}`)).hasFormula);
    }
    modelCheckHasFormula = readCell(checksWs.getCell(`D${CHECK_ROWS.modelCheck}`)).hasFormula;
  }

  return {
    caseId, caseVersion, variant, sheets, missingSheets, cells, missingNames,
    errorCells, checkResults, compsFilled, sensitivityFilled,
    targets, dcfCells, checkFormulas, modelCheckHasFormula,
    noCachedResults: formulaCount > 3 && cachedCount === 0,
  };
}
