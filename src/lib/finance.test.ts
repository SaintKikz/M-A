import { describe, it, expect } from "vitest";
import {
  evFromEquity, equityFromEv, dilutedShares, costOfEquityCapm, wacc,
  unleverBeta, releverBeta, npv, irr, cagr, terminalValueGordon,
  terminalValueExit, impliedGrowth, dcf, premium, mergerModel,
  moic, irrFromMoic, moicFromIrr, debtSchedule, lboReturns,
  purchasePriceAllocation, capitalizedSynergyValue, percentile, sampleStats,
} from "./finance";

describe("Bridge EV ↔ Equity", () => {
  it("EV = Equity + dette − cash + minoritaires", () => {
    expect(evFromEquity({ equityValue: 800, debt: 500, cash: 300, minorities: 50 })).toBe(1050);
  });
  it("déduit les associates et ajoute pension/leases", () => {
    expect(evFromEquity({ equityValue: 1000, debt: 200, cash: 100, associates: 80, pension: 30, leases: 50 })).toBe(1100);
  });
  it("equityFromEv est l'inverse exact de evFromEquity", () => {
    const b = { debt: 400, cash: 120, minorities: 25, preferred: 10, associates: 60 };
    const ev = evFromEquity({ equityValue: 900, ...b });
    expect(equityFromEv(ev, b)).toBeCloseTo(900, 10);
  });
});

describe("Actions diluées (TSM)", () => {
  it("options ITM : 100 base + 10 opts @50, cours 100 → 105", () => {
    expect(dilutedShares(100, 100, { options: [{ count: 10, strike: 50 }] })).toBeCloseTo(105);
  });
  it("options OTM ignorées", () => {
    expect(dilutedShares(100, 40, { options: [{ count: 10, strike: 50 }] })).toBe(100);
  });
  it("RSU dilution intégrale, convertible if-converted", () => {
    expect(dilutedShares(100, 60, { rsus: 5, convertibles: [{ faceValue: 300, conversionPrice: 50 }] })).toBeCloseTo(111);
  });
  it("rejette un cours ≤ 0", () => {
    expect(() => dilutedShares(100, 0)).toThrow();
  });
});

describe("Coût du capital", () => {
  it("CAPM : 3% + 1.2 × 5% = 9%", () => {
    expect(costOfEquityCapm(0.03, 1.2, 0.05)).toBeCloseTo(0.09);
  });
  it("WACC : 60/40, Ke 12%, Kd 5%, t 25% → 8.7%", () => {
    expect(wacc(60, 40, 0.12, 0.05, 0.25)).toBeCloseTo(0.087);
  });
  it("unlever puis relever au même D/E est neutre", () => {
    const bu = unleverBeta(1.4, 0.5, 0.25);
    expect(releverBeta(bu, 0.5, 0.25)).toBeCloseTo(1.4, 10);
  });
});

describe("NPV / IRR / CAGR", () => {
  it("npv : 110 dans 1 an à 10% = 100", () => {
    expect(npv(0.10, [110])).toBeCloseTo(100);
  });
  it("npv mid-year actualise moins (t − 0.5)", () => {
    expect(npv(0.10, [110], { midYear: true })).toBeCloseTo(110 / Math.pow(1.1, 0.5));
  });
  it("irr de [-100, 0, 121] = 10%", () => {
    expect(irr([-100, 0, 121])).toBeCloseTo(0.10, 5);
  });
  it("irr exige flux positifs et négatifs", () => {
    expect(() => irr([100, 50])).toThrow();
  });
  it("cagr : 100 → 200 en 5 ans ≈ 14.87%", () => {
    expect(cagr(100, 200, 5)).toBeCloseTo(0.1487, 3);
  });
});

describe("DCF & valeur terminale", () => {
  it("Gordon : 100, WACC 10%, g 2% → 1275", () => {
    expect(terminalValueGordon(100, 0.10, 0.02)).toBeCloseTo(1275);
  });
  it("Gordon rejette g ≥ WACC", () => {
    expect(() => terminalValueGordon(100, 0.05, 0.05)).toThrow();
  });
  it("exit multiple : 200 × 8 = 1600", () => {
    expect(terminalValueExit(200, 8)).toBe(1600);
  });
  it("croissance implicite retrouve le g du Gordon", () => {
    const tv = terminalValueGordon(100, 0.10, 0.025);
    expect(impliedGrowth(tv, 100, 0.10)).toBeCloseTo(0.025, 8);
  });
  it("dcf : FCF constants + Gordon — valeurs vérifiées à la main", () => {
    // FCF 100 × 3 ans, WACC 10%, g 2% → PV explicites = 248.685, TV = 1275, PV TV = 957.926
    const r = dcf({ fcfs: [100, 100, 100], discountRate: 0.10, terminal: { kind: "gordon", g: 0.02 } });
    expect(r.pvExplicit).toBeCloseTo(248.685, 2);
    expect(r.terminalValue).toBeCloseTo(1275);
    expect(r.pvTerminal).toBeCloseTo(1275 / 1.331, 2);
    expect(r.enterpriseValue).toBeCloseTo(248.685 + 957.926, 1);
    expect(r.tvShareOfEv).toBeGreaterThan(0.7);
  });
  it("dcf mid-year augmente l'EV", () => {
    const base = dcf({ fcfs: [100, 100], discountRate: 0.10, terminal: { kind: "exit", metric: 100, multiple: 10 } });
    const my = dcf({ fcfs: [100, 100], discountRate: 0.10, midYear: true, terminal: { kind: "exit", metric: 100, multiple: 10 } });
    expect(my.enterpriseValue).toBeGreaterThan(base.enterpriseValue);
  });
});

describe("M&A : prime & merger model", () => {
  it("prime : offre 60 vs cours 48 → 25%", () => {
    expect(premium(60, 48)).toBeCloseTo(0.25);
  });
  it("all-stock : P/E acquéreur 20 vs P/E payé 10 → accretif +20%", () => {
    const r = mergerModel({
      acquirerNetIncome: 100, acquirerShares: 100, acquirerSharePrice: 20,
      targetNetIncome: 50, offerEquityValue: 500,
      pctCash: 0, pctDebt: 0, pctStock: 1,
      costOfDebt: 0.05, cashYield: 0.02, taxRate: 0.25,
    });
    expect(r.newShares).toBeCloseTo(25);
    expect(r.proFormaEps).toBeCloseTo(1.2);
    expect(r.accretion).toBeCloseTo(0.20);
  });
  it("all-cash : accretif si yield cible > coût après impôt du financement", () => {
    // NI cible / prix = 50/500 = 10% > Kd(1−t) = 3.75% → accretif
    const r = mergerModel({
      acquirerNetIncome: 100, acquirerShares: 100, acquirerSharePrice: 20,
      targetNetIncome: 50, offerEquityValue: 500,
      pctCash: 0, pctDebt: 1, pctStock: 0,
      costOfDebt: 0.05, cashYield: 0.02, taxRate: 0.25,
    });
    // NI pf = 100 + 50 − 500×5%×0.75 = 131.25 ; EPS pf = 1.3125 → +31.25%
    expect(r.proFormaEps).toBeCloseTo(1.3125);
    expect(r.accretion).toBeCloseTo(0.3125);
  });
  it("break-even : les synergies breakeven annulent exactement la dilution", () => {
    const base = {
      acquirerNetIncome: 100, acquirerShares: 100, acquirerSharePrice: 10,
      targetNetIncome: 10, offerEquityValue: 400,
      pctCash: 0 as number, pctDebt: 0.5, pctStock: 0.5,
      costOfDebt: 0.08, cashYield: 0.02, taxRate: 0.25,
    };
    const diluted = mergerModel(base);
    expect(diluted.accretion).toBeLessThan(0);
    const atBreakeven = mergerModel({ ...base, pretaxSynergies: diluted.breakEvenPretaxSynergies });
    expect(atBreakeven.accretion).toBeCloseTo(0, 8);
  });
  it("rejette un mix de financement ≠ 100%", () => {
    expect(() => mergerModel({
      acquirerNetIncome: 1, acquirerShares: 1, acquirerSharePrice: 1,
      targetNetIncome: 1, offerEquityValue: 1,
      pctCash: 0.5, pctDebt: 0.2, pctStock: 0.2,
      costOfDebt: 0.05, cashYield: 0.02, taxRate: 0.25,
    })).toThrow();
  });
});

describe("LBO", () => {
  it("MOIC 2x en 5 ans ≈ IRR 14.87%", () => {
    expect(moic(200, 100)).toBe(2);
    expect(irrFromMoic(2, 5)).toBeCloseTo(0.1487, 3);
    expect(moicFromIrr(irrFromMoic(2, 5), 5)).toBeCloseTo(2, 8);
  });
  it("debtSchedule rembourse avec le FCF et jamais plus que la dette", () => {
    const sched = debtSchedule({ initialDebt: 100, interestRate: 0.08, ebitda0: 50, ebitdaGrowth: 0.05, fcfConversion: 0.5, taxRate: 0.25, years: 7 });
    expect(sched).toHaveLength(7);
    for (const y of sched) {
      expect(y.endingDebt).toBeGreaterThanOrEqual(0);
      expect(y.repayment).toBeGreaterThanOrEqual(0);
    }
    // dette décroissante
    for (let i = 1; i < sched.length; i++) expect(sched[i].endingDebt).toBeLessThanOrEqual(sched[i - 1].endingDebt);
  });
  it("lboReturns : sans dette ni croissance, MOIC = exit/entry multiple", () => {
    const r = lboReturns({ entryEbitda: 100, entryMultiple: 8, leverage: 0, interestRate: 0.08, ebitdaGrowth: 0, fcfConversion: 0, taxRate: 0.25, years: 5, exitMultiple: 10 });
    expect(r.moic).toBeCloseTo(10 / 8);
  });
  it("le levier amplifie le MOIC quand le deal performe", () => {
    const base = { entryEbitda: 100, entryMultiple: 8, interestRate: 0.07, ebitdaGrowth: 0.06, fcfConversion: 0.45, taxRate: 0.25, years: 5, exitMultiple: 8 };
    const noLev = lboReturns({ ...base, leverage: 0 });
    const lev = lboReturns({ ...base, leverage: 5 });
    expect(lev.moic).toBeGreaterThan(noLev.moic);
  });
});

describe("Purchase Price Allocation", () => {
  it("goodwill = prix − book equity − write-up + DTL", () => {
    // Prix 1000, book equity 400, write-up 200, impôt 25% → DTL 50, goodwill 450
    const r = purchasePriceAllocation({
      equityPurchasePrice: 1000, targetBookEquity: 400,
      ppeWriteUp: 120, intangibleWriteUp: 80, taxRate: 0.25,
    });
    expect(r.totalWriteUp).toBe(200);
    expect(r.deferredTaxLiability).toBe(50);
    expect(r.goodwill).toBe(450);
  });
  it("sans write-up, le goodwill est le simple écart au book equity", () => {
    const r = purchasePriceAllocation({ equityPurchasePrice: 900, targetBookEquity: 500, taxRate: 0.25 });
    expect(r.totalWriteUp).toBe(0);
    expect(r.deferredTaxLiability).toBe(0);
    expect(r.goodwill).toBe(400);
  });
  it("un write-up plus élevé réduit le goodwill (net de la DTL)", () => {
    const base = { equityPurchasePrice: 1000, targetBookEquity: 400, taxRate: 0.25 };
    const low = purchasePriceAllocation({ ...base, ppeWriteUp: 100 });
    const high = purchasePriceAllocation({ ...base, ppeWriteUp: 300 });
    expect(high.goodwill).toBeLessThan(low.goodwill);
    // chaque euro de write-up réduit le goodwill de (1 − t)
    expect(low.goodwill - high.goodwill).toBeCloseTo(200 * 0.75);
  });
  it("rejette un taux d'impôt hors [0, 1)", () => {
    expect(() => purchasePriceAllocation({ equityPurchasePrice: 1, targetBookEquity: 1, taxRate: 25 })).toThrow();
  });
});

describe("Valeur capitalisée des synergies", () => {
  it("perpétuité sans croissance : 20 avant impôt, t 25%, WACC 8% → 187,5", () => {
    expect(capitalizedSynergyValue({ annualPretaxSynergy: 20, taxRate: 0.25, discountRate: 0.08 })).toBeCloseTo(187.5);
  });
  it("la croissance augmente la valeur", () => {
    const flat = capitalizedSynergyValue({ annualPretaxSynergy: 20, taxRate: 0.25, discountRate: 0.08 });
    const grow = capitalizedSynergyValue({ annualPretaxSynergy: 20, taxRate: 0.25, discountRate: 0.08, growthRate: 0.02 });
    expect(grow).toBeGreaterThan(flat);
  });
  it("rejette g ≥ taux d'actualisation (au lieu de renvoyer NaN)", () => {
    expect(() => capitalizedSynergyValue({ annualPretaxSynergy: 20, taxRate: 0.25, discountRate: 0.02, growthRate: 0.02 })).toThrow();
  });
  it("test du banquier : prime payée vs valeur des synergies", () => {
    // Prime de 150 pour 25 de synergies avant impôt, t 25%, WACC 9% → VA 208 > 150 : le deal crée de la valeur
    const va = capitalizedSynergyValue({ annualPretaxSynergy: 25, taxRate: 0.25, discountRate: 0.09 });
    expect(va).toBeCloseTo(208.33, 1);
    expect(va).toBeGreaterThan(150);
  });
});

describe("Statistiques de comps", () => {
  it("percentile reproduit PERCENTILE.INC d'Excel", () => {
    const xs = [1, 2, 3, 4];
    expect(percentile(xs, 0)).toBe(1);
    expect(percentile(xs, 0.25)).toBeCloseTo(1.75);
    expect(percentile(xs, 0.5)).toBeCloseTo(2.5);
    expect(percentile(xs, 0.75)).toBeCloseTo(3.25);
    expect(percentile(xs, 1)).toBe(4);
  });
  it("médiane d'un échantillon impair = valeur centrale", () => {
    expect(percentile([5, 1, 3], 0.5)).toBe(3);
  });
  it("ignore les valeurs non finies (multiples n.m.)", () => {
    const s = sampleStats([8, 10, NaN, 12, Infinity]);
    expect(s.n).toBe(3);
    expect(s.median).toBe(10);
  });
  it("sampleStats renvoie les 5 stats attendues", () => {
    const s = sampleStats([6, 8, 10, 12, 14]);
    expect(s.min).toBe(6); expect(s.median).toBe(10); expect(s.max).toBe(14);
    expect(s.mean).toBe(10);
  });
  it("rejette un échantillon vide et un p hors bornes", () => {
    expect(() => sampleStats([])).toThrow();
    expect(() => percentile([1, 2], 1.5)).toThrow();
  });
});
