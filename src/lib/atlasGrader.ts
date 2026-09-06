// ─── Correction d'une soumission Project Atlas ──────────────────────────────
// Notation déterministe, 100 points :
//   45 précision · 20 intégrité des formules · 15 complétion · 10 QC · 10 vitesse
// Aucun appel réseau, aucune IA : ce qui est affiché est ce qui est réellement
// mesuré dans le classeur.

import {
  computeAtlasExpected, withinTolerance, atlasTolerances,
  ATLAS_FORMULA_REQUIRED, type AtlasNamedRange, type ToleranceKind,
} from "../data/projectAtlas.ts";
import type { ParsedAtlas, CellRead } from "./atlasWorkbook.ts";

export interface AtlasIssue {
  area: "Trading Comps" | "DCF" | "Valuation Summary" | "Model QC" | "Structure";
  title: string;
  detail: string;
  /** Valeur trouvée, affichable sans dévoiler la réponse. */
  userValue?: string;
  /** Fourchette attendue, formulée sans donner le chiffre exact. */
  expectedHint?: string;
  severity: "critical" | "major" | "minor";
  /** Tag pour le Mistake Book. */
  tag: string;
}

export interface AtlasScore {
  total: number;
  accuracy: number;       // /45
  integrity: number;      // /20
  completion: number;     // /15
  qc: number;             // /10
  speed: number;          // /10
  rating: string;
  comments: string[];
  issues: AtlasIssue[];
  checkedCells: number;
  correctCells: number;
}

const MAX = { accuracy: 45, integrity: 20, completion: 15, qc: 10, speed: 10 };

/** Contrôles de précision : nom défini → valeur attendue + type de tolérance. */
interface AccuracyCheck {
  name: AtlasNamedRange;
  expected: number;
  kind: ToleranceKind;
  area: AtlasIssue["area"];
  label: string;
  tag: string;
  /** Formatage pour l'affichage. */
  fmt: (v: number) => string;
  /** Poids relatif dans la note de précision. */
  weight: number;
}

const eur = (v: number) => `${v.toFixed(2).replace(".", ",")} €`;
const meur = (v: number) => `${v.toFixed(0)} M€`;
const mult = (v: number) => `${v.toFixed(2).replace(".", ",")}x`;
const pct = (v: number) => `${(v * 100).toFixed(2).replace(".", ",")}%`;

export function buildAccuracyChecks(): AccuracyCheck[] {
  const E = computeAtlasExpected();
  const nova = E.peers[0];
  return [
    { name: "ATLAS_MARKET_CAP_NOVA", expected: nova.marketCap, kind: "currency", area: "Trading Comps",
      label: "Market cap de Nova Brands", tag: "Trading Comps", fmt: meur, weight: 1 },
    { name: "ATLAS_EV_NOVA", expected: nova.enterpriseValue, kind: "currency", area: "Trading Comps",
      label: "Enterprise value de Nova Brands", tag: "Enterprise Value", fmt: meur, weight: 2 },
    { name: "ATLAS_COMPS_MEDIAN_EV_EBITDA_27", expected: E.comps.medianEvEbitda27, kind: "multiple", area: "Trading Comps",
      label: "Médiane EV/EBITDA FY27E", tag: "Trading Comps", fmt: mult, weight: 3 },
    { name: "ATLAS_IMPLIED_EV_COMPS", expected: E.comps.impliedEv, kind: "currency", area: "Trading Comps",
      label: "Enterprise value implicite (comps)", tag: "Trading Comps", fmt: meur, weight: 2 },
    { name: "ATLAS_IMPLIED_EQUITY_COMPS", expected: E.comps.impliedEquity, kind: "currency", area: "Trading Comps",
      label: "Equity value implicite (comps)", tag: "Net Debt", fmt: meur, weight: 2 },
    { name: "ATLAS_IMPLIED_PRICE_COMPS", expected: E.comps.impliedPrice, kind: "perShare", area: "Trading Comps",
      label: "Prix par action implicite (comps)", tag: "Trading Comps", fmt: eur, weight: 2 },

    { name: "ATLAS_WACC", expected: E.dcf.wacc, kind: "percent", area: "DCF",
      label: "WACC", tag: "WACC", fmt: pct, weight: 3 },
    { name: "ATLAS_UFCF_26", expected: E.dcf.ufcf["FY26E"], kind: "currency", area: "DCF",
      label: "UFCF FY26E", tag: "DCF", fmt: meur, weight: 1 },
    { name: "ATLAS_UFCF_27", expected: E.dcf.ufcf["FY27E"], kind: "currency", area: "DCF",
      label: "UFCF FY27E", tag: "DCF", fmt: meur, weight: 1 },
    { name: "ATLAS_UFCF_28", expected: E.dcf.ufcf["FY28E"], kind: "currency", area: "DCF",
      label: "UFCF FY28E", tag: "DCF", fmt: meur, weight: 1 },
    { name: "ATLAS_UFCF_29", expected: E.dcf.ufcf["FY29E"], kind: "currency", area: "DCF",
      label: "UFCF FY29E", tag: "DCF", fmt: meur, weight: 1 },
    { name: "ATLAS_UFCF_30", expected: E.dcf.ufcf["FY30E"], kind: "currency", area: "DCF",
      label: "UFCF FY30E", tag: "DCF", fmt: meur, weight: 1 },
    { name: "ATLAS_DCF_PV_FCF", expected: E.dcf.pvFcf, kind: "currency", area: "DCF",
      label: "Somme des PV des UFCF", tag: "DCF", fmt: meur, weight: 2 },
    { name: "ATLAS_DCF_PV_TV", expected: E.dcf.pvTv, kind: "currency", area: "DCF",
      label: "PV de la valeur terminale", tag: "Terminal Value", fmt: meur, weight: 3 },
    { name: "ATLAS_DCF_EV", expected: E.dcf.enterpriseValue, kind: "currency", area: "DCF",
      label: "Enterprise value (DCF)", tag: "DCF", fmt: meur, weight: 2 },
    { name: "ATLAS_DCF_EQUITY", expected: E.dcf.equityValue, kind: "currency", area: "DCF",
      label: "Equity value (DCF)", tag: "Lease Liabilities", fmt: meur, weight: 2 },
    { name: "ATLAS_DCF_PRICE", expected: E.dcf.pricePerShare, kind: "perShare", area: "DCF",
      label: "Prix par action (DCF)", tag: "DCF", fmt: eur, weight: 3 },
  ];
}

function ratingFor(score: number): string {
  if (score >= 90) return "Associate-ready";
  if (score >= 80) return "Solide pour un analyste";
  if (score >= 70) return "Bonne base — à revoir";
  if (score >= 60) return "Erreurs matérielles à corriger";
  return "Modèle à reconstruire";
}

/** Note la vitesse : plein pot sous la cible, dégressif ensuite, jamais négatif. */
export function speedScore(durationSeconds: number, targetMinutes = 90): number {
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) return 0;
  const minutes = durationSeconds / 60;
  if (minutes <= targetMinutes) return MAX.speed;
  // −1 point par tranche de 15 min au-delà de la cible
  return Math.max(0, MAX.speed - Math.ceil((minutes - targetMinutes) / 15));
}

export interface GradeOptions {
  durationSeconds: number;
  targetMinutes?: number;
}

export function gradeAtlas(parsed: ParsedAtlas, opts: GradeOptions): AtlasScore {
  const checks = buildAccuracyChecks();
  const issues: AtlasIssue[] = [];
  const comments: string[] = [];

  // ─── Structure ────────────────────────────────────────────────────────────
  for (const s of parsed.missingSheets) {
    issues.push({
      area: "Structure", title: `Onglet « ${s} » absent`,
      detail: "Le classeur ne contient pas cet onglet. Repars du modèle de départ sans supprimer d'onglet.",
      severity: "critical", tag: "Model QC",
    });
  }
  if (parsed.noCachedResults) {
    issues.push({
      area: "Structure", title: "Formules non recalculées",
      detail: "Le classeur contient des formules sans valeur calculée. Ouvre-le dans Excel, laisse recalculer, enregistre puis renvoie-le.",
      severity: "critical", tag: "Model QC",
    });
  }

  // ─── Précision (45) ───────────────────────────────────────────────────────
  const totalWeight = checks.reduce((a, c) => a + c.weight, 0);
  let earnedWeight = 0, correctCells = 0;

  for (const c of checks) {
    const cell: CellRead | undefined = parsed.cells[c.name];
    const ok = cell?.value != null && withinTolerance(cell.value, c.expected, c.kind);
    if (ok) { earnedWeight += c.weight; correctCells++; continue; }

    const tol = atlasTolerances[c.kind];
    const lo = c.expected * (1 - (tol.rel ?? 0)) - (tol.abs ?? 0);
    const hi = c.expected * (1 + (tol.rel ?? 0)) + (tol.abs ?? 0);
    issues.push({
      area: c.area,
      title: c.label,
      detail: cell?.error
        ? `La cellule renvoie ${cell.error}. Corrige la formule avant de renvoyer.`
        : cell?.blank || cell?.value == null
          ? "Cette sortie est vide. Elle fait partie du livrable attendu."
          : "La valeur ne tombe pas dans la fourchette attendue. Reprends le calcul en amont.",
      userValue: cell?.error ?? (cell?.value != null ? c.fmt(cell.value) : "—"),
      expectedHint: cell?.value != null ? `environ ${c.fmt(lo)} – ${c.fmt(hi)}` : undefined,
      severity: c.weight >= 3 ? "critical" : c.weight === 2 ? "major" : "minor",
      tag: c.tag,
    });
  }
  const accuracy = Math.round((earnedWeight / totalWeight) * MAX.accuracy);

  // ─── Intégrité des formules (20) ──────────────────────────────────────────
  // Une valeur juste mais tapée en dur ne vaut que la moitié des points.
  let integrityPoints = 0;
  let hardcoded = 0;
  const perCell = MAX.integrity / ATLAS_FORMULA_REQUIRED.length;
  for (const name of ATLAS_FORMULA_REQUIRED) {
    const cell = parsed.cells[name];
    const check = checks.find((c) => c.name === name);
    const valueOk = cell?.value != null && check
      ? withinTolerance(cell.value, check.expected, check.kind) : false;
    if (!valueOk) continue;               // la précision est déjà sanctionnée
    if (cell?.hasFormula) integrityPoints += perCell;
    else { integrityPoints += perCell / 2; hardcoded++; }
  }
  const integrity = Math.round(integrityPoints);
  if (hardcoded > 0) {
    issues.push({
      area: "Model QC", title: `${hardcoded} sortie${hardcoded > 1 ? "s" : ""} en dur`,
      detail: "Le résultat est bon, mais la cellule contient un nombre saisi et non une formule. Un modèle non lié ne se met pas à jour quand une hypothèse change — c'est rédhibitoire sur un desk.",
      severity: "major", tag: "Formula Integrity",
    });
  }

  // ─── Complétion (15) ──────────────────────────────────────────────────────
  const compsRatio = Math.min(1, parsed.compsFilled / 64);
  const sensRatio = Math.min(1, parsed.sensitivityFilled / 25);
  const namesRatio = 1 - Math.min(1, parsed.missingNames.length / 6);
  const completion = Math.round(((compsRatio * 0.5 + sensRatio * 0.3 + namesRatio * 0.2)) * MAX.completion);
  if (parsed.compsFilled < 64) {
    issues.push({
      area: "Trading Comps", title: "Tableau de comparables incomplet",
      detail: `${parsed.compsFilled} cellules remplies sur 64. Chaque comparable a besoin de sa market cap, son EV et ses six multiples.`,
      severity: parsed.compsFilled < 32 ? "critical" : "major", tag: "Trading Comps",
    });
  }
  if (parsed.sensitivityFilled < 25) {
    issues.push({
      area: "DCF", title: "Table de sensibilité incomplète",
      detail: `${parsed.sensitivityFilled} cellules sur 25. La sensibilité WACC × croissance fait partie de tout livrable de DCF.`,
      severity: "major", tag: "DCF",
    });
  }

  // ─── QC (10) ──────────────────────────────────────────────────────────────
  const modelCheck = parsed.cells["ATLAS_MODEL_CHECK"];
  const checkOk = (modelCheck?.text ?? "").toUpperCase().includes("OK");
  const passedChecks = parsed.checkResults.filter(Boolean).length;
  const checkRatio = parsed.checkResults.length ? passedChecks / parsed.checkResults.length : 0;
  const errorPenalty = Math.min(4, parsed.errorCells.length);
  const qc = Math.max(0, Math.round(checkRatio * 6 + (checkOk ? 4 : 0) - errorPenalty));

  if (!checkOk) {
    issues.push({
      area: "Model QC", title: "MODEL CHECK ne passe pas",
      detail: "L'onglet Checks n'affiche pas OK. Identifie la ligne en défaut et corrige-la avant d'envoyer : un modèle dont les contrôles échouent ne part jamais chez un client.",
      severity: "critical", tag: "Model QC",
    });
  }
  if (parsed.errorCells.length > 0) {
    const first = parsed.errorCells.slice(0, 3).map((e) => `${e.sheet}!${e.address} (${e.error})`).join(", ");
    issues.push({
      area: "Model QC", title: `${parsed.errorCells.length} cellule${parsed.errorCells.length > 1 ? "s" : ""} en erreur`,
      detail: `Erreurs Excel détectées : ${first}${parsed.errorCells.length > 3 ? "…" : ""}. Aucune erreur ne doit subsister dans un livrable.`,
      severity: "critical", tag: "Model QC",
    });
  }

  // ─── Vitesse (10) ─────────────────────────────────────────────────────────
  const speed = speedScore(opts.durationSeconds, opts.targetMinutes ?? 90);

  const total = Math.max(0, Math.min(100, accuracy + integrity + completion + qc + speed));

  // ─── Commentaires façon Associate ─────────────────────────────────────────
  const compsIssues = issues.filter((i) => i.area === "Trading Comps");
  const dcfIssues = issues.filter((i) => i.area === "DCF");

  if (total >= 90) {
    comments.push("Beau travail. Les valorisations tiennent, le modèle est lié de bout en bout et les contrôles passent. C'est envoyable en l'état.");
  }
  if (compsIssues.some((i) => i.title.includes("Médiane"))) {
    comments.push("Ta médiane EV/EBITDA FY27E ne tombe pas où je l'attends. Reprends les enterprise values des comparables avant de regarder la statistique elle-même.");
  }
  if (issues.some((i) => i.title.includes("Equity value implicite"))) {
    comments.push("Vérifie le bridge EV → equity des comps : les dettes de loyers doivent y figurer, comme dans les EV des comparables.");
  }
  if (issues.some((i) => i.title === "WACC")) {
    comments.push("Le WACC ne tombe pas juste. Contrôle le CAPM d'abord, puis la pondération : les poids sont en valeurs de marché et le coût de la dette est après impôt.");
  }
  if (issues.some((i) => i.title.includes("valeur terminale"))) {
    comments.push("La PV de la valeur terminale s'écarte de la référence. Attention à la convention mi-année : elle s'applique aussi à l'actualisation de la TV.");
  }
  if (issues.some((i) => i.title === "Equity value (DCF)")) {
    comments.push("L'enterprise value du DCF semble tenir, mais le bridge vers l'equity ne suit pas. Reprends les postes un par un.");
  }
  if (hardcoded > 0) {
    comments.push("Plusieurs sorties clés sont saisies en dur. Merci de les lier — je dois pouvoir changer une hypothèse et voir tout le modèle bouger.");
  }
  if (!checkOk) {
    comments.push("Le model check est encore rouge. Fais-le passer au vert avant de me renvoyer le fichier.");
  }
  if (dcfIssues.length > 3) {
    comments.push("Le DCF demande une reprise de fond : repars des UFCF et redescends la cascade étape par étape.");
  }
  if (comments.length === 0) {
    comments.push("L'ensemble tient la route. Regarde les points listés ci-dessous, ils sont mineurs mais valent le coup d'être repris.");
  }

  // Les erreurs les plus graves d'abord
  const rank = { critical: 0, major: 1, minor: 2 };
  issues.sort((a, b) => rank[a.severity] - rank[b.severity]);

  return {
    total, accuracy, integrity, completion, qc, speed,
    rating: ratingFor(total), comments, issues,
    checkedCells: checks.length, correctCells,
  };
}
