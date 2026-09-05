import type { CaseStudy } from "../lib/types";

// 12 case studies fictifs mais réalistes. Les chiffres sont pédagogiques et simplifiés.
export const CASES: CaseStudy[] = [
  // ═══ BEGINNER ═══
  {
    id: "cs1", title: "Valera Cosmetics — Du multiple au prix par action", level: "beginner", sector: "Consumer / Beauty", minutes: 30, xp: 80,
    disclaimer: "Cas fictif, chiffres pédagogiques simplifiés.",
    context: "Ton équipe pitch la vente de Valera Cosmetics, un fabricant français de soins capillaires premium détenu par son fondateur. Le MD veut une première fourchette de valorisation « back of the envelope » basée sur les multiples du secteur.",
    buyer: "Process envisagé : auction ciblant stratégiques (groupes de beauté) et fonds de PE consumer.",
    target: "Valera Cosmetics : 45 ans d'histoire, distribution en pharmacies et parfumeries, expansion e-commerce récente (18% des ventes).",
    financials: [
      { label: "CA 2025", value: "480 M€ (+7%)" },
      { label: "EBITDA 2025", value: "86 M€ (marge 17,9%)" },
      { label: "Dette financière", value: "95 M€" },
      { label: "Cash", value: "40 M€" },
      { label: "Multiples comps beauté", value: "EV/EBITDA : médiane 11,0x (fourchette 9,5x – 13,0x)" },
      { label: "Multiples transactions récentes", value: "EV/EBITDA : médiane 13,5x" },
    ],
    synergies: "Pour un stratégique : achats, logistique, déploiement international du réseau de l'acheteur.",
    risks: "Dépendance au fondateur (visage de la marque), concentration pharmacie, taille sous-critique à l'international.",
    questions: [
      { q: "Calcule la fourchette d'EV avec les trading comps (9,5x – 13,0x), puis l'EV à la médiane des transactions (13,5x).", hint: "EV = EBITDA × multiple. Fais les trois calculs.", modelAnswer: "Comps : 86 × 9,5 = 817 M€ ; 86 × 13,0 = 1 118 M€ (médiane 11,0x → 946 M€). Transactions : 86 × 13,5 = 1 161 M€. Les transactions donnent plus haut — logique : elles incluent la prime de contrôle et les synergies payées.", keywords: ["817|820", "1118|1 118|1120", "946|950", "1161|1 161|1160", "prime de contrôle|synergies"], points: 25 },
      { q: "Déduis la fourchette d'equity value correspondante.", hint: "Dette nette = 95 − 40 = 55.", modelAnswer: "Dette nette = 55 M€. Equity value : comps 762 – 1 063 M€ (médiane ~891 M€) ; transactions ~1 106 M€. C'est la fourchette qu'on montrerait au fondateur, en expliquant l'écart comps/transactions.", keywords: ["55", "762|760", "1063|1 063|1060", "891|890", "1106|1 106|1100"], points: 25 },
      { q: "Le fondateur demande : « Pourquoi votre fourchette basse est-elle 30% sous ce que mon concurrent a obtenu l'an dernier ? » Réponds comme en meeting.", hint: "Pense : contexte de marché, profil de la cible vendue, compétition du process, synergies spécifiques.", modelAnswer: "Trois facteurs : (1) le multiple payé pour votre concurrent reflétait un process très compétitif avec des synergies spécifiques pour l'acheteur ; (2) les conditions de financement ont évolué depuis ; (3) la fourchette basse correspond aux multiples boursiers SANS prime de contrôle — dans un process compétitif, nous viserions le haut de fourchette, voire au-delà si un stratégique a un angle fort. La fourchette n'est pas une prédiction : c'est un point de départ de négociation.", keywords: ["compéti|process", "synergie", "financement|taux|marché", "prime de contrôle", "fourchette"], points: 30 },
      { q: "Quels 2 arguments mettrais-tu en avant dans le teaser pour maximiser la tension du process ?", modelAnswer: "1) Marque premium à forte fidélité avec croissance e-commerce démontrée (18% des ventes en 3 ans) — un actif rare dans un marché qui consolide. 2) Plateforme d'expansion internationale sous-exploitée : distribution quasi exclusivement française → potentiel évident pour un acheteur disposant d'un réseau mondial. (Bonus : rareté — les cibles beauté indépendantes de cette taille se comptent sur une main.)", keywords: ["marque|premium|fidélité", "international|expansion|réseau", "rare|consolid|e-commerce"], points: 20 },
    ],
  },
  {
    id: "cs2", title: "Nordwind Software — EV, Equity et la surprise du cash", level: "beginner", sector: "Tech / Software", minutes: 25, xp: 80,
    disclaimer: "Cas fictif, chiffres pédagogiques simplifiés.",
    context: "Un client corporate envisage d'acquérir Nordwind Software, un éditeur de logiciels de gestion coté à Stockholm. Ton associate te demande de préparer les chiffres clés pour le comité d'investissement de demain.",
    buyer: "Ton client : groupe industriel cherchant à digitaliser son offre de services.",
    target: "Nordwind Software : éditeur B2B, 2 800 clients, revenus 65% récurrents (maintenance + SaaS en migration).",
    financials: [
      { label: "Cours de bourse", value: "88 SEK" },
      { label: "Actions diluées", value: "45 M" },
      { label: "Dette financière", value: "150 M SEK" },
      { label: "Cash", value: "1 250 M SEK" },
      { label: "EBITDA 2025", value: "310 M SEK" },
      { label: "Prime envisagée", value: "30%" },
    ],
    questions: [
      { q: "Calcule market cap, dette nette et EV au cours actuel. Que remarques-tu ?", hint: "Le cash dépasse largement la dette…", modelAnswer: "Market cap = 88 × 45 = 3 960 M SEK. Dette nette = 150 − 1 250 = −1 100 (NÉGATIVE). EV = 3 960 − 1 100 = 2 860 M SEK. Remarque clé : l'EV est INFÉRIEURE à la market cap — le marché paie 3 960 pour l'equity mais les opérations ne « coûtent » que 2 860, le reste étant du cash accumulé.", keywords: ["3960|3 960", "-1100|−1 100|négative", "2860|2 860", "inférieure|inférieur|moins"], points: 30 },
      { q: "Quel est l'EV/EBITDA au cours actuel, puis au prix d'offre avec 30% de prime ?", hint: "La prime s'applique à l'equity value, pas à l'EV.", modelAnswer: "Actuel : 2 860 / 310 ≈ 9,2x. Avec prime : equity offerte = 3 960 × 1,30 = 5 148 ; EV implicite = 5 148 − 1 100 = 4 048 → 4 048 / 310 ≈ 13,1x. Le multiple bondit de 9,2x à 13,1x : sur les cibles riches en cash, la prime « coûte » proportionnellement plus cher en multiple d'EV.", keywords: ["9,2|9.2", "5148|5 148|5150", "4048|4 048|4050", "13,1|13.1|13"], points: 40 },
      { q: "Le comité demande : « Le cash de la cible peut-il financer une partie du deal ? » Réponds avec nuance.", modelAnswer: "Oui, économiquement : post-acquisition, le cash de la cible (1 250) appartient à l'acheteur et peut rembourser une partie de la dette d'acquisition — c'est exactement pourquoi on raisonne en EV. Nuances : le cash n'est accessible qu'APRÈS le closing (il faut financer 100% du prix d'abord), une partie peut être opérationnellement nécessaire ou piégée dans des filiales étrangères (fiscalité de rapatriement), et le SPA peut prévoir des mécanismes d'ajustement dessus.", keywords: ["après|closing|d'abord", "opérationnel|nécessaire|piégé|trapped", "ev|dette d'acquisition|rembours"], points: 30 },
    ],
  },
  {
    id: "cs3", title: "Bistrot Groupe — Lire les 3 états comme un analyste", level: "beginner", sector: "Consumer / Restauration", minutes: 30, xp: 80,
    disclaimer: "Cas fictif, chiffres pédagogiques simplifiés.",
    context: "Bistrot Groupe (chaîne de restauration décontractée, 85 restaurants) est à vendre. Avant le kick-off, ton analyste senior teste ta lecture des états financiers : « Trois questions, réponds comme si le VP te les posait. »",
    buyer: "Process early-stage : identification des acheteurs en cours.",
    target: "Bistrot Groupe : 85 restaurants en propre, croissance par ouvertures (6-8/an), ticket moyen 28 €.",
    financials: [
      { label: "CA 2025", value: "240 M€ (+9%, dont +2% like-for-like)" },
      { label: "EBITDA", value: "31 M€" },
      { label: "D&A", value: "18 M€" },
      { label: "Capex", value: "26 M€ (dont 19 d'ouvertures)" },
      { label: "Net income", value: "6 M€" },
      { label: "Dette nette", value: "88 M€" },
    ],
    questions: [
      { q: "L'EBITDA est de 31 M€ mais le FCF est quasi nul. Explique où passe le cash.", hint: "EBITDA − capex − intérêts − impôts ≈ ?", modelAnswer: "EBITDA 31 − capex 26 = 5 M€ avant intérêts et impôts : le cash part dans les ouvertures. Ajoute les frais financiers (dette nette 88 M€) et l'impôt → FCF ≈ 0. C'est l'exemple type du piège EBITDA : le business « gagne » 31 mais ne génère presque rien tant qu'il ouvre des restaurants. La vraie question : quel est le FCF en régime de croisière (capex de maintenance seulement, ~7 M€) ?", keywords: ["capex|ouvertures|26", "intérêts|impôt", "maintenance|croisière|mature", "5"], points: 35 },
      { q: "La croissance est de +9% mais le like-for-like de +2% seulement. Pourquoi cette distinction est-elle cruciale pour un acheteur ?", modelAnswer: "+9% vient à 7 points des OUVERTURES (croissance achetée à coups de capex) et à 2 points seulement des restaurants existants. Un acheteur paie pour la croissance FUTURE : si le LFL est faible, la croissance s'arrête dès qu'on arrête d'investir — et chaque ouverture peut cannibaliser le parc. Le LFL de 2% (≈ l'inflation) suggère des volumes flat : c'est LA question de due diligence commerciale.", keywords: ["ouvertures|7 points", "like-for-like|lfl|existant", "cannibali|capex", "volume|inflation"], points: 35 },
      { q: "Quel(s) type(s) d'acheteur(s) ce profil attire-t-il, et à quelles conditions ?", modelAnswer: "PE : oui SI le FCF de croisière est démontrable (levier possible sur les cash flows matures) et si le pipeline d'ouvertures offre un angle de création de valeur — mais le levier sera limité par l'intensité capex. Stratégique (autre groupe de restauration) : synergies d'achats et de siège, mais le LFL faible limite l'appétit. Dans les deux cas, le prix se jouera sur la crédibilité du passage en « mode cash » : c'est l'histoire que le CIM devra raconter.", keywords: ["pe|fonds", "stratégique", "fcf|cash|croisière", "levier|synergies"], points: 30 },
    ],
  },

  // ═══ INTERMEDIATE ═══
  {
    id: "cs4", title: "Helios Med — DCF sous pression", level: "intermediate", sector: "Healthcare / Medtech", minutes: 45, xp: 120,
    disclaimer: "Cas fictif, chiffres pédagogiques simplifiés.",
    context: "Le VP prépare une fairness opinion sur l'offre reçue par Helios Med (dispositifs médicaux). Un fonds propose 1 450 M€ d'EV. Ton job : le DCF de contrôle, puis le verdict.",
    buyer: "Offre reçue d'un fonds de PE healthcare (all-cash, financement sécurisé).",
    target: "Helios Med : n°2 européen des dispositifs de perfusion, 60% de revenus récurrents (consommables).",
    financials: [
      { label: "UFCF prévisionnel (M€)", value: "An 1 : 70 · An 2 : 77 · An 3 : 84 · An 4 : 90 · An 5 : 95" },
      { label: "WACC", value: "8,5%" },
      { label: "Croissance terminale", value: "2,0%" },
      { label: "Dette nette", value: "310 M€" },
      { label: "Offre reçue (EV)", value: "1 450 M€" },
    ],
    questions: [
      { q: "Calcule l'EV par DCF (arrondis les facteurs d'actualisation à 3 décimales).", hint: "Facteurs : 0,922 ; 0,849 ; 0,783 ; 0,722 ; 0,665. TV = 95 × 1,02 / 0,065.", modelAnswer: "PV des flux : 70×0,922=64,5 ; 77×0,849=65,4 ; 84×0,783=65,8 ; 90×0,722=65,0 ; 95×0,665=63,2 → somme ≈ 324 M€. TV = 96,9 / 0,065 = 1 491 M€ ; actualisée = 1 491 × 0,665 ≈ 991 M€. EV ≈ 324 + 991 = 1 315 M€ (TV ≈ 75% de l'EV).", keywords: ["324|323|325", "1491|1 491|1490", "991|990", "1315|1 315|1310|1320"], points: 35 },
      { q: "L'offre de 1 450 M€ est-elle attractive vs ton DCF ? Quelle est ta sensibilité avant de répondre ?", hint: "Teste WACC 8% et 9%, g 1,5% et 2,5%. L'offre est-elle dans la fourchette haute ?", modelAnswer: "L'offre (1 450) est ~10% AU-DESSUS du DCF central (1 315). Sensibilité : à WACC 8%/g 2,5% le DCF monte vers ~1 550 ; à WACC 9%/g 1,5% il descend vers ~1 150. L'offre se situe donc dans la moitié haute de la fourchette DCF — cohérente avec une prime de contrôle. Verdict préliminaire : offre sérieuse et défendable financièrement ; le board peut néanmoins tester une surenchère via un process (ou un contact avec des stratégiques qui auraient des synergies).", keywords: ["au-dessus|10%|supérieur", "sensibilité|fourchette", "1150|1 150", "1550|1 550", "prime|process|stratégique"], points: 35 },
      { q: "Le fonds argue que « la TV représente 75% de votre valorisation, votre DCF est donc trop spéculatif ». Réponds techniquement.", modelAnswer: "Un poids de TV de 70-80% est mathématiquement NORMAL pour un DCF 5 ans sur un business en croissance — ce n'est pas un vice de méthode. Réponses techniques : (1) le g implicite de 2% est conservateur (≈ inflation) ; (2) le multiple implicite de la TV (TV/EBITDA terminal) ressort dans la fourchette basse des comps medtech — cross-check rassurant ; (3) allonger l'horizon à 10 ans réduit le poids de la TV sans changer matériellement l'EV. Le caractère récurrent des revenus (60% consommables) rend précisément les flux longs PLUS prévisibles que la moyenne.", keywords: ["normal|mathématique", "implicite|cross-check|multiple", "horizon|10 ans", "récurrent|consommables|prévisible"], points: 30 },
    ],
  },
  {
    id: "cs5", title: "TelcoNord / FiberOne — Synergies contre prime", level: "intermediate", sector: "Telecom / Infrastructure", minutes: 45, xp: 120,
    disclaimer: "Cas fictif, chiffres pédagogiques simplifiés.",
    context: "TelcoNord (opérateur télécom coté) étudie l'acquisition de FiberOne (opérateur d'infrastructure fibre B2B). Le board veut UNE réponse : la prime demandée est-elle payable ?",
    buyer: "TelcoNord : opérateur convergent, market cap 8 Md€, réseau national, cherche à sécuriser son backbone fibre.",
    target: "FiberOne : 42 000 km de fibre, contrats wholesale 10-15 ans indexés, EBITDA marge 48%.",
    financials: [
      { label: "FiberOne — EBITDA", value: "180 M€" },
      { label: "Cours actuel FiberOne (market cap)", value: "1 900 M€ · Dette nette : 700 M€" },
      { label: "Prime exigée par le board de FiberOne", value: "35% sur la market cap" },
      { label: "Synergies identifiées", value: "Coûts : 45 M€/an (run-rate An 3) · Coûts d'intégration : 90 M€ one-off" },
      { label: "Taux d'impôt", value: "25% · Multiple de capitalisation des synergies : 10x" },
    ],
    synergies: "Migration du trafic TelcoNord sur le réseau FiberOne (make-vs-buy), mutualisation des équipes réseau, achats.",
    risks: "Revue antitrust probable (position wholesale), clients wholesale concurrents de TelcoNord pouvant churner.",
    questions: [
      { q: "Chiffre : la prime payée vs la valeur créée par les synergies. Le deal passe-t-il le test ?", hint: "Prime = 35% × 1 900. Valeur des synergies ≈ 45 × (1−25%) × 10, moins les coûts d'intégration après impôt.", modelAnswer: "Prime = 0,35 × 1 900 = 665 M€. Valeur des synergies = 45 × 0,75 × 10 = 337,5 M€, moins intégration 90 × 0,75 = 67,5 → ≈ 270 M€ nets. Verdict : la prime (665) fait ~2,5x la valeur des synergies (270) → à ce prix, le deal TRANSFÈRE de la valeur aux actionnaires de FiberOne. Il faut soit négocier la prime vers 15-20%, soit documenter des synergies bien supérieures (make-vs-buy stratégique), soit accepter de payer pour un actif rare — mais en le disant explicitement au board.", keywords: ["665", "337|338|270", "transfère|détruit|2,5|2.5", "négocier|15|20"], points: 40 },
      { q: "Quels arguments NON financiers pourraient malgré tout justifier le deal ? Et leur contre-argument ?", modelAnswer: "(1) Sécurisation stratégique du backbone : ne pas dépendre d'un tiers pour l'infrastructure critique — contre : un contrat long terme sécurise sans payer de prime de contrôle. (2) Rareté de l'actif : 42 000 km non répliquables — contre : la rareté n'oblige pas à surpayer maintenant si aucun autre acheteur n'est en vue. (3) Défensif : empêcher un concurrent ou un fonds d'infra de le capter — contre : c'est le vrai argument, mais il faut le chiffrer (coût de l'alternative si un rival contrôle le réseau). Le board doit décider en connaissant le prix de chaque « assurance ».", keywords: ["sécuris|backbone|dépend", "rare|répliqu", "défensif|concurrent", "contrat|alternative"], points: 30 },
      { q: "L'antitrust exige la cession de 20% des contrats wholesale (EBITDA −25 M€). Recalcule l'équation rapidement : que devient ta reco ?", modelAnswer: "EBITDA post-remède : 180 − 25 = 155 M€. À multiple d'acquisition constant (EV = 1 900×1,35 + 700 = 3 265 → 18,1x l'EBITDA initial), le multiple effectif monte à 21x sur l'EBITDA résiduel — et le produit des cessions ne compensera qu'en partie. Les synergies baissent aussi (moins de trafic mutualisable). La reco se durcit : sans renégociation du prix intégrant le risque de remèdes (clause d'ajustement ou prix conditionnel), le deal ne passe pas le comité. Alternative : structurer avec un mécanisme de partage du risque réglementaire.", keywords: ["155", "21|21x|monte", "synergies baissent|moins", "renégoci|ajustement|conditionnel"], points: 30 },
    ],
  },
  {
    id: "cs6", title: "Corsair Luxury — Trading comps sous le feu des questions", level: "intermediate", sector: "Luxury", minutes: 40, xp: 120,
    disclaimer: "Cas fictif, chiffres pédagogiques simplifiés.",
    context: "Tu prépares les comps pour la valorisation de Corsair (maroquinerie de luxe familiale, en réflexion sur l'ouverture de son capital). L'associate a présélectionné 4 comparables — à toi de construire et défendre l'analyse.",
    buyer: "Réflexion capitalistique : minoritaire PE ou adossement à un groupe de luxe.",
    target: "Corsair : maroquinerie 100% made in Italy, 380 M€ de CA (+14%), marge EBITDA 24%, distribution 55% retail propre.",
    financials: [
      { label: "Comp A — Méga-groupe luxe diversifié", value: "EV/EBITDA 12,5x · croissance +9% · marge 32%" },
      { label: "Comp B — Maison mono-marque cotée", value: "EV/EBITDA 15,0x · croissance +15% · marge 26%" },
      { label: "Comp C — Marque premium accessible", value: "EV/EBITDA 8,5x · croissance +4% · marge 15%" },
      { label: "Comp D — Maison italienne comparable", value: "EV/EBITDA 14,0x · croissance +12% · marge 23%" },
      { label: "Corsair — EBITDA", value: "91 M€" },
    ],
    questions: [
      { q: "Quel(s) comparable(s) retiens-tu en cœur de set, lesquels écartes-tu/pondères-tu, et pourquoi ?", modelAnswer: "Cœur de set : B et D — mono-marques en croissance double-digit et marges ~25%, le vrai profil de Corsair. A : à pondérer (conglomérat diversifié, prime de taille et de liquidité, profil différent). C : à écarter ou garder en « sanity floor » (premium accessible ≠ luxe, croissance et marges sans rapport). Justification à donner : un set de comps se définit par le PROFIL (croissance, marge, positionnement), pas par l'étiquette sectorielle.", keywords: ["b et d|b, d", "écarte|pondér", "profil|croissance|marge", "conglomérat|taille"], points: 35 },
      { q: "Propose une fourchette de multiple pour Corsair et l'EV correspondante. Où la placerais-tu dans la fourchette B-D et pourquoi ?", hint: "B = 15x (croissance supérieure), D = 14x (jumeau). Corsair est non coté → discussion de décote.", modelAnswer: "Fourchette naturelle 13,5x – 15x. Corsair croît comme B (+14% vs +15%) avec la marge de D : cœur de fourchette 14x-14,5x justifié → EV ≈ 91 × 14 à 14,5 = 1 275 – 1 320 M€. Discussion à avoir : décote d'illiquidité (non coté, gouvernance familiale) de 10-15% pour une entrée MINORITAIRE → ~1 100-1 200 M€ ; mais dans un scénario de cession de CONTRÔLE à un groupe, la prime stratégique effacerait cette décote (les precedents luxe traitent au-dessus des comps).", keywords: ["14|14,5|13,5", "1275|1 275|1300|1320", "illiquidité|décote|minoritaire", "contrôle|prime|precedent"], points: 35 },
      { q: "Le patriarche demande : « Pourquoi Comp B vaut 15x et pas nous ? On fait la même chose. » Réponds sans le froisser.", modelAnswer: "« Vous partagez le métier et la désirabilité — c'est exactement pourquoi B ancre notre fourchette. Les 15x de B rémunèrent trois choses que la cotation apporte : liquidité quotidienne du titre, transparence financière certifiée, et gouvernance institutionnalisée. Ce ne sont pas des jugements sur la qualité de Corsair : ce sont des primes techniques. Et la bonne nouvelle : dans une cession de contrôle, ces écarts disparaissent — un acquéreur stratégique paierait votre maison sur sa qualité intrinsèque, souvent au-delà des multiples boursiers. »", keywords: ["liquidité", "transparence|gouvernance", "technique|pas.*qualité|prime", "contrôle|stratégique|au-delà"], points: 30 },
    ],
  },

  // ═══ ADVANCED ═══
  {
    id: "cs7", title: "Argos Industries / Mecatron — Accretion, dilution et vérité", level: "advanced", sector: "Industrials", minutes: 50, xp: 160,
    disclaimer: "Cas fictif, chiffres pédagogiques simplifiés.",
    context: "Argos Industries (équipementier coté) veut racheter Mecatron (automatismes industriels). Le CFO d'Argos veut l'analyse accretion/dilution complète sur les 3 structures de financement, ET ton avis sur la meilleure.",
    buyer: "Argos : market cap 6 000 M€, NI 350 M€, 150 M actions (EPS 2,33 €), P/E 17,1x, capacité d'endettement disponible.",
    target: "Mecatron : NI 85 M€, prix négocié 1 700 M€ (equity), soit P/E payé de 20x.",
    financials: [
      { label: "Option A", value: "100% cash disponible (rendement du cash placé : 3% avant impôt)" },
      { label: "Option B", value: "100% dette nouvelle à 5,5% avant impôt" },
      { label: "Option C", value: "100% actions (émises au cours actuel : 40 €)" },
      { label: "Taux d'impôt", value: "25%" },
      { label: "Synergies", value: "30 M€ avant impôt (run-rate), non incluses dans les calculs de base" },
    ],
    questions: [
      { q: "Calcule l'EPS pro forma et le % d'accretion/dilution pour les options A, B et C (sans synergies).", hint: "A : foregone interest = 1 700 × 3% × 0,75. B : intérêts = 1 700 × 5,5% × 0,75. C : nouvelles actions = 1 700 / 40 = 42,5 M.", modelAnswer: "A (cash) : foregone interest = 38,25 ; NI PF = 350 + 85 − 38,25 = 396,75 ; EPS = 396,75/150 = 2,645 → +13,4% accretif. B (dette) : intérêts après impôt = 70,1 ; NI PF = 364,9 ; EPS = 2,433 → +4,3% accretif. C (actions) : NI PF = 435 ; actions = 192,5 M ; EPS = 2,26 → −3,1% dilutif. Cohérent avec la théorie : coût du cash (2,25% après impôt) < dette (4,1%) < actions (~5,9% = inverse du P/E payé ajusté).", keywords: ["13|13,4|2,645|2.645", "4,3|4.3|2,43", "dilutif|-3|−3|2,26|2.26", "42,5|192,5"], points: 40 },
      { q: "Avec les synergies (30 M€ avant impôt), l'option C devient-elle accretive ?", modelAnswer: "Synergies après impôt = 22,5 M€. NI PF option C = 435 + 22,5 = 457,5 ; EPS = 457,5 / 192,5 = 2,377 → +2,0% accretif. Oui, les synergies retournent le signe. Mais attention au narratif : « accretif grâce aux synergies » signifie que les actionnaires d'Argos portent le risque d'exécution — si les synergies glissent de 12 mois ou sortent à 20 M€, on rebascule en dilution.", keywords: ["22,5|22.5", "457|2,377|2.377|2,38", "accretif|+2", "risque|exécution|glisse"], points: 30 },
      { q: "Le CFO tranche : « On prend l'option A, c'est la plus accretive, dossier clos. » Quels sont les DEUX angles morts de ce raisonnement ?", modelAnswer: "(1) L'accretion mesure le COÛT COMPTABLE du financement, pas la création de valeur : l'option A est mécaniquement la plus accretive parce que le cash rapporte peu — ça ne dit rien du prix payé (20x le NI de Mecatron : est-ce justifié vs standalone + synergies ?). Le vrai test : NPV des synergies (22,5 × ~10 = 225 M€) vs prime payée. (2) Le coût d'opportunité et la flexibilité : vider le cash prive Argos de sa capacité à saisir d'autres opportunités ou à absorber un choc — le « rendement » stratégique du cash dépasse ses 3% comptables. Une structure mixte cash/dette préservant un matelas serait probablement optimale.", keywords: ["création de valeur|prix payé|npv|prime", "opportunité|flexibilité|matelas|choc", "mixte"], points: 30 },
    ],
  },
  {
    id: "cs8", title: "Projet Vega — Sell-side pitch : défendre sa valorisation au MD", level: "advanced", sector: "SaaS / Tech", minutes: 50, xp: 160,
    disclaimer: "Cas fictif, chiffres pédagogiques simplifiés.",
    context: "Ta banque pitch le mandat de vente de Vega Analytics (SaaS d'analytique industrielle, actionnaire : fondateurs 60% + VC 40%). Le VC pousse pour une valorisation « ambitieuse ». Le MD te demande de préparer LA page de valorisation du pitch — et de savoir la défendre.",
    buyer: "Acheteurs pressentis : éditeurs industriels (Siemens-like), majors du software, fonds growth/buyout tech.",
    target: "Vega : ARR 95 M€ (+32%), NRR 118%, marge brute 82%, EBITDA −8 M€ (investissement S&M), churn logo 4%.",
    financials: [
      { label: "Comps SaaS cotés (croissance >25%)", value: "EV/ARR : médiane 8,5x (fourchette 6x – 12x)" },
      { label: "Precedent transactions SaaS B2B", value: "EV/ARR : médiane 10,5x (deals stratégiques récents)" },
      { label: "Rule of 40", value: "Vega : 32% + (−7%) = 25%" },
      { label: "Dernière levée (il y a 2 ans)", value: "Post-money 750 M€" },
    ],
    questions: [
      { q: "Propose une fourchette de valorisation argumentée. Comment traites-tu le fait que Vega rate la Rule of 40 ?", modelAnswer: "Base comps : Vega croît à +32% avec un NRR de 118% (top quartile) mais un score Rule of 40 de 25% (sous la barre) : positionnement légèrement au-dessus de la médiane sur la croissance, pénalisé sur la marge → 8x-9,5x l'ARR en lecture boursière = 760-900 M€. En process compétitif avec stratégiques (precedents à 10,5x et synergies produit), fourchette de pitch : 950 – 1 150 M€ (10x-12x). Traitement de la Rule of 40 : montrer le PONT vers la profitabilité — marge brute 82% et churn 4% prouvent que la perte est un CHOIX d'investissement S&M ; présenter les cohortes (CAC payback, LTV) pour démontrer que chaque euro de S&M crée de l'ARR rentable.", keywords: ["8|9,5|760|900", "10|10,5|950|1150|1 150", "pont|choix|s&m|cohorte", "nrr|118"], points: 40 },
      { q: "Le VC veut afficher 1,5 Md€ (« la dernière licorne comparable est sortie à 15x l'ARR »). Que lui réponds-tu en pré-pitch ?", modelAnswer: "Trois points, fermes mais constructifs : (1) le deal à 15x concernait un actif à Rule of 40 > 40 et NRR > 130 dans un cycle de valorisation plus haut — le comparable flatte mais ne tient pas en due diligence ; (2) afficher 1,5 Md€ décrédibilise le process : les acheteurs sérieux passent leur tour, et on négocie ensuite CONTRE notre propre teaser ; (3) la bonne stratégie pour dépasser 1,2 Md€ n'est pas l'affichage mais la TENSION : dual track (stratégiques + sponsors), narratif de rareté, et jalons de profitabilité démontrés pendant le process. Un pricing crédible avec compétition bat un pricing agressif sans acheteurs.", keywords: ["cycle|comparable|due diligence", "décrédibilise|passent leur tour", "tension|dual track|compétition", "crédible"], points: 30 },
      { q: "Un stratégique offre 1 050 M€ cash ; un fonds growth offre 1 150 M€ mais avec 40% en earn-out sur l'ARR à 2 ans. Que recommandes-tu aux fondateurs ?", modelAnswer: "Comparer en VALEUR AJUSTÉE DU RISQUE : l'offre du fonds = 690 M€ fermes + 460 M€ conditionnels. Si la probabilité d'atteindre les cibles d'ARR est de ~60-70% (à auditer : les cibles sont-elles dans le plan ou au-dessus ?), la valeur espérée ≈ 690 + 0,65×460 ≈ 990 M€ < 1 050 fermes. S'y ajoutent : le risque de gouvernance de l'earn-out (qui contrôle les décisions qui font l'ARR ?), et l'usage : le stratégique offre en plus la certitude d'exécution. Reco : privilégier l'offre cash à 1 050, en utilisant l'offre à 1 150 « facialement supérieure » comme levier de négociation pour pousser le stratégique vers 1 100. C'est exactement le travail de la banque.", keywords: ["690|460", "espérée|probabilité|990", "gouvernance|contrôle", "levier|négociation|1100|1 100"], points: 30 },
    ],
  },
  {
    id: "cs9", title: "Fortuna Retail — Le LBO qui ne passe pas (ou si ?)", level: "advanced", sector: "Consumer / Retail", minutes: 50, xp: 160,
    disclaimer: "Cas fictif, chiffres pédagogiques simplifiés.",
    context: "Un fonds mid-cap étudie le take-private de Fortuna Retail (équipement de la maison, coté, délaissé par le marché). Le partner te demande de « faire tourner le paper LBO et de me dire si on creuse ou si on passe ».",
    buyer: "Fonds PE mid-cap, IRR cible 20%, période de détention 5 ans.",
    target: "Fortuna : 120 magasins + site e-commerce (28% des ventes), marque connue, croissance molle mais cash flows réguliers.",
    financials: [
      { label: "EBITDA", value: "95 M€ (stable)" },
      { label: "Prix d'entrée envisagé", value: "7,5x EBITDA (prime de 30% sur le cours) = EV 712 M€" },
      { label: "Financement", value: "Dette 4,0x EBITDA (380 M€) à 7% · Equity : le solde (332 M€)" },
      { label: "FCF disponible pour la dette", value: "~45 M€/an (après capex, NWC, intérêts, impôts)" },
      { label: "Hypothèse de sortie", value: "5 ans, EBITDA 100 M€ (croissance minime), multiple de sortie 7,5x" },
    ],
    questions: [
      { q: "Déroule le paper LBO. Quel MOIC/IRR à ces hypothèses ? On creuse ou on passe ?", hint: "Dette sortie = 380 − 5×45 = 155. EV sortie = 750.", modelAnswer: "Dette remboursée : 5 × 45 = 225 → dette sortie = 155 M€. EV sortie = 100 × 7,5 = 750. Equity sortie = 750 − 155 = 595 M€. MOIC = 595/332 = 1,79x ; IRR ≈ 1,79^(1/5) − 1 ≈ 12,4%. Verdict : NETTEMENT sous les 20% cibles — à ces hypothèses, on passe. Quasi toute la création de valeur vient du debt paydown (l'EBITDA ne bouge pas, le multiple non plus) : 12% pour du risque retail, le rapport rendement/risque est mauvais.", keywords: ["155", "595", "1,79|1.79|1,8", "12|12,4", "passe|insuffisant"], points: 40 },
      { q: "Le partner insiste : « Trouve-moi les 3 leviers qui rendraient le deal faisable — et dis-moi lesquels sont crédibles. »", modelAnswer: "(1) Prix d'entrée : à 6,5x (EV 617, equity 237), le même scénario donne MOIC 2,5x / IRR ~20% → le levier le PLUS crédible : Fortuna est délaissée, une négociation ferme peut aboutir ; c'est mécanique et contrôlable. (2) Création d'EBITDA : plan opérationnel (mix e-commerce, achats, fermeture des 15 magasins sous-performants) portant l'EBITDA à 115-120 — crédible si le fonds a un operating partner retail, à valider en due diligence. (3) Multiple de sortie supérieur (8,5x si le repositionnement e-commerce transforme l'equity story) — le levier le MOINS crédible : parier sur l'expansion de multiple dans le retail physique est de l'espoir, pas un plan. Reco : creuser uniquement si (1) et (2) se combinent : offre ≤ 6,75x ET plan opérationnel documenté.", keywords: ["6,5|6.5|prix", "2,5|2.5|20", "ebitda|opérationnel|115|120|fermeture", "multiple de sortie|espoir|moins crédible"], points: 35 },
      { q: "Quels risques spécifiques au retail physique le comité d'investissement soulèvera-t-il, et comment structurer pour les mitiger ?", modelAnswer: "Risques : (1) baux — engagements fixes longs (dette-like) qui rigidifient la structure de coûts : auditer le mur d'échéances des baux, négocier des clauses de sortie ; (2) cyclicité de la consommation discrétionnaire : le levier 4x sur un EBITDA cyclique peut devenir 6x en bas de cycle — stress-tester le covenant headroom à EBITDA −20% ; (3) disruption e-commerce/trafic : le FCF de 45 M€ suppose des ventes stables. Structuration : levier réduit (3,5x), tranche de capex dédiée à la transformation digitale, covenants avec headroom ≥ 35%, et prix d'entrée qui rémunère le risque. Dans le retail, la marge de sécurité EST la thèse.", keywords: ["baux|lease", "cyclique|stress|covenant", "e-commerce|trafic|digital", "headroom|3,5|marge de sécurité"], points: 25 },
    ],
  },

  // ═══ PROFESSIONAL ═══
  {
    id: "cs10", title: "Projet Athena — Buyer recommendation : à qui vendre ?", level: "professional", sector: "Fintech / Paiements", minutes: 60, xp: 200,
    disclaimer: "Cas fictif, chiffres pédagogiques simplifiés.",
    context: "Tu conseilles le board d'Athena Payments (processeur de paiements B2B, actionnariat : fondateur 35%, deux fonds 45%, management 20%) sur le choix final entre trois offres fermes. Le board se réunit dans 48h. Le MD te demande le mémo de recommandation — l'exercice le plus complet du métier.",
    buyer: "Trois offres fermes reçues (détails ci-dessous).",
    target: "Athena : TPV 40 Md€ (+22%), CA 420 M€ (take rate net 1,05%), EBITDA 130 M€ (+18%), leadership France/Benelux.",
    financials: [
      { label: "Offre 1 — GlobalPay (stratégique US coté)", value: "EV 3 250 M€ (25x EBITDA) · 65% cash / 35% titres GlobalPay · closing estimé 12-15 mois (antitrust UE + CFIUS-like)" },
      { label: "Offre 2 — Fonds Meridian Capital (buyout)", value: "EV 2 950 M€ (22,7x) · 100% cash · financement committed · closing 4-5 mois · management package attractif + rollover demandé 25%" },
      { label: "Offre 3 — EuroPay (stratégique européen)", value: "EV 3 100 M€ (23,8x) · 100% titres EuroPay (parité fixe) · synergies annoncées 120 M€ · closing 8-10 mois" },
      { label: "Contexte marché", value: "Multiples paiements en compression depuis 18 mois ; EuroPay a perdu 25% en bourse sur l'année" },
    ],
    questions: [
      { q: "Construis la grille d'analyse : valeur nominale vs valeur ajustée (risque de closing, nature de la contrepartie, horizon). Quelle offre gagne sur chaque dimension ?", modelAnswer: "VALEUR NOMINALE : GlobalPay 3 250 > EuroPay 3 100 > Meridian 2 950 (écart max ~10%). VALEUR AJUSTÉE : (1) GlobalPay — 35% en titres US (risque de change + cours) et 12-15 mois de risque réglementaire réel (remèdes possibles) : probabiliser le closing à ~80-85% et decoter la composante titres → valeur ajustée ≈ 3 000-3 100 ; (2) Meridian — 100% cash committed, closing quasi certain à 4-5 mois : valeur ajustée ≈ nominale 2 950, la plus CERTAINE ; (3) EuroPay — 100% titres à parité FIXE d'un acheteur en baisse de 25% sur un an : les actionnaires d'Athena portent le risque de cours pendant 8-10 mois SANS collar → la plus risquée ; les 120 M€ de synergies ne profitent aux vendeurs que s'ils gardent les titres. Sur le risque ajusté : Meridian ≈ GlobalPay > EuroPay.", keywords: ["nominale|3250|3 250", "80|85|probabilis|remède", "committed|certaine|2950|2 950", "parité fixe|collar|risque de cours"], points: 40 },
      { q: "Les intérêts des actionnaires divergent : le fondateur (35%) veut la transmission de son œuvre, les fonds (45%) veulent liquider, le management (20%) veut son avenir. Comment ta recommandation gère-t-elle ce conflit ?", modelAnswer: "Cartographie : les FONDS privilégient la certitude et la rapidité → Meridian (cash, 4 mois) ou GlobalPay ; le FONDATEUR est sensible au projet industriel → EuroPay (champion européen) ou GlobalPay (plateforme mondiale) plutôt qu'un LBO ; le MANAGEMENT préfère Meridian (package + rollover = 2e création de valeur) ou la croissance dans un groupe. La recommandation doit être UNIQUE mais documenter les trade-offs par catégorie, proposer des aménagements qui réconcilient : demander à Meridian un rôle de gouvernance pour le fondateur (board seat, engagement de projet industriel) ; demander à GlobalPay d'augmenter la part cash. Le processus (fiduciary duty du board) impose de maximiser la valeur pour TOUS les actionnaires — le mémo doit le rappeler et éviter que le conflit ne fuite dans la négociation.", keywords: ["fonds|certitude|liquid", "fondateur|industriel|transmission", "management|rollover|package", "board|fiduciaire|aménagement"], points: 30 },
      { q: "Rédige la recommandation finale du mémo (5-8 lignes, comme au board).", modelAnswer: "« Recommandation : engager une négociation finale parallèle avec Meridian et GlobalPay, avec l'objectif de signer avec Meridian sous 3 semaines si deux conditions sont obtenues : relèvement de l'offre à ≥ 3 050 M€ (justifié par la compétition documentée) et engagements de gouvernance (siège au board pour le fondateur, plan d'investissement 3 ans). L'offre GlobalPay, facialement supérieure, est maintenue en tension comme alternative crédible — sa valeur ajustée du risque réglementaire et de la composante titres est comparable, ce qui constitue notre levier de négociation. L'offre EuroPay est écartée : une parité fixe en titres d'un acheteur en repli de 25%, sans collar, fait porter aux actionnaires un risque de marché que ni la prime affichée ni les synergies annoncées ne rémunèrent. Ce séquencement maximise la valeur certaine tout en préservant la tension compétitive jusqu'à la signature. »", keywords: ["meridian|négociation finale|parallèle", "3050|3 050|relèvement", "tension|levier|alternative", "écartée|collar|risque"], points: 30 },
    ],
  },
  {
    id: "cs11", title: "Projet Ariane — Mini investment memo complet", level: "professional", sector: "Infrastructure / Data Centers", minutes: 75, xp: 200,
    disclaimer: "Cas fictif, chiffres pédagogiques simplifiés.",
    context: "Tu es au fonds infra cette fois (buy-side). Le partner te donne 75 minutes : « Mémo d'investissement 1 page sur DataCore : thèse, valo, risques, reco. Comité demain 8h. » C'est l'exercice final type d'un process de recrutement PE/infra — et un excellent entraînement M&A.",
    buyer: "Ton fonds : infrastructure value-add, tickets 300-800 M€, IRR cible 13-15% (profil infra).",
    target: "DataCore : opérateur de 6 data centers en France/Belgique, 48 MW installés, extension de 30 MW autorisée (permis obtenus).",
    financials: [
      { label: "CA", value: "180 M€ · 85% contrats ≥ 5 ans, clients IG (hyperscalers 40%, entreprises 45%, secteur public 15%)" },
      { label: "EBITDA", value: "88 M€ (marge 49%) · croissance +11%/an (prix + remplissage)" },
      { label: "Extension 30 MW", value: "Capex 240 M€ sur 3 ans · EBITDA incrémental à maturité : 55 M€ · pré-commercialisation : 40% déjà signés" },
      { label: "Prix demandé", value: "EV 1 550 M€ (17,6x EBITDA en place)" },
      { label: "Financement disponible", value: "Dette infra 6,0x EBITDA à 5,25% · comps cotés data centers : 18-22x" },
    ],
    questions: [
      { q: "Rédige la THÈSE d'investissement en 3 points (avec les chiffres qui la portent).", modelAnswer: "1. INFRASTRUCTURE CRITIQUE CONTRACTÉE : 85% de revenus sous contrats ≥ 5 ans avec contreparties investment grade → cash flows de qualité infra qui supportent 6x de levier, dans un marché (données, IA) en croissance structurelle à double chiffre. 2. CROISSANCE SÉCURISÉE ET FINANÇABLE : l'extension de 30 MW (permis obtenus, 40% pré-commercialisée) offre 55 M€ d'EBITDA incrémental à un coût implicite de 4,4x (240/55) — créer de la capacité à 4,4x pour la détenir dans un actif valorisé 17-20x est le cœur de la création de valeur. 3. POINT D'ENTRÉE RELATIF : 17,6x l'EBITDA en place se compare au bas de la fourchette des comps (18-22x) SANS donner de crédit à l'extension — l'optionalité de croissance est payée zéro ou presque.", keywords: ["85|contract|ig|investment grade", "4,4|4.4|240|55", "17,6|17.6|bas de la fourchette|optionalité"], points: 35 },
      { q: "Valorise : que vaut DataCore en réalité si l'extension délivre ? Structure un prix/une contre-offre.", modelAnswer: "EBITDA pro forma à maturité (an 4-5) : 88 × 1,11³ ≈ 120 (organique) + 55 (extension) ≈ 175 M€. À 18x (bas des comps, prudent) : EV future ≈ 3 150 M€ — contre 1 550 demandés + 240 de capex à financer. Même en actualisant et en probabilisant l'extension à 75%, la création de valeur est massive : le prix demandé est attractif SI l'exécution suit. Contre-offre structurée : 1 450-1 500 M€ ferme + earn-out de 50-75 M€ indexé sur la mise en service de l'extension dans les délais — on paie la promesse quand elle se réalise. Le levier de négociation : le capex de 240 M€ reste à porter par l'acheteur.", keywords: ["175|120|55", "3150|3 150|3000", "earn-out|conditionnel|mise en service", "1450|1 450|1500"], points: 35 },
      { q: "Les 3 risques majeurs et leur mitigation — puis ta reco finale en 2 lignes.", modelAnswer: "RISQUES : (1) Concentration hyperscalers (40% du CA) : le départ d'un seul client ferait dérailler le plan — mitigation : auditer les échéances, négocier des extensions AVANT closing, diversifier via l'extension. (2) Énergie : prix de l'électricité et exigences ESG (PUE, approvisionnement décarboné) — mitigation : PPAs long terme, clauses de pass-through dans les contrats clients (à vérifier en DD). (3) Exécution du capex : 240 M€ sur 3 ans, inflation de construction et délais de raccordement — mitigation : contrats EPC à prix plafonné, pénalités fournisseurs, tranche de contingence 10%. RECO : GO en exclusivité à 1 475 M€ + earn-out, sous réserve de DD confirmant les pass-through énergie et le carnet de pré-commercialisation. Le couple rendement/risque (IRR modélisé ~16-18% vs cible 13-15%) offre une marge de sécurité rare sur ce segment.", keywords: ["hyperscaler|concentration|40", "énergie|ppa|pass-through", "epc|capex|contingence", "go|exclusivité|16|17|18"], points: 30 },
    ],
  },
  {
    id: "cs12", title: "Full Interview Case — 60 minutes chrono chez BancoInvest", level: "professional", sector: "Multi-secteur", minutes: 60, xp: 200,
    disclaimer: "Simulation du case study final d'un process de recrutement M&A. Chiffres pédagogiques.",
    context: "Dernier tour d'entretien. L'associate te tend une feuille : « Notre client, Vulcan Materials (matériaux de construction, coté), a reçu une approche non sollicitée de Titan Group à 5,2 Md€ d'EV. Vous avez les chiffres. Je reviens dans 40 minutes : dites-moi si le board doit accepter, négocier ou refuser. » Puis il sort.",
    buyer: "Titan Group : concurrent paneuropéen, 2x la taille de Vulcan, offre indicative 100% cash, « sous réserve de due diligence ».",
    target: "Vulcan Materials : granulats et béton, positions n°1-2 régionales, exposition rénovation 55% / neuf 45%.",
    financials: [
      { label: "Vulcan — chiffres clés", value: "CA 2 800 M€ · EBITDA 520 M€ (marge 18,6%, point haut de cycle ?) · dette nette 900 M€ · market cap pré-offre 3 400 M€" },
      { label: "Offre Titan", value: "EV 5 200 M€ → equity 4 300 M€ = prime de 26% · 10,0x EBITDA courant" },
      { label: "Comps matériaux", value: "EV/EBITDA : 7,5x – 9,0x (médiane 8,2x)" },
      { label: "Precedents secteur (5 ans)", value: "8,5x – 11x (médiane 9,6x) · les deals à 11x incluaient des synergies massives" },
      { label: "Consensus analystes", value: "EBITDA 2026e : 480 M€ (normalisation attendue du cycle)" },
      { label: "Synergies estimées Titan-Vulcan", value: "80-100 M€/an (recouvrement géographique fort) — non confirmées" },
    ],
    questions: [
      { q: "Première lecture : l'offre est-elle attractive ? Analyse le multiple sous TOUS les angles (spot, forward, cycle, precedents, synergies).", modelAnswer: "SPOT : 10,0x l'EBITDA courant = au-dessus des comps (8,2x médiane) et de la médiane des precedents (9,6x) → facialement généreux. FORWARD : sur l'EBITDA 2026e normalisé (480), l'offre ressort à 10,8x → encore plus généreuse si on croit à la normalisation — ou, lecture inverse, Titan paie le point haut en le sachant. CYCLE : la marge de 18,6% est au sommet historique ; capitaliser un pic est le piège classique — l'offre à 10x du pic vaut ~11x du mid-cycle. SYNERGIES : 80-100 M€ capitalisés à ~9x = 720-900 M€ de valeur ; la prime demandée (900 M€) capte donc la QUASI-TOTALITÉ des synergies — inhabituel et révélateur : Titan a besoin de ce deal (consolidation défensive). CONCLUSION de lecture : offre sérieuse, au-dessus du standalone, mais qui valorise mal l'option de faire mieux — base de négociation, pas de signature.", keywords: ["10|10,8|forward", "pic|cycle|sommet|normalis", "720|900|synergies|capte", "négociation"], points: 40 },
      { q: "Quelles alternatives le board doit-il considérer avant de répondre, et quel est le risque de chacune ?", modelAnswer: "(1) REFUS SEC et plan standalone : défendable (l'offre capte les synergies) mais risquée si le cycle se retourne — le cours pourrait revenir 20% sous l'offre et les actionnaires demanderont des comptes. (2) NÉGOCIATION BILATÉRALE avec Titan : viser 5,6-5,8 Md€ (partage 50/50 des synergies) + protections (break-up fee élevée, certitude de financement, engagement antitrust « hell or high water ») — le risque : rester seul face à un acheteur unique = levier limité. (3) MARKET CHECK / process élargi : solliciter discrètement 2-3 contreparties (autre stratégique, fonds infra pour les granulats ?) pour créer la tension — risques : fuites, déstabilisation des équipes, et Titan peut retirer son offre. (4) DÉFENSES alternatives : distribution exceptionnelle, cession d'actifs — généralement inférieures à une vente au bon prix. Reco process : réponse « le prix ne reflète pas la valeur », market check ciblé sous NDA, et négociation parallèle avec Titan.", keywords: ["refus|standalone|retourne", "5,6|5.6|5,8|partage|break-up|hell or high water", "market check|tension|fuite", "parallèle"], points: 30 },
      { q: "L'associate revient : « Verdict en 60 secondes, comme si j'étais le CEO de Vulcan. » Donne ta réponse orale (écris-la telle que tu la dirais).", modelAnswer: "« Monsieur le Président, notre lecture : l'offre de Titan est sérieuse mais opportuniste. À 10x un EBITDA de haut de cycle, elle paraît généreuse — en réalité, la prime de 26% capte l'essentiel des synergies que VOTRE actif rend possibles : le recouvrement géographique vaut 700 à 900 M€ pour Titan. Notre recommandation en trois temps : premièrement, répondre que l'offre ne reflète pas la valeur stratégique de Vulcan, sans fermer la porte ; deuxièmement, conduire un market check ciblé sous NDA — deux contreparties crédibles suffisent à changer le rapport de force ; troisièmement, négocier avec Titan un prix au-delà de 5,6 milliards avec des protections de closing solides. Vous n'avez qu'une seule occasion de vendre cette entreprise : le prix doit rémunérer vos actionnaires, pas financer la consolidation de votre concurrent. Nous sommes prêts à exécuter dès demain. »", keywords: ["opportuniste|capte|synergies", "market check|nda|rapport de force", "5,6|5.6|protections", "actionnaires"], points: 30 },
    ],
  },
];

import { REAL_DEALS } from "./realdeals";

export const ALL_CASES: CaseStudy[] = [...CASES, ...REAL_DEALS];
export const caseById = Object.fromEntries(ALL_CASES.map((c) => [c.id, c]));
