// ─── Persistance de la tentative en cours ───────────────────────────────────
// Un rafraîchissement de page ne doit pas remettre le chronomètre à zéro :
// ce serait un moyen trivial de regagner des points de vitesse.
//
// On stocke UNIQUEMENT des métadonnées de chronométrage, dans sessionStorage :
//   • ça survit à un rechargement et à la navigation dans l'onglet ;
//   • ça ne pollue pas la progression permanente ;
//   • ça ne contient AUCUNE donnée du classeur.
//
// Toute donnée illisible, incohérente ou d'une autre version est jetée sans
// bruit : mieux vaut repartir de zéro que restaurer un état faux.

import { ATLAS_CASE_ID, ATLAS_CASE_VERSION, ATLAS_GRADER_VERSION } from "../data/projectAtlas.ts";
import type { AttemptTiming } from "./atlasTiming.ts";

export const ACTIVE_ATTEMPT_KEY = "ma-training-atlas-active-attempt-v1";

export interface StoredActiveAttempt {
  caseId: string;
  caseVersion: string;
  graderVersion: string;
  startedAt: number;
  pausedMs: number;
  pausedAt: number | null;
}

/** Abstraction minimale : permet d'injecter un faux stockage dans les tests. */
export interface SessionLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function defaultStore(): SessionLike | null {
  try {
    return typeof sessionStorage !== "undefined" ? sessionStorage : null;
  } catch {
    return null; // navigation privée, stockage bloqué…
  }
}

/** Une tentative stockée est-elle exploitable ici et maintenant ? */
export function isUsableStoredAttempt(v: unknown, now = Date.now()): v is StoredActiveAttempt {
  if (!v || typeof v !== "object") return false;
  const a = v as Partial<StoredActiveAttempt>;
  if (a.caseId !== ATLAS_CASE_ID) return false;
  if (a.caseVersion !== ATLAS_CASE_VERSION) return false;
  if (a.graderVersion !== ATLAS_GRADER_VERSION) return false;
  if (typeof a.startedAt !== "number" || !Number.isFinite(a.startedAt)) return false;
  if (typeof a.pausedMs !== "number" || !Number.isFinite(a.pausedMs) || a.pausedMs < 0) return false;
  if (a.pausedAt !== null && (typeof a.pausedAt !== "number" || !Number.isFinite(a.pausedAt))) return false;
  // Horodatages impossibles : dans le futur, ou plus vieux que 24 h.
  if (a.startedAt > now + 60_000) return false;
  if (now - a.startedAt > 24 * 3600 * 1000) return false;
  if (a.pausedAt !== null && a.pausedAt < a.startedAt - 60_000) return false;
  return true;
}

export function saveActiveAtlasTiming(t: AttemptTiming, store: SessionLike | null = defaultStore()): void {
  if (!store) return;
  const payload: StoredActiveAttempt = {
    caseId: ATLAS_CASE_ID, caseVersion: ATLAS_CASE_VERSION, graderVersion: ATLAS_GRADER_VERSION,
    startedAt: t.startedAt, pausedMs: t.pausedMs, pausedAt: t.pausedAt,
  };
  try { store.setItem(ACTIVE_ATTEMPT_KEY, JSON.stringify(payload)); } catch { /* quota, mode privé */ }
}

export function loadActiveAtlasTiming(
  store: SessionLike | null = defaultStore(), now = Date.now(),
): AttemptTiming | null {
  if (!store) return null;
  let raw: string | null;
  try { raw = store.getItem(ACTIVE_ATTEMPT_KEY); } catch { return null; }
  if (!raw) return null;
  let parsed: unknown;
  try { parsed = JSON.parse(raw); } catch { clearActiveAtlasTiming(store); return null; }
  if (!isUsableStoredAttempt(parsed, now)) { clearActiveAtlasTiming(store); return null; }
  return { startedAt: parsed.startedAt, pausedMs: parsed.pausedMs, pausedAt: parsed.pausedAt };
}

export function clearActiveAtlasTiming(store: SessionLike | null = defaultStore()): void {
  if (!store) return;
  try { store.removeItem(ACTIVE_ATTEMPT_KEY); } catch { /* rien à faire */ }
}
