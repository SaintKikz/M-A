import { describe, it, expect, beforeEach } from "vitest";
import { useProgress, bestUnassistedAtlas, atlasStatus, type AtlasAttempt } from "./progress";

const base = {
  caseId: "project_atlas_v1",
  accuracyScore: 30, integrityScore: 12, completionScore: 10, qcScore: 6, speedScore: 10,
  durationSeconds: 3600, solutionViewed: false, issues: [], filename: "atlas.xlsx",
};

describe("Store — tentatives Project Atlas", () => {
  beforeEach(() => { useProgress.getState().reset(); });

  it("enregistre une tentative avec un id et un horodatage", () => {
    useProgress.getState().recordAtlasAttempt({ ...base, score: 68 });
    const a = useProgress.getState().atlasAttempts;
    expect(a).toHaveLength(1);
    expect(a[0].attemptId).toBe("project_atlas_v1-1");
    expect(a[0].score).toBe(68);
    expect(Date.parse(a[0].timestamp)).toBeGreaterThan(0);
  });

  it("ne stocke aucun contenu de classeur — que des métadonnées", () => {
    useProgress.getState().recordAtlasAttempt({ ...base, score: 80 });
    const a = useProgress.getState().atlasAttempts[0];
    const keys = Object.keys(a);
    expect(keys).not.toContain("workbook");
    expect(keys).not.toContain("fileContent");
    expect(keys).not.toContain("data");
    expect(a.filename).toBe("atlas.xlsx"); // seul le NOM est conservé
  });

  it("garde l'historique et permet de mesurer la progression", () => {
    const s = useProgress.getState();
    s.recordAtlasAttempt({ ...base, score: 68 });
    s.recordAtlasAttempt({ ...base, score: 84 });
    s.recordAtlasAttempt({ ...base, score: 94 });
    const a = useProgress.getState().atlasAttempts;
    expect(a.map((x) => x.score)).toEqual([68, 84, 94]);
    expect(a[2].score - a[0].score).toBe(26);
  });

  it("marque comme assistée toute tentative postérieure à la révélation du corrigé", () => {
    const s = useProgress.getState();
    s.recordAtlasAttempt({ ...base, score: 70 });
    s.markAtlasSolutionViewed();
    s.recordAtlasAttempt({ ...base, score: 98 });
    const a = useProgress.getState().atlasAttempts;
    expect(a[0].assisted).toBe(false);
    expect(a[1].assisted).toBe(true);
  });

  it("le meilleur score ignore les tentatives assistées", () => {
    const s = useProgress.getState();
    s.recordAtlasAttempt({ ...base, score: 72 });
    s.markAtlasSolutionViewed();
    s.recordAtlasAttempt({ ...base, score: 99 });
    const best = bestUnassistedAtlas(useProgress.getState().atlasAttempts);
    expect(best?.score).toBe(72);
  });

  it("renvoie null quand toutes les tentatives sont assistées", () => {
    const s = useProgress.getState();
    s.markAtlasSolutionViewed();
    s.recordAtlasAttempt({ ...base, score: 95 });
    expect(bestUnassistedAtlas(useProgress.getState().atlasAttempts)).toBeNull();
  });

  it("alimente la compétence Exécution du Desk Ready", () => {
    expect(useProgress.getState().skillScores["Exécution"]).toBeUndefined();
    useProgress.getState().recordAtlasAttempt({ ...base, score: 90 });
    const sk = useProgress.getState().skillScores["Exécution"];
    expect(sk.n).toBe(1);
    expect(sk.score).toBeGreaterThan(50); // part de 50, tiré vers 90
    expect(sk.score).toBeLessThan(90);
  });

  it("journalise les événements Atlas", () => {
    const s = useProgress.getState();
    s.logAtlasEvent("atlas_started");
    s.logAtlasEvent("atlas_file_downloaded");
    s.markAtlasSolutionViewed();
    const ev = useProgress.getState().atlasEvents.map((e) => e.event);
    expect(ev).toContain("atlas_started");
    expect(ev).toContain("atlas_file_downloaded");
    expect(ev).toContain("atlas_solution_viewed");
  });

  it("calcule le statut pour le Dashboard", () => {
    expect(atlasStatus([])).toBe("Non commencé");
    const mk = (score: number) => ({ ...base, score, attemptId: "x", timestamp: "", assisted: false } as AtlasAttempt);
    expect(atlasStatus([mk(45)])).toBe("En cours");
    expect(atlasStatus([mk(75)])).toBe("Terminé");
    expect(atlasStatus([mk(45), mk(92)])).toBe("Associate-ready");
  });

  it("reset efface les tentatives Atlas", () => {
    const s = useProgress.getState();
    s.recordAtlasAttempt({ ...base, score: 80 });
    s.markAtlasSolutionViewed();
    s.reset();
    expect(useProgress.getState().atlasAttempts).toHaveLength(0);
    expect(useProgress.getState().atlasSolutionViewed).toBe(false);
  });
});
