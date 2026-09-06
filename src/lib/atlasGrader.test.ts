import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import ExcelJS from "exceljs";
import { parseAtlasWorkbook, AtlasParseError, type ParsedAtlas } from "./atlasWorkbook";
import { gradeAtlas, speedScore, buildAccuracyChecks } from "./atlasGrader";
import { computeAtlasExpected } from "../data/projectAtlas";

const DIR = resolve(process.cwd(), "public/project-atlas");
const SOLUTION = resolve(DIR, "Project_Atlas_Model_Solution.xlsx");
const STARTER = resolve(DIR, "Project_Atlas_Model_Starter.xlsx");

const buf = (p: string) => {
  const b = readFileSync(p);
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer;
};

/** Charge la Solution puis applique une mutation avant de re-sérialiser. */
async function mutatedSolution(mutate: (wb: ExcelJS.Workbook) => void | Promise<void>): Promise<ParsedAtlas> {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buf(SOLUTION));
  await mutate(wb);
  const out = await wb.xlsx.writeBuffer();
  return parseAtlasWorkbook(out as ArrayBuffer);
}

const HOUR = { durationSeconds: 3600 };

describe("Grader Atlas — classeurs de référence", () => {
  beforeAll(() => {
    if (!existsSync(SOLUTION) || !existsSync(STARTER))
      throw new Error("Classeurs absents : lance `npm run generate:atlas`.");
  });

  it("la Solution obtient un score très élevé", async () => {
    const p = await parseAtlasWorkbook(buf(SOLUTION));
    const s = gradeAtlas(p, HOUR);
    expect(s.total).toBeGreaterThanOrEqual(95);
    expect(s.accuracy).toBe(45);
    expect(s.integrity).toBe(20);
    expect(s.rating).toBe("Associate-ready");
    expect(s.issues).toHaveLength(0);
  });

  it("le Starter obtient un score très bas", async () => {
    const p = await parseAtlasWorkbook(buf(STARTER));
    const s = gradeAtlas(p, HOUR);
    expect(s.total).toBeLessThanOrEqual(35);
    expect(s.accuracy).toBe(0);
    expect(s.rating).toBe("Modèle à reconstruire");
    expect(s.issues.length).toBeGreaterThan(3);
  });

  it("toutes les sorties de la Solution tombent dans les tolérances", async () => {
    const p = await parseAtlasWorkbook(buf(SOLUTION));
    const s = gradeAtlas(p, HOUR);
    expect(s.correctCells).toBe(s.checkedCells);
    expect(s.checkedCells).toBe(buildAccuracyChecks().length);
  });
});

describe("Grader Atlas — rejets et robustesse", () => {
  it("rejette un classeur qui n'est pas Atlas", async () => {
    const wb = new ExcelJS.Workbook();
    wb.addWorksheet("Feuil1").getCell("A1").value = "budget vacances";
    const out = await wb.xlsx.writeBuffer();
    await expect(parseAtlasWorkbook(out as ArrayBuffer)).rejects.toBeInstanceOf(AtlasParseError);
  });

  it("rejette un fichier qui n'est pas un classeur", async () => {
    const junk = new TextEncoder().encode("ceci n'est pas un xlsx");
    await expect(parseAtlasWorkbook(junk.buffer as ArrayBuffer)).rejects.toBeInstanceOf(AtlasParseError);
  });

  it("signale un onglet manquant sans planter", async () => {
    const p = await mutatedSolution((wb) => { wb.removeWorksheet(wb.getWorksheet("DCF")!.id); });
    expect(p.missingSheets).toContain("DCF");
    const s = gradeAtlas(p, HOUR);
    expect(s.issues.some((i) => i.area === "Structure" && i.title.includes("DCF"))).toBe(true);
    expect(s.total).toBeLessThan(70);
  });
});

describe("Grader Atlas — intégrité des formules", () => {
  it("une valeur juste saisie en dur rapporte moins qu'une formule", async () => {
    const E = computeAtlasExpected();
    const p = await mutatedSolution((wb) => {
      // On remplace la formule du prix DCF par sa valeur exacte
      wb.getWorksheet("DCF")!.getCell("D49").value = E.dcf.pricePerShare;
      wb.getWorksheet("Trading_Comps")!.getCell("D31").value = E.comps.impliedPrice;
    });
    const hard = gradeAtlas(p, HOUR);
    const clean = gradeAtlas(await parseAtlasWorkbook(buf(SOLUTION)), HOUR);

    // La précision reste identique : les chiffres sont bons
    expect(hard.accuracy).toBe(clean.accuracy);
    // Mais l'intégrité baisse, et le grader le dit
    expect(hard.integrity).toBeLessThan(clean.integrity);
    expect(hard.issues.some((i) => i.tag === "Formula Integrity")).toBe(true);
    expect(hard.comments.some((c) => c.includes("en dur"))).toBe(true);
  });
});

describe("Grader Atlas — contrôle qualité", () => {
  it("un MODEL CHECK en échec fait chuter la note de QC", async () => {
    const p = await mutatedSolution((wb) => {
      wb.getWorksheet("Checks")!.getCell("D18").value = { formula: 'IF(AND(D6:D15),"OK","À CORRIGER")', result: "À CORRIGER" };
    });
    const broken = gradeAtlas(p, HOUR);
    const clean = gradeAtlas(await parseAtlasWorkbook(buf(SOLUTION)), HOUR);
    expect(broken.qc).toBeLessThan(clean.qc);
    expect(broken.issues.some((i) => i.title.includes("MODEL CHECK"))).toBe(true);
    expect(broken.comments.some((c) => c.includes("model check"))).toBe(true);
  });

  it("une erreur Excel est détectée et sanctionnée", async () => {
    const p = await mutatedSolution((wb) => {
      wb.getWorksheet("DCF")!.getCell("D42").value = { formula: "D40+D41", result: { error: "#REF!" } as never };
    });
    expect(p.errorCells.some((e) => e.error === "#REF!")).toBe(true);
    const s = gradeAtlas(p, HOUR);
    expect(s.issues.some((i) => i.title.includes("erreur"))).toBe(true);
    expect(s.qc).toBeLessThan(10);
  });
});

describe("Grader Atlas — vitesse", () => {
  it("plein score sous la cible, dégressif au-delà, jamais négatif", () => {
    expect(speedScore(60 * 60)).toBe(10);
    expect(speedScore(90 * 60)).toBe(10);
    expect(speedScore(105 * 60)).toBe(9);
    expect(speedScore(180 * 60)).toBe(4);
    expect(speedScore(600 * 60)).toBe(0);
    expect(speedScore(0)).toBe(0);
  });

  it("la vitesse ne peut pas compenser une mauvaise précision", async () => {
    const starter = await parseAtlasWorkbook(buf(STARTER));
    const fast = gradeAtlas(starter, { durationSeconds: 60 });
    expect(fast.total).toBeLessThan(40); // 10 pts de vitesse ne sauvent pas un modèle vide
  });
});
