// ─── M&A public par juridiction ─────────────────────────────────────────────
// Objectif : reconnaître les documents d'une transaction publique et savoir où
// trouver ce qu'un banquier cherche réellement.
//
// ⚠️ Contenu PÉDAGOGIQUE, jamais un conseil juridique. Aucun seuil ni délai
// chiffré n'est donné ici : ils varient par juridiction et changent — la seule
// réponse correcte est de retourner à la source officielle et de dater sa
// vérification. Chaque lien porte sa date de dernière vérification.

export interface PublicMnaDoc { name: string; purpose: string; analystUse: string }
export interface PublicMnaResource { title: string; url: string; org: string; use: string; verified: string; note?: string }

export interface Jurisdiction {
  id: "us" | "fr-eu" | "uk";
  label: string;
  emoji: string;
  intro: string;
  documents: PublicMnaDoc[];
  workflow: string[];
  resources: PublicMnaResource[];
}

const CHECKED = "2026-09";

export const JURISDICTIONS: Jurisdiction[] = [
  {
    id: "us", label: "États-Unis", emoji: "🇺🇸",
    intro: "Savoir reconnaître les principaux filings SEC d'une transaction publique et y retrouver vite la valorisation, le « background of the merger » et les fairness opinions. C'est la meilleure source publique gratuite sur un deal — et la plus sous-exploitée par les candidats.",
    documents: [
      { name: "8-K", purpose: "Annonce d'un événement significatif ; le merger agreement y figure souvent en exhibit.", analystUse: "Verrouiller les termes annoncés : prix, consideration, conditions." },
      { name: "S-4", purpose: "Registration statement utilisé quand l'opération comporte une composante en actions.", analystUse: "Lire la mécanique de la transaction, les risques, les projections et le pro forma." },
      { name: "PREM14A / DEFM14A", purpose: "Proxy préliminaire puis définitif pour le vote des actionnaires.", analystUse: "LE document clé : background of the merger, projections du management, analyses de la banque conseil et fairness opinion." },
      { name: "Schedule TO", purpose: "Déclaration d'offre publique déposée par l'initiateur.", analystUse: "Comprendre les modalités d'une tender offer." },
      { name: "Schedule 14D-9", purpose: "Réponse et recommandation du conseil de la cible dans une tender offer.", analystUse: "Lire la position du board et des éléments du process." },
      { name: "Rule 425", purpose: "Communications liées à une business combination enregistrée.", analystUse: "Suivre les communications transactionnelles déposées." },
    ],
    workflow: [
      "Partir de l'annonce (8-K) pour figer les termes du deal.",
      "Identifier ensuite le proxy, le S-4 ou le tender offer filing selon la structure.",
      "Chercher les sections : Background of the Merger, Reasons for the Transaction, Financial Projections, Opinion of Financial Advisor.",
      "Y reconstituer la premium analysis, les selected public companies, les precedent transactions et les fourchettes de DCF quand elles sont publiées.",
      "Toujours dater la source et distinguer l'information au signing de ce qui est venu après.",
    ],
    resources: [
      { title: "EDGAR — recherche de filings", url: "https://www.sec.gov/edgar/search/", org: "SEC", use: "Recherche plein texte dans tous les filings d'une société ou d'une transaction.", verified: CHECKED, note: "Lien non vérifiable depuis l'outil de build (la SEC bloque les requêtes automatisées)." },
      { title: "EDGAR — APIs publiques", url: "https://www.sec.gov/search-filings/edgar-application-programming-interfaces", org: "SEC", use: "Endpoints submissions et XBRL, pour aller chercher les données par programme.", verified: CHECKED, note: "Lien non vérifiable depuis l'outil de build (la SEC bloque les requêtes automatisées)." },
    ],
  },
  {
    id: "fr-eu", label: "France / Europe", emoji: "🇫🇷",
    intro: "Retrouver l'information réglementée d'un émetteur français, reconnaître les documents d'offre publique, et savoir où intervient le contrôle des concentrations européen. C'est ce qui distingue un candidat sérieux sur le marché parisien.",
    documents: [
      { name: "URD", purpose: "Document d'enregistrement universel : information financière, risques, gouvernance.", analystUse: "Sourcer les historiques, KPIs, dette, actionnariat et facteurs de risque. L'équivalent français du 10-K." },
      { name: "Note d'information", purpose: "Document central d'une offre publique, visé par l'AMF.", analystUse: "Comprendre les termes de l'offre, les intentions de l'initiateur et l'appréciation du prix." },
      { name: "Communiqués réglementés", purpose: "Annonces officielles de l'émetteur.", analystUse: "Verrouiller les dates, les termes et l'évolution du process." },
      { name: "Décisions et visas AMF", purpose: "Documentation officielle publiée par le régulateur.", analystUse: "S'appuyer sur la source officielle plutôt que sur la presse." },
      { name: "Déclarations de franchissement de seuil", purpose: "Publicité des prises de participation significatives.", analystUse: "Repérer une montée au capital avant une offre." },
    ],
    workflow: [
      "Commencer par l'espace investisseurs de la cible et l'information publiée par l'AMF.",
      "Utiliser la BDIF pour les documents et décisions concernant les sociétés cotées.",
      "Comparer le prix d'offre au cours NON AFFECTÉ et aux méthodes de valorisation présentées dans les documents.",
      "Suivre séparément le volet contrôle des concentrations et les éventuels remèdes.",
      "Ne jamais présenter un résumé réglementaire comme un avis juridique.",
    ],
    resources: [
      { title: "BDIF — base des décisions et informations financières", url: "https://bdif.amf-france.org/", org: "AMF", use: "Documents et décisions des sociétés cotées françaises.", verified: CHECKED },
      { title: "AMF", url: "https://www.amf-france.org/fr", org: "AMF", use: "Doctrine, actualités et bases réglementaires.", verified: CHECKED },
      { title: "Contrôle des concentrations — procédures", url: "https://competition-policy.ec.europa.eu/mergers/procedures_en", org: "Commission européenne", use: "Le process officiel du contrôle des concentrations de l'UE.", verified: CHECKED },
    ],
  },
  {
    id: "uk", label: "Royaume-Uni", emoji: "🇬🇧",
    intro: "Comprendre la logique du Takeover Code, distinguer une possible offer d'une firm intention, et reconnaître les deux voies d'exécution d'une acquisition publique britannique. Attendu à Londres, y compris en stage.",
    documents: [
      { name: "Possible offer announcement", purpose: "Communication d'une approche ou d'une situation d'offre potentielle.", analystUse: "Suivre l'évolution du process. N'engage pas l'initiateur." },
      { name: "Rule 2.7 announcement", purpose: "Annonce d'une intention ferme de faire une offre.", analystUse: "Le point de non-retour : termes principaux, consideration, conditions. À ne pas confondre avec une possible offer." },
      { name: "Offer document / scheme circular", purpose: "Documentation destinée aux actionnaires, selon la structure retenue.", analystUse: "Lire les conditions, le calendrier et les recommandations." },
      { name: "Disclosure Table", purpose: "Tableau public du Takeover Panel sur les offres soumises au Code.", analystUse: "Identifier les situations en cours." },
    ],
    workflow: [
      "Vérifier d'abord que la situation entre dans le champ du Takeover Code.",
      "Identifier l'étape : possible offer, firm intention (Rule 2.7), offer document ou scheme, closing.",
      "Distinguer conceptuellement le scheme of arrangement de l'offre contractuelle : le scheme demande une majorité qualifiée mais délivre 100% des titres.",
      "Suivre les conditions, la cash confirmation et les annonces du Panel.",
      "Pour toute règle ou délai précis : retourner au Code en vigueur, jamais à une fiche mémorisée.",
    ],
    resources: [
      { title: "The Takeover Code", url: "https://www.thetakeoverpanel.org.uk/the-code", org: "UK Takeover Panel", use: "La version officielle du Code.", verified: CHECKED },
      { title: "Rule 2.7 — firm intention announcement", url: "https://code.thetakeoverpanel.org.uk/tp/rules/rule-2/rule-2-7.html", org: "UK Takeover Panel", use: "Le texte de la règle qui déclenche l'offre ferme.", verified: CHECKED },
      { title: "Takeover Panel", url: "https://www.thetakeoverpanel.org.uk/", org: "UK Takeover Panel", use: "Panel statements, disclosure table et communications.", verified: CHECKED },
    ],
  },
];

// ─── « Find It in the Filing » ──────────────────────────────────────────────
export const FIND_IT: { q: string; a: string }[] = [
  {
    q: "Tu analyses une acquisition américaine. Où trouver le récit chronologique des négociations entre les parties ?",
    a: "Dans le merger proxy (DEFM14A) ou le S-4 selon la structure, à la section « Background of the Merger ». C'est un récit daté, réunion par réunion — la meilleure source publique gratuite sur le déroulé d'un deal.",
  },
  {
    q: "Tu veux reconstruire les projections du management utilisées par la banque conseil de la cible. Quel document ?",
    a: "Le merger proxy ou le S-4 : les projections fournies au conseil et aux banques y sont résumées lorsqu'elles sont divulguées, souvent dans une section « Certain Financial Projections ».",
  },
  {
    q: "Sur une offre publique française, tu veux la documentation officielle plutôt qu'un article de presse. Où vas-tu ?",
    a: "Sur la BDIF de l'AMF et sur l'espace investisseurs de l'émetteur. La note d'information visée par l'AMF est le document de référence.",
  },
  {
    q: "Au Royaume-Uni, quel document marque l'annonce d'une intention ferme de faire une offre ?",
    a: "Le Rule 2.7 announcement. Attention à ne pas le confondre avec une « possible offer » (Rule 2.4), qui n'engage à rien.",
  },
  {
    q: "Tu cherches la prime payée et les multiples de transactions comparables retenus par les banques.",
    a: "Dans la section « Opinion of Financial Advisor » du proxy américain : elle détaille la premium analysis, les selected public companies, les precedent transactions et les fourchettes de DCF.",
  },
  {
    q: "Un seuil réglementaire ou un délai t'échappe. Que fait un bon analyste ?",
    a: "Il retourne immédiatement à la source officielle en vigueur et date sa vérification. Il ne se fie jamais à une fiche mémorisée : ces seuils varient par juridiction et changent. Répondre « je vérifie et je te confirme » vaut mieux qu'un chiffre faux dit avec assurance.",
  },
];
