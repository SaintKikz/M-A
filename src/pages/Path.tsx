import { Link } from "react-router-dom";
import { MODULES, BOSSES } from "../data/curriculum";
import { nextStep } from "../lib/coach";
import { useProgress } from "../store/progress";
import { Card, PageTitle, Tag, Progress } from "../components/ui";

export default function Path() {
  const s = useProgress();
  const { completedLessons, bossResults } = s;
  const step = nextStep(s);

  return (
    <div>
      <PageTitle emoji="🗺️" title="Road to M&A Analyst" sub="La carte du jeu. Chaque module se termine par un Boss Fight — 75% minimum pour le valider. Pratique d'abord, théorie ensuite : c'est la règle." />

      <Link to={step.to}>
        <Card className="mb-5 border-2 border-accent !p-4" onClick={() => {}}>
          <div className="flex items-center gap-3">
            <span className="text-xl">▶</span>
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-wider font-bold text-accent">Prochaine étape</div>
              <div className="font-bold text-sm truncate">{step.label}</div>
              <div className="text-xs text-muted">{step.sub}</div>
            </div>
          </div>
        </Card>
      </Link>
      <div className="space-y-3">
        {MODULES.map((m, i) => {
          const total = m.lessonIds.length;
          const done = m.lessonIds.filter((l) => completedLessons.includes(l)).length;
          const boss = m.bossId ? BOSSES.find((b) => b.id === m.bossId) : null;
          const bossState = m.bossId ? bossResults[m.bossId] : null;
          const pct = total > 0 ? (done / total) * 100 : 0;
          const hasContent = total > 0;
          return (
            <Link key={m.id} to={`/path/${m.id}`}>
              <Card className="mb-3 hover:border-accent/60 transition-colors" onClick={() => {}}>
                <div className="flex items-start gap-4">
                  <div className="text-3xl w-12 h-12 flex items-center justify-center bg-surface2 rounded-xl shrink-0">{m.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold">{i + 1}. {m.title}</span>
                      <Tag color="muted">Semaine {m.week}</Tag>
                      {bossState?.passed && <Tag color="gold">🏅 Boss vaincu</Tag>}
                    </div>
                    <p className="text-sm text-muted mt-1">{m.description}</p>
                    <div className="flex items-center gap-3 mt-2.5">
                      {hasContent ? (
                        <>
                          <div className="flex-1 max-w-56"><Progress value={pct} h={6} color={pct === 100 ? "var(--color-green)" : "var(--color-accent)"} /></div>
                          <span className="text-xs text-muted font-mono">{done}/{total} leçons</span>
                        </>
                      ) : (
                        <span className="text-xs text-muted">S'entraîne via missions, cases, Arena et Red Book Bank →</span>
                      )}
                      {boss && <Tag color={bossState?.passed ? "green" : "red"}>{boss.emoji} Boss</Tag>}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
