// ─── Parcours d'apprentissage ───────────────────────────────────────────────
// Chaque parcours assemble le contenu EXISTANT dans l'ordre où il devient
// utile pour un objectif donné. Aucun contenu propre : uniquement des liens
// vers les chapitres, outils et simulations déjà en place.

export interface PathStep {
  when: string;   // « J1-2 », « Semaine 1 », « 1 »…
  label: string;
  to: string;     // route interne
}

export interface LearningPath {
  id: string;
  emoji: string;
  title: string;
  audience: string;
  goal: string;
  hours: string;
  steps: PathStep[];
}

const s = (when: string, label: string, to: string): PathStep => ({ when, label, to });

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: "crash", emoji: "🚨", title: "Crash Course 14 jours",
    audience: "Tu commences ton stage très bientôt",
    goal: "Être fiable sur les fondamentaux et sur les tâches junior les plus probables.",
    hours: "18-24 h",
    steps: [
      s("J1-2", "Comptabilité & les 3 états", "/academy/c24"),
      s("J3", "EV ↔ Equity et multiples", "/academy/c41"),
      s("J4-5", "Comps et DCF", "/academy/c43"),
      s("J6", "Process M&A", "/academy/c51"),
      s("J7", "Purchase accounting", "/academy/c53"),
      s("J8", "Accretion / dilution", "/academy/c54"),
      s("J9", "Paper LBO", "/academy/c63"),
      s("J10", "Excel & modélisation", "/excel"),
      s("J11", "PowerPoint & contrôle qualité", "/quality-control"),
      s("J12-13", "Analyst Desk + cas", "/desk"),
      s("J14", "Analyst Day + Mistake Book", "/analystday"),
    ],
  },
  {
    id: "desk", emoji: "🏦", title: "Desk Ready 30 jours",
    audience: "Préparation complète avant le stage",
    goal: "Passer de la connaissance à l'exécution : calculer, construire, vérifier, communiquer.",
    hours: "40-55 h",
    steps: [
      s("Semaine 1", "Diagnostic + Académie niveaux 1-3", "/diagnostic"),
      s("Semaine 2", "Valorisation, DCF et calculateurs", "/tools"),
      s("Semaine 3", "M&A, LBO et Deal Room", "/dealroom"),
      s("Semaine 4", "Contrôle qualité + Analyst Day", "/analystday"),
    ],
  },
  {
    id: "interview", emoji: "🎤", title: "Maîtrise de l'entretien technique",
    audience: "Entretiens summer / off-cycle",
    goal: "Répondre vite, proprement et sans bluffer aux questions techniques et de fit.",
    hours: "20-30 h",
    steps: [
      s("1", "Diagnostic de départ", "/diagnostic"),
      s("2", "Red Book — Accounting / Valuation", "/redbook"),
      s("3", "DCF / M&A / LBO", "/path"),
      s("4", "Daily Drill + Mistake Book", "/drill"),
      s("5", "Interview Arena", "/arena"),
    ],
  },
  {
    id: "modeling", emoji: "🧮", title: "Maîtrise de la modélisation",
    audience: "Tests Excel et exercices de modeling",
    goal: "Maîtriser les mécaniques avant de construire des modèles complets.",
    hours: "25-40 h",
    steps: [
      s("1", "Excel : raccourcis et conventions", "/excel"),
      s("2", "Comptabilité et les 3 états", "/academy/c24"),
      s("3", "Calculateurs et sensibilités", "/tools"),
      s("4", "Mécanique du merger model", "/academy/c54"),
      s("5", "Mécanique du LBO", "/academy/c61"),
      s("6", "Contrôle qualité du modèle", "/quality-control"),
    ],
  },
  {
    id: "execution", emoji: "🤝", title: "Exécution M&A",
    audience: "Deal en cours / préparation de stage",
    goal: "Comprendre les documents, le process, les redlines et les demandes des seniors.",
    hours: "18-28 h",
    steps: [
      s("1", "Process de deal", "/academy/c51"),
      s("2", "Due diligence, SPA et mécanismes de prix", "/academy/c52"),
      s("3", "Les documents du deal", "/dealdocs"),
      s("4", "Buyer screening", "/screening"),
      s("5", "Analyst Desk", "/desk"),
      s("6", "Analyst Day", "/analystday"),
      s("7", "Contrôle qualité et commentaires", "/quality-control"),
    ],
  },
  {
    id: "pe", emoji: "🏗️", title: "Private Equity / LBO",
    audience: "Entretiens PE et deals sponsor",
    goal: "Passer du paper LBO au jugement d'investisseur.",
    hours: "15-25 h",
    steps: [
      s("1", "Mécanique du LBO", "/academy/c61"),
      s("2", "Returns et création de valeur", "/academy/c62"),
      s("3", "Paper LBO", "/academy/c63"),
      s("4", "Calculateur LBO returns", "/tools/lbo"),
      s("5", "Le secteur du PE", "/academy/c71"),
      s("6", "Cas sponsor", "/dealroom"),
    ],
  },
  {
    id: "europe", emoji: "🇪🇺", title: "France / Londres / Europe",
    audience: "Recrutement Paris et Londres",
    goal: "Ajouter les réflexes de M&A public et les sources réglementaires aux fondamentaux techniques.",
    hours: "10-15 h + le socle",
    steps: [
      s("1", "Process M&A — le socle", "/academy/c51"),
      s("2", "M&A public France / UE", "/public-mna"),
      s("3", "UK Takeover Code", "/public-mna"),
      s("4", "Deal Room", "/dealroom"),
      s("5", "Interview Arena", "/arena"),
    ],
  },
  {
    id: "us", emoji: "🇺🇸", title: "US Public M&A",
    audience: "Recrutement aux États-Unis",
    goal: "Savoir lire les filings SEC et y trouver ce qu'un banquier cherche vraiment.",
    hours: "10-15 h + le socle",
    steps: [
      s("1", "Process M&A — le socle", "/academy/c51"),
      s("2", "Filings SEC et documents de transaction", "/public-mna"),
      s("3", "Purchase accounting", "/academy/c53"),
      s("4", "Documents du deal", "/dealdocs"),
      s("5", "Deal Room", "/dealroom"),
    ],
  },
];
