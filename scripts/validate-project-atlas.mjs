#!/usr/bin/env node --experimental-strip-types
// ─── Validation des classeurs Project Atlas ─────────────────────────────────
// Vérifie que les fichiers générés sont exploitables ET que le grader les note
// comme attendu : Solution ≈ 100, Starter très bas.
//
//   npm run validate:atlas

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import {
  ATLAS_CASE_ID, ATLAS_CASE_VERSION, ATLAS_SHEETS, ATLAS_NAMED_RANGES,
  computeAtlasExpected, withinTolerance,
} from "../src/data/projectAtlas.ts";
import { parseAtlasWorkbook } from "../src/lib/atlasWorkbook.ts";
import { gradeAtlas, evaluateAtlasCertification } from "../src/lib/atlasGrader.ts";
import { allGradeTargets, peerTargets, statTargets, sensitivityTargets, summaryTargets } from "../src/data/projectAtlas.ts";
import { SUMMARY_CELLS } from "../src/data/projectAtlasLayout.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIR = resolve(__dirname, "../public/project-atlas");
const STARTER = resolve(DIR, "Project_Atlas_Model_Starter.xlsx");
const SOLUTION = resolve(DIR, "Project_Atlas_Model_Solution.xlsx");

let failures = 0;
const ok = (msg) => console.log(`  ✓ ${msg}`);
const fail = (msg, detail) => { failures++; console.log(`  ✗ ${msg}${detail ? `\n      ${detail}` : ""}`); };
const check = (cond, msg, detail) => (cond ? ok(msg) : fail(msg, detail));

const toArrayBuffer = (path) => {
  const b = readFileSync(path);
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
};

async function main() {
  console.log("\nPROJECT ATLAS — validation des classeurs\n");

  console.log("Fichiers");
  check(existsSync(STARTER), "Project_Atlas_Model_Starter.xlsx existe");
  check(existsSync(SOLUTION), "Project_Atlas_Model_Solution.xlsx existe");
  if (failures) { console.log("\nGénère les classeurs avec `npm run generate:atlas`.\n"); process.exit(1); }

  const E = computeAtlasExpected();
  const parsedSol = await parseAtlasWorkbook(toArrayBuffer(SOLUTION));
  const parsedSta = await parseAtlasWorkbook(toArrayBuffer(STARTER));

  console.log("\nStructure (Solution)");
  check(parsedSol.caseId === ATLAS_CASE_ID, `case_id = ${ATLAS_CASE_ID}`);
  check(parsedSol.caseVersion === ATLAS_CASE_VERSION, `case_version = ${ATLAS_CASE_VERSION}`);
  check(parsedSol.missingSheets.length === 0, `les ${ATLAS_SHEETS.length} onglets requis sont présents`,
    parsedSol.missingSheets.join(", "));
  check(parsedSol.missingNames.length === 0, `les ${ATLAS_NAMED_RANGES.length} noms définis sont présents`,
    parsedSol.missingNames.join(", "));
  check(parsedSol.errorCells.length === 0, "aucune cellule en erreur",
    parsedSol.errorCells.slice(0, 5).map((e) => `${e.sheet}!${e.address} ${e.error}`).join(", "));

  console.log("\nValeurs de la Solution — couverture complète");
  const groups = [
    ["64 calculs de comparables", peerTargets(E)],
    ["30 statistiques", statTargets(E)],
    ["25 valeurs de sensibilité", sensitivityTargets(E)],
    ["8 sorties de synthèse", summaryTargets(E)],
  ];
  for (const [label, targets] of groups) {
    const wrong = targets.filter((t) => {
      const r = parsedSol.targets[t.id];
      return !(r?.value != null && withinTolerance(r.value, t.expected, t.kind));
    });
    check(wrong.length === 0, `${label} : toutes justes`,
      wrong.slice(0, 3).map((t) => `${t.cell} ${t.label}`).join(" · "));
  }
  const core = allGradeTargets(E).filter((t) => ["compsImplied", "dcfCore"].includes(t.group));
  for (const t of core) {
    const r = parsedSol.targets[t.id];
    const good = r?.value != null && withinTolerance(r.value, t.expected, t.kind);
    check(good, t.label, good ? "" : `trouvé : ${r?.value ?? r?.error ?? "vide"}`);
  }

  console.log("\nIntégrité de la Solution");
  const solFormulas = ATLAS_NAMED_RANGES.filter((n) => parsedSol.cells[n]?.hasFormula).length;
  check(solFormulas >= 16, `${solFormulas} sorties clés portent une formule (≥ 16 attendues)`);

  const summaryLinked = summaryTargets(E).filter((t) => parsedSol.targets[t.id]?.hasFormula).length;
  check(summaryLinked === SUMMARY_CELLS.length,
    `Valuation_Summary entièrement lié (${summaryLinked}/${SUMMARY_CELLS.length} formules)`,
    "des sorties de synthèse sont saisies en dur");

  const peerLinked = peerTargets(E).filter((t) => parsedSol.targets[t.id]?.hasFormula).length;
  check(peerLinked === 64, `les 64 calculs de comparables sont des formules (${peerLinked}/64)`);

  const statLinked = statTargets(E).filter((t) => parsedSol.targets[t.id]?.hasFormula).length;
  check(statLinked === 30, `les 30 statistiques sont des formules (${statLinked}/30)`);

  check(parsedSol.modelCheckHasFormula, "MODEL CHECK est piloté par une formule");
  check(parsedSol.checkFormulas.filter(Boolean).length >= 8,
    `les contrôles sont dynamiques (${parsedSol.checkFormulas.filter(Boolean).length}/10 formules)`);
  check((parsedSol.cells["ATLAS_MODEL_CHECK"]?.text ?? "").toUpperCase().includes("OK"),
    "MODEL CHECK = OK",
    `trouvé : ${parsedSol.cells["ATLAS_MODEL_CHECK"]?.text ?? "vide"}`);
  check(parsedSol.compsFilled === 64, `tableau de comps complet (${parsedSol.compsFilled}/64)`);
  check(parsedSol.sensitivityFilled === 25, `sensibilité complète (${parsedSol.sensitivityFilled}/25)`);

  console.log("\nLe Starter est bien incomplet");
  check(parsedSta.caseId === ATLAS_CASE_ID, "le Starter porte le bon case_id");
  check(parsedSta.missingSheets.length === 0, "le Starter contient tous les onglets");
  check(parsedSta.compsFilled < 20, `tableau de comps à compléter (${parsedSta.compsFilled}/64 pré-remplies)`);
  check(parsedSta.sensitivityFilled === 0, `sensibilité vide (${parsedSta.sensitivityFilled}/25)`);
  const staFilled = ATLAS_NAMED_RANGES.filter((n) => parsedSta.cells[n]?.value != null).length;
  check(staFilled === 0, `aucune sortie clé pré-remplie (${staFilled}/${ATLAS_NAMED_RANGES.length})`);
  const staSolved = allGradeTargets(E).filter((t) => {
    const r = parsedSta.targets[t.id];
    return r?.value != null && withinTolerance(r.value, t.expected, t.kind);
  });
  check(staSolved.length === 0, `le Starter n'est pas résolu (${staSolved.length} cellule(s) déjà justes)`,
    staSolved.slice(0, 3).map((t) => t.cell).join(", "));

  console.log("\nNotation");
  const solScore = gradeAtlas(parsedSol, { durationSeconds: 60 * 60 });
  const staScore = gradeAtlas(parsedSta, { durationSeconds: 60 * 60 });
  console.log(`  Solution : ${solScore.total}/100  (précision ${solScore.accuracy}/45 · formules ${solScore.integrity}/20 · complétion ${solScore.completion}/15 · QC ${solScore.qc}/10 · vitesse ${solScore.speed}/10) — « ${solScore.rating} »`);
  console.log(`  Starter  : ${staScore.total}/100  (précision ${staScore.accuracy}/45 · formules ${staScore.integrity}/20 · complétion ${staScore.completion}/15 · QC ${staScore.qc}/10 · vitesse ${staScore.speed}/10) — « ${staScore.rating} »`);
  check(solScore.total >= 95, `la Solution obtient au moins 95 (obtenu : ${solScore.total})`);
  check(solScore.issues.length === 0, "la Solution ne remonte aucun problème",
    solScore.issues.slice(0, 3).map((i) => i.title).join(" · "));
  check(staScore.total <= 35, `le Starter reste sous 35 (obtenu : ${staScore.total})`);
  check(staScore.total < solScore.total - 55, "l'écart Solution / Starter est net");
  const solCert = evaluateAtlasCertification(solScore, { assisted: false });
  const staCert = evaluateAtlasCertification(staScore, { assisted: false });
  check(solCert.eligible, "la Solution est certifiable en tentative libre", solCert.blockers.join(" · "));
  check(!staCert.eligible, "le Starter n'est pas certifiable");
  const assistedCert = evaluateAtlasCertification(solScore, { assisted: true });
  check(!assistedCert.eligible, "même parfaite, une tentative assistée n'est pas certifiée");

  console.log("\nRejet d'une version obsolète");
  try {
    const { Workbook } = (await import("exceljs")).default ?? (await import("exceljs"));
    const old = new Workbook();
    await old.xlsx.load(toArrayBuffer(SOLUTION));
    old.getWorksheet("_LAB_META").getCell("B2").value = "0.9.0";
    await parseAtlasWorkbook(await old.xlsx.writeBuffer());
    fail("une version de cas obsolète devrait être rejetée");
  } catch (e) {
    check(e?.name === "AtlasParseError" && /version/i.test(e.message),
      "une version de cas obsolète est rejetée avec un message clair", e?.message);
  }

  console.log("\nRejet d'un fichier étranger");
  try {
    const { Workbook } = (await import("exceljs")).default ?? (await import("exceljs"));
    const foreign = new Workbook();
    foreign.addWorksheet("Feuil1").getCell("A1").value = "rien à voir";
    const buf = await foreign.xlsx.writeBuffer();
    await parseAtlasWorkbook(buf);
    fail("un classeur non-Atlas devrait être rejeté");
  } catch (e) {
    check(e?.name === "AtlasParseError", "un classeur non-Atlas est rejeté avec un message clair",
      e?.message);
  }

  console.log(`\n${failures === 0 ? "✓ Validation réussie." : `✗ ${failures} contrôle(s) en échec.`}\n`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => { console.error(e); process.exit(1); });
