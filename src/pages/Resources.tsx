import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, PageTitle, Tag } from "../components/ui";
import { RESOURCES, RESOURCE_CATEGORIES, type ResourceAccess } from "../data/resources";

const TABS = ["Formules", "Cheat sheets", "Excel", "Checklists", "Erreurs & FAQ", "Bibliothèque"] as const;

const FORMULAS: { theme: string; items: { name: string; formula: string; note?: string }[] }[] = [
  { theme: "Comptabilité", items: [
    { name: "EBITDA", formula: "Revenue − COGS − Opex (hors D&A) = EBIT + D&A" },
    { name: "Net income", formula: "(EBIT − Intérêts) × (1 − t)" },
    { name: "Retained earnings", formula: "RE fin = RE début + NI − Dividendes" },
    { name: "BFR (NWC)", formula: "(Créances + Stocks) − Fournisseurs", note: "seule la VARIATION touche le cash" },
    { name: "Cash conversion cycle", formula: "DSO + DIO − DPO" },
    { name: "PP&E roll-forward", formula: "PP&E fin = PP&E début + Capex − D&A" },
  ]},
  { theme: "Corporate Finance", items: [
    { name: "Valeur présente", formula: "PV = CF / (1 + r)ⁿ" },
    { name: "Perpétuité croissante", formula: "V = C / (r − g)" },
    { name: "CAPM", formula: "Ke = Rf + β × ERP" },
    { name: "WACC", formula: "(E/V) × Ke + (D/V) × Kd × (1 − t)", note: "valeurs de MARCHÉ" },
    { name: "Beta délevé", formula: "βu = βl / [1 + (1 − t) × D/E]" },
    { name: "Règle des 72", formula: "Années pour doubler ≈ 72 / taux (%)" },
  ]},
  { theme: "Valorisation", items: [
    { name: "Bridge", formula: "EV = Equity + Dette − Cash + Minoritaires (− Associates)" },
    { name: "UFCF", formula: "EBIT × (1 − t) + D&A − Capex − ΔBFR" },
    { name: "Terminal value (Gordon)", formula: "TV = UFCF final × (1 + g) / (WACC − g)", note: "à ACTUALISER ensuite !" },
    { name: "Multiple → prix", formula: "EBITDA × multiple = EV → − dette nette → Equity → ÷ actions" },
  ]},
  { theme: "M&A / LBO", items: [
    { name: "Goodwill", formula: "Prix payé − Fair value des actifs nets identifiables", note: "DTL du step-up : step-up × t" },
    { name: "Accretion (cash/dette)", formula: "Accretif si NI cible / Prix > Kd × (1 − t)" },
    { name: "Accretion (all-stock)", formula: "Accretif si P/E acquéreur > P/E payé" },
    { name: "MOIC", formula: "Equity sortie / Equity investie" },
    { name: "IRR ← MOIC", formula: "IRR ≈ MOIC^(1/années) − 1", note: "2x/5a≈15% · 2x/3a≈26% · 3x/5a≈25%" },
    { name: "Prix des actions au closing", formula: "EV − Dette nette ± (BFR réel − BFR normatif)" },
  ]},
];

const CHEATS: { title: string; emoji: string; lines: string[] }[] = [
  { title: "Walk me through the 3 statements (30 sec)", emoji: "🔗", lines: [
    "IS : performance sur une période, revenue → net income.",
    "BS : photo — Actif = Passif + Equity.",
    "CFS : NI → cash réel via operations / investing / financing.",
    "Liens : NI → CFS ligne 1 + retained earnings ; cash final CFS → bilan.",
  ]},
  { title: "D&A +10 (impôt 25%) — le réflexe", emoji: "⚡", lines: [
    "IS : EBIT −10 → NI −7,5.",
    "CFS : −7,5 + 10 (non-cash) → cash +2,5.",
    "BS : PP&E −10, cash +2,5 = actif −7,5 ; RE −7,5. Balance ✓.",
    "Toujours conclure : « the balance sheet balances »." ,
  ]},
  { title: "Walk me through a DCF (90 sec)", emoji: "📉", lines: [
    "1. Project UFCF 5-10 ans (EBIT(1−t) + D&A − capex − ΔBFR).",
    "2. Terminal value : Gordon (g 2-3%) ou exit multiple — cross-check.",
    "3. Discount all at WACC → EV.",
    "4. Bridge : − net debt, − minorities → equity value.",
    "5. ÷ diluted shares → prix. 6. Sensibilités WACC × g.",
  ]},
  { title: "Paper LBO (5 étapes)", emoji: "🏗️", lines: [
    "1. Entrée : EV = EBITDA × multiple ; split dette/equity.",
    "2. Projeter l'EBITDA (1,05⁵≈1,28 ; 1,10⁵≈1,61).",
    "3. FCF cumulé → debt paydown.",
    "4. Sortie : EBITDA final × multiple ; equity = EV − dette restante.",
    "5. MOIC → IRR (repères) + phrase de jugement.",
  ]},
  { title: "Tell me about a deal (2 min)", emoji: "📰", lines: [
    "1. Faits : acquéreur, cible, prix, multiple, financement.",
    "2. Rationale : 2 mécanismes concrets.",
    "3. Valo : prime vs unaffected, multiple vs comps.",
    "4. Risques : antitrust, intégration, cycle.",
    "5. TON avis tranché.",
  ]},
  { title: "Question inconnue — le protocole anti-bullshit", emoji: "🛡️", lines: [
    "1. Ne JAMAIS inventer.",
    "2. Clarifier si légitime (« cash deal ou stock deal ? »).",
    "3. Raisonner à voix haute depuis les principes.",
    "4. Assumer : « I'm not certain, but my intuition is… »",
  ]},
];

const EXCEL: { cat: string; items: { k: string; v: string }[] }[] = [
  { cat: "Navigation & sélection", items: [
    { k: "Ctrl + flèches", v: "sauter aux bords d'une plage" },
    { k: "Ctrl + Maj + flèches", v: "sélectionner jusqu'au bord" },
    { k: "Ctrl + PgUp / PgDn", v: "changer d'onglet" },
    { k: "F5 puis Entrée", v: "revenir à la cellule précédente" },
    { k: "Ctrl + [", v: "aller aux antécédents d'une formule (audit)" },
  ]},
  { cat: "Édition & format", items: [
    { k: "F2", v: "inspecter/éditer la formule" },
    { k: "F4", v: "figer les références $ · répéter la dernière action" },
    { k: "Ctrl + 1", v: "boîte de format" },
    { k: "Alt + E + S", v: "collage spécial (valeurs, formats)" },
    { k: "Alt + =", v: "somme automatique" },
  ]},
  { cat: "Fonctions du financier", items: [
    { k: "INDEX + MATCH / XLOOKUP", v: "recherches robustes (jamais VLOOKUP à numéro de colonne)" },
    { k: "SUMIFS", v: "agrégations conditionnelles" },
    { k: "NPV / IRR / XIRR", v: "flux actualisés (XIRR pour dates irrégulières)" },
    { k: "IFERROR", v: "propreté des sorties" },
    { k: "Data table", v: "matrices de sensibilité (WACC × g)" },
  ]},
  { cat: "Règles d'or du modèle", items: [
    { k: "Couleurs", v: "bleu = inputs · noir = formules · vert = liens" },
    { k: "Zéro hardcode", v: "aucun chiffre en dur dans une formule" },
    { k: "Checks", v: "bilan balance ? sources = uses ? cellules d'alerte visibles" },
    { k: "Structure", v: "hypothèses / calculs / outputs séparés" },
  ]},
];

const CHECKLISTS: { title: string; emoji: string; items: string[] }[] = [
  { title: "Veille d'entretien (J-1)", emoji: "🎯", items: [
    "Mes 2 deals préparés : chiffres, rationale, avis — relus à voix haute",
    "Les 10 questions incontournables déroulées sans notes (FR + EN)",
    "3 infos marché fraîches (volumes M&A, taux, un deal de la semaine)",
    "Pourquoi CETTE banque : 2 deals du bureau + 1 contact rencontré",
    "Mes questions de fin préparées (2-3, spécifiques)",
    "Logistique : itinéraire/lien, tenue, CV imprimés, sommeil",
  ]},
  { title: "Analyser un deal en 15 min (deal memo)", emoji: "📰", items: [
    "Faits : acquéreur, cible, prix, multiple implicite, mode de paiement",
    "Prime vs cours non affecté",
    "Rationale annoncé — et le VRAI rationale selon toi",
    "Synergies annoncées vs prime payée (le test)",
    "Réaction du cours de l'acquéreur",
    "Obstacles : antitrust, financement, vote",
    "Ton verdict : bon deal pour qui ?",
  ]},
  { title: "Avant d'envoyer un livrable (le réflexe analyste)", emoji: "✅", items: [
    "Les chiffres croisés avec la source (deux fois)",
    "Le bilan balance / le bridge boucle",
    "Formats : unités, années, devises cohérentes",
    "Conclusion en première ligne",
    "Limites et hypothèses signalées",
    "Orthographe du nom du client (oui, vraiment)",
  ]},
  { title: "Due diligence — les angles d'attaque", emoji: "🔍", items: [
    "Qualité de l'EBITDA : one-offs, retraitements, QoE",
    "Conversion cash : capex réel, BFR normatif",
    "Concentration : clients, fournisseurs, hommes-clés",
    "Contrats : échéances, clauses de changement de contrôle",
    "Litiges, fiscal, conformité",
    "Synergies : bottom-up, pas top-down",
  ]},
];

const ERRORS: { err: string; fix: string }[] = [
  { err: "« L'EBITDA, c'est le cash flow »", fix: "Il ignore capex, BFR, impôts, intérêts. FCF = la vérité ; EBITDA = la comparabilité." },
  { err: "Oublier d'actualiser la terminal value", fix: "La TV est une valeur en année N : ÷ (1+WACC)ⁿ. L'oubli gonfle la valo de ~50%." },
  { err: "EV/Net income ou Price/EBITDA", fix: "Cohérence des périmètres : EV ↔ avant intérêts ; Equity ↔ après. Toujours." },
  { err: "« Accretif donc bon deal »", fix: "L'accretion est mécanique (financement pas cher). Le test : synergies actualisées vs prime payée." },
  { err: "Oublier le foregone interest dans un deal en cash", fix: "Le cash utilisé ne rapporte plus ses intérêts : à déduire du NI pro forma (après impôt)." },
  { err: "Valoriser une banque en EV/EBITDA", fix: "La dette est sa matière première : P/E, P/TBV vs ROE, DDM. Rien d'autre." },
  { err: "Déduire le niveau de BFR dans un DCF", fix: "Seule la VARIATION du BFR consomme/libère du cash." },
  { err: "Capitaliser l'EBITDA de pic d'une cyclique", fix: "Normaliser sur le cycle (mid-cycle earnings) — sinon value trap." },
  { err: "Beta brut d'un comparable endetté", fix: "Délever (βu = βl/[1+(1−t)D/E]), médiane, relever à la structure cible." },
  { err: "« Le vendeur garde le cash, donc l'EV ne change pas »", fix: "Les deals se négocient cash-free/debt-free : le mécanisme de prix (locked box / completion accounts) règle tout." },
];



const ACCESS_META: Record<ResourceAccess, { label: string; color: string }> = {
  gratuit: { label: "Gratuit", color: "green" },
  payant: { label: "Payant", color: "gold" },
  officiel: { label: "Source officielle", color: "purple" },
};

function Library() {
  const [access, setAccess] = useState<string>("all");
  const [cat, setCat] = useState<string>("all");

  const shown = useMemo(() =>
    RESOURCES.filter((r) =>
      (access === "all" || r.access === access) &&
      (cat === "all" || r.categories.includes(cat as never))),
    [access, cat]);

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {["all", "gratuit", "payant", "officiel"].map((a) => (
          <button key={a} onClick={() => setAccess(a)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${access === a ? "bg-accent/15 text-accent border-accent/40" : "border-border text-muted hover:text-ink"}`}>
            {a === "all" ? "Tous les accès" : ACCESS_META[a as ResourceAccess].label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5 mb-5">
        <button onClick={() => setCat("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${cat === "all" ? "bg-accent2/15 text-accent2 border-accent2/40" : "border-border text-muted hover:text-ink"}`}>
          Toutes catégories
        </button>
        {RESOURCE_CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${cat === c ? "bg-accent2/15 text-accent2 border-accent2/40" : "border-border text-muted hover:text-ink"}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {shown.map((r) => (
          <Card key={r.id} className="!p-4 flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="font-bold text-sm leading-snug">{r.name}</div>
                <div className="text-[11px] text-muted mt-0.5">{r.org}</div>
              </div>
              <Tag color={ACCESS_META[r.access].color}>{ACCESS_META[r.access].label}</Tag>
            </div>
            <p className="text-xs text-muted mt-2 leading-relaxed flex-1">{r.useHere}</p>
            <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-border">
              <div className="flex flex-wrap gap-1">
                {r.categories.map((c) => <span key={c} className="text-[10px] text-muted bg-surface2 rounded px-1.5 py-0.5">{c}</span>)}
              </div>
              {r.url
                ? <a href={r.url} target="_blank" rel="noreferrer noopener" className="text-xs font-bold text-accent hover:underline shrink-0">Ouvrir ↗</a>
                : <span className="text-[10px] text-muted shrink-0">lien non vérifié</span>}
            </div>
            <div className="text-[10px] text-muted mt-1">Vérifié : {r.verified}</div>
          </Card>
        ))}
      </div>
      {shown.length === 0 && <p className="text-sm text-muted text-center py-8">Aucune ressource avec ces filtres.</p>}

      <div className="mt-5 space-y-3">
        <Card className="!p-4">
          <div className="font-bold text-sm mb-2">Dans cette plateforme</div>
          <div className="grid md:grid-cols-3 gap-2 text-xs">
            <Link to="/glossary" className="text-accent hover:underline">Glossaire →</Link>
            <Link to="/redbook" className="text-accent hover:underline">Red Book Bank →</Link>
            <Link to="/dealroom" className="text-accent hover:underline">Deal Room →</Link>
            <Link to="/tools" className="text-accent hover:underline">Calculateurs →</Link>
            <Link to="/excel" className="text-accent hover:underline">Excel Lab →</Link>
            <Link to="/dealdocs" className="text-accent hover:underline">Documents du deal →</Link>
          </div>
        </Card>
        <Card className="border-gold/40 !p-4">
          <p className="text-xs text-muted leading-relaxed">
            📌 Ces références servent de <b>benchmark de curriculum</b>. Tout le contenu de cette plateforme
            (leçons, questions, cas, sociétés fictives) est original et reformulé — rien n'est copié de ces sources.
            Les ressources marquées « Payant » sont des programmes commerciaux tiers, signalés comme tels.
            Le contenu réglementaire est fourni à titre pédagogique et ne constitue pas un conseil juridique :
            vérifie toujours la source officielle et sa date de mise à jour.
          </p>
        </Card>
      </div>
    </div>
  );
}

export default function Resources() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Formules");
  return (
    <div>
      <PageTitle emoji="📚" title="Ressources" sub="Formules, cheat sheets, raccourcis Excel, checklists, erreurs classiques et bibliothèque — tout ce qu'on garde ouvert dans un onglet pendant la prépa." />
      <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${tab === t ? "bg-accent text-white" : "bg-surface2 text-muted hover:text-ink"}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "Formules" && (
        <div className="grid md:grid-cols-2 gap-4">
          {FORMULAS.map((g) => (
            <Card key={g.theme}>
              <div className="font-bold mb-3">{g.theme}</div>
              <div className="space-y-2.5">
                {g.items.map((f) => (
                  <div key={f.name} className="bg-surface2 rounded-lg p-2.5">
                    <div className="text-xs font-bold text-muted">{f.name}</div>
                    <div className="font-mono text-[13px] mt-0.5">{f.formula}</div>
                    {f.note && <div className="text-[11px] text-gold mt-0.5">⚠ {f.note}</div>}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "Cheat sheets" && (
        <div className="grid md:grid-cols-2 gap-4">
          {CHEATS.map((c) => (
            <Card key={c.title}>
              <div className="font-bold text-sm mb-2">{c.emoji} {c.title}</div>
              <ul className="space-y-1.5">{c.lines.map((l, i) => <li key={i} className="text-[13px] leading-snug text-ink/90">{l}</li>)}</ul>
            </Card>
          ))}
        </div>
      )}

      {tab === "Excel" && (
        <div className="grid md:grid-cols-2 gap-4">
          {EXCEL.map((g) => (
            <Card key={g.cat}>
              <div className="font-bold mb-3">{g.cat}</div>
              <div className="space-y-1.5">
                {g.items.map((it) => (
                  <div key={it.k} className="flex gap-3 text-[13px]">
                    <span className="font-mono font-bold text-accent shrink-0 w-40">{it.k}</span>
                    <span className="text-muted">{it.v}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
          <Card className="md:col-span-2 border-accent2/40">
            <p className="text-sm text-muted">🎓 Le chapitre <Link to="/academy/c72" className="text-accent hover:underline">« Excel & modélisation »</Link> (Académie, niveau 7) met tout ça en pratique avec exercices et mini-cas d'audit de modèle.</p>
          </Card>
        </div>
      )}

      {tab === "Checklists" && (
        <div className="grid md:grid-cols-2 gap-4">
          {CHECKLISTS.map((c) => (
            <Card key={c.title}>
              <div className="font-bold text-sm mb-3">{c.emoji} {c.title}</div>
              <ul className="space-y-1.5">{c.items.map((it, i) => <li key={i} className="text-[13px] text-ink/90">☐ {it}</li>)}</ul>
            </Card>
          ))}
        </div>
      )}

      {tab === "Erreurs & FAQ" && (
        <div className="space-y-3">
          {ERRORS.map((e, i) => (
            <Card key={i} className="!p-4">
              <div className="text-sm font-bold text-red">❌ {e.err}</div>
              <div className="text-sm text-ink/90 mt-1">✅ {e.fix}</div>
            </Card>
          ))}
        </div>
      )}

      {tab === "Bibliothèque" && <Library />}

    </div>
  );
}
