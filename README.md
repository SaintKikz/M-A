# 📈 M&A Training Lab — Road to M&A Analyst

Plateforme d'entraînement M&A / Investment Banking en français. L'objectif n'est pas de
réviser des fiches : c'est d'être **desk-ready** — capable de produire le travail d'un
analyste sous contrainte de temps, pas seulement d'expliquer les concepts en entretien.

Le contenu s'organise sur quatre niveaux de maîtrise :

| Niveau | Ce que tu sais faire | Où ça s'entraîne |
|---|---|---|
| 1 — Le savoir | Expliquer le concept | Académie, Glossaire, Flashcards |
| 2 — Le calcul | Résoudre une question chiffrée | Daily Drill, Calculateurs |
| 3 — La construction | Bâtir l'analyse depuis des données brutes | Deal Room, Analyst Desk |
| 4 — L'exécution | Livrer juste, dans le bon ordre, à l'heure | **Analyst Day**, Boss fights |

---

## 🚀 Démarrage

Prérequis : **Node ≥ 18**.

```bash
npm install      # première fois seulement
npm run dev      # → http://localhost:5173
```

| Commande | Effet |
|---|---|
| `npm run dev` | Serveur de développement (accessible sur le réseau local) |
| `npm run build` | Typecheck + build de production dans `dist/` |
| `npm run preview` | Sert le build de production localement |
| `npm test` | Suite de tests (vitest) |
| `npm run test:watch` | Tests en mode watch |
| `npm run typecheck` | `tsc -b` seul |

---

## 🧱 Stack

- **React 18** + **TypeScript** (mode strict)
- **Vite 6** — build et dev server
- **Tailwind CSS v4** via `@tailwindcss/vite` (thème défini dans `src/index.css`, pas de `tailwind.config`)
- **React Router 6** — routes en `React.lazy` (code-splitting par page)
- **Zustand** + `persist` — état et progression en `localStorage`
- **Vitest** — tests des formules financières
- **@anthropic-ai/sdk** — Coach IA optionnel, chargé dynamiquement

---

## 🗂️ Architecture

```
src/
├── App.tsx              Shell, navigation, routes (lazy)
├── main.tsx             Point d'entrée
├── index.css            Thème Tailwind v4 (@theme) + animations
├── components/
│   ├── ui.tsx           Primitives : Card, Btn, Tag, Stat, ScoreRing…
│   ├── QuizPlayer.tsx   Moteur de quiz (mcq / numeric / open) + runner
│   ├── SearchPalette.tsx Recherche globale ⌘K (index construit à la demande)
│   ├── Radar.tsx        Radar SVG des compétences
│   ├── Diagram.tsx      Diagrammes pédagogiques (bridge, stack, flow)
│   ├── Assistant.tsx    Coach IA flottant
│   ├── OpenAnswer.tsx   Saisie + correction de réponse libre
│   └── ChapterExercises.tsx  Exercices vrai/faux, ordre, texte à trous
├── data/                TOUT le contenu (aucun contenu dans les composants)
│   ├── academy/         Chapitres théoriques par niveau (types.ts + chapters*.ts)
│   ├── quiz.ts          Items de quiz réutilisés partout
│   ├── bank1-3.ts       Red Book — banque de questions d'entretien
│   ├── curriculum.ts    Modules, micro-leçons, boss fights, plan 8 semaines
│   ├── glossary.ts      203 termes
│   ├── excel.ts         Raccourcis, conventions, formules, erreurs Excel
│   ├── dealdocs.ts      Les 20 documents d'un process M&A
│   ├── screening.ts     Simulateur de buyer screening
│   ├── analystday.ts    Scénarios de journée d'analyste
│   ├── resources.ts     Catalogue de ressources externes
│   ├── missions.ts / cases.ts / realdeals.ts / arena.ts / flashcards.ts
├── lib/
│   ├── finance.ts       ⭐ Toutes les formules financières (testées)
│   ├── finance.test.ts  30 tests sur les valeurs de référence
│   ├── grader.ts        Correction heuristique des réponses libres
│   ├── aiClient.ts      Coach IA (SDK chargé dynamiquement)
│   ├── coach.ts         Moteur de recommandations « quoi faire maintenant »
│   ├── cards.ts         Pool de flashcards (decks + Red Book + glossaire)
│   └── types.ts         Modèle de données
├── pages/               Une page par route
└── store/progress.ts    État persistant + SRS + scores de compétence
```

**Règle d'or** : le contenu vit dans `src/data/`, jamais en dur dans un composant.

---

## 🧮 Les formules financières

Tout calcul « sensible » passe par `src/lib/finance.ts`, avec conventions de signe
documentées et erreurs explicites sur entrée invalide. Couvert et testé :

- Bridge EV ↔ Equity (minoritaires, preferred, pensions, leases, associates)
- Actions diluées — Treasury Stock Method, RSU, convertibles
- CAPM, WACC, unlever/relever beta (Hamada)
- NPV, IRR (bissection), CAGR
- DCF : TV Gordon et exit multiple, convention mid-year, croissance implicite
- Prime d'acquisition
- Merger model : accretion/dilution cash/dette/titres, **break-even de synergies**
- LBO : échéancier de dette avec cash sweep, MOIC, IRR

```bash
npm test   # 30 tests
```

Ces fonctions alimentent directement la page **Outils** — les calculateurs et les tests
partagent le même code, donc un calculateur ne peut pas diverger silencieusement.

---

## ➕ Ajouter du contenu

### Un terme de glossaire — `src/data/glossary.ts`
```ts
g("g237", "Terme", "Définition en français.", "Interview version in English.",
  { formula: "…", example: "…", commonMistake: "…" }, ["valuation"]),
```
Vérifie qu'il n'existe pas déjà : les termes en double sont une dette silencieuse.

### Une question de quiz — `src/data/quiz.ts`
```ts
{ id: "ac30", kind: "mcq", topic: "accounting", tags: ["d&a"], difficulty: 2,
  prompt: "…", choices: ["…"], answer: 0, explanation: "…" }
```
`kind` accepte `mcq`, `numeric` (avec `tolerance`) et `open` (avec `keywords`).
Les réponses fausses partent automatiquement dans le Mistake Book.

### Une question d'entretien — `src/data/bank1.ts` (ou 2 / 3)
```ts
q("rb-a81", "Accounting", "Sous-thème", 2, "fréquente",
  "La question ?", "Réponse courte.", "Réponse complète.",
  { intuition: "…", trap: "…" }, ["tags"]),
```

### Un chapitre d'académie — `src/data/academy/chapters*.ts`
Suit l'interface `Chapter` : `hook`, `simple`, `analogy`, `deep`, `traps`, `mnaUse`,
`diagrams`, `examples`, `quizIds`, `exercises`, `miniCase`.

### Un cas — `src/data/cases.ts` · Un deal — `src/data/realdeals.ts`
Interface `CaseStudy`. Les deals réels portent un `disclaimer` et une date de données.

### Une journée d'analyste — `src/data/analystday.ts`
Ajoute un `DayScenario` avec ses `AnalystTask`. **Vérifie tes chiffres avec
`src/lib/finance.ts`** avant de les figer — c'est comme ça qu'une erreur de
break-even a été attrapée pendant le développement.

---

## 💾 Stockage de la progression

Tout est en `localStorage` sous la clé `ma-training-lab-v1`, via `zustand/persist`.
Aucun compte, aucun backend : l'app fonctionne hors ligne une fois chargée.

Ce qui est conservé : XP, niveau, streak, leçons/missions/cas/boss complétés,
états SRS des flashcards, statistiques par thème et par tag, scores par compétence,
Mistake Book, records du Shortcut Arena.

- **Export / import** : Paramètres → Export / import (fichier JSON).
- **Réinitialisation** : Paramètres → Zone dangereuse.
- La clé API du Coach IA est stockée séparément (`ma-lab-ai-config`) et n'est jamais
  incluse dans un export.

Pour brancher un backend plus tard (Supabase, Firebase), le point d'entrée unique est
`src/store/progress.ts` : remplacer le middleware `persist` suffit.

---

## 🤖 Coach IA (optionnel)

L'app fonctionne intégralement sans IA — la correction des réponses libres passe alors
par le grader heuristique de `src/lib/grader.ts`.

Avec une clé API Anthropic (Paramètres → Coach IA), tu débloques l'entretien live
conversationnel et une correction plus fine.

> ⚠️ **Sécurité** : la clé est stockée dans le navigateur et les appels partent du client
> (`dangerouslyAllowBrowser`). C'est acceptable pour un usage **personnel en local**.
> Sur un site public, toute personne qui visite la page pourrait extraire la clé si elle
> y est saisie — passe alors par un proxy backend (Cloudflare Worker, fonction serverless)
> qui garde la clé côté serveur.

---

## 🌐 Déploiement Netlify

`netlify.toml` est déjà configuré :

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

La règle de redirection (doublée dans `public/_redirects`) est indispensable : sans elle,
un rafraîchissement sur `/tools/dcf` renverrait un 404.

**Déployer :**
1. Connecte le dépôt sur Netlify — la configuration est lue automatiquement.
2. Ou en CLI : `npm run build && npx netlify deploy --prod --dir=dist`

Aucune variable d'environnement n'est requise.

---

## ⚖️ Contenu et sources

Tout le contenu pédagogique est **original** : leçons, questions, cas, sociétés fictives.
Les programmes cités dans Ressources (Wall Street Prep, Breaking Into Wall Street,
Training The Street, Macabacus, Damodaran…) servent de **benchmarks de curriculum** —
rien n'en est copié. Les ressources payantes sont signalées comme telles.

Les sociétés des cas et simulations (Aurelia Software, Nova Consumer, Helios Diagnostics,
Kestrel & Co.…) sont **fictives**. Les deals réels analysés reposent sur des informations
publiques, avec leur date.

Le contenu réglementaire (AMF, SEC, Takeover Code, merger control européen, IFRS) est
fourni **à titre pédagogique** avec sa source officielle et sa date de vérification.
Ce n'est pas un conseil juridique : vérifie toujours la source primaire à jour.
