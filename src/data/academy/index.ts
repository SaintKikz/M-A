import { CHAPTERS_L12 } from "./chapters12";
import { CHAPTERS_L34 } from "./chapters34";
import { CHAPTERS_L59 } from "./chapters59";
import { LEVELS_META, type Chapter } from "./types";

export { LEVELS_META };
export type { Chapter };

export const CHAPTERS: Chapter[] = [...CHAPTERS_L12, ...CHAPTERS_L34, ...CHAPTERS_L59];
export const chapterById = Object.fromEntries(CHAPTERS.map((c) => [c.id, c]));
export const chaptersOfLevel = (lvl: number) => CHAPTERS.filter((c) => c.level === lvl);

/** Un niveau est débloqué si le précédent est complété à ≥ 70% (niveau 1 toujours ouvert). */
export function levelUnlocked(level: number, done: Record<string, number>): boolean {
  if (level <= 1) return true;
  const prev = chaptersOfLevel(level - 1);
  if (prev.length === 0) return true;
  const completed = prev.filter((c) => done[c.id] !== undefined).length;
  return completed / prev.length >= 0.7;
}

/** Maîtrise d'un niveau : moyenne des scores des chapitres complétés × taux de complétion. */
export function levelMastery(level: number, done: Record<string, number>): { pct: number; completed: number; total: number } {
  const chs = chaptersOfLevel(level);
  const scores = chs.map((c) => done[c.id]).filter((s): s is number => s !== undefined);
  const completed = scores.length;
  const avg = completed ? scores.reduce((a, b) => a + b, 0) / completed : 0;
  return { pct: Math.round((avg * completed) / Math.max(1, chs.length)), completed, total: chs.length };
}

/** Prochain chapitre non complété (dans l'ordre des niveaux), en respectant le déblocage. */
export function nextChapter(done: Record<string, number>): Chapter | null {
  for (const meta of LEVELS_META) {
    if (!levelUnlocked(meta.level, done)) return null;
    const ch = chaptersOfLevel(meta.level).find((c) => done[c.id] === undefined);
    if (ch) return ch;
  }
  return null;
}
