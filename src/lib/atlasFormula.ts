// ─── Classification des formules Excel ──────────────────────────────────────
// Une cellule peut contenir une formule sans pour autant être LIÉE au modèle.
//
//   =33.12      est une formule… mais économiquement identique à un hardcode
//   =TRUE       idem
//   ="OK"       idem
//   =D49        est un vrai lien
//
// Ce module répond à une seule question : cette formule dépend-elle réellement
// d'une autre cellule du classeur ? Il est volontairement CONSERVATEUR — en cas
// de doute, on répond non, quitte à sous-créditer plutôt que de laisser passer
// une fausse formule.
//
// Ce n'est pas un analyseur Excel complet : il n'a besoin de traiter que les
// formes rencontrées dans Project Atlas.

/** Retire les littéraux chaîne : "D49" ne doit jamais compter comme une référence. */
function stripStringLiterals(formula: string): string {
  // Les guillemets doublés ("" ) échappent un guillemet à l'intérieur d'une chaîne.
  return formula.replace(/"(?:[^"]|"")*"/g, '""');
}

/** Référence A1 : D49, $D$49, D$49, $D49 — éventuellement en plage. */
const A1_REF = /(?<![A-Za-z0-9_.])\$?[A-Za-z]{1,3}\$?\d{1,7}(?![A-Za-z0-9_(])/;

/** Référence à une autre feuille : Atlas_Raw!C21 ou 'Trading Comps'!D32 */
const SHEET_REF = /(?:'[^']+'|[A-Za-z_][A-Za-z0-9_.]*)\s*!\s*\$?[A-Za-z]{1,3}\$?\d{1,7}/;

/** Jetons alphabétiques isolés, candidats à être des noms définis. */
const NAME_TOKEN = /(?<![A-Za-z0-9_.!'])[A-Za-z_][A-Za-z0-9_.]{2,}(?!\s*\()/g;

export interface FormulaClassification {
  /** La formule référence-t-elle réellement une cellule, une plage ou un nom défini ? */
  linked: boolean;
  /** Raison de la classification, utile pour le débogage et les messages. */
  reason: "cell-reference" | "sheet-reference" | "defined-name" | "constant" | "unreadable";
}

/**
 * Classe une formule Excel.
 * @param formula texte de la formule, avec ou sans le « = » initial
 * @param definedNames noms définis RÉELLEMENT présents dans le classeur
 */
export function classifyFormula(
  formula: string | null | undefined,
  definedNames: readonly string[] = [],
): FormulaClassification {
  if (formula == null) return { linked: false, reason: "unreadable" };
  const raw = String(formula).trim().replace(/^=/, "");
  if (raw === "") return { linked: false, reason: "unreadable" };

  const body = stripStringLiterals(raw);

  // Une référence à une autre feuille est le signal le plus fort.
  if (SHEET_REF.test(body)) return { linked: true, reason: "sheet-reference" };

  // Référence de cellule ou de plage sur la feuille courante.
  if (A1_REF.test(body)) return { linked: true, reason: "cell-reference" };

  // Nom défini : uniquement s'il existe VRAIMENT dans le classeur. On ne prend
  // jamais un jeton alphabétique quelconque pour une référence.
  if (definedNames.length > 0) {
    const upper = new Set(definedNames.map((n) => n.toUpperCase()));
    for (const token of body.match(NAME_TOKEN) ?? []) {
      if (upper.has(token.toUpperCase())) return { linked: true, reason: "defined-name" };
    }
  }

  // Tout le reste — nombres, booléens, chaînes, arithmétique constante — est
  // économiquement équivalent à une saisie en dur.
  return { linked: false, reason: "constant" };
}

/** Raccourci booléen. */
export function formulaIsLinked(formula: string | null | undefined, definedNames: readonly string[] = []): boolean {
  return classifyFormula(formula, definedNames).linked;
}
