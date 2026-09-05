// ─── Heuristic answer grader (offline "AI coach") ───────────────────────────
// Quand le Coach IA est configuré, aiClient.ts prend le relais avec la même
// interface GradeResult — y compris les sous-scores technique/structure/concision.

export interface SubScores {
  technique: number; // couverture des concepts attendus
  structure: number; // réponse organisée (points, connecteurs, ordre)
  concision: number; // calibrage entretien (30-90 sec à l'oral)
}

export interface GradeResult {
  score: number; // 0-100
  sub: SubScores;
  hits: string[];
  misses: string[];
  redFlagsHit: string[];
  lengthFeedback: string | null;
  verdict: string;
  tips: string[];
}

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

/** A keyword matches if the answer contains it or one of its |-separated variants. */
function matchKeyword(answer: string, keyword: string): boolean {
  return keyword
    .split("|")
    .some((variant) => normalize(answer).includes(normalize(variant.trim())));
}

/** Structure : points numérotés, connecteurs logiques, paragraphes — comme un bon candidat. */
function structureScore(answer: string): number {
  let score = 40;
  if (/(^|\n)\s*(\d+[).]|[-•*])\s/m.test(answer)) score += 25; // listes / numérotation
  const connectors = /(d'abord|premièrement|ensuite|puis|enfin|donc|parce que|car|first|second|then|therefore|because|en résumé|conclusion)/gi;
  const found = answer.match(connectors)?.length ?? 0;
  score += Math.min(25, found * 8);
  if (answer.split(/\n\n|\n/).filter((l) => l.trim()).length >= 2) score += 10; // aération
  return Math.min(100, score);
}

export function gradeAnswer(
  answer: string,
  keywords: string[],
  opts?: {
    redFlags?: string[];
    idealLengthWords?: [number, number];
    clarifyOk?: boolean;
  }
): GradeResult {
  const words = answer.trim().split(/\s+/).filter(Boolean).length;
  const hits = keywords.filter((k) => matchKeyword(answer, k));
  const misses = keywords.filter((k) => !matchKeyword(answer, k));
  const redFlagsHit = (opts?.redFlags ?? []).filter((k) => matchKeyword(answer, k));

  const technique = keywords.length === 0 ? 70 : Math.round((hits.length / keywords.length) * 100);

  // Concision — interview answers should be tight
  let concision = 100;
  let lengthFeedback: string | null = null;
  const [min, max] = opts?.idealLengthWords ?? [30, 200];
  if (words > max * 1.6) {
    concision = 40;
    lengthFeedback = `Trop long (${words} mots). En entretien, vise ${min}–${max} mots : structure ta réponse en 2-3 points et arrête-toi.`;
  } else if (words > max * 1.2) {
    concision = 70;
    lengthFeedback = `Un peu long (${words} mots). Coupe ce qui ne change pas la conclusion.`;
  } else if (words < min * 0.4 && words > 0) {
    concision = 50;
    lengthFeedback = `Trop court (${words} mots). Développe : donne la réponse, puis le "pourquoi" en une phrase.`;
  }

  const structure = structureScore(answer);

  // Score global : la technique domine, structure et concision modulent.
  let score = Math.round(technique * 0.6 + structure * 0.2 + concision * 0.2);

  // Bullshit detection
  if (redFlagsHit.length > 0) score = Math.max(0, score - 20 * redFlagsHit.length);

  // Asking for clarification when appropriate
  const asksClarification = /clarif|preciser|pouvez-vous|could you|do you mean|quel type|which/i.test(answer);
  if (opts?.clarifyOk && asksClarification) score = Math.min(100, score + 15);

  const verdict =
    score >= 85
      ? "Niveau entretien. Réponse solide, structurée, crédible face à un Associate."
      : score >= 65
        ? "Bonne base, mais un recruteur creuserait. Compare avec la réponse modèle."
        : score >= 40
          ? "Des éléments justes, mais il manque des concepts clés. Revois la correction puis retente."
          : "Réponse insuffisante pour un entretien. Lis la réponse modèle, note les concepts manquants, et refais l'exercice demain.";

  const tips: string[] = [];
  if (misses.length > 0)
    tips.push(`Concepts manquants : ${misses.map((m) => m.split("|")[0]).join(", ")}.`);
  if (structure < 60)
    tips.push("Structure ta réponse : annonce le nombre de points (« trois raisons »), déroule-les, conclus en une phrase.");
  if (redFlagsHit.length > 0)
    tips.push(
      `⚠️ Signal négatif détecté (${redFlagsHit.map((m) => m.split("|")[0]).join(", ")}) : n'invente jamais en entretien. Dis plutôt "I'm not sure, but my intuition is…"`
    );
  if (score >= 85) tips.push("Entraîne-toi maintenant à la dire à voix haute en moins de 60 secondes.");

  return { score, sub: { technique, structure, concision }, hits, misses, redFlagsHit, lengthFeedback, verdict, tips };
}

/** Numeric answers: accept within tolerance. */
export function gradeNumeric(input: string, expected: number, tolerance = 0.01): boolean {
  const cleaned = input.replace(/[\s,€$%xX]/g, "").replace(",", ".");
  const val = parseFloat(cleaned);
  if (isNaN(val)) return false;
  const tol = Math.max(tolerance, Math.abs(expected) * 0.005);
  return Math.abs(val - expected) <= tol;
}
