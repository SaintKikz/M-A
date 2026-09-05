// ─── Catalogue de ressources externes ───────────────────────────────────────
// Références utilisées comme BENCHMARK de curriculum : le contenu de cette
// plateforme est original et reformulé, jamais copié de ces sources.
// Les liens sont les URLs officielles (paramètres de tracking retirés).
// « Dernière vérification » = date à laquelle le lien a été contrôlé.

export type ResourceAccess = "gratuit" | "payant" | "officiel";
export type ResourceCategory =
  | "Curriculum" | "Modélisation" | "Valorisation" | "Comptabilité"
  | "Réglementaire" | "Filings & données" | "Excel" | "Due diligence";

export interface Resource {
  id: string;
  name: string;
  org: string;
  access: ResourceAccess;
  categories: ResourceCategory[];
  url?: string;          // omis si l'URL ne peut pas être vérifiée
  useHere: string;       // à quoi ça sert dans TON parcours
  verified: string;      // yyyy-mm
}

const LAST_CHECK = "2026-09";

export const RESOURCES: Resource[] = [
  // ── Programmes de formation (benchmarks de curriculum) ──
  {
    id: "wsp", name: "Financial & Valuation Modeling — Premium Package", org: "Wall Street Prep",
    access: "payant", categories: ["Curriculum", "Modélisation"],
    url: "https://www.wallstreetprep.com/self-study-programs/premium-package/",
    useHere: "Benchmark principal du curriculum analyste : c'est l'ordre des modules (compta → valo → 3 états → M&A → LBO) que suit l'Académie ici.",
    verified: LAST_CHECK,
  },
  {
    id: "biws", name: "Core Financial Modeling", org: "Breaking Into Wall Street",
    access: "payant", categories: ["Curriculum", "Modélisation"],
    url: "https://breakingintowallstreet.com/core-financial-modeling/",
    useHere: "Référence pour le format des cas chronométrés : merger model et LBO en temps limité, comme dans le Deal Room et l'Analyst Day.",
    verified: LAST_CHECK,
  },
  {
    id: "tts", name: "Investment Banking Bundle Guide", org: "Training The Street",
    access: "payant", categories: ["Curriculum"],
    url: "https://trainingthestreet.com/wp-content/uploads/2024/12/Investment-Banking-Bundle-Guide.pdf",
    useHere: "Ordre pédagogique « desk-ready » : ce que les banques font réellement couvrir à leurs analystes pendant l'onboarding.",
    verified: LAST_CHECK,
  },
  // ── Modélisation & valorisation ──
  {
    id: "maca-merger", name: "M&A Merger Model", org: "Macabacus",
    access: "gratuit", categories: ["Modélisation", "Valorisation"],
    url: "https://macabacus.com/merger-model/introduction-merger",
    useHere: "Merger model avancé : purchase price allocation, accretion/dilution, retraitements. À lire avant le module M&A niveau 6.",
    verified: LAST_CHECK,
  },
  {
    id: "maca-val", name: "Valuation Methods", org: "Macabacus",
    access: "gratuit", categories: ["Valorisation"],
    url: "https://macabacus.com/valuation/methods",
    useHere: "Panorama comps / précédents / DCF / LBO / SOTP — le complément parfait des outils de cette plateforme.",
    verified: LAST_CHECK,
  },
  {
    id: "dam-class", name: "Valuation Class (notes & cours)", org: "Aswath Damodaran — NYU Stern",
    access: "gratuit", categories: ["Valorisation", "Curriculum"],
    url: "https://pages.stern.nyu.edu/~adamodar/pdfiles/eqnotes/equity.html",
    useHere: "La valorisation en profondeur, gratuitement. Pour comprendre POURQUOI un DCF marche, pas seulement comment le construire.",
    verified: LAST_CHECK,
  },
  {
    id: "dam-spread", name: "Valuation Spreadsheets", org: "Aswath Damodaran — NYU Stern",
    access: "gratuit", categories: ["Valorisation", "Modélisation", "Excel"],
    url: "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/eqspread.htm",
    useHere: "Classeurs prêts à l'emploi : WACC, FCFF, synergies, LBO, multiples. Le meilleur moyen de voir un vrai modèle de l'intérieur.",
    verified: LAST_CHECK,
  },
  // ── Filings & données ──
  {
    id: "edgar", name: "EDGAR — APIs et recherche de filings", org: "SEC (États-Unis)",
    access: "officiel", categories: ["Filings & données", "Réglementaire"],
    url: "https://www.sec.gov/search-filings/edgar-application-programming-interfaces",
    useHere: "Les vrais 10-K, 10-Q, 8-K, S-4 et merger proxies. C'est là qu'on trouve le « Background of the Merger » et les projections du management.",
    verified: LAST_CHECK,
  },
  {
    id: "bdif", name: "BDIF — Base des décisions et informations financières", org: "AMF (France)",
    access: "officiel", categories: ["Filings & données", "Réglementaire"],
    url: "https://bdif.amf-france.org/",
    useHere: "Documents français : URD, notes d'information d'OPA/OPE, franchissements de seuils. L'équivalent français d'EDGAR.",
    verified: LAST_CHECK,
  },
  // ── Comptabilité / normes ──
  {
    id: "ifrs3", name: "IFRS 3 — Business Combinations", org: "IFRS Foundation",
    access: "officiel", categories: ["Comptabilité", "Réglementaire"],
    url: "https://www.ifrs.org/issued-standards/list-of-standards/ifrs-3-business-combinations/",
    useHere: "La norme derrière le purchase accounting : goodwill, actifs identifiables, PPA. Le fondement du module M&A avancé.",
    verified: LAST_CHECK,
  },
  {
    id: "ias12", name: "IAS 12 — Income Taxes", org: "IFRS Foundation",
    access: "officiel", categories: ["Comptabilité", "Réglementaire"],
    url: "https://www.ifrs.org/issued-standards/list-of-standards/ias-12-income-taxes/",
    useHere: "DTA/DTL : d'où vient le deferred tax liability créé par un asset write-up. La question piège classique en entretien M&A.",
    verified: LAST_CHECK,
  },
  {
    id: "ifrs16", name: "IFRS 16 — Leases", org: "IFRS Foundation",
    access: "officiel", categories: ["Comptabilité", "Réglementaire"],
    url: "https://www.ifrs.org/issued-standards/list-of-standards/ifrs-16-leases/",
    useHere: "Les dettes de loyers et leur effet sur l'EV et l'EV/EBITDA — un ajustement de bridge que beaucoup de candidats ratent.",
    verified: LAST_CHECK,
  },
  // ── M&A public ──
  {
    id: "uk-rule27", name: "Takeover Code — Rule 2.7 (firm intention announcement)", org: "The Takeover Panel (UK)",
    access: "officiel", categories: ["Réglementaire"],
    url: "https://code.thetakeoverpanel.org.uk/tp/rules/rule-2/rule-2-7.html",
    useHere: "Le M&A public britannique : ce qui déclenche une offre ferme, la cash confirmation, les conditions. Indispensable pour les entretiens à Londres.",
    verified: LAST_CHECK,
  },
  {
    id: "eu-merger", name: "Merger control — procédures", org: "Commission européenne",
    access: "officiel", categories: ["Réglementaire"],
    url: "https://competition-policy.ec.europa.eu/mergers/procedures_en",
    useHere: "Antitrust européen : seuils de notification, phase I / phase II, remèdes. La condition suspensive qui décale les closings.",
    verified: LAST_CHECK,
  },
  // ── Standards de modélisation ──
  {
    id: "fast", name: "The FAST Standard", org: "FAST Standard Organisation",
    access: "gratuit", categories: ["Modélisation", "Excel"],
    url: "https://www.fast-standard.org/the-fast-standard/",
    useHere: "Flexible, Appropriate, Structured, Transparent : les principes de modélisation propre. Les conventions de l'Excel Lab s'en inspirent.",
    verified: LAST_CHECK,
  },
  {
    id: "icaew", name: "Financial Modelling Code & bonnes pratiques Excel", org: "ICAEW",
    access: "gratuit", categories: ["Modélisation", "Excel"],
    url: "https://www.icaew.com/technical/technology/excel-community/improve-your-financial-modelling-practice",
    useHere: "Auditabilité et robustesse : comment construire un modèle qu'un tiers peut relire — et corriger — sans toi.",
    verified: LAST_CHECK,
  },
  {
    id: "ms-whatif", name: "Introduction à l'analyse de scénarios (What-If)", org: "Microsoft Support",
    access: "officiel", categories: ["Excel", "Modélisation"],
    url: "https://support.microsoft.com/en-us/excel/introduction-to-what-if-analysis",
    useHere: "Tables de données à 1 et 2 variables, Valeur cible : la mécanique exacte des sensibilités WACC × g de tes decks.",
    verified: LAST_CHECK,
  },
  // ── Due diligence ──
  {
    id: "intralinks", name: "M&A Due Diligence Done Right", org: "Intralinks",
    access: "gratuit", categories: ["Due diligence"],
    url: "https://www.intralinks.com/resources/publications/ma-due-diligence-done-right",
    useHere: "Le fonctionnement réel d'une VDR et d'un process de due diligence, côté fournisseur de data room.",
    verified: LAST_CHECK,
  },
];

export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  "Curriculum", "Modélisation", "Valorisation", "Comptabilité",
  "Réglementaire", "Filings & données", "Excel", "Due diligence",
];
