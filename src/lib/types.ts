// ─── M&A Training Lab — Data model ──────────────────────────────────────────

export type Topic =
  | "accounting"
  | "valuation"
  | "dcf"
  | "comps"
  | "precedents"
  | "mna-process"
  | "accretion-dilution"
  | "lbo"
  | "capital-markets"
  | "industry"
  | "behavioral"
  | "deal-awareness"
  | "foundations"
  | "corp-finance";

export type Difficulty = 1 | 2 | 3 | 4; // 1 = beginner … 4 = professional

// ─── Quiz items (used by Daily Drill, Micro Lessons, Boss Fights) ───────────
export type QuizItem =
  | {
      id: string;
      kind: "mcq";
      topic: Topic;
      tags: string[];
      difficulty: Difficulty;
      prompt: string;
      choices: string[];
      answer: number; // index in choices
      explanation: string;
      trap?: boolean;
    }
  | {
      id: string;
      kind: "numeric";
      topic: Topic;
      tags: string[];
      difficulty: Difficulty;
      prompt: string;
      answer: number;
      tolerance?: number; // absolute tolerance, default 0.01
      unit?: string;
      explanation: string;
      trap?: boolean;
    }
  | {
      id: string;
      kind: "open";
      topic: Topic;
      tags: string[];
      difficulty: Difficulty;
      prompt: string;
      keywords: string[]; // used by the heuristic grader
      modelAnswer: string;
      explanation?: string;
      trap?: boolean;
    };

// ─── Flashcards ──────────────────────────────────────────────────────────────
export interface Flashcard {
  id: string;
  deck: string;
  front: string;
  back: string;
  tags: string[];
}

// ─── Red Book Training Bank ─────────────────────────────────────────────────
export interface BankQuestion {
  id: string;
  category: string; // Accounting, Valuation, M&A, LBO, Capital Markets, Industry, Behavioral
  sub: string;
  difficulty: Difficulty;
  frequency: "très fréquente" | "fréquente" | "occasionnelle";
  question: string;
  shortAnswer: string;
  fullAnswer: string;
  intuition?: string;
  example?: string;
  trap?: string;
  tags: string[];
  english?: boolean; // question typically asked in English
}

// ─── Micro lessons ───────────────────────────────────────────────────────────
export type LessonStep =
  | { type: "challenge"; quizId: string }
  | { type: "explain"; title: string; body: string } // mini-explication (<= 20% of the lesson)
  | { type: "practice"; quizId: string }
  | { type: "interview"; question: string; modelAnswer: string; keywords: string[] };

export interface MicroLesson {
  id: string;
  moduleId: string;
  title: string;
  minutes: number;
  xp: number;
  steps: LessonStep[];
  flashcardIds: string[]; // auto-added to review queue on completion
}

// ─── Learning path ───────────────────────────────────────────────────────────
export interface Module {
  id: string;
  order: number;
  title: string;
  emoji: string;
  topic: Topic;
  description: string;
  lessonIds: string[];
  bossId?: string;
  week: number; // week in the 8-week plan
}

// ─── Analyst Desk missions ───────────────────────────────────────────────────
export interface Mission {
  id: string;
  from: string; // "Ton Associate", "Le VP"…
  title: string;
  topic: Topic;
  difficulty: Difficulty;
  minutes: number;
  context: string;
  data: { label: string; value: string }[];
  task: string;
  hints: string[];
  modelAnswer: string;
  rubric: string[]; // self-check criteria
  keywords: string[];
  flashcardId?: string;
  xp: number;
}

// ─── Deal Room case studies ──────────────────────────────────────────────────
export interface CaseQuestion {
  q: string;
  hint?: string;
  modelAnswer: string;
  keywords: string[];
  points: number;
}

export interface CaseStudy {
  id: string;
  title: string;
  level: "beginner" | "intermediate" | "advanced" | "professional";
  sector: string;
  minutes: number;
  disclaimer?: string;
  context: string;
  buyer: string;
  target: string;
  financials: { label: string; value: string }[];
  synergies?: string;
  risks?: string;
  questions: CaseQuestion[];
  xp: number;
}

// ─── Interview Arena ─────────────────────────────────────────────────────────
export interface ArenaTurn {
  question: string;
  english?: boolean;
  keywords: string[]; // concepts a good answer must contain
  redFlags?: string[]; // words indicating bullshit / bad instinct
  idealLengthWords?: [number, number];
  modelAnswer: string;
  followUp?: string;
  clarifyOk?: boolean; // asking for clarification is the right move
}

export interface ArenaSession {
  id: string;
  title: string;
  interviewer: string;
  persona: string; // description of the interviewer style
  mode: "technical" | "fit" | "deal" | "stress" | "full" | "bullshit";
  difficulty: Difficulty;
  turns: ArenaTurn[];
  xp: number;
}

// ─── Boss fights ─────────────────────────────────────────────────────────────
export interface BossFight {
  id: string;
  moduleId: string;
  title: string;
  emoji: string;
  timeLimitMin: number;
  passScore: number; // 75
  quizIds: string[];
  writtenQuestion: { q: string; modelAnswer: string; keywords: string[] };
  badge: string;
  xp: number;
}

// ─── Glossary ────────────────────────────────────────────────────────────────
export interface GlossaryTerm {
  id: string;
  term: string;
  fr?: string;
  definition: string;
  interviewVersion: string;
  formula?: string;
  example?: string;
  commonMistake?: string;
  tags: string[];
}

// ─── Study plan ──────────────────────────────────────────────────────────────
export interface PlanWeek {
  week: number;
  title: string;
  goal: string;
  moduleIds: string[];
  dailyRoutine: string[];
  weekend: string[];
}
