import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import ExcelJS from "exceljs";
import { parseAtlasWorkbook, AtlasParseError, type ParsedAtlas } from "./atlasWorkbook";
import { gradeAtlas, evaluateAtlasCertification, speedScore } from "./atlasGrader";
import { computeAtlasExpected, allGradeTargets, ATLAS_CASE_VERSION } from "../data/projectAtlas";
import { SUMMARY_CELLS, SENS, peerCell, statCell } from "../data/projectAtlasLayout";

const DIR = resolve(process.cwd(), "public/project-atlas");
const SOLUTION = resolve(DIR, "Project_Atlas_Model_Solution.xlsx");
const STARTER = resolve(DIR, "Project_Atlas_Model_Starter.xlsx");
const E = computeAtlasExpected();
const HOUR = { durationSeconds: 3600 };

const buf = (p: string) => {
  const b = readFileSync(p);
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer;
};

/** Charge la Solution, applique une mutation, re-sérialise et reparse. */
async function mutated(mutate: (wb: ExcelJS.Workbook) => void | Promise<void>): Promise<ParsedAtlas> {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buf(SOLUTION));
  await mutate(wb);
  return parseAtlasWorkbook(await wb.xlsx.writeBuffer() as ArrayBuffer);
}

let solution: ParsedAtlas, starter: ParsedAtlas;
beforeAll(async () => {
  if (!existsSync(SOLUTION) || !existsSync(STARTER))
    throw new Error("Classeurs absents : lance `npm run generate:atlas`.");
  solution = await parseAtlasWorkbook(buf(SOLUTION));
  starter = await parseAtlasWorkbook(buf(STARTER));
});

// ═══════════════════════════════════════════════════════════════════════════
describe("Classeurs de référence", () => {
  it("[GOLDEN] la Solution obtient 100 et est certifiable", () => {
    const s = gradeAtlas(solution, HOUR);
    expect(s.total).toBeGreaterThanOrEqual(95);
    expect(s.accuracy).toBe(45);
    expect(s.integrity).toBe(20);
    expect(s.qc).toBe(10);
    expect(s.issues).toHaveLength(0);
    expect(s.certifiable).toBe(true);
    expect(evaluateAtlasCertification(s, { assisted: false }).eligible).toBe(true);
    expect(s.rating).toBe("Associate-ready");
  });

  it("[GOLDEN] les 141 cellules sont notées et toutes justes dans la Solution", () => {
    const s = gradeAtlas(solution, HOUR);
    expect(s.checkedCells).toBe(allGradeTargets().length);
    expect(s.correctCells).toBe(s.checkedCells);
    expect(s.groupStats.peers).toEqual({ correct: 64, total: 64 });
    expect(s.groupStats.stats).toEqual({ correct: 30, total: 30 });
    expect(s.groupStats.sensitivity).toEqual({ correct: 25, total: 25 });
    expect(s.groupStats.summary).toEqual({ correct: 8, total: 8 });
  });

  it("[GOLDEN] le Starter reste incomplet et non certifiable", () => {
    const s = gradeAtlas(starter, HOUR);
    expect(s.total).toBeLessThanOrEqual(35);
    expect(s.accuracy).toBe(0);
    expect(s.certifiable).toBe(false);
    expect(evaluateAtlasCertification(s, { assisted: false }).eligible).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe("Trading comps — les 64 cellules sont réellement notées", () => {
  it("[A] corrompre plusieurs EV de peers fait chuter la précision", async () => {
    const p = await mutated((wb) => {
      const ws = wb.getWorksheet("Trading_Comps")!;
      for (const i of [1, 2, 4]) ws.getCell(peerCell(i, "ev")).value = 999;
    });
    const s = gradeAtlas(p, HOUR);
    const clean = gradeAtlas(solution, HOUR);
    expect(s.groupStats.peers.correct).toBeLessThan(clean.groupStats.peers.correct);
    expect(s.accuracy).toBeLessThan(clean.accuracy);
    expect(s.issues.some((i) => i.title.includes("comparable"))).toBe(true);
  });

  it("[B] Nova juste mais les 7 autres faux ne donne pas un score élevé", async () => {
    const p = await mutated((wb) => {
      const ws = wb.getWorksheet("Trading_Comps")!;
      for (let i = 1; i < 8; i++)
        for (const f of ["marketCap", "ev", "evEbitda26", "evEbitda27", "evRevenue26", "evRevenue27", "evEbit26", "evEbit27"] as const)
          ws.getCell(peerCell(i, f)).value = 1;
    });
    const s = gradeAtlas(p, HOUR);
    expect(s.groupStats.peers.correct).toBeLessThanOrEqual(8);
    expect(s.total).toBeLessThan(90);
    expect(evaluateAtlasCertification(s, { assisted: false }).eligible).toBe(false);
  });

  it("[C] 64 valeurs justes en dur : précision conservée, intégrité dégradée", async () => {
    const targets = allGradeTargets(E).filter((t) => t.group === "peers");
    const p = await mutated((wb) => {
      const ws = wb.getWorksheet("Trading_Comps")!;
      for (const t of targets) ws.getCell(t.cell).value = t.expected;
    });
    const hard = gradeAtlas(p, HOUR);
    const clean = gradeAtlas(solution, HOUR);
    expect(hard.groupStats.peers.correct).toBe(64);   // les chiffres sont bons
    expect(hard.accuracy).toBe(clean.accuracy);
    expect(hard.integrity).toBeLessThan(clean.integrity); // mais rien n'est lié
    expect(hard.issues.some((i) => i.tag === "Formula Integrity")).toBe(true);
  });
});

describe("Statistiques — les 30 cellules sont réellement notées", () => {
  it("[D] corrompre des statistiques est détecté même si les peers sont justes", async () => {
    const p = await mutated((wb) => {
      const ws = wb.getWorksheet("Trading_Comps")!;
      ws.getCell(statCell("q3", "evEbitda27")).value = 42;
      ws.getCell(statCell("min", "evRevenue26")).value = 42;
      ws.getCell(statCell("max", "evEbit27")).value = 42;
    });
    const s = gradeAtlas(p, HOUR);
    expect(s.groupStats.peers.correct).toBe(64);      // les peers restent bons
    expect(s.groupStats.stats.correct).toBe(27);      // 3 statistiques fausses
    expect(s.issues.some((i) => i.title.includes("statistique"))).toBe(true);
    expect(s.certifiable).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe("Sensibilité — les 25 valeurs sont réellement notées", () => {
  it("[E] remplir la grille de nombres arbitraires ne passe pas", async () => {
    const p = await mutated((wb) => {
      const ws = wb.getWorksheet("DCF")!;
      for (let i = 0; i < SENS.rowCount; i++)
        for (let j = 0; j < SENS.cols.length; j++)
          ws.getCell(`${SENS.cols[j]}${SENS.firstDataRow + i}`).value = 30 + i + j;
    });
    const s = gradeAtlas(p, HOUR);
    expect(p.sensitivityFilled).toBe(25);              // la complétion est là
    expect(s.groupStats.sensitivity.correct).toBeLessThan(10); // mais les valeurs sont fausses
    expect(s.issues.some((i) => i.title.includes("sensibilité"))).toBe(true);
    expect(evaluateAtlasCertification(s, { assisted: false }).eligible).toBe(false);
  });

  it("[F] une seule cellule fausse ne casse pas tout le modèle", async () => {
    const p = await mutated((wb) => {
      wb.getWorksheet("DCF")!.getCell(`${SENS.cols[2]}${SENS.firstDataRow + 2}`).value = 99;
    });
    const s = gradeAtlas(p, HOUR);
    expect(s.groupStats.sensitivity.correct).toBe(24);
    expect(s.total).toBeGreaterThan(85);   // le reste du modèle tient
    expect(s.certifiable).toBe(false);     // mais ce n'est plus certifiable
  });

  it("[G] la grille correcte reçoit tout le crédit", () => {
    expect(gradeAtlas(solution, HOUR).groupStats.sensitivity).toEqual({ correct: 25, total: 25 });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe("Valuation Summary", () => {
  it("[H] une synthèse vide fait chuter précision ET complétion", async () => {
    const p = await mutated((wb) => {
      const ws = wb.getWorksheet("Valuation_Summary")!;
      for (const c of SUMMARY_CELLS) ws.getCell(c.cell).value = null;
    });
    const s = gradeAtlas(p, HOUR);
    const clean = gradeAtlas(solution, HOUR);
    expect(s.groupStats.summary.correct).toBe(0);
    expect(s.completion).toBeLessThan(clean.completion);
    expect(s.issues.some((i) => i.title.includes("Synthèse de valorisation vide"))).toBe(true);
    expect(evaluateAtlasCertification(s, { assisted: false }).eligible).toBe(false);
  });

  it("[I] une synthèse juste mais en dur perd de l'intégrité", async () => {
    const p = await mutated((wb) => {
      const ws = wb.getWorksheet("Valuation_Summary")!;
      for (const c of SUMMARY_CELLS) ws.getCell(c.cell).value = E.summary[c.key];
    });
    const s = gradeAtlas(p, HOUR);
    const clean = gradeAtlas(solution, HOUR);
    expect(s.groupStats.summary.correct).toBe(8);
    expect(s.integrity).toBeLessThan(clean.integrity);
  });

  it("[K] la Solution a bien des FORMULES dans la synthèse, pas des nombres", async () => {
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(buf(SOLUTION));
    const ws = wb.getWorksheet("Valuation_Summary")!;
    for (const c of SUMMARY_CELLS) {
      const v = ws.getCell(c.cell).value as { formula?: string } | null;
      expect(v, `${c.cell} vide`).toBeTruthy();
      expect(typeof v === "object" && "formula" in v!, `${c.cell} n'est pas une formule`).toBe(true);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe("QC — l'onglet Checks de l'utilisateur ne fait pas foi", () => {
  it("[L] un modèle cassé + Checks falsifiés reste détecté", async () => {
    const p = await mutated((wb) => {
      const dcf = wb.getWorksheet("DCF")!;
      dcf.getCell("D42").value = 1;   // EV du DCF cassée
      dcf.getCell("D47").value = 1;   // equity cassée
      dcf.getCell("D49").value = 1;   // prix cassé
      const ck = wb.getWorksheet("Checks")!;
      for (let r = 6; r <= 15; r++) ck.getCell(`D${r}`).value = true;   // TRUE en dur
      ck.getCell("D18").value = "OK";                                    // OK en dur
    });
    const s = gradeAtlas(p, HOUR);
    expect(s.qc).toBeLessThan(10);
    expect(s.qcRules.find((r) => r.id === "dcfBridge")?.passed).toBe(false);
    expect(s.qcRules.find((r) => r.id === "checksDynamic")?.passed).toBe(false);
    expect(s.total).toBeLessThan(90);
    expect(evaluateAtlasCertification(s, { assisted: false }).eligible).toBe(false);
  });

  it("[M] des Checks en dur sur un modèle juste déclenchent quand même l'alerte", async () => {
    const p = await mutated((wb) => {
      const ck = wb.getWorksheet("Checks")!;
      for (let r = 6; r <= 15; r++) ck.getCell(`D${r}`).value = true;
      ck.getCell("D18").value = "OK";
    });
    const s = gradeAtlas(p, HOUR);
    expect(s.qcRules.find((r) => r.id === "checksDynamic")?.passed).toBe(false);
    expect(s.qc).toBeLessThan(10);
    expect(s.issues.some((i) => i.title.includes("saisis en dur"))).toBe(true);
    expect(s.certifiable).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe("Structure — les plafonds de score", () => {
  const removeSheet = (name: string) => async (wb: ExcelJS.Workbook) => {
    wb.removeWorksheet(wb.getWorksheet(name)!.id);
  };

  it("[N] sans l'onglet DCF, impossible d'être Associate-ready", async () => {
    const s = gradeAtlas(await mutated(removeSheet("DCF")), HOUR);
    expect(s.total).toBeLessThanOrEqual(59);
    expect(s.cap).not.toBeNull();
    expect(evaluateAtlasCertification(s, { assisted: false }).eligible).toBe(false);
  });

  it("[O] sans Valuation_Summary, impossible d'être Associate-ready", async () => {
    const s = gradeAtlas(await mutated(removeSheet("Valuation_Summary")), HOUR);
    expect(s.total).toBeLessThanOrEqual(59);
    expect(evaluateAtlasCertification(s, { assisted: false }).eligible).toBe(false);
  });

  it("[P] sans Checks, impossible d'être Associate-ready", async () => {
    const s = gradeAtlas(await mutated(removeSheet("Checks")), HOUR);
    expect(s.total).toBeLessThanOrEqual(59);
    expect(evaluateAtlasCertification(s, { assisted: false }).eligible).toBe(false);
  });

  it("[Q] plusieurs onglets manquants plafonnent encore plus bas", async () => {
    const s = gradeAtlas(await mutated(async (wb) => {
      await removeSheet("DCF")(wb);
      await removeSheet("Valuation_Summary")(wb);
    }), HOUR);
    expect(s.total).toBeLessThanOrEqual(40);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe("Version du cas", () => {
  it("[R] une version obsolète est rejetée", async () => {
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(buf(SOLUTION));
    wb.getWorksheet("_LAB_META")!.getCell("B2").value = "0.9.0";
    const out = await wb.xlsx.writeBuffer();
    await expect(parseAtlasWorkbook(out as ArrayBuffer)).rejects.toThrow(/version/i);
  });

  it("[S] la version courante est acceptée", () => {
    expect(solution.caseVersion).toBe(ATLAS_CASE_VERSION);
  });

  it("un classeur étranger est rejeté", async () => {
    const wb = new ExcelJS.Workbook();
    wb.addWorksheet("Feuil1").getCell("A1").value = "budget vacances";
    await expect(parseAtlasWorkbook(await wb.xlsx.writeBuffer() as ArrayBuffer))
      .rejects.toBeInstanceOf(AtlasParseError);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe("Vitesse", () => {
  it("plein score sous la cible, dégressif ensuite, jamais négatif", () => {
    expect(speedScore(60 * 60)).toBe(10);
    expect(speedScore(90 * 60)).toBe(10);
    expect(speedScore(105 * 60)).toBe(9);
    expect(speedScore(180 * 60)).toBe(4);
    expect(speedScore(600 * 60)).toBe(0);
  });

  it("la vitesse ne compense jamais un modèle vide", () => {
    expect(gradeAtlas(starter, { durationSeconds: 60 }).total).toBeLessThan(40);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
describe("[ADVERSARIAL] le raccourci complet est bloqué", () => {
  it("peers cassés + sensibilité aléatoire + Summary vide + Checks falsifiés", async () => {
    const p = await mutated((wb) => {
      const tc = wb.getWorksheet("Trading_Comps")!;
      for (let i = 1; i < 8; i++) {
        tc.getCell(peerCell(i, "ev")).value = 500;
        tc.getCell(peerCell(i, "evEbitda27")).value = 9;
      }
      const dcf = wb.getWorksheet("DCF")!;
      for (let i = 0; i < SENS.rowCount; i++)
        for (let j = 0; j < SENS.cols.length; j++)
          dcf.getCell(`${SENS.cols[j]}${SENS.firstDataRow + i}`).value = 33;
      const vs = wb.getWorksheet("Valuation_Summary")!;
      for (const c of SUMMARY_CELLS) vs.getCell(c.cell).value = null;
      const ck = wb.getWorksheet("Checks")!;
      for (let r = 6; r <= 15; r++) ck.getCell(`D${r}`).value = true;
      ck.getCell("D18").value = "OK";
    });
    const s = gradeAtlas(p, HOUR);

    // Chaque catégorie de triche est attrapée
    expect(s.groupStats.peers.correct).toBeLessThan(60);
    expect(s.groupStats.sensitivity.correct).toBeLessThan(10);
    expect(s.groupStats.summary.correct).toBe(0);
    expect(s.qcRules.find((r) => r.id === "checksDynamic")?.passed).toBe(false);

    // Et le résultat global est franchement bas
    expect(s.total).toBeLessThan(70);
    expect(s.rating).not.toBe("Associate-ready");
    expect(evaluateAtlasCertification(s, { assisted: false }).eligible).toBe(false);
    expect(s.blockers.length).toBeGreaterThan(0);
  });
});
