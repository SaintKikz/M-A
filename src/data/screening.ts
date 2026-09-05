// ─── Simulateur de buyer screening ──────────────────────────────────────────
// Univers d'acheteurs FICTIF à trier pour une cible fictive.
// Chaque candidat porte la réponse modèle et son raisonnement.

export type Tier = "T1" | "T2" | "T3" | "OUT";

export interface Buyer {
  id: string;
  name: string;
  kind: "Stratégique" | "Sponsor";
  geo: string;
  profile: string;          // ce que fait l'acheteur
  financials: string;       // taille / capacité
  history: string;          // historique d'acquisitions
  answer: Tier;
  why: string;              // justification du tier
}

export interface ScreeningBrief {
  target: string;
  sector: string;
  description: string;
  metrics: { label: string; value: string }[];
  mandate: string;
  buyers: Buyer[];
}

export const TIER_META: Record<Tier, { label: string; color: string; desc: string }> = {
  T1: { label: "Tier 1", color: "green", desc: "Fit stratégique fort + capacité financière + logique d'exécution. À approcher en priorité." },
  T2: { label: "Tier 2", color: "accent", desc: "Fit crédible mais un frein : taille, géographie, timing ou appétit incertain." },
  T3: { label: "Tier 3", color: "gold", desc: "Approche opportuniste : fit partiel ou capacité limitée. Contactés en second rideau." },
  OUT: { label: "Exclure", color: "red", desc: "Rédhibitoire : pas de capacité, conflit, risque antitrust, ou aucun fit." },
};

export const SCREENING: ScreeningBrief = {
  target: "Helios Diagnostics",
  sector: "Dispositifs médicaux — diagnostic in vitro",
  description:
    "Fabricant européen d'analyseurs de diagnostic in vitro et de consommables associés. Modèle « razor / razor blade » : 35% du chiffre d'affaires en équipements, 65% en consommables récurrents à forte marge. Base installée de 4 200 analyseurs, principalement dans des laboratoires hospitaliers en France, Allemagne et Benelux. Le fondateur, 68 ans, souhaite céder 100%.",
  metrics: [
    { label: "Chiffre d'affaires", value: "185 M€" },
    { label: "Croissance (3 ans)", value: "+7% par an" },
    { label: "EBITDA", value: "42 M€ (22,7%)" },
    { label: "Conversion cash", value: "78% de l'EBITDA" },
    { label: "Dette nette", value: "38 M€" },
    { label: "EV attendue", value: "440-500 M€ (10,5-12,0x)" },
    { label: "Effectif", value: "610 personnes" },
    { label: "Concentration client", value: "1er client 6% du CA" },
  ],
  mandate:
    "Tu es analyste sur le sell-side. Le VP te demande de trier l'univers d'acheteurs en Tier 1 / Tier 2 / Tier 3 / Exclure avant la réunion de demain. Critères : fit stratégique (produit, géographie, canal), capacité financière (peut-il écrire un chèque de ~470 M€ ?), probabilité d'exécution (historique d'acquisitions, gouvernance) et risques (antitrust, conflit).",
  buyers: [
    // ── Stratégiques Tier 1 ──
    {
      id: "b1", name: "Meridian Medical Systems", kind: "Stratégique", geo: "États-Unis",
      profile: "Groupe de diagnostic coté, 4,2 Md$ de CA. Fort en biologie moléculaire, absent du diagnostic in vitro classique en Europe continentale.",
      financials: "EBITDA 980 M$, dette nette / EBITDA 1,4x. Trésorerie disponible 600 M$.",
      history: "6 acquisitions en 5 ans, dont 2 en Europe. Intégration reconnue comme efficace.",
      answer: "T1",
      why: "Fit produit complémentaire (pas de recouvrement direct = peu de risque antitrust), présence européenne à renforcer, capacité financière très large et machine d'acquisition rodée. Le profil d'acheteur idéal.",
    },
    {
      id: "b2", name: "Rheinland Labortechnik AG", kind: "Stratégique", geo: "Allemagne",
      profile: "Équipementier de laboratoire allemand, 1,1 Md€ de CA. Vend aux mêmes laboratoires hospitaliers mais sur des gammes différentes (préparation d'échantillons).",
      financials: "EBITDA 190 M€, levier 1,8x. Capacité d'acquisition confirmée par son CFO en public.",
      history: "3 acquisitions ciblées en 4 ans, toutes dans le DACH. Première opération transfrontalière possible.",
      answer: "T1",
      why: "Le canal de distribution est identique : les synergies commerciales sont immédiates et crédibles. Capacité financière suffisante. Seul bémol : aucune acquisition hors DACH — mais le fit est trop fort pour ne pas être en Tier 1.",
    },
    {
      id: "b3", name: "Nordic BioCare", kind: "Stratégique", geo: "Suède",
      profile: "Groupe scandinave de diagnostic, 780 M€ de CA. Présent sur le diagnostic in vitro, mais uniquement en Europe du Nord.",
      financials: "EBITDA 145 M€, levier 2,1x. Aurait besoin d'un financement mais reste dans ses moyens.",
      history: "Actif : 4 acquisitions en 6 ans, dont une de 320 M€ en 2024.",
      answer: "T1",
      why: "Même métier, géographies parfaitement complémentaires (Nord vs France/DACH/Benelux). L'extension géographique est le rationale le plus simple à vendre à un conseil d'administration.",
    },
    // ── Stratégiques Tier 2 ──
    {
      id: "b4", name: "Global Health Instruments", kind: "Stratégique", geo: "États-Unis",
      profile: "Géant du matériel médical, 18 Md$ de CA. Le diagnostic in vitro est une division parmi douze.",
      financials: "Capacité illimitée à cette taille de deal.",
      history: "Acquisitions nombreuses mais focalisées sur des tickets > 2 Md$ depuis 3 ans.",
      answer: "T2",
      why: "La capacité est totale, mais 470 M€ est sous leur seuil de pertinence stratégique actuel : le deal risque de ne pas mobiliser leur comité. À approcher, sans en faire une priorité.",
    },
    {
      id: "b5", name: "Alpine Consumables SA", kind: "Stratégique", geo: "Suisse",
      profile: "Spécialiste des consommables de laboratoire, 340 M€ de CA. Pas d'activité équipements.",
      financials: "EBITDA 58 M€, levier 2,6x. Un deal de 470 M€ dépasserait sa propre valorisation.",
      history: "Croissance principalement organique, 1 seule acquisition (45 M€) en 2023.",
      answer: "T2",
      why: "Fit produit réel sur les consommables, mais le deal est transformationnel pour eux : financement complexe, exécution incertaine. Envisageable seulement avec un partenaire financier — d'où le Tier 2.",
    },
    {
      id: "b6", name: "Kyoto Precision Instruments", kind: "Stratégique", geo: "Japon",
      profile: "Fabricant d'instruments de précision, 2,4 Md$ de CA, dont 20% en diagnostic. Cherche à s'implanter en Europe.",
      financials: "Bilan très solide, trésorerie nette positive.",
      history: "Historiquement peu acquéreur hors Asie : 1 acquisition européenne en 15 ans.",
      answer: "T2",
      why: "Rationale stratégique clair et capacité financière excellente, mais un processus de décision japonais typiquement long et un historique d'exécution transfrontalière très mince. Le risque de timing est réel.",
    },
    // ── Sponsors Tier 1/2 ──
    {
      id: "b7", name: "Castellan Partners", kind: "Sponsor", geo: "Royaume-Uni",
      profile: "Fonds mid-cap européen, fonds actuel de 2,8 Md€. Thèse healthcare affirmée.",
      financials: "Ticket equity 150-400 M€. Dry powder estimé à 1,1 Md€.",
      history: "3 participations dans les dispositifs médicaux, dont une revendue à 3,2x en 2025.",
      answer: "T1",
      why: "Profil de cible idéal pour un sponsor : récurrence des consommables, conversion cash de 78%, base installée qui sécurise le chiffre d'affaires. Le fonds a la thèse, le ticket et le track record sectoriel.",
    },
    {
      id: "b8", name: "Laurier Capital", kind: "Sponsor", geo: "France",
      profile: "Fonds français mid-cap, fonds de 1,4 Md€. Généraliste avec une équipe santé.",
      financials: "Ticket equity 80-250 M€. Devrait syndiquer ou co-investir pour ce deal.",
      history: "Très actif en France, 9 opérations en 5 ans. Connaît bien les situations de succession.",
      answer: "T2",
      why: "Excellente compréhension du contexte (fondateur cédant, actif français) mais le ticket est en haut de fourchette : nécessite un co-investisseur, ce qui allonge et fragilise l'exécution.",
    },
    {
      id: "b9", name: "Brightwater Growth", kind: "Sponsor", geo: "États-Unis",
      profile: "Fonds de croissance technologique, fonds de 3,5 Md$. Investit surtout dans le logiciel de santé.",
      financials: "Ticket 100-500 M$. Capacité confirmée.",
      history: "18 opérations, exclusivement software et SaaS santé. Aucune participation industrielle.",
      answer: "T3",
      why: "La capacité existe mais la thèse ne colle pas : Helios est un industriel avec des usines et des stocks, pas un modèle logiciel. Un fonds growth software valorisera mal cet actif et ne gagnera pas l'enchère.",
    },
    {
      id: "b10", name: "Pallas Industrial Partners", kind: "Sponsor", geo: "Allemagne",
      profile: "Fonds spécialisé dans les industriels de niche, fonds de 900 M€.",
      financials: "Ticket equity 50-150 M€. Un chèque de 470 M€ est hors de portée sans consortium.",
      history: "Bon opérateur industriel, mais tickets historiquement inférieurs à 200 M€.",
      answer: "T3",
      why: "Compétence opérationnelle pertinente, mais la taille du deal dépasse nettement leur format de fonds. Une approche en consortium reste possible : Tier 3 plutôt qu'exclusion.",
    },
    // ── Exclusions ──
    {
      id: "b11", name: "EuroDiagnostics Group", kind: "Stratégique", geo: "France",
      profile: "Concurrent direct sur le diagnostic in vitro en France, 210 M€ de CA. Parts de marché combinées estimées à 55-60% sur le segment français des analyseurs hospitaliers.",
      financials: "EBITDA 38 M€, capacité de financement réelle.",
      history: "2 acquisitions domestiques, dont une bloquée par l'autorité de la concurrence en 2023.",
      answer: "OUT",
      why: "Risque antitrust rédhibitoire : concentration de 55-60% sur le marché français avec un précédent de blocage. Même à bon prix, la probabilité de closing est trop faible — et partager des informations avec un concurrent direct expose la cible.",
    },
    {
      id: "b12", name: "Verity Holdings", kind: "Sponsor", geo: "Royaume-Uni",
      profile: "Fonds distressed / special situations, fonds de 600 M€.",
      financials: "Ticket 30-120 M€, structuré avec un levier très agressif.",
      history: "Spécialisé dans les retournements et les actifs en difficulté.",
      answer: "OUT",
      why: "Thèse d'investissement incompatible : Helios est un actif sain, rentable et en croissance. Un fonds distressed n'y trouvera pas sa décote et ne sera jamais compétitif sur le prix. L'approcher fait perdre du temps et envoie un mauvais signal au marché.",
    },
    {
      id: "b13", name: "Sable Ventures", kind: "Sponsor", geo: "États-Unis",
      profile: "Fonds de capital-risque early stage, fonds de 400 M$.",
      financials: "Tickets de 5 à 30 M$, en minoritaire.",
      history: "Uniquement des séries A et B.",
      answer: "OUT",
      why: "Ni la taille, ni le stade, ni le type d'opération (le fondateur veut céder 100%, un VC prend des minoritaires). Aucune raison de figurer sur la liste.",
    },
    {
      id: "b14", name: "Continental Pharma Retail", kind: "Stratégique", geo: "Espagne",
      profile: "Réseau de distribution pharmaceutique, 3,1 Md€ de CA. Distribue des médicaments aux officines.",
      financials: "EBITDA 155 M€, mais levier déjà à 3,9x après une acquisition récente.",
      history: "Acquisitions dans la distribution uniquement.",
      answer: "OUT",
      why: "Aucun fit : distribuer des médicaments en officine n'a rien à voir avec fabriquer des analyseurs pour laboratoires hospitaliers. S'ajoute un bilan déjà tendu à 3,9x. Double motif d'exclusion.",
    },
    {
      id: "b15", name: "Helvetia Life Sciences", kind: "Stratégique", geo: "Suisse",
      profile: "Groupe pharma coté, 6 Md CHF de CA. Recentrage annoncé sur ses médicaments propriétaires.",
      financials: "Capacité totale.",
      history: "En phase de CESSION d'actifs : 3 divisions vendues en 18 mois pour financer sa R&D.",
      answer: "OUT",
      why: "L'entreprise est vendeuse, pas acheteuse. Sa stratégie publique est un recentrage sur le médicament : une acquisition de diagnostic irait à l'encontre du message envoyé à ses actionnaires.",
    },
  ],
};
