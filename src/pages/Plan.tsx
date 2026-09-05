import { Link } from "react-router-dom";
import { PLAN, MODULES } from "../data/curriculum";
import { useProgress, daysUntil } from "../store/progress";
import { Card, PageTitle, Tag, Progress } from "../components/ui";

const DEADLINE = new Date(new Date().getFullYear(), 7, 31).toISOString();

export default function Plan() {
  const { completedLessons, bossResults } = useProgress();
  const days = daysUntil(DEADLINE);
  const currentWeek = Math.min(8, Math.max(1, 9 - Math.ceil(days / 7)));

  return (
    <div>
      <PageTitle emoji="🗓️" title="Plan intensif — 8 semaines" sub={`J-${days} avant fin août. Tu es (théoriquement) en semaine ${currentWeek}. Routine quotidienne : Daily Drill + leçon/mission + un peu d'Arena. Le week-end : case + boss.`} />
      <div className="space-y-4">
        {PLAN.map((w) => {
          const mods = w.moduleIds.map((id) => MODULES.find((m) => m.id === id)).filter(Boolean);
          const lessonIds = mods.flatMap((m) => m!.lessonIds);
          const done = lessonIds.filter((l) => completedLessons.includes(l)).length;
          const bossIds = mods.map((m) => m!.bossId).filter(Boolean) as string[];
          const bossesPassed = bossIds.filter((b) => bossResults[b]?.passed).length;
          const isCurrent = w.week === currentWeek;
          return (
            <Card key={w.week} className={isCurrent ? "border-accent" : w.week < currentWeek ? "opacity-80" : ""}>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <Tag color={isCurrent ? "accent" : "muted"}>Semaine {w.week}</Tag>
                {isCurrent && <Tag color="gold">📍 Tu es ici</Tag>}
                {bossIds.length > 0 && <Tag color={bossesPassed === bossIds.length ? "green" : "muted"}>Boss : {bossesPassed}/{bossIds.length}</Tag>}
              </div>
              <div className="font-bold">{w.title}</div>
              <p className="text-sm text-muted mt-0.5">{w.goal}</p>
              {lessonIds.length > 0 && (
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex-1 max-w-48"><Progress value={(done / lessonIds.length) * 100} h={5} /></div>
                  <span className="text-xs text-muted font-mono">{done}/{lessonIds.length} leçons</span>
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-bold text-muted mb-1.5">Routine quotidienne</div>
                  <ul className="text-sm space-y-1">{w.dailyRoutine.map((r, i) => <li key={i} className="text-ink/85">• {r}</li>)}</ul>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-bold text-muted mb-1.5">Week-end</div>
                  <ul className="text-sm space-y-1">{w.weekend.map((r, i) => <li key={i} className="text-ink/85">• {r}</li>)}</ul>
                </div>
              </div>
              <div className="flex gap-2 mt-3 flex-wrap">
                {mods.map((m) => <Link key={m!.id} to={`/path/${m!.id}`}><Tag color="purple">{m!.emoji} {m!.title}</Tag></Link>)}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
