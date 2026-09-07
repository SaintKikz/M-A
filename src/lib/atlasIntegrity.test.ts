import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import ExcelJS from "exceljs";
import { parseAtlasWorkbook, type ParsedAtlas } from "./atlasWorkbook";
import { gradeAtlas, evaluateAtlasCertification } from "./atlasGrader";
import { computeAtlasExpected, allGradeTargets } from "../data/projectAtlas";
import { ATLAS_RAW_CELLS, DCF_ROWS, CHECK_ROWS } from "../data/projectAtlasLayout";

const SOLUTION = resolve(process.cwd(), "public/project-atlas/Project_Atlas_Model_Solution.xlsx");
const E = computeAtlasExpected();
const HOUR = { durationSeconds: 3600 };

const buf = (p: string) => {
  const b = readFileSync(p);
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer;
};

/** Mute la VRAIE Solution puis la repasse par parseur → grader → certification. */
async function mutated(mutate: (wb: ExcelJS.Workbook) => void): Promise<ParsedAtlas> {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buf(SOLUTION));
  mutate(wb);
  return parseAtlasWorkbook(await wb.xlsx.writeBuffer() as ArrayBuffer);
}

let solution: ParsedAtlas;
beforeAll(async () => { solution = await parseAtlasWorkbook(buf(SOLUTION)); });

// ═══════════════════════════════════════════════════════════════════════════
describe("[GOLDEN] la Solution utilise de VRAIES formules liées", () => {
  it("les sorties clés sont liées, pas constantes", () => {
    const targets = allGradeTargets(E).filter((t) => t.formulaExpected);
    const linked = targets.filter((t) => solution.targets[t.id]?.hasLinkedFormula).length;
    expect(linked).toBe(targets.length);
  });

  it("les contrôles du modèle sont pilotés par des formules liées", () => {
    expect(solution.modelCheckHasFormula).toBe(true);
    expect(solution.checkFormulas.filter(Boolean).length).toBeGreaterThanOrEqual(8);
  });

  it("elle reste certifiable avec les règles durcies", () => {
    const s = gradeAtlas(solution, HOUR);
    expect(s.total).toBeGreaterThanOrEqual(95);
    expect(s.integrity).toBeGreaterThanOrEqual(18);
    expect(evaluateAtlasCertification(s, { assisted: false }).eligible).toBe(true);
  });

  it("elle passe le QC sur ses PROPRES hypothèses", () => {
    const s = gradeAtlas(solution, HOUR);
    expect(s.qcRules.find((r) => r.id === "growthLtWacc")?.passed).toBe(true);
    expect(s.qcRules.find((r) => r.id === "dilutedShares")?.passed).toBe(true);
    expect(solution.modelInputs.terminalGrowth.value).toBeCloseTo(0.025, 4);
    expect(solution.modelInputs.dilutedShares.value).toBeCloseTo(48.6, 2);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe("[F/G] fausses formules dans un vrai classeur", () => {
  it("[F] des =33.12 justes perdent le crédit d'intégrité", async () => {
    const keys = allGradeTargets(E).filter((t) => t.group === "peers").slice(0, 20);
    const p = await mutated((wb) => {
      const ws = wb.getWorksheet("Trading_Comps")!;
      for (const t of keys) ws.getCell(t.cell).value = { formula: String(t.expected), result: t.expected };
    });
    const hard = gradeAtlas(p, HOUR);
    const clean = gradeAtlas(solution, HOUR);

    // Les valeurs restent justes…
    expect(hard.groupStats.peers.correct).toBe(64);
    expect(hard.accuracy).toBe(clean.accuracy);
    // …mais rien n'est lié : l'intégrité tombe
    expect(hard.integrity).toBeLessThan(clean.integrity);
    expect(hard.issues.some((i) => i.title.includes("formule(s) constante(s)"))).toBe(true);
  });

  it("[G] un classeur massivement constant ne peut pas être certifié", async () => {
    const all = allGradeTargets(E).filter((t) => t.formulaExpected);
    const p = await mutated((wb) => {
      for (const t of all) {
        const ws = wb.getWorksheet(t.sheet);
        if (ws) ws.getCell(t.cell).value = { formula: String(t.expected), result: t.expected };
      }
    });
    const s = gradeAtlas(p, HOUR);
    expect(s.correctCells).toBe(s.checkedCells);          // tout est juste
    expect(s.integrity).toBeLessThan(18);                 // mais rien n'est lié
    expect(s.certifiable).toBe(false);
    expect(evaluateAtlasCertification(s, { assisted: false }).eligible).toBe(false);
    expect(s.blockers.some((b) => /intégrité/i.test(b))).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe("[H] des Checks en fausses formules ne trompent pas le QC", () => {
  it("=TRUE et =\"OK\" échouent l'intégrité dynamique", async () => {
    const p = await mutated((wb) => {
      const ck = wb.getWorksheet("Checks")!;
      for (let r = CHECK_ROWS.first; r <= CHECK_ROWS.last; r++)
        ck.getCell(`D${r}`).value = { formula: "TRUE", result: true };
      ck.getCell(`D${CHECK_ROWS.modelCheck}`).value = { formula: '"OK"', result: "OK" };
    });
    expect(p.modelCheckHasFormula).toBe(false);       // formule, mais constante
    expect(p.checkFormulas.filter(Boolean).length).toBe(0);
    const s = gradeAtlas(p, HOUR);
    expect(s.qcRules.find((r) => r.id === "checksDynamic")?.passed).toBe(false);
    expect(s.qc).toBeLessThan(10);
    expect(evaluateAtlasCertification(s, { assisted: false }).eligible).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe("[P/Q/R] QC sur les valeurs RÉELLEMENT soumises", () => {
  /** Falsifie l'onglet Checks pour prouver qu'il n'a aucune influence. */
  const fakeChecks = (wb: ExcelJS.Workbook) => {
    const ck = wb.getWorksheet("Checks")!;
    for (let r = CHECK_ROWS.first; r <= CHECK_ROWS.last; r++)
      ck.getCell(`D${r}`).value = { formula: "TRUE", result: true };
    ck.getCell(`D${CHECK_ROWS.modelCheck}`).value = { formula: '"OK"', result: "OK" };
  };

  it("[P] g >= WACC échoue, même avec des Checks au vert", async () => {
    const p = await mutated((wb) => {
      wb.getWorksheet("DCF")!.getCell(`D${DCF_ROWS.growthRate}`).value = 0.12; // > WACC 8,45%
      fakeChecks(wb);
    });
    expect(p.modelInputs.terminalGrowth.value).toBeCloseTo(0.12, 4);
    const s = gradeAtlas(p, HOUR);
    const rule = s.qcRules.find((r) => r.id === "growthLtWacc")!;
    expect(rule.passed).toBe(false);
    expect(rule.detail).toMatch(/inférieur au WACC/);
    expect(evaluateAtlasCertification(s, { assisted: false }).eligible).toBe(false);
  });

  it("[P bis] un g vide échoue aussi", async () => {
    const p = await mutated((wb) => {
      wb.getWorksheet("DCF")!.getCell(`D${DCF_ROWS.growthRate}`).value = null;
    });
    expect(gradeAtlas(p, HOUR).qcRules.find((r) => r.id === "growthLtWacc")?.passed).toBe(false);
  });

  it("[Q] des actions diluées à 0 échouent, même avec des Checks au vert", async () => {
    const p = await mutated((wb) => {
      wb.getWorksheet("Atlas_Raw")!.getCell(ATLAS_RAW_CELLS.dilutedShares).value = 0;
      fakeChecks(wb);
    });
    expect(p.modelInputs.dilutedShares.value).toBe(0);
    const s = gradeAtlas(p, HOUR);
    expect(s.qcRules.find((r) => r.id === "dilutedShares")?.passed).toBe(false);
    expect(evaluateAtlasCertification(s, { assisted: false }).eligible).toBe(false);
  });

  it("[Q bis] des actions négatives ou textuelles échouent", async () => {
    for (const bad of [-10, "n.a."]) {
      const p = await mutated((wb) => {
        wb.getWorksheet("Atlas_Raw")!.getCell(ATLAS_RAW_CELLS.dilutedShares).value = bad as never;
      });
      expect(gradeAtlas(p, HOUR).qcRules.find((r) => r.id === "dilutedShares")?.passed,
        `valeur ${bad}`).toBe(false);
    }
  });

  it("[R] falsification combinée : g > WACC + actions 0 + Checks truqués", async () => {
    const p = await mutated((wb) => {
      wb.getWorksheet("DCF")!.getCell(`D${DCF_ROWS.growthRate}`).value = 0.15;
      wb.getWorksheet("Atlas_Raw")!.getCell(ATLAS_RAW_CELLS.dilutedShares).value = 0;
      fakeChecks(wb);
    });
    const s = gradeAtlas(p, HOUR);
    expect(s.qcRules.find((r) => r.id === "growthLtWacc")?.passed).toBe(false);
    expect(s.qcRules.find((r) => r.id === "dilutedShares")?.passed).toBe(false);
    expect(s.qcRules.find((r) => r.id === "checksDynamic")?.passed).toBe(false);
    expect(s.total).toBeLessThan(90);
    expect(evaluateAtlasCertification(s, { assisted: false }).eligible).toBe(false);
  });
});
