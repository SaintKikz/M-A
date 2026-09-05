import type { Chapter } from "./types";

// ═══════════════ NIVEAU 1 — FONDAMENTAUX ═══════════════
export const CHAPTERS_L12: Chapter[] = [
  {
    id: "c11", level: 1, title: "L'entreprise, une machine à cash", emoji: "🏭", minutes: 20, xp: 40,
    hook: "Avant de valoriser quoi que ce soit, il faut comprendre ce qu'on achète vraiment quand on achète une entreprise.",
    simple: "Une entreprise, c'est une machine : on met de l'argent dedans (des machines, du stock, des salaires), elle produit quelque chose que des clients paient, et — si tout va bien — il ressort PLUS d'argent qu'on en a mis. Ce surplus s'appelle le profit, et surtout, sa version qui compte vraiment : le cash.\n\nQui met l'argent au départ ? Deux familles de personnes. Les actionnaires apportent de l'argent sans garantie de retour : si ça marche, tout le surplus est pour eux ; si ça rate, ils perdent leur mise. Les prêteurs (banques, investisseurs obligataires) prêtent de l'argent avec un contrat : intérêts fixes, remboursement à date fixe, qu'il pleuve ou qu'il vente.\n\nToute la finance d'entreprise tourne autour de trois questions : combien la machine produit-elle de cash ? à qui revient ce cash (prêteurs d'abord, actionnaires ensuite) ? et donc, combien vaut la machine ?",
    analogy: "Pense à un food truck. Tu achètes le camion 50 000 € : 20 000 de ta poche (equity) et 30 000 de crédit (dette). Chaque mois, les ventes paient les ingrédients, l'essence, ta mensualité de crédit — et ce qui reste est pour toi. Le camion, c'est l'entreprise. Le crédit, c'est la dette. Ta poche, c'est l'equity. Et la vraie question n'est pas « le camion est-il beau ? » mais « combien de cash me laisse-t-il chaque mois ? »",
    deep: "Formalisons. L'entreprise détient des actifs (machines, stocks, créances, marques) financés par deux sources : la dette et les capitaux propres (equity). Les actifs produisent des flux de trésorerie opérationnels. Sur ces flux, les créanciers sont servis EN PREMIER (intérêts, remboursements) — c'est contractuel. Les actionnaires reçoivent le résidu : dividendes, ou valeur réinvestie dans la machine.\n\nCette hiérarchie explique tout le reste du parcours : pourquoi l'equity est plus risquée que la dette (résidu vs contrat), pourquoi elle exige un rendement supérieur, pourquoi on distingue la valeur de la machine entière (Enterprise Value) de la valeur de la seule part des actionnaires (Equity Value), et pourquoi un acheteur analyse d'abord la capacité de l'entreprise à générer du cash — pas son profit comptable.\n\nDernier concept fondateur : la valeur de n'importe quel actif financier est la valeur AUJOURD'HUI des cash flows qu'il produira DEMAIN. Tout ce que tu apprendras — DCF, multiples, LBO — n'est que des façons différentes d'estimer cette phrase.",
    traps: [
      "Profit ≠ cash : une entreprise « rentable » peut faire faillite si le cash ne rentre pas (on verra pourquoi au niveau 2).",
      "La dette n'est pas « mauvaise » : c'est un carburant — moins cher que l'equity, mais avec un risque d'explosion si on en met trop.",
      "La valeur d'une entreprise n'est pas son chiffre d'affaires ni la somme de ses machines : c'est le cash futur qu'elle générera.",
    ],
    mnaUse: "C'est LE cadre mental de l'entretien. Quand un interviewer demande « why do we value companies on cash flows? » ou « pourquoi l'equity coûte plus cher que la dette ? », il vérifie que tu as ce modèle en tête : actifs → cash → créanciers d'abord → actionnaires en résidu.",
    diagrams: [
      { type: "stack", title: "La machine et ses deux financeurs", stacks: [
        { name: "Actifs (la machine)", layers: [{ label: "Machines & stocks" }, { label: "Créances clients" }, { label: "Marque, savoir-faire" }] },
        { name: "Financement", layers: [{ label: "Dette", note: "servie en premier, coût fixe" }, { label: "Equity", note: "résidu : tout l'upside, tout le risque" }] },
      ]},
      { type: "flow", title: "Le circuit du cash", steps: [
        { label: "Clients paient" }, { label: "Coûts payés", note: "fournisseurs, salaires" }, { label: "Créanciers servis", note: "intérêts + principal" }, { label: "Actionnaires", note: "le résidu" },
      ]},
    ],
    examples: [
      { title: "Exemple simple", body: "Café Lumière encaisse 300 k€ de ventes par an. Ingrédients + salaires + loyer = 240 k€. La banque prend 10 k€ d'intérêts. Reste 50 k€ (avant impôt) pour la propriétaire. Si un jour elle vend le café, l'acheteur paiera pour CE flux annuel — pas pour les tables et les chaises.",
      },
      { title: "Exemple réel", body: "Quand LVMH achète Tiffany 16 Md$, il n'achète pas des vitrines et des diamants en stock : il achète les ~500-700 M$ de cash flows annuels que la marque peut générer sous sa gestion — et le droit de les faire croître." },
      { title: "Erreur fréquente", body: "« Cette entreprise fait 100 M€ de chiffre d'affaires, elle vaut donc 100 M€. » Non : deux entreprises à 100 M€ de CA peuvent générer 30 M€ ou 0 M€ de cash. C'est le cash, pas le CA, qui fait la valeur." },
    ],
    quizIds: ["fd5", "cf8"],
    extraQuiz: [
      { id: "xq-c11a", kind: "mcq", topic: "foundations", tags: ["machine-cash"], difficulty: 1,
        prompt: "Pourquoi les actionnaires exigent-ils un rendement supérieur aux prêteurs ?",
        choices: ["Ils sont plus gourmands", "Ils sont servis en dernier : leur retour est un résidu incertain", "La loi l'impose", "Parce qu'ils travaillent dans l'entreprise"],
        answer: 1, explanation: "La dette est contractuelle (intérêts fixes, priorité) ; l'equity reçoit ce qui reste, si quelque chose reste. Plus de risque → plus de rendement exigé. C'est le socle de TOUTE la finance." },
      { id: "xq-c11b", kind: "mcq", topic: "foundations", tags: ["machine-cash"], difficulty: 1,
        prompt: "La valeur d'une entreprise repose fondamentalement sur…",
        choices: ["La valeur de ses machines", "Son chiffre d'affaires", "Les cash flows futurs qu'elle va générer", "Le nombre de ses salariés"],
        answer: 2, explanation: "Tout actif financier vaut la valeur présente de ses flux futurs. Les machines ne valent que par le cash qu'elles produisent." },
    ],
    exercises: [
      { kind: "tf", title: "Vrai ou faux ?", statements: [
        { text: "Une entreprise rentable ne peut pas faire faillite.", answer: false, explain: "Faux : le profit est comptable, la faillite est une affaire de cash. Une entreprise peut être « rentable » et à court de trésorerie." },
        { text: "Les créanciers sont payés avant les actionnaires.", answer: true, explain: "Vrai : la dette est contractuelle et prioritaire ; l'equity est résiduelle." },
        { text: "Plus un investissement est risqué, plus le rendement exigé est élevé.", answer: true, explain: "Vrai : c'est LE principe risque/rendement — on le retrouvera dans le CAPM au niveau 3." },
      ]},
      { kind: "order", title: "La cascade du cash", prompt: "Remets dans l'ordre le circuit du cash d'une entreprise :", items: ["Les clients paient les ventes", "L'entreprise paie fournisseurs et salaires", "Les créanciers reçoivent leurs intérêts", "Les actionnaires reçoivent le résidu"], explain: "Ventes → coûts opérationnels → créanciers (contractuel) → actionnaires (résidu). Cette cascade structure toute la finance." },
    ],
    miniCase: {
      context: "Ta cousine hésite à racheter la boulangerie de son village : prix demandé 200 k€. La boulangerie encaisse 250 k€/an, paie 190 k€ de coûts, et le vendeur précise « le four à lui seul a coûté 80 k€ ! ».",
      task: "En 4-5 phrases : sur quoi ta cousine doit-elle fonder sa décision, et pourquoi l'argument du four est-il à côté de la plaque ?",
      hints: ["Que produit la machine chaque année ?", "Combien d'années de flux pour rembourser 200 k€ ?"],
      modelAnswer: "La décision repose sur le cash flow : 250 − 190 = 60 k€/an (avant impôt). À 200 k€, elle paie ~3,3 années de flux — plutôt attractif SI ces flux sont durables (clientèle fidèle, pas de concurrent qui ouvre). Le four est un actif, pas un flux : il ne vaut que par le pain qu'il produit. S'il fallait le remplacer demain (capex !), ce serait même un argument pour négocier le prix à la baisse. On achète des cash flows futurs, jamais des équipements.",
      keywords: ["60", "cash|flux", "3|années|multiple", "four|actif|produit", "durable|capex|remplacer"],
    },
  },

  {
    id: "c12", level: 1, title: "La banque d'affaires et le métier du M&A", emoji: "🏛️", minutes: 20, xp: 40,
    hook: "Tu vises un stage dans un métier précis. Voici ce qu'on y fait vraiment — et où tu te situeras dans la machine.",
    simple: "Une banque d'affaires ne prête pas d'argent aux particuliers : elle CONSEILLE les entreprises sur leurs grandes opérations financières, contre des commissions (fees). Trois grands métiers : le M&A (conseiller l'achat et la vente d'entreprises), l'ECM (lever de l'argent en actions, comme une IPO), le DCM (lever de la dette obligataire).\n\nEn M&A, deux camps : sell-side (on conseille le vendeur : maximiser le prix, organiser la compétition entre acheteurs) et buy-side (on conseille l'acheteur : évaluer la cible, structurer l'offre, éviter de surpayer).\n\nEt toi, stagiaire/analyste ? Tu es le moteur de production : valorisations (comps, DCF), présentations (pitchbooks, CIM), profils d'entreprises, suivi de process. Les seniors (VP, MD) trouvent les clients et négocient ; les juniors fabriquent le matériel avec un niveau d'exigence extrême — zéro faute, dans les temps.",
    analogy: "Une banque M&A, c'est une agence immobilière de luxe pour entreprises. Le MD est l'agent star qui connaît tous les propriétaires ; l'analyste est celui qui prépare les annonces, estime les prix, organise les visites et vérifie chaque chiffre du dossier. Personne n'achète la maison à cause de la brochure — mais une brochure fausse tue la vente.",
    deep: "L'organisation type : Analyst (2-3 ans) → Associate → VP → Director/ED → Managing Director. Le MD « origine » les mandats (relations, pitchs), le VP dirige l'exécution au quotidien, l'associate encadre la production, l'analyste produit. Les fees d'un mandat M&A se situent typiquement entre ~0,5% et 2% de la valeur du deal (dégressif avec la taille), payés majoritairement au succès (closing).\n\nLa vie d'un deal sell-side, que tu verras en détail au niveau 5 : préparation (teaser, CIM, modèle) → marketing → offres indicatives → due diligence → offres fermes → négociation du SPA → signing → closing. Chaque phase a ses livrables, et presque tous passent par les mains de l'analyste.\n\nPourquoi ce métier est une école exceptionnelle : exposition immédiate à des décisions stratégiques réelles, apprentissage technique accéléré (valorisation, négociation, juridique), et une optionalité de carrière rare (PE, corporate development, fonds).",
    traps: [
      "M&A ≠ trading : rien à voir avec les salles de marché. Le M&A vit en mois, pas en secondes.",
      "La banque conseille, le fonds de PE investit : agent vs principal. Confusion éliminatoire en entretien.",
      "Ne romantise pas : 80% du travail junior est de la production rigoureuse. C'est précisément ce que le stage évalue.",
    ],
    mnaUse: "Les questions de fit « why investment banking? », « que fait un analyste ? », « sell-side vs buy-side ? » ouvrent presque tous les entretiens. Une réponse précise et lucide sur le métier crédibilise instantanément.",
    diagrams: [
      { type: "flow", title: "La hiérarchie et qui fait quoi", steps: [
        { label: "Analyst", note: "produit : modèles, slides" }, { label: "Associate", note: "encadre la production" }, { label: "VP", note: "dirige l'exécution" }, { label: "MD", note: "clients & négociation" },
      ]},
      { type: "flow", title: "Les métiers d'une banque d'affaires", steps: [
        { label: "M&A", note: "acheter / vendre" }, { label: "ECM", note: "lever des actions" }, { label: "DCM", note: "lever de la dette" }, { label: "LevFin", note: "financer les LBO" },
      ]},
    ],
    examples: [
      { title: "Exemple concret de mandat", body: "Une famille veut vendre son groupe agroalimentaire (CA 400 M€). Elle mandate une banque : l'équipe prépare le CIM, valorise (fourchette 8-10x l'EBITDA), contacte 25 acheteurs, orchestre deux tours d'offres et négocie. Fee : ~1% du prix — la compétition organisée a fait monter le prix de 15%." },
      { title: "Ta semaine type de stagiaire", body: "Lundi : mise à jour d'un jeu de comps. Mardi : profils de 6 acheteurs potentiels. Mercredi : relecture d'un CIM, vérification de chaque chiffre. Jeudi : préparation du Q&A de management presentation. Vendredi : pitch — l'associate te demande un « quick DCF » pour 18h." },
      { title: "Erreur fréquente", body: "Dire en entretien « je veux faire du M&A pour négocier des deals ». Un junior ne négocie pas : il rend la négociation possible par la qualité de son matériel. Le savoir (et l'assumer) te distingue." },
    ],
    quizIds: ["fd1", "fd2", "fd4", "fd3"],
    exercises: [
      { kind: "tf", title: "Le métier, vrai ou faux ?", statements: [
        { text: "En sell-side, la banque conseille l'acheteur.", answer: false, explain: "Sell-side = côté vendeur. Buy-side = côté acheteur." },
        { text: "Les fees M&A sont payés majoritairement au closing.", answer: true, explain: "Le succès fee est dominant — la banque est payée si le deal se fait." },
        { text: "Un fonds de private equity est une banque d'affaires.", answer: false, explain: "Le fonds INVESTIT l'argent de ses clients (principal) ; la banque CONSEILLE contre des fees (agent)." },
      ]},
      { kind: "order", title: "La vie d'un deal sell-side", prompt: "Remets les grandes étapes dans l'ordre :", items: ["Préparation (teaser, CIM)", "Marketing auprès des acheteurs", "Offres indicatives (IOI)", "Due diligence", "Offres fermes et négociation du SPA", "Signing puis closing"], explain: "Préparer → marketer → filtrer (IOI) → ouvrir les livres (DD) → engager (offres fermes, SPA) → signer → closer. Tu revivras chaque étape en détail au niveau 5." },
    ],
    miniCase: {
      context: "En entretien, l'associate te demande : « Concrètement, si on te met lundi sur un mandat de vente d'une PME industrielle, tu imagines faire quoi pendant tes deux premières semaines ? »",
      task: "Réponds en 5-6 phrases réalistes (pas de fantasme de négociation !).",
      hints: ["Pense aux livrables de la phase de préparation.", "Comps, CIM, profils, data..."],
      modelAnswer: "Premièrement, m'approprier le dossier : lire les comptes des 3 derniers exercices et comprendre le business model. Ensuite, la production de préparation : construire le jeu de trading comps et l'analyse des transactions comparables pour la fourchette de valorisation ; rassembler les données pour les premières pages du CIM (marché, KPIs, financials) ; préparer la liste des acheteurs potentiels avec un mini-profil par acheteur. Enfin, la logistique du process : structurer la data room et tenir les trackers à jour. Le tout avec une obsession : zéro erreur dans les chiffres, car tout part chez le client.",
      keywords: ["comps|comparable", "cim", "acheteurs|buyer|profil", "data room|tracker", "comptes|financi|business", "zéro erreur|vérif"],
    },
  },

  {
    id: "c13", level: 1, title: "Les 3 états financiers, vue d'hélicoptère", emoji: "🚁", minutes: 18, xp: 40,
    hook: "Trois documents racontent toute la vie financière d'une entreprise. Avant de les disséquer au niveau 2, apprends à les survoler.",
    simple: "Pour comprendre une entreprise de l'extérieur, tu disposes de trois documents.\n\nLe compte de résultat (income statement) raconte la PERFORMANCE sur une période : « cette année, on a vendu pour X, dépensé Y, il reste Z de profit ». C'est un film.\n\nLe bilan (balance sheet) est une PHOTO à un instant donné : ce que l'entreprise possède (actifs) à gauche, et qui a financé tout ça (dettes et capitaux propres) à droite. Toujours équilibré : Actif = Passif + Capitaux propres.\n\nLe tableau de flux de trésorerie (cash flow statement) suit le CASH réel : combien est entré et sorti, et pourquoi. C'est le détecteur de mensonges : le profit peut être « habillé », le cash beaucoup plus difficilement.",
    analogy: "Imagine ton année personnelle. Ton compte de résultat : salaire 30 k€, dépenses 25 k€ → « profit » 5 k€. Ton bilan au 31 décembre : appartement + livret A d'un côté ; crédit immobilier de l'autre ; la différence, c'est ta richesse nette (equity). Ton cash flow : ce qui a VRAIMENT bougé sur ton compte courant — parce que tu peux être « riche » sur le papier et à découvert à la fin du mois.",
    deep: "Pourquoi trois documents et pas un ? À cause de la comptabilité d'engagement (accrual accounting) : on enregistre les ventes quand elles sont RÉALISÉES, pas quand elles sont ENCAISSÉES. Vendre à crédit crée du profit sans cash ; encaisser un abonnement d'avance crée du cash sans profit. Le compte de résultat mesure la performance économique ; le cash flow statement réconcilie cette performance avec la réalité bancaire ; le bilan enregistre tous les stocks intermédiaires (créances, dettes, stocks) créés par ces décalages.\n\nLes trois se connectent : le résultat net du compte de résultat alimente les capitaux propres du bilan (via les retained earnings) ET ouvre le cash flow statement ; le cash final du cash flow statement devient la ligne « cash » du bilan. Tu apprendras ces connexions par cœur au niveau 2 — c'est la question d'entretien la plus posée au monde.",
    traps: [
      "Le film vs la photo : le compte de résultat et le cash flow couvrent une PÉRIODE ; le bilan est une DATE.",
      "Profit ≠ cash — retiens l'idée dès maintenant, le niveau 2 la démontera pièce par pièce.",
      "Les trois documents ne sont pas indépendants : chaque ligne de l'un se retrouve quelque part dans les autres.",
    ],
    mnaUse: "« Walk me through the three financial statements » est LA question d'ouverture des entretiens. À ce stade, tu dois savoir la version 30 secondes ; au niveau 2, tu sauras la version complète et tous les walk-throughs.",
    diagrams: [
      { type: "flow", title: "Les 3 états et leurs liens", steps: [
        { label: "Income Statement", note: "performance (film)" }, { label: "Cash Flow", note: "cash réel (film)" }, { label: "Balance Sheet", note: "position (photo)" },
      ]},
      { type: "stack", title: "Le bilan : toujours équilibré", stacks: [
        { name: "Actif", layers: [{ label: "Cash" }, { label: "Créances & stocks" }, { label: "Machines (PP&E)" }, { label: "Goodwill & marques" }] },
        { name: "Passif + Equity", layers: [{ label: "Fournisseurs" }, { label: "Dette financière" }, { label: "Capitaux propres", note: "dont profits accumulés" }] },
      ]},
    ],
    examples: [
      { title: "Exemple simple", body: "Café Lumière vend 1 000 € de cartes cadeaux en décembre. Compte de résultat : rien (le café n'a pas encore été servi !). Cash flow : +1 000 €. Bilan : cash +1 000 € et une « dette » de cafés à servir (+1 000 €). Trois histoires différentes, une même transaction." },
      { title: "Exemple réel", body: "Les SaaS comme Salesforce encaissent leurs abonnements annuels d'avance : leur cash flow est très supérieur à leur profit comptable. À l'inverse, un industriel qui vend à crédit à 90 jours affiche des profits que son compte en banque n'a pas encore vus." },
      { title: "Erreur fréquente", body: "Regarder uniquement le compte de résultat pour juger une société. Les analystes crédit et les fonds regardent d'abord le cash — c'est aussi la réponse attendue à « quel état choisirais-tu s'il ne devait en rester qu'un ? »" },
    ],
    quizIds: ["ac1", "ac2", "ac21"],
    exercises: [
      { kind: "gap", title: "L'équation du bilan", prompt: "Complète l'équation fondamentale :", template: "◻ = ◻ + Capitaux propres", blanks: [
        { options: ["Actif", "Cash", "Chiffre d'affaires"], correct: 0 },
        { options: ["Profit", "Passif (dettes)", "EBITDA"], correct: 1 },
      ], explain: "Actif = Passif + Capitaux propres. Tout ce que l'entreprise possède a été financé soit par des tiers, soit par les actionnaires. TOUJOURS équilibré." },
      { kind: "tf", title: "Film ou photo ?", statements: [
        { text: "Le bilan couvre une période de 12 mois.", answer: false, explain: "Le bilan est une photo à une DATE (ex. 31/12). Ce sont l'IS et le CFS qui couvrent une période." },
        { text: "Une vente à crédit augmente le profit avant d'augmenter le cash.", answer: true, explain: "Comptabilité d'engagement : le revenu est reconnu à la vente, le cash arrive à l'encaissement." },
      ]},
    ],
    miniCase: {
      context: "Ton ami fonde une boîte de t-shirts. En décembre : il achète 5 000 € de t-shirts (payés cash), en vend pour 8 000 € à une boutique qui paiera en février, et il a encaissé 2 000 € de précommandes à livrer en janvier.",
      task: "Décris ce que montrent ses trois états financiers fin décembre (2-3 phrases par état). Est-il « riche » ?",
      hints: ["IS : qu'est-ce qui est vendu/consommé ? Les précommandes sont-elles du revenu ?", "Cash : qu'est-ce qui a VRAIMENT bougé ?"],
      modelAnswer: "Compte de résultat : ventes 8 000 € − coût des t-shirts vendus 5 000 € = profit ~3 000 €. Les 2 000 € de précommandes ne sont PAS du revenu (rien n'est livré) . Cash flow : −5 000 (achat) + 0 (la boutique n'a pas payé) + 2 000 (précommandes) = −3 000 € de cash. Bilan : créance de 8 000 € sur la boutique, cash en baisse, et une obligation de livrer 2 000 € de t-shirts (deferred revenue). Verdict : « profitable » de 3 000 € mais 3 000 € de cash EN MOINS — il est riche sur le papier et pauvre en banque. C'est exactement pourquoi il existe trois états.",
      keywords: ["3 000|3000", "précommande|deferred|pas du revenu", "-3|moins|négatif", "créance|8 000|8000", "papier|banque|profit.*cash"],
    },
  },

  // ═══════════════ NIVEAU 2 — COMPTABILITÉ ═══════════════
  {
    id: "c21", level: 2, title: "Le compte de résultat, ligne par ligne", emoji: "📄", minutes: 25, xp: 50,
    hook: "Du chiffre d'affaires au résultat net : chaque ligne raconte une décision. Et trois lignes (EBITDA, EBIT, NI) régneront sur toute la suite.",
    simple: "Le compte de résultat descend comme un escalier :\n\nChiffre d'affaires (revenue) : tout ce qui a été vendu sur la période. Moins le coût direct des produits vendus (COGS : matières, production) = marge brute. Moins les frais de fonctionnement (SG&A : salaires du siège, marketing, loyers) = le fameux EBITDA, le profit opérationnel avant amortissements. Moins la dépréciation & amortissement (D&A, l'usure comptable des équipements) = EBIT, le vrai profit opérationnel. Moins les intérêts de la dette = résultat avant impôt. Moins l'impôt = résultat net (net income), ce qui revient in fine aux actionnaires.\n\nRetiens la logique : d'abord la performance de la MACHINE (jusqu'à l'EBIT), ensuite le coût du FINANCEMENT (intérêts), enfin l'ÉTAT (impôt).",
    analogy: "Ton food truck encaisse 10 000 €/mois (revenue). Les ingrédients coûtent 3 000 € (COGS) → marge brute 7 000 €. Essence, assurance, ton aide de camp : 3 500 € (opex) → EBITDA 3 500 €. Le camion s'use : 500 €/mois de vieillissement (D&A) → EBIT 3 000 €. Le crédit du camion : 300 € d'intérêts → 2 700 €. L'État prend 25% → il te reste 2 025 € (net income).",
    deep: "Pourquoi trois niveaux de profit ? Parce qu'ils répondent à trois questions différentes. L'EBITDA neutralise les choix d'investissement (pas de D&A), de financement (pas d'intérêts) et la fiscalité : idéal pour COMPARER des entreprises entre elles — d'où son règne dans les multiples. L'EBIT réintègre l'usure des actifs : il dit la rentabilité réelle d'un business qui doit entretenir sa machine — crucial pour les industries capex-intensives. Le net income est ce qui revient aux actionnaires : c'est lui qui alimente les capitaux propres et l'EPS.\n\nSubtilité clé : la D&A est rarement une ligne isolée — elle se cache dans le COGS (usure des machines de production) et les SG&A (usure du siège). Pour la retrouver en entier, va au cash flow statement.\n\nDernier point : distingue toujours récurrent et exceptionnel. Une plus-value de cession ou un coût de restructuration « pollue » le résultat d'une année — les analystes les retraitent pour juger la performance normalisée (l'« adjusted EBITDA »).",
    traps: [
      "L'EBITDA n'est PAS un cash flow : il ignore le capex, le BFR et l'impôt. Le dire en entretien = points bonus.",
      "La D&A est cachée dans COGS et SG&A — le montant total est au cash flow statement.",
      "Comparer un net income entre entreprises très endettées et peu endettées n'a pas de sens : les intérêts faussent tout (d'où l'EBITDA).",
      "Revenue reconnu ≠ revenue encaissé : l'escalier mesure la performance, pas le cash.",
    ],
    mnaUse: "L'EBITDA est LA devise du M&A : les valorisations se parlent en « x fois l'EBITDA », les covenants de dette en « dette/EBITDA ». En entretien : « EBITDA vs EBIT vs net income ? », « pourquoi l'EBITDA pour les multiples ? », « is EBITDA a good proxy for cash flow? » — toutes tombent, systématiquement.",
    diagrams: [
      { type: "bridge", title: "L'escalier du compte de résultat (M€)", unit: "", items: [
        { label: "Revenue", value: 100, kind: "base" }, { label: "COGS", value: 40, kind: "sub" }, { label: "Opex", value: 25, kind: "sub" }, { label: "EBITDA", value: 35, kind: "total" }, { label: "D&A", value: 10, kind: "sub" }, { label: "EBIT", value: 25, kind: "total" }, { label: "Intérêts", value: 5, kind: "sub" }, { label: "Impôt (25%)", value: 5, kind: "sub" }, { label: "Net income", value: 15, kind: "total" },
      ]},
    ],
    examples: [
      { title: "Exemple chiffré complet", body: "NovaTech : revenue 100, COGS 40, SG&A 25 (dont D&A totale 10 répartie entre COGS et SG&A — disons présentée séparément ici). EBITDA = 100 − 40 − 25 + 10 = ... attention ! Si la D&A est DANS les 65 de coûts, EBITDA = 35 + 10 = 45 ? Non : refais le calcul proprement. Coûts cash = 55, D&A = 10. EBITDA = 100 − 55 = 45 ; EBIT = 35 ; avec 5 d'intérêts et 25% d'impôt : NI = 22,5. Cet exercice de reconstruction, tu le referas en entretien." },
      { title: "Exemple réel", body: "Les télécoms affichent des EBITDA énormes (marges 35-40%) mais des net incomes modestes : des D&A massives (réseaux) et de la dette. C'est exactement pourquoi le marché les juge sur EV/EBITDA... et sur le cash après capex." },
      { title: "Erreur fréquente", body: "« L'EBITDA de A (50) est supérieur à celui de B (40), donc A est plus rentable. » Si A fait 500 de CA et B 100, la marge de B (40%) écrase celle de A (10%). Toujours raisonner en niveaux ET en marges." },
    ],
    quizIds: ["ac3", "ac13", "ac15"],
    exercises: [
      { kind: "gap", title: "Reconstruis l'escalier", prompt: "Complète les formules :", template: "EBITDA = Revenue − COGS − ◻ (hors D&A)\nEBIT = EBITDA − ◻\nNet income = (EBIT − ◻) × (1 − taux d'impôt)", blanks: [
        { options: ["Opex/SG&A", "Intérêts", "Impôts"], correct: 0 },
        { options: ["Capex", "D&A", "Dividendes"], correct: 1 },
        { options: ["Intérêts", "D&A", "Capex"], correct: 0 },
      ], explain: "Machine d'abord (EBITDA, EBIT), financement ensuite (intérêts), État à la fin (impôt). Le capex n'apparaît JAMAIS dans cet escalier — il est au bilan et au cash flow." },
      { kind: "tf", title: "Les trois profits", statements: [
        { text: "L'EBITDA est toujours supérieur ou égal à l'EBIT.", answer: true, explain: "EBITDA = EBIT + D&A, et la D&A est ≥ 0. (Égaux seulement si D&A = 0 — rarissime.)" },
        { text: "Une hausse des intérêts de la dette réduit l'EBITDA.", answer: false, explain: "Les intérêts sont APRÈS l'EBITDA et l'EBIT — c'est toute la logique « avant financement » de ces agrégats." },
        { text: "L'adjusted EBITDA retraite les éléments non récurrents.", answer: true, explain: "Restructurations, litiges, one-offs : on les retire pour juger la performance normalisée. En M&A, la due diligence (QoE) passe ces retraitements au crible." },
      ]},
    ],
    miniCase: {
      context: "Le CFO de NovaTech te tend son P&L : revenue 200, COGS 90, SG&A 50, D&A 20 (déjà incluse dans les 140 de coûts), intérêts 8, impôt 25%. Un fonds propose de racheter la société « 10x l'EBITDA ».",
      task: "Calcule EBITDA, EBIT, net income — puis le prix proposé. Montre chaque étape.",
      hints: ["Coûts cash = (90+50) − 20 de D&A.", "EBITDA = revenue − coûts cash."],
      modelAnswer: "Coûts totaux = 140, dont 20 de D&A → coûts cash = 120. EBITDA = 200 − 120 = 80. EBIT = 80 − 20 = 60. EBT = 60 − 8 = 52 ; net income = 52 × 0,75 = 39. Prix proposé = 10 × 80 = 800 (valeur d'entreprise). Piège évité : ne pas soustraire la D&A deux fois — elle était déjà dans les coûts affichés.",
      keywords: ["80", "60", "39", "800", "120|cash|deux fois"],
    },
  },

  {
    id: "c22", level: 2, title: "Le bilan et la partie double", emoji: "⚖️", minutes: 25, xp: 50,
    hook: "Actif = Passif + Equity, toujours. Comprends POURQUOI, et les walk-throughs d'entretien deviendront des réflexes.",
    simple: "Le bilan répond à deux questions : qu'est-ce que l'entreprise POSSÈDE (actif), et qui a PAYÉ pour ça (passif + capitaux propres).\n\nÀ gauche, l'actif, rangé du plus liquide au moins liquide : cash, créances clients (l'argent que les clients doivent), stocks, puis les immobilisations (machines — PP&E), et les incorporels (marques, goodwill).\n\nÀ droite, les financeurs : les fournisseurs qu'on paiera plus tard (accounts payable), la dette financière, et les capitaux propres — l'argent apporté par les actionnaires PLUS tous les profits accumulés jamais distribués (retained earnings).\n\nL'équation Actif = Passif + Equity n'est pas une coïncidence : chaque euro d'actif a forcément été financé par quelqu'un. C'est une tautologie comptable — et ta meilleure alliée pour vérifier tes raisonnements.",
    analogy: "Ton patrimoine personnel : à gauche, appartement 300 k€ + voiture 10 k€ + livret 5 k€ = 315 k€ d'actifs. À droite : crédit immobilier 200 k€ (passif) — et le reste, 115 k€, c'est TA richesse nette (equity). Si l'appartement prend 20 k€ de valeur, ton equity monte de 20 k€ : l'équation s'équilibre toute seule.",
    deep: "La comptabilité en partie double : toute transaction touche AU MOINS deux comptes, et l'équation reste équilibrée. Acheter une machine 100 en cash : actif machine +100, actif cash −100 (total inchangé). L'acheter à crédit : actif +100, dette +100. Faire un profit de 50 : le cash (ou les créances) monte de 50 à l'actif, et les retained earnings montent de 50 côté equity.\n\nLes conventions débit/crédit formalisent cela : débiter un compte d'actif l'augmente, créditer un compte de passif/equity l'augmente. Tu n'as PAS besoin de virtuosité de comptable — mais tu dois savoir dérouler l'impact d'une opération sur le bilan sans le déséquilibrer : c'est exactement ce que testent les « walk me through » d'entretien.\n\nDeux postes méritent ton attention dès maintenant : les retained earnings (le pont avec le compte de résultat : RE fin = RE début + net income − dividendes) et le goodwill (créé uniquement lors d'acquisitions — chapitre dédié au niveau 5).",
    traps: [
      "Les capitaux propres ne sont PAS du cash : c'est une source de financement comptable, pas un tas de billets.",
      "La valeur comptable (book value) de l'equity n'est pas sa valeur de marché : le bilan enregistre des coûts historiques.",
      "Un dividende réduit les retained earnings et le cash — il ne passe JAMAIS par le compte de résultat.",
      "Si ton walk-through ne balance pas, il est faux. Toujours conclure par « the balance sheet balances »." ,
    ],
    mnaUse: "Tous les « walk me through » d'entretien se vérifient par l'équilibre du bilan. Et en M&A, le bilan est partout : dette nette pour le bridge EV→Equity, BFR pour les ajustements de prix, book value pour le goodwill.",
    diagrams: [
      { type: "stack", title: "Le bilan de NovaTech (M€)", stacks: [
        { name: "Actif = 300", layers: [{ label: "Cash 40" }, { label: "Créances 60" }, { label: "Stocks 50" }, { label: "PP&E 120" }, { label: "Incorporels 30" }] },
        { name: "Passif + Equity = 300", layers: [{ label: "Fournisseurs 45" }, { label: "Dette 105" }, { label: "Capital apporté 60" }, { label: "Retained earnings 90" }] },
      ]},
    ],
    examples: [
      { title: "Exemple simple", body: "NovaTech emprunte 50 : cash +50 (actif), dette +50 (passif). Elle achète ensuite une machine 30 : cash −30, PP&E +30 — l'actif total ne bouge pas. Deux écritures, zéro déséquilibre." },
      { title: "Exemple : le profit qui boucle", body: "NovaTech gagne 39 de net income (chapitre précédent) et distribue 9 de dividendes. Retained earnings : +39 − 9 = +30. Côté actif : le cash (et les créances) ont monté d'autant au fil de l'année. Le compte de résultat vient littéralement « se ranger » dans le bilan." },
      { title: "Erreur fréquente", body: "« La société a 90 de retained earnings, elle peut donc payer 90 de dividendes. » Non : les RE sont un compteur comptable, pas un compte en banque. Si le cash est de 40, elle ne paiera pas 90." },
    ],
    quizIds: ["ac10", "ac12", "ac20"],
    extraQuiz: [
      { id: "xq-c22a", kind: "mcq", topic: "accounting", tags: ["debit-credit"], difficulty: 2,
        prompt: "NovaTech achète 20 de stock, payable à 60 jours. Impact immédiat sur le bilan ?",
        choices: ["Stock +20, cash −20", "Stock +20, fournisseurs (AP) +20", "Stock +20, equity −20", "Aucun impact avant le paiement"],
        answer: 1, explanation: "Achat à crédit : l'actif (stock) monte, et le financeur est le fournisseur (accounts payable). Le cash ne bougera qu'au paiement. L'équation reste équilibrée : +20 des deux côtés." },
    ],
    exercises: [
      { kind: "tf", title: "Équilibre, toujours", statements: [
        { text: "Émettre des actions pour 100 augmente le cash et les capitaux propres de 100.", answer: true, explain: "Cash +100 (actif), capital apporté +100 (equity). Ça balance." },
        { text: "Payer un dividende de 20 réduit le net income de 20.", answer: false, explain: "Le dividende ne touche PAS le compte de résultat : il réduit cash et retained earnings." },
        { text: "La book value de l'equity égale sa valeur de marché.", answer: false, explain: "Le bilan est au coût historique ; le marché price le futur. Apple vaut en bourse un multiple de sa book value." },
      ]},
      { kind: "gap", title: "Le pont IS → Bilan", prompt: "Complète la formule des retained earnings :", template: "RE fin = RE début + ◻ − ◻", blanks: [
        { options: ["Net income", "EBITDA", "Cash flow"], correct: 0 },
        { options: ["Capex", "Dividendes", "Intérêts"], correct: 1 },
      ], explain: "Les profits non distribués s'accumulent : RE fin = RE début + net income − dividendes. C'est LE pont entre compte de résultat et bilan." },
    ],
    miniCase: {
      context: "Walk-through d'entretien : « NovaTech achète pour 60 une machine, financée moitié cash, moitié emprunt bancaire. »",
      task: "Déroule l'impact sur le bilan, poste par poste, et vérifie l'équilibre. (L'income statement bouge-t-il ?)",
      hints: ["Trois postes bougent à l'actif et au passif.", "Le capex passe-t-il au compte de résultat ?"],
      modelAnswer: "Actif : PP&E +60, cash −30 → actif net +30. Passif : dette +30. Équilibre : +30 = +30 ✓. L'income statement ne bouge PAS aujourd'hui : le capex est capitalisé, pas passé en charge — il ne touchera le P&L que via la D&A des prochaines années (et les intérêts du nouvel emprunt). Conclure : « the balance sheet balances ».",
      keywords: ["60", "30", "dette", "balance|équilibr", "d&a|amortis|capitalisé", "income.*pas|pas.*income"],
    },
  },

  {
    id: "c23", level: 2, title: "Le cash flow statement, détecteur de vérité", emoji: "💧", minutes: 25, xp: 50,
    hook: "Le profit est une opinion, le cash est un fait. Ce document réconcilie les deux — et les recruteurs adorent s'y promener.",
    simple: "Le cash flow statement répond à une question simple : où est passé le cash cette année ? Il se lit en trois blocs.\n\nCash from Operations (CFO) : le cash généré par le métier. On part du net income, on rajoute les charges qui n'ont pas coûté de cash (la D&A !), et on ajuste des décalages de paiement (clients qui n'ont pas payé, fournisseurs qu'on n'a pas payés — le BFR, chapitre 6).\n\nCash from Investing (CFI) : le cash investi dans la machine — le capex (achat d'équipements), les acquisitions, ou à l'inverse les cessions.\n\nCash from Financing (CFF) : les mouvements avec les financeurs — emprunts nouveaux, remboursements, dividendes, rachats d'actions.\n\nLa somme des trois = la variation de cash de l'année, qui relie le cash du bilan d'ouverture à celui de clôture.",
    analogy: "Ton relevé bancaire annuel, trié en trois tas : ce que ton activité t'a rapporté (salaire moins dépenses courantes), ce que tu as investi (travaux dans l'appartement), et tes mouvements avec la banque (nouvel emprunt, remboursements). Les trois tas expliquent pourquoi ton solde a bougé.",
    deep: "La méthode indirecte (standard) part du net income et le « dé-comptabilise » : + D&A et autres charges non-cash (SBC, provisions), − les hausses d'actifs circulants (créances ↑ = ventes non encaissées), + les hausses de passifs circulants (fournisseurs ↑ = achats non décaissés). Résultat : le cash opérationnel réel.\n\nLecture stratégique des trois blocs : une entreprise saine mature a un CFO largement positif, un CFI négatif (elle investit) et un CFF souvent négatif (elle rend de l'argent : dividendes, buybacks, désendettement). Une startup en croissance : CFO négatif ou faible, CFI négatif, CFF positif (elle lève). Une entreprise en difficulté : CFO qui s'érode, CFI en berne (elle n'investit plus), CFF positif par nécessité (elle emprunte pour survivre). Trois profils, trois histoires — apprends à les reconnaître d'un coup d'œil.\n\nD'ici la fin du niveau, tu sauras faire le pont complet : EBITDA → (− impôts, − ΔBFR) → CFO → (− capex) → free cash flow — la matière première de toute valorisation.",
    traps: [
      "La D&A « rajoutée » au CFO n'est pas une rentrée d'argent : on annule juste une charge qui n'était pas du cash.",
      "Le remboursement du PRINCIPAL d'une dette est en financing ; les INTÉRÊTS sont déjà dans le CFO (via le net income).",
      "Un CFO positif peut cacher un business qui meurt : vendre ses stocks sans les renouveler « libère » du cash une fois.",
      "Capex ≠ charge : il ne passe jamais par le compte de résultat — c'est l'investing qui le capture.",
    ],
    mnaUse: "En due diligence, l'acheteur reconstruit toujours la conversion EBITDA → FCF : c'est elle qui dit si l'EBITDA « payé » dans le multiple se transforme en vrai cash. En entretien : « walk me through the CFS », « où apparaît le capex ? », « pourquoi rajoute-t-on la D&A ? ».",
    diagrams: [
      { type: "bridge", title: "Du net income au cash (M€)", unit: "", items: [
        { label: "Net income", value: 39, kind: "base" }, { label: "+ D&A", value: 20, kind: "add" }, { label: "− ΔBFR", value: 9, kind: "sub" }, { label: "CFO", value: 50, kind: "total" }, { label: "− Capex", value: 25, kind: "sub" }, { label: "FCF", value: 25, kind: "total" },
      ]},
      { type: "flow", title: "Les 3 blocs du CFS", steps: [
        { label: "Operations", note: "NI + non-cash ± BFR" }, { label: "Investing", note: "capex, acquisitions" }, { label: "Financing", note: "dette, dividendes" }, { label: "Δ Cash", note: "→ bilan" },
      ]},
    ],
    examples: [
      { title: "Exemple simple", body: "NovaTech : NI 39, D&A 20, créances +15 (clients lents), fournisseurs +6. CFO = 39 + 20 − 15 + 6 = 50. Capex 25 → il reste 25 de cash « libre ». Emprunt +10, dividendes −9 → variation de cash = 26." },
      { title: "Exemple réel", body: "Amazon a longtemps affiché des profits faibles mais des CFO massifs : BFR négatif (clients paient comptant, fournisseurs à 60 jours) + D&A énormes rajoutées. Les analystes qui ne lisaient que le P&L ont raté l'histoire." },
      { title: "Erreur fréquente", body: "Confondre « cash from operations » et « free cash flow » : le FCF déduit le capex. Un CFO de 50 avec 45 de capex laisse 5 — pas 50 — pour les financeurs." },
    ],
    quizIds: ["ac14", "ac19", "ac6"],
    exercises: [
      { kind: "order", title: "Classe chaque opération dans son bloc", prompt: "Remets ces flux dans l'ordre des blocs du CFS (Operations → Investing → Financing) :", items: ["Encaissement des créances clients", "Achat d'une machine (capex)", "Versement d'un dividende"], explain: "Créances = operations (cycle d'exploitation) ; capex = investing ; dividende = financing. Réflexe indispensable." },
      { kind: "gap", title: "La formule du CFO", prompt: "Méthode indirecte — complète :", template: "CFO = Net income + ◻ − hausse des ◻ + hausse des ◻", blanks: [
        { options: ["D&A (non-cash)", "Capex", "Dividendes"], correct: 0 },
        { options: ["dettes financières", "créances & stocks", "capitaux propres"], correct: 1 },
        { options: ["fournisseurs (AP)", "immobilisations", "intérêts"], correct: 0 },
      ], explain: "On annule le non-cash, on retire le cash « coincé » chez les clients et dans les stocks, on ajoute le financement gratuit des fournisseurs." },
    ],
    miniCase: {
      context: "Deux sociétés affichent le même net income de 50. Alpha : D&A 30, capex 80, créances +20. Beta : D&A 10, capex 12, deferred revenue +25 (abonnements encaissés d'avance).",
      task: "Calcule un proxy de FCF pour chacune (NI + D&A − capex ± ΔBFR). Laquelle préfères-tu acheter, et pourquoi ?",
      hints: ["La deferred revenue qui augmente, c'est du cash encaissé en avance : +25.", "Alpha investit-elle plus qu'elle ne génère ?"],
      modelAnswer: "Alpha : 50 + 30 − 80 − 20 = −20 de FCF. Beta : 50 + 10 − 12 + 25 = +73. Même « profit », réalités opposées : Alpha brûle du cash (capex lourd, clients lents) ; Beta en génère plus que son profit (asset-light, clients qui paient d'avance). À P&L identique, Beta vaut plusieurs fois Alpha — c'est LA démonstration que le cash flow statement est l'état le plus honnête.",
      keywords: ["-20|−20", "73", "beta", "avance|deferred", "brûle|capex lourd"],
    },
  },

  {
    id: "c24", level: 2, title: "Les liens entre les 3 états : l'art du walk-through", emoji: "🔗", minutes: 30, xp: 60,
    hook: "« D&A augmente de 10, walk me through the three statements. » Cette question tombe dans un entretien sur deux. Après ce chapitre, elle devient un réflexe.",
    simple: "Les trois états sont trois vues d'un même système, cousues ensemble par quatre coutures :\n\n1. Le net income (bas du compte de résultat) est la PREMIÈRE ligne du cash flow statement.\n2. Ce même net income alimente les retained earnings du bilan (moins les dividendes).\n3. Le cash final du cash flow statement EST la ligne cash du bilan.\n4. La D&A relie le P&L aux immobilisations : chaque année, elle réduit le PP&E au bilan.\n\nLa méthode pour tout walk-through, dans CET ordre : (1) Income statement — la charge ou le produit, et son effet d'impôt. (2) Cash flow — partir du NI, annuler le non-cash, capter les mouvements de BFR/capex/financement. (3) Bilan — vérifier que l'actif et le passif bougent du même montant. Conclure : « the balance sheet balances ».",
    analogy: "Trois caméras filment le même match : une compte les points (P&L), une suit le ballon (cash), une photographie le terrain entre les actions (bilan). Si les trois racontent des histoires incompatibles, c'est que tu t'es trompé quelque part — l'équilibre du bilan est l'arbitre vidéo.",
    deep: "Déroulons le classique absolu — D&A +10, impôt 25% :\n\nIS : EBIT −10 → impôt économisé +2,5 → net income −7,5.\nCFS : on part de −7,5 ; la D&A est non-cash, on la rajoute : +10 → cash +2,5. Oui, PLUS de D&A crée PLUS de cash — via l'économie d'impôt.\nBilan : actif — PP&E −10, cash +2,5 → −7,5 ; passif — retained earnings −7,5. Balance ✓.\n\nAutres archétypes à maîtriser : l'achat de stock cash (bilan seul : stock +, cash − ; l'IS attend la vente), la vente à crédit (IS et créances montent, cash zéro… sauf l'impôt payé !), l'achat de machine à crédit (PP&E et dette montent ; IS intact aujourd'hui), le buyback (cash et equity baissent, IS intact, EPS monte).\n\nLa discipline : TOUJOURS annoncer le taux d'impôt, TOUJOURS les trois états dans l'ordre, TOUJOURS le mot de la fin sur l'équilibre. Les recruteurs notent la méthode autant que le résultat.",
    traps: [
      "Oublier l'effet d'impôt : la moitié des candidats répondent « NI −10 » au lieu de −7,5. Éliminatoire dans les bonnes banques.",
      "Dire « la D&A ajoute du cash » sans expliquer : c'est l'ÉCONOMIE D'IMPÔT qui crée le cash, la D&A n'est qu'une écriture.",
      "Ne pas boucler le bilan : un walk-through non bouclé est un walk-through faux.",
      "Confondre le sens : hausse d'un actif = consommation de cash ; hausse d'un passif = source de cash.",
    ],
    mnaUse: "C'est LE test technique d'entretien numéro 1, toutes banques confondues. Variantes : D&A, achat de stock, vente d'actif à perte, write-down, deferred revenue. Même méthode, mêmes réflexes — la banque veut vérifier que tu vois le système, pas trois documents.",
    diagrams: [
      { type: "flow", title: "Les 4 coutures entre les états", steps: [
        { label: "Net income", note: "IS → CFS (ligne 1)" }, { label: "NI − div.", note: "→ retained earnings" }, { label: "Cash final CFS", note: "→ cash du bilan" }, { label: "D&A", note: "IS → PP&E ↓" },
      ]},
    ],
    examples: [
      { title: "Le classique : D&A +10 (impôt 25%)", body: "IS : NI −7,5. CFS : −7,5 + 10 = +2,5. Bilan : PP&E −10, cash +2,5 (actif −7,5) = RE −7,5 (passif). Balance ✓. À savoir dérouler en 40 secondes, sans hésitation." },
      { title: "Vente à crédit de 100 (marge 100%, impôt 25%)", body: "IS : revenue +100, NI +75. CFS : +75, mais créances +100 à déduire → cash −25 (l'impôt payé en cash sur un revenu non encaissé !). Bilan : créances +100, cash −25, RE +75. Balance ✓. Moralité : vendre sans encaisser COÛTE du cash." },
      { title: "Erreur fréquente", body: "Réciter les impacts en vrac sans structure. La forme attendue : « On the income statement… On the cash flow statement… On the balance sheet… and the balance sheet balances. » La structure EST la réponse." },
    ],
    quizIds: ["ac4", "ac11", "ac22", "ac2"],
    exercises: [
      { kind: "order", title: "La méthode du walk-through", prompt: "Remets les étapes de la méthode dans l'ordre :", items: ["Income statement : charge/produit + effet d'impôt", "Cash flow : partir du NI, annuler le non-cash", "Bilan : dérouler actif et passif", "Conclure : « the balance sheet balances »"], explain: "IS → CFS → BS → conclusion. Cet ordre n'est pas négociable : c'est la grammaire de l'exercice." },
      { kind: "tf", title: "Sens des flux", statements: [
        { text: "Une hausse des créances clients consomme du cash.", answer: true, explain: "Vendre sans encaisser immobilise du cash chez les clients." },
        { text: "Une hausse des fournisseurs (AP) consomme du cash.", answer: false, explain: "Payer plus tard = garder son cash plus longtemps : c'est une SOURCE de cash." },
        { text: "Avec un impôt de 30%, une D&A de +10 augmente le cash de +3.", answer: true, explain: "NI −7 ; +10 de D&A réintégrée → cash +3 = l'économie d'impôt (10 × 30%)." },
      ]},
    ],
    miniCase: {
      context: "Question posée telle quelle en entretien : « NovaTech passe un write-off de stock de 40 (stock invendable). Taux d'impôt 25%. Walk me through the three statements. »",
      task: "Déroule les trois états dans l'ordre, avec les chiffres, et boucle le bilan.",
      hints: ["Le write-off est une charge… cash ou non-cash ?", "Quel poste d'actif disparaît ?"],
      modelAnswer: "IS : charge de 40 (dans le COGS) → EBT −40, impôt −10 → net income −30. CFS : NI −30 ; le write-off est NON-CASH, on le rajoute +40 ; et le stock au bilan baisse de 40 (ΔBFR favorable déjà capté par le write-off — attention à ne pas compter deux fois) → cash +10 (l'économie d'impôt). Bilan : stock −40, cash +10 → actif −30 ; retained earnings −30 → passif −30. The balance sheet balances. Intuition : détruire du stock ne coûte pas de cash AUJOURD'HUI (il était déjà payé) — et l'économie d'impôt en rapporte un peu.",
      keywords: ["-30|−30", "non-cash|rajoute", "+10|10", "stock.*40|40.*stock", "balance"],
    },
  },

  {
    id: "c25", level: 2, title: "D&A, Capex : la vie des machines", emoji: "🏗️", minutes: 22, xp: 50,
    hook: "Le capex construit la machine, la D&A la fait vieillir sur le papier. Confondre les deux coûte des points en entretien — et des millions en modèle.",
    simple: "Quand une entreprise achète un équipement durable (machine, camion, serveur), elle ne passe PAS le coût en charge immédiatement. Elle le capitalise : l'équipement entre au bilan comme un actif (PP&E), et son coût est étalé en charges sur sa durée d'utilisation — c'est la dépréciation (D&A).\n\nPourquoi ? Le principe de rattachement : une machine qui servira 10 ans doit peser sur 10 années de résultats, pas une seule. Acheter une machine 100 amortie sur 10 ans = 10 de charge par an, pendant 10 ans.\n\nLe capex (capital expenditure), c'est l'ARGENT dépensé pour acheter/renouveler ces actifs — il sort en cash immédiatement (cash flow investing) mais n'apparaît jamais dans le compte de résultat. La D&A, c'est l'ombre comptable du capex passé : une charge sans cash.",
    analogy: "Tu achètes une voiture 20 000 € pour faire du VTC. Ton compte en banque perd 20 000 € aujourd'hui (capex). Mais dans ta tête de gestionnaire, la voiture te « coûte » 4 000 €/an pendant 5 ans (D&A) — c'est ce coût-là que tu répercutes dans le prix de tes courses. Deux réalités : le cash (brutal, immédiat) et l'économique (étalé, lissé).",
    deep: "Le cycle complet : capex → PP&E au bilan → D&A annuelle au P&L → PP&E net qui décroît → remplacement (nouveau capex). En régime de croisière, PP&E net fin = PP&E début + capex − D&A.\n\nDistinction stratégique : le capex de MAINTENANCE (remplacer l'existant, ≈ D&A à terme) vs le capex de CROISSANCE (nouvelles capacités). Un business qui « croît » avec un capex inférieur à sa D&A pendant des années ment quelque part : ses actifs fondent.\n\nL'amortissement a des règles : linéaire (le standard), parfois accéléré fiscalement — ce qui crée un écart entre impôt comptable et impôt payé (les deferred taxes du chapitre 7). Les incorporels acquis (marques, relations clients) s'amortissent aussi ; le goodwill, lui, ne s'amortit pas (test d'impairment annuel).\n\nEn valorisation, ce chapitre est partout : l'EBITDA exclut la D&A (d'où sa comparabilité), le FCF déduit le capex réel, et l'hypothèse terminale d'un DCF exige capex ≥ D&A si l'entreprise croît.",
    traps: [
      "Le capex n'est PAS une charge : il ne réduit pas l'EBIT de l'année. L'erreur de débutant par excellence.",
      "Capex durablement < D&A avec croissance = incohérent (les actifs fondent). Piège favori des interviewers sur le DCF.",
      "La D&A n'est pas « du cash qui revient » : c'est l'économie d'impôt qu'elle génère qui est du cash.",
      "Intensité capitalistique : comparer les multiples EV/EBITDA d'un asset-light et d'un asset-heavy sans regarder le capex est un piège (l'EBITDA ignore l'usure)." ,
    ],
    mnaUse: "En due diligence, l'acheteur sépare toujours maintenance et growth capex : le premier est un coût récurrent qui réduit la valeur, le second un choix. Questions d'entretien : « what happens when capex rises by 10? », « why is EBITDA misleading for capex-heavy businesses? »",
    diagrams: [
      { type: "flow", title: "Le cycle capex → D&A", steps: [
        { label: "Capex 100", note: "cash out (investing)" }, { label: "PP&E +100", note: "au bilan" }, { label: "D&A 10/an", note: "charge au P&L" }, { label: "PP&E net ↓", note: "jusqu'au remplacement" },
      ]},
    ],
    examples: [
      { title: "Exemple simple", body: "NovaTech achète un serveur 60, amorti sur 5 ans. Année 0 : cash −60, PP&E +60, IS intact. Années 1-5 : D&A 12/an → EBIT −12, et le PP&E net descend de 60 à 0. Total des charges sur 5 ans = 60 = le capex initial. Tout finit par se rejoindre — mais pas au même moment." },
      { title: "Exemple réel", body: "Un opérateur télécom : EBITDA 10 Md€, mais 4 Md€ de capex annuel récurrent (réseaux). Son « vrai » cash opérationnel est 6, pas 10 — d'où la métrique EV/(EBITDA − capex) du secteur. À l'inverse, un éditeur de logiciels convertit 90% de son EBITDA en cash." },
      { title: "Erreur fréquente", body: "Dans un paper LBO, oublier de déduire le capex du cash disponible pour rembourser la dette. Résultat : un désendettement fantaisiste et un IRR délirant. Le capex est LE grand absent des calculs ratés." },
    ],
    quizIds: ["ac9", "ac16", "dc9"],
    exercises: [
      { kind: "gap", title: "Le roll-forward du PP&E", prompt: "Complète la formule :", template: "PP&E net fin = PP&E net début + ◻ − ◻", blanks: [
        { options: ["Capex", "D&A", "Dividendes"], correct: 0 },
        { options: ["Capex", "D&A", "Intérêts"], correct: 1 },
      ], explain: "On ajoute les nouveaux investissements, on retire l'usure comptable de l'année. Ce « roll-forward » structure la feuille PP&E de tout modèle financier." },
      { kind: "tf", title: "Capex ou D&A ?", statements: [
        { text: "Le capex apparaît dans le compte de résultat l'année de l'achat.", answer: false, explain: "Jamais : il est capitalisé au bilan, puis étalé en D&A." },
        { text: "À long terme, une entreprise en croissance doit avoir un capex ≥ à sa D&A.", answer: true, explain: "Sinon ses actifs se contractent — incompatible avec la croissance. Piège classique du DCF terminal." },
        { text: "Une hausse de D&A augmente le cash (à fiscalité positive).", answer: true, explain: "Charge non-cash + économie d'impôt réelle → cash net positif. Le walk-through du chapitre précédent." },
      ]},
    ],
    miniCase: {
      context: "Un fonds compare deux cibles au même EBITDA de 100 : TransLog (transport : capex de maintenance 60/an) et SoftCo (logiciel : capex 5/an). Les deux sont proposées « 8x l'EBITDA », soit 800.",
      task: "Calcule le cash opérationnel après capex de chacune, le multiple implicite sur ce cash, et dis quelle offre est la plus chère EN RÉALITÉ.",
      hints: ["EBITDA − capex = proxy du cash avant impôt/BFR.", "800 ÷ ce cash = multiple réel."],
      modelAnswer: "TransLog : 100 − 60 = 40 de cash → 800/40 = 20x. SoftCo : 100 − 5 = 95 → 800/95 ≈ 8,4x. Au même multiple d'EBITDA affiché, TransLog est en réalité ~2,4 fois plus chère : son EBITDA est « de mauvaise qualité » car largement absorbé par le capex de maintenance. Moralité : un multiple d'EBITDA ne se lit JAMAIS sans la conversion en cash — c'est l'argument qui différencie un candidat en entretien.",
      keywords: ["40", "20x|20", "95", "8,4|8.4", "conversion|qualité|absorbé"],
    },
  },

  {
    id: "c26", level: 2, title: "Le working capital (BFR), tueur silencieux", emoji: "🌀", minutes: 25, xp: 50,
    hook: "Des entreprises rentables meurent chaque année d'une seule cause : le cash coincé dans le cycle d'exploitation. Voici le BFR.",
    simple: "Entre le moment où tu paies tes fournisseurs et celui où tes clients te paient, ton argent est COINCÉ : dans les stocks qui attendent d'être vendus, dans les factures clients qui attendent d'être réglées. Ce cash immobilisé, c'est le working capital (BFR).\n\nBFR = (créances clients + stocks) − (dettes fournisseurs). Les fournisseurs qu'on paie plus tard FINANCENT une partie du cycle — d'où le signe moins.\n\nCe qui compte pour le cash, ce n'est pas le NIVEAU du BFR mais sa VARIATION : un BFR qui augmente (plus de stocks, clients plus lents) CONSOMME du cash ; un BFR qui baisse en libère. Et voici le piège mortel : la CROISSANCE augmente mécaniquement le BFR — plus de ventes = plus de stocks et plus de créances. Grandir coûte du cash avant d'en rapporter.",
    analogy: "Tu tiens un stand de limonade. Chaque matin, tu achètes les citrons (cash out). Tu vends toute la journée, mais l'école qui te commande 50 gobelets paie « à la fin du mois ». Plus ton stand marche, plus tu dois avancer de citrons et attendre de paiements : ton succès te vide les poches à court terme. C'est ça, le BFR.",
    deep: "Les trois curseurs se mesurent en jours : DSO (Days Sales Outstanding — délai de paiement clients), DIO (Days Inventory — durée de détention des stocks), DPO (Days Payable — délai de paiement fournisseurs). Le cash conversion cycle = DSO + DIO − DPO : le nombre de jours pendant lesquels chaque euro du cycle est immobilisé.\n\nCertains business ont un BFR NÉGATIF — un superpouvoir : la grande distribution (clients paient comptant, fournisseurs à 60 jours) et les SaaS (abonnements encaissés d'avance = deferred revenue). Chez eux, la croissance GÉNÈRE du cash au lieu d'en consommer.\n\nEn modélisation, on projette le BFR en % du chiffre d'affaires (ou par rotations DSO/DIO/DPO) et on déduit sa VARIATION du free cash flow. En M&A, le BFR est un champ de bataille contractuel : le prix suppose un « niveau normal » de BFR à la livraison (peg), et l'écart s'ajuste au closing — un vendeur malin qui vide ses stocks avant la vente se le verra refacturer.",
    traps: [
      "C'est la VARIATION du BFR qui touche le cash, pas son niveau. Erreur n°1 en DCF.",
      "Une entreprise en hypercroissance rentable peut mourir de BFR : le P&L ne le montre jamais.",
      "BFR négatif ≠ problème : c'est souvent un modèle d'affaires en or (clients paient d'avance).",
      "Dans le BFR opérationnel, on EXCLUT le cash et la dette financière : ce sont des éléments de financement.",
    ],
    mnaUse: "Ajustement de prix au closing (BFR normatif vs réel), analyse de la qualité du cash en due diligence, et LA question d'entretien : « les créances augmentent de 20, impact sur les 3 états ? » ou « pourquoi une entreprise rentable peut-elle manquer de cash ? »",
    diagrams: [
      { type: "flow", title: "Le cash conversion cycle", steps: [
        { label: "J0 : achat stock", note: "cash sort (ou AP)" }, { label: "J+45 : vente", note: "DIO = 45 j" }, { label: "J+45 : facture émise", note: "créance créée" }, { label: "J+90 : encaissement", note: "DSO = 45 j" },
      ]},
      { type: "bridge", title: "Calcul du BFR de NovaTech (M€)", unit: "", items: [
        { label: "Créances", value: 60, kind: "base" }, { label: "+ Stocks", value: 50, kind: "add" }, { label: "− Fournisseurs", value: 45, kind: "sub" }, { label: "BFR", value: 65, kind: "total" },
      ]},
    ],
    examples: [
      { title: "Exemple : la croissance qui coûte", body: "NovaTech passe de 200 à 300 de CA (+50%). Son BFR (32% du CA) passe de 65 à ~97 : la croissance a « mangé » 32 de cash — presque tout le net income de l'année. Le P&L applaudit, le compte en banque grimace." },
      { title: "Exemple réel", body: "Les distributeurs (supermarchés) encaissent en caisse aujourd'hui et paient leurs fournisseurs à 60 jours : chaque nouveau magasin APPORTE du cash dès l'ouverture. À l'inverse, les équipementiers aéronautiques immobilisent des mois de production avant chaque livraison." },
      { title: "Erreur fréquente", body: "Modéliser un DCF en déduisant le NIVEAU de BFR chaque année au lieu de sa variation — la valorisation s'effondre à tort. On déduit ΔBFR, jamais le stock." },
    ],
    quizIds: ["ac5", "ac17", "ac7"],
    exercises: [
      { kind: "tf", title: "Sources et emplois", statements: [
        { text: "Une hausse des stocks est une source de cash.", answer: false, explain: "Actif circulant ↑ = cash immobilisé = EMPLOI de cash." },
        { text: "Allonger le délai de paiement fournisseurs libère du cash.", answer: true, explain: "DPO ↑ = on garde le cash plus longtemps. (Dans la limite de la relation fournisseur…)" },
        { text: "Un BFR négatif signifie que les clients financent l'exploitation.", answer: true, explain: "Encaisser avant de payer ses coûts : la croissance devient génératrice de cash (SaaS, grande distribution)." },
      ]},
      { kind: "gap", title: "Le cash conversion cycle", prompt: "Complète :", template: "CCC = DSO + ◻ − ◻", blanks: [
        { options: ["DIO (jours de stock)", "DPO (jours fournisseurs)", "D&A"], correct: 0 },
        { options: ["DPO (jours fournisseurs)", "DSO", "Capex"], correct: 0 },
      ], explain: "CCC = DSO + DIO − DPO. Plus il est court (voire négatif), moins la croissance consomme de cash." },
    ],
    miniCase: {
      context: "PME textile : CA 120, marge nette 5% (NI = 6). DSO 90 jours, DIO 100 jours, DPO 40 jours. Elle vient de signer un contrat qui DOUBLE son CA l'an prochain.",
      task: "Explique en 5-6 phrases pourquoi cette « excellente nouvelle » peut la mettre en faillite, avec un ordre de grandeur chiffré du besoin de cash. Que lui conseilles-tu ?",
      hints: ["CCC = 150 jours ≈ 41% du CA immobilisé en permanence.", "Doubler le CA double (environ) le BFR."],
      modelAnswer: "Son CCC est de 90 + 100 − 40 = 150 jours : environ 41% du CA est immobilisé en BFR, soit ~50 sur 120 de CA. Doubler le CA double ce besoin : ~50 de cash SUPPLÉMENTAIRE à trouver, alors qu'elle ne gagne que 6 par an — huit années de profits à avancer d'un coup. Sans financement, elle honorera ses commandes en cessant de payer fournisseurs ou salaires : la faillite par la croissance. Conseils : financer le BFR (ligne de crédit court terme, affacturage des créances), négocier acomptes clients et délais fournisseurs, et lisser la montée en charge du contrat. La croissance se FINANCE — c'est la leçon du chapitre.",
      keywords: ["150", "50|41%|40%", "double", "6|profits", "affacturage|acompte|ligne|financer"],
    },
  },

  {
    id: "c27", level: 2, title: "Comptabilité avancée : DTA/DTL, leases, SBC, impairment", emoji: "🔬", minutes: 28, xp: 60,
    hook: "Les sujets qui séparent les candidats « corrects » des candidats « impressionnants ». Chacun tombe régulièrement en entretien.",
    simple: "Quatre familles à apprivoiser :\n\nImpôts différés (DTA/DTL) : quand la charge d'impôt COMPTABLE et l'impôt PAYÉ divergent temporairement. Payer moins aujourd'hui que ce que le P&L affiche crée une dette d'impôt future (DTL) ; l'inverse (ou des pertes reportables) crée un crédit futur (DTA).\n\nLocations (leases) : depuis IFRS 16, louer un actif long terme ressemble comptablement à l'acheter à crédit — un « droit d'usage » entre à l'actif, une dette de location au passif.\n\nStock-based compensation (SBC) : payer les salariés en actions. Charge au P&L, mais aucun cash ne sort — le coût réel est la DILUTION des actionnaires.\n\nImpairment : quand un actif (souvent le goodwill) vaut durablement moins que sa valeur au bilan, on le déprécie — grosse charge non-cash, et aveu que l'acquisition d'origine a été surpayée.",
    analogy: "Les impôts différés, c'est ta déclaration de revenus : l'année où tu as un gros crédit d'impôt à venir, tu es « plus riche » que ton compte bancaire ne le montre (DTA). La SBC, c'est payer ton coloc en parts de ta coloc : zéro cash sort, mais ta part à toi rétrécit.",
    deep: "DTL type : l'amortissement fiscal accéléré. Le fisc te laisse amortir la machine plus vite que la comptabilité → tu paies moins d'impôt maintenant, plus tard tu paieras plus : la différence s'accumule en DTL. En M&A, le step-up des actifs dans un stock deal crée une DTL massive (l'amortissement comptable supplémentaire ne sera jamais déductible fiscalement) — tu le reverras au niveau 5.\n\nLeases : la charge de loyer unique d'avant est remplacée par de la dépréciation (du droit d'usage) + des intérêts (sur la dette de location) → l'EBITDA MONTE mécaniquement vs l'ancien monde, sans que le business change. Les comparaisons historiques et les covenants ont dû s'ajuster ; en valorisation, la dette de location entre dans le bridge EV→Equity.\n\nSBC : réintégrée au cash flow (non-cash), souvent exclue de l'« adjusted EBITDA » des tech — abus notoire : le coût est réel, il est juste payé en dilution. Traitement propre en valorisation : la traiter en charge économique, ou modéliser la hausse du nombre d'actions.\n\nImpairment : test annuel du goodwill. La charge ne sort aucun cash, mais elle raconte une histoire : les cash flows attendus de l'acquisition ne justifient plus la valeur au bilan (souviens-toi de Kraft Heinz : −15,4 Md$).",
    traps: [
      "DTA/DTL viennent d'écarts TEMPORAIRES : une amende non déductible (écart permanent) ne crée PAS d'impôt différé.",
      "IFRS 16 gonfle l'EBITDA : comparer un multiple pré-2019 à un multiple post-2019 sans retraiter est un piège.",
      "Exclure la SBC de l'EBITDA « parce que non-cash » surestime la rentabilité : la dilution est un coût réel pour l'actionnaire.",
      "L'impairment ne touche pas le cash — mais il en dit long sur la qualité du management qui a surpayé.",
    ],
    mnaUse: "Le step-up/DTL est au cœur du purchase accounting (niveau 5) ; les NOLs (pertes reportables) se valorisent dans les deals ; la dette de leasing entre dans la dette nette du bridge. Questions types : « qu'est-ce qui crée une DTL ? », « walk me through an impairment », « comment traites-tu la SBC en valorisation ? »",
    diagrams: [
      { type: "flow", title: "Naissance d'une DTL", steps: [
        { label: "Amort. fiscal accéléré", note: "déduction plus rapide" }, { label: "Impôt payé < comptable", note: "cash gardé aujourd'hui" }, { label: "DTL au bilan", note: "dette d'impôt future" }, { label: "Reversal", note: "se paie sur les années suivantes" },
      ]},
    ],
    examples: [
      { title: "DTL chiffrée", body: "Machine 100. Comptablement : 10/an sur 10 ans. Fiscalement : 20/an sur 5 ans. Année 1 : charge comptable 10, déduction fiscale 20 → l'impôt payé est calculé sur 10 de profit en moins que l'affiché : à 25%, on « garde » 2,5 de cash et on inscrit une DTL de 2,5. Les années 6-10, la mécanique s'inverse." },
      { title: "SBC en vrai", body: "Une scale-up affiche un « adjusted EBITDA » de 50 en excluant 30 de SBC. Rentabilité réelle pour l'actionnaire : à peine 20, plus une dilution annuelle de ~2-3% du capital. Les bons analystes retraitent — et les bons candidats le disent." },
      { title: "Impairment célèbre", body: "Kraft Heinz, février 2019 : 15,4 Md$ d'impairment sur les marques Kraft et Oscar Mayer. Zéro cash décaissé ce jour-là, mais l'aveu comptable que la stratégie de coupe des coûts avait tué la valeur des marques. Le titre a perdu 27% en une séance." },
    ],
    quizIds: ["ac16", "ac18", "ac8"],
    extraQuiz: [
      { id: "xq-c27a", kind: "mcq", topic: "accounting", tags: ["leases"], difficulty: 3,
        prompt: "Effet principal d'IFRS 16 (leases au bilan) sur les métriques ?",
        choices: ["EBITDA ↓, dette ↓", "EBITDA ↑ (le loyer devient D&A + intérêts) et dette ↑ (dette de location)", "Aucun effet, juste une note d'annexe", "Le net income double"],
        answer: 1, explanation: "Le loyer opérationnel disparaît des opex → EBITDA mécaniquement plus haut ; en face, une dette de location apparaît. Les multiples et covenants ont dû être retraités." },
    ],
    exercises: [
      { kind: "tf", title: "Avancé, vrai ou faux ?", statements: [
        { text: "Une perte reportable (NOL) crée un actif d'impôt différé (DTA).", answer: true, explain: "Elle réduira les impôts futurs : c'est un crédit d'impôt en attente — qui a de la valeur en M&A (plafonnée après changement de contrôle)." },
        { text: "La SBC réduit le cash de l'entreprise.", answer: false, explain: "Aucun cash ne sort : le coût est supporté par les actionnaires via la dilution." },
        { text: "Un impairment de goodwill peut être repris (annulé) plus tard si les affaires repartent.", answer: false, explain: "En IFRS comme en US GAAP, l'impairment de goodwill est définitif. D'où la prudence avant de le constater." },
      ]},
      { kind: "order", title: "La vie d'un goodwill malheureux", prompt: "Remets l'histoire dans l'ordre :", items: ["Acquisition payée avec une prime généreuse", "Goodwill inscrit au bilan", "Les cash flows déçoivent durablement", "Test annuel : valeur recouvrable < valeur comptable", "Impairment : charge non-cash, equity en baisse"], explain: "Le goodwill naît de la prime, vit tant que les cash flows la justifient, meurt en impairment quand la réalité rattrape le prix payé." },
    ],
    miniCase: {
      context: "En due diligence sur une cible SaaS, tu découvres : adjusted EBITDA annoncé 40 (dont +12 de SBC exclue et +5 de « coûts exceptionnels » présents chaque année depuis 3 ans) ; une DTL de 8 liée à un amortissement accéléré ; 30 de NOLs reportables.",
      task: "Rédige 4-5 phrases pour ton associate : quel EBITDA retiens-tu pour la valorisation, et comment traites-tu la DTL et les NOLs ?",
      hints: ["Un « one-off » qui revient chaque année n'en est pas un.", "Les NOLs valent la valeur actuelle des économies d'impôt (plafonnées post-deal)."],
      modelAnswer: "EBITDA normalisé : 40 − 12 (la SBC est un coût réel, payé en dilution) − 5 (des « exceptionnels » récurrents trois ans de suite sont structurels) = ~23. C'est sur cette base que le multiple doit s'appliquer — l'écart de 17 change drastiquement le prix. La DTL de 8 est une dette d'impôt future : à inclure dans les éléments de dette nette ajustée du bridge (ou au minimum à signaler). Les 30 de NOLs ont de la valeur (économies d'impôt futures ≈ 30 × taux, actualisées) mais leur utilisation sera plafonnée après le changement de contrôle : à valoriser prudemment, jamais au nominal.",
      keywords: ["23", "sbc|dilution", "récurrent|structurel", "dtl|dette", "nol|plafonn"],
    },
  },
];
