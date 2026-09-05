import type { Chapter } from "./types";

// ═══════════════ NIVEAU 3 — CORPORATE FINANCE ═══════════════
export const CHAPTERS_L34: Chapter[] = [
  {
    id: "c31", level: 3, title: "La valeur du temps : actualisation, NPV, IRR", emoji: "⏳", minutes: 25, xp: 50,
    hook: "Un euro aujourd'hui vaut plus qu'un euro demain. Cette phrase banale est le moteur de TOUTE la valorisation.",
    simple: "Pourquoi préfères-tu 100 € aujourd'hui à 100 € dans un an ? Parce qu'aujourd'hui, tu peux les placer et avoir 105 € dans un an. Donc 100 € dans un an valent MOINS que 100 € maintenant — environ 95 € si les placements rapportent 5%.\n\nActualiser, c'est traduire des euros futurs en euros d'aujourd'hui : valeur présente = flux futur ÷ (1 + taux)ⁿ. Le taux d'actualisation rémunère trois choses : le temps (coût d'opportunité), l'inflation, et le RISQUE (plus le flux est incertain, plus on l'actualise fort).\n\nLa NPV (valeur actuelle nette) d'un projet = la somme de ses flux futurs actualisés, moins l'investissement initial. NPV positive = le projet rapporte plus que ce que le capital coûte : on y va. L'IRR (taux de rendement interne) est le taux qui annule la NPV — le « rendement annualisé » du projet.",
    analogy: "Ton ami te propose : « prête-moi 1 000 €, je t'en rends 1 200 dans 3 ans ». Bonne affaire ? 1 200 € dans 3 ans, actualisés à 8% (ton alternative en bourse, avec moins de risque de non-remboursement…), valent 1 200/1,08³ ≈ 953 €. Tu paierais 1 000 € pour recevoir l'équivalent de 953 € : NPV = −47 €. Refuse — ou négocie 1 300.",
    deep: "Formules à maîtriser : PV = CF/(1+r)ⁿ ; NPV = Σ CFₜ/(1+r)ᵗ − investissement ; et l'IRR est le r tel que NPV = 0. Règle de décision équivalente : NPV > 0 ⟺ IRR > taux d'actualisation.\n\nLes limites de l'IRR, qu'on adore te demander : elle suppose le réinvestissement des flux au même taux (irréaliste pour les IRR élevés), elle peut être multiple si les flux changent de signe plusieurs fois, et elle ignore la TAILLE (IRR de 50% sur 1 € < IRR de 20% sur 1 M€ en valeur créée). C'est pourquoi le private equity regarde toujours IRR ET multiple (MOIC).\n\nLa perpétuité — l'outil magique du DCF : un flux constant C perçu pour toujours vaut C/r ; s'il croît de g par an, il vaut C/(r−g). Cette petite formule valorisera la « terminal value » de tes futurs DCF — retiens-la dès maintenant.\n\nEnfin, les ordres de grandeur : diviser par (1,10)⁷ ≈ 2 — à 10%, un flux dans 7 ans vaut moitié moins. La règle des 72 (72 ÷ taux ≈ années pour doubler) rend ces intuitions instantanées.",
    traps: [
      "Comparer des flux à des dates différentes sans les actualiser : le péché originel de la finance.",
      "Une IRR seule ne suffit jamais : demande toujours « sur quel montant, pendant combien de temps ? »",
      "Dans C/(r−g), si g s'approche de r, la valeur explose : une croissance perpétuelle > au taux d'actualisation n'a pas de sens.",
      "Le taux d'actualisation n'est pas « choisi au hasard » : il reflète le RISQUE du flux (chapitres suivants).",
    ],
    mnaUse: "L'actualisation est le cœur du DCF (niveau 4). L'IRR est LA métrique du LBO (niveau 6). Et en entretien : « pourquoi actualise-t-on ? », « NPV vs IRR ? », « que vaut une perpétuité de 100 à 8% ? » (réponse : 1 250).",
    diagrams: [
      { type: "bridge", title: "NPV d'un projet (r = 10%)", unit: "", items: [
        { label: "Investissement", value: 250, kind: "base" }, { label: "PV flux an 1 (110)", value: 100, kind: "add" }, { label: "PV an 2 (121)", value: 100, kind: "add" }, { label: "PV an 3 (133)", value: 100, kind: "add" }, { label: "Valeur créée", value: 50, kind: "total" },
      ]},
    ],
    examples: [
      { title: "Exemple simple", body: "Machine à 250, qui rapporte 110, 121 et 133 sur 3 ans. À 10% : PV = 100 + 100 + 100 = 300. NPV = 300 − 250 = +50 → on investit. (Remarque l'astuce : chaque flux a été calibré pour valoir pile 100 actualisé.)" },
      { title: "Exemple réel", body: "Quand un fonds vise « 2x en 5 ans », il vise une IRR de 2^(1/5) − 1 ≈ 15%. Quand une biotech promet 500 M$ de ventes « dans 10 ans », à 12% d'actualisation, cela ne vaut « que » 161 M$ aujourd'hui — avant même la probabilité d'échec clinique." },
      { title: "Erreur fréquente", body: "« Ce projet rapporte 300 pour 250 investis, donc 20% de rendement. » Sur COMBIEN d'années ? 20% en un an est superbe ; étalé sur 10 ans, c'est ~1,8%/an — moins qu'un livret. Le temps EST la matière première du rendement." },
    ],
    quizIds: ["cf1", "cf2", "dc8"],
    extraQuiz: [
      { id: "xq-c31a", kind: "numeric", topic: "corp-finance", tags: ["tvm"], difficulty: 2,
        prompt: "Que vaut aujourd'hui une perpétuité de 80 par an, actualisée à 8% ? (formule C/r)",
        answer: 1000, unit: "€",
        explanation: "80 / 0,08 = 1 000. La formule de la perpétuité — que tu retrouveras dans chaque terminal value de DCF." },
    ],
    exercises: [
      { kind: "gap", title: "Les formules fondatrices", prompt: "Complète :", template: "PV = flux futur ÷ ◻\nPerpétuité croissante = C ÷ ◻", blanks: [
        { options: ["(1 + r)ⁿ", "(1 − r)ⁿ", "r × n"], correct: 0 },
        { options: ["(r − g)", "(r + g)", "g"], correct: 0 },
      ], explain: "Actualisation composée au dénominateur ; et pour la perpétuité croissante, l'écart r − g. Ces deux formules portent 80% de la valorisation." },
      { kind: "tf", title: "NPV & IRR", statements: [
        { text: "Si NPV > 0 au taux r, alors IRR > r.", answer: true, explain: "Les deux règles de décision sont équivalentes (pour des flux « normaux » : négatif puis positifs)." },
        { text: "Entre deux projets, il faut toujours choisir celui à l'IRR la plus élevée.", answer: false, explain: "L'IRR ignore la taille et la durée. 50% sur 1 € crée moins de valeur que 20% sur 1 M€. On compare les NPV." },
        { text: "À 10%, recevoir 100 dans 7 ans vaut environ 50 aujourd'hui.", answer: true, explain: "(1,1)⁷ ≈ 1,95 ≈ 2. Ordre de grandeur à connaître par cœur pour les calculs de tête." },
      ]},
    ],
    miniCase: {
      context: "Un promoteur te propose d'investir 400 dans un parking qui génèrera 30 de cash net par an, « pour toujours », avec une croissance des tarifs de 1%/an. Ton exigence de rendement pour ce niveau de risque : 7%.",
      task: "Valorise le parking avec la formule adaptée, calcule la NPV, et donne ta décision — puis dis à quel prix tu deviendrais acheteur.",
      hints: ["Perpétuité croissante : C/(r−g).", "Le « juste prix » est celui qui annule la NPV."],
      modelAnswer: "Valeur = 30 / (0,07 − 0,01) = 30 / 0,06 = 500. NPV = 500 − 400 = +100 → j'investis : le projet rapporte plus que mon exigence de 7%. Je reste acheteur jusqu'à 500 (NPV nulle : je gagne exactement mes 7%) ; au-delà, je détruis de la valeur. Bonus de lucidité : la sensibilité est énorme — à g = 0%, la valeur tombe à 429 ; à r = 8%, à 429 aussi. Un point de taux ou de croissance change 15% du prix : toujours tester ses hypothèses.",
      keywords: ["500", "100", "0,06|6%", "sensib|429|hypothèse", "7%|exigence"],
    },
  },

  {
    id: "c32", level: 3, title: "Risque et rendement : le CAPM et le beta", emoji: "🎲", minutes: 25, xp: 50,
    hook: "Quel taux pour actualiser les flux d'une action ? Le CAPM répond — et fournit la moitié du WACC du chapitre suivant.",
    simple: "Le rendement qu'exige un investisseur dépend du RISQUE qu'il prend. Mais quel risque ? Pas le risque total : le risque qu'on ne peut PAS éliminer en diversifiant.\n\nSi tu détiens 30 actions, la malchance de l'une compense la chance de l'autre : les risques propres à chaque entreprise (grève, rappel produit) s'annulent statistiquement. Ce qui reste, c'est le risque de MARCHÉ : récession, taux, crises — tout le portefeuille plonge ensemble. Seul ce risque « systématique » mérite rémunération.\n\nLe beta mesure la sensibilité d'une action à ce risque de marché : beta 1 = bouge comme le marché ; beta 1,5 = amplifie (quand le marché fait −10%, l'action tend vers −15%) ; beta 0,5 = amortit. D'où le CAPM : rendement exigé = taux sans risque + beta × prime de risque du marché.",
    analogy: "Assureur auto : il n'a pas peur de TON accident (des milliers de clients diversifient ce risque) — il a peur d'une tempête de grêle qui abîme toutes les voitures EN MÊME TEMPS. Il te fait payer pour le risque non diversifiable, pas pour ta malchance individuelle. Le marché fait pareil avec les actions.",
    deep: "Ke = Rf + β × ERP. Les ingrédients : Rf = taux des obligations d'État à 10 ans (le « sans risque ») ; ERP (equity risk premium) ≈ 5-6% historiquement — le supplément moyen exigé pour détenir des actions ; β = covariance de l'action avec le marché ÷ variance du marché, estimé par régression sur données historiques.\n\nQuels betas dans la vraie vie ? Utilities et agroalimentaire : 0,3-0,7 (demande stable). Marché : 1. Tech, luxe, cycliques : 1,2-2 (profits sensibles à la conjoncture). Le beta capture DEUX leviers : l'opérationnel (coûts fixes élevés = profits volatils) et le FINANCIER (la dette amplifie tout pour l'actionnaire).\n\nD'où la gymnastique clé pour la pratique : le beta observé d'une société cotée est « levered » (il contient son endettement). Pour l'appliquer à une AUTRE société, on le délève — βu = βl / [1 + (1−t) × D/E] — on prend la médiane des betas délevés des comparables, puis on relève avec la structure de capital de la cible. C'est LE procédé standard pour trouver le beta d'une société non cotée.",
    traps: [
      "Le CAPM ne rémunère PAS le risque diversifiable : « cette boîte est risquée donc beta élevé » est un raccourci faux si le risque est idiosyncratique.",
      "Beta ≠ volatilité : une action très volatile mais décorrélée du marché peut avoir un beta faible.",
      "Utiliser le beta brut d'un comparable sans le délever/relever : erreur classique de modèle (et d'entretien).",
      "Le CAPM est un modèle, pas une loi : ses inputs (ERP, beta historique) sont des estimations — d'où les fourchettes.",
    ],
    mnaUse: "Le CAPM donne le coût des capitaux propres — la moitié du WACC, donc un input direct de tout DCF. Questions d'entretien : « comment calcules-tu le cost of equity ? », « pourquoi délever le beta ? », « quel beta pour une utility vs une biotech ? »",
    diagrams: [
      { type: "flow", title: "Le CAPM en une chaîne", steps: [
        { label: "Taux sans risque", note: "OAT/Bund 10 ans" }, { label: "+ β × ERP", note: "risque systématique" }, { label: "= Ke", note: "rendement exigé equity" }, { label: "→ WACC", note: "chapitre suivant" },
      ]},
    ],
    examples: [
      { title: "Exemple chiffré", body: "Rf = 3%, ERP = 5,5%. Utility (β 0,6) : Ke = 3 + 0,6×5,5 = 6,3%. Groupe de luxe (β 1,3) : Ke = 3 + 1,3×5,5 = 10,2%. Les flux du luxe, plus cycliques, sont actualisés plus durement — à flux égal, l'entreprise vaut moins." },
      { title: "Délever/relever en pratique", body: "Comparable coté : βl 1,4, D/E 0,5, impôt 25%. βu = 1,4 / (1 + 0,75×0,5) = 1,02. Ta cible non cotée vise un D/E de 1 : βl cible = 1,02 × (1 + 0,75×1) = 1,79. Son cost of equity sera bien plus élevé — le levier concentre le risque sur l'actionnaire." },
      { title: "Erreur fréquente", body: "« Cette startup peut faire ×10 ou faire faillite : beta énorme. » Pas nécessairement : si son sort dépend de SA techno (risque spécifique), pas de l'économie, son beta peut être modeste. Son risque se gère par la diversification — et par la probabilité d'échec dans les flux, pas dans le taux." },
    ],
    quizIds: ["cf4", "cf5", "cf6"],
    exercises: [
      { kind: "gap", title: "La formule du CAPM", prompt: "Complète :", template: "Ke = ◻ + β × ◻", blanks: [
        { options: ["Taux sans risque (Rf)", "WACC", "Inflation"], correct: 0 },
        { options: ["Prime de risque marché (ERP)", "Taux d'impôt", "Croissance g"], correct: 0 },
      ], explain: "Ke = Rf + β × ERP. Trois ingrédients, des milliers de valorisations." },
      { kind: "tf", title: "Beta, bien compris", statements: [
        { text: "Un beta de 1,5 signifie que l'action tend à amplifier les mouvements du marché de 50%.", answer: true, explain: "C'est la définition : sensibilité au marché. Marché −10% → tendance à −15%." },
        { text: "La diversification élimine le risque de marché.", answer: false, explain: "Elle élimine le risque SPÉCIFIQUE. Le risque systématique frappe tout le portefeuille — c'est lui que le CAPM rémunère." },
        { text: "Plus une société est endettée, plus son beta (levered) est élevé.", answer: true, explain: "La dette amplifie les résultats pour l'actionnaire : le risque equity monte avec le levier — d'où le délevage/relevage." },
      ]},
    ],
    miniCase: {
      context: "Tu dois estimer le cost of equity d'Hexafibre, opérateur d'infrastructure fibre NON coté (D/E cible : 1,5 ; impôt 25%). Comparables cotés : βl moyens 0,8 avec D/E moyen 1,0. Rf = 3,2%, ERP = 5,5%.",
      task: "Déroule les 3 étapes (délever → relever → CAPM) avec les chiffres, et commente le niveau obtenu.",
      hints: ["βu = βl / [1+(1−t)D/E].", "Puis relève avec le D/E de 1,5."],
      modelAnswer: "1) Délever les comparables : βu = 0,8 / (1 + 0,75×1,0) = 0,46. 2) Relever au levier d'Hexafibre : βl = 0,46 × (1 + 0,75×1,5) = 0,97. 3) CAPM : Ke = 3,2% + 0,97 × 5,5% ≈ 8,5%. Commentaire : le risque BUSINESS de la fibre est faible (βu 0,46 — revenus contractés type infra), mais le levier élevé ramène le risque actionnaire vers celui du marché. C'est le profil typique de l'infrastructure : business tranquille, structure financière tendue.",
      keywords: ["0,46|0.46", "0,97|0.97|1,0", "8,5|8.5", "levier|amplifie", "infra|contract|stable"],
    },
  },

  {
    id: "c33", level: 3, title: "Le WACC : le coût du capital, assemblé", emoji: "🧪", minutes: 22, xp: 50,
    hook: "Le taux d'actualisation des DCF n'est pas choisi : il se CONSTRUIT. Voici la recette — et ses pièges d'entretien.",
    simple: "Une entreprise est financée par deux sources : la dette et les capitaux propres. Chacune a un coût : les créanciers exigent leur taux d'intérêt (Kd), les actionnaires leur rendement CAPM (Ke). Le WACC est simplement la moyenne PONDÉRÉE de ces deux coûts, selon le poids de chaque source.\n\nUne subtilité géniale : les intérêts de la dette sont déductibles de l'impôt. Payer 5% d'intérêts ne coûte « vraiment » que 5% × (1 − 25%) = 3,75% — l'État subventionne la dette. D'où la formule :\n\nWACC = (E/V) × Ke + (D/V) × Kd × (1 − t)\n\nC'est le rendement minimal que les actifs de l'entreprise doivent produire pour satisfaire TOUS ses financeurs — et donc le taux auquel on actualise les flux disponibles pour tous (l'UFCF du DCF).",
    analogy: "Tu achètes un appartement avec 40% d'apport (sur lequel tu veux du 8%, sinon tu resterais en bourse) et 60% de crédit à 4% (dont les intérêts seraient déductibles, disons 3% net). Ton « coût du financement » global : 0,4×8 + 0,6×3 = 5%. Si la location ne rapporte pas au moins 5%, l'opération détruit ta richesse. Le WACC, c'est ça, à l'échelle d'une entreprise.",
    deep: "Les règles d'or de la construction : (1) pondérations à la valeur de MARCHÉ (pas comptable) — la market cap pour E, la valeur de marché de la dette pour D ; (2) structure de capital CIBLE (normalisée), pas celle du jour ; (3) Kd = le taux auquel l'entreprise emprunterait AUJOURD'HUI (yield), pas le coupon historique ; (4) Ke via CAPM avec le beta relevé à la structure cible.\n\nPourquoi le WACC baisse-t-il (un peu) avec la dette ? La dette coûte moins cher (créancier prioritaire + tax shield). Mais trop de dette renchérit TOUT : le Kd (spread de crédit) et le Ke (beta relevé) montent, et les coûts de détresse apparaissent. La courbe du WACC en fonction du levier est en U : il existe une structure optimale — c'est la « trade-off theory », et une superbe question d'entretien.\n\nOrdres de grandeur 2024-2026 : grands groupes européens ~7-10% ; sociétés en croissance/risquées 10-14% ; infrastructure régulée 5-7%. Un WACC de 25% ou de 2% doit t'alerter.",
    traps: [
      "Pondérer aux valeurs comptables : l'erreur de modèle n°1. L'equity au bilan n'a rien à voir avec la market cap.",
      "Oublier le (1 − t) sur la dette — ou l'appliquer aussi au Ke (les dividendes ne sont pas déductibles !).",
      "Utiliser le coupon d'une dette émise il y a 5 ans : le coût pertinent est le taux de MARCHÉ actuel.",
      "« Plus de dette = WACC toujours plus bas » : faux au-delà d'un certain levier (détresse). La courbe est en U.",
    ],
    mnaUse: "Le WACC est LE taux du DCF (niveau 4) : ±0,5% de WACC déplace une valorisation de ±10%. En entretien : « walk me through the WACC », « pourquoi (1−t) ? », « que se passe-t-il si on ajoute de la dette ? » — trio incontournable.",
    diagrams: [
      { type: "bridge", title: "Assemblage d'un WACC (E/V = 60%, D/V = 40%)", unit: "%", items: [
        { label: "Ke pondéré (12%×0,6)", value: 7.2, kind: "base" }, { label: "+ Kd net (5%×0,75×0,4)", value: 1.5, kind: "add" }, { label: "WACC", value: 8.7, kind: "total" },
      ]},
    ],
    examples: [
      { title: "Calcul complet", body: "NovaTech : market cap 600, dette 400 (yield actuel 5%), impôt 25%, Ke 12% (CAPM). E/V = 60%, D/V = 40%. WACC = 0,6×12% + 0,4×5%×0,75 = 7,2% + 1,5% = 8,7%. C'est le taux qui actualisera ses UFCF au niveau 4." },
      { title: "Exemple réel", body: "Une utility régulée (beta 0,5, moitié dette pas chère) a un WACC ~6% : elle peut investir dans des projets à 7% de rendement et créer de la valeur. Une medtech en croissance (WACC 11%) doit trouver des projets bien plus rentables : le coût du capital est un filtre à projets." },
      { title: "Erreur fréquente", body: "Actualiser l'UFCF au cost of equity « parce que c'est pour les actionnaires ». Non : l'UFCF sert TOUS les financeurs → WACC. Le cost of equity actualise les flux APRÈS dette (levered FCF ou dividendes). La cohérence flux/taux est sacrée." },
    ],
    quizIds: ["cf3", "cf7", "va12"],
    exercises: [
      { kind: "gap", title: "La formule sacrée", prompt: "Complète le WACC :", template: "WACC = (E/V) × ◻ + (D/V) × Kd × ◻", blanks: [
        { options: ["Ke (cost of equity)", "ERP", "g"], correct: 0 },
        { options: ["(1 − taux d'impôt)", "(1 + taux d'impôt)", "beta"], correct: 0 },
      ], explain: "Moyenne pondérée des deux coûts, avec le tax shield sur la seule dette. À réciter les yeux fermés." },
      { kind: "tf", title: "Le WACC en situations", statements: [
        { text: "On pondère E et D à leur valeur de marché.", answer: true, explain: "La book value de l'equity est une relique comptable ; les financeurs raisonnent en valeur de marché." },
        { text: "Si le taux sans risque monte, le WACC monte (toutes choses égales).", answer: true, explain: "Rf entre dans le Ke (CAPM), et les yields de dette suivent : tout le WACC se déplace avec les taux — d'où la sensibilité des valorisations aux banques centrales." },
        { text: "Le WACC d'une entreprise est le même pour tous ses projets.", answer: false, explain: "Un projet plus risqué que le cœur de métier mérite un taux plus élevé. Utiliser le WACC « maison » pour tout est un biais connu (on surinvestit dans le risqué)." },
      ]},
    ],
    miniCase: {
      context: "Ton associate te tend un modèle où le WACC de la cible (distribution alimentaire, stable) sort à 13,4%. Tu ouvres l'onglet : Ke calculé avec le beta BRUT d'un comparable très endetté (βl 2,1), pondérations aux valeurs COMPTABLES (E = 200 au bilan vs market cap 800), Kd = coupon 2019 de 2% sans (1−t).",
      task: "Liste les 3 erreurs, corrige le WACC (Rf 3%, ERP 5,5%, D marché = 400, Kd actuel 4,5%, impôt 25%, βu comparable ≈ 0,7, D/E cible ≈ 0,5) et dis l'impact sur la valorisation.",
      hints: ["Relève βu 0,7 au D/E de 0,5.", "E/V et D/V à la valeur de marché : 800 et 400."],
      modelAnswer: "Erreurs : (1) beta non délevé — on relève βu 0,7 : βl = 0,7×(1+0,75×0,5) = 0,96 → Ke = 3% + 0,96×5,5% ≈ 8,3% ; (2) pondérations comptables — en marché : E/V = 800/1200 = 67%, D/V = 33% ; (3) Kd historique et sans tax shield — Kd net = 4,5%×0,75 = 3,4%. WACC corrigé = 0,67×8,3% + 0,33×3,4% ≈ 6,7% — contre 13,4% ! À flux identiques, la valorisation va quasiment DOUBLER : un WACC deux fois trop élevé écrasait la valeur. Moralité : le WACC se construit, chaque input se justifie.",
      keywords: ["0,96|0.96", "8,3|8.3", "67|1200", "3,4|3.4", "6,7|6.7", "double|écras"],
    },
  },

  {
    id: "c34", level: 3, title: "Structure du capital, levier et création de valeur", emoji: "🏛️", minutes: 22, xp: 50,
    hook: "Combien de dette une entreprise « devrait »-elle avoir ? Et qu'est-ce qui crée vraiment de la valeur ? Deux questions, un chapitre.",
    simple: "Le levier (leverage), c'est utiliser la dette pour amplifier les rendements de l'equity. Exemple : un actif de 100 rapporte 10 (10%). Financé 100% en equity : l'actionnaire gagne 10%. Financé 50/50 avec une dette à 4% : l'actionnaire investit 50, gagne 10 − 2 d'intérêts = 8, soit 16% ! Magique ? Non : si l'actif ne rapporte que 2, l'actionnaire gagne 2 − 2 = 0%. Le levier amplifie DANS LES DEUX SENS.\n\nCombien de dette, alors ? La dette est moins chère (tax shield, priorité) mais trop de dette crée un risque de détresse (faillite, clients qui fuient, talents qui partent). L'arbitrage entre les deux définit une structure « optimale » — différente pour chaque business : stable = beaucoup de dette possible (utilities, infra) ; cyclique ou en croissance = prudence.\n\nEt la création de valeur ? Une règle simple : une entreprise crée de la valeur quand le rendement de son capital investi (ROIC) dépasse son coût du capital (WACC). Croître avec un ROIC < WACC détruit de la valeur — grandir n'est pas une fin en soi.",
    analogy: "Le levier, c'est l'immobilier locatif : 20% d'apport, 80% de crédit. Si le bien prend 10%, ton apport fait ×1,5. S'il perd 10%, ton apport fait −50%. Même bien, même marché : c'est la structure de financement qui a transformé ton profil de risque.",
    deep: "Le cadre théorique en deux phrases : Modigliani-Miller montrent que DANS UN MONDE PARFAIT (sans impôts ni coûts de faillite), la structure de capital ne change pas la valeur de l'entreprise — la taille du gâteau ne dépend pas de la découpe. Dans le monde réel, deux « imperfections » comptent : le tax shield (qui favorise la dette) et les coûts de détresse (qui la limitent) → la trade-off theory et son optimum intérieur.\n\nROIC = NOPAT / capital investi. Le pont avec la valorisation est direct : une entreprise dont le ROIC = WACC vaut exactement son capital investi, quelle que soit sa croissance ; ROIC > WACC : chaque euro réinvesti vaut plus d'un euro (la croissance devient précieuse) ; ROIC < WACC : la croissance accélère la destruction. C'est pourquoi les marchés paient si cher les business à ROIC élevé et réinvestissement abondant (luxe, logiciels).\n\nSignaux pratiques du levier : dette nette/EBITDA (< 2x confortable, 4-6x territoire LBO), couverture des intérêts (EBIT/intérêts > 3-4x attendu). Un bilan « paresseux » (zéro dette, cash qui dort) est d'ailleurs une cible d'activistes et de fonds de LBO — sous-utiliser le levier a aussi un coût.",
    traps: [
      "« La dette c'est mal » : non — c'est un outil. Son bon usage dépend de la stabilité des cash flows.",
      "« La croissance crée de la valeur » : seulement si ROIC > WACC. La croissance à ROIC faible détruit (cf. Kraft Heinz, à l'envers).",
      "Le levier ne change pas la qualité de l'ACTIF : il redistribue le risque entre financeurs.",
      "Comparer les ROE de deux sociétés sans regarder leur levier : un ROE gonflé à la dette n'est pas de la performance.",
    ],
    mnaUse: "Le niveau 6 (LBO) est ce chapitre poussé à l'extrême. En entretien : « pourquoi pas 100% de dette ? », « ROIC vs WACC ? », « un buyback crée-t-il de la valeur ? » (réponse fine : il en TRANSFÈRE, sauf si l'action est sous-évaluée ou le cash détruisait de la valeur).",
    diagrams: [
      { type: "stack", title: "Même actif, deux structures", stacks: [
        { name: "Prudente", layers: [{ label: "Dette 30", note: "Kd 4%" }, { label: "Equity 70", note: "risque modéré" }] },
        { name: "Levée (type LBO)", layers: [{ label: "Dette 70", note: "Kd 6%" }, { label: "Equity 30", note: "rendements amplifiés ↑↓" }] },
      ]},
    ],
    examples: [
      { title: "Le levier chiffré", body: "Actif 100, EBIT 10. Structure A (0 dette) : retour actionnaire 10/100 = 10%. Structure B (dette 60 à 5%) : profit equity = 10 − 3 = 7 sur 40 investis = 17,5%. Mauvaise année (EBIT 4) : A fait 4% ; B fait (4−3)/40 = 2,5%. Très mauvaise année (EBIT 2) : A fait 2% ; B est à −2,5% — en perte. Amplification, dans les deux sens." },
      { title: "ROIC vs WACC en vrai", body: "Hermès : ROIC > 25% pour un WACC ~8% — chaque euro réinvesti (boutiques, capacités) crée plusieurs euros de valeur : le marché paie 25x+ l'EBITDA. Un distributeur à ROIC 7% pour un WACC de 8% : sa croissance détruit — le marché le paie 6x. Le multiple EST une opinion sur l'écart ROIC − WACC." },
      { title: "Erreur fréquente", body: "« L'entreprise n'a aucune dette, c'est un signe de santé exemplaire. » Peut-être — ou un bilan sous-optimisé qui attire les LBO : un fonds peut l'acheter, l'endetter, et se servir du tax shield qu'elle refusait de capter." },
    ],
    quizIds: ["cf8", "cm3", "lb8"],
    exercises: [
      { kind: "tf", title: "Levier et valeur", statements: [
        { text: "Le levier augmente l'espérance de rendement de l'equity ET son risque.", answer: true, explain: "Amplification symétrique : c'est le théorème central du chapitre — et du LBO." },
        { text: "D'après Modigliani-Miller (monde parfait), plus de dette augmente la valeur de l'entreprise.", answer: false, explain: "Dans le monde SANS impôts ni détresse, la structure est neutre. C'est le tax shield (réel) qui donne l'avantage à la dette — jusqu'aux coûts de détresse." },
        { text: "Croître avec un ROIC inférieur au WACC détruit de la valeur.", answer: true, explain: "Chaque euro réinvesti rapporte moins qu'il ne coûte. La croissance n'est vertueuse que si ROIC > WACC." },
      ]},
      { kind: "order", title: "La cascade du raisonnement valeur", prompt: "Remets la logique dans l'ordre :", items: ["L'entreprise investit du capital", "Le capital génère un rendement (ROIC)", "On compare le ROIC au coût du capital (WACC)", "ROIC > WACC : la croissance crée de la valeur", "Le marché paie un multiple élevé"], explain: "Capital → ROIC → comparaison au WACC → valeur de la croissance → multiple. La chaîne qui explique pourquoi deux entreprises au même EBITDA ne valent pas pareil." },
    ],
    miniCase: {
      context: "Le CEO d'un groupe familial (EBIT 50, zéro dette, cash 100 qui dort à 2%, ROIC opérationnel 15%, WACC 9%) te demande : « un fonds nous dit que notre bilan est « paresseux » et qu'on devrait nous endetter pour racheter nos actions. Qu'en penses-tu ? »",
      task: "Réponds en 5-6 phrases nuancées : les arguments POUR une releverage, les limites, et ta recommandation.",
      hints: ["Que rapporte le cash vs ce qu'il coûte (WACC) ?", "La priorité : y a-t-il des projets à ROIC 15% à financer d'abord ?"],
      modelAnswer: "Le fonds n'a pas tort sur le diagnostic : 100 de cash rapportant 2% pour un coût du capital de 9% détruit ~7 de valeur par an — et zéro dette signifie zéro tax shield. Mais l'ordre des priorités compte : si le groupe a des projets à ROIC 15% (> WACC 9%), chaque euro doit d'abord y aller — c'est la meilleure création de valeur possible. Ensuite seulement, pour le capital SANS emploi productif : une dette modérée (ex. 1,5-2x EBITDA, très soutenable avec ces cash flows) finançant un retour aux actionnaires est créatrice de valeur — à condition de garder un matelas pour les crises et les opportunités d'acquisition. Ma reco : plan d'investissement d'abord, structure cible ensuite, distribution du surplus enfin — et ne pas laisser un tiers dicter le tempo.",
      keywords: ["2%.*9%|détruit", "tax shield", "roic 15|projets d'abord|investir", "1,5|2x|modérée", "matelas|crise|opportunité"],
    },
  },

  // ═══════════════ NIVEAU 4 — VALORISATION ═══════════════
  {
    id: "c41", level: 4, title: "Enterprise Value vs Equity Value : LE chapitre", emoji: "🌉", minutes: 30, xp: 60,
    hook: "S'il ne fallait maîtriser qu'UN concept pour les entretiens, ce serait celui-ci. Prends ton temps : tout le reste s'appuie dessus.",
    simple: "Définition : l'Enterprise Value (EV) est la valeur des OPÉRATIONS de l'entreprise — la machine complète — revenant à TOUS ses financeurs. L'Equity Value est la part de cette valeur revenant aux SEULS actionnaires.\n\nLe pont entre les deux : EV = Equity Value + dette nette (dette − cash). Pourquoi ? Si tu achètes la maison (la machine), tu paies l'apport du propriétaire (equity) ET tu reprends son crédit (dette) ; et si tu trouves des billets dans le tiroir (cash), ils réduisent ton coût réel.\n\nAnalogie canonique : maison 500 k€ avec 300 k€ de crédit → la maison = EV (500), la part du propriétaire = equity (200). Le prix de la maison ne change pas selon comment elle est financée — l'EV est INDÉPENDANTE de la structure de capital. C'est sa grande force.",
    analogy: "La maison et le crédit — à réciter en entretien : « une maison de 500 k€ financée par 300 k€ de crédit et 200 k€ d'apport : l'EV c'est la maison, l'Equity Value c'est l'apport. Racheter la maison, c'est payer l'apport ET reprendre (ou rembourser) le crédit. »",
    deep: "La version complète du bridge : EV = Equity Value + dette + minoritaires + actions préférentielles + provisions « debt-like » (pensions sous-financées, dette de leasing) − cash − actifs non opérationnels (participations mises en équivalence, immobilier hors exploitation).\n\nLes deux justifications à connaître PAR CŒUR pour le cash : (1) transactionnelle — l'acquéreur récupère le cash, qui réduit le coût net ; (2) cohérence — l'EV se compare à des métriques OPÉRATIONNELLES (EBITDA, EBIT, UFCF) qui n'incluent pas les produits financiers du cash : même périmètre au numérateur et au dénominateur.\n\nMême logique pour les minoritaires : l'EBITDA consolidé inclut 100% des filiales contrôlées (même détenues à 80%) → l'EV doit inclure la part des 20% qui ne t'appartiennent pas. Miroir inverse pour les associates (participations 20-50%, mises en équivalence) : leur résultat n'est PAS dans l'EBITDA → on les retire de l'EV.\n\nL'Equity Value d'une cotée = cours × nombre d'actions DILUÉ (options in-the-money via treasury stock method, convertibles). Et les conséquences à intégrer : l'EV ne change ni quand on lève de la dette qui reste en cash, ni lors d'un buyback (cash ↓ = equity ↓) ; l'Equity Value peut dépasser l'EV (cash net positif) ; l'EV peut même être négative (cas extrêmes).",
    traps: [
      "EV/Net income : multiple incohérent (numérateur pour tous, dénominateur pour les seuls actionnaires). Éliminatoire.",
      "« Lever de la dette augmente l'EV » : non — dette +100, cash +100, dette NETTE inchangée.",
      "Oublier la dilution dans l'equity value : les options in-the-money comptent.",
      "Oublier les debt-like items (pensions, leases) dans un bridge sérieux : c'est là que les pros font la différence.",
    ],
    mnaUse: "Le bridge structure TOUT : les multiples (EV/EBITDA vs P/E), le DCF (UFCF → EV → bridge → equity), les ajustements de prix en M&A (le prix se négocie souvent « cash-free debt-free », c'est-à-dire en EV !). Questions garanties en entretien — des plus simples aux vicieuses.",
    diagrams: [
      { type: "bridge", title: "Le bridge complet de NovaTech (M€)", unit: "", items: [
        { label: "Equity Value", value: 800, kind: "base" }, { label: "+ Dette", value: 300, kind: "add" }, { label: "− Cash", value: 100, kind: "sub" }, { label: "+ Minoritaires", value: 50, kind: "add" }, { label: "− Associates", value: 50, kind: "sub" }, { label: "EV", value: 1000, kind: "total" },
      ]},
      { type: "stack", title: "Qui finance quoi", stacks: [
        { name: "EV = la machine", layers: [{ label: "Opérations", note: "usines, marques, BFR opérationnel" }] },
        { name: "Financeurs", layers: [{ label: "Créanciers (dette nette)" }, { label: "Minoritaires" }, { label: "Actionnaires (equity)" }] },
      ]},
    ],
    examples: [
      { title: "Définition → calcul", body: "NovaTech : cours 10 €, 80 M d'actions diluées → equity 800. Dette 300, cash 100, minoritaires 50, participation mise en équivalence 50. EV = 800 + 300 − 100 + 50 − 50 = 1 000. Chaque terme a sa justification — sache les dérouler." },
      { title: "Exemple réel", body: "Nintendo a longtemps porté ~10 Md$ de cash net : sa market cap dépassait largement son EV. Les investisseurs « value » adoraient : on achetait les opérations avec une décote une fois le cash déduit. À l'inverse, les télécoms endettés ont des EV très supérieures à leur market cap." },
      { title: "Erreur fréquente", body: "« La société A (market cap 1 Md) est plus grosse que B (market cap 800 M). » Si A a 200 de cash net et B 600 de dette nette : EV de A = 800, EV de B = 1 400. En taille d'OPÉRATIONS, B est presque deux fois plus grosse. Toujours préciser la métrique." },
      { title: "Utilisation dans une acquisition", body: "Un process M&A négocie typiquement l'EV (« cash-free, debt-free ») : l'acheteur dit « je valorise tes opérations 1 000 » ; au closing, on déduit la dette réelle et on ajoute le cash réel pour obtenir le prix des actions. Comprendre le bridge, c'est comprendre le mécanisme de prix des deals." },
    ],
    quizIds: ["va1", "va2", "va3", "va4", "va11", "va14"],
    exercises: [
      { kind: "gap", title: "Le bridge, dans les deux sens", prompt: "Complète :", template: "EV = Equity Value + ◻ − ◻ + Minoritaires\nEquity Value = EV − Dette nette − ◻", blanks: [
        { options: ["Dette", "EBITDA", "Capex"], correct: 0 },
        { options: ["Cash", "Stocks", "Goodwill"], correct: 0 },
        { options: ["Minoritaires", "D&A", "Revenue"], correct: 0 },
      ], explain: "Le bridge se traverse dans les deux sens, vite et sans erreur — c'est un test d'entretien à part entière." },
      { kind: "tf", title: "Les pièges du bridge", statements: [
        { text: "Un rachat d'actions de 50 réduit l'EV de 50.", answer: false, explain: "Cash −50 ET equity −50 : la dette nette monte de 50, l'equity baisse de 50 → EV inchangée. Les opérations n'ont pas bougé." },
        { text: "Une société peut avoir une Equity Value supérieure à son EV.", answer: true, explain: "Dès que le cash dépasse la dette (dette nette négative). Fréquent en tech." },
        { text: "EV/EBITDA compare des grandeurs cohérentes.", answer: true, explain: "EBITDA = avant intérêts (pour tous les financeurs) ↔ EV (valeur pour tous les financeurs). Cohérence de périmètre." },
      ]},
    ],
    miniCase: {
      context: "Entretien, questions enchaînées : « Market cap 600, dette 250, cash 150, minoritaires 40. (a) EV ? (b) La société émet 100 de dette nouvelle et garde tout en cash : nouvel EV ? (c) Elle utilise ensuite ces 100 pour racheter ses actions : impacts ? »",
      task: "Réponds aux trois questions avec les chiffres et une phrase d'explication chacune.",
      hints: ["(b) dette +100 ET cash +100…", "(c) le cash part, les actions aussi."],
      modelAnswer: "(a) EV = 600 + 250 − 150 + 40 = 740. (b) Dette 350, cash 250 : la dette nette est inchangée (100) → EV toujours 740 — lever du cash ne crée pas de valeur opérationnelle. (c) Le buyback : cash revient à 150 (dette nette remonte à 200), equity value 600 − 100 = 500 → EV = 500 + 200 + 40 = 740. Encore inchangée ! L'EV ne bouge que si les OPÉRATIONS changent ; les allers-retours de financement redistribuent la valeur entre financeurs sans changer la taille de la machine. Dire cette phrase en entretien = points.",
      keywords: ["740", "inchang", "500", "200", "opérations|redistribu"],
    },
  },

  {
    id: "c42", level: 4, title: "Les multiples : le langage du marché", emoji: "📊", minutes: 25, xp: 50,
    hook: "« Ça s'est vendu 12x l'EBITDA. » Toute l'industrie parle en multiples. Apprends la grammaire — et ce que les multiples disent VRAIMENT.",
    simple: "Un multiple, c'est un prix rapporté à une métrique : EV/EBITDA = combien d'années d'EBITDA je paie pour la machine. C'est un raccourci de comparaison : plutôt que de modéliser chaque société, on compare leurs prix relatifs — comme le prix au m² pour les appartements.\n\nLa règle d'or de cohérence : le numérateur et le dénominateur doivent servir les MÊMES financeurs. EV (tous les financeurs) se rapporte aux métriques AVANT intérêts : revenue, EBITDA, EBIT. L'Equity Value (actionnaires) se rapporte aux métriques APRÈS intérêts : net income (→ P/E), book value.\n\nLes stars : EV/EBITDA (le standard M&A, insensible à la structure de capital et aux politiques d'amortissement), P/E (le classique boursier), EV/Revenue (quand la profitabilité n'est pas encore là), EV/EBIT (quand le capex compte).",
    analogy: "Le prix au m² : deux appartements se comparent en €/m² — mais tu sais d'instinct qu'un m² avec vue sur mer vaut plus qu'un m² sur le périphérique. Les multiples, pareil : 12x pour une société en croissance à 15% n'est pas « plus cher » que 8x pour une société qui stagne. Le multiple se JUGE, il ne se lit pas.",
    deep: "Ce qu'un multiple encapsule : réarrange la formule de Gordon — V = FCF/(r−g) — et tu vois que V/FCF = 1/(r−g). Un multiple EST une fonction de la croissance (g ↑ → multiple ↑) et du risque (r ↑ → multiple ↓), plus la conversion en cash (un EBITDA qui devient du cash vaut plus qu'un EBITDA mangé par le capex). Quand tu compares deux multiples, tu compares implicitement ces trois drivers.\n\nLTM vs forward : les multiples se calculent sur les 12 derniers mois (réalisé, objectif) ou sur les estimations à 12-24 mois (NTM — cohérent avec le fait que la valeur vient du futur ; standard chez les pros). Une société en forte croissance paraît « chère » en LTM et raisonnable en forward.\n\nLes spécialisés à connaître : EV/(EBITDA − capex) pour les capex-lourds (télécoms), EV/ARR et la Rule of 40 pour le SaaS, P/TBV vs ROE pour les banques, P/FFO pour l'immobilier. Chaque industrie choisit la métrique qui reflète le mieux SA génération de cash — le niveau 7 de l'ancien parcours et le module Industry t'y entraînent.",
    traps: [
      "EV/Net income ou Price/EBITDA : incohérences de périmètre. Rédhibitoire en entretien.",
      "Comparer le P/E de deux sociétés aux leviers très différents : les intérêts polluent la comparaison (c'est l'avantage d'EV/EBITDA).",
      "Un multiple « pas cher » peut être un value trap : le marché price un déclin (croissance négative dans le 1/(r−g)).",
      "Comparer un multiple LTM à un multiple forward : toujours vérifier la base temporelle.",
    ],
    mnaUse: "Les mandats se pitchent, se négocient et s'annoncent en multiples. En entretien : « pourquoi EV/EBITDA plutôt que P/E ? », « qu'est-ce qui justifie un multiple plus élevé ? », « quel multiple pour une banque / un SaaS / une utility ? »",
    diagrams: [
      { type: "flow", title: "Quel multiple avec quelle métrique ?", steps: [
        { label: "EV", note: "↔ Revenue, EBITDA, EBIT" }, { label: "Equity Value", note: "↔ Net income, Book value" }, { label: "Cohérence", note: "mêmes financeurs des 2 côtés" },
      ]},
      { type: "bridge", title: "Du multiple au prix (M€)", unit: "", items: [
        { label: "EBITDA", value: 150, kind: "base" }, { label: "× 8 = EV 1 200", value: 1050, kind: "add" }, { label: "− Dette nette", value: 400, kind: "sub" }, { label: "Equity Value", value: 800, kind: "total" },
      ]},
    ],
    examples: [
      { title: "Exemple simple", body: "EBITDA 150, multiple sectoriel 8x → EV = 1 200. Dette nette 400 → equity 800. Avec 40 M d'actions : 20 €/action. Le chemin multiple → EV → bridge → prix par action est un réflexe à automatiser." },
      { title: "Exemple réel", body: "Dans le luxe, Hermès traite ~2x plus cher (en EV/EBITDA) que le secteur : croissance supérieure, marges hors norme, ROIC exceptionnel. Le « sur-multiple » n'est pas de l'irrationalité — c'est du 1/(r−g) avec un meilleur g et un meilleur r." },
      { title: "Erreur fréquente", body: "« 15x c'est cher, 7x c'est pas cher. » Sans contexte, ça ne veut rien dire : 15x un EBITDA qui double en 3 ans peut être une aubaine ; 7x un EBITDA en déclin de 10%/an, un piège. Le multiple se lit TOUJOURS avec ses drivers." },
    ],
    quizIds: ["va5", "va13", "va9", "va12"],
    exercises: [
      { kind: "order", title: "Du multiple au prix par action", prompt: "Remets le cheminement dans l'ordre :", items: ["Choisir la métrique (EBITDA normalisé)", "Appliquer le multiple des comparables → EV", "Déduire la dette nette (bridge) → Equity Value", "Diviser par le nombre d'actions dilué → prix par action"], explain: "Métrique → multiple → EV → bridge → prix. Ce pipeline structure les comps ET la lecture de tout deal annoncé." },
      { kind: "tf", title: "La grammaire des multiples", statements: [
        { text: "EV/EBITDA est insensible à la structure de capital.", answer: true, explain: "Ni l'EV ni l'EBITDA ne dépendent du mix dette/equity : c'est LE multiple de comparaison des opérations." },
        { text: "Un multiple élevé signifie toujours qu'une société est surévaluée.", answer: false, explain: "Il peut refléter une croissance forte, un risque faible, une conversion cash excellente. « Cher » ≠ « surévalué »." },
        { text: "P/E = Equity Value / Net income.", answer: true, explain: "Ou par action : cours / EPS. Cohérent : les deux servent les actionnaires." },
      ]},
    ],
    miniCase: {
      context: "Deux cibles du même secteur : Orion (EBITDA 100, croissance +12%/an, conversion cash 85%, EV proposée 1 100) et Pallas (EBITDA 100, croissance +2%, conversion 55%, EV proposée 700).",
      task: "Calcule les deux multiples, puis argumente en 4-5 phrases laquelle est la « moins chère » en réalité. (Indice : pense en multiple sur cash, et en 1/(r−g).)",
      hints: ["Cash proxy : EBITDA × conversion.", "11x avec +12% vs 7x avec +2% : normalise par la croissance."],
      modelAnswer: "Multiples faciaux : Orion 11x, Pallas 7x — Pallas « semble » moins chère. Sur le cash réellement généré : Orion 1 100/(100×0,85) ≈ 12,9x ; Pallas 700/(100×0,55) ≈ 12,7x — quasi identiques ! Et il reste la croissance : à cash égal payé, Orion croît 6 fois plus vite ; dans la logique 1/(r−g), son multiple devrait être NETTEMENT supérieur. Conclusion contre-intuitive : Orion à 11x est probablement la meilleure affaire — Pallas est « bon marché » pour d'excellentes raisons. C'est exactement le raisonnement (multiple facial → multiple cash → croissance) qui distingue un candidat en entretien.",
      keywords: ["11x|11", "7x|7", "12,9|12.9|12,7|12.7", "croissance|6 fois|g", "orion"],
    },
  },

  {
    id: "c43", level: 4, title: "Trading comps & transactions précédentes", emoji: "🗂️", minutes: 26, xp: 55,
    hook: "Les deux méthodes « de marché » : ce que valent les pairs en bourse, et ce que de vrais acheteurs ont vraiment payé. Méthode + jugement.",
    simple: "Les trading comps : on choisit des sociétés cotées comparables, on calcule leurs multiples (EV/EBITDA, P/E…), on applique la médiane à notre cible. C'est le « prix au m² du quartier » : instantané, ancré dans le marché, mais SANS prime de contrôle (ce sont des prix de minoritaires en bourse).\n\nLes precedent transactions : même logique, mais avec les multiples PAYÉS dans de vraies acquisitions comparables. Ils incluent la prime de contrôle (20-40%) et les synergies espérées par les acheteurs → presque toujours plus élevés que les comps boursiers.\n\nLa vraie compétence n'est pas le calcul (mécanique) : c'est la SÉLECTION des comparables, le NETTOYAGE des chiffres, et le JUGEMENT sur la position de la cible dans la fourchette.",
    analogy: "Tu vends ton appartement. Les trading comps : les annonces actuelles du quartier (ce que les vendeurs espèrent). Les precedents : les ventes NOTARIÉES des 12 derniers mois (ce que des acheteurs ont vraiment payé) — plus fiables, mais moins nombreuses et parfois datées d'un marché différent.",
    deep: "Le pipeline des comps en 5 étapes : (1) sélection par PROFIL — business model, croissance, marges, taille, géographie ; mieux vaut 6 vrais comparables que 15 approximatifs ; (2) nettoyage — retirer les one-offs de l'EBITDA, « calendariser » les exercices décalés, diluer les share counts ; (3) calcul — EV complet (avec minoritaires, pensions…), multiples LTM et forward ; (4) statistiques — médiane (robuste aux outliers) et quartiles, jamais la moyenne seule ; (5) application avec JUGEMENT : la cible mérite-t-elle le haut ou le bas de la fourchette, et pourquoi ?\n\nPour les precedents s'ajoutent trois précautions : le CONTEXTE de cycle (un multiple payé en 2021 à taux zéro ne se réplique pas à taux 4%), la STRUCTURE du deal (synergies d'un stratégique vs discipline d'un sponsor, compétition du process), et la RARETÉ des données (les deals privés publient peu). On cite toujours un multiple de transaction avec sa date et son histoire.\n\nEn entretien, la hiérarchie attendue : precedents > comps (prime de contrôle), le DCF pouvant se placer n'importe où selon les hypothèses. Et la nuance qui fait mouche : les comps donnent une valeur de marché MINORITAIRE — c'est le point de départ d'une négociation de contrôle, pas son point d'arrivée.",
    traps: [
      "Empiler 15 « comparables » non comparables : la fourchette devient tellement large qu'elle ne dit rien.",
      "Oublier de nettoyer un one-off : un EBITDA pollué fausse le multiple de tout le set.",
      "Utiliser la moyenne avec un outlier à 40x dans le set : la médiane existe pour ça.",
      "Citer un precedent de 2021 comme référence en 2026 sans commentaire de cycle : montre un manque de jugement.",
    ],
    mnaUse: "Ces deux analyses sont les pages 1 et 2 de tout pitch de valorisation. Tu les construiras dès ta première semaine de stage. En entretien : « comment choisis-tu les comparables ? », « pourquoi les precedents sont-ils plus élevés ? », « médiane ou moyenne ? »",
    diagrams: [
      { type: "flow", title: "Le pipeline des comps", steps: [
        { label: "Sélection", note: "profil, pas étiquette" }, { label: "Nettoyage", note: "one-offs, calendarisation" }, { label: "Multiples", note: "LTM + forward" }, { label: "Médiane", note: "+ quartiles" }, { label: "Jugement", note: "où mérite la cible ?" },
      ]},
    ],
    examples: [
      { title: "Sélection en action", body: "Cible : pure player de la publicité digitale (+12% de croissance, marge 22%). Candidat comparable : groupe média diversifié (+3%, marge 15%, gros pôle TV legacy). Verdict : à écarter du cœur de set ou à pondérer — même « secteur », profil différent. La sélection EST l'analyse." },
      { title: "Precedents et cycle", body: "Un actif SaaS s'est vendu 15x l'ARR en 2021 ; en 2024, les deals comparables signent à 8-10x. Le banquier qui pitche 15x « parce qu'il y a un precedent » décrédibilise son football field. Le bon usage : présenter les deux époques, expliquer l'écart (taux, appétit), recommander sur le cycle ACTUEL." },
      { title: "Erreur fréquente", body: "Appliquer la médiane sans se demander où la cible mérite de se situer. Si elle croît plus vite que tous les comparables avec de meilleures marges : haut de fourchette justifié — et c'est TA valeur ajoutée d'analyste de le dire." },
    ],
    quizIds: ["cp1", "cp2", "cp3", "cp4", "pt1", "pt3"],
    exercises: [
      { kind: "order", title: "Construis tes comps", prompt: "Remets le pipeline dans l'ordre :", items: ["Sélectionner les pairs par profil", "Nettoyer les financials (one-offs, calendarisation)", "Calculer EV et multiples", "Prendre médiane et quartiles", "Appliquer à la cible avec jugement"], explain: "Sélection → nettoyage → calcul → stats → jugement. La mécanique est simple ; la crédibilité vient des deux extrémités (sélection et jugement)." },
      { kind: "tf", title: "Comps vs precedents", statements: [
        { text: "Les multiples de transactions incluent généralement une prime de contrôle.", answer: true, explain: "L'acheteur paie pour le pouvoir de décision et les synergies : +20-40% vs le cours." },
        { text: "La moyenne est préférable à la médiane pour un set de multiples.", answer: false, explain: "Un seul outlier fausse la moyenne ; la médiane résiste. Standard professionnel." },
        { text: "Un multiple de transaction se cite toujours avec sa date et son contexte.", answer: true, explain: "Les conditions de financement et le cycle changent tout — le multiple « nu » est trompeur." },
      ]},
    ],
    miniCase: {
      context: "Set de comps pour une cible agroalimentaire (croissance +5%, marge EBITDA 18%) : A 9,2x (+4%, marge 17%) ; B 10,1x (+6%, 19%) ; C 14,8x (+15%, 25% — leader premium en hypercroissance) ; D 8,7x (+3%, 16%) ; E 9,6x (+5%, 18%).",
      task: "Quelle statistique retiens-tu et pourquoi ? Que fais-tu de C ? Propose une fourchette pour la cible, justifiée en 3-4 phrases.",
      hints: ["C est-il un comparable ou une aspiration ?", "Médiane du set avec et sans C."],
      modelAnswer: "C est un outlier de profil (croissance et marges sans rapport avec la cible) : je l'écarte du cœur de set — ou le garde à titre illustratif « où mène l'hypercroissance ». Médiane sans C : ~9,4x (A, B, D, E : 8,7 / 9,2 / 9,6 / 10,1). La cible (+5%, 18%) est pile dans le profil de B et E : fourchette raisonnable 9,0x – 10,0x, cœur ~9,5x. Avec la moyenne INCLUANT C (10,5x), j'aurais surestimé de ~10% — démonstration parfaite de pourquoi médiane + jugement de sélection battent la moyenne mécanique.",
      keywords: ["écart|outlier|aspiration", "9,4|9.4|médiane", "9,0|9-10|9,5|9.5", "b et e|profil", "moyenne|10,5|surestim"],
    },
  },

  {
    id: "c44", level: 4, title: "Le DCF de A à Z", emoji: "📉", minutes: 32, xp: 65,
    hook: "La méthode « intrinsèque » : la valeur = les cash flows futurs, actualisés. Tu as déjà TOUTES les briques — assemblons le monument.",
    simple: "Le DCF (Discounted Cash Flow) applique la grande idée du niveau 3 : une entreprise vaut la somme de ses cash flows futurs, ramenés en euros d'aujourd'hui.\n\nLa recette en 6 étapes : (1) projeter les revenus et les marges sur 5-10 ans ; (2) en déduire l'unlevered free cash flow de chaque année : UFCF = EBIT × (1−t) + D&A − capex − ΔBFR ; (3) estimer la valeur au-delà de l'horizon (terminal value) — par la perpétuité croissante de Gordon ou par un multiple de sortie ; (4) actualiser flux et TV au WACC → cela donne l'ENTERPRISE Value ; (5) traverser le bridge (− dette nette, − minoritaires) → Equity Value, ÷ actions diluées → prix par action ; (6) tester la sensibilité aux hypothèses (WACC × g).\n\nPourquoi « unlevered » ? On valorise la machine pour TOUS les financeurs, indépendamment du financement — cohérent avec le WACC. La dette est traitée après, dans le bridge.",
    analogy: "Évaluer un immeuble locatif : tu projettes les loyers nets des 7 prochaines années, tu estimes le prix de revente au bout (la « terminal value »), et tu actualises le tout à ton exigence de rendement. Le DCF d'une entreprise, c'est exactement ça — avec des loyers qui s'appellent UFCF.",
    deep: "Les points techniques qui font la différence :\n\nL'UFCF, ligne à ligne : on part de l'EBIT (pas l'EBITDA !), on applique l'impôt théorique (NOPAT), on RAJOUTE la D&A (non-cash), on RETIRE le capex et la hausse de BFR. Les intérêts n'apparaissent nulle part — c'est le principe unlevered.\n\nLa terminal value : Gordon → TV = UFCF_final × (1+g) / (WACC − g), avec g ≤ 2-3% (au-delà, l'entreprise dépasserait l'économie à l'infini). Alternative : multiple de sortie (EBITDA final × multiple de comps). Bonne pratique pro : utiliser l'une, vérifier l'autre en implicite. Et le piège récurrent : la TV est une valeur EN ANNÉE N — il faut encore l'actualiser !\n\nLe poids de la TV (souvent 60-80% de l'EV) est mathématiquement normal, mais impose la discipline des sensibilités : une matrice WACC × g est OBLIGATOIRE. Cohérence terminale : capex ≈ D&A (ou léger excès) — un capex durablement inférieur à la D&A avec croissance est incohérent.\n\nForces du DCF : intrinsèque, indépendant de l'humeur du marché, force à comprendre le business. Faiblesse : garbage in, garbage out — ±0,5% de WACC déplace la valeur de ±10%. D'où la triangulation systématique avec comps et precedents.",
    traps: [
      "Partir de l'EBITDA pour le NOPAT (l'impôt se calcule sur l'EBIT) — ou déduire les intérêts de l'UFCF.",
      "Oublier d'actualiser la terminal value : l'erreur qui gonfle la valo de +50%.",
      "g terminal > croissance de l'économie, ou g qui tend vers le WACC (la TV explose).",
      "Déduire le NIVEAU de BFR au lieu de sa VARIATION.",
      "Présenter un DCF sans matrice de sensibilité : incomplet aux yeux de tout professionnel.",
    ],
    mnaUse: "Le DCF est dans tous les pitchs, toutes les fairness opinions, tous les tests d'impairment. Et « Walk me through a DCF » est LA question d'entretien la plus célèbre du monde — tu dois la dérouler en 90 secondes, en anglais, sans notes.",
    diagrams: [
      { type: "flow", title: "Le DCF en 6 étapes", steps: [
        { label: "Projeter UFCF", note: "5-10 ans" }, { label: "Terminal value", note: "Gordon ou multiple" }, { label: "Actualiser au WACC", note: "→ EV" }, { label: "Bridge", note: "→ Equity Value" }, { label: "÷ actions diluées", note: "→ prix" }, { label: "Sensibilités", note: "WACC × g" },
      ]},
      { type: "bridge", title: "Anatomie d'un UFCF (M€)", unit: "", items: [
        { label: "EBIT", value: 240, kind: "base" }, { label: "− Impôt (25%)", value: 60, kind: "sub" }, { label: "+ D&A", value: 60, kind: "add" }, { label: "− Capex", value: 70, kind: "sub" }, { label: "− ΔBFR", value: 20, kind: "sub" }, { label: "UFCF", value: 150, kind: "total" },
      ]},
    ],
    examples: [
      { title: "Mini-DCF complet", body: "UFCF an 1 : 80, croissance 5%/an sur 5 ans, WACC 9%, g 2%. PV des 5 flux ≈ 341. TV = 97,2×1,02/0,07 ≈ 1 417, actualisée ≈ 921. EV ≈ 1 262 (TV = 73% !). Dette nette 300 → equity ≈ 962. Chaque chiffre de cet exemple est recalculable de tête — entraîne-toi." },
      { title: "Exemple réel", body: "Dans les fairness opinions publiées (documents d'OPA), tu verras toujours : DCF avec matrice WACC × g, comps, precedents — et une fourchette de synthèse. Va lire celle d'un deal récent : c'est le format exact de ce que tu produiras en stage." },
      { title: "Erreur fréquente", body: "« Mon DCF donne 40% au-dessus du cours : le marché se trompe. » L'humilité d'abord : re-challenge tes hypothèses (croissance ? marges ? WACC ?) contre le consensus. Le marché se trompe parfois ; ton modèle, souvent." },
    ],
    quizIds: ["dc1", "dc2", "dc4", "dc5", "dc9", "dc12", "dc11"],
    exercises: [
      { kind: "gap", title: "L'UFCF et la TV", prompt: "Complète :", template: "UFCF = ◻ × (1 − t) + D&A − Capex − ◻\nTV = UFCF final × (1+g) ÷ ◻", blanks: [
        { options: ["EBIT", "EBITDA", "Net income"], correct: 0 },
        { options: ["ΔBFR", "Intérêts", "Dividendes"], correct: 0 },
        { options: ["(WACC − g)", "(WACC + g)", "WACC × g"], correct: 0 },
      ], explain: "EBIT (pas EBITDA) pour l'impôt ; variation de BFR ; et le fameux dénominateur WACC − g de Gordon." },
      { kind: "order", title: "Walk me through a DCF", prompt: "L'ordre canonique de la réponse d'entretien :", items: ["Project unlevered FCF (5-10 ans)", "Estimate terminal value (Gordon / exit multiple)", "Discount everything at WACC → EV", "Bridge to equity value (− net debt)", "Divide by diluted shares → implied price", "Run sensitivities (WACC × g)"], explain: "Six phrases, 90 secondes, en anglais. C'est un morceau de bravoure à savoir par cœur — puis à comprendre assez pour répondre aux relances." },
    ],
    miniCase: {
      context: "Ton VP te tend un DCF fait par un stagiaire précédent : UFCF calculé en déduisant les intérêts, TV = 1 500 NON actualisée (année 5, WACC 10%), g terminal 4% avec un WACC de 8% dans la matrice basse, et capex terminal à 50% de la D&A avec +3% de croissance.",
      task: "Identifie les 4 erreurs, chiffre l'impact de la TV non actualisée, et réécris la phrase de conclusion que tu enverrais au VP.",
      hints: ["1,10⁵ ≈ 1,61.", "g qui s'approche du WACC → TV explose."],
      modelAnswer: "Erreur 1 : les intérêts n'ont rien à faire dans un UFCF (principe unlevered) — le flux est sous-estimé. Erreur 2 : la TV doit être actualisée : 1 500/1,61 ≈ 932 — la valo était gonflée de ~570 (+60% sur la TV !). Erreur 3 : g 4% face à un WACC de 8% donne un dénominateur de 4% qui surévalue massivement — et g 4% perpétuel dépasse l'économie : ramener à 2-2,5%. Erreur 4 : capex terminal à 50% de la D&A avec croissance = actifs qui fondent — incohérent ; caler capex ≈ D&A. Conclusion pour le VP : « Le modèle surévalue significativement la cible ; après correction des quatre points (UFCF, actualisation de la TV, g, capex terminal), l'EV central passe de X à environ X−40%, fourchette de sensibilité jointe. »",
      keywords: ["intérêts|unlevered", "932|1,61|actualis", "4%|2|dénominateur|explose", "capex|d&a|fondent", "surévalu"],
    },
  },

  {
    id: "c45", level: 4, title: "Synthèse : football field, SOTP et cas limites", emoji: "🎯", minutes: 22, xp: 50,
    hook: "Aucune méthode n'a « raison » : la valorisation est une triangulation. Voici comment les pros concluent — et gèrent les cas tordus.",
    simple: "Tu disposes maintenant de trois méthodes : comps (marché, minoritaire), precedents (contrôle payé), DCF (intrinsèque). Chacune donne une FOURCHETTE — jamais un chiffre. Le football field est le graphique qui les superpose : une barre horizontale par méthode, et la zone de recouvrement fonde la recommandation.\n\nLa lecture type : comps 800-950, precedents 950-1 150, DCF 850-1 100 → recommandation « autour de 950-1 050 », avec la logique : le marché paierait ~900, un acquéreur avec synergies peut aller à 1 100.\n\nS'ajoutent des méthodes d'appoint : la valorisation LBO (le prix max qu'un fonds peut payer sous contrainte d'IRR — souvent le PLANCHER de la fourchette), le 52-week range boursier, les price targets des analystes.",
    analogy: "Le médecin ne fait pas UN examen : il croise température, prise de sang et imagerie. Si les trois convergent, diagnostic solide ; si l'un diverge, c'est LÀ qu'il faut creuser. Le football field est l'examen croisé de la valeur.",
    deep: "La sum-of-the-parts (SOTP) : pour les conglomérats, on valorise chaque division avec SES comparables et SA méthode, on somme les EV, on retire les coûts de siège capitalisés et la dette nette. L'écart entre la SOTP et le cours s'appelle la décote de conglomérat — carburant des activistes qui réclament des scissions.\n\nLes cas limites à savoir traiter : EBITDA négatif → remonter le P&L (EV/Revenue, EV/Gross profit), multiples forward à l'année de normalisation, DCF à horizon long ; banques/assurances → pas d'EV du tout : DDM, P/E, P/TBV vs ROE (la dette est leur matière première) ; cycliques → normaliser les earnings sur le cycle (jamais capitaliser un pic) ; société non cotée → tout emprunter aux comparables cotés + discussion de décote d'illiquidité.\n\nEt la question de synthèse favorite des entretiens : « les trois méthodes donnent des valeurs très différentes, laquelle crois-tu ? » Réponse en trois temps : expliquer POURQUOI elles divergent (prime de contrôle, hypothèses), pondérer selon le CONTEXTE (vente de contrôle → precedents ; participation minoritaire → comps), et challenger les hypothèses du DCF avant de le croire.",
    traps: [
      "Présenter un chiffre unique au lieu d'une fourchette : la fausse précision est le péché des débutants.",
      "Faire la moyenne des trois méthodes : elles ne mesurent pas la même chose (minoritaire vs contrôle).",
      "Valoriser une banque en EV/EBITDA : éliminatoire (chapitre Industry).",
      "Capitaliser l'EBITDA de pic d'une cyclique : le value trap classique.",
    ],
    mnaUse: "Le football field est LA page de conclusion de tout pitch et de toute fairness opinion — celle que le client regarde. En entretien : « quelle méthode donne la valeur la plus haute ? », « comment valoriser un EBITDA négatif ? », « raconte-moi un football field ».",
    diagrams: [
      { type: "flow", title: "Construire la recommandation", steps: [
        { label: "Comps", note: "800 – 950" }, { label: "Precedents", note: "950 – 1 150" }, { label: "DCF", note: "850 – 1 100" }, { label: "LBO floor", note: "~850" }, { label: "Reco", note: "950 – 1 050" },
      ]},
    ],
    examples: [
      { title: "Lecture d'un football field", body: "Si le DCF sort NETTEMENT au-dessus des comps et precedents, deux lectures : hypothèses de management optimistes (le plus fréquent) ou vraie sous-valorisation de marché. Le job du banquier : le dire au client AVANT que les acheteurs ne le disent en due diligence." },
      { title: "SOTP en action", body: "Un groupe = pôle logiciels (EBITDA 100, pairs à 15x) + pôle industriel (EBITDA 200, pairs à 7x). SOTP = 1 500 + 1 400 = 2 900 d'EV − siège capitalisé 200 = 2 700. Si le marché ne price que 2 200, la décote de 500 devient l'argument d'un spin-off — pitch d'activiste clé en main." },
      { title: "Erreur fréquente", body: "À la question « laquelle des méthodes préfères-tu ? », répondre « le DCF, c'est le plus rigoureux ». Réponse de cours. La bonne réponse dépend du CONTEXTE — et montre que tu comprends ce que chaque méthode mesure." },
    ],
    quizIds: ["va6", "va7", "va8", "va10", "in3"],
    exercises: [
      { kind: "tf", title: "Synthèse et cas limites", statements: [
        { text: "On conclut une valorisation par la moyenne arithmétique des trois méthodes.", answer: false, explain: "On TRIANGULE avec jugement : les méthodes mesurent des choses différentes (minoritaire vs contrôle vs intrinsèque)." },
        { text: "L'analyse LBO fournit souvent le plancher de la fourchette.", answer: true, explain: "Le sponsor est contraint par son IRR cible et n'a pas de synergies : son prix max est un plancher naturel." },
        { text: "Pour une entreprise cyclique, on valorise sur l'EBITDA de la meilleure année.", answer: false, explain: "On NORMALISE sur le cycle (mid-cycle earnings) — capitaliser un pic est le value trap par excellence." },
      ]},
      { kind: "order", title: "Répondre à « les méthodes divergent, laquelle crois-tu ? »", prompt: "Structure de la réponse idéale :", items: ["Expliquer pourquoi elles divergent (prime, hypothèses)", "Pondérer selon le contexte de la mission", "Challenger les hypothèses du DCF", "Conclure sur une fourchette recommandée"], explain: "Diagnostic → contexte → esprit critique → fourchette. Cette structure transforme une question piège en démonstration de maturité." },
    ],
    miniCase: {
      context: "Pitch de vente pour Helios Med (souviens-toi du Deal Room) : comps 1 150-1 350 ; precedents 1 300-1 550 ; DCF 1 250-1 500 ; analyse LBO : un sponsor peut payer max ~1 300. Le client (fondateur) « veut entendre 1 800 ».",
      task: "Rédige la conclusion de valorisation (5-6 phrases) : fourchette recommandée, stratégie pour l'atteindre, et comment gérer l'attente irréaliste du fondateur sans perdre le mandat.",
      hints: ["La zone de recouvrement des méthodes.", "Qui peut payer le haut de fourchette, et pourquoi ?"],
      modelAnswer: "Les méthodes convergent vers une zone de 1 300-1 500 : les comps ancrent le marché minoritaire (~1 250 au centre), les precedents montrent ce que le CONTRÔLE s'est payé (jusqu'à 1 550), le DCF confirme au milieu, et le plancher sponsor est à 1 300. Recommandation : fourchette de sortie 1 350-1 550, avec un objectif haut atteignable si nous créons une compétition entre stratégiques (les seuls à pouvoir payer les synergies au-dessus de 1 400). Pour le fondateur : 1 800 n'est soutenu par aucune méthode — l'afficher ferait fuir les acheteurs sérieux et discréditerait le process ; MAIS le chemin vers le haut de fourchette passe par ce que nous contrôlons : tension concurrentielle, calendrier, et démonstration des synergies en management presentation. On vend un PROCESS qui maximise, pas un chiffre magique.",
      keywords: ["1300|1 300|1350|1 350", "1550|1 550|recouvrement", "stratégique|synergies|compétition", "1800|aucune méthode|fuir", "process|tension"],
    },
  },
];
