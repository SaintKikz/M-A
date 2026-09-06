import { useMemo, useState } from "react";
import { Card, PageTitle, Btn, Tag, ScoreRing } from "../components/ui";

// ─── Contrôle qualité : la compétence qui rend ton travail envoyable ────────

const PPT_CHECK = [
  "Le titre porte le MESSAGE, pas une description du contenu",
  "Date, numéro de page et mention de confidentialité présents partout",
  "Même police, mêmes tailles, même hiérarchie sur tout le deck",
  "Décimales, devises, unités et signes cohérents d'une page à l'autre",
  "Graphiques : axes, légende, période, unité et source corrects",
  "Tableaux : totaux, CAGR, multiples et colonnes d'estimés alignés",
  "Chaque chiffre sensible recroisé avec sa source Excel",
  "Logos, noms de sociétés et tickers exacts",
  "Aucun commentaire interne ni note de travail oubliés",
  "Alignement et espacement vérifiés à fort zoom",
  "Sources et notes de bas de page lisibles et datées",
  "PDF final relu page par page — pas seulement le fichier PowerPoint",
];

const MODEL_CHECK = [
  "Le bilan balance (check = 0) sur toutes les périodes",
  "Sources = Uses dans le tableau de financement",
  "Formules cohérentes horizontalement ET verticalement",
  "Aucun hardcode accidentel dans une ligne de formules",
  "Aucune erreur #REF! / #VALUE! / #DIV/0! masquée par un IFERROR",
  "Dates et périodes cohérentes (LTM / FY / CY)",
  "Convention de signe documentée et appliquée partout",
  "Unités et devises identiques entre inputs et outputs",
  "Les sensibilités sont réellement reliées aux hypothèses",
  "Les sorties du deck pointent vers les bonnes cellules de la bonne version",
  "Échéancier de dette et cash sweep sans circularité non maîtrisée",
  "Tous les checks critiques visibles à côté des outputs",
];

// Exercice « repère les erreurs » : 5 vraies erreurs sur 8 propositions
const SLIDE_ITEMS: { text: string; error: boolean; why: string }[] = [
  { text: "La source du graphique n'est pas indiquée", error: true, why: "Tout graphique doit citer sa source et sa date — c'est la première chose que vérifie un VP." },
  { text: "Le logo de la cible est légèrement plus grand que celui de l'acquéreur", error: false, why: "Une différence de taille de logo n'est pas une erreur en soi, tant que le rendu reste équilibré." },
  { text: "Le CAGR affiché ne correspond pas aux chiffres du tableau", error: true, why: "Incohérence chiffrée : c'est l'erreur la plus grave, elle décrédibilise toute la page." },
  { text: "La couleur de 2027E diffère de 2026E sans raison", error: true, why: "Un changement de couleur doit porter du sens (réel vs estimé). Sinon c'est du bruit visuel." },
  { text: "La marge d'EBITDA est calculée sur le chiffre d'affaires", error: false, why: "C'est la définition normale de la marge d'EBITDA. Aucun problème." },
  { text: "Le titre annonce FY25 alors que le tableau contient FY26E", error: true, why: "Le titre ment sur le contenu : erreur de relecture typique après une mise à jour." },
  { text: "La note de bas de page contient encore « TBD »", error: true, why: "Un « TBD » qui part chez le client, c'est un travail visiblement non terminé." },
  { text: "Les montants sont exprimés en M€ et l'indiquent en en-tête", error: false, why: "C'est exactement la bonne pratique : unité annoncée une fois, en en-tête." },
];

const COMMENTS: { from: string; role: string; text: string; tasks: string[] }[] = [
  {
    from: "Camille", role: "Associate",
    text: "Can you roll the comps, add FY27E and make sure the football field ties to the updated median before sending a clean PDF?",
    tasks: [
      "Mettre à jour les données de marché et les EV des comparables",
      "Ajouter la colonne FY27E partout où c'est pertinent",
      "Recalculer les médianes et la valorisation implicite",
      "Vérifier que le football field reflète bien la nouvelle médiane",
      "Contrôle qualité du deck, puis export PDF",
    ],
  },
  {
    from: "Thomas", role: "VP",
    text: "Client wants the merger case at €42/share, 60% cash / 40% stock. Also show EPS impact with and without synergies.",
    tasks: [
      "Changer le prix d'offre à 42 €/action",
      "Ajuster le mix de financement à 60/40",
      "Recalculer le financement et les actions nouvellement émises",
      "Reprendre le PPA et l'impact sur l'EPS",
      "Créer deux cas : avec et sans synergies",
      "Vérifier la cohérence de l'accretion/dilution obtenue",
    ],
  },
  {
    from: "Élisabeth", role: "MD",
    text: "Give me three bullets on why Buyer A should stretch versus Buyer B before the call.",
    tasks: [
      "Comparer le fit stratégique des deux acheteurs",
      "Comparer les synergies et la capacité à payer",
      "Comparer le financement et la certitude d'exécution",
      "Formuler 3 bullets chiffrés et orientés décision",
    ],
  },
];

function Checklist({ title, items, hint }: { title: string; items: string[]; hint: string }) {
  const [done, setDone] = useState<string[]>([]);
  const toggle = (x: string) => setDone(done.includes(x) ? done.filter((d) => d !== x) : [...done, x]);
  return (
    <Card>
      <div className="flex justify-between items-center gap-3 mb-1">
        <div className="font-bold">{title}</div>
        <Tag color={done.length === items.length ? "green" : "muted"}>{done.length}/{items.length}</Tag>
      </div>
      <p className="text-xs text-muted mb-3">{hint}</p>
      <div className="space-y-1">
        {items.map((x) => (
          <label key={x} className="flex gap-3 items-start rounded-lg hover:bg-surface2 p-2 -mx-2 cursor-pointer">
            <input type="checkbox" checked={done.includes(x)} onChange={() => toggle(x)} className="mt-0.5 accent-[var(--color-accent)]" />
            <span className={`text-sm ${done.includes(x) ? "text-muted line-through" : ""}`}>{x}</span>
          </label>
        ))}
      </div>
      {done.length === items.length && (
        <div className="mt-3 text-xs text-green font-semibold">✓ Checklist complète — le livrable est envoyable.</div>
      )}
    </Card>
  );
}

function SpotTheErrors() {
  const [picked, setPicked] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const toggle = (i: number) => !checked && setPicked(picked.includes(i) ? picked.filter((p) => p !== i) : [...picked, i]);

  const score = useMemo(() => {
    const tp = SLIDE_ITEMS.filter((o, i) => o.error && picked.includes(i)).length;
    const fp = SLIDE_ITEMS.filter((o, i) => !o.error && picked.includes(i)).length;
    const fn = SLIDE_ITEMS.filter((o, i) => o.error && !picked.includes(i)).length;
    return Math.round((tp / Math.max(1, tp + fp + fn)) * 100);
  }, [picked]);

  const nErrors = SLIDE_ITEMS.filter((o) => o.error).length;

  return (
    <div>
      <Card className="mb-4 !p-4 border-accent/30">
        <p className="text-sm">
          <b>La page à relire.</b> Un projet de slide de valorisation, avec un graphique de chiffre d'affaires,
          un tableau FY24-FY27E et un football field. Coche <b>tout ce qui doit être corrigé</b> avant envoi —
          il y a {nErrors} vrais problèmes, et des propositions qui n'en sont pas.
        </p>
      </Card>

      {checked && (
        <Card className="mb-4 text-center">
          <div className="flex flex-col items-center gap-2">
            <ScoreRing score={score} size={92} />
            <div className="font-bold text-sm">
              {score >= 80 ? "Œil d'analyste — tu peux relire un deck."
               : score >= 50 ? "Correct, mais tu laisses passer ou tu sur-signales."
               : "À retravailler : signaler du faux coûte autant que rater du vrai."}
            </div>
            <p className="text-xs text-muted max-w-md">
              Le score pénalise les erreurs manquées ET les faux positifs. En vrai, un analyste qui « corrige »
              ce qui va bien fait perdre autant de temps que celui qui rate une incohérence.
            </p>
          </div>
        </Card>
      )}

      <div className="space-y-2">
        {SLIDE_ITEMS.map((o, i) => {
          const sel = picked.includes(i);
          const right = checked && sel === o.error;
          return (
            <button key={o.text} onClick={() => toggle(i)} disabled={checked}
              className={`w-full text-left rounded-xl border px-4 py-3 transition-colors disabled:cursor-default ${
                checked ? (right ? "border-green/50 bg-green/5" : "border-red/50 bg-red/5")
                        : sel ? "border-accent bg-accent/10" : "border-border bg-surface hover:border-accent/40"}`}>
              <div className="flex items-start gap-3">
                <span className={`shrink-0 w-5 h-5 rounded border flex items-center justify-center text-xs ${sel ? "bg-accent border-accent text-white" : "border-border"}`}>
                  {sel ? "✓" : ""}
                </span>
                <div className="min-w-0">
                  <div className="text-sm">{o.text}</div>
                  {checked && (
                    <div className={`text-xs mt-1 ${o.error ? "text-green" : "text-muted"}`}>
                      {o.error ? "⚠️ Vraie erreur. " : "✓ Pas une erreur. "}{o.why}
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex gap-2">
        {!checked
          ? <Btn onClick={() => setChecked(true)} disabled={picked.length === 0}>Valider ma relecture →</Btn>
          : <Btn kind="ghost" onClick={() => { setPicked([]); setChecked(false); }}>Recommencer 🔁</Btn>}
      </div>
    </div>
  );
}

function CommentsSimulation() {
  const [idx, setIdx] = useState(0);
  const [show, setShow] = useState(false);
  const c = COMMENTS[idx];
  return (
    <div>
      <Card className="mb-4 !p-4 border-accent/30">
        <p className="text-sm">
          <b>Décoder une demande.</b> Un senior écrit trois lignes. Derrière, il y a une liste de tâches précise
          et un ordre. Lis le message, liste mentalement ce que tu dois faire, puis compare.
        </p>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Tag color={c.role === "MD" ? "gold" : c.role === "VP" ? "purple" : "accent"}>{c.role}</Tag>
          <span className="text-sm font-semibold">{c.from}</span>
        </div>
        <p className="text-sm italic bg-surface2 rounded-xl px-4 py-3 leading-relaxed">« {c.text} »</p>

        {!show ? (
          <div className="mt-4"><Btn onClick={() => setShow(true)}>Voir la décomposition →</Btn></div>
        ) : (
          <div className="mt-4 fade-up">
            <div className="text-xs font-bold text-muted uppercase tracking-wide mb-2">Ce que ça veut dire, dans l'ordre</div>
            <ol className="space-y-1.5">
              {c.tasks.map((t, i) => (
                <li key={t} className="flex gap-3 text-sm">
                  <span className="text-accent font-mono shrink-0">{i + 1}.</span>{t}
                </li>
              ))}
            </ol>
            <p className="text-xs text-muted mt-3 border-t border-border pt-3">
              💡 Le réflexe : reformuler la demande en tâches AVANT de commencer, et confirmer au senior si un
              point est ambigu. Cinq minutes de clarification valent mieux que deux heures dans la mauvaise direction.
            </p>
          </div>
        )}

        <div className="flex gap-2 mt-4 pt-3 border-t border-border">
          {COMMENTS.map((_, i) => (
            <button key={i} onClick={() => { setIdx(i); setShow(false); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${i === idx ? "bg-accent/15 text-accent border-accent/40" : "border-border text-muted hover:text-ink"}`}>
              Message {i + 1}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

const TABS = [
  ["ppt", "Checklist PowerPoint"],
  ["model", "Checklist modèle"],
  ["spot", "Repère les erreurs"],
  ["comments", "Décoder un commentaire"],
] as const;

export default function QualityControl() {
  const [tab, setTab] = useState<(typeof TABS)[number][0]>("ppt");
  return (
    <div>
      <PageTitle emoji="✅" title="Contrôle qualité" sub="La compétence qui fait qu'un Associate peut envoyer ton travail sans tout refaire. Relecture de deck, audit de modèle, et lecture des demandes seniors." />

      <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
        {TABS.map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${tab === id ? "bg-accent text-white" : "bg-surface2 text-muted hover:text-ink"}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === "ppt" && <Checklist title="Avant d'envoyer un deck" items={PPT_CHECK} hint="À dérouler intégralement avant chaque envoi. Coche au fur et à mesure." />}
      {tab === "model" && <Checklist title="Avant d'envoyer un modèle" items={MODEL_CHECK} hint="Un modèle qui ne passe pas ces points ne doit pas quitter ton poste." />}
      {tab === "spot" && <SpotTheErrors />}
      {tab === "comments" && <CommentsSimulation />}
    </div>
  );
}
