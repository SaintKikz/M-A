import type { Module, MicroLesson, BossFight, PlanWeek } from "../lib/types";

// ─── Micro-leçons (No Theory Mode : challenge d'abord, explication après) ───
const L = (
  id: string, moduleId: string, title: string, minutes: number,
  steps: MicroLesson["steps"], flashcardIds: string[]
): MicroLesson => ({ id, moduleId, title, minutes, xp: 30, steps, flashcardIds });

export const LESSONS: MicroLesson[] = [
  // Module 1 — IB Foundations
  L("l1", "m1", "La carte du monde de la banque d'affaires", 10, [
    { type: "challenge", quizId: "fd2" },
    { type: "challenge", quizId: "fd1" },
    { type: "explain", title: "La banque en 30 secondes", body: "Une banque d'affaires CONSEILLE (elle n'investit pas son argent) : M&A (acheter/vendre des entreprises), ECM (lever des actions), DCM (lever de la dette), LevFin (financer les LBO). Sell-side = on conseille le vendeur ; buy-side = l'acheteur. Le PE, lui, investit l'argent de ses clients : c'est un principal, pas un agent." },
    { type: "practice", quizId: "fd5" },
    { type: "interview", question: "Quelle est la différence entre M&A et Private Equity ?", modelAnswer: "La banque M&A conseille des transactions et vit de commissions ; le fonds de PE investit du capital et vit de la performance de ses participations. L'un exécute des deals pour les autres, l'autre en fait pour son propre compte.", keywords: ["conseil|agent|fees|commission", "investit|principal|capital", "performance|carried|participation"] },
  ], ["f-pr9"]),
  L("l2", "m1", "La vie d'un deal (et la tienne, en stage)", 12, [
    { type: "challenge", quizId: "fd3" },
    { type: "challenge", quizId: "mp1" },
    { type: "explain", title: "Le film d'un process sell-side", body: "Pitch → mandat → teaser (anonyme) → NDA → CIM → process letter → offres indicatives (IOI) → due diligence + management presentations → offres fermes → SPA → signing → closing. Toi, stagiaire : tu produis les profils, les comps, les pages de CIM, et tu tiens les trackers. Chaque document a un rôle précis — les connaître te fait passer pour un initié en entretien." },
    { type: "practice", quizId: "fd4" },
    { type: "interview", question: "Que fait concrètement un analyste M&A sur un deal ?", modelAnswer: "Il produit le matériel du process : valorisations (comps, DCF), documents marketing (teaser, CIM, management presentation), profils d'acheteurs, réponses aux Q&A de due diligence et suivi du process. La négociation appartient aux seniors — la fiabilité d'exécution, c'est le junior.", keywords: ["comps|valorisation|dcf", "cim|teaser|profil|slides", "process|q&a|tracker", "fiab|exécution"] },
  ], ["f-pr1", "f-pr2"]),

  // Module 2 — Accounting
  L("l3", "m2", "Les 3 états financiers — le grand oral", 12, [
    { type: "challenge", quizId: "ac1" },
    { type: "challenge", quizId: "ac2" },
    { type: "explain", title: "Trois angles, un seul film", body: "IS = la performance sur une période. Bilan = la photo (Actif = Passif + Equity, TOUJOURS). CFS = le cash réel en 3 sections. Les liens : net income → 1ère ligne du CFS et retained earnings ; cash final du CFS → bilan ; D&A relie IS et PP&E. C'est LA question d'ouverture de 80% des entretiens." },
    { type: "practice", quizId: "ac14" },
    { type: "practice", quizId: "ac21" },
    { type: "interview", question: "Walk me through the three financial statements. (45 sec)", modelAnswer: "The income statement shows profitability over a period. The balance sheet is a snapshot where assets equal liabilities plus equity. The cash flow statement reconciles net income to cash across operations, investing and financing. Net income links all three: it opens the CFS and feeds retained earnings, while ending cash ties to the balance sheet.", keywords: ["income|period", "balance|snapshot|assets", "cash flow|operations|investing|financing", "net income|link|retained"] },
  ], ["f-st1", "f-st2"]),
  L("l4", "m2", "D&A : la charge fantôme qui crée du cash", 12, [
    { type: "challenge", quizId: "ac4" },
    { type: "explain", title: "Le mécanisme en une phrase", body: "La D&A réduit le profit SANS sortie de cash — et comme elle réduit l'impôt (qui, lui, est du cash), une hausse de D&A AUGMENTE le cash. D&A +10, impôt 25% : NI −7,5, cash +2,5. Réflexe : dérouler IS → CFS → bilan, et conclure « le bilan balance »." },
    { type: "practice", quizId: "ac11" },
    { type: "practice", quizId: "ac9" },
    { type: "interview", question: "Pourquoi amortit-on un actif au lieu de le passer en charge immédiatement ?", modelAnswer: "Principe de rattachement : la charge doit suivre les revenus qu'elle génère. Une machine sert 10 ans — son coût s'étale sur 10 ans. Passer 100 en charge l'année 1 écraserait artificiellement le résultat, puis le gonflerait ensuite.", keywords: ["rattachement|matching", "revenus|durée|vie utile", "étale|lisse"] },
  ], ["f-ac3", "f-ac10"]),
  L("l5", "m2", "NWC : là où le cash se cache", 12, [
    { type: "challenge", quizId: "ac5" },
    { type: "challenge", quizId: "ac6" },
    { type: "explain", title: "La règle des sens", body: "Actif circulant ↑ (créances, stocks) = cash ↓ : tu as vendu ou produit sans encaisser. Passif circulant ↑ (fournisseurs) = cash ↑ : tu paies plus tard. Une entreprise en croissance consomme du cash via son NWC — c'est invisible dans le P&L et ça tue les startups rentables « sur le papier »." },
    { type: "practice", quizId: "ac12" },
    { type: "practice", quizId: "ac17" },
    { type: "interview", question: "Une hausse des créances clients de 20 : impact sur les 3 états ?", modelAnswer: "IS : rien de nouveau (le revenu était déjà reconnu à la vente). CFS : la hausse d'AR est déduite dans operations → cash −20. Bilan : AR +20, cash −20 côté actif — ça balance tout seul. L'entreprise a « prêté » 20 à ses clients.", keywords: ["rien|déjà reconnu", "-20|moins 20|déduit", "ar|créances|balance"] },
  ], ["f-ac4", "f-st6"]),
  L("l6", "m2", "Deferred revenue, goodwill & les pièges favoris", 14, [
    { type: "challenge", quizId: "ac7" },
    { type: "challenge", quizId: "ac8" },
    { type: "explain", title: "Deux passifs mal compris", body: "Deferred revenue : du cash encaissé pour un service PAS ENCORE rendu → passif qui se déverse en revenue au fil du temps (modèle SaaS). Goodwill : l'excédent payé sur la fair value des actifs identifiables lors d'une acquisition — jamais créé organiquement, jamais amorti, testé en impairment. Les deux sont des aimants à questions pièges." },
    { type: "practice", quizId: "ac18" },
    { type: "practice", quizId: "ac16" },
    { type: "interview", question: "Un client paie 120 d'avance pour 12 mois : déroule les écritures au paiement puis après 1 mois.", modelAnswer: "Paiement : cash +120, deferred revenue +120 (passif) — AUCUN revenu. Après 1 mois : revenue +10, deferred revenue −10. Le P&L reconnaît le service rendu, pas le cash reçu : c'est le cœur de la comptabilité d'engagement.", keywords: ["120|passif|deferred", "aucun revenu|pas de revenu", "10", "engagement|rendu"] },
  ], ["f-ac5", "f-ac6"]),
  L("l7", "m2", "Boss training : les scénarios enchaînés", 15, [
    { type: "challenge", quizId: "ac22" },
    { type: "challenge", quizId: "ac3" },
    { type: "practice", quizId: "ac13" },
    { type: "practice", quizId: "ac19" },
    { type: "explain", title: "La méthode des walk-through", body: "Toujours le même ordre : (1) IS — la charge/produit et l'effet d'impôt ; (2) CFS — partir du NI, réintégrer le non-cash, capter le NWC ; (3) Bilan — vérifier que ça balance des deux côtés. Annonce le taux d'impôt, déroule calmement, conclus par « the balance sheet balances ». 45 secondes chrono." },
    { type: "practice", quizId: "ac15" },
    { type: "interview", question: "Is EBITDA a good proxy for free cash flow?", modelAnswer: "No — it's a starting point, not a proxy. EBITDA ignores capex, working capital needs, interest and taxes. A capex-heavy business can show strong EBITDA and burn cash. FCF = EBITDA minus all of those; the gap between the two is exactly where the analysis happens.", keywords: ["no|non", "capex", "working capital|nwc", "interest|taxes|impôt", "burn|gap"] },
  ], ["f-ac11", "f-st8"]),

  // Module 3 — Corp finance
  L("l8", "m3", "Time value, NPV, IRR : les fondations", 12, [
    { type: "challenge", quizId: "cf1" },
    { type: "challenge", quizId: "cf2" },
    { type: "explain", title: "Tout vient d'une idée", body: "Un euro aujourd'hui vaut plus qu'un euro demain (il peut être investi). Actualiser = traduire les euros futurs en euros d'aujourd'hui. NPV > 0 = le projet rapporte plus que le coût du capital ⟺ IRR > taux d'actualisation. TOUTE la finance (DCF, LBO, obligations) est une variation de cette idée." },
    { type: "practice", quizId: "dc8" },
    { type: "interview", question: "Pourquoi actualise-t-on les flux futurs ?", modelAnswer: "Parce qu'un euro futur vaut moins qu'un euro présent : coût d'opportunité (il aurait pu être investi), inflation et risque. Le taux d'actualisation rémunère ces trois éléments — plus le flux est risqué, plus on l'actualise fort.", keywords: ["opportunité|investi", "inflation", "risque", "taux"] },
  ], ["f-dc1"]),
  L("l9", "m3", "WACC & CAPM : le prix du risque", 14, [
    { type: "challenge", quizId: "cf7" },
    { type: "challenge", quizId: "cf4" },
    { type: "explain", title: "Le coût du capital, déconstruit", body: "WACC = E/V × Ke + D/V × Kd × (1−t), aux valeurs de MARCHÉ. Ke vient du CAPM : Rf + β × ERP. La dette coûte moins cher (prioritaire + tax shield), l'equity plus cher (résiduelle). Le beta des comparables se délève puis se relève pour neutraliser leurs structures de capital." },
    { type: "practice", quizId: "cf3" },
    { type: "practice", quizId: "cf6" },
    { type: "practice", quizId: "cf5" },
    { type: "interview", question: "Pourquoi l'equity coûte-t-elle plus cher que la dette ?", modelAnswer: "Les actionnaires sont payés en dernier : plus de risque → plus de rendement exigé. La dette est contractuelle, prioritaire et fiscalement déductible ; l'equity est résiduelle et sans garantie. C'est la hiérarchie de la structure de capital.", keywords: ["dernier|résiduel", "risque|rendement exigé", "prioritaire|contractuel", "déductible|tax shield"] },
  ], ["f-dc3", "f-dc4"]),

  // Module 4 — Valuation / EV
  L("l10", "m4", "EV vs Equity Value : le bridge dans les deux sens", 14, [
    { type: "challenge", quizId: "va1" },
    { type: "challenge", quizId: "va2" },
    { type: "explain", title: "La maison et le crédit", body: "Une maison de 500 k€ avec 300 k€ de crédit : la maison = EV, ton apport = equity value. EV = equity + dette nette + minoritaires + preferred. On soustrait le cash (l'acheteur le récupère + cohérence avec les flux opérationnels). Sache traverser le bridge DANS LES DEUX SENS, vite." },
    { type: "practice", quizId: "va3" },
    { type: "practice", quizId: "va11" },
    { type: "practice", quizId: "va14" },
    { type: "interview", question: "Pourquoi ajoute-t-on les minoritaires dans l'EV ?", modelAnswer: "Cohérence de périmètre : l'EBITDA consolidé inclut 100% des filiales contrôlées, même détenues à 80%. Pour comparer l'EV à cet EBITDA, l'EV doit couvrir 100% du périmètre — donc inclure la part des minoritaires.", keywords: ["100%|consolid", "ebitda", "cohéren|périmètre|même"] },
  ], ["f-va1", "f-va3", "f-va4"]),
  L("l11", "m4", "Multiples : le langage du marché", 14, [
    { type: "challenge", quizId: "va5" },
    { type: "challenge", quizId: "va13" },
    { type: "explain", title: "Un multiple = un DCF compressé", body: "Un multiple capitalise un flux : il monte avec la croissance et baisse avec le risque. Règle d'or de cohérence : numérateur et dénominateur doivent servir les mêmes investisseurs — EV avec les métriques avant intérêts (revenue, EBITDA), equity avec les métriques après (net income → P/E). EV/net income = éliminatoire." },
    { type: "practice", quizId: "va9" },
    { type: "practice", quizId: "va12" },
    { type: "interview", question: "Pourquoi deux entreprises du même secteur traitent-elles à des multiples différents ?", modelAnswer: "Parce qu'un multiple encapsule croissance et risque : croissance attendue supérieure, marges meilleures, revenus plus récurrents, moins de risque → multiple plus élevé. S'y ajoutent la liquidité du titre et la gouvernance. Le multiple suit les fondamentaux.", keywords: ["croissance", "risque", "marge|récurrent", "liquidité|gouvernance"] },
  ], ["f-va5", "f-cp2"]),
  L("l12", "m4", "Les 3 méthodes et le football field", 12, [
    { type: "challenge", quizId: "va6" },
    { type: "challenge", quizId: "va7" },
    { type: "explain", title: "Trianguler, toujours", body: "Comps = marché, minoritaire, pas de prime. Precedents = prix de contrôle payés (prime 20-40% + synergies) → souvent les plus hauts. DCF = intrinsèque, hypersensible aux hypothèses. LBO = plancher du sponsor. Aucune méthode n'a « raison » : on triangule dans un football field et on recommande une fourchette." },
    { type: "practice", quizId: "va10" },
    { type: "practice", quizId: "va8" },
    { type: "interview", question: "Quelle méthode donne la valorisation la plus élevée et pourquoi ?", modelAnswer: "En général les precedent transactions : elles incorporent la prime de contrôle et les synergies payées par les acquéreurs. Mais un DCF avec des hypothèses agressives peut dépasser — d'où l'importance de challenger les inputs plutôt que de classer mécaniquement.", keywords: ["precedent|transaction", "prime|contrôle", "synergies", "dcf|hypothèses"] },
  ], ["f-va6", "f-va11"]),

  // Module 5 — DCF
  L("l13", "m5", "Construis ton premier DCF (UFCF → EV)", 15, [
    { type: "challenge", quizId: "dc1" },
    { type: "challenge", quizId: "dc3" },
    { type: "explain", title: "La chaîne de production du DCF", body: "Revenue → EBIT → NOPAT = EBIT×(1−t) → UFCF = NOPAT + D&A − capex − ΔNWC. L'UFCF ignore les intérêts (il sert TOUS les investisseurs) → on l'actualise au WACC → EV. La dette arrive après, dans le bridge. Cohérence flux/taux : unlevered↔WACC, levered↔Ke. Ne les croise jamais." },
    { type: "practice", quizId: "dc12" },
    { type: "practice", quizId: "dc2" },
    { type: "practice", quizId: "dc11" },
    { type: "interview", question: "Pourquoi utilise-t-on l'UFCF et pas le levered FCF dans un DCF standard ?", modelAnswer: "L'UFCF est indépendant de la structure de capital : il mesure la performance des opérations pour tous les investisseurs et s'actualise au WACC pour donner l'EV. Le levered FCF donnerait l'equity value via le cost of equity — faisable, mais fragile dès que la structure de capital bouge.", keywords: ["structure de capital|indépendant", "tous les investisseurs", "wacc|ev", "levered|cost of equity"] },
  ], ["f-dc2", "f-dc7"]),
  L("l14", "m5", "Terminal value : là où tout se joue", 14, [
    { type: "challenge", quizId: "dc4" },
    { type: "challenge", quizId: "dc5" },
    { type: "explain", title: "60-80% de la valeur, une formule", body: "TV = FCFn×(1+g)/(WACC−g), avec g ≤ 2-3% (au-delà, l'entreprise dépasserait l'économie). Alternative : exit multiple (EBITDA × multiple), à cross-checker avec le g implicite. La TV pèse 60-80% de l'EV : normal mathématiquement, mais ça impose des sensibilités WACC × g systématiques. Et : la TV s'ACTUALISE aussi — l'oubli classique." },
    { type: "practice", quizId: "dc10" },
    { type: "practice", quizId: "dc6" },
    { type: "practice", quizId: "dc9" },
    { type: "interview", question: "Ton DCF sort une TV à 75% de l'EV. Problème ?", modelAnswer: "Pas en soi — c'est mathématiquement attendu avec 5 ans de flux explicites face à une perpétuité. Mais ça impose de la rigueur : sensibilités WACC × g, vérification du multiple implicite de la TV vs comps, et éventuellement un horizon explicite plus long pour réduire le poids terminal.", keywords: ["normal|attendu|mathématique", "sensibilit", "implicite|cross|comps", "horizon"] },
  ], ["f-dc5", "f-dc6", "f-dc8"]),

  // Module 6-7 — Comps & precedents
  L("l15", "m6", "Comps : construire un set défendable", 14, [
    { type: "challenge", quizId: "cp1" },
    { type: "challenge", quizId: "cp4" },
    { type: "explain", title: "L'art derrière la mécanique", body: "1) Sélection par PROFIL (business model, croissance, marges) plus que par étiquette sectorielle. 2) Nettoyage : one-offs sortis, calendarization, dilution. 3) Médiane plutôt que moyenne (robuste aux outliers). 4) Jugement final : où la cible MÉRITE-t-elle de se situer dans la fourchette, et pourquoi. C'est le « pourquoi » qui fait l'analyste." },
    { type: "practice", quizId: "cp3" },
    { type: "practice", quizId: "cp2" },
    { type: "interview", question: "Comment choisis-tu les comparables ?", modelAnswer: "Par similarité de profil : secteur et business model d'abord, puis croissance, marges, taille et géographie. L'objectif est un groupe au profil risque/croissance proche — je préfère 6 vrais comparables à 15 approximatifs, et je documente pourquoi chacun est dans le set.", keywords: ["business model|secteur", "croissance", "marge", "profil|risque"] },
  ], ["f-cp1", "f-cp5"]),
  L("l16", "m7", "Precedents : la prime de contrôle décodée", 12, [
    { type: "challenge", quizId: "pt1" },
    { type: "challenge", quizId: "pt3" },
    { type: "explain", title: "Des prix, pas des cours", body: "Les precedents mesurent des prix de CONTRÔLE réellement payés : prime (20-40%) + synergies + contexte compétitif. Limites à toujours citer : peu de deals comparables, cycle de marché différent (les multiples 2021 ≠ 2026), informations incomplètes. Un multiple de transaction se cite TOUJOURS avec sa date et son contexte." },
    { type: "practice", quizId: "pt2" },
    { type: "interview", question: "Pourquoi les multiples de transactions dépassent-ils les multiples boursiers ?", modelAnswer: "Parce qu'ils incluent la prime de contrôle — le droit de changer la stratégie et de capturer les synergies — que l'acquéreur paie au-dessus du cours. S'y ajoute souvent la tension d'un process compétitif. Les comps boursiers, eux, mesurent une valeur minoritaire instantanée.", keywords: ["prime de contrôle", "synergies", "compétiti|process", "minoritaire"] },
  ], ["f-pt1", "f-pt2"]),

  // Module 8-9 — M&A process, rationale
  L("l17", "m8", "Le process M&A : du teaser au closing", 14, [
    { type: "challenge", quizId: "mp2" },
    { type: "challenge", quizId: "mp3" },
    { type: "explain", title: "Chronologie et documents", body: "Auction large (prix max, mais long et fuites) vs bilatéral (rapide, discret). Documents dans l'ordre : teaser → NDA → CIM → process letter → IOI → data room/MP → offres fermes → SPA. Entre signing et closing : antitrust et conditions suspensives. Mécanismes de prix : locked box (figé) vs completion accounts (ajusté)." },
    { type: "practice", quizId: "mp4" },
    { type: "practice", quizId: "mp5" },
    { type: "practice", quizId: "mp6" },
    { type: "interview", question: "Pourquoi choisir une négociation bilatérale plutôt qu'un auction ?", modelAnswer: "Pour la confidentialité (pas de fuite vers clients/concurrents/équipes), la rapidité et la simplicité — au prix d'une tension concurrentielle moindre, donc potentiellement d'un prix inférieur. Pertinent quand un acheteur naturel évident existe ou que la discrétion prime.", keywords: ["confidential|fuite", "rapide|simple", "tension|prix", "acheteur naturel"] },
  ], ["f-pr5", "f-pr6"]),
  L("l18", "m9", "Synergies & rationale : pourquoi les deals existent", 12, [
    { type: "challenge", quizId: "sy1" },
    { type: "challenge", quizId: "sy2" },
    { type: "explain", title: "Le test fondamental", body: "Synergies de coûts (doublons, achats) : contrôlables, créditées. Synergies de revenus (cross-sell) : incertaines, discountées. LE test d'un deal : valeur actualisée des synergies nettes > prime payée. La prime est un chèque certain ; les synergies, une promesse. Un rationale sans mécanisme concret est du storytelling." },
    { type: "practice", quizId: "sy3" },
    { type: "interview", question: "Comment jugerais-tu si une prime de 30% est justifiée ?", modelAnswer: "Je compare la prime en valeur absolue à la valeur actualisée des synergies nettes des coûts d'intégration : si les synergies couvrent la prime avec une marge, l'acheteur crée de la valeur ; sinon il la transfère aux actionnaires de la cible. Ensuite je vérifie le multiple payé vs comps/precedents pour le contexte.", keywords: ["synergies|actualisée", "prime|couvre", "transfère|cible", "multiple|contexte"] },
  ], ["f-pr8", "f-ad6"]),

  // Module 10 — Accretion/dilution
  L("l19", "m10", "Accretion/Dilution : la mécanique et la nuance", 15, [
    { type: "challenge", quizId: "ad1" },
    { type: "challenge", quizId: "ad3" },
    { type: "explain", title: "Les règles rapides", body: "All-stock : accretif si P/E acquéreur > P/E payé. Cash/dette : accretif si earnings yield de la cible (NI/prix) > coût du financement après impôt. Hiérarchie des coûts : cash < dette < actions. Ajustements pro forma : synergies après impôt, intérêts nouveaux, foregone interest, amortissement des intangibles PPA. Et LA nuance : accretif ≠ bon deal." },
    { type: "practice", quizId: "ad2" },
    { type: "practice", quizId: "ad5" },
    { type: "practice", quizId: "ad8" },
    { type: "interview", question: "What makes a deal dilutive?", modelAnswer: "A deal dilutes EPS when the earnings acquired don't cover the cost of financing them: paying a higher P/E than your own in stock, debt whose after-tax cost exceeds the target's earnings yield, or heavy intangible amortization from purchase accounting. Synergies can flip the sign — which is why headline accretion should never be confused with value creation.", keywords: ["p/e|earnings yield", "cost|coût|financing", "amortization|ppa|intangible", "synerg", "value|valeur"] },
  ], ["f-ad2", "f-ad3", "f-ad6"]),

  // Module 13 — Capital Markets
  L("l21", "m13", "Dette, taux et le moteur du M&A", 14, [
    { type: "challenge", quizId: "cm2" },
    { type: "challenge", quizId: "cm3" },
    { type: "explain", title: "Le financement, carburant des deals", body: "Séniorité : senior secured → unsecured → mezz → equity (rendement croissant en descendant). Frontière IG/HY : BBB− / BB+. Les LBO se financent en TLB (flottant, prepayable) + high yield (fixe, non-call). Et LA mécanique à maîtriser : taux ↑ → dette plus chère → prix de LBO ↓, WACC ↑ → valorisations ↓ → volumes M&A ↓. C'est le lien macro→deals qu'on teste en entretien." },
    { type: "practice", quizId: "cm1" },
    { type: "practice", quizId: "cm6" },
    { type: "practice", quizId: "cm5" },
    { type: "interview", question: "How do rising interest rates affect M&A activity? (60-90 sec)", modelAnswer: "Three channels. First, financing: acquisition debt gets more expensive, so sponsors can't pay the same multiples — LBO math compresses prices. Second, valuation: higher rates raise the WACC, so DCF values fall, and equity markets de-rate, weakening stock as an acquisition currency. Third, the bid-ask spread: sellers anchor on yesterday's valuations while buyers price today's cost of capital, so processes stall until expectations converge. That's why M&A volumes typically drop sharply when rates rise fast, then recover once rates stabilize — certainty matters more than the level itself.", keywords: ["financing|dette|debt|expensive|multiple", "wacc|dcf|valuation|de-rate", "bid-ask|spread|seller|stall|écart", "stabili|certainty|volume"] },
  ], ["f-cm2", "f-cm6", "f-cm1"]),

  // Module 14 — Industry
  L("l22", "m14", "Le framework sectoriel : décoder n'importe quelle industrie", 15, [
    { type: "challenge", quizId: "in3" },
    { type: "challenge", quizId: "in1" },
    { type: "explain", title: "La grille universelle (à dérouler en 30 secondes)", body: "Face à n'importe quel secteur : 1) Business model — qui paie quoi à qui, récurrent ou ponctuel ? 2) Drivers de demande — structurels ou cycliques ? 3) Intensité capitalistique — conversion EBITDA→FCF ? 4) Structure concurrentielle — consolidé ou fragmenté, barrières ? 5) Régulation. 6) Comment ça se valorise — et POURQUOI ce multiple-là (banques : P/TBV car la dette est l'outil de production ; SaaS : EV/ARR car la croissance est en opex ; REITs : P/FFO car la D&A immobilière ment). Avec cette grille + 2 deals récents du secteur, tu tiens 10 minutes d'entretien sectoriel." },
    { type: "practice", quizId: "in5" },
    { type: "practice", quizId: "in8" },
    { type: "practice", quizId: "in12" },
    { type: "practice", quizId: "in6" },
    { type: "interview", question: "Tu passes en entretien dans une équipe FIG demain. Explique pourquoi on ne valorise pas une banque avec un DCF classique — et ce qu'on utilise à la place.", modelAnswer: "Pour une banque, la dette n'est pas du financement : c'est la matière première du business — elle emprunte (dépôts) pour prêter, et la marge d'intérêt EST le revenu. Impossible donc de séparer flux opérationnels et flux de financement : ni EV, ni EBITDA, ni UFCF n'ont de sens. On valorise l'equity directement : Dividend Discount Model sous contrainte de capital réglementaire (CET1), P/E, et surtout P/TBV lu contre le ROE — une banque qui gagne son coût du capital traite autour de 1x sa book tangible, au-dessus si ROE > Ke, en dessous sinon.", keywords: ["matière première|outil de production|dépôts|prêter", "séparer|ev|ebitda|ufcf|sens", "ddm|dividend|p/e|p/tbv", "roe|cet1|book"] },
  ], ["f-in3", "f-in1", "f-in6"]),

  // Module 12 — LBO
  L("l20", "m12", "LBO : l'intuition puis le paper LBO", 15, [
    { type: "challenge", quizId: "lb1" },
    { type: "challenge", quizId: "lb3" },
    { type: "explain", title: "L'immeuble locatif, version corporate", body: "Apport (equity) + gros crédit (dette), les loyers (FCF) remboursent, la plus-value revient au sponsor. 3 leviers : debt paydown, croissance d'EBITDA, expansion de multiple. Cible idéale : FCF stables, peu de capex. Repères IRR/MOIC : 2x/5 ans ≈ 15%, 2x/3 ans ≈ 26%, 3x/5 ans ≈ 25%. Paper LBO : entrée → projection → désendettement → sortie → returns." },
    { type: "practice", quizId: "lb7" },
    { type: "practice", quizId: "lb5" },
    { type: "practice", quizId: "lb8" },
    { type: "interview", question: "Walk me through a paper LBO in 2 minutes.", modelAnswer: "Entry: EBITDA times multiple gives EV; say 100 at 8x = 800, funded 60/40 debt-equity, so 480 debt, 320 equity. Project EBITDA growth and free cash flow; cumulative FCF pays down debt — say 200 over five years, leaving 280. Exit at the same 8x on year-5 EBITDA of 130 = 1,040. Equity = 1,040 minus 280 = 760. MOIC = 760/320 ≈ 2.4x, roughly 19% IRR. Then I'd sensitize entry multiple and growth.", keywords: ["entry|entrée|multiple", "debt|dette|equity", "fcf|paydown|rembours", "exit|sortie", "moic|irr"] },
  ], ["f-lb1", "f-lb3", "f-lb6"]),
];

// ─── Modules du Learning Path ────────────────────────────────────────────────
export const MODULES: Module[] = [
  { id: "m1", order: 1, title: "Investment Banking Foundations", emoji: "🏛️", topic: "foundations", week: 1, description: "Le rôle d'une banque d'affaires, les divisions, la vie d'un deal — et la tienne en stage.", lessonIds: ["l1", "l2"] },
  { id: "m2", order: 2, title: "Accounting & 3 Financial Statements", emoji: "📒", topic: "accounting", week: 1, description: "Les 3 états, leurs liens, D&A, NWC, goodwill — le socle de tout entretien technique.", lessonIds: ["l3", "l4", "l5", "l6", "l7"], bossId: "boss-acct" },
  { id: "m3", order: 3, title: "Corporate Finance Basics", emoji: "🧮", topic: "corp-finance", week: 2, description: "Time value, NPV, IRR, WACC, CAPM, beta — le prix du temps et du risque.", lessonIds: ["l8", "l9"] },
  { id: "m4", order: 4, title: "Valuation : EV, Equity & Multiples", emoji: "⚖️", topic: "valuation", week: 3, description: "Le bridge EV↔Equity dans les deux sens, les multiples cohérents, les 3 méthodes.", lessonIds: ["l10", "l11", "l12"], bossId: "boss-val" },
  { id: "m5", order: 5, title: "DCF", emoji: "📉", topic: "dcf", week: 3, description: "De l'UFCF à la terminal value : construire et défendre un DCF.", lessonIds: ["l13", "l14"], bossId: "boss-dcf" },
  { id: "m6", order: 6, title: "Trading Comparables", emoji: "📊", topic: "comps", week: 4, description: "Sélection des pairs, nettoyage, médiane — et le jugement qui fait la différence.", lessonIds: ["l15"] },
  { id: "m7", order: 7, title: "Precedent Transactions", emoji: "🗂️", topic: "precedents", week: 4, description: "Prime de contrôle, contexte de cycle, limites : des prix réels, pas des cours.", lessonIds: ["l16"] },
  { id: "m8", order: 8, title: "M&A Process", emoji: "🤝", topic: "mna-process", week: 5, description: "Du teaser au closing : documents, acteurs, mécanismes de prix.", lessonIds: ["l17"], bossId: "boss-mna" },
  { id: "m9", order: 9, title: "Deal Rationale & Synergies", emoji: "🎯", topic: "mna-process", week: 5, description: "Pourquoi les deals existent — et le test synergies vs prime.", lessonIds: ["l18"] },
  { id: "m10", order: 10, title: "Accretion / Dilution", emoji: "➗", topic: "accretion-dilution", week: 5, description: "EPS pro forma, règles rapides, purchase accounting — et la nuance qui fait les bons candidats.", lessonIds: ["l19"], bossId: "boss-ad" },
  { id: "m11", order: 11, title: "Merger Model Basics", emoji: "🧩", topic: "accretion-dilution", week: 5, description: "Sources & uses, goodwill, pro forma : la mécanique complète — via missions et cases.", lessonIds: [] },
  { id: "m12", order: 12, title: "LBO Basics", emoji: "🏗️", topic: "lbo", week: 6, description: "L'intuition, les 3 leviers, le paper LBO de tête, IRR et MOIC.", lessonIds: ["l20"], bossId: "boss-lbo" },
  { id: "m13", order: 13, title: "Capital Markets Basics", emoji: "🏦", topic: "capital-markets", week: 6, description: "Dette, high yield, IPO, convertibles — et l'impact des taux sur le M&A.", lessonIds: ["l21"] },
  { id: "m14", order: 14, title: "Industry-Specific Prep", emoji: "🏭", topic: "industry", week: 6, description: "TMT, SaaS, FIG, Healthcare, Luxe, Infra… : le framework et les KPIs de chaque secteur.", lessonIds: ["l22"] },
  { id: "m15", order: 15, title: "Behavioral & Fit", emoji: "🎤", topic: "behavioral", week: 7, description: "Ton histoire, tes preuves, la méthode STAR — et l'art de ne pas bullshiter.", lessonIds: [], bossId: "boss-behav" },
  { id: "m16", order: 16, title: "Deal Awareness", emoji: "📰", topic: "deal-awareness", week: 7, description: "Suivre, analyser et raconter des deals : ton mémo d'entretien.", lessonIds: [] },
  { id: "m17", order: 17, title: "Full Mock Interviews", emoji: "🏆", topic: "behavioral", week: 8, description: "Les simulations complètes de l'Interview Arena, du screening RH au final round MD.", lessonIds: [] },
];

// ─── Boss Fights ────────────────────────────────────────────────────────────
export const BOSSES: BossFight[] = [
  {
    id: "boss-acct", moduleId: "m2", title: "Boss Fight : Accounting", emoji: "🐉", timeLimitMin: 12, passScore: 75, xp: 100,
    quizIds: ["ac2", "ac4", "ac5", "ac8", "ac11", "ac13", "ac15", "ac19", "ac22", "ac16"],
    writtenQuestion: { q: "D&A +10 (impôt 30%) : déroule les 3 états, de tête, comme en entretien.", modelAnswer: "IS : EBIT −10, impôt −3, net income −7. CFS : NI −7, +10 de D&A non-cash → cash +3. Bilan : PP&E −10, cash +3 → actif −7 ; retained earnings −7 → ça balance.", keywords: ["-7|−7", "+3|plus 3", "non-cash|réintégr", "balance"] },
    badge: "Accounting Slayer",
  },
  {
    id: "boss-val", moduleId: "m4", title: "Boss Fight : Valuation", emoji: "⚔️", timeLimitMin: 12, passScore: 75, xp: 100,
    quizIds: ["va1", "va3", "va4", "va5", "va7", "va8", "va11", "va13", "va14", "cp4"],
    writtenQuestion: { q: "Un client te demande pourquoi ta fourchette compsest sous le prix qu'il espère. Réponds en 4 phrases.", modelAnswer: "Les comps donnent une valeur de marché SANS prime de contrôle : c'est un plancher de négociation, pas une prédiction. Les precedents et la tension d'un process compétitif ajoutent 20-40%. Notre stratégie vise le haut de fourchette en créant cette tension. La fourchette sert à négocier, pas à limiter.", keywords: ["prime de contrôle", "precedent|process|tension", "plancher|départ|négoci", "fourchette"] },
    badge: "Valuation Warrior",
  },
  {
    id: "boss-dcf", moduleId: "m5", title: "Boss Fight : DCF", emoji: "🔥", timeLimitMin: 12, passScore: 75, xp: 100,
    quizIds: ["dc1", "dc2", "dc4", "dc5", "dc6", "dc9", "dc11", "dc12", "cf7", "cf5"],
    writtenQuestion: { q: "Walk me through a DCF — écris ta réponse exactement comme tu la dirais (60-90 sec).", modelAnswer: "I project unlevered free cash flow for five to ten years — EBIT after tax plus D&A minus capex minus the change in working capital. I estimate terminal value with Gordon Growth at 2-3% or an exit multiple, cross-checking one against the other. I discount everything at the WACC to get enterprise value, bridge to equity value by subtracting net debt and minorities, divide by diluted shares, and run sensitivities on WACC and growth.", keywords: ["unlevered|ufcf|ebit", "terminal|gordon|exit", "wacc|discount|actualis", "bridge|net debt|equity", "sensitiv"] },
    badge: "DCF Master",
  },
  {
    id: "boss-mna", moduleId: "m8", title: "Boss Fight : M&A Process", emoji: "🛡️", timeLimitMin: 12, passScore: 75, xp: 100,
    quizIds: ["fd3", "mp1", "mp2", "mp3", "mp4", "mp5", "mp6", "sy1", "sy2", "sy3"],
    writtenQuestion: { q: "Déroule un process sell-side de bout en bout, avec le rôle de l'analyste à chaque étape.", modelAnswer: "Pitch (l'analyste : valorisation, profils), mandat, préparation (teaser, CIM, modèle), marketing (NDA, contacts), premier tour (IOI — l'analyste tient les trackers), deuxième tour (data room, management presentations, Q&A), offres fermes, négociation SPA, signing, conditions suspensives (antitrust), closing. L'analyste produit et fiabilise chaque document du process.", keywords: ["teaser|cim", "nda", "ioi|indicative", "data room|due diligence|management", "spa|signing|closing"] },
    badge: "Process Commander",
  },
  {
    id: "boss-ad", moduleId: "m10", title: "Boss Fight : Accretion/Dilution", emoji: "💥", timeLimitMin: 12, passScore: 75, xp: 100,
    quizIds: ["ad1", "ad2", "ad3", "ad4", "ad5", "ad6", "ad7", "ad8", "sy3", "va12"],
    writtenQuestion: { q: "« Notre deal est accretif de 8%, c'est donc un bon deal. » Corrige ton client en 4 phrases, avec la méthode du vrai test.", modelAnswer: "L'accretion mesure l'effet mécanique du financement, pas la création de valeur : avec de la dette bon marché, presque tout deal devient accretif. Le vrai test : la valeur actualisée des synergies nettes doit dépasser la prime payée, et le ROIC du deal doit battre le WACC. On peut être accretif en surpayant — et détruire de la valeur. Regardons plutôt synergies vs prime.", keywords: ["mécanique|financement", "synergies.*prime|prime.*synergies", "roic|wacc", "surpay|détruire"] },
    badge: "EPS Gladiator",
  },
  {
    id: "boss-lbo", moduleId: "m12", title: "Boss Fight : LBO", emoji: "🏰", timeLimitMin: 15, passScore: 75, xp: 120,
    quizIds: ["lb1", "lb2", "lb3", "lb4", "lb5", "lb6", "lb7", "lb8", "lb9", "cm3"],
    writtenQuestion: { q: "Paper LBO : entrée EBITDA 100 à 8x, 60% dette. Sortie an 5 : EBITDA 125, même multiple, dette remboursée de moitié. MOIC et IRR approx ?", modelAnswer: "Entrée : EV 800, dette 480, equity 320. Sortie : EV = 125 × 8 = 1 000 ; dette restante 240 ; equity = 760. MOIC = 760/320 ≈ 2,4x ; IRR ≈ 2,4^(1/5) − 1 ≈ 19%. Value creation : moitié debt paydown, moitié croissance d'EBITDA — multiple constant, donc pas de pari sur le marché.", keywords: ["800|480|320", "1000|1 000|240", "760", "2,4|2.4", "19|18|20"] },
    badge: "Leverage King",
  },
  {
    id: "boss-behav", moduleId: "m15", title: "Boss Fight : Behavioral", emoji: "👑", timeLimitMin: 15, passScore: 75, xp: 120,
    quizIds: ["bh1", "bh2", "bh3", "fd4", "fd5"],
    writtenQuestion: { q: "Écris ton « tell me about yourself » définitif (90-120 secondes à l'oral). C'est LA réponse que tu réutiliseras en vrai.", modelAnswer: "Grille d'auto-évaluation : (1) une phrase d'ancrage (qui je suis, où j'étudie) ; (2) 2-3 expériences racontées comme une progression logique vers la finance — chaque étape motive la suivante ; (3) une preuve concrète de préparation au M&A ; (4) une chute : « c'est pourquoi je suis ici ». Durée cible 90-120 sec, zéro date superflue, zéro chronologie plate. Si un ami peut le résumer en une phrase après une écoute, c'est gagné.", keywords: ["étud|école|master", "expérience|stage|projet", "m&a|finance|deal", "c'est pourquoi|aujourd'hui|ici"] },
    badge: "Interview Royalty",
  },
];

// ─── Plan 8 semaines ────────────────────────────────────────────────────────
export const PLAN: PlanWeek[] = [
  { week: 1, title: "Accounting I — Les fondations", goal: "Maîtriser les 3 états et leurs liens ; premiers réflexes de walk-through.", moduleIds: ["m1", "m2"], dailyRoutine: ["Daily Drill (10-15 min)", "1-2 micro-leçons du module Accounting", "10 flashcards Accounting/Statements", "1 question Red Book Bank à voix haute"], weekend: ["Case study : Bistrot Groupe (beginner)", "Revue des erreurs de la semaine"] },
  { week: 2, title: "Accounting II — Les scénarios", goal: "Dérouler D&A/NWC/goodwill sur les 3 états sans hésiter ; valider le Boss Fight Accounting.", moduleIds: ["m2", "m3"], dailyRoutine: ["Daily Drill", "Micro-leçons NWC/deferred/scénarios", "Mission Analyst Desk (ms6)", "15 flashcards (révision espacée)"], weekend: ["BOSS FIGHT Accounting (≥75%)", "Interview Arena : Technical Drill (ar2)"] },
  { week: 3, title: "Valuation — EV, multiples, DCF", goal: "Traverser le bridge EV↔Equity dans les deux sens ; construire un DCF simple.", moduleIds: ["m4", "m5"], dailyRoutine: ["Daily Drill", "Micro-leçons Valuation puis DCF", "Mission ms1 (EV de la target) puis ms2 (quick DCF)", "Questions Red Book Valuation (5/jour)"], weekend: ["Case study : Nordwind Software puis Valera", "BOSS FIGHT Valuation"] },
  { week: 4, title: "Comps, precedents & consolidation", goal: "Savoir construire et DÉFENDRE un set de comps ; valider le Boss DCF.", moduleIds: ["m5", "m6", "m7"], dailyRoutine: ["Daily Drill", "Micro-leçons comps/precedents", "Mission ms5 (profil comparable) et ms10 (bridge du client)", "Flashcards : decks Valuation + DCF + Comps"], weekend: ["BOSS FIGHT DCF", "Case study : Corsair Luxury (comps)"] },
  { week: 5, title: "M&A Process & Accretion/Dilution", goal: "Process de A à Z, synergies vs prime, accretion en cash/dette/actions.", moduleIds: ["m8", "m9", "m10", "m11"], dailyRoutine: ["Daily Drill", "Micro-leçons process/synergies/accretion", "Mission ms3 (deal rationale), ms4 (accretif ?), ms8 (Q&A management)", "Questions Red Book M&A (5/jour)"], weekend: ["BOSS FIGHT M&A Process + BOSS FIGHT Accretion/Dilution", "Case study : Helios Med (DCF) ou TelcoNord (synergies)"] },
  { week: 6, title: "LBO, Capital Markets & secteurs", goal: "Paper LBO de tête ; impact des taux ; framework sectoriel opérationnel.", moduleIds: ["m12", "m13", "m14"], dailyRoutine: ["Daily Drill", "Micro-leçon LBO + questions Red Book LBO/CM", "Mission ms7 (paper LBO)", "1 secteur/jour : flashcards Industry + questions Bank"], weekend: ["BOSS FIGHT LBO", "Case study : Fortuna Retail (LBO) ou Argos (accretion)"] },
  { week: 7, title: "Cases & Behavioral", goal: "Cases advanced/professional ; ton histoire et tes deals prêts à l'oral.", moduleIds: ["m15", "m16"], dailyRoutine: ["Daily Drill", "Interview Arena : Fit (ar1) puis Deal Discussion (ar4)", "Mission ms9 : TON deal memo (à jour, réel)", "Behavioral Bank : 5 questions écrites puis dites à voix haute"], weekend: ["Case study : Projet Vega (sell-side pitch) puis Projet Athena (buyer recommendation)", "BOSS FIGHT Behavioral"] },
  { week: 8, title: "Mock interviews intensifs", goal: "Simulations complètes, correction des points faibles, concision, confiance.", moduleIds: ["m17"], dailyRoutine: ["Daily Drill (mode révision des faiblesses)", "1 session Arena par jour : ar2 → ar3 → ar4 → ar5 (Don't Bullshit) → ar6 (MD)", "Revue du Weakness Detector : re-drill des tags rouges", "Flashcards : uniquement les cartes en retard"], weekend: ["Full Interview Case (cs12) en conditions réelles (60 min chrono)", "Dernier passage : tes 2 deals + ton pitch + tes questions à poser"] },
];

export const lessonById = Object.fromEntries(LESSONS.map((l) => [l.id, l]));
export const moduleById = Object.fromEntries(MODULES.map((m) => [m.id, m]));
export const bossById = Object.fromEntries(BOSSES.map((b) => [b.id, b]));
