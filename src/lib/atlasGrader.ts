// ─── Correction d'une soumission Project Atlas ──────────────────────────────
// Notation déterministe sur 100 points :
//   45 précision · 20 intégrité des formules · 15 complétion · 10 QC · 10 vitesse
//
// Principes de V4.1.1 :
//  • 141 cellules sont notées NUMÉRIQUEMENT (64 peers + 30 stats + 14 sorties
//    clés + 25 sensibilité + 8 synthèse), pas seulement « remplie / vide ».
//  • Le QC est RECALCULÉ ici. Les drapeaux TRUE/OK de l'onglet Checks de
//    l'utilisateur ne rapportent aucun point : ils sont seulement commentés.
//  • Une casse structurelle PLAFONNE le score, quelle que soit la précision.
//  • gradeAtlas() ne connaît rien de l'utilisateur : la certification officielle
//    est décidée séparément par evaluateAtlasCertification().

import {
  computeAtlasExpected, withinTolerance, atlasTolerances,
  allGradeTargets, ACCURACY_WEIGHTS, INTEGRITY_WEIGHTS,
  type GradeTarget, type ToleranceKind,
} from "../data/projectAtlas.ts";
import { REQUIRED_ANALYTICAL_SHEETS, SHEETS } from "../data/projectAtlasLayout.ts";
import type { ParsedAtlas, CellRead } from "./atlasWorkbook.ts";

export interface AtlasIssue {
  area: "Trading Comps" | "DCF" | "Valuation Summary" | "Model QC" | "Structure";
  title: string;
  detail: string;
  userValue?: string;
  expectedHint?: string;
  severity: "critical" | "major" | "minor";
  tag: string;
}

export interface QcRule { id: string; label: string; passed: boolean; detail?: string }

export interface AtlasScore {
  total: number;
  accuracy: number; integrity: number; completion: number; qc: number; speed: number;
  rating: string;
  comments: string[];
  issues: AtlasIssue[];
  /** Détail par groupe : combien de cellules justes sur combien. */
  groupStats: Record<GradeTarget["group"], { correct: number; total: number }>;
  /** Résultat des contrôles recalculés par le correcteur. */
  qcRules: QcRule[];
  /** Le classeur est-il, en lui-même, d'une qualité certifiable ? */
  certifiable: boolean;
  /** Ce qui empêche la certification (hors statut assisté). */
  blockers: string[];
  checkedCells: number;
  correctCells: number;
  cap: number | null;
}

const MAX = { accuracy: 45, integrity: 20, completion: 15, qc: 10, speed: 10 };

const eur = (v: number) => `${v.toFixed(2).replace(".", ",")} €`;
const meur = (v: number) => `${v.toFixed(0)} M€`;
const mult = (v: number) => `${v.toFixed(2).replace(".", ",")}x`;
const pct = (v: number) => `${(v * 100).toFixed(2).replace(".", ",")}%`;

function fmtFor(kind: ToleranceKind): (v: number) => string {
  return kind === "multiple" ? mult : kind === "percent" ? pct
    : kind === "perShare" || kind === "sensitivity" ? eur : meur;
}

/** Une cible est-elle juste ? (valeur dans la tolérance) */
function isCorrect(read: CellRead | undefined, t: GradeTarget): boolean {
  return read?.value != null && withinTolerance(read.value, t.expected, t.kind);
}

// ═══════════════════════════════════════════════════════════════════════════
//  PRÉCISION — chaque groupe est noté sur son propre budget de points
// ═══════════════════════════════════════════════════════════════════════════
export function gradeAccuracy(parsed: ParsedAtlas, targets: GradeTarget[]) {
  const groups = Object.keys(ACCURACY_WEIGHTS) as GradeTarget["group"][];
  const stats = {} as Record<GradeTarget["group"], { correct: number; total: number }>;
  let points = 0;

  for (const g of groups) {
    const inGroup = targets.filter((t) => t.group === g);
    const correct = inGroup.filter((t) => isCorrect(parsed.targets[t.id], t)).length;
    stats[g] = { correct, total: inGroup.length };
    if (inGroup.length > 0) points += (correct / inGroup.length) * ACCURACY_WEIGHTS[g];
  }
  return { points: Math.round(points), stats };
}

// ═══════════════════════════════════════════════════════════════════════════
//  INTÉGRITÉ — une valeur juste mais tapée en dur ne vaut que la moitié
// ═══════════════════════════════════════════════════════════════════════════
export function gradeIntegrity(parsed: ParsedAtlas, targets: GradeTarget[]) {
  const buckets: { keys: GradeTarget["group"][]; budget: number }[] = [
    { keys: ["peers"], budget: INTEGRITY_WEIGHTS.peers },
    { keys: ["stats"], budget: INTEGRITY_WEIGHTS.stats },
    { keys: ["compsImplied"], budget: INTEGRITY_WEIGHTS.compsImplied },
    { keys: ["dcfCore"], budget: INTEGRITY_WEIGHTS.dcfCore },
    { keys: ["summary"], budget: INTEGRITY_WEIGHTS.summary },
  ];
  let points = 0, hardcoded = 0, linked = 0;

  for (const b of buckets) {
    const inBucket = targets.filter((t) => b.keys.includes(t.group) && t.formulaExpected);
    if (inBucket.length === 0) continue;
    let earned = 0;
    for (const t of inBucket) {
      const read = parsed.targets[t.id];
      if (!isCorrect(read, t)) continue;      // la précision sanctionne déjà
      if (read?.hasFormula) { earned += 1; linked++; }
      else { earned += 0.5; hardcoded++; }    // juste mais non lié
    }
    points += (earned / inBucket.length) * b.budget;
  }

  // Les lignes du DCF construites par l'utilisateur (croissance, marge, EBIT…)
  const dcfFilled = parsed.dcfCells.filter((c) => !c.read.blank && !c.read.error);
  const dcfLinked = dcfFilled.filter((c) => c.read.hasFormula).length;
  if (dcfFilled.length > 0) {
    points += (dcfLinked / dcfFilled.length) * INTEGRITY_WEIGHTS.dcfRows;
    hardcoded += dcfFilled.length - dcfLinked;
  }

  return { points: Math.round(points), hardcoded, linked };
}

// ═══════════════════════════════════════════════════════════════════════════
//  COMPLÉTION — rempli et sans erreur, indépendamment de la justesse
// ═══════════════════════════════════════════════════════════════════════════
export function gradeCompletion(parsed: ParsedAtlas, targets: GradeTarget[]) {
  const filledIn = (g: GradeTarget["group"]) => {
    const inGroup = targets.filter((t) => t.group === g);
    const filled = inGroup.filter((t) => {
      const r = parsed.targets[t.id];
      return r && !r.blank && !r.error && (r.value !== null || r.text !== null);
    }).length;
    return inGroup.length ? filled / inGroup.length : 0;
  };
  // Le Summary pèse lourd : le laisser vide doit se voir.
  const parts = [
    { ratio: filledIn("peers"), weight: 0.35 },
    { ratio: filledIn("stats"), weight: 0.15 },
    { ratio: filledIn("dcfCore"), weight: 0.20 },
    { ratio: filledIn("sensitivity"), weight: 0.15 },
    { ratio: filledIn("summary"), weight: 0.15 },
  ];
  const ratio = parts.reduce((a, p) => a + p.ratio * p.weight, 0);
  return { points: Math.round(ratio * MAX.completion), parts };
}

// ═══════════════════════════════════════════════════════════════════════════
//  QC INDÉPENDANT — recalculé ici, jamais lu depuis l'onglet Checks
// ═══════════════════════════════════════════════════════════════════════════
export function evaluateIndependentQc(parsed: ParsedAtlas, targets: GradeTarget[]): QcRule[] {
  const E = computeAtlasExpected();
  const val = (id: string) => parsed.targets[id]?.value ?? null;
  const near = (a: number | null, b: number, tol = 0.02) =>
    a !== null && Number.isFinite(a) && Math.abs(a - b) <= Math.abs(b) * tol + 1e-6;

  const compsEv = val("core.impliedEv"), compsEq = val("core.impliedEquity");
  const dcfEv = val("core.dcfEv"), dcfEq = val("core.dcfEquity"), dcfPrice = val("core.dcfPrice");
  const wacc = val("core.wacc");

  // Un bridge « tient » si l'equity vaut bien l'EV moins la dette nette du cas.
  const bridgeGap = (ev: number | null, eq: number | null) => {
    if (ev === null || eq === null) return null;
    const implied = ev - (E.comps.impliedEv - E.comps.impliedEquity);
    return Math.abs(eq - implied);
  };

  const errorsIn = (sheet: string) => parsed.errorCells.filter((e) => e.sheet === sheet).length;
  const groupOk = (g: GradeTarget["group"], min: number) => {
    const inG = targets.filter((t) => t.group === g);
    const ok = inG.filter((t) => isCorrect(parsed.targets[t.id], t)).length;
    return inG.length > 0 && ok / inG.length >= min;
  };

  return [
    { id: "sheets", label: "Onglets analytiques présents", passed: parsed.missingSheets.length === 0,
      detail: parsed.missingSheets.join(", ") || undefined },
    { id: "names", label: "Noms définis résolus", passed: parsed.missingNames.length === 0,
      detail: parsed.missingNames.slice(0, 3).join(", ") || undefined },
    { id: "noErrorsComps", label: "Aucune erreur Excel dans Trading_Comps", passed: errorsIn(SHEETS.comps) === 0 },
    { id: "noErrorsDcf", label: "Aucune erreur Excel dans le DCF", passed: errorsIn(SHEETS.dcf) === 0 },
    { id: "compsBridge", label: "Bridge EV → equity des comps cohérent",
      passed: (bridgeGap(compsEv, compsEq) ?? Infinity) < Math.abs(E.comps.impliedEquity) * 0.02 },
    { id: "dcfBridge", label: "Bridge EV → equity du DCF cohérent",
      passed: (bridgeGap(dcfEv, dcfEq) ?? Infinity) < Math.abs(E.dcf.equityValue) * 0.02 },
    { id: "growthLtWacc", label: "Croissance à l'infini < WACC",
      passed: wacc !== null && wacc > 0.025 },
    { id: "positiveOutputs", label: "EV et prix par action strictement positifs",
      passed: dcfEv !== null && dcfEv > 0 && dcfPrice !== null && dcfPrice > 0 },
    { id: "statsValid", label: "Statistiques de comps exploitables", passed: groupOk("stats", 0.8) },
    { id: "sensValid", label: "Table de sensibilité cohérente", passed: groupOk("sensitivity", 0.8) },
    { id: "summaryFilled", label: "Synthèse de valorisation renseignée", passed: groupOk("summary", 0.6) },
    { id: "checksDynamic", label: "Contrôles du modèle pilotés par formule",
      passed: parsed.modelCheckHasFormula && parsed.checkFormulas.filter(Boolean).length >= 8 },
    { id: "cached", label: "Formules recalculées avant envoi", passed: !parsed.noCachedResults },
    { id: "peersReliable", label: "Calculs des comparables fiables", passed: groupOk("peers", 0.8) },
    { id: "dcfReliable", label: "Sorties clés du DCF fiables", passed: groupOk("dcfCore", 0.8) },
    // near() sert de garde-fou de lisibilité sur le prix comps
    { id: "compsPrice", label: "Prix implicite par comparables cohérent",
      passed: near(val("core.impliedPrice"), E.comps.impliedPrice, 0.05) },
  ];
}

export function gradeQc(rules: QcRule[]): number {
  const passed = rules.filter((r) => r.passed).length;
  return Math.round((passed / rules.length) * MAX.qc);
}

// ═══════════════════════════════════════════════════════════════════════════
//  VITESSE — sur le temps HORLOGE, pas sur le temps actif (cf. politique pause)
// ═══════════════════════════════════════════════════════════════════════════
export function speedScore(wallSeconds: number, targetMinutes = 90): number {
  if (!Number.isFinite(wallSeconds) || wallSeconds <= 0) return 0;
  const minutes = wallSeconds / 60;
  if (minutes <= targetMinutes) return MAX.speed;
  return Math.max(0, MAX.speed - Math.ceil((minutes - targetMinutes) / 15));
}

// ═══════════════════════════════════════════════════════════════════════════
//  PLAFONDS — une casse structurelle interdit un score élevé
// ═══════════════════════════════════════════════════════════════════════════
export function applyScoreCaps(raw: number, parsed: ParsedAtlas, qcRules: QcRule[],
  groupStats: AtlasScore["groupStats"]): { total: number; cap: number | null; blockers: string[] } {
  const blockers: string[] = [];
  let cap: number | null = null;
  const setCap = (c: number, why: string) => { cap = cap === null ? c : Math.min(cap, c); blockers.push(why); };

  const missingAnalytical = REQUIRED_ANALYTICAL_SHEETS.filter((s) => parsed.missingSheets.includes(s));
  if (missingAnalytical.length >= 2) setCap(40, `Onglets analytiques manquants : ${missingAnalytical.join(", ")}`);
  else if (missingAnalytical.length === 1) setCap(59, `Onglet analytique manquant : ${missingAnalytical[0]}`);

  if (parsed.noCachedResults) setCap(59, "Formules non recalculées : les résultats ne sont pas vérifiables");
  if (parsed.errorCells.length > 0) setCap(79, `${parsed.errorCells.length} cellule(s) en erreur Excel`);

  const ratio = (g: GradeTarget["group"]) =>
    groupStats[g].total ? groupStats[g].correct / groupStats[g].total : 0;

  if (ratio("peers") < 0.5) setCap(69, "Plus de la moitié des calculs de comparables sont faux");
  if (ratio("dcfCore") < 0.5) setCap(69, "Les sorties clés du DCF ne tiennent pas");
  if (ratio("summary") < 0.5) setCap(79, "La synthèse de valorisation est absente ou fausse");
  if (ratio("sensitivity") < 0.5) setCap(79, "La table de sensibilité ne réconcilie pas");

  const failedCritical = qcRules.filter((r) => !r.passed &&
    ["sheets", "compsBridge", "dcfBridge", "positiveOutputs", "cached"].includes(r.id));
  if (failedCritical.length > 0) setCap(79, `Contrôles qualité en échec : ${failedCritical.map((r) => r.label).join(", ")}`);

  // Les défaillances se CUMULENT : un classeur cassé sur plusieurs fronts ne doit
  // pas s'en tirer avec le plafond de la seule catégorie la plus haute.
  if (blockers.length >= 2 && cap !== null) {
    cap = Math.max(0, cap - 10 * (blockers.length - 1));
  }

  return { total: cap === null ? raw : Math.min(raw, cap), cap, blockers };
}

function ratingFor(total: number, certifiable: boolean): string {
  if (total >= 90 && certifiable) return "Associate-ready";
  if (total >= 90) return "Score élevé — certification bloquée";
  if (total >= 80) return "Solide pour un analyste";
  if (total >= 70) return "Bonne base — à revoir";
  if (total >= 60) return "Erreurs matérielles à corriger";
  return "Modèle à reconstruire";
}

// ═══════════════════════════════════════════════════════════════════════════
export interface GradeOptions { durationSeconds: number; targetMinutes?: number }

export function gradeAtlas(parsed: ParsedAtlas, opts: GradeOptions): AtlasScore {
  const E = computeAtlasExpected();
  const targets = allGradeTargets(E);
  const issues: AtlasIssue[] = [];
  const comments: string[] = [];

  const acc = gradeAccuracy(parsed, targets);
  const integ = gradeIntegrity(parsed, targets);
  const comp = gradeCompletion(parsed, targets);
  const qcRules = evaluateIndependentQc(parsed, targets);
  const qc = gradeQc(qcRules);
  const speed = speedScore(opts.durationSeconds, opts.targetMinutes ?? 90);

  const raw = acc.points + integ.points + comp.points + qc + speed;
  const capped = applyScoreCaps(raw, parsed, qcRules, acc.stats);
  const total = Math.max(0, Math.min(100, capped.total));

  // ─── Issues structurelles ─────────────────────────────────────────────────
  for (const s of parsed.missingSheets) {
    issues.push({ area: "Structure", title: `Onglet « ${s} » absent`,
      detail: "Le livrable ne peut pas être évalué sans cet onglet. Repars du modèle de départ.",
      severity: "critical", tag: "Model QC" });
  }
  if (parsed.noCachedResults) {
    issues.push({ area: "Structure", title: "Formules non recalculées",
      detail: "Le classeur contient des formules sans valeur calculée. Ouvre-le dans Excel, laisse recalculer, enregistre puis renvoie-le.",
      severity: "critical", tag: "Model QC" });
  }

  // ─── Issues de précision, regroupées pour ne pas noyer l'utilisateur ──────
  const wrong = targets.filter((t) => !isCorrect(parsed.targets[t.id], t));
  const byGroup = (g: GradeTarget["group"]) => wrong.filter((t) => t.group === g);

  // Comparables : on nomme les sociétés fautives, pas les 64 cellules
  const wrongPeers = [...new Set(byGroup("peers").map((t) => t.peer))].filter(Boolean) as string[];
  if (wrongPeers.length > 0) {
    const first = byGroup("peers")[0];
    issues.push({
      area: "Trading Comps",
      title: `${wrongPeers.length} comparable(s) ne réconcilient pas`,
      detail: `${wrongPeers.slice(0, 4).join(", ")}${wrongPeers.length > 4 ? "…" : ""} — reprends market cap, dette, dettes de loyers, minoritaires et trésorerie avant de calculer les multiples.`,
      userValue: first && parsed.targets[first.id]?.value != null ? fmtFor(first.kind)(parsed.targets[first.id]!.value!) : undefined,
      severity: wrongPeers.length > 3 ? "critical" : "major", tag: "Trading Comps",
    });
  }
  const wrongStats = byGroup("stats");
  if (wrongStats.length > 0) {
    issues.push({ area: "Trading Comps", title: `${wrongStats.length} statistique(s) sur 30 ne réconcilient pas`,
      detail: `Exemple : ${wrongStats[0].label}. Les statistiques se calculent sur la colonne de multiples correspondante — vérifie d'abord que les multiples eux-mêmes sont justes.`,
      severity: wrongStats.length > 10 ? "critical" : "major", tag: "Trading Comps" });
  }
  for (const t of byGroup("compsImplied").concat(byGroup("dcfCore"))) {
    const r = parsed.targets[t.id];
    const tol = atlasTolerances[t.kind];
    const f = fmtFor(t.kind);
    const lo = t.expected * (1 - (tol.rel ?? 0)) - (tol.abs ?? 0);
    const hi = t.expected * (1 + (tol.rel ?? 0)) + (tol.abs ?? 0);
    issues.push({
      area: t.group === "dcfCore" ? "DCF" : "Trading Comps", title: t.label,
      detail: r?.error ? `La cellule renvoie ${r.error}.`
        : r?.blank || r?.value == null ? "Cette sortie est vide : elle fait partie du livrable."
        : "La valeur ne tombe pas dans la fourchette attendue. Reprends le calcul en amont.",
      userValue: r?.error ?? (r?.value != null ? f(r.value) : "—"),
      expectedHint: r?.value != null ? `environ ${f(lo)} – ${f(hi)}` : undefined,
      severity: "major", tag: t.tag,
    });
  }
  const wrongSens = byGroup("sensitivity");
  if (wrongSens.length > 0) {
    issues.push({ area: "DCF", title: `${wrongSens.length} valeur(s) de sensibilité sur 25 ne réconcilient pas`,
      detail: wrongSens.length >= 20
        ? "La table est remplie mais ses valeurs ne correspondent pas aux hypothèses de WACC et de croissance. Reconstruis-la depuis le modèle."
        : `Exemple : ${wrongSens[0].label}. Vérifie que chaque cellule recalcule bien le prix avec le couple WACC / g de sa case.`,
      severity: wrongSens.length >= 13 ? "critical" : "major", tag: "DCF" });
  }
  const wrongSummary = byGroup("summary");
  if (wrongSummary.length > 0) {
    const blank = wrongSummary.every((t) => parsed.targets[t.id]?.blank);
    issues.push({ area: "Valuation Summary",
      title: blank ? "Synthèse de valorisation vide" : `${wrongSummary.length} sortie(s) de synthèse sur 8 ne réconcilient pas`,
      detail: blank
        ? "Valuation_Summary fait partie du livrable. Relie les fourchettes aux onglets d'analyse avant d'envoyer."
        : "Les fourchettes doivent découler des comparables (Q1 / médiane / Q3) et de la sensibilité du DCF.",
      severity: "critical", tag: "Valuation Summary" });
  }

  // ─── Issues d'intégrité et de QC ──────────────────────────────────────────
  if (integ.hardcoded > 0) {
    issues.push({ area: "Model QC", title: `${integ.hardcoded} sortie(s) saisie(s) en dur`,
      detail: "Le résultat est bon, mais la cellule contient un nombre et non une formule. Un modèle non lié ne bouge pas quand une hypothèse change.",
      severity: "major", tag: "Formula Integrity" });
  }
  const checksRule = qcRules.find((r) => r.id === "checksDynamic");
  if (checksRule && !checksRule.passed) {
    issues.push({ area: "Model QC", title: "Contrôles du modèle saisis en dur",
      detail: "Les drapeaux de l'onglet Checks doivent tester le modèle dynamiquement. Écrire TRUE ou OK à la main ne prouve rien — et ne rapporte aucun point.",
      severity: "major", tag: "Formula Integrity" });
  }
  for (const r of qcRules.filter((x) => !x.passed && !["checksDynamic", "sheets", "names"].includes(x.id))) {
    issues.push({ area: "Model QC", title: `Contrôle en échec : ${r.label}`,
      detail: r.detail ?? "Ce contrôle est recalculé par le correcteur à partir du contenu de ton classeur.",
      severity: "minor", tag: "Model QC" });
  }
  if (parsed.errorCells.length > 0) {
    const first = parsed.errorCells.slice(0, 3).map((e) => `${e.sheet}!${e.address} (${e.error})`).join(", ");
    issues.push({ area: "Model QC", title: `${parsed.errorCells.length} cellule(s) en erreur Excel`,
      detail: `${first}${parsed.errorCells.length > 3 ? "…" : ""}. Aucune erreur ne doit subsister dans un livrable.`,
      severity: "critical", tag: "Model QC" });
  }

  // ─── Certification du classeur (indépendamment du statut assisté) ─────────
  const criticalIssues = issues.filter((i) => i.severity === "critical");
  const blockers = [...capped.blockers];
  if (criticalIssues.length > 0) blockers.push(`${criticalIssues.length} problème(s) bloquant(s)`);
  if (total < 90) blockers.push("Score inférieur à 90");

  // « Associate-ready » veut dire : le livrable est JUSTE. Une seule valeur qui
  // ne réconcilie pas suffit à bloquer la certification — c'est exactement ce
  // qu'un Associate ferait avant d'envoyer le fichier à un client. Le score
  // brut, lui, reste élevé : les deux notions sont volontairement séparées.
  const correctAll = targets.filter((t) => isCorrect(parsed.targets[t.id], t)).length;
  const allCorrect = correctAll === targets.length;
  if (!allCorrect) blockers.push(`${targets.length - correctAll} cellule(s) sur ${targets.length} ne réconcilient pas`);

  const certifiable = total >= 90 && criticalIssues.length === 0 && capped.cap === null
    && qcRules.every((r) => r.passed) && allCorrect;
  if (!certifiable && qcRules.some((r) => !r.passed) && !blockers.some((b) => b.includes("qualité")))
    blockers.push("Contrôles qualité incomplets");

  // ─── Commentaires façon Associate ─────────────────────────────────────────
  if (certifiable) {
    comments.push("Beau travail. Les valorisations tiennent, le modèle est lié de bout en bout et mes contrôles passent. C'est envoyable en l'état.");
  }
  if (wrongPeers.length > 0)
    comments.push(`${wrongPeers[0]} ne tient pas. Reprends l'enterprise value avant de regarder les multiples — une EV fausse contamine les six colonnes.`);
  if (wrongStats.length > 0)
    comments.push("Tes statistiques ne réconcilient pas avec l'échantillon. Vérifie sur quelle plage tu les calcules.");
  if (byGroup("dcfCore").some((t) => t.id === "core.wacc"))
    comments.push("Le WACC ne tombe pas juste. Contrôle le CAPM d'abord, puis la pondération : poids en valeurs de marché, coût de la dette après impôt.");
  if (byGroup("dcfCore").some((t) => t.id === "core.pvTv"))
    comments.push("La PV de la valeur terminale s'écarte. Attention : la convention mi-année s'applique aussi à l'actualisation de la TV.");
  if (wrongSens.length >= 20)
    comments.push("La table de sensibilité est remplie, mais plusieurs valeurs ne réconcilient pas avec les hypothèses de WACC et de croissance.");
  if (wrongSummary.length > 0)
    comments.push("Valuation_Summary fait partie du livrable. Relie les fourchettes aux onglets d'analyse avant de me renvoyer le fichier.");
  if (integ.hardcoded > 0)
    comments.push("Plusieurs sorties clés sont saisies en dur. Merci de les lier : je dois pouvoir changer une hypothèse et voir tout le modèle bouger.");
  if (checksRule && !checksRule.passed)
    comments.push("Les drapeaux de contrôle sont écrits à la main. Ils doivent tester le modèle dynamiquement — sinon ils ne prouvent rien.");
  if (capped.cap !== null)
    comments.push(`Le score est plafonné à ${capped.cap} : ${capped.blockers[0].toLowerCase()}.`);
  if (comments.length === 0)
    comments.push("L'ensemble tient la route. Regarde les points listés ci-dessous avant de renvoyer.");

  const rank = { critical: 0, major: 1, minor: 2 };
  issues.sort((a, b) => rank[a.severity] - rank[b.severity]);

  return {
    total, accuracy: acc.points, integrity: integ.points, completion: comp.points, qc, speed,
    rating: ratingFor(total, certifiable),
    comments, issues, groupStats: acc.stats, qcRules,
    certifiable, blockers: [...new Set(blockers)],
    checkedCells: targets.length, correctCells: correctAll, cap: capped.cap,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
//  CERTIFICATION OFFICIELLE — dépend du classeur ET du contexte de la tentative
// ═══════════════════════════════════════════════════════════════════════════
export interface AttemptContext { assisted: boolean }

export interface CertificationResult {
  eligible: boolean;
  blockers: string[];
  /** Libellé de statut affiché à l'utilisateur. */
  label: string;
}

export function evaluateAtlasCertification(score: AtlasScore, ctx: AttemptContext): CertificationResult {
  const blockers = [...score.blockers];
  if (ctx.assisted) blockers.unshift("Tentative assistée (corrigé consulté)");
  const eligible = score.certifiable && !ctx.assisted;
  return {
    eligible, blockers: [...new Set(blockers)],
    label: eligible ? "Associate-ready"
      : ctx.assisted ? "Exercice assisté — ne compte pas pour le statut officiel"
      : score.rating,
  };
}
