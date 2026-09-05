import { Link } from "react-router-dom";
import { useProgress, levelFor, LEVELS, readinessScore } from "../store/progress";
import { Card, PageTitle, Stat, Progress, Tag, Btn } from "../components/ui";
import { MODULES, BOSSES, LESSONS } from "../data/curriculum";
import { MISSIONS } from "../data/missions";
import { ALL_CASES } from "../data/cases";
import { ARENA_SESSIONS } from "../data/arena";

export default function Profile() {
  const s = useProgress();
  const lvl = levelFor(s.xp);
  const ready = readinessScore(s);

  const rows = [
    { label: "Micro-leçons", done: s.completedLessons.length, total: LESSONS.length },
    { label: "Missions Analyst Desk", done: Object.keys(s.completedMissions).length, total: MISSIONS.length },
    { label: "Case studies Deal Room", done: Object.keys(s.completedCases).length, total: ALL_CASES.length },
    { label: "Sessions Interview Arena", done: Object.keys(s.arenaResults).length, total: ARENA_SESSIONS.length },
    { label: "Boss fights vaincus", done: Object.values(s.bossResults).filter((b) => b.passed).length, total: BOSSES.length },
    { label: "Modules complétés", done: MODULES.filter((m) => m.lessonIds.length > 0 && m.lessonIds.every((l) => s.completedLessons.includes(l))).length, total: MODULES.filter((m) => m.lessonIds.length > 0).length },
  ];

  return (
    <div>
      <PageTitle emoji="👤" title="Profil & Progression" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Stat label="Niveau" value={`${lvl.index}. ${lvl.name}`} sub={lvl.next ? `${s.xp}/${lvl.next} XP` : "Niveau max !"} />
        <Stat label="Readiness" value={`${ready}%`} accent={ready >= 75 ? "var(--color-green)" : "var(--color-gold)"} />
        <Stat label="Streak actuel" value={`🔥 ${s.streak}`} sub={`Record : ${s.bestStreak}`} />
        <Stat label="Drills complétés" value={s.drillHistory.length} />
      </div>

      <Card className="mb-6">
        <div className="font-bold mb-3">Parcours de niveaux</div>
        <div className="space-y-2">
          {LEVELS.map((l, i) => (
            <div key={i} className={`flex items-center gap-3 text-sm ${s.xp >= l.xp ? "" : "opacity-40"}`}>
              <span className="w-6 text-center">{s.xp >= l.xp ? "✅" : "🔒"}</span>
              <span className="font-semibold w-40">{l.name}</span>
              <span className="text-muted font-mono text-xs">{l.xp} XP</span>
              {lvl.name === l.name && <Tag color="accent">Actuel</Tag>}
            </div>
          ))}
        </div>
      </Card>

      <Card className="mb-6">
        <div className="font-bold mb-4">Avancement global</div>
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.label}>
              <div className="flex justify-between text-sm mb-1"><span>{r.label}</span><span className="font-mono text-muted">{r.done}/{r.total}</span></div>
              <Progress value={(r.done / Math.max(1, r.total)) * 100} h={6} color={r.done === r.total ? "var(--color-green)" : "var(--color-accent)"} />
            </div>
          ))}
        </div>
      </Card>

      <Card className="mb-6">
        <div className="font-bold mb-3">🏅 Badges ({s.badges.length})</div>
        {s.badges.length === 0 ? <p className="text-sm text-muted">Aucun badge — les Boss Fights t'attendent.</p> :
          <div className="flex flex-wrap gap-2">{s.badges.map((b) => <Tag key={b} color="gold">🏅 {b}</Tag>)}</div>}
      </Card>

      <Card>
        <div className="font-bold mb-2">⚙️ Coach IA & données</div>
        <p className="text-sm text-muted mb-3">La clé API, le choix du modèle et la réinitialisation ont déménagé dans l'onglet Paramètres.</p>
        <Link to="/settings"><Btn kind="ghost">Ouvrir les Paramètres →</Btn></Link>
      </Card>
    </div>
  );
}
