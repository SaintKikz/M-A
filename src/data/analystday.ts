// ─── Analyst Day Simulator ──────────────────────────────────────────────────
// Une journée d'analyste chez une banque fictive : des tâches arrivent à des
// heures données, avec des urgences différentes. L'utilisateur priorise, puis
// exécute. Univers fictif, cohérent avec les autres modules.

export type TaskKind = "mcq" | "numeric" | "open" | "order";

export interface AnalystTask {
  id: string;
  time: string;              // heure d'arrivée
  from: string;              // qui demande
  role: "Associate" | "VP" | "MD" | "Analyste senior";
  subject: string;
  body: string;              // le message tel qu'il arrive
  deadline: string;          // échéance annoncée
  urgency: 1 | 2 | 3;        // 3 = à traiter en premier
  minutes: number;           // temps réaliste
  kind: TaskKind;
  // Contenu de la tâche
  question: string;
  choices?: string[];
  answer?: number;           // mcq
  numericAnswer?: number;    // numeric
  tolerance?: number;
  unit?: string;
  keywords?: string[];       // open
  modelAnswer: string;
  items?: string[];          // order : dans l'ordre CORRECT
  explanation: string;
  skill: string;
}

export interface DayScenario {
  id: string;
  title: string;
  difficulty: "Standard" | "Chargée" | "Journée de closing";
  intro: string;
  tasks: AnalystTask[];
}

export const SCENARIOS: DayScenario[] = [
  {
    id: "day1",
    title: "Mardi ordinaire — Kestrel & Co.",
    difficulty: "Standard",
    intro:
      "Tu es Summer Analyst chez Kestrel & Co., une banque d'affaires mid-cap. Deux dossiers tournent en parallèle : la cession d'Aurelia Software (sell-side, mandat signé) et une revue stratégique pour Nova Consumer. Ta journée commence à 9h. Les demandes arrivent au fil de l'eau — à toi de les prioriser puis de les traiter.",
    tasks: [
      {
        id: "t1", time: "09:15", from: "Camille Roussel", role: "Associate",
        subject: "Profil Aurelia pour 10h30",
        body: "Salut, il me faut un one-pager sur Aurelia Software pour la réunion de 10h30 avec le client. Le VP le veut avant de partir. Structure classique : business, financials, actionnariat, comps.",
        deadline: "10h30 — dans 75 minutes", urgency: 3, minutes: 12,
        kind: "order",
        question: "Dans quel ordre construis-tu ce one-pager pour être sûr de le livrer à temps ?",
        items: [
          "Vérifier s'il existe déjà un profil Aurelia dans les dossiers de l'équipe",
          "Rassembler les sources : dernier rapport annuel, communiqués, note de broker",
          "Remplir les financials et l'actionnariat (les données factuelles)",
          "Rédiger la description du business et les points clés",
          "Ajouter les comps depuis le fichier de valorisation existant",
          "Relire : chiffres croisés avec la source, unités, date de mise à jour",
        ],
        modelAnswer:
          "On commence TOUJOURS par chercher l'existant : un profil récent fait gagner 40 minutes. Ensuite les sources, puis les données factuelles (les plus rapides et les plus vérifiables), puis la rédaction, puis les comps qu'on reprend du fichier maître plutôt que de les recalculer, et enfin la relecture — jamais optionnelle, même sous contrainte de temps.",
        explanation:
          "Le réflexe qui distingue un bon analyste : ne jamais repartir de zéro sans avoir vérifié ce qui existe. Et la relecture reste dans le périmètre même quand c'est serré — un livrable faux livré à l'heure est pire qu'un livrable juste livré 5 minutes en retard.",
        skill: "Process",
      },
      {
        id: "t2", time: "10:05", from: "Thomas Meyer", role: "VP",
        subject: "MAJ valorisation Aurelia — nouvelle guidance",
        body: "Aurelia vient de publier : EBITDA 2026 attendu à 48 M€ au lieu de 44 M€. Peux-tu me donner l'EV implicite au multiple médian des comps (11,5x) et le prix par action ? Dette nette 120 M€, 25 M d'actions diluées.",
        deadline: "Avant 12h", urgency: 3, minutes: 8,
        kind: "numeric",
        question: "Quel est le prix par action implicite ? (EBITDA 48 M€ × 11,5x, dette nette 120 M€, 25 M d'actions)",
        numericAnswer: 17.28, tolerance: 0.05, unit: "€",
        modelAnswer:
          "EV = 48 × 11,5 = 552 M€. Equity value = 552 − 120 = 432 M€. Prix par action = 432 / 25 = 17,28 €.",
        explanation:
          "Le chemin est toujours le même : métrique × multiple = EV, puis on descend le bridge (− dette nette) pour arriver à l'equity value, puis on divise par les actions DILUÉES. L'erreur classique est de diviser l'EV par les actions.",
        skill: "Valuation",
      },
      {
        id: "t3", time: "11:30", from: "Camille Roussel", role: "Associate",
        subject: "3 acheteurs à ajouter à la long list",
        body: "Le client a cité trois noms hier soir. Peux-tu les ajouter à la buyer list et me dire dans quel tier tu les mets ? Le plus intéressant : Helvetia Life Sciences, qui a annoncé la semaine dernière vendre sa division diagnostic pour se recentrer sur le médicament.",
        deadline: "Fin de journée", urgency: 1, minutes: 10,
        kind: "mcq",
        question: "Helvetia Life Sciences annonce céder des actifs pour se recentrer. Dans quel tier le classes-tu ?",
        choices: [
          "Tier 1 — c'est un grand groupe avec une capacité financière énorme",
          "Tier 2 — la capacité est là, le fit est à confirmer",
          "Exclure — une société en phase de cession d'actifs n'est pas un acheteur",
          "Tier 3 — à contacter en second rideau au cas où",
        ],
        answer: 2,
        modelAnswer:
          "Exclure. Une société qui vend des actifs pour se recentrer ne va pas acquérir dans le domaine dont elle sort. Sa stratégie publique l'engage vis-à-vis de ses actionnaires.",
        explanation:
          "La capacité financière ne suffit jamais à faire un acheteur. Il faut la VOLONTÉ stratégique. Un groupe en plein recentrage qui achèterait dans l'activité qu'il quitte enverrait un signal contradictoire au marché — ça n'arrive pas.",
        skill: "M&A",
      },
      {
        id: "t4", time: "14:00", from: "Thomas Meyer", role: "VP",
        subject: "Nouveau scénario de merger — 42 €/action, 60% dette / 40% titres",
        body: "Le client veut voir l'accretion/dilution à 42 € par action, financé 60% par dette nouvelle (5,5%) et 40% en titres. Acquéreur : NI 100 M€, 100 M d'actions, cours 20 €. Cible : NI 28 M€, 20 M d'actions. Impôt 25%. Accretif ou dilutif ?",
        deadline: "16h", urgency: 2, minutes: 15,
        kind: "mcq",
        question: "Prix total = 42 € × 20 M = 840 M€. Financement : 504 M€ de dette à 5,5%, 336 M€ en titres (16,8 M d'actions nouvelles). L'opération est-elle accretive ?",
        choices: [
          "Accretive : le NI pro forma augmente plus vite que le nombre d'actions",
          "Dilutive : le coût du financement et les actions nouvelles dépassent l'apport de résultat",
          "Neutre : les deux effets se compensent exactement",
          "Impossible à dire sans connaître les synergies",
        ],
        answer: 1,
        modelAnswer:
          "Dilutive. NI pro forma = 100 + 28 − (504 × 5,5% × 0,75) = 100 + 28 − 20,8 = 107,2 M€. Actions pro forma = 100 + 16,8 = 116,8 M. EPS pf = 0,918 € contre 1,00 € standalone → environ −8% de dilution.",
        explanation:
          "Le test rapide : le yield de la cible (28/840 = 3,3%) est INFÉRIEUR au coût après impôt du financement mixte. Sur la part titres, on paie 30x les résultats (840/28) alors que l'acquéreur se traite à 20x — payer plus cher que son propre multiple dilue mécaniquement.",
        skill: "M&A",
      },
      {
        id: "t5", time: "16:30", from: "Camille Roussel", role: "Associate",
        subject: "Football field propre pour le deck",
        body: "Peux-tu transformer la valorisation mise à jour en football field pour le deck de demain ? Comps 10,5-12,5x, précédents 11,0-13,5x, DCF 15,80-19,40 €, 52 semaines 12,10-16,90 €.",
        deadline: "18h", urgency: 2, minutes: 12,
        kind: "open",
        question: "Le client demande : « pourquoi la fourchette des précédents est-elle au-dessus de celle des comps ? » Que réponds-tu ?",
        keywords: ["prime de contrôle|control premium|contrôle", "synergies", "transaction|acquisition|acquéreur", "marché|minoritaire|bourse"],
        modelAnswer:
          "Parce que les précédents intègrent une prime de contrôle. Un multiple de transaction reflète le prix payé pour prendre le CONTRÔLE d'une société, avec les synergies que l'acquéreur espère capter. Un multiple boursier reflète le prix d'une participation minoritaire sur le marché, sans contrôle ni synergies. L'écart entre les deux fourchettes est donc normal — il correspond à la prime de contrôle, typiquement 20 à 40%.",
        explanation:
          "C'est LA question de cross-check du football field. Si tes précédents étaient EN DESSOUS de tes comps, ce serait un signal d'alerte : soit les transactions retenues datent d'un cycle différent, soit ton échantillon est mauvais.",
        skill: "Valuation",
      },
      {
        id: "t6", time: "18:00", from: "Élisabeth Nadal", role: "MD",
        subject: "3 talking points avant l'appel client demain 8h",
        body: "J'appelle le CEO d'Aurelia demain matin. Donne-moi trois points sur la valorisation mise à jour. Court.",
        deadline: "Ce soir", urgency: 3, minutes: 10,
        kind: "open",
        question: "Rédige trois talking points pour le MD sur la valorisation Aurelia mise à jour (EBITDA 48 M€, 11,5x → 17,28 €/action).",
        keywords: ["48|ebitda|guidance", "11,5|11.5|multiple|comps", "17,28|17.3|17|prix|action", "prime|fourchette|dcf|croisement"],
        modelAnswer:
          "1) La révision de guidance à 48 M€ d'EBITDA relève mécaniquement la valorisation : au multiple médian des comps de 11,5x, l'EV ressort à 552 M€, soit 17,28 € par action après dette nette. 2) Cette valeur se situe dans la fourchette haute du DCF (15,80-19,40 €), ce qui conforte le niveau — les deux méthodes convergent. 3) Le point d'attention pour l'appel : la guidance est un engagement public, elle sera scrutée en due diligence — mieux vaut anticiper la question de sa crédibilité dès maintenant.",
        explanation:
          "Un MD veut : le chiffre, la validation croisée, et le risque. Dans cet ordre, en trois phrases. Pas de contexte, pas de méthodologie — il connaît. La troisième ligne est celle qui fait la différence entre un analyste qui exécute et un analyste qui pense.",
        skill: "Process",
      },
    ],
  },
  {
    id: "day2",
    title: "Jeudi sous tension — deux deals, une deadline",
    difficulty: "Chargée",
    intro:
      "Journée dense : les offres du premier tour sur Nova Consumer arrivent aujourd'hui, et un problème de modèle sort sur le dossier Orion. Tu vas devoir arbitrer entre l'urgent et l'important — et dire non à quelque chose.",
    tasks: [
      {
        id: "u1", time: "09:00", from: "Thomas Meyer", role: "VP",
        subject: "Le bilan ne balance plus dans le modèle Orion",
        body: "Le modèle Orion ne balance plus depuis hier soir : écart de 4,2 M€ à partir de l'année 3. On envoie au client vendredi. Trouve d'où ça vient.",
        deadline: "Aujourd'hui", urgency: 3, minutes: 20,
        kind: "order",
        question: "Comment débugges-tu un bilan qui ne balance pas à partir de l'année 3 ?",
        items: [
          "Identifier la PREMIÈRE période où l'écart apparaît (année 3, pas les suivantes)",
          "Vérifier que l'écart est constant ou croissant (constant = erreur ponctuelle, croissant = erreur récurrente)",
          "Contrôler que le cash final du tableau de flux alimente bien le bilan",
          "Vérifier les roll-forwards : PP&E, dette, retained earnings",
          "Isoler le poste dont la variation ne se retrouve pas dans le tableau de flux",
          "Corriger, puis vérifier que TOUTES les années balancent à nouveau",
        ],
        modelAnswer:
          "On remonte toujours à la première période fautive : les années suivantes ne font que propager l'erreur. Un écart constant pointe une erreur ponctuelle (un signe, un branchement), un écart croissant pointe une ligne récurrente mal reliée. Ensuite on contrôle les liens structurels dans l'ordre : cash → bilan, puis les roll-forwards, jusqu'à isoler le poste dont la variation n'a pas de contrepartie dans le CFS.",
        explanation:
          "Un bilan qui ne balance pas est presque toujours une variation de bilan qui n'a pas sa contrepartie dans le tableau de flux. La méthode compte plus que l'intuition : commencer par l'année 3 et pas par la fin fait gagner une heure.",
        skill: "Accounting",
      },
      {
        id: "u2", time: "10:45", from: "Camille Roussel", role: "Associate",
        subject: "Comparer les 4 IOI reçues",
        body: "On a reçu 4 offres indicatives sur Nova Consumer. Deux sont exprimées en enterprise value, deux en equity value. Fais-moi un tableau comparable pour 14h.",
        deadline: "14h", urgency: 3, minutes: 15,
        kind: "mcq",
        question: "L'offre A annonce « 420 M€ d'equity value », l'offre B « 480 M€ d'enterprise value ». Dette nette de Nova : 65 M€. Laquelle est la plus élevée ?",
        choices: [
          "L'offre B : 480 M€ est supérieur à 420 M€",
          "L'offre A : son EV implicite est de 485 M€, soit 5 M€ de plus que B",
          "Elles sont équivalentes une fois retraitées",
          "Impossible de comparer sans connaître le nombre d'actions",
        ],
        answer: 1,
        modelAnswer:
          "L'offre A. Son EV implicite = 420 + 65 = 485 M€, contre 480 M€ pour l'offre B. A est supérieure de 5 M€.",
        explanation:
          "Ne JAMAIS comparer des offres sans les ramener à la même base. C'est l'erreur qui fait recommander le mauvais acheteur. Et attention : chaque acheteur a sa propre définition de la dette nette dans sa lettre — il faut aussi normaliser ça.",
        skill: "EV/Equity",
      },
      {
        id: "u3", time: "13:20", from: "Élisabeth Nadal", role: "MD",
        subject: "Question rapide",
        body: "Dans le deck Nova, tu as retraité l'EBITDA de 3,1 M€ de « coûts de restructuration exceptionnels ». Le client dit qu'il y en a eu chaque année depuis 2022. Tu maintiens le retraitement ?",
        deadline: "Maintenant", urgency: 3, minutes: 8,
        kind: "open",
        question: "Que réponds-tu au MD ?",
        keywords: ["non|retirer|maintiens pas|supprimer", "récurrent|chaque année|répète", "exceptionnel|non récurrent", "ebitda|baisse|valorisation|prix"],
        modelAnswer:
          "Non, je retire le retraitement. Une charge présente chaque année depuis 2022 n'est pas exceptionnelle par définition — c'est un coût de fonctionnement. Le maintenir gonflerait artificiellement l'EBITDA de 3,1 M€, soit environ 33 M€ de valorisation à 10,5x, et se ferait démonter en due diligence par le QoE de l'acheteur. Je corrige le deck et je signale l'impact sur la fourchette de prix.",
        explanation:
          "Reconnaître son erreur immédiatement et en chiffrer l'impact vaut infiniment mieux que la défendre. Une erreur découverte par l'acheteur en due diligence coûte la crédibilité de TOUT le document — et donc du process.",
        skill: "Accounting",
      },
      {
        id: "u4", time: "15:00", from: "Julien Barré", role: "Analyste senior",
        subject: "Tu peux prendre mes comps ce soir ?",
        body: "Je suis noyé sur un autre dossier. Tu peux reprendre la mise à jour des comps du secteur consumer ce soir ? C'est pour lundi.",
        deadline: "Lundi", urgency: 1, minutes: 5,
        kind: "mcq",
        question: "Tu as déjà le modèle Orion à corriger pour vendredi et le tableau des IOI à finir. Que fais-tu ?",
        choices: [
          "J'accepte : refuser une demande d'un senior est mal vu",
          "Je refuse sèchement : ce n'est pas mon dossier",
          "J'accepte en disant ma charge actuelle et en proposant une heure de livraison réaliste",
          "Je ne réponds pas et je verrai si j'ai le temps ce soir",
        ],
        answer: 2,
        modelAnswer:
          "J'accepte en étant transparent : « Oui — j'ai le modèle Orion pour vendredi et les IOI pour 14h. Je peux attaquer tes comps vers 20h et te les envoyer demain matin. Ça marche, ou il y a plus urgent à arbitrer ? »",
        explanation:
          "Le pire comportement en banque n'est pas de dire non : c'est d'accepter et de livrer en retard sans prévenir. Annoncer sa charge et proposer un créneau réaliste montre qu'on sait gérer ses priorités. Ne pas répondre est la seule option vraiment disqualifiante.",
        skill: "Process",
      },
      {
        id: "u5", time: "17:40", from: "Thomas Meyer", role: "VP",
        subject: "Sensibilité prix / synergies pour le comité",
        body: "Pour le comité de demain : à partir de combien de synergies avant impôt l'opération Nova devient-elle relutive ? Acquéreur : NI 80 M€, 80 M d'actions, cours 25 €. Cible : NI 18 M€. Prix 500 M€, 100% dette à 6%, impôt 25%.",
        deadline: "Demain 9h", urgency: 2, minutes: 15,
        kind: "numeric",
        question: "Combien de synergies avant impôt faut-il, au minimum, pour que l'opération soit relutive ? (en M€)",
        numericAnswer: 6, tolerance: 0.3, unit: "M€",
        modelAnswer:
          "6 M€. EPS standalone = 80 / 80 = 1,00 €. En financement 100% dette, le nombre d'actions ne bouge pas : il suffit que le résultat net pro forma retrouve 80 M€. NI pf = 80 + 18 − (500 × 6% × 0,75) + 0,75 × S = 75,5 + 0,75S. On pose 75,5 + 0,75S = 80 → 0,75S = 4,5 → S = 6 M€ de synergies avant impôt.",
        explanation:
          "Piège de calcul : en financement 100% dette, les actions ne changent pas — il suffit que le résultat net pro forma retrouve son niveau standalone. Le coût de la dette après impôt (22,5 M€) dépasse le résultat apporté par la cible (18 M€) de 4,5 M€, qu'il faut combler avec 6 M€ de synergies avant impôt. Vérifie toujours ton résultat en reconstruisant l'EPS.",
        skill: "M&A",
      },
    ],
  },
];
