import { describe, it, expect } from "vitest";
import {
  startAttempt, pause, resume, wallSeconds, activeSeconds, pausedSeconds,
  finishAttempt, cumulativeSeconds, fmtDuration,
} from "./atlasTiming";

const MIN = 60_000;

describe("Chronométrage d'une tentative", () => {
  it("[Z1] chaque tentative repart de zéro", () => {
    const t0 = 1_000_000;
    // Tentative 1 : 74 minutes
    const a1 = startAttempt(t0);
    const d1 = finishAttempt(a1, t0 + 74 * MIN);
    expect(Math.round(d1.wallDurationSeconds / 60)).toBe(74);

    // « Corriger et renvoyer » ouvre une NOUVELLE tentative
    const a2 = startAttempt(t0 + 74 * MIN);
    const d2 = finishAttempt(a2, t0 + 74 * MIN + 18 * MIN);
    expect(Math.round(d2.wallDurationSeconds / 60)).toBe(18);   // pas 92
    expect(d2.wallDurationSeconds).toBeLessThan(d1.wallDurationSeconds);
  });

  it("[Z2] le temps cumulé est la somme des tentatives", () => {
    const attempts = [
      { wallDurationSeconds: 74 * 60, durationSeconds: 74 * 60 },
      { wallDurationSeconds: 18 * 60, durationSeconds: 18 * 60 },
    ];
    expect(Math.round(cumulativeSeconds(attempts) / 60)).toBe(92);
  });

  it("[Z3] une longue pause n'efface pas le temps horloge", () => {
    const t0 = 0;
    let t = startAttempt(t0);
    t = pause(t, t0 + 10 * MIN);              // 10 min de travail
    t = resume(t, t0 + 190 * MIN);            // puis 3 h de pause
    const d = finishAttempt(t, t0 + 200 * MIN);

    expect(Math.round(d.activeDurationSeconds / 60)).toBe(20);   // chrono visible
    expect(Math.round(d.wallDurationSeconds / 60)).toBe(200);    // temps réel
    expect(Math.round(d.pausedDurationSeconds / 60)).toBe(180);
  });

  it("[Z3bis] la vitesse se note sur le temps horloge, donc la pause ne rapporte rien", async () => {
    const { speedScore } = await import("./atlasGrader");
    const t0 = 0;
    let t = startAttempt(t0);
    t = pause(t, t0 + 10 * MIN);
    t = resume(t, t0 + 190 * MIN);
    const d = finishAttempt(t, t0 + 200 * MIN);

    // 20 min de travail « actif » donneraient 10/10 — le temps horloge non
    expect(speedScore(d.activeDurationSeconds)).toBe(10);
    expect(speedScore(d.wallDurationSeconds)).toBeLessThan(10);
  });

  it("mettre en pause deux fois de suite est sans effet", () => {
    let t = startAttempt(0);
    t = pause(t, 1000);
    const twice = pause(t, 5000);
    expect(twice.pausedAt).toBe(1000);
  });

  it("reprendre sans pause en cours est sans effet", () => {
    const t = startAttempt(0);
    expect(resume(t, 5000)).toEqual(t);
  });

  it("les durées ne sont jamais négatives", () => {
    const t = startAttempt(10_000);
    expect(wallSeconds(t, 0)).toBe(0);
    expect(activeSeconds(t, 0)).toBe(0);
    expect(pausedSeconds(t, 0)).toBe(0);
  });

  it("formate lisiblement", () => {
    expect(fmtDuration(18 * 60)).toBe("18 min 00");
    expect(fmtDuration(74 * 60)).toBe("1 h 14");        // au-delà d'une heure
    expect(fmtDuration(3600 + 15 * 60)).toBe("1 h 15");
  });
});
