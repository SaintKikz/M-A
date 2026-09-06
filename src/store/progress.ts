import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Topic } from "../lib/types";

// ─── Mistake Book ───────────────────────────────────────────────────────────
export interface MistakeEntry {
  qid: string;              // id de la question (quiz/bank/exercice)
  source: "drill" | "lesson" | "chapter" | "boss" | "diagnostic" | "arena" | "other";
  topic: string;            // catégorie de regroupement
  prompt: string;
  userAnswer: string;
  correctAnswer: string;
  explanation?: string;
  date: string;             // yyyy-mm-dd
  retried: boolean;
}

// ─── Livrables Excel (Project Atlas) ────────────────────────────────────────
// On ne stocke QUE des métadonnées : jamais le contenu du classeur.
export interface AtlasStoredIssue {
  area: string;
  title: string;
  detail: string;
  userValue?: string;
  expectedHint?: string;
  severity: "critical" | "major" | "minor";
  tag: string;
}

export interface AtlasAttempt {
  caseId: string;
  caseVersion?: string;
  graderVersion?: string;
  attemptId: string;
  timestamp: string;        // ISO
  score: number;
  accuracyScore: number;
  integrityScore: number;
  completionScore: number;
  qcScore: number;
  speedScore: number;
  rating?: string;
  /** Le classeur lui-même est-il de qualité certifiable ? */
  certifiable?: boolean;
  /** Certification OFFICIELLE : exige aussi une tentative non assistée. */
  certificationEligible?: boolean;
  certificationBlockers?: string[];
  /** Temps actif (chronomètre visible, pause déduite). */
  activeDurationSeconds?: number;
  /** Temps horloge du début de la tentative à l'envoi — sert à noter la vitesse. */
  wallDurationSeconds?: number;
  /** Conservé pour compatibilité : vaut le temps horloge. */
  durationSeconds: number;
  solutionViewed: boolean;
  assisted: boolean;
  /** Commentaires de l'Associate, pour rouvrir la revue après un refresh. */
  comments?: string[];
  /** Anciennes tentatives : string[]. Nouvelles : objets complets. */
  issues: (string | AtlasStoredIssue)[];
  filename: string;
}

/** Tentative normalisée : tous les champs optionnels sont garantis présents. */
export type NormalizedAtlasAttempt = Omit<AtlasAttempt, "comments" | "issues"> & {
  rating: string;
  comments: string[];
  certifiable: boolean;
  certificationEligible: boolean;
  certificationBlockers: string[];
  wallDurationSeconds: number;
  activeDurationSeconds: number;
  issueObjects: AtlasStoredIssue[];
};

/** Normalise une tentative, quelle que soit la version qui l'a écrite. */
export function normalizeAtlasAttempt(a: AtlasAttempt): NormalizedAtlasAttempt {
  const issueObjects: AtlasStoredIssue[] = (a.issues ?? []).map((i) =>
    typeof i === "string"
      ? { area: "Structure", title: i, detail: "", severity: "major" as const, tag: "Model QC" }
      : i);
  return {
    ...a,
    rating: a.rating ?? "—",
    comments: a.comments ?? [],
    certifiable: a.certifiable ?? false,
    certificationEligible: a.certificationEligible ?? false,
    certificationBlockers: a.certificationBlockers ?? [],
    wallDurationSeconds: a.wallDurationSeconds ?? a.durationSeconds,
    activeDurationSeconds: a.activeDurationSeconds ?? a.durationSeconds,
    issueObjects,
  };
}

/** Identifiant sans collision possible, indépendant de la taille de l'historique. */
export function newAttemptId(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === "function") return c.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export type AtlasEvent =
  | "atlas_started" | "atlas_file_downloaded" | "atlas_submitted"
  | "atlas_resubmitted" | "atlas_solution_viewed" | "atlas_completed";

// ─── Compétences (Desk Ready Score par skill) ───────────────────────────────
export const SKILLS = ["Accounting", "Valuation", "DCF", "M&A", "LBO", "EV/Equity", "Process", "Excel", "Exécution"] as const;
export type Skill = (typeof SKILLS)[number];

export const topicToSkill = (topic: string): Skill => {
  const map: Record<string, Skill> = {
    accounting: "Accounting", valuation: "Valuation", comps: "Valuation", precedents: "Valuation",
    dcf: "DCF", "mna-process": "Process", "accretion-dilution": "M&A", lbo: "LBO",
    "capital-markets": "M&A", "deal-awareness": "Process", foundations: "Process",
    "corp-finance": "Valuation", industry: "Valuation", behavioral: "Process",
  };
  return map[topic] ?? "M&A";
};

// ─── Spaced repetition (simplified SM-2) ────────────────────────────────────
export interface SrsState {
  interval: number; // days
  due: string; // ISO date
  reps: number;
  lapses: number;
}

export type SrsGrade = "again" | "hard" | "medium" | "easy";

export function nextSrs(prev: SrsState | undefined, grade: SrsGrade): SrsState {
  const today = new Date();
  const cur = prev ?? { interval: 0, due: today.toISOString(), reps: 0, lapses: 0 };
  let interval: number;
  if (grade === "again") interval = 0;
  else if (grade === "hard") interval = Math.max(1, Math.round(cur.interval * 1.2) || 1);
  else if (grade === "medium") interval = Math.max(1, Math.round(cur.interval * 2) || 2);
  else interval = Math.max(3, Math.round(cur.interval * 3) || 4);
  const due = new Date(today);
  due.setDate(due.getDate() + interval);
  return {
    interval,
    due: due.toISOString(),
    reps: cur.reps + 1,
    lapses: cur.lapses + (grade === "again" ? 1 : 0),
  };
}

// ─── Levels ─────────────────────────────────────────────────────────────────
export const LEVELS = [
  { xp: 0, name: "Summer Hopeful" },
  { xp: 150, name: "Spring Intern" },
  { xp: 400, name: "Off-Cycle Intern" },
  { xp: 800, name: "Summer Analyst" },
  { xp: 1400, name: "Analyst 1" },
  { xp: 2200, name: "Analyst 2" },
  { xp: 3200, name: "Senior Analyst" },
  { xp: 4500, name: "Associate" },
  { xp: 6000, name: "VP Material" },
  { xp: 8000, name: "Future MD" },
];

export function levelFor(xp: number) {
  let idx = 0;
  for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i].xp) idx = i;
  const next = LEVELS[idx + 1];
  return {
    index: idx + 1,
    name: LEVELS[idx].name,
    current: LEVELS[idx].xp,
    next: next?.xp ?? null,
    progress: next ? (xp - LEVELS[idx].xp) / (next.xp - LEVELS[idx].xp) : 1,
  };
}

const todayStr = () => new Date().toISOString().slice(0, 10);

/** Clé localStorage de la progression — utilisée par l'export/import des Paramètres. */
export const PROGRESS_STORAGE_KEY = "ma-training-lab-v1";

interface ProgressState {
  xp: number;
  streak: number;
  lastActive: string; // yyyy-mm-dd
  bestStreak: number;
  completedLessons: string[];
  completedMissions: Record<string, number>; // id -> score
  completedCases: Record<string, number>;
  bossResults: Record<string, { score: number; passed: boolean; date: string }>;
  arenaResults: Record<string, number>;
  drillHistory: { date: string; score: number }[];
  srs: Record<string, SrsState>; // flashcardId -> state
  activeCards: string[]; // cards added to review queue
  topicStats: Record<string, { right: number; wrong: number }>; // per topic
  tagErrors: Record<string, number>; // per fine-grained tag → weakness detector
  badges: string[];
  weakQuestions: string[]; // bank question ids marked as weak
  chapters: Record<string, number>; // chapterId -> best score (Académie)
  studyMinutes: number; // temps d'étude réel (app visible)
  mistakes: MistakeEntry[]; // journal d'erreurs (Mistake Book)
  arcade: { best: number; plays: number; history: { date: string; score: number; accuracy: number; avgMs: number }[] }; // Shortcut Arena
  skillScores: Record<string, { score: number; n: number }>; // Desk Ready par compétence (moyenne mobile)
  diagnosticDone: boolean;
  atlasAttempts: AtlasAttempt[];       // livrables Excel soumis (métadonnées seules)
  atlasSolutionViewed: boolean;
  atlasEvents: { event: AtlasEvent; at: string }[];

  completeChapter: (id: string, score: number, xp: number) => void;
  addStudyMinutes: (n: number) => void;
  addXp: (n: number) => void;
  touchStreak: () => void;
  completeLesson: (id: string, xp: number) => void;
  completeMission: (id: string, score: number, xp: number) => void;
  completeCase: (id: string, score: number, xp: number) => void;
  completeBoss: (id: string, score: number, passed: boolean, xp: number, badge: string) => void;
  completeArena: (id: string, score: number, xp: number) => void;
  recordDrill: (score: number) => void;
  reviewCard: (id: string, grade: SrsGrade) => void;
  addCards: (ids: string[]) => void;
  recordAnswer: (topic: Topic, tags: string[], correct: boolean) => void;
  toggleWeak: (id: string) => void;
  logMistake: (m: Omit<MistakeEntry, "date" | "retried">) => void;
  markRetried: (qid: string) => void;
  clearMistake: (qid: string) => void;
  recordArcade: (score: number, accuracy: number, avgMs: number) => void;
  recordSkill: (skill: Skill, correct: boolean) => void;
  seedSkills: (scores: Record<string, number>) => void;
  recordAtlasAttempt: (a: Omit<AtlasAttempt, "attemptId" | "timestamp" | "assisted">) => void;
  markAtlasSolutionViewed: () => void;
  logAtlasEvent: (event: AtlasEvent) => void;
  reset: () => void;
}

const initial = {
  xp: 0,
  streak: 0,
  lastActive: "",
  bestStreak: 0,
  completedLessons: [] as string[],
  completedMissions: {},
  completedCases: {},
  bossResults: {},
  arenaResults: {},
  drillHistory: [] as { date: string; score: number }[],
  srs: {},
  activeCards: [] as string[],
  topicStats: {},
  tagErrors: {},
  badges: [] as string[],
  weakQuestions: [] as string[],
  chapters: {},
  studyMinutes: 0,
  mistakes: [] as MistakeEntry[],
  arcade: { best: 0, plays: 0, history: [] as { date: string; score: number; accuracy: number; avgMs: number }[] },
  skillScores: {} as Record<string, { score: number; n: number }>,
  diagnosticDone: false,
  atlasAttempts: [] as AtlasAttempt[],
  atlasSolutionViewed: false,
  atlasEvents: [] as { event: AtlasEvent; at: string }[],
};

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initial,

      addXp: (n) => set((s) => ({ xp: s.xp + n })),

      completeChapter: (id, score, xp) =>
        set((s) => ({
          chapters: { ...s.chapters, [id]: Math.max(score, s.chapters[id] ?? 0) },
          xp: s.xp + (s.chapters[id] === undefined ? xp : Math.round(xp / 4)),
        })),

      addStudyMinutes: (n) => set((s) => ({ studyMinutes: s.studyMinutes + n })),

      touchStreak: () => {
        const t = todayStr();
        const { lastActive, streak, bestStreak } = get();
        if (lastActive === t) return;
        const yest = new Date();
        yest.setDate(yest.getDate() - 1);
        const newStreak = lastActive === yest.toISOString().slice(0, 10) ? streak + 1 : 1;
        set({ lastActive: t, streak: newStreak, bestStreak: Math.max(bestStreak, newStreak) });
      },

      completeLesson: (id, xp) =>
        set((s) =>
          s.completedLessons.includes(id)
            ? {}
            : { completedLessons: [...s.completedLessons, id], xp: s.xp + xp }
        ),

      completeMission: (id, score, xp) =>
        set((s) => ({
          completedMissions: { ...s.completedMissions, [id]: Math.max(score, s.completedMissions[id] ?? 0) },
          xp: s.xp + (s.completedMissions[id] === undefined ? xp : Math.round(xp / 4)),
        })),

      completeCase: (id, score, xp) =>
        set((s) => ({
          completedCases: { ...s.completedCases, [id]: Math.max(score, s.completedCases[id] ?? 0) },
          xp: s.xp + (s.completedCases[id] === undefined ? xp : Math.round(xp / 4)),
        })),

      completeBoss: (id, score, passed, xp, badge) =>
        set((s) => ({
          bossResults: { ...s.bossResults, [id]: { score, passed, date: todayStr() } },
          xp: s.xp + (passed && !s.bossResults[id]?.passed ? xp : Math.round(xp / 5)),
          badges: passed && !s.badges.includes(badge) ? [...s.badges, badge] : s.badges,
        })),

      completeArena: (id, score, xp) =>
        set((s) => ({
          arenaResults: { ...s.arenaResults, [id]: Math.max(score, s.arenaResults[id] ?? 0) },
          xp: s.xp + (s.arenaResults[id] === undefined ? xp : Math.round(xp / 4)),
        })),

      recordDrill: (score) =>
        set((s) => ({
          drillHistory: [...s.drillHistory, { date: todayStr(), score }].slice(-90),
          xp: s.xp + 20 + Math.round(score / 10),
        })),

      reviewCard: (id, grade) =>
        set((s) => ({
          srs: { ...s.srs, [id]: nextSrs(s.srs[id], grade) },
          xp: s.xp + 1,
        })),

      addCards: (ids) =>
        set((s) => ({ activeCards: Array.from(new Set([...s.activeCards, ...ids])) })),

      recordAnswer: (topic, tags, correct) =>
        set((s) => {
          const st = s.topicStats[topic] ?? { right: 0, wrong: 0 };
          const tagErrors = { ...s.tagErrors };
          if (!correct) for (const t of tags) tagErrors[t] = (tagErrors[t] ?? 0) + 1;
          else for (const t of tags) if (tagErrors[t]) tagErrors[t] = Math.max(0, tagErrors[t] - 0.5);
          return {
            topicStats: {
              ...s.topicStats,
              [topic]: { right: st.right + (correct ? 1 : 0), wrong: st.wrong + (correct ? 0 : 1) },
            },
            tagErrors,
          };
        }),

      toggleWeak: (id) =>
        set((s) => ({
          weakQuestions: s.weakQuestions.includes(id)
            ? s.weakQuestions.filter((q) => q !== id)
            : [...s.weakQuestions, id],
        })),

      logMistake: (m) =>
        set((s) => {
          // une erreur par question : la plus récente remplace l'ancienne
          const rest = s.mistakes.filter((e) => e.qid !== m.qid);
          return { mistakes: [{ ...m, date: todayStr(), retried: false }, ...rest].slice(0, 300) };
        }),

      markRetried: (qid) =>
        set((s) => ({ mistakes: s.mistakes.map((e) => (e.qid === qid ? { ...e, retried: true } : e)) })),

      clearMistake: (qid) =>
        set((s) => ({ mistakes: s.mistakes.filter((e) => e.qid !== qid) })),

      recordArcade: (score, accuracy, avgMs) =>
        set((s) => ({
          arcade: {
            best: Math.max(s.arcade.best, score),
            plays: s.arcade.plays + 1,
            history: [...s.arcade.history, { date: todayStr(), score, accuracy, avgMs }].slice(-50),
          },
          xp: s.xp + Math.round(score / 20),
        })),

      recordSkill: (skill, correct) =>
        set((s) => {
          const cur = s.skillScores[skill] ?? { score: 50, n: 0 };
          // moyenne mobile exponentielle : chaque réponse pèse ~8%
          const target = correct ? 100 : 0;
          const alpha = Math.max(0.05, 0.3 / (1 + cur.n * 0.1));
          return { skillScores: { ...s.skillScores, [skill]: { score: cur.score + alpha * (target - cur.score), n: cur.n + 1 } } };
        }),

      recordAtlasAttempt: (a) =>
        set((s) => {
          const assisted = s.atlasSolutionViewed;
          const attempt: AtlasAttempt = {
            ...a,
            attemptId: newAttemptId(),
            timestamp: new Date().toISOString(),
            assisted,
          };
          const next = { atlasAttempts: [...s.atlasAttempts, attempt].slice(-30) };

          // Une tentative ASSISTÉE reste un exercice : elle ne fait pas progresser
          // la compétence officielle et ne rapporte qu'un XP d'entraînement réduit.
          if (assisted) return { ...next, xp: s.xp + 10 };

          const cur = s.skillScores["Exécution"] ?? { score: 50, n: 0 };
          const alpha = 0.5; // un livrable pèse bien plus qu'une question de quiz
          return {
            ...next,
            xp: s.xp + Math.round(a.score * 1.5),
            skillScores: {
              ...s.skillScores,
              "Exécution": { score: cur.score + alpha * (a.score - cur.score), n: cur.n + 1 },
            },
          };
        }),

      markAtlasSolutionViewed: () =>
        set((s) => ({
          atlasSolutionViewed: true,
          atlasEvents: [...s.atlasEvents, { event: "atlas_solution_viewed" as AtlasEvent, at: new Date().toISOString() }].slice(-100),
        })),

      logAtlasEvent: (event) =>
        set((s) => ({ atlasEvents: [...s.atlasEvents, { event, at: new Date().toISOString() }].slice(-100) })),

      seedSkills: (scores) =>
        set((s) => ({
          diagnosticDone: true,
          skillScores: Object.fromEntries(Object.entries(scores).map(([k, v]) => [k, { score: v, n: Math.max(3, s.skillScores[k]?.n ?? 0) }])),
        })),

      reset: () => set(initial),
    }),
    { name: PROGRESS_STORAGE_KEY }
  )
);

// ─── Derived helpers ────────────────────────────────────────────────────────
export function topicScore(stats: Record<string, { right: number; wrong: number }>, topic: string): number | null {
  const s = stats[topic];
  if (!s || s.right + s.wrong === 0) return null;
  return Math.round((s.right / (s.right + s.wrong)) * 100);
}

export function readinessScore(state: {
  topicStats: Record<string, { right: number; wrong: number }>;
  bossResults: Record<string, { passed: boolean }>;
  completedLessons: string[];
}): number {
  const topics: Topic[] = ["accounting", "valuation", "dcf", "mna-process", "accretion-dilution", "lbo", "behavioral"];
  const scores = topics.map((t) => topicScore(state.topicStats, t) ?? 0);
  const avg = scores.reduce((a, b) => a + b, 0) / topics.length;
  const bossBonus = Object.values(state.bossResults).filter((b) => b.passed).length * 4;
  const lessonBonus = Math.min(15, state.completedLessons.length);
  return Math.min(100, Math.round(avg * 0.7 + bossBonus + lessonBonus));
}

export function weaknesses(tagErrors: Record<string, number>, topN = 5): { tag: string; errors: number }[] {
  return Object.entries(tagErrors)
    .filter(([, v]) => v >= 1.5)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([tag, errors]) => ({ tag, errors: Math.round(errors) }));
}

/** Meilleur score Atlas NON assisté (le seul qui compte comme record). */
export function bestUnassistedAtlas(attempts: AtlasAttempt[]): AtlasAttempt | null {
  const clean = attempts.filter((a) => !a.assisted);
  if (clean.length === 0) return null;
  return clean.reduce((best, a) => (a.score > best.score ? a : best));
}

/** Statut Atlas pour le Dashboard. */
/**
 * Statut OFFICIEL : il ne tient compte que des tentatives non assistées, et
 * « Associate-ready » exige en plus que le classeur ait été jugé certifiable.
 * Une tentative assistée à 100 ne peut donc jamais certifier l'utilisateur.
 */
export function atlasStatus(attempts: AtlasAttempt[]):
  "Non commencé" | "En cours" | "Terminé" | "Associate-ready" | "Pratique assistée" {
  if (attempts.length === 0) return "Non commencé";
  const clean = attempts.filter((a) => !a.assisted);
  if (clean.length === 0) return "Pratique assistée";
  const best = clean.reduce((b, a) => (a.score > b.score ? a : b));
  // certificationEligible est absent des tentatives d'avant V4.1.1 : on retombe
  // alors sur le seuil de score seul, sans jamais l'assouplir.
  const certified = best.certificationEligible ?? best.score >= 90;
  if (best.score >= 90 && certified) return "Associate-ready";
  if (best.score >= 70) return "Terminé";
  return "En cours";
}

/** Desk Ready Score /100 : moyenne des compétences évaluées, pondérée par la couverture. */
export function deskReadyScore(skillScores: Record<string, { score: number; n: number }>): number | null {
  const entries = Object.values(skillScores).filter((s) => s.n > 0);
  if (entries.length === 0) return null;
  const avg = entries.reduce((a, b) => a + b.score, 0) / entries.length;
  const coverage = Math.min(1, entries.length / SKILLS.length);
  return Math.round(avg * (0.6 + 0.4 * coverage));
}

export function daysUntil(dateStr: string): number {
  return Math.max(0, Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000));
}
