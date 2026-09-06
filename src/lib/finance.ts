// ─── Formules financières centralisées ──────────────────────────────────────
// Toutes les maths « sensibles » de la plateforme vivent ici, documentées et
// testées (src/lib/finance.test.ts). Conventions de signe explicites :
//  • Les cash-flows sont signés du point de vue de l'investisseur
//    (investissement < 0, encaissement > 0) pour npv() et irr().
//  • Les taux sont en décimal (0.10 = 10%).
//  • Aucune fonction ne « devine » : entrée invalide → Error explicite.

// ─── Bridge EV ↔ Equity Value ───────────────────────────────────────────────
export interface BridgeItems {
  equityValue?: number;
  debt?: number;            // dette financière brute
  cash?: number;            // cash et équivalents
  minorities?: number;      // intérêts minoritaires (NCI)
  preferred?: number;       // actions de préférence
  pension?: number;         // déficit de pension (equivalent dette)
  leases?: number;          // dettes de loyers si convention IFRS 16 "dans l'EV"
  associates?: number;      // mises en équivalence (à DÉDUIRE de l'EV)
}

/** EV = Equity + Dette − Cash + Minoritaires + Preferred + Pension + Leases − Associates */
export function evFromEquity(b: BridgeItems): number {
  const { equityValue = 0, debt = 0, cash = 0, minorities = 0, preferred = 0, pension = 0, leases = 0, associates = 0 } = b;
  return equityValue + debt - cash + minorities + preferred + pension + leases - associates;
}

/** Equity = EV − Dette + Cash − Minoritaires − Preferred − Pension − Leases + Associates */
export function equityFromEv(ev: number, b: Omit<BridgeItems, "equityValue">): number {
  const { debt = 0, cash = 0, minorities = 0, preferred = 0, pension = 0, leases = 0, associates = 0 } = b;
  return ev - debt + cash - minorities - preferred - pension - leases + associates;
}

// ─── Actions diluées — Treasury Stock Method ────────────────────────────────
export interface OptionTranche { count: number; strike: number }

/**
 * TSM : seules les options in-the-money (strike < cours) sont exercées ;
 * les produits d'exercice (count × strike) rachètent des actions au cours.
 * Dilution nette = count − (count × strike) / cours.
 * RSU : dilution intégrale. Convertibles : méthode if-converted simplifiée
 * (converties si cours > prix de conversion).
 */
export function dilutedShares(
  basic: number,
  price: number,
  opts?: { options?: OptionTranche[]; rsus?: number; convertibles?: { faceValue: number; conversionPrice: number }[] }
): number {
  if (price <= 0) throw new Error("Le cours doit être > 0");
  if (basic < 0) throw new Error("Nombre d'actions de base invalide");
  let total = basic + (opts?.rsus ?? 0);
  for (const t of opts?.options ?? []) {
    if (t.strike < price) {
      const proceeds = t.count * t.strike;
      total += t.count - proceeds / price;
    }
  }
  for (const c of opts?.convertibles ?? []) {
    if (c.conversionPrice > 0 && price > c.conversionPrice) total += c.faceValue / c.conversionPrice;
  }
  return total;
}

// ─── Coût du capital ────────────────────────────────────────────────────────
/** CAPM : Ke = Rf + β × ERP */
export function costOfEquityCapm(rf: number, beta: number, erp: number): number {
  return rf + beta * erp;
}

/** WACC = E/V × Ke + D/V × Kd × (1 − t) — pondérations en VALEURS DE MARCHÉ. */
export function wacc(equity: number, debt: number, ke: number, kd: number, tax: number): number {
  const v = equity + debt;
  if (v <= 0) throw new Error("E + D doit être > 0");
  if (tax < 0 || tax >= 1) throw new Error("Taux d'impôt attendu en décimal [0, 1)");
  return (equity / v) * ke + (debt / v) * kd * (1 - tax);
}

/** βu = βl / [1 + (1 − t) × D/E] (Hamada) */
export function unleverBeta(leveredBeta: number, debtToEquity: number, tax: number): number {
  return leveredBeta / (1 + (1 - tax) * debtToEquity);
}

/** βl = βu × [1 + (1 − t) × D/E] */
export function releverBeta(unleveredBeta: number, debtToEquity: number, tax: number): number {
  return unleveredBeta * (1 + (1 - tax) * debtToEquity);
}

// ─── Valeur temps de l'argent ───────────────────────────────────────────────
/**
 * NPV de cash-flows annuels. cashflows[0] arrive dans 1 an (fin d'année 1).
 * midYear : convention mi-année (actualisation à t − 0.5).
 * Un investissement initial à t=0 doit être ajouté séparément (non actualisé).
 */
export function npv(rate: number, cashflows: number[], opts?: { midYear?: boolean }): number {
  if (rate <= -1) throw new Error("Taux d'actualisation invalide");
  const shift = opts?.midYear ? 0.5 : 0;
  return cashflows.reduce((acc, cf, i) => acc + cf / Math.pow(1 + rate, i + 1 - shift), 0);
}

/**
 * IRR par bissection sur [-0.9999, 10]. cashflows[0] est à t=0 (signé).
 * Requiert au moins un flux négatif et un positif. Retourne un décimal.
 */
export function irr(cashflows: number[], tolerance = 1e-7): number {
  if (!cashflows.some((c) => c < 0) || !cashflows.some((c) => c > 0))
    throw new Error("L'IRR requiert au moins un flux négatif et un positif");
  const f = (r: number) => cashflows.reduce((acc, cf, i) => acc + cf / Math.pow(1 + r, i), 0);
  let lo = -0.9999, hi = 10;
  let flo = f(lo), fhi = f(hi);
  if (flo * fhi > 0) throw new Error("Pas de solution IRR dans [-99,99%, 1000%]");
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const fmid = f(mid);
    if (Math.abs(fmid) < tolerance || hi - lo < tolerance) return mid;
    if (flo * fmid <= 0) { hi = mid; fhi = fmid; } else { lo = mid; flo = fmid; }
  }
  return (lo + hi) / 2;
}

/** CAGR = (fin / début)^(1/années) − 1 */
export function cagr(begin: number, end: number, years: number): number {
  if (begin <= 0 || end <= 0) throw new Error("CAGR : valeurs strictement positives requises");
  if (years <= 0) throw new Error("CAGR : années > 0 requises");
  return Math.pow(end / begin, 1 / years) - 1;
}

// ─── DCF ────────────────────────────────────────────────────────────────────
/** TV Gordon = FCF_final × (1 + g) / (WACC − g). Exige WACC > g. */
export function terminalValueGordon(finalFcf: number, discountRate: number, g: number): number {
  if (discountRate <= g) throw new Error("La croissance perpétuelle doit être < au taux d'actualisation");
  return (finalFcf * (1 + g)) / (discountRate - g);
}

/** TV exit multiple = métrique finale × multiple. */
export function terminalValueExit(finalMetric: number, multiple: number): number {
  if (multiple < 0) throw new Error("Multiple négatif");
  return finalMetric * multiple;
}

/** Croissance implicite d'une TV donnée : g = (WACC × TV − FCF) / (TV + FCF) */
export function impliedGrowth(tv: number, finalFcf: number, discountRate: number): number {
  return (discountRate * tv - finalFcf) / (tv + finalFcf);
}

export interface DcfResult { pvExplicit: number; pvTerminal: number; enterpriseValue: number; terminalValue: number; tvShareOfEv: number }

/**
 * DCF standard : PV des FCF explicites + PV de la TV (actualisée depuis
 * l'année N — ou N − 0.5 en mid-year). TV : Gordon (g) OU exit multiple.
 */
export function dcf(params: {
  fcfs: number[]; discountRate: number; midYear?: boolean;
  terminal: { kind: "gordon"; g: number } | { kind: "exit"; metric: number; multiple: number };
}): DcfResult {
  const { fcfs, discountRate, midYear, terminal } = params;
  if (fcfs.length === 0) throw new Error("Au moins un FCF explicite requis");
  const n = fcfs.length;
  const pvExplicit = npv(discountRate, fcfs, { midYear });
  const terminalValue = terminal.kind === "gordon"
    ? terminalValueGordon(fcfs[n - 1], discountRate, terminal.g)
    : terminalValueExit(terminal.metric, terminal.multiple);
  // La TV est un flux en fin d'année N ; mid-year → actualisée à N − 0.5.
  const tvDiscountYears = midYear ? n - 0.5 : n;
  const pvTerminal = terminalValue / Math.pow(1 + discountRate, tvDiscountYears);
  const enterpriseValue = pvExplicit + pvTerminal;
  return { pvExplicit, pvTerminal, enterpriseValue, terminalValue, tvShareOfEv: enterpriseValue !== 0 ? pvTerminal / enterpriseValue : 0 };
}

// ─── M&A : prime, accretion/dilution, synergies ─────────────────────────────
/** Prime offerte = offre / cours non affecté − 1 */
export function premium(offerPerShare: number, unaffectedPrice: number): number {
  if (unaffectedPrice <= 0) throw new Error("Cours non affecté > 0 requis");
  return offerPerShare / unaffectedPrice - 1;
}

export interface MergerInputs {
  acquirerNetIncome: number;
  acquirerShares: number;
  acquirerSharePrice: number;
  targetNetIncome: number;
  offerEquityValue: number;   // prix payé pour 100% de l'equity cible
  pctCash: number;            // fractions du financement (somme = 1)
  pctDebt: number;
  pctStock: number;
  costOfDebt: number;         // taux de la dette nouvelle
  cashYield: number;          // rendement perdu sur le cash utilisé
  taxRate: number;
  pretaxSynergies?: number;   // synergies annuelles avant impôt
  incrementalDA?: number;     // D&A incrémentale du PPA (write-ups + intangibles), avant impôt
}

export interface MergerResult {
  standaloneEps: number; proFormaEps: number; accretion: number; // décimal, +0.05 = +5%
  newShares: number; proFormaNetIncome: number; proFormaShares: number;
  afterTaxFinancingCost: number; breakEvenPretaxSynergies: number;
}

/**
 * Accretion/dilution pro forma :
 *  NI pf = NI acquéreur + NI cible + (synergies − D&A incrémentale) × (1 − t)
 *          − [cash utilisé × cashYield + dette nouvelle × Kd] × (1 − t)
 *  Actions pf = actions acquéreur + (part stock de l'offre) / cours acquéreur
 *  Accretion = EPS pf / EPS standalone − 1
 *  Break-even : synergies avant impôt annulant exactement la dilution.
 */
export function mergerModel(m: MergerInputs): MergerResult {
  const sum = m.pctCash + m.pctDebt + m.pctStock;
  if (Math.abs(sum - 1) > 1e-6) throw new Error("pctCash + pctDebt + pctStock doit faire 100%");
  if (m.acquirerShares <= 0 || m.acquirerSharePrice <= 0) throw new Error("Données acquéreur invalides");
  const t = m.taxRate;
  const cashUsed = m.offerEquityValue * m.pctCash;
  const newDebt = m.offerEquityValue * m.pctDebt;
  const stockValue = m.offerEquityValue * m.pctStock;
  const newShares = stockValue / m.acquirerSharePrice;
  const pretaxFinancing = cashUsed * m.cashYield + newDebt * m.costOfDebt;
  const afterTaxFinancingCost = pretaxFinancing * (1 - t);
  const afterTaxAdjustments = ((m.pretaxSynergies ?? 0) - (m.incrementalDA ?? 0)) * (1 - t);
  const proFormaNetIncome = m.acquirerNetIncome + m.targetNetIncome + afterTaxAdjustments - afterTaxFinancingCost;
  const proFormaShares = m.acquirerShares + newShares;
  const standaloneEps = m.acquirerNetIncome / m.acquirerShares;
  const proFormaEps = proFormaNetIncome / proFormaShares;
  // Synergies avant impôt telles que EPS pf == EPS standalone :
  // (NIpf_sans_syn + S(1−t)) / sharesPf = EPS standalone
  const niWithoutSyn = proFormaNetIncome - (m.pretaxSynergies ?? 0) * (1 - t);
  const breakEvenPretaxSynergies = Math.max(0, (standaloneEps * proFormaShares - niWithoutSyn) / (1 - t));
  return {
    standaloneEps, proFormaEps, accretion: proFormaEps / standaloneEps - 1,
    newShares, proFormaNetIncome, proFormaShares, afterTaxFinancingCost, breakEvenPretaxSynergies,
  };
}

// ─── Purchase Price Allocation ──────────────────────────────────────────────
export interface PpaResult { totalWriteUp: number; deferredTaxLiability: number; goodwill: number }

/**
 * PPA : on réévalue les actifs identifiables à leur juste valeur (write-up),
 * ce qui crée un impôt différé passif (le step-up n'est pas déductible dans un
 * stock deal), et le reliquat du prix payé devient du goodwill.
 *   DTL      = write-up total × taux d'impôt
 *   Goodwill = prix payé − capitaux propres comptables − write-up + DTL
 * Le +DTL vient de ce que le passif d'impôt différé réduit l'actif net acquis.
 */
export function purchasePriceAllocation(p: {
  equityPurchasePrice: number;
  targetBookEquity: number;
  ppeWriteUp?: number;
  intangibleWriteUp?: number;
  otherWriteUp?: number;
  taxRate: number;
}): PpaResult {
  if (p.taxRate < 0 || p.taxRate >= 1) throw new Error("Taux d'impôt attendu en décimal [0, 1)");
  const totalWriteUp = (p.ppeWriteUp ?? 0) + (p.intangibleWriteUp ?? 0) + (p.otherWriteUp ?? 0);
  const deferredTaxLiability = totalWriteUp * p.taxRate;
  const goodwill = p.equityPurchasePrice - p.targetBookEquity - totalWriteUp + deferredTaxLiability;
  return { totalWriteUp, deferredTaxLiability, goodwill };
}

/**
 * Valeur capitalisée d'un flux de synergies annuelles (perpétuité) :
 *   VA = synergies après impôt / (WACC − g)
 * À comparer à la prime payée : si la prime dépasse cette valeur, l'acquéreur
 * transfère de la valeur aux actionnaires de la cible.
 */
export function capitalizedSynergyValue(p: {
  annualPretaxSynergy: number;
  taxRate: number;
  discountRate: number;
  growthRate?: number;
}): number {
  const g = p.growthRate ?? 0;
  if (p.discountRate <= g) throw new Error("Le taux d'actualisation doit être > à la croissance");
  return (p.annualPretaxSynergy * (1 - p.taxRate)) / (p.discountRate - g);
}

// ─── LBO ────────────────────────────────────────────────────────────────────
export function moic(equityOut: number, equityIn: number): number {
  if (equityIn <= 0) throw new Error("Equity investie > 0 requise");
  return equityOut / equityIn;
}

/** IRR = MOIC^(1/années) − 1 (hypothèse : un seul flux d'entrée et de sortie). */
export function irrFromMoic(m: number, years: number): number {
  if (m <= 0 || years <= 0) throw new Error("MOIC et années > 0 requis");
  return Math.pow(m, 1 / years) - 1;
}

/** MOIC = (1 + IRR)^années */
export function moicFromIrr(rate: number, years: number): number {
  if (years <= 0) throw new Error("Années > 0 requises");
  return Math.pow(1 + rate, years);
}

export interface DebtYear { year: number; ebitda: number; interest: number; fcfAfterInterest: number; repayment: number; endingDebt: number }

/**
 * Échéancier de dette simplifié (cash sweep à 100%) :
 *  FCF avant intérêts = EBITDA × conversion − impôt approx. sur (EBITDA − intérêts)
 *  On rembourse tout le FCF disponible après intérêts (plancher : 0).
 * Modèle pédagogique — un vrai modèle sépare capex, ΔNWC, taxes précises.
 */
export function debtSchedule(params: {
  initialDebt: number; interestRate: number; ebitda0: number; ebitdaGrowth: number;
  fcfConversion: number; // part de l'EBITDA convertie en FCF avant intérêts et impôt
  taxRate: number; years: number;
}): DebtYear[] {
  const { initialDebt, interestRate, ebitda0, ebitdaGrowth, fcfConversion, taxRate, years } = params;
  if (years <= 0 || years > 15) throw new Error("Horizon 1-15 ans");
  if (fcfConversion < 0 || fcfConversion > 1) throw new Error("Conversion FCF entre 0 et 1");
  const out: DebtYear[] = [];
  let debt = initialDebt;
  for (let y = 1; y <= years; y++) {
    const ebitda = ebitda0 * Math.pow(1 + ebitdaGrowth, y);
    const interest = debt * interestRate;
    const pretaxCash = ebitda * fcfConversion - interest;
    const fcfAfterInterest = pretaxCash - Math.max(0, pretaxCash) * taxRate;
    const repayment = Math.min(debt, Math.max(0, fcfAfterInterest));
    debt -= repayment;
    out.push({ year: y, ebitda, interest, fcfAfterInterest, repayment, endingDebt: debt });
  }
  return out;
}

export interface LboResult {
  entryEv: number; entryDebt: number; entryEquity: number;
  exitEbitda: number; exitEv: number; exitDebt: number; exitEquity: number;
  moic: number; irr: number; schedule: DebtYear[];
}

/**
 * LBO complet simplifié : entrée à entryMultiple × EBITDA, dette = leverage ×
 * EBITDA, paydown par cash sweep (debtSchedule), sortie à exitMultiple ×
 * EBITDA final. Retourne MOIC et IRR sponsor.
 */
export function lboReturns(params: {
  entryEbitda: number; entryMultiple: number; leverage: number; // × EBITDA
  interestRate: number; ebitdaGrowth: number; fcfConversion: number; taxRate: number;
  years: number; exitMultiple: number;
}): LboResult {
  const { entryEbitda, entryMultiple, leverage, interestRate, ebitdaGrowth, fcfConversion, taxRate, years, exitMultiple } = params;
  if (entryEbitda <= 0) throw new Error("EBITDA d'entrée > 0 requis");
  if (leverage < 0 || leverage > entryMultiple) throw new Error("Levier entre 0 et le multiple d'entrée");
  const entryEv = entryEbitda * entryMultiple;
  const entryDebt = entryEbitda * leverage;
  const entryEquity = entryEv - entryDebt;
  const schedule = debtSchedule({ initialDebt: entryDebt, interestRate, ebitda0: entryEbitda, ebitdaGrowth, fcfConversion, taxRate, years });
  const exitEbitda = entryEbitda * Math.pow(1 + ebitdaGrowth, years);
  const exitEv = exitEbitda * exitMultiple;
  const exitDebt = schedule[schedule.length - 1].endingDebt;
  const exitEquity = Math.max(0, exitEv - exitDebt);
  const m = moic(exitEquity, entryEquity);
  return { entryEv, entryDebt, entryEquity, exitEbitda, exitEv, exitDebt, exitEquity, moic: m, irr: irrFromMoic(Math.max(m, 1e-9), years), schedule };
}
