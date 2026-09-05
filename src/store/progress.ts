import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Topic } from "../lib/types";

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

      reset: () => set(initial),
    }),
    { name: "ma-training-lab-v1" }
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

export function daysUntil(dateStr: string): number {
  return Math.max(0, Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000));
}
