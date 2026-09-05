import type { Chapter } from "./types";

// ═══════════════ NIVEAU 5 — M&A ═══════════════
export const CHAPTERS_L59: Chapter[] = [
  {
    id: "c51", level: 5, title: "Le process M&A de A à Z", emoji: "🗺️", minutes: 28, xp: 60,
    hook: "Six à douze mois, des dizaines d'acteurs, une chorégraphie millimétrée. Voici le film complet d'un deal — et ton rôle dans chaque scène.",
    simple: "Un process de VENTE (sell-side) se déroule en quatre actes.\n\nActe 1 — Préparation (1-2 mois) : la banque et le vendeur préparent l'histoire : teaser (2 pages anonymes pour appâter), CIM (le livre de 80-150 pages qui raconte tout), business plan, valorisation, liste d'acheteurs.\n\nActe 2 — Marketing (1-2 mois) : contact des acheteurs, signature des NDA, envoi du CIM, réponses aux questions. Les intéressés remettent une offre indicative (IOI) : fourchette de prix, non engageante.\n\nActe 3 — Due diligence (2-3 mois) : les finalistes accèdent à la data room, rencontrent le management (management presentations), font travailler leurs conseils. Puis : offres FERMES et engageantes.\n\nActe 4 — Négociation & closing : négociation du contrat (SPA), signing… puis attente des conditions suspensives (autorisations antitrust notamment) avant le closing, où l'argent et les actions changent enfin de mains.",
    analogy: "La vente d'une belle maison : l'annonce discrète (teaser), le dossier complet aux visiteurs sérieux (CIM après NDA), les offres d'intention, les visites approfondies avec architecte (due diligence), le compromis (signing), et l'acte notarié quelques mois plus tard (closing). Entre les deux : le prêt de l'acheteur et les autorisations — rien n'est fait tant que rien n'est signé chez le notaire.",
    deep: "Les choix stratégiques du vendeur : broad auction (20-50 acheteurs contactés : prix maximisé par la compétition, mais fuites et durée) vs targeted process (5-10 acheteurs triés) vs négociation bilatérale (un seul : discrétion et vitesse, mais peu de tension). Le banquier calibre selon la sensibilité du dossier et le paysage d'acheteurs.\n\nLes documents et leurs rôles précis : la process letter cadre chaque tour (calendrier, format d'offre exigé) ; l'IOI indique prix, financement, intentions ; la data room (virtuelle) organise des milliers de documents avec accès tracés ; le SPA scelle prix, mécanisme d'ajustement, garanties (reps & warranties), conditions suspensives.\n\nEntre signing et closing : approbations antitrust et réglementaires (semaines à 18 mois !), consultations sociales, conditions de financement. La cible opère « in the ordinary course » ; la MAC clause protège l'acheteur d'une dégradation majeure — mais les tribunaux l'interprètent si strictement qu'elle ne sert presque jamais (souviens-toi de Tiffany et Twitter).\n\nCôté BUY-side, la banque fait le miroir : screening de cibles, valorisation, structuration de l'offre, coordination de la due diligence, négociation — avec un objectif inverse : payer le juste prix, pas le prix maximal.",
    traps: [
      "IOI ≠ engagement : une offre indicative peut s'évaporer. Seule l'offre ferme (post-DD) engage vraiment.",
      "Signing ≠ closing : entre les deux, des mois peuvent passer — et le monde peut changer (COVID, taux…).",
      "Un auction n'est pas toujours optimal : pour un actif sensible, les fuites coûtent plus que la tension ne rapporte.",
      "La data room n'est pas un débarras : chaque document manquant ou contradictoire devient une question de DD — et un levier de renégociation pour l'acheteur.",
    ],
    mnaUse: "C'est ton quotidien de stagiaire : trackers de process, préparation de CIM, Q&A de data room, notes de synthèse des offres. En entretien : « walk me through a sell-side process », « auction vs bilatéral ? », « que se passe-t-il entre signing et closing ? »",
    diagrams: [
      { type: "flow", title: "Les 4 actes d'un sell-side", steps: [
        { label: "Préparation", note: "teaser, CIM, valo" }, { label: "Marketing", note: "NDA → CIM → IOI" }, { label: "Due diligence", note: "data room, MP, offres fermes" }, { label: "SPA → Closing", note: "signing, CPs, closing" },
      ]},
      { type: "flow", title: "La cascade documentaire", steps: [
        { label: "Teaser", note: "anonyme, 2 p." }, { label: "NDA", note: "confidentialité" }, { label: "CIM", note: "le livre" }, { label: "Process letter", note: "règles du jeu" }, { label: "IOI / Offres", note: "indicatif → ferme" }, { label: "SPA", note: "le contrat" },
      ]},
    ],
    examples: [
      { title: "Chronologie réaliste", body: "Mandat signé en janvier → teaser en mars → IOI mi-mai (12 reçues sur 30 contactés) → 5 finalistes en data room → offres fermes mi-juillet → exclusivité à un stratégique → SPA signé fin septembre → closing en janvier après feu vert antitrust. Un an, pour un deal « fluide »." },
      { title: "Exemple réel", body: "Microsoft/Activision : 21 mois entre signing et closing, uniquement pour les autorisations réglementaires. Pendant ce temps, les actionnaires d'Activision portaient un quasi-bond à 95 $, et Activision opérait sous covenants « ordinary course »." },
      { title: "Erreur fréquente", body: "Croire que le prix de l'IOI est LE prix. Les acheteurs « achètent » leur place au second tour avec des IOI généreuses, puis ajustent à la baisse en due diligence (« on a trouvé des choses »). Anticiper cette érosion fait partie du métier de vendeur." },
    ],
    quizIds: ["mp1", "mp2", "mp3", "mp4", "fd3"],
    exercises: [
      { kind: "order", title: "Le process complet", prompt: "Remets les 8 jalons dans l'ordre :", items: ["Teaser envoyé", "NDA signées", "CIM distribué", "Offres indicatives (IOI)", "Data room & management presentations", "Offres fermes", "Signing du SPA", "Closing"], explain: "Teaser → NDA → CIM → IOI → DD → offres fermes → signing → closing. Cette frise est un standard absolu d'entretien." },
      { kind: "tf", title: "Le process, vrai ou faux ?", statements: [
        { text: "Le CIM est envoyé avant la signature de la NDA.", answer: false, explain: "Jamais : le CIM contient l'information confidentielle — la NDA d'abord." },
        { text: "Une MAC clause permet facilement à l'acheteur de sortir si le marché baisse.", answer: false, explain: "Les MAC excluent généralement les conditions de marché générales, et les tribunaux les interprètent très strictement (Tiffany, Twitter)." },
        { text: "Un broad auction maximise généralement le prix mais augmente les risques de fuite.", answer: true, explain: "C'est LE trade-off central du choix de process." },
      ]},
    ],
    miniCase: {
      context: "Le fondateur d'une medtech (cible convoitée, 3 acheteurs naturels dont son concurrent direct) te demande : « pourquoi pas un grand auction à 30 acheteurs pour faire monter les prix ? »",
      task: "Réponds en 5-6 phrases : les risques spécifiques à SON cas, et le process que tu recommandes.",
      hints: ["Que voit le concurrent direct s'il entre au process… même sans acheter ?", "3 acheteurs naturels = la tension existe déjà."],
      modelAnswer: "Un broad auction maximise la tension quand les acheteurs sont NOMBREUX et indifférenciés — ce n'est pas votre cas : trois acheteurs naturels concentrent l'essentiel de la valeur stratégique. Les risques d'un process large ici : votre concurrent direct peut entrer en data room pour LIRE votre entreprise (clients, prix, pipeline) sans intention réelle d'acheter ; les fuites déstabilisent équipes et clients pendant des mois ; et un process qui échoue « marque » l'actif. Recommandation : targeted process à 5-6 contacts (les 3 naturels + 2 sponsors crédibles pour la tension), data room à étages (l'information la plus sensible réservée au finaliste), et un calendrier serré qui force les décisions. La tension ne vient pas du NOMBRE, mais de la crédibilité des alternatives.",
      keywords: ["concurrent|lire|espionn", "fuite|déstabilis", "targeted|5|6|étages", "sponsor|tension", "crédib|alternative"],
    },
  },

  {
    id: "c52", level: 5, title: "Due diligence, SPA et mécanismes de prix", emoji: "🔍", minutes: 26, xp: 55,
    hook: "Entre « on est d'accord sur 500 M€ » et l'argent sur le compte, il y a la due diligence et 150 pages de SPA. C'est là que les deals se gagnent — ou se perdent.",
    simple: "La due diligence, c'est l'inspection complète avant achat : financière (les chiffres sont-ils vrais ? l'EBITDA est-il « propre » ?), juridique (contrats, litiges), fiscale, commerciale (le marché et la position concurrentielle tiennent-ils ?), opérationnelle, RH, IT. L'acheteur mobilise avocats, auditeurs (le fameux rapport de Quality of Earnings) et consultants.\n\nLe SPA (Sale & Purchase Agreement) transforme ensuite l'accord en contrat : le prix et son mécanisme d'ajustement, les garanties du vendeur (reps & warranties : « je certifie que les comptes sont sincères, qu'il n'y a pas de litige caché… »), les conditions suspensives, et les indemnités si une garantie s'avère fausse.\n\nLe point le plus technique — et le plus négocié : comment fixer le prix EXACT au closing, alors que le cash, la dette et le BFR bougent chaque jour ? Deux mécanismes : completion accounts (on recompte tout au closing et on ajuste) ou locked box (prix figé sur un bilan passé, interdiction de « fuites » de valeur entre-temps).",
    analogy: "L'achat d'une maison ancienne : l'offre est acceptée « sous réserve d'inspection ». L'expert passe : toiture fatiguée (−15 k€ négociés), terrasse non déclarée (garantie exigée du vendeur). Le compromis fixe le prix, les conditions suspensives (ton prêt !) et ce que le vendeur garantit. La DD et le SPA, c'est ça — avec plus d'avocats.",
    deep: "Le Quality of Earnings (QoE) : l'audit d'acquisition qui normalise l'EBITDA — retraite les one-offs, les éléments non récurrents « récurrents », les conventions comptables flatteuses — et établit le BFR NORMATIF (la référence des ajustements de prix). Un EBITDA « vendeur » de 100 qui ressort à 88 au QoE, à 10x de multiple, c'est 120 de prix en moins : la DD financière est une négociation par les chiffres.\n\nLocked box vs completion accounts, le duel : locked box (dominant en Europe, favorable au VENDEUR) = prix fixé sur un bilan de référence audité ; le risque et la performance passent à l'acheteur dès cette date ; protection par clauses anti-leakage (pas de dividendes ni de sorties de valeur non autorisées) + un intérêt sur le prix jusqu'au closing. Completion accounts (tradition anglo-saxonne, favorable à l'ACHETEUR) = true-up du prix sur le cash, la dette et le BFR réels au closing — précis, mais source de disputes post-closing.\n\nLa formule cash-free/debt-free à maîtriser : Prix des actions = EV convenue − dette nette au closing ± (BFR réel − BFR normatif). C'est pour ça que le BFR normatif se négocie âprement : chaque euro de « normatif » en plus est un euro de prix en plus.\n\nEt les protections croisées : caps et franchises sur les garanties, assurance W&I (un assureur porte le risque des garanties — devenu standard), earn-outs pour combler un désaccord de valorisation, MAC clauses pour l'inter-signing.",
    traps: [
      "L'EBITDA du CIM n'est PAS l'EBITDA du QoE : anticiper l'érosion fait partie du métier (des deux côtés).",
      "Locked box ne veut pas dire « sans protection » : les clauses anti-leakage sont féroces.",
      "Le BFR normatif mal négocié peut coûter des millions au closing — c'est un sujet de PRIX déguisé en sujet comptable.",
      "Les reps & warranties ne remplacent pas la DD : une indemnité se plaide pendant des années ; une découverte AVANT signing se négocie tout de suite.",
    ],
    mnaUse: "En stage, tu vivras la DD côté process : Q&A de data room, suivi des findings, tableaux de synthèse. En entretien : « locked box vs completion accounts ? », « qu'est-ce qu'un QoE ? », « comment le prix passe-t-il de l'EV au prix des actions ? » — questions de plus en plus fréquentes car très « pratiques ».",
    diagrams: [
      { type: "flow", title: "De l'EV au prix payé (cash-free/debt-free)", steps: [
        { label: "EV convenue", note: "ex. 500" }, { label: "− Dette nette closing", note: "ex. 120" }, { label: "± Ajustement BFR", note: "réel vs normatif" }, { label: "Prix des actions", note: "ce qui est viré" },
      ]},
      { type: "flow", title: "Les workstreams de la due diligence", steps: [
        { label: "Financière", note: "QoE, BFR normatif" }, { label: "Juridique & fiscale", note: "contrats, litiges" }, { label: "Commerciale", note: "marché, clients" }, { label: "Ops / RH / IT", note: "intégration" },
      ]},
    ],
    examples: [
      { title: "Le QoE qui change le deal", body: "EBITDA CIM : 100. Findings du QoE : +5 de « management fees » du fondateur (s'arrêteront), −8 de bonus exceptionnellement bas cette année, −6 de crédits COVID non récurrents, −3 de capitalisation agressive de développement. EBITDA normalisé : 88. À 10x, l'acheteur revient avec une offre réduite de 120 — « justifiée ligne par ligne ». La DD est une arme." },
      { title: "Locked box en pratique", body: "Bilan de référence au 31/12, signing en mai, closing en septembre. Le prix est FIGÉ sur décembre + un intérêt de 6%/an sur 9 mois (la « rémunération » du vendeur qui porte encore l'entreprise). Si le vendeur se verse un dividende surprise en mars : leakage, remboursé euro pour euro." },
      { title: "Erreur fréquente", body: "Confondre les négociations d'EV et de prix des actions. « On est d'accord sur 500 » ne veut RIEN dire tant qu'on n'a pas fixé la définition de la dette (les leases ? les pensions ? l'earn-out du deal précédent ?) et le BFR normatif. Les deals se perdent dans ces définitions." },
    ],
    quizIds: ["mp5", "mp6", "cp3"],
    extraQuiz: [
      { id: "xq-c52a", kind: "mcq", topic: "mna-process", tags: ["qoe"], difficulty: 3,
        prompt: "Le QoE révèle que l'EBITDA « vendeur » de 60 contient 6 de produits non récurrents. À 9x, l'impact mécanique sur l'EV est de…",
        choices: ["−6", "−54", "−9", "Aucun, le multiple absorbe"],
        answer: 1, explanation: "6 × 9 = 54 de valorisation en moins. Chaque euro d'EBITDA « perdu » en DD coûte un multiple entier — c'est pourquoi la qualité de l'EBITDA se défend ligne à ligne." },
    ],
    exercises: [
      { kind: "tf", title: "DD & SPA", statements: [
        { text: "Le locked box est généralement favorable au vendeur.", answer: true, explain: "Prix figé, pas de renégociation au closing, certitude — le vendeur adore. L'acheteur se protège par l'anti-leakage." },
        { text: "L'assurance W&I couvre l'acheteur si une garantie du vendeur s'avère fausse.", answer: true, explain: "L'assureur se substitue au vendeur pour l'indemnisation — devenu standard dans les process compétitifs (le vendeur sort « propre »)." },
        { text: "Le BFR normatif est un détail comptable sans impact sur le prix.", answer: false, explain: "C'est un sujet de PRIX pur : chaque euro d'écart entre BFR réel et normatif ajuste le montant payé." },
      ]},
      { kind: "gap", title: "La formule du closing", prompt: "Complète le mécanisme cash-free/debt-free :", template: "Prix des actions = ◻ − Dette nette ± (BFR réel − ◻)", blanks: [
        { options: ["EV convenue", "EBITDA", "Market cap"], correct: 0 },
        { options: ["BFR normatif", "Capex", "Goodwill"], correct: 0 },
      ], explain: "EV − dette nette ± ajustement de BFR : le pont entre la valorisation négociée et le virement effectif." },
    ],
    miniCase: {
      context: "Tu es côté VENDEUR. L'acheteur propose : completion accounts, définition de la dette incluant les leases (IFRS 16) et le déficit de pensions, BFR normatif calé sur le point BAS saisonnier de l'année. EV convenue : 400 ; dette bancaire 80 ; leases 30 ; pensions 15 ; BFR moyen 50, point bas 35.",
      task: "Chiffre ce que ces trois choix « techniques » coûtent au vendeur vs une définition favorable, et propose ta contre-position en 3 points.",
      hints: ["Chaque élément ajouté à la « dette » réduit le prix d'autant.", "BFR normatif bas = l'acheteur récupère la différence au closing."],
      modelAnswer: "Coût des définitions acheteur : dette élargie = 80 + 30 + 15 = 125 au lieu de 80 (−45 de prix) ; BFR normatif à 35 contre une moyenne de 50 : au closing en saison normale, ajustement de ~−15 de plus. Total : jusqu'à ~60 de prix en moins (15% de l'EV !) sans avoir « baissé le prix » officiellement. Contre-position : (1) leases : à exclure ou à compenser dans l'EV (les comps utilisés incluaient IFRS 16 — cohérence !) ; (2) pensions : négociables, au pire partagées ; (3) BFR normatif = moyenne 12 mois glissants (50), pas un point bas opportuniste — et proposer un locked box sur le dernier bilan audité pour tuer le débat. Moralité : le prix se joue autant dans les définitions que dans le chiffre d'EV.",
      keywords: ["125|45", "15|point bas|moyenne", "60|15%", "cohérence|comps|ifrs", "locked box"],
    },
  },

  {
    id: "c53", level: 5, title: "Purchase accounting : PPA, goodwill et deferred taxes", emoji: "🧾", minutes: 26, xp: 55,
    hook: "Que devient le bilan quand une entreprise en avale une autre ? La purchase price allocation — mécanique exigée en entretien, ligne par ligne.",
    simple: "Quand l'acquéreur consolide sa cible, il ne recopie pas son bilan : il le RÉÉVALUE. C'est la purchase price allocation (PPA), en trois temps :\n\n1. Réévaluer les actifs existants à leur juste valeur (fair value) : les terrains achetés il y a 30 ans, les stocks, les machines — c'est le « step-up ».\n\n2. Identifier des incorporels que la cible n'avait pas le droit de comptabiliser elle-même : sa marque, ses relations clients, sa technologie. Ils entrent au bilan et s'amortiront sur leur durée de vie.\n\n3. Le reste — ce qu'on a payé au-delà de tout ce qui est identifiable — devient le goodwill : la prime pour le capital humain, les synergies espérées, la position concurrentielle. Le goodwill ne s'amortit pas : il est testé chaque année (impairment si les promesses déçoivent).",
    analogy: "Tu rachètes le restaurant du coin 500 k€. L'inventaire du notaire : cuisine et murs réévalués 250 k€, le « fonds de commerce » identifiable (le nom connu, le fichier clients) 150 k€. Les 100 k€ restants ? C'est le goodwill : le coup de main du chef, l'emplacement, la clientèle fidèle — tout ce qui ne se met pas en ligne d'inventaire mais que tu as bel et bien payé.",
    deep: "La formule : Goodwill = prix payé (equity) − fair value des actifs nets identifiables. Déroulé type : prix 800 ; book value de la cible 300 ; step-up d'actifs +100 ; intangibles identifiés +150 ; MAIS le step-up crée une deferred tax liability (voir ci-dessous) de −60 → actifs nets identifiables = 490 → goodwill = 310.\n\nPourquoi cette DTL ? Dans un SHARE deal (on achète les actions), la base FISCALE des actifs ne change pas : le surcroît d'amortissement comptable créé par le step-up ne sera JAMAIS déductible fiscalement. On provisionne donc l'impôt futur correspondant : DTL = step-up × taux d'impôt. Dans un ASSET deal, le step-up est aussi fiscal (l'acheteur amortit fiscalement — un vrai avantage économique), pas de DTL : c'est une des grandes raisons du choix de structure.\n\nConséquences P&L post-deal : l'amortissement des intangibles identifiés pèse sur l'EBIT et le net income consolidés pendant des années (d'où des « EPS ajustés hors amortissement PPA » dans les publications). Conséquence bilan : le goodwill s'accumule deal après deal — et se rappelle au mauvais souvenir des acquéreurs trop généreux (Kraft Heinz : −15,4 Md$).\n\nEn modèle de merger, la mécanique de consolidation : additionner les bilans, éliminer l'equity de la cible, injecter step-up + intangibles + DTL + goodwill, et ajouter le financement du deal. Le bilan pro forma doit balancer — évidemment.",
    traps: [
      "Le goodwill ne s'amortit pas (IFRS/US GAAP) — mais les intangibles identifiés, OUI. Confusion très fréquente.",
      "Oublier la DTL du step-up dans le calcul du goodwill : l'erreur technique classique de l'exercice d'entretien.",
      "Asset deal vs share deal : le step-up FISCAL (asset deal) a une vraie valeur — il se négocie dans le prix.",
      "Le goodwill n'est pas « du vent » : c'est le prix de l'inidentifiable. Il ne devient un problème que si on a surpayé.",
    ],
    mnaUse: "Exercice d'entretien récurrent : « prix 800, book value 300, step-up 100, taux 25% : calcule le goodwill ». Et la mécanique PPA nourrit l'accretion/dilution du chapitre suivant (l'amortissement des intangibles pèse sur l'EPS pro forma).",
    diagrams: [
      { type: "bridge", title: "Allocation du prix : où va l'argent (M€)", unit: "", items: [
        { label: "Book value", value: 300, kind: "base" }, { label: "+ Step-up actifs", value: 100, kind: "add" }, { label: "+ Intangibles", value: 150, kind: "add" }, { label: "− DTL créée", value: 60, kind: "sub" }, { label: "= Actifs nets FV", value: 490, kind: "total" }, { label: "+ Goodwill", value: 310, kind: "add" }, { label: "Prix payé", value: 800, kind: "total" },
      ]},
    ],
    examples: [
      { title: "Le calcul canonique", body: "Prix equity 800. Book value 300. Step-up PP&E +100 (DTL : 100×25% = 25). Intangibles identifiés +150 (DTL : 37,5). Actifs nets réévalués = 300+100+150−62,5 = 487,5. Goodwill = 800 − 487,5 = 312,5. À dérouler en entretien SANS oublier les DTL." },
      { title: "Exemple réel", body: "Dans les rapports annuels des grands acquéreurs, cherche la note « business combinations » : tu y verras de vraies PPA — la répartition entre customer relationships, marques, technologie et goodwill, avec les durées d'amortissement. Lire une vraie PPA vaut trois cours." },
      { title: "Erreur fréquente", body: "« Le goodwill, c'est la prime de contrôle. » Pas exactement : la prime est un concept de PRIX (vs cours de bourse) ; le goodwill est un résidu COMPTABLE (vs fair value des actifs nets). Ils se recouvrent souvent, mais aucun des deux ne définit l'autre." },
    ],
    quizIds: ["ad4", "ac8", "ac16", "ac18"],
    exercises: [
      { kind: "gap", title: "Le goodwill, pas à pas", prompt: "Complète :", template: "Goodwill = Prix payé − ◻ des actifs nets identifiables\nDTL du step-up = Step-up × ◻", blanks: [
        { options: ["Fair value", "Book value", "Market value"], correct: 0 },
        { options: ["Taux d'impôt", "WACC", "Multiple"], correct: 0 },
      ], explain: "Fair value (après réévaluations ET la DTL qu'elles créent) — puis le résidu en goodwill." },
      { kind: "tf", title: "PPA, vrai ou faux ?", statements: [
        { text: "Dans un share deal, le step-up comptable crée un avantage fiscal immédiat.", answer: false, explain: "Non : la base fiscale ne change pas — d'où la DTL. C'est l'ASSET deal qui donne le step-up fiscal." },
        { text: "L'amortissement des intangibles PPA réduit l'EPS consolidé post-deal.", answer: true, explain: "Pendant toute la durée d'amortissement — d'où les « EPS ajustés » publiés par les serial acquirers." },
        { text: "Un impairment de goodwill est souvent l'aveu d'une acquisition surpayée.", answer: true, explain: "Les cash flows ne justifient plus la valeur au bilan : la promesse initiale a déçu." },
      ]},
    ],
    miniCase: {
      context: "Exercice d'entretien complet : Alpha achète Beta pour 600 (equity value). Book value de Beta : 200. La DD identifie : step-up des machines +80, marque valorisée +120, relations clients +60. Taux d'impôt 25%. Share deal.",
      task: "Calcule le goodwill étape par étape, puis explique en 2 phrases l'impact sur le P&L consolidé des prochaines années.",
      hints: ["DTL sur TOUTES les réévaluations : (80+120+60) × 25%.", "Marque : amortissable ? Souvent oui (durée définie) — prends 15 ans ; relations clients 10 ans."],
      modelAnswer: "Réévaluations totales = 80+120+60 = 260 → DTL = 65. Actifs nets identifiables à la fair value = 200 + 260 − 65 = 395. Goodwill = 600 − 395 = 205. Impact P&L : l'amortissement des intangibles (ex. 120/15 + 60/10 + 80 sur la durée des machines ≈ 20-25/an les premières années) pèsera sur l'EBIT et l'EPS consolidés — c'est l'amortissement PPA que les analystes retraitent ; le goodwill de 205, lui, ne s'amortit pas mais sera testé chaque année en impairment.",
      keywords: ["65", "395", "205", "amortis|20|intangible", "impairment|test"],
    },
  },

  {
    id: "c54", level: 5, title: "Accretion/dilution et le merger model", emoji: "➗", minutes: 28, xp: 60,
    hook: "« Ce deal est-il accretif ? » — la question que tout board pose. La mécanique, les règles rapides, et la nuance qui te fera briller.",
    simple: "Un deal est ACCRETIF si l'EPS (bénéfice par action) de l'acquéreur pro forma — après absorption de la cible — est plus élevé qu'avant. DILUTIF s'il baisse.\n\nLa logique : l'acquéreur gagne le net income de la cible, mais paie un coût de financement. Tout dépend du rapport entre ce que la cible RAPPORTE et ce que le financement COÛTE :\n\n• En cash : le deal est accretif si le rendement des earnings achetés (NI cible ÷ prix payé) dépasse le rendement que le cash aurait produit (quasi rien aujourd'hui).\n• En dette : accretif si ce même « earnings yield » dépasse le coût de la dette APRÈS impôt.\n• En actions : accretif si le P/E de l'acquéreur est SUPÉRIEUR au P/E payé pour la cible — on échange des actions « chères » contre des earnings « moins chers ».\n\nHiérarchie du coût des financements : cash < dette < actions.",
    analogy: "Tu gagnes 10 €/h à ton job (ton « P/E » personnel). On te propose de sous-traiter une mission à quelqu'un qui produit 15 €/h de valeur pour 12 €/h de salaire : chaque heure sous-traitée AUGMENTE ton gain moyen — accretif. Si tu le paies 16 €/h : dilutif. L'accretion, c'est juste « est-ce que ce que j'achète rapporte plus que ce que ça me coûte ».",
    deep: "La mécanique complète du NI pro forma : NI acquéreur + NI cible + synergies après impôt − intérêts de la dette nouvelle × (1−t) − intérêts perdus sur le cash utilisé × (1−t) − amortissement des intangibles PPA × (1−t). Dénominateur : actions de l'acquéreur + nouvelles actions émises (si paiement en titres). EPS pro forma vs EPS standalone → % d'accretion.\n\nLe merger model complet ajoute : le sources & uses (d'où vient l'argent, où il va — prix, refinancement de la dette cible, fees), le bilan pro forma (consolidation + PPA du chapitre précédent), et les sensibilités (prix payé × structure de financement × synergies).\n\nET LA NUANCE CAPITALE : l'accretion n'est PAS la création de valeur. Elle mesure un effet mécanique du financement : avec de la dette à 4%, presque tout achat est « accretif » — même en surpayant massivement. Le vrai test de création de valeur : les synergies actualisées dépassent-elles la prime payée ? Le ROIC du deal dépasse-t-il le WACC ? Un candidat qui dit « accretif ≠ bon deal » avec un exemple marque des points partout.\n\nRègle d'usage : les boards et les marchés REGARDENT quand même l'accretion (communication financière oblige) — c'est un écran de passage, pas un critère de qualité.",
    traps: [
      "Oublier le foregone interest (les intérêts perdus sur le cash utilisé) : l'oubli n°1 dans les calculs d'entretien.",
      "Oublier l'amortissement des intangibles PPA : il rend dilutifs des deals qui « semblaient » accretifs.",
      "Comparer les P/E dans un deal en CASH : la règle P/E ne vaut QUE pour les deals en actions.",
      "Conclure « accretif donc bon deal » : la faute conceptuelle que les interviewers guettent.",
    ],
    mnaUse: "Chaque pitch de deal contient sa page accretion/dilution. En entretien, LE grand classique : « acquéreur P/E 20x, cible payée 15x, all-stock : accretif ou dilutif ? » (accretif) — puis les relances : « et en cash à 5% ? », « et avec les synergies ? », « est-ce un bon deal pour autant ? »",
    diagrams: [
      { type: "bridge", title: "Construction du NI pro forma (M€)", unit: "", items: [
        { label: "NI acquéreur", value: 400, kind: "base" }, { label: "+ NI cible", value: 60, kind: "add" }, { label: "+ Synergies (net)", value: 15, kind: "add" }, { label: "− Intérêts (net)", value: 45, kind: "sub" }, { label: "− Amort. PPA (net)", value: 12, kind: "sub" }, { label: "NI pro forma", value: 418, kind: "total" },
      ]},
      { type: "flow", title: "Les règles rapides", steps: [
        { label: "All-stock", note: "P/E acq > P/E payé → accretif" }, { label: "Cash/dette", note: "yield cible > coût net → accretif" }, { label: "Hiérarchie", note: "cash < dette < actions" }, { label: "⚠️ Nuance", note: "accretif ≠ créateur de valeur" },
      ]},
    ],
    examples: [
      { title: "Calcul complet", body: "Acquéreur : NI 400, 200 M d'actions (EPS 2,00). Cible : NI 60, payée 1 200 en dette à 5% (impôt 25%). Intérêts nets = 1 200×5%×0,75 = 45. NI PF = 400+60−45 = 415 → EPS 2,075 → +3,75% accretif. Vérification par la règle : yield 60/1 200 = 5% > coût net 3,75% ✓." },
      { title: "La nuance en action", body: "Même deal, mais la cible ne vaut « vraiment » que 900 (DCF standalone + synergies). L'acquéreur a payé 1 200 : il a DÉTRUIT ~300 de valeur pour ses actionnaires… tout en affichant +3,75% d'accretion. Le marché ne s'y trompe pas toujours : beaucoup de titres d'acquéreurs baissent à l'annonce de deals « accretifs »." },
      { title: "Erreur fréquente", body: "« P/E acquéreur 20x > P/E cible 15x, donc accretif » — dans un deal en CASH. Faux réflexe : la règle des P/E ne vaut qu'en all-stock. En cash, on compare earnings yield (1/15 ≈ 6,7%) au coût du financement après impôt." },
    ],
    quizIds: ["ad1", "ad2", "ad3", "ad5", "ad6", "ad8", "sy3"],
    exercises: [
      { kind: "gap", title: "Les règles rapides", prompt: "Complète :", template: "All-stock accretif si P/E acquéreur ◻ P/E payé\nCash/dette accretif si earnings yield cible ◻ coût du financement après impôt", blanks: [
        { options: [">", "<", "="], correct: 0 },
        { options: [">", "<", "="], correct: 0 },
      ], explain: "Acheter des earnings moins chers que les siens (stock) ou qui rapportent plus que le financement ne coûte (cash/dette)." },
      { kind: "tf", title: "La nuance qui compte", statements: [
        { text: "Un deal financé par de la dette bon marché est presque toujours accretif.", answer: true, explain: "Mécaniquement oui — et c'est exactement pourquoi l'accretion ne prouve RIEN sur la valeur." },
        { text: "Un deal dilutif est nécessairement un mauvais deal.", answer: false, explain: "Acheter de la croissance forte (P/E élevé) dilue souvent à court terme et crée de la valeur à long terme. L'inverse du piège précédent." },
        { text: "Le vrai test de création de valeur : synergies actualisées vs prime payée.", answer: true, explain: "La prime est certaine et payée d'avance ; les synergies sont incertaines. Leur comparaison actualisée est LE test." },
      ]},
    ],
    miniCase: {
      context: "Question d'entretien enchaînée : « Acquéreur : NI 300, 150 M d'actions, cours 40 € (P/E 20x). Cible : NI 50, prix négocié 1 250. (a) Deal 100% actions émises à 40 € : accretif ? (b) Deal 100% dette à 6% (impôt 25%) : accretif ? (c) Lequel préfères-tu ? »",
      task: "Réponds aux trois questions avec les calculs — et la nuance finale.",
      hints: ["(a) Nouvelles actions = 1 250/40 = 31,25 M.", "(b) Yield = 50/1 250 = 4% vs coût net 4,5%."],
      modelAnswer: "(a) All-stock : P/E payé = 1 250/50 = 25x > P/E acquéreur 20x → dilutif. Vérification : NI PF = 350 ; actions = 181,25 M ; EPS = 1,93 vs 2,00 → −3,5% ✓. (b) Dette : yield cible 4% < coût net 6%×0,75 = 4,5% → dilutif aussi ! NI PF = 300+50−56,25 = 293,75 → EPS 1,96, −2,1%. (c) Le « moins dilutif » est la dette, mais LA vraie réponse : les deux structures révèlent surtout que le PRIX est élevé (25x les earnings pour une cible qui ne rapporte que 4%) — la question n'est pas « quelle structure » mais « les synergies justifient-elles ce prix ? ». Sans ~19 de synergies nettes (pour combler l'écart), ce deal détruit de la valeur quelle que soit la structure. Répondre ça, c'est passer du niveau « calcul » au niveau « banquier ».",
      keywords: ["25x|dilutif", "1,93|1.93|3,5|3.5", "4%.*4,5|4.5", "1,96|1.96|2,1|2.1", "prix|synergies|détruit"],
    },
  },

  // ═══════════════ NIVEAU 6 — LBO ═══════════════
  {
    id: "c61", level: 6, title: "La mécanique du LBO", emoji: "🔩", minutes: 26, xp: 55,
    hook: "Acheter une entreprise avec l'argent des autres, la faire rembourser sa propre acquisition, et repartir avec la plus-value. Bienvenue dans le LBO.",
    simple: "Un Leveraged Buyout : un fonds de private equity achète une entreprise en finançant l'essentiel du prix par de la DETTE (50-70%), portée par l'entreprise elle-même. Les cash flows de la cible remboursent progressivement cette dette, et à la revente (4-6 ans plus tard), la plus-value revient au fonds.\n\nPourquoi ça marche : le levier AMPLIFIE le rendement de l'equity (chapitre Structure du capital, souviens-toi). Si tu achètes 100 avec 40 d'equity et 60 de dette, et que tu revends 120 après avoir remboursé 30 de dette : l'equity vaut 120−30 = 90, soit 2,25x ta mise — alors que l'actif n'a pris que 20%.\n\nLes ingrédients d'une bonne cible : des cash flows STABLES et PRÉVISIBLES (il faut servir la dette tous les trimestres), peu de capex, une position de marché solide, un management de qualité — et un prix d'entrée raisonnable.",
    analogy: "L'immeuble locatif, encore lui : 30% d'apport, 70% de crédit, les loyers remboursent la banque. Dans 6 ans : l'immeuble vaut pareil, mais le crédit a fondu — la différence t'appartient. Tu n'as pas eu besoin que l'immeuble prenne de la valeur : le REMBOURSEMENT a construit ton equity. Le LBO industrialise cette idée.",
    deep: "Le Sources & Uses, tableau d'ouverture de tout LBO : les USES (prix d'achat de l'equity + refinancement de la dette existante + fees de transaction) ; les SOURCES (les tranches de dette + l'equity du sponsor + le réinvestissement du management). L'equity du sponsor est la variable d'ajustement : Uses − dette levée = equity check.\n\nLa structure de dette type : une RCF (ligne revolving, non tirée, pour la liquidité), un Term Loan B (le socle institutionnel : taux variable, remboursement minimal obligatoire ~1%/an, prepayable — c'est lui qu'on rembourse par anticipation), parfois des obligations high yield (taux fixe, non-call) et de la mezzanine sur les structures agressives. Le levier total se mesure en multiples d'EBITDA : 4-6x selon les cycles et la qualité des cash flows.\n\nLe debt schedule, cœur battant du modèle : chaque année, le FCF disponible (EBITDA − intérêts − impôts − capex − ΔBFR) rembourse la dette — l'amortissement obligatoire d'abord, puis le cash sweep (l'excédent prépaye le TLB). Moins de dette → moins d'intérêts l'année suivante → plus de FCF → le désendettement s'auto-accélère.\n\nLe management, enfin : le fonds exige presque toujours qu'il réinvestisse (rollover) et le motive par un management package — l'alignement des intérêts est une religion en PE.",
    traps: [
      "Une cible cyclique + un levier élevé = la recette du désastre (le FCF s'effondre quand les intérêts, eux, restent).",
      "Oublier le capex dans le FCF disponible : le désendettement devient fantaisiste (le piège du paper LBO).",
      "Le levier ne crée pas de valeur en soi : il AMPLIFIE — l'upside comme le désastre (souviens-toi de Twitter).",
      "Les fees (transaction, financement) rognent l'equity dès le jour 1 : les inclure dans le sources & uses.",
    ],
    mnaUse: "Le LBO est omniprésent : les sponsors sont dans tous les process, l'analyse « LBO floor » borne les valorisations, et le paper LBO est l'exercice d'entretien roi (PE, mais aussi M&A). Chapitre suivant : les returns. Chapitre d'après : tu le fais de tête.",
    diagrams: [
      { type: "stack", title: "Sources & Uses d'un LBO (M€)", stacks: [
        { name: "Uses = 1 040", layers: [{ label: "Prix equity 700" }, { label: "Refi dette existante 300" }, { label: "Fees 40" }] },
        { name: "Sources = 1 040", layers: [{ label: "Term Loan B 450" }, { label: "High yield 150" }, { label: "Equity sponsor 410", note: "+ rollover management inclus" }] },
      ]},
      { type: "flow", title: "Le cercle vertueux du désendettement", steps: [
        { label: "FCF généré" }, { label: "Dette remboursée", note: "amort. + cash sweep" }, { label: "Intérêts ↓" }, { label: "FCF ↑", note: "et on recommence" },
      ]},
    ],
    examples: [
      { title: "Un LBO chiffré", body: "Cible : EBITDA 100, achetée 8x = EV 800. Financement : dette 5x (500) + equity 300. An 1 : FCF disponible = 100 − 35 (intérêts à 7%) − 15 (impôts) − 20 (capex) − 5 (BFR) = 25 → la dette passe à 475. Chaque année, les intérêts baissent, le remboursement accélère." },
      { title: "Exemple réel", body: "Les plus grands LBO de l'histoire (RJR Nabisco 1989, TXU 2007, et les méga-deals récents des sponsors sur le software) suivent tous cette grammaire — seuls les multiples et la part d'equity varient avec les cycles du crédit : 10% d'equity en 2007, 40-50% aujourd'hui." },
      { title: "Erreur fréquente", body: "« Le PE gagne de l'argent parce qu'il coupe les coûts. » Parfois — mais le moteur de base est FINANCIER : le remboursement de la dette transforme mécaniquement le FCF en equity. L'opérationnel (chapitre suivant) fait la différence entre les bons et les excellents fonds." },
    ],
    quizIds: ["lb1", "lb5", "lb6", "cm1", "cm6"],
    exercises: [
      { kind: "order", title: "Monter un LBO", prompt: "Remets les étapes du montage dans l'ordre :", items: ["Négocier le prix (EV = EBITDA × multiple)", "Structurer la dette (tranches, levier max)", "Calculer l'equity check (Uses − dette)", "Projeter FCF et debt schedule", "Modéliser la sortie et les returns"], explain: "Prix → dette → equity → projection → sortie. Le sources & uses en ouverture, le debt schedule au centre, les returns en conclusion." },
      { kind: "tf", title: "La cible idéale", statements: [
        { text: "Une biotech pré-revenue est une excellente cible de LBO.", answer: false, explain: "Aucun cash flow pour servir la dette : c'est du capital-risque, pas du LBO." },
        { text: "Le cash sweep prépaye la dette avec l'excédent de FCF.", answer: true, explain: "Après l'amortissement obligatoire, le surplus rembourse le TLB par anticipation — accélérateur du désendettement." },
        { text: "Plus le levier initial est élevé, plus l'IRR espéré ET le risque augmentent.", answer: true, explain: "Le levier est une amplification symétrique. Les prêteurs le plafonnent précisément pour ça." },
      ]},
    ],
    miniCase: {
      context: "Un fonds hésite entre deux cibles à EV identique (800, soit 8x EBITDA 100) : SereniCare (maisons de retraite : FCF stables, capex 15, croissance +3%) et TrendRetail (mode : FCF volatils ±40%, capex 25, croissance +8% en moyenne).",
      task: "Pour chacune : quel levier la dette supporterait-elle, et pourquoi ? Laquelle est la « vraie » cible de LBO ? (5-6 phrases)",
      hints: ["Le prêteur dimensionne sur le FCF du PIRE scénario.", "Volatilité + levier = covenants percés."],
      modelAnswer: "SereniCare : FCF prévisibles (demande démographique, non cyclique), capex modéré → les prêteurs accepteront 5-5,5x d'EBITDA de dette ; le debt schedule est fiable même en scénario stressé. TrendRetail : un FCF qui peut chuter de 40% ne supporte pas plus de 2,5-3x — au-delà, une mauvaise saison perce les covenants et le fonds perd le contrôle au profit des créanciers. SereniCare est la vraie cible LBO : le levier élevé y est SOUTENABLE, donc l'amplification joue à plein. TrendRetail peut être un bon investissement… en growth equity, avec peu de dette — autre stratégie, autre profil. La leçon : le levier possible découle de la STABILITÉ des cash flows, jamais de l'enthousiasme de l'acheteur.",
      keywords: ["5|5,5|stable", "2,5|3x|volatil|covenant", "sereni", "soutenable|amplif", "growth|peu de dette"],
    },
  },

  {
    id: "c62", level: 6, title: "Returns : IRR, MOIC et création de valeur", emoji: "📈", minutes: 24, xp: 55,
    hook: "Comment un fonds juge-t-il un deal ? Deux chiffres — IRR et MOIC — et trois moteurs de création de valeur. Maîtrise-les, et le paper LBO devient un jeu.",
    simple: "Le MOIC (Multiple On Invested Capital) : combien de fois le fonds récupère sa mise. Equity sortie ÷ equity investie. 2x = doublé. Simple, brutal, insensible au temps.\n\nL'IRR : le rendement ANNUALISÉ — le même 2x vaut 26%/an en 3 ans, mais seulement 15%/an en 5 ans. Le temps est l'ennemi de l'IRR.\n\nLes repères à connaître PAR CŒUR (les interviewers les adorent) : 2x en 3 ans ≈ 26% ; 2x en 5 ans ≈ 15% ; 3x en 5 ans ≈ 25%. Les fonds visent typiquement 20-25% d'IRR brut et ≥ 2x.\n\nD'où vient le gain ? Trois moteurs : (1) le debt paydown — la dette remboursée devient de l'equity ; (2) la croissance d'EBITDA — organique, marges, acquisitions complémentaires ; (3) l'expansion de multiple — revendre 9x ce qu'on a acheté 8x (le moins contrôlable : c'est le marché qui décide).",
    analogy: "Ton immeuble : acheté 500 k€ (100 d'apport, 400 de crédit), revendu 600 k€ avec un crédit retombé à 250. Ton equity : 600−250 = 350 → MOIC 3,5x. Décomposition : 100 de plus-value (le « multiple »), 150 de crédit remboursé par les loyers (le « paydown »), et zéro travaux (pas de « croissance d'EBITDA »). Les fonds font exactement cette décomposition — en l'appelant value creation bridge.",
    deep: "Les conversions MOIC ↔ IRR se font de tête avec la règle des puissances : IRR ≈ MOIC^(1/années) − 1. Entraîne-toi : 2,5x en 4 ans ? 2,5^0,25 ≈ 1,257 → ~26%. L'inverse aussi : « il vise 20% sur 5 ans » → 1,2⁵ ≈ 2,5x.\n\nLe value creation bridge, l'outil d'analyse roi : on décompose equity sortie − equity entrée en (a) effet EBITDA (ΔEBITDA × multiple d'entrée), (b) effet multiple (ΔMultiple × EBITDA de sortie), (c) effet désendettement (Δdette nette). Les LPs (investisseurs des fonds) scrutent cette décomposition : un fonds qui ne gagne QUE par le levier et le multiple n'apporte rien qu'on ne puisse répliquer ; la création OPÉRATIONNELLE (l'EBITDA) est la signature des grands fonds.\n\nLes accélérateurs à connaître : le dividend recap (re-lever la cible en cours de route pour se verser un dividende — de-risque et dope l'IRR), les build-ups (acheter des concurrents à des multiples inférieurs — l'arbitrage de multiple), et la discipline du prix d'entrée : « you make your money on the buy ». Une sensibilité entrée/sortie le montre : à ±1x de multiple d'entrée, l'IRR bouge de ±5-8 points.",
    traps: [
      "IRR sans MOIC = piège : 40% d'IRR sur 14 mois et 1,4x ne nourrit pas un fonds. Toujours citer les DEUX.",
      "L'expansion de multiple n'est pas un plan : c'est un pari sur l'humeur du marché dans 5 ans. Les comités d'investissement la neutralisent (multiple de sortie = multiple d'entrée) pour juger un deal.",
      "Un dividend recap améliore l'IRR mais re-leverage l'entreprise : le risque ne disparaît pas, il se déplace.",
      "Comparer les IRR de fonds sans regarder l'usage des lignes de crédit (subscription lines) qui les gonflent artificiellement.",
    ],
    mnaUse: "En entretien PE, ces conversions et le value bridge sont testés de tête. En M&A, l'analyse « LBO floor » (quel prix un sponsor peut-il payer pour ses 20% ?) borne toutes les valorisations. Et le paper LBO du chapitre suivant assemble tout.",
    diagrams: [
      { type: "bridge", title: "Value creation bridge (M€ d'equity)", unit: "", items: [
        { label: "Equity entrée", value: 300, kind: "base" }, { label: "+ Croissance EBITDA", value: 240, kind: "add" }, { label: "+ Debt paydown", value: 180, kind: "add" }, { label: "+ Effet multiple", value: 80, kind: "add" }, { label: "Equity sortie", value: 800, kind: "total" },
      ]},
    ],
    examples: [
      { title: "Conversion express", body: "« On a fait 2,7x en 4 ans » → 2,7^0,25 ≈ 1,28 → ~28% d'IRR : excellent millésime. « 1,6x en 6 ans » → 1,6^(1/6) ≈ 8% : médiocre — un ETF aurait fait pareil sans illiquidité. Le couple (MOIC, durée) dit tout." },
      { title: "Bridge décomposé", body: "Entrée : EBITDA 100 × 8x = 800, dette 500, equity 300. Sortie an 5 : EBITDA 130 × 9x = 1 170, dette 250 → equity 920, MOIC 3,1x. Décomposition : EBITDA (+30×8 = 240), multiple (+1×130 = 130), paydown (+250). Le déal gagne sur les trois tableaux — rare et beau." },
      { title: "Erreur fréquente", body: "Dans un paper LBO, annoncer « IRR ≈ 25% » pour un 2x en 5 ans. Non : 15%. Les repères mal mémorisés se voient immédiatement — apprends les trois par cœur (2x/3 ans : 26% ; 2x/5 ans : 15% ; 3x/5 ans : 25%)." },
    ],
    quizIds: ["lb2", "lb3", "lb4", "lb7", "lb9"],
    exercises: [
      { kind: "gap", title: "Les conversions sacrées", prompt: "Complète les repères :", template: "2x en 5 ans ≈ ◻ d'IRR\n2x en 3 ans ≈ ◻ d'IRR\n3x en 5 ans ≈ ◻ d'IRR", blanks: [
        { options: ["15%", "26%", "20%"], correct: 0 },
        { options: ["26%", "15%", "33%"], correct: 0 },
        { options: ["25%", "15%", "45%"], correct: 0 },
      ], explain: "Les trois repères du paper LBO. Avec eux + la règle MOIC^(1/n), tu convertis tout de tête." },
      { kind: "order", title: "Le value creation bridge", prompt: "Remets la décomposition dans l'ordre canonique :", items: ["Equity à l'entrée", "Effet croissance d'EBITDA", "Effet désendettement (paydown)", "Effet multiple de sortie", "Equity à la sortie"], explain: "C'est l'ordre de présentation standard — et l'ordre de CONTRÔLABILITÉ : l'EBITDA se pilote, le paydown se planifie, le multiple s'espère." },
    ],
    miniCase: {
      context: "Comité d'investissement. Le deal : entrée 8x sur EBITDA 150 (EV 1 200), dette 60% ; plan à 5 ans : EBITDA 195, dette réduite de moitié ; hypothèse de sortie « 9x, comme les derniers comparables ».",
      task: "Calcule le MOIC et l'IRR approximatif (a) à 9x de sortie, (b) à multiple CONSTANT 8x. Que recommandes-tu au comité, et pourquoi la version (b) est-elle la seule honnête ?",
      hints: ["Equity entrée = 480 ; dette sortie = 360.", "(a) EV sortie 1 755 ; (b) 1 560."],
      modelAnswer: "Equity entrée = 40% × 1 200 = 480 ; dette entrée 720 → sortie 360. (a) À 9x : EV = 195×9 = 1 755 ; equity = 1 395 → MOIC 2,9x, IRR ≈ 2,9^0,2 ≈ 24%. (b) À 8x constant : EV = 1 560 ; equity = 1 200 → MOIC 2,5x, IRR ≈ 20%. Recommandation : le deal DOIT être approuvé sur la version (b) — 20% au multiple constant, c'est un bon deal porté par l'opérationnel (EBITDA +30%) et le paydown ; l'expansion de multiple est alors un upside gratuit, pas une béquille. Si le deal ne « passait » qu'à 9x, on achèterait un pari de marché, pas une entreprise. Les meilleurs comités appellent ça la discipline du multiple constant.",
      keywords: ["480", "2,9|2.9|24", "2,5|2.5|20", "constant|honnête|béquille", "opérationnel|paydown"],
    },
  },

  {
    id: "c63", level: 6, title: "Le paper LBO, maîtrisé de tête", emoji: "🧠", minutes: 25, xp: 60,
    hook: "L'exercice fétiche des entretiens PE — et de plus en plus M&A : un LBO complet, de tête, en 5 minutes. Voici la méthode pas à pas.",
    simple: "Le paper LBO se déroule TOUJOURS en 5 étapes :\n\n1. L'ENTRÉE : EV = EBITDA × multiple. Répartis : dette (x fois l'EBITDA) et equity (le reste).\n2. LA PROJECTION : fais croître l'EBITDA (taux simple, arrondis !).\n3. LE CASH : chaque année, FCF ≈ EBITDA − intérêts − impôts − capex − ΔBFR. Cumule-le : il rembourse la dette.\n4. LA SORTIE : EV sortie = EBITDA final × multiple de sortie (souvent le même qu'à l'entrée).\n5. LES RETURNS : equity sortie = EV sortie − dette restante. MOIC = sortie/entrée ; IRR via les repères.\n\nLe secret : ANNONCE tes hypothèses à voix haute, arrondis agressivement (personne n'attend des décimales), et garde une structure impeccable — l'examinateur note la méthode plus que la virgule.",
    analogy: "C'est une recette de cuisine récitée devant le jury : personne ne chronomètre la pesée des ingrédients au gramme — on vérifie que tu connais l'ordre, les proportions et les pièges (ne pas oublier le capex, comme on n'oublie pas la levure).",
    deep: "Déroulé complet d'un cas type — à réciter : « EBITDA 100, achat 8x, dette 5x, croissance 5%/an, sortie an 5 au même multiple. »\n\nEntrée : EV 800 = dette 500 + equity 300.\nEBITDA sortie : 100 × 1,05⁵ ≈ 128 (1,05⁵ ≈ 1,28 — par cœur).\nFCF annuel, version rapide : intérêts ~7% × 500 = 35 en début de période (baisseront), impôts ~15-18 sur l'EBIT, capex ~20, BFR ~5 → FCF ≈ 25-35/an, croissant. Cumul 5 ans ≈ 150 (sois transparent sur l'approximation).\nDette sortie : 500 − 150 = 350.\nEV sortie : 128 × 8 = 1 024 ; equity = 674.\nReturns : MOIC = 674/300 ≈ 2,25x ; en 5 ans → IRR ≈ 17-18% (entre les repères 2x/15% et 3x/25%).\nConclusion : « correct mais sous la cible de 20% — le deal exige soit un meilleur prix d'entrée, soit un plan opérationnel plus ambitieux. » Cette PHRASE DE JUGEMENT finale sépare les candidats.\n\nLes réflexes de niveau supérieur : sensibilité orale (« à 7x d'entrée, l'equity tombe à 200 et le MOIC dépasse 3x — le prix d'entrée est le levier n°1 ») ; ne JAMAIS oublier que les intérêts DIMINUENT avec le désendettement (dis-le, même si tu simplifies) ; et si l'examinateur donne un FCF « disponible pour la dette », c'est un cadeau — utilise-le tel quel.",
    traps: [
      "Oublier capex et impôts dans le FCF : le crime capital du paper LBO.",
      "Paniquer sur les puissances : 1,05⁵ ≈ 1,28 ; 1,06⁵ ≈ 1,34 ; 1,10⁵ ≈ 1,61 — apprends ces trois-là.",
      "Donner un chiffre sans conclusion : termine TOUJOURS par un jugement (« au-dessus/en-dessous de la cible, parce que… »).",
      "Réciter sans annoncer les hypothèses : l'examinateur veut suivre ton raisonnement en temps réel.",
    ],
    mnaUse: "Posé en entretien PE (systématiquement) et de plus en plus en M&A (« fais-moi un LBO rapide sur cette cible »). C'est aussi l'outil du banquier pour estimer le « LBO floor » d'une valorisation en 3 minutes de calcul mental.",
    diagrams: [
      { type: "flow", title: "Les 5 étapes du paper LBO", steps: [
        { label: "1. Entrée", note: "EV, dette, equity" }, { label: "2. Projection", note: "EBITDA × (1+g)ⁿ" }, { label: "3. FCF cumulé", note: "→ debt paydown" }, { label: "4. Sortie", note: "EBITDA × multiple" }, { label: "5. Returns", note: "MOIC → IRR" },
      ]},
    ],
    examples: [
      { title: "Variante « cadeau »", body: "« FCF disponible pour la dette : 60/an, constant. » Alors : paydown 5 ans = 300, et tout le reste se déroule en 90 secondes. Quand l'énoncé simplifie, fonce — ne recalcule pas ce qu'on t'offre." },
      { title: "Variante piège", body: "« Le capex double en année 3 pour une nouvelle usine. » Réflexe : le FCF de l'année 3 chute, le paydown ralentit — MAIS l'EBITDA des années 4-5 devrait accélérer (sinon pourquoi investir ?). Dire cette phrase montre que tu penses en investisseur, pas en calculette." },
      { title: "Erreur fréquente", body: "Se lancer tête baissée dans les calculs sans poser la structure. Commence par : « OK — entrée, projection, cash, sortie, returns. À l'entrée : … ». L'examinateur doit pouvoir te suivre les yeux fermés." },
    ],
    quizIds: ["lb7", "lb3", "lb4", "lb8"],
    exercises: [
      { kind: "gap", title: "Les puissances du paper LBO", prompt: "Complète les approximations à connaître :", template: "1,05⁵ ≈ ◻\n1,10⁵ ≈ ◻\n2^(1/5) − 1 ≈ ◻", blanks: [
        { options: ["1,28", "1,15", "1,50"], correct: 0 },
        { options: ["1,61", "1,45", "2,00"], correct: 0 },
        { options: ["15%", "26%", "20%"], correct: 0 },
      ], explain: "Trois approximations qui couvrent 90% des paper LBO. Les mémoriser vaut des points garantis." },
      { kind: "order", title: "Récite la méthode", prompt: "L'ordre du paper LBO :", items: ["Entrée : EV, split dette/equity", "Projection de l'EBITDA", "FCF cumulé → paydown", "EV et equity de sortie", "MOIC, IRR… et le jugement final"], explain: "Cinq étapes, et la conclusion en jugement (« au-dessus/en-dessous de la cible ») qui fait la différence." },
    ],
    miniCase: {
      context: "Entretien, énoncé réel : « EBITDA 80, entrée 7x, dette 4,5x l'EBITDA, FCF disponible pour la dette 30/an, sortie dans 5 ans à 7,5x avec un EBITDA de 100. Fais-moi le LBO. »",
      task: "Déroule les 5 étapes avec les chiffres, conclus MOIC + IRR approximatif + une phrase de jugement.",
      hints: ["Equity entrée = (7 − 4,5) × 80.", "Le MOIC tombe entre les repères 2x/15% et 3x/25%."],
      modelAnswer: "Entrée : EV = 560 ; dette = 360 ; equity = 200. Projection : EBITDA donné, 100 en sortie. Paydown : 5 × 30 = 150 → dette sortie 210. Sortie : EV = 100 × 7,5 = 750 ; equity = 750 − 210 = 540. Returns : MOIC = 540/200 = 2,7x en 5 ans → IRR ≈ 22% (entre 2x/15% et 3x/25%, plus proche du haut). Jugement : au-dessus de la cible de 20% — deal attractif, porté par les trois moteurs à la fois (EBITDA +25%, paydown de 150, et un demi-tour de multiple) ; le point de vigilance serait la dépendance au multiple de sortie : à 7x constant, l'equity tombe à 490 et l'IRR à ~20% — encore acceptable, donc le deal tient même sans expansion. GO.",
      keywords: ["560|360|200", "150|210", "750|540", "2,7|2.7|22", "7x|490|tient|go"],
    },
  },

  // ═══════════════ NIVEAU 7 — PRIVATE EQUITY & OUTILS ═══════════════
  {
    id: "c71", level: 7, title: "L'industrie du private equity", emoji: "💼", minutes: 22, xp: 50,
    hook: "Qui sont ces fonds qui achètent tout ? Comment gagnent-ils de l'argent, pour qui, et pourquoi le PE recrute-t-il chez les analystes M&A ?",
    simple: "Un fonds de private equity collecte de l'argent auprès d'investisseurs institutionnels — fonds de pension, assureurs, fonds souverains, familles fortunées — appelés les LPs (Limited Partners). La société de gestion — le GP (General Partner) — investit cet argent dans des entreprises (les LBO du niveau 6), les transforme, puis les revend, sur un cycle de 8-12 ans par fonds.\n\nLa rémunération, le fameux « 2 and 20 » : ~2% de management fees annuels sur les montants engagés (paie les équipes et les bureaux), et 20% de la plus-value au-delà d'un rendement minimal promis aux LPs (~8%, le hurdle) — c'est le carried interest, le moteur de fortune du métier.\n\nLes stratégies voisines à situer : buyout (contrôle majoritaire par LBO — le cœur), growth equity (minoritaire dans des sociétés en croissance, peu de dette), venture capital (startups), distressed/special situations, infrastructure, dette privée. Chacune a son profil rendement/risque.",
    analogy: "Le GP est le chef d'un restaurant financé par des investisseurs (les LPs) : il touche un salaire fixe pour faire tourner la cuisine (management fees), mais son vrai gain est un pourcentage des bénéfices SI le restaurant dépasse un seuil promis aux investisseurs (le carry). Devine ce qui le motive vraiment.",
    deep: "Le cycle de vie d'un fonds : levée (12-18 mois de roadshow auprès des LPs) → période d'investissement (années 1-5 : déploiement dans 10-20 sociétés) → période de création de valeur et de sorties (années 4-10 : cessions, IPO, secondaries) → liquidation. Les capitaux sont APPELÉS au fur et à mesure des deals (capital calls), pas versés d'avance — d'où les subtilités d'IRR.\n\nLe « dry powder » : les capitaux levés mais non investis — plusieurs milliers de milliards au niveau mondial. Il crée une pression structurelle à déployer, qui soutient les valorisations des actifs de qualité.\n\nComment les fonds créent de la valeur au-delà du levier (le débat du niveau 6) : professionnalisation de la gouvernance (boards resserrés, reporting), talent management (changer un CEO en 6 mois — impensable en coté), les build-ups (consolider un secteur fragmenté par acquisitions à petits multiples), la discipline du cash. Les études LPs montrent que la dispersion entre bons et mauvais fonds est énorme — d'où l'obsession du track record.\n\nPourquoi le PE recrute en M&A : les analystes maîtrisent la modélisation, les process et la pression — le chemin classique « 2-3 ans d'analyst M&A → associate en fonds » explique pourquoi TES entretiens de stage testent déjà les concepts LBO.",
    traps: [
      "GP vs LP : confusion éliminatoire. Le GP gère et touche le carry ; les LPs apportent le capital.",
      "Le carry n'est PAS un bonus salarial : c'est une part des plus-values, versée après le hurdle des LPs, souvent des années plus tard.",
      "« Le PE surperforme toujours la bourse » : la moyenne est débattue — c'est la SÉLECTION des fonds qui fait tout.",
      "Growth equity ≠ LBO : minoritaire, peu ou pas de dette, thèse de croissance — ne pas tout appeler « private equity » sans nuance.",
    ],
    mnaUse: "Les sponsors sont dans tous tes process (acheteurs ou vendeurs). Comprendre leurs contraintes (IRR cible, horizon, levier disponible) t'aide à anticiper leurs comportements d'enchère. En entretien : « qu'est-ce que le carried interest ? », « pourquoi le PE peut-il payer moins qu'un stratégique ? », « GP vs LP ? »",
    diagrams: [
      { type: "flow", title: "Le circuit de l'argent en PE", steps: [
        { label: "LPs", note: "pensions, assureurs…" }, { label: "Fonds (GP)", note: "2% fees / 20% carry" }, { label: "Sociétés en portefeuille", note: "LBO, build-ups" }, { label: "Sorties", note: "trade sale, IPO, secondary" }, { label: "Distributions aux LPs", note: "après hurdle 8%" },
      ]},
    ],
    examples: [
      { title: "Le carry chiffré", body: "Fonds de 1 Md€, revendu pour 2,2 Md€ de valeur totale. Plus-value : 1,2 Md€. Après le hurdle de 8%/an aux LPs, le GP prend ~20% du gain : ~220 M€ de carried interest partagés entre une vingtaine d'associés. Voilà pourquoi le métier attire — et pourquoi il est si sélectif." },
      { title: "Exemple réel", body: "Les géants — Blackstone, KKR, EQT, CVC, Ardian — gèrent chacun des dizaines/centaines de milliards, ont des stratégies multiples (buyout, infra, crédit, immobilier) et sont pour certains… cotés en bourse. Le PE est devenu une industrie institutionnelle, plus un club artisanal." },
      { title: "Erreur fréquente", body: "En entretien : « je veux faire du PE pour investir plutôt que conseiller » — sans savoir expliquer le 2/20, le rôle des LPs ou pourquoi les fonds recrutent des analystes M&A. Si tu cites le métier comme débouché, connais sa plomberie." },
    ],
    quizIds: ["fd5", "lb9", "lb2"],
    extraQuiz: [
      { id: "xq-c71a", kind: "mcq", topic: "lbo", tags: ["pe-industry"], difficulty: 2,
        prompt: "Dans un fonds de PE, qui touche le carried interest ?",
        choices: ["Les LPs, au prorata de leur mise", "Le GP (l'équipe de gestion), au-delà du hurdle", "Les banques prêteuses", "Le management des sociétés en portefeuille"],
        answer: 1, explanation: "Le carry (≈20% des plus-values au-delà du hurdle ~8%) rémunère le GP. Les LPs touchent le reste ; le management des cibles a son propre package, distinct." },
      { id: "xq-c71b", kind: "mcq", topic: "lbo", tags: ["pe-industry"], difficulty: 2,
        prompt: "Le « dry powder » désigne…",
        choices: ["La dette non tirée d'un LBO", "Les capitaux levés par les fonds mais pas encore investis", "Les réserves de cash des cibles", "Les fees non distribués"],
        answer: 1, explanation: "Des milliers de milliards en attente de déploiement — une pression acheteuse structurelle sur les actifs de qualité." },
    ],
    exercises: [
      { kind: "tf", title: "L'industrie, vrai ou faux ?", statements: [
        { text: "Les management fees (~2%) sont la principale source d'enrichissement des associés d'un grand fonds performant.", answer: false, explain: "Les fees paient la structure ; la fortune vient du CARRY (20% des plus-values)." },
        { text: "Les capitaux d'un fonds sont appelés progressivement, deal par deal.", answer: true, explain: "Les capital calls : les LPs versent quand le fonds investit — pas tout au jour 1." },
        { text: "Un stratégique peut généralement payer plus cher qu'un sponsor pour la même cible.", answer: true, explain: "Les synergies. Le sponsor est contraint par ses maths d'IRR — d'où le « LBO floor » des valorisations." },
      ]},
      { kind: "order", title: "La vie d'un fonds", prompt: "Remets le cycle dans l'ordre :", items: ["Levée auprès des LPs", "Période d'investissement (déploiement)", "Création de valeur dans les participations", "Sorties (cessions, IPO)", "Distributions et liquidation du fonds"], explain: "Lever → investir → transformer → sortir → distribuer. 8-12 ans par fonds — et les grands GPs lèvent le fonds suivant avant d'avoir fini le précédent." },
    ],
    miniCase: {
      context: "En entretien M&A : « Vous aurez souvent des fonds de PE en face de vous dans les process. Qu'est-ce qui rend leur comportement d'enchère PRÉVISIBLE, et comment un banquier sell-side l'exploite-t-il ? »",
      task: "Réponds en 5-6 phrases en mobilisant : IRR cible, levier disponible, dry powder, calendrier des fonds.",
      hints: ["Le prix max d'un sponsor se calcule (LBO inversé).", "Un fonds en fin de période d'investissement a-t-il la même pression qu'un fonds fraîchement levé ?"],
      modelAnswer: "Le sponsor est prévisible parce que son prix maximal se CALCULE : c'est celui où le LBO atteint encore ~20% d'IRR compte tenu du levier que le marché de la dette accorde — un banquier fait tourner ce LBO inversé et connaît le plafond du fonds avant lui. Ses autres contraintes se lisent aussi : un fonds gorgé de dry powder en début de période d'investissement DOIT déployer (agressivité accrue) ; un fonds en fin de période veut sécuriser un dernier platform deal ; et les fenêtres de financement (spreads high yield) dictent son pouvoir d'achat du moment. Le sell-side exploite tout cela : mettre des sponsors en compétition avec des stratégiques (qui peuvent dépasser le plancher LBO grâce aux synergies), calibrer le calendrier sur les fenêtres de crédit, et pousser les sponsors vers leur maximum calculable en entretenant la tension. Comprendre l'acheteur, c'est déjà négocier.",
      keywords: ["irr|20%|plafond|inversé", "levier|dette|spread", "dry powder|déployer", "stratégique|synergies|plancher", "tension|calendrier"],
    },
  },

  {
    id: "c72", level: 7, title: "Excel & modélisation : la boîte à outils de l'analyste", emoji: "⌨️", minutes: 24, xp: 50,
    hook: "80% de tes journées de stage se passeront dans Excel. La différence entre 2h et 20 minutes sur une tâche : la méthode et les raccourcis.",
    simple: "Les règles d'or de la modélisation financière :\n\n1. La CONVENTION DE COULEURS universelle : bleu = inputs (chiffres tapés à la main), noir = formules, vert = liens vers d'autres feuilles. Quiconque ouvre ton modèle sait instantanément quoi toucher.\n\n2. SÉPARER inputs / calculs / outputs : une feuille d'hypothèses, des feuilles de calcul, une page de résultats. Jamais de chiffre « en dur » dans une formule (le péché capital).\n\n3. UNE colonne = UNE période, la même sur toutes les feuilles. Une ligne = un concept.\n\n4. La SOURICE EST INTERDITE (ou presque) : tout se fait au clavier. Les raccourcis ne sont pas du confort — ils sont le métier.\n\n5. Des CHECKS partout : le bilan balance ? les sources = uses ? Une cellule de contrôle qui affiche « OK/ERREUR » sauve des nuits entières.",
    analogy: "Un modèle Excel, c'est une cuisine de restaurant : ingrédients étiquetés (inputs bleus), postes de travail séparés (feuilles), recettes standardisées (formules cohérentes), et le coup de feu ne pardonne pas le désordre. Le stagiaire qui cherche sa cellule comme on cherche le sel perd le service.",
    deep: "Les raccourcis Windows qui changent la vie (le standard en banque) : Ctrl+flèches (naviguer aux bords), Ctrl+Maj+flèches (sélectionner), F2 (inspecter une formule), F4 (figer les références $ — et répéter la dernière action), Ctrl+PgUp/PgDn (changer d'onglet), Alt+= (somme), Ctrl+1 (format), Alt+E+S (collage spécial — valeurs/formats), Ctrl+[ (aller aux antécédents d'une formule) puis F5+Entrée (revenir). Objectif : des heures gagnées par semaine, littéralement.\n\nLes fonctions du quotidien financier : SUMIF/SUMIFS (agrégations conditionnelles), INDEX+MATCH (recherches robustes — préféré à VLOOKUP qui casse quand on insère des colonnes), XLOOKUP (le moderne), IFERROR (propreté), EOMONTH/EDATE (dates), NPV/IRR/XIRR (les flux — XIRR pour les dates irrégulières), et les data tables (Données > Analyse scénarios) pour les matrices de sensibilité WACC × g.\n\nL'architecture d'un modèle 3 états : feuille d'hypothèses → P&L → bilan → cash flow → debt schedule — avec LA subtilité circulaire classique (les intérêts dépendent de la dette, qui dépend du cash flow, qui dépend des intérêts) : on la gère par un interrupteur de circularité ou une approximation sur la dette moyenne. Les modèles de merger et de LBO ajoutent leurs blocs (sources & uses, PPA, waterfall de dette).\n\nEt les erreurs qui font les légendes noires : la référence qui glisse (un $ oublié), le hardcode caché au milieu d'une formule, le copier-coller qui écrase une formule par une valeur, le signe inversé sur une ligne de flux. D'où la religion des checks et de la revue systématique (Ctrl+[ sur toute cellule suspecte).",
    traps: [
      "Un chiffre en dur dans une formule (=B4*1,05*0,25+12) : indétrouvable, infalsifiable, inexcusable.",
      "VLOOKUP avec numéro de colonne : casse dès qu'on insère une colonne. INDEX+MATCH ou XLOOKUP.",
      "Modéliser AVANT de structurer : 10 minutes de plan de feuilles économisent 3 heures de dette technique.",
      "Zéro check de cohérence : un bilan qui ne balance pas découvert à 2h du matin la veille du pitch.",
    ],
    mnaUse: "Certaines banques testent Excel en entretien (modeling tests chronométrés type « 3-statement model en 2h »). Et dès ton premier jour de stage, ta crédibilité se joue sur la propreté de tes fichiers. Les cheat sheets de l'onglet Ressources listent tous les raccourcis.",
    diagrams: [
      { type: "flow", title: "L'architecture d'un modèle 3 états", steps: [
        { label: "Hypothèses", note: "inputs bleus, un seul endroit" }, { label: "P&L", note: "revenue → NI" }, { label: "Bilan", note: "+ checks d'équilibre" }, { label: "Cash flow", note: "boucle le cash" }, { label: "Debt schedule", note: "intérêts ↔ dette" },
      ]},
    ],
    examples: [
      { title: "Le gain de temps chiffré", body: "Mettre en forme un tableau de comps : à la souris, ~15 minutes de clics. Au clavier (Ctrl+Maj+flèches, Ctrl+1, Alt+E+S, F4), ~3 minutes. Sur une saison de stage, ce ratio de 5x sur chaque micro-tâche, c'est des dizaines d'heures — et des collègues qui remarquent." },
      { title: "Le check qui sauve", body: "Ligne 200 du modèle : =SI(ABS(ActifTotal−PassifTotal)<0,01;\"OK\";\"ERREUR\"). Formatée en rouge vif si erreur, visible depuis chaque feuille. Le jour où un stagiaire écrase une formule de BFR, le modèle crie immédiatement — au lieu de mentir en silence dans le pitch." },
      { title: "Erreur fréquente", body: "Vouloir briller par la complexité : un modèle à 40 onglets imbriqués que personne (pas même toi dans deux semaines) ne peut auditer. La sophistication d'un modèle se juge à sa LISIBILITÉ, pas à son nombre de formules." },
    ],
    quizIds: [],
    extraQuiz: [
      { id: "xq-c72a", kind: "mcq", topic: "foundations", tags: ["excel"], difficulty: 1,
        prompt: "Convention de couleurs standard en modélisation :",
        choices: ["Bleu = formules, noir = inputs", "Bleu = inputs, noir = formules, vert = liens inter-feuilles", "Rouge = inputs, bleu = résultats", "Aucune convention n'existe"],
        answer: 1, explanation: "Bleu tapé / noir calculé / vert lié : le standard mondial. Quiconque ouvre le modèle sait quoi modifier sans rien casser." },
      { id: "xq-c72b", kind: "mcq", topic: "foundations", tags: ["excel"], difficulty: 2,
        prompt: "Pourquoi préférer INDEX+MATCH (ou XLOOKUP) à VLOOKUP ?",
        choices: ["C'est plus joli", "VLOOKUP est plus lent uniquement", "VLOOKUP casse quand on insère des colonnes (numéro de colonne en dur) et ne cherche qu'à droite", "Aucune différence"],
        answer: 2, explanation: "Le numéro de colonne codé en dur est une bombe à retardement dans un modèle vivant. INDEX+MATCH/XLOOKUP référencent les colonnes dynamiquement." },
      { id: "xq-c72c", kind: "mcq", topic: "foundations", tags: ["excel"], difficulty: 2,
        prompt: "La circularité classique d'un modèle 3 états vient de…",
        choices: ["Le BFR qui dépend du CA", "Les intérêts qui dépendent de la dette, laquelle dépend du cash flow, lequel dépend des intérêts", "La D&A qui dépend du capex", "Le dividende qui dépend du net income"],
        answer: 1, explanation: "La boucle intérêts ↔ dette ↔ cash flow. On la gère par un switch de circularité ou en calculant les intérêts sur la dette moyenne/d'ouverture." },
    ],
    exercises: [
      { kind: "order", title: "Construire un modèle proprement", prompt: "Remets les étapes dans l'ordre :", items: ["Structurer les feuilles (hypothèses/calculs/outputs)", "Poser les inputs en bleu, à un seul endroit", "Construire P&L, bilan, cash flow liés", "Ajouter debt schedule et circularité maîtrisée", "Poser les checks et auditer (Ctrl+[)"], explain: "Structure → inputs → états → dette → contrôles. Dix minutes de plan, des heures économisées." },
      { kind: "tf", title: "Réflexes de modeleur", statements: [
        { text: "F4 fige les références ($) dans une formule en cours d'édition.", answer: true, explain: "Et hors édition, F4 répète la dernière action — double raccourci le plus rentable d'Excel." },
        { text: "Un chiffre tapé directement dans une formule est acceptable si on s'en souvient.", answer: false, explain: "Personne ne s'en souvient. Tout input vit dans la feuille d'hypothèses, en bleu." },
        { text: "Une matrice de sensibilité WACC × g se construit efficacement avec une data table.", answer: true, explain: "Données → Analyse de scénarios → Table de données : l'outil standard des sensibilités de DCF." },
      ]},
    ],
    miniCase: {
      context: "Ton associate t'envoie un modèle « qui donne un résultat bizarre » : la valorisation DCF a changé de 20% depuis hier soir, personne ne sait pourquoi. Le fichier a 12 onglets, pas de convention de couleurs, et le stagiaire précédent est parti.",
      task: "Décris ta méthode d'audit en 5-6 étapes concrètes (raccourcis à l'appui) pour trouver la corruption — et les 2 mesures pour que ça n'arrive plus.",
      hints: ["Par où entre la valeur ? Remonte depuis le résultat avec Ctrl+[.", "Compare avec la version d'hier (les fichiers datés existent-ils ?)."],
      modelAnswer: "1) Sécuriser : sauvegarder une copie datée avant de toucher quoi que ce soit. 2) Comparer avec la version de la veille si elle existe (différence de résultats feuille par feuille) pour localiser la zone. 3) Remonter le flux de calcul depuis la cellule de valorisation avec Ctrl+[ (antécédents), de proche en proche : EV ← somme des PV ← UFCF ← hypothèses. 4) Chasser les hardcodes : Accueil > Rechercher > Sélectionner les constantes dans les zones de formules — un chiffre écrasé par un copier-coller est la cause n°1. 5) Vérifier les références glissées (un $ manquant sur la ligne de WACC qui décale les facteurs d'actualisation). 6) Documenter le fix dans un onglet « change log ». Mesures préventives : imposer la convention de couleurs + une batterie de checks visibles (bilan, sources=uses, TV actualisée) — un modèle doit CRIER quand on le casse, pas mentir.",
      keywords: ["copie|sauvegard|version", "ctrl+\\[|antécédent|remonte", "constante|hardcode|écrasé", "\\$|référence|glissé", "check|couleur|log"],
    },
  },

  // ═══════════════ NIVEAU 8 — ENTRETIENS ═══════════════
  {
    id: "c81", level: 8, title: "Convertir : la méthode de l'entretien technique", emoji: "🎤", minutes: 25, xp: 60,
    hook: "Tu as le savoir. Ce chapitre t'apprend à le TRANSFORMER en offre : structure des entretiens, méthode de réponse, gestion des pièges — puis place à l'entraînement intensif.",
    simple: "Un process de recrutement type : screening RH (fit, motivation) → 1-2 tours techniques (analyst/associate : les questions des niveaux 2-6) → tours seniors (VP/MD : jugement, deals, marché) → parfois un case study ou un modeling test.\n\nLa méthode pour TOUTE question technique : (1) réponds D'ABORD — la conclusion en première phrase ; (2) déroule ensuite le raisonnement en 2-3 points structurés ; (3) tais-toi — laisse l'interviewer relancer. 30-90 secondes par réponse : un entretien est un ping-pong, pas une conférence.\n\nFace à une question dont tu ignores la réponse — ça arrivera — le protocole : ne JAMAIS bluffer (détecté = éliminé) ; demander une clarification si légitime ; raisonner à voix haute depuis les principes (« je n'ai jamais vu ce cas, mais en partant de la logique EV/equity… ») ; assumer la limite avec calme. L'honnêteté structurée est NOTÉE POSITIVEMENT — le bluff, éliminatoire.",
    analogy: "L'entretien technique est un contrôle de conduite, pas un examen écrit : l'inspecteur ne veut pas que tu récites le code, il veut te voir conduire — réagir à un imprévu, garder ton calme dans un rond-point inconnu, et signaler quand tu ne vois pas (plutôt que d'accélérer en espérant que ça passe).",
    deep: "Ce que chaque niveau d'interviewer teste : l'ANALYSTE vérifie la mécanique (walk-throughs comptables, bridge, DCF récité, paper LBO) — précision et vitesse. L'ASSOCIATE creuse la COMPRÉHENSION : chaque réponse appelle un « pourquoi ? » — il cherche l'étage où tu ne comprends plus ce que tu récites. Le VP teste le JUGEMENT : deals d'actualité, questions de marché, mises en situation client. Le MD évalue une seule chose : « est-ce que je l'imagine devant un client dans 3 ans ? » — maturité, calme, curiosité.\n\nLes 10 questions à blinder absolument (chacune renvoie à ton parcours) : walk me through the 3 statements ; D&A +10 ; EBITDA vs cash flow ; EV vs equity value + le bridge ; pourquoi soustraire le cash ; les 3 méthodes de valorisation et leur hiérarchie ; walk me through a DCF ; accretion/dilution (les règles rapides) ; paper LBO ; how would you value a bank (le piège FIG).\n\nEt le canal parallèle, aussi noté que la technique : la CONCISION (réponse d'abord), l'ANGLAIS (la moitié des questions techniques tomberont en anglais — prépare tes réponses dans les deux langues), et l'ÉNERGIE (un candidat techniquement moyen mais structuré, honnête et enthousiaste bat souvent un savant confus).\n\nTon plan d'entraînement, maintenant : la Red Book Bank (220 questions), l'Interview Arena (mocks scriptés du RH au MD + Don't Bullshit Mode), et l'Entretien Live IA — l'interviewer qui s'adapte à TES réponses. C'est le niveau 8 : tout est déjà dans la plateforme.",
    traps: [
      "Réciter sans respirer : la réponse de 4 minutes qui noie la conclusion. Réponse d'abord, 30-90 secondes, stop.",
      "Bluffer sur une question inconnue : LE crime éliminatoire. Le protocole d'honnêteté structurée existe pour ça.",
      "Négliger le fit : « why M&A », « why this bank », ton histoire — 50% de la décision, souvent bâclés par les profils techniques.",
      "Ne préparer qu'en français : « walk me through a DCF » tombera en anglais. Bilingue ou rien.",
    ],
    mnaUse: "C'est le chapitre méta : il organise tout le reste. Ta feuille de route : blinde les 10 questions → 220 questions de la Bank par thème → Arena scriptée → Live IA → et le niveau 9 pour l'immersion.",
    diagrams: [
      { type: "flow", title: "Le process de recrutement type", steps: [
        { label: "Screening RH", note: "fit, parcours" }, { label: "Tours techniques", note: "analyst/associate" }, { label: "Tours seniors", note: "VP/MD : jugement" }, { label: "Case / modeling", note: "selon les banques" }, { label: "Offre", note: "🎉" },
      ]},
      { type: "flow", title: "La méthode de réponse", steps: [
        { label: "1. Conclusion", note: "réponds d'abord" }, { label: "2. Raisonnement", note: "2-3 points" }, { label: "3. Silence", note: "laisse relancer" },
      ]},
    ],
    examples: [
      { title: "Réponse d'abord, en action", body: "« Is this deal accretive? » — Faible : 3 minutes de calculs à voix haute puis un verdict. Fort : « Accretive, roughly +4% — the target's earnings yield of 6% exceeds the 3.75% after-tax cost of debt. Happy to walk through the math. » Dix secondes, conclusion, preuve, ouverture." },
      { title: "L'honnêteté structurée, en action", body: "« How would you value a mining company? » — Tu n'as jamais vu ça. Fort : « I haven't valued one, but reasoning from first principles: commodity businesses are cyclical and price-taking, so I'd normalize earnings over the cycle, look at EV/EBITDA through-cycle, and I believe the industry uses NAV based on reserves — I'd want to check that. » Structure + humilité = points." },
      { title: "Erreur fréquente", body: "Traiter le RH comme une formalité : c'est un filtre à part entière, et une « mauvaise vibe » y élimine des candidats techniquement parfaits. Ton histoire (« tell me about yourself ») se travaille autant que ton DCF." },
    ],
    quizIds: ["bh1", "bh3", "in3", "ac21"],
    exercises: [
      { kind: "order", title: "La méthode de réponse", prompt: "Remets la méthode dans l'ordre :", items: ["Donner la conclusion en première phrase", "Dérouler le raisonnement en 2-3 points", "Se taire et laisser l'interviewer relancer"], explain: "Conclusion → preuve → silence. Le ping-pong bat la conférence, à tous les niveaux d'entretien." },
      { kind: "tf", title: "Les règles du jeu", statements: [
        { text: "Face à une question inconnue, mieux vaut tenter une réponse assurée que montrer une hésitation.", answer: false, explain: "Le bluff détecté est éliminatoire. Raisonner à voix haute depuis les principes en assumant l'incertitude est valorisé." },
        { text: "Demander une clarification pertinente peut être noté positivement.", answer: true, explain: "« Vous parlez d'un deal en cash ou en actions ? » montre la maîtrise, pas la faiblesse — le Don't Bullshit Mode de l'Arena t'y entraîne." },
        { text: "La moitié des questions techniques peuvent tomber en anglais.", answer: true, explain: "Prépare chaque réponse canonique dans les deux langues — les model answers de la plateforme te donnent les deux." },
      ]},
    ],
    miniCase: {
      context: "Simulation : l'associate enchaîne — « Walk me through a DCF. » Tu réponds bien. « OK. Votre DCF sort 30% au-dessus des comps. Le client veut afficher le chiffre du DCF dans le pitch. Vous faites quoi ? »",
      task: "Réponds à la relance comme en entretien (6-8 phrases) : le diagnostic, la position, la diplomatie.",
      hints: ["Pourquoi un DCF sort-il au-dessus des comps ? (hypothèses !)", "Que risque le client avec un chiffre indéfendable ?"],
      modelAnswer: "« D'abord le diagnostic : un DCF à +30% des comps signifie presque toujours des hypothèses de business plan agressives — croissance, marges ou g terminal au-dessus de ce que le marché price pour les pairs. Je re-testerais ces hypothèses contre le consensus et l'historique : si elles ne tiennent pas, le problème est le modèle, pas le marché. Ensuite la position : afficher un chiffre indéfendable dessert le client — les acheteurs le démonteront en due diligence et la crédibilité de tout le process en souffrira. Ma recommandation : présenter le football field complet, avec le DCF en fourchette et ses sensibilités, et expliquer au client que le HAUT de la fourchette se va se chercher par la tension du process et les synergies des stratégiques — pas par l'affichage. Et si le client insiste ? C'est une décision pour le VP/MD — mais mon travail est de leur donner une analyse honnête. » Cette réponse teste tout : technique, jugement, intégrité, sens du client.",
      keywords: ["hypothèses|agressives|consensus", "indéfendable|due diligence|crédib", "football field|fourchette|sensibilit", "tension|synergies", "vp|md|honnête"],
    },
  },

  // ═══════════════ NIVEAU 9 — SIMULATION DE STAGE ═══════════════
  {
    id: "c91", level: 9, title: "Ta première semaine au desk", emoji: "🏦", minutes: 20, xp: 60,
    hook: "Dernier niveau : l'immersion. Tu es analyste. Le VP a des missions, les deadlines sont réelles, les corrections sont exigeantes. Voici ton programme d'intégration.",
    simple: "Bienvenue chez BancoInvest, équipe M&A. Ton VP, Mehdi, encadre trois mandats en cours ; ton associate, Sarah, relit tout ce que tu produis. Le deal de la semaine : Projet Neptune — la vente d'Helios Med, un fabricant de dispositifs médicaux.\n\nTa semaine type d'intégration :\n\nJour 1-2 : la valorisation. Sarah te confie l'EV de la cible (mission « Calcule l'Enterprise Value »), puis un quick DCF pour le call client de 15h.\n\nJour 3 : le narratif. Le MD veut 5 bullets sur le deal rationale, et une page de profil pour un comparable.\n\nJour 4 : le test. Un paper LBO — « le fonds Artemis demande si la cible est un candidat crédible ».\n\nJour 5 : la synthèse. Q&A de management presentation, et le débrief de ta semaine.\n\nChaque mission se joue dans l'Analyst Desk avec chrono, données et correction détaillée. Ta performance nourrit ton Readiness Score.",
    analogy: "C'est ton stage… avant le stage. Comme un simulateur de vol : les erreurs y sont gratuites, les réflexes deviennent réels — et le jour du vrai décollage, le cockpit te sera familier.",
    deep: "Le programme complet, dans l'ordre de difficulté croissante (chaque mission existe dans l'Analyst Desk) :\n\nSemaine 1 — les fondamentaux du desk : EV de la target (ms1), quick DCF (ms2), pourquoi le cash se soustrait — expliqué à un stagiaire (ms6), mini-profil de comparable (ms5).\n\nSemaine 2 — le cœur du deal : 5 bullets de rationale pour le MD (ms3), le test accretion/dilution (ms4), le paper LBO d'Artemis (ms7), le bridge du CFO à corriger diplomatiquement (ms10).\n\nSemaine 3 — le grand oral : préparer le Q&A de management presentation (ms8), TON deal memo hebdomadaire (ms9 — l'habitude à garder à vie), puis les case studies complets du Deal Room : commence par les cas fil rouge (Helios Med en DCF, cs4) et monte jusqu'aux cas professional (Projet Athena, cs10 ; le Full Interview Case, cs12).\n\nLes standards de qualité qui te seront appliqués — les mêmes qu'en vrai : zéro erreur de calcul (une erreur dans un chiffre envoyé au client est une crise), le format « réponse d'abord » dans toute communication écrite, l'honnêteté sur ce que tu n'as pas eu le temps de vérifier, et la deadline sacrée : mieux vaut un livrable à 90% à l'heure qu'un livrable parfait en retard — avec l'alerte donnée TÔT.\n\nAprès la simulation : le Boss Fight final (Behavioral), l'Entretien Live IA en mode MD, et le monde réel. Tu es prêt.",
    traps: [
      "Vouloir impressionner par la quantité : un analyste est jugé sur la FIABILITÉ. Trois chiffres justes battent dix chiffres douteux.",
      "Cacher une difficulté jusqu'à la deadline : l'alerte précoce est une compétence, pas un aveu de faiblesse.",
      "Négliger la forme : un calcul juste dans un format illisible est un travail à moitié fait.",
      "Oublier le POURQUOI : chaque mission a un client au bout — demande-toi toujours à quoi servira ton livrable.",
    ],
    mnaUse: "C'est la répétition générale du stage. Les missions simulent les vraies tâches, les corrections simulent les vraies revues, et le rythme simule la vraie pression. Ton objectif : arriver au premier jour du stage en terrain connu.",
    diagrams: [
      { type: "flow", title: "Ton programme d'immersion", steps: [
        { label: "Sem. 1", note: "EV, DCF, comps (ms1-2-5-6)" }, { label: "Sem. 2", note: "rationale, accretion, LBO (ms3-4-7-10)" }, { label: "Sem. 3", note: "Q&A, memo, cases (ms8-9 + Deal Room)" }, { label: "Finale", note: "Boss Behavioral + Live IA MD" },
      ]},
    ],
    examples: [
      { title: "Une mission type", body: "« Ton VP : j'ai un call client à 15h, il me faut un sanity check DCF sur Helvetia Foods. Pas le modèle complet — l'ordre de grandeur. » Données fournies, 30 minutes au chrono, et une correction qui note ta méthode ET ta présentation. Exactement ce qu'on te demandera en juillet." },
      { title: "Le standard de communication", body: "Livrable attendu par Sarah : « EV ≈ 1,26 Md€ (DCF 5 ans, WACC 9%, g 2%) ; la TV pèse 73% — sensibilités jointes ; deux points d'attention : le capex terminal et le BFR. » Trois lignes : conclusion, méthode, alertes. C'est ça, écrire comme un analyste." },
      { title: "Erreur fréquente", body: "Faire les missions « pour le score » en lisant la correction avant de chercher. La valeur de la simulation est dans l'inconfort de chercher SEUL d'abord — comme au desk, où personne ne te donnera la réponse modèle." },
    ],
    quizIds: ["fd4", "bh2"],
    exercises: [
      { kind: "order", title: "Réagir comme un analyste", prompt: "Il est 17h30, livrable pour 19h, tu découvres une incohérence dans les données sources. Remets les actions dans l'ordre :", items: ["Vérifier rapidement si l'incohérence est réelle (2 minutes)", "Alerter l'associate immédiatement avec le diagnostic", "Proposer une solution : hypothèse de repli documentée", "Livrer à l'heure avec la limitation signalée en note"], explain: "Vérifier → alerter TÔT → proposer → livrer avec transparence. Le silence jusqu'à 18h55 est la seule mauvaise réponse." },
      { kind: "tf", title: "Les standards du desk", statements: [
        { text: "Mieux vaut livrer en retard mais parfait qu'à l'heure avec une limitation signalée.", answer: false, explain: "La deadline est sacrée : 90% à l'heure avec les limites documentées > 100% en retard. Le client a un calendrier, pas un idéal." },
        { text: "Une erreur de calcul envoyée au client est une simple correction à faire.", answer: false, explain: "C'est une crise de confiance : tout le document devient suspect. D'où la religion de la vérification." },
        { text: "Chaque livrable doit commencer par la conclusion.", answer: true, explain: "« Réponse d'abord » : le VP lit la première ligne, le reste est de la preuve." },
      ]},
    ],
    miniCase: {
      context: "Fin de ta semaine simulée. Mehdi (VP) te demande ton auto-débrief : « Qu'est-ce que tu as appris cette semaine, où es-tu encore faible, et quel est ton plan pour les 30 prochains jours ? »",
      task: "Rédige ton auto-débrief (6-8 phrases) : 2-3 acquis concrets, 2 faiblesses HONNÊTES identifiées via tes scores sur la plateforme, et un plan d'action daté.",
      hints: ["Regarde ton Dashboard : quels topics sont sous 60% ?", "Un plan sans dates n'est pas un plan."],
      modelAnswer: "Exemple de structure attendue : « Acquis : je déroule le bridge EV/equity et un quick DCF avec méthode — mes scores sur les missions de valorisation dépassent 75% ; et j'ai adopté le format « conclusion d'abord » dans mes livrables. Faiblesses : l'accretion/dilution en calcul de tête reste lente (67% au boss, oublis de foregone interest), et mon paper LBO manque de fluidité sur les conversions IRR. Plan 30 jours : semaines 1-2, un drill quotidien + refaire ms4 et le Boss Accretion jusqu'à 85%+ ; semaine 3, trois paper LBO chronométrés (ms7 et variantes) ; semaine 4, full mock en Live IA mode MD, et mise à jour de mes deux deal memos pour les entretiens. » Le fond compte moins que la démarche : preuves chiffrées, honnêteté, plan daté — exactement ce qu'un VP veut entendre d'un junior.",
      keywords: ["score|75|chiffr", "faibless|honnête|67|lent", "plan|semaine|30 jours", "drill|boss|mock", "memo|entretien"],
    },
  },
];
