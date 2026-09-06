import { describe, it, expect } from "vitest";
import {
  computeAtlasExpected, withinTolerance, atlasUfcf, atlasWacc, atlasEquityFromEv,
  peerEnterpriseValue, peerMarketCap, atlasPeers, atlasCompany, atlasAssumptions,
  ATLAS_NAMED_RANGES, ATLAS_FORMULA_REQUIRED, YEARS, FORECAST_YEARS,
} from "./projectAtlas";

const E = computeAtlasExpected();

describe("Project Atlas — cohérence des données", () => {
  it("chaque série financière couvre les 8 exercices", () => {
    const f = atlasCompany.financials;
    for (const key of ["revenue", "ebitda", "da", "capex", "deltaNwc"] as const) {
      expect(f[key]).toHaveLength(YEARS.length);
      expect(f[key].every(Number.isFinite)).toBe(true);
    }
  });
  it("la croissance n'est pas linéaire (plan réaliste)", () => {
    const r = atlasCompany.financials.revenue;
    const growth = r.slice(1).map((v, i) => v / r[i] - 1);
    const uniques = new Set(growth.map((g) => g.toFixed(4)));
    expect(uniques.size).toBeGreaterThan(3);
  });
  it("il y a bien 8 comparables, tous exploitables", () => {
    expect(atlasPeers).toHaveLength(8);
    for (const p of atlasPeers) {
      expect(peerMarketCap(p)).toBeGreaterThan(0);
      expect(peerEnterpriseValue(p)).toBeGreaterThan(0);
      expect(p.ebitda.fy27).toBeGreaterThan(0);
    }
  });
  it("le comparable piège ressort bien décoté", () => {
    const trap = E.peers.find((p) => p.name === "Velora Group")!;
    const others = E.peers.filter((p) => p.name !== "Velora Group");
    expect(trap.evEbitda27).toBeLessThan(Math.min(...others.map((p) => p.evEbitda27)));
    // et il le mérite : croissance quasi nulle
    const v = atlasPeers.find((p) => p.name === "Velora Group")!;
    expect(v.revenue.fy27 / v.revenue.fy25 - 1).toBeLessThan(0.03);
    expect(v.ebitda.fy27 / v.revenue.fy27).toBeLessThan(v.ebitda.fy25 / v.revenue.fy25);
  });
});

describe("Project Atlas — valeurs attendues", () => {
  it("le WACC tombe au centre de la grille de sensibilité", () => {
    const w = atlasWacc();
    const grid = atlasAssumptions.sensitivityWacc;
    expect(w).toBeGreaterThan(grid[0]);
    expect(w).toBeLessThan(grid[grid.length - 1]);
    expect(w).toBeCloseTo(0.08446, 4);
  });
  it("l'UFCF suit EBIT×(1−t) + D&A − capex − ΔBFR", () => {
    const f = atlasCompany.financials, i = YEARS.indexOf("FY27E");
    const manual = (f.ebitda[i] - f.da[i]) * (1 - atlasCompany.taxRate) + f.da[i] - f.capex[i] - f.deltaNwc[i];
    expect(atlasUfcf("FY27E")).toBeCloseTo(manual, 8);
  });
  it("les UFCF sont croissants sur l'horizon", () => {
    const v = FORECAST_YEARS.map(atlasUfcf);
    for (let i = 1; i < v.length; i++) expect(v[i]).toBeGreaterThan(v[i - 1]);
  });
  it("le bridge EV → equity retire dette, leases et minoritaires et rajoute le cash", () => {
    const ev = 1000;
    const expected = ev - atlasCompany.grossDebt - atlasCompany.leaseLiabilities
      - atlasCompany.minorityInterests + atlasCompany.cash;
    expect(atlasEquityFromEv(ev)).toBeCloseTo(expected, 8);
  });
  it("le centre de la table de sensibilité encadre le cas de base", () => {
    const center = E.dcf.sensitivity[2][2];
    expect(Math.abs(center - E.dcf.pricePerShare) / E.dcf.pricePerShare).toBeLessThan(0.03);
  });
  it("la valeur terminale domine sans être aberrante", () => {
    const share = E.dcf.pvTv / E.dcf.enterpriseValue;
    expect(share).toBeGreaterThan(0.6);
    expect(share).toBeLessThan(0.85);
  });
  it("comps et DCF convergent raisonnablement (méthodes différentes, pas identiques)", () => {
    const gap = Math.abs(E.comps.impliedPrice - E.dcf.pricePerShare) / E.dcf.pricePerShare;
    expect(gap).toBeGreaterThan(0.02);  // deux méthodes ne donnent jamais le même chiffre
    expect(gap).toBeLessThan(0.30);     // mais un écart énorme signalerait une erreur de calibrage
  });
  it("le calcul est déterministe", () => {
    const a = computeAtlasExpected(), b = computeAtlasExpected();
    expect(a.dcf.pricePerShare).toBe(b.dcf.pricePerShare);
    expect(a.comps.medianEvEbitda27).toBe(b.comps.medianEvEbitda27);
  });
});

describe("Project Atlas — tolérances", () => {
  it("accepte un écart de rounding sur une valeur monétaire", () => {
    expect(withinTolerance(1000.4, 1000, "currency")).toBe(true);
    expect(withinTolerance(1006, 1000, "currency")).toBe(false);
  });
  it("accepte ±0,02x sur un multiple", () => {
    expect(withinTolerance(11.42, 11.41, "multiple")).toBe(true);
    expect(withinTolerance(11.50, 11.41, "multiple")).toBe(false);
  });
  it("accepte ±0,05 point sur un pourcentage", () => {
    expect(withinTolerance(0.0846, 0.08446, "percent")).toBe(true);
    expect(withinTolerance(0.0900, 0.08446, "percent")).toBe(false);
  });
  it("rejette une valeur non numérique", () => {
    expect(withinTolerance(NaN, 100, "currency")).toBe(false);
    expect(withinTolerance(Infinity, 100, "currency")).toBe(false);
  });
});

describe("Project Atlas — contrat du classeur", () => {
  it("18 noms définis, tous uniques", () => {
    expect(ATLAS_NAMED_RANGES).toHaveLength(18);
    expect(new Set(ATLAS_NAMED_RANGES).size).toBe(18);
  });
  it("les cellules exigeant une formule sont toutes des noms définis connus", () => {
    for (const n of ATLAS_FORMULA_REQUIRED) expect(ATLAS_NAMED_RANGES).toContain(n);
  });
  it("MODEL_CHECK n'exige pas de formule (c'est une sortie texte)", () => {
    expect(ATLAS_FORMULA_REQUIRED).not.toContain("ATLAS_MODEL_CHECK");
  });
});
