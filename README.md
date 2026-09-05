# 📈 M&A Training Lab — Road to M&A Analyst

Simulateur d'entraînement M&A gamifié : Duolingo × Anki × Brilliant, pour être prêt en entretien fin août.
**80% pratique / 20% théorie** — chaque notion commence par un challenge, jamais par un cours.

## 🚀 Lancer le projet

Prérequis : **Node ≥ 18** (installé ici : `~/.local/node20`).

```bash
cd ma-training-lab
export PATH="$HOME/.local/node20/bin:$PATH"   # utiliser Node 20
npm install                                    # première fois seulement
npm run dev                                    # → http://localhost:5173
```

Build de production : `npm run build` (sortie dans `dist/`, hébergeable n'importe où — Netlify, Vercel, GitHub Pages).

> 💡 Le dossier étant sur iCloud Drive, `node_modules` est un symlink vers
> `node_modules.nosync` pour éviter la synchronisation de 30 000 fichiers.

## 🗺️ Ce qui est fonctionnel

| Mode | Contenu |
|---|---|
| **Dashboard** | Readiness Score, scores par compétence, Weakness Detector, streak, XP, badges, J-x avant fin août |
| **Learning Path** | 17 modules · 20 micro-leçons interactives (challenge → tentative → indice → correction → question d'entretien) |
| **Daily Drill** | Routine quotidienne 10-15 min : 5 flashcards + 3 techniques + 1 calcul + 1 deal + 1 piège + 1 fit — **pondérée par tes erreurs** |
| **Analyst Desk** | 10 missions réalistes (calcul d'EV, quick DCF, paper LBO, deal memo…) avec données, indices, correction, rubrique |
| **Deal Room** | 12 case studies (3 par niveau : beginner → professional), secteurs variés, corrections détaillées |
| **Interview Arena** | 7 interviewers scriptés (RH → MD), dont **Don't Bullshit Mode** — scoring : concepts, concision, red flags, clarification |
| **Boss Fights** | 7 boss chronométrés (≥75% pour valider), badges, plan de correction en cas d'échec |
| **Flashcards** | 15 decks, 480+ cartes (130 natives + 220 Red Book + 102 glossaire), répétition espacée type SM-2 |
| **Red Book Bank** | 220 questions reformulées du programme WSP : réponse courte/complète, intuition, piège, fréquence, Practice / Add to Flashcards / Mark as Weak |
| **Glossaire** | 102 termes : définition, version entretien (EN), formule, exemple, erreur fréquente |
| **Plan 8 semaines** | Programme jusqu'à fin août, routine quotidienne + week-ends, suivi de progression |

Progression sauvegardée en **localStorage** (clé `ma-training-lab-v1`). Zustand + persist → prêt à migrer vers un backend (il suffit de remplacer le storage adapter).

## 🧠 Architecture

```
src/
├── lib/          types.ts · grader.ts (coach heuristique) · aiClient.ts (stub API IA) · cards.ts
├── store/        progress.ts (XP, streak, SRS, weakness detector — zustand persist)
├── data/         quiz.ts · flashcards.ts · bank1-3.ts (Red Book) · glossary.ts
│                 missions.ts · cases.ts · arena.ts · curriculum.ts (modules/leçons/boss/plan)
├── components/   ui.tsx · QuizPlayer.tsx · OpenAnswer.tsx
└── pages/        18 pages (Dashboard, Path, Drill, Desk, DealRoom, Arena, Boss, …)
```

## ➕ Ajouter ton propre contenu (PDF, notes, vidéos retranscrites)

Tout le contenu pédagogique est dans `src/data/` en TypeScript typé — aucune base de données :

1. **Nouvelles questions d'entretien** → ajoute des entrées dans `bank3.ts` (helper `q(...)`) : elles apparaissent automatiquement dans la banque, les filtres et le deck de flashcards Red Book.
2. **Nouvelles flashcards** → `flashcards.ts`, helper `c(id, deck, front, back)`.
3. **Nouveaux exercices/QCM** → `quiz.ts` (mcq / numeric / open) : réutilisables dans leçons, drills et boss (référence par id).
4. **Nouvelle micro-leçon** → `curriculum.ts`, helper `L(...)` : compose des steps `challenge/explain/practice/interview` à partir des ids de quiz.
5. **Depuis un PDF/notes** : extrais le texte (ex. `pypdf`), reformule chaque notion en 1 question + 1 réponse courte + 1 réponse complète, et colle-les dans le format ci-dessus. Ne copie jamais des passages entiers de contenus protégés — reformule.

## 🤖 Coach IA (intégré !)

Le coach IA est branché via le SDK officiel `@anthropic-ai/sdk` (`src/lib/aiClient.ts`) :

1. Crée une clé API sur **console.anthropic.com** → API Keys
2. Dans l'app : **Profil → Coach IA** → colle la clé → « Enregistrer & tester »
3. Débloqué : **Entretien Live IA** (Arena → carte violette : 5 interviewers conversationnels qui s'adaptent à tes réponses + débrief noté) et **correction IA** de toutes les réponses libres (missions, boss, arena scriptée, leçons) — fallback automatique sur le grader heuristique en cas d'erreur.

Modèle par défaut : `claude-opus-4-8` (sélecteur dans les réglages : Sonnet 4.6 / Haiku 4.5 pour réduire les coûts). Les appels utilisent les structured outputs (`output_config.format`) pour un scoring JSON fiable, et l'adaptive thinking pour l'interviewer.

⚠️ **Sécurité** : la clé est stockée en localStorage et les appels partent du navigateur (`dangerouslyAllowBrowser`) — OK pour un usage personnel en local, mais ne déploie JAMAIS ce site publiquement tel quel. Pour un déploiement, déplace les appels dans un petit proxy backend (Cloudflare Worker / Vercel Function) qui garde la clé côté serveur.

## ⚠️ Notes

- Cas et chiffres **fictifs et pédagogiques** ; questions Red Book **reformulées** (pas de copie).
- L'input vocal (Oral Answer Trainer) est prévu dans l'architecture : ajouter la Web Speech API dans `OpenAnswer.tsx` (`webkitSpeechRecognition` → remplit le textarea).
