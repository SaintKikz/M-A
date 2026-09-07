import { describe, it, expect, beforeEach } from "vitest";
import {
  useProgress, bestUnassistedAtlas, bestHistoricalAtlas, atlasStatus,
  normalizeAtlasAttempt, newAttemptId, isCurrentAtlasAttempt, isLegacyAtlasAttempt,
  type AtlasAttempt,
} from "./progress";
import { ATLAS_CASE_ID, ATLAS_CASE_VERSION, ATLAS_GRADER_VERSION } from "../data/projectAtlas";

const base = {
  caseId: ATLAS_CASE_ID, caseVersion: ATLAS_CASE_VERSION, graderVersion: ATLAS_GRADER_VERSION,
  accuracyScore: 30, integrityScore: 12, completionScore: 10, qcScore: 6, speedScore: 10,
  durationSeconds: 3600, wallDurationSeconds: 3600, activeDurationSeconds: 3400,
  solutionViewed: false, issues: [], filename: "atlas.xlsx",
};

describe("Store Atlas — identifiants", () => {
  beforeEach(() => { useProgress.getState().reset(); });

  it("[X] les identifiants de tentative sont uniques", () => {
    const s = useProgress.getState();
    for (let i = 0; i < 12; i++) s.recordAtlasAttempt({ ...base, score: 60 + i });
    const ids = useProgress.getState().atlasAttempts.map((a) => a.attemptId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("[Y] tronquer l'historique ne peut pas recréer un identifiant existant", () => {
    const s = useProgress.getState();
    // 30 est la limite de conservation : on la dépasse volontairement
    for (let i = 0; i < 35; i++) s.recordAtlasAttempt({ ...base, score: 50 });
    const after = useProgress.getState().atlasAttempts;
    expect(after.length).toBe(30);                       // historique tronqué
    expect(new Set(after.map((a) => a.attemptId)).size).toBe(30); // toujours uniques
  });

  it("newAttemptId ne dépend pas de la taille de l'historique", () => {
    const a = newAttemptId(), b = newAttemptId();
    expect(a).not.toBe(b);
    expect(a.length).toBeGreaterThan(8);
  });
});

describe("Store Atlas — tentatives assistées", () => {
  beforeEach(() => { useProgress.getState().reset(); });

  it("[T] une tentative assistée à 100 ne rend pas Associate-ready", () => {
    const s = useProgress.getState();
    s.recordAtlasAttempt({ ...base, score: 72, certificationEligible: false });
    s.markAtlasSolutionViewed();
    s.recordAtlasAttempt({ ...base, score: 100, certificationEligible: false });

    const attempts = useProgress.getState().atlasAttempts;
    expect(bestUnassistedAtlas(attempts)?.score).toBe(72);
    expect(atlasStatus(attempts)).toBe("Terminé");
    expect(atlasStatus(attempts)).not.toBe("Associate-ready");
  });

  it("[U] uniquement des tentatives assistées → jamais Associate-ready", () => {
    const s = useProgress.getState();
    s.markAtlasSolutionViewed();
    s.recordAtlasAttempt({ ...base, score: 100 });
    const attempts = useProgress.getState().atlasAttempts;
    expect(bestUnassistedAtlas(attempts)).toBeNull();
    expect(atlasStatus(attempts)).toBe("Pratique assistée");
  });

  it("[V] une tentative assistée ne fait pas monter la compétence Exécution", () => {
    const s = useProgress.getState();
    s.markAtlasSolutionViewed();
    s.recordAtlasAttempt({ ...base, score: 100 });
    expect(useProgress.getState().skillScores["Exécution"]).toBeUndefined();
  });

  it("une tentative libre, elle, fait monter la compétence", () => {
    useProgress.getState().recordAtlasAttempt({ ...base, score: 90 });
    const sk = useProgress.getState().skillScores["Exécution"];
    expect(sk.n).toBe(1);
    expect(sk.score).toBeGreaterThan(50);
  });

  it("une tentative assistée rapporte un XP d'entraînement réduit", () => {
    const s = useProgress.getState();
    s.markAtlasSolutionViewed();
    const before = useProgress.getState().xp;
    s.recordAtlasAttempt({ ...base, score: 100 });
    expect(useProgress.getState().xp - before).toBe(10);   // pas 150
  });

  it("Associate-ready exige une tentative libre ET certifiée", () => {
    const s = useProgress.getState();
    s.recordAtlasAttempt({ ...base, score: 95, certificationEligible: false });
    expect(atlasStatus(useProgress.getState().atlasAttempts)).toBe("Terminé");
    s.recordAtlasAttempt({ ...base, score: 96, certificationEligible: true });
    expect(atlasStatus(useProgress.getState().atlasAttempts)).toBe("Associate-ready");
  });
});

describe("Store Atlas — persistance de la revue", () => {
  beforeEach(() => { useProgress.getState().reset(); });

  it("[AA] la revue complète survit à une sérialisation", () => {
    useProgress.getState().recordAtlasAttempt({
      ...base, score: 84, rating: "Solide pour un analyste",
      comments: ["Ta médiane ne tient pas.", "Relie le Summary."],
      certificationBlockers: ["3 cellule(s) ne réconcilient pas"],
      issues: [{ area: "DCF", title: "WACC", detail: "Reprends le CAPM.",
                 userValue: "9,10%", expectedHint: "≈ 8,45%", severity: "major", tag: "WACC" }],
    });
    // Simule un rechargement : on repasse par JSON comme le fait localStorage
    const raw = JSON.stringify(useProgress.getState().atlasAttempts);
    const restored = JSON.parse(raw) as AtlasAttempt[];
    const n = normalizeAtlasAttempt(restored[0]);

    expect(n.comments).toHaveLength(2);
    expect(n.rating).toBe("Solide pour un analyste");
    expect(n.issueObjects[0].title).toBe("WACC");
    expect(n.issueObjects[0].expectedHint).toBe("≈ 8,45%");
    expect(n.certificationBlockers).toHaveLength(1);
  });

  it("[AB] une ancienne tentative (issues: string[]) se charge sans planter", () => {
    const legacy = {
      caseId: "project_atlas_v1", attemptId: "old-1", timestamp: new Date().toISOString(),
      score: 68, accuracyScore: 25, integrityScore: 10, completionScore: 8, qcScore: 5, speedScore: 10,
      durationSeconds: 4000, solutionViewed: false, assisted: false,
      issues: ["MODEL CHECK ne passe pas", "Synthèse vide"], filename: "old.xlsx",
    } as AtlasAttempt;
    const n = normalizeAtlasAttempt(legacy);
    expect(n.issueObjects).toHaveLength(2);
    expect(n.issueObjects[0].title).toBe("MODEL CHECK ne passe pas");
    expect(n.comments).toEqual([]);
    expect(n.certificationEligible).toBe(false);
    expect(n.wallDurationSeconds).toBe(4000);   // retombe sur durationSeconds
    expect(() => atlasStatus([legacy])).not.toThrow();
  });

  it("[AC] aucun octet de classeur n'est stocké", () => {
    useProgress.getState().recordAtlasAttempt({ ...base, score: 80 });
    const raw = JSON.stringify(useProgress.getState().atlasAttempts);
    for (const forbidden of ["workbook", "fileContent", "ArrayBuffer", "base64", "blob", "buffer", "bytes"]) {
      expect(raw.toLowerCase()).not.toContain(forbidden.toLowerCase());
    }
    const a = useProgress.getState().atlasAttempts[0];
    expect(a.filename).toBe("atlas.xlsx");   // seul le NOM est conservé
  });

  it("[Z4] resoumettre ne corrompt pas l'historique", () => {
    const s = useProgress.getState();
    s.recordAtlasAttempt({ ...base, score: 68, wallDurationSeconds: 74 * 60 });
    s.recordAtlasAttempt({ ...base, score: 84, wallDurationSeconds: 18 * 60 });
    s.recordAtlasAttempt({ ...base, score: 94, wallDurationSeconds: 12 * 60 });
    const a = useProgress.getState().atlasAttempts;
    expect(a.map((x) => x.score)).toEqual([68, 84, 94]);
    expect(a.map((x) => x.wallDurationSeconds)).toEqual([74 * 60, 18 * 60, 12 * 60]);
    expect(new Set(a.map((x) => x.attemptId)).size).toBe(3);
  });

  it("reset efface les tentatives et le drapeau de solution", () => {
    const s = useProgress.getState();
    s.recordAtlasAttempt({ ...base, score: 80 });
    s.markAtlasSolutionViewed();
    s.reset();
    expect(useProgress.getState().atlasAttempts).toHaveLength(0);
    expect(useProgress.getState().atlasSolutionViewed).toBe(false);
  });
});

describe("Statut officiel", () => {
  it("couvre tous les cas de la spec", () => {
    const mk = (score: number, assisted: boolean, cert = score >= 90) =>
      ({ ...base, score, assisted, certificationEligible: cert,
         attemptId: `id-${score}-${assisted}`, timestamp: "" } as AtlasAttempt);
    expect(atlasStatus([])).toBe("Non commencé");
    expect(atlasStatus([mk(55, false)])).toBe("En cours");
    expect(atlasStatus([mk(78, false)])).toBe("Terminé");
    expect(atlasStatus([mk(92, false)])).toBe("Associate-ready");
    expect(atlasStatus([mk(72, false), mk(100, true)])).toBe("Terminé");
    expect(atlasStatus([mk(100, true)])).toBe("Pratique assistée");
  });
});


// ═══════════════════════════════════════════════════════════════════════════
//  V4.1.2 — une tentative d'un ancien correcteur ne certifie plus
// ═══════════════════════════════════════════════════════════════════════════
describe("Certification liée au correcteur courant", () => {
  const mk = (o: Partial<AtlasAttempt>): AtlasAttempt => ({
    caseId: ATLAS_CASE_ID, caseVersion: ATLAS_CASE_VERSION, graderVersion: ATLAS_GRADER_VERSION,
    attemptId: `id-${Math.random()}`, timestamp: new Date().toISOString(),
    score: 80, accuracyScore: 0, integrityScore: 0, completionScore: 0, qcScore: 0, speedScore: 0,
    durationSeconds: 3600, solutionViewed: false, assisted: false, issues: [], filename: "a.xlsx",
    ...o,
  });

  it("[I] une vieille tentative à 99 sans métadonnées ne certifie pas", () => {
    const legacy = mk({ score: 99, caseVersion: undefined, graderVersion: undefined, certificationEligible: undefined });
    expect(isCurrentAtlasAttempt(legacy)).toBe(false);
    expect(isLegacyAtlasAttempt(legacy)).toBe(true);
    expect(atlasStatus([legacy])).not.toBe("Associate-ready");
    expect(bestUnassistedAtlas([legacy])).toBeNull();
  });

  it("[J] une tentative du correcteur 1.1 à 100 n'est pas le meilleur score courant", () => {
    const old = mk({ score: 100, graderVersion: "1.1", certificationEligible: true });
    expect(isCurrentAtlasAttempt(old)).toBe(false);
    expect(bestUnassistedAtlas([old])).toBeNull();
    expect(atlasStatus([old])).not.toBe("Associate-ready");
    // …mais elle reste visible dans l'historique
    expect(bestHistoricalAtlas([old])?.score).toBe(100);
  });

  it("[K] une tentative courante certifiée à 94 devient Associate-ready", () => {
    const now = mk({ score: 94, certificationEligible: true });
    expect(isCurrentAtlasAttempt(now)).toBe(true);
    expect(atlasStatus([now])).toBe("Associate-ready");
    expect(bestUnassistedAtlas([now])?.score).toBe(94);
  });

  it("courante 82 + ancien correcteur 100 → officiel = 82, statut Terminé", () => {
    const attempts = [
      mk({ score: 100, graderVersion: "1.1", certificationEligible: true }),
      mk({ score: 82, certificationEligible: false }),
    ];
    expect(bestUnassistedAtlas(attempts)?.score).toBe(82);
    expect(atlasStatus(attempts)).toBe("Terminé");
  });

  it("un score >= 90 sans certificationEligible explicite ne certifie pas", () => {
    const a = mk({ score: 97, certificationEligible: undefined });
    expect(atlasStatus([a])).toBe("Terminé");   // et non Associate-ready
  });

  it("une mauvaise version de cas exclut du calcul officiel", () => {
    const a = mk({ score: 100, caseVersion: "1.0.0", certificationEligible: true });
    expect(isCurrentAtlasAttempt(a)).toBe(false);
    expect(atlasStatus([a])).not.toBe("Associate-ready");
  });

  it("l'historique mixte reste intégralement visible", () => {
    const attempts = [
      mk({ score: 99, caseVersion: undefined, graderVersion: undefined }),      // V4.1
      mk({ score: 100, graderVersion: "1.1", certificationEligible: true }),    // V4.1.1
      mk({ score: 94, certificationEligible: true }),                           // courante
      mk({ score: 100, assisted: true, certificationEligible: false }),         // assistée
    ];
    expect(attempts).toHaveLength(4);                        // rien n'est supprimé
    expect(attempts.filter(isCurrentAtlasAttempt)).toHaveLength(1);
    expect(bestUnassistedAtlas(attempts)?.score).toBe(94);
    expect(atlasStatus(attempts)).toBe("Associate-ready");
  });
});
