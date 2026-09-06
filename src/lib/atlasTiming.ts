// ─── Chronométrage d'un livrable Atlas ──────────────────────────────────────
// Politique assumée et testable :
//
//   • Le chronomètre VISIBLE est pausable : l'utilisateur s'entraîne, il peut
//     être interrompu. C'est le « temps actif ».
//   • Le temps HORLOGE, lui, ne s'arrête jamais entre le début de la tentative
//     et l'envoi. C'est LUI qui note la vitesse.
//   → Mettre en pause trois heures ne donne donc pas 10/10 en vitesse.
//
//   • Chaque tentative repart de zéro. « Corriger et renvoyer » ouvre une
//     NOUVELLE tentative : sa durée est la sienne, pas le cumul depuis le début.
//   • Le temps cumulé du projet se dérive de l'historique des tentatives.

export interface AttemptTiming {
  /** Horodatage (ms) du début de la tentative courante. */
  startedAt: number;
  /** Millisecondes déjà passées en pause sur cette tentative. */
  pausedMs: number;
  /** Horodatage du début de la pause en cours, si en pause. */
  pausedAt: number | null;
}

export function startAttempt(now = Date.now()): AttemptTiming {
  return { startedAt: now, pausedMs: 0, pausedAt: null };
}

export function pause(t: AttemptTiming, now = Date.now()): AttemptTiming {
  return t.pausedAt !== null ? t : { ...t, pausedAt: now };
}

export function resume(t: AttemptTiming, now = Date.now()): AttemptTiming {
  if (t.pausedAt === null) return t;
  return { startedAt: t.startedAt, pausedMs: t.pausedMs + (now - t.pausedAt), pausedAt: null };
}

/** Temps horloge depuis le début de la tentative — la pause ne l'arrête pas. */
export function wallSeconds(t: AttemptTiming, now = Date.now()): number {
  return Math.max(0, (now - t.startedAt) / 1000);
}

/** Temps réellement travaillé — pauses déduites. C'est ce qu'affiche le chrono. */
export function activeSeconds(t: AttemptTiming, now = Date.now()): number {
  const paused = t.pausedMs + (t.pausedAt !== null ? now - t.pausedAt : 0);
  return Math.max(0, (now - t.startedAt - paused) / 1000);
}

export function pausedSeconds(t: AttemptTiming, now = Date.now()): number {
  return Math.max(0, (t.pausedMs + (t.pausedAt !== null ? now - t.pausedAt : 0)) / 1000);
}

export interface AttemptDurations {
  wallDurationSeconds: number;
  activeDurationSeconds: number;
  pausedDurationSeconds: number;
}

/** Fige les durées d'une tentative au moment de l'envoi. */
export function finishAttempt(t: AttemptTiming, now = Date.now()): AttemptDurations {
  return {
    wallDurationSeconds: Math.round(wallSeconds(t, now)),
    activeDurationSeconds: Math.round(activeSeconds(t, now)),
    pausedDurationSeconds: Math.round(pausedSeconds(t, now)),
  };
}

/** Temps cumulé sur le projet : la somme des tentatives, pas la dernière. */
export function cumulativeSeconds(attempts: { wallDurationSeconds?: number; durationSeconds: number }[]): number {
  return attempts.reduce((a, x) => a + (x.wallDurationSeconds ?? x.durationSeconds), 0);
}

export const fmtDuration = (seconds: number): string => {
  const m = Math.floor(seconds / 60), s = Math.floor(seconds % 60);
  return m >= 60 ? `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, "0")}` : `${m} min ${String(s).padStart(2, "0")}`;
};
