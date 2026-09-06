import { Card, Btn, Tag, ScoreRing, Progress } from "../ui";
import type { AtlasScore, AtlasIssue } from "../../lib/atlasGrader";
import { normalizeAtlasAttempt, type AtlasAttempt } from "../../store/progress";
import { fmtDuration } from "../../lib/atlasTiming";

const SEVERITY: Record<AtlasIssue["severity"], { label: string; color: string }> = {
  critical: { label: "Bloquant", color: "red" },
  major: { label: "Important", color: "gold" },
  minor: { label: "Mineur", color: "muted" },
};

function Dimension({ label, value, max, hint }: { label: string; value: number; max: number; hint: string }) {
  const pct = (value / max) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-xs font-semibold">{label}</span>
        <span className="text-xs font-mono text-muted">{value}/{max}</span>
      </div>
      <Progress value={pct} color={pct >= 80 ? "var(--color-green)" : pct >= 50 ? "var(--color-gold)" : "var(--color-red)"} h={6} />
      <div className="text-[10px] text-muted mt-0.5">{hint}</div>
    </div>
  );
}

export function AtlasScoreBreakdown({ score }: { score: AtlasScore }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <Dimension label="Précision" value={score.accuracy} max={45} hint={`${score.correctCells}/${score.checkedCells} sorties justes`} />
      <Dimension label="Intégrité des formules" value={score.integrity} max={20} hint="cellules liées vs saisies en dur" />
      <Dimension label="Complétion" value={score.completion} max={15} hint="sections effectivement remplies" />
      <Dimension label="Contrôle qualité" value={score.qc} max={10} hint="checks du modèle et erreurs Excel" />
      <Dimension label="Vitesse" value={score.speed} max={10} hint="temps passé sur le livrable" />
    </div>
  );
}

export function AtlasIssueList({ issues }: { issues: AtlasIssue[] }) {
  if (issues.length === 0) {
    return (
      <Card className="border-green/40">
        <div className="text-sm font-semibold text-green">✓ Aucun point bloquant relevé.</div>
        <p className="text-xs text-muted mt-1">Les sorties tombent dans les fourchettes attendues et le modèle est lié.</p>
      </Card>
    );
  }
  return (
    <div className="space-y-2">
      {issues.map((i, n) => (
        <Card key={`${i.title}-${n}`} className="!p-4">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Tag color={SEVERITY[i.severity].color}>{SEVERITY[i.severity].label}</Tag>
            <Tag color="muted">{i.area}</Tag>
          </div>
          <div className="font-semibold text-sm">{i.title}</div>
          <p className="text-xs text-muted mt-1 leading-relaxed">{i.detail}</p>
          {(i.userValue || i.expectedHint) && (
            <div className="flex gap-4 mt-2 text-xs">
              {i.userValue && <span>Ta valeur : <b className="font-mono">{i.userValue}</b></span>}
              {i.expectedHint && <span className="text-muted">Attendu : {i.expectedHint}</span>}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

export function AtlasAttemptHistory({ attempts, onOpen, openedId }: {
  attempts: AtlasAttempt[]; onOpen?: (a: AtlasAttempt) => void; openedId?: string | null;
}) {
  if (attempts.length === 0) return null;
  const cumulative = attempts.reduce((s, a) => s + (a.wallDurationSeconds ?? a.durationSeconds), 0);
  return (
    <Card>
      <div className="flex items-baseline justify-between mb-3">
        <div className="font-bold text-sm">Historique des tentatives</div>
        <div className="text-xs text-muted">Temps cumulé : {fmtDuration(cumulative)}</div>
      </div>
      <div className="space-y-1">
        {attempts.map((a, i) => {
          const prev = i > 0 ? attempts[i - 1].score : null;
          const delta = prev === null ? null : a.score - prev;
          const dur = a.wallDurationSeconds ?? a.durationSeconds;
          const open = openedId === a.attemptId;
          return (
            <button key={a.attemptId} onClick={() => onOpen?.(a)} disabled={!onOpen}
              className={`w-full flex items-center gap-3 text-xs py-2 px-2 -mx-2 rounded-lg border-b border-border last:border-0 text-left transition-colors ${
                open ? "bg-accent/10" : onOpen ? "hover:bg-surface2" : ""}`}>
              <span className="w-10 text-muted font-mono shrink-0">#{i + 1}</span>
              <span className="font-bold w-14 shrink-0">{a.score}/100</span>
              {delta !== null && (
                <span className={`w-8 shrink-0 ${delta > 0 ? "text-green font-semibold" : delta < 0 ? "text-red" : "text-muted"}`}>
                  {delta > 0 ? `+${delta}` : delta === 0 ? "=" : delta}
                </span>
              )}
              <span className="text-muted shrink-0">{fmtDuration(dur)}</span>
              {a.assisted && <Tag color="gold">Assistée</Tag>}
              {a.certificationEligible && <Tag color="green">Certifiée</Tag>}
              <span className="text-muted ml-auto shrink-0">
                {onOpen ? (open ? "affichée" : "voir la revue →") : new Date(a.timestamp).toLocaleDateString("fr-FR")}
              </span>
            </button>
          );
        })}
      </div>
      {onOpen && <p className="text-[11px] text-muted mt-2">Clique sur une tentative pour rouvrir sa revue complète.</p>}
    </Card>
  );
}

/** Revue reconstruite depuis une tentative persistée — survit à un rechargement. */
export function AtlasStoredReview({ attempt }: { attempt: AtlasAttempt }) {
  const a = normalizeAtlasAttempt(attempt);
  const dur = a.wallDurationSeconds ?? a.durationSeconds;
  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <ScoreRing score={a.score} size={120} />
          <div className="flex-1 text-center md:text-left">
            <div className="text-[11px] uppercase tracking-wider text-muted font-bold">Revue archivée</div>
            <div className="text-2xl font-bold mt-1">{a.rating}</div>
            <div className="text-sm text-muted mt-1">
              {fmtDuration(dur)} · {new Date(a.timestamp).toLocaleString("fr-FR")}
            </div>
            <div className="flex gap-2 mt-2 flex-wrap justify-center md:justify-start">
              {a.assisted && <Tag color="gold">Exercice assisté — hors statut officiel</Tag>}
              {a.certificationEligible && <Tag color="green">Certifiée</Tag>}
            </div>
          </div>
        </div>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Dimension label="Précision" value={a.accuracyScore} max={45} hint="valeurs justes" />
          <Dimension label="Intégrité des formules" value={a.integrityScore} max={20} hint="cellules liées" />
          <Dimension label="Complétion" value={a.completionScore} max={15} hint="sections remplies" />
          <Dimension label="Contrôle qualité" value={a.qcScore} max={10} hint="contrôles recalculés" />
          <Dimension label="Vitesse" value={a.speedScore} max={10} hint="temps horloge" />
        </div>
      </Card>

      {a.comments.length > 0 && (
        <Card className="!p-0 overflow-hidden">
          <div className="bg-surface2 px-5 py-2.5 border-b border-border flex items-center gap-2">
            <Tag color="purple">Associate</Tag><span className="text-sm font-semibold">Emma Roberts</span>
          </div>
          <div className="px-5 py-4 space-y-2.5">
            {a.comments.map((c, i) => <p key={i} className="text-sm leading-relaxed">— {c}</p>)}
          </div>
        </Card>
      )}

      {a.certificationBlockers && a.certificationBlockers.length > 0 && (
        <Card className="border-gold/40 !p-4">
          <div className="font-bold text-sm mb-2">Ce qui bloque la certification</div>
          <ul className="text-xs text-muted space-y-1">
            {a.certificationBlockers.map((b) => <li key={b}>• {b}</li>)}
          </ul>
        </Card>
      )}

      <div>
        <div className="text-xs font-bold text-muted uppercase tracking-wide mb-2">
          Points à reprendre {a.issueObjects.length > 0 && `(${a.issueObjects.length})`}
        </div>
        <AtlasIssueList issues={a.issueObjects as never} />
      </div>
    </div>
  );
}

export function AtlasReview({ score, attemptNumber, durationSeconds, onRetry }: {
  score: AtlasScore; attemptNumber: number; durationSeconds: number; onRetry: () => void;
}) {
  const mins = Math.floor(durationSeconds / 60), secs = Math.floor(durationSeconds % 60);
  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <ScoreRing score={score.total} size={120} />
          <div className="flex-1 text-center md:text-left">
            <div className="text-[11px] uppercase tracking-wider text-muted font-bold">Project Atlas — revue de l'Associate</div>
            <div className="text-2xl font-bold mt-1">{score.rating}</div>
            <div className="text-sm text-muted mt-1">
              Tentative n°{attemptNumber} · {mins} min {String(secs).padStart(2, "0")} s
            </div>
          </div>
        </div>
        <div className="mt-6"><AtlasScoreBreakdown score={score} /></div>
      </Card>

      <div>
        <div className="text-xs font-bold text-muted uppercase tracking-wide mb-2">Commentaires</div>
        <Card className="!p-0 overflow-hidden">
          <div className="bg-surface2 px-5 py-2.5 border-b border-border flex items-center gap-2">
            <Tag color="purple">Associate</Tag><span className="text-sm font-semibold">Emma Roberts</span>
          </div>
          <div className="px-5 py-4 space-y-2.5">
            {score.comments.map((c, i) => (
              <p key={i} className="text-sm leading-relaxed">— {c}</p>
            ))}
          </div>
        </Card>
      </div>

      <div>
        <div className="text-xs font-bold text-muted uppercase tracking-wide mb-2">
          Points à reprendre {score.issues.length > 0 && `(${score.issues.length})`}
        </div>
        <AtlasIssueList issues={score.issues} />
      </div>

      <div className="flex gap-2 flex-wrap">
        <Btn onClick={onRetry}>Corriger et renvoyer 🔁</Btn>
      </div>
    </div>
  );
}
