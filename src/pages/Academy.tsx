import { Link } from "react-router-dom";
import { LEVELS_META, chaptersOfLevel, levelUnlocked, levelMastery, nextChapter } from "../data/academy";
import { useProgress } from "../store/progress";
import { Card, PageTitle, Tag, Progress, Btn } from "../components/ui";

export default function Academy() {
  const { chapters } = useProgress();
  const next = nextChapter(chapters);

  return (
    <div>
      <PageTitle emoji="🎓" title="Académie — De zéro au stage M&A" sub="La formation complète : 9 niveaux, 30 chapitres, du premier concept de finance jusqu'à la simulation de stage. Chaque chapitre : explication simple → approfondie → schémas → exemples → quiz → exercices → mini-cas." />

      {next && (
        <Link to={`/academy/${next.id}`}>
          <Card className="mb-6 border-2 border-accent !p-4" onClick={() => {}}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{next.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] uppercase tracking-wider font-bold text-accent">Continuer la formation</div>
                <div className="font-bold text-sm truncate">{next.title}</div>
                <div className="text-xs text-muted">Niveau {next.level} · {next.minutes} min · +{next.xp} XP</div>
              </div>
              <span className="text-accent text-xl">▶</span>
            </div>
          </Card>
        </Link>
      )}

      <div className="space-y-5">
        {LEVELS_META.map((meta) => {
          const chs = chaptersOfLevel(meta.level);
          const unlocked = levelUnlocked(meta.level, chapters);
          const mastery = levelMastery(meta.level, chapters);
          return (
            <div key={meta.level} className={unlocked ? "" : "opacity-55"}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${mastery.completed === mastery.total && mastery.total > 0 ? "bg-green/20 text-green" : unlocked ? "bg-accent/20 text-accent" : "bg-surface2 text-muted"}`}>
                  {unlocked ? meta.level : "🔒"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold">{meta.emoji} Niveau {meta.level} — {meta.title}</div>
                  <div className="text-xs text-muted">{meta.tagline}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-mono text-muted">{mastery.completed}/{mastery.total}</div>
                  <div className="w-20"><Progress value={mastery.pct} h={5} color={mastery.pct >= 75 ? "var(--color-green)" : "var(--color-accent)"} /></div>
                </div>
              </div>

              {!unlocked ? (
                <Card className="!p-3 ml-12">
                  <p className="text-xs text-muted">🔒 Termine au moins 70% du niveau {meta.level - 1} pour débloquer.</p>
                </Card>
              ) : (
                <div className="grid md:grid-cols-3 gap-2 ml-0 md:ml-12">
                  {chs.map((c) => {
                    const score = chapters[c.id];
                    return (
                      <Link key={c.id} to={`/academy/${c.id}`}>
                        <Card className="!p-3.5 h-full" onClick={() => {}}>
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{c.emoji}</span>
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-[13px] leading-tight truncate">{c.title}</div>
                              <div className="text-[11px] text-muted">{c.minutes} min · +{c.xp} XP</div>
                            </div>
                            {score !== undefined && <Tag color={score >= 75 ? "green" : "gold"}>{score}%</Tag>}
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Card className="mt-8 border-accent2/40">
        <div className="font-bold text-sm mb-1">🧭 Et après chaque niveau ?</div>
        <p className="text-sm text-muted">Consolide avec les autres modes : <b>Daily Drill</b> (mémorisation), <b>Boss Fights</b> (validation), <b>Analyst Desk</b> (pratique), <b>Deal Room</b> (cas réels), <b>Arena</b> (entretiens). L'Académie t'apprend ; le reste te transforme.</p>
        <div className="mt-3"><Link to="/resources"><Btn kind="ghost">📚 Ouvrir les Ressources (formules, cheat sheets, Excel) →</Btn></Link></div>
      </Card>
    </div>
  );
}
