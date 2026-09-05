import type { QuizItem } from "../../lib/types";

// ─── Académie : modèle de données ───────────────────────────────────────────
// Chaque chapitre suit le template complet : explication simple → approfondie
// → visuels → exemples → quiz → exercices variés → mini-cas.

export type Exercise =
  | { kind: "tf"; title: string; statements: { text: string; answer: boolean; explain: string }[] }
  | { kind: "order"; title: string; prompt: string; items: string[]; explain: string } // items fournis DANS L'ORDRE CORRECT ; le player les mélange
  | { kind: "gap"; title: string; prompt: string; template: string; blanks: { options: string[]; correct: number }[]; explain: string }; // template avec ◻ dans l'ordre des blanks

export type DiagramSpec =
  | { type: "bridge"; title: string; unit?: string; items: { label: string; value: number; kind: "base" | "add" | "sub" | "total" }[] }
  | { type: "stack"; title: string; stacks: { name: string; layers: { label: string; note?: string; color?: string }[] }[] }
  | { type: "flow"; title: string; steps: { label: string; note?: string }[] };

export interface MiniCase {
  context: string;
  task: string;
  hints: string[];
  modelAnswer: string;
  keywords: string[];
}

export interface Chapter {
  id: string;
  level: number;
  title: string;
  emoji: string;
  minutes: number;
  xp: number;
  hook: string; // l'accroche : pourquoi ce chapitre compte
  simple: string; // explication zéro-jargon (paragraphes séparés par \n\n)
  analogy: string; // l'analogie de la vie réelle
  deep: string; // la version approfondie
  traps: string[]; // pièges, exceptions
  mnaUse: string; // quand/comment c'est utilisé en M&A + en entretien
  diagrams: DiagramSpec[];
  examples: { title: string; body: string }[];
  quizIds: string[]; // items du quiz bank existant
  extraQuiz?: QuizItem[]; // items propres au chapitre
  exercises: Exercise[];
  miniCase: MiniCase;
}

export interface AcademyLevel {
  level: number;
  title: string;
  emoji: string;
  tagline: string;
}

export const LEVELS_META: AcademyLevel[] = [
  { level: 1, title: "Fondamentaux", emoji: "🌱", tagline: "La finance et le métier, expliqués à quelqu'un qui part de zéro." },
  { level: 2, title: "Comptabilité", emoji: "📒", tagline: "Les 3 états financiers : le langage que tu dois parler couramment." },
  { level: 3, title: "Corporate Finance", emoji: "🧮", tagline: "La valeur du temps, du risque et du capital." },
  { level: 4, title: "Valorisation", emoji: "⚖️", tagline: "Combien vaut une entreprise — les 3 méthodes et leurs pièges." },
  { level: 5, title: "M&A", emoji: "🤝", tagline: "Le process, la due diligence, le purchase accounting, l'accretion." },
  { level: 6, title: "LBO", emoji: "🏗️", tagline: "Acheter avec de la dette : mécanique, returns, paper LBO." },
  { level: 7, title: "Private Equity & Outils", emoji: "💼", tagline: "L'industrie du PE, et Excel comme un analyste." },
  { level: 8, title: "Entretiens techniques", emoji: "🎤", tagline: "Convertir tes connaissances en offres de stage." },
  { level: 9, title: "Simulation de stage", emoji: "🏦", tagline: "Ta première semaine au desk, en immersion." },
];
