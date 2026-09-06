import { describe, it, expect } from "vitest";
import { classifyFormula, formulaIsLinked } from "./atlasFormula";

const NAMES = ["ATLAS_WACC", "ATLAS_DCF_PRICE", "ATLAS_MODEL_CHECK"];

describe("Formules constantes — ne comptent PAS comme liées", () => {
  const constants = [
    "=33.12", "=1000", "=TRUE", "=FALSE", '="OK"', '="hello"',
    "=1+2", "=100/5", "=SUM(1,2)", "=IF(TRUE,33.12,0)", "=ROUND(33.12,2)",
    "=-0.5", "=2*3.14", "=CONCATENATE(\"A\",\"B\")",
  ];
  for (const f of constants) {
    it(`${f} n'est pas liée`, () => {
      const c = classifyFormula(f, NAMES);
      expect(c.linked, `${f} a été jugée liée (${c.reason})`).toBe(false);
      expect(c.reason).toBe("constant");
    });
  }
});

describe("Formules liées — comptent comme du vrai modèle", () => {
  const linked: [string, string][] = [
    ["=D49", "cell-reference"],
    ["=$D$49", "cell-reference"],
    ["=D$49", "cell-reference"],
    ["=$D49", "cell-reference"],
    ["=D16>D17", "cell-reference"],
    ["=SUM(D7:D14)", "cell-reference"],
    ["=AVERAGE(H7:H14)", "cell-reference"],
    ["=D7+E7-F7", "cell-reference"],
    ["=IF(D6,D7,D8)", "cell-reference"],
    ["=MEDIAN(H7:H14)", "cell-reference"],
    ["=Atlas_Raw!C21", "sheet-reference"],
    ["='Atlas_Raw'!C21", "sheet-reference"],
    ["='Atlas_Raw'!C21>0", "sheet-reference"],
    ["='Trading_Comps'!D32", "sheet-reference"],
    ["=MIN(DCF!D55:H59)", "sheet-reference"],
  ];
  for (const [f, reason] of linked) {
    it(`${f} est liée (${reason})`, () => {
      const c = classifyFormula(f, NAMES);
      expect(c.linked, `${f} jugée non liée`).toBe(true);
      expect(c.reason).toBe(reason);
    });
  }
});

describe("Noms définis", () => {
  it("=ATLAS_WACC est liée QUAND le nom existe dans le classeur", () => {
    expect(formulaIsLinked("=ATLAS_WACC", NAMES)).toBe(true);
    expect(classifyFormula("=ATLAS_WACC", NAMES).reason).toBe("defined-name");
  });
  it("=ATLAS_WACC n'est PAS liée si le classeur ne déclare pas ce nom", () => {
    expect(formulaIsLinked("=ATLAS_WACC", [])).toBe(false);
    expect(formulaIsLinked("=ATLAS_WACC", ["AUTRE_NOM"])).toBe(false);
  });
  it("un jeton alphabétique quelconque n'est pas pris pour un nom défini", () => {
    expect(formulaIsLinked("=MONTANT_TOTAL", NAMES)).toBe(false);
    expect(formulaIsLinked('="ATLAS_WACC"', NAMES)).toBe(false); // dans une chaîne
  });
});

describe("Les littéraux chaîne sont ignorés", () => {
  it('=IF(TRUE,"D49","C21") n\'est pas liée', () => {
    expect(formulaIsLinked('=IF(TRUE,"D49","C21")', NAMES)).toBe(false);
  });
  it('="Voir D49" n\'est pas liée', () => {
    expect(formulaIsLinked('="Voir D49"', NAMES)).toBe(false);
  });
  it('=IF(D6,"D49","")  reste liée grâce à D6, pas grâce à la chaîne', () => {
    expect(classifyFormula('=IF(D6,"D49","")', NAMES).reason).toBe("cell-reference");
  });
  it("gère les guillemets échappés sans planter", () => {
    expect(formulaIsLinked('="il a dit ""D49"""', NAMES)).toBe(false);
  });
});

describe("Entrées dégradées", () => {
  it("null, undefined et vide ne sont jamais liés", () => {
    for (const v of [null, undefined, "", "   ", "="]) {
      const c = classifyFormula(v as string, NAMES);
      expect(c.linked).toBe(false);
      expect(c.reason).toBe("unreadable");
    }
  });
  it("le signe = initial est optionnel", () => {
    expect(formulaIsLinked("D49", NAMES)).toBe(true);
    expect(formulaIsLinked("33.12", NAMES)).toBe(false);
  });
});
