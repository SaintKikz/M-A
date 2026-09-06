import { useMemo, useState } from "react";
import { Card, PageTitle, Btn, Tag, Stat } from "../components/ui";
import { AtlasBrief } from "../components/atlas/AtlasBrief";
import { AtlasTimer, useAtlasTimer } from "../components/atlas/AtlasTimer";
import { AtlasUploader } from "../components/atlas/AtlasUploader";
import { AtlasReview, AtlasAttemptHistory, AtlasStoredReview } from "../components/atlas/AtlasReview";
import { atlasCompany } from "../data/projectAtlas";
import { useProgress, bestUnassistedAtlas, atlasStatus } from "../store/progress";
import type { AtlasScore } from "../lib/atlasGrader";
import { cumulativeSeconds, fmtDuration } from "../lib/atlasTiming";
import { normalizeAtlasAttempt, type AtlasAttempt } from "../store/progress";

const TARGET_MINUTES = 90;

const TASKS = [
  "Compléter le tableau de trading comps (market cap, EV, six multiples par comparable)",
  "Renseigner les statistiques : min, Q1, médiane, Q3, max",
  "Appliquer la médiane EV/EBITDA FY27E et dérouler le bridge jusqu'au prix par action",
  "Construire le DCF : EBIT, impôt, NOPAT, UFCF sur FY26E-FY30E",
  "Bâtir le WACC (CAPM puis pondération) et la valeur terminale par Gordon",
  "Remplir la table de sensibilité WACC × croissance à l'infini",
  "Reporter les fourchettes dans Valuation_Summary",
  "Faire passer MODEL CHECK au vert dans l'onglet Checks",
];

export default function ProjectAtlas() {
  const store = useProgress();
  const { atlasAttempts, atlasSolutionViewed } = store;
  const [phase, setPhase] = useState<"brief" | "working" | "review">(
    atlasAttempts.length > 0 ? "review" : "brief");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState<AtlasScore | null>(null);
  const [lastDuration, setLastDuration] = useState(0);
  /** Tentative rouverte depuis l'historique (survit à un rechargement). */
  const [openedAttempt, setOpenedAttempt] = useState<AtlasAttempt | null>(null);
  const [confirmSolution, setConfirmSolution] = useState(false);

  const timer = useAtlasTimer(phase === "working");
  const best = useMemo(() => bestUnassistedAtlas(atlasAttempts), [atlasAttempts]);
  const status = atlasStatus(atlasAttempts);
  const lastAttempt = atlasAttempts[atlasAttempts.length - 1];

  const download = (file: string) => {
    store.logAtlasEvent("atlas_file_downloaded");
    const a = document.createElement("a");
    a.href = `/project-atlas/${file}`;
    a.download = file;
    a.click();
  };

  const start = () => {
    store.logAtlasEvent("atlas_started");
    timer.restart();
    setPhase("working");
    window.scrollTo(0, 0);
  };

  const submit = async (file: File) => {
    setBusy(true); setError(null);
    try {
      const { parseAtlasWorkbook, AtlasParseError } = await import("../lib/atlasWorkbook");
      const { gradeAtlas } = await import("../lib/atlasGrader");
      let parsed;
      try {
        parsed = await parseAtlasWorkbook(file);
      } catch (e) {
        if (e instanceof AtlasParseError) {
          setError(`${e.message}${e.hint ? ` ${e.hint}` : ""}`);
          return;
        }
        setError("Ton classeur n'a pas pu être lu. Vérifie qu'il s'agit d'un .xlsx valide, enregistré depuis Excel.");
        return;
      }

      const { evaluateAtlasCertification } = await import("../lib/atlasGrader");
      const d = timer.finish();
      // La VITESSE se note sur le temps horloge : une longue pause ne l'efface pas.
      const result = gradeAtlas(parsed, {
        durationSeconds: Math.max(1, d.wallDurationSeconds), targetMinutes: TARGET_MINUTES,
      });
      const cert = evaluateAtlasCertification(result, { assisted: atlasSolutionViewed });

      store.logAtlasEvent(atlasAttempts.length === 0 ? "atlas_submitted" : "atlas_resubmitted");
      store.recordAtlasAttempt({
        caseId: "project_atlas_v1",
        caseVersion: parsed.caseVersion ?? undefined,
        graderVersion: "1.1",
        score: result.total,
        accuracyScore: result.accuracy, integrityScore: result.integrity,
        completionScore: result.completion, qcScore: result.qc, speedScore: result.speed,
        rating: result.rating,
        certifiable: result.certifiable,
        certificationEligible: cert.eligible,
        certificationBlockers: cert.blockers,
        durationSeconds: Math.max(1, d.wallDurationSeconds),
        wallDurationSeconds: d.wallDurationSeconds,
        activeDurationSeconds: d.activeDurationSeconds,
        solutionViewed: atlasSolutionViewed,
        comments: result.comments,
        // La revue complète est persistée pour pouvoir être rouverte.
        issues: result.issues.map((i) => ({
          area: i.area, title: i.title, detail: i.detail,
          userValue: i.userValue, expectedHint: i.expectedHint,
          severity: i.severity, tag: i.tag,
        })),
        filename: file.name,
      });

      // Les concepts réellement ratés alimentent le Mistake Book — sans le noyer.
      const seen = new Set<string>();
      for (const i of result.issues.filter((x) => x.severity !== "minor")) {
        if (seen.has(i.tag)) continue;
        seen.add(i.tag);
        store.logMistake({
          qid: `atlas-${i.tag.replace(/\s+/g, "-").toLowerCase()}`,
          source: "other", topic: "atlas",
          prompt: `Project Atlas — ${i.title}`,
          userAnswer: i.userValue ?? "—",
          correctAnswer: i.expectedHint ?? "voir la revue de l'Associate",
          explanation: i.detail,
        });
      }
      // La complétion OFFICIELLE exige une tentative non assistée et certifiable.
      if (cert.eligible) store.logAtlasEvent("atlas_completed");

      setScore(result);
      setOpenedAttempt(null);
      setLastDuration(d.wallDurationSeconds);
      setPhase("review");
      window.scrollTo(0, 0);
    } finally {
      setBusy(false);
    }
  };

  const revealSolution = () => {
    store.markAtlasSolutionViewed();
    setConfirmSolution(false);
    download("Project_Atlas_Model_Solution.xlsx");
  };

  // ─── En-tête commun ───────────────────────────────────────────────────────
  const header = (
    <>
      <PageTitle emoji="📗" title="Project Atlas"
        sub="Ton premier vrai livrable d'analyste : un modèle Excel à compléter, à débugger et à faire valider." />
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <Tag color="accent">Sell-side</Tag>
        <Tag color="muted">Consommation</Tag>
        <Tag color="muted">Europe</Tag>
        <Tag color="gold">{TARGET_MINUTES} min</Tag>
        <Tag color={status === "Associate-ready" ? "green" : status === "Non commencé" ? "muted" : "accent"}>{status}</Tag>
        {atlasSolutionViewed && <Tag color="gold">Solution consultée</Tag>}
      </div>
      <Card className="mb-5 !p-3 border-gold/40 md:hidden">
        <p className="text-xs">📱 Les livrables Excel se traitent sur ordinateur. Cette page reste lisible sur mobile, mais tu auras besoin d'Excel pour faire l'exercice.</p>
      </Card>
    </>
  );

  // ─── Revue ────────────────────────────────────────────────────────────────
  if (phase === "review") {
    const shown = score;
    return (
      <div>
        {header}
        {atlasAttempts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            <Stat label="Meilleur score officiel" value={best ? `${best.score}` : "—"} sub={best ? "tentative libre" : "aucune tentative libre"} />
            <Stat label="Dernier score" value={lastAttempt ? `${lastAttempt.score}` : "—"} />
            <Stat label="Tentatives" value={atlasAttempts.length} />
            <Stat label="Statut" value={status} />
          </div>
        )}

        {lastAttempt?.assisted && (
          <Card className="mb-5 border-gold/40 !p-4">
            <p className="text-sm">
              <b>Exercice assisté.</b> Le corrigé a été consulté : cette tentative reçoit un score et un
              retour complet, mais elle ne compte pas pour ton statut officiel ni pour ta compétence
              Exécution. Ton meilleur score libre reste {best ? `${best.score}/100` : "à établir"}.
            </p>
          </Card>
        )}

        {openedAttempt ? (
          <>
            <div className="mb-3 flex items-center justify-between gap-3 flex-wrap">
              <div className="text-xs text-muted">Revue archivée d'une tentative précédente</div>
              <Btn kind="ghost" onClick={() => setOpenedAttempt(null)}>Fermer</Btn>
            </div>
            <AtlasStoredReview attempt={openedAttempt} />
          </>
        ) : shown ? (
          <AtlasReview score={shown} attemptNumber={atlasAttempts.length} durationSeconds={lastDuration}
            onRetry={() => { setScore(null); setOpenedAttempt(null); timer.restart(); setPhase("working"); window.scrollTo(0, 0); }} />
        ) : lastAttempt ? (
          // Après un rechargement, la dernière revue est reconstruite depuis le store.
          <AtlasStoredReview attempt={lastAttempt} />
        ) : null}

        {!openedAttempt && !shown && lastAttempt && (
          <div className="mt-4">
            <Btn onClick={() => { timer.restart(); setPhase("working"); window.scrollTo(0, 0); }}>Corriger et renvoyer 🔁</Btn>
          </div>
        )}

        <div className="mt-5">
          <AtlasAttemptHistory attempts={atlasAttempts} openedId={openedAttempt?.attemptId ?? null}
            onOpen={(a) => { setOpenedAttempt(a); setScore(null); window.scrollTo(0, 0); }} />
        </div>

        <Card className="mt-5 !p-4">
          <div className="font-bold text-sm mb-1">Corrigé</div>
          {atlasSolutionViewed ? (
            <>
              <p className="text-xs text-muted mb-3">
                Tu as consulté le corrigé. Les tentatives suivantes restent notées mais sont marquées « assistée »
                et ne comptent pas comme meilleur score libre.
              </p>
              <Btn kind="ghost" onClick={() => download("Project_Atlas_Model_Solution.xlsx")}>Retélécharger le corrigé</Btn>
            </>
          ) : !confirmSolution ? (
            <>
              <p className="text-xs text-muted mb-3">
                Essaie de débugger toi-même d'abord : c'est exactement le travail d'un analyste.
              </p>
              <Btn kind="ghost" onClick={() => setConfirmSolution(true)}>Voir le corrigé</Btn>
            </>
          ) : (
            <div className="rounded-xl border border-gold/40 bg-gold/10 px-4 py-3">
              <p className="text-sm mb-3">
                Consulter le corrigé marquera <b>toutes tes tentatives suivantes comme assistées</b>. Ton meilleur
                score libre actuel reste conservé. Continuer ?
              </p>
              <div className="flex gap-2">
                <Btn kind="gold" onClick={revealSolution}>Oui, afficher le corrigé</Btn>
                <Btn kind="ghost" onClick={() => setConfirmSolution(false)}>Annuler</Btn>
              </div>
            </div>
          )}
        </Card>
      </div>
    );
  }

  // ─── En cours ─────────────────────────────────────────────────────────────
  if (phase === "working") {
    return (
      <div>
        {header}
        <div className="sticky top-2 z-20 mb-5 bg-surface border border-border rounded-xl px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
          <AtlasTimer elapsed={timer.elapsed} wall={timer.wall} paused={timer.paused}
            onTogglePause={() => timer.setPaused(!timer.paused)} targetMinutes={TARGET_MINUTES} />
          <Btn kind="ghost" onClick={() => download("Project_Atlas_Model_Starter.xlsx")}>Retélécharger le modèle</Btn>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          <Card>
            <div className="font-bold mb-3">Ce qu'on attend de toi</div>
            <ol className="space-y-2">
              {TASKS.map((t, i) => (
                <li key={t} className="flex gap-3 text-sm">
                  <span className="text-accent font-mono shrink-0 font-bold">{i + 1}.</span>
                  <span className="leading-relaxed">{t}</span>
                </li>
              ))}
            </ol>
            <p className="text-xs text-muted mt-4 pt-3 border-t border-border leading-relaxed">
              💡 Utilise des <b>formules</b>, pas des valeurs saisies : une sortie juste mais tapée en dur ne
              reçoit qu'un crédit partiel. Enregistre depuis Excel avant d'envoyer, pour que les formules
              soient recalculées.
            </p>
          </Card>

          <AtlasUploader onSubmit={submit} busy={busy} error={error} />
        </div>
      </div>
    );
  }

  // ─── Brief ────────────────────────────────────────────────────────────────
  return (
    <div>
      {header}
      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-5">
        <AtlasBrief />
        <div className="space-y-4">
          <Card>
            <div className="font-bold mb-1">Pièces jointes</div>
            <p className="text-xs text-muted mb-3">Deux fichiers : le brief de la mission et le modèle à compléter.</p>
            <div className="space-y-2">
              <button onClick={() => download("Project_Atlas_Brief.html")}
                className="w-full flex items-center gap-3 rounded-xl border border-border bg-surface2 px-4 py-3 hover:border-accent/50 transition-colors text-left">
                <span className="text-xl">📄</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">Project Atlas — Brief</span>
                  <span className="block text-[11px] text-muted">Contexte du deal · imprimable en PDF</span>
                </span>
                <span className="text-accent text-xs font-bold shrink-0">Ouvrir ↓</span>
              </button>
              <button onClick={() => download("Project_Atlas_Model_Starter.xlsx")}
                className="w-full flex items-center gap-3 rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 hover:border-accent transition-colors text-left">
                <span className="text-xl">📗</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">Project_Atlas_Model_Starter.xlsx</span>
                  <span className="block text-[11px] text-muted">Le modèle à compléter dans Excel</span>
                </span>
                <span className="text-accent text-xs font-bold shrink-0">Télécharger ↓</span>
              </button>
            </div>
          </Card>

          <Card>
            <div className="font-bold mb-2">Le déroulé</div>
            <ol className="space-y-1.5 text-sm text-muted">
              <li>1. Tu télécharges le modèle</li>
              <li>2. Tu le complètes dans Excel</li>
              <li>3. Tu l'enregistres et tu le déposes ici</li>
              <li>4. Tu reçois la revue de l'Associate</li>
              <li>5. Tu corriges et tu renvoies</li>
            </ol>
            <div className="mt-4">
              <Btn onClick={start}>Démarrer la mission →</Btn>
            </div>
            <p className="text-[11px] text-muted mt-2">
              Le chronomètre démarre, mais tu peux le mettre en pause : tu t'entraînes, tu n'es pas en salle d'examen.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
