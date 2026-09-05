// ─── Les documents d'un process M&A ─────────────────────────────────────────
// Pour chaque document : ce que c'est, qui le produit, ce que l'analyste en
// fait concrètement, et le piège classique. Tous les exemples sont fictifs.

export interface DealDoc {
  id: string;
  name: string;
  fr?: string;
  stage: "Préparation" | "Marketing" | "Premier tour" | "Due diligence" | "Second tour" | "Négociation & closing";
  side: "sell-side" | "buy-side" | "les deux";
  what: string;
  producedBy: string;
  analystRole: string;      // ce que TOI tu fais dessus
  trap: string;
  example?: string;         // extrait fictif
}

const d = (
  id: string, name: string, stage: DealDoc["stage"], side: DealDoc["side"],
  what: string, producedBy: string, analystRole: string, trap: string,
  extra?: { fr?: string; example?: string }
): DealDoc => ({ id, name, stage, side, what, producedBy, analystRole, trap, ...extra });

export const DEAL_DOCS: DealDoc[] = [
  // ── Préparation ──
  d("dd1", "Pitchbook", "Préparation", "sell-side",
    "Le support avec lequel la banque gagne le mandat : vision du marché, valorisation indicative, alternatives stratégiques, track record.",
    "L'équipe de couverture + les analystes M&A, sous la direction du MD.",
    "Tu produis 60-80% des pages : profils de sociétés, comps, précédents, football field, pages de credentials. Tu vérifies chaque chiffre deux fois.",
    "Un pitchbook n'est PAS un document de deal : les valorisations y sont indicatives et volontairement larges. Ne cite jamais un chiffre de pitch comme s'il était contractuel.",
    { fr: "Support de présentation", example: "« Aurelia Software — Strategic Alternatives Review », 45 pages, dont 12 de valorisation." }),
  d("dd2", "Public Information Book (PIB)", "Préparation", "les deux",
    "Compilation de tout ce qui est public sur une société : rapports annuels, communiqués, recherche analystes, articles.",
    "L'analyste, quasi systématiquement.",
    "C'est souvent ta première tâche sur un nouveau deal. Tu rassembles, tu synthétises en 2-3 pages de faits saillants, tu dates chaque source.",
    "Confondre « public » et « fiable ». Une note de broker est une opinion — attribue-la, ne la présente pas comme un fait.",
    { fr: "Recueil d'informations publiques" }),
  d("dd3", "Buyer List / Target List", "Préparation", "les deux",
    "L'univers d'acheteurs (sell-side) ou de cibles (buy-side), segmenté par tiers de priorité.",
    "L'analyste construit, le VP arbitre les tiers, le client valide.",
    "Tu screenes des dizaines de candidats : fit stratégique, capacité financière, historique d'acquisitions, contraintes antitrust. Tu justifies chaque tier en une ligne.",
    "Faire une liste par taille uniquement. Un acheteur qui a la capacité mais aucun fit produit ne signera jamais — et sa présence décrédibilise ta liste.",
    { fr: "Liste d'acheteurs" }),
  // ── Marketing ──
  d("dd4", "Teaser", "Marketing", "sell-side",
    "Une à deux pages ANONYMES envoyées largement pour susciter l'intérêt avant toute signature de NDA.",
    "L'analyste rédige, le VP relit, le client valide.",
    "Tu écris le teaser : description du business sans nom, 4-5 investment highlights, financials résumés (souvent en fourchettes). Chaque mot compte.",
    "Laisser un détail identifiant : « leader européen des valves cryogéniques avec 34% de part de marché » — n'importe quel industriel reconnaît la société en 10 secondes.",
    { example: "« A €80m revenue European specialty chemicals producer with 22% EBITDA margins and a blue-chip customer base. »" }),
  d("dd5", "NDA", "Marketing", "les deux",
    "L'accord de confidentialité qui ouvre l'accès au CIM et à la data room.",
    "Les avocats rédigent, la banque gère le flux et le suivi.",
    "Tu tiens le tracker : qui a reçu, qui a signé, quelle version, quelles réserves. Un NDA non signé = pas de CIM, sans exception.",
    "Envoyer un CIM avant retour du NDA signé « parce que c'est urgent ». C'est la faute qui coûte un stage.",
    { fr: "Accord de confidentialité" }),
  d("dd6", "CIM", "Marketing", "sell-side",
    "Le document de vente complet : 50-100 pages sur le business, le marché, le management et le plan d'affaires.",
    "L'équipe M&A avec le management de la cible ; l'analyste construit une grande partie des pages.",
    "Tu produis les sections financières, les graphiques de marché, les pages produits. Tu assures la cohérence de CHAQUE chiffre entre les pages — c'est le test le plus dur du document.",
    "Le lire comme un document neutre côté buy-side. C'est un document de vente : les projections sont le scénario haut, la courbe remonte toujours après l'année en cours (« hockey stick »).",
    { fr: "Mémorandum d'information" }),
  d("dd7", "Management Presentation", "Marketing", "sell-side",
    "La présentation orale du management aux acheteurs sélectionnés, suivie de questions-réponses.",
    "Le management, coaché par la banque ; l'analyste prépare le support.",
    "Tu construis le deck et tu prépares le « Q&A prep book » : les 40 questions probables et les réponses validées. Tu prends les notes pendant la session.",
    "Ne pas noter QUI a posé QUELLE question. L'intensité et la nature des questions d'un acheteur en disent long sur son sérieux.",
  ),
  d("dd8", "Process Letter", "Premier tour", "sell-side",
    "La lettre fixant les règles du tour : date limite, format de l'offre, hypothèses imposées, informations exigées.",
    "La banque, validée par le client et les avocats.",
    "Tu prépares les envois et le suivi des accusés de réception. Tu compiles ensuite les offres reçues dans un tableau comparatif.",
    "Laisser des ambiguïtés sur les hypothèses (dette nette de référence, périmètre). Deux offres construites sur des bases différentes ne sont pas comparables.",
  ),
  // ── Premier tour ──
  d("dd9", "IOI", "Premier tour", "buy-side",
    "L'offre indicative NON ENGAGEANTE : une fourchette de prix et les hypothèses clés.",
    "L'acheteur, souvent avec l'aide de son conseil.",
    "Côté buy-side tu prépares la valorisation qui sous-tend la fourchette. Côté sell-side tu construis la grille de comparaison des IOI reçues.",
    "Confondre IOI et LOI. L'IOI donne une fourchette et n'engage à rien ; la LOI donne un prix ferme et s'accompagne d'exclusivité.",
    { fr: "Marque d'intérêt", example: "« Indicative enterprise value range of €340-380m, subject to confirmatory due diligence. »" }),
  d("dd10", "Bid Comparison Grid", "Premier tour", "sell-side",
    "Le tableau comparant toutes les offres reçues sur des bases homogènes.",
    "L'analyste construit, le VP challenge.",
    "Tu normalises : prix d'equity vs EV, traitement de la dette nette, conditions suspensives, financement, calendrier. C'est ce tableau qui décide qui passe au second tour.",
    "Comparer des prix d'equity value sans retraiter des définitions de dette nette différentes. Deux offres « à 350 M€ » peuvent différer de 20 M€ réels.",
  ),
  // ── Due diligence ──
  d("dd11", "VDR (Virtual Data Room)", "Due diligence", "les deux",
    "La plateforme sécurisée contenant tous les documents mis à disposition des acheteurs.",
    "Le vendeur, avec la banque et les avocats pour l'index.",
    "Tu contribues à l'index, tu vérifies que chaque document promis est bien uploadé, tu suis l'activité des acheteurs (qui consulte quoi = signal d'intérêt réel).",
    "Uploader un document non caviardé (noms de clients, salaires nominatifs, contrats sensibles). Une fuite dans une VDR est une faute grave.",
    { fr: "Data room virtuelle" }),
  d("dd12", "Diligence Request List", "Due diligence", "buy-side",
    "La liste structurée des documents et informations demandés par l'acheteur.",
    "L'acheteur et ses conseils (financiers, juridiques, fiscaux, commerciaux).",
    "Côté buy-side tu consolides les demandes de tous les conseils en une liste unique, sans doublons, priorisée.",
    "Envoyer 400 questions non priorisées au premier jour. Le vendeur traite d'abord ce qui est clair et urgent — noie ta demande et tu n'obtiens rien.",
    { fr: "Liste de questions de due diligence" }),
  d("dd13", "Q&A Tracker", "Due diligence", "les deux",
    "Le registre de toutes les questions posées et des réponses apportées, avec dates et responsables.",
    "L'analyste. Systématiquement.",
    "C'est TON document. Chaque question : numéro, date, auteur, destinataire, statut, réponse, pièce jointe. Un VP doit pouvoir répondre « où en est la question 147 ? » en 5 secondes.",
    "Répondre à une question sans faire valider la réponse par le client ou l'avocat. Une réponse écrite dans un Q&A tracker peut engager le vendeur.",
  ),
  d("dd14", "Vendor Due Diligence (VDD)", "Due diligence", "sell-side",
    "Le rapport de diligence commandé par le VENDEUR et remis aux acheteurs.",
    "Un cabinet d'audit ou de conseil mandaté par le vendeur.",
    "Tu l'exploites pour préparer les réponses aux questions et pour anticiper les points de challenge sur l'EBITDA retraité.",
    "Le traiter comme un audit indépendant. Il est payé par le vendeur : les retraitements d'EBITDA y sont favorables et doivent être challengés un par un.",
  ),
  d("dd15", "Quality of Earnings (QoE)", "Due diligence", "buy-side",
    "L'analyse détaillée de la qualité et de la récurrence de l'EBITDA.",
    "Un cabinet de Transaction Services.",
    "Tu intègres les retraitements du QoE dans ton modèle : chaque add-back rejeté fait baisser l'EBITDA — donc le prix, à multiple constant.",
    "Accepter les add-backs « exceptionnels » qui reviennent chaque année. Une charge de restructuration récurrente depuis 4 ans n'est pas exceptionnelle.",
    { fr: "Qualité des résultats" }),
  // ── Second tour ──
  d("dd16", "LOI / Binding Offer", "Second tour", "buy-side",
    "L'offre ferme : prix, structure, financement, conditions, calendrier — souvent assortie d'exclusivité.",
    "L'acheteur et ses avocats.",
    "Tu produis le modèle de valorisation final et les analyses de sensibilité qui justifient le prix devant le comité d'investissement.",
    "Croire que la LOI est engageante sur le prix. Elle l'est généralement sur la confidentialité et l'exclusivité — le prix reste sujet à la diligence confirmatoire.",
    { fr: "Lettre d'intention" }),
  d("dd17", "Fairness Opinion", "Négociation & closing", "sell-side",
    "L'avis d'une banque au conseil d'administration sur le caractère équitable du prix, d'un point de vue financier.",
    "Une banque (parfois différente du conseil M&A, pour éviter le conflit d'intérêts).",
    "Tu prépares les analyses de support : comps, précédents, DCF, primes payées. Chaque hypothèse sera documentée et potentiellement scrutée en justice.",
    "La présenter comme une recommandation de voter pour l'opération. C'est un avis sur le PRIX, à une DATE donnée, sous des hypothèses précises.",
  ),
  // ── Négociation & closing ──
  d("dd18", "SPA / Merger Agreement", "Négociation & closing", "les deux",
    "Le contrat définitif : prix, mécanisme d'ajustement, garanties, conditions suspensives, indemnisation.",
    "Les avocats des deux parties.",
    "Tu modélises le mécanisme de prix (locked box vs completion accounts), tu chiffres l'impact des ajustements de dette nette et de BFR normatif.",
    "Ignorer la définition contractuelle de la « dette nette ». Elle inclut souvent des dettes assimilées (pensions, earn-outs, leases) qui déplacent le prix de plusieurs millions.",
    { fr: "Contrat de cession" }),
  d("dd19", "Board Materials", "Négociation & closing", "les deux",
    "Le dossier remis au conseil d'administration pour approuver l'opération.",
    "La banque conseil et le management.",
    "Tu produis la synthèse de valorisation, l'analyse de la prime, les alternatives envisagées et les risques. Format : dense, factuel, sans marketing.",
    "Y mettre le ton d'un pitchbook. Un conseil veut des faits et des risques assumés, pas un argumentaire de vente.",
    { fr: "Dossier de conseil d'administration" }),
  d("dd20", "Annonce publique", "Négociation & closing", "les deux",
    "Le communiqué de presse et, pour les cotées, les dépôts réglementaires associés.",
    "Communication financière, avocats, banques.",
    "Tu prépares les chiffres cités : prime, multiple implicite, synergies annoncées. Chaque chiffre publié sera repris par la presse et les analystes.",
    "Annoncer des synergies sans préciser leur horizon de réalisation ni les coûts pour les atteindre. Le marché fait immédiatement le calcul net.",
    { example: "« The transaction values Nova Consumer at an implied 11.2x LTM EBITDA, a 31% premium to the unaffected share price. »" }),
];

export const DOC_STAGES = ["Préparation", "Marketing", "Premier tour", "Due diligence", "Second tour", "Négociation & closing"] as const;
