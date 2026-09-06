import { describe, it, expect, beforeEach } from "vitest";
import {
  saveActiveAtlasTiming, loadActiveAtlasTiming, clearActiveAtlasTiming,
  isUsableStoredAttempt, ACTIVE_ATTEMPT_KEY, type SessionLike,
} from "./atlasTimerSession";
import { startAttempt, pause, resume, wallSeconds, activeSeconds, finishAttempt } from "./atlasTiming";
import { ATLAS_CASE_ID, ATLAS_CASE_VERSION, ATLAS_GRADER_VERSION } from "../data/projectAtlas";

/** Stockage en mémoire : les tests ne dépendent d'aucun navigateur. */
class FakeSession implements SessionLike {
  private m = new Map<string, string>();
  getItem(k: string) { return this.m.get(k) ?? null; }
  setItem(k: string, v: string) { this.m.set(k, v); }
  removeItem(k: string) { this.m.delete(k); }
  raw() { return this.m.get(ACTIVE_ATTEMPT_KEY) ?? null; }
}

const MIN = 60_000;
let store: FakeSession;
beforeEach(() => { store = new FakeSession(); });

describe("[L] le rechargement ne remet pas le chronomètre à zéro", () => {
  it("après 70 minutes, le temps horloge restauré vaut ~70 minutes", () => {
    const t0 = 1_700_000_000_000;
    saveActiveAtlasTiming(startAttempt(t0), store);

    // 70 minutes plus tard, la page est rechargée
    const now = t0 + 70 * MIN;
    const restored = loadActiveAtlasTiming(store, now);
    expect(restored).not.toBeNull();
    expect(Math.round(wallSeconds(restored!, now) / 60)).toBe(70);   // pas 0
  });

  it("la vitesse notée après rechargement reflète le temps réel", async () => {
    const { speedScore } = await import("./atlasGrader");
    const t0 = 1_700_000_000_000;
    saveActiveAtlasTiming(startAttempt(t0), store);
    const now = t0 + 150 * MIN;
    const r = loadActiveAtlasTiming(store, now)!;
    expect(speedScore(wallSeconds(r, now))).toBeLessThan(10);
  });
});

describe("[M] l'état de pause survit au rechargement", () => {
  it("20 min de travail puis 30 min de pause se restaurent correctement", () => {
    const t0 = 1_700_000_000_000;
    let t = startAttempt(t0);
    saveActiveAtlasTiming(t, store);

    t = pause(t, t0 + 20 * MIN);          // pause après 20 min de travail
    saveActiveAtlasTiming(t, store);

    const now = t0 + 50 * MIN;            // rechargement 30 min plus tard
    const r = loadActiveAtlasTiming(store, now)!;
    expect(r.pausedAt).not.toBeNull();                              // encore en pause
    expect(Math.round(activeSeconds(r, now) / 60)).toBe(20);        // travail figé
    expect(Math.round(wallSeconds(r, now) / 60)).toBe(50);          // horloge continue
  });

  it("reprendre après restauration conserve le temps déjà travaillé", () => {
    const t0 = 0;
    let t = startAttempt(t0);
    t = pause(t, t0 + 20 * MIN);
    saveActiveAtlasTiming(t, store);

    const r = resume(loadActiveAtlasTiming(store, t0 + 50 * MIN)!, t0 + 50 * MIN);
    const d = finishAttempt(r, t0 + 60 * MIN);
    expect(Math.round(d.activeDurationSeconds / 60)).toBe(30);   // 20 + 10
    expect(Math.round(d.wallDurationSeconds / 60)).toBe(60);
  });
});

describe("[N] une nouvelle tentative repart de zéro", () => {
  it("écraser la session remet le compteur à 0", () => {
    const t0 = 0;
    saveActiveAtlasTiming(startAttempt(t0), store);
    const first = loadActiveAtlasTiming(store, t0 + 74 * MIN)!;
    expect(Math.round(wallSeconds(first, t0 + 74 * MIN) / 60)).toBe(74);

    // « Corriger et renvoyer » : nouvelle tentative
    const t1 = t0 + 74 * MIN;
    saveActiveAtlasTiming(startAttempt(t1), store);
    const second = loadActiveAtlasTiming(store, t1 + 18 * MIN)!;
    expect(Math.round(wallSeconds(second, t1 + 18 * MIN) / 60)).toBe(18);   // pas 92
  });

  it("clear supprime bien la session", () => {
    saveActiveAtlasTiming(startAttempt(Date.now()), store);
    expect(loadActiveAtlasTiming(store)).not.toBeNull();
    clearActiveAtlasTiming(store);
    expect(loadActiveAtlasTiming(store)).toBeNull();
  });
});

describe("[O] une session corrompue est jetée sans planter", () => {
  const now = 1_700_000_000_000;
  const cases: [string, string][] = [
    ["JSON invalide", "{pas du json"],
    ["objet vide", "{}"],
    ["chaîne nue", '"bonjour"'],
    ["null", "null"],
    ["mauvais case id", JSON.stringify({ caseId: "autre", caseVersion: ATLAS_CASE_VERSION, graderVersion: ATLAS_GRADER_VERSION, startedAt: now, pausedMs: 0, pausedAt: null })],
    ["ancienne version de cas", JSON.stringify({ caseId: ATLAS_CASE_ID, caseVersion: "0.9.0", graderVersion: ATLAS_GRADER_VERSION, startedAt: now, pausedMs: 0, pausedAt: null })],
    ["ancien correcteur", JSON.stringify({ caseId: ATLAS_CASE_ID, caseVersion: ATLAS_CASE_VERSION, graderVersion: "1.0", startedAt: now, pausedMs: 0, pausedAt: null })],
    ["startedAt dans le futur", JSON.stringify({ caseId: ATLAS_CASE_ID, caseVersion: ATLAS_CASE_VERSION, graderVersion: ATLAS_GRADER_VERSION, startedAt: now + 10 * 3600_000, pausedMs: 0, pausedAt: null })],
    ["startedAt vieux de 3 jours", JSON.stringify({ caseId: ATLAS_CASE_ID, caseVersion: ATLAS_CASE_VERSION, graderVersion: ATLAS_GRADER_VERSION, startedAt: now - 72 * 3600_000, pausedMs: 0, pausedAt: null })],
    ["pausedMs négatif", JSON.stringify({ caseId: ATLAS_CASE_ID, caseVersion: ATLAS_CASE_VERSION, graderVersion: ATLAS_GRADER_VERSION, startedAt: now, pausedMs: -5, pausedAt: null })],
    ["startedAt non numérique", JSON.stringify({ caseId: ATLAS_CASE_ID, caseVersion: ATLAS_CASE_VERSION, graderVersion: ATLAS_GRADER_VERSION, startedAt: "hier", pausedMs: 0, pausedAt: null })],
  ];
  for (const [name, raw] of cases) {
    it(`${name} → aucune tentative restaurée, aucun crash`, () => {
      store.setItem(ACTIVE_ATTEMPT_KEY, raw);
      expect(() => loadActiveAtlasTiming(store, now)).not.toThrow();
      expect(loadActiveAtlasTiming(store, now)).toBeNull();
    });
  }

  it("une session valide est acceptée", () => {
    const valid = { caseId: ATLAS_CASE_ID, caseVersion: ATLAS_CASE_VERSION, graderVersion: ATLAS_GRADER_VERSION, startedAt: now - 5 * MIN, pausedMs: 0, pausedAt: null };
    expect(isUsableStoredAttempt(valid, now)).toBe(true);
  });

  it("un stockage indisponible ne fait rien planter", () => {
    expect(() => saveActiveAtlasTiming(startAttempt(0), null)).not.toThrow();
    expect(loadActiveAtlasTiming(null)).toBeNull();
    expect(() => clearActiveAtlasTiming(null)).not.toThrow();
  });
});

describe("aucune donnée de classeur n'est stockée", () => {
  it("la session ne contient que des métadonnées de chronométrage", () => {
    let t = startAttempt(1_700_000_000_000);
    t = pause(t, 1_700_000_060_000);
    saveActiveAtlasTiming(t, store);
    const raw = store.raw()!;
    for (const forbidden of ["workbook", "fileContent", "arraybuffer", "base64", "blob", "bytes", "xlsx"]) {
      expect(raw.toLowerCase()).not.toContain(forbidden);
    }
    expect(Object.keys(JSON.parse(raw)).sort())
      .toEqual(["caseId", "caseVersion", "graderVersion", "pausedAt", "pausedMs", "startedAt"]);
  });
});
