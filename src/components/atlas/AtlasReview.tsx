import { Card, Btn, Tag, ScoreRing, Progress } from "../ui";
import type { AtlasScore, AtlasIssue } from "../../lib/atlasGrader";
import type { AtlasAttempt } from "../../store/progress";

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

export function AtlasAttemptHistory({ attempts }: { attempts: AtlasAttempt[] }) {
  if (attempts.length === 0) return null;
  return (
    <Card>
      <div className="font-bold text-sm mb-3">Historique des tentatives</div>
      <div className="space-y-1.5">
        {attempts.map((a, i) => {
          const prev = i > 0 ? attempts[i - 1].score : null;
          const delta = prev === null ? null : a.score - prev;
          const mins = Math.round(a.durationSeconds / 60);
          return (
            <div key={a.attemptId} className="flex items-center gap-3 text-xs py-1.5 border-b border-border last:border-0">
              <span className="w-16 text-muted font-mono">#{i + 1}</span>
              <span className="font-bold w-14">{a.score}/100</span>
              {delta !== null && (
                <span className={delta > 0 ? "text-green font-semibold" : delta < 0 ? "text-red" : "text-muted"}>
                  {delta > 0 ? `+${delta}` : delta === 0 ? "=" : delta}
                </span>
              )}
              <span className="text-muted">{mins} min</span>
              {a.assisted && <Tag color="gold">Assistée</Tag>}
              <span className="text-muted ml-auto">{new Date(a.timestamp).toLocaleDateString("fr-FR")}</span>
            </div>
          );
        })}
      </div>
    </Card>
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
