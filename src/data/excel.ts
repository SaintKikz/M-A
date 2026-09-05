// ─── Excel pour la banque d'affaires ────────────────────────────────────────
// Raccourcis (Windows prioritaire — la norme sur les desks — + équivalent Mac),
// conventions de formatage banking et formules clés.

export interface ExcelShortcut {
  id: string;
  action: string;      // ce que ça fait
  win: string;
  mac: string;
  category: "Navigation" | "Sélection" | "Édition" | "Formatage" | "Formules & audit" | "Feuilles & fenêtre";
  why?: string;        // pourquoi un analyste s'en sert
}

const s = (id: string, category: ExcelShortcut["category"], action: string, win: string, mac: string, why?: string): ExcelShortcut =>
  ({ id, category, action, win, mac, why });

export const EXCEL_SHORTCUTS: ExcelShortcut[] = [
  // ── Navigation ──
  s("nav1", "Navigation", "Aller au bord de la plage de données", "Ctrl + Flèche", "Cmd + Flèche", "Se déplacer dans un modèle sans souris"),
  s("nav2", "Navigation", "Aller en A1", "Ctrl + Home", "Fn + Ctrl + ←", "Revenir au début d'un onglet"),
  s("nav3", "Navigation", "Aller à la dernière cellule utilisée", "Ctrl + End", "Fn + Ctrl + →"),
  s("nav4", "Navigation", "Atteindre une cellule / plage nommée", "F5 ou Ctrl + G", "Ctrl + G", "Sauter aux hypothèses ou aux checks"),
  s("nav5", "Navigation", "Onglet suivant / précédent", "Ctrl + PgDn / PgUp", "Option + → / ←", "Circuler entre IS, BS, CFS, DCF"),
  s("nav6", "Navigation", "Basculer entre classeurs ouverts", "Ctrl + Tab", "Cmd + `"),
  // ── Sélection ──
  s("sel1", "Sélection", "Étendre la sélection au bord de la plage", "Ctrl + Shift + Flèche", "Cmd + Shift + Flèche", "Sélectionner une ligne de projection entière en 1 geste"),
  s("sel2", "Sélection", "Sélectionner la ligne entière", "Shift + Espace", "Shift + Espace"),
  s("sel3", "Sélection", "Sélectionner la colonne entière", "Ctrl + Espace", "Ctrl + Espace"),
  s("sel4", "Sélection", "Sélectionner la région courante", "Ctrl + A", "Cmd + A", "Attraper tout un tableau de comps"),
  s("sel5", "Sélection", "Go To Special (constantes, formules, blancs…)", "F5 → Special", "Ctrl + G → Special", "Trouver les hardcodes cachés dans un modèle"),
  // ── Édition ──
  s("ed1", "Édition", "Éditer la cellule active", "F2", "Ctrl + U (ou F2)", "LE raccourci n°1 : lire une formule sans la casser"),
  s("ed2", "Édition", "Figer / basculer les références ($)", "F4", "Cmd + T (ou F4)", "Ancrer les hypothèses avant de tirer une formule"),
  s("ed3", "Édition", "Répéter la dernière action", "F4 (hors édition)", "Cmd + Y"),
  s("ed4", "Édition", "Recopier depuis la cellule du dessus", "Ctrl + D", "Cmd + D", "Tirer une formule vers le bas"),
  s("ed5", "Édition", "Recopier depuis la cellule de gauche", "Ctrl + R", "Cmd + R", "Tirer une projection sur l'axe des années"),
  s("ed6", "Édition", "Collage spécial", "Ctrl + Alt + V", "Cmd + Ctrl + V", "Coller en valeurs / formats — réflexe permanent"),
  s("ed7", "Édition", "Annuler / rétablir", "Ctrl + Z / Y", "Cmd + Z / Shift + Cmd + Z"),
  s("ed8", "Édition", "Rechercher / remplacer", "Ctrl + F / H", "Cmd + F / Ctrl + H", "Purger un lien externe ou renommer un onglet cité"),
  s("ed9", "Édition", "Insérer une ligne / colonne", "Ctrl + Shift + +", "Cmd + Shift + +"),
  s("ed10", "Édition", "Supprimer une ligne / colonne", "Ctrl + −", "Cmd + −"),
  s("ed11", "Édition", "Somme automatique", "Alt + =", "Cmd + Shift + T"),
  s("ed12", "Édition", "Entrer la même valeur dans toute la sélection", "Ctrl + Entrée", "Ctrl + Entrée"),
  // ── Formatage ──
  s("fmt1", "Formatage", "Boîte de dialogue Format de cellule", "Ctrl + 1", "Cmd + 1", "Tout le formatage passe par là"),
  s("fmt2", "Formatage", "Format pourcentage", "Ctrl + Shift + %", "Ctrl + Shift + %"),
  s("fmt3", "Formatage", "Format milliers (number)", "Ctrl + Shift + !", "Ctrl + Shift + !"),
  s("fmt4", "Formatage", "Format monétaire", "Ctrl + Shift + $", "Ctrl + Shift + $"),
  s("fmt5", "Formatage", "Gras", "Ctrl + B", "Cmd + B"),
  s("fmt6", "Formatage", "Bordure inférieure", "Alt + H, B, O", "—", "Souligner les sous-totaux"),
  s("fmt7", "Formatage", "Supprimer toutes les bordures", "Ctrl + Shift + _", "Cmd + Option + _"),
  s("fmt8", "Formatage", "Masquer la ligne / la colonne", "Ctrl + 9 / Ctrl + 0", "Ctrl + 9 / Ctrl + 0"),
  s("fmt9", "Formatage", "Grouper / dégrouper lignes ou colonnes", "Alt + Shift + → / ←", "Cmd + Shift + K / J", "Plier les schedules de support"),
  // ── Formules & audit ──
  s("aud1", "Formules & audit", "Afficher toutes les formules", "Ctrl + `", "Ctrl + `", "Revue rapide d'un onglet entier"),
  s("aud2", "Formules & audit", "Tracer les antécédents", "Ctrl + [", "Ctrl + [", "D'où vient ce chiffre ?"),
  s("aud3", "Formules & audit", "Tracer les dépendants", "Ctrl + ]", "Ctrl + ]", "Qui utilise cette cellule ?"),
  s("aud4", "Formules & audit", "Revenir à la cellule d'origine", "F5 + Entrée", "Ctrl + G + Entrée"),
  s("aud5", "Formules & audit", "Calculer le classeur", "F9", "F9 (ou Cmd + =)", "Indispensable en calcul manuel + circularités"),
  s("aud6", "Formules & audit", "Évaluer une partie de formule (en édition)", "F9 sur la sélection", "F9", "Déboguer un XLOOKUP imbriqué"),
  s("aud7", "Formules & audit", "Insérer une fonction", "Shift + F3", "Shift + F3"),
  s("aud8", "Formules & audit", "Nommer une plage", "Ctrl + F3", "Cmd + F3", "Des hypothèses lisibles : « TaxRate », pas « $C$4 »"),
  // ── Feuilles & fenêtre ──
  s("win1", "Feuilles & fenêtre", "Nouvelle feuille", "Shift + F11", "Shift + F11"),
  s("win2", "Feuilles & fenêtre", "Figer les volets", "Alt + W, F, F", "—", "Garder l'axe des années visible"),
  s("win3", "Feuilles & fenêtre", "Enregistrer", "Ctrl + S", "Cmd + S", "Toutes les 5 minutes. Sans exception."),
  s("win4", "Feuilles & fenêtre", "Imprimer / PDF", "Ctrl + P", "Cmd + P", "Le « clean PDF avant 19h » de l'Associate"),
  s("win5", "Feuilles & fenêtre", "Zoom sur la sélection", "Alt + W, G", "—"),
];

// ─── Conventions de formatage banking ───────────────────────────────────────
export interface Convention { rule: string; detail: string }
export const EXCEL_CONVENTIONS: Convention[] = [
  { rule: "Bleu = input", detail: "Toute hypothèse saisie à la main est en bleu. On doit voir en 2 secondes ce qui pilote le modèle." },
  { rule: "Noir = formule", detail: "Les calculs restent en noir. Jamais de hardcode dans une cellule noire — c'est LA faute qui fait perdre confiance." },
  { rule: "Vert = lien inter-onglets", detail: "Une cellule qui tire sa valeur d'un autre onglet est en vert (convention fréquente ; certains desks utilisent le vert pour les liens externes)." },
  { rule: "Rouge = lien externe / alerte", detail: "Liens vers d'autres classeurs (à éviter absolument dans un modèle partagé) et flags de checks." },
  { rule: "Un axe de temps unique", detail: "Mêmes colonnes = mêmes années sur tous les onglets. L'année N est TOUJOURS dans la même colonne." },
  { rule: "Assumptions / calculs / outputs séparés", detail: "Les hypothèses vivent dans une zone dédiée. Un onglet = un rôle. Pas d'hypothèse enterrée au milieu d'un schedule." },
  { rule: "Négatifs entre parenthèses", detail: "Format : 1 234 ; (1 234). Les coûts et sorties de cash sont négatifs, avec un signe cohérent partout." },
  { rule: "Zéros affichés « – »", detail: "Format nombre : # ##0;(# ##0);\"–\" pour garder les tableaux lisibles." },
  { rule: "Checks visibles", detail: "Balance check (Actif − Passif = 0), somme des % = 100%, flux de dette bouclé — en haut d'onglet, en rouge si ≠ 0." },
  { rule: "Formules courtes et tirables", detail: "Une formule = une idée, identique sur toute la ligne. Les monstres imbriqués se déboguent en réunion — mal." },
  { rule: "Pas de colonnes cachées piégées", detail: "On groupe (Alt+Shift+→) plutôt que masquer : ce qui est caché finit oublié — et faux." },
  { rule: "Unités affichées", detail: "M€ / k€ / %, précisé en titre de tableau. Une décimale pour les multiples (8,5x), zéro pour les montants." },
];

// ─── Formules clés pour l'analyste ──────────────────────────────────────────
export interface FormulaRef { name: string; syntax: string; use: string }
export const EXCEL_FORMULAS: FormulaRef[] = [
  { name: "XLOOKUP", syntax: "=XLOOKUP(clé; plage_clés; plage_résultats; [si_absent])", use: "Le standard moderne : tirer le prix d'un comp par ticker. Remplace VLOOKUP (fragile aux insertions de colonnes)." },
  { name: "INDEX + MATCH", syntax: "=INDEX(résultats; MATCH(clé; clés; 0))", use: "L'équivalent robuste historique — encore la norme sur beaucoup de desks. MATCH type 0 = correspondance exacte, toujours." },
  { name: "SUMIFS", syntax: "=SUMIFS(somme; critères1; c1; critères2; c2)", use: "Agréger un P&L par segment/année depuis un dump de données." },
  { name: "COUNTIFS", syntax: "=COUNTIFS(plage; critère; …)", use: "Compter les deals d'un screening qui passent les filtres." },
  { name: "IFERROR", syntax: "=IFERROR(calcul; \"n.m.\")", use: "Multiples non significatifs (EBITDA négatif) sans #DIV/0! dans le tableau. Ne JAMAIS masquer une vraie erreur de modèle avec." },
  { name: "EOMONTH", syntax: "=EOMONTH(date; n_mois)", use: "Construire un axe de dates trimestriel propre (fins de mois)." },
  { name: "YEARFRAC", syntax: "=YEARFRAC(début; fin; [base])", use: "Fractions d'années pour stub periods et calendarisation." },
  { name: "NPV / XNPV", syntax: "=XNPV(taux; flux; dates)", use: "XNPV pour des dates réelles (le NPV suppose des périodes égales ET décale d'un an — piège classique)." },
  { name: "IRR / XIRR", syntax: "=XIRR(flux; dates)", use: "Returns sponsor avec dates réelles d'entrée/sortie." },
  { name: "CHOOSE", syntax: "=CHOOSE(scénario; base; upside; downside)", use: "Le switch de scénarios : une cellule pilote tout le modèle." },
  { name: "OFFSET", syntax: "=OFFSET(ancre; lignes; colonnes)", use: "Plages dynamiques — puissant mais volatil et illisible : à documenter, souvent interdit par les standards (FAST)." },
  { name: "ROUND", syntax: "=ROUND(x; n)", use: "Arrondir un affichage SANS casser les checks (préférer le format d'affichage quand c'est possible)." },
  { name: "Data table (1 & 2 variables)", syntax: "Données → What-If → Table de données", use: "LA sensibilité WACC × g ou prix × synergies d'un deck. Ligne = variable 1, colonne = variable 2." },
  { name: "Goal Seek", syntax: "Données → What-If → Valeur cible", use: "« Quel prix pour 20% d'IRR ? » — la question préférée du VP." },
];

// ─── Erreurs Excel à reconnaître ────────────────────────────────────────────
export const EXCEL_ERRORS: { code: string; meaning: string; fix: string }[] = [
  { code: "#REF!", meaning: "Référence détruite (ligne/colonne supprimée)", fix: "Ctrl+Z immédiat, puis retrouver la source ; jamais de suppression de ligne sans vérifier les dépendants (Ctrl+])" },
  { code: "#VALUE!", meaning: "Type incompatible (texte dans un calcul)", fix: "Chercher la cellule texte dans la plage — souvent un espace ou un « n.a. » collé" },
  { code: "#DIV/0!", meaning: "Division par zéro (EBITDA nul, actions nulles)", fix: "Comprendre POURQUOI le dénominateur est nul avant d'emballer dans IFERROR" },
  { code: "#N/A", meaning: "Clé introuvable (lookup)", fix: "Vérifier la clé exacte (espaces, casse, ticker) ; MATCH type 0" },
  { code: "#NAME?", meaning: "Fonction ou nom inconnu", fix: "Faute de frappe ou plage nommée supprimée (Ctrl+F3 pour auditer les noms)" },
  { code: "Circularité", meaning: "Une cellule dépend d'elle-même (intérêts ↔ dette)", fix: "Soit itérations activées + interrupteur de circularité, soit calcul sur solde d'ouverture — mais TOUJOURS documenté" },
];
